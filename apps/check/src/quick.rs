//! `raea check EDIT.tsx --quick` (docs/skills.feature SK10). The quick check renders three stills of a composition (a
//! quarter in, the middle, the last frame, of the length frame 0's render reports) with their manifest, and runs the text rules
//! and the person's text taste on it: clipped and cramped text, safe areas, sizes. Every agent's after-save hook runs
//! it (hook.rs): after a .tsx that registers a root is saved, its findings go back to the agent; a clean check says
//! nothing.
use super::*;
use std::path::Path;

/// The stills' frames: a quarter in, the middle and the last of the length a render reports (render.json's `length`,
/// the composition's own however it's written; #86 read its source's `durationInFrames={N}` and took 90 for a name).
fn samples(m: &Value) -> Option<[u64; 3]> {
    let n = m["length"].as_u64()?.max(1);
    Some([n / 4, n / 2, n - 1])
}

/// `raea check EDIT.tsx --quick [--shape S] [--platform P] [-o check.json]`: (report, P0 or P1 found). `tastes` are the
/// person's, evaluated by the raea CLI when --taste names them.
pub fn quick(args: &[String], tastes: Vec<raea_core_brief::Taste>) -> R<(String, bool)> {
    let file = args.iter().find(|a| a.ends_with(".tsx")).ok_or("raea check --quick takes a composition: EDIT.tsx")?;
    let tmp = std::env::temp_dir().join(format!("raea-quick-{}", std::process::id()));
    std::fs::create_dir_all(&tmp).map_err(|e| format!("{}: {e}", tmp.display()))?;
    let manifest = tmp.join("render.json");
    let me = std::env::current_exe().map_err(|e| e.to_string())?;
    // the stills are part of this check, which keeps the one entry in the project's record (DR3)
    let render = |at: &str| std::process::Command::new(&me).arg("render").arg(file).args(["--at", at, "-o"]).arg(format!("{}/", tmp.display())).arg("--manifest").arg(&manifest).env("RAEA_RECORD", "off").output().map_err(|e| e.to_string());
    // frame 0 first, for the length (its manifest's), then the three stills
    let mut out = render("0")?;
    let at = std::fs::read_to_string(&manifest).ok().and_then(|t| samples(&serde_json::from_str(&t).ok()?));
    if let Some(at) = at {
        let _ = std::fs::remove_file(&manifest);
        out = render(&at.map(|f| f.to_string()).join(","))?;
    }
    // rendered when its manifest was written: a render whose stills clip exits 1 (DR3), and those findings are read here
    let result = if let (Some(at), true) = (at, manifest.is_file()) {
        on_manifest(file, &manifest, args, tastes, at)
    } else {
        // a render that fails is the finding: the agent sees why
        let (err, out) = (String::from_utf8_lossy(&out.stderr), String::from_utf8_lossy(&out.stdout));
        let why: Vec<&str> = err.lines().chain(out.lines()).filter(|l| l.contains("REFUSED") || l.contains("rror")).collect();
        let f = raea_core_facts::Finding::new("render", raea_core_facts::Level::Error, why.join("\n"), "raea check --quick");
        Ok((format!("raea check {file}: it doesn't render\n{}\nraea check: {}", f.line(), raea_core_facts::finding::count(&[f])), true))
    };
    let _ = std::fs::remove_dir_all(&tmp);
    result
}

/// `raea check --quick`'s half (docs/skills.feature SK10): the text rules and the person's text taste on the manifest
/// of a few stills (`raea render EDIT.tsx --at ... --manifest`), no video. What it can't see (contrast, freezes,
/// sound, blotching) waits for the full check on the export.
fn on_manifest(file: &str, manifest: &Path, args: &[String], tastes: Vec<raea_core_brief::Taste>, [a, b, c]: [u64; 3]) -> R<(String, bool)> {
    let at = manifest.display();
    let m: Value = serde_json::from_str(&std::fs::read_to_string(manifest).map_err(|e| format!("{at}: {e}"))?).map_err(|e| format!("{at}: {e}"))?;
    let (mut issues, mut passed) = (Vec::new(), vec![format!("looked at frames {a}, {b} and {c} of {}", c + 1)]);
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
    use serde_json::json;
    /// the length is the render's, so a `durationInFrames={DUR}` (#86: 300 frames, read as 90) is sampled to its end
    #[test]
    fn frames_come_from_the_render() {
        assert_eq!(super::samples(&json!({"length": 240})), Some([60, 120, 239]));
        assert_eq!(super::samples(&json!({"length": 300})), Some([75, 150, 299]));
        assert_eq!(super::samples(&json!({"length": 1})), Some([0, 0, 0]));
        // a render that reported no length: no stills to look at, so the frame-0 render's failure is the finding
        assert_eq!(super::samples(&json!({"width": 640})), None);
    }
}
