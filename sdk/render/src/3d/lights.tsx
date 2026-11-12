// Lights and the atmosphere.
import { toHex } from "../colour";
import { useCamera3d } from "../events3d";
import { BevyParts, Vec3, checkVec, node3d } from "./all";

export interface AmbientLightProps {
  /** matched by name across frames (a light that comes and goes, or one of several) */
  name?: string;
  intensity?: number;
  color?: string;
  /** a camera's own (Bevy 0.20's AmbientLight component, which <Camera3d> sets for an <AmbientLight> child): the scene's
   *  other ambient lights don't light its view */
  camera?: boolean;
}

/** Light from everywhere at once.
 */
export function AmbientLight({ intensity = 1, color = "#ffffff", ...rest }: AmbientLightProps & Pick<BevyUnits, "nits">) {
  return node3d("AmbientLight", { ...rest, intensity, color: toHex("AmbientLight", "color", color) });
}

export interface DirectionalLightProps {
  /** matched by name across frames (a light that comes and goes, or one of several) */
  name?: string;
  position?: Vec3;
  /** where it shines towards (the origin by default) */
  target?: Vec3;
  /** its rotation, a quaternion [x, y, z, w], as a Bevy light's Transform holds it: placed by it exactly over
   *  `target` (raea/light sends it) */
  rotation?: [number, number, number, number];
  intensity?: number;
  color?: string;
  /** shadows (on by default for a directional light) */
  castShadow?: boolean;
  /** its light shows in the air as shafts through a <FogVolume> (needs a <VolumetricFog>; casts shadows) */
  volumetric?: boolean;
  /** soft shadows (PCSS): true, or the sun's size as its shadows see it, in metres (0.5 by default; 2-10 for a
   * studio's big softbox): the larger, the softer, and a shadow sharpens where it touches what casts it, as a real one
   * does. A shadow map's texels show as grain in a wide penumbra: raise <Shadows mapSize> */
  softShadow?: boolean | number;
  /** the same as a number `softShadow` (an older name) */
  softness?: number;
}

/** A Bevy light's power in its own units, which the rows take as written over `intensity` (bevy3d lights.tsx sends
 *  them; docs/control.feature FC1f): a directional light's lux, a point, spot or rect light's lumens, an ambient's nits
 *  (cd/m²). */
export interface BevyUnits {
  lux?: number;
  lumens?: number;
  nits?: number;
}

function checkLight(owner: string, p: { position?: Vec3; target?: Vec3; intensity?: number; color?: string; softShadow?: unknown; softness?: number } & BevyUnits) {
  for (const k of ["lux", "lumens", "nits"] as const) if (p[k] !== undefined && !(p[k]! >= 0 && Number.isFinite(p[k]))) throw new RangeError(`${owner}: ${k} must be 0 or more, got ${p[k]}`);
  if (p.softness !== undefined && !(p.softness >= 0 && Number.isFinite(p.softness))) throw new RangeError(`${owner}: softness must be 0 or more, got ${p.softness}`);
  if (p.softShadow !== undefined && !(typeof p.softShadow === "boolean" || (typeof p.softShadow === "number" && p.softShadow >= 0 && Number.isFinite(p.softShadow)))) throw new RangeError(`${owner}: softShadow is true, false or a size in metres (0 or more), got ${JSON.stringify(p.softShadow)}`);
  if (p.position !== undefined) checkVec(owner, "position", p.position);
  if (p.target !== undefined) checkVec(owner, "target", p.target);
  if (p.intensity !== undefined && !(p.intensity >= 0 && Number.isFinite(p.intensity))) throw new RangeError(`${owner}: intensity must be 0 or more, got ${p.intensity}`);
  if (p.color !== undefined) toHex(owner, "color", p.color);
}

/** Parallel light (the sun) shining from `position` towards `target`.
 */
export function DirectionalLight({ intensity = 1, color = "#ffffff", children, ...rest }: DirectionalLightProps & BevyParts & Pick<BevyUnits, "lux">) {
  checkLight("DirectionalLight", { ...rest, intensity, color });
  return node3d("DirectionalLight", { ...rest, intensity, color: toHex("DirectionalLight", "color", color) }, children);
}

export interface PointLightProps {
  /** matched by name across frames (a light that comes and goes, or one of several) */
  name?: string;
  position?: Vec3;
  /** 1 lights a surface 3 units away about as brightly as a DirectionalLight of 1 */
  intensity?: number;
  color?: string;
  /** how far it reaches (20 by default) */
  distance?: number;
  /** shadows (off by default; each costs six shadow maps) */
  castShadow?: boolean;
  /** soft shadows (PCSS) when it casts them: true, or the bulb's radius in metres (0.25 by default) */
  softShadow?: boolean | number;
  /** its light shows in the air through a <FogVolume> (needs a <VolumetricFog>; turns its shadows on, which a
   * point light pays six shadow maps for: prefer a spot) */
  volumetric?: boolean;
  /** soft shadows (PCSS): the bulb's radius in metres, so a shadow's edge blurs the farther it falls from what casts
   * it (unset or 0: hard shadows, the default) */
  softness?: number;
  /** under <Look mode="paint"> (and "cartoon"), which otherwise draws only the suns: this light paints a band of its
   * own colour on what it reaches (a CRT's glow on a face, a lamp's pool on a desk). Where its light on a surface facing
   * it comes to a quarter of a DirectionalLight of 1 (so out to about 6 * sqrt(intensity) metres, less as the surface
   * turns away or a spot's cone ends), the surface is its own colour times this colour (scaled to the brightness of
   * white, so a white light lights it as the sun does), cut hard and ragged like the sun's shadows, in its shadow if
   * `castShadow`; at four times that (about half the distance) a band brighter by a quarter. It takes the place of the
   * look's `mid`/`shadow` shade there, and on a sunlit surface adds only its hue above the sun's. Off by default: a
   * light without it is ignored under paint, as before. Up to 8 painting lights a frame. */
  paint?: boolean;
}

/** A bulb: light from a point, every way.
 */
export function PointLight({ intensity = 1, color = "#ffffff", children, ...rest }: PointLightProps & BevyParts & Pick<BevyUnits, "lumens">) {
  checkLight("PointLight", { ...rest, intensity, color });
  return node3d("PointLight", { ...rest, intensity, color: toHex("PointLight", "color", color) }, children);
}

export interface SpotLightProps extends PointLightProps {
  /** where it points (the origin by default) */
  target?: Vec3;
  /** its rotation, a quaternion [x, y, z, w], as a Bevy light's Transform holds it: placed by it exactly over
   *  `target` (raea/light sends it) */
  rotation?: [number, number, number, number];
  /** the cone's half-angle in radians (π/3 by default), up to π/2 */
  angle?: number;
  /** 0..1: how soft the cone's edge is */
  penumbra?: number;
}

/** A cone of light from `position` towards `target`: a stage spot, a product hero light.
 */
export function SpotLight({ intensity = 1, color = "#ffffff", children, ...rest }: SpotLightProps & BevyParts & Pick<BevyUnits, "lumens">) {
  checkLight("SpotLight", { ...rest, intensity, color });
  if (rest.angle !== undefined && !(rest.angle > 0 && rest.angle <= Math.PI / 2)) throw new RangeError(`SpotLight: angle is a half-angle in radians, in (0, π/2], got ${rest.angle}`);
  if (rest.penumbra !== undefined && !(rest.penumbra >= 0 && rest.penumbra <= 1)) throw new RangeError(`SpotLight: penumbra must be in [0, 1], got ${rest.penumbra}`);
  return node3d("SpotLight", { ...rest, intensity, color: toHex("SpotLight", "color", color) }, children);
}

export interface RectAreaLightProps {
  position?: Vec3;
  /** where its face looks (the origin by default) */
  target?: Vec3;
  /** its rotation, a quaternion [x, y, z, w], as a Bevy light's Transform holds it: placed by it exactly over
   *  `target` (raea/light sends it) */
  rotation?: [number, number, number, number];
  /** its face's size in metres (1 x 1 by default) */
  width?: number;
  height?: number;
  /** 1 lights a surface about as brightly as a PointLight of 1 */
  intensity?: number;
  color?: string;
  /** how far it reaches (20 by default) */
  distance?: number;
  layers?: number[];
}

/** A rectangle of light (Bevy's RectLight): a softbox, a window's glow, a TV's face, a light panel. Its light falls
 * soft and wide from the whole face, not a point; it casts no shadows (Bevy 0.20 doesn't shadow area lights).
 * @deprecated <RectLight> (lumens, width, height), raea/light */
export function RectAreaLight({ intensity = 1, color = "#ffffff", width = 1, height = 1, ...rest }: RectAreaLightProps & Pick<BevyUnits, "lumens">) {
  checkLight("RectAreaLight", { ...rest, intensity, color });
  for (const [k, v] of [["width", width], ["height", height]] as const) if (!(v > 0) || !Number.isFinite(v)) throw new RangeError(`RectAreaLight: ${k} must be a positive number of metres, got ${v}`);
  return node3d("RectAreaLight", { ...rest, intensity, width, height, color: toHex("RectAreaLight", "color", color) });
}

export interface AtmosphereProps {
  /** it lights the scene too, as a sky does (ambient and reflections from the sky it draws) */
  light?: boolean;
  /** the ground's brightness the air's scattering sees, 0..1 (0.3 by default) */
  groundAlbedo?: number;
}

/** A procedural sky: Bevy's physically based atmosphere (Earth's air), drawn behind everything and lit by the
 * DirectionalLights, so a sun low on the horizon makes a sunset. Inside the Canvas3D, once. */
export function Atmosphere(props: AtmosphereProps) {
  if (props.groundAlbedo !== undefined && !(props.groundAlbedo >= 0 && props.groundAlbedo <= 1)) throw new RangeError(`Atmosphere: groundAlbedo is 0..1, got ${props.groundAlbedo}`);
  return node3d("Atmosphere", { ...props });
}

export interface PerspectiveCameraProps {
  position?: Vec3;
  /** the point it looks at (the origin by default); animate position and lookAt for camera moves */
  lookAt?: Vec3;
  /** vertical field of view in degrees */
  fov?: number;
  near?: number;
  far?: number;
  /** the distance in focus, in metres, with a <DepthOfField>; animate it to pull focus (by default, the lookAt
   * point's distance) */
  focus?: number;
  /** which way is up for the camera ([0, 1, 0] by default): tilt it to roll the camera (a solved camera rolls) */
  up?: Vec3;
  /** its rotation, a quaternion [x, y, z, w], which places it exactly (rolled or not) over `lookAt` and `up`, as a
   *  Camera3d's Transform does; lookAt still says where it looks, for its focus */
  rotation?: [number, number, number, number];
  /** the frame is a window on a larger view: the view's `width` x `height` (frame pixels; `fov` is its vertical field)
   * and the window's top-left `x`, `y` in it. A crop of footage that keeps its lens's centre (<Matchmove> in 9:16 from
   * 16:9 footage) */
  view?: { width: number; height: number; x: number; y: number };
  /** <Camera3d>'s order and clear_color, as the camera row has them: its order among the cameras, "none" to draw over
   *  the cameras before without clearing, and the colour it clears to (#rrggbb[aa]) */
  order?: number;
  clear?: "none";
  bg?: string;
  viewport?: { physical_position: [number, number]; physical_size: [number, number] };
  /** false: it draws nothing this frame (<Camera3d is_active>), and the first camera that does is the piece's; a frame
   *  where another camera becomes the piece's is a cut (docs/rerender.feature RR2) */
  active?: boolean;
}

/** The viewpoint the scene is drawn from.
 * @deprecated <Camera3d> with `projection={{ Perspective: { fov } }}` (fov in radians), raea/camera */
export function PerspectiveCamera({ fov = 50, children, ...rest }: PerspectiveCameraProps & BevyParts) {
  if (rest.position !== undefined) checkVec("PerspectiveCamera", "position", rest.position);
  if (rest.lookAt !== undefined) checkVec("PerspectiveCamera", "lookAt", rest.lookAt);
  if (!(fov > 0 && fov < 180)) throw new RangeError(`PerspectiveCamera: fov must be between 0 and 180 degrees, got ${fov}`);
  if (rest.focus !== undefined && !(rest.focus > 0)) throw new RangeError(`PerspectiveCamera: focus must be a distance above 0, got ${rest.focus}`);
  if (rest.up !== undefined) checkVec("PerspectiveCamera", "up", rest.up);
  const v = rest.view;
  if (v !== undefined && !(v && v.width > 0 && v.height > 0 && Number.isFinite(v.x) && Number.isFinite(v.y))) throw new TypeError(`PerspectiveCamera: view is { width, height, x, y } in frame pixels, got ${JSON.stringify(v)}`);
  useCamera3d({ position: rest.position, lookAt: rest.lookAt, fov, up: rest.up }, rest.active !== false);
  return node3d("PerspectiveCamera", { ...rest, fov }, children);
}
