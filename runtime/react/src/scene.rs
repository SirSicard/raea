//! A composition's frames read from React in Bevy: the page's holders and 3D parts (read.rs, holders.rs), stepping to a
//! frame (settle.rs), the 3D drawn in an App (ScenePlugin in plugin.rs), and the native calls a
//! composition makes for its scene, physics and matchmove. raea-runtime-export renders the frames to files.

use std::path::{Path, PathBuf};

use bevy::prelude::*;
use serde_json::{Map, Value};

use crate::{ReactKind, ReactOutbox, ReactProps};
pub use raea_runtime_bundle::*;
pub use raea_core_scene::{Node3, hex_of, num, see_through};

/// A composition bundled (raea_runtime_bundle), its folder first named as where its models' calls read from
pub fn bundle_composition(tsx: &Path, out_js: &Path, o: &CompOpts, portable: Option<&Path>) -> R<()> {
    #[cfg(feature = "ml")]
    crate::native::ml::set_dir(tsx.parent().unwrap());
    raea_runtime_bundle::bundle_composition(tsx, out_js, o, portable)
}

pub use raea_runtime_scene::{LiveScene, Shot};
// `raea scene lint|explain|light` and the scene.* native calls (place() stands models on surfaces with scene.bounds),
// over raea-sys-contact and raea-sys-light-meter
mod contact;

mod read;
pub(crate) use read::*;
mod settle;
pub use settle::*;
mod holders;
pub use holders::*;
mod plugin;
pub use plugin::*;
pub(crate) use contact::register as register_scene;
// physics for compositions: rigid bodies (Rapier), parts cut from a glTF, goo (tools/goo): systems/bake, as native calls in scene/physics.rs
pub mod physics;
// matchmove: `track` and the matchmove.solve native call (scene/track.rs)
pub mod track;

thread_local! {
    /// each part's data-props as last parsed: its text and the props, and the scene it was last read in
    static PROPS3D: std::cell::RefCell<bevy::ecs::entity::EntityHashMap<(String, std::sync::Arc<Map<String, Value>>, u64)>> = std::cell::RefCell::new(Default::default());
    /// each part's data-3d and data-shape as last read, shared
    static NAMES3D: std::cell::RefCell<bevy::ecs::entity::EntityHashMap<(std::sync::Arc<str>, Option<std::sync::Arc<str>>)>> = std::cell::RefCell::new(Default::default());
    /// each part's data-at (an <Instances>' placements) as last read, shared while its text is the same (issue 84)
    static AT3D: std::cell::RefCell<bevy::ecs::entity::EntityHashMap<std::sync::Arc<str>>> = std::cell::RefCell::new(Default::default());
    /// scenes read (scene_of): what's in PROPS3D but not read in the last two is let go
    static SCENE3D: std::cell::Cell<u64> = const { std::cell::Cell::new(0) };
}
