// README.md's example, type-checked with the tests (tsc -p .)
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
