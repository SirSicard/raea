//! A shot's frames made by another engine, numbered from DIR/0000.png (docs/blender.feature BL36, docs/godot.feature
//! GD11): what <BlenderShot> and <GodotShot> show, made through their native calls (runtime/react's scene/shots.rs).
//!   raea blender shot SCRIPT.ts|FILE.blend -o DIR --frames N [--fps F] [--size WxH] [--file FILE.blend]
//!     [--engine eevee|cycles|workbench] [--samples S] [--transparent] [--timeout S] [-- ARGS]
//!   raea godot shot SCRIPT.ts|res://SCENE.tscn [--project DIR] -o DIR --frames N [--fps F] [--size WxH] [--scene res://X]
//!     [--timeout S] [-- ARGS]

use std::collections::BTreeMap;
use std::path::{Path, PathBuf};

use serde_json::json;

use crate::{R, blender_ts};

pub const BLENDER_USAGE: &str = "raea blender shot SCRIPT.ts|FILE.blend -o DIR --frames N [--fps F] [--size WxH] [--file FILE.blend] [--engine eevee|cycles|workbench] [--samples S] [--transparent] [--timeout S] [-- ARGS]";
/// Both, as raea's help says them.
pub const USAGE: &str = "raea blender shot SCRIPT.ts|FILE.blend -o DIR --frames N [--fps F] [--size WxH] [--engine eevee|cycles|workbench] [--samples S] [--transparent]   (a shot's frames rendered by Blender, DIR/0000.png on: a raea/blender script's scene or a .blend's animation; what <BlenderShot> shows, from raea/blender/shot)\n       raea godot shot SCRIPT.ts|res://SCENE.tscn [--project DIR] -o DIR --frames N [--fps F] [--size WxH]   (a shot's frames recorded by Godot's Movie Maker, DIR/0000.png on, its sound as sound.wav; what <GodotShot> shows, from raea/godot/shot)";
pub const GODOT_USAGE: &str = "raea godot shot SCRIPT.ts|res://SCENE.tscn [--project DIR] -o DIR --frames N [--fps F] [--size WxH] [--scene res://X.tscn] [--timeout S] [-- ARGS]";

#[derive(Debug)]
struct Shot {
    src: String,
    out: PathBuf,
    frames: u32,
    fps: f64,
    size: (u32, u32),
    transparent: bool,
    /// the flags that take a value, by name
    flags: BTreeMap<String, String>,
    rest: Vec<String>,
}

/// args[2] the source, then the flags (each taking a value but --transparent), then -- and the script's own.
fn parse(args: &[String], usage: &str) -> R<Shot> {
    let src = args.get(2).filter(|a| !a.starts_with('-')).ok_or(usage)?.clone();
    let (mut flags, mut rest, mut transparent) = (BTreeMap::new(), Vec::new(), false);
    let mut it = args[3..].iter();
    while let Some(a) = it.next() {
        match a.as_str() {
            "--" => rest.extend(it.by_ref().cloned()),
            "--transparent" => transparent = true,
            f if f.starts_with('-') => _ = flags.insert(a.clone(), it.next().ok_or_else(|| format!("{a} needs a value: {usage}"))?.clone()),
            _ => return Err(format!("{a}: not a flag of this verb: {usage}")),
        }
    }
    let out = std::path::absolute(flags.get("-o").ok_or(usage)?).map_err(|e| e.to_string())?;
    let frames = flags.get("--frames").and_then(|n| n.parse().ok()).filter(|n| *n > 0).ok_or("--frames needs a number of frames over 0")?;
    let fps: f64 = match flags.get("--fps") {
        Some(f) => f.parse().ok().filter(|f: &f64| *f > 0.0).ok_or("--fps needs frames a second")?,
        None => 30.0,
    };
    let size = match flags.get("--size") {
        Some(s) => s.split_once('x').and_then(|(w, h)| Some((w.parse().ok()?, h.parse().ok()?))).ok_or("--size needs WxH")?,
        None => (1920, 1080),
    };
    Ok(Shot { src, out, frames, fps, size, transparent, flags, rest })
}

/// The frames a run wrote in `dir` (Blender's 0001.png on, Godot's f00000000.png on), by their number: the first
/// `n` renamed 0000.png on, any past them removed. Too few is the run's failure.
pub(crate) fn renumber(dir: &Path, n: u32) -> R<()> {
    let number = |p: &Path| p.file_stem()?.to_str()?.trim_start_matches(|c: char| !c.is_ascii_digit()).parse::<u64>().ok();
    let mut made: Vec<(u64, PathBuf)> = std::fs::read_dir(dir).map_err(|e| format!("{}: {e}", dir.display()))?
        .flatten()
        .map(|e| e.path())
        .filter(|p| p.extension().is_some_and(|e| e == "png"))
        .filter_map(|p| Some((number(&p)?, p)))
        .collect();
    made.sort();
    if made.len() < n as usize {
        return Err(format!("{} frames were made of the {n} asked for ({})", made.len(), dir.display()));
    }
    // through a name of their own first, so 0001.png -> 0000.png never meets a frame not yet moved
    let mut moved = Vec::new();
    for (i, (_, p)) in made.iter().enumerate() {
        if i < n as usize {
            let tmp = dir.join(format!("raea-{i:06}.tmp"));
            std::fs::rename(p, &tmp).map_err(|e| format!("{}: {e}", p.display()))?;
            moved.push((i, tmp));
        } else {
            let _ = std::fs::remove_file(p);
        }
    }
    for (i, tmp) in moved {
        std::fs::rename(&tmp, dir.join(format!("{i:04}.png"))).map_err(|e| e.to_string())?;
    }
    Ok(())
}

fn fresh(out: &Path) -> R<()> {
    let _ = std::fs::remove_dir_all(out);
    std::fs::create_dir_all(out).map_err(|e| format!("{}: {e}", out.display()))
}

/// `raea blender shot ...`: the script's default export run (or the .blend opened), then sdk/blender's shoot().
pub fn blender(args: &[String]) -> R<String> {
    let s = parse(args, BLENDER_USAGE)?;
    let src = std::path::absolute(&s.src).map_err(|e| e.to_string())?;
    let is_blend = s.src.ends_with(".blend");
    let file = if is_blend { Some(src.clone()) } else { s.flags.get("--file").map(PathBuf::from) };
    if let Some(f) = file.as_ref().filter(|f| !f.is_file()) {
        return Err(format!("{}: no such .blend", f.display()));
    }
    fresh(&s.out)?;
    let mut opts = json!({ "out": s.out.to_string_lossy(), "frames": s.frames, "fps": s.fps, "width": s.size.0, "height": s.size.1, "transparent": s.transparent });
    if let Some(e) = s.flags.get("--engine").map(String::as_str) {
        opts["engine"] = json!(e);
    }
    if let Some(n) = s.flags.get("--samples").map(String::as_str) {
        opts["samples"] = json!(n.parse::<u32>().map_err(|_| "--samples needs a whole number")?);
    }
    let shoot = "import { shoot } from \"@raea/blender/shoot\";\nconst call = (globalThis as any).__raea_call;\n";
    let entry = if is_blend {
        format!("{shoot}Promise.resolve().then(() => shoot({opts})){}\n", blender_ts::CLOSE)
    } else {
        let ts = src.canonicalize().map_err(|e| format!("{}: {e}", s.src))?;
        format!("import * as M from {};\n{shoot}{}.then(() => shoot({opts})){}\n", blender_ts::spec(&ts), blender_ts::DEFAULT, blender_ts::CLOSE)
    };
    let mut rest = s.rest.clone();
    let secs = s.flags.get("--timeout").map(String::as_str).and_then(|t| t.parse().ok()).unwrap_or_else(|| blender_ts::timeout(&mut rest));
    let code = blender_ts::session(&entry, file.as_deref(), &rest, secs)?;
    if code != 0 {
        return Err(format!("{} ended with exit {code}", s.src));
    }
    renumber(&s.out, s.frames)?;
    Ok(format!("{} frames by Blender in {}", s.frames, s.out.display()))
}

/// Godot's window size for the shot: an override.cfg in the project (Godot reads it over project.godot) for the
/// length of the run, since Movie Maker records the window the project opens; put back as it was after.
struct Override {
    path: PathBuf,
    before: Option<Vec<u8>>,
}

impl Override {
    fn set(project: &Path, (w, h): (u32, u32)) -> R<Override> {
        let path = project.join("override.cfg");
        let before = std::fs::read(&path).ok();
        let mut text = before.as_deref().map(String::from_utf8_lossy).unwrap_or_default().into_owned();
        text.push_str(&format!("\n[display]\nwindow/size/viewport_width={w}\nwindow/size/viewport_height={h}\n"));
        std::fs::write(&path, text).map_err(|e| format!("{}: {e}", path.display()))?;
        Ok(Override { path, before })
    }
}

impl Drop for Override {
    fn drop(&mut self) {
        let _ = match &self.before {
            Some(b) => std::fs::write(&self.path, b),
            None => std::fs::remove_file(&self.path),
        };
    }
}

/// `raea godot shot ...`: `raea godot run` with --movie, --frames and --scene, its frames renumbered; the sound Movie
/// Maker writes beside them kept as sound.wav.
pub fn godot(args: &[String]) -> R<String> {
    let s = parse(args, GODOT_USAGE)?;
    let none = raea_io_home::home().join("sdk/godot/src/host/none.ts");
    let (script, scene) = match s.src.strip_prefix("res://") {
        Some(_) => (none.to_string_lossy().into_owned(), Some(s.src.clone())),
        None => (s.src.clone(), s.flags.get("--scene").cloned()),
    };
    fresh(&s.out)?;
    let mut run = vec!["godot".to_string(), "run".into(), script, "--movie".into(), s.out.join("f.png").to_string_lossy().into_owned()];
    run.extend(["--fps".into(), s.fps.round().to_string(), "--frames".into(), s.frames.to_string()]);
    let _over = match s.flags.get("--project").map(String::as_str) {
        Some(p) => {
            run.extend(["--project".into(), p.to_string()]);
            Some(Override::set(Path::new(p), s.size)?)
        }
        None => {
            run.extend(["--size".into(), format!("{}x{}", s.size.0, s.size.1)]);
            None
        }
    };
    if let Some(sc) = scene {
        run.extend(["--scene".into(), sc]);
    }
    if let Some(t) = s.flags.get("--timeout").map(String::as_str) {
        run.extend(["--timeout".into(), t.to_string()]);
    }
    if !s.rest.is_empty() {
        run.push("--".into());
        run.extend(s.rest.iter().cloned());
    }
    crate::godot_run::run(&run)?;
    let wav = s.out.join("f.wav");
    if wav.is_file() {
        let _ = std::fs::rename(&wav, s.out.join("sound.wav"));
    }
    renumber(&s.out, s.frames)?;
    Ok(format!("{} frames by Godot in {}", s.frames, s.out.display()))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn frames_are_numbered_from_zero_by_their_own_numbers() {
        let d = std::env::temp_dir().join(format!("raea-shot-renumber-{}", std::process::id()));
        fresh(&d).unwrap();
        for f in ["0001.png", "0002.png", "0003.png", "10000.png", "notes.txt"] {
            std::fs::write(d.join(f), f).unwrap();
        }
        renumber(&d, 3).unwrap();
        assert_eq!(std::fs::read_to_string(d.join("0000.png")).unwrap(), "0001.png");
        assert_eq!(std::fs::read_to_string(d.join("0002.png")).unwrap(), "0003.png");
        assert!(!d.join("10000.png").exists() && !d.join("0003.png").exists() && d.join("notes.txt").exists());
        // Godot's names, and too few
        fresh(&d).unwrap();
        for f in ["f00000000.png", "f00000001.png"] {
            std::fs::write(d.join(f), f).unwrap();
        }
        assert!(renumber(&d, 3).unwrap_err().contains("2 frames were made of the 3"));
        renumber(&d, 2).unwrap();
        assert_eq!(std::fs::read_to_string(d.join("0001.png")).unwrap(), "f00000001.png");
        let _ = std::fs::remove_dir_all(&d);
    }

    #[test]
    fn a_shot_needs_its_out_and_length() {
        let a = |s: &str| s.split_whitespace().map(String::from).collect::<Vec<_>>();
        assert!(parse(&a("blender shot x.ts --frames 3"), BLENDER_USAGE).is_err());
        assert!(parse(&a("blender shot x.ts -o d"), BLENDER_USAGE).unwrap_err().contains("--frames"));
        let s = parse(&a("godot shot res://m.tscn -o d --frames 4 --size 640x360 --project p -- go"), GODOT_USAGE).unwrap();
        assert_eq!((s.frames, s.size, s.flags.get("--project").map(String::as_str), s.rest.clone()), (4, (640, 360), Some("p"), vec!["go".to_string()]));
    }
}
