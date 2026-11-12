// A raea scene in Blender and back (docs/blender.feature BL38, BL39): `raea blender open EDIT.tsx` exports the
// composition's 3D (raea scene export: scene.json, meshes/, models/) and build() makes it in a headless Blender, saved
// as a .blend the person opens; `raea blender back FILE.blend` runs readBack() on it, and raea compares what it finds
// with scene.json. Everything sits under one empty, "raea", turned a quarter about X: inside it the axes are raea's
// (y up, -z forward), so each part's placement is raea's own numbers both ways.
import { blender } from "./blender";
import type * as types from "./gen/rna";
import { Matrix } from "./mathutils";
import type { Ptr } from "./types";

type V3 = [number, number, number];
/** x y z, qx qy qz qw, sx sy sz */
type At = number[];

interface Surface {
  color?: string;
  roughness?: number;
  metallic?: number;
  emissive?: string;
  emissive_strength?: number;
  opacity?: number;
  unlit?: boolean;
  color_map?: string;
}
interface Light {
  type: "directional" | "point" | "spot" | "rect";
  color: string;
  intensity: number;
  range?: number;
  angle?: number;
  penumbra?: number;
  width?: number;
  height?: number;
}
interface Part {
  id: string;
  kind: "mesh" | "model" | "light";
  source: { name?: string | null };
  shape?: { type: "cuboid" | "sphere" | "cylinder" | "plane" | "mesh"; size?: number[]; radius?: number; height?: number; obj?: string };
  model?: string;
  material?: Surface;
  light?: Light;
  at: (At | null)[];
}
interface Scene {
  frames: number[];
  fps: number;
  size: [number, number];
  parts: Part[];
  camera: ({ at: At; fov: number } | null)[];
  ambient: { color: string; nits: number } | null;
}

/** raea's light units: a 3d.tsx light's intensity 1 is 8000 lux for a sun and 900 000 lumens else (core/scene props.rs) */
const LUX = 8000;
const LUMENS = 9e5;
/** Blender's watts are radiant: 683 lumens to the watt */
const LM_PER_W = 683;
/** raea's camera (EV100 9.7) shows 1.2 x 2^9.7 nits as white; Blender shows 683: this many stops apart */
const EXPOSURE = Math.log2(683 / (1.2 * 2 ** 9.7));

const srgb = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const toHex = (c: number) => Math.round(Math.max(0, Math.min(1, c <= 0.0031308 ? c * 12.92 : 1.055 * c ** (1 / 2.4) - 0.055)) * 255).toString(16).padStart(2, "0");
/** `#rrggbb` (sRGB) as linear RGB */
function linear(hex: string | undefined, fallback = "#cccccc"): V3 {
  const h = (hex ?? fallback).replace("#", "");
  return [0, 2, 4].map((i) => srgb(parseInt(h.slice(i, i + 2), 16) / 255)) as V3;
}

/** An empty's data: Python takes None (gen types object_data as ID; Blender's RNA leaves it nullable) */
const EMPTY = null as never;

const read = (path: string) => blender.py.exec<string>("result = open(path).read()", { path });

/** A material that is one Principled BSDF with the part's surface. */
function principled(name: string, s: Surface, dir: string): Ptr<types.Material> {
  const { bpy } = blender;
  const m = bpy.data.materials.new(name);
  m.use_nodes = true;
  const nodes = m.node_tree!.nodes;
  nodes.clear();
  const p = nodes.new("ShaderNodeBsdfPrincipled");
  m.node_tree!.links.new(p.outputs.$["BSDF"], nodes.new("ShaderNodeOutputMaterial").inputs.$["Surface"]);
  p.inputs.$["Base Color"].default_value = [...linear(s.color), 1];
  p.inputs.$["Roughness"].default_value = s.roughness ?? 0.5;
  p.inputs.$["Metallic"].default_value = s.metallic ?? 0;
  if (s.emissive) {
    p.inputs.$["Emission Color"].default_value = [...linear(s.emissive), 1];
    p.inputs.$["Emission Strength"].default_value = s.emissive_strength ?? 1;
  }
  if (s.opacity !== undefined) p.inputs.$["Alpha"].default_value = s.opacity;
  if (s.color_map) {
    const t = nodes.new("ShaderNodeTexImage");
    t.image = bpy.data.images.load(`${dir}/${s.color_map}`);
    m.node_tree!.links.new(t.outputs.$["Color"], p.inputs.$["Base Color"]);
  }
  return m;
}

/** The part's mesh as Blender's own: a primitive made at its size in raea's axes, any other an .obj read as it is. */
function mesh(p: Part, dir: string): Ptr<types.Object> {
  const { bpy } = blender;
  const sh = p.shape!;
  const quarter = Matrix.Rotation(-Math.PI / 2, 4, "X"); // Blender's z up as raea's y up, in the mesh
  if (sh.type === "mesh") {
    bpy.ops.wm.obj_import({ filepath: `${dir}/${sh.obj}`, forward_axis: "Y", up_axis: "Z" });
  } else if (sh.type === "cuboid") bpy.ops.mesh.primitive_cube_add({ size: 1 });
  else if (sh.type === "sphere") bpy.ops.mesh.primitive_uv_sphere_add({ radius: sh.radius ?? 0.5, segments: 48, ring_count: 24 });
  else if (sh.type === "cylinder") bpy.ops.mesh.primitive_cylinder_add({ radius: sh.radius ?? 0.5, depth: sh.height ?? 1, vertices: 64 });
  else bpy.ops.mesh.primitive_plane_add({ size: 1 });
  const o = blender.py.pin(bpy.context.active_object!);
  const data = o.data as Ptr<types.Mesh>;
  if (sh.type === "cylinder" || sh.type === "plane") data.transform(quarter);
  if (sh.type === "cuboid") data.transform(Matrix.Diagonal([sh.size![0], sh.size![1], sh.size![2], 1]));
  if (sh.type === "plane") data.transform(Matrix.Diagonal([sh.size![0], 1, sh.size![1], 1]));
  if (sh.type === "sphere" || sh.type === "cylinder") data.shade_smooth();
  data.materials.append(principled(named(p), p.material ?? {}, dir));
  return o;
}

/** A light as Blender's, its power in watts. */
function light(p: Part): Ptr<types.Object> {
  const { bpy } = blender;
  const l = p.light!;
  const kind = l.type === "directional" ? "SUN" : l.type === "spot" ? "SPOT" : l.type === "rect" ? "AREA" : "POINT";
  const d = bpy.data.lights.new(p.id, kind);
  d.color = linear(l.color, "#ffffff");
  d.energy = l.type === "directional" ? (l.intensity * LUX) / LM_PER_W : (l.intensity * LUMENS) / LM_PER_W;
  if (l.type === "spot") (d as Ptr<types.SpotLight>).spot_size = 2 * (l.angle ?? Math.PI / 3);
  if (l.type === "rect") {
    const a = d as Ptr<types.AreaLight>;
    a.shape = "RECTANGLE";
    a.size = l.width ?? 1;
    a.size_y = l.height ?? 1;
  }
  return bpy.data.objects.new(p.id, d);
}

/** A key per frame on each channel of a property, straight into the action's curves. */
function keys(id: Ptr<types.ID>, act: Ptr<types.Action>, path: string, frames: number[], channels: number[][]) {
  channels.forEach((values, index) => {
    const fc = act.fcurve_ensure_for_datablock(id, path, { index });
    fc.keyframe_points.add(values.length);
    fc.keyframe_points.foreach_set("co", values.flatMap((v, k) => [frames[k], v]));
    fc.update();
  });
}

/** An object placed by raea's numbers inside the root, keyed on each frame when it moves. */
function place(o: Ptr<types.Object>, at: (At | null)[], frames: number[], name: string) {
  const { bpy } = blender;
  const kept = at.map((a, k) => [a, frames[k]] as const).filter((x): x is readonly [At, number] => x[0] !== null);
  if (!kept.length) return;
  const [a] = kept[0];
  o.rotation_mode = "QUATERNION";
  o.location = [a[0], a[1], a[2]];
  o.rotation_quaternion = [a[6], a[3], a[4], a[5]];
  o.scale = [a[7], a[8], a[9]];
  if (kept.every(([b]) => b.every((v, i) => v === a[i]))) return;
  const act = bpy.data.actions.new(name);
  o.animation_data_create().action = act;
  const fs = kept.map(([, f]) => f);
  keys(o, act, "location", fs, [0, 1, 2].map((i) => kept.map(([b]) => b[i])));
  keys(o, act, "rotation_quaternion", fs, [6, 3, 4, 5].map((i) => kept.map(([b]) => b[i])));
  keys(o, act, "scale", fs, [7, 8, 9].map((i) => kept.map(([b]) => b[i])));
}

/** A part's object name: its name in the TSX, else what it is ("Sun", "PointLight", "Cuboid", the model's file), as
 *  raea godot export names its nodes; Blender numbers a second one (.001). */
function named(p: Part): string {
  if (p.source.name) return p.source.name;
  if (p.light) return { directional: "Sun", point: "PointLight", spot: "SpotLight", rect: "AreaLight" }[p.light.type];
  if (p.kind === "model") return (p.model ?? "Model").split("/").pop()!.replace(/\.[^.]+$/, "");
  return { cuboid: "Cuboid", sphere: "Sphere", cylinder: "Cylinder", plane: "Plane", mesh: "Mesh" }[p.shape?.type ?? "mesh"];
}

/** scene.json in `dir` built in this Blender, then saved as `out` (a .blend). */
export async function build(dir: string, out: string): Promise<void> {
  const { bpy, py } = blender;
  const s: Scene = JSON.parse(await read(`${dir}/scene.json`));
  bpy.ops.wm.read_factory_settings({ use_empty: true });
  const scene = bpy.context.scene;
  const root = bpy.data.objects.new("raea", EMPTY);
  scene.collection.objects.link(root);
  root.rotation_euler = [Math.PI / 2, 0, 0];
  root.$["raea_scene"] = `${dir}/scene.json`;
  for (const p of s.parts) {
    let o: Ptr<types.Object>;
    if (p.kind === "mesh") o = mesh(p, dir);
    else if (p.kind === "light") {
      o = light(p);
      scene.collection.objects.link(o);
    } else {
      // a model: its glTF imported (Blender turns it to z up), held by an empty placed by raea's numbers, the import
      // turned back to raea's axes inside it
      o = bpy.data.objects.new(p.id, EMPTY);
      scene.collection.objects.link(o);
      await py.exec(
        "import bpy, mathutils\nbpy.ops.object.select_all(action='DESELECT')\nbpy.ops.import_scene.gltf(filepath=path)\nback = mathutils.Matrix.Rotation(-1.5707963267948966, 4, 'X')\nfor t in [x for x in bpy.context.selected_objects if x.parent is None]:\n    w = t.matrix_world.copy()\n    t.parent = holder\n    t.matrix_parent_inverse = mathutils.Matrix.Identity(4)\n    t.matrix_basis = back @ w",
        { path: `${dir}/${p.model}`, holder: o },
      );
    }
    o.name = named(p);
    o.parent = root;
    o.$["raea_id"] = p.id;
    place(o, p.at, s.frames, p.id);
  }
  // the camera: its lens as raea's vertical field of view
  const c0 = s.camera.find((c) => c !== null);
  if (c0) {
    const lens = bpy.data.cameras.new("camera");
    lens.sensor_fit = "VERTICAL";
    lens.sensor_height = 24;
    lens.lens = 12 / Math.tan((c0.fov * Math.PI) / 360);
    const cam = bpy.data.objects.new("camera", lens);
    scene.collection.objects.link(cam);
    cam.parent = root;
    cam.$["raea_id"] = "camera";
    place(cam, s.camera.map((c) => c?.at ?? null), s.frames, "camera");
    scene.camera = cam;
  }
  // the ambient as the world's light, at raea's exposure
  const world = bpy.data.worlds.new("raea");
  world.use_nodes = true;
  const wn = world.node_tree!.nodes;
  wn.clear();
  const bg = wn.new("ShaderNodeBackground");
  bg.inputs.$["Color"].default_value = [...linear(s.ambient?.color, "#2b2c2f"), 1];
  bg.inputs.$["Strength"].default_value = s.ambient ? s.ambient.nits / LM_PER_W : 0.3;
  world.node_tree!.links.new(bg.outputs.$["Background"], wn.new("ShaderNodeOutputWorld").inputs.$["Surface"]);
  scene.world = world;
  scene.view_settings.exposure = EXPOSURE;
  const r = scene.render;
  r.resolution_x = s.size[0];
  r.resolution_y = s.size[1];
  r.fps = Math.round(s.fps);
  scene.frame_start = s.frames[0];
  scene.frame_end = s.frames[s.frames.length - 1];
  scene.frame_set(s.frames[0]);
  bpy.ops.wm.save_as_mainfile({ filepath: out });
}

/** What the scene holds now, in raea's terms, written to `now` as JSON: each object with a raea_id placed inside the
 *  root, its surface or light, the camera; each mesh made in Blender (no raea_id) written as a .glb into `media`. */
export async function readBack(now: string, media: string): Promise<void> {
  const { py } = blender;
  await py.exec(READ_BACK, { now, media, lux: LUX, lumens: LUMENS, lm: LM_PER_W });
}

// in Python: one pass over the file's objects (a round trip a property would cost hundreds)
const READ_BACK = `
import bpy, json, os, mathutils
# placements are compared with the first frame sent: read them there, whatever frame the file was saved on
bpy.context.scene.frame_set(bpy.context.scene.frame_start)
root = bpy.data.objects.get("raea")
if root is None:
    raise RuntimeError("this .blend has no raea root: it wasn't made by raea blender open")
inv = root.matrix_world.inverted()
def at(o):
    l, q, s = (inv @ o.matrix_world).decompose()
    return [round(v, 6) for v in (l.x, l.y, l.z, q.x, q.y, q.z, q.w, s.x, s.y, s.z)]
def hexof(c):
    f = lambda v: max(0, min(255, round((v * 12.92 if v <= 0.0031308 else 1.055 * v ** (1 / 2.4) - 0.055) * 255)))
    return "#%02x%02x%02x" % (f(c[0]), f(c[1]), f(c[2]))
def under_raea(o):
    p = o.parent
    while p is not None:
        if "raea_id" in p:
            return True
        p = p.parent
    return False
parts, new, cam = [], [], None
for o in bpy.data.objects:
    rid = o.get("raea_id")
    if rid == "camera" and o.type == "CAMERA":
        cam = {"at": at(o), "fov": round(o.data.angle_y * 180 / 3.141592653589793, 4)}
        continue
    if rid is not None:
        p = {"id": rid, "at": at(o)}
        if o.type == "MESH" and o.active_material is not None:
            n = next((n for n in o.active_material.node_tree.nodes if n.type == "BSDF_PRINCIPLED"), None)
            if n is not None:
                p["material"] = {"color": hexof(n.inputs["Base Color"].default_value), "roughness": round(n.inputs["Roughness"].default_value, 4), "metallic": round(n.inputs["Metallic"].default_value, 4)}
                if n.inputs["Emission Strength"].default_value > 0 and any(n.inputs["Emission Color"].default_value[:3]):
                    p["material"]["emissive"] = hexof(n.inputs["Emission Color"].default_value)
        if o.type == "LIGHT":
            unit = lux if o.data.type == "SUN" else lumens
            p["light"] = {"color": hexof(o.data.color), "intensity": round(o.data.energy * lm / unit, 6)}
        parts.append(p)
    elif o.type == "MESH" and (o.parent is None or o.parent == root) and not under_raea(o):
        # made in Blender: written at the origin as a y-up .glb; its placement turned into raea's axes
        name = bpy.path.clean_name(o.name)
        os.makedirs(media, exist_ok=True)
        out = os.path.join(media, name + ".glb")
        w = o.matrix_world.copy()
        l, q, s = (inv @ w @ root.matrix_world).decompose()
        o.matrix_world = mathutils.Matrix.Identity(4)
        bpy.ops.object.select_all(action="DESELECT")
        o.select_set(True)
        bpy.context.view_layer.objects.active = o
        bpy.ops.export_scene.gltf(filepath=out, use_selection=True, export_apply=True)
        o.matrix_world = w
        json.dump({"source": bpy.data.filepath, "license": "own work", "credit": ""}, open(out + ".json", "w"))
        new.append({"name": o.name, "file": "media/" + name + ".glb", "at": [round(v, 6) for v in (l.x, l.y, l.z, q.x, q.y, q.z, q.w, s.x, s.y, s.z)]})
json.dump({"parts": parts, "camera": cam, "new": new}, open(now, "w"), indent=1)
`;
