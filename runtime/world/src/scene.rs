//! A frame's 3D as entities: footage behind it (a Plate), the 3D layer with its camera and parts under it, and the 2D
//! drawn over it (Sprite, Shape2D). Parts are measured from their triangles in the world (core/scene own_tris), as the
//! clipping check measures them.

use std::path::Path;

use bevy::math::{DVec3, Vec3};
use raea_core_facts::*;
use raea_core_scene::{num, vec3, Item};
use serde_json::Value;

/// The frame's camera, its velocity from where its eye is on the next frame.
pub(crate) fn camera(its: &[Item], next: Option<&[Item]>, fps: f64) -> Option<Camera> {
    // where a frame's camera is (raea-runtime-look camera.rs: 5 m back when it doesn't say)
    fn eye_of(its: &[Item]) -> Option<(&Item, [f64; 3])> {
        let c = its.iter().find(|i| i.kind == "camera")?;
        Some((c, vec3(&c.props, "position", [0.0, 0.0, 5.0])))
    }
    let (c, eye) = eye_of(its)?;
    let then = next.and_then(eye_of);
    Some(Camera {
        eye,
        look: vec3(&c.props, "lookAt", [0.0, 0.0, 0.0]),
        // Bevy's perspective by default (raea-runtime-look camera.rs: 50 degrees), its own near and far when given
        fov: (!c.props.contains_key("ortho")).then(|| num(&c.props, "fov").unwrap_or(50.0)),
        ortho: num(&c.props, "ortho"),
        near: num(&c.props, "near").unwrap_or(0.1),
        far: num(&c.props, "far").unwrap_or(1000.0),
        velocity: then.map(|(_, t)| ((DVec3::from_array(t) - DVec3::from_array(eye)) * fps).to_array()),
    })
}

/// Text3D's words, size, depth and font from its shape (`text3d("WORDS", size, depth, "font", weight)`).
pub(crate) fn text3d(shape: &str) -> Option<(String, f64, String)> {
    let inner = shape.strip_prefix("text3d(")?.strip_suffix(')')?;
    let (words, rest) = inner.strip_prefix('"')?.split_once('"')?;
    let mut args = rest.trim_start_matches(',').split(',').map(str::trim);
    let (_size, depth, font) = (args.next()?, args.next()?.parse().ok()?, args.next()?.trim_matches('"').to_string());
    Some((words.to_string(), depth, font))
}

fn f3(v: Vec3) -> [f64; 3] {
    [v.x as f64, v.y as f64, v.z as f64]
}

/// A mesh's or model's Part: where it is, its world box and triangles (None when raea can't read its triangles).
pub(crate) fn part(it: &Item) -> Part {
    let (scale, rot, at) = it.world.to_scale_rotation_translation();
    let tris = raea_core_scene::own_tris(it).ok();
    let (mut lo, mut hi, mut n) = (Vec3::splat(f32::MAX), Vec3::splat(f32::MIN), 0u32);
    let (mut own_lo, mut own_hi) = (lo, hi);
    for (_, ts) in tris.iter().flat_map(|t| t.0.iter()) {
        for t in ts {
            n += 1;
            for &p in t {
                (own_lo, own_hi) = (own_lo.min(p), own_hi.max(p));
                let p = it.world.transform_point3(p);
                (lo, hi) = (lo.min(p), hi.max(p));
            }
        }
    }
    let material = it.material.as_ref();
    Part {
        kind: if it.shape.as_deref().is_some_and(|s| s.starts_with("text3d(")) { "text3d".into() } else { it.kind.to_string() },
        name: raea_core_scene::label(it, ""),
        tags: Vec::new(),
        at: f3(at),
        rotation: [rot.x, rot.y, rot.z, rot.w].map(f64::from),
        scale: f3(scale),
        min: (n > 0).then(|| f3(lo)),
        max: (n > 0).then(|| f3(hi)),
        own: (n > 0).then(|| [f3(own_lo), f3(own_hi)]),
        triangles: tris.is_some().then_some(n),
        src: it.props.get("src").and_then(Value::as_str).map(str::to_string),
        material: material.map(|m| m.kind.to_string()),
        color: material.and_then(|m| m.props.get("base_color").or_else(|| m.props.get("color"))).and_then(Value::as_str).map(str::to_string),
    }
}

fn layer(facts: &mut Facts, parent: Option<u32>, medium: Medium, order: &mut u32) -> u32 {
    let e = facts.spawn(parent);
    facts.put(e, &Layer { medium, order: *order, opacity: 1.0, blend: None });
    *order += 1;
    e
}

fn sourced(facts: &mut Facts, e: u32, it: &Item, dir: &Path) {
    if let Some(s) = crate::source::of(&it.props, dir) {
        facts.put(e, &s);
    }
}

/// The frame's 3D into `facts`, from the back: plates, the 3D layer (camera, parts, 3D text), then 2D over it.
pub(crate) fn put(facts: &mut Facts, its: &[Item], next: Option<&[Item]>, fps: f64, dir: &Path, order: &mut u32) {
    for it in its.iter().filter(|i| i.kind == "plate") {
        let e = layer(facts, None, Medium::Footage, order);
        let src = it.props.get("src").and_then(Value::as_str).unwrap_or_default();
        facts.put(e, &Clip { source: raea_core_scene::media_path(dir, src).display().to_string(), hash: None, time: num(&it.props, "time"), in_: 0.0, out: None, at: 0, words: Vec::new() });
        sourced(facts, e, it, dir);
    }
    let shown = |i: &&Item| !matches!(i.kind, "plate" | "sprite" | "shape2d");
    if its.iter().filter(shown).next().is_some() {
        let l = layer(facts, None, Medium::Scene3d, order);
        if let Some(c) = camera(its, next, fps) {
            let e = facts.spawn(Some(l));
            facts.put(e, &c);
        }
        for it in its.iter().filter(|i| matches!(i.kind, "mesh" | "model" | "text")) {
            let e = facts.spawn(Some(l));
            if it.kind == "text" {
                let words = it.props.get("text").and_then(Value::as_str).unwrap_or_default().to_string();
                let font = it.props.get("spans").and_then(|s| s.get(0)).and_then(|s| s.get("font")).and_then(Value::as_str).map(str::to_string);
                facts.put(e, &Text { words, font, size: None, box_: None, extruded: num(&it.props, "depth").unwrap_or(0.0), lines: None, needs: None });
            } else {
                if let Some((words, depth, font)) = it.shape.as_deref().and_then(text3d) {
                    facts.put(e, &Text { words, font: Some(font), size: None, box_: None, extruded: depth, lines: Some(1), needs: None });
                }
                facts.put(e, &part(it));
            }
            sourced(facts, e, it, dir);
        }
    }
    for it in its.iter().filter(|i| matches!(i.kind, "sprite" | "shape2d")) {
        let e = layer(facts, None, Medium::Graphic2d, order);
        sourced(facts, e, it, dir);
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use bevy::math::Mat4;
    use std::sync::Arc;

    fn item(kind: &'static str, props: Value, shape: Option<&str>, world: Mat4) -> Item {
        Item { kind, props: Arc::new(props.as_object().cloned().unwrap_or_default()), shape: shape.map(Arc::from), material: None, at: None, world }
    }

    #[test]
    fn a_text3d_shape_reads_as_its_words_depth_and_font() {
        assert_eq!(text3d(r#"text3d("OUT NOW", 0.5, 0.2, "Inter", 800)"#), Some(("OUT NOW".into(), 0.2, "Inter".into())));
        assert_eq!(text3d("box(1, 1, 1)"), None);
    }

    #[test]
    fn the_3d_is_one_layer_with_its_camera_and_measured_parts_under_it() {
        let cam = |z: f64| item("camera", serde_json::json!({"position": [0.0, 1.0, z], "lookAt": [0.0, 0.0, 0.0], "fov": 35.0}), None, Mat4::IDENTITY);
        let cube = item("mesh", serde_json::json!({"name": "seat"}), Some("box(2, 1, 1)"), Mat4::from_translation(Vec3::new(3.0, 0.5, 0.0)));
        let word = item("mesh", serde_json::json!({}), Some(r#"text3d("HI", 0.5, 0.2, "Inter", 800)"#), Mat4::IDENTITY);
        let mut facts = Facts::new(0, 1920, 1080, 30.0);
        let mut order = 0;
        put(&mut facts, &[cam(10.0), cube, word], Some(&[cam(9.0)]), 30.0, Path::new("/nowhere"), &mut order);
        let layers = facts.find(&["Layer"]);
        assert_eq!(layers.len(), 1);
        assert_eq!(facts.get::<Layer>(layers[0].id).unwrap().medium, Medium::Scene3d);
        let c: Camera = facts.get(facts.find(&["Camera"])[0].id).unwrap();
        assert_eq!((c.fov, c.velocity), (Some(35.0), Some([0.0, 0.0, -30.0])), "a push in: a metre a frame at 30 fps");
        let seat: Part = facts.get(facts.find(&["Part"])[0].id).unwrap();
        assert_eq!((seat.name.as_str(), seat.min, seat.max, seat.triangles), ("seat", Some([2.0, 0.0, -0.5]), Some([4.0, 1.0, 0.5]), Some(12)));
        let t = facts.find(&["Text", "Part"]);
        assert_eq!(t.len(), 1, "3D text is a Text and a Part");
        assert_eq!(facts.get::<Text>(t[0].id).unwrap().extruded, 0.2);
        assert!(facts.find(&["Part"]).iter().all(|p| p.parent == Some(layers[0].id)));
    }

    #[test]
    fn what_a_part_is_comes_from_its_shape_not_what_its_author_called_it() {
        let claims = serde_json::json!({"name": "SALE", "text": "SALE", "kind": "text3d", "depth": 0.2});
        let mut facts = Facts::new(0, 1920, 1080, 30.0);
        put(&mut facts, &[item("mesh", claims, Some("box(1, 1, 1)"), Mat4::IDENTITY)], None, 30.0, Path::new("/nowhere"), &mut 0);
        assert!(facts.find(&["Text"]).is_empty(), "a box named SALE is not 3D text");
        assert_eq!(facts.get::<Part>(facts.find(&["Part"])[0].id).unwrap().kind, "mesh");
    }
}
