//! `raea check VIDEO.mp4 [--manifest render.json] [--words W.json] [--perception P.json] [--shape 9:16]
//! [--platform tiktok|reels|shorts] [-o check.json]`: the floor's measurable lines on an export (docs/craft-system.md, I; sdk/guides/craft/floor.md).
//! Each issue is ranked P0 (breaks the piece) to P3 (polish), with where it is and what to do. Rules on the file alone:
//! loudness and true peak, a steady sound that stops dead (a source run out, a cut with no fade), stretches where nothing
//! changes, encoder blotching in dark areas. With the transcript (`--words`): a stretch with no voice louder than the
//! voice, and a bed under the voice closer than 12 dB to it. With the render's
//! manifest (`raea render … --manifest render.json`): text clipped off the frame, text in the platform's UI zones,
//! text held too briefly to read, caption contrast against the pixels behind it. With the transcript too: captions
//! that come on away from the word they carry. With the face's place (`--perception`, the perception.json `raea cut`
//! writes): text over more than 8% of the face. With `--taste taste.ts|DIR`: the person's own mechanical rules, the
//! rules in their taste.ts files that carry a check (`{ text: "Captions sit clear of the bottom.", check: { form:
//! "text-above", value: 62 } }`), each a P1 when broken, since the person's rule beats the floor's default (docs/craft-system.md, J). Exits 1 when a P0 or P1 is found.
use serde_json::{Value, json};
use raea_core_facts::{Finding, Level, finding};
use std::process::Command;

mod sound;
use sound::*;
mod picture;
use picture::*;
mod flash;
use flash::*;
mod text;
use text::*;
pub mod quick;
pub mod hook;
#[cfg(test)]
mod tests;

type R<T> = Result<T, String>;

#[derive(Clone)]
struct Issue {
    rule: &'static str,
    p: u8,
    at: Option<f64>,
    says: String,
}

/// `raea check …` with the person's taste, none or more (taste.ts and the kinds beside it, which the raea CLI evaluates: it owns the engine):
/// its rules' checks hold the export to the person's own lines.
pub fn cli_with(args: &[String], tastes: Vec<raea_core_brief::Taste>) -> i32 {
    said(run(args, tastes), "REFUSED  ")
}

/// A check's report printed, and its exit code: 1 when it found an error, 2 when it couldn't check (said after
/// `refused`). `raea check EDIT.tsx` (apps/direction) ends the same way.
pub fn said(ran: R<(String, bool)>, refused: &str) -> i32 {
    match ran {
        Ok((report, bad)) => {
            println!("{report}");
            i32::from(bad)
        }
        Err(e) => {
            eprintln!("{refused}{e}");
            2
        }
    }
}

/// A command's words: its arguments that are neither flags nor a flag's value (`takes`: the flags that take one).
/// What `raea check` checks is its first; `raea workspace` and `raea project` read theirs the same way.
pub fn words<'a>(args: &'a [String], takes: &[&str]) -> Vec<&'a str> {
    args.iter().enumerate().filter(|(i, a)| !a.starts_with('-') && !(*i > 0 && takes.contains(&args[i - 1].as_str()))).map(|(_, a)| a.as_str()).collect()
}

fn flag<'a>(args: &'a [String], name: &str) -> Option<&'a str> {
    args.iter().position(|a| a == name).and_then(|i| args.get(i + 1)).map(String::as_str)
}

pub const USAGE: &str = "raea check VIDEO.mp4 [--manifest render.json] [--words W.json] [--perception P.json] [--shape 16:9|9:16|4:5|1:1] [--platform tiktok|reels|shorts] [--taste taste.ts|DIR] [-o check.json]   (an export against the floor: clipped text, contrast, safe areas, freezes, flashing, cues, loudness, blotching, a placeholder brand kit; its findings errors, warns and notes)";

/// A rule from the person's taste: a form raea can measure, its value, and the taste line it stands for.
#[derive(Clone, Debug, PartialEq)]
struct Taste {
    form: &'static str,
    value: f64,
    line: String,
}

/// The checks among a person's taste rules (taste.ts and its kinds), each with the line it stands for.
fn taste_rules(tastes: &[raea_core_brief::Taste]) -> Vec<Taste> {
    tastes.iter().flat_map(|t| &t.sections).flat_map(|s| &s.rules).filter_map(|r| r.check.map(|c| Taste { form: c.form(), value: c.value(), line: r.text.clone() })).collect()
}

fn taste_of<'a>(rules: &'a [Taste], form: &str) -> Option<&'a Taste> {
    rules.iter().rev().find(|r| r.form == form)
}

/// the person's text rules against the render's text runs
fn taste_text(rules: &[Taste], runs: &[Run], w: f64, h: f64, issues: &mut Vec<Issue>, passed: &mut Vec<String>) {
    let s = w.min(h) / 1080.0;
    for r in rules {
        let mut broke = 0;
        for t in runs {
            let [x, y, bw, bh] = t.box_;
            let q = quote(&t.text);
            let why = match r.form {
                "text-hold" if t.to - t.from + 0.05 < r.value => Some(format!("{q} is on for {:.1} s, under your {:.1} s", t.to - t.from, r.value)),
                "text-above" if y + bh > h * r.value / 100.0 + 1.0 => Some(format!("{q} reaches {:.0}% down the frame, below your {:.0}%", (y + bh) / h * 100.0, r.value)),
                "text-below" if y < h * r.value / 100.0 - 1.0 => Some(format!("{q} starts {:.0}% down the frame, above your {:.0}%", y / h * 100.0, r.value)),
                "text-margin" => {
                    let m = x.min(y).min(w - x - bw).min(h - y - bh) / s;
                    (m + 1.0 < r.value).then(|| format!("{q} is {m:.0} px from the edge, inside your {:.0}", r.value))
                }
                _ => None,
            };
            if let Some(why) = why {
                broke += 1;
                issues.push(Issue { rule: r.form, p: 1, at: Some(t.from), says: format!("{why} (\"{}\")", r.line) });
            }
        }
        if broke == 0 && r.form.starts_with("text-") {
            passed.push(format!("taste: {} ({} {})", r.line, r.form, r.value));
        }
    }
}

/// the flags `raea check` takes, each with a value
const TAKES: [&str; 7] = ["--manifest", "--words", "--perception", "--shape", "--platform", "--taste", "-o"];

fn run(args: &[String], tastes: Vec<raea_core_brief::Taste>) -> R<(String, bool)> {
    let (video, issues, passed, fps) = measured(args, taste_rules(&tastes))?;
    report(&video, issues, Vec::new(), passed, flag(args, "-o"), fps)
}

/// raea's floor on a video (`args` as raea check takes them) as Findings, printed and kept nowhere: `raea check
/// EDIT.tsx` runs it on the composition's newest render beside its other checks (apps/direction, DR4). `held`: the
/// rules of the named checks it measures on the video itself (loudness, still-max), each its form, value and line.
/// `without`: its own rules that a named check holds there instead (`reading`, which text-read holds against when
/// a text can be read, not when it's on: DR28).
pub fn floor(args: &[String], held: &[(&'static str, f64, String)], without: &[&str]) -> R<Vec<Finding>> {
    let held = held.iter().map(|(form, value, line)| Taste { form: *form, value: *value, line: line.clone() }).collect();
    let (_, mut issues, _, fps) = measured(args, held)?;
    issues.retain(|i| without.iter().all(|w| *w != i.rule));
    Ok(findings_of(issues, Vec::new(), fps))
}

/// The video's issues and what passed, measured, and its frame rate.
fn measured(args: &[String], taste: Vec<Taste>) -> R<(String, Vec<Issue>, Vec<String>, f64)> {
    let video = words(args, &TAKES).first().map(|v| v.to_string()).ok_or(USAGE)?;
    if !std::path::Path::new(&video).exists() {
        return Err(format!("no file at {video}\n{USAGE}"));
    }
    let probe = Probe::of(&video)?;
    let (mut issues, mut passed) = (Vec::new(), Vec::new());
    let manifest: Option<Value> = match flag(args, "--manifest") {
        Some(m) => Some(serde_json::from_str(&std::fs::read_to_string(m).map_err(|e| format!("{m}: {e}"))?).map_err(|e| format!("{m}: {e}"))?),
        None => None,
    };
    let fps = manifest.as_ref().and_then(|m| m["fps"].as_f64()).unwrap_or(30.0);
    let words = flag(args, "--words").map(|p| transcript(p, fps)).transpose()?;
    if probe.audio {
        loudness(&video, taste_of(&taste, "loudness"), &mut issues, &mut passed)?;
        sound(&video, words.as_deref(), &mut issues, &mut passed)?;
    }
    freezes(&video, &probe, taste_of(&taste, "still-max"), &mut issues, &mut passed)?;
    flashing(&video, &probe, &mut issues, &mut passed)?;
    blotching(&video, &probe, &mut issues, &mut passed)?;
    brand_kit(&[flag(args, "--manifest").unwrap_or(""), video.as_str()], &mut issues, &mut passed);
    if let Some(manifest) = &manifest {
        let runs = text_runs(manifest);
        let (w, h) = (manifest["width"].as_f64().unwrap_or(probe.w), manifest["height"].as_f64().unwrap_or(probe.h));
        text_rules(&runs, words.as_deref(), w, h, flag(args, "--shape"), flag(args, "--platform"), &mut issues, &mut passed);
        contrast(&video, &runs, w, h, &probe, &mut issues, &mut passed);
        taste_text(&taste, &runs, w, h, &mut issues, &mut passed);
        if let Some(words) = &words {
            cues(&runs, words, &mut issues, &mut passed);
        }
        if let Some(p) = flag(args, "--perception") {
            let faces = faces_of(&serde_json::from_str(&std::fs::read_to_string(p).map_err(|e| format!("{p}: {e}"))?).map_err(|e| format!("{p}: {e}"))?, fps);
            face_cover(&runs, &faces, &mut issues, &mut passed);
        }
    }
    Ok((video, issues, passed, fps))
}

/// The issues as Findings (docs/direction.feature DR3: P0 and P1 errors, P2 a warn, P3 a note; a time is its frame at
/// `fps`), with `more` (a render's own), worst first then by time.
fn findings_of(mut issues: Vec<Issue>, more: Vec<Finding>, fps: f64) -> Vec<Finding> {
    issues.sort_by(|a, b| a.p.cmp(&b.p).then(a.at.unwrap_or(0.0).total_cmp(&b.at.unwrap_or(0.0))));
    let mut found = Vec::new();
    for i in &issues {
        // an issue at a second is about the frame it falls on
        let (f, fr) = (Finding::new(i.rule, Level::of_rank(i.p), &i.says, "raea check"), (i.at.unwrap_or(0.0) * fps).round() as i64);
        found.push(if i.at.is_some() { f.frames(fr, fr + 1) } else { f });
    }
    finding::ranked(found.into_iter().chain(more).collect())
}

/// The findings (`findings_of`), written to -o as JSON when asked, and the report's text with the count last. True
/// when an error is among them.
fn report(video: &str, issues: Vec<Issue>, more: Vec<Finding>, passed: Vec<String>, out: Option<&str>, fps: f64) -> R<(String, bool)> {
    let found = findings_of(issues, more, fps);
    let bad = found.iter().any(|f| f.level == Level::Error);
    if let Some(out) = out {
        let j = json!({"file": video, "fps": fps, "findings": found, "passed": passed});
        std::fs::write(out, serde_json::to_string_pretty(&j).unwrap()).map_err(|e| format!("{out}: {e}"))?;
    }
    let mut s = format!("raea check {video}\n");
    // kept in its project's record beside its renders (DR3), what `raea findings` and `raea next` read
    let kept = raea_core_facts::record::keep("raea check", std::path::Path::new(video), out.map(std::path::Path::new), &found, vec![], &raea_io_trace::utc(std::time::SystemTime::now()).1);
    let kept = kept.map(|e| format!("raea check: kept in the project's record as {} (raea findings reads it)", e.id));
    for line in found.iter().map(Finding::line).chain(passed.iter().map(|p| format!("ok {p}"))).chain(kept) {
        s.push_str(&line);
        s.push('\n');
    }
    Ok((s + &format!("raea check: {}", finding::count(&found)), bad))
}

struct Probe {
    w: f64,
    h: f64,
    duration: f64,
    /// when the picture ends, on the clock FFmpeg's filters read: it starts at the file's first stream, sound can run on
    /// past the picture, and the container's duration counts that
    picture: f64,
    audio: bool,
}

/// Where the picture's last packet ends, for a container that doesn't state the video stream's own length (Matroska)
fn last_packet_end(video: &str) -> Option<f64> {
    let out = Command::new("ffprobe").args(["-v", "error", "-select_streams", "v:0", "-show_entries", "packet=pts_time,duration_time", "-of", "csv=p=0", video]).output().ok()?;
    String::from_utf8_lossy(&out.stdout)
        .lines()
        .filter_map(|l| {
            let mut parts = l.split(',');
            let t: f64 = parts.next()?.trim().parse().ok()?;
            Some(t + parts.next().and_then(|d| d.trim().parse::<f64>().ok()).unwrap_or(0.0))
        })
        .max_by(f64::total_cmp)
}

impl Probe {
    fn of(video: &str) -> R<Probe> {
        let entries = "stream=codec_type,width,height,r_frame_rate,duration,start_time:format=duration,start_time";
        let out = Command::new("ffprobe").args(["-v", "error", "-show_entries", entries, "-of", "json", video]).output().map_err(|e| format!("ffprobe: {e}"))?;
        let v: Value = serde_json::from_slice(&out.stdout).map_err(|e| format!("ffprobe: {e}"))?;
        let streams = v["streams"].as_array().cloned().unwrap_or_default();
        let vid = streams.iter().find(|s| s["codec_type"] == "video").ok_or("no video stream")?;
        let seconds = |field: &Value| field.as_str().and_then(|d| d.parse::<f64>().ok());
        let duration = seconds(&v["format"]["duration"]).unwrap_or(0.0);
        let origin = seconds(&v["format"]["start_time"]).unwrap_or(0.0);
        let picture = match seconds(&vid["duration"]) {
            Some(length) => seconds(&vid["start_time"]).unwrap_or(origin) - origin + length,
            None => last_packet_end(video).map_or(duration, |end| end - origin),
        };
        let audio = streams.iter().any(|s| s["codec_type"] == "audio");
        Ok(Probe { w: vid["width"].as_f64().unwrap_or(1920.0), h: vid["height"].as_f64().unwrap_or(1080.0), duration, picture, audio })
    }
}
