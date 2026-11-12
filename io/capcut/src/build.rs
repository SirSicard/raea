//! The timeline as draft_info.json: tracks of segments, each segment's materials, every time in microseconds on the
//! frame grid (CapCut snaps boundaries to the nearest frame when it opens a draft, so writing them there keeps them).
//! Segments and materials start from CapCut's own (skeleton.rs).

use serde_json::{Value, json};

use crate::*;

/// What a build made: draft_info.json's object, its timeline id and length, the import list's entries (one a file, in
/// draft_meta_info.json), and what doesn't carry exactly.
pub struct Built {
    pub info: Value,
    pub timeline_id: String,
    pub duration_us: i64,
    pub imports: Vec<Value>,
    pub warnings: Vec<String>,
}

/// Frame `f` in microseconds on the grid: round(f x 1e6 / fps).
pub fn us(f: i64, fps: f64) -> i64 {
    (f as f64 * 1e6 / fps).round() as i64
}

fn parse(s: &str) -> Value {
    serde_json::from_str(s).expect("skeleton.rs holds JSON")
}

/// `ratio` for canvas_config: a standard one, else "original".
fn ratio(w: u32, h: u32) -> String {
    fn gcd(a: u32, b: u32) -> u32 {
        if b == 0 { a } else { gcd(b, a % b) }
    }
    let g = gcd(w, h).max(1);
    let r = format!("{}:{}", w / g, h / g);
    if ["9:16", "16:9", "1:1", "4:3", "3:4", "4:5", "2:1", "21:9"].contains(&r.as_str()) { r } else { "original".into() }
}

fn r6(v: f64) -> f64 {
    (v * 1e6).round() / 1e6
}

/// A picture's clip: the centre offset from the canvas's centre in half-canvas units, +y up.
fn clip_json(p: &Place, w: f64, h: f64) -> Value {
    json!({"alpha": r6(p.opacity), "flip": {"horizontal": false, "vertical": false}, "rotation": 0.0, "scale": {"x": r6(p.scale), "y": r6(p.scale)}, "transform": {"x": r6((p.x - w / 2.0) / (w / 2.0)), "y": r6((h / 2.0 - p.y) / (h / 2.0))}})
}

pub fn build(tl: &Timeline, markers: &Markers) -> R<Built> {
    let (w, h, fps) = (tl.width as f64, tl.height as f64, tl.fps);
    if fps <= 0.0 || tl.width == 0 || tl.height == 0 {
        return Err(format!("a {}x{} timeline at {fps} fps", tl.width, tl.height));
    }
    let mut warnings = Vec::new();
    let mut info = parse(skeleton::DRAFT_INFO);
    let mut mats: std::collections::BTreeMap<&str, Vec<Value>> = Default::default();
    // one import entry a file, which every material of that file names (local_material_id)
    let locals: Vec<String> = tl.media.iter().map(|_| uid().to_lowercase()).collect();
    let mut used = vec![false; tl.media.len()];
    let mut tracks = Vec::new();
    let mut duration = 0i64;
    for (ti, t) in tl.tracks.iter().enumerate() {
        let mut clips: Vec<&Clip> = t.clips.iter().collect();
        clips.sort_by_key(|c| c.start);
        let mut segments = Vec::new();
        let mut end_before = 0i64;
        for (ci, c) in clips.iter().enumerate() {
            let at = format!("{} clip {ci}", t.name);
            let m = tl.media.get(c.media).ok_or(format!("{at}: no media {}", c.media))?;
            if t.kind == Kind::Video && m.kind == MediaKind::Audio {
                return Err(format!("{at}: {} has no picture", m.path.display()));
            }
            if c.frames <= 0 {
                return Err(format!("{at}: {} frames", c.frames));
            }
            if c.start < end_before {
                return Err(format!("{at}: starts at frame {} inside the clip before it, which ends at {end_before}", c.start));
            }
            if ti == 0 && t.kind == Kind::Video && c.start != end_before {
                warnings.push(format!("{at}: a gap before frame {} on the main track, which CapCut closes on the first edit", c.start));
            }
            end_before = c.start + c.frames;
            let (start, end) = (us(c.start, fps), us(c.start + c.frames, fps));
            let target = end - start;
            let photo = m.kind == MediaKind::Photo;
            let total = if photo { 10_800_000_000 } else { (m.seconds * 1e6).round() as i64 };
            let src_in = if photo { 0 } else { (c.source_in * 1e6).round() as i64 };
            let mut src_dur = if photo { target } else { (target as f64 * c.speed).round() as i64 };
            if !photo && src_in + src_dur > total {
                let over = src_in + src_dur - total;
                if over as f64 > 1e6 / fps {
                    warnings.push(format!("{at}: runs {:.0} ms past the end of {}; trimmed", over as f64 / 1000.0, m.path.display()));
                }
                src_dur = (total - src_in).max(0);
            }
            let material = uid();
            let speed_id = uid();
            mats.entry("speeds").or_default().push(json!({"curve_speed": null, "id": speed_id, "mode": 0, "speed": c.speed, "type": "speed"}));
            let mut refs = vec![json!(speed_id)];
            if c.fade_in > 0.0 || c.fade_out > 0.0 {
                let id = uid();
                mats.entry("audio_fades").or_default().push(json!({"fade_in_duration": (c.fade_in * 1e6).round() as i64, "fade_out_duration": (c.fade_out * 1e6).round() as i64, "fade_type": 0, "id": id, "type": "audio_fade"}));
                refs.push(json!(id));
            }
            let mut seg = parse(skeleton::VIDEO_SEGMENT);
            let name = m.path.file_name().map(|n| n.to_string_lossy().into_owned()).unwrap_or_default();
            if t.kind == Kind::Video {
                for (key, comp) in skeleton::COMPANIONS {
                    let mut v = parse(comp);
                    let id = uid();
                    v["id"] = json!(id);
                    mats.entry(key).or_default().push(v);
                    refs.push(json!(id));
                }
                let mut v = parse(skeleton::VIDEO_MATERIAL);
                let [l, tp, r, b] = c.place.crop;
                v["id"] = json!(material);
                v["type"] = json!(if photo { "photo" } else { "video" });
                v["path"] = json!(m.path.display().to_string());
                v["material_name"] = json!(name);
                v["local_material_id"] = json!(locals[c.media]);
                v["duration"] = json!(total);
                v["width"] = json!(m.width);
                v["height"] = json!(m.height);
                v["has_audio"] = json!(m.has_audio);
                v["crop"] = json!({"upper_left_x": l, "upper_left_y": tp, "upper_right_x": r, "upper_right_y": tp, "lower_left_x": l, "lower_left_y": b, "lower_right_x": r, "lower_right_y": b});
                mats.entry("videos").or_default().push(v);
                seg["clip"] = clip_json(&c.place, w, h);
            } else {
                mats.entry("audios").or_default().push(json!({
                    "app_id": 0, "category_id": "", "category_name": "local", "check_flag": 1, "copyright_limit_type": "none",
                    "duration": total, "effect_id": "", "formula_id": "", "id": material, "intensifies_path": "", "is_ai_clone_tone": false,
                    "is_text_edit_overdub": false, "is_ugc": false, "local_material_id": locals[c.media], "music_id": locals[c.media],
                    "name": name, "path": m.path.display().to_string(), "query": "", "request_id": "", "resource_id": "", "search_id": "",
                    "source_from": "", "source_platform": 0, "team_id": "", "text_id": "", "tone_category_id": "", "tone_category_name": "",
                    "tone_effect_id": "", "tone_effect_name": "", "tone_platform": "", "tone_second_category_id": "",
                    "tone_second_category_name": "", "tone_speaker": "", "tone_type": "", "type": "extract_music", "video_id": "", "wave_points": []
                }));
                // a clip object on a sound crashes CapCut; a sound has no HDR or uniform scale
                seg["clip"] = Value::Null;
                seg["hdr_settings"] = Value::Null;
                seg.as_object_mut().unwrap().remove("uniform_scale");
            }
            seg["id"] = json!(uid());
            seg["material_id"] = json!(material);
            seg["target_timerange"] = json!({"start": start, "duration": target});
            seg["source_timerange"] = json!({"start": src_in, "duration": src_dur});
            seg["speed"] = json!(c.speed);
            seg["volume"] = json!(r6(c.volume));
            seg["last_nonzero_volume"] = json!(if c.volume > 0.0 { r6(c.volume) } else { 1.0 });
            seg["extra_material_refs"] = Value::Array(refs);
            seg["render_index"] = json!(ti);
            segments.push(seg);
            used[c.media] = true;
            duration = duration.max(end);
        }
        tracks.push(json!({"attribute": 0, "flag": 0, "id": uid(), "is_default_name": t.name.is_empty(), "name": t.name, "segments": segments, "type": if t.kind == Kind::Video { "video" } else { "audio" }}));
    }
    let timeline_id = uid();
    info["id"] = json!(timeline_id);
    info["version"] = json!(markers.version);
    info["new_version"] = json!(markers.new_version);
    info["duration"] = json!(duration);
    info["fps"] = json!(fps);
    info["canvas_config"] = json!({"ratio": ratio(tl.width, tl.height), "width": tl.width, "height": tl.height, "background": null});
    info["tracks"] = Value::Array(tracks);
    for (k, v) in mats {
        info["materials"][k] = Value::Array(v);
    }
    info["platform"] = markers.platform.clone();
    info["last_modified_platform"] = markers.platform.clone();
    let imports = tl
        .media
        .iter()
        .enumerate()
        .filter(|(i, _)| used[*i])
        .map(|(i, m)| {
            let audio = m.kind == MediaKind::Audio;
            let meta = match m.kind {
                MediaKind::Video => "video",
                MediaKind::Photo => "photo",
                MediaKind::Audio => "music",
            };
            json!({
                "ai_group_type": "", "create_time": -1, "duration": if m.kind == MediaKind::Photo { 5_000_000 } else { (m.seconds * 1e6).round() as i64 },
                "enter_from": 0, "extra_info": m.path.file_name().map(|n| n.to_string_lossy().into_owned()).unwrap_or_default(),
                "file_Path": m.path.display().to_string(), "height": if audio { 0 } else { m.height }, "id": locals[i], "import_time": -1,
                "import_time_ms": -1, "item_source": 1, "material_color_tag": "", "md5": "", "metetype": meta,
                "roughcut_time_range": {"duration": -1, "start": -1}, "sub_time_range": {"duration": -1, "start": -1}, "type": 0,
                "width": if audio { 0 } else { m.width }
            })
        })
        .collect();
    Ok(Built { info, timeline_id, duration_us: duration, imports, warnings })
}
