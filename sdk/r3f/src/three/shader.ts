// <ThreeShaderMaterial glsl={{vertex, fragment}}> on three.js: it came from three.js, so here it is three's own
// ShaderMaterial (RawShaderMaterial when `raw`), its uniforms set each frame from the props and its samplers loaded as
// pictures. A node material's WGSL (`wgsl`) is raea's engine's only; three draws that mesh in its `color`.
import * as THREE from "three";
import { texture } from "./materials";

type Props = Record<string, unknown>;

const BLEND: Record<string, THREE.Blending> = {
  normal: THREE.NormalBlending,
  additive: THREE.AdditiveBlending,
  add: THREE.AdditiveBlending,
  multiply: THREE.MultiplyBlending,
  none: THREE.NoBlending,
};
const SIDE: Record<string, THREE.Side> = { front: THREE.FrontSide, back: THREE.BackSide, double: THREE.DoubleSide };

function value(v: unknown): unknown {
  if (!Array.isArray(v)) return typeof v === "boolean" ? (v ? 1 : 0) : v;
  if (v.length === 2) return new THREE.Vector2(v[0], v[1]);
  if (v.length === 3) return new THREE.Vector3(v[0], v[1], v[2]);
  if (v.length === 4) return new THREE.Vector4(v[0], v[1], v[2], v[3]);
  if (v.length === 9) return new THREE.Matrix3().fromArray(v);
  if (v.length === 16) return new THREE.Matrix4().fromArray(v);
  return v;
}

/** the material for these props: the one it had while its source is the same (its uniforms updated), else a new one */
export function shaderMaterial(had: THREE.Material | undefined, p: Props): THREE.Material {
  const glsl = p.glsl as { vertex: string; fragment: string; raw?: boolean; vertexColors?: boolean } | undefined;
  if (!glsl) {
    const m = had instanceof THREE.MeshBasicMaterial ? had : new THREE.MeshBasicMaterial();
    m.color.set((p.color as string | undefined) ?? "#ff00ff");
    return m;
  }
  const key = `${glsl.raw ? 1 : 0}|${glsl.vertex}|${glsl.fragment}`;
  let m = had as THREE.ShaderMaterial | undefined;
  if (!m || m.userData.raeaShader !== key) {
    had?.dispose();
    m = new (glsl.raw ? THREE.RawShaderMaterial : THREE.ShaderMaterial)({ vertexShader: glsl.vertex, fragmentShader: glsl.fragment, uniforms: {} });
    m.userData.raeaShader = key;
  }
  m.vertexColors = !!glsl.vertexColors;
  for (const [k, v] of Object.entries((p.uniforms as Props | undefined) ?? {})) {
    const u = m.uniforms[k];
    const val = value(v);
    if (u && u.value instanceof THREE.Vector2 && Array.isArray(v)) (u.value as THREE.Vector2).fromArray(v as number[]);
    else if (u && (u.value instanceof THREE.Vector3 || u.value instanceof THREE.Vector4) && Array.isArray(v)) u.value.fromArray(v as number[]);
    else if (u) u.value = val;
    else m.uniforms[k] = { value: val };
  }
  for (const [k, v] of Object.entries((p.textures as Record<string, string | { src: string; colorSpace?: string }> | undefined) ?? {})) {
    const src = typeof v === "string" ? v : v.src;
    const colour = typeof v === "string" || v.colorSpace !== "linear";
    const t = texture(src, colour);
    if (m.uniforms[k]) m.uniforms[k].value = t;
    else m.uniforms[k] = { value: t };
  }
  const time = p.time as [number, number, number] | undefined;
  if (time) {
    for (const [k, i] of [["time", 0], ["uTime", 0], ["iTime", 0]] as const) if (k in m.uniforms) m.uniforms[k].value = time[i];
  }
  m.transparent = !!p.transparent;
  m.blending = BLEND[(p.blending as string | undefined) ?? "normal"] ?? THREE.NormalBlending;
  m.side = SIDE[(p.side as string | undefined) ?? "front"] ?? THREE.FrontSide;
  m.depthWrite = p.depthWrite !== undefined ? !!p.depthWrite : !p.transparent;
  m.depthTest = p.depthTest !== false;
  m.alphaTest = typeof p.alphaTest === "number" ? p.alphaTest : 0;
  // "display" (a ShaderMaterial's): its colour is what the canvas shows, past the tone curve
  m.toneMapped = p.output === "linear";
  return m;
}
