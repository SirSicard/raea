// mathutils.Color in TypeScript: RGB, with HSV views. The colour-space conversions use the matrices Blender 5.2's
// default configuration has (scene linear = Linear Rec.709, measured from Blender itself); a scene whose working
// space was changed converts differently there, so read those from Blender when it matters.
import { nums, type VectorLike } from "./vector";
import * as m from "./math";

// Rows of each 3x3 (Python's layout): out = M @ rgb. From Color((1,0,0)) etc. in Blender 5.2.1's default config.
const XYZ_D65 = [[0.4123908579349518, 0.35758480429649353, 0.18048124015331268], [0.21263907849788666, 0.7151690721511841, 0.0721927359700203], [0.019330820068717003, 0.1191946342587471, 0.9505324363708496]];
const FROM_XYZ_D65 = [[3.2409703731536865, -1.5373846292495728, -0.4986114501953125], [-0.9692435264587402, 1.875967025756836, 0.04155469685792923], [0.055629879236221313, -0.20397649705410004, 1.0569711923599243]];
const ACES = [[0.43963301181793213, 0.38298875093460083, 0.177378311753273], [0.08977645635604858, 0.8134395480155945, 0.0967840924859047], [0.01754116825759411, 0.1115465760231018, 0.8709122538566589]];
const FROM_ACES = [[2.521686315536499, -1.1341310739517212, -0.38755524158477783], [-0.27647992968559265, 1.3727190494537354, -0.0962391123175621], [-0.015378057025372982, -0.15297536551952362, 1.16835355758667]];
const ACESCG = [[0.6130968332290649, 0.3395220935344696, 0.047379013150930405], [0.07019419968128204, 0.9163550138473511, 0.01345300767570734], [0.02061568945646286, 0.10956969857215881, 0.8698145747184753]];
const FROM_ACESCG = [[1.7050527334213257, -0.6217901706695557, -0.08325770497322083], [-0.1302572637796402, 1.140803575515747, -0.010549120604991913], [-0.024003494530916214, -0.1289687156677246, 1.1529724597930908]];
const REC2020 = [[0.627403974533081, 0.3292837142944336, 0.043313607573509216], [0.06909734010696411, 0.9195406436920166, 0.011362645775079727], [0.016391457989811897, 0.0880131796002388, 0.8955954909324646]];
const FROM_REC2020 = [[1.6604909896850586, -0.5876421332359314, -0.07285061478614807], [-0.12455052882432938, 1.1328998804092407, -0.008349758572876453], [-0.018150806427001953, -0.1005786657333374, 1.1187293529510498]];

const apply = (rows: number[][], c: number[]): number[] => rows.map((r) => r[0] * c[0] + r[1] * c[1] + r[2] * c[2]);
const toSrgb = (c: number): number => (c < 0.0031308 ? (c < 0 ? 0 : c * 12.92) : 1.055 * Math.pow(c, 1 / 2.4) - 0.055);
const fromSrgb = (c: number): number => (c < 0.04045 ? (c < 0 ? 0 : c / 12.92) : Math.pow((c + 0.055) / 1.055, 2.4));

export class Color implements Iterable<number> {
  /** @internal */
  _c: number[];
  /** @internal */
  _frozen = false;

  constructor(rgb: VectorLike | Color = [0, 0, 0]) {
    const a = rgb instanceof Color ? rgb._c.slice() : nums(rgb, "Color");
    if (a.length !== 3) throw new TypeError("Color(): expects 3 numbers (r, g, b)");
    this._c = a;
  }
  #mut(): number[] {
    if (this._frozen) throw new TypeError("Color is frozen, cannot set");
    return this._c;
  }

  __len__(): number { return 3; }
  __getitem__(i: number): number {
    const j = i < 0 ? 3 + i : i;
    if (j < 0 || j > 2) throw new RangeError("color[item]: array index out of range");
    return this._c[j];
  }
  __setitem__(i: number, x: number): void {
    const j = i < 0 ? 3 + i : i;
    if (j < 0 || j > 2) throw new RangeError("color[item] = x: array assignment index out of range");
    this.#mut()[j] = x;
  }
  [Symbol.iterator](): Iterator<number> { return this._c.slice()[Symbol.iterator](); }
  [index: number]: number;

  get r(): number { return this._c[0]; }
  set r(v: number) { this.#mut()[0] = v; }
  get g(): number { return this._c[1]; }
  set g(v: number) { this.#mut()[1] = v; }
  get b(): number { return this._c[2]; }
  set b(v: number) { this.#mut()[2] = v; }
  get h(): number { return this.hsv[0]; }
  set h(v: number) { this.#setHsv(0, v); }
  get s(): number { return this.hsv[1]; }
  set s(v: number) { this.#setHsv(1, v); }
  get v(): number { return this.hsv[2]; }
  set v(v: number) { this.#setHsv(2, v); }
  get hsv(): [number, number, number] { return m.rgbToHsv(this._c[0], this._c[1], this._c[2]); }
  set hsv(hsv: VectorLike) {
    const [h, s, v] = nums(hsv);
    this.#mut();
    this._c = m.hsvToRgb(m.clamp(h, 0, 1), m.clamp(s, 0, 1), v);
  }
  #setHsv(i: number, x: number): void {
    const hsv = this.hsv;
    hsv[i] = i < 2 ? m.clamp(x, 0, 1) : x;
    this.#mut();
    this._c = m.hsvToRgb(hsv[0], hsv[1], hsv[2]);
  }
  get is_wrapped(): boolean { return false; }
  get is_frozen(): boolean { return this._frozen; }
  get is_valid(): boolean { return true; }
  get owner(): unknown { return null; }

  copy(): Color { return new Color(this._c); }
  freeze(): this { this._frozen = true; return this; }
  from_scene_linear_to_srgb(): Color { return new Color(this._c.map(toSrgb)); }
  from_srgb_to_scene_linear(): Color { return new Color(this._c.map(fromSrgb)); }
  from_scene_linear_to_xyz_d65(): Color { return new Color(apply(XYZ_D65, this._c)); }
  from_xyz_d65_to_scene_linear(): Color { return new Color(apply(FROM_XYZ_D65, this._c)); }
  from_scene_linear_to_aces(): Color { return new Color(apply(ACES, this._c)); }
  from_aces_to_scene_linear(): Color { return new Color(apply(FROM_ACES, this._c)); }
  from_scene_linear_to_acescg(): Color { return new Color(apply(ACESCG, this._c)); }
  from_acescg_to_scene_linear(): Color { return new Color(apply(FROM_ACESCG, this._c)); }
  from_scene_linear_to_rec709_linear(): Color { return this.copy(); }
  from_rec709_linear_to_scene_linear(): Color { return this.copy(); }
  from_scene_linear_to_rec2020_linear(): Color { return new Color(apply(REC2020, this._c)); }
  from_rec2020_linear_to_scene_linear(): Color { return new Color(apply(FROM_REC2020, this._c)); }

  // ---- Python's operators ----
  add(o: Color | VectorLike): Color { const b = nums(o as VectorLike); return new Color(this._c.map((x, i) => x + b[i])); }
  sub(o: Color | VectorLike): Color { const b = nums(o as VectorLike); return new Color(this._c.map((x, i) => x - b[i])); }
  mul(f: number): Color { return new Color(this._c.map((x) => x * f)); }
  div(f: number): Color {
    if (f === 0) throw new RangeError("Color division: divide by zero error");
    return new Color(this._c.map((x) => x / f));
  }
  neg(): Color { return new Color(this._c.map((x) => -x)); }
  equals(other: unknown): boolean { return other instanceof Color && other._c.every((x, i) => x === this._c[i]); }
  toString(): string { return `Color((${this._c.map(m.pyFloat).join(", ")}))`; }
  toJSON(): number[] { return this._c.slice(); }
}
