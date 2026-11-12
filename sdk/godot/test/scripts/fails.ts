// A script that throws: raea godot run prints the error and exits 1.
import { Vector3 } from "godot";

export default function () {
  const v = new Vector3(1, 0, 0);
  if (v.length() === 1) throw new Error(`refused on purpose at ${v.x}`);
}
