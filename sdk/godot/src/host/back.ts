// What a project raea godot export wrote holds now (docs/godot.feature GD13): `raea godot back DIR` runs this in it,
// then compares what it writes with scene.json. Each node with a raea_id is placed in raea's terms (Godot's axes are
// raea's: y up, -z forward); each node added in Godot is written as MEDIA/NAME.glb with a sidecar.
//   raea godot run back.ts --project DIR -- NOW.json MEDIA
import { Camera3D, Color, DirAccess, FileAccess, GLTFDocument, GLTFState, Light3D, MeshInstance3D, Node3D, PackedScene, ResourceLoader, StandardMaterial3D, Transform3D, type SceneTree } from "raea/godot";

const r6 = (x: number) => Math.round(x * 1e6) / 1e6;
const hex = (c: Color) => `#${c.to_html(false)}`;

function at(n: Node3D): number[] {
  const p = n.position;
  const q = n.quaternion;
  const s = n.scale;
  return [p.x, p.y, p.z, q.x, q.y, q.z, q.w, s.x, s.y, s.z].map(r6);
}

export default async function (_tree: SceneTree, [now, media]: string[]) {
  if (!now || !media) throw new Error("usage: raea godot run back.ts --project DIR -- NOW.json MEDIA");
  const packed = ResourceLoader.load("res://main.tscn");
  if (!(packed instanceof PackedScene)) throw new Error("res://main.tscn: not here; raea godot back reads a project raea godot export wrote");
  const root = packed.instantiate()!;
  const parts: object[] = [];
  const added: object[] = [];
  let camera: object | null = null;
  for (const child of root.get_children()) {
    if (!(child instanceof Node3D)) continue;
    if (child instanceof Camera3D) {
      camera = { at: at(child), fov: r6(child.fov) };
      continue;
    }
    if (child.has_meta("raea_id")) {
      const part: Record<string, unknown> = { id: String(child.get_meta("raea_id")), at: at(child) };
      if (child instanceof MeshInstance3D) {
        const m = child.get_surface_override_material(0);
        if (m instanceof StandardMaterial3D) {
          part.material = { color: hex(m.albedo_color), roughness: r6(m.roughness), metallic: r6(m.metallic), ...(m.emission_enabled ? { emissive: hex(m.emission) } : {}) };
        }
      }
      if (child instanceof Light3D) part.light = { color: hex(child.light_color), intensity: r6(child.light_energy) };
      parts.push(part);
      continue;
    }
    // added in Godot: its own .glb, written where it stands at the origin, placed by where it stands
    const name = String(child.get_name()).replace(/[^A-Za-z0-9_-]+/g, "_");
    const was = child.transform;
    const placed = at(child);
    child.transform = new Transform3D();
    DirAccess.make_dir_recursive_absolute(media);
    const file = `${media}/${name}.glb`;
    const doc = new GLTFDocument();
    const state = new GLTFState();
    let err = doc.append_from_scene(child, state);
    if (err === 0) err = doc.write_to_filesystem(state, file);
    child.transform = was;
    if (err !== 0) throw new Error(`${name}: glTF export failed (Godot error ${err})`);
    const side = FileAccess.open(`${file}.json`, FileAccess.ModeFlags.WRITE);
    side?.store_string(JSON.stringify({ source: "res://main.tscn", license: "own work", credit: "" }));
    side?.close();
    added.push({ name, file: `media/${name}.glb`, at: placed });
  }
  root.free();
  const f = FileAccess.open(now, FileAccess.ModeFlags.WRITE);
  if (!f) throw new Error(`${now}: can't write it`);
  f.store_string(JSON.stringify({ parts, camera, new: added }, null, 1));
  f.close();
}
