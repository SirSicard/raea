// A SceneTree subclass as the default export is Godot's main loop as it is: it quits itself, with its own code.
import { SceneTree } from "godot";

export default class Loop extends SceneTree {
  frames = 0;
  _process(_delta: number): boolean {
    this.frames++;
    if (this.frames === 3) {
      console.log(`PASS own loop after ${this.frames} frames`);
      this.quit(7);
    }
    return false;
  }
}
