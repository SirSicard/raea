//! A render's sound on its own (Shane 11-10: "we should add an audio-only render and also be able to render video and
//! audio at the same time"):
//!   raea render EDIT.tsx -o OUT.wav                the sound alone, mixed and mastered as the video's is, no frame drawn:
//!                                                  React stepped through every frame for its sounds (sound_only, which
//!                                                  live play also mixes from), so a 2-minute film's sound is minutes
//!                                                  sooner than its video
//!   raea render EDIT.tsx -o OUT.mp4 --audio A.wav  the video, and beside it the very bounce it carries (before AAC),
//!                                                  from the same pass: every render path writes RAEA_AUDIO_BOUNCE
use raea_runtime_bundle::{R, flag};
use std::path::{Path, PathBuf};

fn is_wav(p: &Path) -> bool {
    p.extension().and_then(|e| e.to_str()).is_some_and(|e| e.eq_ignore_ascii_case("wav"))
}

/// Every render comes here first (raea render, and raea export capcut's parts). The folders its files go in are made
/// (out_folders); then Some(the answer) for a sound render (`-o OUT.wav`), None for every other render, which goes on
/// as before. A video render's `--audio A.wav` is set up here (the render writes it) and also answers None.
pub fn render(args: &[String]) -> Option<R<String>> {
    if let Err(e) = out_folders(args) {
        return Some(Err(e));
    }
    let out = PathBuf::from(flag(args, "-o")?);
    if is_wav(&out) {
        return Some(sound(args, &out));
    }
    let a = flag(args, "--audio")?;
    if !is_wav(Path::new(&a)) {
        return Some(Err(format!("--audio {a}: the sound is written as a .wav (OUT.wav)")));
    }
    let a = match std::path::absolute(&a) {
        Ok(a) => a,
        Err(e) => return Some(Err(format!("{a}: {e}"))),
    };
    // read where each render path bounces (raea-runtime-export sound.rs and fed.rs, raea-runtime-encode sound.rs); set
    // before the render starts, as cli.rs sets RAEA_ROOT
    unsafe { std::env::set_var("RAEA_AUDIO_BOUNCE", a) };
    None
}

/// The composition's sound alone: bundled as a render bundles it (its --composition and flags), stepped for its sounds,
/// mastered by its <Mix>, written as 48 kHz WAV, with what it measures.
fn sound(args: &[String], out: &Path) -> R<String> {
    let edit = args.get(1).filter(|a| !a.starts_with('-')).ok_or("raea render EDIT.tsx -o OUT.wav")?;
    let tsx = PathBuf::from(edit).canonicalize().map_err(|e| format!("{edit}: {e}"))?;
    let dir = tsx.parent().ok_or("the edit has no folder")?.to_path_buf();
    let js = std::env::temp_dir().join(format!("raea-sound-{}.js", std::process::id()));
    raea_runtime_bundle::bundle_composition(&tsx, &js, &raea_runtime_bundle::comp_opts(args)?, None)?;
    let t = std::time::Instant::now();
    let a = raea_runtime_export::sound_only(&js, &dir);
    let _ = std::fs::remove_file(&js);
    let a = a?.ok_or_else(|| format!("{edit} makes no sound: no <Audio>, no <Video> with sound and no Tone in any frame"))?;
    raea_sys_mix::write_wav(&a, out)?;
    Ok(format!(
        "{}: {:.1} s of sound, {:.1} LUFS, true peak {:.1} dBTP, in {:.1} s (no frames drawn)",
        out.display(),
        a.duration(),
        raea_io_media::audio::lufs(&a),
        raea_io_media::audio::true_peak_db(&a),
        t.elapsed().as_secs_f64()
    ))
}

/// The folders a render's files go in (`-o out/a.mp4`, `--audio out/a.wav`), made before it starts: a project made by
/// hand has no out/, and the render ran to the end and then failed writing with "No such file or directory". `-o DIR`
/// (frames) makes only what's above DIR; the render makes DIR.
pub fn out_folders(args: &[String]) -> R<()> {
    for f in ["-o", "--audio"] {
        let Some(file) = flag(args, f).map(PathBuf::from) else { continue };
        if let Some(d) = file.parent().filter(|d| !d.as_os_str().is_empty()) {
            std::fs::create_dir_all(d).map_err(|e| format!("{f} {}: couldn't make {}: {e}", file.display(), d.display()))?;
        }
    }
    Ok(())
}

#[cfg(test)]
mod tests {
    #[test]
    fn a_render_makes_the_folders_its_files_go_in() {
        let root = std::env::temp_dir().join(format!("raea-out-folders-{}", std::process::id()));
        let _ = std::fs::remove_dir_all(&root);
        let (video, sound) = (root.join("out/shots/a.mp4"), root.join("bounces/a.wav"));
        let args: Vec<String> = ["render", "EDIT.tsx", "-o", video.to_str().unwrap(), "--audio", sound.to_str().unwrap()].map(String::from).to_vec();
        super::out_folders(&args).unwrap();
        assert!(root.join("out/shots").is_dir() && root.join("bounces").is_dir());
        assert!(!video.exists() && !sound.exists(), "the folders only, not the files");
        // a bare name (the project's own folder) and no -o at all are left as they are
        super::out_folders(&["render", "EDIT.tsx", "-o", "a.png"].map(String::from)).unwrap();
        super::out_folders(&["render", "EDIT.tsx"].map(String::from)).unwrap();
        std::fs::remove_dir_all(&root).unwrap();
    }
}
