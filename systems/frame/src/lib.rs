//! A frame's rows as the passes read them: FrameRows (each row's values at the frame, a live scene's rows, a frame's
//! own look), the loaded edit, the clock, the frame's error, and the helpers every pass reads a row with (num, colour,
//! sources found and resolved, the cover fit); bevy_api.rs is what the passes share of Bevy's render API.

use std::collections::{BTreeMap, HashMap};
use std::path::{Path, PathBuf};

use bevy::prelude::*;
use raea_core_program::eval::{self, Tup};
use raea_core_program::ir::{Program, V};

pub mod bevy_api;
/// a camera row's order, clear and viewport among the cameras on its target
pub mod camera;
/// a GPU error as the frame's error (#66), Bevy's RenderErrorHandler in the engine
pub mod gpu;
/// layer keys (docs/review.feature R2)
pub mod layer;
/// the part under a point of the frame (docs/preview.feature PV1a)
pub mod pick;
/// the shadow maps' size when a scene doesn't give one (smaller where the GPU has little memory of its own)
pub mod shadow;
/// a free camera over the scene (docs/preview.feature PV1c)
pub mod view;
/// pipelined updates: the render world drawing the last frame while the main world runs this one
pub mod pipe;
// the edit's rows as entities, each column a component of its own, found by kind and id
pub mod store;
// the frame loop's own state (Stages, the frame tag, the overlay and output resources)
mod state;
pub use state::*;
/// a row's per-frame tables (a frame's look, the camera's post-processing), laid onto it frame by frame
pub mod tables;
/// the frames where another camera becomes the piece's (a cut between cameras, RR2)
pub mod shots;

/// A model row's entity (a glTF under it), whatever its loading stage.
#[derive(Component, Default)]
pub struct Model;

/// A model loaded, its scene spawned and its clip set up: what passes over a model's meshes wait for.
#[derive(Component)]
pub struct ModelReady;

/// The loaded edit: its program, its base as columns (gathered from the store once per load: row r is the store's
/// r-th row) and its media rows (for resolving sources).
#[derive(Resource, Clone)]
pub struct Edit {
    pub prog: Program,
    /// every frame, evaluated once per load from the base gathered out of the store (row r is the store's r-th row)
    pub timeline: std::sync::Arc<raea_core_program::timeline::Timeline>,
    pub media: Vec<Tup>,
}

/// The frame's values: the base after the keys, rules and transitions at the clock, by row; and each row's entity.
#[derive(Resource, Default)]
pub struct FrameRows {
    /// the frame's columns, set with `set_cols` (which forgets the rows `vals` made from the last frame's)
    pub cols: eval::Cols,
    pub ix: bevy::ecs::entity::EntityHashMap<usize>,
    /// a live scene's rows (Engine::set_rows): a game's 3D comes from its play's state each frame, not from a timeline,
    /// so each row's latest values are kept here (in the store's order), changed in place where a frame changes them,
    /// and lent to the systems as they are (no columns made, nothing copied per frame)
    pub live: Option<Vec<BTreeMap<String, V>>>,
    /// rows with per-frame tables (tables.rs: the camera's `frame_looks`, and `frame_sets` on any row), each as parsed
    pub looks: HashMap<usize, tables::Tables>,
    /// the edit's timeline the columns came from (which rows never change: `still`)
    pub timeline: Option<std::sync::Arc<raea_core_program::timeline::Timeline>>,
    /// each row's values this frame as `vals` makes them, made on its first ask: six of the 3D's systems read every
    /// row, and many_foxes' thousand foxes were each made six times a frame (FC1b)
    made: Vec<std::sync::OnceLock<BTreeMap<String, V>>>,
}

impl FrameRows {
    /// A load's rows, by entity, with no frame yet.
    pub fn new(ix: bevy::ecs::entity::EntityHashMap<usize>) -> FrameRows {
        FrameRows { ix, ..Default::default() }
    }

    /// This frame's columns.
    pub fn set_cols(&mut self, cols: eval::Cols) {
        self.made.clear();
        self.made.resize_with(cols.len(), Default::default);
        self.cols = cols;
    }

    /// Whether a row's values are the same on every frame of the edit, so a system applying them to its entity each
    /// frame can apply them once (a live scene's rows: never, since a play changes any of them). Nor a row with a table
    /// (tables.rs): its set is laid on by `vals`, not in the row its entity was made from, so a one-frame edit (a play's
    /// first rows) put its sky on only at the first frame drawn, after the warm-up, and opened 2 frames dark (RR1).
    pub fn still(&self, e: Entity) -> bool {
        self.live.is_none() && self.timeline.as_ref().zip(self.ix.get(&e)).is_some_and(|(t, r)| !self.looks.contains_key(r) && t.still(*r))
    }

    /// Whether any row may have column `c` this frame (a live scene's or a frame look's rows: always), so a system
    /// looking for a rare column (a glitch's) passes over a frame without it at once, not row by row (FC1b)
    pub fn may_have(&self, c: &str) -> bool {
        self.live.is_some() || !self.looks.is_empty() || self.cols.cols.contains_key(c)
    }

    /// Whether the only columns of a row any frame changes are among `cols` (and some do): a system that applied its
    /// other values once reads just those after (`placer`; automatic_instancing's 65 536 cubes move only in z, FC1b)
    pub fn moves_only(&self, e: Entity, cols: &[&str]) -> bool {
        let Some(r) = self.ix.get(&e) else { return false };
        let moving = |t: &raea_core_program::timeline::Timeline| { let m = t.moving(*r); !m.is_empty() && m.iter().all(|c| cols.contains(&c.as_str())) };
        self.live.is_none() && !self.looks.contains_key(r) && self.timeline.as_deref().is_some_and(moving)
    }

    /// A row's transform this frame read straight from the columns (transform_by), the 14 found once: for the rows only
    /// their placement moves (moves_only), where `vals` made all of 65 536 rows' values each frame.
    pub fn placer(&self) -> impl Fn(Entity) -> Option<Transform> + '_ {
        let cols = PLACE.map(|c| self.cols.cols.get(c).map(|a| &**a));
        move |e| {
            let r = *self.ix.get(&e)?;
            Some(transform_by(|i| cols[i]?.get(r).map(|v| v.num() as f32)))
        }
    }

    /// A row's value this frame by its place (`cols.id`'s): a live row's as a live frame set it, else the timeline's at the
    /// clock. A system following a row's keyed column reads it here: `cols` alone holds a live render's first frame.
    pub fn at(&self, r: usize, c: &str) -> Option<V> {
        match &self.live {
            Some(rows) => rows.get(r)?.get(c).cloned(),
            None => self.cols.get(r, c),
        }
    }

    /// One of a row's values this frame, copying only it (with its frame look laid on, as `vals` has it).
    pub fn get(&self, e: Entity, c: &str) -> Option<V> {
        let r = *self.ix.get(&e)?;
        if self.looks.contains_key(&r) {
            return self.vals(e)?.get(c).cloned();
        }
        match &self.live {
            Some(rows) => rows.get(r)?.get(c).cloned(),
            None => self.cols.get(r, c),
        }
    }

    /// A row's values this frame.
    pub fn vals(&self, e: Entity) -> Option<std::borrow::Cow<'_, BTreeMap<String, V>>> {
        let r = *self.ix.get(&e)?;
        match &self.live {
            // a live row as it is, unless it has per-frame tables: then a copy with this frame's sets laid on
            Some(rows) => {
                let row = rows.get(r)?;
                Some(match self.looks.get(&r) {
                    Some(t) => {
                        let mut v = row.clone();
                        tables::onto(&mut v, t);
                        std::borrow::Cow::Owned(v)
                    }
                    None => std::borrow::Cow::Borrowed(row),
                })
            }
            None => {
                let make = || {
                    let mut v = self.cols.tup(r).vals;
                    if let Some(t) = self.looks.get(&r) {
                        tables::onto(&mut v, t);
                    }
                    v
                };
                Some(match self.made.get(r) {
                    Some(m) => std::borrow::Cow::Borrowed(m.get_or_init(make)),
                    None => std::borrow::Cow::Owned(make()),
                })
            }
        }
    }

    /// The rows with per-frame tables (the timeline's at the clock, or a live scene's rows), each list parsed again only
    /// where it changed. True when a table came or went, a look changed, or a live row's set changed `structural`ly
    /// (its one set, raea-runtime-look as_table): a live engine warms its next frame up as at a cut (Engine::draw).
    pub fn parse_looks(&mut self) -> bool {
        // a row's sets are laid on as `vals` makes it
        self.made.iter_mut().for_each(|m| drop(m.take()));
        let mut found: HashMap<usize, [Option<String>; 2]> = HashMap::new();
        for (i, (list, _)) in tables::TABLES.iter().enumerate() {
            match &self.live {
                Some(rows) => {
                    for (r, v) in rows.iter().enumerate() {
                        if let Some(V::S(s)) = v.get(*list) {
                            found.entry(r).or_default()[i] = Some(s.clone());
                        }
                    }
                }
                None => {
                    let Some(col) = self.cols.cols.get(*list) else { continue };
                    for r in 0..self.cols.len() {
                        if let Some(V::S(s)) = col.get(r) {
                            found.entry(r).or_default()[i] = Some(s);
                        }
                    }
                }
            }
        }
        let mut old = std::mem::take(&mut self.looks);
        let mut changed = false;
        for (r, srcs) in found {
            let mut t = old.remove(&r).unwrap_or_default();
            for (i, src) in srcs.into_iter().enumerate() {
                t[i] = match src {
                    Some(s) if t[i].as_ref().is_some_and(|x| x.src == s) => t[i].take(),
                    Some(s) => {
                        let new = tables::Table::parse(&s);
                        changed |= i == 0 || t[i].as_ref().map_or(true, |o| tables::structural(o.sets.first(), new.sets.first()));
                        Some(new)
                    }
                    None => {
                        changed |= t[i].is_some();
                        None
                    }
                };
            }
            self.looks.insert(r, t);
        }
        changed || old.values().any(|t| t.iter().any(Option::is_some))
    }
}

#[derive(Resource, Default)]
pub struct Clock(pub i64);

#[derive(Resource, Default)]
pub struct Error(pub Option<String>);

/// A bare <Entity>: its Bevy components come from its rows, so the camera row's systems (sync_camera) leave it be.
#[derive(Component)]
pub struct BareEntity;

pub fn colour(v: Option<&V>, d: [f32; 4]) -> Color {
    let c = match v {
        // CSS's hex forms, #rgb and #rgba too (a holder's "#000" was the default clear)
        Some(V::S(s)) => Srgba::hex(s.trim()).map(|c| c.to_f32_array()).unwrap_or(d),
        _ => d,
    };
    Color::srgba(c[0], c[1], c[2], c[3])
}

/// A picture file Bevy reads itself (a .ktx2 cubemap or lightmap, with its own format and mips) decoded into a new
/// image (`what` names the part in the error): an environment map's, a skybox's or a lightmap's.
pub fn image_file(world: &mut World, what: &str, p: &str) -> Result<Handle<Image>, String> {
    let bytes = std::fs::read(p).map_err(|err| format!("{what}: {p}: {err}"))?;
    let ext = Path::new(p).extension().and_then(|x| x.to_str()).unwrap_or("ktx2");
    let img = Image::from_buffer(&bytes, bevy::image::ImageType::Extension(ext), bevy::image::CompressedImageFormats::NONE, false, bevy::image::ImageSampler::Default, bevy::asset::RenderAssetUsages::RENDER_WORLD)
        .map_err(|err| format!("{what}: {p}: {err}"))?;
    Ok(world.resource_mut::<Assets<Image>>().add(img))
}

/// A clip's or audio row's source: `media:<sha256>` names a row of the media table (content-addressed footage, music
/// and voice; the row holds the file's path and size), a staticFile path (/media/x) is found in the media folders as
/// every other source of it is (raea-core-scene media_path), anything else is a path. The size is checked on every
/// resolve (cheap); the hash was checked when the row was made (`raea media`).
pub fn resolve_src(rows: &[Tup], src: &str, dir: &Path) -> Result<PathBuf, String> {
    if src.starts_with("/media/") {
        return Ok(raea_core_scene::media_path(dir, src));
    }
    let Some(hash) = src.strip_prefix("media:") else { return Ok(find(dir, src)) };
    let m = rows.iter().find(|t| t.kind == "media" && t.id == hash).ok_or(format!("{src}: no such row in media"))?;
    // the portable decoders read the row's edit mezzanine when it has one (the platform's read the original)
    let portable = matches!(media_backend().as_str(), "soft" | "av1");
    let (pcol, bcol) = match (portable, m.vals.get("mezz")) {
        (true, Some(V::S(p))) if !p.is_empty() => ("mezz", "mezz_bytes"),
        _ => ("path", "bytes"),
    };
    // `src` reads as `path` (a row written by hand rather than by `media`)
    let path = match m.vals.get(pcol).or_else(|| m.vals.get("src")) {
        Some(V::S(p)) => find(dir, p),
        _ => return Err(format!("media {hash}: no path (INSERT INTO media (id, path) VALUES ('{hash}', 'takes/<take>/video.mov'))")),
    };
    let size = std::fs::metadata(&path).map_err(|e| format!("media {hash}: {}: {e}", path.display()))?.len();
    if let Some(b) = m.vals.get(bcol) {
        if b.num() as u64 != size {
            return Err(format!("media {hash}: {} has changed (size {size}, the row says {})", path.display(), b.num()));
        }
    }
    Ok(path)
}

/// A relative path from the edit's folder, or from a folder above it (a project's `takes/...` from `edits/x.rdb`);
/// the edit's folder when it's in none of them.
pub fn find(dir: &Path, p: &str) -> PathBuf {
    dir.ancestors().take(3).map(|d| d.join(p)).find(|f| f.exists()).unwrap_or_else(|| dir.join(p))
}

/// A clip's source rect for its box: the largest rect with the box's aspect, zoomed about the centre, then panned within
/// the slack (pan -1..1 on each axis; 0 centres). Returns its centre and size, in source pixels. The one cover rule every
/// renderer uses (the engine, gpuview, the sketch, previz); stills reframe a subject with the pan.
/// Generic over the float type so each renderer keeps its own arithmetic (the engine's UI clips are f32, the rest f64)
/// and every frame stays bit-identical.
pub fn cover<T: Real>(sw: T, sh: T, w: T, h: T, zoom: T, pan: (T, T)) -> (T, T, T, T) {
    let (cw, ch) = if sw / sh > w / h { (sh * w / h, sh) } else { (sw, sw * h / w) };
    let (cw, ch) = (cw / zoom, ch / zoom);
    (sw / T::TWO + pan.0 * (sw - cw) / T::TWO, sh / T::TWO + pan.1 * (sh - ch) / T::TWO, cw, ch)
}

/// f32 or f64, for `cover`.
pub trait Real: Copy + PartialOrd + std::ops::Add<Output = Self> + std::ops::Sub<Output = Self> + std::ops::Mul<Output = Self> + std::ops::Div<Output = Self> {
    const TWO: Self;
}

impl Real for f32 {
    const TWO: f32 = 2.0;
}

impl Real for f64 {
    const TWO: f64 = 2.0;
}

/// The media backend clips decode with: RAEA_MEDIA, else platform hardware where there is one, else portable software.
pub fn media_backend() -> String {
    std::env::var("RAEA_MEDIA").unwrap_or_else(|_| if cfg!(target_vendor = "apple") { "apple".into() } else { "soft".into() })
}

pub fn num(v: &BTreeMap<String, V>, k: &str, d: f32) -> f32 {
    v.get(k).map(|x| x.num() as f32).unwrap_or(d)
}

/// A number from a JSON spec (a row's JSON column: grass, volumes), else `d`.
pub fn json_f32(j: &serde_json::Value, k: &str, d: f32) -> f32 {
    j.get(k).and_then(serde_json::Value::as_f64).map_or(d, |x| x as f32)
}

pub fn flag(vals: &BTreeMap<String, V>, k: &str, d: bool) -> bool {
    vals.get(k).map(V::truthy).unwrap_or(d)
}

fn scale_by(n: &impl Fn(usize) -> Option<f32>) -> Vec3 {
    let s = n(10).unwrap_or(1.0);
    Vec3::new(n(11).unwrap_or(s), n(12).unwrap_or(s), n(13).unwrap_or(s))
}

/// A row's rotation: its quaternion (q_x q_y q_z q_w, what runtime/scene writes: docs/control.feature FC1d), or
/// rot_x rot_y rot_z (radians, YXZ) where a row was written that way
fn rot_by(n: &impl Fn(usize) -> Option<f32>) -> Quat {
    let g = |i, d| n(i).unwrap_or(d);
    if n(9).is_some() {
        return Quat::from_xyzw(g(6, 0.0), g(7, 0.0), g(8, 0.0), g(9, 1.0)).normalize();
    }
    Quat::from_euler(EulerRot::YXZ, g(4, 0.0), g(3, 0.0), g(5, 0.0))
}

/// The columns a row's transform reads (transform_of), in transform_by's order.
pub const PLACE: [&str; 14] = ["x", "y", "z", "rot_x", "rot_y", "rot_z", "q_x", "q_y", "q_z", "q_w", "scale", "scale_x", "scale_y", "scale_z"];

/// A mesh or model row's transform.
pub fn transform_of(vals: &BTreeMap<String, V>) -> Transform {
    transform_by(|i| at(vals, i))
}

/// PLACE[i] of a row's values, as a number.
fn at(vals: &BTreeMap<String, V>, i: usize) -> Option<f32> {
    vals.get(PLACE[i]).map(|x| x.num() as f32)
}

/// A transform from its PLACE columns by index (`n(i)` PLACE[i]'s value, when the row has it): transform_of's, and a
/// placed row's read straight from the frame's columns (FrameRows::placer).
pub fn transform_by(n: impl Fn(usize) -> Option<f32>) -> Transform {
    let g = |i, d| n(i).unwrap_or(d);
    Transform::from_xyz(g(0, 0.0), g(1, 0.0), g(2, 0.0)).with_rotation(rot_by(&n)).with_scale(scale_by(&n))
}

/// A row's render layers (`layers`: "0,2"), as Bevy's RenderLayers on its entity (a mesh, a light, the camera).
pub fn layers(world: &mut World, e: Entity, vals: &BTreeMap<String, V>) {
    if let Some(V::S(l)) = vals.get("layers") {
        let ls: Vec<usize> = l.split(',').filter_map(|x| x.trim().parse().ok()).collect();
        world.entity_mut(e).insert(bevy::camera::visibility::RenderLayers::from_layers(&ls));
    }
}

/// Bevy's SystemSet for Scene3dPlugin's systems, to order a plugin's own systems before or after them.
#[derive(SystemSet, Debug, Clone, PartialEq, Eq, Hash)]
pub struct Scene3dSystems;

/// Engine::new's frame in Update, in this order: the stage's start mark, the frame's rows (relational), the 3D they move
/// (scene3d_systems, also in Scene3dSystems), the clips, the page overlay, the frame's tag and the end mark. A module
/// orders its own systems by them, as `.after(FrameSystems::Rows).before(FrameSystems::Tag)`.
#[derive(SystemSet, Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum FrameSystems {
    Start,
    Rows,
    Scene3d,
    Clips,
    Overlay,
    Tag,
    End,
}

/// A camera a pass made (a look's model cells, the composite): not the scene's.
#[derive(Component)]
pub struct LookCam;

/// Every entity under `e`, depth first.
pub fn descendants(e: Entity, kids: &Query<&Children>) -> Vec<Entity> {
    let mut out = Vec::new();
    let mut stack = vec![e];
    while let Some(x) = stack.pop() {
        if let Ok(c) = kids.get(x) {
            for k in c.iter() {
                out.push(k);
                stack.push(k);
            }
        }
    }
    out
}

/// `s` with `from` replaced, which must appear exactly once.
pub fn replace_once(s: &str, from: &str, to: &str) -> String {
    assert_eq!(s.matches(from).count(), 1, "raea: expected `{from}` exactly once in a patched shader");
    s.replacen(from, to, 1)
}

/// Preview quality (RAEA_PREVIEW_QUALITY=1, from outside the process: a shell's preview, a measurement): smaller shadow
/// maps and environment filters.
pub fn preview() -> bool {
    std::env::var_os("RAEA_PREVIEW_QUALITY").is_some_and(|v| v != "0")
}

/// The clips' decoders, one per (source, slot): a slot per clip of the same source showing at once. Decoders answer
/// "the frame showing at t" by as-of lookup, so a frame doesn't depend on which frames were asked for before it.
#[cfg(feature = "native")]
pub struct Media {
    pub backend: Box<dyn raea_io_media::Backend>,
    pub decoders: HashMap<(String, usize), Box<dyn raea_io_media::VideoDecoder>>,
    pub dir: PathBuf,
}

/// A mesh's triangles as vertex indices: its index buffer three at a time, or its vertices in threes when it has none.
pub fn triangles(m: &Mesh, vertices: usize) -> Vec<[usize; 3]> {
    match m.indices() {
        Some(ix) => {
            let v: Vec<usize> = ix.iter().collect();
            v.chunks_exact(3).map(|c| [c[0], c[1], c[2]]).collect()
        }
        None => (0..vertices / 3).map(|i| [3 * i, 3 * i + 1, 3 * i + 2]).collect(),
    }
}

/// What a load spawned besides the rows (overlay, tag), despawned by the next load; the rows go through the store.
#[derive(Component)]
pub struct Mirror;
