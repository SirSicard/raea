// Type-level checks of the generated API (tsc -p sdk/blender), never run: what a script writes type-checks, and what
// Python would reject (a read-only property, a wrong enum, a member that isn't there) doesn't.
import { bmesh, bpy, mathutils, py, type Euler, type Matrix, type Vector } from "../src";

export async function script(): Promise<void> {
  const ob = bpy.data.objects.$["Cube"];
  const loc: Vector = (await ob.location)!;
  ob.location = [1, 2, 3];
  ob.location = loc;
  ob.location.x = 5;
  const x: number = await ob.location.x;
  const name: string = await ob.name;
  ob.name = "Hi";
  ob.rotation_mode = "XYZ";
  const kind: string = await ob.type;
  const world: Matrix = await ob.matrix_world;
  const e: Euler = await ob.matrix_world.to_euler();
  const dims: number[] = await ob.bound_box[0];
  ob.parent = bpy.data.objects.$["Empty"];
  ob.parent = null;
  ob.location.x = ob.scale.x;

  const r = await bpy.ops.mesh.primitive_cube_add({ size: 2, location: [0, 0, 1] });
  const finished: boolean = r.has("FINISHED");
  await bpy.ops.object.select_all("EXEC_DEFAULT", { action: "SELECT" });

  const me = bpy.data.meshes.new("m");
  me.from_pydata([[0, 0, 0], [1, 0, 0], [0, 1, 0]], [], [[0, 1, 2]]);
  const o2 = bpy.data.objects.new("o", me);
  bpy.context.collection.objects.link(o2);
  const active = await bpy.context.active_object;
  if (active) void active.name;
  for await (const o of bpy.data.objects) void (await o.name).toUpperCase();
  const selected = await bpy.context.selected_objects;
  void selected.length;
  const mod = ob.modifiers.new("Sub", "SUBSURF");
  void mod.show_viewport;
  ob.keyframe_insert("location", { frame: 10 });
  ob.$["my_prop"] = 1;
  const n: number = await py.len(bpy.data.objects);

  const bm = bmesh.new();
  bm.from_mesh(me);
  const v = bm.verts.new([1, 2, 3]);
  void v.co.x;
  const out = bmesh.ops.extrude_face_region(bm, { geom: [] });
  void out.$["geom"];
  const hit = await mathutils.geometry.intersect_ray_tri([0, 0, 0], [0, 1, 0], [1, 0, 0], [0, 0, 1], [0, 0, -1]);
  void hit;
  const scene = bpy.context.scene;
  scene.frame_end = 48;
  scene.render.resolution_x = 1920;
  void [loc, x, name, kind, world, e, dims, finished, n];
  // BL34: an enum Blender works out at the time takes what it would then: a 2D curve's fill_mode is NONE, BACK, FRONT or
  // BOTH, though the static items are the 3D ones (FULL, BACK, FRONT, HALF)
  const curve = bpy.data.curves.new("outline", "CURVE");
  curve.dimensions = "2D";
  curve.fill_mode = "BOTH";

  // @ts-expect-error Object.type is read-only
  ob.type = "MESH";
  // @ts-expect-error not a rotation mode
  ob.rotation_mode = "XYZW";
  // @ts-expect-error Object has no such property
  void ob.no_such_thing;
  // @ts-expect-error a number isn't a name
  ob.name = 5;
  // @ts-expect-error not an operator in bpy.ops.mesh
  void bpy.ops.mesh.no_such_operator;
  // @ts-expect-error size takes a number
  void bpy.ops.mesh.primitive_cube_add({ size: "big" });
  // @ts-expect-error a path must be awaited before arithmetic
  void (ob.location.x + 1);
}

/** What a script gets back is the class Python returns (tools/refine.py), every argument may go by keyword, and an enum
 * whose values come from the data (view_transform, render.engine) takes any string. */
export async function refined() {
  const ob = bpy.context.active_object!;
  const sub = ob.modifiers.new("Smooth", "SUBSURF");
  sub.levels = 2;
  const light = bpy.data.lights.new("key", "AREA");
  light.size = 3;
  light.energy = 700;
  const track = ob.constraints.new("TRACK_TO");
  track.track_axis = "TRACK_NEGATIVE_Z";
  const tree = bpy.data.node_groups.new("fx", "ShaderNodeTree");
  const bsdf = tree.nodes.new("ShaderNodeBsdfPrincipled");
  bsdf.inputs.$["Base Color"].default_value = [0.9, 0.4, 0.05, 1];
  bsdf.inputs.$["Roughness"].default_value = 0.4;
  tree.links.new(bsdf.outputs.$["BSDF"], tree.nodes.new("ShaderNodeOutputMaterial").inputs.$["Surface"]);
  // any other node type, an add-on's, is a Node
  void tree.nodes.new("MyAddonNode");
  ob.keyframe_insert({ data_path: "location", index: 2, frame: 1 });
  ob.keyframe_insert("location", { frame: 1 });
  bpy.context.scene.view_settings.view_transform = "AgX";
  bpy.context.scene.render.engine = "CYCLES";

  // @ts-expect-error a SubsurfModifier has no `size`
  sub.size = 3;
  // @ts-expect-error not a modifier type
  ob.modifiers.new("x", "NOT_A_MODIFIER");
  // @ts-expect-error a colour socket's value is four numbers, not a string
  bsdf.inputs.$["Base Color"].default_value = "orange";
  // @ts-expect-error data_path is required
  ob.keyframe_insert({ frame: 1 });
}
