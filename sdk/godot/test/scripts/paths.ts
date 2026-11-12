// resolve() names a path where raea ran, though Godot runs in the project's folder.
import { FileAccess, cwd, resolve } from "raea/godot";

export default function () {
  const f = FileAccess.open(resolve("paths.ts"), FileAccess.ModeFlags.READ);
  if (!f) throw new Error(`no paths.ts at ${resolve("paths.ts")} (cwd ${cwd()})`);
  console.log(`PASS paths: read ${f.get_length()} bytes of paths.ts from ${cwd()}`);
}
