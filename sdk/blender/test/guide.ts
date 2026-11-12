// The example in sdk/guides/craft/bevy/blender.md ("A step in TypeScript"), type-checked with the tests (tsc -p .)
import { bpy, py } from "raea/blender";

// blender/lowpoly.ts: raea blender run blender/lowpoly.ts IN.glb OUT.glb RATIO
export default async function () {
  const [src, out, ratio] = await py.exec<string[]>("import sys; result = sys.argv[sys.argv.index('--') + 1:]");
  if (!src || !out || !(Number(ratio) > 0)) throw new Error("usage: raea blender run blender/lowpoly.ts IN.glb OUT.glb RATIO");
  // the licence sidecar first: a source without one fails the run before anything is written
  const meta = await py.exec<{ steps?: object[] }>(
    `import json, os
side = next((p for p in (src + ".json", os.path.splitext(src)[0] + ".json") if os.path.exists(p)), None)
if side is None: raise FileNotFoundError("no licence sidecar beside " + src)
result = json.load(open(side))`,
    { src },
  );
  bpy.ops.wm.read_factory_settings({ use_empty: true });
  bpy.ops.import_scene.gltf({ filepath: src });
  for await (const ob of bpy.data.objects) {
    if ((await ob.type) !== "MESH") continue;
    const lod = ob.modifiers.new("lod", "DECIMATE"); // a DecimateModifier, typed as Python gives it
    lod.ratio = Number(ratio);
  }
  bpy.ops.export_scene.gltf({ filepath: out, export_apply: true });
  const steps = [...(meta.steps ?? []), { step: "lowpoly.ts", ratio: Number(ratio) }];
  await py.exec("import json; json.dump(meta, open(path, 'w'), indent=2)", { meta: { ...meta, steps }, path: `${out}.json` });
}
