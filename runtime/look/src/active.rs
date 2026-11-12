//! Which camera draws the output, frame by frame (docs/rerender.feature RR2). A scene may hold several cameras, each
//! active on a frame or not (<Camera3d is_active>, Bevy's Camera is_active); the first active one in tree order is the
//! piece's. The frame another becomes the piece's is a cut: the camera row's stepped `shot` marks it, and the engine
//! draws that frame as a shot rendered alone draws its first (raea-sys-frame's Shots).
use super::*;

/// A frame's parts with its inactive cameras (`active: false`) taken out, and the first left stamped `shot` with its
/// place among all the frame's cameras, when it isn't the first: the shot that frame belongs to. A frame with every
/// camera inactive keeps none, and holds the nearest frame's camera as a frame without one does (filled).
pub fn active_cameras(out: &mut Vec<Item>) {
    let first = out.iter().filter(|i| i.kind == "camera").position(|i| !inactive(i));
    if let Some(k) = first.filter(|k| *k > 0) {
        if let Some(c) = out.iter_mut().filter(|i| i.kind == "camera").nth(k) {
            std::sync::Arc::make_mut(&mut c.props).insert("shot".into(), Value::from(k));
        }
    }
    out.retain(|i| !inactive(i));
}

/// A camera drawing nothing this frame (<Camera3d is_active={false}>).
fn inactive(i: &Item) -> bool {
    i.kind == "camera" && matches!(i.props.get("active"), Some(Value::Bool(false)))
}

/// The camera row's `shot` (`cams`: each frame's piece camera, filled), keyed by step where it changes, so a cut is a
/// key: nothing while the first camera is the piece's throughout.
pub fn shot_column(p: &mut Program, row: &mut BTreeMap<String, V>, id: &str, cams: &[Item]) {
    let shots: Vec<f64> = cams.iter().map(|c| num(&c.props, "shot").unwrap_or(0.0)).collect();
    if shots.iter().all(|s| *s == 0.0) {
        return;
    }
    row.insert("shot".into(), V::N(shots[0]));
    // a key at the first frame and at each cut: a step holds its value until the next key's frame
    let keys = step_keys(&shots);
    if keys.len() > 1 {
        p.keys.insert((id.to_string(), "shot".to_string()), keys);
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn cam(x: f64, active: Option<bool>) -> Item {
        let mut props = Map::new();
        props.insert("position".into(), serde_json::json!([x, 1.0, 5.0]));
        if let Some(a) = active {
            props.insert("active".into(), Value::Bool(a));
        }
        Item { kind: "camera", props: std::sync::Arc::new(props), shape: None, material: None, at: None, world: bevy::math::Mat4::IDENTITY }
    }

    #[test]
    fn the_first_active_camera_draws_and_says_its_shot() {
        let mut a = vec![cam(0.0, None), cam(1.0, Some(false))];
        active_cameras(&mut a);
        assert_eq!(a.len(), 1);
        assert_eq!(a[0].props.get("shot"), None);
        let mut b = vec![cam(0.0, Some(false)), cam(1.0, None)];
        active_cameras(&mut b);
        assert_eq!(b.len(), 1);
        assert_eq!(b[0].props.get("position"), Some(&serde_json::json!([1.0, 1.0, 5.0])));
        assert_eq!(b[0].props.get("shot"), Some(&Value::from(1)));
        let mut none = vec![cam(0.0, Some(false)), cam(1.0, Some(false))];
        active_cameras(&mut none);
        assert!(none.is_empty());
    }

    #[test]
    fn a_cut_is_a_step_key() {
        let frames: Vec<Item> = [0, 0, 0, 1, 1, 0].iter().map(|k| {
            let mut v = vec![cam(0.0, Some(*k == 0)), cam(1.0, Some(*k == 1))];
            active_cameras(&mut v);
            v.remove(0)
        }).collect();
        let (mut p, mut row) = (Program::default(), BTreeMap::new());
        shot_column(&mut p, &mut row, "cam", &frames);
        assert_eq!(row.get("shot"), Some(&V::N(0.0)));
        let keys = &p.keys[&("cam".to_string(), "shot".to_string())];
        assert_eq!(keys.iter().map(|k| (k.0, k.1)).collect::<Vec<_>>(), vec![(0, 0.0), (3, 1.0), (5, 0.0)]);
        // one camera throughout: no column
        let (mut p, mut row) = (Program::default(), BTreeMap::new());
        shot_column(&mut p, &mut row, "cam", &frames[..3]);
        assert!(row.get("shot").is_none() && p.keys.is_empty());
    }
}
