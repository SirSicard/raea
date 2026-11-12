// <Look mode="paint"> (and cartoon) on three.js: raea paints in its material shader, so here each lit surface's
// material becomes a painted one. A surface facing the sun and in its light is its own colour; turned from the sun, its
// colour times `mid` (form shadow); in a cast shadow, its colour times `shadow`. The colours are final (not tone
// mapped), as raea's painted surfaces are. Unlit materials (pictures, the sky) are left as they are. The frame pass
// (effects.ts) then only draws the frame in cells of `pixelSize`.
import * as THREE from "three";

type Props = Record<string, unknown>;
const painted = new WeakMap<THREE.Material, { key: string; mat: THREE.Material }>();

/** the frame's tone mapping, which the composer runs after the surfaces (Scene3d.apply sets it): painted colours are
 * written through its inverse so they come out as themselves. 1: three's ACES at `exposure` (exact), 0: none to undo
 * (no tone mapping, or one with no inverse here, such as Tony's table) */
export const paintTone = { mode: { value: 0 }, exposure: { value: 1 } };

const UNTONE = `
uniform float paintToneMode; uniform float paintExposure;
vec3 paintUntone(vec3 c) {
  if (paintToneMode < 0.5) return c;
  // three's ACESFilmicToneMapping, backwards: its output matrix, the RRT+ODT fit per channel, its input matrix, the
  // exposure (three's 1/0.6 in it)
  const mat3 inM = mat3(vec3(0.59719, 0.07600, 0.02840), vec3(0.35458, 0.90834, 0.13383), vec3(0.04823, 0.01566, 0.83777));
  const mat3 outM = mat3(vec3(1.60475, -0.10208, -0.00327), vec3(-0.53108, 1.10813, -0.07276), vec3(-0.07367, -0.00605, 1.07602));
  vec3 y = clamp(inverse(outM) * clamp(c, 0.0, 0.999), 0.0, 0.999);
  vec3 a = 0.0245786 - y * 0.4329510, q = 1.0 - y * 0.983729, b = 0.000090537 + y * 0.238081;
  vec3 v = (-a + sqrt(a * a + 4.0 * q * b)) / (2.0 * q);
  return max(inverse(inM) * v, 0.0) * 0.6 / max(paintExposure, 1e-5);
}
`;

function paintedOf(src: THREE.Material, mid: THREE.Color, shadow: THREE.Color): THREE.Material {
  const key = mid.getHexString() + shadow.getHexString();
  const had = painted.get(src);
  if (had && had.key === key) return had.mat;
  const s = src as THREE.MeshStandardMaterial;
  const m = new THREE.MeshLambertMaterial({
    color: s.color?.clone() ?? new THREE.Color(1, 1, 1),
    map: s.map ?? null,
    vertexColors: s.vertexColors,
    side: s.side,
    transparent: s.transparent,
    opacity: s.opacity,
    alphaTest: s.alphaTest,
    alphaMap: s.alphaMap ?? null,
  });
  m.toneMapped = false;
  m.onBeforeCompile = (sh) => {
    sh.uniforms.paintMid = { value: mid };
    sh.uniforms.paintShadow = { value: shadow };
    sh.uniforms.paintToneMode = paintTone.mode;
    sh.uniforms.paintExposure = paintTone.exposure;
    sh.fragmentShader = sh.fragmentShader
      .replace("void main() {", "uniform vec3 paintMid; uniform vec3 paintShadow;\n" + UNTONE + "\nvoid main() {")
      .replace(
        "#include <opaque_fragment>",
        `#if NUM_DIR_LIGHTS > 0
          float paintFacing = dot(normalize(vNormal), directionalLights[0].direction);
          float paintLit = dot(reflectedLight.directDiffuse, vec3(0.3333)) / max(dot(diffuseColor.rgb * directionalLights[0].color, vec3(0.3333)) * RECIPROCAL_PI, 1e-5);
          vec3 paintTone = paintFacing <= 0.0 ? paintMid : (paintLit < 0.5 * paintFacing ? paintShadow : vec3(1.0));
          outgoingLight = paintUntone(diffuseColor.rgb * paintTone);
        #else
          outgoingLight = paintUntone(diffuseColor.rgb);
        #endif
        #include <opaque_fragment>`,
      );
  };
  m.customProgramCacheKey = () => "raea-paint";
  painted.set(src, { key, mat: m });
  return m;
}

/** an unlit surface (a picture card) under paint: its colour as itself, through the frame's tone mapping */
function shownOf(src: THREE.MeshBasicMaterial): THREE.Material {
  const had = painted.get(src);
  if (had) return had.mat;
  const m = src.clone();
  m.onBeforeCompile = (sh) => {
    sh.uniforms.paintToneMode = paintTone.mode;
    sh.uniforms.paintExposure = paintTone.exposure;
    sh.fragmentShader = sh.fragmentShader
      .replace("void main() {", UNTONE + "\nvoid main() {")
      .replace("#include <opaque_fragment>", "outgoingLight = paintUntone(outgoingLight);\n#include <opaque_fragment>");
  };
  m.customProgramCacheKey = () => "raea-paint-shown";
  painted.set(src, { key: "", mat: m });
  return m;
}

/** paint (or unpaint) every lit surface in `root` for a Look's props (undefined: no paint look on the page) */
export function paintLook(root: THREE.Object3D, look: Props | undefined) {
  const on = look && (look.mode === "paint" || look.mode === "cartoon");
  const mid = new THREE.Color(String(look?.mid ?? (look?.mode === "cartoon" ? look?.shadow ?? "#f2c7b8" : "#b4b6bc")));
  const shadow = new THREE.Color(String(look?.shadow ?? "#b4b6bc"));
  root.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (!mesh.isMesh) return;
    const own = (mesh.userData.unpainted as THREE.Material | undefined) ?? (mesh.material as THREE.Material);
    if (Array.isArray(own)) return;
    if (on && own instanceof THREE.MeshBasicMaterial && own.map) {
      mesh.userData.unpainted = own;
      mesh.material = shownOf(own);
      return;
    }
    if (!on || !(own instanceof THREE.MeshStandardMaterial || own instanceof THREE.MeshLambertMaterial || own instanceof THREE.MeshPhongMaterial)) {
      if (mesh.userData.unpainted) (mesh.material = own), delete mesh.userData.unpainted;
      return;
    }
    mesh.userData.unpainted = own;
    mesh.material = paintedOf(own, mid, shadow);
  });
}
