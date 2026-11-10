//! `raea check EDIT.tsx --quick` (docs/skills.feature SK10). The quick check renders three stills of a composition (a
//! quarter in, the middle, the last frame) with their manifest, about a second, and runs the full check's text rules
//! and the person's text taste on it: clipped and cramped text, safe areas, sizes. Every agent's after-save hook runs
//! it (hook.rs): after a .tsx that registers a root is saved, its findings go back to the agent; a clean check says
//! nothing.
use super::*;
use std::path::Path;

/// The composition's length in frames, read from its source (the first `durationInFrames={N}`), 90 without one.
fn frames(src: &str) -> u64 {
    src.split("durationInFrames={").nth(1).and_then(|r| r.split('}').next()).and_then(|n| n.trim().parse().ok()).unwrap_or(90)
}

/// The three stills the quick check renders (a quarter in, the middle, the last frame) of a composition `n` frames long:
/// `said` is the length the render's manifest gives (its `length`), the source's literal the fallback.
fn samples(said: Option<u64>, src: &str) -> (u64, [u64; 3], &'static str) {
    let (n, from) = match said.filter(|n| *n > 0) { Some(n) => (n, "the render"), None => (frames(src), "the source") };
    let n = n.max(1);
    (n, [n / 4, n / 2, n - 1], from)
}

/// `raea check EDIT.tsx --quick [--shape S] [--platform P] [-o check.json]`: (report, P0 or P1 found). `tastes` are the
/// person's, evaluated by the raea CLI when --taste names them.
pub fn quick(args: &[String], tastes: Vec<raea_core_brief::Taste>) -> R<(String, bool)> {
    let file = args.iter().find(|a| a.ends_with(".tsx")).ok_or("raea check --quick takes a composition: EDIT.tsx")?;
    let src = std::fs::read_to_string(file).map_err(|e| format!("{file}: {e}"))?;
    let tmp = std::env::temp_dir().join(format!("raea-quick-{}", std::process::id()));
    std::fs::create_dir_all(&tmp).map_err(|e| format!("{}: {e}", tmp.display()))?;
    let manifest = tmp.join("render.json");
    let me = std::env::current_exe().map_err(|e| e.to_string())?;
    // the length as the composition says it (the manifest's `length` from a render of frame 0): the source's
    // `durationInFrames={N}` is often a variable (`{DUR}`), and 90 frames in, a 60 s film shows none of its text yet
    let said = std::process::Command::new(&me).arg("render").arg(file).args(["--frame", "0", "-o"]).arg(tmp.join("f0.png")).arg("--manifest").arg(&manifest).env("RAEA_RECORD", "off").output().ok().and_then(|_| std::fs::read_to_string(&manifest).ok()).and_then(|t| serde_json::from_str::<Value>(&t).ok()).and_then(|m| m["length"].as_u64());
    let _ = std::fs::remove_file(&manifest);
    let (n, s, from) = samples(said, &src);
    let at = format!("{},{},{}", s[0], s[1], s[2]);
    let sampled = format!("sampled frames {} of {n} (the length from {from})", s.map(|f| f.to_string()).join(", "));
    // the stills are part of this check, which keeps the one entry in the project's record (DR3)
    let out = std::process::Command::new(me).arg("render").arg(file).args(["--at", &at, "-o"]).arg(format!("{}/", tmp.display())).arg("--manifest").arg(&manifest).env("RAEA_RECORD", "off").output().map_err(|e| e.to_string())?;
    // rendered when its manifest was written: a render whose stills clip exits 1 (DR3), and those findings are read here
    let result = if manifest.is_file() {
        on_manifest(file, &manifest, args, tastes)
    } else {
        // a render that fails is the finding: the agent sees why
        let (err, out) = (String::from_utf8_lossy(&out.stderr), String::from_utf8_lossy(&out.stdout));
        let mut why = Vec::new();
        for line in err.lines().chain(out.lines()) {
            if line.contains("REFUSED") || line.contains("rror") {
                why.push(line);
            }
        }
        let f = raea_core_facts::Finding::new("render", raea_core_facts::Level::Error, why.join("\n"), "raea check --quick");
        Ok((format!("raea check {file}: it doesn't render\n{}\nraea check: {}", f.line(), raea_core_facts::finding::count(&[f])), true))
    };
    let _ = std::fs::remove_dir_all(&tmp);
    // which frames were looked at, so a clean result says what it covers
    result.map(|(text, bad)| (format!("{sampled}\n{text}"), bad))
}

/// `raea check --quick`'s half (docs/skills.feature SK10): the text rules and the person's text taste on the manifest
/// of a few stills (`raea render EDIT.tsx --at ... --manifest`), no video. What it can't see (contrast, freezes,
/// sound, blotching) waits for the full check on the export.
fn on_manifest(file: &str, manifest: &Path, args: &[String], tastes: Vec<raea_core_brief::Taste>) -> R<(String, bool)> {
    let at = manifest.display();
    let m: Value = serde_json::from_str(&std::fs::read_to_string(manifest).map_err(|e| format!("{at}: {e}"))?).map_err(|e| format!("{at}: {e}"))?;
    let (mut issues, mut passed) = (Vec::new(), Vec::new());
    let runs = text_runs(&m);
    let (w, h) = (m["width"].as_f64().unwrap_or(1080.0), m["height"].as_f64().unwrap_or(1920.0));
    text_rules(&runs, None, w, h, flag(args, "--shape"), flag(args, "--platform"), &mut issues, &mut passed);
    taste_text(&taste_rules(&tastes), &runs, w, h, &mut issues, &mut passed);
    // and what the render of the stills found (the 3D's clipping, DR3)
    let more = serde_json::from_value(m["findings"].clone()).unwrap_or_default();
    report(file, issues, more, passed, flag(args, "-o"), m["fps"].as_f64().unwrap_or(30.0))
}

#[cfg(test)]
mod tests {
    #[test]
    fn a_length_that_isnt_a_literal_comes_from_the_render() {
        // `durationInFrames={DUR}`: the source can't say it, so the manifest's length does (a 60 s film at 60 fps)
        let src = "const DUR = 3600;\n<Composition durationInFrames={DUR} fps={60} />";
        assert_eq!(super::samples(Some(3600), src), (3600, [900, 1800, 3599], "the render"));
        // no length from the render: the source's literal, else 90 frames, as before
        assert_eq!(super::samples(None, src), (90, [22, 45, 89], "the source"));
        assert_eq!(super::samples(Some(0), "<Composition durationInFrames={240} />").0, 240);
    }

    #[test]
    fn frames_come_from_the_source() {
        assert_eq!(super::frames("<Composition durationInFrames={240} fps={30} />"), 240);
        assert_eq!(super::frames("no composition"), 90);
    }
}
