//! <Instances> drawn (sdk/render 3d/instances.tsx, the rows' `inst` column, runtime/scene's instances.rs): one child
//! a copy, each sharing the mesh and material handles, which Bevy's automatic batching draws as one instanced call per
//! mesh. A mesh row's own Mesh3d moves onto its copies at spawn; a model's scene is copied once it's settled (its
//! surfaces on), then the scene it was copied from is despawned. The parent keeps its transform, visibility and (a
//! mesh's) material, so sync_meshes still moves, hides and recolours the whole set.

use super::*;
use bevy::camera::visibility::RenderLayers;
use bevy::light::{NotShadowCaster, NotShadowReceiver};
use bevy::mesh::skinning::SkinnedMesh;

/// A mesh or model entity drawn as instances: what sync_meshes moves in place of its Mesh3d.
#[derive(Component)]
pub struct Instanced;

/// A row's `inst`: 10 numbers a copy (position, rotation xyzw, scale).
pub fn placements(t: &Tup) -> Result<Option<Vec<Transform>>, String> {
    let Some(V::S(s)) = t.vals.get("inst") else { return Ok(None) };
    parsed(&t.id, s).map(Some)
}

fn parsed(id: &str, s: &str) -> Result<Vec<Transform>, String> {
    let mut n: Vec<f32> = vec![];
    for x in s.split_ascii_whitespace() {
        n.push(x.parse().map_err(|e| format!("{id}: inst: {x}: {e}"))?);
    }
    if n.len() % 10 != 0 {
        return Err(format!("{id}: inst is 10 numbers a copy, got {}", n.len()));
    }
    Ok(n.chunks(10).map(|c| Transform { translation: Vec3::new(c[0], c[1], c[2]), rotation: Quat::from_xyzw(c[3], c[4], c[5], c[6]).normalize(), scale: Vec3::new(c[7], c[8], c[9]) }).collect())
}

/// An <Instances> whose placements may change (#85): the lists a render's row shows (`inst_all`; which one a frame
/// shows is keyed as `inst_k`) and the one shown, or a live row's `inst` as last applied; and where each of a placement's
/// copies sits in it (a model's meshes, in the model; a mesh's one copy, at the placement). Copies are its children,
/// placement by placement.
#[derive(Component)]
pub struct Placements {
    lists: Vec<String>,
    shown: usize,
    live: String,
    parts: Vec<Mat4>,
}

impl Placements {
    pub(crate) fn of(t: &Tup) -> Placements {
        let all = match t.vals.get("inst_all") { Some(V::S(s)) => s.split('|').map(str::to_string).collect(), _ => vec![] };
        let live = match t.vals.get("inst") { Some(V::S(s)) => s.clone(), _ => String::new() };
        Placements { lists: all, shown: 0, live, parts: vec![] }
    }
}

/// Each <Instances>' copies moved to the frame's placements when they're another list than the one shown: a render's
/// `inst_k`, or a live row's `inst`. A frame whose list has another count than the copies is an error.
pub fn sync_instances(frame: Res<FrameRows>, mut q: Query<(Entity, &mut Placements, &Children)>, mut ts: Query<&mut Transform>, mut error: ResMut<Error>) {
    for (e, mut pl, kids) in &mut q {
        if pl.parts.is_empty() {
            continue;
        }
        let Some(v) = frame.vals(e) else { continue };
        // a live row's own list first (a render's `inst` is its first frame's on every frame, so it never differs)
        let s = match (v.get("inst"), v.get("inst_k")) {
            (Some(V::S(s)), _) if *s != pl.live => {
                pl.live = s.clone();
                s.clone()
            }
            (_, Some(k)) if !pl.lists.is_empty() => {
                let k = (k.num().round().max(0.0) as usize).min(pl.lists.len() - 1);
                if k == pl.shown {
                    continue;
                }
                pl.shown = k;
                pl.lists[k].clone()
            }
            _ => continue,
        };
        let at = match parsed(&format!("{e}"), &s) {
            Ok(at) if at.len() * pl.parts.len() == kids.len() => at,
            Ok(at) => {
                error.0.get_or_insert(format!("Instances: a frame has {} placements where it began with {}; the count can't change", at.len(), kids.len() / pl.parts.len()));
                continue;
            }
            Err(err) => {
                error.0.get_or_insert(err);
                continue;
            }
        };
        let places = at.iter().flat_map(|tr| pl.parts.iter().map(move |local| Transform::from_matrix(tr.to_matrix() * *local)));
        for (kid, want) in kids.iter().zip(places) {
            if let Ok(mut t) = ts.get_mut(kid) {
                *t = want;
            }
        }
    }
}

/// The markers a copy takes from its parent: shadows cast and received, render layers.
fn markers(world: &World, e: Entity) -> (bool, bool, Option<RenderLayers>) {
    (world.get::<NotShadowCaster>(e).is_some(), world.get::<NotShadowReceiver>(e).is_some(), world.get::<RenderLayers>(e).cloned())
}

fn spawn_copy(world: &mut World, parent: Entity, mesh: Mesh3d, mat: MeshMaterial3d<StandardMaterial>, at: Transform, (no_cast, no_receive, layers): &(bool, bool, Option<RenderLayers>)) {
    let mut c = world.spawn((mesh, mat, at, ChildOf(parent)));
    if *no_cast {
        c.insert(NotShadowCaster);
    }
    if *no_receive {
        c.insert(NotShadowReceiver);
    }
    if let Some(l) = layers {
        c.insert(l.clone());
    }
}

/// A mesh row with `inst`, after its spawn (shadows and layers on): its Mesh3d onto one child a copy.
pub fn instance_mesh(world: &mut World, e: Entity, t: &Tup) -> Result<(), String> {
    let Some(at) = placements(t)? else { return Ok(()) };
    if t.vals.contains_key("shader") {
        return Err(format!("mesh {}: instances take a standard surface (a shader over them isn't instanced yet)", t.id));
    }
    let Some(mat) = world.get::<MeshMaterial3d<StandardMaterial>>(e).cloned() else {
        return Err(format!("mesh {}: instances take a MeshStandardMaterial, MeshPhysicalMaterial or MeshBasicMaterial (not toon, grid, wear or shadow-only)", t.id));
    };
    let Some(mesh) = world.entity_mut(e).take::<Mesh3d>() else { return Err(format!("mesh {}: no mesh to instance", t.id)) };
    let m = markers(world, e);
    world.entity_mut(e).insert((Instanced, Placements { parts: vec![Mat4::IDENTITY], ..Placements::of(t) }));
    for tr in at {
        spawn_copy(world, e, mesh.clone(), mat.clone(), tr, &m);
    }
    Ok(())
}

/// A model row's placements, kept on its Model3d until its scene is copied (`instance_models`).
pub fn model_placements(t: &Tup) -> Result<Option<Vec<Transform>>, String> {
    let at = placements(t)?;
    if at.is_some() && ["anim", "mix", "graph", "morph_names"].iter().any(|k| t.vals.contains_key(*k)) {
        return Err(format!("model {}: instances can't play a clip or set morphs", t.id));
    }
    Ok(at)
}

/// Each instanced model whose scene is settled: its meshes (with their places in the model) copied to every placement,
/// then the scene despawned. Before then the model isn't settled, so await_models holds the first frame for it.
pub fn instance_models(world: &mut World) {
    let mut q = world.query::<(Entity, &Model3d)>();
    let todo: Vec<Entity> = q.iter(world).filter(|(_, m)| m.inst.is_some() && m.ready() && m.surfaces.is_empty() && m.toon.is_empty() && m.shaders.is_empty()).map(|(e, _)| e).collect();
    for e in todo {
        let at = world.get_mut::<Model3d>(e).and_then(|mut m| m.inst.take()).unwrap_or_default();
        let src = world.get::<Model3d>(e).map(|m| m.src.clone()).unwrap_or_default();
        let roots: Vec<Entity> = world.get::<Children>(e).map(|c| c.iter().collect()).unwrap_or_default();
        // every mesh under the scene, with its place in the model (its transforms multiplied up to the model)
        let mut parts: Vec<(Mesh3d, MeshMaterial3d<StandardMaterial>, Mat4)> = vec![];
        let mut stack: Vec<(Entity, Mat4)> = roots.iter().map(|r| (*r, Mat4::IDENTITY)).collect();
        let mut failed = None;
        while let Some((d, above)) = stack.pop() {
            let here = above * world.get::<Transform>(d).map(Transform::to_matrix).unwrap_or(Mat4::IDENTITY);
            if let Some(mesh) = world.get::<Mesh3d>(d) {
                if world.get::<SkinnedMesh>(d).is_some() {
                    failed = Some(format!("model {src}: a skinned mesh can't be instanced; use a <Model>"));
                    break;
                }
                match world.get::<MeshMaterial3d<StandardMaterial>>(d) {
                    Some(mat) => parts.push((mesh.clone(), mat.clone(), here)),
                    None => {
                        failed = Some(format!("model {src}: instances take its standard (glTF) materials; a toon, look or shader surface isn't instanced yet"));
                        break;
                    }
                }
            }
            if let Some(kids) = world.get::<Children>(d) {
                stack.extend(kids.iter().map(|k| (k, here)));
            }
        }
        if let Some(f) = failed {
            world.resource_mut::<Error>().0.get_or_insert(f);
            continue;
        }
        let m = markers(world, e);
        for tr in &at {
            let place = tr.to_matrix();
            for (mesh, mat, local) in &parts {
                spawn_copy(world, e, mesh.clone(), mat.clone(), Transform::from_matrix(place * *local), &m);
            }
        }
        for r in roots {
            world.entity_mut(r).despawn();
        }
        if let Some(mut pl) = world.get_mut::<Placements>(e) {
            pl.parts = parts.iter().map(|p| p.2).collect();
        }
        world.entity_mut(e).insert(Instanced);
    }
}

/// A ready model with `shadow={false}` or `receiveShadow={false}`: each of its meshes given the marker the model has
/// (Bevy reads them per mesh entity, not from a parent), whenever one lacks it.
#[allow(clippy::type_complexity)]
pub fn model_shadow_markers(
    mut commands: Commands,
    models: Query<(Entity, Has<NotShadowCaster>, Has<NotShadowReceiver>), (With<ModelReady>, Or<(With<NotShadowCaster>, With<NotShadowReceiver>)>)>,
    kids: Query<&Children>,
    meshes: Query<(Has<NotShadowCaster>, Has<NotShadowReceiver>), With<Mesh3d>>,
) {
    for (e, no_cast, no_receive) in &models {
        for d in descendants(e, &kids) {
            let Ok((c, r)) = meshes.get(d) else { continue };
            if no_cast && !c {
                commands.entity(d).insert(NotShadowCaster);
            }
            if no_receive && !r {
                commands.entity(d).insert(NotShadowReceiver);
            }
        }
    }
}
