// A callable's TypeScript signatures. Python takes optional arguments by position or by keyword, so a function with
// optional parameters gets two overloads: positional (f(a, b?, c?)) and keyword (f(a, { b, c })); a plain object
// as a call's last argument is its keyword arguments at runtime (src/session.ts).
import { jsdoc, key, param } from "./names";

export interface Param {
  name: string;
  /** the TypeScript type it takes */
  ty: string;
  opt: boolean;
  /** pos: positional only (before `/`); any: positional or keyword; kw: keyword only (after `*`) */
  mode: "pos" | "any" | "kw";
  rest?: "args" | "kwargs";
  doc?: string;
}

// a keyword argument's member: optional, unless `strict` and the parameter is required (the all-keyword overload)
const mark = (p: Param, strict: boolean) => (strict && !p.opt ? "" : "?");
const member = (p: Param, indent: string, strict: boolean): string => `${jsdoc(p.doc, indent)}${indent}${key(p.name)}${mark(p, strict)}: ${p.ty};`;

function kwType(ps: Param[], open: boolean, indent: string, strict = false): string {
  const docs = ps.some((p) => p.doc);
  if (!ps.length) return open ? "Record<string, any>" : "{}";
  if (!docs && ps.length <= 3) return `{ ${ps.map((p) => `${key(p.name)}${mark(p, strict)}: ${p.ty}`).join("; ")}${open ? "; [key: string]: any" : ""} }`;
  const inner = indent + "  ";
  return `{\n${ps.map((p) => member(p, inner, strict)).join("\n")}${open ? `\n${inner}[key: string]: any;` : ""}\n${indent}}`;
}

/** The overloads of a callable, as interface members (name(...): R;), with its doc on each. `generic` is a type
 * parameter list (`<K extends keyof X>`) the parameters' and result's types may use. */
export function overloads(name: string, ps: Param[], ret: string, doc: string, indent = "  ", call = false, generic = ""): string {
  const head = (call ? "" : key(name)) + generic;
  const pos: Param[] = [];
  let optional = false;
  for (const p of ps.filter((p) => p.mode !== "kw" && !p.rest)) {
    optional ||= p.opt;
    pos.push({ ...p, opt: optional });
  }
  const kwonly = ps.filter((p) => p.mode === "kw" && !p.rest);
  const varargs = ps.some((p) => p.rest === "args");
  const varkw = ps.some((p) => p.rest === "kwargs");
  const sig = (args: string[]) => `${head}(${args.join(", ")}): ${ret};`;
  const posArgs = pos.map((p) => `${param(p.name)}${p.opt ? "?" : ""}: ${p.ty}`);
  const out: string[] = [];
  const a = [...posArgs];
  // a rest parameter is last: with *args, keyword arguments are the plain object the arguments may end with
  if (varargs) a.push("...args: any[]");
  else if (kwonly.length || varkw) a.push(`kw?: ${kwType(kwonly, varkw, indent)}`);
  out.push(sig(a));
  const byKw = pos.filter((p) => p.opt && p.mode === "any");
  const posOnlyOpt = pos.some((p) => p.opt && p.mode === "pos");
  if (byKw.length && !posOnlyOpt) {
    const req = pos.filter((p) => !p.opt).map((p) => `${param(p.name)}: ${p.ty}`);
    out.push(sig([...req, `kw: ${kwType([...byKw, ...kwonly], varkw, indent)}`]));
  }
  // every argument by keyword, the required ones too, as Python allows: keyframe_insert({ data_path: "location", frame: 1 })
  if (pos.some((p) => !p.opt) && pos.every((p) => p.mode === "any") && !varargs) {
    out.push(sig([`kw: ${kwType([...pos, ...kwonly], varkw, indent, true)}`]));
  }
  const d = paramDocs(doc, ps);
  return out.map((s) => `${jsdoc(d, indent)}${indent}${s}`).join("\n");
}

function paramDocs(doc: string, ps: Param[]): string {
  const lines = ps.filter((p) => p.doc && p.mode !== "kw").map((p) => `@param ${param(p.name)} ${p.doc!.replace(/\n\s*/g, " ")}`);
  return [doc.trim(), ...lines].filter(Boolean).join("\n");
}

// ---- Python docstrings ----

export interface PyDoc {
  /** the signature a `.. function::` (method, class) line gives, inside its parentheses */
  sig: string | null;
  text: string;
  params: Map<string, { doc?: string; type?: string }>;
  rtype?: string;
  returns?: string;
  /** a property's `:type:` */
  type?: string;
}

const FIELD = /^:(param|arg|type|rtype|return|returns)(?:\s+([\w*]+))?:\s?(.*)$/;

/** A docstring's parts: its signature line, its text, its params' docs and types, its return type. */
export function readDoc(doc: string): PyDoc {
  const out: PyDoc = { sig: null, text: "", params: new Map() };
  const lines = (doc ?? "").split("\n");
  const text: string[] = [];
  let cur: { set(s: string): void } | null = null;
  let i = 0;
  const dir = /^\.\. (?:function|method|classmethod|staticmethod|class|data|attribute)::\s*[\w.]*\s*(\((.*)\))?\s*$/.exec(lines[0] ?? "");
  if (dir) {
    out.sig = dir[2] ?? null;
    i = 1;
  }
  for (; i < lines.length; i++) {
    const l = lines[i];
    const f = FIELD.exec(l.trim());
    if (f && !/^\s/.test(l)) {
      const [, kind, name, rest] = f;
      const p = (n: string) => out.params.get(n) ?? (out.params.set(n, {}), out.params.get(n)!);
      if ((kind === "param" || kind === "arg") && name) {
        const e = p(name.replace(/^\*+/, ""));
        e.doc = rest;
        cur = { set: (s) => (e.doc = `${e.doc ?? ""}\n${s}`.trim()) };
      } else if (kind === "type" && name) {
        p(name.replace(/^\*+/, "")).type = rest;
        cur = null;
      } else if (kind === "type") {
        out.type = rest;
        cur = null;
      } else if (kind === "rtype") {
        out.rtype = rest;
        cur = null;
      } else {
        out.returns = rest;
        cur = { set: (s) => (out.returns = `${out.returns ?? ""}\n${s}`.trim()) };
      }
      continue;
    }
    if (cur && (/^\s/.test(l) || !l.trim())) {
      if (l.trim()) cur.set(l.trim());
      continue;
    }
    cur = null;
    text.push(l);
  }
  out.text = text.join("\n").replace(/\n{3,}/g, "\n\n").trim();
  return out;
}

/** A Python signature's parameters ("a, b=1, /, *, c=None, **kw"), without self or cls. */
export function readSig(sig: string): { name: string; def?: string; mode: Param["mode"]; rest?: Param["rest"] }[] {
  const parts: string[] = [];
  let depth = 0, cur = "", quote = "";
  for (const c of sig.replace(/^\(|\)$/g, "")) {
    if (quote) {
      cur += c;
      if (c === quote) quote = "";
      continue;
    }
    if (c === "'" || c === '"') quote = c;
    if ("([{".includes(c)) depth++;
    if (")]}".includes(c)) depth--;
    if (c === "," && depth === 0) {
      parts.push(cur.trim());
      cur = "";
    } else cur += c;
  }
  if (cur.trim()) parts.push(cur.trim());
  const out: ReturnType<typeof readSig> = [];
  let mode: Param["mode"] = "any";
  const slash = parts.indexOf("/");
  if (slash >= 0) for (let i = 0; i < slash; i++) parts[i] = `\u0000${parts[i]}`;
  for (const raw of parts) {
    if (raw === "/") continue;
    if (raw === "*") { mode = "kw"; continue; }
    const posonly = raw.startsWith("\u0000");
    const p = raw.replace(/^\u0000/, "");
    const m = /^(\*{0,2})([A-Za-z_]\w*)\s*(?::[^=]*)?(?:=\s*(.*))?$/.exec(p);
    if (!m) continue;
    const [, stars, name, def] = m;
    if (name === "self" || name === "cls") continue;
    if (stars === "*") { out.push({ name, mode: "pos", rest: "args" }); mode = "kw"; continue; }
    if (stars === "**") { out.push({ name, mode: "kw", rest: "kwargs" }); continue; }
    out.push({ name, def, mode: posonly ? "pos" : mode });
  }
  return out;
}

/** A parameter's type from its default, when the docstring gives none. */
export function typeOfDefault(def: string | undefined): string {
  if (def === undefined || def === "None") return "any";
  if (def === "True" || def === "False") return "boolean";
  if (/^-?[\d.]+(e-?\d+)?$/.test(def)) return "number";
  if (/^['"]/.test(def)) return "string";
  if (def === "[]" || def === "()") return "readonly any[]";
  return "any";
}
