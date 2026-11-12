//! `raea setup godot`, `raea godot types` and `raea godot open`; `raea godot run` is godot_run.rs. raea's Godot is
//! Godot 4.6.1 with GodotJS (github.com/godotjs/GodotJS, MIT): Godot's whole API from TypeScript, on Godot's own
//! JavaScript engine, JavaScriptCore on the Mac and QuickJS-ng on Windows and Linux (no V8). Godot without GodotJS
//! can't run a script, so raea uses an editor build with GodotJS in it (the editor, headless or not, runs scripts and
//! projects): raea's own (GD9, sdk/godot/build), from raea's release, else GodotJS's, from its GitHub release, into
//! ~/.raea/tools/godot and checked against the sha256 pinned here.
use std::path::{Path, PathBuf};
use std::process::Command;

use raea_app_tools::blender::own_dir;

type R<T> = Result<T, String>;

pub const USAGE: &str = "raea setup godot [--check]   (download Godot 4.6.1 with GodotJS, its TypeScript bindings (MIT), into ~/.raea/tools/godot: JavaScriptCore on the Mac, QuickJS on Windows and Linux; raea's own build (the Mac's notarized), else GodotJS's, each checked against its pinned sha256)\n       raea godot run [SCRIPT.ts] [--project DIR] [--window] [--movie FILE [--fps N] [--frames N]] [--scene res://X.tscn] [--size WxH] [--timeout S] [ARGS...]   (a TypeScript script against Godot's whole API through raea/godot: its default export gets the SceneTree and ARGS, headless unless --window; --movie writes every frame Godot draws (NAME.png numbered, or .avi) at a fixed --fps, 30 unless given; the project is DIR, else the nearest project.godot above the script, else an empty one; Godot quits when it returns, or after --frames N; --scene plays a scene of the project under it, with no script needed; a scene in --window plays until the window is closed)\n       raea godot types [DIR]   (the project's own TypeScript types from GodotJS: Godot's API with its scenes, resources and input actions, into DIR/typings)\n       raea godot open [DIR]   (the Godot editor on the project, GodotJS's, to edit its scenes)";

/// The GodotJS release raea downloads (github.com/godotjs/GodotJS/releases); sdk/godot/tools/gen.sh writes
/// raea/godot's types from it, so the two move together.
pub const RELEASE: &str = "v1.1.0.beta1-4.6.1";

/// raea's own builds of the same editors (GD9: sdk/godot/build's macos.sh, linux.py and windows.py, zipped by
/// package.sh; the Mac's signed with raea's Developer ID and notarized), files of raea's release of this tag.
pub const RAEA_RELEASE: &str = "v0.1.1";

/// Where raea's builds are downloaded from; RAEA_GODOT_FROM points elsewhere (a folder as file:///..., to rehearse).
fn raea_base() -> String {
    std::env::var("RAEA_GODOT_FROM").unwrap_or_else(|_| format!("https://github.com/shinyobjectz/raea/releases/download/{RAEA_RELEASE}"))
}

/// One platform's download: who built it, the asset, its sha256 and size, and the program inside its one top folder.
#[derive(Clone, Copy)]
struct Pin {
    by: &'static str,
    asset: &'static str,
    sha256: &'static str,
    size: u64,
    program: &'static str,
}

impl Pin {
    fn url(&self) -> String {
        match self.by {
            "raea" => format!("{}/{}", raea_base(), self.asset),
            _ => format!("https://github.com/godotjs/GodotJS/releases/download/{RELEASE}/{}", self.asset),
        }
    }
}

// raea's Mac build is arm64 and notarized; GodotJS's a universal app, ad-hoc signed
const MAC_RAEA: Pin = Pin { by: "raea", asset: "godot-4.6.1-raea-macos-arm64.zip", sha256: "17e66b8f99134a67db29ce82b88ace7f4c2e4ae651c80a3876ac6bd5e68a8a75", size: 69_132_728, program: "Godot.app/Contents/MacOS/Godot" };
const MAC_GODOTJS: Pin = Pin { by: "GodotJS", asset: "macos-editor-app-4.6.1-jsc.zip", sha256: "8a3022cb07c9740b2acc4a0b6bba6be78fb2fe46ba172b13abd51e6829cdca95", size: 143_940_673, program: "Godot.app/Contents/MacOS/Godot" };
const LINUX_RAEA: Pin = Pin { by: "raea", asset: "godot-4.6.1-raea-linux-x86_64.zip", sha256: "9c86b3e6af0f8cc8a7158685103ccbe15d10aaf246067ec47509909647726b54", size: 78_737_822, program: "godot.linuxbsd.editor.x86_64" };
const LINUX_GODOTJS: Pin = Pin { by: "GodotJS", asset: "linux-editor-4.6.1-qjs-ng.zip", sha256: "daa91d6cff5862ed9e0b3776694fbe4ea0ebb474d244f46ffb3aa5af0318989d", size: 78_737_089, program: "godot.linuxbsd.editor.x86_64" };
const WINDOWS_RAEA: Pin = Pin { by: "raea", asset: "godot-4.6.1-raea-windows-x86_64.zip", sha256: "cf360e7a350f04a1cdb8d1ac475ebfc81518b5b49831ab2ed693f5d8127265e5", size: 73_171_472, program: "godot.windows.editor.x86_64.exe" };
const WINDOWS_GODOTJS: Pin = Pin { by: "GodotJS", asset: "windows-editor-4.6.1-qjs-ng.zip", sha256: "041b761a945b6a34d40f508dbd1accca462d943d2941c3a1a4568f84dd29c1d4", size: 83_915_786, program: "godot.windows.editor.x86_64.exe" };

fn pins() -> R<Vec<Pin>> {
    pins_for(std::env::consts::OS, std::env::consts::ARCH)
}

/// This platform's downloads in the order they're tried: raea's build, then GodotJS's (a release made before raea's
/// builds are among its files still installs). Both hold the program at the same path. A platform GodotJS doesn't
/// build for is told how to bring its own build (GD2), never given a stock Godot.
fn pins_for(os: &str, arch: &str) -> R<Vec<Pin>> {
    match (os, arch) {
        ("macos", "aarch64") => Ok(vec![MAC_RAEA, MAC_GODOTJS]),
        ("macos", _) => Ok(vec![MAC_GODOTJS]),
        ("linux", "x86_64") => Ok(vec![LINUX_RAEA, LINUX_GODOTJS]),
        ("windows", "x86_64") => Ok(vec![WINDOWS_RAEA, WINDOWS_GODOTJS]),
        (os, arch) => Err(format!("GodotJS has no build for {os} {arch}: build it (github.com/godotjs/GodotJS) and `git config --global raea.godot PATH`")),
    }
}

/// Whether the download in own_dir is one this raea pins (raea.json beside it names its sha256), so a moved pin
/// downloads again.
fn own_is_pinned() -> bool {
    let Some(text) = own_dir("godot").ok().and_then(|d| std::fs::read_to_string(d.join("raea.json")).ok()) else { return false };
    let Ok(had) = serde_json::from_str::<serde_json::Value>(&text) else { return false };
    pins().is_ok_and(|ps| ps.iter().any(|p| had["sha256"] == p.sha256))
}

/// The Godot to use and where it came from: `git config --global raea.godot` (a GodotJS build of your own), else
/// raea's download. A Godot without GodotJS isn't looked for: it can't run raea/godot's scripts.
pub fn find() -> Option<(PathBuf, &'static str)> {
    let configured = raea_app_tools::blender::run(Command::new("git").args(["config", "--global", "raea.godot"]), "git config").ok().map(|out| PathBuf::from(out.trim()));
    if let Some(p) = configured.filter(|p| p.is_file()) {
        return Some((p, "raea.godot in git config"));
    }
    let own = own_dir("godot").ok()?.join(pins().ok()?.first()?.program);
    own.is_file().then_some((own, "raea's download"))
}

/// The binary, or what to run to get one.
pub fn binary() -> R<PathBuf> {
    find().map(|(p, _)| p).ok_or_else(|| "no Godot with GodotJS: raea setup godot downloads it".to_string())
}

/// `godot --version`'s line ("4.6.1.stable.gh.14d19694e").
fn version(bin: &Path) -> R<String> {
    let o = Command::new(bin).args(["--headless", "--version"]).output().map_err(|e| format!("{}: {e}", bin.display()))?;
    let out = String::from_utf8_lossy(&o.stdout);
    out.lines().map(str::trim).find(|l| l.chars().next().is_some_and(|c| c.is_ascii_digit())).map(str::to_string).ok_or_else(|| format!("{} --version printed no version", bin.display()))
}

/// Downloads the first pinned editor that comes and matches (raea's, then GodotJS's) into ~/.raea/tools/godot and
/// returns its program, and which it was.
fn download() -> R<(PathBuf, String)> {
    let mut not = Vec::new();
    for p in pins()? {
        match download_one(&p) {
            Ok(program) => return Ok((program, downloaded(&p, &not))),
            Err(e) => not.push(format!("{}'s build: {e}", p.by)),
        }
    }
    Err(format!("no Godot downloaded: {}", not.join("; ")))
}

/// What `raea setup godot` says it downloaded: whose build, and why any tried before it wasn't.
fn downloaded(p: &Pin, not: &[String]) -> String {
    let by = if p.by == "raea" { format!("raea's build ({}, from raea's {RAEA_RELEASE} release)", p.asset) } else { format!("GodotJS's build ({}, from GodotJS {RELEASE})", p.asset) };
    let before = if not.is_empty() { String::new() } else { format!("; {}", not.join("; ")) };
    format!("downloaded Godot 4.6.1 with GodotJS, {by}{before}")
}

/// One pinned download, checked and unpacked into ~/.raea/tools/godot: its program.
fn download_one(p: &Pin) -> R<PathBuf> {
    let dir = own_dir("godot")?;
    let tmp = dir.with_file_name("godot.download");
    let _ = std::fs::remove_dir_all(&tmp);
    std::fs::create_dir_all(&tmp).map_err(|e| format!("{}: {e}", tmp.display()))?;
    let file = tmp.join(p.asset);
    let url = p.url();
    if raea_app_tools::blender::run(Command::new("curl").args(["-fsSL", "--retry", "3", "-o"]).arg(&file).arg(&url), "downloading Godot with GodotJS").is_err() {
        return Err(format!("{url} didn't download"));
    }
    let size = std::fs::metadata(&file).map_err(|e| e.to_string())?.len();
    if size != p.size || raea_app_tools::blender::sha256(&file)? != p.sha256 {
        return Err(format!("{} doesn't match the sha256 raea pins ({size} bytes); nothing installed (it's in {})", p.asset, tmp.display()));
    }
    let unpacked = tmp.join("unpacked");
    unzip(&file, &unpacked)?;
    let program = unpacked.join(p.program);
    if !program.is_file() {
        return Err(format!("{} holds no {}", p.asset, p.program));
    }
    // the zips keep no executable bits
    #[cfg(unix)]
    {
        use std::os::unix::fs::PermissionsExt;
        std::fs::set_permissions(&program, std::fs::Permissions::from_mode(0o755)).map_err(|e| e.to_string())?;
    }
    let release = if p.by == "raea" { RAEA_RELEASE } else { RELEASE };
    std::fs::write(unpacked.join("raea.json"), serde_json::json!({ "by": p.by, "release": release, "asset": p.asset, "sha256": p.sha256 }).to_string()).map_err(|e| e.to_string())?;
    let _ = std::fs::remove_dir_all(&dir);
    std::fs::rename(&unpacked, &dir).map_err(|e| format!("{}: {e}", dir.display()))?;
    let _ = std::fs::remove_dir_all(&tmp);
    Ok(dir.join(p.program))
}

/// A zip's files into `to`, without its one top folder (every GodotJS zip has one).
fn unzip(file: &Path, to: &Path) -> R<()> {
    let f = std::fs::File::open(file).map_err(|e| format!("{}: {e}", file.display()))?;
    let mut z = zip::ZipArchive::new(f).map_err(|e| format!("{}: {e}", file.display()))?;
    for i in 0..z.len() {
        let mut e = z.by_index(i).map_err(|e| e.to_string())?;
        let Some(path) = e.enclosed_name() else { return Err(format!("{} has an entry outside its folder: {}", file.display(), String::from_utf8_lossy(e.name_raw()))) };
        let rel: PathBuf = path.components().skip(1).collect();
        if rel.as_os_str().is_empty() {
            continue;
        }
        let out = to.join(rel);
        if e.is_dir() {
            std::fs::create_dir_all(&out).map_err(|e| e.to_string())?;
            continue;
        }
        if let Some(d) = out.parent() {
            std::fs::create_dir_all(d).map_err(|e| e.to_string())?;
        }
        let mut w = std::fs::File::create(&out).map_err(|e| format!("{}: {e}", out.display()))?;
        std::io::copy(&mut e, &mut w).map_err(|e| format!("{}: {e}", out.display()))?;
    }
    Ok(())
}

/// `raea setup godot [--check]`.
pub fn setup(args: &[String]) -> R<String> {
    let check = args.iter().any(|a| a == "--check");
    let current = own_is_pinned();
    let (bin, from) = match find() {
        Some((p, from)) if from != "raea's download" || current => (p, from.to_string()),
        _ if check => return Err("no Godot with GodotJS that this raea pins: raea setup godot downloads it".into()),
        _ => download()?,
    };
    let v = version(&bin)?;
    Ok(format!("APPLIED  Godot {v} with GodotJS at {} ({from}); raea godot run SCRIPT.ts runs a script against it", bin.display()))
}

/// The project folder: DIR, else the current folder; it needs its project.godot.
fn project(arg: Option<&String>) -> R<PathBuf> {
    let dir = arg.map(PathBuf::from).unwrap_or_else(|| PathBuf::from("."));
    let dir = dir.canonicalize().map_err(|e| format!("{}: {e}", dir.display()))?;
    if !dir.join("project.godot").is_file() {
        return Err(format!("{} has no project.godot", dir.display()));
    }
    Ok(dir)
}

/// `raea godot types [DIR]`: GodotJS's codegen on the project, headless (--generate-types), into DIR/typings.
fn types(args: &[String]) -> R<String> {
    let dir = project(args.get(2))?;
    let o = Command::new(binary()?).args(["--headless", "--editor", "--path"]).arg(&dir).arg("--generate-types").output().map_err(|e| e.to_string())?;
    let log = format!("{}{}", String::from_utf8_lossy(&o.stdout), String::from_utf8_lossy(&o.stderr));
    if !o.status.success() || !log.contains("Type generation complete") {
        let tail: Vec<&str> = log.lines().rev().take(12).collect::<Vec<_>>().into_iter().rev().collect();
        return Err(format!("GodotJS's codegen failed on {}:\n{}", dir.display(), tail.join("\n")));
    }
    let mut n = 0;
    for e in std::fs::read_dir(dir.join("typings")).into_iter().flatten().flatten() {
        n += e.file_name().to_string_lossy().ends_with(".d.ts") as usize;
    }
    Ok(format!("APPLIED  {n} typings files in {} (Godot's API with the project's scenes, resources and input actions); a tsconfig that includes them types `import ... from \"godot\"`", dir.join("typings").display()))
}

/// `raea godot open [DIR]`: the editor on the project, left running.
fn open(args: &[String]) -> R<String> {
    let dir = project(args.get(2))?;
    // its output isn't raea's: a caller reading raea's (the app) would otherwise wait until the editor is closed
    let null = std::process::Stdio::null;
    Command::new(binary()?).args(["--editor", "--path"]).arg(&dir).stdin(null()).stdout(null()).stderr(null()).spawn().map_err(|e| e.to_string())?;
    Ok(format!("APPLIED  the Godot editor (GodotJS) is opening {}", dir.display()))
}

/// `raea godot types|open ...` (run is godot_run::run).
pub fn godot(args: &[String]) -> R<String> {
    match args.get(1).map(String::as_str) {
        Some("types") => types(args),
        Some("open") => open(args),
        Some("run") => crate::godot_run::run(args),
        _ => Err(format!("usage: {USAGE}")),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn every_pin_has_a_full_digest() {
        for (os, arch) in [("macos", "aarch64"), ("macos", "x86_64"), ("linux", "x86_64"), ("windows", "x86_64")] {
            for p in pins_for(os, arch).unwrap() {
                assert_eq!(p.sha256.len(), 64);
                assert!(p.sha256.chars().all(|c| c.is_ascii_hexdigit() && !c.is_ascii_uppercase()));
                assert!(p.asset.ends_with(".zip") && p.size > 50_000_000);
            }
        }
    }

    #[test]
    fn raeas_build_is_tried_first_and_godotjss_after() {
        for (os, arch) in [("macos", "aarch64"), ("linux", "x86_64"), ("windows", "x86_64")] {
            let ps = pins_for(os, arch).unwrap();
            assert_eq!(ps.iter().map(|p| p.by).collect::<Vec<_>>(), ["raea", "GodotJS"], "{os}");
            assert_eq!(ps[0].program, ps[1].program, "{os}: both hold the program at one path");
            assert!(ps[1].url().starts_with("https://github.com/godotjs/GodotJS/releases/download/v1.1.0.beta1-4.6.1/"));
        }
        let mac = pins_for("macos", "aarch64").unwrap();
        if std::env::var_os("RAEA_GODOT_FROM").is_none() {
            assert_eq!(mac[0].url(), "https://github.com/shinyobjectz/raea/releases/download/v0.1.1/godot-4.6.1-raea-macos-arm64.zip");
        }
        // raea builds the Mac editor for arm64 only: an Intel Mac gets GodotJS's universal app
        assert_eq!(pins_for("macos", "x86_64").unwrap().iter().map(|p| p.by).collect::<Vec<_>>(), ["GodotJS"]);
    }

    #[test]
    fn setup_says_whose_build_and_why_not_the_one_before() {
        let ps = pins_for("linux", "x86_64").unwrap();
        assert_eq!(downloaded(&ps[0], &[]), "downloaded Godot 4.6.1 with GodotJS, raea's build (godot-4.6.1-raea-linux-x86_64.zip, from raea's v0.1.1 release)");
        let not = ["raea's build: https://x/godot-4.6.1-raea-linux-x86_64.zip didn't download".to_string()];
        assert_eq!(downloaded(&ps[1], &not), "downloaded Godot 4.6.1 with GodotJS, GodotJS's build (linux-editor-4.6.1-qjs-ng.zip, from GodotJS v1.1.0.beta1-4.6.1); raea's build: https://x/godot-4.6.1-raea-linux-x86_64.zip didn't download");
    }

    #[test]
    fn a_platform_godotjs_doesnt_build_for_is_told_to_bring_its_own() {
        for (os, arch) in [("linux", "aarch64"), ("windows", "aarch64"), ("freebsd", "x86_64")] {
            let e = pins_for(os, arch).err().unwrap_or_default();
            assert!(e.contains("github.com/godotjs/GodotJS") && e.contains("git config --global raea.godot PATH"), "{os} {arch}: {e}");
        }
    }

    #[test]
    fn unzip_drops_the_top_folder() {
        let base = std::env::temp_dir().join(format!("raea-godot-unzip-{}", std::process::id()));
        let _ = std::fs::remove_dir_all(&base);
        std::fs::create_dir_all(&base).unwrap();
        let zf = base.join("a.zip");
        let mut w = zip::ZipWriter::new(std::fs::File::create(&zf).unwrap());
        let o = zip::write::SimpleFileOptions::default().compression_method(zip::CompressionMethod::Deflated);
        w.add_directory("top/", o).unwrap();
        w.start_file("top/Godot.app/Contents/MacOS/Godot", o).unwrap();
        std::io::Write::write_all(&mut w, b"binary").unwrap();
        w.finish().unwrap();
        unzip(&zf, &base.join("out")).unwrap();
        assert_eq!(std::fs::read(base.join("out/Godot.app/Contents/MacOS/Godot")).unwrap(), b"binary");
        let _ = std::fs::remove_dir_all(&base);
    }
}
