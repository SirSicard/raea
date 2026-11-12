// <FramePass>: a shader over the frame (docs/shaders.feature SH6), from its source here or a file as written (FC2d).
import { assetPath, node3d, samplerSpec, shaderDefs, surfaceShader, type SamplerSpec, type ShaderDefs, type StorageValue } from "./all";

/** A shader over the whole frame (raea-sys-framepass, docs/shaders.feature SH6). Its source defines
 *   fn shade(in: FullscreenVertexOutput) -> vec4<f32>
 * (or its own @fragment) and reads frame(uv), u_NAME(), tex_NAME / samp_NAME, and with `prepass` depth(uv) (metres
 * from the camera, 1e30 where nothing was drawn) and normal(uv) (world space). */
export interface FramePassProps {
  /** a shader file compiled as written, staticFile("shaders/x.wesl") (docs/control.feature FC2d), in place of wesl: its
   * `@group(0)` bindings its own, as custom_post_processing's pipeline binds them: each texture_2d<f32> the frame (the
   * one `frame` names) or an image of `textures`, each sampler Bevy's default (nearest) or `samplers`' one, each
   * var<uniform> its value in `uniforms` (which may change frame by frame) */
  file?: string;
  /** a file's texture that reads the frame as drawn so far */
  frame?: string;
  /** a file's fragment entry point ("fragment" by default) */
  entry?: string;
  /** a file's samplers by name */
  samplers?: Record<string, SamplerSpec>;
  /** the source in WESL (a superset of WGSL) */
  wesl?: string;
  /** the same in plain WGSL */
  wgsl?: string;
  /** up to 16, as a surface shader's (a file's: each var<uniform>, a struct's { field: value }); each frame's own, so
   * a camera's matrices, a time or a frame index handed in move through a render (each keeps its first frame's type) */
  uniforms?: Record<string, number | number[] | string | StorageValue>;
  /** up to 4, as a surface shader's, each read with its own sampler; the first frame's for the whole render (pick a
   * layer of a texture array with a uniform to change what's read frame by frame) */
  textures?: Record<string, string | Record<string, unknown>>;
  /** shader defs, as a surface shader's */
  defs?: ShaderDefs;
  /** "after-tonemap" (display colours; the default) or "before-tonemap" (the HDR frame, after bloom) */
  at?: "before-tonemap" | "after-tonemap";
  /** the camera's depth and normal prepasses, for depth(uv) and normal(uv) (turns its multisampling off) */
  prepass?: boolean | { depth?: boolean; normal?: boolean };
}

const PASS_HOOK = /(^|[^A-Za-z0-9_])fn\s+shade\s*\(|@fragment/;

/** A full-screen pass over the scene camera's frame, beside the camera; several run in the order written. With a
 * frame <Look> they run on its cells, before the look's composite.
 * @bevy raea_sys_framepass::FramePasses */
export function FramePass(props: FramePassProps) {
  if (props.file !== undefined) return written(props);
  const { at, prepass, ...sh } = props;
  if (at !== undefined && at !== "before-tonemap" && at !== "after-tonemap") throw new TypeError(`FramePass: at is "before-tonemap" or "after-tonemap", got ${JSON.stringify(at)}`);
  if (prepass !== undefined && typeof prepass !== "boolean" && (typeof prepass !== "object" || prepass === null || Object.keys(prepass).some((k) => k !== "depth" && k !== "normal"))) throw new TypeError("FramePass: prepass is true or { depth, normal }");
  const spec = surfaceShader("FramePass", sh as Parameters<typeof surfaceShader>[1], PASS_HOOK, "fn shade(in: FullscreenVertexOutput) -> vec4<f32>, or its own @fragment");
  // its uniforms also as their own prop, keyed frame by frame (the spec is the first frame's)
  return node3d("FramePass", { shader: { ...spec, ...(at ? { at } : {}), ...(prepass !== undefined ? { prepass } : {}) }, uniforms: JSON.stringify(spec.uniforms ?? {}) });
}

/** A pass as written (raea-sys-framepass written.rs): its file, the texture that reads the frame, its images,
 * samplers and uniforms; its uniforms also as their own prop, keyed frame by frame. */
function written(p: FramePassProps) {
  const { file, frame, entry, textures = {}, samplers = {}, uniforms = {}, defs, at } = p;
  if (typeof file !== "string" || !file) throw new TypeError(`FramePass: file is a shader file, staticFile("shaders/x.wesl"), got ${JSON.stringify(file)}`);
  if (p.wesl !== undefined || p.wgsl !== undefined || p.prepass !== undefined) throw new TypeError("FramePass: a file is its own source and bindings: no wesl, wgsl or prepass beside it");
  if (frame !== undefined && (typeof frame !== "string" || !frame)) throw new TypeError(`FramePass: frame names the file's texture that reads the frame, got ${JSON.stringify(frame)}`);
  if (at !== undefined && at !== "before-tonemap" && at !== "after-tonemap") throw new TypeError(`FramePass: at is "before-tonemap" or "after-tonemap", got ${JSON.stringify(at)}`);
  for (const [k, s] of Object.entries(samplers)) samplerSpec(`FramePass: sampler ${k}`, s);
  const shader = { file: assetPath(file), textures, samplers, uniforms, ...(frame ? { frame } : {}), ...(entry ? { entry } : {}), ...(at ? { at } : {}), ...(defs !== undefined ? { defs: shaderDefs("FramePass", defs) } : {}) };
  return node3d("FramePass", { shader, uniforms: JSON.stringify(uniforms) });
}
