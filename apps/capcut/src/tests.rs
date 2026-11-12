//! CC2a-c without a render: a manifest's frames as footage runs, its sound clips, the overlay's spans, where a picture
//! sits in CapCut's terms, and clips laid on tracks.

use serde_json::json;

use crate::plan::*;
use raea_io_capcut::{Clip, Kind};

/// 90 frames at 30 fps: one take cut into two pieces (a jump in its source time at frame 45), another file in a
/// corner from frame 60, moving one pixel at frame 70. Source times in whole milliseconds, as the manifest has them.
fn manifest() -> serde_json::Value {
    let ms = |t: f64| (t * 1000.0).round() / 1000.0;
    let frames: Vec<_> = (0..90)
        .map(|f| {
            let mut v = vec![json!({"src": "media/a.mp4", "at": ms(if f < 45 { 0.5 + f as f64 / 30.0 } else { 3.0 + (f - 45) as f64 / 30.0 }), "box": [0.0, 0.0, 1080.0, 1920.0], "fit": "cover", "opacity": 1.0})];
            if f >= 60 {
                v.push(json!({"src": "media/pip.mp4", "at": ms((f - 60) as f64 / 15.0), "box": [if f >= 70 { 662.0 } else { 660.0 }, 200.0, 360.0, 360.0], "opacity": 1.0}));
            }
            json!({"frame": f, "videos": v})
        })
        .collect();
    json!({"width": 1080, "height": 1920, "fps": 30.0, "frames": frames, "sounds": {"clips": [{"src": "/m/music.wav", "from": 0, "to": 90, "at": 0.0, "gainDb": -6.0, "fadeOut": 0.5}]}})
}

#[test]
fn footage_runs_break_where_the_source_jumps() {
    let r = runs(&manifest(), 30.0);
    assert_eq!(r.iter().map(|r| (r.src.as_str(), r.start, r.end)).collect::<Vec<_>>(), [("media/a.mp4", 0, 45), ("media/a.mp4", 45, 90), ("media/pip.mp4", 60, 90)]);
    assert!((r[1].at - 3.0).abs() < 1e-9);
    assert_eq!((r[0].rate, r[1].rate), (Some(1.0), Some(1.0)), "a take at its own speed, though each step is 33 or 34 ms");
    assert!((r[2].rate.unwrap() - 2.0).abs() < 1e-6, "the corner plays at twice its speed");
    assert!(r[2].moved && !r[0].moved);
    assert_eq!(r[2].fit, "fill");
}

#[test]
fn sounds_keep_gain_and_fades() {
    let s = sounds(&manifest());
    assert_eq!(s.len(), 1);
    assert_eq!((s[0].from, s[0].to, s[0].gain_db, s[0].fade_out), (0, 90, -6.0, 0.5));
}

#[test]
fn overlay_spans_are_runs_of_drawn_frames() {
    assert_eq!(spans(&[false, true, true, false, false, true]), [(1, 3), (5, 6)]);
    assert!(spans(&[false; 4]).is_empty());
}

#[test]
fn pictures_sit_as_their_fit_shows_them() {
    // a landscape take covering a portrait canvas: scaled past the fitted width until it fills the height
    let (p, w) = place(&[0.0, 0.0, 1080.0, 1920.0], "cover", 1920.0, 1080.0, 1080.0, 1920.0, 1.0);
    assert!(w.is_none() && (p.scale - (1920.0 / 1080.0) / 0.5625).abs() < 1e-9 && p.crop == [0.0, 0.0, 1.0, 1.0]);
    assert_eq!((p.x, p.y), (540.0, 960.0));
    // a square in a corner, contained: a third of the canvas's width
    let (p, _) = place(&[660.0, 200.0, 360.0, 360.0], "contain", 640.0, 640.0, 1080.0, 1920.0, 1.0);
    assert!((p.scale - 1.0 / 3.0).abs() < 1e-9 && (p.x, p.y) == (840.0, 380.0));
    // a landscape take covering a square box: cropped to its middle square, which then fits as a square
    let (p, _) = place(&[0.0, 0.0, 540.0, 540.0], "cover", 1920.0, 1080.0, 1080.0, 1920.0, 1.0);
    assert!((p.crop[0] - 0.21875).abs() < 1e-9 && (p.crop[2] - 0.78125).abs() < 1e-9 && p.crop[1] == 0.0);
    assert!((p.scale - 0.5).abs() < 1e-9);
    // stretched in raea: said
    assert!(place(&[0.0, 0.0, 500.0, 100.0], "fill", 640.0, 640.0, 1080.0, 1920.0, 1.0).1.is_some());
}

#[test]
fn clips_go_on_as_few_tracks_as_hold_them() {
    let c = |start, frames| Clip { start, frames, ..Clip::default() };
    let t = lay(Kind::Audio, "sound", vec![c(0, 90), c(10, 5), c(15, 10), c(90, 5)]);
    assert_eq!(t.iter().map(|t| (t.name.as_str(), t.clips.len())).collect::<Vec<_>>(), [("sound", 2), ("sound 2", 2)]);
}

/// staticFile("x.mp4") is "/media/x.mp4" in the manifest: the export finds it where the render did, in media/ beside
/// the edit, as it finds a relative path; an absolute path stays as it is
#[test]
fn a_static_file_is_found_in_the_edits_media_folder() {
    let dir = std::env::temp_dir().join(format!("raea-capcut-resolve-{}", std::process::id()));
    std::fs::create_dir_all(dir.join("media")).unwrap();
    std::fs::write(dir.join("media/a.mp4"), "").unwrap();
    let want = dir.join("media/a.mp4").canonicalize().unwrap();
    assert_eq!(resolve(&dir, "/media/a.mp4"), want);
    assert_eq!(resolve(&dir, "media/a.mp4"), want);
    assert_eq!(resolve(&dir, want.to_str().unwrap()), want);
    std::fs::remove_dir_all(&dir).unwrap();
}
