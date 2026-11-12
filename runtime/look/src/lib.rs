//! A 3D composition's look as raea-render row columns: the camera (where it is and looks, keyed), its lens and motion
//! blur, the frame's looks (grade, paint, outline), and a part's surface (toon, paint, grid).

use std::collections::BTreeMap;

use raea_core_program::ir::{Program, V};
use raea_core_scene::*;
use serde_json::{Map, Value};

mod camera;
pub use camera::*;
mod instances;
mod post;
pub use post::*;
mod parts;
pub use parts::*;
pub use instances::*;
mod active;
pub use active::*;

/// Bloom of intensity 1: Bevy's natural preset.
pub const BLOOM: f64 = 0.15;

/// A MeshToonMaterial's static values as raea-render's `toon` column reads them (engine/render/src/engine/toon.rs): steps or bands, the
/// shadow colour, rim, highlight and outline. A model's also carries its colour override and the glTF material it's for.
pub fn toon_spec(p: &Map<String, Value>, model: bool) -> Value {
    let mut o = Map::new();
    if let Some(s) = num(p, "steps") {
        o.insert("steps".into(), Value::from(s));
    }
    if let Some(Value::Array(bs)) = p.get("bands") {
        let bands: Vec<Value> = bs.iter().map(|b| serde_json::json!([b.get("at").and_then(Value::as_f64).unwrap_or(0.0), hex(b.get("color"))])).collect();
        o.insert("bands".into(), Value::Array(bands));
    }
    if let Some(c) = hex(p.get("shadowColor")) {
        o.insert("shadow".into(), Value::String(c));
    }
    let part = |k: &str, flat: &str, size: &str| -> Option<Value> {
        let x = p.get(k).and_then(Value::as_object)?;
        let mut v = Map::new();
        v.insert("k".into(), Value::from(num(p, flat).or_else(|| num(x, "intensity")).unwrap_or(1.0)));
        if let Some(c) = hex(x.get("color")) {
            v.insert("color".into(), Value::String(c));
        }
        if let Some(w) = num(x, size) {
            v.insert(size.into(), Value::from(w));
        }
        Some(Value::Object(v))
    };
    if let Some(r) = part("rim", "rimIntensity", "width") {
        o.insert("rim".into(), r);
    }
    if let Some(h) = part("highlight", "highlightIntensity", "size") {
        o.insert("spec".into(), h);
    }
    if let Some(x) = p.get("outline").and_then(Value::as_object) {
        let mut v = Map::new();
        v.insert("width".into(), Value::from(num(p, "outlineWidth").or_else(|| num(x, "width")).unwrap_or(2.0)));
        if let Some(c) = hex(x.get("color")) {
            v.insert("color".into(), Value::String(c));
        }
        o.insert("outline".into(), Value::Object(v));
    }
    if model {
        for k in ["color", "material"] {
            if let Some(Value::String(c)) = p.get(k) {
                o.insert(k.into(), Value::String(c.clone()));
            }
        }
    }
    Value::Object(o)
}

/// A model's surface override (raea-render's surface.rs): the material's props as a mesh row's columns, and the glTF material
/// it names, if one.
pub fn surface_spec(p: &Map<String, Value>) -> Value {
    let mut o = Map::new();
    if let Some(Value::String(m)) = p.get("material") {
        o.insert("material".into(), Value::String(m.clone()));
    }
    for k in ["color", "emissive"] {
        if let Some(c) = hex(p.get(k)) {
            o.insert(k.into(), Value::String(c));
        }
    }
    for (prop, col) in [("roughness", "rough"), ("metalness", "metal"), ("emissiveIntensity", "emissive_k"), ("opacity", "opacity"), ("clearcoat", "clearcoat"), ("clearcoatRoughness", "clearcoat_rough"), ("reflectance", "reflectance")] {
        if let Some(v) = num(p, prop) {
            o.insert(col.into(), Value::from(v));
        }
    }
    // a new glow in Bevy's units (core/scene emissive_power); an intensity alone scales the glTF's own emissive, as written
    if p.contains_key("emissive_nits") || hex(p.get("emissive")).is_some() {
        o.insert("emissive_k".into(), Value::from(emissive_power(p)));
    }
    for (prop, col) in [("map", "map"), ("normalMap", "normal_map"), ("roughnessMap", "rough_map"), ("metalnessMap", "metal_map"), ("metallicRoughnessMap", "mr_map"), ("aoMap", "ao_map"), ("emissiveMap", "emissive_map"), ("depthMap", "depth_map")] {
        if let Some(src) = p.get(prop).and_then(Value::as_str) {
            o.insert(col.into(), Value::String(src_path(src)));
        }
    }
    // how its alpha draws: a glTF's MASK hair made "coverage" (soft over MSAA), or a part made "blend"
    if let Some(Value::String(a)) = p.get("alphaMode") {
        o.insert("alpha".into(), Value::String(a.clone()));
    }
    if let Some(v) = num(p, "alphaCutoff") {
        o.insert("alpha_cutoff".into(), Value::from(v));
    }
    // StandardMaterial's other fields (docs/shaders.feature SH7)
    if let Some(f) = fields_of(p) {
        o.insert("fields".into(), Value::String(f));
    }
    // how its maps are read (raea-sys-material's sampler.rs)
    for k in ["sampler", "samplers"] {
        if let Some(v) = p.get(k).filter(|v| v.is_object()) {
            o.insert(k.into(), Value::String(v.to_string()));
        }
    }
    // map: null, the model's own picture taken off
    if p.get("map") == Some(&Value::Null) {
        o.insert("map".into(), Value::String(String::new()));
    }
    if let Some(Value::Array(r)) = p.get("repeat") {
        if let [u, v] = r.as_slice() {
            o.insert("repeat_u".into(), Value::from(u.as_f64().unwrap_or(1.0)));
            o.insert("repeat_v".into(), Value::from(v.as_f64().unwrap_or(1.0)));
        }
    }
    // a <Lightmap> (raea-sys-material's lightmap.rs): its file, the glTF mesh it lies on, its sampling and rect
    if let Some(src) = p.get("lightmap").and_then(Value::as_str) {
        o.insert("lightmap".into(), Value::String(src_path(src)));
        for k in ["mesh", "bicubic", "uv_x0", "uv_y0", "uv_x1", "uv_y1"] {
            if let Some(v) = p.get(k) {
                o.insert(k.into(), v.clone());
            }
        }
    }
    Value::Object(o)
}

pub fn r6(x: f64) -> f64 {
    (x * 1e6).round() / 1e6
}

/// A row's numeric column: its first frame's value, keyed on every frame when it changes.
pub fn column(p: &mut Program, row: &mut BTreeMap<String, V>, id: &str, name: &str, vals: &[f64]) {
    exact(p, row, id, name, &vals.iter().map(|v| r6(*v)).collect::<Vec<_>>());
}

/// `column` unrounded, for values that are already the World's f32 (a Transform's, docs/control.feature FC1d): 1e-6 is
/// coarser than f32 below 8, so rounding would move a quaternion by up to 5e-7.
pub fn exact(p: &mut Program, row: &mut BTreeMap<String, V>, id: &str, name: &str, vals: &[f64]) {
    row.insert(name.into(), V::N(vals[0]));
    if !vals.iter().all(|v| (*v - vals[0]).abs() < 1e-9) {
        p.keys.insert((id.to_string(), name.to_string()), linear_keys(vals));
    }
}

/// One value a frame as linear keys: a key only where the value differs from a neighbour's, as linear between the rest
/// gives the same value on every frame; a still late in a long scene (its frames before held as copies of one) keyed
/// thousands of frames per column (#77).
pub fn linear_keys(vals: &[f64]) -> Vec<(i64, f64, String)> {
    let keep = |f: usize| f == 0 || f + 1 == vals.len() || vals[f] != vals[f - 1] || vals[f] != vals[f + 1];
    vals.iter().enumerate().filter(|(f, _)| keep(*f)).map(|(f, v)| (f as i64, *v, "linear".to_string())).collect()
}

/// A model's look as raea-render's look column has it: 0 solid, 1 pixel, 2 site.
pub fn look_of(props: &Map<String, Value>) -> f64 {
    match props.get("look").and_then(Value::as_str) {
        Some("pixel") => 1.0,
        Some("site") => 2.0,
        _ => 0.0,
    }
}

/// The paint look's keyed values on one frame (raea-render's look.rs and paint.rs read them): its tone bands, paper grain,
/// how far edges wander, the wander's seed (the SDK folds a boil's beat into it), and how far the wind has carried the
/// cloud shadows and blown the grass.
pub fn paint_keyed(l: &Map<String, Value>) -> [(&'static str, f64); 7] {
    [
        ("paint_bands", n(l, "bands", 3.0)),
        ("paint_grain", n(l, "grain", 0.3)),
        ("paint_rag", n(l, "rag", 2.0)),
        ("paint_seed", n(l, "seed", 0.0)),
        ("paint_cloud_shadow_x", n(l, "cloudShadowX", 0.0)),
        ("paint_cloud_shadow_z", n(l, "cloudShadowZ", 0.0)),
        ("paint_wind_time", n(l, "windTime", 0.0)),
    ]
}

/// The paint look's keyed columns on the camera row, one value a frame (a frame without a paint <Look> holds the
/// first one's).
pub fn paint_keyed_rows(looks: &[Option<&Map<String, Value>>], p: &mut Program, row: &mut BTreeMap<String, V>, first: &Map<String, Value>) {
    let per: Vec<[(&str, f64); 7]> = looks.iter().map(|l| paint_keyed(l.filter(|l| is_paint(l)).unwrap_or(first))).collect();
    for k in 0..per[0].len() {
        column(p, row, "cam", per[0][k].0, &per.iter().map(|v| v[k].1).collect::<Vec<_>>());
    }
}

pub fn is_paint(l: &Map<String, Value>) -> bool {
    l.get("mode").and_then(Value::as_str) == Some("paint")
}

/// The paint look's fixed columns: its colours, sky and palette, the AO band, foam and edge.
pub fn paint_fixed(row: &mut BTreeMap<String, V>, first: &Map<String, Value>) {
    row.insert("paint_rag_scale".into(), V::N(n(first, "ragScale", 24.0)));
    // ambient occlusion and ground bounce as a band, the water's foam, the shadows' torn edge (paint.rs)
    for (k, col) in [("aoHeight", "paint_ao_height"), ("ground", "paint_ground"), ("ssao", "paint_ssao"), ("water", "paint_water"), ("foam", "paint_foam"), ("edge", "paint_edge"), ("edgeScale", "paint_edge_scale"), ("wash", "paint_wash"), ("washSize", "paint_wash_size"), ("stroke", "paint_stroke"), ("strokeScale", "paint_stroke_scale"), ("saturate", "paint_saturate"), ("foliage", "paint_foliage"), ("foliageHeight", "paint_foliage_height"), ("calmFrom", "paint_calm_from"), ("calmTo", "paint_calm_to"), ("calmAmount", "paint_calm_amount"), ("texel", "paint_texel"), ("texelJitter", "paint_texel_jitter"), ("cloudShadows", "paint_cloud_shadows"), ("cloudShadowSize", "paint_cloud_shadow_size"), ("wind", "paint_wind"), ("windX", "paint_wind_x"), ("windZ", "paint_wind_z"), ("hazeDensity", "paint_haze_density"), ("hazeHeight", "paint_haze_height"), ("hazeStart", "paint_haze_start"), ("hazeMost", "paint_haze_most")] {
        if let Some(v) = num(first, k) {
            row.insert(col.into(), V::N(v));
        }
    }
    for (k, col) in [("shadow", "paint_shadow"), ("mid", "paint_mid"), ("ao", "paint_ao"), ("foamColor", "paint_foam_color"), ("calm", "paint_calm"), ("haze", "paint_haze"), ("hazeSun", "paint_haze_sun")] {
        if let Some(h) = hex(first.get(k)) {
            row.insert(col.into(), V::S(h));
        }
    }
    // the sky: one colour, or [top, bottom]
    match first.get("sky") {
        Some(Value::Array(a)) => {
            if let Some(h) = hex(a.first()) {
                row.insert("paint_sky_top".into(), V::S(h));
            }
            if let Some(h) = hex(a.get(1)) {
                row.insert("paint_sky_bottom".into(), V::S(h));
            }
        }
        Some(v) => {
            if let Some(h) = hex(Some(v)) {
                row.insert("paint_sky_top".into(), V::S(h));
            }
        }
        None => {}
    }
    if let Some(Value::Array(a)) = first.get("palette") {
        let hs: Vec<String> = a.iter().filter_map(|c| hex(Some(c))).collect();
        if !hs.is_empty() {
            row.insert("paint_palette".into(), V::S(hs.join(",")));
        }
    }
}

/// A <Look>'s fixed columns (frame_look and the rest; not the paint look's keyed ones).
pub fn look_fixed(l: &Map<String, Value>) -> BTreeMap<String, V> {
    let mut row = BTreeMap::new();
    let mode = l.get("mode").and_then(Value::as_str).unwrap_or("site");
    row.insert("frame_look".into(), V::S(mode.into()));
    row.insert("frame_look_px".into(), V::N(n(l, "pixelSize", if mode == "paint" { 1.0 } else { 6.0 })));
    if mode == "paint" {
        paint_fixed(&mut row, l);
    }
    row.insert("frame_look_color".into(), V::N(n(l, "color", 1.0)));
    row.insert("frame_look_lift".into(), V::N(n(l, "lift", 0.0)));
    row.insert("frame_look_gain".into(), V::N(n(l, "gain", 1.0)));
    if l.get("theme").and_then(Value::as_str) == Some("light") {
        row.insert("frame_look_theme".into(), V::S("light".into()));
    }
    // the ink look's two colours and its line
    for (k, col) in [("ink", "frame_look_ink"), ("paper", "frame_look_paper")] {
        if let Some(h) = hex(l.get(k)) {
            row.insert(col.into(), V::S(h));
        }
    }
    row.insert("frame_look_line".into(), V::N(n(l, "line", 0.0)));
    row.insert("frame_look_threshold".into(), V::N(n(l, "threshold", 0.5)));
    row.insert("frame_look_band".into(), V::N(n(l, "band", 1.0)));
    // composition passes: those it leaves as drawn, and each one's own settings (engine/look.rs, paint.rs)
    if let Some(s) = skip_list(l) {
        row.insert("look_skip".into(), V::S(s));
    }
    if let Some(o) = l.get("passes").filter(|o| o.as_object().is_some_and(|o| !o.is_empty())) {
        row.insert("look_passes".into(), V::S(o.to_string()));
    }
    row
}

/// An <Outline>'s columns.
pub fn outline_fixed(o: &Map<String, Value>) -> BTreeMap<String, V> {
    let mut row = BTreeMap::new();
    row.insert("outline".into(), V::S(hex(o.get("color")).unwrap_or("#000000".into())));
    row.insert("outline_depth".into(), V::N(n(o, "depth", 0.04)));
    row.insert("outline_normal".into(), V::N(n(o, "normal", 0.3)));
    if let Some(w) = num(o, "width") {
        row.insert("outline_width".into(), V::N(w));
    }
    if let Some(f) = num(o, "far") {
        row.insert("outline_far".into(), V::N(f));
    }
    if let Some(s) = skip_list(o) {
        row.insert("outline_skip".into(), V::S(s));
    }
    row
}

/// The frame's look (a <Look> and an <Outline>) on the camera row. One look for the whole piece: its columns on the
/// row, as always. Looks that change (a paint scene after a plain one, then a cartoon one, in one composition): each
/// different one's columns in `frame_looks` (a JSON list of objects) and the frame's index into it in `frame_look_i`
/// (keyed, stepped; -1 for none), which raea-render lays onto the row each frame (FrameRows::vals).
pub fn frame_looks(all: &[Vec<Item>], p: &mut Program, row: &mut BTreeMap<String, V>) {
    let looks: Vec<Option<&Map<String, Value>>> = all.iter().map(|its| its.iter().find(|i| i.kind == "framelook").map(|i| &*i.props)).collect();
    let lines: Vec<Option<&Map<String, Value>>> = all.iter().map(|its| its.iter().find(|i| i.kind == "outline").map(|i| &*i.props)).collect();
    if let Some(first) = looks.iter().flatten().find(|l| is_paint(l)) {
        paint_keyed_rows(&looks, p, row, first);
    }
    let mut kinds: Vec<BTreeMap<String, V>> = Vec::new();
    let idx: Vec<f64> = looks
        .iter()
        .zip(&lines)
        .map(|(l, o)| {
            if l.is_none() && o.is_none() {
                return -1.0;
            }
            let mut cols = l.map(look_fixed).unwrap_or_default();
            cols.extend(o.map(outline_fixed).unwrap_or_default());
            (kinds.iter().position(|k| *k == cols).unwrap_or_else(|| {
                kinds.push(cols);
                kinds.len() - 1
            })) as f64
        })
        .collect();
    if kinds.is_empty() {
        return;
    }
    if kinds.len() == 1 && idx.iter().all(|i| *i == 0.0) {
        row.extend(kinds.pop().unwrap_or_default());
        return;
    }
    let list: Vec<Value> = kinds
        .iter()
        .map(|k| {
            Value::Object(k.iter().map(|(c, v)| (c.clone(), match v {
                V::N(x) => serde_json::json!(x),
                V::S(s) => Value::String(s.clone()),
            })).collect())
        })
        .collect();
    row.insert("frame_looks".into(), V::S(Value::Array(list).to_string()));
    row.insert("frame_look_i".into(), V::N(idx[0]));
    if !idx.iter().all(|i| *i == idx[0]) {
        p.keys.insert(("cam".to_string(), "frame_look_i".to_string()), idx.iter().enumerate().map(|(f, v)| (f as i64, *v, "step".to_string())).collect());
    }
}

/// a material's `paint` (under a paint look): its breakup, patches of noise in their own colour (raea-render's paint.rs)
pub fn paint_columns(row: &mut BTreeMap<String, V>, props: &Map<String, Value>) {
    let Some(g) = props.get("paint").and_then(Value::as_object) else { return };
    row.insert("paint_breakup".into(), V::N(n(g, "breakup", 0.5)));
    row.insert("paint_breakup_scale".into(), V::N(n(g, "scale", 1.0)));
    if let Some(h) = hex(g.get("color")) {
        row.insert("paint_patch".into(), V::S(h));
        row.insert("paint_patch_amount".into(), V::N(n(g, "amount", 0.6)));
    }
}

pub fn grid_columns(row: &mut BTreeMap<String, V>, props: &Map<String, Value>) {
    let Some(g) = props.get("grid").and_then(Value::as_object) else { return };
    let Some(cell) = g.get("cell").and_then(Value::as_f64).filter(|c| *c > 0.0) else { return };
    row.insert("grid_cell".into(), V::N(cell));
    if let Some(m) = g.get("major").and_then(Value::as_f64) {
        row.insert("grid_major".into(), V::N(m));
    }
    for (k, col) in [("color", "grid_color"), ("edge", "grid_edge")] {
        if let Some(c) = g.get(k).and_then(Value::as_str) {
            row.insert(col.into(), V::S(c.into()));
        }
    }
    if g.get("toon") == Some(&Value::Bool(true)) {
        row.insert("grid_toon".into(), V::N(1.0));
    }
}

/// A part's render layers (`layers`, Bevy's RenderLayers) as the row's `layers` column: "0,2", from the first frame.
pub fn layers_column(row: &mut BTreeMap<String, V>, props: &Map<String, Value>) {
    if let Some(Value::Array(l)) = props.get("layers") {
        let l: Vec<String> = l.iter().filter_map(Value::as_u64).map(|n| n.to_string()).collect();
        row.insert("layers".into(), V::S(l.join(",")));
    }
}

/// The composition passes the piece's parts name (`pass`; "scene", everyone's, aside), in order of first appearance,
/// at most raea-render's three (engine/compose.rs: the normal prepass's alpha carries the pass in two bits).
pub fn pass_names(all: &[Vec<Item>]) -> Vec<String> {
    let mut out: Vec<String> = Vec::new();
    for it in all.iter().flatten() {
        if let Some(Value::String(s)) = it.props.get("pass") {
            if s != "scene" && !out.contains(s) {
                out.push(s.clone());
            }
        }
    }
    if out.len() > 3 {
        eprintln!("raea: more than three composition passes ({}): {} draw as \"scene\"", out.join(", "), out[3..].join(", "));
        out.truncate(3);
    }
    out
}

/// An effect's share by composition pass as a camera column's JSON ({name: share}, 0 to 1): its `passes`, and each
/// pass it `skip`s at 0.
pub fn shares(props: &Map<String, Value>) -> Option<String> {
    let mut m = serde_json::Map::new();
    if let Some(Value::Object(o)) = props.get("passes") {
        for (k, v) in o {
            if let Some(x) = v.as_f64() {
                m.insert(k.clone(), serde_json::json!(x));
            }
        }
    }
    if let Some(Value::Array(a)) = props.get("skip") {
        for n in a.iter().filter_map(Value::as_str) {
            m.insert(n.to_string(), serde_json::json!(0.0));
        }
    }
    (!m.is_empty()).then(|| Value::Object(m).to_string())
}

/// A list of pass names as a camera column (`skip`: "ui,fx").
pub fn skip_list(props: &Map<String, Value>) -> Option<String> {
    let Some(Value::Array(a)) = props.get("skip") else { return None };
    let ns: Vec<&str> = a.iter().filter_map(Value::as_str).collect();
    (!ns.is_empty()).then(|| ns.join(","))
}

/// A part's Bevy components (runtime/plugins/src/lib.rs): each type's value from the first frame it's there, and
/// again from each frame its value changes (or from the frame its `from` names), as `component` rows on the part's row.
pub fn components(p: &mut Program, id: &str, its: &[Item]) {
    let each = its.iter().enumerate().flat_map(|(f, it)| it.props.get("components").and_then(Value::as_array).into_iter().flatten().map(move |c| (f, c)));
    keyed(p, "component", Some(id), "c", each);
}

/// A StandardMaterial's fields its `animate` names beyond the row columns' four (docs/control.feature FC1c): sampled each
/// frame onto the material's props as `field:<name>` (runtime/react animate.rs), sent as keyed `material:` rows that
/// patch the part's own material (runtime/plugins patch_material). A colour arrives as #rrggbb and goes as Bevy's Srgba.
pub fn material_fields(p: &mut Program, id: &str, its: &[Item]) {
    let each: Vec<(usize, Value)> = its.iter().enumerate().filter_map(|(f, it)| {
        let m = it.material.as_ref()?;
        let o: Map<String, Value> = m.props.iter().filter_map(|(k, v)| Some((k.strip_prefix("field:")?.to_string(), bevy_value(v)))).collect();
        (!o.is_empty()).then(|| (f, serde_json::json!({ "type": "material:bevy_pbr::pbr_material::StandardMaterial", "value": o })))
    }).collect();
    keyed(p, "component", Some(id), "m", each.iter().map(|(f, v)| (*f, v)));
}

/// A three.js shader's uniforms and time (a <ThreeShaderMaterial>'s, docs/r3f.feature R3F11), sent as keyed
/// `three:uniforms` rows from each frame they change, which raea-sys-three-shader's `patch` writes into its slots.
pub fn three_uniforms(p: &mut Program, id: &str, its: &[Item]) {
    let each: Vec<(usize, Value)> = its.iter().enumerate().filter_map(|(f, it)| {
        let m = it.material.as_ref().filter(|m| &*m.kind == "ThreeShaderMaterial")?;
        let v = serde_json::json!({ "uniforms": m.props.get("uniforms").cloned().unwrap_or(Value::Null), "time": m.props.get("time").cloned().unwrap_or(Value::Null) });
        Some((f, serde_json::json!({ "type": "three:uniforms", "value": v })))
    }).collect();
    if each.is_empty() {
        return;
    }
    keyed(p, "component", Some(id), "u", each.iter().map(|(f, v)| (*f, v)));
}

/// A sampled value as reflect's JSON takes it: `#rrggbb` (or `#rrggbbaa`) as a Color's Srgba, the rest as it is
fn bevy_value(v: &Value) -> Value {
    let Some(h) = v.as_str().and_then(|s| s.strip_prefix('#')).filter(|h| (h.len() == 6 || h.len() == 8) && h.chars().all(|c| c.is_ascii_hexdigit())) else { return v.clone() };
    let c = |i: usize| u8::from_str_radix(&h[i..i + 2], 16).unwrap_or(0) as f64 / 255.0;
    serde_json::json!({ "Srgba": { "red": c(0), "green": c(2), "blue": c(4), "alpha": if h.len() == 8 { c(6) } else { 1.0 } } })
}

/// Bevy's reflected resources and a plugin's (<BevyResource>, items of kind "resource"), keyed as a component's are
/// (docs/control.feature FC1c: only frame 0's was kept)
pub fn resources(p: &mut Program, all: &[Vec<Item>]) {
    let each = all.iter().enumerate().flat_map(|(f, items)| items.iter().filter(|it| it.kind == "resource").map(move |it| (f, Value::Object((*it.props).clone()))));
    let each: Vec<(usize, Value)> = each.collect();
    keyed(p, "resource", None, "c", each.iter().map(|(f, v)| (*f, v)));
}

/// `kind` rows of each type's value from the frame it's first seen, and again from each frame it changes
fn keyed<'a>(p: &mut Program, kind: &str, target: Option<&str>, tag: &str, each: impl Iterator<Item = (usize, &'a Value)>) {
    let mut last: BTreeMap<String, String> = BTreeMap::new();
    let mut n = 0;
    for (f, c) in each {
        let Some(ty) = c.get("type").and_then(Value::as_str) else { continue };
        let value = c.get("value").cloned().unwrap_or(Value::Null).to_string();
        if last.get(ty) == Some(&value) {
            continue;
        }
        last.insert(ty.to_string(), value.clone());
        let from = c.get("from").and_then(Value::as_f64).unwrap_or(f as f64);
        let mut row = BTreeMap::new();
        row.insert("id".into(), V::S(match target { Some(id) => format!("{id}-{tag}{n}"), None => format!("res{n}") }));
        if let Some(id) = target {
            row.insert("target".into(), V::S(id.to_string()));
        }
        row.insert("type".into(), V::S(ty.to_string()));
        row.insert("value".into(), V::S(value));
        if from > 0.0 {
            row.insert("from".into(), V::N(from));
        }
        p.spawns.push((kind.into(), vec![row]));
        n += 1;
    }
}

