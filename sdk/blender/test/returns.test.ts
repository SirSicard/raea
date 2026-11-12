// BL22: what tools/returns.py reads from a Python function's own source (the type dump.py gives a function or property
// written in Python that its docstring doesn't type), against small cases and against what Blender gives: every
// Python property and query it types on live meshes, bone collections and Cycles' preferences is read in Blender, and
// its value must be that Python type.
import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { join } from "node:path";
import { findBlender, start, type Blender } from "../src";

const has = findBlender() !== null;
let b: Blender;
beforeAll(async () => {
  if (has) b = await start();
});
afterAll(async () => {
  await b?.close();
});

const TOOLS = join(import.meta.dir, "../tools");
const READER = `
import sys
sys.path.insert(0, ${JSON.stringify(TOOLS)})
from returns import returns
`;

// source -> what the reader gives (null: it can't tell, so gen leaves any)
const CASES: [string, string | null][] = [
  ["def f(x):\n    return x > 1\n", "bool"],
  ["def f(x):\n    if x:\n        return 'a'\n", "str | None"],
  ["def f(x):\n    if x:\n        return 'a'\n    else:\n        return f'{x}'\n", "str"],
  ["def f(x):\n    return x\n", null],
  ["def f():\n    out = []\n    out.append(1)\n    return out\n", "list"],
  ["def f():\n    n = 0\n    for i in range(3):\n        n += 1\n    return n\n", "int"],
  ["def f():\n    def g():\n        return 1\n    print(g())\n", "None"],
  ["def f():\n    yield 1\n", null],
  ["def f(a):\n    return (a, 1)\n", "tuple"],
  ["def f():\n    return (1, 'a')\n", "tuple[int, str]"],
  ["def f():\n    return ', '.join(['a'])\n", "str"],
  ["def f(len):\n    return len(3)\n", null],
  ["def f(x):\n    while True:\n        if x:\n            return 1\n", "int"],
  ["def f(x):\n    try:\n        return 1\n    except Exception:\n        return None\n", "int | None"],
  ["def f(x):\n    a, b = x\n    return a\n", null],
  ["def f():\n    x = 1\n    x = 'a'\n    return x\n", null],
  ["def f():\n    return 1 / 2\n", "float"],
  ["import functools\n@functools.cache\ndef f():\n    return 1\n", null],
];

const LIVE = `${READER}
import bpy, inspect
PY = {"bool": bool, "int": int, "float": float, "str": str, "bytes": bytes, "list": list, "tuple": tuple, "dict": dict, "set": set}
def ok(t, v):
    alts = [a.strip() for a in t.split(" | ")]
    if len(alts) > 1:
        return any(ok(a, v) for a in alts)
    if t == "None":
        return v is None
    kind, _, inner = t.partition("[")
    if not isinstance(v, PY[kind]) or (kind == "int" and isinstance(v, bool)):
        return False
    if not inner:
        return True
    items = [x.strip() for x in inner[:-1].split(",")]
    if kind == "tuple":
        return len(v) == len(items) and all(ok(i, x) for i, x in zip(items, v))
    return all(ok(items[0], x) for x in v)
me = bpy.data.meshes.new("returns-probe")
me.from_pydata([(0, 0, 0), (1, 0, 0), (1, 1, 0), (0, 1, 0)], [], [(0, 1, 2, 3)])
me.calc_loop_triangles()
arm = bpy.data.armatures.new("returns-probe")
bones = arm.collections.new("c")
cycles = bpy.context.preferences.addons["cycles"].preferences
live = [me, me.polygons[0], me.loop_triangles[0], me.edges[0], bones]
result = []
for o in live:
    for name, a in vars(type(o)).items():
        t = returns(a.fget) if isinstance(a, property) and a.fget else None
        if t:
            result.append([type(o).__name__, name, t, ok(t, getattr(o, name)), repr(getattr(o, name))[:60]])
# queries: no arguments past self, nothing set
for name in ("has_active_device", "has_multi_device", "get_num_gpu_devices", "default_device"):
    f = getattr(type(cycles), name)
    t = returns(getattr(f, "__func__", f))
    v = getattr(cycles, name)()
    result.append(["CyclesPreferences", name, t or "?", bool(t) and ok(t, v), repr(v)[:60]])
bpy.data.meshes.remove(me)
bpy.data.armatures.remove(arm)
`;

describe.skipIf(!has)("Python members typed from their own source", () => {
  test("the reader types what a source shows and leaves the rest", async () => {
    const got = await b.py.exec<(string | null)[]>(
      `${READER}
import linecache
def read(i, src):
    name = "<returns case %d>" % i
    linecache.cache[name] = (len(src), None, src.splitlines(True), name)
    ns = {}
    exec(compile(src, name, "exec"), ns)
    return returns(ns["f"])
result = [read(i, s) for i, s in enumerate(cases)]`,
      { cases: CASES.map((c) => c[0]) },
    );
    expect(got).toEqual(CASES.map((c) => c[1]));
  });

  test("each typed member reads as that Python type in Blender", async () => {
    const rows = await b.py.exec<[string, string, string, boolean, string][]>(LIVE);
    const wrong = rows.filter((r) => !r[3]).map(([cls, name, t, , v]) => `${cls}.${name}: typed ${t}, Blender gives ${v}`);
    expect(wrong).toEqual([]);
    expect(rows.map((r) => `${r[0]}.${r[1]}`)).toEqual(
      expect.arrayContaining(["Mesh.edge_keys", "MeshPolygon.edge_keys", "MeshLoopTriangle.edge_keys", "BoneCollection.bones_recursive", "CyclesPreferences.has_active_device"]),
    );
  });
});
