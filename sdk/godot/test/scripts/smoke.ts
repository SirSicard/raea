// raea godot run's smoke: a scene built from TypeScript, a frame awaited, a value Godot computes, one PASS line.
import { BoxMesh, Engine, MeshInstance3D, Node3D, Vector3, frames, type SceneTree } from "raea/godot";

export default async function (tree: SceneTree, args: string[]) {
  const root = new Node3D();
  root.set_name("Stage");
  tree.root!.add_child(root);
  for (let i = 0; i < 3; i++) {
    const box = new MeshInstance3D();
    box.mesh = new BoxMesh();
    box.position = new Vector3(i * 2, 0, 0);
    root.add_child(box);
  }
  await frames(tree, 2);
  const far = (root.get_child(2) as MeshInstance3D).global_position.length();
  const v = Engine.get_version_info().get("string");
  console.log(`PASS raea/godot: ${root.get_child_count()} boxes, the last ${far.toFixed(3)} m out, in Godot ${v}${args.length ? ` (args ${args.join(" ")})` : ""}`);
}
