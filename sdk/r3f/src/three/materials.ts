// raea's surfaces as three.js materials. The SDK already speaks three's names (color, roughness, metalness, emissive,
// clearcoat, transmission ...), so a prop of the same name is set as it is; raea's own (alphaMode, side as a word, map
// paths, repeat, uvTransform, samplers, attenuation, anisotropy, toon steps) are translated here.
import * as THREE from "three";

type Props = Record<string, unknown>;

export const MATERIAL: Record<string, () => THREE.Material> = {
  MeshStandardMaterial: () => new THREE.MeshStandardMaterial(),
  MeshPhysicalMaterial: () => new THREE.MeshPhysicalMaterial(),
  MeshBasicMaterial: () => new THREE.MeshBasicMaterial(),
  MeshToonMaterial: () => new THREE.MeshToonMaterial(),
};

const loader = new THREE.TextureLoader();
const textures = new Map<string, THREE.Texture>();

/** a picture as a texture, loaded once a path; colour pictures are sRGB, data (normals, roughness) linear */
export function texture(src: string, colour: boolean): THREE.Texture {
  const key = `${colour ? "c" : "d"}:${src}`;
  let t = textures.get(key);
  if (!t) {
    t = loader.load(src);
    t.colorSpace = colour ? THREE.SRGBColorSpace : THREE.NoColorSpace;
    textures.set(key, t);
  }
  return t;
}

const WRAP: Record<string, THREE.Wrapping> = { repeat: THREE.RepeatWrapping, clamp: THREE.ClampToEdgeWrapping, mirror: THREE.MirroredRepeatWrapping };

/** a map's placement and sampler from the material's props: a texture per placement, so two meshes sharing a picture
 * at different repeats each get their own */
function placed(base: THREE.Texture, p: Props, which: string): THREE.Texture {
  const r = p.repeat as [number, number] | undefined;
  const uvt = p.uvTransform as { offset?: [number, number]; rotation?: number; scale?: [number, number] } | undefined;
  const s = ((p.samplers as Record<string, Props> | undefined)?.[which] ?? p.sampler) as { filter?: string; wrap?: string | [string, string]; anisotropy?: number } | undefined;
  if (!r && !uvt && !s) return base;
  const t = base.clone();
  t.source = base.source;
  const [ws, wt] = Array.isArray(s?.wrap) ? s.wrap : [s?.wrap ?? (r ? "repeat" : "clamp"), s?.wrap ?? (r ? "repeat" : "clamp")];
  t.wrapS = WRAP[ws] ?? THREE.ClampToEdgeWrapping;
  t.wrapT = WRAP[wt] ?? THREE.ClampToEdgeWrapping;
  if (s?.filter === "nearest") t.magFilter = t.minFilter = THREE.NearestFilter;
  if (s?.anisotropy) t.anisotropy = s.anisotropy;
  if (uvt) {
    t.offset.set(...(uvt.offset ?? [0, 0]));
    t.rotation = uvt.rotation ?? 0;
    t.repeat.set(...(uvt.scale ?? [1, 1]));
  } else if (r) t.repeat.set(r[0], r[1]);
  t.needsUpdate = true;
  return t;
}

const MAPS: [string, string, boolean][] = [
  ["map", "map", true], ["emissiveMap", "emissiveMap", true], ["normalMap", "normalMap", false], ["roughnessMap", "roughnessMap", false],
  ["metalnessMap", "metalnessMap", false], ["aoMap", "aoMap", false], ["depthMap", "displacementMap", false],
];

const SIDE: Record<string, THREE.Side> = { front: THREE.FrontSide, back: THREE.BackSide, double: THREE.DoubleSide };

/** a gradient of `steps` even bands, or raea's explicit bands, for MeshToonMaterial */
function toonGradient(p: Props): THREE.DataTexture {
  const bands = p.bands as { at: number }[] | undefined;
  const n = bands?.length ?? Math.max(1, Math.min(8, (p.steps as number) ?? 2));
  const data = new Uint8Array(n);
  for (let i = 0; i < n; i++) data[i] = Math.round(((bands ? bands[i].at : n === 1 ? 1 : i / (n - 1)) || 0.05) * 255);
  const t = new THREE.DataTexture(data, n, 1, THREE.RedFormat);
  t.magFilter = t.minFilter = THREE.NearestFilter;
  t.needsUpdate = true;
  return t;
}

/** raea's material props set on a three material; `over` (a model re-covered) changes only what the props name, so
 * a glTF material keeps its own pictures unless one is given (or `map: null` takes it off) */
export function paint(m: THREE.Material, p: Props, over = false) {
  const target = m as unknown as Record<string, unknown>;
  for (const [k, v] of Object.entries(p)) {
    const have = target[k];
    if (have instanceof THREE.Color && typeof v === "string") have.set(v);
    else if ((typeof v === "number" || typeof v === "boolean") && (typeof have === "number" || typeof have === "boolean")) target[k] = v;
  }
  // a Bevy StandardMaterial's emissive strength (bevy3d materials.tsx: `emissive_nits`, as the engine draws it,
  // core/scene emissive_power): in three's units already, since a StandardMaterial's emissive skips the camera exposure
  if (typeof p.emissive_nits === "number" && typeof target.emissiveIntensity === "number") target.emissiveIntensity = p.emissive_nits;
  for (const [from, to, colour] of MAPS) {
    if (!(to in target) || (over && !(from in p))) continue;
    const src = p[from];
    target[to] = typeof src === "string" ? placed(texture(src, colour), p, from) : null;
  }
  if (typeof p.metallicRoughnessMap === "string" && "roughnessMap" in target) {
    const t = placed(texture(p.metallicRoughnessMap, false), p, "metallicRoughnessMap");
    target.roughnessMap = target.metalnessMap = t;
  }
  if (over) {
    m.needsUpdate = true;
    return;
  }
  m.side = SIDE[p.side as string] ?? THREE.FrontSide;
  const mode = p.alphaMode as string | undefined;
  m.transparent = p.transparent === true || (typeof p.opacity === "number" && p.opacity < 1) || mode === "blend" || mode === "add" || mode === "multiply" || mode === "premultiplied";
  m.alphaTest = mode === "mask" ? ((p.alphaCutoff as number) ?? 0.5) : 0;
  m.alphaToCoverage = mode === "coverage";
  m.blending = mode === "add" ? THREE.AdditiveBlending : mode === "multiply" ? THREE.MultiplyBlending : THREE.NormalBlending;
  m.premultipliedAlpha = mode === "premultiplied" || mode === "multiply";
  if ("fog" in target) target.fog = p.fog !== false;
  if (m instanceof THREE.MeshPhysicalMaterial) {
    const att = p.attenuation as { distance?: number; color?: string } | undefined;
    m.attenuationDistance = att?.distance ?? Infinity;
    if (att?.color) m.attenuationColor.set(att.color);
    const an = p.anisotropy as number | { strength?: number; rotation?: number } | undefined;
    m.anisotropy = typeof an === "number" ? an : an?.strength ?? 0;
    m.anisotropyRotation = typeof an === "object" ? an.rotation ?? 0 : 0;
    // Bevy's reflectance 0.5 is three's specularIntensity 1 (4% at normal incidence)
    m.specularIntensity = typeof p.reflectance === "number" ? Math.min(1, p.reflectance / 0.5) : 1;
    if (typeof p.specularTint === "string") m.specularColor.set(p.specularTint);
  }
  if (m instanceof THREE.MeshToonMaterial) {
    m.gradientMap?.dispose();
    m.gradientMap = toonGradient(p);
  }
  m.needsUpdate = true;
}

/** whether a material's vertex colours should show (its mesh has them) */
export function vertexColoured(m: THREE.Material, has: boolean) {
  if (m.vertexColors !== has) {
    m.vertexColors = has;
    m.needsUpdate = true;
  }
}
