use super::*;

#[test]
fn a_name_is_its_folder() {
    assert_eq!(slug("Shane's Studio"), "shane-s-studio");
    assert_eq!(slug("  CJ / Reel 2 "), "cj-reel-2");
}

#[test]
fn a_spec_module_is_tidy_typescript() {
    // keys unquoted where they can be, nulls and empty lists left out, whole numbers whole, short string lists inline
    let v = json!({"id": "delivery", "help": null, "tags": [], "n": 45.0, "options": ["9:16", "16:9"], "odd-key": 1});
    // the keys' order is serde_json's: sorted on its own, as written when a crate built alongside turns on
    // preserve_order (raea-cli does), so the lines are held as a set (#90)
    fn lines(s: &str) -> Vec<&str> {
        let mut l: Vec<&str> = s.lines().collect();
        l.sort_unstable();
        l
    }
    assert_eq!(lines(&ts_literal(&v, 0)), lines("{\n  id: \"delivery\",\n  n: 45,\n  \"odd-key\": 1,\n  options: [\"9:16\", \"16:9\"],\n}"));
}

#[test]
fn up_finds_the_nearest_marker() {
    let root = std::env::temp_dir().canonicalize().unwrap().join(format!("raea-ws-up-{}", std::process::id()));
    let deep = root.join("projects/launch/media");
    std::fs::create_dir_all(&deep).unwrap();
    std::fs::create_dir_all(root.join(".raea")).unwrap();
    std::fs::write(root.join(".raea/workspace"), "").unwrap();
    assert_eq!(up(&deep, ".raea/workspace").as_deref(), Some(root.as_path()));
    assert_eq!(up(&deep, ".raea/project"), None);
    let _ = std::fs::remove_dir_all(&root);
}

fn scratch(name: &str) -> PathBuf {
    let d = std::env::temp_dir().join(format!("raea-ws-{name}-{}", std::process::id()));
    let _ = std::fs::remove_dir_all(&d);
    std::fs::create_dir_all(&d).unwrap();
    d
}

#[test]
fn next_walks_a_project_from_brief_to_show() {
    let d = scratch("next");
    std::fs::create_dir_all(d.join(".raea")).unwrap();
    std::fs::write(d.join(".raea/project"), "").unwrap();
    let shaped = next::Brief { needs: vec![], modes: vec!["tool".into()] };
    let unshaped = next::Brief { needs: vec!["who it's for (audience)".into()], modes: vec!["pitch".into()] };
    let s = next::steps(&d, &unshaped, 0);
    assert!(s[0].starts_with("shape the brief: who it's for") && s[1].starts_with("plan it") && s[2].starts_with("make the first item"), "{s:?}");
    assert!(next::steps(&d, &shaped, 2)[0].starts_with("raea doctor: 2"));
    std::fs::write(d.join("card.tsx"), "export const Card = () => null;\n").unwrap();
    let s = next::steps(&d, &shaped, 0);
    assert!(s[0].starts_with("connect the project's files: 1 thing(s) aren't connected, first card.tsx:1: isn't a composition"), "{s:?}");
    std::fs::write(d.join("piece.tsx"), "import { Composition, registerRoot } from \"raea\";\nimport { Card } from \"./card\";\nregisterRoot(() => <Composition id=\"piece\" component={Card} width={1080} height={1920} fps={30} durationInFrames={90} />);\n").unwrap();
    assert!(next::steps(&d, &shaped, 0)[0].starts_with("render piece.tsx"), "{:?}", next::steps(&d, &shaped, 0));
    // the rest is read from the project's record (DR3): what each render and check found
    use raea_core_facts::{Finding, Level, record::keep};
    let (piece, video) = (d.join("piece.tsx"), d.join("out/piece.mp4"));
    std::fs::create_dir_all(d.join("out")).unwrap();
    std::fs::write(&video, "").unwrap();
    let clips = Finding::new("clips", Level::Error, "the rider is in the seat", "raea render");
    keep("raea render", &piece, Some(&video), &[clips], vec![], "20261110-160000").unwrap();
    assert!(next::steps(&d, &shaped, 0)[0].starts_with("fix piece.tsx: clips: the rider is in the seat (its render 20261110-160000-piece found it"), "{:?}", next::steps(&d, &shaped, 0));
    keep("raea render", &piece, Some(&video), &[], vec![], "20261110-160001").unwrap();
    assert!(next::steps(&d, &shaped, 0)[0].starts_with("check out/piece.mp4: `raea check out/piece.mp4 -o out/piece.check.json`"));
    keep("raea check", &video, None, &[Finding::new("clipped", Level::Error, "text clipped at 2 s", "raea check")], vec![], "20261110-160002").unwrap();
    assert_eq!(next::steps(&d, &shaped, 0)[0], "polish out/piece.mp4: clipped: text clipped at 2 s (`raea guide polish`)");
    keep("raea check", &video, None, &[Finding::new("reading", Level::Note, "minor", "raea check")], vec![], "20261110-160003").unwrap();
    assert!(next::steps(&d, &shaped, 0)[0].starts_with("show out/piece.mp4"));
    // stills (or a review) since the video don't replace it
    keep("raea render", &piece, Some(&d.join("out")), &[], vec![], "20261110-160004").unwrap();
    assert!(next::steps(&d, &shaped, 0)[0].starts_with("show out/piece.mp4"), "{:?}", next::steps(&d, &shaped, 0));
    // the composition changed after the videos were made (their entries made old), before the stills: the video again
    for id in ["20261110-160000-piece", "20261110-160001-piece"] {
        let rec = d.join(format!(".raea/record/{id}.json"));
        let mut v: serde_json::Value = serde_json::from_slice(&std::fs::read(&rec).unwrap()).unwrap();
        v["at"] = 1.into();
        std::fs::write(&rec, v.to_string()).unwrap();
    }
    let changed = std::time::UNIX_EPOCH + std::time::Duration::from_secs(100);
    std::fs::File::options().write(true).open(&piece).unwrap().set_modified(changed).unwrap();
    assert_eq!(next::steps(&d, &shaped, 0)[0], "render the video again: piece.tsx changed after 20261110-160001-piece made out/piece.mp4");
    // no video at all: the video next
    for id in ["20261110-160000-piece", "20261110-160001-piece"] {
        std::fs::remove_file(d.join(format!(".raea/record/{id}.json"))).unwrap();
    }
    assert_eq!(next::steps(&d, &shaped, 0)[0], "render the video: `raea render piece.tsx -o out/piece.mp4`");
    let _ = std::fs::remove_dir_all(&d);
}

#[test]
fn doctor_connects_a_projects_files() {
    let d = scratch("doctor-pj8");
    std::fs::create_dir_all(d.join(".raea")).unwrap();
    std::fs::write(d.join(".raea/project"), "").unwrap();
    std::fs::write(d.join("loose.tsx"), "export const Loose = () => null;\n").unwrap();
    std::fs::write(d.join("pace.ts"), "import { controller } from \"raea/brief\";\nexport default controller({ title: \"Pace\", fields: {} });\n").unwrap();
    let found = doctor::registry_findings(&d);
    let says: Vec<&String> = found.iter().map(|f| &f.says).collect();
    assert_eq!(found.len(), 2, "{says:?}");
    assert!(says[0].contains("loose.tsx:1: isn't a composition") && !found[0].fixable(), "{says:?}");
    assert!(says[1].contains("pace.ts:2: a controller outside controllers/") && found[1].fixable(), "{says:?}");
    let out = doctor::doctor(&["--fix".into(), d.display().to_string()], &[], "0.0.1", &|_| Ok(String::new())).unwrap();
    assert!(out.starts_with("APPLIED  3 of 4 fixed") && out.contains("fixed  ") && d.join("controllers/pace.ts").is_file() && !d.join("pace.ts").exists(), "{out}");
    assert_eq!(doctor::registry_findings(&d).len(), 1, "only the loose file is left");
    let _ = std::fs::remove_dir_all(&d);
}

#[test]
fn doctor_finds_old_briefs_and_old_skills() {
    let d = scratch("doctor");
    std::fs::write(d.join("acme.brief"), "title: x").unwrap();
    std::fs::create_dir_all(d.join("skills/raea")).unwrap();
    std::fs::write(d.join("skills/raea/SKILL.md"), "---\nname: raea\nversion: 0.0.1\n---\n").unwrap();
    let skills = [("claude", d.join("skills"))];
    let found = doctor::findings(&d, &skills, "0.0.2");
    assert_eq!(found.len(), 2, "{:?}", found.iter().map(|f| &f.says).collect::<Vec<_>>());
    assert!(found[0].says.contains("acme.brief") && !found[0].fixable());
    assert!(found[1].says.contains("is 0.0.1, this raea is 0.0.2") && found[1].fixable());
    assert!(doctor::findings(&d, &skills, "0.0.1").len() == 1);
    let reinstalled = std::cell::Cell::new(false);
    let out = doctor::doctor(&["--fix".into(), d.display().to_string()], &skills, "0.0.2", &|a| { reinstalled.set(a == "claude"); Ok(String::new()) }).unwrap();
    assert!(reinstalled.get() && out.starts_with("APPLIED  1 of 2 fixed"), "{out}");
    let _ = std::fs::remove_dir_all(&d);
}

#[test]
fn the_root_with_none_set() {
    let home = scratch("home-root");
    assert_eq!(default_root(&home), home.join("Documents/raea"));
    // an empty ~/Studio isn't one; one with a workspace stays the root
    std::fs::create_dir_all(home.join("Studio/notes")).unwrap();
    assert_eq!(default_root(&home), home.join("Documents/raea"));
    std::fs::create_dir_all(home.join("Studio/acme/.raea")).unwrap();
    std::fs::write(home.join("Studio/acme/.raea/workspace"), "").unwrap();
    assert_eq!(default_root(&home), home.join("Studio"));
    // iCloud keeping Documents: ~/raea
    let synced = scratch("home-icloud");
    std::fs::create_dir_all(synced.join("Library/Mobile Documents/com~apple~CloudDocs/Documents")).unwrap();
    assert_eq!(default_root(&synced), synced.join("raea"));
}
