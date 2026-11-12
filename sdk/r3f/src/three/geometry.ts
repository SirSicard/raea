// A raea mesh's shape as a three.js BufferGeometry. The primitives (Box, Sphere ... `args` in three's own order) are
// three's geometries; a <BufferMesh>'s arrays (the Mesh's data-shape "buffer:{...}") become attributes, its v turned
// back to three's (raea's uvs count v from a picture's top, as Bevy's do); any other shape is core/shape's language
// (minus, hull, extrude, text3d ...), meshed by raea's own shape module in wasm (engine/shape-web) once it is loaded.
import * as THREE from "three";

export const GEOMETRY: Record<string, (a: number[]) => THREE.BufferGeometry> = {
  Box: (a) => new THREE.BoxGeometry(a[0] ?? 1, a[1] ?? 1, a[2] ?? 1),
  Sphere: (a) => new THREE.SphereGeometry(a[0] ?? 1, 48, 24),
  Plane: (a) => new THREE.PlaneGeometry(a[0] ?? 1, a[1] ?? 1),
  Cylinder: (a) => new THREE.CylinderGeometry(a[0] ?? 1, a[1] ?? 1, a[2] ?? 1, 48),
  Cone: (a) => new THREE.ConeGeometry(a[0] ?? 1, a[1] ?? 1, 48),
  Torus: (a) => new THREE.TorusGeometry(a[0] ?? 1, a[1] ?? 0.4, 24, 64),
  Capsule: (a) => new THREE.CapsuleGeometry(a[0] ?? 1, a[1] ?? 1, 12, 24),
  Circle: (a) => new THREE.CircleGeometry(a[0] ?? 1, 48),
  Ring: (a) => new THREE.RingGeometry(a[0] ?? 0.5, a[1] ?? 1, 48),
};

interface BufferSpec {
  positions: number[];
  indices?: number[];
  normals?: number[];
  uvs?: number[];
  colors?: number[] | string[];
  /** its own attributes for a <ThreeShaderMaterial> (each one's size, 1-4, and values a vertex) */
  attributes?: Record<string, { size: number; values: number[] }>;
}

/** a <BufferMesh>'s arrays as a geometry */
export function bufferGeometry(b: BufferSpec): THREE.BufferGeometry {
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(b.positions, 3));
  if (b.indices) g.setIndex(b.indices);
  if (b.normals) g.setAttribute("normal", new THREE.Float32BufferAttribute(b.normals, 3));
  else g.computeVertexNormals();
  if (b.uvs) g.setAttribute("uv", new THREE.Float32BufferAttribute(b.uvs.map((v, i) => (i % 2 ? 1 - v : v)), 2));
  if (b.colors) {
    const c = b.colors as unknown[];
    const rgba = typeof c[0] === "string" ? (c as string[]).flatMap((h) => { const k = new THREE.Color(h); return [k.r, k.g, k.b, 1]; }) : (c as number[]);
    g.setAttribute("color", new THREE.Float32BufferAttribute(rgba, 4));
  }
  for (const [k, a] of Object.entries(b.attributes ?? {})) g.setAttribute(k, new THREE.Float32BufferAttribute(a.values, a.size));
  return g;
}

// ---- core/shape in wasm ----
interface ShapeModule {
  mesh(expr: string): Float32Array;
}
let shapes: ShapeModule | undefined;
let loading: Promise<ShapeModule> | undefined;

/** raea's shape module: the glue wasm-bindgen wrote for engine/shape-web (sdk/r3f/tools/shape-wasm.sh), by its url or
 * as the module itself. Call once; until it resolves, shapes other than the primitives aren't drawn. */
export function loadShapes(from: string | { default: (url?: unknown) => Promise<unknown>; mesh: ShapeModule["mesh"] }): Promise<ShapeModule> {
  loading ??= (async () => {
    const m = typeof from === "string" ? ((await import(/* @vite-ignore */ from)) as { default: () => Promise<unknown>; mesh: ShapeModule["mesh"] }) : from;
    await m.default();
    shapes = { mesh: m.mesh };
    return shapes;
  })();
  return loading;
}

/** whether solids can be meshed now */
export const shapesReady = () => shapes !== undefined;

const meshed = new Map<string, THREE.BufferGeometry>();

/** a shape expression's geometry (shared: don't dispose it), or undefined while the shape module isn't loaded */
export function shapeGeometry(expr: string): THREE.BufferGeometry | undefined {
  const had = meshed.get(expr);
  if (had) return had;
  if (!shapes) return undefined;
  const out = shapes.mesh(expr);
  const n = out[0];
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(out.slice(1, 1 + n * 3), 3));
  g.setAttribute("normal", new THREE.BufferAttribute(out.slice(1 + n * 3, 1 + n * 6), 3));
  meshed.set(expr, g);
  return g;
}

const buffers = new Map<string, THREE.BufferGeometry>();

/** a Mesh's geometry from its data-shape: its buffer, or its solid; undefined for a primitive (its child says) */
export function geometryOfShape(shape: string | null): THREE.BufferGeometry | undefined {
  if (!shape) return undefined;
  if (shape.startsWith("buffer:")) {
    let g = buffers.get(shape);
    // newest last: a hit moves it to the end, so what's still drawn is never the one let go
    if (g) {
      buffers.delete(shape);
      buffers.set(shape, g);
    } else {
      g = bufferGeometry(JSON.parse(shape.slice(7)) as BufferSpec);
      buffers.set(shape, g);
      // the newest few hundred kept: a mesh whose arrays change each frame makes a new one each frame
      if (buffers.size > 256) {
        const [first] = buffers.keys();
        buffers.get(first)?.dispose();
        buffers.delete(first);
      }
    }
    return g;
  }
  return shapeGeometry(shape);
}
