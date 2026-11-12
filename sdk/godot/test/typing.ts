// Type-level checks of raea/godot (tsc -p sdk/godot), never run: what a script writes against Godot's API type-checks,
// and what Godot would reject (a missing class or member, a wrong argument type) doesn't.
import { BoxMesh, Engine, MeshInstance3D, Node3D, ResourceLoader, Vector3, frame, type Main, type SceneTree } from "raea/godot";
import { Label } from "godot";

export const main: Main = async (tree: SceneTree, args: string[]) => {
  const box = new MeshInstance3D();
  box.mesh = new BoxMesh();
  box.position = new Vector3(1, 2, 3);
  const length: number = box.position.length();
  const name: string = args[0] ?? String(box.get_name());
  tree.root!.add_child(box);
  const parent: Node3D = new Node3D();
  parent.add_child(new Label());
  const version = Engine.get_version_info();
  const res = ResourceLoader.load("res://icon.svg");
  await frame(tree);
  void [length, name, version, res];

  // @ts-expect-error: no such class
  new MeshInstance4D();
  // @ts-expect-error: no such member
  box.not_a_member();
  // @ts-expect-error: a Vector3 needs numbers
  new Vector3("1", 2, 3);
  // @ts-expect-error: add_child takes a Node
  tree.root!.add_child(new Vector3());
};
