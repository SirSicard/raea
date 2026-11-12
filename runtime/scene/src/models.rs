use super::*;

/// glTF models: the file, its clip and the clip's time (keyed: the component works it out from the frame)
pub(crate) fn models_rows(tr: &Tracks, names: &[String], p: &mut Program) {
    for (k, (_, track)) in tr.models.iter().enumerate() {
        let its = filled(&track);
        let id = format!("model{k}");
        let mut row = BTreeMap::new();
        row.insert("id".into(), V::S(id.clone()));
        let first = &its[0].props;
        name_column(&mut row, first);
        row.insert("src".into(), V::S(src_path(first.get("src").and_then(Value::as_str).unwrap_or(""))));
        match first.get("animation") {
            Some(Value::String(s)) => {
                row.insert("anim".into(), V::S(s.clone()));
            }
            Some(Value::Number(x)) => {
                row.insert("anim".into(), V::N(x.as_f64().unwrap_or(0.0)));
            }
            _ => {}
        }
        if first.contains_key("animation") {
            column(p, &mut row, &id, "anim_t", &its.iter().map(|i| n(&i.props, "time", 0.0)).collect::<Vec<_>>());
            if first.get("loop") == Some(&Value::Bool(false)) {
                row.insert("anim_loop".into(), V::N(0.0));
            }
        }
        // clips blended (<Model animations>) and morph weights (<Model morphs>): the names once, times and weights keyed
        if let Some(Value::Array(a)) = first.get("animations") {
            row.insert("mix".into(), V::S(Value::Array(a.iter().map(|c| c.get("clip").cloned().unwrap_or(Value::Null)).collect()).to_string()));
            for i in 0..a.len() {
                for (k, col, d) in [("time", "t", 0.0), ("weight", "w", 1.0)] {
                    let vals: Vec<f64> = its.iter().map(|it| it.props.get("animations").and_then(|x| x.get(i)).map(|c| n(c.as_object().unwrap_or(&Default::default()), k, d)).unwrap_or(0.0)).collect();
                    column(p, &mut row, &id, &format!("mix{i}_{col}"), &vals);
                }
            }
            if first.get("loop") == Some(&Value::Bool(false)) {
                row.insert("anim_loop".into(), V::N(0.0));
            }
        }
        if let Some(Value::Array(a)) = first.get("graph") {
            let parts: Vec<Value> = a.iter().map(|g| serde_json::json!({ "kind": g.get("kind"), "clip": g.get("clip"), "parent": g.get("parent"), "mask": g.get("mask") })).collect();
            row.insert("graph".into(), V::S(Value::Array(parts).to_string()));
            for i in 0..a.len().min(16) {
                for (k, col, d) in [("weight", "w", 1.0), ("time", "t", 0.0)] {
                    let vals: Vec<f64> = its.iter().map(|it| it.props.get("graph").and_then(|x| x.get(i)).map(|c| n(c.as_object().unwrap_or(&Default::default()), k, d)).unwrap_or(d)).collect();
                    column(p, &mut row, &id, GRAPH_COLS[i].iter().find(|c| c.ends_with(col)).unwrap(), &vals);
                }
            }
            if first.get("loop") == Some(&Value::Bool(false)) {
                row.insert("anim_loop".into(), V::N(0.0));
            }
        }
        if let Some(Value::Array(a)) = first.get("morphs") {
            row.insert("morph_names".into(), V::S(Value::Array(a.iter().map(|c| c.get("target").cloned().unwrap_or(Value::Null)).collect()).to_string()));
            for i in 0..a.len().min(64) {
                let vals: Vec<f64> = its.iter().map(|it| it.props.get("morphs").and_then(|x| x.get(i)).and_then(|c| c.get("weight")).and_then(Value::as_f64).unwrap_or(0.0)).collect();
                column(p, &mut row, &id, &format!("morph{i}"), &vals);
            }
        }
        if let Some(s) = num(first, "scene") {
            row.insert("scene".into(), V::N(s));
        }
        // attached to another model's bone: that model's row by its name
        if let Some(a) = first.get("attach") {
            let to = a.get("to").and_then(Value::as_str).unwrap_or("");
            if let Some(j) = tr.models.iter().position(|(_, t)| t.iter().flatten().next().and_then(|i| i.props.get("name")).and_then(Value::as_str) == Some(to)) {
                row.insert("attach_to".into(), V::S(format!("model{j}")));
                row.insert("attach_bone".into(), V::S(a.get("bone").and_then(Value::as_str).unwrap_or("").into()));
            } else {
                eprintln!("WARN  model {}: attach.to {to:?} names no model", first.get("name").and_then(Value::as_str).unwrap_or("?"));
            }
        }
        // a skin's joints, each placed where another model is: the joints' names and those models' rows, in turn
        if let Some(Value::Object(b)) = first.get("bones") {
            let (mut joints, mut rows) = (Vec::new(), Vec::new());
            for (joint, to) in b {
                let to = to.as_str().unwrap_or("");
                match tr.models.iter().position(|(_, t)| t.iter().flatten().next().and_then(|i| i.props.get("name")).and_then(Value::as_str) == Some(to)) {
                    Some(j) => {
                        joints.push(joint.clone());
                        rows.push(format!("model{j}"));
                    }
                    None => eprintln!("WARN  model {}: bones.{joint} names no model ({to:?})", first.get("name").and_then(Value::as_str).unwrap_or("?")),
                }
            }
            row.insert("bone_joints".into(), V::S(joints.join(",")));
            row.insert("bone_rows".into(), V::S(rows.join(",")));
        }
        if first.get("flat") == Some(&Value::Bool(true)) {
            row.insert("flat".into(), V::N(1.0));
        }
        // screens on its materials and nodes hidden (<Model screens hide>, raea-render's screen.rs): the first frame's
        screen_columns(p, &mut row, &id, &its);
        node_columns(p, &mut row, &id, &its);
        if let Some(s) = first.get("surfaces") {
            row.insert("surfaces".into(), V::S(s.to_string()));
        }
        if let Some(sm) = first.get("sampler").filter(|v| v.is_object()) {
            row.insert("sampler".into(), V::S(sm.to_string()));
        }
        if let Some(sh) = first.get("shader") {
            row.insert("shader".into(), V::S(sh.to_string()));
        }
        if let Some(t) = first.get("toon") {
            row.insert("toon".into(), V::S(t.to_string()));
        }
        grid_columns(&mut row, first);
        // a look (raea-render's look.rs): which one keyed by the frame, the rest the first frame's
        if its.iter().any(|i| i.props.contains_key("look")) {
            column(p, &mut row, &id, "look", &its.iter().map(|i| look_of(&i.props)).collect::<Vec<_>>());
            for (prop, col) in [("pixelSize", "look_px"), ("lift", "look_lift"), ("gain", "look_gain")] {
                if let Some(x) = num(first, prop) {
                    row.insert(col.into(), V::N(x));
                }
            }
            match first.get("edgeColor") {
                Some(Value::String(c)) => {
                    row.insert("look_edge".into(), V::S(if c == "none" { String::new() } else { hex_of(c).unwrap_or_default() }));
                }
                Some(Value::Null) | Some(Value::Bool(false)) => {
                    row.insert("look_edge".into(), V::S(String::new()));
                }
                _ => {}
            }
            if let Some(t) = first.get("theme").and_then(Value::as_str) {
                row.insert("look_theme".into(), V::S(t.to_string()));
            }
        }
        meshseq::glitch_columns(p, &mut row, &id, &its);
        meshseq::cloth_columns(p, &mut row, &id, &its);
        placement(p, &mut row, &id, &its);
        visible(p, &mut row, &id, &track);
        instances_column(p, &mut row, &id, &its);
        model_shadows(&mut row, &its);
        pass_column(p, &mut row, &id, &its, &names);
        p.spawns.push(("model".into(), vec![row]));
        components(p, &id, &its);
    }
}

/// pictures in space (raea-render's panel: unlit, painted once, moved by the GPU)
pub(crate) fn panels_rows(tr: &Tracks, names: &[String], p: &mut Program) {
    for (k, (_, track)) in tr.panels.iter().enumerate() {
        let its = filled(&track);
        let id = format!("plane{k}");
        let mut row = BTreeMap::new();
        row.insert("id".into(), V::S(id.clone()));
        let first = &its[0].props;
        if first.get("screen").is_some_and(Value::is_object) {
            screen_columns(p, &mut row, &id, &its);
        } else {
            // a picture that changes (an ImagePlane playing frames: src={`g${f}.png`}): every picture it shows, one a
            // line, and which one each frame (keyed); raea-render swaps the texture (scene3d::sync_pictures). Without this the
            // first frame's picture was held for the whole run.
            keyed_strings(p, &mut row, &id, "src", &srcs_of(&its));
        }
        row.insert("w".into(), V::N(n(first, "width", 1.0)));
        if let Some(h) = num(first, "height") {
            row.insert("h".into(), V::N(h));
        }
        if first.get("shadow").and_then(Value::as_bool) == Some(false) {
            row.insert("shadow".into(), V::N(0.0));
        }
        // cut out at half alpha instead of blended (a baked cloud's card): no surface where it's clear, its shadow its shape
        if first.get("cutout").and_then(Value::as_bool) == Some(true) {
            row.insert("cutout".into(), V::N(1.0));
        }
        sheet(p, &mut row, &id, &its);
        placement(p, &mut row, &id, &its);
        visible(p, &mut row, &id, &track);
        pass_column(p, &mut row, &id, &its, &names);
        p.spawns.push(("panel".into(), vec![row]));
        components(p, &id, &its);
    }
}

/// decals: the picture and its surface from the first frame; placement, colour and opacity keyed (a stain that
/// spreads, a label that fades in)
pub(crate) fn decals_rows(tr: &Tracks, p: &mut Program) {
    for (k, (_, track)) in tr.decals.iter().enumerate() {
        let its = filled(&track);
        let id = format!("decal{k}");
        let mut row = BTreeMap::new();
        row.insert("id".into(), V::S(id.clone()));
        let first = &its[0].props;
        for (prop, col) in [("src", "map"), ("normalMap", "normal_map")] {
            if let Some(src) = first.get(prop).and_then(Value::as_str) {
                row.insert(col.into(), V::S(src_path(src)));
            }
        }
        tint(p, &mut row, &id, &its, "#ffffff");
        column(p, &mut row, &id, "opacity", &its.iter().map(|i| n(&i.props, "opacity", 1.0)).collect::<Vec<_>>());
        column(p, &mut row, &id, "rough", &its.iter().map(|i| n(&i.props, "roughness", 0.6)).collect::<Vec<_>>());
        column(p, &mut row, &id, "metal", &its.iter().map(|i| n(&i.props, "metalness", 0.0)).collect::<Vec<_>>());
        row.insert("fade".into(), V::N(n(first, "fade", 0.05)));
        if first.get("unlit") == Some(&Value::Bool(true)) {
            row.insert("unlit".into(), V::N(1.0));
        }
        placement(p, &mut row, &id, &its);
        visible(p, &mut row, &id, &track);
        p.spawns.push(("decal".into(), vec![row]));
    }
}

/// footage behind the 3D (raea-render's plate: a video frame per frame on the camera's far plane, unlit): its source time
/// keyed, the clip and its lens's distortion the first frame's
pub(crate) fn plates_rows(tr: &Tracks, p: &mut Program) {
    for (k, (_, track)) in tr.plates.iter().enumerate() {
        let its = filled(&track);
        let id = format!("plate{k}");
        let mut row = BTreeMap::new();
        row.insert("id".into(), V::S(id.clone()));
        let first = &its[0].props;
        row.insert("src".into(), V::S(src_path(first.get("src").and_then(Value::as_str).unwrap_or(""))));
        column(p, &mut row, &id, "t", &its.iter().map(|i| n(&i.props, "time", 0.0)).collect::<Vec<_>>());
        if let Some(k1) = num(first, "k1").filter(|k| *k != 0.0) {
            row.insert("k1".into(), V::N(k1));
        }
        visible(p, &mut row, &id, &track);
        p.spawns.push(("plate".into(), vec![row]));
    }
}

/// fog volumes (a <VolumetricFog>'s boxes of air): placement, density and colour keyed, the rest the first frame's
pub(crate) fn fogs_rows(tr: &Tracks, p: &mut Program) {
    for (k, (_, track)) in tr.fogs.iter().enumerate() {
        let its = filled(&track);
        let id = format!("fog{k}");
        let mut row = BTreeMap::new();
        row.insert("id".into(), V::S(id.clone()));
        column(p, &mut row, &id, "density", &its.iter().map(|i| n(&i.props, "density", 0.1)).collect::<Vec<_>>());
        let colors: Vec<String> = its.iter().map(|i| hex(i.props.get("color")).unwrap_or("#ffffff".into())).collect();
        row.insert("color".into(), V::S(colors[0].clone()));
        if colors.iter().any(|c| *c != colors[0]) {
            let c: Vec<[f64; 3]> = colors.iter().map(|c| rgb(c)).collect();
            for (k, name) in ["col_r", "col_g", "col_b"].iter().enumerate() {
                p.keys.insert((id.clone(), name.to_string()), raea_runtime_look::linear_keys(&c.iter().map(|v| v[k]).collect::<Vec<_>>()));
                row.insert(name.to_string(), V::N(c[0][k]));
            }
        }
        let first = &its[0].props;
        // and its density texture (Bevy's density_texture, a .ktx2 3D image's path: 3d/fog_volumes' bunny)
        for (prop, col) in [("absorption", "absorption"), ("scattering", "scattering"), ("anisotropy", "anisotropy"), ("falloff", "falloff"), ("density_texture", "density_tex")] {
            if let Some(x) = first.get(prop).and_then(|v| v.as_f64().map(V::N).or_else(|| v.as_str().map(|s| V::S(s.into())))) {
                row.insert(col.into(), x);
            }
        }
        placement(p, &mut row, &id, &its);
        visible(p, &mut row, &id, &track);
        p.spawns.push(("fogvolume".into(), vec![row]));
    }
}

/// fires (<Fire>: a flame drawn as a volume): its foot, its box's size, its clock, brightness and colour keyed
pub(crate) fn fires_rows(tr: &Tracks, p: &mut Program) {
    for (k, (_, track)) in tr.fires.iter().enumerate() {
        let its = filled(&track);
        let id = format!("fire{k}");
        let mut row = BTreeMap::new();
        row.insert("id".into(), V::S(id.clone()));
        for (prop, d) in [("time", 0.0), ("intensity", 6.0)] {
            column(p, &mut row, &id, prop, &its.iter().map(|i| n(&i.props, prop, d)).collect::<Vec<_>>());
        }
        let colors: Vec<String> = its.iter().map(|i| hex(i.props.get("color")).unwrap_or("#ff7a1f".into())).collect();
        row.insert("color".into(), V::S(colors[0].clone()));
        if colors.iter().any(|c| *c != colors[0]) {
            let c: Vec<[f64; 3]> = colors.iter().map(|c| rgb(c)).collect();
            for (k, name) in ["col_r", "col_g", "col_b"].iter().enumerate() {
                exact(p, &mut row, &id, name, &c.iter().map(|v| v[k]).collect::<Vec<_>>());
            }
        }
        let first = &its[0].props;
        for prop in ["seed", "speed", "steps", "opacity"] {
            if let Some(x) = num(first, prop) {
                row.insert(prop.into(), V::N(x));
            }
        }
        // a simulated volume (<Smoke>, <Cloud>, <Contrail>): its spec, for raea-render's volume.rs, and how much of the light
        // it stops in the shadow maps (1 unless the SDK says otherwise; 0 casts none)
        if let Some(sim) = first.get("sim").filter(|s| s.is_object()) {
            row.insert("sim".into(), V::S(sim.to_string()));
            if let Some(x) = num(first, "shadow") {
                row.insert("shadow".into(), V::N(x));
            }
        }
        placement(p, &mut row, &id, &its);
        visible(p, &mut row, &id, &track);
        p.spawns.push(("fire".into(), vec![row]));
    }
}

/// <Model nodes>: glTF nodes' local transforms by name, each frame's (a joint turned by hand, Bevy's gltf_skinned_mesh):
/// node{i} the i-th name, and node{i}_x/_y/_z (translation), node{i}_q_x.._q_w (rotation) and node{i}_s_x.._s_z (scale)
/// keyed, each part given only when the first frame gives it, so the rest of the node stays as its file has it.
fn node_columns(p: &mut Program, row: &mut BTreeMap<String, V>, id: &str, its: &[Item]) {
    let Some(Value::Object(first)) = its[0].props.get("nodes") else { return };
    for (i, (name, f)) in first.iter().enumerate() {
        row.insert(format!("node{i}"), V::S(name.clone()));
        for (field, cols) in [("translation", ["x", "y", "z", ""]), ("rotation", ["q_x", "q_y", "q_z", "q_w"]), ("scale", ["s_x", "s_y", "s_z", ""])] {
            if f.get(field).is_none() {
                continue;
            }
            for (k, c) in cols.iter().enumerate().filter(|(_, c)| !c.is_empty()) {
                let at = |it: &Item| it.props.get("nodes").and_then(|n| n.get(name)).and_then(|n| n.get(field)).and_then(|v| v.get(k)).and_then(Value::as_f64).unwrap_or(f64::NAN);
                exact(p, row, id, &format!("node{i}_{c}"), &its.iter().map(at).collect::<Vec<_>>());
            }
        }
    }
}
