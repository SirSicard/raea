//! `raea godot run SCRIPT.ts [--project DIR] [--window] [--movie FILE [--fps N] [--frames N]] [--scene res://X.tscn] [--size WxH]
//! [--timeout S] [ARGS...]`:
//! a TypeScript script against Godot's whole API (raea/godot, sdk/godot). raea's bundler makes one CommonJS file of the
//! script, with GodotJS's modules ("godot", "godot.annotations", ...) aliased to sdk/godot/src/shim's stand-ins, which
//! read GodotJS's own when the script runs. It goes into the project's .godot/raea/<pid>/ as run.js, beside
//! sdk/godot/src/host/main.js, which Godot loads as its main loop (--script): main.js calls the script's default export
//! with the SceneTree and ARGS, then quits. The script runs in Godot, on GodotJS's engine (JavaScriptCore on the Mac,
//! QuickJS elsewhere). --movie is Godot's Movie Maker: each frame drawn and written at a fixed rate, offline, in a window.
use std::io::{BufRead, BufReader, Read};
use std::path::{Path, PathBuf};
use std::process::{Command, Stdio};
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::Arc;
use std::time::{Duration, Instant};

type R<T> = Result<T, String>;

/// GodotJS's modules a script may import, each with its stand-in in sdk/godot/src/shim.
const MODULES: [(&str, &str); 5] = [("godot", "godot.js"), ("godot.annotations", "annotations.js"), ("godot-jsb", "jsb.js"), ("godot.lib.api", "lib-api.js"), ("godot.worker", "worker.js")];

struct Opts {
    script: PathBuf,
    project: Option<PathBuf>,
    window: bool,
    timeout: f64,
    /// Godot's Movie Maker: every frame written to this file (NAME.png numbered, or .avi), at a fixed frame rate
    movie: Option<PathBuf>,
    fps: u32,
    size: Option<String>,
    /// Godot quits after this many frames (--quit-after), not when the script returns: a shot's length (GD11)
    frames: Option<u32>,
    /// a scene of the project added to the tree before the script runs, playing as it would in the game (GD11)
    scene: Option<String>,
    rest: Vec<String>,
}

fn opts(args: &[String]) -> R<Opts> {
    let script = args.get(2).ok_or("raea godot run SCRIPT.ts [--project DIR] [--window] [--movie FILE [--fps N] [--frames N]] [--scene res://X.tscn] [--size WxH] [--timeout S] [ARGS...]")?;
    // no script, only flags: the project's --scene plays with nothing of yours added (sdk/godot/src/host/none.ts)
    let bare = script.starts_with("--");
    let script = if bare { raea_io_home::home().join("sdk/godot/src/host/none.ts") } else { PathBuf::from(script).canonicalize().map_err(|e| format!("{script}: {e}"))? };
    let mut o = Opts { script, project: None, window: false, timeout: 3600.0, movie: None, fps: 30, size: None, frames: None, scene: None, rest: Vec::new() };
    let mut it = args[if bare { 2 } else { 3 }..].iter();
    while let Some(a) = it.next() {
        match a.as_str() {
            "--project" => o.project = Some(PathBuf::from(it.next().ok_or("--project needs a folder")?)),
            "--window" => o.window = true,
            "--timeout" => o.timeout = it.next().and_then(|s| s.parse().ok()).ok_or("--timeout needs seconds")?,
            "--movie" => o.movie = Some(std::path::absolute(it.next().ok_or("--movie needs a file (frames.png or film.avi)")?).map_err(|e| e.to_string())?),
            "--fps" => o.fps = it.next().and_then(|s| s.parse().ok()).filter(|n| *n > 0).ok_or("--fps needs frames a second")?,
            "--frames" => o.frames = Some(it.next().and_then(|s| s.parse().ok()).filter(|n| *n > 0).ok_or("--frames needs a number of frames")?),
            "--scene" => o.scene = Some(it.next().filter(|s| s.starts_with("res://")).ok_or("--scene needs a scene of the project, res://PATH.tscn")?.clone()),
            "--size" => {
                let s = it.next().filter(|s| s.split_once('x').is_some_and(|(w, h)| w.parse::<u32>().is_ok() && h.parse::<u32>().is_ok()));
                o.size = Some(s.ok_or("--size needs WxH")?.clone());
            }
            // everything after -- is the script's, flags too
            "--" => o.rest.extend(it.by_ref().cloned()),
            _ => o.rest.push(a.clone()),
        }
    }
    if bare && o.scene.is_none() {
        return Err("raea godot run without a script plays a scene: give --scene res://PATH.tscn (and --project DIR)".into());
    }
    Ok(o)
}

/// The nearest folder at or above `from` with a project.godot.
fn nearest_project(from: &Path) -> Option<PathBuf> {
    from.ancestors().find(|d| d.join("project.godot").is_file()).map(Path::to_path_buf)
}

/// The script's bundle at `out`: its module as M on globalThis.__raea_godot_main, GodotJS's modules aliased.
fn bundle(script: &Path, out: &Path) -> R<()> {
    let shim = raea_io_home::home().join("sdk/godot/src/shim");
    let entry = format!("import * as M from {:?};\n(globalThis as any).__raea_godot_main = M;\n", dunce::simplified(script).display().to_string());
    let aliases: Vec<String> = MODULES.iter().map(|(m, f)| format!("{m}={}", shim.join(f).display())).collect();
    let mut extra: Vec<&str> = Vec::new();
    for a in &aliases {
        extra.extend(["--alias", a.as_str()]);
    }
    raea_runtime_bundle::bundle_entry(&entry, out, &extra)
}

/// One line of Godot's output as raea prints it: GodotJS's console prefix gone, and what every run prints dropped:
/// Godot's banner and the blank line after it, the JavaScriptCore build's note that it has no promise-rejection hook,
/// and the leaks reported at exit (GodotJS 1.1's values, Godot's RIDs and objects the script left: harmless once it
/// has quit; each with its "at:" line). It also notes when a callback of the script threw: GodotJS prints the
/// exception, its stack and an "at: _call" line, and Godot carries on, so the run is stopped (`threw`).
pub(crate) struct Clean {
    skip_at: bool,
    skip_blank: bool,
    in_throw: bool,
    pub(crate) threw: bool,
}

impl Clean {
    pub(crate) fn new() -> Self {
        Clean { skip_at: false, skip_blank: false, in_throw: false, threw: false }
    }
    pub(crate) fn line(&mut self, l: &str) -> Option<String> {
        let t = l.trim_start();
        if t.contains("[jsb][Error] exception thrown in function") {
            self.in_throw = true;
        } else if self.in_throw && t.starts_with("at: _call (modules/GodotJS/") {
            self.in_throw = false;
            self.threw = true;
        }
        let (at, blank) = (std::mem::take(&mut self.skip_at), std::mem::take(&mut self.skip_blank));
        if (at && t.starts_with("at: ")) || (blank && t.is_empty()) {
            return None;
        }
        let exit_leak = t.contains(" leaked") && (t.contains("RID") || t.contains("ObjectDB"));
        if t.contains("variant pool leaked") || t.contains("Pages in use exist at exit in PagedAllocator") || exit_leak {
            self.skip_at = true;
            return None;
        }
        if t.starts_with("Godot Engine v") && t.contains("godotengine.org") {
            self.skip_blank = true;
            return None;
        }
        if t.contains("SetPromiseRejectCallback is not supported") {
            return None;
        }
        Some(l.strip_prefix("[JS] ").unwrap_or(l).to_string())
    }
}

fn forward(from: impl Read + Send + 'static, err: bool, threw: Arc<AtomicBool>) -> std::thread::JoinHandle<()> {
    std::thread::spawn(move || {
        let mut c = Clean::new();
        for l in BufReader::new(from).lines().map_while(Result::ok) {
            if let Some(l) = c.line(&l) {
                if err { eprintln!("{l}") } else { println!("{l}") }
            }
            if c.threw {
                threw.store(true, Ordering::SeqCst);
            }
        }
    })
}

/// The window size Godot's Movie Maker records: the project's display/window/size/viewport_width and _height
/// (Godot's own --resolution sizes the window, not the movie), 1152x648 when it sets none.
fn project_size(project_godot: &str) -> (u32, u32) {
    let mut size = (1152, 648);
    let mut display = false;
    for l in project_godot.lines().map(str::trim) {
        if l.starts_with('[') {
            display = l == "[display]";
        } else if display {
            let Some((key, v)) = l.split_once('=') else { continue };
            match (key.trim(), v.trim().parse::<u32>()) {
                ("window/size/viewport_width", Ok(w)) => size.0 = w,
                ("window/size/viewport_height", Ok(h)) => size.1 = h,
                _ => {}
            }
        }
    }
    size
}

fn parse_size(s: &str) -> Option<(u32, u32)> {
    let (w, h) = s.split_once('x')?;
    Some((w.parse().ok()?, h.parse().ok()?))
}

/// `raea godot run ...`.
pub fn run(args: &[String]) -> R<String> {
    let o = opts(args)?;
    let bin = crate::godot::binary()?;
    let home = raea_io_home::home();
    let host = home.join("sdk/godot/src/host/main.js");
    if !host.is_file() {
        return Err(format!("{} is missing: this raea's install has no sdk/godot", host.display()));
    }
    // the project: --project, the nearest project.godot above the script, else an empty one for this run
    let found = match &o.project {
        Some(p) => Some(p.canonicalize().map_err(|e| format!("{}: {e}", p.display()))?),
        None => nearest_project(o.script.parent().unwrap_or(Path::new("."))),
    };
    let temp = std::env::temp_dir().join(format!("raea-godot-{}", std::process::id()));
    let project = match found {
        Some(p) if p.join("project.godot").is_file() => p,
        Some(p) => return Err(format!("{} has no project.godot", p.display())),
        None => {
            std::fs::create_dir_all(&temp).map_err(|e| e.to_string())?;
            // --size is the window's size, which is what Movie Maker records
            let display = match o.size.as_deref().and_then(parse_size) {
                Some((w, h)) => format!("\n[display]\nwindow/size/viewport_width={w}\nwindow/size/viewport_height={h}\n"),
                None => String::new(),
            };
            let text = format!("config_version=5\n\n[application]\nconfig/name=\"raea godot run\"\n{display}");
            std::fs::write(temp.join("project.godot"), text).map_err(|e| e.to_string())?;
            temp.clone()
        }
    };
    // a project's own movie is its window's size: say so rather than record another one
    if let (Some(_), Some(want), true) = (&o.movie, o.size.as_deref().and_then(parse_size), project != temp) {
        let has = project_size(&std::fs::read_to_string(project.join("project.godot")).unwrap_or_default());
        if has != want {
            return Err(format!(
                "Godot's Movie Maker records {}'s window, {}x{}, not --size {}x{}: set display/window/size/viewport_width and _height in its project.godot",
                project.display(), has.0, has.1, want.0, want.1
            ));
        }
    }
    // a project Godot never opened has its assets unimported, so its scenes wouldn't load: import them first
    if project != temp && !project.join(".godot").is_dir() {
        let s = Command::new(&bin).args(["--headless", "--path"]).arg(&project).arg("--import").stdout(Stdio::null()).stderr(Stdio::null()).status().map_err(|e| e.to_string())?;
        if !s.success() {
            return Err(format!("Godot couldn't import {}'s assets (godot --headless --import)", project.display()));
        }
    }
    let pid = std::process::id();
    let work = project.join(format!(".godot/raea/{pid}"));
    std::fs::create_dir_all(&work).map_err(|e| format!("{}: {e}", work.display()))?;
    let ran = (|| {
        std::fs::copy(&host, work.join("main.js")).map_err(|e| format!("{}: {e}", host.display()))?;
        bundle(&o.script, &work.join("run.js"))?;
        let mut cmd = Command::new(&bin);
        // a movie is drawn, so it needs the window; headless Godot draws nothing
        if let Some(m) = &o.movie {
            if let Some(d) = m.parent() {
                std::fs::create_dir_all(d).map_err(|e| format!("{}: {e}", d.display()))?;
            }
            // on top: macOS stops drawing a window other windows cover, and Movie Maker then writes its last frame again
            cmd.arg("--write-movie").arg(m).arg("--fixed-fps").arg(o.fps.to_string()).arg("--always-on-top");
        } else if !o.window {
            cmd.arg("--headless");
        }
        if let Some(s) = &o.size {
            cmd.arg("--resolution").arg(s);
        }
        // a set length: Godot stops after it, and main.js doesn't quit when the script returns
        if let Some(n) = o.frames {
            cmd.arg("--quit-after").arg(n.to_string()).env("RAEA_GODOT_HOLD", "1");
        }
        if let Some(sc) = &o.scene {
            cmd.env("RAEA_GODOT_SCENE", sc);
        }
        cmd.arg("--path").arg(&project).arg("--script").arg(format!("res://.godot/raea/{pid}/main.js")).arg("--").args(&o.rest);
        cmd.env("RAEA_GODOT_LOADED", work.join("loaded"));
        // Godot runs in the project's folder: raea/godot's cwd() and resolve() read where raea was run from
        if let Ok(here) = std::env::current_dir() {
            cmd.env("RAEA_CWD", here);
        }
        let mut child = cmd.stdout(Stdio::piped()).stderr(Stdio::piped()).spawn().map_err(|e| format!("{}: {e}", bin.display()))?;
        let threw = Arc::new(AtomicBool::new(false));
        let outs = [forward(child.stdout.take().unwrap(), false, threw.clone()), forward(child.stderr.take().unwrap(), true, threw.clone())];
        let deadline = Instant::now() + Duration::from_secs_f64(o.timeout);
        let status = loop {
            if let Some(s) = child.try_wait().map_err(|e| e.to_string())? {
                break Ok(s);
            }
            // a callback that threw leaves Godot running on a broken script: stop it, as main.js does when main() throws
            if threw.load(Ordering::SeqCst) {
                let _ = child.kill();
                let _ = child.wait();
                break Err(format!("{} threw (above); Godot was stopped", o.script.display()));
            }
            if Instant::now() >= deadline {
                let _ = child.kill();
                let _ = child.wait();
                break Err(format!("{} didn't finish in {} s (--timeout); Godot was stopped", o.script.display(), o.timeout));
            }
            std::thread::sleep(Duration::from_millis(20));
        };
        for t in outs {
            let _ = t.join();
        }
        status
    })();
    // main.js writes it once the script has loaded: Godot exits 0 when it couldn't load the script at all
    let loaded = work.join("loaded").is_file();
    let _ = std::fs::remove_dir_all(&work);
    if project == temp {
        let _ = std::fs::remove_dir_all(&temp);
    }
    let status = ran?;
    if !loaded {
        return Err(format!("Godot couldn't load {} (GodotJS's errors above)", o.script.display()));
    }
    match status.code() {
        Some(0) => Ok(String::new()),
        Some(c) => Err(format!("{} ended with exit {c}", o.script.display())),
        None => Err(format!("Godot stopped running {} ({status})", o.script.display())),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn clean_keeps_the_script_and_drops_the_exit_noise() {
        let mut c = Clean::new();
        let lines = [
            "Godot Engine v4.6.1.stable.gh.14d19694e - https://godotengine.org",
            "",
            "[jsc][Log] SetPromiseRejectCallback is not supported",
            "[JS] PASS 3",
            "",
            "WARNING: [jsb][Warning] variant pool leaked",
            "     at: ~VariantAllocator (modules/GodotJS/bridge/../impl/jsc/../../internal/jsb_variant_allocator.h:43)",
            "ERROR: Pages in use exist at exit in PagedAllocator: 7Variant",
            "   at: ~PagedAllocator (./core/templates/paged_allocator.h:169)",
            "ERROR: a real error",
            "   at: somewhere (file.cpp:1)",
        ];
        let kept: Vec<String> = lines.iter().filter_map(|l| c.line(l)).collect();
        assert_eq!(kept, ["PASS 3", "", "ERROR: a real error", "   at: somewhere (file.cpp:1)"]);
        for l in [
            "WARNING: 3 RIDs of type \"CanvasItem\" were leaked.",
            "     at: _free_rids (servers/rendering/renderer_canvas_cull.cpp:2678)",
            "WARNING: ObjectDB instances leaked at exit (run with --verbose for details).",
            "     at: cleanup (core/object/object.cpp:2378)",
        ] {
            assert_eq!(c.line(l), None, "{l}");
        }
        assert!(!c.threw);
    }

    #[test]
    fn a_callback_that_threw_is_noted_once_its_stack_is_out() {
        let mut c = Clean::new();
        let lines = [
            "ERROR: [jsb][Error] exception thrown in function:",
            "undefined is not an object (evaluating 'this.logo.position')",
            "_process@/tmp/p/.godot/raea/1/run.js:1575:14",
        ];
        for l in lines {
            assert!(c.line(l).is_some());
            assert!(!c.threw);
        }
        assert!(c.line("   at: _call (modules/GodotJS/bridge/jsb_environment.cpp:1737)").is_some());
        assert!(c.threw);
    }

    #[test]
    fn movie_size_is_the_projects_window() {
        assert_eq!(project_size("config_version=5\n"), (1152, 648));
        let p = "[application]\nconfig/name=\"x\"\n\n[display]\nwindow/size/viewport_width=1920\nwindow/size/viewport_height=1080\n";
        assert_eq!(project_size(p), (1920, 1080));
        assert_eq!(project_size("[rendering]\nwindow/size/viewport_width=10\n"), (1152, 648));
        assert_eq!(parse_size("960x540"), Some((960, 540)));
        assert_eq!(parse_size("960"), None);
    }

    #[test]
    fn the_nearest_project_is_above_the_script() {
        let base = std::env::temp_dir().join(format!("raea-godot-near-{}", std::process::id()));
        std::fs::create_dir_all(base.join("scripts/deep")).unwrap();
        std::fs::write(base.join("project.godot"), "").unwrap();
        assert_eq!(nearest_project(&base.join("scripts/deep")), Some(base.clone()));
        let _ = std::fs::remove_dir_all(&base);
    }
}
