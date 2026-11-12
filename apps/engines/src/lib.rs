//! The verbs that script other engines from TypeScript: Blender (`raea setup blender`, `raea blender run SCRIPT.py|.ts`;
//! finding and setting Blender up is apps/tools/src/blender.rs) and Godot with GodotJS (`raea setup godot`,
//! `raea godot run|types|open`; sdk/blender and sdk/godot are their TypeScript sides).

/// the Blender a TypeScript script drives (`raea blender run SCRIPT.ts`, sdk/blender)
pub mod blender_bridge;
/// `raea blender run SCRIPT.ts`: the script on raea's engine, its batches posted to the bridge's Blender
pub mod blender_ts;
/// `raea setup godot`, `raea godot types` and `raea godot open`: Godot with GodotJS (sdk/godot)
pub mod godot;
/// `raea godot run SCRIPT.ts`: a TypeScript script in Godot through GodotJS
pub mod godot_run;
/// `raea blender shot`, `raea godot shot`: a shot's frames drawn by Blender or Godot (<BlenderShot>, <GodotShot>)
pub mod shot;
/// `raea scene export`, `raea godot export|back`, `raea blender open|back`: a raea scene sent to Blender or Godot and back
pub mod round;

use raea_app_tools::blender;

type R<T> = Result<T, String>;

/// The CLI's verbs here, or None for any other: `setup blender|godot`, `blender ...` and `godot ...`.
pub fn cli(args: &[String]) -> Option<R<String>> {
    let second = args.get(1).map(String::as_str);
    Some(match (args.first()?.as_str(), second) {
        ("setup", Some("blender")) => blender::setup(&args[2..]),
        ("setup", Some("godot")) => godot::setup(&args[2..]),
        ("blender", Some("run")) if args.get(2).is_some_and(|s| blender_bridge::is_ts(s)) => blender_ts::run(args),
        ("blender", Some("shot")) => shot::blender(args),
        ("godot", Some("shot")) => shot::godot(args),
        ("scene", Some("export")) => round::scene_export(args),
        ("godot", Some("export")) => round::godot_export(args),
        ("godot", Some("back")) => round::godot_back(args),
        ("blender", Some("open")) => round::blender_open(args),
        ("blender", Some("back")) => round::blender_back(args),
        ("blender", _) => blender::blender(args),
        ("godot", _) => godot::godot(args),
        _ => return None,
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    fn args(s: &str) -> Vec<String> {
        s.split_whitespace().map(str::to_string).collect()
    }

    // other verbs pass through untouched, and a bare `godot` or `blender` gets its usage, not a run
    #[test]
    fn takes_only_its_verbs() {
        assert!(cli(&args("setup audio")).is_none());
        assert!(cli(&args("render edit.tsx")).is_none());
        assert!(cli(&[]).is_none());
        assert!(cli(&args("godot")).unwrap().unwrap_err().contains(godot::USAGE));
    }
}
