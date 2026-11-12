// raea's frame effects drawn by three.js (docs/r3f.feature R3F6): the effects a raea page asks for (Scene3d.effects)
// as an EffectComposer's passes, in Bevy's order: ambient occlusion, outlines, depth of field, bloom and motion blur on
// the scene's light; then tone mapping (OutputPass, the renderer's tone mapping and exposure); then the grade, the look
// and the lens on the picture. kinds.ts says where each differs from raea's engine.
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { BokehPass } from "three/examples/jsm/postprocessing/BokehPass.js";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass.js";
import { GTAOPass } from "three/examples/jsm/postprocessing/GTAOPass.js";
import { AfterimagePass } from "three/examples/jsm/postprocessing/AfterimagePass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import type { Pass } from "three/examples/jsm/postprocessing/Pass.js";
import { TONY_B64, TONY_N } from "./tony-lut";

export interface Effect {
  kind: string;
  props: Record<string, unknown>;
}

/** the effects three.js draws (the rest are listed by Scene3d.effects and named in kinds.ts) */
export const DRAWN_EFFECTS = ["AmbientOcclusion", "Outline", "DepthOfField", "Bloom", "MotionBlur", "Grade", "Look", "Fisheye", "LensDistortion"];

const num = (v: unknown, d: number) => (typeof v === "number" && Number.isFinite(v) ? v : d);
const VERT = "varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }";

/** <Grade> in the scene's light, before tone mapping, as Bevy draws it: its effect stack (colour fringes, the
 * vignette: bevy_post_process effect_stack), then the tone mapper's grading (white balance; saturation, contrast, gain,
 * lift and gamma per level of light, shadows below 0.2, highlights above 0.7, blended 0.1 either side:
 * bevy_core_pipeline tonemapping_shared.wgsl). `scale` takes three's linear colour to Bevy's (the exposure). */
const GRADE = `
uniform sampler2D tDiffuse; uniform float temperature, tint, aberration, scale;
uniform vec4 vig; uniform vec3 vigColor; uniform vec2 aspect;
uniform vec3 sat, con, gam, gai, lif;
varying vec2 vUv;
float luma(vec3 c) { return dot(c, vec3(0.2126, 0.7152, 0.0722)); }
void main() {
  vec2 d = vUv - 0.5;
  vec4 src = texture2D(tDiffuse, vUv);
  vec3 c = aberration > 0.0
    ? vec3(texture2D(tDiffuse, vUv - d * aberration).r, src.g, texture2D(tDiffuse, vUv + d * aberration).b)
    : src.rgb;
  c *= scale;
  vec2 sc = aspect / min(aspect.x, aspect.y);
  if (aspect.x >= aspect.y) sc.x *= aspect.y / aspect.x; else sc.y *= aspect.x / aspect.y;
  float dist = length(d * sc) / vig.y;
  float factor = pow(clamp(1.0 - dist * dist, 0.0, 1.0), vig.z);
  c = mix(c, vigColor * scale, (1.0 - factor) * vig.x);
  c = max(c * vec3(1.0 + temperature, 1.0 - tint * 0.5, 1.0 - temperature) / max(1.0, 1.0 + abs(temperature)), 0.0);
  float level = (c.r + c.g + c.b) / 3.0;
  vec3 lv = vec3(0.0);
  if (level < 0.1) lv.x = 1.0;
  else if (level < 0.3) { lv.y = (level - 0.2) * 5.0 + 0.5; lv.x = 1.0 - lv.y; }
  else if (level < 0.6) lv.y = 1.0;
  else if (level < 0.8) { lv.z = (level - 0.7) * 5.0 + 0.5; lv.y = 1.0 - lv.z; }
  else lv.z = 1.0;
  float l = luma(c);
  c = l + dot(lv, sat) * (c - l);
  c = 0.5 + (c - 0.5) * dot(lv, con);
  vec3 b = max(c * dot(lv, gai) + dot(lv, lif), 0.0);
  c = pow(b, vec3(1.0 / max(dot(lv, gam), 1e-3)));
  gl_FragColor = vec4(max(c, 0.0) / scale, src.a);
}`;

/** <Grade>'s saturation after tone mapping (Bevy's post_saturation) */
const SATURATE = `
uniform sampler2D tDiffuse; uniform float saturation;
varying vec2 vUv;
void main() {
  vec4 c = texture2D(tDiffuse, vUv);
  float l = dot(c.rgb, vec3(0.2126, 0.7152, 0.0722));
  gl_FragColor = vec4(mix(vec3(l), c.rgb, saturation), c.a);
}`;

/** the background colour under the frame, as raea clears to it: not through the bloom, grade or tone mapping (the
 * frame is drawn over a clear of nothing, its colours premultiplied) */
const UNDER = `
uniform sampler2D tDiffuse; uniform vec3 under;
varying vec2 vUv;
void main() {
  vec4 c = texture2D(tDiffuse, vUv);
  gl_FragColor = vec4(c.rgb + under * (1.0 - clamp(c.a, 0.0, 1.0)), 1.0);
}`;

/** TonyMcMapface, Bevy's default tone mapping, in place of three's OutputPass: the scene's light (times the exposure)
 * through Bevy's table, which holds the screen's sRGB values (bevy_core_pipeline tonemapping.wesl; sdk/playable's
 * host draws it the same way) */
const TONY = `
precision highp sampler3D;
uniform sampler2D tDiffuse; uniform sampler3D lut; uniform float exposure;
varying vec2 vUv;
void main() {
  vec4 c = texture2D(tDiffuse, vUv);
  vec3 x = max(c.rgb / max(c.a, 1e-5), vec3(0.0)) * exposure;
  vec3 uv = (x / (x + 1.0)) * (${TONY_N - 1}.0 / ${TONY_N}.0) + 0.5 / ${TONY_N}.0;
  gl_FragColor = vec4(texture(lut, clamp(uv, 0.0, 1.0)).rgb * c.a, c.a);
}`;

let tonyLut: THREE.Data3DTexture | undefined;
function tonyTable(): THREE.Data3DTexture {
  if (tonyLut) return tonyLut;
  const bytes = Uint8Array.from(atob(TONY_B64), (ch) => ch.charCodeAt(0));
  const n = TONY_N ** 3, rgba = new Uint8Array(n * 4);
  for (let i = 0; i < n; i++) rgba.set([bytes[i * 3], bytes[i * 3 + 1], bytes[i * 3 + 2], 255], i * 4);
  tonyLut = new THREE.Data3DTexture(rgba, TONY_N, TONY_N, TONY_N);
  tonyLut.minFilter = tonyLut.magFilter = THREE.LinearFilter;
  tonyLut.unpackAlignment = 1;
  tonyLut.needsUpdate = true;
  return tonyLut;
}

/** three r181 widened UnrealBloomPass's blur (mrdoob/three.js#31528: kernels 6 to 22, sigma a third of each), which
 * spreads the glow past Bevy's; raea's Bloom is matched to r180's (kernels 3 to 11, sigma the kernel, its composite and blend), put back here so
 * the glow is the same whichever three a project has (a no-op on r180 and before) */
/** r180's composite of the five blurs (three.js, MIT) */
const R180_COMPOSITE = /* glsl */ `varying vec2 vUv;
uniform sampler2D blurTexture1;
uniform sampler2D blurTexture2;
uniform sampler2D blurTexture3;
uniform sampler2D blurTexture4;
uniform sampler2D blurTexture5;
uniform float bloomStrength;
uniform float bloomRadius;
uniform float bloomFactors[NUM_MIPS];
uniform vec3 bloomTintColors[NUM_MIPS];
float lerpBloomFactor(const in float factor) {
  float mirrorFactor = 1.2 - factor;
  return mix(factor, mirrorFactor, bloomRadius);
}
void main() {
  gl_FragColor = bloomStrength * ( lerpBloomFactor(bloomFactors[0]) * vec4(bloomTintColors[0], 1.0) * texture2D(blurTexture1, vUv) +
    lerpBloomFactor(bloomFactors[1]) * vec4(bloomTintColors[1], 1.0) * texture2D(blurTexture2, vUv) +
    lerpBloomFactor(bloomFactors[2]) * vec4(bloomTintColors[2], 1.0) * texture2D(blurTexture3, vUv) +
    lerpBloomFactor(bloomFactors[3]) * vec4(bloomTintColors[3], 1.0) * texture2D(blurTexture4, vUv) +
    lerpBloomFactor(bloomFactors[4]) * vec4(bloomTintColors[4], 1.0) * texture2D(blurTexture5, vUv) );
}`;

function r180Blur(p: UnrealBloomPass): UnrealBloomPass {
  const mats = (p as unknown as { separableBlurMaterials: THREE.ShaderMaterial[] }).separableBlurMaterials;
  mats.forEach((m, i) => {
    const r = 3 + 2 * i;
    const c: number[] = [];
    for (let k = 0; k < r; k++) c.push((0.39894 * Math.exp((-0.5 * k * k) / (r * r))) / r);
    // r181's shader sums without dividing by the weights (r180's divided): the weights given summing to one are both
    const sum = c.reduce((x, y, k) => x + (k ? 2 * y : y), 0);
    m.defines.KERNEL_RADIUS = r;
    m.uniforms.gaussianCoefficients.value = c.map((x) => x / sum);
    m.needsUpdate = true;
  });
  // and r181 made the glow's additive blend premultiplied, its composite 3 times the blurs with their brightest channel
  // as alpha: r180's composite and blend again
  const own = p as unknown as { blendMaterial: THREE.ShaderMaterial; compositeMaterial: THREE.ShaderMaterial };
  own.blendMaterial.premultipliedAlpha = false;
  own.blendMaterial.needsUpdate = true;
  own.compositeMaterial.fragmentShader = R180_COMPOSITE;
  own.compositeMaterial.needsUpdate = true;
  return p;
}

/** Bevy's bloom is energy-conserving: the frame is mixed toward its blur by the intensity, not added to (this keeps
 * 1 - k of the frame; UnrealBloomPass adds k of the blur) */
const KEEP = `
uniform sampler2D tDiffuse; uniform float keep;
varying vec2 vUv;
void main() { vec4 c = texture2D(tDiffuse, vUv); gl_FragColor = vec4(c.rgb * keep, c.a); }`;

/** <Look>: cells of `pixelSize`; pixel keeps each cell's colour, site dithers it into six greys (keeping `color` of
 * its hue), ink into ink and paper with lines where the light steps; paint and cartoon are `bands` flat tones */
const LOOK = `
uniform sampler2D tDiffuse; uniform vec2 size; uniform float cell, mode, keep, lift, gain, line, threshold, band, bands;
uniform vec3 ink, paper; uniform float light;
varying vec2 vUv;
float luma(vec3 c) { return dot(c, vec3(0.2126, 0.7152, 0.0722)); }
float bayer2(vec2 a) { a = floor(a); return fract(a.x / 2.0 + a.y * a.y * 0.75); }
float bayer(vec2 a) { return (bayer2(0.25 * a) * 0.25 + bayer2(0.5 * a)) * 0.25 + bayer2(a); }
vec3 at(vec2 c) { return texture2D(tDiffuse, (c + 0.5) * cell / size).rgb; }
void main() {
  vec2 c = floor(vUv * size / cell);
  vec3 col = at(c);
  float l = luma(col), t = bayer(c);
  if (mode < 0.5) { gl_FragColor = vec4(col, 1.0); return; }
  if (mode < 1.5) {
    float g = floor(clamp(lift + l * gain, 0.0, 1.0) * 5.0 + t) / 5.0;
    vec3 grey = (light > 0.5 ? mix(vec3(0.55), vec3(0.98), g) : mix(vec3(0.04), vec3(0.85), g));
    gl_FragColor = vec4(mix(grey, grey * col / max(l, 1e-3), keep), 1.0); return;
  }
  if (mode < 2.5) {
    float edge = max(abs(l - luma(at(c + vec2(1.0, 0.0)))), abs(l - luma(at(c + vec2(0.0, 1.0)))));
    float lit = clamp((l - threshold) / max(band, 1e-3) + 0.5, 0.0, 1.0);
    bool on = lit > t && !(line > 0.0 && edge > line);
    gl_FragColor = vec4(on ? paper : ink, 1.0); return;
  }
  gl_FragColor = vec4(floor(col * bands + 0.5) / bands, 1.0);
}`;

/** <Fisheye> and <LensDistortion>: the picture remapped radially, after tone mapping */
const LENS = `
uniform sampler2D tDiffuse; uniform float kind, strength, k1, k2, zoom, fov, own, black; uniform vec2 aspect;
varying vec2 vUv;
void main() {
  vec2 d = (vUv - 0.5) * aspect;
  float half_ = length(aspect * 0.5);
  float r = length(d) / half_;
  float s;
  if (kind < 0.5) {
    // equidistant (or stereographic) fisheye: the angle off axis grows with r, at the widened fov's rate
    float wide = radians(fov) * 0.5, base = radians(own) * 0.5;
    float th = kind < 0.25 ? r * wide : 2.0 * atan(r * tan(wide * 0.5));
    float rr = tan(th) / tan(base) * 0.5 / half_ * aspect.y;
    s = mix(1.0, rr / max(r, 1e-5), strength);
  } else {
    s = 1.0 + k1 * r * r + k2 * r * r * r * r;
  }
  vec2 uv = d * s / zoom / aspect + 0.5;
  bool out_ = any(lessThan(uv, vec2(0.0))) || any(greaterThan(uv, vec2(1.0)));
  gl_FragColor = out_ && black > 0.5 ? vec4(0.0, 0.0, 0.0, 1.0) : texture2D(tDiffuse, clamp(uv, 0.0, 1.0));
}`;

/** a grade field across shadows, midtones and highlights */
function levels(p: Record<string, unknown>, k: string, d: number): THREE.Vector3 {
  // Grade's top-level value (its `saturation`, Bevy's global one) is each section's unless the section sets its own
  const all = num(p[k], d);
  const at = (s: string) => num((p[s] as Record<string, unknown> | undefined)?.[k], all);
  return new THREE.Vector3(at("shadows"), at("midtones"), at("highlights"));
}

const shader = (frag: string, uniforms: Record<string, unknown>) =>
  new ShaderPass({ uniforms: { tDiffuse: { value: null }, ...Object.fromEntries(Object.entries(uniforms).map(([k, v]) => [k, { value: v }])) }, vertexShader: VERT, fragmentShader: frag });

/** a composer for a renderer, rebuilt when the list of effects changes and updated each frame from their props */
export class Effects {
  composer: EffectComposer;
  private key = "";
  private passes = new Map<string, Pass>();
  constructor(readonly gl: THREE.WebGLRenderer) {
    // multisampled, as the canvas is: without it the composer's frame is aliased where the plain one isn't
    const size = gl.getDrawingBufferSize(new THREE.Vector2());
    this.composer = new EffectComposer(gl, new THREE.WebGLRenderTarget(Math.max(1, size.x), Math.max(1, size.y), { type: THREE.HalfFloatType, samples: 4 }));
  }

  /** set the effects for this frame; false when there are none to draw and no Tony curve (the renderer draws as it
   * would). `tony`: the scene's tone mapping is TonyMcMapface (Scene3d's settings.tony), drawn here */
  set(effects: Effect[], scene: THREE.Scene, camera: THREE.Camera, width: number, height: number, focus = 10, tony = false): boolean {
    const list = effects.filter((e) => DRAWN_EFFECTS.includes(e.kind));
    if (!list.length && !tony) return false;
    const key = list.map((e) => e.kind).join(",") + (tony ? "+tony" : "");
    if (key !== this.key) this.build(list, scene, camera, width, height, tony);
    const tp = this.passes.get("tony") as ShaderPass | undefined;
    if (tp) tp.uniforms.exposure.value = this.gl.toneMappingExposure;
    this.composer.setPixelRatio(this.gl.getPixelRatio());
    this.composer.setSize(width, height);
    for (const p of this.composer.passes) {
      if ((p as RenderPass).camera !== undefined && "scene" in p) Object.assign(p, { scene, camera });
    }
    const aspect = new THREE.Vector2(width / Math.max(width, height), height / Math.max(width, height));
    for (const e of list) this.update(e, scene, camera, width, height, aspect, focus);
    return true;
  }

  /** draw the frame: a colour background goes under it after the effects (an environment or picture stays the
   * scene's, drawn through them) */
  render(scene: THREE.Scene, dt?: number) {
    const bg = scene.background;
    const under = (this.passes.get("under") as ShaderPass).uniforms.under.value as THREE.Color;
    if (bg instanceof THREE.Color) {
      under.copy(bg).convertLinearToSRGB();
      scene.background = null;
    } else under.setRGB(0, 0, 0);
    try {
      this.composer.render(dt);
    } finally {
      scene.background = bg;
    }
  }

  private build(list: Effect[], scene: THREE.Scene, camera: THREE.Camera, w: number, h: number, tony: boolean) {
    for (const p of this.composer.passes) p.dispose();
    this.composer.passes.length = 0;
    this.passes.clear();
    this.key = list.map((e) => e.kind).join(",") + (tony ? "+tony" : "");
    const has = (k: string) => list.some((e) => e.kind === k);
    const add = (k: string, p: Pass) => {
      this.passes.set(k, p);
      this.composer.addPass(p);
    };
    const render = new RenderPass(scene, camera, undefined, new THREE.Color(0, 0, 0), 0);
    this.composer.addPass(render);
    if (has("AmbientOcclusion")) add("AmbientOcclusion", new GTAOPass(scene, camera, w, h));
    if (has("Outline")) add("Outline", new OutlinePass(new THREE.Vector2(w, h), scene, camera));
    if (has("DepthOfField")) add("DepthOfField", new BokehPass(scene, camera, { focus: 10, aperture: 0.002, maxblur: 0.01 }));
    if (has("Bloom")) {
      add("Bloom:keep", shader(KEEP, { keep: 1 }));
      add("Bloom", r180Blur(new UnrealBloomPass(new THREE.Vector2(w, h), 1, 0.4, 0.8)));
    }
    if (has("MotionBlur")) add("MotionBlur", new AfterimagePass(0.5));
    if (has("Grade")) add("Grade", shader(GRADE, { temperature: 0, tint: 0, aberration: 0, scale: 1, vig: new THREE.Vector4(), vigColor: new THREE.Color(), aspect: new THREE.Vector2(1, 1), sat: new THREE.Vector3(1, 1, 1), con: new THREE.Vector3(1, 1, 1), gam: new THREE.Vector3(1, 1, 1), gai: new THREE.Vector3(1, 1, 1), lif: new THREE.Vector3() }));
    if (tony) add("tony", shader(TONY, { lut: tonyTable(), exposure: 1 }));
    else this.composer.addPass(new OutputPass());
    add("under", shader(UNDER, { under: new THREE.Color() }));
    if (has("Grade")) add("Grade:post", shader(SATURATE, { saturation: 1 }));
    if (has("Look")) add("Look", new ShaderPass({ uniforms: { tDiffuse: { value: null }, size: { value: new THREE.Vector2(w, h) }, cell: { value: 6 }, mode: { value: 0 }, keep: { value: 1 }, lift: { value: 0 }, gain: { value: 1 }, line: { value: 0 }, threshold: { value: 0.5 }, band: { value: 1 }, bands: { value: 3 }, ink: { value: new THREE.Color() }, paper: { value: new THREE.Color() }, light: { value: 0 } }, vertexShader: VERT, fragmentShader: LOOK }));
    for (const k of ["Fisheye", "LensDistortion"]) if (has(k)) add(k, new ShaderPass({ uniforms: { tDiffuse: { value: null }, kind: { value: 0 }, strength: { value: 1 }, k1: { value: 0 }, k2: { value: 0 }, zoom: { value: 1 }, fov: { value: 120 }, own: { value: 50 }, black: { value: 0 }, aspect: { value: new THREE.Vector2(1, 1) } }, vertexShader: VERT, fragmentShader: LENS }));
  }

  private update(e: Effect, scene: THREE.Scene, camera: THREE.Camera, w: number, h: number, aspect: THREE.Vector2, focus: number) {
    const p = e.props, pass = this.passes.get(e.kind);
    if (!pass) return;
    const u = (pass as ShaderPass).uniforms;
    switch (e.kind) {
      case "AmbientOcclusion": {
        const ao = pass as GTAOPass;
        const samples = { low: 4, medium: 8, high: 18, ultra: 54 }[String(p.quality ?? "medium")] ?? 8;
        ao.updateGtaoMaterial({ radius: num(p.thickness, 0.25) * 2, samples, thickness: num(p.thickness, 0.25) });
        break;
      }
      case "Outline": {
        const o = pass as OutlinePass;
        const meshes: THREE.Object3D[] = [];
        scene.traverse((m) => (m as THREE.Mesh).isMesh && meshes.push(m));
        o.selectedObjects = meshes;
        o.visibleEdgeColor.set(String(p.color ?? "#000000"));
        o.hiddenEdgeColor.set(String(p.color ?? "#000000"));
        o.edgeStrength = 10;
        o.edgeThickness = num(p.width, 1);
        break;
      }
      case "DepthOfField": {
        const u2 = (pass as BokehPass).uniforms as Record<string, THREE.IUniform>;
        const f = num(p.aperture, 2.8);
        u2.focus.value = focus;
        // three's aperture is a blur per unit of depth: f/2.8 is three's example's 0.025 scaled by 1/f
        u2.aperture.value = (0.025 * 2.8) / f / 100;
        u2.maxblur.value = num(p.maxBlur, 64) / Math.max(w, h);
        break;
      }
      case "Bloom": {
        const b = pass as UnrealBloomPass;
        // raea's 1 is Bevy's 0.15 (runtime/look BLOOM)
        const k = Math.min(1, num(p.intensity, 1) * 0.15);
        b.strength = k;
        (this.passes.get("Bloom:keep") as ShaderPass).uniforms.keep.value = 1 - k;
        b.threshold = num(p.threshold, 0.8);
        b.radius = 0.4;
        break;
      }
      case "MotionBlur":
        (pass as AfterimagePass).damp = Math.min(0.95, 0.5 * num(p.shutterAngle, 0.5) * 2);
        break;
      case "Grade": {
        u.temperature.value = num(p.temperature, 0);
        u.tint.value = num(p.tint, 0);
        u.aberration.value = num(p.aberration, 0) * 2;
        // three's linear colour times its exposure is Bevy's (three's ACES' 1/0.6 aside: Scene3d.apply)
        u.scale.value = this.gl.toneMappingExposure / (this.gl.toneMapping === THREE.ACESFilmicToneMapping ? 0.6 : 1);
        const v = p.vignette;
        const vo = typeof v === "object" && v ? (v as Record<string, unknown>) : { intensity: num(v, 0) };
        u.vig.value.set(num(vo.intensity, 0), num(vo.radius, 0.75), num(vo.smoothness, 5), 0);
        u.vigColor.value.set(String(vo.color ?? "#000000"));
        u.aspect.value.copy(aspect);
        u.sat.value = levels(p, "saturation", 1);
        u.con.value = levels(p, "contrast", 1);
        u.gam.value = levels(p, "gamma", 1);
        u.gai.value = levels(p, "gain", 1);
        u.lif.value = levels(p, "lift", 0);
        (this.passes.get("Grade:post") as ShaderPass).uniforms.saturation.value = num(p.saturation, 1);
        break;
      }
      case "Look": {
        const mode = String(p.mode ?? "site");
        u.size.value.set(w, h);
        u.cell.value = num(p.pixelSize, 6);
        // paint and cartoon are in the surfaces (paint.ts): the pass only draws the frame in cells, as pixel does
        u.mode.value = { pixel: 0, site: 1, ink: 2, paint: 0, cartoon: 0 }[mode] ?? 1;
        u.keep.value = num(p.color, 1);
        u.lift.value = num(p.lift, 0);
        u.gain.value = num(p.gain, 1);
        u.line.value = num(p.line, 0);
        u.threshold.value = num(p.threshold, 0.5);
        u.band.value = num(p.band, 1);
        u.bands.value = num(p.bands, mode === "cartoon" ? 2 : 3);
        u.ink.value.set(String(p.ink ?? "#1a1410"));
        u.paper.value.set(String(p.paper ?? "#efe6d2"));
        u.light.value = p.theme === "light" ? 1 : 0;
        if (mode === "paint" || mode === "cartoon") u.cell.value = num(p.pixelSize, 1);
        break;
      }
      case "Fisheye":
      case "LensDistortion": {
        const fish = e.kind === "Fisheye";
        const own = camera instanceof THREE.PerspectiveCamera ? camera.fov : 50;
        u.kind.value = fish ? (p.mode === "stereographic" ? 0.3 : 0) : 1;
        u.strength.value = num(p.strength, 1);
        u.k1.value = num(p.k1, 0);
        u.k2.value = num(p.k2, 0);
        // by default a barrel's corners stay inside the picture
        u.zoom.value = num(p.zoom, fish ? 1 : Math.max(1, 1 + num(p.k1, 0) + num(p.k2, 0)));
        u.fov.value = num(p.fov, own);
        u.own.value = own;
        u.black.value = p.edges === "black" ? 1 : 0;
        u.aspect.value.copy(aspect);
        break;
      }
    }
  }

  dispose() {
    for (const p of this.composer.passes) p.dispose();
    this.composer.dispose();
  }
}
