//! An ImagePlane in live 3D (an mp4 render draws a video's 3D live: raea-runtime-scene live.rs) plays its sheet and
//! swaps its picture. Tested here: raea-runtime-scene is at its 2,000-line limit.
use raea_core_program::ir::V;
use raea_runtime_react::scene::{LiveScene, Node3, Shot};

fn plane(src: &str, grid: [u32; 2], frame: u32) -> Vec<Node3> {
    let props = serde_json::json!({"name": "film", "src": src, "width": 1, "grid": grid, "frame": frame});
    vec![Node3 { kind: "ImagePlane".into(), props: std::sync::Arc::new(props.as_object().unwrap().clone()), shape: None, at: None, kids: Vec::new().into() }]
}

/// Each frame sends the cell, and a swap to a sheet of another grid sends its src and grid, on the fast path as on the
/// full one (RAEA_LIVE3D_CHECK holds each fast frame against the full path's). 0.1.1's showreel held frame 0's cell and
/// picture for a whole mp4 (11-10).
#[test]
fn a_live_plane_plays_its_sheet_and_swaps_its_picture() {
    // SAFETY: this binary's only test, so no other thread reads the environment
    unsafe { std::env::set_var("RAEA_LIVE3D_CHECK", "1") };
    let mut ls = LiveScene::default();
    ls.open(Shot { scene: &plane("data:a", [2, 1], 0), clear: None }, 64, 64, 30.0);
    let mut frame = |scene: Vec<Node3>| ls.frame(Shot { scene: &scene, clear: None }).0;
    let set = frame(plane("data:a", [2, 1], 1));
    assert_eq!((set.len(), set[0].vals.get("sheet_frame")), (1, Some(&V::N(1.0))));
    let set = frame(plane("data:b", [1, 2], 1));
    let v = &set.iter().find(|t| t.kind == "panel").unwrap().vals;
    assert_eq!((v.get("src"), v.get("sheet_cols"), v.get("sheet_rows")), (Some(&V::S("data:b".into())), Some(&V::N(1.0)), Some(&V::N(2.0))));
    assert!(frame(plane("data:b", [1, 2], 1)).is_empty());
}
