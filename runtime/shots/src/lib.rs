//! Shots for compositions: <BlenderShot> and <GodotShot> (sdk/blender/src/shot.tsx, sdk/godot/src/shot.tsx) as native
//! calls (docs/blender.feature BL36, docs/godot.feature GD11). A shot's frames are made by `raea blender shot` or
//! `raea godot shot`, run as a process of their own (this program), once for what they're made from: the request, the
//! script and the files beside it, the .blend, the Godot project's files. They're kept in the composition's asset
//! store under that key, so a render, a `render --at` and a play read the same frames and nothing is drawn by another
//! engine at a frame.

use std::path::{Path, PathBuf};
use std::process::Command;

use serde_json::{Value, json};

type R<T> = Result<T, String>;

const GIVES: &str = "{ dir: string; frames: number }";

pub fn register() {
    raea_native::register(
        "blender.shot",
        "{ script?: string; file?: string; engine?: string; samples?: number; transparent?: boolean; args?: string[]; fps: number; width: number; height: number; frames: number }",
        GIVES,
        "a layer drawn by Blender (<BlenderShot>): a raea/blender script's scene or a .blend's animation rendered frame for frame, made once and kept (0000.png on in dir)",
        |v| shot("blender", v),
    );
    raea_native::register(
        "godot.shot",
        "{ project?: string; script?: string; scene?: string; args?: string[]; fps: number; width: number; height: number; frames: number }",
        GIVES,
        "a layer drawn by Godot's Movie Maker (<GodotShot>): a raea/godot script's scene or a project's scene recorded frame for frame, made once and kept (0000.png on in dir)",
        |v| shot("godot", v),
    );
}

/// FNV-1a over everything a shot is made from, twice with different seeds: a 128-bit key for the asset store.
struct Key([u64; 2]);

impl Key {
    fn new() -> Self {
        Key([0xcbf2_9ce4_8422_2325, 0x6c62_272e_07bb_0142])
    }
    fn write(&mut self, b: &[u8]) {
        for h in self.0.iter_mut() {
            for &x in b.iter().chain(&[0xff]) {
                *h ^= u64::from(x);
                *h = h.wrapping_mul(0x0000_0100_0000_01b3);
            }
        }
    }
    fn hex(&self) -> String {
        format!("{:016x}{:016x}", self.0[0], self.0[1])
    }
}

/// The files under `root` a shot depends on, in a stable order: dot folders (.godot, .git) and node_modules left out.
fn files(root: &Path, out: &mut Vec<PathBuf>) {
    let Ok(rd) = std::fs::read_dir(root) else { return };
    let mut es: Vec<_> = rd.flatten().map(|e| e.path()).collect();
    es.sort();
    for p in es {
        let name = p.file_name().and_then(|n| n.to_str()).unwrap_or("");
        if name.starts_with('.') || name == "node_modules" || out.len() > 20_000 {
            continue;
        }
        if p.is_dir() { files(&p, out) } else { out.push(p) }
    }
}

/// A file's identity: its contents for source (small), its size and time for anything else (a .blend, a project's
/// textures).
fn identity(k: &mut Key, p: &Path) {
    k.write(p.to_string_lossy().as_bytes());
    let source = matches!(p.extension().and_then(|e| e.to_str()), Some("ts" | "tsx" | "js" | "mjs" | "json" | "py" | "gd" | "tscn" | "tres" | "godot"));
    match std::fs::metadata(p) {
        Ok(m) if source && m.len() < 4 << 20 => k.write(&std::fs::read(p).unwrap_or_default()),
        Ok(m) => {
            let t = m.modified().ok().and_then(|t| t.duration_since(std::time::UNIX_EPOCH).ok()).map_or(0, |d| d.as_nanos());
            k.write(format!("{} {t}", m.len()).as_bytes());
        }
        Err(_) => k.write(b"missing"),
    }
}

/// `raea blender shot` / `raea godot shot`'s arguments for this request, the source first.
fn command(engine: &str, v: &Value, dir: &Path, out: &Path) -> R<Vec<String>> {
    let s = |k: &str| v.get(k).and_then(Value::as_str).map(str::to_string);
    // the size and length as whole counts, at least one
    let whole = |k: &str| v[k].as_f64().filter(|x| *x >= 1.0).map(|x| x.round() as u32).ok_or_else(|| format!("{engine}.shot: {k} is a number of 1 or more"));
    let fps = v["fps"].as_f64().filter(|f| *f > 0.0).ok_or_else(|| format!("{engine}.shot: fps is a number over 0"))?;
    let at = |p: String| if p.starts_with("res://") { p } else { dir.join(p).to_string_lossy().into_owned() };
    let src = match engine {
        "blender" => s("script").or_else(|| s("file")).ok_or("BlenderShot: give script or file")?,
        _ => s("script").or_else(|| s("scene")).ok_or("GodotShot: give script or scene")?,
    };
    let (w, h) = (whole("width")?, whole("height")?);
    let mut a = vec![engine.to_string(), "shot".into(), at(src), "-o".into(), out.to_string_lossy().into_owned()];
    a.extend(["--frames".into(), whole("frames")?.to_string(), "--fps".into(), fps.to_string(), "--size".into(), format!("{w}x{h}")]);
    if engine == "blender" {
        if let (Some(_), Some(f)) = (s("script"), s("file")) {
            a.extend(["--file".into(), at(f)]);
        }
        if let Some(e) = s("engine") {
            a.extend(["--engine".into(), e]);
        }
        if let Some(x) = v.get("samples").and_then(Value::as_f64) {
            a.extend(["--samples".into(), (x.round() as u32).to_string()]);
        }
        if v.get("transparent").and_then(Value::as_bool) == Some(true) {
            a.push("--transparent".into());
        }
    } else {
        if let Some(p) = s("project") {
            a.extend(["--project".into(), at(p)]);
        }
        if let (Some(_), Some(sc)) = (s("script"), s("scene")) {
            a.extend(["--scene".into(), sc]);
        }
    }
    let extra: Vec<String> = v.get("args").and_then(Value::as_array).into_iter().flatten().filter_map(|x| x.as_str().map(str::to_string)).collect();
    if !extra.is_empty() {
        a.push("--".into());
        a.extend(extra);
    }
    Ok(a)
}

fn shot(engine: &str, v: &Value) -> R<Value> {
    let dir = raea_runtime_calls::composition_dir().unwrap_or_else(|| PathBuf::from("."));
    let frames = v.get("frames").and_then(Value::as_u64).filter(|n| *n > 0).ok_or_else(|| format!("{engine}.shot: frames must be a whole number over 0"))?;
    // what the frames are made from
    let mut k = Key::new();
    k.write(engine.as_bytes());
    k.write(v.to_string().as_bytes());
    k.write(env!("CARGO_PKG_VERSION").as_bytes());
    let mut deps = Vec::new();
    for key in ["script", "file", "project"] {
        let Some(p) = v.get(key).and_then(Value::as_str).map(|p| dir.join(p)) else { continue };
        match key {
            "script" => files(p.parent().unwrap_or(&dir), &mut deps),
            "project" => files(&p, &mut deps),
            _ => deps.push(p),
        }
    }
    deps.sort();
    deps.dedup();
    for p in &deps {
        identity(&mut k, p);
    }
    let shots = raea_io_assets::Store::beside(&dir.join("edit.tsx")).dir.join("shots");
    let out = shots.join(k.hex());
    if let Some(n) = std::fs::read(out.join("shot.json")).ok().and_then(|b| serde_json::from_slice::<Value>(&b).ok()).and_then(|j| j["frames"].as_u64()) {
        return Ok(json!({ "dir": out.to_string_lossy(), "frames": n }));
    }
    let part = shots.join(format!("{}.part", k.hex()));
    let _ = std::fs::remove_dir_all(&part);
    std::fs::create_dir_all(&part).map_err(|e| format!("{}: {e}", part.display()))?;
    let args = command(engine, v, &dir, &part)?;
    let exe = std::env::current_exe().map_err(|e| e.to_string())?;
    eprintln!("raea: {} shot, made once and kept: raea {}", if engine == "blender" { "Blender's" } else { "Godot's" }, args.join(" "));
    let st = raea_sys_bake::making(|| Command::new(&exe).args(&args).current_dir(&dir).status()).map_err(|e| format!("{}: {e}", exe.display()))?;
    if !st.success() {
        let _ = std::fs::remove_dir_all(&part);
        return Err(format!("{}Shot: raea {} failed ({st}; its output above)", if engine == "blender" { "Blender" } else { "Godot" }, args[..3].join(" ")));
    }
    std::fs::write(part.join("shot.json"), json!({ "frames": frames, "made_by": args }).to_string()).map_err(|e| e.to_string())?;
    let _ = std::fs::remove_dir_all(&out);
    std::fs::rename(&part, &out).map_err(|e| format!("{}: {e}", out.display()))?;
    Ok(json!({ "dir": out.to_string_lossy(), "frames": frames }))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn a_shot_is_keyed_by_what_it_is_made_from() {
        let key = |s: &str| {
            let mut k = Key::new();
            k.write(s.as_bytes());
            k.hex()
        };
        assert_eq!(key("a").len(), 32);
        assert_eq!(key("a"), key("a"));
        assert_ne!(key("a"), key("b"));
    }

    #[test]
    fn the_command_says_the_shot() {
        let dir = Path::new("/p/src");
        let v = json!({ "script": "blender/orbit.ts", "file": "set.blend", "engine": "cycles", "samples": 64, "transparent": true, "fps": 30, "width": 1920, "height": 1080, "frames": 90, "args": ["fast"] });
        let a = command("blender", &v, dir, Path::new("/o")).unwrap().join(" ");
        assert_eq!(a, "blender shot /p/src/blender/orbit.ts -o /o --frames 90 --fps 30 --size 1920x1080 --file /p/src/set.blend --engine cycles --samples 64 --transparent -- fast");
        let v = json!({ "project": "godot", "scene": "res://main.tscn", "fps": 24, "width": 1280, "height": 720, "frames": 48 });
        let a = command("godot", &v, dir, Path::new("/o")).unwrap().join(" ");
        assert_eq!(a, "godot shot res://main.tscn -o /o --frames 48 --fps 24 --size 1280x720 --project /p/src/godot");
        assert!(command("godot", &json!({ "fps": 30, "width": 1, "height": 1, "frames": 1 }), dir, Path::new("/o")).is_err());
    }
}
