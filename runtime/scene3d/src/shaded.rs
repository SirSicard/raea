//! Shaders over the lit standard surface put on (docs/shaders.feature SH1-SH4; raea-sys-shader) once
//! the edit's rows are applied, so a texture's "render:NAME" is the image its camera draws: a mesh row's `shader` (one
//! spec, JSON), a model row's `shader` (a list, each naming the glTF `material` it's for, or none for the rest), and the
//! scene's <SurfaceShader> (a `surface_shader` row) over every lit standard part left, models' meshes included; and the
//! frame's <FramePass>es (frame_pass rows, raea-sys-framepass) on the scene's camera, and its <Compute>s (compute rows,
//! raea-sys-compute).

use super::*;
use raea_sys_shader::{self as shader_ext, OwnSurface, ShadedMaterial, ShaderExt};
use std::collections::HashMap;

/// A mesh row's surface shader, until the rows are applied (shade_rows).
#[derive(Component)]
pub struct MeshShader {
    pub id: String,
    pub spec: serde_json::Value,
}

/// The scene's <SurfaceShader>, built.
#[derive(Resource)]
pub struct SceneShader(pub ShaderExt);

type Made = HashMap<(AssetId<StandardMaterial>, u128), Handle<ShadedMaterial>>;

/// After apply_rows: each new mesh row's shader on, and the scene's built if these rows give one (a load clears the
/// last edit's first).
pub fn shade_rows(world: &mut World, inserted: &[Tup]) -> Result<(), String> {
    world.remove_resource::<shader_ext::own::OwnMade>(); // a load's <Material>s share only among themselves
    if let Some(t) = inserted.iter().find(|t| t.kind == "surface_shader") {
        let v = spec(t)?;
        let ext = shader_ext::build(world, &v, plugins::image).map_err(|e| format!("SurfaceShader: {e}"))?;
        world.insert_resource(SceneShader(ext));
    }
    let todo: Vec<Entity> = world.query_filtered::<Entity, With<MeshShader>>().iter(world).collect();
    let mut made = Made::new();
    for e in todo {
        let Some(s) = world.entity_mut(e).take::<MeshShader>() else { continue };
        shader_ext::put(world, e, &s.spec, plugins::image, &mut made).map_err(|err| format!("mesh {}: shader: {err}", s.id))?;
    }
    pass_rows(world, inserted)?;
    compute_rows(world, inserted)
}

/// Rows of `kind` in the order written (`kind`0 first).
fn ordered<'a>(inserted: &'a [Tup], kind: &str) -> Vec<&'a Tup> {
    let mut rows: Vec<&Tup> = inserted.iter().filter(|t| t.kind == kind).collect();
    rows.sort_by_key(|t| t.id.trim_start_matches(kind).parse::<usize>().unwrap_or(0));
    rows
}

/// The frame's <Compute>s (compute rows) built, in order, as the frame's computes (docs/shaders.feature SH10); a load
/// with none clears the last edit's.
fn compute_rows(world: &mut World, inserted: &[Tup]) -> Result<(), String> {
    let mut list = Vec::new();
    for t in ordered(inserted, "compute") {
        let v = spec(t)?;
        let mut c = raea_sys_compute::build(world, &v, &t.id, plugins::image).map_err(|e| format!("Compute: {e}"))?;
        if let Some(w) = c.written.as_mut() {
            let all = |k: &str| raea_sys_frame::keyed_all(&t.vals, k);
            raea_sys_compute::written::check(w, &all("entry"), &all("bind")).map_err(|e| format!("Compute {}: {e}", t.id))?;
        }
        list.push(c);
    }
    world.get_resource_or_insert_with(raea_sys_compute::Computes::default).list = list;
    Ok(())
}

/// A shader row's spec (its `shader` column, JSON).
fn spec(t: &Tup) -> Result<serde_json::Value, String> {
    let Some(V::S(s)) = t.vals.get("shader") else { return Err(format!("{}: a shader needs its source", t.id)) };
    serde_json::from_str(s).map_err(|e| format!("{}: shader: {e}", t.id))
}

/// The frame's <FramePass>es (frame_pass rows, frame_pass0 first) built and put on the scene's camera (docs/shaders.feature
/// SH6), not on a camera drawing into a render:NAME image or a look's composite.
fn pass_rows(world: &mut World, inserted: &[Tup]) -> Result<(), String> {
    let rows = ordered(inserted, "frame_pass");
    if rows.is_empty() {
        return Ok(());
    }
    let mut passes = Vec::new();
    for t in rows {
        let v = spec(t)?;
        let mut pass = raea_sys_framepass::build(world, &v, plugins::image).map_err(|e| format!("FramePass: {e}"))?;
        if let Some(w) = pass.written.as_mut() {
            w.id = t.id.clone();
        }
        if let Some(i) = pass.inline.as_mut() {
            i.id = t.id.clone();
        }
        passes.push(pass);
    }
    let cams: Vec<Entity> = world.query_filtered::<(Entity, &Camera), (With<Camera3d>, Without<BareEntity>)>().iter(world).filter(|(_, c)| c.order == 0).map(|(e, _)| e).collect();
    for c in cams {
        raea_sys_framepass::put(world, c, passes.clone());
    }
    Ok(())
}

/// A model row's `shader` column: its specs, each with the glTF material it names.
pub fn model_shaders(t: &Tup) -> Result<Vec<(Option<String>, serde_json::Value)>, String> {
    let Some(V::S(s)) = t.vals.get("shader") else { return Ok(Vec::new()) };
    let list: Vec<serde_json::Value> = serde_json::from_str(s).map_err(|e| format!("model {}: shader: {e}", t.id))?;
    Ok(list.into_iter().map(|v| (v.get("material").and_then(serde_json::Value::as_str).map(str::to_string), v)).collect())
}

/// A model's meshes given their shaders once its scene is spawned (after its surfaces and toon, toon_models): each glTF
/// material the spec for its name covers swapped for a shaded one over it, shared materials swapped once. Returns
/// whether it found the meshes.
pub fn shade_model(world: &mut World, root: Entity, specs: &[(Option<String>, serde_json::Value)]) -> Result<bool, String> {
    let mut stack = vec![root];
    let mut found = Vec::new();
    while let Some(x) = stack.pop() {
        if let Some(c) = world.get::<Children>(x) {
            stack.extend(c.iter());
        }
        if world.get::<Mesh3d>(x).is_some() && world.get::<MeshMaterial3d<StandardMaterial>>(x).is_some() {
            found.push((x, world.get::<bevy::gltf::GltfMaterialName>(x).map(|n| n.0.clone())));
        }
    }
    if found.is_empty() {
        return Ok(false);
    }
    let mut built: Vec<Option<ShaderExt>> = vec![None; specs.len()];
    let mut made = Made::new();
    for (x, name) in found {
        let pick = specs.iter().position(|(m, _)| m.is_some() && m.as_deref() == name.as_deref()).or_else(|| specs.iter().position(|(m, _)| m.is_none()));
        let Some(k) = pick else { continue };
        if built[k].is_none() {
            built[k] = Some(shader_ext::build(world, &specs[k].1, plugins::image)?);
        }
        let ext = built[k].clone().unwrap();
        shader_ext::shade(world, x, &ext, &mut made);
    }
    world.entity_mut(root).insert(OwnSurface);
    Ok(true)
}

/// The scene's <SurfaceShader> over every lit standard part without one of its own, once no model is still putting its
/// own surfaces on: a part under a model that keeps its own (a `flat` or looked one, or one shaded by its own spec) is
/// left, as is an unlit part; both are marked so they aren't looked at again.
pub fn shade_scene(world: &mut World) {
    let Some(ext) = world.get_resource::<SceneShader>().map(|s| s.0.clone()) else { return };
    let mut models = world.query::<&Model3d>();
    if models.iter(world).any(|m| !m.settled()) {
        return;
    }
    let mut q = world.query_filtered::<(Entity, &MeshMaterial3d<StandardMaterial>), (With<Mesh3d>, Without<OwnSurface>)>();
    let parts: Vec<(Entity, Handle<StandardMaterial>)> = q.iter(world).map(|(e, m)| (e, m.0.clone())).collect();
    let mut made = Made::new();
    for (e, std) in parts {
        let mut up = world.get::<ChildOf>(e).map(ChildOf::parent);
        let mut own = false;
        while let Some(p) = up {
            if world.get::<OwnSurface>(p).is_some() {
                own = true;
                break;
            }
            up = world.get::<ChildOf>(p).map(ChildOf::parent);
        }
        let Some(unlit) = world.resource::<Assets<StandardMaterial>>().get(&std).map(|m| m.unlit) else { continue };
        if own || unlit {
            world.entity_mut(e).insert(OwnSurface);
            continue;
        }
        shader_ext::shade(world, e, &ext, &mut made);
    }
}
