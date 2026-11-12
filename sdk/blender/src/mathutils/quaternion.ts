// mathutils.Quaternion in TypeScript, [w, x, y, z] as Blender keeps it. Operators: a @ b is a.matmul(b) (a rotation
// composed, or a vector rotated), a * b a.mul(b), a + b a.add(b), a - b a.sub(b), -a a.neg().
import { Euler } from "./euler";
import { Matrix } from "./matrix";
import { anyToRotmat, type RotationLike } from "./rot";
import { Vector, nums, type VectorLike } from "./vector";
import * as m from "./math";

export type QuaternionLike = Quaternion | ArrayLike<number> | Iterable<number>;
const SWING: Record<string, number> = { X: 0, Y: 1, Z: 2 };

export class Quaternion implements Iterable<number> {
  /** @internal [w, x, y, z] */
  _q: number[];
  /** @internal */
  _frozen = false;

  /** Quaternion() is the identity; Quaternion([w, x, y, z]); Quaternion(axis, angle); Quaternion([x, y, z]) an
   * exponential map. */
  constructor(seq?: QuaternionLike, angle?: number) {
    if (seq === undefined) {
      this._q = m.unitQ();
      return;
    }
    const a = seq instanceof Quaternion ? seq._q.slice() : nums(seq as VectorLike, "Quaternion");
    if (angle !== undefined) {
      if (a.length !== 3) throw new TypeError("Quaternion(axis, angle): the axis must be 3 numbers");
      this._q = m.axisAngleToQuat(a, wrap(angle));
    } else if (a.length === 4) this._q = a;
    else if (a.length === 3) {
      const axis = a.slice();
      const ang = wrap(m.normalizeIn(axis, 3));
      this._q = m.axisAngleToQuat(axis, ang);
    } else throw new TypeError("Quaternion(): expects 4 numbers, or 3 (an exponential map or, with an angle, an axis)");
  }
  #mut(): number[] {
    if (this._frozen) throw new TypeError("Quaternion is frozen, cannot set");
    return this._q;
  }

  __len__(): number { return 4; }
  __getitem__(i: number): number {
    const j = i < 0 ? 4 + i : i;
    if (j < 0 || j > 3) throw new RangeError("quaternion[attribute]: array index out of range");
    return this._q[j];
  }
  __setitem__(i: number, x: number): void {
    const j = i < 0 ? 4 + i : i;
    if (j < 0 || j > 3) throw new RangeError("quaternion[attribute] = x: array assignment index out of range");
    this.#mut()[j] = x;
  }
  [Symbol.iterator](): Iterator<number> { return this._q.slice()[Symbol.iterator](); }
  [index: number]: number;

  get w(): number { return this._q[0]; }
  set w(v: number) { this.#mut()[0] = v; }
  get x(): number { return this._q[1]; }
  set x(v: number) { this.#mut()[1] = v; }
  get y(): number { return this._q[2]; }
  set y(v: number) { this.#mut()[2] = v; }
  get z(): number { return this._q[3]; }
  set z(v: number) { this.#mut()[3] = v; }
  get magnitude(): number { return m.len(this._q, 4); }
  /** The rotation's angle in radians; setting it keeps the axis and the length. */
  get angle(): number {
    const [t] = m.normalizedQ(this._q);
    return m.sanitizeAxisAngle(null, 2 * m.saacos(t[0]));
  }
  set angle(a: number) {
    const [t, l] = m.normalizedQ(this._q);
    const [axis] = m.quatToAxisAngle(t);
    const ang = m.sanitizeAxisAngle(axis, wrap(a));
    this.#mut();
    this._q = m.axisAngleToQuat(axis, ang).map((x) => x * l);
  }
  /** The rotation's axis; setting it keeps the angle and the length. */
  get axis(): Vector {
    const [axis, angle] = m.quatToAxisAngle(m.normalizedQ(this._q)[0]);
    m.sanitizeAxisAngle(axis, angle);
    return new Vector(axis);
  }
  set axis(v: VectorLike) {
    const [t, l] = m.normalizedQ(this._q);
    const [, angle] = m.quatToAxisAngle(t);
    const axis = nums(v);
    const ang = m.sanitizeAxisAngle(axis, angle);
    this.#mut();
    this._q = m.axisAngleToQuat(axis, ang).map((x) => x * l);
  }
  get is_wrapped(): boolean { return false; }
  get is_frozen(): boolean { return this._frozen; }
  get is_valid(): boolean { return true; }
  get owner(): unknown { return null; }

  // ---- in place ----
  identity(): void { this.#mut(); this._q = m.unitQ(); }
  negate(): void { const q = this.#mut(); for (let i = 0; i < 4; i++) q[i] = -q[i]; }
  conjugate(): void { const q = this.#mut(); q[1] = -q[1]; q[2] = -q[2]; q[3] = -q[3]; }
  invert(): void { this.#mut(); this._q = m.invertQ(this._q); }
  normalize(): void { this.#mut(); this._q = m.normalizedQ(this._q)[0]; }
  rotate(other: RotationLike | Matrix): void {
    const [t, l] = m.normalizedQ(this._q);
    const r = m.normalizeM3(m.mulM3(anyToRotmat(other, "Quaternion.rotate(value)"), m.quatToMat3(t)));
    this.#mut();
    this._q = m.mat3ToQuat(r).map((x) => x * l);
  }
  make_compatible(other: QuaternionLike): void {
    const old = toQ(other);
    const [a, l] = m.normalizedQ(this._q);
    let q: number[];
    const [ou, ol] = m.normalizedQ(old);
    if (ol > 1e-4) {
      const delta = rotationBetween(ou, a);
      q = m.mulQ(old, delta);
      const neg = q.map((x) => -x);
      if (dist2(neg, old) < dist2(q, old)) q = neg;
    } else q = a;
    this.#mut();
    this._q = q.map((x) => x * l);
  }
  freeze(): this { this._frozen = true; return this; }

  // ---- new values ----
  copy(): Quaternion { return new Quaternion(this._q); }
  conjugated(): Quaternion { const q = this.copy(); q.conjugate(); return q; }
  inverted(): Quaternion { const q = this.copy(); q.invert(); return q; }
  normalized(): Quaternion { const q = this.copy(); q.normalize(); return q; }
  to_euler(order: m.Order = "XYZ", euler_compat?: Euler | VectorLike): Euler {
    const o = m.order(order);
    const mat = m.quatToMat3(m.normalizedQ(this._q)[0]);
    return new Euler(m.mat3ToEul(mat, o, euler_compat === undefined ? undefined : nums(euler_compat as VectorLike)), o);
  }
  to_matrix(): Matrix { return Matrix._fromCols(m.quatToMat3(this._q)); }
  to_axis_angle(): [Vector, number] {
    const [axis, angle] = m.quatToAxisAngle(m.normalizedQ(this._q)[0]);
    const a = m.sanitizeAxisAngle(axis, angle);
    return [new Vector(axis), a];
  }
  /** (swing, twist): the rotation split into a swing that leaves `axis` alone, and the twist angle about it. */
  to_swing_twist(axis: "X" | "Y" | "Z"): [Quaternion, number] {
    const ax = SWING[axis];
    if (ax === undefined) throw new TypeError("Quaternion.to_swing_twist(): axis must be 'X', 'Y' or 'Z'");
    const q = this._q[0] < 0 ? this._q.map((x) => -x) : this._q.slice();
    const t = Math.atan2(q[ax + 1], q[0]);
    const inv = [Math.cos(t), 0, 0, 0];
    inv[ax + 1] = -Math.sin(t);
    return [new Quaternion(m.mulQ(q, inv)), 2 * t];
  }
  to_exponential_map(): Vector {
    const [axis, angle] = m.quatToAxisAngle(m.normalizedQ(this._q)[0]);
    return new Vector(axis.map((x) => x * angle));
  }
  cross(other: QuaternionLike): Quaternion { return new Quaternion(m.mulQ(this._q, toQ(other))); }
  dot(other: QuaternionLike): number { return m.dot(this._q, toQ(other), 4); }
  rotation_difference(other: QuaternionLike): Quaternion { return new Quaternion(rotationBetween(this._q, toQ(other))); }
  slerp(other: QuaternionLike, factor: number): Quaternion {
    if (factor > 1 || factor < 0) throw new RangeError("quat.slerp(): interpolation factor must be between 0.0 and 1.0");
    return new Quaternion(m.slerpQ(this._q, toQ(other), factor));
  }

  // ---- Python's operators ----
  /** a @ b: the rotations composed (a Quaternion), or a 3D vector rotated (a Vector). */
  matmul(other: QuaternionLike): Quaternion;
  matmul(other: Vector): Vector;
  matmul(other: QuaternionLike | Vector): Quaternion | Vector {
    if (other instanceof Vector) {
      const v = other._r();
      if (v.length !== 3) throw new TypeError("quat @ vec: only 3D vector rotations are supported");
      return new Vector(rotateVec(this._q, v));
    }
    return new Quaternion(m.mulQ(this._q, toQ(other)));
  }
  /** a * b: by a number, or component-wise by another quaternion. */
  mul(other: number | QuaternionLike): Quaternion {
    if (typeof other === "number") return new Quaternion(this._q.map((x) => x * other));
    const b = toQ(other);
    return new Quaternion(this._q.map((x, i) => x * b[i]));
  }
  add(other: QuaternionLike): Quaternion { const b = toQ(other); return new Quaternion(this._q.map((x, i) => x + b[i])); }
  sub(other: QuaternionLike): Quaternion { const b = toQ(other); return new Quaternion(this._q.map((x, i) => x - b[i])); }
  neg(): Quaternion { return new Quaternion(this._q.map((x) => -x)); }
  equals(other: unknown): boolean { return other instanceof Quaternion && other._q.every((x, i) => x === this._q[i]); }

  toString(): string { return `Quaternion((${this._q.map(m.pyFloat).join(", ")}))`; }
  toJSON(): number[] { return this._q.slice(); }
}

function toQ(v: QuaternionLike): number[] {
  if (v instanceof Quaternion) return v._q;
  const a = nums(v as VectorLike, "Quaternion");
  if (a.length !== 4) throw new TypeError("expected a Quaternion or 4 numbers");
  return a;
}
/** angle_wrap_rad: into [-pi, pi) */
function wrap(a: number): number {
  const b = 2 * Math.PI, x = a + Math.PI;
  return x - b * Math.floor(x / b) - Math.PI;
}
/** rotation_between_quats_to_quat */
function rotationBetween(q1: number[], q2: number[]): number[] {
  const t = m.conjQ(q1);
  const f = 1 / m.dot(t, t, 4);
  return m.mulQ(t.map((x) => x * f), q2);
}
const dist2 = (a: number[], b: number[]): number => a.reduce((s, x, i) => s + (x - b[i]) ** 2, 0);
/** mul_qt_v3 */
function rotateVec(q: number[], v: number[]): number[] {
  const r = v.slice();
  const t0 = -q[1] * r[0] - q[2] * r[1] - q[3] * r[2];
  let t1 = q[0] * r[0] + q[2] * r[2] - q[3] * r[1];
  let t2 = q[0] * r[1] + q[3] * r[0] - q[1] * r[2];
  r[2] = q[0] * r[2] + q[1] * r[1] - q[2] * r[0];
  r[0] = t1;
  r[1] = t2;
  t1 = t0 * -q[1] + r[0] * q[0] - r[1] * q[3] + r[2] * q[2];
  t2 = t0 * -q[2] + r[1] * q[0] - r[2] * q[1] + r[0] * q[3];
  r[2] = t0 * -q[3] + r[2] * q[0] - r[0] * q[2] + r[1] * q[1];
  r[0] = t1;
  r[1] = t2;
  return r;
}
