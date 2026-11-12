// mathutils.Vector in TypeScript: every member Blender 5.2 has (swizzles too), the same maths (math.ts follows
// Blender's C), so a Vector read from Blender, computed with here and written back behaves as it would in Python.
// Python's operators are methods: a + b is a.add(b), a - b a.sub(b), a * b a.mul(b), a / b a.div(b), a @ b
// a.matmul(b), -a a.neg(), a == b a.equals(b).
import { anyToRotmat, type RotationLike } from "./rot";
import { Matrix } from "./matrix";
import { Quaternion } from "./quaternion";
import * as m from "./math";

/** Where a wrapped value lives (a Matrix's row, column or translation): read before each use, written after each change. */
export interface Owner {
  readonly obj: unknown;
  read(into: number[]): void;
  write(from: number[]): void;
}

export type VectorLike = Vector | ArrayLike<number> | Iterable<number>;

export function nums(v: VectorLike, what = "Vector"): number[] {
  if (v instanceof Vector) return v._r().slice();
  const a = Array.from(v as ArrayLike<number>);
  for (const x of a) if (typeof x !== "number") throw new TypeError(`${what}: expected numbers, not ${typeof x}`);
  return a;
}

const TRACK: Record<string, number> = { X: 0, Y: 1, Z: 2, "-X": 3, "-Y": 4, "-Z": 5 };
const UP: Record<string, number> = { X: 0, Y: 1, Z: 2 };

export class Vector implements Iterable<number> {
  /** @internal the components */
  _d: number[];
  /** @internal */
  _o: Owner | null = null;
  /** @internal */
  _frozen = false;

  constructor(seq: VectorLike = [0, 0, 0]) {
    const a = nums(seq);
    if (a.length < 2) throw new TypeError("Vector(): expected a sequence of at least two floats");
    this._d = a;
  }

  /** @internal a Vector backed by an owner (writes go through to it) */
  static _wrap(n: number, owner: Owner): Vector {
    const v = new Vector(new Array(Math.max(n, 2)).fill(0));
    v._o = owner;
    owner.read(v._d);
    return v;
  }
  /** @internal the current components */
  _r(): number[] {
    if (this._o) this._o.read(this._d);
    return this._d;
  }
  /** @internal components to change in place */
  _m(): number[] {
    if (this._frozen) throw new TypeError("Vector is frozen, cannot set");
    return this._r();
  }
  /** @internal */
  _w(): this {
    this._o?.write(this._d);
    return this;
  }

  // ---- class methods ----
  static Fill(size: number, fill = 0): Vector {
    if (size < 2) throw new RangeError("Vector.Fill(): invalid size");
    return new Vector(new Array(size).fill(fill));
  }
  static Range(start: number, stop?: number, step = 1): Vector {
    if (stop === undefined) [start, stop] = [0, start];
    if (step === 0) throw new RangeError("Vector.Range(): step must not be zero");
    const out: number[] = [];
    for (let x = start; step > 0 ? x < stop : x > stop; x += step) out.push(x);
    if (out.length < 2) throw new RangeError("Vector.Range(): invalid size");
    return new Vector(out);
  }
  static Linspace(start: number, stop: number, size: number): Vector {
    if (size < 2) throw new RangeError("Vector.Linspace(): invalid size");
    const step = (stop - start) / (size - 1);
    return new Vector(Array.from({ length: size }, (_, i) => start + i * step));
  }
  static Repeat(vector: VectorLike, size: number): Vector {
    const v = nums(vector);
    if (size < 2) throw new RangeError("Vector.Repeat(): invalid size");
    return new Vector(Array.from({ length: size }, (_, i) => v[i % v.length]));
  }

  // ---- sequence ----
  __len__(): number {
    return this._r().length;
  }
  __getitem__(i: number): number {
    const d = this._r();
    const j = i < 0 ? d.length + i : i;
    if (j < 0 || j >= d.length) throw new RangeError("vector[index]: out of range");
    return d[j];
  }
  __setitem__(i: number, x: number): void {
    const d = this._m();
    const j = i < 0 ? d.length + i : i;
    if (j < 0 || j >= d.length) throw new RangeError("vector[index] = x: assignment index out of range");
    d[j] = x;
    this._w();
  }
  [Symbol.iterator](): Iterator<number> {
    return this._r().slice()[Symbol.iterator]();
  }
  [index: number]: number;

  // ---- components ----
  get x(): number { return this.__getitem__(0); }
  set x(v: number) { this.__setitem__(0, v); }
  get y(): number { return this.__getitem__(1); }
  set y(v: number) { this.__setitem__(1, v); }
  get z(): number { return this.__getitem__(2); }
  set z(v: number) { this.__setitem__(2, v); }
  get w(): number { return this.__getitem__(3); }
  set w(v: number) { this.__setitem__(3, v); }
  /** The vector's length; setting it scales the vector. */
  get length(): number { return m.len(this._r()); }
  set length(l: number) {
    if (l < 0) throw new RangeError("cannot set a vectors length to a negative value");
    const d = this._m();
    const cur = m.len(d);
    if (l === 0 || cur === 0) d.fill(0);
    else for (let i = 0; i < d.length; i++) d[i] *= l / cur;
    this._w();
  }
  get length_squared(): number { return m.dot(this._r(), this._d); }
  get magnitude(): number { return this.length; }
  get is_wrapped(): boolean { return false; }
  get is_frozen(): boolean { return this._frozen; }
  get is_valid(): boolean { return true; }
  get owner(): unknown { return this._o ? this._o.obj : null; }

  // ---- in place ----
  zero(): void { this._m().fill(0); this._w(); }
  negate(): void { const d = this._m(); for (let i = 0; i < d.length; i++) d[i] = -d[i]; this._w(); }
  /** Unit length; for 4D vectors only x, y and z are normalized. */
  normalize(): void {
    const d = this._m();
    m.normalizeIn(d, d.length === 4 ? 3 : d.length);
    this._w();
  }
  resize(size: number): void {
    if (this._o) throw new TypeError("Vector.resize(): cannot resize a wrapped vector");
    if (size < 2) throw new RangeError("Vector.resize(): invalid size");
    const d = this._m();
    const old = d.length;
    d.length = size;
    for (let i = old; i < size; i++) d[i] = 0;
  }
  resize_2d(): void { this.resize(2); }
  resize_3d(): void { this.resize(3); }
  /** To 4D, w = 1 when it was 2D or 3D. */
  resize_4d(): void {
    const old = this._r().length;
    this.resize(4);
    if (old < 4) this._d[3] = 1;
  }
  freeze(): this { this._frozen = true; return this; }
  rotate(other: RotationLike | Matrix): void {
    const d = this._m();
    if (d.length === 2) {
      if (!(other instanceof Matrix) || other._rows !== 2 || other._cols !== 2) throw new TypeError("Vector.rotate(): a 2D vector rotates by a 2x2 Matrix");
      const c = other._c;
      const x = c[0][0] * d[0] + c[1][0] * d[1], y = c[0][1] * d[0] + c[1][1] * d[1];
      d[0] = x; d[1] = y;
    } else if (d.length === 3) {
      const r = m.mulM3V3(anyToRotmat(other, "Vector.rotate(value)"), d);
      d[0] = r[0]; d[1] = r[1]; d[2] = r[2];
    } else throw new TypeError("Vector must be 2D or 3D");
    this._w();
  }

  // ---- new values ----
  copy(): Vector { return new Vector(this._r()); }
  normalized(): Vector { const v = this.copy(); v.normalize(); return v; }
  resized(size: number): Vector { const v = this.copy(); v.resize(size); return v; }
  to_2d(): Vector { return new Vector(pad(this._r(), 2, 0)); }
  to_3d(): Vector { return new Vector(pad(this._r(), 3, 0)); }
  /** A 4D copy; w is 1 unless the vector had one. */
  to_4d(): Vector {
    const d = this._r();
    const out = pad(d, 4, 0);
    if (d.length < 4) out[3] = 1;
    return new Vector(out);
  }
  to_tuple(precision = -1): number[] {
    const d = this._r().slice();
    if (precision < 0) return d;
    return d.map((x) => pyRound(x, precision));
  }
  orthogonal(): Vector {
    const d = this._r();
    if (d.length === 2) return new Vector([-d[1], d[0]]);
    if (d.length === 3) return new Vector(m.ortho3(d));
    throw new TypeError("Vector.orthogonal(): Vector must be 3D or 2D");
  }
  reflect(mirror: VectorLike): Vector {
    const d = this._r();
    const mi = nums(mirror);
    const n = [mi[0], mi[1], mi.length > 2 ? mi[2] : 0];
    const v = [d[0], d[1], d.length > 2 ? d[2] : 0];
    m.normalizeIn(n, 3);
    const k = 2 * m.dot(v, n, 3);
    return new Vector([v[0] - n[0] * k, v[1] - n[1] * k, v[2] - n[2] * k].slice(0, d.length));
  }
  cross(other: VectorLike): Vector | number {
    const a = this._r(), b = nums(other);
    if (a.length !== b.length) throw new TypeError("Vector.cross(other): vectors must be the same size");
    if (a.length === 2) return a[0] * b[1] - a[1] * b[0];
    if (a.length === 3) return new Vector(m.cross3(a, b));
    throw new TypeError("Vector must be 2D or 3D");
  }
  dot(other: VectorLike): number {
    const a = this._r(), b = nums(other);
    if (a.length !== b.length) throw new TypeError("Vector.dot(other): vectors must be the same size");
    return m.dot(a, b);
  }
  angle<F = never>(other: VectorLike, fallback?: F): number | F {
    const a = this._r(), b = nums(other);
    if (a.length !== b.length) throw new TypeError("Vector.angle(other): vectors must be the same size");
    const n = Math.min(a.length, 3);
    const la = m.dot(a, a, n), lb = m.dot(b, b, n);
    if (!la || !lb) {
      if (fallback !== undefined) return fallback;
      throw new RangeError("Vector.angle(other): zero length vectors have no valid angle");
    }
    return m.saacos(m.dot(a, b, n) / (Math.sqrt(la) * Math.sqrt(lb)));
  }
  angle_signed<F = never>(other: VectorLike, fallback?: F): number | F {
    const a = this._r(), b = nums(other);
    if (a.length !== 2 || b.length !== 2) throw new TypeError("Vector.angle_signed(other): only 2D vectors are supported");
    if (!m.dot(a, a) || !m.dot(b, b)) {
      if (fallback !== undefined) return fallback;
      throw new RangeError("Vector.angle_signed(other): zero length vectors have no valid angle");
    }
    return Math.atan2(a[1] * b[0] - a[0] * b[1], a[0] * b[0] + a[1] * b[1]);
  }
  rotation_difference(other: VectorLike): Quaternion {
    const a = this._r().slice(), b = nums(other);
    if (a.length !== 3 || b.length !== 3) throw new TypeError("Vector.rotation_difference(other): expects both vectors to be size 3");
    m.normalizeIn(a, 3);
    m.normalizeIn(b, 3);
    return new Quaternion(m.rotationBetweenVecs(a, b));
  }
  project(other: VectorLike): Vector {
    const a = this._r(), b = nums(other);
    if (a.length !== b.length) throw new TypeError("Vector.project(other): vectors must be the same size");
    const d2 = m.dot(b, b);
    const k = d2 !== 0 ? m.dot(a, b) / d2 : m.dot(a, b);
    return new Vector(b.map((x) => x * k));
  }
  lerp(other: VectorLike, factor: number): Vector {
    const a = this._r(), b = nums(other);
    if (a.length !== b.length) throw new TypeError("Vector.lerp(): vectors must be the same size");
    return new Vector(a.map((x, i) => x + (b[i] - x) * factor));
  }
  slerp<F = never>(other: VectorLike, factor: number, fallback?: F): Vector | F {
    const a = this._r().slice(), b = nums(other);
    if (a.length !== b.length) throw new TypeError("Vector.slerp(): vectors must be the same size");
    const la = m.normalizeIn(a), lb = m.normalizeIn(b);
    if (la < m.FLT_EPSILON || lb < m.FLT_EPSILON) {
      if (fallback !== undefined) return fallback;
      throw new RangeError("Vector.slerp(): zero length vectors unsupported");
    }
    const cosom = m.dot(a, b);
    if (cosom < -1 + m.FLT_EPSILON) {
      if (fallback !== undefined) return fallback;
      throw new RangeError("Vector.slerp(): opposite vectors unsupported");
    }
    const [w0, w1] = m.slerpWeights(factor, cosom);
    return new Vector(a.map((x, i) => w0 * x + w1 * b[i]));
  }
  to_track_quat(track: "X" | "Y" | "Z" | "-X" | "-Y" | "-Z" = "Z", up: "X" | "Y" | "Z" = "Y"): Quaternion {
    const d = this._r();
    if (d.length !== 3) throw new TypeError("Vector.to_track_quat(): only for 3D vectors");
    const t = TRACK[track], u = UP[up];
    if (t === undefined) throw new TypeError("only X, -X, Y, -Y, Z or -Z for track axis");
    if (u === undefined) throw new TypeError("only X, Y or Z for up axis");
    if (t === u) throw new TypeError("Can't have the same axis for track and up");
    return new Quaternion(vecToQuat([-d[0], -d[1], -d[2]], t, u));
  }

  // ---- Python's operators ----
  add(other: VectorLike): Vector { return this.#zip(other, "+", (a, b) => a + b); }
  sub(other: VectorLike): Vector { return this.#zip(other, "-", (a, b) => a - b); }
  /** a * b: by a number, or component-wise by a vector of the same size. */
  mul(other: number | VectorLike): Vector {
    if (typeof other === "number") return new Vector(this._r().map((x) => x * other));
    return this.#zip(other, "*", (a, b) => a * b);
  }
  div(other: number): Vector {
    if (other === 0) throw new RangeError("Vector division: divide by zero error");
    return new Vector(this._r().map((x) => x / other));
  }
  /** a @ b: the dot product with a vector, or the row vector times a matrix. */
  matmul(other: VectorLike | Matrix): number | Vector {
    if (other instanceof Matrix) return other._rowVecMul(this._r());
    return this.dot(other);
  }
  neg(): Vector { return new Vector(this._r().map((x) => -x)); }
  equals(other: unknown): boolean {
    if (!(other instanceof Vector)) return false;
    const a = this._r(), b = other._r();
    return a.length === b.length && a.every((x, i) => x === b[i]);
  }
  #zip(other: VectorLike, op: string, f: (a: number, b: number) => number): Vector {
    const a = this._r(), b = nums(other);
    if (a.length !== b.length) throw new TypeError(`Vector ${op} Vector: vectors must have the same dimensions for this operation`);
    return new Vector(a.map((x, i) => f(x, b[i])));
  }

  toString(): string { return `Vector((${this._r().map(m.pyFloat).join(", ")}))`; }
  toJSON(): number[] { return this._r().slice(); }
}

function pad(d: number[], n: number, fill: number): number[] {
  const out = d.slice(0, n);
  while (out.length < n) out.push(fill);
  return out;
}

/** Python's round(x, n) (half to even on the decimal value) */
export function pyRound(x: number, n: number): number {
  const p = 10 ** n;
  const y = x * p;
  const r = Math.round(y);
  return (Math.abs(y % 1) === 0.5 ? 2 * Math.round(y / 2) : r) / p;
}

/** vec_to_quat: the rotation pointing axis `axis` (0..5: X Y Z -X -Y -Z) along vec, `up` kept up */
function vecToQuat(vec: number[], axis: number, up: number): number[] {
  const eps = 1e-4;
  let q = m.unitQ();
  const l = m.len(vec, 3);
  if (l === 0) return q;
  let tvec: number[];
  if (axis > 2) { tvec = vec.slice(); axis -= 3; } else tvec = vec.map((x) => -x);
  let nor: number[], co: number;
  if (axis === 0) {
    nor = [0, -tvec[2], tvec[1]];
    if (Math.abs(tvec[1]) + Math.abs(tvec[2]) < eps) nor[1] = 1;
    co = tvec[0];
  } else if (axis === 1) {
    nor = [tvec[2], 0, -tvec[0]];
    if (Math.abs(tvec[0]) + Math.abs(tvec[2]) < eps) nor[2] = 1;
    co = tvec[1];
  } else {
    nor = [-tvec[1], tvec[0], 0];
    if (Math.abs(tvec[0]) + Math.abs(tvec[1]) < eps) nor[0] = 1;
    co = tvec[2];
  }
  co /= l;
  m.normalizeIn(nor, 3);
  const a = m.saacos(co);
  q = [Math.cos(a / 2), nor[0] * Math.sin(a / 2), nor[1] * Math.sin(a / 2), nor[2] * Math.sin(a / 2)];
  if (axis !== up) {
    const fp = m.quatToMat3(q)[2];
    let angle: number;
    if (axis === 0) angle = up === 1 ? 0.5 * Math.atan2(fp[2], fp[1]) : -0.5 * Math.atan2(fp[1], fp[2]);
    else if (axis === 1) angle = up === 0 ? -0.5 * Math.atan2(fp[2], fp[0]) : 0.5 * Math.atan2(fp[0], fp[2]);
    else angle = up === 0 ? 0.5 * Math.atan2(-fp[1], -fp[0]) : -0.5 * Math.atan2(-fp[0], -fp[1]);
    const c = Math.cos(angle), s = Math.sin(angle) / l;
    q = m.mulQ([c, tvec[0] * s, tvec[1] * s, tvec[2] * s], q);
  }
  return q;
}

// v[0]..v[3], and the swizzles (v.xy, v.zyx, v.wzyx, ...): read any; write one with no axis twice
const AXES = "xyzw";
for (let i = 0; i < 4; i++) {
  Object.defineProperty(Vector.prototype, i, {
    get(this: Vector) { return this.__getitem__(i); },
    set(this: Vector, x: number) { this.__setitem__(i, x); },
  });
}
function swizzles(prefix: number[]): void {
  for (let a = 0; a < 4; a++) {
    const idx = [...prefix, a];
    if (idx.length >= 2) {
      const name = idx.map((i) => AXES[i]).join("");
      const unique = new Set(idx).size === idx.length;
      Object.defineProperty(Vector.prototype, name, {
        get(this: Vector) {
          const d = this._r();
          if (idx.some((i) => i >= d.length)) throw new TypeError(`Vector has no attribute '${name}' at its size`);
          return new Vector(idx.map((i) => d[i]));
        },
        set(this: Vector, v: VectorLike) {
          if (!unique) throw new TypeError(`Vector swizzle ${name} has repeated axes and can't be assigned`);
          const d = this._m(), src = nums(v);
          if (src.length !== idx.length) throw new TypeError(`Vector.${name} = value: expected ${idx.length} components`);
          if (idx.some((i) => i >= d.length)) throw new TypeError(`Vector has no attribute '${name}' at its size`);
          idx.forEach((i, k) => (d[i] = src[k]));
          this._w();
        },
      });
    }
    if (idx.length < 4) swizzles(idx);
  }
}
swizzles([]);
