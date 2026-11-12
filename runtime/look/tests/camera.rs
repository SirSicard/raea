//! The camera rows a scene's cameras make (3d/two_passes, 3d/split_screen): the first is "cam", each after it a row of
//! its own with its order, clear and viewport.

use std::collections::BTreeMap;
use std::sync::Arc;

use bevy::math::Mat4;
use raea_core_program::ir::{Program, V};
use raea_core_scene::Item;
use raea_runtime_look::camera;
use serde_json::json;

fn cam(props: serde_json::Value) -> Item {
    Item { kind: "camera", props: Arc::new(props.as_object().unwrap().clone()), shape: None, material: None, at: None, world: Mat4::IDENTITY }
}

#[test]
fn each_camera_after_the_first_is_a_row_with_its_order_clear_and_viewport() {
    let vp = |x: u32, y: u32| json!({ "physical_position": [x, y], "physical_size": [640, 360] });
    let items = vec![
        cam(json!({ "position": [0, 200, -150], "lookAt": [0, 0, 0], "viewport": vp(0, 0) })),
        cam(json!({ "position": [150, 150, 50], "lookAt": [0, 0, 0], "order": 1, "clear": "none", "viewport": vp(640, 360) })),
    ];
    let mut first: BTreeMap<String, V> = [("id".to_string(), V::S("cam".into())), ("bg".to_string(), V::S("#2B2C2F".into()))].into();
    let more = camera(&[items], &mut Program::default(), &mut first);
    assert_eq!(more.len(), 1);
    let n = |r: &BTreeMap<String, V>, k: &str| r.get(k).map(V::num);
    assert_eq!([n(&first, "vp_x"), n(&first, "vp_y"), n(&first, "vp_w"), n(&first, "vp_h")], [Some(0.0), Some(0.0), Some(640.0), Some(360.0)]);
    assert_eq!(first.get("order"), None);
    let second = &more[0];
    assert!(matches!(second.get("id"), Some(V::S(s)) if s == "cam1"));
    assert!(matches!(second.get("bg"), Some(V::S(s)) if s == "#2B2C2F"));
    assert!(matches!(second.get("clear"), Some(V::S(s)) if s == "none"));
    assert_eq!([n(second, "order"), n(second, "vp_x"), n(second, "vp_y")], [Some(1.0), Some(640.0), Some(360.0)]);
    assert_eq!(n(second, "x"), Some(150.0));
}

#[test]
fn a_camera_with_a_rotation_keeps_it_exactly_and_one_without_has_none() {
    // a Camera3d's quaternion as glam made it (Transform::looking_at from (4, 3, 6) to (0, 0.2, 0)), unrounded: the
    // engine places the camera by it, not by its look-at point turned back into a rotation in f32
    let q = [-0.17622831463813782, 0.28482943773269653, 0.05335763469338417, 0.9407277703285217];
    let mut row: BTreeMap<String, V> = [("id".to_string(), V::S("cam".into()))].into();
    camera(&[vec![cam(json!({ "position": [4, 3, 6], "lookAt": [0, 0.2, 0], "rotation": q }))]], &mut Program::default(), &mut row);
    let got: Vec<Option<f64>> = ["rot_qx", "rot_qy", "rot_qz", "rot_qw"].iter().map(|k| row.get(*k).map(V::num)).collect();
    assert_eq!(got, q.map(Some));
    let mut plain: BTreeMap<String, V> = [("id".to_string(), V::S("cam".into()))].into();
    camera(&[vec![cam(json!({ "position": [4, 3, 6], "lookAt": [0, 0.2, 0], "rotation": [0.1, 0.2, 0.3] }))]], &mut Program::default(), &mut plain);
    assert!(!plain.contains_key("rot_qw"), "a rotation that isn't a quaternion places nothing");
}
