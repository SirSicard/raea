// Three frames for Movie Maker, a box turning, so each frame differs.
import { BoxMesh, Camera3D, MeshInstance3D, Vector3, frame, type SceneTree } from "raea/godot";

export default async function (tree: SceneTree) {
  const box = new MeshInstance3D();
  box.mesh = new BoxMesh();
  tree.root!.add_child(box);
  const cam = new Camera3D();
  cam.position = new Vector3(0, 0, 3);
  tree.root!.add_child(cam);
  for (let i = 0; i < 3; i++) {
    box.rotation = new Vector3(0, i * 0.5, 0);
    await frame(tree);
  }
}
