// mathutils parity: each operation on seeded random inputs, computed here (src/mathutils) and in Blender's own
// mathutils, must agree. One exec evaluates every Python expression, so the run is one round trip.
import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { Color, Euler, findBlender, Matrix, Quaternion, start, Vector, type Blender } from "../src";

const has = findBlender() !== null;
let b: Blender;
beforeAll(async () => {
  if (has) b = await start();
});
afterAll(async () => {
  await b?.close();
});

/** mulberry32: the same inputs every run */
function rng(seed: number): () => number {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const py = (v: unknown): string => (Array.isArray(v) ? `(${v.map(py).join(", ")}${v.length === 1 ? "," : ""})` : typeof v === "string" ? `'${v}'` : String(v));
const ORDERS = ["XYZ", "XZY", "YXZ", "YZX", "ZXY", "ZYX"] as const;
type Case = [name: string, python: string, local: () => unknown];

function cases(r: () => number): Case[] {
  const n = () => Math.round((r() * 4 - 2) * 1e4) / 1e4;
  const v3 = () => [n(), n(), n()];
  const ang = () => Math.round((r() * 6 - 3) * 1e4) / 1e4;
  const ord = ORDERS[Math.floor(r() * 6)];
  const a = v3(), c = v3(), e = v3(), s = [r() + 0.5, r() + 0.5, r() + 0.5].map((x) => Math.round(x * 1e4) / 1e4);
  const q = [n(), n(), n(), n()], t = Math.round(r() * 1e4) / 1e4, angle = ang(), sh = n();
  const lrs = `Matrix.LocRotScale(Vector(${py(a)}), Euler(${py(e)}, '${ord}'), Vector(${py(s)}))`;
  const LRS = () => Matrix.LocRotScale(new Vector(a), new Euler(e, ord), new Vector(s));
  const m = (f: (x: Matrix) => unknown) => f(LRS());
  const mut = <T>(x: T, f: (x: T) => void) => (f(x), x);
  return [
    ["vector.normalized", `Vector(${py(a)}).normalized()`, () => new Vector(a).normalized()],
    ["vector.cross", `Vector(${py(a)}).cross(Vector(${py(c)}))`, () => new Vector(a).cross(new Vector(c))],
    ["vector.dot", `Vector(${py(a)}).dot(Vector(${py(c)}))`, () => new Vector(a).dot(new Vector(c))],
    ["vector.angle", `Vector(${py(a)}).angle(Vector(${py(c)}))`, () => new Vector(a).angle(new Vector(c))],
    ["vector.angle_signed", `Vector(${py(a.slice(0, 2))}).angle_signed(Vector(${py(c.slice(0, 2))}))`, () => new Vector(a.slice(0, 2)).angle_signed(new Vector(c.slice(0, 2)))],
    ["vector.project", `Vector(${py(a)}).project(Vector(${py(c)}))`, () => new Vector(a).project(new Vector(c))],
    ["vector.reflect", `Vector(${py(a)}).reflect(Vector(${py(c)}))`, () => new Vector(a).reflect(new Vector(c))],
    ["vector.lerp", `Vector(${py(a)}).lerp(Vector(${py(c)}), ${t})`, () => new Vector(a).lerp(new Vector(c), t)],
    ["vector.slerp", `Vector(${py(a)}).slerp(Vector(${py(c)}), ${t}, None)`, () => new Vector(a).slerp(new Vector(c), t, null)],
    ["vector.orthogonal", `Vector(${py(a)}).orthogonal()`, () => new Vector(a).orthogonal()],
    ["vector.rotation_difference", `Vector(${py(a)}).rotation_difference(Vector(${py(c)}))`, () => new Vector(a).rotation_difference(new Vector(c))],
    ["vector.to_track_quat", `Vector(${py(a)}).to_track_quat('-Z', 'Y')`, () => new Vector(a).to_track_quat("-Z", "Y")],
    ["vector.to_4d", `Vector(${py(a)}).to_4d()`, () => new Vector(a).to_4d()],
    ["vector.length", `Vector(${py(a)}).length`, () => new Vector(a).length],
    ["vector.zyx", `Vector(${py(a)}).zyx`, () => new Vector(a).zyx],
    ["vector.rotate", `(lambda v: (v.rotate(Euler(${py(e)}, '${ord}')), v)[1])(Vector(${py(a)}))`, () => mut(new Vector(a), (v) => v.rotate(new Euler(e, ord)))],
    ["vector @ matrix", `Vector(${py(a)}) @ ${lrs}.to_3x3()`, () => new Vector(a).matmul(LRS().to_3x3())],
    ["matrix @ vector", `${lrs} @ Vector(${py(a)})`, () => LRS().matmul(new Vector(a))],
    ["matrix.inverted", `${lrs}.inverted()`, () => m((x) => x.inverted())],
    ["matrix.transposed", `${lrs}.transposed()`, () => m((x) => x.transposed())],
    ["matrix.determinant", `${lrs}.determinant()`, () => m((x) => x.determinant())],
    ["matrix.adjugated", `${lrs}.adjugated()`, () => m((x) => x.adjugated())],
    ["matrix.normalized", `${lrs}.normalized()`, () => m((x) => x.normalized())],
    ["matrix.to_euler", `${lrs}.to_euler('${ord}')`, () => m((x) => x.to_euler(ord))],
    ["matrix.to_euler compat", `${lrs}.to_euler('XYZ', Euler((3.0, -3.0, 6.0)))`, () => m((x) => x.to_euler("XYZ", new Euler([3, -3, 6])))],
    ["matrix.to_quaternion", `${lrs}.to_quaternion()`, () => m((x) => x.to_quaternion())],
    ["matrix.to_scale", `${lrs}.to_scale()`, () => m((x) => x.to_scale())],
    ["matrix.decompose", `${lrs}.decompose()`, () => m((x) => x.decompose())],
    ["matrix.lerp", `${lrs}.lerp(Matrix.Rotation(${angle}, 4, 'Z'), ${t})`, () => m((x) => x.lerp(Matrix.Rotation(angle, 4, "Z"), t))],
    ["matrix @ matrix", `${lrs} @ Matrix.Rotation(${angle}, 4, Vector(${py(c)}))`, () => m((x) => x.matmul(Matrix.Rotation(angle, 4, new Vector(c))))],
    ["matrix.median_scale", `${lrs}.median_scale`, () => m((x) => x.median_scale)],
    ["matrix.Shear", `Matrix.Shear('XY', 3, (${t}, ${sh}))`, () => Matrix.Shear("XY", 3, [t, sh])],
    ["matrix.OrthoProjection", `Matrix.OrthoProjection(Vector(${py(a)}), 4)`, () => Matrix.OrthoProjection(new Vector(a), 4)],
    ["matrix.Scale axis", `Matrix.Scale(${t + 0.5}, 4, Vector(${py(c)}))`, () => Matrix.Scale(t + 0.5, 4, new Vector(c))],
    ["quaternion.to_euler", `Quaternion(${py(q)}).normalized().to_euler('${ord}')`, () => new Quaternion(q).normalized().to_euler(ord)],
    ["quaternion.to_matrix", `Quaternion(${py(q)}).to_matrix()`, () => new Quaternion(q).to_matrix()],
    ["quaternion.to_axis_angle", `Quaternion(${py(q)}).to_axis_angle()`, () => new Quaternion(q).to_axis_angle()],
    ["quaternion.to_swing_twist", `Quaternion(${py(q)}).normalized().to_swing_twist('Y')`, () => new Quaternion(q).normalized().to_swing_twist("Y")],
    ["quaternion.to_exponential_map", `Quaternion(${py(q)}).normalized().to_exponential_map()`, () => new Quaternion(q).normalized().to_exponential_map()],
    ["quaternion.slerp", `Quaternion(${py(q)}).normalized().slerp(Euler(${py(e)}).to_quaternion(), ${t})`, () => new Quaternion(q).normalized().slerp(new Euler(e).to_quaternion(), t)],
    ["quaternion.rotation_difference", `Quaternion(${py(q)}).normalized().rotation_difference(Euler(${py(e)}).to_quaternion())`, () => new Quaternion(q).normalized().rotation_difference(new Euler(e).to_quaternion())],
    ["quaternion @ vector", `Quaternion(${py(q)}) @ Vector(${py(a)})`, () => new Quaternion(q).matmul(new Vector(a))],
    ["quaternion @ quaternion", `Quaternion(${py(q)}) @ Euler(${py(e)}).to_quaternion()`, () => new Quaternion(q).matmul(new Euler(e).to_quaternion())],
    ["quaternion.inverted", `Quaternion(${py(q)}).inverted()`, () => new Quaternion(q).inverted()],
    ["quaternion.cross", `Quaternion(${py(q)}).cross(Quaternion(${py([...a, t])}))`, () => new Quaternion(q).cross(new Quaternion([...a, t]))],
    ["quaternion axis angle", `Quaternion(Vector(${py(a)}), ${angle})`, () => new Quaternion(new Vector(a), angle)],
    ["quaternion exp map", `Quaternion(${py(a)})`, () => new Quaternion(a)],
    ["quaternion.angle", `Quaternion(${py(q)}).normalized().angle`, () => new Quaternion(q).normalized().angle],
    ["euler.to_matrix", `Euler(${py(e)}, '${ord}').to_matrix()`, () => new Euler(e, ord).to_matrix()],
    ["euler.to_quaternion", `Euler(${py(e)}, '${ord}').to_quaternion()`, () => new Euler(e, ord).to_quaternion()],
    ["euler.rotate_axis", `(lambda x: (x.rotate_axis('Y', ${angle}), x)[1])(Euler(${py(e)}, '${ord}'))`, () => mut(new Euler(e, ord), (x) => x.rotate_axis("Y", angle))],
    ["euler.make_compatible", `(lambda x: (x.make_compatible(Euler((6.0, -6.0, 12.0))), x)[1])(Euler(${py(e)}))`, () => mut(new Euler(e), (x) => x.make_compatible(new Euler([6, -6, 12])))],
    ["euler.rotate", `(lambda x: (x.rotate(Quaternion(${py(q)}).normalized()), x)[1])(Euler(${py(e)}, '${ord}'))`, () => mut(new Euler(e, ord), (x) => x.rotate(new Quaternion(q).normalized()))],
    ["color.hsv", `Color(${py(s.map((x) => x / 2))}).hsv`, () => new Color(s.map((x) => x / 2)).hsv],
    ["color.to_srgb", `Color(${py(s.map((x) => x / 2))}).from_scene_linear_to_srgb()`, () => new Color(s.map((x) => x / 2)).from_scene_linear_to_srgb()],
    ["color.from_srgb", `Color(${py(s.map((x) => x / 2))}).from_srgb_to_scene_linear()`, () => new Color(s.map((x) => x / 2)).from_srgb_to_scene_linear()],
    ["color.to_xyz", `Color(${py(s.map((x) => x / 2))}).from_scene_linear_to_xyz_d65()`, () => new Color(s.map((x) => x / 2)).from_scene_linear_to_xyz_d65()],
  ];
}

/** A value as plain data to compare: a mathutils value is its class and components. */
function plain(x: unknown): unknown {
  if (x instanceof Matrix) return { Matrix: x.toJSON() };
  if (x instanceof Euler) return { Euler: [...x], order: x.order };
  if (x instanceof Vector || x instanceof Quaternion || x instanceof Color) return { [x.constructor.name]: [...x] };
  if (Array.isArray(x)) return x.map(plain);
  return x;
}
/** Where two values differ beyond rounding (tol, relative for large values), or null. */
function differ(a: unknown, b: unknown, path = "", tol = 1e-5): string | null {
  if (typeof a === "number" && typeof b === "number") return Math.abs(a - b) <= tol * Math.max(1, Math.abs(a)) ? null : `${path}: ${a} vs ${b}`;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return `${path}: length ${a.length} vs ${b.length}`;
    for (let i = 0; i < a.length; i++) {
      const d = differ(a[i], b[i], `${path}[${i}]`, tol);
      if (d) return d;
    }
    return null;
  }
  if (a && b && typeof a === "object" && typeof b === "object") {
    const ka = Object.keys(a).sort().join(), kb = Object.keys(b).sort().join();
    if (ka !== kb) return `${path}: ${ka} vs ${kb}`;
    for (const k of Object.keys(a)) {
      const d = differ((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k], `${path}.${k}`, tol);
      if (d) return d;
    }
    return null;
  }
  return a === b ? null : `${path}: ${JSON.stringify(a)} vs ${JSON.stringify(b)}`;
}

describe.skipIf(!has)("mathutils parity with Blender", () => {
  test("every operation, on 25 seeded random inputs each, agrees with Blender's", async () => {
    const all: Case[] = [];
    for (let seed = 1; seed <= 25; seed++) all.push(...cases(rng(seed)));
    const code = "from mathutils import *\nresult = []\nfor e in exprs:\n    try:\n        result.append(['ok', eval(e)])\n    except Exception as x:\n        result.append(['err', type(x).__name__ + ': ' + str(x)])";
    const theirs = await b.py.exec<[string, unknown][]>(code, { exprs: all.map(([, p]) => p) });
    const fails: string[] = [];
    all.forEach(([name, python, local], i) => {
      const [status, value] = theirs[i];
      let mine: unknown, err: string | null = null;
      try {
        mine = local();
      } catch (e) {
        err = String(e);
      }
      if (status === "err" || err) {
        if (!(status === "err" && err)) fails.push(`${name}: Blender ${status === "err" ? value : "ok"}, here ${err ?? "ok"} (${python})`);
        return;
      }
      // Blender converts colours through OpenColorIO, whose processor differs from the exact sRGB curve by ~1e-4
      const d = differ(plain(mine), plain(value), "", name.startsWith("color.to_srgb") || name.startsWith("color.from_srgb") ? 2e-4 : 1e-5);
      if (d) fails.push(`${name}${d} (${python})`);
    });
    expect(fails.slice(0, 20)).toEqual([]);
    expect(all.length).toBeGreaterThan(1000);
  });
});
