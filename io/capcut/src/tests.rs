//! CC2: a timeline's draft links every segment to its materials as CapCut's own do, keeps its times on the frame
//! grid, mutes nothing it shouldn't, and lands as a whole project folder; registration keeps every other entry.

use std::path::Path;

use serde_json::Value;

use super::*;

fn tmp(name: &str) -> PathBuf {
    let d = std::env::temp_dir().join(format!("raea-capcut-{}-{name}", std::process::id()));
    let _ = std::fs::remove_dir_all(&d);
    std::fs::create_dir_all(&d).unwrap();
    d
}

/// Two shots on the main track, a picture in picture above, a sound below; media files of a few bytes.
fn timeline(dir: &Path) -> Timeline {
    let file = |n: &str| {
        let p = dir.join(n);
        std::fs::write(&p, n.as_bytes()).unwrap();
        p
    };
    let media = vec![
        Media { path: file("a.mp4"), kind: MediaKind::Video, seconds: 4.0, width: 1080, height: 1920, has_audio: true },
        Media { path: file("b.mp4"), kind: MediaKind::Video, seconds: 4.0, width: 1920, height: 1080, has_audio: false },
        Media { path: file("music.wav"), kind: MediaKind::Audio, seconds: 6.0, width: 0, height: 0, has_audio: true },
    ];
    let main = Place::centred(1080, 1920);
    let pip = Place { x: 840.0, y: 380.0, scale: 0.3333, opacity: 1.0, crop: [0.0, 0.0, 1.0, 1.0] };
    Timeline {
        width: 1080,
        height: 1920,
        fps: 30.0,
        media,
        tracks: vec![
            Track { kind: Kind::Video, name: String::new(), clips: vec![Clip { media: 0, start: 0, frames: 45, source_in: 0.5, volume: 0.0, place: main, ..Clip::default() }, Clip { media: 1, start: 45, frames: 45, source_in: 1.0, volume: 0.0, place: main, ..Clip::default() }] },
            Track { kind: Kind::Video, name: "pip".into(), clips: vec![Clip { media: 1, start: 60, frames: 29, source_in: 0.0, speed: 2.0, place: pip, ..Clip::default() }] },
            Track { kind: Kind::Audio, name: "music".into(), clips: vec![Clip { media: 2, start: 0, frames: 90, volume: 0.5, fade_out: 0.5, ..Clip::default() }] },
        ],
    }
}

fn ids(v: &Value, key: &str) -> Vec<String> {
    v["materials"][key].as_array().unwrap().iter().map(|m| m["id"].as_str().unwrap().to_string()).collect()
}

#[test]
fn segments_link_to_materials_on_the_frame_grid() {
    let d = tmp("build");
    let b = build(&timeline(&d), &Markers::default()).unwrap();
    let info = &b.info;
    let tracks = info["tracks"].as_array().unwrap();
    assert_eq!(tracks.iter().map(|t| t["type"].as_str().unwrap()).collect::<Vec<_>>(), ["video", "video", "audio"]);
    let all: Vec<String> = info["materials"].as_object().unwrap().values().flat_map(|l| l.as_array().unwrap().iter().map(|m| m["id"].as_str().unwrap().to_string())).collect();
    for t in tracks {
        for s in t["segments"].as_array().unwrap() {
            assert!(all.contains(&s["material_id"].as_str().unwrap().to_string()));
            for r in s["extra_material_refs"].as_array().unwrap() {
                assert!(all.contains(&r.as_str().unwrap().to_string()), "{r} names no material");
            }
            // on the grid: a boundary is a whole frame's microseconds
            let st = s["target_timerange"]["start"].as_i64().unwrap();
            assert_eq!(build::us((st as f64 * 30.0 / 1e6).round() as i64, 30.0), st);
        }
    }
    let main = tracks[0]["segments"].as_array().unwrap();
    assert_eq!(main[0]["target_timerange"], serde_json::json!({"start": 0, "duration": 1_500_000}));
    assert_eq!(main[1]["target_timerange"]["start"], 1_500_000);
    assert_eq!(main[0]["source_timerange"]["start"], 500_000);
    // a video segment has CapCut's five companions and its speed
    assert_eq!(main[0]["extra_material_refs"].as_array().unwrap().len(), 6);
    // 2x: the source runs twice the timeline's length; 29 frames at 30 fps
    let pip = &tracks[1]["segments"][0];
    assert_eq!(pip["source_timerange"]["duration"].as_i64().unwrap(), 2 * (build::us(89, 30.0) - build::us(60, 30.0)));
    let x = pip["clip"]["transform"]["x"].as_f64().unwrap();
    assert!((x - (840.0 - 540.0) / 540.0).abs() < 1e-6 && pip["clip"]["transform"]["y"].as_f64().unwrap() > 0.0, "up is +y");
    // a sound: no clip object (it crashes CapCut), its fade a material of its own
    let snd = &tracks[2]["segments"][0];
    assert!(snd["clip"].is_null() && snd["hdr_settings"].is_null() && snd.get("uniform_scale").is_none());
    assert_eq!(snd["volume"], 0.5);
    assert_eq!(ids(info, "audio_fades").len(), 1);
    // one material a segment, one import a file, each material naming its file's import
    assert_eq!(ids(info, "videos").len(), 3);
    assert_eq!(b.imports.len(), 3);
    let locals: Vec<&str> = b.imports.iter().map(|i| i["id"].as_str().unwrap()).collect();
    for v in info["materials"]["videos"].as_array().unwrap() {
        assert!(locals.contains(&v["local_material_id"].as_str().unwrap()));
    }
    assert_eq!(info["canvas_config"]["ratio"], "9:16");
    assert_eq!(info["duration"], 3_000_000);
    assert!(b.warnings.is_empty(), "{:?}", b.warnings);
    let _ = std::fs::remove_dir_all(&d);
}

#[test]
fn a_draft_folder_is_whole_and_its_timeline_copies_identical() {
    let d = tmp("write");
    let root = d.join("store");
    let w = write(&timeline(&d), &root, "fixture", &Markers::default(), Some(b"\xFF\xD8jpeg")).unwrap();
    let info = std::fs::read(w.dir.join("draft_info.json")).unwrap();
    let j: Value = serde_json::from_slice(&info).unwrap();
    let tid = j["id"].as_str().unwrap();
    for rel in ["draft_info.json.bak", "template-2.tmp", &format!("Timelines/{tid}/draft_info.json"), &format!("Timelines/{tid}/template-2.tmp")] {
        assert_eq!(std::fs::read(w.dir.join(rel)).unwrap(), info, "{rel}");
    }
    for rel in ["draft_meta_info.json", "draft_settings", "timeline_layout.json", "Timelines/project.json", "draft_cover.jpg", "assets/video/a.mp4", "assets/audio/music.wav", "matting", "Resources/videoAlg"] {
        assert!(w.dir.join(rel).exists(), "{rel}");
    }
    // media named where it is in the draft
    let path = j["materials"]["videos"][0]["path"].as_str().unwrap();
    assert!(path.starts_with(&w.dir.display().to_string()) && Path::new(path).exists(), "{path}");
    assert_eq!(w.meta["draft_timeline_materials_size_"], info.len());
    // never over a draft that's there, and nothing hidden left behind
    assert!(write(&timeline(&d), &root, "fixture", &Markers::default(), None).is_err());
    assert_eq!(std::fs::read_dir(&root).unwrap().count(), 1);
    let _ = std::fs::remove_dir_all(&d);
}

#[test]
fn registration_adds_one_entry_and_keeps_the_rest() {
    let d = tmp("register");
    let root = d.join("store");
    std::fs::create_dir_all(&root).unwrap();
    std::fs::write(root.join("root_meta_info.json"), r#"{"all_draft_store":[{"draft_name":"0824","draft_id":"X"}],"draft_ids":1,"root_path":"r"}"#).unwrap();
    let w = write(&timeline(&d), &root, "mine", &Markers::default(), None).unwrap();
    if capcut_running() {
        assert!(register(&root, &w.dir, &w.meta, w.info_bytes, &d.join("backups")).is_err());
        return;
    }
    let backup = register(&root, &w.dir, &w.meta, w.info_bytes, &d.join("backups")).unwrap();
    let j: Value = serde_json::from_str(&std::fs::read_to_string(root.join("root_meta_info.json")).unwrap()).unwrap();
    let list = j["all_draft_store"].as_array().unwrap();
    assert_eq!(list.len(), 2);
    assert_eq!(list[0]["draft_name"], "mine");
    assert_eq!(list[1]["draft_name"], "0824");
    assert_eq!(j["draft_ids"], 2);
    assert!(std::fs::read_to_string(backup).unwrap().contains("0824"));
    let _ = std::fs::remove_dir_all(&d);
}

#[test]
fn markers_come_from_the_newest_app_made_draft() {
    let d = tmp("seed");
    for (name, ver, src) in [("old", "8.5.0", "cc"), ("tool", "", "cc"), ("other", "9.1.0", "lv")] {
        std::fs::create_dir_all(d.join(name)).unwrap();
        std::fs::write(d.join(name).join("draft_info.json"), format!(r#"{{"version":360000,"new_version":"167.0.0","platform":{{"app_source":"{src}","app_version":"{ver}"}}}}"#)).unwrap();
    }
    let m = seed(&d);
    assert_eq!(m.from.as_deref(), Some("old"));
    assert_eq!(seed(&d.join("none")).new_version, "167.0.0");
    let _ = std::fs::remove_dir_all(&d);
}

#[test]
fn ids_are_uuid_shaped_and_distinct() {
    let a: Vec<String> = (0..1000).map(|_| uid()).collect();
    assert_eq!(a.iter().collect::<std::collections::HashSet<_>>().len(), 1000);
    assert!(a.iter().all(|i| i.len() == 36 && i.as_bytes()[14] == b'4'));
}
