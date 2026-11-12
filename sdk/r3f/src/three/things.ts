// raea's parts that are more than a shape and a surface: glTF models (their clips, morphs, hidden nodes and re-covered
// materials), pictures on cards, instanced copies, gizmo lines and decals.
import * as THREE from "three";
import { GLTFLoader, type GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { paint, texture } from "./materials";
import { vec } from "./lights";

type Props = Record<string, unknown>;

/** position, rotation (Euler XYZ, radians, as raea composes it), quaternion and scale */
export function place(o: THREE.Object3D, p: Props) {
  const pos = vec(p.position), rot = vec(p.rotation), sc = vec(p.scale);
  const q = p.quaternion as number[] | undefined;
  if (pos) o.position.set(...pos);
  if (Array.isArray(q) && q.length === 4) o.quaternion.set(q[0], q[1], q[2], q[3]);
  else if (rot) o.rotation.set(rot[0], rot[1], rot[2], "XYZ");
  if (sc) o.scale.set(...sc);
  else if (typeof p.scale === "number") o.scale.setScalar(p.scale);
  if (typeof p.visible === "boolean") o.visible = p.visible;
  if (typeof p.name === "string") o.name = p.name;
}

// ---- glTF ----
// meshopt-compressed models (gltf-transform's meshopt: a web build's models a fraction of the size) decode in place
const gltfLoader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
const gltfs = new Map<string, Promise<GLTF>>();
export const loadGltf = (src: string) => {
  let g = gltfs.get(src);
  if (!g) gltfs.set(src, (g = gltfLoader.loadAsync(src)));
  return g;
};

/** A <Model>: its glTF's scene, cloned for this part (skinned meshes keep their own skeletons), posed each sync. */
export class ModelPart {
  readonly root = new THREE.Group();
  private model?: THREE.Object3D;
  private clips: THREE.AnimationClip[] = [];
  private mixer?: THREE.AnimationMixer;
  private props: Props = {};
  private refinish: Props[] = [];
  private seconds = 0;

  /** what it shows at the last set(): the source export (../export) writes it as a <Model> of its own */
  get state() {
    const p = this.props;
    return { src: this.src, time: typeof p.time === "number" ? p.time : this.seconds, loop: p.loop !== false, animation: p.animation, animations: p.animations, hide: p.hide, morphs: p.morphs, refinish: this.refinish };
  }

  constructor(readonly src: string, done: () => void) {
    this.root.userData.raeaModel = this;
    void loadGltf(src).then(async (g) => {
      const { clone } = await import("three/examples/jsm/utils/SkeletonUtils.js");
      this.model = clone(g.scene);
      this.clips = g.animations;
      this.mixer = new THREE.AnimationMixer(this.model);
      this.root.add(this.model);
      this.model.traverse((o) => {
        if ((o as THREE.Mesh).isMesh) o.castShadow = o.receiveShadow = true;
      });
      this.apply();
      done();
    }, (e: unknown) => console.warn(`raea/r3f: Model ${src} couldn't be loaded: ${String(e)}`));
  }

  set(p: Props, seconds: number, refinish: Props[]) {
    place(this.root, p);
    this.props = p;
    this.seconds = seconds;
    this.refinish = refinish;
    this.apply();
  }

  private clip(c: string | number | undefined) {
    return typeof c === "number" ? this.clips[c] : this.clips.find((k) => k.name === c);
  }

  private apply() {
    const m = this.model, p = this.props;
    if (!m || !this.mixer) return;
    const hide = new Set((p.hide as string[] | undefined) ?? []);
    m.traverse((o) => {
      if (o !== m && o.name && (hide.size || o.userData.raeaHidden)) {
        o.visible = !hide.has(o.name);
        o.userData.raeaHidden = hide.has(o.name);
      }
    });
    // the clip (or a blend of clips) at its time: `time` seconds, or the composition's time, looping unless told not to
    this.mixer.stopAllAction();
    const t = typeof p.time === "number" ? p.time : this.seconds;
    const loop = p.loop !== false;
    const play = (c: THREE.AnimationClip | undefined, at: number, weight: number) => {
      if (!c) return;
      const a = this.mixer!.clipAction(c);
      a.play();
      a.setEffectiveWeight(weight);
      a.time = loop ? ((at % c.duration) + c.duration) % c.duration : Math.min(at, c.duration);
    };
    const blend = p.animations as { clip: string | number; time?: number; weight?: number }[] | undefined;
    if (blend) for (const b of blend) play(this.clip(b.clip), b.time ?? t, b.weight ?? 1);
    else if (p.animation !== undefined) play(this.clip(p.animation as string | number), t, 1);
    this.mixer.update(0);
    // morph weights by target name or index, on every mesh that has them
    const morphs = p.morphs as Record<string, number> | number[] | undefined;
    if (morphs) {
      m.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (!mesh.morphTargetInfluences) return;
        if (Array.isArray(morphs)) morphs.forEach((w, i) => { if (i < mesh.morphTargetInfluences!.length) mesh.morphTargetInfluences![i] = w; });
        else for (const [k, w] of Object.entries(morphs)) {
          const i = mesh.morphTargetDictionary?.[k];
          if (i !== undefined) mesh.morphTargetInfluences[i] = w;
        }
      });
    }
    // re-covered: a material child (or <Refinish>) on every glTF material, or on the one it names
    if (this.refinish.length) {
      m.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (!mesh.isMesh) return;
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        mats.forEach((mat) => {
          const spec = this.refinish.find((r) => r.material === mat.name) ?? this.refinish.find((r) => r.material === undefined);
          if (!spec) return;
          if (mat.userData.raeaOwn) return paint(mat, spec, true);
          const own = mat.clone();
          own.userData.raeaOwn = true;
          if (Array.isArray(mesh.material)) mesh.material[mesh.material.indexOf(mat)] = own;
          else mesh.material = own;
          paint(own, spec, true);
        });
      });
    }
  }

  dispose() {
    this.mixer?.stopAllAction();
    this.root.removeFromParent();
  }
}

// ---- a picture on a card (ImagePlane), unlit ----
export function imagePlane(had: THREE.Mesh | undefined, p: Props): THREE.Mesh {
  const src = p.src as string;
  const mat = (had?.material as THREE.MeshBasicMaterial | undefined) ?? new THREE.MeshBasicMaterial({ transparent: true, side: THREE.DoubleSide, toneMapped: false });
  const mesh = had ?? new THREE.Mesh(new THREE.PlaneGeometry(1, 1), mat);
  const base = texture(src, true);
  const grid = p.grid as [number, number] | undefined;
  let map = base;
  if (grid) {
    map = base.clone();
    map.source = base.source;
    const n = grid[0] * grid[1];
    const cell = ((Math.round((p.frame as number) ?? 0) % n) + n) % n;
    map.repeat.set(1 / grid[0], 1 / grid[1]);
    map.offset.set((cell % grid[0]) / grid[0], 1 - (Math.floor(cell / grid[0]) + 1) / grid[1]);
    map.needsUpdate = true;
  }
  if (mat.map !== map) mat.map = map;
  if (p.cutout) {
    mat.alphaTest = 0.5;
    mat.transparent = false;
  }
  // its height follows the picture (one cell's) unless given
  const w = (p.width as number) ?? 1;
  const img = base.image as { width?: number; height?: number } | undefined;
  const aspect = img?.width && img.height ? (img.height * (grid ? grid[0] : 1)) / (img.width * (grid ? grid[1] : 1)) : 1;
  const h = (p.height as number) ?? w * aspect;
  mesh.geometry.dispose();
  mesh.geometry = new THREE.PlaneGeometry(w, h);
  mesh.castShadow = p.shadow !== false;
  place(mesh, p);
  mat.needsUpdate = true;
  return mesh;
}

// ---- instanced copies: `at` packs 9 numbers a copy (position, rotation XYZ, scale) ----
export function instanced(had: THREE.InstancedMesh | undefined, geometry: THREE.BufferGeometry, material: THREE.Material, at: number[]): THREE.InstancedMesh {
  const n = Math.floor(at.length / 9);
  const m = had && had.count === n ? had : new THREE.InstancedMesh(geometry, material, n);
  m.geometry = geometry;
  m.material = material;
  const o = new THREE.Object3D();
  for (let i = 0; i < n; i++) {
    const k = i * 9;
    o.position.set(at[k], at[k + 1], at[k + 2]);
    o.rotation.set(at[k + 3], at[k + 4], at[k + 5], "XYZ");
    o.scale.set(at[k + 6], at[k + 7], at[k + 8]);
    o.updateMatrix();
    m.setMatrixAt(i, o.matrix);
  }
  m.instanceMatrix.needsUpdate = true;
  m.castShadow = m.receiveShadow = true;
  return m;
}

// ---- a Gizmo (an Entity with Bevy's retained gizmo component): its lines ----
export function gizmoLines(value: Props): THREE.Group {
  const handle = (value.handle ?? {}) as { list_positions?: number[][]; strip_positions?: (number[] | null)[]; color?: string; list_colors?: string[]; strip_colors?: string[] };
  const g = new THREE.Group();
  const depthTest = ((value.depth_bias as number) ?? 0) > -1;
  const line = (pts: number[][], colours: string[] | undefined, segments: boolean) => {
    const geo = new THREE.BufferGeometry().setFromPoints(pts.map((p) => new THREE.Vector3(...p)));
    if (colours) geo.setAttribute("color", new THREE.Float32BufferAttribute(colours.flatMap((c) => new THREE.Color(c).toArray()), 3));
    const mat = new THREE.LineBasicMaterial({ color: colours ? "#ffffff" : handle.color ?? "#ffffff", vertexColors: !!colours, depthTest });
    g.add(segments ? new THREE.LineSegments(geo, mat) : new THREE.Line(geo, mat));
  };
  if (handle.list_positions?.length) line(handle.list_positions, handle.list_colors, true);
  // a strip broken at each null
  let run: number[][] = [], cs: string[] = [];
  (handle.strip_positions ?? []).forEach((p, i) => {
    if (p === null) {
      if (run.length > 1) line(run, handle.strip_colors ? cs : undefined, false);
      run = [];
      cs = [];
    } else {
      run.push(p);
      if (handle.strip_colors) cs.push(handle.strip_colors[i]);
    }
  });
  if (run.length > 1) line(run, handle.strip_colors ? cs : undefined, false);
  return g;
}

// ---- a Decal: a card lying on the surface at its place, facing out along `normal` ----
export function decal(had: THREE.Mesh | undefined, p: Props): THREE.Mesh {
  const mat = (had?.material as THREE.MeshStandardMaterial | undefined) ?? new THREE.MeshStandardMaterial({ transparent: true, polygonOffset: true, polygonOffsetFactor: -4, depthWrite: false });
  const size = p.size;
  const [w, h] = Array.isArray(size) ? size : [(size as number) ?? 1, (size as number) ?? 1];
  const mesh = had ?? new THREE.Mesh(new THREE.PlaneGeometry(1, 1), mat);
  mesh.geometry.dispose();
  mesh.geometry = new THREE.PlaneGeometry(w, h);
  paint(mat, { map: p.src, normalMap: p.normalMap, color: p.color ?? "#ffffff", opacity: p.opacity ?? 1, roughness: p.roughness ?? 0.6, metalness: p.metalness ?? 0, transparent: true });
  const n = new THREE.Vector3(...(vec(p.normal) ?? [0, 0, 1])).normalize();
  mesh.position.set(...(vec(p.position) ?? [0, 0, 0]));
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), n).multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), (p.spin as number) ?? 0));
  return mesh;
}
