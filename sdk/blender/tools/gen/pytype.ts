// Python's type expressions, as Blender's docstrings write them (`:type: tuple[:class:`Object`, ...]`,
// `Literal['X', 'Y'] | None`, `list of :class:`Vector``), turned into TypeScript. A type is read for one of two places:
// "out" (a value Blender gives: awaited, it's this) or "in" (a value passed to Blender).
import type { Names } from "./names";

/** A TypeScript type and what kind of Blender value it is, which decides how a path or a call's result wraps it. */
export interface Ty {
  ts: string;
  /** obj: a Blender object (a proxy); math: a mathutils value; seq: a list of objects; val: a plain value */
  kind: "obj" | "math" | "seq" | "val" | "void" | "any";
  /** may be None */
  nullable?: boolean;
  /** seq: the objects' type */
  elem?: string;
}
export const ANY: Ty = { ts: "any", kind: "any" };
export const VOID: Ty = { ts: "void", kind: "void" };
export const val = (ts: string): Ty => ({ ts, kind: "val" });

type Tok = { t: "class" | "id" | "str" | "num" | "p"; v: string };

function lex(s: string): Tok[] | null {
  const out: Tok[] = [];
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (/\s/.test(c) || c === "\\") { i++; continue; }
    const cls = /^:(?:class|meth|func|data|attr|obj|ref|mod):`~?([^`]+)`/.exec(s.slice(i));
    if (cls) { out.push({ t: "class", v: cls[1].replace(/^bpy\.types\.(?=bpy_)/, "") }); i += cls[0].length; continue; }
    if (s.startsWith("...", i)) { out.push({ t: "p", v: "..." }); i += 3; continue; }
    if ("[](),|".includes(c)) { out.push({ t: "p", v: c }); i++; continue; }
    if (c === "'" || c === '"') {
      const end = s.indexOf(c, i + 1);
      if (end < 0) return null;
      out.push({ t: "str", v: s.slice(i + 1, end) });
      i = end + 1;
      continue;
    }
    const id = /^[A-Za-z_][\w.]*/.exec(s.slice(i));
    if (id) { out.push({ t: "id", v: id[0] }); i += id[0].length; continue; }
    const n = /^-?\d+(\.\d+)?/.exec(s.slice(i));
    if (n) { out.push({ t: "num", v: n[0] }); i += n[0].length; continue; }
    return null;
  }
  return out;
}

/** A parsed type: a name with arguments, a string literal, a list of types (Callable's), or a union. */
type Node = { n: "name"; v: string; cls: boolean; args: Node[] } | { n: "lit"; v: string; str: boolean } | { n: "list"; items: Node[] } | { n: "union"; items: Node[] } | { n: "etc" };

class Parser {
  i = 0;
  constructor(readonly toks: Tok[]) {}
  peek = () => this.toks[this.i];
  eat(v: string): boolean {
    const t = this.peek();
    if (t && (t.t === "p" || t.t === "id") && t.v === v) { this.i++; return true; }
    return false;
  }
  union(): Node {
    const items = [this.seq()];
    while (this.eat("|") || this.eat("or")) items.push(this.seq());
    return items.length === 1 ? items[0] : { n: "union", items };
  }
  /** `list of X`, `sequence of X`, `tuple of X`: the older docstrings' spelling of list[X] */
  seq(): Node {
    const p = this.primary();
    if (p.n === "name" && !p.cls && !p.args.length && this.eat("of")) {
      this.eat("(");
      const inner = this.union();
      this.eat(")");
      return { n: "name", v: p.v, cls: false, args: [inner] };
    }
    return p;
  }
  args(): Node[] {
    const items: Node[] = [];
    if (this.eat("]")) return items;
    do items.push(this.union());
    while (this.eat(","));
    if (!this.eat("]")) throw new Error("]");
    return items;
  }
  primary(): Node {
    const t = this.toks[this.i++];
    if (!t) throw new Error("end");
    if (t.t === "p" && t.v === "...") return { n: "etc" };
    if (t.t === "p" && t.v === "[") return { n: "list", items: this.args() };
    if (t.t === "p" && t.v === "(") {
      const u = this.union();
      while (this.eat(",")) this.union();
      this.eat(")");
      return u;
    }
    if (t.t === "str" || t.t === "num") return { n: "lit", v: t.v, str: t.t === "str" };
    if (t.t === "class" || t.t === "id") return { n: "name", v: t.v, cls: t.t === "class", args: this.eat("[") ? this.args() : [] };
    throw new Error(`unexpected ${t.v}`);
  }
}

const SEQ = new Set(["list", "Sequence", "Iterable", "MutableSequence", "Iterator", "Generator", "Collection", "sequence", "Sequence", "array", "tuple", "frozenset"]);
const NUM = new Set(["int", "integer", "float", "double", "number", "complex"]);
const STR = new Set(["str", "string"]);
const BYTES = new Set(["bytes", "bytearray", "memoryview", "buffer", "Buffer", "collections.abc.Buffer"]);
const ANYS = new Set(["Any", "object", "type", "ModuleType", "numpy.ndarray", "datetime.timedelta", "Callable", "callable", "function", "module", "Self.__class__"]);

export interface Where {
  names: Names;
  /** "in": an argument; "out": a value Blender gives */
  role: "in" | "out";
  /** the class whose member this is (Self), as a TypeScript reference */
  self?: string;
  /** the Python module this docstring belongs to, for bare class names */
  module?: string;
}

function union(tys: Ty[], role: "in" | "out"): Ty {
  const nullable = tys.some((t) => t.ts === "null" || t.kind === "void");
  const rest = tys.filter((t) => t.ts !== "null" && t.kind !== "void");
  if (!rest.length) return VOID;
  if (rest.some((t) => t.kind === "any")) return ANY;
  const ts = [...new Set(rest.map((t) => t.ts))];
  const kind = rest.every((t) => t.kind === rest[0].kind) ? rest[0].kind : "val";
  const one: Ty = { ts: ts.join(" | "), kind, nullable };
  if (kind === "seq") one.elem = [...new Set(rest.map((t) => t.elem!))].join(" | ");
  if (nullable && (kind === "val" || role === "in")) one.ts = `${ts.length > 1 ? ts.join(" | ") : ts[0]} | null`;
  return one;
}

const arr = (e: Ty, role: "in" | "out"): string => {
  const inner = /[|&]|^readonly /.test(e.ts) ? `(${e.ts})` : e.ts;
  return role === "in" ? `readonly ${inner}[]` : `${inner}[]`;
};

function toTy(n: Node, w: Where): Ty {
  switch (n.n) {
    case "etc":
      return ANY;
    case "lit":
      return val(n.str ? JSON.stringify(n.v) : n.v);
    case "list":
      return ANY;
    case "union":
      return union(n.items.map((x) => toTy(x, w)), w.role);
  }
  const { v, args } = n;
  if (n.cls) {
    const r = w.names.pyClass(v, w.module);
    if (r) return r(w.role);
    return ANY;
  }
  if (v === "None" || v === "NoneType") return { ts: "null", kind: "val" };
  if (v === "bool" || v === "boolean") return val("boolean");
  if (NUM.has(v)) return val("number");
  if (STR.has(v)) return val("string");
  if (BYTES.has(v)) return val(w.role === "in" ? "H.Bytes" : "Uint8Array");
  if (v === "Self") return w.self ? { ts: w.self, kind: "obj" } : ANY;
  if (ANYS.has(v)) return ANY;
  if (v === "Literal") return union(args.map((a) => toTy(a, w)), w.role);
  if (v === "Optional" && args.length === 1) return union([toTy(args[0], w), { ts: "null", kind: "val" }], w.role);
  if (v === "Union") return union(args.map((a) => toTy(a, w)), w.role);
  if (SEQ.has(v)) {
    if (!args.length) return val(w.role === "in" ? "readonly any[]" : "any[]");
    if (v === "tuple" && !(args.length === 2 && args[1].n === "etc")) {
      const items = args.map((a) => toTy(a, w).ts);
      return val(w.role === "in" ? `readonly [${items.join(", ")}]` : `[${items.join(", ")}]`);
    }
    const e = toTy(args[0], w);
    if (e.kind === "any") return val("any[]");
    if (e.kind === "obj" && w.role === "out") return { ts: arr(e, "out"), kind: "seq", elem: e.ts };
    return val(arr(e, w.role));
  }
  if (v === "set" || v === "Set" || v === "AbstractSet") return val(args.length ? `Set<${toTy(args[0], w).ts}>` : "Set<any>");
  if (v === "dict" || v === "Mapping" || v === "Dict") {
    const vt = args.length === 2 ? toTy(args[1], w).ts : "any";
    return val(w.role === "in" ? `H.DictIn<${vt}>` : `Map<${args.length ? toTy(args[0], w).ts : "any"}, ${vt}>`);
  }
  const r = w.names.pyClass(v, w.module);
  return r ? r(w.role) : ANY;
}

const CACHE = new Map<string, Node | null>();
/** A docstring's type expression as a TypeScript type, or `any` where it can't be read. */
export function pyType(src: string, w: Where): Ty {
  const s = src.trim().replace(/\.$/, "");
  let node = CACHE.get(s);
  if (node === undefined) {
    const toks = lex(s);
    node = null;
    if (toks) {
      try {
        const p = new Parser(toks);
        const u = p.union();
        if (p.i === toks.length) node = u;
      } catch { /* a type nobody can read: any */ }
    }
    CACHE.set(s, node);
  }
  return node ? toTy(node, w) : ANY;
}
