// Values to and from the bridge (python/raea_blender/codec.py is the other half). JSON's own values cross as
// themselves; the rest are tagged objects. A proxy crosses as the path it stands for ({$x}) or the reference it holds
// ({$ref}); a reference coming back becomes a proxy (Session.ref).
import { Color, Euler, Matrix, Quaternion, Vector } from "./mathutils";

/** A Python dict, for passing a dict where a plain object would be taken as keyword arguments. */
export class PyDict {
  constructor(readonly entries: Iterable<[unknown, unknown]> | Record<string, unknown>) {}
}
/** A Python tuple (an array crosses as a list). */
export class PyTuple {
  constructor(readonly items: readonly unknown[]) {}
}
/** Python bytes (a Uint8Array crosses as a typed buffer, for foreach_get/foreach_set). */
export class PyBytes {
  constructor(readonly data: Uint8Array) {}
}
/** Keyword arguments, said explicitly: f(a, kw({ x: 1 })). A plain object as a call's last argument is the same. */
export class Kw {
  constructor(readonly args: Record<string, unknown>) {}
}

export type TypedArray = Float32Array | Float64Array | Int8Array | Uint8Array | Int16Array | Uint16Array | Int32Array | Uint32Array;
const KINDS: [new (n: number) => TypedArray, string][] = [
  [Float32Array, "f32"], [Float64Array, "f64"], [Int8Array, "i8"], [Uint8Array, "u8"],
  [Int16Array, "i16"], [Uint16Array, "u16"], [Int32Array, "i32"], [Uint32Array, "u32"],
];
const kindOf = (a: ArrayBufferView): string | undefined => KINDS.find(([c]) => a instanceof c)?.[1];
const ctorOf = (k: string): (new (b: ArrayBuffer) => TypedArray) =>
  (KINDS.find(([, n]) => n === k)?.[0] as unknown as new (b: ArrayBuffer) => TypedArray) ?? Uint8Array;

// ---- base64, fast where the runtime has it ----
const B64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
type NodeBuffer = { from(a: Uint8Array | string, enc?: string): Uint8Array & { toString(enc: string): string } };
const NodeBuf = (globalThis as { Buffer?: NodeBuffer }).Buffer;
export function toB64(bytes: Uint8Array): string {
  if (NodeBuf) return NodeBuf.from(bytes.buffer instanceof ArrayBuffer ? new Uint8Array(bytes.buffer, bytes.byteOffset, bytes.byteLength) : bytes).toString("base64");
  let out = "";
  let i = 0;
  for (; i + 2 < bytes.length; i += 3) {
    const n = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
    out += B64[n >> 18] + B64[(n >> 12) & 63] + B64[(n >> 6) & 63] + B64[n & 63];
  }
  if (i < bytes.length) {
    const n = (bytes[i] << 16) | ((bytes[i + 1] ?? 0) << 8);
    out += B64[n >> 18] + B64[(n >> 12) & 63] + (i + 1 < bytes.length ? B64[(n >> 6) & 63] : "=") + "=";
  }
  return out;
}
const B64_INDEX = new Map([...B64].map((c, i) => [c, i]));
export function fromB64(s: string): Uint8Array {
  if (NodeBuf) {
    const b = NodeBuf.from(s, "base64");
    return new Uint8Array(b.buffer, b.byteOffset, b.byteLength).slice();
  }
  const clean = s.replace(/=+$/, "");
  const out = new Uint8Array(Math.floor((clean.length * 3) / 4));
  let o = 0;
  for (let i = 0; i < clean.length; i += 4) {
    const n = (B64_INDEX.get(clean[i])! << 18) | ((B64_INDEX.get(clean[i + 1]) ?? 0) << 12) | ((B64_INDEX.get(clean[i + 2]) ?? 0) << 6) | (B64_INDEX.get(clean[i + 3]) ?? 0);
    if (o < out.length) out[o++] = n >> 16;
    if (o < out.length) out[o++] = (n >> 8) & 255;
    if (o < out.length) out[o++] = n & 255;
  }
  return out;
}
const bytesOf = (a: ArrayBufferView): Uint8Array => new Uint8Array(a.buffer, a.byteOffset, a.byteLength);

// ---- encoding ----
export interface EncodeCtx {
  /** a proxy's wire form ({$x} or {$ref}), or undefined for anything that isn't one of this session's proxies */
  proxy(v: unknown): unknown;
  /** typed arrays met, in the order Python will decode them (a call's out-buffers: foreach_get) */
  bufs: TypedArray[];
}

const num = (x: number): unknown => (Number.isFinite(x) ? x : { $f: Number.isNaN(x) ? "nan" : x > 0 ? "inf" : "-inf" });
export const isPlain = (v: unknown): v is Record<string, unknown> => {
  if (v === null || typeof v !== "object") return false;
  const p = Object.getPrototypeOf(v);
  return p === Object.prototype || p === null;
};

export function enc(v: unknown, c: EncodeCtx): unknown {
  if (v === null || v === undefined) return null;
  switch (typeof v) {
    case "boolean":
    case "string":
      return v;
    case "number":
      return num(v);
    case "bigint":
      return Number.isSafeInteger(Number(v)) ? Number(v) : { $int: v.toString() };
    case "function": {
      const w = c.proxy(v);
      if (w !== undefined) return w;
      throw new TypeError("raea/blender: a JavaScript function can't be passed to Blender");
    }
    case "symbol":
      throw new TypeError("raea/blender: a symbol can't be passed to Blender");
  }
  if (v instanceof Vector) return { $vec: [...v].map(num) };
  if (v instanceof Matrix) return { $mat: v.toJSON().map((r) => r.map(num)) };
  if (v instanceof Quaternion) return { $quat: [...v].map(num) };
  if (v instanceof Euler) return { $eul: [...v].map(num), o: v.order };
  if (v instanceof Color) return { $col: [...v].map(num) };
  if (ArrayBuffer.isView(v) && !(v instanceof DataView)) {
    const k = kindOf(v);
    if (!k) throw new TypeError(`raea/blender: ${v.constructor.name} isn't a buffer Blender reads; use Float32Array, Int32Array, Uint8Array...`);
    c.bufs.push(v as TypedArray);
    return { $buf: toB64(bytesOf(v)), t: k };
  }
  if (Array.isArray(v)) return v.map((x) => enc(x, c));
  if (v instanceof Set) return { $set: [...v].map((x) => enc(x, c)) };
  if (v instanceof Map) return { $dict: [...v].map(([k, x]) => [enc(k, c), enc(x, c)]) };
  if (v instanceof PyTuple) return { $tuple: v.items.map((x) => enc(x, c)) };
  if (v instanceof PyBytes) return { $bytes: toB64(v.data) };
  if (v instanceof PyDict) {
    const it = Symbol.iterator in Object(v.entries) ? [...(v.entries as Iterable<[unknown, unknown]>)] : Object.entries(v.entries);
    return { $dict: it.map(([k, x]) => [enc(k, c), enc(x, c)]) };
  }
  if (v instanceof Kw) throw new TypeError("raea/blender: kw() is only for a call's last argument");
  if (isPlain(v)) return { $dict: Object.entries(v).filter(([, x]) => x !== undefined).map(([k, x]) => [k, enc(x, c)]) };
  if (typeof (v as Iterable<unknown>)[Symbol.iterator] === "function") return [...(v as Iterable<unknown>)].map((x) => enc(x, c));
  throw new TypeError(`raea/blender: can't pass a ${(v as object).constructor?.name ?? "value"} to Blender`);
}

// ---- decoding ----
export interface DecodeCtx {
  /** a reference from Python as a proxy */
  ref(id: number, type: string): unknown;
}
type Tagged = Record<string, unknown>;
const fnum = (x: unknown): number =>
  typeof x === "number" ? x : (({ nan: NaN, inf: Infinity, "-inf": -Infinity } as Record<string, number>)[(x as Tagged).$f as string] ?? NaN);

export function dec(v: unknown, c: DecodeCtx): unknown {
  if (v === null || typeof v !== "object") return v;
  if (Array.isArray(v)) return v.map((x) => dec(x, c));
  const t = v as Tagged;
  if ("$ref" in t) return c.ref(t.$ref as number, t.t as string);
  if ("$vec" in t) return new Vector((t.$vec as unknown[]).map(fnum));
  if ("$mat" in t) return new Matrix((t.$mat as unknown[][]).map((r) => r.map(fnum)));
  if ("$quat" in t) return new Quaternion((t.$quat as unknown[]).map(fnum));
  if ("$eul" in t) return new Euler((t.$eul as unknown[]).map(fnum), (t.o as "XYZ") ?? "XYZ");
  if ("$col" in t) return new Color((t.$col as unknown[]).map(fnum));
  if ("$set" in t) return new Set((t.$set as unknown[]).map((x) => dec(x, c)));
  if ("$dict" in t) {
    const pairs = (t.$dict as [unknown, unknown][]).map(([k, x]) => [dec(k, c), dec(x, c)] as const);
    if (pairs.every(([k]) => typeof k === "string")) return Object.fromEntries(pairs);
    return new Map(pairs);
  }
  if ("$bytes" in t) return fromB64(t.$bytes as string);
  if ("$buf" in t) {
    const bytes = fromB64(t.$buf as string);
    return new (ctorOf(t.t as string))(bytes.buffer as ArrayBuffer);
  }
  if ("$f" in t) return fnum(t);
  if ("$int" in t) return BigInt(t.$int as string);
  return t;
}

/** Copies what Python wrote into a buffer back into the caller's typed array. */
export function fillBack(into: TypedArray, wire: unknown): void {
  const bytes = fromB64((wire as Tagged).$buf as string);
  bytesOf(into).set(bytes.subarray(0, into.byteLength));
}
