// <Instances>: one glTF or one mesh drawn at many placements, loaded once and drawn by the GPU as instances (Bevy
// batches entities sharing a mesh and a material into one draw), and scatter(), the seeded placements for it.
import { Children, isValidElement, type ReactNode } from "react";
import { Solid } from "../solid";
import { MeshToonMaterial, Vec3, checkPass, checkVec, node3d, shapeFromChildren } from "./all";

/** One copy's placement in an <Instances>, in the Instances' own space (its position, rotation and scale move every
 * copy together). Rotation in radians, XYZ order, as everywhere. */
export interface Instance {
  /** where this copy stands, metres, in the Instances' space */
  position: Vec3;
  /** its rotation, Euler angles in radians (x, y, z) */
  rotation?: Vec3;
  /** its scale: one number, or x, y and z */
  scale?: number | Vec3;
}

export interface InstancesProps {
  /** a glTF file drawn at every placement: staticFile("models/house.glb"). Without it, a geometry child (or `shape`)
   * and a material child draw a mesh at every placement */
  src?: string;
  /** where each copy stands, this frame: a list that changes moves the copies with it (each distinct list is kept, so a
   * set of thousands moving every frame costs a list a frame; moving the whole set by the Instances' own props costs
   * nothing). How many copies is the first frame's: a frame with another count holds the list before it */
  at: Instance[];
  /** the entity's name, for picking, the inspector and world.* */
  name?: string;
  /** where it stands, metres (x, y, z) */
  position?: Vec3;
  /** radians */
  rotation?: Vec3;
  /** its scale: one number, or x, y and z */
  scale?: number | Vec3;
  /** of a glTF: which of its scenes (0 by default) */
  scene?: number;
  /** a Manifold solid or its expression for the mesh form; wins over the geometry child */
  shape?: string | Solid;
  /** false: the copies cast no shadow (true by default). Grass and flowers by the thousand usually want false */
  shadow?: boolean;
  /** false: no shadow falls on the copies */
  receiveShadow?: boolean;
  /** the composition pass it draws in ("scene" by default) */
  pass?: string;
  /** the mesh form: a geometry and a material (MeshStandardMaterial, MeshPhysicalMaterial or MeshBasicMaterial).
   * The glTF form: MeshStandardMaterial children re-covering its materials, as on a Model */
  children?: ReactNode;
}

/** The packed placements, 9 numbers a copy (position, rotation, scale), cached by the list, so a list made once (a
 * module's `scatter`) is packed once however many frames draw it. */
const PACKED = new WeakMap<Instance[], number[]>();
const r5 = (x: number) => Math.round(x * 1e5) / 1e5;
export function packInstances(owner: string, at: Instance[]): number[] {
  const hit = PACKED.get(at);
  if (hit) return hit;
  const out: number[] = new Array(at.length * 9);
  at.forEach((it, i) => {
    if (it === null || typeof it !== "object") throw new TypeError(`${owner}: at[${i}] must be { position, rotation?, scale? }, got ${JSON.stringify(it)}`);
    const { position, rotation = [0, 0, 0], scale = 1 } = it;
    checkVec(owner, `at[${i}].position`, position);
    checkVec(owner, `at[${i}].rotation`, rotation);
    const s: Vec3 = typeof scale === "number" ? [scale, scale, scale] : scale;
    checkVec(owner, `at[${i}].scale`, s);
    if (!s.every((v) => v > 0)) throw new RangeError(`${owner}: at[${i}].scale must be positive, got ${JSON.stringify(scale)}`);
    const o = i * 9;
    for (let k = 0; k < 3; k++) {
      out[o + k] = r5(position[k]);
      out[o + 3 + k] = r5(rotation[k]);
      out[o + 6 + k] = r5(s[k]);
    }
  });
  PACKED.set(at, out);
  return out;
}

/** One glTF (or one mesh) drawn at many placements, loaded once and drawn by the GPU as instances: a meadow's grass
 * and flowers, a forest, a suburb's houses. `<Instances src={staticFile("daisy.glb")} at={scatter({...})} />`. The
 * copies share one surface and can't play a clip.
 * @bevy bevy_pbr::render::mesh::MeshPipeline (automatic batching of entities sharing a mesh and material) */
export function Instances(props: InstancesProps) {
  const owner = props.src !== undefined ? `Instances(${props.src})` : "Instances";
  if (props.src !== undefined && (typeof props.src !== "string" || !/\.(glb|gltf)$/i.test(props.src))) throw new TypeError(`Instances: src must be a .glb or .gltf file (staticFile("x.glb")), got ${JSON.stringify(props.src)}`);
  if (!Array.isArray(props.at)) throw new TypeError(`${owner}: at must be a list of { position, rotation?, scale? }, got ${JSON.stringify(props.at)}`);
  for (const k of ["position", "rotation"] as const) if (props[k] !== undefined) checkVec(owner, k, props[k]);
  if (props.scale !== undefined && typeof props.scale !== "number") checkVec(owner, "scale", props.scale);
  for (const k of ["animation", "animations", "graph", "morphs"]) if (k in (props as object)) throw new TypeError(`${owner}: instances can't play a clip or set morphs; use a <Model> for an animated one`);
  checkPass(owner, props.pass);
  const at = packInstances(owner, props.at);
  const { position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 } = props;
  // the placements in an attribute of their own, not data-props: the engine shares one list across frames while its text
  // is the same, where a set whose other props change was parsed whole into each frame's props (#84)
  const placed = { "data-at": JSON.stringify(at) };
  if (props.src !== undefined) return node3d("Model", { ...props, shape: undefined, at: undefined, position, rotation, scale }, props.children, placed);
  const manifold = props.shape instanceof Solid ? props.shape.expr : props.shape ?? shapeFromChildren(props.children);
  if (manifold === undefined) throw new TypeError("Instances: give a glTF `src`, or a geometry child (<Cuboid />, <BufferMesh />, ...) or `shape`");
  let toon = false;
  Children.forEach(props.children, (c) => { if (isValidElement(c) && c.type === MeshToonMaterial) toon = true; });
  if (toon) throw new TypeError("Instances: the copies take a MeshStandardMaterial, MeshPhysicalMaterial or MeshBasicMaterial (a toon surface isn't instanced)");
  return node3d("Mesh", { ...props, shape: undefined, at: undefined, position, rotation, scale }, props.children, { ...placed, "data-shape": manifold as string });
}

/** A box on the plan (x, z, metres): the room SDK's Footprint, or any { min, max }. */
export interface PlanBox {
  /** the low corner (x, z), metres */
  min: [number, number];
  /** the high corner (x, z), metres */
  max: [number, number];
}

export interface ScatterOptions {
  /** where the points fall: a box on the plan (x, z) */
  area: PlanBox;
  /** how many (fewer when the area fills up: spacing and avoid leave no room) */
  count: number;
  /** the least distance between two points, metres (0: none) */
  spacing?: number;
  /** boxes on the plan to keep clear of, grown by `margin` */
  avoid?: PlanBox[];
  /** how far to stay off each avoided box (spacing / 2 by default) */
  margin?: number;
  /** points kept off already-placed ones too: a second scatter (flowers) clear of the first (stones) by `spacing` */
  clearOf?: Instance[];
  /** 1 by default; the same seed gives the same points, every frame, render and play */
  seed?: number;
  /** each point's turn about y (radians): true (the default) any, false none, a number that one, [lo, hi] between */
  yaw?: boolean | number | [number, number];
  /** a lean off upright, radians: each point tipped by up to this much in a random direction (0 by default) */
  tilt?: number;
  /** a scale, or [lo, hi] between (uniform) */
  scale?: number | [number, number];
  /** the ground's height: a number (0), or the terrain's height at (x, z) */
  y?: number | ((x: number, z: number) => number);
  /** how likely a point is kept at (x, z), 0 to 1: a density map (a path worn bare, a patch thicker by the chair) */
  density?: (x: number, z: number) => number;
}

/** A seeded stream in [0, 1) (mulberry32), as the room SDK's `seeded`. */
function mulberry(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Points scattered over an area for an <Instances>: seeded (the same layout every frame and every run), at least
 * `spacing` apart, clear of `avoid` and `clearOf`, on the ground `y` gives, kept by `density`. A spatial hash keeps
 * thousands quick. Call it once at module level, not per frame. */
export function scatter(o: ScatterOptions): Instance[] {
  const { area, count, spacing = 0, avoid = [], seed = 1, yaw = true, tilt = 0, scale = 1, y = 0, clearOf = [], density } = o;
  const margin = o.margin ?? spacing / 2;
  if (!area || !Array.isArray(area.min) || !Array.isArray(area.max)) throw new TypeError(`scatter: area must be { min: [x, z], max: [x, z] }, got ${JSON.stringify(area)}`);
  if (!(count >= 0) || !Number.isFinite(count)) throw new RangeError(`scatter: count must be a number of points, got ${count}`);
  if (!(spacing >= 0)) throw new RangeError(`scatter: spacing must be 0 or more metres, got ${spacing}`);
  const [x0, z0] = area.min, [x1, z1] = area.max;
  const rnd = mulberry(seed);
  const cell = spacing > 0 ? spacing : 1;
  const grid = new Map<string, [number, number][]>();
  const add = (x: number, z: number) => {
    const k = `${Math.floor(x / cell)},${Math.floor(z / cell)}`;
    const l = grid.get(k);
    if (l) l.push([x, z]);
    else grid.set(k, [[x, z]]);
  };
  const crowded = (x: number, z: number) => {
    if (spacing <= 0) return false;
    const cx = Math.floor(x / cell), cz = Math.floor(z / cell);
    for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) {
      for (const [px, pz] of grid.get(`${cx + i},${cz + j}`) ?? []) if ((px - x) ** 2 + (pz - z) ** 2 < spacing * spacing) return true;
    }
    return false;
  };
  for (const c of clearOf) add(c.position[0], c.position[2]);
  const blocked = (x: number, z: number) => avoid.some((f) => x > f.min[0] - margin && x < f.max[0] + margin && z > f.min[1] - margin && z < f.max[1] + margin);
  const turn = (): number => (yaw === true ? rnd() * Math.PI * 2 : yaw === false ? 0 : typeof yaw === "number" ? yaw : yaw[0] + rnd() * (yaw[1] - yaw[0]));
  const size = (): number => (typeof scale === "number" ? scale : scale[0] + rnd() * (scale[1] - scale[0]));
  const out: Instance[] = [];
  for (let tries = 0; out.length < count && tries < count * 60 + 100; tries++) {
    const x = x0 + rnd() * (x1 - x0), z = z0 + rnd() * (z1 - z0);
    // every draw made whether the point is kept or not, so one rejected point doesn't shift the rest
    const r = turn(), s = size(), keep = rnd(), ta = rnd() * Math.PI * 2, tm = rnd() * tilt;
    if (density && keep >= density(x, z)) continue;
    if (blocked(x, z) || crowded(x, z)) continue;
    add(x, z);
    const h = typeof y === "number" ? y : y(x, z);
    out.push({ position: [x, h, z], rotation: [Math.cos(ta) * tm, r, Math.sin(ta) * tm], scale: s });
  }
  return out;
}
