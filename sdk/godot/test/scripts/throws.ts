// A main loop whose _process throws on its 2nd frame: Godot alone would log it and keep going; raea stops the run.
import { SceneTree } from "godot";

export default class Throws extends SceneTree {
  n = 0;
  _process(_delta: number): boolean {
    if (++this.n === 2) throw new Error("thrown on purpose in _process");
    return false;
  }
}
