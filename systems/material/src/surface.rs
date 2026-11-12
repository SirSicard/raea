//! A model's surfaces re-covered (<Model> with <MeshStandardMaterial> children): each of its glTF materials (all, or
//! the one a spec names by `material`) given the colour, texture or finish the spec gives, the rest of it kept. A
//! cabinet's wood repainted, a bottle's label swapped, a chair's fabric changed without touching its file.
//!
//! The model row's `surfaces` column: a JSON list of objects of a mesh row's material columns (color, rough, metal,
//! map, normal_map, rough_map, metal_map, mr_map, ao_map, repeat_u/v, emissive, emissive_k, opacity, clearcoat, ...)
//! and `material`. Applied once the model's scene has its meshes, before the first frame is drawn (await_models), and
//! before its toon surfaces, which then go over these.

use super::*;
use std::path::Path;
use raea_core_program::eval::Tup;

#[derive(Clone)]
pub struct Surface {
    material: Option<String>,
    /// the spec's columns made into a material (its textures loaded); only the parts the spec gives are used
    made: StandardMaterial,
    given: Vec<String>,
    /// the further fields it gives (fields.rs), by name
    fields: Vec<String>,
    /// a <Lightmap>'s bake instead of a material (lightmap.rs)
    baked: Option<super::lightmap::Baked>,
}

/// The row's `surfaces` column, each made into a material now (its pictures read as a mesh's are).
pub fn of(world: &mut World, t: &Tup, inserted: &[Tup], dir: &Path) -> Result<Vec<Surface>, String> {
    let Some(V::S(s)) = t.vals.get("surfaces") else { return Ok(Vec::new()) };
    let list: Vec<serde_json::Map<String, serde_json::Value>> = serde_json::from_str(s).map_err(|e| format!("model {}: surfaces: {e}", t.id))?;
    let mut out = Vec::new();
    for spec in list {
        let mut vals = BTreeMap::new();
        for (k, v) in &spec {
            match v {
                serde_json::Value::String(s) => vals.insert(k.clone(), V::S(s.clone())),
                serde_json::Value::Number(n) => vals.insert(k.clone(), V::N(n.as_f64().unwrap_or(0.0))),
                _ => None,
            };
        }
        let material = spec.get("material").and_then(serde_json::Value::as_str).map(str::to_string);
        if let Some(b) = super::lightmap::of(world, t, &vals, inserted, dir)? {
            out.push(Surface { material, made: StandardMaterial::default(), given: Vec::new(), fields: Vec::new(), baked: Some(b) });
            continue;
        }
        let given: Vec<String> = vals.keys().cloned().collect();
        let fields = match vals.get("fields") {
            Some(V::S(f)) => serde_json::from_str::<serde_json::Map<String, serde_json::Value>>(f).map(|o| o.keys().cloned().collect()).unwrap_or_default(),
            _ => Vec::new(),
        };
        let made = maps::material(world, &Tup { kind: "mesh".into(), id: t.id.clone(), vals }, inserted, dir)?;
        out.push(Surface { material, made, given, fields, baked: None });
    }
    Ok(out)
}

/// The spec for a glTF material by name: the one naming it, else the one naming none (bakes aren't materials).
fn spec_for<'a>(specs: &'a [Surface], name: Option<&str>) -> Option<(usize, &'a Surface)> {
    let mut mats = specs.iter().enumerate().filter(|(_, s)| s.baked.is_none());
    mats.clone().find(|(_, s)| s.material.is_some() && s.material.as_deref() == name).or_else(|| mats.find(|(_, s)| s.material.is_none()))
}

/// A glTF material with what a spec gives laid over it.
fn over(base: &StandardMaterial, s: &Surface) -> StandardMaterial {
    let mut m = base.clone();
    let has = |k: &str| s.given.iter().any(|g| g == k);
    if has("color") {
        m.base_color = s.made.base_color.with_alpha(base.base_color.alpha());
    }
    if has("opacity") {
        m.base_color.set_alpha(s.made.base_color.alpha());
        m.alpha_mode = AlphaMode::Blend;
    }
    if has("map") {
        m.base_color_texture = s.made.base_color_texture.clone();
        // the picture's own colours, unless a colour is given too
        if !has("color") {
            m.base_color = Color::WHITE.with_alpha(m.base_color.alpha());
        }
    }
    if has("normal_map") {
        m.normal_map_texture = s.made.normal_map_texture.clone();
    }
    // how its alpha draws (alphaMode): a glTF's MASK hair made "coverage", or a part made "blend"
    if has("alpha") {
        m.alpha_mode = s.made.alpha_mode;
    }
    if has("rough") {
        m.perceptual_roughness = s.made.perceptual_roughness;
    }
    if has("metal") {
        m.metallic = s.made.metallic;
    }
    if has("rough_map") || has("metal_map") || has("mr_map") {
        m.metallic_roughness_texture = s.made.metallic_roughness_texture.clone();
        // a map's factor is 1 unless given (three.js and glTF's rule)
        if !has("rough") {
            m.perceptual_roughness = 1.0;
        }
        if !has("metal") {
            m.metallic = if has("metal_map") || has("mr_map") { 1.0 } else { 0.0 };
        }
    }
    if has("ao_map") {
        m.occlusion_texture = s.made.occlusion_texture.clone();
    }
    if has("emissive") || has("emissive_k") {
        m.emissive = s.made.emissive;
    }
    if has("repeat_u") || has("repeat_v") {
        m.uv_transform = s.made.uv_transform;
    }
    if has("depth_map") {
        m.depth_map = s.made.depth_map.clone();
    }
    // real transmission (glass, a frosted veil), as a mesh's material takes it (maps.rs); before this a glass
    // <StandardMaterial> re-covering a glb drew opaque
    if has("transmission") {
        m.specular_transmission = s.made.specular_transmission;
    }
    if has("ior") {
        m.ior = s.made.ior;
    }
    if has("thickness") {
        m.thickness = s.made.thickness;
    }
    if has("fields") {
        super::fields::copy(&mut m, &s.made, &s.fields);
    }
    for (k, f) in [("clearcoat", 0), ("clearcoat_rough", 1), ("reflectance", 2)] {
        if has(k) {
            match f {
                0 => m.clearcoat = s.made.clearcoat,
                1 => m.clearcoat_perceptual_roughness = s.made.clearcoat_perceptual_roughness,
                _ => m.reflectance = s.made.reflectance,
            }
        }
    }
    m
}

/// A model's meshes re-covered once its scene is spawned, each shared glTF material swapped once per spec. Returns
/// whether it found the meshes.
pub fn apply_to_model(world: &mut World, root: Entity, specs: &[Surface]) -> bool {
    let mut stack = vec![root];
    let mut found = Vec::new();
    while let Some(x) = stack.pop() {
        if let Some(c) = world.get::<Children>(x) {
            stack.extend(c.iter());
        }
        if let Some(mat) = world.get::<MeshMaterial3d<StandardMaterial>>(x) {
            let name = world.get::<bevy::gltf::GltfMaterialName>(x).map(|n| n.0.clone());
            found.push((x, mat.0.clone(), name));
        }
    }
    if found.is_empty() {
        return false;
    }
    let baked: Vec<&super::lightmap::Baked> = specs.iter().filter_map(|s| s.baked.as_ref()).collect();
    if !baked.is_empty() {
        let meshes: Vec<(Entity, Option<String>)> = found.iter().map(|(x, ..)| (*x, world.get::<bevy::gltf::GltfMeshName>(*x).map(|n| n.0.clone()))).collect();
        super::lightmap::apply(world, &meshes, &baked);
    }
    let mut made: HashMap<(AssetId<StandardMaterial>, usize), Handle<StandardMaterial>> = HashMap::new();
    for (x, mat, name) in found {
        let Some((k, spec)) = spec_for(specs, name.as_deref()) else { continue };
        let h = match made.get(&(mat.id(), k)) {
            Some(h) => h.clone(),
            None => {
                let Some(base) = world.resource::<Assets<StandardMaterial>>().get(&mat).cloned() else { continue };
                let h = world.resource_mut::<Assets<StandardMaterial>>().add(over(&base, spec));
                made.insert((mat.id(), k), h.clone());
                h
            }
        };
        world.entity_mut(x).insert(MeshMaterial3d(h));
    }
    true
}

#[cfg(test)]
mod tests {
    use super::*;
    use bevy::pbr::Lightmap;

    fn spec(material: Option<&str>, baked: bool) -> Surface {
        let made = Lightmap { image: Handle::default(), uv_rect: Rect::new(0.0, 0.0, 1.0, 1.0), bicubic_sampling: false };
        Surface { material: material.map(str::to_string), made: StandardMaterial::default(), given: Vec::new(), fields: Vec::new(), baked: baked.then(|| super::super::lightmap::Baked { mesh: "box".into(), made }) }
    }

    #[test]
    fn transmission_ior_and_thickness_re_cover_a_glb_material() {
        // a glass re-cover over an opaque glTF material: the three fields given land, the rest stay the glb's
        let mut s = spec(None, false);
        s.made.specular_transmission = 1.0;
        s.made.ior = 1.3;
        s.made.thickness = 0.03;
        s.given = vec!["transmission".into(), "ior".into(), "thickness".into()];
        let base = StandardMaterial { perceptual_roughness: 0.8, ..default() };
        let m = over(&base, &s);
        assert_eq!((m.specular_transmission, m.ior, m.thickness), (1.0, 1.3, 0.03));
        assert_eq!(m.perceptual_roughness, 0.8);
        // not given: the glb's own
        let plain = over(&base, &spec(None, false));
        assert_eq!(plain.specular_transmission, base.specular_transmission);
    }

    #[test]
    fn a_bake_is_never_the_material_a_glb_material_takes() {
        // a <Lightmap> names no material: it isn't the fallback for every material either
        let specs = [spec(None, true), spec(Some("red"), false), spec(None, false)];
        assert_eq!(spec_for(&specs, Some("red")).map(|(k, _)| k), Some(1));
        assert_eq!(spec_for(&specs, Some("green")).map(|(k, _)| k), Some(2));
        assert!(spec_for(&specs[..1], Some("green")).is_none());
    }
}
