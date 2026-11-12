// CanvasRenderingContext2D.
import * as wire from "../wire";
import { base64, encodePng } from "./png";
import { COMPOSITES, CanvasHost, Gradient, ID, ImageData_, Paint, Path, Path2D_, S, State, fresh, measure, mul, paintOf, parseColor, parseFilter, parseFont, unb64 } from "./all";

export class CanvasRenderingContext2D_ {
  private s: State = fresh();
  private stack: State[] = [];
  private path: Path;
  private list: unknown[] = [];
  private gen = 1;
  private size: [number, number] = [0, 0];
  private pending = false;
  constructor(public canvas: CanvasHost & { width: number; height: number }) {
    this.path = new Path(() => this.s.ts);
    this.size = [canvas.width, canvas.height];
  }

  // -------- what's drawn goes to the host

  /** The bitmap was cleared (its size set): the list starts again. */
  _reset() {
    this.list = [];
    this.gen++;
    this.s = fresh();
    this.stack = [];
    this.path = new Path(() => this.s.ts);
    this.size = [this.canvas.width, this.canvas.height];
    this.send();
  }
  private push(op: unknown[]) {
    const [w, h] = [this.canvas.width, this.canvas.height];
    if (w !== this.size[0] || h !== this.size[1] || this.coversAll(op, w, h)) {
      this.list = [];
      this.gen++;
      this.size = [w, h];
    }
    this.list.push(op);
    this.send();
  }
  /** A clear, or an opaque source-over fill, over the whole bitmap: nothing drawn before it shows, so the list can
   *  start again with it. Libraries that clear under a transform (Excalidraw's zoom and pixel ratio) never hit
   *  clearRect's own case, and their lists grew by a whole scene every frame. */
  private coversAll(op: unknown[], w: number, h: number) {
    const kind = op[0];
    if (kind !== "clear" && kind !== "fill") return false;
    const d = op[1];
    const st = op[op.length - 1] as { alpha: number; comp: string; clip: unknown[]; shadow: unknown; filter: unknown };
    if (!Array.isArray(d) || !st || st.clip.length || st.shadow || st.filter) return false;
    if (kind === "fill") {
      const paint = op[3];
      if (st.alpha !== 1 || st.comp !== "source-over" || !Array.isArray(paint) || paint[3] !== 1) return false;
    }
    // a rectangle: move, three lines, close (each command then its point), axis-aligned, covering 0,0..w,h
    if (d.length !== 13 || d[0] !== 0 || d[3] !== 1 || d[6] !== 1 || d[9] !== 1 || d[12] !== 4) return false;
    const xs = [d[1], d[4], d[7], d[10]] as number[];
    const ys = [d[2], d[5], d[8], d[11]] as number[];
    const axis = (xs[0] === xs[1] || ys[0] === ys[1]) && (xs[1] === xs[2] || ys[1] === ys[2]);
    return axis && Math.min(...xs) <= 0 && Math.min(...ys) <= 0 && Math.max(...xs) >= w && Math.max(...ys) >= h;
  }
  private send() {
    if (this.pending) return;
    this.pending = true;
    queueMicrotask(() => {
      this.pending = false;
      const id = this.canvas.__wid;
      if (id === undefined || !this.canvas._wired) return;
      wire.set(id, "__canvas2d", { gen: this.gen, w: this.size[0], h: this.size[1], ops: this.list });
    });
  }
  private static uids = 0;
  private uid = ++CanvasRenderingContext2D_.uids;
  /** The list as it is now, for this canvas drawn onto another (systems/canvas's "canvas" op replays it there), with
   *  a key the host keeps its bitmap by: the list only grows within a generation, so the key names its contents. */
  _snapshot(): { key: string; w: number; h: number; ops: unknown[] } | null {
    const [w, h] = [this.canvas.width, this.canvas.height];
    if (!w || !h) return null;
    const same = w === this.size[0] && h === this.size[1];
    return { key: `${this.uid}:${this.gen}:${same ? this.list.length : 0}:${w}x${h}`, w, h, ops: same ? this.list.slice() : [] };
  }
  private snap?: { gen: number; n: number; w: number; h: number; url: string };
  /** The bitmap as a PNG data URL, read back from the host (toDataURL; this canvas drawn onto another, where an
   *  image op can only name a src). Kept until something more is drawn. */
  _dataUrl(): string {
    const [w, h] = [this.canvas.width, this.canvas.height];
    if (!w || !h) return "data:,";
    const k = this.snap;
    if (k && k.gen === this.gen && k.n === this.list.length && k.w === w && k.h === h) return k.url;
    const url = `data:image/png;base64,${base64(encodePng(w, h, this.getImageData(0, 0, w, h).data))}`;
    this.snap = { gen: this.gen, n: this.list.length, w, h, url };
    return url;
  }
  private state() {
    const s = this.s;
    return {
      ts: s.ts,
      alpha: s.alpha,
      comp: s.comp,
      clip: s.clip,
      shadow: s.shadowColor[3] > 0 && (s.shadowBlur > 0 || s.shadowX !== 0 || s.shadowY !== 0) ? { color: s.shadowColor, blur: s.shadowBlur, x: s.shadowX, y: s.shadowY } : null,
      smooth: s.smooth,
      filter: s.filters.length ? s.filters : null,
    };
  }
  private strokeParams() {
    const s = this.s;
    return { width: s.lineWidth, cap: s.lineCap, join: s.lineJoin, miter: s.miterLimit, dash: s.dash, offset: s.dashOffset };
  }

  // -------- state

  save() {
    this.stack.push({ ...this.s, dash: this.s.dash.slice(), clip: this.s.clip.slice() });
  }
  restore() {
    const s = this.stack.pop();
    if (s) this.s = s;
  }
  reset() {
    this._reset();
  }
  get globalAlpha() {
    return this.s.alpha;
  }
  set globalAlpha(v: number) {
    if (Number.isFinite(v) && v >= 0 && v <= 1) this.s.alpha = v;
  }
  get globalCompositeOperation() {
    return this.s.comp;
  }
  set globalCompositeOperation(v: string) {
    if (COMPOSITES.has(v)) this.s.comp = v;
  }
  get imageSmoothingEnabled() {
    return this.s.smooth;
  }
  set imageSmoothingEnabled(v: boolean) {
    this.s.smooth = !!v;
  }
  imageSmoothingQuality = "low";
  private style(p: Paint) {
    if (p instanceof Gradient) return p;
    const [r, g, b, a] = p;
    const h = (n: number) => Math.round(n).toString(16).padStart(2, "0");
    return a === 1 ? `#${h(r)}${h(g)}${h(b)}` : `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${a})`;
  }
  get fillStyle(): string | Gradient {
    return this.style(this.s.fill);
  }
  set fillStyle(v: string | Gradient) {
    if (v instanceof Gradient) this.s.fill = v;
    else {
      const c = parseColor(String(v));
      if (c) this.s.fill = c;
    }
  }
  get strokeStyle(): string | Gradient {
    return this.style(this.s.stroke);
  }
  set strokeStyle(v: string | Gradient) {
    if (v instanceof Gradient) this.s.stroke = v;
    else {
      const c = parseColor(String(v));
      if (c) this.s.stroke = c;
    }
  }
  get lineWidth() {
    return this.s.lineWidth;
  }
  set lineWidth(v: number) {
    if (Number.isFinite(v) && v > 0) this.s.lineWidth = v;
  }
  get lineCap() {
    return this.s.lineCap;
  }
  set lineCap(v: CanvasLineCap) {
    if (v === "butt" || v === "round" || v === "square") this.s.lineCap = v;
  }
  get lineJoin() {
    return this.s.lineJoin;
  }
  set lineJoin(v: CanvasLineJoin) {
    if (v === "miter" || v === "round" || v === "bevel") this.s.lineJoin = v;
  }
  get miterLimit() {
    return this.s.miterLimit;
  }
  set miterLimit(v: number) {
    if (Number.isFinite(v) && v > 0) this.s.miterLimit = v;
  }
  get lineDashOffset() {
    return this.s.dashOffset;
  }
  set lineDashOffset(v: number) {
    if (Number.isFinite(v)) this.s.dashOffset = v;
  }
  setLineDash(d: number[]) {
    if (d.some((x) => !Number.isFinite(x) || x < 0)) return;
    this.s.dash = d.length % 2 ? [...d, ...d] : d.slice();
  }
  getLineDash() {
    return this.s.dash.slice();
  }
  get shadowColor() {
    return this.style(this.s.shadowColor) as string;
  }
  set shadowColor(v: string) {
    const c = parseColor(v);
    if (c) this.s.shadowColor = c;
  }
  get shadowBlur() {
    return this.s.shadowBlur;
  }
  set shadowBlur(v: number) {
    if (Number.isFinite(v) && v >= 0) this.s.shadowBlur = v;
  }
  get shadowOffsetX() {
    return this.s.shadowX;
  }
  set shadowOffsetX(v: number) {
    if (Number.isFinite(v)) this.s.shadowX = v;
  }
  get shadowOffsetY() {
    return this.s.shadowY;
  }
  set shadowOffsetY(v: number) {
    if (Number.isFinite(v)) this.s.shadowY = v;
  }
  get font() {
    return this.s.font;
  }
  set font(v: string) {
    if (parseFont(v)) this.s.font = v;
  }
  get textAlign() {
    return this.s.align;
  }
  set textAlign(v: CanvasTextAlign) {
    if (["start", "end", "left", "right", "center"].includes(v)) this.s.align = v;
  }
  get textBaseline() {
    return this.s.baseline;
  }
  set textBaseline(v: CanvasTextBaseline) {
    if (["top", "hanging", "middle", "alphabetic", "ideographic", "bottom"].includes(v)) this.s.baseline = v;
  }
  direction: CanvasDirection = "ltr";
  get filter() {
    return this.s.filter;
  }
  set filter(v: string) {
    const l = parseFilter(String(v));
    if (l) [this.s.filter, this.s.filters] = [String(v), l];
  }

  // -------- transforms

  translate(x: number, y: number) {
    this.s.ts = mul(this.s.ts, [1, 0, 0, 1, x, y]);
  }
  scale(x: number, y: number) {
    this.s.ts = mul(this.s.ts, [x, 0, 0, y, 0, 0]);
  }
  rotate(a: number) {
    const c = Math.cos(a), s = Math.sin(a);
    this.s.ts = mul(this.s.ts, [c, s, -s, c, 0, 0]);
  }
  transform(a: number, b: number, c: number, d: number, e: number, f: number) {
    this.s.ts = mul(this.s.ts, [a, b, c, d, e, f]);
  }
  setTransform(a?: number | DOMMatrix2DInit, b?: number, c?: number, d?: number, e?: number, f?: number) {
    if (typeof a === "object") this.s.ts = [a.a ?? 1, a.b ?? 0, a.c ?? 0, a.d ?? 1, a.e ?? 0, a.f ?? 0];
    else if (a === undefined) this.s.ts = ID;
    else this.s.ts = [a, b!, c!, d!, e!, f!];
  }
  resetTransform() {
    this.s.ts = ID;
  }
  getTransform() {
    const [a, b, c, d, e, f] = this.s.ts;
    return { a, b, c, d, e, f, m11: a, m12: b, m21: c, m22: d, m41: e, m42: f, is2D: true, isIdentity: a === 1 && b === 0 && c === 0 && d === 1 && e === 0 && f === 0 };
  }

  // -------- paths

  beginPath() {
    this.path = new Path(() => this.s.ts);
  }
  moveTo(x: number, y: number) {
    this.path.move(x, y);
  }
  lineTo(x: number, y: number) {
    this.path.line(x, y);
  }
  quadraticCurveTo(cx: number, cy: number, x: number, y: number) {
    this.path.quad(cx, cy, x, y);
  }
  bezierCurveTo(a: number, b: number, c: number, d: number, x: number, y: number) {
    this.path.cubic(a, b, c, d, x, y);
  }
  closePath() {
    this.path.close();
  }
  rect(x: number, y: number, w: number, h: number) {
    this.path.move(x, y);
    this.path.line(x + w, y);
    this.path.line(x + w, y + h);
    this.path.line(x, y + h);
    this.path.close();
  }
  roundRect(x: number, y: number, w: number, h: number, radii: number | number[] = 0) {
    const r = Array.isArray(radii) ? radii : [radii];
    const [tl, tr, br, bl] = r.length === 1 ? [r[0], r[0], r[0], r[0]] : r.length === 2 ? [r[0], r[1], r[0], r[1]] : r.length === 3 ? [r[0], r[1], r[2], r[1]] : [r[0], r[1], r[2], r[3]];
    const scale = Math.min(1, w / (tl + tr || 1), w / (bl + br || 1), h / (tl + bl || 1), h / (tr + br || 1));
    const [a, b, c, d] = [tl, tr, br, bl].map((v) => (typeof v === "number" ? v : 0) * scale);
    const P = this.path;
    P.move(x + a, y);
    P.line(x + w - b, y);
    if (b) P.ellipse(x + w - b, y + b, b, b, 0, -Math.PI / 2, 0, false);
    P.line(x + w, y + h - c);
    if (c) P.ellipse(x + w - c, y + h - c, c, c, 0, 0, Math.PI / 2, false);
    P.line(x + d, y + h);
    if (d) P.ellipse(x + d, y + h - d, d, d, 0, Math.PI / 2, Math.PI, false);
    P.line(x, y + a);
    if (a) P.ellipse(x + a, y + a, a, a, 0, Math.PI, Math.PI * 1.5, false);
    P.close();
    P.move(x, y);
  }
  arc(x: number, y: number, r: number, a0: number, a1: number, ccw = false) {
    this.path.ellipse(x, y, r, r, 0, a0, a1, ccw);
  }
  ellipse(x: number, y: number, rx: number, ry: number, rot: number, a0: number, a1: number, ccw = false) {
    this.path.ellipse(x, y, rx, ry, rot, a0, a1, ccw);
  }
  arcTo(x1: number, y1: number, x2: number, y2: number, r: number) {
    const P = this.path;
    if (!P.last) P.move(x1, y1);
    const [x0, y0] = P.last!;
    const v0 = [x0 - x1, y0 - y1], v1 = [x2 - x1, y2 - y1];
    const l0 = Math.hypot(v0[0], v0[1]), l1 = Math.hypot(v1[0], v1[1]);
    const cross = v0[0] * v1[1] - v0[1] * v1[0];
    if (!r || !l0 || !l1 || Math.abs(cross) < 1e-9) return P.line(x1, y1);
    const ang = Math.acos(Math.max(-1, Math.min(1, (v0[0] * v1[0] + v0[1] * v1[1]) / (l0 * l1))));
    const t = r / Math.tan(ang / 2);
    const p0 = [x1 + (v0[0] / l0) * t, y1 + (v0[1] / l0) * t];
    const p1 = [x1 + (v1[0] / l1) * t, y1 + (v1[1] / l1) * t];
    // the centre: from p0, perpendicular toward the inside of the corner
    const n = cross > 0 ? [-v0[1] / l0, v0[0] / l0] : [v0[1] / l0, -v0[0] / l0];
    const cx = p0[0] + n[0] * r, cy = p0[1] + n[1] * r;
    const a0 = Math.atan2(p0[1] - cy, p0[0] - cx), a1 = Math.atan2(p1[1] - cy, p1[0] - cx);
    P.line(p0[0], p0[1]);
    // the short way round, between the tangent points: clockwise on screen (y down) when the corner turns that way
    P.ellipse(cx, cy, r, r, 0, a0, a1, cross > 0);
  }

  // -------- drawing

  private paths(arg?: unknown, rule?: unknown): [number[], string] {
    if (arg instanceof Path2D_) return [arg.toDevice(this.s.ts), rule === "evenodd" ? "evenodd" : "nonzero"];
    return [this.path.d.slice(), arg === "evenodd" ? "evenodd" : "nonzero"];
  }
  fill(a?: unknown, b?: unknown) {
    const [d, rule] = this.paths(a, b);
    this.push(["fill", d, rule, paintOf(this.s.fill, this.s.ts), this.state()]);
  }
  stroke(a?: unknown) {
    const [d] = this.paths(a);
    this.push(["stroke", d, this.strokeParams(), paintOf(this.s.stroke, this.s.ts), this.state()]);
  }
  clip(a?: unknown, b?: unknown) {
    const [d, rule] = this.paths(a, b);
    this.s.clip = [...this.s.clip, [d, rule]];
  }
  fillRect(x: number, y: number, w: number, h: number) {
    const p = new Path(() => this.s.ts);
    p.move(x, y);
    p.line(x + w, y);
    p.line(x + w, y + h);
    p.line(x, y + h);
    p.close();
    this.push(["fill", p.d, "nonzero", paintOf(this.s.fill, this.s.ts), this.state()]);
  }
  strokeRect(x: number, y: number, w: number, h: number) {
    const p = new Path(() => this.s.ts);
    p.move(x, y);
    p.line(x + w, y);
    p.line(x + w, y + h);
    p.line(x, y + h);
    p.close();
    this.push(["stroke", p.d, this.strokeParams(), paintOf(this.s.stroke, this.s.ts), this.state()]);
  }
  clearRect(x: number, y: number, w: number, h: number) {
    // the whole bitmap cleared with no transform or clip: the list starts again
    const t = this.s.ts;
    const whole = t.join() === ID.join() && !this.s.clip.length && x <= 0 && y <= 0 && x + w >= this.canvas.width && y + h >= this.canvas.height;
    if (whole) {
      this.list = [];
      this.gen++;
      this.size = [this.canvas.width, this.canvas.height];
      this.send();
      return;
    }
    const p = new Path(() => this.s.ts);
    p.move(x, y);
    p.line(x + w, y);
    p.line(x + w, y + h);
    p.line(x, y + h);
    p.close();
    this.push(["clear", p.d, { ...this.state(), shadow: null }]);
  }
  private text(kind: "fill" | "stroke", text: string, x: number, y: number, maxWidth?: number) {
    const f = parseFont(this.s.font)!;
    const align = this.s.align === "start" ? "left" : this.s.align === "end" ? "right" : this.s.align;
    const paint = kind === "fill" ? paintOf(this.s.fill, this.s.ts) : paintOf(this.s.stroke, this.s.ts);
    this.push(["text", kind, String(text), x, y, f, align, this.s.baseline, maxWidth ?? null, paint, kind === "stroke" ? this.strokeParams() : null, this.state()]);
  }
  fillText(t: string, x: number, y: number, maxWidth?: number) {
    this.text("fill", t, x, y, maxWidth);
  }
  strokeText(t: string, x: number, y: number, maxWidth?: number) {
    this.text("stroke", t, x, y, maxWidth);
  }
  measureText(text: string) {
    return measure(this.s.font, String(text));
  }
  drawImage(img: { src?: string; currentSrc?: string; _canvas2d?: CanvasRenderingContext2D_; width?: number; height?: number; naturalWidth?: number; naturalHeight?: number }, ...a: number[]) {
    let s: (number | null)[];
    if (a.length === 2) s = [null, null, null, null, a[0], a[1], null, null];
    else if (a.length === 4) s = [null, null, null, null, a[0], a[1], a[2], a[3]];
    else s = a.slice(0, 8);
    // a canvas as the source: its list as it is now, drawn on the host (no pixels come back to JS)
    const ctx = (img as { _ctx?: CanvasRenderingContext2D_ })._ctx;
    if (ctx && !img.currentSrc && !img.src) {
      const snap = ctx._snapshot();
      if (snap) this.push(["canvas", snap, ...s, this.state()]);
      return;
    }
    const src = img.currentSrc || img.src || "";
    if (!src || src === "data:,") return;
    // a video: the frame it shows now, decoded where the list is drawn (its time rides at the end)
    const v = img as { tagName?: string; currentTime?: number };
    if (String(v.tagName).toUpperCase() === "VIDEO") this.push(["video", src, ...s, this.state(), Number(v.currentTime) || 0]);
    else this.push(["image", src, ...s, this.state()]);
  }
  /** The bitmap's pixels in a rectangle: the list drawn on the host, now (the host call canvas.read, answered before it
   *  returns; systems/canvas replays it on the CPU, so nothing is read back from a GPU). */
  getImageData(sx: number, sy: number, sw: number, sh: number) {
    [sx, sy, sw, sh] = [sx, sy, sw, sh].map((n) => Math.trunc(Number(n)));
    if (!sw || !sh || [sw, sh].some((n) => !Number.isFinite(n))) throw new DOMException(`Failed to execute 'getImageData' on 'CanvasRenderingContext2D': The source ${sw ? "height" : "width"} is 0.`, "IndexSizeError");
    if (sw < 0) [sx, sw] = [sx + sw, -sw];
    if (sh < 0) [sy, sh] = [sy + sh, -sh];
    const [w, h] = [this.canvas.width, this.canvas.height];
    const gen = w !== this.size[0] || h !== this.size[1] ? this.gen + 1 : this.gen;
    const ops = gen === this.gen ? this.list : [];
    const r = wire.callSync<{ data: string }>("canvas.read", { width: w, height: h, __canvas2d: { gen, w, h, ops }, x: sx, y: sy, w: sw, h: sh });
    const out = new ImageData_(sw, sh);
    if (r) unb64(r.data, out.data);
    return out;
  }
  createImageData(a: number | ImageData_, h?: number) {
    if (a instanceof ImageData_) return new ImageData_(a.width, a.height);
    return new ImageData_(Math.abs(Math.trunc(a)), Math.abs(Math.trunc(Number(h))));
  }
  createLinearGradient(x0: number, y0: number, x1: number, y1: number) {
    return new Gradient({ k: "linear", x0, y0, x1, y1 });
  }
  createRadialGradient(x0: number, y0: number, r0: number, x1: number, y1: number, r1: number) {
    if (r0 < 0 || r1 < 0) throw new DOMException("The radius provided is negative.", "IndexSizeError");
    return new Gradient({ k: "radial", x0, y0, r0, x1, y1, r1 });
  }
  createConicGradient(a: number, x: number, y: number) {
    return new Gradient({ k: "conic", a, x, y });
  }
  getContextAttributes() {
    return { alpha: true, colorSpace: "srgb", desynchronized: false, willReadFrequently: false };
  }
  isContextLost() {
    return false;
  }
}
