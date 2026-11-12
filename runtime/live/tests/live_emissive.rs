//! A mesh's emissive in live 3D (an mp4 render draws a video's 3D live: raea-runtime-scene live.rs) follows its colour,
//! not only its strength. Tested here: raea-runtime-scene is at its 2,000-line limit.
use raea_core_program::ir::V;
use raea_runtime_react::scene::{LiveScene, Node3, Shot};

fn ball(emissive: &str, k: f64) -> Vec<Node3> {
    let node = |kind: &str, props: serde_json::Value, kids: Vec<Node3>| Node3 { kind: kind.into(), props: std::sync::Arc::new(props.as_object().unwrap().clone()), shape: None, at: None, kids: kids.into() };
    let mat = node("MeshStandardMaterial", serde_json::json!({"color": "#000000", "emissive": emissive, "emissive_nits": k}), vec![]);
    let mut mesh = node("Mesh", serde_json::json!({"name": "ball"}), vec![mat]);
    mesh.shape = Some("sphere(1)".into());
    vec![mesh]
}

/// A ball dark on its first frame glows blue from a later one, turns orange, and goes dark again: each change sends
/// the colour with its strength, on the fast path as on the full one (RAEA_LIVE3D_CHECK holds each fast frame against
/// the full path's). #106: a video kept the first frame's colour, so one that started black stayed black.
#[test]
fn a_live_mesh_sends_its_emissive_colour_when_it_changes() {
    // SAFETY: this binary's only test, so no other thread reads the environment
    unsafe { std::env::set_var("RAEA_LIVE3D_CHECK", "1") };
    let mut ls = LiveScene::default();
    ls.open(Shot { scene: &ball("#000000", 0.0), clear: None }, 64, 64, 30.0);
    let mut frame = |scene: Vec<Node3>| ls.frame(Shot { scene: &scene, clear: None }).0;
    let mesh = |set: &[raea_core_program::eval::Tup]| set.iter().find(|t| t.kind == "mesh").map(|t| (t.vals.get("emissive").cloned(), t.vals.get("emissive_k").map(V::num)));
    // still dark: no emissive sent (the first frame after open sends a mesh's visible column, as the full path always has)
    assert_eq!(mesh(&frame(ball("#000000", 0.0))).filter(|(e, k)| e.is_some() || k.is_some()), None);
    // from dark to blue: the colour and its strength
    assert_eq!(mesh(&frame(ball("#3399ff", 2.0))), Some((Some(V::S("#3399ff".into())), Some(2.0))));
    // the same again: nothing
    assert!(frame(ball("#3399ff", 2.0)).is_empty());
    // another hue at the same strength: the colour alone
    assert_eq!(mesh(&frame(ball("#ff8800", 2.0))), Some((Some(V::S("#ff8800".into())), None)));
    // dark again: black at no strength
    assert_eq!(mesh(&frame(ball("#000000", 2.0))), Some((Some(V::S("#000000".into())), Some(0.0))));
    assert!(frame(ball("#000000", 0.0)).is_empty());
}
