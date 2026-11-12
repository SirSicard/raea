//! CapCut's draft store: where it is, the version markers of the newest draft CapCut made there (each build refuses a
//! draft whose markers look old: "from an unusual path"), whether CapCut is running, and entering a draft in
//! root_meta_info.json, the list CapCut shows its projects from and rewrites when it quits.

use std::path::{Path, PathBuf};

use serde_json::{Value, json};

use crate::{R, skeleton};

/// The store on this machine, whether or not CapCut has made it yet.
pub fn store_root() -> Option<PathBuf> {
    if cfg!(target_os = "windows") {
        let local = std::env::var_os("LOCALAPPDATA")?;
        return Some(PathBuf::from(local).join("CapCut/User Data/Projects/com.lveditor.draft"));
    }
    let home = std::env::var_os("HOME")?;
    cfg!(target_os = "macos").then(|| PathBuf::from(home).join("Movies/CapCut/User Data/Projects/com.lveditor.draft"))
}

/// Version markers and the platform block a new draft is stamped with.
#[derive(Clone, Debug)]
pub struct Markers {
    pub version: i64,
    pub new_version: String,
    pub platform: Value,
    /// the draft they came from, when one did
    pub from: Option<String>,
}

impl Default for Markers {
    /// CapCut 8.5.0's, with this system's name and the machine's ids blank (as CapCut's own template.tmp holds them)
    fn default() -> Markers {
        let os = if cfg!(target_os = "windows") { "windows" } else { "mac" };
        Markers {
            version: skeleton::VERSION,
            new_version: skeleton::NEW_VERSION.into(),
            platform: json!({"os": os, "os_version": "", "app_id": skeleton::APP_ID, "app_version": skeleton::APP_VERSION, "app_source": "cc", "device_id": "", "hard_disk_id": "", "mac_address": ""}),
            from: None,
        }
    }
}

/// The markers of the draft in `root` CapCut saved last (its platform's app_source "cc"), else 8.5.0's. Read only.
pub fn seed(root: &Path) -> Markers {
    let mut best: Option<(std::time::SystemTime, Markers)> = None;
    for e in std::fs::read_dir(root).into_iter().flatten().flatten() {
        let info = e.path().join("draft_info.json");
        let Some(j) = std::fs::read_to_string(&info).ok().and_then(|t| serde_json::from_str::<Value>(&t).ok()) else { continue };
        let p = if j["last_modified_platform"].is_object() { &j["last_modified_platform"] } else { &j["platform"] };
        let (Some(v), Some(nv)) = (j["version"].as_i64(), j["new_version"].as_str()) else { continue };
        if p["app_source"] != "cc" || p["app_version"].as_str().is_none_or(str::is_empty) || nv.is_empty() {
            continue;
        }
        let when = std::fs::metadata(&info).and_then(|m| m.modified()).unwrap_or(std::time::UNIX_EPOCH);
        if best.as_ref().is_none_or(|(b, _)| when > *b) {
            best = Some((when, Markers { version: v, new_version: nv.into(), platform: p.clone(), from: Some(e.file_name().to_string_lossy().into_owned()) }));
        }
    }
    best.map(|b| b.1).unwrap_or_default()
}

/// Whether CapCut is running (it rewrites root_meta_info.json when it quits, dropping what was entered meanwhile).
pub fn capcut_running() -> bool {
    use std::process::Command;
    if cfg!(target_os = "windows") {
        return Command::new("tasklist").args(["/FI", "IMAGENAME eq CapCut.exe", "/NH"]).output().is_ok_and(|o| String::from_utf8_lossy(&o.stdout).to_lowercase().contains("capcut.exe"));
    }
    Command::new("pgrep").args(["-f", "CapCut.app/Contents/MacOS/"]).output().is_ok_and(|o| o.status.success() && !o.stdout.is_empty())
}

/// The draft at `draft` (a folder in `root`) entered in root_meta_info.json, after a copy of that file is kept in
/// `backups`; written through a temporary file and a rename, every other entry as it was. Refused while CapCut runs.
pub fn register(root: &Path, draft: &Path, meta: &Value, info_bytes: usize, backups: &Path) -> R<PathBuf> {
    if capcut_running() {
        return Err("CapCut is open: it rewrites its project list when it quits, so the draft would drop off it. Quit CapCut and enter the draft again".into());
    }
    let index = root.join("root_meta_info.json");
    let mut j: Value = match std::fs::read_to_string(&index) {
        Ok(t) => serde_json::from_str(&t).map_err(|e| format!("{}: {e}", index.display()))?,
        Err(_) => json!({"all_draft_store": [], "draft_ids": 0, "root_path": root.display().to_string()}),
    };
    std::fs::create_dir_all(backups).map_err(|e| format!("{}: {e}", backups.display()))?;
    let stamp = std::time::SystemTime::now().duration_since(std::time::UNIX_EPOCH).map(|d| d.as_millis()).unwrap_or(0);
    let backup = backups.join(format!("root_meta_info.{stamp}.json"));
    if index.exists() {
        std::fs::copy(&index, &backup).map_err(|e| format!("{}: {e}", backup.display()))?;
    }
    let mut entry: Value = serde_json::from_str(skeleton::ROOT_ENTRY).expect("skeleton.rs holds JSON");
    for k in ["draft_fold_path", "draft_id", "draft_name", "draft_root_path", "tm_draft_create", "tm_draft_modified", "tm_duration"] {
        entry[k] = meta[k].clone();
    }
    entry["draft_cover"] = json!(draft.join("draft_cover.jpg").display().to_string());
    entry["draft_json_file"] = json!(draft.join("draft_info.json").display().to_string());
    entry["draft_timeline_materials_size"] = json!(info_bytes);
    let list = j["all_draft_store"].as_array_mut().ok_or(format!("{}: no all_draft_store list", index.display()))?;
    list.insert(0, entry);
    j["draft_ids"] = json!(j["draft_ids"].as_i64().unwrap_or(0) + 1);
    let tmp = root.join(format!(".root_meta_info.{}.tmp", std::process::id()));
    std::fs::write(&tmp, serde_json::to_vec(&j).map_err(|e| e.to_string())?).map_err(|e| format!("{}: {e}", tmp.display()))?;
    std::fs::rename(&tmp, &index).map_err(|e| format!("{}: {e}", index.display()))?;
    Ok(backup)
}
