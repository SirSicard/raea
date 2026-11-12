// BL22: the property types tools/cret.json reads from Blender's C source, against what Blender gives: every property
// it types on live bmesh, aud, imbuf and mathutils objects is read in Blender, and its value must be that Python type.
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

const PROBE = (cret: string) => `
import inspect, json, bmesh, aud, imbuf, mathutils
families = json.load(open(${JSON.stringify(cret)}))["families"]
PY = {"bool": (bool,), "int": (int,), "float": (float,), "str": (str,)}
def ok(t, v):
    if t.startswith("tuple["):
        items = [x.strip() for x in t[6:-1].split(",")]
        return isinstance(v, tuple) and len(v) == len(items) and all(ok(i, x) for i, x in zip(items, v))
    return isinstance(v, PY[t]) and not (t == "int" and isinstance(v, bool))
bm = bmesh.new()
a, b, c = (bm.verts.new(p) for p in ((0, 0, 0), (1, 0, 0), (0, 1, 0)))
e = bm.edges.new((a, b))
f = bm.faces.new((a, b, c))
dev = aud.Device()
sound = aud.Sound.sine(440)
seq = aud.Sequence()
live = {"bmesh": [bm, a, e, f, f.loops[0], bm.verts, bm.edges, bm.faces, bm.select_history],
        "aud": [dev, sound, seq, dev.play(sound), seq.add(sound, 0, 1, 0), aud.DynamicMusic(dev)],
        "generic": [imbuf.new((4, 4))],
        "mathutils": [mathutils.kdtree.KDTree(1),
                      mathutils.bvhtree.BVHTree.FromPolygons([(0, 0, 0), (1, 0, 0), (0, 1, 0)], [(0, 1, 2)])]}
result = []
for fam, objs in live.items():
    for o in objs:
        for name, t in families[fam]["getters"].items():
            if not inspect.isgetsetdescriptor(inspect.getattr_static(type(o), name, None)):
                continue
            v = getattr(o, name)
            result.append([fam, type(o).__name__, name, t, ok(t, v), repr(v)[:60]])
`;

describe.skipIf(!has)("C properties typed from Blender's source", () => {
  test("each reads as the Python type tools/cret.json gives it", async () => {
    const rows = await b.py.exec<[string, string, string, string, boolean, string][]>(PROBE(join(import.meta.dir, "../tools/cret.json")));
    const wrong = rows.filter((r) => !r[4]).map(([fam, cls, name, t, , v]) => `${fam} ${cls}.${name}: typed ${t}, Blender gives ${v}`);
    expect(wrong).toEqual([]);
    expect(rows.length).toBeGreaterThan(80);
  });
});
