// Quat, Transform, Mesh3d and Camera3d.
import { Children, cloneElement, isValidElement, useId, type ReactNode } from "react";
import { meshLayers } from "../layers";
import { BevyComponent, DepthOfField, Fog, dofOf, eulerOf, type DepthOfFieldProps, type FogProps, type Vec3 } from "../3d";
import { AmbientLight as AmbientLight3, Mesh, OrthographicCamera, PerspectiveCamera, type MeshProps } from "../three";
import { Transform as TransformComponent } from "@raea/app/bevy";
import { AmbientLight, LinearRgba, Srgba, ambientOf, type AmbientLightProps } from "./all";
import { cameraFog } from "./fog";

/** A rotation as glam's Quat: [x, y, z, w]. */
export type Quat = [number, number, number, number];

const qmul = (a: Quat, b: Quat): Quat => [
  a[3] * b[0] + a[0] * b[3] + a[1] * b[2] - a[2] * b[1],
  a[3] * b[1] - a[0] * b[2] + a[1] * b[3] + a[2] * b[0],
  a[3] * b[2] + a[0] * b[1] - a[1] * b[0] + a[2] * b[3],
  a[3] * b[3] - a[0] * b[0] - a[1] * b[1] - a[2] * b[2],
];

const qdot = (a: Quat, b: Quat) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];

const axisAngle = (axis: Vec3, angle: number): Quat => {
  const n = Math.hypot(...axis) || 1;
  const s = Math.sin(angle / 2) / n;
  return [axis[0] * s, axis[1] * s, axis[2] * s, Math.cos(angle / 2)];
};

/** glam's EulerRot, the intrinsic orders: "YXZ" turns about Y, then the turned X, then the turned Z. */
export type EulerRot = "XYZ" | "XZY" | "YXZ" | "YZX" | "ZXY" | "ZYX";

const EULER_ROTS: readonly string[] = ["XYZ", "XZY", "YXZ", "YZX", "ZXY", "ZYX"];

const AXES: Record<string, Vec3> = { X: [1, 0, 0], Y: [0, 1, 0], Z: [0, 0, 1] };

/** glam's Quat constructors, by their Rust names in camelCase. */
export const Quat = {
  IDENTITY: [0, 0, 0, 1] as Quat,
  fromRotationX: (a: number) => axisAngle([1, 0, 0], a),
  fromRotationY: (a: number) => axisAngle([0, 1, 0], a),
  fromRotationZ: (a: number) => axisAngle([0, 0, 1], a),
  fromAxisAngle: axisAngle,
  /** Quat::from_euler: `fromEuler("XYZ", x, y, z)` is fromRotationX(x) * fromRotationY(y) * fromRotationZ(z), the order a
   *  3d.tsx rotation [x, y, z] is composed in (eulerOf inverts it) */
  fromEuler(order: EulerRot, a: number, b: number, c: number): Quat {
    if (!EULER_ROTS.includes(order)) throw new TypeError(`Quat.fromEuler: order is one of ${EULER_ROTS.join(", ")}, got ${JSON.stringify(order)}`);
    const [i, j, k] = order.split("").map((n) => AXES[n]);
    return qmul(qmul(axisAngle(i, a), axisAngle(j, b)), axisAngle(k, c));
  },
  mul: qmul,
  /** glam's Quat::slerp: the short way from a to b, a fraction s along (a lerp, normalised, when they nearly agree) */
  slerp(a: Quat, b: Quat, s: number): Quat {
    let d = qdot(a, b);
    const e: Quat = d < 0 ? [-b[0], -b[1], -b[2], -b[3]] : b;
    d = Math.abs(d);
    if (d > 1 - 1.1920929e-7) {
      const l = a.map((x, i) => x + (e[i] - x) * s);
      const n = Math.hypot(...l);
      return l.map((x) => x / n) as Quat;
    }
    const th = Math.acos(d);
    const [p, q, r] = [Math.sin(th * (1 - s)), Math.sin(th * s), Math.sin(th)];
    return a.map((x, i) => (x * p + e[i] * q) / r) as Quat;
  },
  /** v turned by q */
  mulVec3(q: Quat, v: Vec3): Vec3 {
    const r = qmul(qmul(q, [v[0], v[1], v[2], 0]), [-q[0], -q[1], -q[2], q[3]]);
    return [r[0], r[1], r[2]];
  },
};

/** glam's Affine2 as its parts: scaled, then turned `angle` radians, then moved by `translation` (from_scale_angle_translation). */
export type Affine2 = { scale: [number, number]; angle: number; translation: [number, number] };

/** glam's Affine2 constructors, by their Rust names in camelCase. */
export const Affine2 = {
  IDENTITY: { scale: [1, 1], angle: 0, translation: [0, 0] } as Affine2,
  fromScale: (scale: [number, number]): Affine2 => ({ scale, angle: 0, translation: [0, 0] }),
  fromAngle: (angle: number): Affine2 => ({ scale: [1, 1], angle, translation: [0, 0] }),
  fromTranslation: (translation: [number, number]): Affine2 => ({ scale: [1, 1], angle: 0, translation }),
  fromScaleAngleTranslation: (scale: [number, number], angle: number, translation: [number, number]): Affine2 => ({ scale, angle, translation }),
};

/** The rotation that points -Z from `eye` at `target` with +Y toward `up`, as Bevy's Transform::looking_at computes it:
 *  in f32, step by step as glam does (Dir3::new, cross, try_normalize, Quat::from_rotation_axes), so it is the same
 *  quaternion to the bit, not one an ulp off (which a raymarch through the view's matrices shows). */
function lookingAt(eye: Vec3, target: Vec3, up: Vec3): Quat {
  const f = Math.fround;
  const v = (a: Vec3): Vec3 => [f(a[0]), f(a[1]), f(a[2])];
  const length = (a: Vec3) => f(Math.sqrt(f(f(f(a[0] * a[0]) + f(a[1] * a[1])) + f(a[2] * a[2]))));
  const cross = (a: Vec3, b: Vec3): Vec3 => [f(f(a[1] * b[2]) - f(b[1] * a[2])), f(f(a[2] * b[0]) - f(b[2] * a[0])), f(f(a[0] * b[1]) - f(b[0] * a[1]))];
  // Dir3::new: the vector over its length, or Bevy's fallback when it has none
  const dir = (a: Vec3, or: Vec3): Vec3 => {
    const n = length(a);
    return n > 0 && Number.isFinite(n) ? [f(a[0] / n), f(a[1] / n), f(a[2] / n)] : or;
  };
  const [e, t] = [v(eye), v(target)];
  const d = dir([f(t[0] - e[0]), f(t[1] - e[1]), f(t[2] - e[2])], [0, 0, -1]);
  const back: Vec3 = [-d[0], -d[1], -d[2]];
  const up1 = dir(v(up), [0, 1, 0]);
  const r0 = cross(up1, back);
  const rcp = f(1 / length(r0));
  // try_normalize, or glam's any_orthonormal_vector of up for an up along the view
  const right: Vec3 = Number.isFinite(rcp) && rcp > 0 ? [f(r0[0] * rcp), f(r0[1] * rcp), f(r0[2] * rcp)] : (() => {
    const sign = up1[2] < 0 || Object.is(up1[2], -0) ? -1 : 1;
    const a = f(-1 / f(sign + up1[2]));
    return [f(f(up1[0] * up1[1]) * a), f(sign + f(f(up1[1] * up1[1]) * a)), -up1[1]];
  })();
  // Quat::from_rotation_axes(right, up, back), DirectXMath's XMQuaternionRotationMatrix as glam writes it
  const [[m00, m01, m02], [m10, m11, m12], [m20, m21, m22]] = [right, cross(back, right), back];
  const q = (sq: number, at: number, a: number, b: number, c: number): Quat => {
    const inv = f(0.5 / f(Math.sqrt(sq)));
    const out = [f(a * inv), f(b * inv), f(c * inv)];
    out.splice(at, 0, f(sq * inv));
    return out as Quat;
  };
  if (m22 <= 0) {
    const dif10 = f(m11 - m00), omm22 = f(1 - m22);
    return dif10 <= 0 ? q(f(omm22 - dif10), 0, f(m01 + m10), f(m02 + m20), f(m12 - m21)) : q(f(omm22 + dif10), 1, f(m01 + m10), f(m12 + m21), f(m20 - m02));
  }
  const sum10 = f(m11 + m00), opm22 = f(1 + m22);
  return sum10 <= 0 ? q(f(opm22 - sum10), 2, f(m02 + m20), f(m12 + m21), f(m01 - m10)) : q(f(opm22 + sum10), 3, f(m12 - m21), f(m20 - m02), f(m01 - m10));
}

/** A Transform's value, as Bevy reflects it. */
export interface TransformValue {
  /** where it is, metres (x, y, z) */
  translation?: Vec3;
  /** its rotation as a quaternion [x, y, z, w] */
  rotation?: Quat;
  /** its scale along x, y and z */
  scale?: Vec3;
}

/** A Transform built with Bevy's builders: each returns a new one. */
export interface TransformBuilt extends Required<TransformValue> {
  /** the same transform, moved to `v` */
  withTranslation(v: Vec3): TransformBuilt;
  /** the same transform, turned to `q` */
  withRotation(q: Quat): TransformBuilt;
  /** the same transform, scaled to `s` (one number for all three axes) */
  withScale(s: Vec3 | number): TransformBuilt;
  /** the same transform, turned so its -Z faces `target` with `up` (+Y) up, as Bevy's looking_at */
  lookingAt(target: Vec3, up?: Vec3): TransformBuilt;
}

function built(translation: Vec3, rotation: Quat, scale: Vec3): TransformBuilt {
  return {
    translation,
    rotation,
    scale,
    withTranslation: (v) => built(v, rotation, scale),
    withRotation: (q) => built(translation, q, scale),
    withScale: (s) => built(translation, rotation, typeof s === "number" ? [s, s, s] : s),
    lookingAt: (target, up = [0, 1, 0]) => built(translation, lookingAt(translation, target, up), scale),
  };
}

/** Bevy's Transform: the component's handle for a program (`with(Transform, Transform.fromXyz(1, 0, 0))`) and its
 *  builders for a scene (`<Mesh3d transform={Transform.fromXyz(0, 1, 0)}>`). */
export const Transform = /* @__PURE__ */ Object.assign({}, TransformComponent, {
  IDENTITY: built([0, 0, 0], [0, 0, 0, 1], [1, 1, 1]),
  fromXyz: (x: number, y: number, z: number) => built([x, y, z], [0, 0, 0, 1], [1, 1, 1]),
  fromTranslation: (v: Vec3) => built(v, [0, 0, 0, 1], [1, 1, 1]),
  fromRotation: (q: Quat) => built([0, 0, 0], q, [1, 1, 1]),
  fromScale: (s: Vec3) => built([0, 0, 0], [0, 0, 0, 1], s),
});

// the rotation goes as Bevy's quaternion, end to end (docs/control.feature FC1d); a part whose `animate` turns it
// keeps the Euler angles its tracks patch
function place(t: TransformValue | undefined, animated = false): Pick<MeshProps, "position" | "rotation" | "quaternion" | "scale"> {
  if (!t) return {};
  return {
    ...(t.translation ? { position: t.translation } : {}),
    ...(t.rotation ? (animated ? { rotation: eulerOf(t.rotation) } : { quaternion: t.rotation }) : {}),
    ...(t.scale ? { scale: t.scale } : {}),
  };
}

export interface Mesh3dProps extends Omit<MeshProps, "position" | "rotation" | "scale"> {
  /** where it stands: translation, rotation (a quaternion) and scale, as Bevy's Transform */
  transform?: TransformValue;
  /** Bevy's Visibility: "Hidden" draws nothing; "Visible" and "Inherited" draw */
  visibility?: "Visible" | "Hidden" | "Inherited";
  /** its material and child entities */
  children?: ReactNode;
}

/** Bevy's Mesh3d on an entity with its Transform: a shape (Cuboid, Sphere ...) and a material inside, and any page
 * element inside as a page layer in the world at it, or on it with layer="surface" (`meshLayers`).
 * @bevy bevy_mesh::components::Mesh3d
 * @bevy bevy_pbr::mesh_material::MeshMaterial3d<bevy_pbr::pbr_material::StandardMaterial>
 * castShadow={false} and receiveShadow={false} put Bevy's markers on it: @bevy bevy_light::NotShadowCaster
 * @bevy bevy_light::NotShadowReceiver
 * `layers` is its RenderLayers (a light's and a camera's too): @bevy bevy_camera::visibility::render_layers::RenderLayers
 * shadow="only" draws it with the shadow-only material (engine/render shadow_only.rs):
 * @bevy bevy_pbr::mesh_material::MeshMaterial3d<raea_render::engine::shadow_only::ShadowOnlyMaterial> */
export function Mesh3d({ transform, visibility, children, ...rest }: Mesh3dProps) {
  const id = useId();
  if (visibility === "Hidden") return null;
  const layers = meshLayers("Mesh3d", rest.name ?? `layer${id}`, children, true);
  const at = place(transform, rest.animate !== undefined);
  if (!layers.surface) return <Mesh {...rest} {...at}>{layers.children}</Mesh>;
  return (
    <>
      <Mesh {...rest} {...at} surface={layers.surface}>{layers.children}</Mesh>
      {layers.part}
    </>
  );
}

/** Bevy's Projection enum, as it reflects: fov in radians (Bevy's default PI/4). */
export type Projection =
  | { Perspective: { fov?: number; near?: number; far?: number } }
  | { Orthographic: { near?: number; far?: number; scaling_mode?: { FixedVertical: { viewport_height: number } } } };

export interface Camera3dProps {
  /** where the camera stands and faces (`Transform.fromXYZ(...).lookingAt(...)`) */
  transform?: TransformValue;
  /** perspective (the default) or orthographic, as Bevy's Projection */
  projection?: Projection;
  /** Bevy's RenderLayers on the camera: it draws only the parts on these layers (a Mesh3d's `layers`; [0] by default) */
  layers?: number[];
  /** Bevy's Camera order: a camera with a higher one draws after (over) those with lower; 0 by default */
  order?: number;
  /** Bevy's ClearColorConfig: "Default" (the clear colour), "None" (drawn over what the cameras before it drew, as a
   *  second pass), or { Custom: colour } */
  clear_color?: ClearColorConfig;
  /** Bevy's Viewport: the camera draws into this region of the window only, `physical_position` from its top left and
   *  `physical_size` big (whole px, at a scale factor of 1) */
  viewport?: CameraViewport;
  /** Bevy's Camera is_active: false and it draws nothing this frame, its lens and ambient with it. Several cameras in
   *  the scene, one active a frame, cut between them inside one render: the frame another camera becomes active (the
   *  first active one, in tree order, is the piece's) is a cut, drawn as a shot rendered alone draws its first frame
   *  (no motion blur from the frame before). True by default */
  is_active?: boolean;
  /** components on the camera: post effects, tone mapping, a skybox */
  children?: ReactNode;
}

/** Bevy's Viewport on a Camera, its depth range Bevy's default 0..1. */
export interface CameraViewport {
  /** the viewport's top-left corner, in px */
  physical_position: [number, number];
  /** the viewport's width and height, in px */
  physical_size: [number, number];
}

/** Bevy's ClearColorConfig. @bevy bevy_camera::clear_color::ClearColorConfig */
export type ClearColorConfig = "Default" | "None" | { Custom: Srgba | LinearRgba };

/** Bevy's Camera3d with its Transform and Projection: it looks along its -Z, +Y up, as Bevy's cameras do.
 * @bevy bevy_camera::components::Camera3d
 * @bevy bevy_camera::camera::Camera
 * @bevy bevy_camera::projection::Projection */
export function Camera3d({ transform, projection = { Perspective: {} }, layers, order, clear_color, viewport, is_active, children: kids }: Camera3dProps) {
  if (order !== undefined && !Number.isInteger(order)) throw new TypeError(`Camera3d: order is a whole number, got ${order}`);
  const clear = clearOf(clear_color);
  if (viewport !== undefined) {
    const ok = (v: unknown, min: number) => Array.isArray(v) && v.length === 2 && v.every((n) => Number.isInteger(n) && n >= min);
    if (!ok(viewport.physical_position, 0) || !ok(viewport.physical_size, 1)) throw new RangeError(`Camera3d: viewport is { physical_position: [x, y] >= 0, physical_size: [w, h] >= 1 } in whole px, got ${JSON.stringify(viewport)}`);
  }
  // Bevy's DepthOfField on the camera: its focal_distance is the camera's focus, the rest the scene's DepthOfField
  let dof: DepthOfFieldProps | undefined;
  // Bevy 0.20's AmbientLight on the camera: its own ambient, over GlobalAmbientLight (the scene's other ambient lights)
  const ambient: ReactNode[] = [];
  // a <Fog> on the camera is Bevy's DistanceFog on it, every one of Bevy's fields
  let fogs = 0;
  const own = Children.toArray(kids).map((c) => (isValidElement(c) && c.type === Fog ? (fogs++, cloneElement(cameraFog(c.props as FogProps), { key: c.key })) : c));
  if (fogs > 1) throw new TypeError("Camera3d: one Fog");
  const rest = own.filter((c) => {
    if (isValidElement(c) && c.type === AmbientLight) {
      ambient.push(<AmbientLight3 key={ambient.length} {...ambientOf(c.props as AmbientLightProps)} camera />);
      return false;
    }
    if (!(isValidElement(c) && c.type === DepthOfField)) return true;
    if (dof) throw new TypeError("Camera3d: one DepthOfField");
    dof = c.props as DepthOfFieldProps;
    return false;
  });
  const focus = dof ? { focus: dof.focal_distance ?? 10 } : {};
  const children = dof || ambient.length || fogs ? rest : kids;
  // on the camera it is Bevy's component, so Bevy's f/1 unless the old aperture is given
  const bevy = dof && dof.aperture === undefined && dof.aperture_f_stops === undefined ? { aperture_f_stops: 1 } : {};
  const lens = dof ? <DepthOfField {...dofOf("Camera3d", { ...dof, ...bevy, focal_distance: undefined })} /> : null;
  const eye: Vec3 = transform?.translation ?? [0, 0, 0];
  const q = transform?.rotation ?? Quat.IDENTITY;
  const f = Quat.mulVec3(q, [0, 0, -1]);
  const lookAt: Vec3 = [eye[0] + f[0], eye[1] + f[1], eye[2] + f[2]];
  // its rotation as its Transform holds it, which the engine places it by (rolled or not), exactly; the look-at point
  // is for what reads a camera by where it looks (its lens's focus, picking, sound)
  const look = { position: eye, lookAt, rotation: q, ...(layers ? { layers } : {}), ...(order ? { order } : {}), ...clear, ...(viewport ? { viewport } : {}) };
  // not drawing this frame: the camera alone, marked, so the scene knows which of its cameras is (a cut, RR2)
  const off = is_active === false;
  if ("Orthographic" in projection) {
    const o = projection.Orthographic;
    const height = o.scaling_mode?.FixedVertical.viewport_height;
    if (dof) throw new TypeError("Camera3d: DepthOfField needs a Perspective projection");
    if (off) return <OrthographicCamera {...look} near={o.near} far={o.far} height={height} active={false} />;
    return (
      <>
        <OrthographicCamera {...look} near={o.near} far={o.far} height={height}>{children}</OrthographicCamera>
        {ambient}
      </>
    );
  }
  const p = projection.Perspective;
  if (off) return <PerspectiveCamera {...look} fov={((p.fov ?? Math.PI / 4) * 180) / Math.PI} near={p.near} far={p.far} active={false} />;
  return (
    <>
      <PerspectiveCamera {...look} fov={((p.fov ?? Math.PI / 4) * 180) / Math.PI} near={p.near} far={p.far} {...focus}>{children}</PerspectiveCamera>
      {lens}
      {ambient}
    </>
  );
}

// a ClearColorConfig as the camera row's clear and bg
function clearOf(c: ClearColorConfig | undefined): { clear?: "none"; bg?: string } {
  if (c === undefined || c === "Default") return {};
  if (c === "None") return { clear: "none" };
  const col = typeof c === "object" && c !== null ? c.Custom : undefined;
  if (col instanceof LinearRgba) return { bg: col.to_srgba().to_hex() };
  if (col instanceof Srgba) return { bg: col.to_hex() };
  throw new TypeError(`Camera3d: clear_color is "Default", "None" or { Custom: Srgba | LinearRgba }, got ${JSON.stringify(c)}`);
}

/** Bevy's Hdr: put it inside the <Camera3d> to render it to a float target, tone-mapped after, as Bevy's Hdr camera
 *  is (a Skybox's or an emissive's light above 1 then rolls off in the tone mapping instead of clipping).
 *  @bevy bevy_camera::components::Hdr */
export function Hdr() {
  return <BevyComponent type="bevy_camera::components::Hdr" value={{}} />;
}
