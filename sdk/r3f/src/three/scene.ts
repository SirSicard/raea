// raea's 3D drawn by three.js: every `data-3d` element the SDK's components render (kind and JSON props, as raea's
// engine reads them) becomes a three.js object, kept per element and changed only when its props do. sdk/playable's
// host and <Raea> (in React Three Fiber) both draw with this. kinds.ts lists what each kind becomes; frame effects are
// listed in `effects` for the app's own composer and kinds only raea's engine runs are named once.
import * as THREE from "three";
import { EXRLoader } from "three/examples/jsm/loaders/EXRLoader.js";
import { HDRLoader } from "three/examples/jsm/loaders/HDRLoader.js";
import type { Sky } from "three/examples/jsm/objects/Sky.js";
import { paintLook, paintTone } from "./paint";
import { fire, flat, grass, placeFlat, plateTexture, richText, screenCard, sky, splatPoints } from "./extras";
import { GEOMETRY, geometryOfShape, shapesReady } from "./geometry";
import { KINDS, PRIMITIVES } from "./kinds";
import { TONE, fitCamera, makeLight, setCamera, setLight, vec } from "./lights";
import { MATERIAL, paint, texture, vertexColoured } from "./materials";
import { shaderMaterial } from "./shader";
import { ModelPart, decal, gizmoLines, imagePlane, instanced, place } from "./things";
import { EXPOSURE } from "../units";

type Props = Record<string, unknown>;

interface Kept {
  kind: string;
  json: string;
  obj?: THREE.Object3D;
  geometry?: THREE.BufferGeometry;
  material?: THREE.Material;
  model?: ModelPart;
  /** a Model's copies past the first (its `at`), each a model of its own */
  copies?: ModelPart[];
  /** a solid waiting for the shape module */
  waiting?: boolean;
  /** <Entities>: a mesh per entity id, and the shape it was made from */
  entities?: Map<number, { mesh: THREE.Mesh; shape: string }>;
  /** <Grass>: the field it was made from */
  made?: string;
}

/** what raea's settings make of the renderer: apply() sets them */
export interface Settings {
  toneMapping: THREE.ToneMapping;
  /** raea's default, TonyMcMapface: three has no such curve, so the composer draws it (effects.ts); toneMapping is
   * AgX, its nearest, for a renderer drawing without the composer */
  tony: boolean;
  exposure: number;
  shadows: boolean;
  shadowMap: number;
}

const CONTAINERS = new Set(["Group", "Entity", "Mesh"]);
const GIZMO = "bevy_gizmos::retained::Gizmo";
const envLoaders = { hdr: new HDRLoader(), exr: new EXRLoader() };
const envs = new Map<string, THREE.Texture>();

/** panoramas that have loaded: three builds the environment's shaders from its size, so one still loading isn't lit by
 * (an HDR's texture before its data arrives compiles every lit material's shader wrong, and they draw nothing) */
const ready = new WeakSet<THREE.Texture>();

/** what each panorama still loading should do once it has: every page that asked for it, not only the first */
const waiting = new Map<THREE.Texture, Set<() => void>>();
function panorama(src: string, done: () => void): THREE.Texture {
  let t = envs.get(src);
  if (t) {
    if (!ready.has(t)) waiting.get(t)?.add(done);
    return t;
  }
  const loaded = () => {
    ready.add(t!);
    for (const f of waiting.get(t!) ?? []) f();
    waiting.delete(t!);
  };
  const ext = src.split("?")[0].split(".").pop()!.toLowerCase();
  try {
    t = ext === "hdr" || ext === "exr" ? envLoaders[ext].load(src, loaded) : texture(src, true);
    if (!(ext === "hdr" || ext === "exr")) ready.add(t);
  } catch (e) {
    console.warn(`raea/r3f: Environment ${src} couldn't be loaded: ${String(e)}`);
    t = new THREE.Texture();
  }
  t.mapping = THREE.EquirectangularReflectionMapping;
  envs.set(src, t);
  if (!ready.has(t)) waiting.set(t, new Set([done]));
  return t;
}

/** The three.js side of one page: call sync(root, seconds) after each React commit, then apply() and draw. */
export class Scene3d {
  readonly scene = new THREE.Scene();
  camera: THREE.Camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
  settings: Settings = { toneMapping: THREE.AgXToneMapping, tony: true, exposure: 1, shadows: true, shadowMap: 2048 };
  /** the frame effects on the page (Bloom, DepthOfField, Outline ...), each kind's props: the app's composer draws them */
  effects: { kind: string; props: Props }[] = [];
  /** whether the page drew any 3D at the last sync */
  any = false;
  /** called when something loaded later (a model, a panorama): draw again */
  onLoad: () => void = () => {};
  private kept = new Map<Element, Kept>();
  private warned = new Set<string>();
  private flats = new Set<THREE.Mesh>();
  private width = 1;
  private height = 1;
  private seconds = 0;
  private cameraEl?: Element;

  sync(root: Element, seconds = this.seconds) {
    this.seconds = seconds;
    const seen = new Set<Element>();
    const nodes = root.querySelectorAll("[data-3d]");
    this.any = nodes.length > 0;
    this.effects = [];
    this.cameraEl = undefined;
    for (const el of nodes) {
      seen.add(el);
      const kind = el.getAttribute("data-3d")!;
      const json = (el.getAttribute("data-props") ?? "{}") + "|" + (el.getAttribute("data-shape") ?? "");
      const status = KINDS[kind]?.status;
      if (status === "effect") this.effects.push({ kind, props: JSON.parse(el.getAttribute("data-props") ?? "{}") as Props });
      let k = this.kept.get(el);
      // a model's clip and a fire's flicker move with time though their props don't
      const timed = kind === "Model" || kind === "Fire" || kind === "Plate";
      if (k && k.kind === kind && k.json === json && !timed && !(k.waiting && shapesReady())) continue;
      if (k && k.kind !== kind) {
        this.drop(k);
        k = undefined;
      }
      k = this.update(el, kind, JSON.parse(el.getAttribute("data-props") ?? "{}") as Props, k);
      k.json = json;
      this.kept.set(el, k);
    }
    for (const [el, k] of this.kept) {
      if (!seen.has(el)) {
        this.drop(k);
        this.kept.delete(el);
      }
    }
    // a paint look is in the surfaces (paint.ts); the frame pass only draws its cells
    paintLook(this.scene, this.effects.find((e) => e.kind === "Look")?.props);
    this.fit(this.width, this.height);
  }

  private warnOnce(kind: string, why: string) {
    if (this.warned.has(kind)) return;
    this.warned.add(kind);
    console.warn(`raea/r3f: ${kind} ${why}`);
  }

  /** the object a part hangs from: the nearest enclosing Group, Entity or Mesh, else the scene */
  private parentOf(el: Element): THREE.Object3D {
    for (let a = el.parentElement?.closest("[data-3d]"); a; a = a.parentElement?.closest("[data-3d]")) {
      const k = this.kept.get(a);
      if (k?.obj && CONTAINERS.has(k.kind)) return k.obj;
    }
    return this.scene;
  }

  /** the nearest enclosing part, of any kind */
  private ownerOf(el: Element): Kept | undefined {
    const a = el.parentElement?.closest("[data-3d]");
    return a ? this.kept.get(a) : undefined;
  }

  private hang(k: Kept, el: Element, o: THREE.Object3D) {
    if (k.obj !== o) {
      k.obj?.removeFromParent();
      k.obj = o;
    }
    if (!o.parent) this.parentOf(el).add(o);
  }

  private update(el: Element, kind: string, p: Props, k: Kept | undefined): Kept {
    k ??= { kind, json: "" };
    const owner = this.ownerOf(el);
    switch (kind) {
      case "Group":
      case "Entity": {
        const g = (k.obj as THREE.Group | undefined) ?? new THREE.Group();
        const t = p.transform as { translation?: number[]; rotation?: number[]; scale?: number[] } | undefined;
        place(g, t ? { position: t.translation, quaternion: t.rotation, scale: t.scale } : p);
        this.hang(k, el, g);
        return k;
      }
      case "Entities": {
        // a world's entities (World.scene(): world space, parents composed): each Mesh entity a mesh of its shape with
        // a standard surface, as the engine reads them (runtime/react scene/read.rs); its lights aren't drawn there either
        const g = (k.obj as THREE.Group | undefined) ?? new THREE.Group();
        this.hang(k, el, g);
        const kept = (k.entities ??= new Map());
        const seen = new Set<number>();
        k.waiting = false;
        for (const n of (p.scene as { id: number; kind: string; mesh?: Props; position?: number[]; rotation?: number[]; scale?: number }[] | undefined) ?? []) {
          if (n.kind !== "Mesh") continue;
          seen.add(n.id);
          const shape = typeof n.mesh?.shape === "string" ? n.mesh.shape : "";
          let e = kept.get(n.id);
          if (!e || e.shape !== shape) {
            const geometry = geometryOfShape(shape);
            if (!geometry) {
              k.waiting = true;
              this.warnOnce("Entities shape", "is a solid: load raea's shape module (loadShapes) to draw it");
              continue;
            }
            e?.mesh.removeFromParent();
            const mesh = new THREE.Mesh(geometry, e?.mesh.material ?? new THREE.MeshStandardMaterial());
            mesh.castShadow = mesh.receiveShadow = true;
            g.add(mesh);
            e = { mesh, shape };
            kept.set(n.id, e);
          }
          place(e.mesh, { position: n.position, rotation: n.rotation, scale: n.scale });
          const { color, roughness, metalness } = n.mesh ?? {};
          paint(e.mesh.material as THREE.Material, { color, roughness, metalness }, true);
        }
        for (const [id, e] of kept) if (!seen.has(id)) (e.mesh.removeFromParent(), kept.delete(id));
        return k;
      }
      case "Mesh": {
        // its shape: a primitive child (three's own), else its data-shape (a buffer, or a solid for the shape module)
        const shape = el.getAttribute("data-shape");
        const primitive = [...el.children].some((c) => PRIMITIVES.includes(c.getAttribute("data-3d") ?? ""));
        const fromShape = primitive ? undefined : geometryOfShape(shape);
        k.waiting = !primitive && !!shape && !fromShape;
        if (k.waiting) this.warnOnce("Mesh shape", "is a solid: load raea's shape module (loadShapes) to draw it");
        const at = p.at as number[] | undefined;
        const had = k.obj as THREE.Mesh | undefined;
        const geometry = fromShape ?? had?.geometry ?? new THREE.BufferGeometry();
        const material = (had?.material as THREE.Material | undefined) ?? new THREE.MeshStandardMaterial();
        const m = at ? instanced(had instanceof THREE.InstancedMesh ? had : undefined, geometry, material, at) : had && !(had instanceof THREE.InstancedMesh) ? had : new THREE.Mesh(geometry, material);
        m.geometry = geometry;
        place(m, p);
        // shadow="only": it casts its shadow and isn't seen
        const only = p.shadow === "only";
        m.castShadow = only || (p.shadow !== false && p.castShadow !== false);
        m.receiveShadow = !only && p.receiveShadow !== false;
        material.colorWrite = material.depthWrite = !only;
        vertexColoured(material, !!geometry.attributes.color);
        this.hang(k, el, m);
        return k;
      }
      case "BufferMesh":
      case "Text3D":
        return k; // the Mesh's data-shape carries them
      case "Model": {
        if (!k.model) {
          k.model = new ModelPart(p.src as string, () => this.onLoad());
          this.parentOf(el).add(k.model.root);
          k.obj = k.model.root;
        }
        const own = [...el.querySelectorAll(":scope > [data-3d$='Material']")].map((m) => JSON.parse(m.getAttribute("data-props") ?? "{}") as Props);
        const re = el.closest("[data-3d='Refinish']");
        const outer = re ? ((JSON.parse(re.getAttribute("data-props") ?? "{}") as Props).materials as Props[]) : [];
        const mats = [...own, ...outer];
        // `at`: a copy for each 9 numbers (position, rotation, scale), the same model, clips and materials
        const at = Array.isArray(p.at) ? (p.at as number[]) : [];
        const n = Math.floor(at.length / 9);
        const placed = (i: number): Props => ({ ...p, at: undefined, position: at.slice(i * 9, i * 9 + 3), rotation: at.slice(i * 9 + 3, i * 9 + 6), quaternion: undefined, scale: at.slice(i * 9 + 6, i * 9 + 9) });
        k.model.set(n ? placed(0) : p, this.seconds, mats);
        k.copies ??= [];
        while (k.copies.length > Math.max(0, n - 1)) k.copies.pop()!.dispose();
        while (k.copies.length < n - 1) {
          const c = new ModelPart(p.src as string, () => this.onLoad());
          this.parentOf(el).add(c.root);
          k.copies.push(c);
        }
        k.copies.forEach((c, i) => c.set(placed(i + 1), this.seconds, mats));
        return k;
      }
      case "Refinish":
        return k; // read by the models inside it
      case "ImagePlane":
        this.hang(k, el, imagePlane(k.obj as THREE.Mesh | undefined, p));
        return k;
      case "Decal":
        this.hang(k, el, decal(k.obj as THREE.Mesh | undefined, p));
        return k;
      case "PerspectiveCamera":
        // one camera: the first
        if (this.cameraEl) return k;
        this.cameraEl = el;
        this.camera = setCamera(this.camera, p);
        return k;
      case "Fog": {
        const color = typeof p.color === "string" ? p.color : "#000000";
        this.scene.fog = typeof p.density === "number" ? new THREE.FogExp2(color, p.density) : new THREE.Fog(color, typeof p.near === "number" ? p.near : 5, typeof p.far === "number" ? p.far : 20);
        return k;
      }
      case "ToneMapping":
        this.settings.toneMapping = TONE[(p.mode as string) ?? "tony"] ?? THREE.AgXToneMapping;
        this.settings.tony = ((p.mode as string) ?? "tony") === "tony";
        this.settings.exposure = 2 ** ((p.exposure as number) ?? 0);
        return k;
      case "Shadows":
        this.settings.shadows = true;
        if (typeof p.mapSize === "number") this.settings.shadowMap = p.mapSize;
        return k;
      case "AntiAliasing":
      case "Canvas3D":
        return k;
      case "Environment": {
        const src = p.src as string;
        // attached once it has loaded (a cube-UV map made from an empty texture fails to compile), by this page's
        // next sync or, if the rows don't change, here
        const t = panorama(src, () => {
          const env = this.scene.userData.raeaEnvironment as { src: string; intensity: number; background: boolean } | undefined;
          if (env?.src === src) {
            if (env.intensity > 0) this.scene.environment = t;
            if (env.background) this.scene.background = t;
          }
          this.onLoad();
        });
        // for the source export (../export): the panorama as raea gave it
        this.scene.userData.raeaEnvironment = { src, intensity: (p.intensity as number) ?? 1, rotation: (p.rotation as number) ?? 0, background: !!p.background, backgroundIntensity: (p.backgroundIntensity as number) ?? (p.intensity as number) ?? 1 };
        const intensity = ((p.intensity as number) ?? 1) * 1000 * EXPOSURE;
        this.scene.environment = intensity > 0 && ready.has(t) ? t : null;
        this.scene.environmentIntensity = intensity;
        this.scene.environmentRotation.set(0, (p.rotation as number) ?? 0, 0);
        if (p.background && ready.has(t)) {
          this.scene.background = t;
          this.scene.backgroundIntensity = ((p.backgroundIntensity as number) ?? (p.intensity as number) ?? 1) * 1000 * EXPOSURE;
          this.scene.backgroundRotation.set(0, (p.rotation as number) ?? 0, 0);
        }
        return k;
      }
      case "Atmosphere": {
        const sun = [...this.kept.values()].find((x) => x.obj instanceof THREE.DirectionalLight)?.obj as THREE.DirectionalLight | undefined;
        const from = sun ? sun.position.clone().sub(sun.target.position) : undefined;
        this.hang(k, el, sky(k.obj as Sky | undefined, from, p));
        return k;
      }
      case "Fire":
        this.hang(k, el, fire(k.obj as THREE.Group | undefined, p, this.seconds));
        return k;
      case "Grass": {
        // made once per field (its grids are thousands of numbers), near the eye in full and thinned beyond
        const json = JSON.stringify(p.spec ?? null);
        if (k.obj && k.made === json) return k;
        k.obj?.removeFromParent();
        k.made = json;
        const g = grass(p, this.camera.position);
        if (g) this.hang(k, el, g);
        return k;
      }
      case "Splat": {
        if (!k.obj) {
          const holder = new THREE.Group();
          this.hang(k, el, holder);
          void splatPoints(p.src as string).then((pts) => { holder.add(pts); this.onLoad(); }, () => this.warnOnce("Splat", `couldn't load ${String(p.src)}`));
        }
        place(k.obj!, p);
        return k;
      }
      case "Sprite":
      case "Shape2D": {
        const m = flat(k.obj as THREE.Mesh | undefined, kind, p);
        this.flats.add(m);
        if (!m.parent) this.scene.add(m);
        k.obj = m;
        return k;
      }
      case "RichText":
        this.hang(k, el, richText(k.obj as THREE.Mesh | undefined, p));
        return k;
      case "Plate": {
        const t = plateTexture(p.src as string, typeof p.time === "number" ? p.time : this.seconds);
        if (t) this.scene.background = t;
        return k;
      }
      case "Screen":
        this.hang(k, el, screenCard(k.obj as THREE.Mesh | undefined, p));
        return k;
      case "BevyComponent":
        if (p.type === GIZMO && owner?.obj) {
          k.obj?.removeFromParent();
          k.obj = gizmoLines(p.value as Props);
          owner.obj.add(k.obj);
        } else this.warnOnce(`BevyComponent ${String(p.type)}`, "is Bevy's: it runs in raea's engine only");
        return k;
    }
    if (kind in GEOMETRY) {
      const mesh = owner?.obj instanceof THREE.Mesh ? owner.obj : undefined;
      if (mesh) {
        k.geometry?.dispose();
        k.geometry = GEOMETRY[kind](Array.isArray(p.args) ? (p.args as number[]) : []);
        mesh.geometry = k.geometry;
      }
      return k;
    }
    if (kind === "ThreeShaderMaterial") {
      const mesh = owner?.obj instanceof THREE.Mesh ? owner.obj : undefined;
      k.material = shaderMaterial(k.material, p);
      if (mesh) mesh.material = k.material;
      return k;
    }
    if (kind in MATERIAL) {
      // a material inside a Model re-covers it (read there)
      if (owner?.kind === "Model") return k;
      const mesh = owner?.obj instanceof THREE.Mesh ? owner.obj : undefined;
      // shadow="catch": only the shadows falling on it, in this material's colour and opacity (three's ShadowMaterial)
      const catches = !!mesh && (JSON.parse(el.parentElement?.getAttribute("data-props") ?? "{}") as Props).shadow === "catch";
      const make = catches ? () => new THREE.ShadowMaterial({ transparent: true }) : MATERIAL[kind];
      if (!k.material || k.material.type !== (catches ? "ShadowMaterial" : MATERIAL[kind]().type)) {
        k.material?.dispose();
        k.material = make();
      }
      if (catches) {
        const s = k.material as THREE.ShadowMaterial;
        s.color.set((p.color as string | undefined) ?? "#000000");
        s.opacity = typeof p.opacity === "number" ? p.opacity : 1;
        mesh.material = s;
        return k;
      }
      if (mesh) {
        mesh.material = k.material;
        vertexColoured(k.material, !!mesh.geometry.attributes.color);
      }
      paint(k.material, p);
      return k;
    }
    if (kind.endsWith("Light")) {
      const l = (k.obj as THREE.Light | undefined) ?? makeLight(kind);
      if (!l) return k;
      // a light is an entity like any other: inside a moved Entity it moves with it (its position and its target are
      // in the parent's frame, as Bevy's Transform is)
      if (!k.obj) k.obj = l;
      if (!l.parent) this.parentOf(el).add(l);
      setLight(l, kind, p, this.scene, this.settings.shadowMap);
      const target = (l as THREE.SpotLight).target as THREE.Object3D | undefined;
      if (target && l.parent && target.parent !== l.parent) l.parent.add(target);
      return k;
    }
    const status = KINDS[kind]?.status;
    if (status === "engine") this.warnOnce(kind, "is Bevy's (WESL, compute, ECS): it runs in raea's engine only");
    else if (status !== "effect") this.warnOnce(kind, "isn't a kind three.js draws");
    return k;
  }

  private drop(k: Kept) {
    k.obj?.removeFromParent();
    if (k.obj instanceof THREE.DirectionalLight || k.obj instanceof THREE.SpotLight) k.obj.target.removeFromParent();
    if (k.obj instanceof THREE.Mesh) this.flats.delete(k.obj);
    k.model?.dispose();
    for (const c of k.copies ?? []) c.dispose();
    k.geometry?.dispose();
    k.material?.dispose();
    if (k.kind === "Fog") this.scene.fog = null;
    if (k.kind === "Environment") {
      this.scene.environment = this.scene.background = null;
      delete this.scene.userData.raeaEnvironment;
    }
  }

  /** the camera (and the 2D cards in front of it) fitted to a drawing of this size in pixels */
  fit(width: number, height: number) {
    this.width = width;
    this.height = height;
    fitCamera(this.camera, width, height);
    this.camera.updateMatrixWorld();
    for (const m of this.flats) placeFlat(m, this.camera, width, height);
  }

  /** raea's settings on a renderer: tone mapping, exposure, shadows */
  apply(renderer: THREE.WebGLRenderer) {
    renderer.toneMapping = this.settings.toneMapping;
    // three's ACES scales its input by 1/0.6 (tonemapping_pars_fragment); Bevy's ACESFitted doesn't
    renderer.toneMappingExposure = this.settings.exposure * (this.settings.toneMapping === THREE.ACESFilmicToneMapping ? 0.6 : 1);
    paintTone.mode.value = !this.settings.tony && this.settings.toneMapping === THREE.ACESFilmicToneMapping ? 1 : 0;
    paintTone.exposure.value = renderer.toneMappingExposure;
    renderer.shadowMap.enabled = this.settings.shadows;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  }
}

export { vec };
