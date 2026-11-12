// The maths under raea/blender's mathutils, as plain arrays and in Blender's own layouts, so each step follows
// Blender's C (blenlib's math_rotation.c, math_matrix.c, math_color.c) and its results match Blender's:
//   a 3x3 or 4x4 matrix is m[column][row] (Python's Matrix rows are its transpose);
//   a quaternion is [w, x, y, z]; an Euler [x, y, z] with an order.
export type M = number[][];
export type Q = number[];
export type Order = "XYZ" | "XZY" | "YXZ" | "YZX" | "ZXY" | "ZYX";

export const FLT_EPSILON = 1.1920928955078125e-7;

export const dot = (a: ArrayLike<number>, b: ArrayLike<number>, n = a.length): number => {
  let s = 0;
  for (let i = 0; i < n; i++) s += a[i] * b[i];
  return s;
};
export const len = (a: ArrayLike<number>, n = a.length): number => Math.sqrt(dot(a, a, n));
export const cross3 = (a: ArrayLike<number>, b: ArrayLike<number>): number[] => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];
/** normalize_v3 / normalize_vn: scales `a` in place to unit length, returns the length it had (0: left as zeros). */
export function normalizeIn(a: number[], n = a.length): number {
  const d = len(a, n);
  if (d > 1.0e-35) for (let i = 0; i < n; i++) a[i] /= d;
  else for (let i = 0; i < n; i++) a[i] = 0;
  return d;
}
export const saacos = (f: number): number => (f <= -1 ? Math.PI : f >= 1 ? 0 : Math.acos(f));
export const saasin = (f: number): number => (f <= -1 ? -Math.PI / 2 : f >= 1 ? Math.PI / 2 : Math.asin(f));
export const clamp = (x: number, lo: number, hi: number): number => (x < lo ? lo : x > hi ? hi : x);

export const unit3 = (): M => [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
export const copyM = (m: M): M => m.map((c) => c.slice());
/** C = A * B (column-major: C[j] = A applied to B's column j). */
export function mulM3(a: M, b: M): M {
  const r: M = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  for (let j = 0; j < 3; j++) for (let i = 0; i < 3; i++) r[j][i] = a[0][i] * b[j][0] + a[1][i] * b[j][1] + a[2][i] * b[j][2];
  return r;
}
export const mulM3V3 = (m: M, v: ArrayLike<number>): number[] => [
  m[0][0] * v[0] + m[1][0] * v[1] + m[2][0] * v[2],
  m[0][1] * v[0] + m[1][1] * v[1] + m[2][1] * v[2],
  m[0][2] * v[0] + m[1][2] * v[1] + m[2][2] * v[2],
];
export const det3 = (m: M): number =>
  m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) - m[1][0] * (m[0][1] * m[2][2] - m[0][2] * m[2][1]) + m[2][0] * (m[0][1] * m[1][2] - m[0][2] * m[1][1]);
export const isNegative3 = (m: M): boolean => det3(m) < 0;
export function normalizeM3(m: M): M {
  const r = copyM(m);
  for (let i = 0; i < 3; i++) normalizeIn(r[i], 3);
  return r;
}

// ---- Euler orders (rotOrders: axis i, j, k and parity) ----
const ORDERS: Record<Order, [number, number, number, number]> = {
  XYZ: [0, 1, 2, 0], XZY: [0, 2, 1, 1], YXZ: [1, 0, 2, 1], YZX: [1, 2, 0, 0], ZXY: [2, 0, 1, 0], ZYX: [2, 1, 0, 1],
};
export function order(o: string): Order {
  if (!(o in ORDERS)) throw new TypeError(`Euler order "${o}" is not one of XYZ, XZY, YXZ, YZX, ZXY, ZYX`);
  return o as Order;
}

/** eulO_to_mat3 */
export function eulToMat3(e: ArrayLike<number>, o: Order): M {
  const [i, j, k, parity] = ORDERS[o];
  const [ti, tj, th] = parity ? [-e[i], -e[j], -e[k]] : [e[i], e[j], e[k]];
  const ci = Math.cos(ti), cj = Math.cos(tj), ch = Math.cos(th);
  const si = Math.sin(ti), sj = Math.sin(tj), sh = Math.sin(th);
  const cc = ci * ch, cs = ci * sh, sc = si * ch, ss = si * sh;
  const m: M = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  m[i][i] = cj * ch; m[j][i] = sj * sc - cs; m[k][i] = sj * cc + ss;
  m[i][j] = cj * sh; m[j][j] = sj * ss + cc; m[k][j] = sj * cs - sc;
  m[i][k] = -sj; m[j][k] = cj * si; m[k][k] = cj * ci;
  return m;
}

/** eulO_to_quat */
export function eulToQuat(e: ArrayLike<number>, o: Order): Q {
  const [i, j, k, parity] = ORDERS[o];
  const ti = e[i] * 0.5, tj = e[j] * (parity ? -0.5 : 0.5), th = e[k] * 0.5;
  const ci = Math.cos(ti), cj = Math.cos(tj), ch = Math.cos(th);
  const si = Math.sin(ti), sj = Math.sin(tj), sh = Math.sin(th);
  const cc = ci * ch, cs = ci * sh, sc = si * ch, ss = si * sh;
  const a = [0, 0, 0];
  a[i] = cj * sc - sj * cs;
  a[j] = cj * ss + sj * cc;
  a[k] = cj * cs - sj * sc;
  const q = [cj * cc + sj * ss, a[0], a[1], a[2]];
  if (parity) q[j + 1] = -q[j + 1];
  return q;
}

/** mat3_normalized_to_eulo2: the two Euler solutions for a unit matrix */
function mat3ToEul2(m: M, o: Order): [number[], number[]] {
  const [i, j, k, parity] = ORDERS[o];
  const cy = Math.hypot(m[i][i], m[i][j]);
  const e1 = [0, 0, 0], e2 = [0, 0, 0];
  if (cy > 16 * FLT_EPSILON) {
    e1[i] = Math.atan2(m[j][k], m[k][k]); e1[j] = Math.atan2(-m[i][k], cy); e1[k] = Math.atan2(m[i][j], m[i][i]);
    e2[i] = Math.atan2(-m[j][k], -m[k][k]); e2[j] = Math.atan2(-m[i][k], -cy); e2[k] = Math.atan2(-m[i][j], -m[i][i]);
  } else {
    e1[i] = Math.atan2(-m[k][j], m[j][j]); e1[j] = Math.atan2(-m[i][k], cy); e1[k] = 0;
    e2[0] = e1[0]; e2[1] = e1[1]; e2[2] = e1[2];
  }
  if (parity) for (let n = 0; n < 3; n++) { e1[n] = -e1[n]; e2[n] = -e2[n]; }
  return [e1, e2];
}
const absSum = (e: number[], o?: ArrayLike<number>): number =>
  Math.abs(e[0] - (o ? o[0] : 0)) + Math.abs(e[1] - (o ? o[1] : 0)) + Math.abs(e[2] - (o ? o[2] : 0));

/** mat3_normalized_to_eulO, or mat3_normalized_to_compatible_eulO when `compat` is given */
export function mat3ToEul(m: M, o: Order, compat?: ArrayLike<number>): number[] {
  const [e1, e2] = mat3ToEul2(m, o);
  if (compat) {
    compatibleEul(e1, compat);
    compatibleEul(e2, compat);
    return absSum(e1, compat) > absSum(e2, compat) ? e2 : e1;
  }
  return absSum(e1) > absSum(e2) ? e2 : e1;
}

/** compatible_eul (Blender 3.6+, !104856): `e` moved by whole turns to be nearest `old`, wrapping any axis more than
 * half a turn away, then a lone axis still more than half a turn away while the others are within a quarter. */
export function compatibleEul(e: number[], old: ArrayLike<number>): void {
  const piThresh = Math.PI, pi2 = 2 * Math.PI;
  const d = [0, 0, 0];
  for (let i = 0; i < 3; i++) {
    d[i] = e[i] - old[i];
    if (d[i] > piThresh) {
      e[i] -= Math.floor(d[i] / pi2 + 0.5) * pi2;
      d[i] = e[i] - old[i];
    } else if (d[i] < -piThresh) {
      e[i] += Math.floor(-d[i] / pi2 + 0.5) * pi2;
      d[i] = e[i] - old[i];
    }
  }
  // i with its two others j, k: (0; 1, 2), (1; 2, 0), (2; 0, 1), as the C loop walks them
  for (const [i, j, k] of [[0, 1, 2], [1, 2, 0], [2, 0, 1]]) {
    if (Math.abs(d[i]) > Math.PI && Math.abs(d[j]) < Math.PI / 2 && Math.abs(d[k]) < Math.PI / 2) e[i] += d[i] > 0 ? -pi2 : pi2;
  }
}

// ---- quaternions ----
export const unitQ = (): Q => [1, 0, 0, 0];
export const mulQ = (a: Q, b: Q): Q => [
  a[0] * b[0] - a[1] * b[1] - a[2] * b[2] - a[3] * b[3],
  a[0] * b[1] + a[1] * b[0] + a[2] * b[3] - a[3] * b[2],
  a[0] * b[2] + a[2] * b[0] + a[3] * b[1] - a[1] * b[3],
  a[0] * b[3] + a[3] * b[0] + a[1] * b[2] - a[2] * b[1],
];
export const conjQ = (q: Q): Q => [q[0], -q[1], -q[2], -q[3]];
export function normalizedQ(q: Q): [Q, number] {
  const r = q.slice();
  const l = len(r, 4);
  if (l !== 0) for (let i = 0; i < 4; i++) r[i] /= l;
  else { r[0] = 0; r[1] = 1; r[2] = r[3] = 0; } // normalize_qt: a zero quaternion becomes (0, 1, 0, 0), as in Blender
  return [r, l];
}
export function invertQ(q: Q): Q {
  const f = dot(q, q, 4);
  if (f === 0) return q.slice();
  return conjQ(q).map((x) => x / f);
}
/** quat_to_mat3 (the quaternion as given, unit or not) */
export function quatToMat3(q: Q): M {
  const q0 = Math.SQRT2 * q[0], q1 = Math.SQRT2 * q[1], q2 = Math.SQRT2 * q[2], q3 = Math.SQRT2 * q[3];
  const qda = q0 * q1, qdb = q0 * q2, qdc = q0 * q3;
  const qaa = q1 * q1, qab = q1 * q2, qac = q1 * q3, qbb = q2 * q2, qbc = q2 * q3, qcc = q3 * q3;
  return [
    [1 - qbb - qcc, qdc + qab, -qdb + qac],
    [-qdc + qab, 1 - qaa - qcc, qda + qbc],
    [qdb + qac, -qda + qbc, 1 - qaa - qbb],
  ];
}
/** mat3_normalized_to_quat_fast (Mike Day's method, canonical w >= 0) */
export function mat3NormalizedToQuat(m: M): Q {
  const q = [0, 0, 0, 0];
  if (m[2][2] < 0) {
    if (m[0][0] > m[1][1]) {
      const trace = 1 + m[0][0] - m[1][1] - m[2][2];
      let s = 2 * Math.sqrt(trace);
      if (m[1][2] < m[2][1]) s = -s;
      q[1] = 0.25 * s; s = 1 / s;
      q[0] = (m[1][2] - m[2][1]) * s; q[2] = (m[0][1] + m[1][0]) * s; q[3] = (m[2][0] + m[0][2]) * s;
      if (trace === 1 && q[0] === 0 && q[2] === 0 && q[3] === 0) q[1] = 1;
    } else {
      const trace = 1 - m[0][0] + m[1][1] - m[2][2];
      let s = 2 * Math.sqrt(trace);
      if (m[2][0] < m[0][2]) s = -s;
      q[2] = 0.25 * s; s = 1 / s;
      q[0] = (m[2][0] - m[0][2]) * s; q[1] = (m[0][1] + m[1][0]) * s; q[3] = (m[1][2] + m[2][1]) * s;
      if (trace === 1 && q[0] === 0 && q[1] === 0 && q[3] === 0) q[2] = 1;
    }
  } else if (m[0][0] < -m[1][1]) {
    const trace = 1 - m[0][0] - m[1][1] + m[2][2];
    let s = 2 * Math.sqrt(trace);
    if (m[0][1] < m[1][0]) s = -s;
    q[3] = 0.25 * s; s = 1 / s;
    q[0] = (m[0][1] - m[1][0]) * s; q[1] = (m[2][0] + m[0][2]) * s; q[2] = (m[1][2] + m[2][1]) * s;
    if (trace === 1 && q[0] === 0 && q[1] === 0 && q[2] === 0) q[3] = 1;
  } else {
    const trace = 1 + m[0][0] + m[1][1] + m[2][2];
    let s = 2 * Math.sqrt(trace);
    q[0] = 0.25 * s; s = 1 / s;
    q[1] = (m[1][2] - m[2][1]) * s; q[2] = (m[2][0] - m[0][2]) * s; q[3] = (m[0][1] - m[1][0]) * s;
    if (trace === 1 && q[1] === 0 && q[2] === 0 && q[3] === 0) q[0] = 1;
  }
  const l2 = dot(q, q, 4);
  if (Math.abs(l2 - 1) >= 0.0002 * 3) return normalizedQ(q)[0];
  return q;
}
/** mat3_to_quat: normalized first, and a negative (flipping) matrix negated */
export function mat3ToQuat(m: M): Q {
  let u = normalizeM3(m);
  if (isNegative3(u)) u = u.map((c) => c.map((x) => -x));
  return mat3NormalizedToQuat(u);
}
/** axis_angle_to_quat (a zero axis gives the identity) */
export function axisAngleToQuat(axis: ArrayLike<number>, angle: number): Q {
  const n = [axis[0], axis[1], axis[2]];
  if (normalizeIn(n, 3) === 0) return unitQ();
  const s = Math.sin(angle / 2);
  return [Math.cos(angle / 2), n[0] * s, n[1] * s, n[2] * s];
}
/** quat_to_axis_angle for a unit quaternion */
export function quatToAxisAngle(q: Q): [number[], number] {
  const ha = Math.acos(clamp(q[0], -1, 1));
  let si = Math.sin(ha);
  if (Math.abs(si) < FLT_EPSILON) si = 1;
  const axis = [q[1] / si, q[2] / si, q[3] / si];
  if (axis[0] === 0 && axis[1] === 0 && axis[2] === 0) axis[1] = 1;
  return [axis, ha * 2];
}
/** quat__axis_angle_sanitize */
export function sanitizeAxisAngle(axis: number[] | null, angle: number): number {
  if (axis) {
    if ((axis[0] === 0 && axis[1] === 0 && axis[2] === 0) || !axis.every(Number.isFinite)) {
      axis[0] = 1; axis[1] = 0; axis[2] = 0;
    }
  }
  return Number.isFinite(angle) ? angle : 0;
}
/** interp_dot_slerp: weights for a slerp at t between two unit values whose dot is cosom */
export function slerpWeights(t: number, cosom: number): [number, number] {
  if (Math.abs(cosom) < 1 - 1e-4) {
    const omega = Math.acos(cosom), sinom = Math.sin(omega);
    return [Math.sin((1 - t) * omega) / sinom, Math.sin(t * omega) / sinom];
  }
  return [1 - t, t];
}
/** interp_qt_qtqt: along the shortest arc */
export function slerpQ(a: Q, b: Q, t: number): Q {
  let cosom = dot(a, b, 4);
  let q = a;
  if (cosom < 0) { cosom = -cosom; q = a.map((x) => -x); }
  const [w0, w1] = slerpWeights(t, cosom);
  return [0, 1, 2, 3].map((i) => w0 * q[i] + w1 * b[i]);
}
/** rotation_between_vecs_to_quat for unit vectors */
export function rotationBetweenVecs(v1: number[], v2: number[]): Q {
  let axis = cross3(v1, v2);
  let s = normalizeIn(axis, 3);
  let c = dot(v1, v2, 3);
  if (!(s > FLT_EPSILON)) {
    if (c > 0) return unitQ();
    axis = ortho3(v1);
    normalizeIn(axis, 3);
    s = 1; c = -1;
  }
  const angle = Math.atan2(s, c);
  const h = Math.sin(angle / 2);
  return [Math.cos(angle / 2), axis[0] * h, axis[1] * h, axis[2] * h];
}
/** ortho_v3_v3: a vector perpendicular to v */
export function ortho3(v: ArrayLike<number>): number[] {
  const x = Math.abs(v[0]), y = Math.abs(v[1]), z = Math.abs(v[2]);
  const axis = x > y ? (x > z ? 0 : 2) : y > z ? 1 : 2;
  if (axis === 0) return [-v[1] - v[2], v[0], v[0]];
  if (axis === 1) return [v[1], -v[0] - v[2], v[1]];
  return [v[2], v[2], -v[0] - v[1]];
}
/** axis_angle_normalized_to_mat3 */
export function axisAngleToMat3(axis: ArrayLike<number>, angle: number): M {
  const s = Math.sin(angle), c = Math.cos(angle), ico = 1 - c;
  const nsi = [axis[0] * s, axis[1] * s, axis[2] * s];
  const n00 = axis[0] * axis[0] * ico, n01 = axis[0] * axis[1] * ico, n11 = axis[1] * axis[1] * ico;
  const n02 = axis[0] * axis[2] * ico, n12 = axis[1] * axis[2] * ico, n22 = axis[2] * axis[2] * ico;
  return [
    [n00 + c, n01 + nsi[2], n02 - nsi[1]],
    [n01 - nsi[2], n11 + c, n12 + nsi[0]],
    [n02 + nsi[1], n12 - nsi[0], n22 + c],
  ];
}
/** axis_angle_to_mat3_single for 'X', 'Y' or 'Z' */
export function axisToMat3(axis: "X" | "Y" | "Z", angle: number): M {
  const c = Math.cos(angle), s = Math.sin(angle);
  if (axis === "X") return [[1, 0, 0], [0, c, s], [0, -s, c]];
  if (axis === "Y") return [[c, 0, -s], [0, 1, 0], [s, 0, c]];
  return [[c, s, 0], [-s, c, 0], [0, 0, 1]];
}

// ---- general square matrices (column-major, any size 2..4) ----
export function detN(m: M): number {
  const n = m.length;
  if (n === 1) return m[0][0];
  if (n === 2) return m[0][0] * m[1][1] - m[0][1] * m[1][0];
  let d = 0;
  for (let c = 0; c < n; c++) d += (c % 2 ? -1 : 1) * m[c][0] * detN(minor(m, c, 0));
  return d;
}
function minor(m: M, col: number, row: number): M {
  return m.filter((_, c) => c !== col).map((cc) => cc.filter((_, r) => r !== row));
}
/** adjoint_mN: the classical adjugate (transpose of the cofactors) */
export function adjugateN(m: M): M {
  const n = m.length;
  if (n === 2) return [[m[1][1], -m[0][1]], [-m[1][0], m[0][0]]];
  const r: M = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let c = 0; c < n; c++) for (let row = 0; row < n; row++) r[row][c] = ((c + row) % 2 ? -1 : 1) * detN(minor(m, c, row));
  return r;
}

// ---- polar decomposition and matrix interpolation (interp_m3_m3m3) ----
function transpose3(m: M): M {
  return [0, 1, 2].map((c) => [0, 1, 2].map((r) => m[r][c]));
}
function inverse3(m: M): M | null {
  const d = det3(m);
  if (d === 0) return null;
  return adjugateN(m).map((c) => c.map((x) => x / d));
}
/** mat3_polar_decompose: A = U P, U the closest orthogonal matrix (Newton's iteration, as SVD gives for an invertible A) */
export function polar3(a: M): [M, M] {
  let u = copyM(a);
  for (let it = 0; it < 100; it++) {
    const inv = inverse3(u);
    if (!inv) break;
    const it_ = transpose3(inv);
    const next = u.map((c, i) => c.map((x, j) => 0.5 * (x + it_[i][j])));
    let diff = 0;
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) diff = Math.max(diff, Math.abs(next[i][j] - u[i][j]));
    u = next;
    if (diff < 1e-12) break;
  }
  const p = mulM3(transpose3(u), a);
  return [u, p];
}
export function interpM3(a: M, b: M, t: number): M {
  let [ua, pa] = polar3(a);
  let [ub, pb] = polar3(b);
  if (isNegative3(ua)) { ua = ua.map((c) => c.map((x) => -x)); pa = pa.map((c) => c.map((x) => -x)); }
  if (isNegative3(ub)) { ub = ub.map((c) => c.map((x) => -x)); pb = pb.map((c) => c.map((x) => -x)); }
  const u = quatToMat3(slerpQ(mat3ToQuat(ua), mat3ToQuat(ub), t));
  const p = pa.map((c, i) => c.map((x, j) => x + (pb[i][j] - x) * t));
  return mulM3(u, p);
}

// ---- colour (math_color.c) ----
export function rgbToHsv(r: number, g: number, b: number): [number, number, number] {
  let k = 0;
  if (g < b) { [g, b] = [b, g]; k = -1; }
  let minGb = b;
  if (r < g) { [r, g] = [g, r]; k = -2 / 6 - k; minGb = Math.min(g, b); }
  const chroma = r - minGb;
  return [Math.abs(k + (g - b) / (6 * chroma + 1e-20)), chroma / (r + 1e-20), r];
}
export function hsvToRgb(h: number, s: number, v: number): [number, number, number] {
  const nr = clamp(Math.abs(h * 6 - 3) - 1, 0, 1);
  const ng = clamp(2 - Math.abs(h * 6 - 2), 0, 1);
  const nb = clamp(2 - Math.abs(h * 6 - 4), 0, 1);
  return [((nr - 1) * s + 1) * v, ((ng - 1) * s + 1) * v, ((nb - 1) * s + 1) * v];
}

/** Python's repr of a float, as mathutils prints its components (round-trip shortest, always a decimal point). */
export function pyFloat(x: number): string {
  if (Number.isNaN(x)) return "nan";
  if (!Number.isFinite(x)) return x > 0 ? "inf" : "-inf";
  if (Number.isInteger(x) && Math.abs(x) < 1e16) return x.toFixed(1);
  const s = String(x);
  return s.includes("e") ? s.replace(/e([+-])(\d)$/, "e$10$2") : s;
}
