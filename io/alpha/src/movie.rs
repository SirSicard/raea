//! `raea render EDIT.tsx -o OUT.mov --alpha [--alpha-codec prores|hevc|rle|png]` (docs/capcut.feature CC1): the
//! frames rendered as --alpha PNGs (straight alpha) into a folder of this run's own beside OUT, by the render the CLI
//! hands in, encoded as one transparent movie, then the folder removed. No sound: an overlay is laid over footage
//! that has its own.

use std::path::{Path, PathBuf};

use crate::{Codec, R, encode_dir};

/// The transparent movie `args` ask for (`render ... -o OUT.mov --alpha`, read by the CLI: its --alpha-codec, its
/// --manifest, HEVC's quality 0..1), from the frames `render` writes when given the same arguments with -o FOLDER/ and
/// --manifest in place of -o OUT.mov; what it said, APPLIED as the movie.
pub fn render_movie(args: &[String], out: &Path, codec: Option<&str>, manifest: Option<PathBuf>, quality: f32, render: impl Fn(&[String]) -> R<String>) -> R<String> {
    let codec = codec.map_or(Ok(Codec::default_here()), Codec::parse)?;
    if !codec.here() {
        return Err(format!("{} is written through VideoToolbox, on a Mac: --alpha-codec rle (QuickTime Animation) or png here", codec.name()));
    }
    if let Some(d) = out.parent().filter(|d| !d.as_os_str().is_empty()) {
        std::fs::create_dir_all(d).map_err(|e| format!("{}: {e}", d.display()))?;
    }
    // this run's own folder (named by its process), so nothing of anyone's is written over or removed
    let frames = out.with_extension(format!("{}.alpha-frames", std::process::id()));
    let manifest = manifest.unwrap_or_else(|| frames.join("render.json"));
    let mut inner: Vec<String> = Vec::with_capacity(args.len() + 2);
    let mut it = args.iter();
    while let Some(a) = it.next() {
        match a.as_str() {
            "-o" | "--manifest" | "--alpha-codec" => {
                it.next();
            }
            _ => inner.push(a.clone()),
        }
    }
    inner.extend(["-o".into(), format!("{}/", frames.display()), "--manifest".into(), manifest.display().to_string()]);
    let said = render(&inner);
    let made = said.as_ref().map_err(String::clone).and_then(|_| {
        let fps = std::fs::read_to_string(&manifest).ok().and_then(|t| serde_json::from_str::<serde_json::Value>(&t).ok()).and_then(|m| m["fps"].as_f64()).ok_or("the render's manifest has no fps")?;
        encode_dir(&frames, out, codec, fps, quality)
    });
    let _ = std::fs::remove_dir_all(&frames);
    let (said, made) = (said?, made?);
    let empty = made.drawn.iter().filter(|d| !**d).count();
    let mut msg = format!(
        "APPLIED  {} frames as {} with alpha to {} ({}x{}, {:.1} MB{})",
        made.frames,
        codec.name(),
        out.display(),
        made.width,
        made.height,
        made.bytes as f64 / 1e6,
        if empty > 0 { format!(", {empty} of them drawing nothing") } else { String::new() }
    );
    // the folder's render said its own lines; the movie is what this made of them
    for l in said.lines().filter(|l| !l.starts_with("APPLIED")) {
        msg.push('\n');
        msg.push_str(l);
    }
    Ok(msg)
}
