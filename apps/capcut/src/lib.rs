//! `raea export capcut EDIT.tsx` (docs/capcut.feature CC2): the composition as a CapCut draft ready in its timeline.
//! And `raea render ... -o OUT.mov --alpha` (CC1), the transparent movie its overlays are, for any editor.
//! Three renders of it: as it is, with its manifest (the reference render, and what shows when: each file's runs,
//! each sound clip); with its footage and the backgrounds holding it hidden, transparent (what raea draws over the
//! footage); and with only those backgrounds (what it draws under). The footage and sounds become clips of their own
//! files at their trims and gains; what raea draws becomes clips of transparent movies (raea-io-alpha), cut where the
//! drawing comes and goes, the one under the footage left out when it's black; raea-io-capcut writes the draft.

mod media;
pub mod plan;
#[cfg(test)]
mod tests;

use std::path::{Path, PathBuf};
use std::process::Command;

use raea_io_capcut::{Clip, Kind, Media, MediaKind, Place, Timeline, Track};
use raea_runtime_bundle::flag;
use serde_json::Value;

pub type R<T> = Result<T, String>;

pub const USAGE: &str = "raea export capcut EDIT.tsx [--composition ID] [-o DIR] [--name NAME] [--alpha-codec prores|hevc|rle|png] [--no-register]   (the composition as a CapCut draft ready in its timeline: its footage and sounds as clips of their own files at their trims and gains, everything raea draws as transparent overlay clips above them; into CapCut's projects, entered in its project list while CapCut is closed, or a draft folder in DIR; the reference render and the overlay movie kept in out/capcut/NAME)";

/// `export capcut ...` (or what export takes), and `render ... -o OUT.mov --alpha` through `render`, the CLI's own;
/// None for anything else.
pub fn cli(args: &[String], render: impl Fn(&[String]) -> R<String>) -> Option<R<String>> {
    match args.first().map(String::as_str) {
        Some("export") => Some(match args.get(1).map(String::as_str) {
            Some("capcut") => export(&args[2..]),
            other => Err(format!("raea export takes where to export to{}: capcut\nusage: {USAGE}", other.map_or(String::new(), |o| format!(", not {o:?}")))),
        }),
        Some("render") => movie(args, render),
        _ => None,
    }
}

/// `render ... -o OUT.mov --alpha`: the frames as transparent PNGs, then one movie of them, the overlay an editor lays
/// over footage (raea-io-alpha, docs/capcut.feature CC1); None for any other render.
fn movie(args: &[String], render: impl Fn(&[String]) -> R<String>) -> Option<R<String>> {
    let out = flag(args, "-o").filter(|o| args.iter().any(|a| a == "--alpha") && o.to_lowercase().ends_with(".mov"))?;
    let quality = match flag(args, "--quality").map(|q| raea_io_media::parse_quality(&q)).transpose() {
        Ok(q) => q.unwrap_or(0.9),
        Err(e) => return Some(Err(e.to_string())),
    };
    Some(raea_io_alpha::render_movie(args, Path::new(&out), flag(args, "--alpha-codec").as_deref(), flag(args, "--manifest").map(PathBuf::from), quality, render))
}

/// `raea render ARGS` by this same program, with `env` set; its output said through, its failure the export's.
fn render(args: &[String], env: &[(&str, &str)]) -> R<()> {
    let exe = std::env::current_exe().map_err(|e| e.to_string())?;
    let mut c = Command::new(exe);
    c.arg("render").args(args);
    for (k, v) in env {
        c.env(k, v);
    }
    let out = c.output().map_err(|e| e.to_string())?;
    if !out.status.success() {
        let said = format!("{}{}", String::from_utf8_lossy(&out.stdout), String::from_utf8_lossy(&out.stderr));
        return Err(format!("the render failed:\n{}", said.trim()));
    }
    Ok(())
}

fn export(args: &[String]) -> R<String> {
    let tsx = args.first().filter(|a| !a.starts_with('-')).ok_or(USAGE)?;
    let tsx = PathBuf::from(tsx).canonicalize().map_err(|e| format!("{tsx}: {e}"))?;
    let dir = tsx.parent().unwrap().to_path_buf();
    let codec = flag(args, "--alpha-codec").map_or(Ok(raea_io_alpha::Codec::default_here()), |c| raea_io_alpha::Codec::parse(&c))?;
    let (root, in_store) = match flag(args, "-o") {
        Some(o) => (PathBuf::from(o), false),
        None => {
            let s = raea_io_capcut::store_root().ok_or("CapCut keeps its projects only on a Mac or Windows: -o DIR writes the draft folder anywhere")?;
            if !s.parent().is_some_and(Path::exists) {
                return Err(format!("CapCut hasn't kept a project on this machine ({} isn't there): open CapCut once, or write the draft folder with -o DIR", s.display()));
            }
            if !args.iter().any(|a| a == "--no-register") && raea_io_capcut::capcut_running() {
                return Err("CapCut is open: it rewrites its project list when it quits, which would drop the new draft from it. Quit CapCut and export again, or pass --no-register (the draft lands in its folder, unlisted) or -o DIR".into());
            }
            (s, true)
        }
    };
    let stem = tsx.file_stem().unwrap().to_string_lossy().into_owned();
    let mut name = flag(args, "--name").unwrap_or(stem);
    if root.join(&name).exists() {
        let base = name.clone();
        name = (2..).map(|k| format!("{base} {k}")).find(|n| !root.join(n).exists()).unwrap();
    }
    let work = dir.join("out/capcut").join(&name);
    std::fs::create_dir_all(&work).map_err(|e| format!("{}: {e}", work.display()))?;
    let comp: Vec<String> = flag(args, "--composition").map(|c| vec!["--composition".into(), c]).unwrap_or_default();
    let s = |p: &Path| p.display().to_string();

    // 1. as it is: the reference render and its manifest
    let (reference, manifest_path) = (work.join("reference.mp4"), work.join("render.json"));
    render(&[[s(&tsx), "-o".into(), s(&reference), "--manifest".into(), s(&manifest_path)].as_slice(), &comp].concat(), &[])?;
    let manifest: Value = serde_json::from_str(&std::fs::read_to_string(&manifest_path).map_err(|e| e.to_string())?).map_err(|e| e.to_string())?;
    let (w, h, fps) = (manifest["width"].as_u64().unwrap_or(0) as u32, manifest["height"].as_u64().unwrap_or(0) as u32, manifest["fps"].as_f64().unwrap_or(30.0));
    let (wf, hf) = (w as f64, h as f64);

    // 2. its footage hidden, transparent: what raea draws over it
    let runs = plan::runs(&manifest, fps);
    let frames = work.join(format!("overlay.{}.frames", std::process::id()));
    let drawn_result = render(&[[s(&tsx), "-o".into(), format!("{}/", frames.display()), "--alpha".into()].as_slice(), &comp].concat(), &[("RAEA_HIDE_MEDIA", "1")]);
    // footage the overlay covers (opaque over most of its box at its middle frame) is drawn over the overlay: what the
    // composition draws under it, a background
    let covered: Vec<bool> = runs.iter().map(|r| drawn_result.is_ok() && opaque_under(&frames, r)).collect();
    let overlay = work.join(format!("overlay.{}.mov", ext_of(codec)));
    let made = drawn_result.and_then(|_| raea_io_alpha::encode_dir(&frames, &overlay, codec, fps, 0.9));
    // the frames folder this export made, and only it
    let _ = std::fs::remove_dir_all(&frames);
    let made = made?;

    // 3. only the backgrounds holding the footage: what raea draws under it, unless that's black (CapCut's canvas)
    let under = if runs.is_empty() {
        None
    } else {
        let frames = work.join(format!("under.{}.frames", std::process::id()));
        let out = work.join(format!("under.{}.mov", ext_of(codec)));
        let done = render(&[[s(&tsx), "-o".into(), format!("{}/", frames.display()), "--alpha".into()].as_slice(), &comp].concat(), &[("RAEA_HIDE_MEDIA", "under")])
            .and_then(|_| if lit(&frames) { raea_io_alpha::encode_dir(&frames, &out, codec, fps, 0.9).map(|m| Some((out, m))) } else { Ok(None) });
        let _ = std::fs::remove_dir_all(&frames);
        done?
    };

    // 4. the timeline
    let mut notes: Vec<String> = Vec::new();
    let mut media: Vec<Media> = Vec::new();
    let mut index = std::collections::HashMap::<PathBuf, usize>::new();
    let mut sounds = plan::sounds(&manifest);
    let (mut main, mut rest, mut above) = (Vec::new(), Vec::new(), Vec::new());
    for (r, cov) in runs.iter().zip(&covered) {
        let path = plan::resolve(&dir, &r.src);
        let m = add(&mut media, &mut index, path.clone(), media::video)?;
        let (mw, mh) = (media[m].width as f64, media[m].height as f64);
        let (place, warn) = plan::place(&r.bx, &r.fit, mw.max(1.0), mh.max(1.0), wf, hf, r.opacity);
        let what = format!("{} (frames {}-{})", r.src, r.start, r.end - 1);
        if let Some(wn) = warn {
            notes.push(format!("{what}: {wn}"));
        }
        if r.moved {
            notes.push(format!("{what}: moves or scales in its box; placed as its first frame shows it (CapCut keyframes don't carry yet)"));
        }
        if r.faded {
            notes.push(format!("{what}: fades; placed at its first frame's opacity"));
        }
        // its own sound: the manifest's sound clip of the same file over the same frames from the same time
        let own = sounds.iter().position(|c| plan::resolve(&dir, &c.src) == path && (c.from - r.start).abs() <= 1 && (c.to - r.end).abs() <= 1 && (c.at - r.at).abs() <= 1.5 / fps);
        let volume = own.map_or(0.0, |k| 10f64.powf(sounds.remove(k).gain_db / 20.0));
        let clip = Clip { media: m, start: r.start, frames: r.end - r.start, source_in: r.at, speed: r.rate.unwrap_or(1.0).max(0.01), volume, place, ..Clip::default() };
        if *cov {
            notes.push(format!("{what}: raea draws over all of it from outside what holds it (a layer before it in the page); placed over the overlay, so the overlay's drawing over it is hidden in CapCut"));
        }
        match (*cov, plan::full(&r.bx, wf, hf)) {
            (true, _) => above.push(clip),
            (false, true) => main.push(clip),
            (false, false) => rest.push(clip),
        }
    }
    // the main track first (the clips covering the canvas), the rest above it in the page's order, then the overlay,
    // then footage the overlay draws under
    let mut tracks: Vec<Track> = Vec::new();
    if let Some((path, m)) = &under {
        tracks.extend(drawn(&mut media, path, m, fps, "raea under"));
    }
    tracks.extend(plan::lay(Kind::Video, if under.is_some() { "footage" } else { "" }, main));
    tracks.extend(plan::lay(Kind::Video, "footage", rest));
    tracks.extend(drawn(&mut media, &overlay, &made, fps, "raea overlay"));
    tracks.extend(plan::lay(Kind::Video, "footage over", above));
    let mut audio = Vec::new();
    for c in sounds {
        let m = add(&mut media, &mut index, plan::resolve(&dir, &c.src), media::sound)?;
        audio.push(Clip { media: m, start: c.from, frames: c.to - c.from, source_in: c.at, speed: c.rate, volume: 10f64.powf(c.gain_db / 20.0), fade_in: c.fade_in, fade_out: c.fade_out, ..Clip::default() });
    }
    tracks.extend(plan::lay(Kind::Audio, "sound", audio));
    let notes_made = manifest["sounds"]["notes"].as_array().map_or(0, Vec::len);
    if notes_made > 0 {
        notes.push(format!("the Tone graph's music ({notes_made} notes) has no file to place: it is in the reference render's sound"));
    }
    let tl = Timeline { width: w, height: h, fps, media, tracks };

    // 5. the draft
    let markers = raea_io_capcut::seed(&root);
    let written = raea_io_capcut::write(&tl, &root, &name, &markers, media::cover(&reference).as_deref())?;
    notes.extend(written.warnings.iter().cloned());
    let listed = if !in_store || args.iter().any(|a| a == "--no-register") {
        "not entered in CapCut's project list".to_string()
    } else {
        match raea_io_capcut::register(&root, &written.dir, &written.meta, written.info_bytes, &backups()) {
            Ok(b) => format!("entered in CapCut's project list (its list before: {})", b.display()),
            Err(e) => format!("not entered in CapCut's project list: {e}"),
        }
    };
    let count = |k: Kind, n: &str| tl.tracks.iter().filter(|t| t.kind == k && t.name.starts_with(n)).map(|t| t.clips.len()).sum::<usize>();
    let mut said = format!(
        "APPLIED  CapCut draft \"{name}\" at {}: {} tracks, {}, {} ({}, {:.1} MB){}, {}; {:.2} s at {fps} fps, {w}x{h}; {listed}; markers from {}\n         the reference render and the movies raea drew: {}",
        written.dir.display(),
        tl.tracks.len(),
        many(count(Kind::Video, "") - count(Kind::Video, "raea "), "footage clip"),
        many(count(Kind::Video, "raea overlay"), "overlay clip"),
        codec.name(),
        made.bytes as f64 / 1e6,
        under.as_ref().map_or(String::new(), |(_, m)| format!(", {} under the footage ({:.1} MB)", many(count(Kind::Video, "raea under"), "clip"), m.bytes as f64 / 1e6)),
        many(count(Kind::Audio, ""), "sound"),
        written.duration_us as f64 / 1e6,
        markers.from.as_deref().map_or("CapCut 8.5.0 (no draft CapCut made is in the store)".to_string(), |d| format!("the draft \"{d}\" CapCut made")),
        work.display()
    );
    for n in notes {
        said.push_str(&format!("\n  note  {n}"));
    }
    Ok(said)
}

/// "1 clip", "4 clips"
fn many(k: usize, what: &str) -> String {
    if k == 1 { format!("1 {what}") } else { format!("{k} {what}s") }
}

/// Where CapCut's project list is copied before a draft is entered in it: the person's own folder, ~/.raea/capcut/backups
/// ($RAEA_CAPCUT_BACKUPS; %LOCALAPPDATA%\raea\capcut\backups on Windows, which sets no HOME). Never raea's home, which
/// is its install or, from a checkout, the source tree (11-11: a list's backup landed in the repository).
fn backups() -> PathBuf {
    match std::env::var_os("LOCALAPPDATA").filter(|d| cfg!(windows) && !d.is_empty() && std::env::var_os("RAEA_CAPCUT_BACKUPS").is_none()) {
        Some(d) => PathBuf::from(d).join("raea").join("capcut").join("backups"),
        None => raea_io_home::env_path("RAEA_CAPCUT_BACKUPS", ".raea/capcut/backups"),
    }
}

/// A movie raea drew, as clips of it wherever it draws, full frame on tracks named `name`; none when it draws nothing.
fn drawn(media: &mut Vec<Media>, path: &Path, m: &raea_io_alpha::Made, fps: f64, name: &str) -> Vec<Track> {
    let spans = plan::spans(&m.drawn);
    if spans.is_empty() {
        return Vec::new();
    }
    let k = media.len();
    media.push(Media { path: path.to_path_buf(), kind: MediaKind::Video, seconds: m.frames as f64 / fps, width: m.width, height: m.height, has_audio: false });
    let clips = spans.iter().map(|&(a, b)| Clip { media: k, start: a, frames: b - a, source_in: a as f64 / fps, volume: 0.0, place: Place::centred(m.width, m.height), ..Clip::default() }).collect();
    plan::lay(Kind::Video, name, clips)
}

/// A file's place in the media list, probed the first time it's named.
fn add(media: &mut Vec<Media>, index: &mut std::collections::HashMap<PathBuf, usize>, p: PathBuf, probe: fn(&Path) -> R<Media>) -> R<usize> {
    if let Some(i) = index.get(&p) {
        return Ok(*i);
    }
    media.push(probe(&p)?);
    index.insert(p, media.len() - 1);
    Ok(media.len() - 1)
}

fn ext_of(c: raea_io_alpha::Codec) -> &'static str {
    match c {
        raea_io_alpha::Codec::ProRes => "prores",
        raea_io_alpha::Codec::Hevc => "hevc",
        raea_io_alpha::Codec::Rle => "rle",
        raea_io_alpha::Codec::Png => "png",
    }
}

/// Whether the overlay is opaque over 90% of a run's box at its middle frame (a grid of points inside it).
fn opaque_under(frames: &Path, r: &plan::Run) -> bool {
    let mid = (r.start + r.end - 1) / 2;
    let Ok((px, w, h)) = raea_io_alpha::read_png(&frames.join(format!("frame-{mid:05}.png"))) else { return false };
    let (mut n, mut opaque) = (0, 0);
    for j in 0..16 {
        for i in 0..16 {
            let x = (r.bx[0] + r.bx[2] * (i as f64 + 0.5) / 16.0) as i64;
            let y = (r.bx[1] + r.bx[3] * (j as f64 + 0.5) / 16.0) as i64;
            if x < 0 || y < 0 || x >= w as i64 || y >= h as i64 {
                continue;
            }
            n += 1;
            opaque += usize::from(px[((y as usize) * w as usize + x as usize) * 4 + 3] >= 250);
        }
    }
    n > 0 && opaque * 10 >= n * 9
}

/// Whether any frame in `frames` draws anything but black, at any alpha (a grid of points on each).
fn lit(frames: &Path) -> bool {
    raea_io_alpha::frames_in(frames).iter().any(|p| {
        let Ok((px, w, h)) = raea_io_alpha::read_png(p) else { return true };
        (0..32).any(|j| {
            (0..32).any(|i| {
                let (x, y) = ((w as usize * (2 * i + 1)) / 64, (h as usize * (2 * j + 1)) / 64);
                let k = (y * w as usize + x) * 4;
                px[k + 3] >= 8 && px[k..k + 3].iter().any(|&c| c >= 8)
            })
        })
    })
}
