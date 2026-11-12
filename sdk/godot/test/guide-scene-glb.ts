// The script in sdk/guides/craft/bevy/godot-projects.md ("Example"), type-checked with the tests (tsc -p .)
// godot/scene-glb.ts: one scene (or mesh resource) of a Godot project as one .glb
//   raea godot run godot/scene-glb.ts --project KIT res://objects/platform.tscn media/platform.glb
import { AnimationMixer, Camera3D, GLTFDocument, GLTFState, Light3D, Mesh, MeshInstance3D, Node, PackedScene, ResourceLoader, resolve, type SceneTree } from "raea/godot";

// the scene's cameras and lights stay behind: in raea those are the TSX's
function strip(node: Node) {
  for (const child of node.get_children()) {
    if (child instanceof Camera3D || child instanceof Light3D) {
      node.remove_child(child);
      child.free();
    } else strip(child);
  }
}

// a clip that moved a camera or light now points at nothing, which glTF's export reports as an error: drop those tracks
function prune(node: Node) {
  if (node instanceof AnimationMixer) {
    const base = node.get_node_or_null(node.root_node);
    const names = node.get_animation_list();
    for (let n = 0; n < names.size(); n++) {
      const clip = node.get_animation(names.get(n));
      for (let i = (clip?.get_track_count() ?? 0) - 1; i >= 0; i--)
        if (!base?.get_node_or_null(clip!.track_get_path(i))) clip!.remove_track(i);
    }
  }
  for (const child of node.get_children()) prune(child);
}

export default async function (_tree: SceneTree, [from, out]: string[]) {
  if (!from || !out) throw new Error("usage: raea godot run godot/scene-glb.ts --project DIR res://SCENE.tscn OUT.glb");
  const res = ResourceLoader.load(from);
  if (!res) throw new Error(`${from}: Godot can't load it`);
  let root: Node;
  if (res instanceof PackedScene) root = res.instantiate()!; // never added to the tree, so its scripts don't run
  else if (res instanceof Mesh) {
    const one = new MeshInstance3D();
    one.mesh = res;
    root = one;
  } else throw new Error(`${from}: a ${res.get_class()}, not a scene or a mesh`);
  strip(root);
  prune(root);
  const doc = new GLTFDocument();
  const state = new GLTFState();
  let err = doc.append_from_scene(root, state);
  if (err === 0) err = doc.write_to_filesystem(state, resolve(out));
  root.free();
  if (err !== 0) throw new Error(`${from}: glTF export failed (Godot error ${err})`);
  console.log(`wrote ${out}`);
}
