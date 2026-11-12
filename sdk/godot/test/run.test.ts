// `raea godot run` against the GodotJS raea setup godot installed (docs/godot.feature GD5-GD7); skipped without it.
// RAEA_BIN names the raea to run (default: the checkout's target/release/raea).
import { describe, expect, test } from "bun:test";
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const raea = process.env.RAEA_BIN ?? join(import.meta.dir, "../../../target/release/raea");
const has = existsSync(raea) && Bun.spawnSync([raea, "setup", "godot", "--check"]).exitCode === 0;
const run = (script: string, ...args: string[]) => {
  const p = Bun.spawnSync([raea, "godot", "run", join(import.meta.dir, "scripts", script), "--timeout", "60", ...args]);
  return { code: p.exitCode, out: p.stdout.toString(), err: p.stderr.toString() };
};

describe.skipIf(!has)("raea godot run", () => {
  test("a scene built in TypeScript, frames awaited, ARGS passed", () => {
    const r = run("smoke.ts", "alpha", "--beta");
    expect(r.code).toBe(0);
    expect(r.out).toContain("PASS raea/godot: 3 boxes, the last 4.000 m out, in Godot 4.6.1");
    expect(r.out).toContain("(args alpha --beta)");
    // the exit noise is gone
    expect(r.out + r.err).not.toContain("variant pool leaked");
    expect(r.out).not.toContain("[JS]");
  });
  test("a throw is printed and exits 1", () => {
    const r = run("fails.ts");
    expect(r.code).toBe(1);
    expect(r.out + r.err).toContain("refused on purpose at 1");
  });
  test("a SceneTree class is the main loop as it is", () => {
    const r = run("loop.ts");
    expect(r.out).toContain("PASS own loop after 3 frames");
    expect(r.out + r.err).toContain("exit 7");
  });
  test("--timeout stops Godot", () => {
    const p = Bun.spawnSync([raea, "godot", "run", join(import.meta.dir, "scripts", "loop.ts"), "--timeout", "0.01"]);
    expect(p.exitCode).not.toBe(0);
  });
  test("a callback that throws stops the run, its error printed", () => {
    const t = Date.now();
    const r = run("throws.ts");
    expect(r.code).toBe(1);
    expect(r.out + r.err).toContain("thrown on purpose in _process");
    expect(r.out + r.err).toContain("threw (above); Godot was stopped");
    expect(Date.now() - t).toBeLessThan(30_000);
  });
  test("resolve() names a path where raea ran", () => {
    const p = Bun.spawnSync([raea, "godot", "run", join(import.meta.dir, "scripts", "paths.ts"), "--timeout", "60"], { cwd: join(import.meta.dir, "scripts") });
    expect(p.exitCode).toBe(0);
    expect(p.stdout.toString()).toContain("PASS paths: read");
  });
  test("--movie records --size frames, each drawn", () => {
    const dir = mkdtempSync(join(tmpdir(), "raea-godot-movie-"));
    const r = run("movie.ts", "--movie", join(dir, "f.png"), "--size", "320x180");
    expect(r.code).toBe(0);
    const frames = readdirSync(dir).filter((f) => f.endsWith(".png")).sort();
    expect(frames.length).toBeGreaterThanOrEqual(3);
    const png = readFileSync(join(dir, frames[0]));
    // a PNG's IHDR: width and height, big-endian, at bytes 16 and 20
    expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual([320, 180]);
    // the box turned: frames 0 and 2 differ (a covered window would repeat one)
    expect(readFileSync(join(dir, frames[2])).equals(png)).toBe(false);
    rmSync(dir, { recursive: true, force: true });
  });
});
