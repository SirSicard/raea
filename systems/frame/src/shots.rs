//! Cuts between cameras (docs/rerender.feature RR2): the frames at which the camera row's `shot` steps, another of the
//! scene's cameras becoming the piece's (<Camera3d is_active>, raea-runtime-look's active.rs).

/// The frames that start a camera's shot, sorted, found once a load. Such a frame has no frame before it, as a shot
/// rendered alone hasn't: motion blur's step before it draws the frame itself (Engine::pre_step), and a temporal
/// effect's history (Solari's) starts again.
#[derive(bevy::prelude::Resource, Default)]
pub struct Shots(pub Vec<i64>);

/// A live scene's camera row moved to another shot (Engine::set_rows: a game's or play's frames come as rows, with no
/// timeline to find Shots in): the next frame drawn is a cut, whichever frame was drawn before it.
#[derive(bevy::prelude::Resource)]
pub struct Moved;

impl Shots {
    pub fn of(prog: &raea_core_program::ir::Program) -> Shots {
        let keys = prog.keys.get(&("cam".to_string(), "shot".to_string()));
        Shots(keys.map(|k| k.windows(2).filter(|w| w[0].1 != w[1].1).map(|w| w[1].0).collect()).unwrap_or_default())
    }

    /// Whether frame `f` starts a shot after another (the piece's first frame has none before it anyway).
    pub fn starts(&self, f: i64) -> bool {
        self.0.binary_search(&f).is_ok()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn a_cut_is_where_the_shot_steps() {
        let mut p = raea_core_program::ir::Program::default();
        assert!(!Shots::of(&p).starts(0));
        let k = |f: i64, v: f64| (f, v, "step".to_string());
        p.keys.insert(("cam".into(), "shot".into()), vec![k(0, 0.0), k(40, 1.0), k(90, 0.0)]);
        let s = Shots::of(&p);
        assert_eq!(s.0, vec![40, 90]);
        assert!(s.starts(40) && s.starts(90) && !s.starts(41) && !s.starts(0));
    }
}
