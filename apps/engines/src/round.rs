//! A raea scene sent to Blender or Godot and its changes read back (docs/blender.feature BL37-BL39, docs/godot.feature
//! GD12-GD13): the verbs, running Blender (sdk/blender/src/scene.ts) and Godot (sdk/godot/src/host/back.ts) on what
//! raea-app-interchange writes and compares.
//!   raea scene export EDIT.tsx -o DIR [--composition ID] [--frame N | --at A-B]
//!   raea godot export EDIT.tsx -o DIR [--composition ID] [--frame N | --at A-B]
//!   raea godot back DIR [--json]
//!   raea blender open EDIT.tsx [--frame N | --at A-B] [-o DIR] [--no-window] | FILE.blend|.glb|.gltf|.obj|.fbx
//!   raea blender back FILE.blend [--json]

use std::path::{Path, PathBuf};
use std::process::{Command, Stdio};

use raea_app_interchange::{back, export, godot};
use serde_json::Value;

use crate::{R, blender_ts};

pub const USAGE: &str = "raea scene export EDIT.tsx -o DIR [--composition ID] [--frame N | --at A-B]   (the composition's 3D as data other tools build: DIR/scene.json, each part placed (y up, metres) with its shape, material or light, and the camera; meshes/ and models/ beside it)\n       raea godot export EDIT.tsx -o DIR [--frame N | --at A-B]   (the composition's 3D as a Godot project that runs: project.godot and main.tscn, each part Godot's own node, --at's frames an AnimationPlayer)\n       raea godot back DIR   (what changed in Godot's main.tscn since the export, as edits to the TSX at their lines; nodes added there written as media/NAME.glb; --json)\n       raea blender open EDIT.tsx [--frame N | --at A-B] [-o DIR] [--no-window] | FILE.blend|.glb   (the composition's 3D built in Blender, saved as DIR/NAME.blend (out/blender/NAME/ unless -o) and opened in a Blender window; a model or .blend opened as it is)\n       raea blender back FILE.blend   (what changed in Blender since raea blender open, as edits to the TSX at their lines; meshes made there written as media/NAME.glb; --json)";

fn flag<'a>(args: &'a [String], k: &str) -> Option<&'a String> {
    args.iter().position(|a| a == k).and_then(|i| args.get(i + 1))
}

fn read_json(p: &Path) -> R<Value> {
    serde_json::from_slice(&std::fs::read(p).map_err(|e| format!("{}: {e}", p.display()))?).map_err(|e| format!("{}: {e}", p.display()))
}

/// The scene export's folder for an edit: -o DIR, else out/blender/NAME/ beside it.
fn export_to(args: &[String], default_sub: &str) -> R<(PathBuf, Value)> {
    let mut a = args.to_vec();
    if flag(args, "-o").is_none() {
        let edit = PathBuf::from(args.get(2).ok_or(USAGE)?);
        let stem = edit.file_stem().and_then(|s| s.to_str()).unwrap_or("scene").to_string();
        let dir = edit.parent().unwrap_or(Path::new(".")).join("out").join(default_sub).join(&stem);
        a.extend(["-o".into(), dir.to_string_lossy().into_owned()]);
    }
    export::export(&a)
}

/// The edits from scene.json in `dir` to what `now` holds, said (or as JSON).
fn compared(dir: &Path, now: &Path, json: bool) -> R<String> {
    let sent = read_json(&dir.join("scene.json"))?;
    let held = read_json(now)?;
    let _ = std::fs::remove_file(now);
    let edits = back::compare(&sent, &held);
    let tsx = PathBuf::from(sent["from"].as_str().unwrap_or(""));
    Ok(if json { serde_json::to_string_pretty(&edits).unwrap_or_default() } else { back::said(&edits, &tsx) })
}

/// The project's media folder for models made in Blender or Godot: beside the edit the scene came from.
fn media_of(dir: &Path) -> R<PathBuf> {
    let sent = read_json(&dir.join("scene.json"))?;
    let tsx = PathBuf::from(sent["from"].as_str().ok_or("scene.json names no edit")?);
    Ok(tsx.parent().unwrap_or(Path::new(".")).join("media"))
}

pub fn scene_export(args: &[String]) -> R<String> {
    let (out, v) = export::export(args)?;
    Ok(export::said(&out, &v))
}

pub fn godot_export(args: &[String]) -> R<String> {
    let (out, v) = export_to(args, "godot")?;
    let name = Path::new(&args[2]).file_stem().and_then(|s| s.to_str()).unwrap_or("raea").to_string();
    let said = godot::project(&out, &v, &name)?;
    let left = export::said(&out, &v);
    let left = left.split_once("; ").map(|(_, l)| format!("; {l}")).unwrap_or_default();
    Ok(format!("a Godot project in {}: {said}{left}\nrun it: raea godot run SCRIPT.ts --project {0} (or --movie); edit it: raea godot open {0}; then raea godot back {0}", out.display()))
}

pub fn godot_back(args: &[String]) -> R<String> {
    let dir = PathBuf::from(args.get(2).ok_or(USAGE)?).canonicalize().map_err(|e| format!("{}: {e}", args[2]))?;
    let media = media_of(&dir)?;
    let now = dir.join(".raea-now.json");
    let script = raea_io_home::home().join("sdk/godot/src/host/back.ts");
    let run: Vec<String> = ["godot", "run"].iter().map(|s| s.to_string())
        .chain([script.to_string_lossy().into_owned(), "--project".into(), dir.to_string_lossy().into_owned(), "--".into(), now.to_string_lossy().into_owned(), media.to_string_lossy().into_owned()])
        .collect();
    crate::godot_run::run(&run)?;
    compared(&dir, &now, args.iter().any(|a| a == "--json"))
}

/// A Blender window on `file`, left running as the person's.
fn window(file: &Path, python: Option<String>) -> R<()> {
    let (bin, _) = raea_app_tools::blender::find().ok_or("no Blender: raea setup blender finds or downloads one")?;
    let mut cmd = Command::new(&bin);
    match python {
        Some(code) => cmd.arg("--python-expr").arg(code),
        None => cmd.arg(file),
    };
    cmd.stdin(Stdio::null()).stdout(Stdio::null()).stderr(Stdio::null()).spawn().map_err(|e| format!("{}: {e}", bin.display()))?;
    Ok(())
}

pub fn blender_open(args: &[String]) -> R<String> {
    let src = args.get(2).ok_or(USAGE)?;
    let path = std::path::absolute(src).map_err(|e| e.to_string())?;
    let ext = path.extension().and_then(|e| e.to_str()).unwrap_or("").to_ascii_lowercase();
    match ext.as_str() {
        "blend" => {
            window(&path, None)?;
            return Ok(format!("APPLIED  Blender is opening {}", path.display()));
        }
        "glb" | "gltf" | "obj" | "fbx" => {
            let op = match ext.as_str() {
                "obj" => "bpy.ops.wm.obj_import",
                "fbx" => "bpy.ops.import_scene.fbx",
                _ => "bpy.ops.import_scene.gltf",
            };
            let code = format!("import bpy\nbpy.ops.wm.read_homefile(use_empty=True)\n{op}(filepath={:?})", path.to_string_lossy());
            window(&path, Some(code))?;
            return Ok(format!("APPLIED  Blender is opening {}", path.display()));
        }
        _ => {}
    }
    let (dir, v) = export_to(args, "blender")?;
    let stem = path.file_stem().and_then(|s| s.to_str()).unwrap_or("scene");
    let blend = dir.join(format!("{stem}.blend"));
    let call = format!("build({:?}, {:?})", dir.to_string_lossy(), blend.to_string_lossy());
    let entry = format!("import {{ build }} from \"@raea/blender/scene\";\nconst call = (globalThis as any).__raea_call;\nPromise.resolve().then(() => {call}){}\n", blender_ts::CLOSE);
    let code = blender_ts::session(&entry, None, &[], 900.0)?;
    if code != 0 || !blend.is_file() {
        return Err(format!("Blender couldn't build {} (above)", dir.join("scene.json").display()));
    }
    if !args.iter().any(|a| a == "--no-window") {
        window(&blend, None)?;
    }
    Ok(format!("{}\nbuilt in Blender: {}; after changing it there, save and run: raea blender back {}", export::said(&dir, &v), blend.display(), blend.display()))
}

pub fn blender_back(args: &[String]) -> R<String> {
    let blend = PathBuf::from(args.get(2).filter(|a| a.ends_with(".blend")).ok_or(USAGE)?).canonicalize().map_err(|e| format!("{}: {e}", args[2]))?;
    let dir = blend.parent().ok_or("the .blend's folder")?.to_path_buf();
    if !dir.join("scene.json").is_file() {
        return Err(format!("{} has no scene.json beside it: raea blender back reads a .blend raea blender open made", blend.display()));
    }
    let media = media_of(&dir)?;
    let now = dir.join(".raea-now.json");
    let call = format!("readBack({:?}, {:?})", now.to_string_lossy(), media.to_string_lossy());
    let entry = format!("import {{ readBack }} from \"@raea/blender/scene\";\nconst call = (globalThis as any).__raea_call;\nPromise.resolve().then(() => {call}){}\n", blender_ts::CLOSE);
    let code = blender_ts::session(&entry, Some(&blend), &[], 900.0)?;
    if code != 0 {
        return Err(format!("Blender couldn't read {} (above)", blend.display()));
    }
    compared(&dir, &now, args.iter().any(|a| a == "--json"))
}
