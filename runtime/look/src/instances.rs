//! <Instances> (sdk/render 3d/instances.tsx): a Mesh or Model whose props carry `at`, its placements 9 numbers a copy
//! (position, XYZ euler radians, scale), written as the row's `inst` column: 10 numbers a copy (position, rotation as
//! a quaternion xyzw, scale), space-separated. The engine draws one copy per placement, sharing the mesh and material
//! (runtime/scene3d's instance.rs; rows from runtime/scene). Placements that change over the shot are keyed (inst_all, inst_k).

use super::*;
use bevy::math::{EulerRot, Quat};

fn packed(at: &[Value]) -> Option<String> {
    if at.len() % 9 != 0 {
        eprintln!("WARN  Instances: placements are 9 numbers a copy, got {}", at.len());
        return None;
    }
    let f = |v: &Value| v.as_f64().unwrap_or(0.0);
    let nums: Vec<String> = at
        .chunks(9)
        .flat_map(|c| {
            let q = Quat::from_euler(EulerRot::XYZ, f(&c[3]) as f32, f(&c[4]) as f32, f(&c[5]) as f32);
            [f(&c[0]), f(&c[1]), f(&c[2]), q.x as f64, q.y as f64, q.z as f64, q.w as f64, f(&c[6]), f(&c[7]), f(&c[8])]
        })
        .map(|v| format!("{}", r6(v)))
        .collect();
    Some(nums.join(" "))
}

/// An item's placements as its text: its data-at (#84, shared across frames while unchanged), or an `at` prop written
/// out (a tree from before data-at). Two frames' lists are the same when their texts are.
fn at_text(it: &Item) -> Option<std::borrow::Cow<'_, str>> {
    match (&it.at, it.props.get("at")) {
        (Some(t), _) => Some(std::borrow::Cow::Borrowed(&**t)),
        (None, Some(a @ Value::Array(_))) => Some(std::borrow::Cow::Owned(a.to_string())),
        _ => None,
    }
}

/// The `inst` column of a mesh or model row whose part is an <Instances>: its first frame's placements. When they change
/// over the shot (#85), every list it shows goes in `inst_all` ("|" between lists) and which one each frame shows is keyed
/// as `inst_k`, as a panel's pictures are (src_k): the engine moves its copies to the frame's (scene3d sync_instances).
/// The count is the first frame's: a frame with another count holds the list before it.
pub fn instances_column(p: &mut Program, row: &mut BTreeMap<String, V>, id: &str, its: &[Item]) {
    let parse = |t: &str| serde_json::from_str::<Vec<Value>>(t).ok();
    let Some(first_text) = at_text(&its[0]) else { return };
    let Some(at) = parse(&first_text) else { return };
    let Some(first) = packed(&at) else { return };
    // each frame's list against the one before it only, by its text (the same Arc when React kept it): parsed only
    // when it differs (a frame without one holds the one before)
    let (mut lists, mut k, mut before, mut recounted) = (vec![first], Vec::with_capacity(its.len()), first_text, false);
    for it in its {
        if let Some(t) = at_text(it).filter(|t| *t != before) {
            match parse(&t).filter(|a| a.len() == at.len()).and_then(|a| packed(&a)) {
                Some(s) => {
                    lists.push(s);
                    before = t;
                }
                None => recounted = true,
            }
        }
        k.push((lists.len() - 1) as f64);
    }
    if recounted {
        eprintln!("WARN  Instances {}: how many copies it has changes over the shot; a frame with another count holds the placements before it", its[0].props.get("name").and_then(Value::as_str).unwrap_or("?"));
    }
    row.insert("inst".into(), V::S(lists[0].clone()));
    if lists.len() > 1 {
        row.insert("inst_all".into(), V::S(lists.join("|")));
        exact(p, row, id, "inst_k", &k);
    }
}

/// A model row's shadows (a mesh row writes its own): `shadow={false}` casts none, `receiveShadow={false}` takes none
/// (the engine marks each of its meshes, and an <Instances>' copies).
pub fn model_shadows(row: &mut BTreeMap<String, V>, its: &[Item]) {
    if its[0].props.get("shadow") == Some(&Value::Bool(false)) {
        row.insert("shadow".into(), V::N(0.0));
    }
    if its[0].props.get("receiveShadow") == Some(&Value::Bool(false)) {
        row.insert("receive".into(), V::N(0.0));
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn part(x: f64) -> Item {
        let at = serde_json::json!({"at": [x, 0, 0, 0, 0, 0, 1, 1, 1, x + 1.0, 0, 0, 0, 0, 0, 1, 1, 1]});
        Item { kind: "mesh", props: std::sync::Arc::new(at.as_object().unwrap().clone()), shape: None, material: None, at: None, world: Default::default() }
    }

    // #85: a video drew the first frame's placements on every frame
    #[test]
    fn placements_that_change_are_keyed_frame_by_frame() {
        let (mut p, mut row) = (Program::default(), BTreeMap::new());
        instances_column(&mut p, &mut row, "m0", &[part(0.0), part(0.0), part(2.0), part(5.0)]);
        assert_eq!(row.get("inst"), Some(&V::S("0 0 0 0 -0 0 1 1 1 1 1 0 0 0 -0 0 1 1 1 1".into())));
        let Some(V::S(all)) = row.get("inst_all") else { panic!("inst_all: {row:?}") };
        assert_eq!(all.split('|').count(), 3, "one list a change: {all}");
        assert!(all.split('|').nth(2).unwrap().starts_with("5 0 0 "));
        let k: Vec<f64> = p.keys[&("m0".to_string(), "inst_k".to_string())].iter().map(|k| k.1).collect();
        assert_eq!(k, [0.0, 0.0, 1.0, 2.0]);
    }

    #[test]
    fn still_placements_are_one_column() {
        let (mut p, mut row) = (Program::default(), BTreeMap::new());
        instances_column(&mut p, &mut row, "m0", &[part(1.0), part(1.0)]);
        assert!(row.contains_key("inst") && !row.contains_key("inst_all") && p.keys.is_empty());
    }
}
