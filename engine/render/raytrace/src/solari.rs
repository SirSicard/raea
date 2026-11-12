//! RT3 (docs/raytracing.feature): Bevy's Solari, ray-traced lighting, for a scene whose camera asks for it
//! (<SolariLighting> or <Pathtracer> in raea/3d: SolariLighting or Pathtracer under <Camera3d>). Its plugins come in
//! only then: SolariLightingPlugin makes every opaque material deferred, which would change every other scene.
//! The shared GPU device asks for every feature its adapter has (raea-gpu-device), so ray queries are on where the GPU
//! has them; where it doesn't, Solari's plugins say so and the scene draws with raster lighting.
//!
//! Solari traces a mesh only in one layout (positions, normals, UV 0, tangents, nothing else, u32 indices), so each
//! mesh gets a copy in that layout for its RaytracingMesh3d, made once per mesh. Skinned and morphed meshes (a
//! <Character>) are left raster-lit, as Solari 0.20 can't trace them (RT5).

use super::*;
use bevy::camera::CameraMainTextureUsages;
use bevy::core_pipeline::prepass::{DeferredPrepass, DepthPrepass};
use bevy::mesh::{Indices, PrimitiveTopology, VertexAttributeValues};
use bevy::solari::pathtracer::{Pathtracer, PathtracingPlugin};
use bevy::solari::prelude::{RaytracingMesh3d, SolariLighting, SolariPlugins};

pub fn add(app: &mut App) {
    app.add_plugins((SolariPlugins, PathtracingPlugin)).add_systems(PostUpdate, (cameras, meshes).before(bevy::camera::CameraUpdateSystems));
}

/// A camera or mesh already set up (or left out).
#[derive(Component)]
struct Done;

// Solari's camera needs: no MSAA and a main texture it can write to (SolariLighting's docs); Hdr, the prepasses and
// deferred come with SolariLighting's required components. Pathtracer requires only Hdr, but SolariPlugins makes every
// StandardMaterial deferred, so a Pathtracer camera without a deferred prepass panicked on its first frame (Bevy's
// prepass queue unwraps the view's opaque deferred phase): it gets the depth and deferred prepasses too.
fn cameras(mut cmd: Commands, q: Query<(Entity, Option<&CameraMainTextureUsages>, Has<Pathtracer>), (Or<(With<SolariLighting>, With<Pathtracer>)>, Without<Done>)>) {
    for (e, u, path) in &q {
        let usages = u.map_or_else(|| CameraMainTextureUsages::default().0, |u| u.0) | bevy::render::render_resource::TextureUsages::STORAGE_BINDING;
        cmd.entity(e).insert((Msaa::Off, CameraMainTextureUsages(usages), Done));
        if path {
            cmd.entity(e).insert_if_new((DepthPrepass, DeferredPrepass));
        }
    }
}

type Pending = (With<MeshMaterial3d<StandardMaterial>>, Without<RaytracingMesh3d>, Without<Done>);

fn meshes(
    mut cmd: Commands,
    on: Query<(), Or<(With<SolariLighting>, With<Pathtracer>)>>,
    q: Query<(Entity, &Mesh3d, &MeshMaterial3d<StandardMaterial>, Has<bevy::mesh::skinning::SkinnedMesh>, Has<bevy::mesh::morph::MeshMorphWeights>), Pending>,
    mats: Res<Assets<StandardMaterial>>,
    mut assets: ResMut<Assets<Mesh>>,
    mut copies: Local<HashMap<AssetId<Mesh>, Option<Handle<Mesh>>>>,
    mut said: Local<bool>,
) {
    if on.is_empty() {
        return;
    }
    for (e, m, mat, skinned, morphed) in &q {
        // what it adds to or tints is all it does: traced, Solari took it as an opaque card (a wind's dust and air
        // streaks, additive sprites, cut a sunlit wall's light by a quarter). Left untraced it still draws, forward
        match mats.get(&mat.0).map(|m| traced_alpha(m.alpha_mode)) {
            Some(false) => {
                cmd.entity(e).insert(Done);
                continue;
            }
            // its material not made yet: decided on a later frame
            None => continue,
            Some(true) => {}
        }
        if skinned || morphed {
            if !*said {
                *said = true;
                eprintln!("raea: <SolariLighting>: a skinned or morphed mesh (a <Character>) draws raster-lit; Bevy 0.20's Solari can't trace it (docs/raytracing.feature RT5)");
            }
            cmd.entity(e).insert(Done);
            continue;
        }
        // each mesh's traceable form, made once: itself when it's in Solari's layout, else a copy; None when it can't
        // be traced (not triangles, no normals, or its data only on the GPU)
        let h = match copies.get(&m.0.id()) {
            Some(h) => h.clone(),
            None => {
                let Some(t) = assets.get(&m.0).map(traceable) else { continue };
                let h = match t {
                    Some(Traceable::Same) => Some(m.0.clone()),
                    Some(Traceable::Copy(mesh)) => Some(assets.add(mesh)),
                    None => None,
                };
                copies.insert(m.0.id(), h.clone());
                h
            }
        };
        match h {
            Some(h) => cmd.entity(e).insert((RaytracingMesh3d(h), Done)),
            None => cmd.entity(e).insert(Done),
        };
    }
}

/// Whether a surface of this alpha mode is in the traced scene: not one that only adds light to what is behind it or
/// multiplies it (a glow, a spark, dust, a tint), which has nothing of its own to block or bounce.
fn traced_alpha(mode: AlphaMode) -> bool {
    !matches!(mode, AlphaMode::Add | AlphaMode::Multiply)
}

enum Traceable {
    Same,
    Copy(Mesh),
}

fn traceable(src: &Mesh) -> Option<Traceable> {
    if src.primitive_topology() != PrimitiveTopology::TriangleList {
        return None;
    }
    // a mesh whose data went to the GPU alone (RenderAssetUsages::RENDER_WORLD, as raea-sys-grass makes its blades) can't
    // be read here: Bevy's plain accessors panic on it, so it's read with the try_ ones and left untraced. It still
    // draws into the G-buffer, lit by Solari; it just isn't in the traced scene
    let ids: Vec<_> = src.try_attributes().ok()?.map(|(a, _)| a.id).collect();
    let indices = src.try_indices_option().ok()?;
    let layout = [Mesh::ATTRIBUTE_POSITION.id, Mesh::ATTRIBUTE_NORMAL.id, Mesh::ATTRIBUTE_UV_0.id, Mesh::ATTRIBUTE_TANGENT.id];
    if ids == layout && matches!(indices, Some(Indices::U32(_))) {
        return Some(Traceable::Same);
    }
    let pos = src.attribute(Mesh::ATTRIBUTE_POSITION)?.clone();
    let n = pos.len();
    let normal = src.attribute(Mesh::ATTRIBUTE_NORMAL)?.clone();
    let uv = src.attribute(Mesh::ATTRIBUTE_UV_0).cloned().unwrap_or(VertexAttributeValues::Float32x2(vec![[0.0, 0.0]; n]));
    let mut out = Mesh::new(PrimitiveTopology::TriangleList, bevy::asset::RenderAssetUsages::default());
    out.insert_attribute(Mesh::ATTRIBUTE_POSITION, pos);
    out.insert_attribute(Mesh::ATTRIBUTE_NORMAL, normal);
    out.insert_attribute(Mesh::ATTRIBUTE_UV_0, uv);
    let idx: Vec<u32> = match indices {
        Some(Indices::U32(v)) => v.clone(),
        Some(Indices::U16(v)) => v.iter().map(|&i| i as u32).collect(),
        None => (0..n as u32).collect(),
    };
    out.insert_indices(Indices::U32(idx));
    match src.attribute(Mesh::ATTRIBUTE_TANGENT) {
        Some(t) => out.insert_attribute(Mesh::ATTRIBUTE_TANGENT, t.clone()),
        None => out.generate_tangents().ok()?,
    }
    Some(Traceable::Copy(out))
}

#[cfg(test)]
mod tests {
    use super::*;
    use bevy::asset::RenderAssetUsages;

    fn quad(usage: RenderAssetUsages) -> Mesh {
        let mut m = Mesh::new(PrimitiveTopology::TriangleList, usage);
        m.insert_attribute(Mesh::ATTRIBUTE_POSITION, vec![[0.0f32, 0.0, 0.0], [1.0, 0.0, 0.0], [0.0, 1.0, 0.0]]);
        m.insert_attribute(Mesh::ATTRIBUTE_NORMAL, vec![[0.0f32, 0.0, 1.0]; 3]);
        m.insert_indices(Indices::U16(vec![0, 1, 2]));
        m
    }

    #[test]
    fn an_additive_or_multiplying_surface_is_not_traced() {
        // additive dust cards traced as opaque shaded a sunlit wall; opaque, masked and blended surfaces stay traced
        assert!(!traced_alpha(AlphaMode::Add) && !traced_alpha(AlphaMode::Multiply));
        assert!(traced_alpha(AlphaMode::Opaque) && traced_alpha(AlphaMode::Blend) && traced_alpha(AlphaMode::Mask(0.5)));
    }

    #[test]
    fn a_mesh_on_the_gpu_alone_is_left_untraced_not_a_panic() {
        // raea-sys-grass's blades: RENDER_WORLD only, their data taken when Bevy extracts them (RR0's film panicked on them)
        let mut grass = quad(RenderAssetUsages::RENDER_WORLD);
        let _ = grass.take_gpu_data().expect("a fresh mesh's data can be taken");
        assert!(traceable(&grass).is_none());
        // a mesh still in the main world is copied into Solari's layout, its u16 indices widened
        match traceable(&quad(RenderAssetUsages::default())) {
            Some(Traceable::Copy(m)) => assert!(matches!(m.indices(), Some(Indices::U32(v)) if v == &vec![0, 1, 2])),
            _ => panic!("a readable triangle mesh is traceable"),
        }
    }
}
