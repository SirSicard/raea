//! A raea scene as a Godot project (docs/godot.feature GD12): scene export's folder made into project.godot and
//! main.tscn, each part Godot's own node (a primitive its own mesh with a StandardMaterial3D, any other mesh an imported
//! .obj, a model its .glb instanced, lights, the camera, a WorldEnvironment), named for the part and carrying its id;
//! a span's frames an AnimationPlayer that plays as the project runs.

use std::collections::BTreeSet;
use std::fmt::Write as _;
use std::path::Path;

use serde_json::Value;

use crate::R;

/// `#rrggbb` as Godot's Color (sRGB, as Godot's albedo and light colours are given).
fn color(hex: &str, a: f64) -> String {
    let h = hex.trim_start_matches('#');
    let c = |i: usize| u8::from_str_radix(h.get(i..i + 2).unwrap_or("cc"), 16).unwrap_or(204) as f64 / 255.0;
    format!("Color({:.4}, {:.4}, {:.4}, {a})", c(0), c(2), c(4))
}

/// A placement (x y z, qx qy qz qw, sx sy sz) as Godot's Transform3D: the basis by rows, the rotation's columns scaled.
pub fn transform(at: &Value) -> String {
    let v: Vec<f64> = at.as_array().into_iter().flatten().filter_map(Value::as_f64).collect();
    if v.len() < 10 {
        return "Transform3D(1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0)".into();
    }
    let (x, y, z, w) = (v[3], v[4], v[5], v[6]);
    let r = [
        [1.0 - 2.0 * (y * y + z * z), 2.0 * (x * y - z * w), 2.0 * (x * z + y * w)],
        [2.0 * (x * y + z * w), 1.0 - 2.0 * (x * x + z * z), 2.0 * (y * z - x * w)],
        [2.0 * (x * z - y * w), 2.0 * (y * z + x * w), 1.0 - 2.0 * (x * x + y * y)],
    ];
    let s = [v[7], v[8], v[9]];
    let b: Vec<String> = (0..3).flat_map(|i| (0..3).map(move |j| (i, j))).map(|(i, j)| num(r[i][j] * s[j])).collect();
    format!("Transform3D({}, {}, {}, {})", b.join(", "), num(v[0]), num(v[1]), num(v[2]))
}

fn num(x: f64) -> String {
    let r = (x * 1e6).round() / 1e6;
    if r == 0.0 { "0".into() } else { format!("{r}") }
}

/// A node name Godot takes (no . : @ / " %), unique in the scene.
fn node_name(want: &str, taken: &mut BTreeSet<String>) -> String {
    let base: String = want.chars().map(|c| if ".:@/\"%#|".contains(c) || c.is_control() { '_' } else { c }).collect();
    let base = if base.trim().is_empty() { "Part".to_string() } else { base.trim().to_string() };
    let mut name = base.clone();
    let mut k = 2;
    while !taken.insert(name.clone()) {
        name = format!("{base}{k}");
        k += 1;
    }
    name
}

/// A part's node name: its name in the TSX, else what it is ("Sun", "PointLight", "Cuboid", the model's file).
pub fn wanted(p: &Value) -> String {
    if let Some(n) = p["source"]["name"].as_str() {
        return n.to_string();
    }
    let what = match (p["kind"].as_str(), p["light"]["type"].as_str(), p["shape"]["type"].as_str()) {
        (_, Some("directional"), _) => "Sun",
        (_, Some("point"), _) => "PointLight",
        (_, Some("spot"), _) => "SpotLight",
        (_, Some("rect"), _) => "AreaLight",
        (Some("model"), _, _) => return p["model"].as_str().and_then(|m| Path::new(m).file_stem()?.to_str()).unwrap_or("Model").to_string(),
        (_, _, Some("cuboid")) => "Cuboid",
        (_, _, Some("sphere")) => "Sphere",
        (_, _, Some("cylinder")) => "Cylinder",
        (_, _, Some("plane")) => "Plane",
        _ => "Mesh",
    };
    what.to_string()
}

/// The tscn's resources and nodes, written in order: ext_resources, sub_resources, then nodes.
#[derive(Default)]
struct Tscn {
    ext: String,
    sub: String,
    nodes: String,
    n_ext: usize,
    n_sub: usize,
}

impl Tscn {
    fn ext(&mut self, kind: &str, path: &str) -> String {
        self.n_ext += 1;
        let _ = writeln!(self.ext, "[ext_resource type=\"{kind}\" path=\"res://{path}\" id=\"{}\"]", self.n_ext);
        format!("ExtResource(\"{}\")", self.n_ext)
    }
    fn sub(&mut self, kind: &str, body: &str) -> String {
        self.n_sub += 1;
        let _ = write!(self.sub, "\n[sub_resource type=\"{kind}\" id=\"{kind}_{}\"]\n{body}", self.n_sub);
        format!("SubResource(\"{kind}_{}\")", self.n_sub)
    }
}

fn material(m: &Value) -> String {
    // each number the material gives, else raea's default for it
    let f = |k: &str| m[k].as_f64().unwrap_or(match k { "opacity" | "emissive_strength" => 1.0, "roughness" => 0.5, _ => 0.0 });
    let mut s = format!("albedo_color = {}\nmetallic = {}\nroughness = {}\n", color(m["color"].as_str().unwrap_or("#cccccc"), f("opacity")), num(f("metallic")), num(f("roughness")));
    if let Some(e) = m["emissive"].as_str() {
        let _ = write!(s, "emission_enabled = true\nemission = {}\nemission_energy_multiplier = {}\n", color(e, 1.0), num(f("emissive_strength")));
    }
    if m["opacity"].as_f64().is_some_and(|o| o < 1.0) {
        s.push_str("transparency = 1\n");
    }
    if m["unlit"] == true {
        s.push_str("shading_mode = 0\n");
    }
    // its textures need their files' ext_resources: part() adds them
    s
}

/// One part's node (and its resources); the first frame it's in places it.
fn part(t: &mut Tscn, p: &Value, name: &str) {
    let first = p["at"].as_array().into_iter().flatten().find(|a| !a.is_null()).cloned().unwrap_or(Value::Null);
    let meta = format!("metadata/raea_id = \"{}\"\n", p["id"].as_str().unwrap_or("").replace('"', "'"));
    let tr = transform(&first);
    match p["kind"].as_str() {
        Some("mesh") => {
            let sh = &p["shape"];
            let mesh = match sh["type"].as_str() {
                Some("cuboid") => {
                    let s = &sh["size"];
                    t.sub("BoxMesh", &format!("size = Vector3({}, {}, {})\n", num(s[0].as_f64().unwrap_or(1.0)), num(s[1].as_f64().unwrap_or(1.0)), num(s[2].as_f64().unwrap_or(1.0))))
                }
                Some("sphere") => {
                    let r = sh["radius"].as_f64().unwrap_or(0.5);
                    t.sub("SphereMesh", &format!("radius = {}\nheight = {}\n", num(r), num(2.0 * r)))
                }
                Some("cylinder") => {
                    let r = num(sh["radius"].as_f64().unwrap_or(0.5));
                    t.sub("CylinderMesh", &format!("top_radius = {r}\nbottom_radius = {r}\nheight = {}\n", num(sh["height"].as_f64().unwrap_or(1.0))))
                }
                Some("plane") => {
                    let s = &sh["size"];
                    t.sub("PlaneMesh", &format!("size = Vector2({}, {})\n", num(s[0].as_f64().unwrap_or(1.0)), num(s[1].as_f64().unwrap_or(1.0))))
                }
                _ => t.ext("ArrayMesh", sh["obj"].as_str().unwrap_or("")),
            };
            let mut mat = material(&p["material"]);
            if let Some(f) = p["material"]["color_map"].as_str() {
                let tex = t.ext("Texture2D", f);
                let _ = writeln!(mat, "albedo_texture = {tex}");
            }
            if let Some(f) = p["material"]["normal_map"].as_str() {
                let tex = t.ext("Texture2D", f);
                let _ = writeln!(mat, "normal_enabled = true\nnormal_texture = {tex}");
            }
            let mat = t.sub("StandardMaterial3D", &mat);
            let _ = write!(t.nodes, "\n[node name=\"{name}\" type=\"MeshInstance3D\" parent=\".\"]\ntransform = {tr}\nmesh = {mesh}\nsurface_material_override/0 = {mat}\n{meta}");
        }
        Some("model") => {
            let scene = t.ext("PackedScene", p["model"].as_str().unwrap_or(""));
            let _ = write!(t.nodes, "\n[node name=\"{name}\" parent=\".\" instance={scene}]\ntransform = {tr}\n{meta}");
        }
        _ => {
            let l = &p["light"];
            let kind = match l["type"].as_str() {
                Some("directional") => "DirectionalLight3D",
                Some("spot") => "SpotLight3D",
                _ => "OmniLight3D",
            };
            let mut body = format!("transform = {tr}\nlight_color = {}\nlight_energy = {}\nshadow_enabled = true\n", color(l["color"].as_str().unwrap_or("#ffffff"), 1.0), num(l["intensity"].as_f64().unwrap_or(1.0)));
            let range = num(l["range"].as_f64().unwrap_or(20.0));
            match kind {
                "SpotLight3D" => {
                    let _ = write!(body, "spot_range = {range}\nspot_angle = {}\n", num(l["angle"].as_f64().unwrap_or(std::f64::consts::FRAC_PI_3).to_degrees().min(89.0)));
                }
                "OmniLight3D" => {
                    let _ = writeln!(body, "omni_range = {range}");
                }
                _ => {}
            }
            let _ = write!(t.nodes, "\n[node name=\"{name}\" type=\"{kind}\" parent=\".\"]\n{body}{meta}");
        }
    }
}

/// A placement track of the animation: each frame the node is in, as (time, transition, values...).
fn tracks(anim: &mut String, k: &mut usize, path: &str, at: &[Value], fps: f64, f0: i64, frames: &[i64]) {
    let keyed: Vec<(f64, Vec<f64>)> = at.iter().zip(frames).filter_map(|(a, f)| {
        let v: Vec<f64> = a.as_array()?.iter().filter_map(Value::as_f64).collect();
        (v.len() >= 10).then(|| ((f - f0) as f64 / fps, v))
    }).collect();
    for (kind, range) in [("position_3d", 0..3), ("rotation_3d", 3..7), ("scale_3d", 7..10)] {
        // a channel that holds still isn't a track: a part that only turns keys its rotation alone
        if keyed.windows(2).all(|w| w[0].1[range.clone()] == w[1].1[range.clone()]) {
            continue;
        }
        let keys: Vec<String> = keyed.iter().flat_map(|(t, v)| [num(*t), "1".into()].into_iter().chain(v[range.clone()].iter().map(|x| num(*x)))).collect();
        let _ = write!(anim, "tracks/{k}/type = \"{kind}\"\ntracks/{k}/imported = false\ntracks/{k}/enabled = true\ntracks/{k}/path = NodePath(\"{path}\")\ntracks/{k}/interp = 1\ntracks/{k}/loop_wrap = true\ntracks/{k}/keys = PackedFloat32Array({})\n", keys.join(", "));
        *k += 1;
    }
}

/// project.godot and main.tscn in `dir` (scene export's folder), from its scene.json `v`: the name of the project.
pub fn project(dir: &Path, v: &Value, name: &str) -> R<String> {
    let fps = v["fps"].as_f64().unwrap_or(30.0);
    let frames: Vec<i64> = v["frames"].as_array().into_iter().flatten().filter_map(Value::as_i64).collect();
    let f0 = frames.first().copied().unwrap_or(0);
    let (w, h) = (v["size"][0].as_u64().unwrap_or(1920), v["size"][1].as_u64().unwrap_or(1080));
    let mut t = Tscn::default();
    let mut taken = BTreeSet::from(["WorldEnvironment".to_string(), "Camera3D".to_string(), "AnimationPlayer".to_string()]);
    let mut anim = String::new();
    let mut k = 0;
    for p in v["parts"].as_array().into_iter().flatten() {
        let name = node_name(&wanted(p), &mut taken);
        part(&mut t, p, &name);
        if frames.len() > 1 {
            tracks(&mut anim, &mut k, &name, p["at"].as_array().map(Vec::as_slice).unwrap_or(&[]), fps, f0, &frames);
        }
    }
    // the ambient and a background: Bevy's own clear colour unless the scene says otherwise
    let amb = &v["ambient"];
    let mut env = "background_mode = 1\nbackground_color = Color(0.1686, 0.1725, 0.1843, 1)\ntonemap_mode = 3\n".to_string();
    if amb.is_object() {
        let _ = write!(env, "ambient_light_source = 2\nambient_light_color = {}\nambient_light_energy = {}\n", color(amb["color"].as_str().unwrap_or("#ffffff"), 1.0), num(amb["nits"].as_f64().unwrap_or(400.0) / 400.0));
    }
    let env = t.sub("Environment", &env);
    let mut nodes = format!("\n[node name=\"WorldEnvironment\" type=\"WorldEnvironment\" parent=\".\"]\nenvironment = {env}\n");
    nodes.push_str(&t.nodes);
    let cams: Vec<Value> = v["camera"].as_array().into_iter().flatten().cloned().collect();
    if let Some(c) = cams.iter().find(|c| c.is_object()) {
        let _ = write!(nodes, "\n[node name=\"Camera3D\" type=\"Camera3D\" parent=\".\"]\ntransform = {}\nfov = {}\ncurrent = true\n", transform(&c["at"]), num(c["fov"].as_f64().unwrap_or(50.0)));
        if frames.len() > 1 {
            let at: Vec<Value> = cams.iter().map(|c| c["at"].clone()).collect();
            tracks(&mut anim, &mut k, "Camera3D", &at, fps, f0, &frames);
        }
    }
    if k > 0 {
        let len = (frames.len().saturating_sub(1)) as f64 / fps;
        let a = t.sub("Animation", &format!("resource_name = \"raea\"\nlength = {}\n{anim}", num(len.max(1.0 / fps))));
        let lib = t.sub("AnimationLibrary", &format!("_data = {{\n&\"raea\": {a}\n}}\n"));
        let _ = write!(nodes, "\n[node name=\"AnimationPlayer\" type=\"AnimationPlayer\" parent=\".\"]\nlibraries = {{\n&\"\": {lib}\n}}\nautoplay = &\"raea\"\n");
    }
    let tscn = format!("[gd_scene load_steps={} format=3]\n\n{}{}\n[node name=\"{}\" type=\"Node3D\"]\n{nodes}", t.n_ext + t.n_sub + 1, t.ext, t.sub, node_name(name, &mut BTreeSet::new()));
    std::fs::write(dir.join("main.tscn"), tscn).map_err(|e| e.to_string())?;
    let godot = format!(
        "; written by raea godot export (docs/godot.feature GD12)\nconfig_version=5\n\n[application]\nconfig/name=\"{}\"\nrun/main_scene=\"res://main.tscn\"\nconfig/features=PackedStringArray(\"4.6\", \"Forward Plus\")\n\n[display]\nwindow/size/viewport_width={w}\nwindow/size/viewport_height={h}\n\n[rendering]\nrenderer/rendering_method=\"forward_plus\"\n",
        name.replace('"', "'")
    );
    std::fs::write(dir.join("project.godot"), godot).map_err(|e| e.to_string())?;
    Ok(format!("{} parts{}", v["parts"].as_array().map_or(0, Vec::len), if k > 0 { format!(", {k} animation track{} over {} frames", if k == 1 { "" } else { "s" }, frames.len()) } else { String::new() }))
}

#[cfg(test)]
mod tests {
    use super::*;
    use serde_json::json;

    #[test]
    fn a_placement_is_a_transform_by_rows() {
        assert_eq!(transform(&json!([1, 2, 3, 0, 0, 0, 1, 1, 1, 1])), "Transform3D(1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 2, 3)");
        // a quarter turn about Y, then scaled by 2 along x: the x column is twice as long
        let h = std::f64::consts::FRAC_1_SQRT_2;
        assert_eq!(transform(&json!([0, 0, 0, 0, h, 0, h, 2, 1, 1])), "Transform3D(0, 0, 1, 0, 1, 0, -2, 0, 0, 0, 0, 0)");
    }

    #[test]
    fn names_are_godots_and_unique() {
        let mut t = BTreeSet::new();
        assert_eq!(node_name("crate", &mut t), "crate");
        assert_eq!(node_name("crate", &mut t), "crate2");
        assert_eq!(node_name("mesh|a.b#0", &mut t), "mesh_a_b_0");
    }

    #[test]
    fn a_scene_becomes_a_project_that_moves() {
        let dir = std::env::temp_dir().join(format!("raea-godot-project-{}", std::process::id()));
        std::fs::create_dir_all(&dir).unwrap();
        let v = json!({ "fps": 30, "size": [640, 360], "frames": [0, 1],
            "parts": [
                { "id": "mesh|box(1, 1, 1)#0", "kind": "mesh", "source": { "name": "crate" }, "shape": { "type": "cuboid", "size": [1, 1, 1] }, "material": { "color": "#ff0000", "roughness": 0.4, "metallic": 0 }, "at": [[0, 0.5, 0, 0, 0, 0, 1, 1, 1, 1], [1, 0.5, 0, 0, 0, 0, 1, 1, 1, 1]] },
                { "id": "directional|#0", "kind": "light", "source": {}, "light": { "type": "directional", "color": "#ffffff", "intensity": 1 }, "at": [[0, 5, 0, 0, 0, 0, 1, 1, 1, 1], [0, 5, 0, 0, 0, 0, 1, 1, 1, 1]] }
            ],
            "camera": [{ "at": [0, 1, 5, 0, 0, 0, 1, 1, 1, 1], "fov": 40 }, { "at": [0, 1, 5, 0, 0, 0, 1, 1, 1, 1], "fov": 40 }], "ambient": null });
        let said = project(&dir, &v, "box test").unwrap();
        // the crate only moves: its position is keyed, its rotation and scale aren't tracks
        assert!(said.contains("1 animation track over 2 frames"), "{said}");
        let tscn = std::fs::read_to_string(dir.join("main.tscn")).unwrap();
        assert!(!tscn.contains("tracks/1/"), "{tscn}");
        for want in ["[node name=\"crate\" type=\"MeshInstance3D\"", "size = Vector3(1, 1, 1)", "albedo_color = Color(1.0000, 0.0000, 0.0000, 1)", "[node name=\"Sun\" type=\"DirectionalLight3D\"", "fov = 40", "tracks/0/type = \"position_3d\"", "autoplay = &\"raea\"", "tracks/0/path = NodePath(\"crate\")", "metadata/raea_id = \"mesh|box(1, 1, 1)#0\""] {
            assert!(tscn.contains(want), "{want} in\n{tscn}");
        }
        assert!(std::fs::read_to_string(dir.join("project.godot")).unwrap().contains("window/size/viewport_width=640"));
        let _ = std::fs::remove_dir_all(&dir);
    }
}
