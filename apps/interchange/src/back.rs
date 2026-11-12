//! What changed in Blender or Godot, as edits to the TSX at their lines (docs/blender.feature BL39, docs/godot.feature
//! GD13). The scene went out as scene.json; Blender's or Godot's reader (sdk/blender/src/scene.ts's readBack,
//! sdk/godot/src/host/back.ts) writes what it holds now in the same terms (raea's axes, each object's raea_id), and this
//! compares the two at the first frame sent. Nothing in the TSX is changed here: the agent makes the edits.

use std::path::Path;

use serde_json::{Value, json};

/// A placement's numbers (x y z, qx qy qz qw, sx sy sz), or None.
fn nums(a: &Value) -> Option<Vec<f64>> {
    let v: Vec<f64> = a.as_array()?.iter().filter_map(Value::as_f64).collect();
    (v.len() >= 10).then_some(v)
}

fn r4(x: f64) -> f64 {
    (x * 1e4).round() / 1e4
}

/// A quaternion (x y z w) as Euler angles X, Y, Z in radians, applied X then Y then Z (three.js' and raea's default
/// order for `rotation={[x, y, z]}`).
pub fn euler_xyz(q: &[f64]) -> [f64; 3] {
    let (x, y, z, w) = (q[0], q[1], q[2], q[3]);
    let m02 = 2.0 * (x * z + y * w);
    let (m12, m22) = (2.0 * (y * z - x * w), 1.0 - 2.0 * (x * x + y * y));
    let (m01, m00) = (2.0 * (x * y - z * w), 1.0 - 2.0 * (y * y + z * z));
    let ey = m02.clamp(-1.0, 1.0).asin();
    let (ex, ez) = if m02.abs() < 0.999_999 { ((-m12).atan2(m22), (-m01).atan2(m00)) } else { ((2.0 * (y * z + x * w)).atan2(1.0 - 2.0 * (x * x + z * z)), 0.0) };
    [r4(ex), r4(ey), r4(ez)]
}

/// The angle between two rotations, in degrees.
fn turned(a: &[f64], b: &[f64]) -> f64 {
    let d = (a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3]).abs().min(1.0);
    2.0 * d.acos().to_degrees()
}

/// One edit onto the list: the part, what changed, the prop with its old and new values, and the line said for it.
fn edit(out: &mut Vec<Value>, part: &Value, what: &str, prop: &str, from: Value, to: Value, said: String) {
    out.push(json!({ "id": part["id"], "name": part["source"]["name"], "loc": part["source"]["loc"], "change": what, "prop": prop, "from": from, "to": to, "says": said }));
}

fn surface(p: &Value, sent: &Value, now: &Value, out: &mut Vec<Value>) {
    if !now.is_object() {
        return;
    }
    if let (Some(a), Some(b)) = (sent["color"].as_str(), now["color"].as_str())
        && !a.eq_ignore_ascii_case(b)
    {
        edit(out, p, "recoloured", "color", json!(a), json!(b), format!("color {a} -> {b}"));
    }
    for (k, prop) in [("roughness", "roughness"), ("metallic", "metalness"), ("intensity", "intensity")] {
        if let (Some(a), Some(b)) = (sent[k].as_f64(), now[k].as_f64())
            && (a - b).abs() > 0.005 * a.abs().max(1.0)
        {
            edit(out, p, if k == "intensity" { "relit" } else { "resurfaced" }, prop, json!(r4(a)), json!(r4(b)), format!("{prop} {} -> {}", r4(a), r4(b)));
        }
    }
    if now["emissive"].as_str().is_some() && sent["emissive"].as_str() != now["emissive"].as_str() {
        edit(out, p, "glows", "emissive", sent["emissive"].clone(), now["emissive"].clone(), format!("emissive {} -> {}", sent["emissive"].as_str().unwrap_or("none"), now["emissive"].as_str().unwrap_or("none")));
    }
}

fn placement(p: &Value, a: &[f64], b: &[f64], out: &mut Vec<Value>) {
    let d = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
    if d.iter().any(|x| x.abs() > 1e-3) {
        let to = [r4(b[0]), r4(b[1]), r4(b[2])];
        edit(out, p, "moved", "position", json!([r4(a[0]), r4(a[1]), r4(a[2])]), json!(to), format!("moved by [{}, {}, {}] to {to:?} (world)", r4(d[0]), r4(d[1]), r4(d[2])));
    }
    if turned(&a[3..7], &b[3..7]) > 0.05 {
        let e = euler_xyz(&b[3..7]);
        edit(out, p, "turned", "rotation", json!(euler_xyz(&a[3..7])), json!(e), format!("turned {:.1} degrees: rotation {e:?} (radians, X Y Z; world), quaternion [{}, {}, {}, {}]", turned(&a[3..7], &b[3..7]), r4(b[3]), r4(b[4]), r4(b[5]), r4(b[6])));
    }
    if (0..3).any(|k| (a[7 + k] - b[7 + k]).abs() > 1e-3 * a[7 + k].abs().max(1.0)) {
        let to = [r4(b[7]), r4(b[8]), r4(b[9])];
        edit(out, p, "scaled", "scale", json!([r4(a[7]), r4(a[8]), r4(a[9])]), json!(to), format!("scale {to:?}"));
    }
}

/// The edits from `sent` (scene.json) to `now` (what Blender or Godot holds), at the first frame sent.
pub fn compare(sent: &Value, now: &Value) -> Vec<Value> {
    let mut out = Vec::new();
    let held: Vec<&Value> = now["parts"].as_array().into_iter().flatten().collect();
    for p in sent["parts"].as_array().into_iter().flatten() {
        let Some(n) = held.iter().find(|n| n["id"] == p["id"]) else {
            edit(&mut out, p, "deleted", "", Value::Null, Value::Null, "deleted".into());
            continue;
        };
        let first = p["at"].as_array().into_iter().flatten().find(|a| !a.is_null()).and_then(nums);
        if let (Some(a), Some(b)) = (first, nums(&n["at"])) {
            placement(p, &a, &b, &mut out);
        }
        surface(p, &p["material"], &n["material"], &mut out);
        surface(p, &p["light"], &n["light"], &mut out);
    }
    let cam = sent["camera"].as_array().into_iter().flatten().find(|c| c.is_object());
    if let (Some(c), Some(n)) = (cam, now["camera"].as_object()) {
        let me = json!({ "id": "camera", "source": { "name": "camera" } });
        if let (Some(a), Some(b)) = (nums(&c["at"]), n.get("at").and_then(nums)) {
            placement(&me, &a, &b, &mut out);
        }
        if let (Some(a), Some(b)) = (c["fov"].as_f64(), n.get("fov").and_then(Value::as_f64))
            && (a - b).abs() > 0.05
        {
            edit(&mut out, &me, "lens", "fov", json!(r4(a)), json!(r4(b)), format!("fov {} -> {} (degrees, vertical)", r4(a), r4(b)));
        }
    }
    for n in now["new"].as_array().into_iter().flatten() {
        let file = n["file"].as_str().unwrap_or("");
        let at = nums(&n["at"]).map(|v| format!(" at [{}, {}, {}]", r4(v[0]), r4(v[1]), r4(v[2]))).unwrap_or_default();
        out.push(json!({ "id": Value::Null, "name": n["name"], "loc": Value::Null, "change": "added", "prop": "", "from": Value::Null, "to": n["at"],
            "says": format!("added: <Model src={{staticFile(\"{}\")}} />{at}, written as {file} with its sidecar", file.trim_start_matches("media/")) }));
    }
    out
}

/// Where a part is written in the TSX: its stamp, else the line naming it (`name="crate"`), else for the camera and
/// a light that has no name the Nth line writing its element (the id's `#N`: `<DirectionalLight`), else None.
pub fn line_of(tsx: &Path, e: &Value) -> Option<String> {
    if let Some(loc) = e["loc"].as_str() {
        return Some(loc.to_string());
    }
    let text = std::fs::read_to_string(tsx).ok()?;
    let file = tsx.file_name()?.to_string_lossy();
    let at = |i: usize| format!("{file}:{}", i + 1);
    if let Some(name) = e["name"].as_str().filter(|&n| n != "camera" || e["id"] != "camera") {
        return text.lines().position(|l| l.contains(&format!("name=\"{name}\"")) || l.contains(&format!("name: \"{name}\""))).map(at);
    }
    let id = e["id"].as_str()?;
    let (tag, n) = match id.split_once('|') {
        None if id == "camera" => ("<Camera3d", 0),
        Some((kind, rest)) => {
            let tag = match kind {
                "directional" => "<DirectionalLight",
                "point" => "<PointLight",
                "spot" => "<SpotLight",
                "rect" => "<RectLight",
                _ => return None,
            };
            (tag, rest.rsplit_once('#').and_then(|(_, n)| n.parse().ok()).unwrap_or(0))
        }
        None => return None,
    };
    text.lines().enumerate().filter(|(_, l)| l.contains(tag) && !l.contains(&format!("{tag}s"))).nth(n).map(|(i, _)| at(i))
}

/// The edits as lines, each with where it goes in the TSX.
pub fn said(edits: &[Value], tsx: &Path) -> String {
    if edits.is_empty() {
        return "nothing changed".into();
    }
    edits.iter().map(|e| {
        // the part by its name in the TSX, else by its id
        let who = match (e["name"].as_str(), e["id"].as_str()) {
            (Some(n), _) => format!("\"{n}\""),
            (None, id) => id.unwrap_or("").to_string(),
        };
        let at = line_of(tsx, e).map(|l| format!(" ({l})")).unwrap_or_default();
        format!("{who}{at}: {}", e["says"].as_str().unwrap_or(""))
    }).collect::<Vec<_>>().join("\n")
}

#[cfg(test)]
mod tests {
    use super::*;

    fn sent() -> Value {
        json!({ "parts": [
            { "id": "mesh|a#0", "kind": "mesh", "source": { "name": "crate" }, "at": [[0, 0.5, 0, 0, 0, 0, 1, 1, 1, 1]], "material": { "color": "#ff0000", "roughness": 0.5, "metallic": 0 } },
            { "id": "point|#0", "kind": "light", "source": {}, "at": [[0, 3, 0, 0, 0, 0, 1, 1, 1, 1]], "light": { "color": "#ffffff", "intensity": 1 } }
        ], "camera": [{ "at": [0, 1, 5, 0, 0, 0, 1, 1, 1, 1], "fov": 40 }] })
    }

    #[test]
    fn nothing_changed_says_so() {
        let s = sent();
        let now = json!({ "parts": [
            { "id": "mesh|a#0", "at": [0, 0.5, 0, 0, 0, 0, 1, 1, 1, 1], "material": { "color": "#FF0000", "roughness": 0.5, "metallic": 0 } },
            { "id": "point|#0", "at": [0, 3, 0, 0, 0, 0, 1, 1, 1, 1], "light": { "color": "#ffffff", "intensity": 1.0001 } }
        ], "camera": { "at": [0, 1, 5, 0, 0, 0, 1, 1, 1, 1], "fov": 40 } });
        assert_eq!(compare(&s, &now), Vec::<Value>::new());
    }

    #[test]
    fn each_change_is_one_edit() {
        let h = std::f64::consts::FRAC_1_SQRT_2;
        let now = json!({ "parts": [
            { "id": "mesh|a#0", "at": [1, 0.5, 0, 0, h, 0, h, 2, 2, 2], "material": { "color": "#00ff00", "roughness": 0.2, "metallic": 0 } }
        ], "camera": { "at": [0, 1, 5, 0, 0, 0, 1, 1, 1, 1], "fov": 30 }, "new": [{ "name": "Cube", "file": "media/cube.glb", "at": [2, 0, 0, 0, 0, 0, 1, 1, 1, 1] }] });
        let e = compare(&sent(), &now);
        let changes: Vec<&str> = e.iter().map(|x| x["change"].as_str().unwrap()).collect();
        assert_eq!(changes, ["moved", "turned", "scaled", "recoloured", "resurfaced", "deleted", "lens", "added"]);
        assert_eq!(e[1]["to"], json!([0.0, 1.5708, 0.0]));
        assert!(e[7]["says"].as_str().unwrap().contains("staticFile(\"cube.glb\")"));
    }

    #[test]
    fn a_part_is_found_by_its_name() {
        let f = std::env::temp_dir().join(format!("raea-back-{}.tsx", std::process::id()));
        std::fs::write(&f, "a\n  <Cuboid name=\"crate\" size={[1, 1, 1]} />\n  <Camera3d transform={t} />\n  <PointLight intensity={1} />\n  <PointLight intensity={2} />\n").unwrap();
        let file = f.file_name().unwrap().to_string_lossy().to_string();
        assert_eq!(line_of(&f, &json!({ "name": "crate" })).unwrap(), format!("{file}:2"));
        assert_eq!(line_of(&f, &json!({ "id": "camera", "name": "camera" })).unwrap(), format!("{file}:3"));
        assert_eq!(line_of(&f, &json!({ "id": "point|#1", "name": null })).unwrap(), format!("{file}:5"));
        assert_eq!(line_of(&f, &json!({ "id": "spot|#0", "name": null })), None);
        assert_eq!(line_of(&f, &json!({ "name": "lamp", "loc": "edit.tsx:9:3" })).unwrap(), "edit.tsx:9:3");
        let _ = std::fs::remove_file(&f);
    }
}
