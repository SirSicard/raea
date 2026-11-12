//! A draft folder laid out as CapCut 8.5.0 lays one out: draft_info.json and its byte-identical copies (8.4 and 8.5
//! read the root one, 9.2.8 and later the one under Timelines/<id>/), the timeline list, the import list, the sidecars
//! CapCut writes at their defaults, and the media in assets/ where sandboxed CapCut can read it. Built in a hidden
//! folder beside the draft and renamed into place, so CapCut never sees half a draft; never over a folder that's there.

use std::path::{Path, PathBuf};

use serde_json::{Value, json};

use crate::*;

/// What a write made: the draft's folder and id, its length, draft_meta_info.json's object (registration reads it),
/// draft_info.json's size, and what doesn't carry exactly.
pub struct Written {
    pub dir: PathBuf,
    pub draft_id: String,
    pub duration_us: i64,
    pub meta: Value,
    pub info_bytes: usize,
    pub warnings: Vec<String>,
}

/// `tl` as a draft named `name` in `root` (CapCut's store, or any folder), its media copied into assets/ (a clone on
/// APFS), `cover` (a JPEG) its thumbnail in CapCut's list.
pub fn write(tl: &Timeline, root: &Path, name: &str, markers: &Markers, cover: Option<&[u8]>) -> R<Written> {
    if name.is_empty() || name.contains(['/', '\\']) || name.starts_with('.') {
        return Err(format!("{name:?} can't name a draft folder"));
    }
    let dir = root.join(name);
    if dir.exists() {
        return Err(format!("{} is there already; a draft is never written over", dir.display()));
    }
    std::fs::create_dir_all(root).map_err(|e| format!("{}: {e}", root.display()))?;
    let tmp = root.join(format!(".raea-draft-{}-{}", std::process::id(), uid()));
    let made = fill(tl, &tmp, &dir, root, name, markers, cover);
    match made {
        Ok(w) => {
            std::fs::rename(&tmp, &dir).map_err(|e| format!("{}: {e}", dir.display()))?;
            Ok(w)
        }
        Err(e) => {
            // the hidden folder this write made, and only it
            let _ = std::fs::remove_dir_all(&tmp);
            Err(e)
        }
    }
}

fn put(dir: &Path, rel: &str, data: &[u8]) -> R<()> {
    let p = dir.join(rel);
    if let Some(d) = p.parent() {
        std::fs::create_dir_all(d).map_err(|e| format!("{}: {e}", d.display()))?;
    }
    std::fs::write(&p, data).map_err(|e| format!("{}: {e}", p.display()))
}

fn fill(tl: &Timeline, tmp: &Path, dir: &Path, root: &Path, name: &str, markers: &Markers, cover: Option<&[u8]>) -> R<Written> {
    // the media into assets/<kind>/, each file once, named apart when two share a name; the timeline then names them
    // where they will be once the folder is renamed into place
    let mut placed = tl.clone();
    let mut names = std::collections::HashSet::new();
    for m in &mut placed.media {
        let kind = match m.kind {
            MediaKind::Video => "video",
            MediaKind::Photo => "image",
            MediaKind::Audio => "audio",
        };
        let file = m.path.file_name().map(|n| n.to_string_lossy().into_owned()).ok_or(format!("{}: no file name", m.path.display()))?;
        let mut stored = file.clone();
        let mut k = 1;
        while !names.insert(format!("{kind}/{stored}")) {
            k += 1;
            stored = format!("{k}-{file}");
        }
        let rel = format!("assets/{kind}/{stored}");
        std::fs::create_dir_all(tmp.join("assets").join(kind)).map_err(|e| e.to_string())?;
        // std's copy clones on APFS (no space until one of them changes)
        std::fs::copy(&m.path, tmp.join(&rel)).map_err(|e| format!("{}: {e}", m.path.display()))?;
        m.path = dir.join(&rel);
    }
    let built = build(&placed, markers)?;
    let info = serde_json::to_vec(&built.info).map_err(|e| e.to_string())?;
    for rel in ["draft_info.json", "draft_info.json.bak", "template-2.tmp"] {
        put(tmp, rel, &info)?;
        put(tmp, &format!("Timelines/{}/{rel}", built.timeline_id), &info)?;
    }
    let t = format!("Timelines/{}", built.timeline_id);
    put(tmp, &format!("{t}/attachment_pc_common.json"), skeleton::PC_COMMON.as_bytes())?;
    put(tmp, &format!("{t}/attachment_editing.json"), format!("{}\n", skeleton::EDITING).as_bytes())?;
    put(tmp, &format!("{t}/common_attachment/attachment_action_scene.json"), format!("{}\n", skeleton::ACTION_SCENE).as_bytes())?;
    put(tmp, &format!("{t}/common_attachment/attachment_gen_ai_info.json"), format!("{}\n", skeleton::GEN_AI).as_bytes())?;
    put(tmp, &format!("{t}/common_attachment/attachment_script_video.json"), format!("{}\n", skeleton::SCRIPT_VIDEO).as_bytes())?;
    put(tmp, &format!("{t}/common_attachment/attachment_pc_timeline.json"), skeleton::PC_TIMELINE.as_bytes())?;
    let now = std::time::SystemTime::now().duration_since(std::time::UNIX_EPOCH).map(|d| d.as_micros() as i64).unwrap_or(0);
    let project = json!({
        "config": {"color_space": -1, "render_index_track_mode_on": false, "use_float_render": false},
        "create_time": now, "id": uid(), "main_timeline_id": built.timeline_id,
        "timelines": [{"create_time": now, "id": built.timeline_id, "is_marked_delete": false, "name": "Timeline 01", "update_time": now}],
        "update_time": now, "version": 0
    });
    let project = serde_json::to_vec(&project).map_err(|e| e.to_string())?;
    put(tmp, "Timelines/project.json", &project)?;
    put(tmp, "Timelines/project.json.bak", &project)?;
    let layout = json!({"dockItems": [{"dockIndex": 0, "ratio": 1, "timelineIds": [built.timeline_id], "timelineNames": ["Timeline 01"]}], "layoutOrientation": 1});
    put(tmp, "timeline_layout.json", &serde_json::to_vec(&layout).map_err(|e| e.to_string())?)?;
    let draft_id = uid();
    let mut meta: Value = serde_json::from_str(skeleton::DRAFT_META).expect("skeleton.rs holds JSON");
    meta["draft_fold_path"] = json!(dir.display().to_string());
    meta["draft_id"] = json!(draft_id);
    meta["draft_name"] = json!(name);
    meta["draft_root_path"] = json!(root.display().to_string());
    meta["draft_timeline_materials_size_"] = json!(info.len());
    meta["tm_draft_create"] = json!(now);
    meta["tm_draft_modified"] = json!(now);
    meta["tm_duration"] = json!(built.duration_us);
    // type 0: the media imported, which 9.1 needs to find a clip's file and 9.3 its local_material_id
    meta["draft_materials"][0]["value"] = Value::Array(built.imports.clone());
    put(tmp, "draft_meta_info.json", &serde_json::to_vec(&meta).map_err(|e| e.to_string())?)?;
    let secs = now / 1_000_000;
    let os = if cfg!(target_os = "windows") { "windows" } else { "mac" };
    put(tmp, "draft_settings", format!("[General]\ncloud_last_modify_platform={os}\ndraft_create_time={secs}\ndraft_last_edit_time={secs}\nreal_edit_keys=0\nreal_edit_seconds=0\n").as_bytes())?;
    put(tmp, "draft_agency_config.json", skeleton::AGENCY_CONFIG.as_bytes())?;
    put(tmp, "draft_biz_config.json", b"")?;
    put(tmp, "performance_opt_info.json", skeleton::PERF_OPT.as_bytes())?;
    put(tmp, "attachment_pc_common.json", skeleton::PC_COMMON.as_bytes())?;
    put(tmp, "common_attachment/attachment_pc_timeline.json", skeleton::PC_TIMELINE.as_bytes())?;
    for d in ["adjust_mask", "matting", "qr_upload", "smart_crop", "subdraft", "Resources/audioAlg", "Resources/videoAlg"] {
        std::fs::create_dir_all(tmp.join(d)).map_err(|e| e.to_string())?;
    }
    if let Some(jpg) = cover {
        put(tmp, "draft_cover.jpg", jpg)?;
    }
    Ok(Written { dir: dir.to_path_buf(), draft_id, duration_us: built.duration_us, meta, info_bytes: info.len(), warnings: built.warnings })
}
