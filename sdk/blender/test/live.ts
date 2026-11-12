// BL28, run by hand (it opens a Blender window, so `bun test` leaves it out):
//   bun test/live.ts SCRATCH_DIR      (RAEA_BIN: the raea to set up with; else raea on PATH)
// In SCRATCH_DIR, never the person's own preferences (BLENDER_USER_RESOURCES, RAEA_HOME): `raea setup blender` installs
// and enables raea's add-on; a Blender started with its window serves the bridge; a script with RAEA_BLENDER=live runs
// on its main thread in the 3D view; and once that Blender has quit, connect({ live: true }) refuses its live.json.
import { execFileSync, spawn } from "node:child_process";
import { mkdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { connect, findBlender } from "../src";

const dir = process.argv[2];
if (!dir) throw new Error("usage: bun test/live.ts SCRATCH_DIR");
const S = resolve(dir);
mkdirSync(S, { recursive: true });
const env = { ...process.env, BLENDER_USER_RESOURCES: `${S}/blender`, RAEA_HOME: `${S}/raea`, RAEA_BLENDER: "live" };
Object.assign(process.env, env);
const bin = findBlender()?.path;
if (!bin) throw new Error("no Blender: raea setup blender finds or downloads one");

const setup = execFileSync(process.env.RAEA_BIN ?? "raea", ["setup", "blender"], { env, encoding: "utf8" });
console.log(setup.trim());
if (!/raea's add-on (installed now|enabled)/.test(setup)) throw new Error("raea setup blender didn't install raea's add-on");

const blender = spawn(bin, [], { env, stdio: ["ignore", "pipe", "pipe"] });
const fail = (why: string): never => {
  blender.kill("SIGKILL");
  console.log(`FAIL ${why}`);
  process.exit(1);
};
await new Promise<void>((ok, no) => {
  let out = "";
  blender.stdout.on("data", (d) => {
    out += d;
    if (out.includes("RAEA_BLENDER_READY")) ok();
  });
  blender.on("exit", (c) => no(new Error(`Blender exited (${c}) before the add-on served:\n${out}`)));
});
const live = JSON.parse(readFileSync(`${S}/raea/blender/live.json`, "utf8")) as { port: number; pid: number; blender: string };
if (live.pid !== blender.pid) fail(`live.json names pid ${live.pid}, Blender is ${blender.pid}`);

// the script's own bpy and py: RAEA_BLENDER=live is read on first use
const { bpy, py } = await import("../src");
const [main, background, area] = await py.exec<[boolean, boolean, string | null]>(
  "import threading\nresult = [threading.current_thread() is threading.main_thread(), bpy.app.background, bpy.context.area.type if bpy.context.area else None]",
);
console.log(`batch: main thread ${main}, background ${background}, area ${area}`);
if (!main || background || area !== "VIEW_3D") fail("a batch didn't run on the UI's main thread in the 3D view");

const made = await bpy.ops.mesh.primitive_cube_add({ size: 2, location: [0, 0, 1] });
const ob = (await bpy.context.active_object)!;
ob.location.x = 3;
const x = await ob.location.x;
await bpy.ops.object.mode_set({ mode: "EDIT" });
const mode = await ob.mode;
await bpy.ops.object.mode_set({ mode: "OBJECT" });
const snapped = await bpy.ops.view3d.snap_cursor_to_center();
console.log(`cube: x=${x}, mode ${mode}, view3d.snap_cursor_to_center ${[...snapped]}`);
if (!made.has("FINISHED") || x !== 3 || mode !== "EDIT" || !snapped.has("FINISHED")) fail("the typed API didn't act on the live Blender");

const b = await connect({ live: true });
const n = await b.py.len(b.bpy.data.objects);
await b.close();
if (n < 4) fail(`connect({ live: true }) saw ${n} objects, not the same Blender`);

blender.kill("SIGKILL");
await new Promise((ok) => blender.on("exit", ok));
const stale = await connect({ live: true }).then(() => "connected", (e: Error) => e.message);
if (stale === "connected") fail("connect({ live: true }) reached a Blender that had quit");
console.log(`PASS BL28 (Blender ${live.blender}): batches on the main thread in the 3D view; a quit Blender's live.json refused`);
process.exit(0);
