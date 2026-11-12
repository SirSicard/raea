//! A composition's 3D for other tools, and back (docs/blender.feature BL37-BL39, docs/godot.feature GD12-GD13):
//! `raea scene export` writes the parts of a frame (or a span) as scene.json with their meshes and models; godot.rs
//! makes that folder a Godot project; back.rs compares scene.json with what Blender or Godot holds after a person
//! changed it there, as edits to the TSX at their lines. apps/engines runs Blender and Godot for these verbs.

/// `raea scene export`: scene.json, meshes/, models/
pub mod export;
/// scene export's folder as a Godot project: project.godot, main.tscn
pub mod godot;
/// what changed in Blender or Godot, as edits to the TSX
pub mod back;

type R<T> = Result<T, String>;
