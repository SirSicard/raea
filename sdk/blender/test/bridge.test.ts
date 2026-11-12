// raea/blender against a real headless Blender (skipped where there's none): paths, writes, calls, operators,
// collections, buffers, errors as Python raises them, context managers and exec.
import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { BlenderError, findBlender, start, Vector, type Blender } from "../src";

const has = findBlender() !== null;
let b: Blender;
beforeAll(async () => {
  if (has) b = await start();
});
afterAll(async () => {
  await b?.close();
});

describe.skipIf(!has)("the bridge", () => {
  test("reads and writes properties, by path, with no round trip until awaited", async () => {
    const { bpy } = b;
    const cube = bpy.data.objects.$["Cube"];
    cube.location = [1, 2, 3];
    cube.location.x = 5;
    cube.name = "Box";
    expect(await bpy.data.objects.$["Box"].name).toBe("Box");
    const loc = await bpy.data.objects.$["Box"].location;
    expect(loc).toBeInstanceOf(Vector);
    expect([...loc]).toEqual([5, 2, 3]);
    expect(await bpy.data.objects.$["Box"].type).toBe("MESH");
    bpy.data.objects.$["Box"].name = "Cube";
  });

  test("a path assigned to a property is read in Blender", async () => {
    const { bpy } = b;
    const cube = bpy.data.objects.$["Cube"];
    cube.scale = [2, 3, 4];
    cube.location.z = cube.scale.y;
    expect(await cube.location.z).toBe(3);
    cube.scale = [1, 1, 1];
  });

  test("operators take keyword arguments and give their result set", async () => {
    const { bpy } = b;
    const r = await bpy.ops.mesh.primitive_uv_sphere_add({ radius: 2, location: [0, 0, 4] });
    expect(r).toEqual(new Set(["FINISHED"]));
    const ob = bpy.context.active_object;
    expect(await ob.name).toBe("Sphere");
    expect([...(await ob.location)]).toEqual([0, 0, 4]);
    expect(await bpy.ops.object.select_all.poll()).toBe(true);
  });

  test("calls give objects usable at once; awaited they stay the same object", async () => {
    const { bpy, py } = b;
    const me = bpy.data.meshes.new("tri");
    me.from_pydata([[0, 0, 0], [1, 0, 0], [0, 1, 0]], [], [[0, 1, 2]]);
    const tri = bpy.data.objects.new("Tri", me);
    bpy.context.collection.objects.link(tri);
    const pinned = await tri;
    expect((pinned as unknown as { then?: unknown }).then).toBeUndefined();
    pinned!.name = "Tri2";
    expect(await pinned!.name).toBe("Tri2");
    expect(await py.len(me.vertices)).toBe(3);
    const names: string[] = [];
    for await (const o of bpy.data.objects) names.push(await o.name);
    expect(names).toContain("Tri2");
  });

  test("foreach_get fills a typed array; foreach_set writes one", async () => {
    const { bpy } = b;
    const me = bpy.data.meshes.$["tri"];
    const co = new Float32Array(9);
    await me.vertices.foreach_get("co", co);
    expect([...co]).toEqual([0, 0, 0, 1, 0, 0, 0, 1, 0]);
    me.vertices.foreach_set("co", new Float32Array([0, 0, 1, 1, 0, 1, 0, 1, 1]));
    expect([...(await me.vertices[2].co)]).toEqual([0, 1, 1]);
  });

  test("custom properties through $", async () => {
    const { bpy } = b;
    const cube = bpy.data.objects.$["Cube"];
    cube.$["weight"] = 42;
    expect(await cube.$["weight"]).toBe(42);
    expect(await cube.keys()).toContain("weight");
    delete cube.$["weight"];
    expect(await cube.keys()).not.toContain("weight");
  });

  test("an error is Python's, at the await that reads it, and the session goes on", async () => {
    const { bpy, py } = b;
    let err: unknown;
    try {
      await bpy.data.objects.get("Nope").name;
    } catch (e) {
      err = e;
    }
    expect(err).toBeInstanceOf(BlenderError);
    expect((err as BlenderError).type).toBe("AttributeError");
    bpy.ops.object.mode_set({ mode: "NOPE" as "OBJECT" });
    await expect(py.flush()).rejects.toThrow(/TypeError/);
    expect(await py.len(bpy.data.objects)).toBeGreaterThan(0);
  });

  test("with: a context manager around a body (temp_override)", async () => {
    const { bpy, py } = b;
    const tri = bpy.data.objects.$["Tri2"];
    const inside = await py.with(bpy.context.temp_override({ active_object: tri }), async () => bpy.context.active_object.name);
    expect(inside).toBe("Tri2");
    expect(await bpy.context.active_object.name).not.toBe("Tri2");
  });

  test("exec runs Python for what a path can't say", async () => {
    const { bpy, py } = b;
    const n = await py.len(bpy.data.objects);
    expect(await py.exec<number>("len(bpy.data.objects) * 10")).toBe(n * 10);
    expect(await py.exec<number>("result = sum(range(x))", { x: 5 })).toBe(10);
  });

  test("a result collected while its batch is in Blender is still read (frees go after the ops queued before them)", async () => {
    // the call goes in one batch; the await queues its read for the next; the proxy, held by nothing after that, is
    // collected while Blender works, so its slot's free joins the read in that next batch (BL28: 1 run in 6 failed so)
    const results: Promise<number>[] = [];
    for (let i = 0; i < 3; i++) {
      results.push((async () => (await b.py.exec<number>(`import time\ntime.sleep(0.2)\nresult = ${i}`)) as number)());
      await Promise.resolve();
      (globalThis as { Bun?: { gc(full: boolean): void } }).Bun?.gc(true);
      await new Promise((ok) => setTimeout(ok, 50));
    }
    expect(await Promise.all(results)).toEqual([0, 1, 2]);
  });

  test("bmesh and mathutils.geometry run in Blender", async () => {
    const { bmesh, bpy, mathutils, py } = b;
    const bm = bmesh.new();
    bmesh.ops.create_cube(bm, { size: 2 });
    expect(await py.len(bm.verts)).toBe(8);
    bm.faces.ensure_lookup_table();
    const out = bmesh.ops.extrude_face_region(bm, { geom: [bm.faces[0]] });
    expect(await py.len(out.$["geom"])).toBeGreaterThan(0);
    const me = bpy.data.meshes.new("bm");
    bm.to_mesh(me);
    bm.free();
    expect(await py.len(me.vertices)).toBe(12);
    const hit = await mathutils.geometry.intersect_ray_tri([0, 0, 1], [1, 0, 1], [0, 1, 1], [0, 0, -1], [0.2, 0.2, 5]);
    expect([...(hit as Vector)].map((x) => Math.round(x * 1e6) / 1e6)).toEqual([0.2, 0.2, 1]);
  });
});
