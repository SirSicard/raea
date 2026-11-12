// mathutils_any_to_rotmat: a rotation given as an Euler, a Quaternion or a 3x3/4x4 Matrix, as a unit 3x3 matrix.
import { Euler } from "./euler";
import { Matrix } from "./matrix";
import { Quaternion } from "./quaternion";
import * as m from "./math";

export type RotationLike = Euler | Quaternion | Matrix;

export function anyToRotmat(value: RotationLike | Matrix, what: string): m.M {
  if (value instanceof Euler) return m.eulToMat3(value._e, value._order);
  if (value instanceof Quaternion) return m.quatToMat3(m.normalizedQ(value._q)[0]);
  if (value instanceof Matrix) {
    if (value._rows < 3 || value._cols < 3) throw new TypeError(`${what}: matrix must have minimum 3x3 dimensions`);
    return m.normalizeM3(value._m3());
  }
  throw new TypeError(`${what}: expected an Euler, Quaternion or Matrix`);
}
