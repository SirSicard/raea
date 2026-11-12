// mathutils.Matrix in TypeScript. Python reads a Matrix by rows (m[row][col], m.row, m.col, m.translation); inside it
// is kept by columns, as Blender's C keeps it, so the maths can follow Blender's line by line (math.ts).
import { Euler } from "./euler";
import { Quaternion } from "./quaternion";
import { anyToRotmat, type RotationLike } from "./rot";
import { Vector, nums, type VectorLike } from "./vector";
import * as m from "./math";

export type MatrixLike = Matrix | ArrayLike<VectorLike>;
type Axis = "X" | "Y" | "Z";

function rowsOf(rows: MatrixLike): number[][] {
  if (rows instanceof Matrix) return rows._rowsCopy();
  return Array.from(rows as ArrayLike<VectorLike>, (r) => nums(r, "Matrix"));
}

export class Matrix implements Iterable<Vector> {
  /** @internal columns: _c[col][row] */
  _c: number[][];
  /** @internal */
  _rows: number;
  /** @internal */
  _cols: number;
  /** @internal */
  _frozen = false;

  /** Rows of 2 to 4 numbers each (all the same length), or the 4x4 identity. */
  constructor(rows?: MatrixLike) {
    const r = rows === undefined ? [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]] : rowsOf(rows);
    const nr = r.length, nc = r[0]?.length ?? 0;
    if (nr < 2 || nr > 4 || nc < 2 || nc > 4 || r.some((row) => row.length !== nc)) {
      throw new TypeError("Matrix(): expects 2 to 4 rows of 2 to 4 numbers, all rows the same length");
    }
    this._rows = nr;
    this._cols = nc;
    this._c = Array.from({ length: nc }, (_, c) => r.map((row) => row[c]));
  }
  /** @internal from columns (through the constructor: a Matrix made any other way lacks its private methods) */
  static _fromCols(cols: number[][]): Matrix {
    const out = new Matrix();
    out._c = cols.map((c) => c.slice());
    out._cols = cols.length;
    out._rows = cols[0].length;
    out._frozen = false;
    return out;
  }
  /** @internal */
  _rowsCopy(): number[][] {
    return Array.from({ length: this._rows }, (_, r) => this._c.map((c) => c[r]));
  }
  /** @internal */
  _mut(): number[][] {
    if (this._frozen) throw new TypeError("Matrix is frozen, cannot set");
    return this._c;
  }
  #square(what: string): number {
    if (this._rows !== this._cols) throw new TypeError(`Matrix.${what}: only square matrices are supported`);
    return this._rows;
  }
  /** @internal the 3x3 part (matrix_as_3x3) */
  _m3(): m.M {
    if (this._rows < 3 || this._cols < 3) throw new TypeError("Matrix: expects a 3x3 or 4x4 matrix");
    return [0, 1, 2].map((c) => [this._c[c][0], this._c[c][1], this._c[c][2]]);
  }

  // ---- class methods ----
  static Identity(size: number): Matrix {
    if (size < 2 || size > 4) throw new RangeError("Matrix.Identity(): size must be between 2 and 4");
    return Matrix._fromCols(identity(size));
  }
  static Rotation(angle: number, size: 2 | 3 | 4, axis?: Axis | VectorLike): Matrix {
    let r: m.M;
    if (size === 2) {
      const c = Math.cos(angle), s = Math.sin(angle);
      return Matrix._fromCols([[c, s], [-s, c]]);
    }
    if (size !== 3 && size !== 4) throw new RangeError("Matrix.Rotation(): can only return a 2x2 3x3 or 4x4 matrix");
    if (axis === undefined) throw new TypeError("Matrix.Rotation(): axis of 'X', 'Y' or 'Z' or a 3D vector is needed for a 3x3 or 4x4 matrix");
    if (typeof axis === "string") {
      if (axis !== "X" && axis !== "Y" && axis !== "Z") throw new TypeError("Matrix.Rotation(): axis must be 'X', 'Y' or 'Z'");
      r = m.axisToMat3(axis, angle);
    } else {
      const a = nums(axis);
      m.normalizeIn(a, 3);
      r = m.axisAngleToMat3(a, angle);
    }
    return Matrix._fromCols(size === 4 ? to4(r) : r);
  }
  static Scale(factor: number, size: 2 | 3 | 4, axis?: VectorLike): Matrix {
    const n = size === 4 ? 3 : size;
    let c: number[][];
    if (axis === undefined) c = identity(n).map((col) => col.map((x) => x * factor));
    else {
      const a = nums(axis).slice(0, n);
      m.normalizeIn(a, n);
      c = identity(n).map((col, j) => col.map((x, i) => x + (factor - 1) * a[i] * a[j]));
    }
    return Matrix._fromCols(size === 4 ? to4(c) : c);
  }
  static Shear(plane: "X" | "Y" | "XY" | "XZ" | "YZ", size: 2 | 3 | 4, factor: number | VectorLike): Matrix {
    if (size === 2) {
      const f = factor as number;
      const c = identity(2);
      if (plane === "X") c[1][0] = f;
      else if (plane === "Y") c[0][1] = f;
      else throw new TypeError("Matrix.Shear(): expected: X, Y or wrong matrix size for shearing plane");
      return Matrix._fromCols(c);
    }
    const f = nums(factor as VectorLike);
    const c = identity(3);
    if (plane === "XY") { c[2][0] = f[0]; c[2][1] = f[1]; }
    else if (plane === "XZ") { c[1][0] = f[0]; c[1][2] = f[1]; }
    else if (plane === "YZ") { c[0][1] = f[0]; c[0][2] = f[1]; }
    else throw new TypeError("Matrix.Shear(): expected: X, Y, XY, XZ, YZ");
    return Matrix._fromCols(size === 4 ? to4(c) : c);
  }
  static Diagonal(vector: VectorLike): Matrix {
    const v = nums(vector);
    return Matrix._fromCols(identity(v.length).map((col, j) => col.map((x) => x * v[j])));
  }
  static Translation(vector: VectorLike): Matrix {
    const v = nums(vector);
    const c = identity(4);
    c[3][0] = v[0]; c[3][1] = v[1]; c[3][2] = v.length > 2 ? v[2] : 0;
    return Matrix._fromCols(c);
  }
  static OrthoProjection(axis: "X" | "Y" | "XY" | "XZ" | "YZ" | VectorLike, size: 2 | 3 | 4): Matrix {
    const n = size === 4 ? 3 : size;
    let c = identity(n);
    if (typeof axis === "string") {
      const keep = new Set(axis.split("").map((a) => "XYZ".indexOf(a)));
      c = c.map((col, j) => col.map((x) => (keep.has(j) ? x : 0)));
    } else {
      const a = nums(axis).slice(0, n);
      m.normalizeIn(a, n);
      c = c.map((col, j) => col.map((x, i) => x - a[i] * a[j]));
    }
    return Matrix._fromCols(size === 4 ? to4(c) : c);
  }
  static LocRotScale(location: VectorLike | null, rotation: RotationLike | Matrix | null, scale: VectorLike | null): Matrix {
    const r = rotation === null || rotation === undefined ? m.unit3() : anyToRotmat(rotation, "Matrix.LocRotScale()");
    if (scale !== null && scale !== undefined) {
      const s = nums(scale);
      for (let i = 0; i < 3; i++) for (let k = 0; k < 3; k++) r[i][k] *= s[i];
    }
    const c = to4(r);
    if (location !== null && location !== undefined) {
      const l = nums(location);
      c[3][0] = l[0]; c[3][1] = l[1]; c[3][2] = l[2];
    }
    return Matrix._fromCols(c);
  }

  // ---- sequence: rows ----
  __len__(): number { return this._rows; }
  __getitem__(i: number): Vector {
    const r = i < 0 ? this._rows + i : i;
    if (r < 0 || r >= this._rows) throw new RangeError("matrix[attribute]: array index out of range");
    return Vector._wrap(this._cols, {
      obj: this,
      read: (into) => { for (let c = 0; c < this._cols; c++) into[c] = this._c[c][r]; },
      write: (from) => { const cs = this._mut(); for (let c = 0; c < this._cols; c++) cs[c][r] = from[c]; },
    });
  }
  __setitem__(i: number, row: VectorLike): void {
    const r = i < 0 ? this._rows + i : i;
    const v = nums(row);
    if (r < 0 || r >= this._rows || v.length !== this._cols) throw new RangeError("matrix[i] = value: bad index or row size");
    const cs = this._mut();
    for (let c = 0; c < this._cols; c++) cs[c][r] = v[c];
  }
  [Symbol.iterator](): Iterator<Vector> {
    return Array.from({ length: this._rows }, (_, i) => this.__getitem__(i))[Symbol.iterator]();
  }
  [index: number]: Vector;

  /** Rows: m.row[i] is m[i]; assigning one sets the row. */
  get row(): MatrixAccess { return new MatrixAccess(this, false); }
  /** Columns: m.col[j], each wrapped (writes go into the matrix). */
  get col(): MatrixAccess { return new MatrixAccess(this, true); }
  /** The translation (the last column's x, y, z), wrapped. */
  get translation(): Vector {
    if (this._rows < 3 || this._cols < 4) throw new TypeError("Matrix.translation: inappropriate matrix size");
    return Vector._wrap(3, {
      obj: this,
      read: (into) => { into[0] = this._c[3][0]; into[1] = this._c[3][1]; into[2] = this._c[3][2]; },
      write: (from) => { const cs = this._mut(); cs[3][0] = from[0]; cs[3][1] = from[1]; cs[3][2] = from[2]; },
    });
  }
  set translation(v: VectorLike) {
    const t = nums(v);
    const cs = this._mut();
    if (this._rows < 3 || this._cols < 4) throw new TypeError("Matrix.translation: inappropriate matrix size");
    cs[3][0] = t[0]; cs[3][1] = t[1]; cs[3][2] = t[2];
  }
  /** mat3_to_scale: how much a unit vector is scaled, on average */
  get median_scale(): number {
    const k = Math.sqrt(1 / 3);
    return m.len(m.mulM3V3(this._m3(), [k, k, k]), 3);
  }
  get is_identity(): boolean {
    if (this._rows !== this._cols) return false;
    return this._c.every((col, c) => col.every((x, r) => x === (r === c ? 1 : 0)));
  }
  get is_negative(): boolean { this.#square("is_negative"); return m.isNegative3(this._m3()); }
  get is_orthogonal(): boolean {
    const n = this.#square("is_orthogonal");
    return orthogonal(this._c, n) && this._c.slice(0, n).every((c) => Math.abs(m.dot(c, c, n) - 1) <= 1e-5);
  }
  get is_orthogonal_axis_vectors(): boolean { return orthogonal(this._c, this.#square("is_orthogonal_axis_vectors")); }
  get is_wrapped(): boolean { return false; }
  get is_frozen(): boolean { return this._frozen; }
  get is_valid(): boolean { return true; }
  get owner(): unknown { return null; }

  // ---- in place ----
  zero(): void { for (const c of this._mut()) c.fill(0); }
  identity(): void { const n = this.#square("identity"); this._mut(); this._c = identity(n); }
  transpose(): void {
    const n = this.#square("transpose");
    const cs = this._mut();
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) [cs[i][j], cs[j][i]] = [cs[j][i], cs[i][j]];
  }
  normalize(): void {
    if (this._rows !== this._cols || (this._rows !== 3 && this._rows !== 4)) throw new TypeError("Matrix.normalize(): can only use a 3x3 or 4x4 matrix");
    const cs = this._mut();
    for (let i = 0; i < 3; i++) {
      const l = m.normalizeIn(cs[i], 3);
      if (this._rows === 4 && l !== 0) cs[i][3] /= l;
    }
  }
  invert(fallback?: Matrix): void { this.#setFrom(this.inverted(fallback)); }
  invert_safe(): void { this.#setFrom(this.inverted_safe()); }
  adjugate(): void { this.#setFrom(this.adjugated()); }
  resize_4x4(): void {
    const cs = this._mut();
    const out = identity(4);
    for (let c = 0; c < Math.min(4, this._cols); c++) for (let r = 0; r < Math.min(4, this._rows); r++) out[c][r] = cs[c][r];
    this._c = out;
    this._rows = this._cols = 4;
  }
  rotate(other: RotationLike | Matrix): void {
    if (this._rows !== 3 || this._cols !== 3) throw new TypeError("Matrix must have 3x3 dimensions");
    const r = m.mulM3(anyToRotmat(other, "matrix.rotate(value)"), this._m3());
    this._mut();
    this._c = r;
  }
  freeze(): this { this._frozen = true; return this; }
  #setFrom(o: Matrix): void {
    this._mut();
    this._c = o._c;
    this._rows = o._rows;
    this._cols = o._cols;
  }

  // ---- new values ----
  copy(): Matrix { return Matrix._fromCols(this._c); }
  determinant(): number { this.#square("determinant"); return m.detN(this._c); }
  transposed(): Matrix { const t = this.copy(); t.transpose(); return t; }
  normalized(): Matrix { const t = this.copy(); t.normalize(); return t; }
  inverted<F = never>(fallback?: F): Matrix | F {
    const n = this.#square("inverted");
    const d = m.detN(this._c);
    if (d === 0) {
      if (fallback !== undefined) return (fallback instanceof Matrix ? fallback.copy() : fallback) as F;
      throw new RangeError("Matrix.invert(ed): matrix does not have an inverse");
    }
    return Matrix._fromCols(m.adjugateN(this._c).map((c) => c.slice(0, n).map((x) => x / d)));
  }
  /** The inverse, or for a singular matrix the inverse of it nudged by 1e-8 on its diagonal (or the identity). */
  inverted_safe(): Matrix {
    const n = this.#square("inverted_safe");
    let c = this._c.map((x) => x.slice());
    let d = m.detN(c);
    if (d === 0) {
      for (let i = 0; i < n; i++) c[i][i] += 1e-8;
      d = m.detN(c);
      if (d === 0) { c = identity(n); d = 1; }
    }
    return Matrix._fromCols(m.adjugateN(c).map((col) => col.map((x) => x / d)));
  }
  adjugated(): Matrix { this.#square("adjugated"); return Matrix._fromCols(m.adjugateN(this._c)); }
  to_2x2(): Matrix { return this.#resized(2); }
  to_3x3(): Matrix { return this.#resized(3); }
  to_4x4(): Matrix { return this.#resized(4); }
  #resized(n: number): Matrix {
    const out = identity(n);
    for (let c = 0; c < Math.min(n, this._cols); c++) for (let r = 0; r < Math.min(n, this._rows); r++) out[c][r] = this._c[c][r];
    return Matrix._fromCols(out);
  }
  to_euler(order: m.Order = "XYZ", euler_compat?: Euler | VectorLike): Euler {
    const o = m.order(order);
    const n = m.normalizeM3(this._m3());
    return new Euler(m.mat3ToEul(n, o, euler_compat === undefined ? undefined : nums(euler_compat as VectorLike)), o);
  }
  to_quaternion(): Quaternion { return new Quaternion(m.mat3ToQuat(this._m3())); }
  to_scale(): Vector { return new Vector(rotSize(this._m3())[1]); }
  to_translation(): Vector {
    if (this._rows < 3 || this._cols < 4) throw new TypeError("Matrix.to_translation(): inappropriate matrix size");
    return new Vector([this._c[3][0], this._c[3][1], this._c[3][2]]);
  }
  /** (location, rotation, scale) */
  decompose(): [Vector, Quaternion, Vector] {
    if (this._rows !== 4 || this._cols !== 4) throw new TypeError("Matrix.decompose(): inappropriate matrix size - expects 4x4 matrix");
    const [rot, size] = rotSize(this._m3());
    return [new Vector([this._c[3][0], this._c[3][1], this._c[3][2]]), new Quaternion(m.mat3NormalizedToQuat(rot)), new Vector(size)];
  }
  /** Interpolated by polar decomposition: rotation slerped, scale and shear lerped (and translation, for 4x4). */
  lerp(other: Matrix, factor: number): Matrix {
    if (this._rows !== other._rows || this._cols !== other._cols) throw new TypeError("Matrix.lerp(): expects both matrices to be the same dimensions");
    if (this._rows === 3 && this._cols === 3) return Matrix._fromCols(m.interpM3(this._m3(), other._m3(), factor));
    if (this._rows === 4 && this._cols === 4) {
      const c = to4(m.interpM3(this._m3(), other._m3(), factor));
      for (let i = 0; i < 3; i++) c[3][i] = this._c[3][i] + (other._c[3][i] - this._c[3][i]) * factor;
      return Matrix._fromCols(c);
    }
    throw new TypeError("Matrix.lerp(): only 3x3 and 4x4 matrices supported");
  }

  // ---- Python's operators ----
  /** a @ b: matrix product, or the matrix times a column vector (a 4x4 times a 3D vector takes w = 1). */
  matmul(other: Matrix): Matrix;
  matmul(other: Vector | VectorLike): Vector;
  matmul(other: Matrix | VectorLike): Matrix | Vector {
    if (other instanceof Matrix) {
      if (this._cols !== other._rows) throw new TypeError("matrix1 @ matrix2: matrix1 number of columns and the matrix2 number of rows must be the same");
      const out: number[][] = Array.from({ length: other._cols }, () => new Array(this._rows).fill(0));
      for (let c = 0; c < other._cols; c++) for (let r = 0; r < this._rows; r++) {
        let s = 0;
        for (let k = 0; k < this._cols; k++) s += this._c[k][r] * other._c[c][k];
        out[c][r] = s;
      }
      return Matrix._fromCols(out);
    }
    const v = nums(other);
    const vec = v.slice();
    if (this._cols !== v.length) {
      if (this._cols === 4 && v.length === 3) vec.push(1);
      else throw new TypeError("matrix @ vector: len(matrix.col) and len(vector) must be the same, except for 4x4 matrix @ 3D vector.");
    }
    const out: number[] = [];
    for (let r = 0; r < this._rows; r++) {
      let s = 0;
      for (let c = 0; c < this._cols; c++) s += this._c[c][r] * vec[c];
      out.push(s);
    }
    return new Vector(this._rows === 4 && v.length === 3 ? out.slice(0, 3) : out);
  }
  /** @internal vector @ matrix */
  _rowVecMul(v: number[]): Vector {
    const vec = v.slice();
    if (this._rows !== v.length) {
      if (this._rows === 4 && v.length === 3) vec.push(1);
      else throw new TypeError("vector @ matrix: matrix column size and the vector size must be the same");
    }
    const out = this._c.map((col) => m.dot(col, vec, this._rows));
    return new Vector(this._cols === 4 && v.length === 3 ? out.slice(0, 3) : out);
  }
  add(other: Matrix): Matrix { return this.#zip(other, "+", (a, b) => a + b); }
  sub(other: Matrix): Matrix { return this.#zip(other, "-", (a, b) => a - b); }
  /** a * b: by a number, or element-wise by a matrix of the same size. */
  mul(other: number | Matrix): Matrix {
    if (typeof other === "number") return Matrix._fromCols(this._c.map((c) => c.map((x) => x * other)));
    return this.#zip(other, "*", (a, b) => a * b);
  }
  equals(other: unknown): boolean {
    if (!(other instanceof Matrix) || other._rows !== this._rows || other._cols !== this._cols) return false;
    return this._c.every((c, i) => c.every((x, j) => x === other._c[i][j]));
  }
  #zip(o: Matrix, op: string, f: (a: number, b: number) => number): Matrix {
    if (o._rows !== this._rows || o._cols !== this._cols) throw new TypeError(`Matrix ${op} Matrix: matrices must have the same dimensions for this operation`);
    return Matrix._fromCols(this._c.map((c, i) => c.map((x, j) => f(x, o._c[i][j]))));
  }

  toString(): string {
    const rows = this._rowsCopy().map((r) => `(${r.map(m.pyFloat).join(", ")})`);
    return `Matrix((${rows.join(",\n        ")}))`;
  }
  toJSON(): number[][] { return this._rowsCopy(); }
}

/** Rows or columns of a Matrix (Matrix.row, Matrix.col): each a wrapped Vector; assigning one sets it. */
export class MatrixAccess implements Iterable<Vector> {
  [index: number]: Vector;
  constructor(readonly matrix: Matrix, readonly columns: boolean) {}
  __len__(): number { return this.columns ? this.matrix._cols : this.matrix._rows; }
  __getitem__(i: number): Vector {
    const mat = this.matrix;
    if (!this.columns) return mat.__getitem__(i);
    const c = i < 0 ? mat._cols + i : i;
    if (c < 0 || c >= mat._cols) throw new RangeError("matrix.col[index]: out of range");
    return Vector._wrap(mat._rows, {
      obj: mat,
      read: (into) => { for (let r = 0; r < mat._rows; r++) into[r] = mat._c[c][r]; },
      write: (from) => { const cs = mat._mut(); for (let r = 0; r < mat._rows; r++) cs[c][r] = from[r]; },
    });
  }
  __setitem__(i: number, v: VectorLike): void {
    if (!this.columns) return this.matrix.__setitem__(i, v);
    const mat = this.matrix, c = i < 0 ? mat._cols + i : i, a = nums(v);
    if (c < 0 || c >= mat._cols || a.length !== mat._rows) throw new RangeError("matrix.col[i] = value: bad index or column size");
    const cs = mat._mut();
    for (let r = 0; r < mat._rows; r++) cs[c][r] = a[r];
  }
  [Symbol.iterator](): Iterator<Vector> {
    return Array.from({ length: this.__len__() }, (_, i) => this.__getitem__(i))[Symbol.iterator]();
  }
}
for (let i = 0; i < 4; i++) {
  for (const cls of [Matrix, MatrixAccess]) {
    Object.defineProperty(cls.prototype, i, {
      get(this: Matrix) { return this.__getitem__(i); },
      set(this: Matrix, v: VectorLike) { this.__setitem__(i, v); },
    });
  }
}

function identity(n: number): number[][] {
  return Array.from({ length: n }, (_, c) => Array.from({ length: n }, (_, r) => (r === c ? 1 : 0)));
}
function to4(c3: number[][]): number[][] {
  const n = c3.length;
  const out = identity(4);
  for (let c = 0; c < n; c++) for (let r = 0; r < n; r++) out[c][r] = c3[c][r];
  return out;
}
function orthogonal(c: number[][], n: number): boolean {
  for (let i = 0; i < n; i++) for (let j = 0; j < i; j++) if (Math.abs(m.dot(c[i], c[j], n)) > 1e-5) return false;
  return true;
}
/** mat3_to_rot_size: unit axes and their lengths, a flipping matrix's scale negative */
function rotSize(m3: m.M): [m.M, number[]] {
  const rot = m3.map((c) => c.slice());
  const size = rot.map((c) => m.normalizeIn(c, 3));
  if (m.isNegative3(rot)) return [rot.map((c) => c.map((x) => -x)), size.map((x) => -x)];
  return [rot, size];
}
