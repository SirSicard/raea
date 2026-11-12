// mathutils, computed here in TypeScript with Blender's own maths: values read from Blender arrive as these classes,
// and these classes can be written back. The submodules that need Blender's geometry (geometry, noise, bvhtree,
// kdtree, interpolate) are Blender's, reached through the session (raea/blender's `mathutils` adds them).
export { Color } from "./color";
export { Euler, type EulerOrder } from "./euler";
export { Matrix, MatrixAccess, type MatrixLike } from "./matrix";
export { Quaternion, type QuaternionLike } from "./quaternion";
export { type RotationLike } from "./rot";
export { Vector, type VectorLike } from "./vector";
import type { Vector } from "./vector";

type A = "x" | "y" | "z" | "w";
/** v.xy, v.zyx, v.wzyx, ...: a new Vector of those components; assignable when no axis repeats. */
export type Swizzles = { [K in `${A}${A}` | `${A}${A}${A}` | `${A}${A}${A}${A}`]: Vector };
declare module "./vector" {
  interface Vector extends Swizzles {}
}
