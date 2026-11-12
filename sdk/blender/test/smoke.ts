// raea blender run's smoke (BL29): a scene built from TypeScript, a value Blender computes, the maths agreeing with
// Blender's, one PASS line. Run on a clean machine after `raea setup blender`:  raea blender run smoke.ts [ARGS...]
import { bmesh, bpy, mathutils, py } from "raea/blender";

export default async function () {
  for (let i = 0; i < 3; i++) await bpy.ops.mesh.primitive_cube_add({ size: 1, location: [i * 2, 0, 0] });
  const last = (await bpy.context.active_object)!;
  last.rotation_euler.z = Math.PI / 4;
  const far = (await last.location).length;
  // a mesh Blender evaluates: its volume, by bmesh
  const bm = bmesh.new();
  bm.from_mesh(bpy.data.meshes.$[await last.data.name]);
  const volume = await bm.calc_volume();
  bm.free();
  // mathutils in TypeScript against Blender's own (matrix_world follows the rotation once the depsgraph updates)
  bpy.context.view_layer.update();
  const turned = (await last.matrix_world).to_euler().z;
  const hit = await mathutils.geometry.intersect_ray_tri([0, 0, 1], [1, 0, 1], [0, 1, 1], [0, 0, -1], [0.2, 0.2, 5]);
  const objects = await py.len(bpy.context.scene.objects);
  const args = await py.exec<string[]>("import sys; result = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []");
  const v = await bpy.app.version_string;
  const ok = objects >= 4 && Math.abs(far - 4) < 1e-6 && Math.abs(volume - 1) < 1e-6 && Math.abs(turned - Math.PI / 4) < 1e-5 && hit !== null;
  if (!ok) throw new Error(`smoke: objects ${objects}, the last ${far} m out, volume ${volume}, turned ${turned}, ray hit ${hit}`);
  console.log(`PASS raea/blender: 3 cubes made (${objects} objects), the last ${far.toFixed(3)} m out, volume ${volume.toFixed(3)}, in Blender ${v}${args.length ? ` (args ${args.join(" ")})` : ""}`);
}
