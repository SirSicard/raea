// mathutils.Euler in TypeScript: three angles in radians and their order.
import { Matrix } from "./matrix";
import { Quaternion } from "./quaternion";
import { anyToRotmat, type RotationLike } from "./rot";
import { nums, type VectorLike } from "./vector";
import * as m from "./math";

export type EulerOrder = m.Order;

export class Euler implements Iterable<number> {
  /** @internal */
  _e: number[];
  /** @internal */
  _order: m.Order;
  /** @internal */
  _frozen = false;

  constructor(angles: VectorLike | Euler = [0, 0, 0], order: EulerOrder = "XYZ") {
    const a = angles instanceof Euler ? angles._e.slice() : nums(angles, "Euler");
    if (a.length !== 3) throw new TypeError("Euler(): expects 3 angles");
    this._e = a;
    this._order = m.order(order);
  }
  #mut(): number[] {
    if (this._frozen) throw new TypeError("Euler is frozen, cannot set");
    return this._e;
  }

  __len__(): number { return 3; }
  __getitem__(i: number): number {
    const j = i < 0 ? 3 + i : i;
    if (j < 0 || j > 2) throw new RangeError("euler[attribute]: array index out of range");
    return this._e[j];
  }
  __setitem__(i: number, x: number): void {
    const j = i < 0 ? 3 + i : i;
    if (j < 0 || j > 2) throw new RangeError("euler[attribute] = x: array assignment index out of range");
    this.#mut()[j] = x;
  }
  [Symbol.iterator](): Iterator<number> { return this._e.slice()[Symbol.iterator](); }
  [index: number]: number;

  get x(): number { return this._e[0]; }
  set x(v: number) { this.#mut()[0] = v; }
  get y(): number { return this._e[1]; }
  set y(v: number) { this.#mut()[1] = v; }
  get z(): number { return this._e[2]; }
  set z(v: number) { this.#mut()[2] = v; }
  get order(): EulerOrder { return this._order; }
  set order(o: EulerOrder) { this.#mut(); this._order = m.order(o); }
  get is_wrapped(): boolean { return false; }
  get is_frozen(): boolean { return this._frozen; }
  get is_valid(): boolean { return true; }
  get owner(): unknown { return null; }

  zero(): void { this.#mut().fill(0); }
  freeze(): this { this._frozen = true; return this; }
  copy(): Euler { return new Euler(this._e, this._order); }
  to_matrix(): Matrix { return Matrix._fromCols(m.eulToMat3(this._e, this._order)); }
  to_quaternion(): Quaternion { return new Quaternion(m.eulToQuat(this._e, this._order)); }
  /** Rotates about one of its own axes ('X', 'Y' or 'Z') by angle radians. */
  rotate_axis(axis: "X" | "Y" | "Z", angle: number): void {
    const i = "XYZ".indexOf(axis);
    if (i < 0 || axis.length !== 1) throw new TypeError("Euler.rotate_axis(): expected axis to be 'X', 'Y' or 'Z'");
    const e = [0, 0, 0];
    e[i] = angle;
    const tot = m.mulM3(m.eulToMat3(this._e, this._order), m.eulToMat3(e, this._order));
    this.#mut();
    this._e = m.mat3ToEul(m.normalizeM3(tot), this._order);
  }
  rotate(other: RotationLike | Matrix): void {
    const r = m.mulM3(anyToRotmat(other, "euler.rotate(value)"), m.eulToMat3(this._e, this._order));
    this.#mut();
    this._e = m.mat3ToEul(m.normalizeM3(r), this._order, this._e);
  }
  /** Moves its angles by whole turns to be nearest `other`'s, so interpolating between them goes the short way. */
  make_compatible(other: Euler | VectorLike): void {
    const o = other instanceof Euler ? other._e : nums(other);
    m.compatibleEul(this.#mut(), o);
  }
  equals(other: unknown): boolean {
    return other instanceof Euler && other._order === this._order && other._e.every((x, i) => x === this._e[i]);
  }
  toString(): string { return `Euler((${this._e.map(m.pyFloat).join(", ")}), '${this._order}')`; }
  toJSON(): number[] { return this._e.slice(); }
}
