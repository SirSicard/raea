// The example in sdk/guides/craft/bevy/godot.md ("Footage from Godot"), type-checked with the tests (tsc -p .)
// turn.ts: raea godot run turn.ts --movie media/turn/f.png --size 1280x720 (media/turn/f00000000.png is frame 0)
import { BoxMesh, Camera3D, DirectionalLight3D, MeshInstance3D, SceneTree, Vector3 } from "raea/godot";

const FRAMES = 90;

export default class Turn extends SceneTree {
  f = 0;
  box!: MeshInstance3D;

  _initialize(): void {
    this.box = new MeshInstance3D();
    this.box.mesh = new BoxMesh();
    this.root!.add_child(this.box);
    const cam = new Camera3D();
    cam.position = new Vector3(0, 1.2, 3);
    cam.rotation = new Vector3(-0.38, 0, 0);
    this.root!.add_child(cam);
    const sun = new DirectionalLight3D();
    sun.rotation = new Vector3(-0.9, 0.5, 0);
    this.root!.add_child(sun);
  }

  // called before Godot draws each frame: frame f's state comes from f alone, so a frame always looks the same
  _process(_delta: number): boolean {
    this.box.rotation = new Vector3(0, (this.f / FRAMES) * Math.PI * 2, 0);
    if (++this.f === FRAMES) this.quit(0);
    return false;
  }
}
