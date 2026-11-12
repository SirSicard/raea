// The generated types against what Blender gives: every float array property on the data a fresh file has (objects,
// their data, the scene, render settings, world, materials and their nodes) is read in Blender, and its Python type
// must be the one tools/gen/rna.ts's mathOf typed it as (Vector, Matrix, Euler, Quaternion, Color, or a plain array).
import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { mathOf } from "../tools/gen/rna";
import { findBlender, start, type Blender } from "../src";

const has = findBlender() !== null;
let b: Blender;
beforeAll(async () => {
  if (has) b = await start();
});
afterAll(async () => {
  await b?.close();
});

const PROBE = `
seen = {}
def visit(inst):
    rna = inst.bl_rna
    for p in rna.properties:
        if p.type != 'FLOAT' or not p.is_array or (rna.identifier, p.identifier) in seen:
            continue
        try:
            v = getattr(inst, p.identifier)
        except Exception:
            continue
        dims = [d for d in p.array_dimensions if d]
        seen[(rna.identifier, p.identifier)] = [rna.identifier, p.identifier, p.subtype, p.array_length, dims, type(v).__name__]
sc = bpy.context.scene
roots = [sc, sc.render, sc.world, bpy.context.view_layer, sc.tool_settings, sc.display, sc.eevee, sc.view_settings, sc.cursor, sc.unit_settings]
for ob in bpy.data.objects:
    roots += [ob, ob.data] + list(ob.modifiers) + list(ob.constraints)
    if ob.pose:
        roots += list(ob.pose.bones) + list(ob.data.bones)
    if ob.type == "MESH":
        me = ob.data
        roots += [me.vertices[0], me.edges[0], me.polygons[0], me.loops[0]] + list(me.attributes) + list(me.uv_layers)
    if ob.type == "CURVE":
        roots += [s for s in ob.data.splines] + [p for s in ob.data.splines for p in list(s.bezier_points)[:1] + list(s.points)[:1]]
for m in bpy.data.materials:
    roots.append(m)
    if m.node_tree:
        for n in m.node_tree.nodes:
            roots += [n] + list(n.inputs) + list(n.outputs)
if sc.world and sc.world.node_tree:
    for n in sc.world.node_tree.nodes:
        roots += [n] + list(n.inputs)
for r in roots:
    if r is not None:
        visit(r)
result = list(seen.values())
`;

describe.skipIf(!has)("generated types match Blender's values", () => {
  test("float arrays: mathutils class or plain array, as typed", async () => {
    const { bpy, py } = b;
    await bpy.ops.object.camera_add();
    await bpy.ops.object.light_add({ type: "SPOT" });
    await bpy.ops.object.empty_add();
    await bpy.ops.object.armature_add();
    await bpy.ops.curve.primitive_bezier_curve_add();
    await bpy.ops.curve.primitive_nurbs_path_add();
    await bpy.ops.object.text_add();
    bpy.data.objects.$["Cube"].modifiers.new("Bevel", "BEVEL");
    bpy.data.objects.$["Cube"].constraints.new("TRACK_TO");
    const rows = await py.exec<[string, string, string, number, number[], string][]>(PROBE);
    const wrong: string[] = [];
    for (const [struct, id, subtype, len, dims, pyType] of rows) {
      const want = mathOf({ id, type: "float", subtype, len, dims: dims.length > 1 ? dims : undefined }) ?? "bpy_prop_array";
      if (want !== pyType) wrong.push(`${struct}.${id} (${subtype} ${dims.join("x") || len}): typed ${want}, Blender gives ${pyType}`);
    }
    expect(wrong).toEqual([]);
    expect(rows.length).toBeGreaterThan(90);
  });
});
