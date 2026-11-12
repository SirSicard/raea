# raea/blender

Blender's Python API from TypeScript: `bpy`, `bmesh`, `mathutils`, `bpy_extras` and `gpu`, typed from Blender's own
API (Blender 5.2.1: 1809 structs, 2498 operators, 41 modules outside RNA), run against a real Blender. tsc catches
what Python only finds when it runs: a property that isn't there, an enum value Blender doesn't have, a read-only set.

```sh
raea setup blender                  # finds Blender (or says where to get it) and installs the live add-on
raea blender run sculpt.ts          # the script's default export, against a headless Blender raea starts
raea blender run edit.ts scene.blend --size 2      # a file to open; the rest is sys.argv after Blender's --
```

```ts
import { bpy, py, type Ptr, type types } from "raea/blender";

export default async function () {
  bpy.ops.wm.read_factory_settings({ use_empty: true });
  bpy.ops.mesh.primitive_monkey_add({ size: 2 });
  const ob = py.pin(bpy.context.active_object!);
  ob.modifiers.new("Smooth", "SUBSURF").levels = 2;          // a SubsurfModifier, as Python gives
  const m = bpy.data.materials.new("clay");
  const bsdf = m.node_tree!.nodes.new("ShaderNodeBsdfPrincipled");
  bsdf.inputs.$["Base Color"].default_value = [0.9, 0.35, 0.04, 1];
  (ob.data as Ptr<types.Mesh>).materials.append(m);
  ob.keyframe_insert({ data_path: "location", frame: 1 });
  console.log(`${await ob.name} has ${await py.len((ob.data as Ptr<types.Mesh>).vertices)} vertices`);
}
```

## How it reads

- **Names are Blender's.** `bpy.data.objects`, `primitive_cube_add`, `rotation_euler`: snake_case, as in Python.
- **A path is lazy.** `ob.location.x = 5` and calls are sent to Blender in order without waiting; `await` reads a
  value (`await ob.location` is a `Vector`). A batch stops at its first error, which the next `await` throws as a
  `BlenderError` with Python's type and message.
- **A path is read again each time it is used.** `bpy.context.active_object` follows whichever object is active, and
  `bpy.data.objects.$["Cube"]` stops finding the object once it is renamed. Python's variable holds the object;
  `py.pin(path)` does the same here (a stable handle, no round trip). What a call returns (`materials.new(...)`) is
  already a handle.
- **Keyword arguments** are a plain object as the last argument: `primitive_uv_sphere_add({ radius: 2 })`,
  `fcurve_ensure_for_datablock(ob, "location", { index: 1 })`, or every argument by keyword, as Python allows.
- **Items by name** go through `$`: `coll.$["Cube"]`, `node.inputs.$["Base Color"]`; `coll[0]` is by index, and
  `for await (const o of coll)` walks a collection.
- **Types.** `types` is bpy.types (`types.Mesh`), `Ptr<T>` a path to one. Where Python works it out at run time,
  TypeScript needs a cast: `ob.data as Ptr<types.Mesh>`. A call that makes a thing by its type returns that type's
  class: `lights.new("key", "AREA")` is an `AreaLight`, `nodes.new("ShaderNodeBsdfPrincipled")` that node, with its
  sockets typed by name.
- **mathutils** is computed in TypeScript with Blender's maths (`Vector`, `Matrix`, `Euler`, `Quaternion`, `Color`),
  so maths on read values needs no round trip.
- **Python itself:** `py.exec(code, vars)` runs source in Blender and gives back `result`; `py.module("addon_utils")`,
  `py.with(cm, body)` (temp_override), `py.dict`, `py.tuple`, `py.bytes`.

An enum whose items Blender works out at the time (Curve.fill_mode, which is NONE/BACK/FRONT/BOTH on a 2D curve) takes
its static items or any string: tools/itemf.sh reads which enums those are from Blender's own source (docs/blender.feature BL34).

## Where it runs

- `raea blender run` starts a headless Blender with raea's bridge (`python/headless.py`) and runs the script on
  raea's engine; Blender quits when the script ends.
- Under Bun or Node, the first use starts a headless Blender; `start()` makes more, `connect({ url, token })` joins a
  bridge, and `connect({ live: true })` (or `RAEA_BLENDER=live`) uses the person's own Blender with raea's add-on
  (`python/raea_blender`), batches running on its main thread.

## Files

- `src/`: the bridge (`session.ts`, `wire.ts`, `proxy.ts`, `py.ts`), launching (`launch.ts`, `blender.ts`),
  `mathutils/`, and `gen/` (generated: don't edit).
- `tools/gen.sh`: dumps Blender's API (`dump.py`, `refine.py`, run inside Blender) and writes `src/gen` (`tools/gen`).
- `python/`: the bridge Blender runs, headless and as an add-on.
- `test/`: `typing.ts` (tsc), `bridge.test.ts`, `mathutils.test.ts`, `rna.test.ts` (bun test, against Blender).

The spec is `docs/blender.feature` (BL22 on). Started from samchon/blendia (MIT) and rewritten; raea owns it.
