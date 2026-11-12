// RNA (bpy.types) as TypeScript: each struct an interface whose properties are lazy paths (a getter that reads when
// awaited, a setter that sets in Blender), whose functions call Blender, with what Python adds on top (_bpy_types.py:
// Object.children, Mesh.from_pydata) read from docstrings.
import type { Dump, Prop, Struct } from "./dump";
import { enumDoc, jsdoc, key, type Names } from "./names";
import { pyType, type Ty } from "./pytype";
import { nodeSockets, refinedCalls } from "./refine";
import { overloads, readDoc, readSig, typeOfDefault, type Param } from "./sig";

const VEC = new Set(["TRANSLATION", "DIRECTION", "VELOCITY", "ACCELERATION", "XYZ", "XYZ_LENGTH", "COORDINATES", "COORDS"]);

/** The mathutils class Blender gives for a float array (bpy_rna.cc's pyrna_math_object_from_array), or null. */
export function mathOf(p: Prop): "Vector" | "Matrix" | "Euler" | "Quaternion" | "Color" | null {
  if (p.type !== "float" || !p.len) return null;
  const st = p.subtype ?? "";
  if (VEC.has(st) && p.len >= 2 && p.len <= 4 && !p.dims) return "Vector";
  if (st === "MATRIX" && (p.len === 16 || p.len === 9) && p.dims) return "Matrix";
  if ((st === "EULER" || st === "QUATERNION") && p.len === 3) return "Euler";
  if ((st === "EULER" || st === "QUATERNION") && p.len === 4) return "Quaternion";
  if ((st === "COLOR" || st === "COLOR_GAMMA") && p.len === 3) return "Color";
  return null;
}
const MATH_IN = { Vector: "M.VectorLike", Matrix: "M.MatrixLike", Euler: "M.Euler | readonly number[]", Quaternion: "M.QuaternionLike", Color: "M.Color | readonly number[]" };

/** A property's value as TypeScript: what awaiting it gives ("out"), or what it takes ("in"). */
export function propTy(p: Prop, n: Names, owner: string, role: "in" | "out"): Ty {
  switch (p.type) {
    case "boolean":
    case "int":
    case "float": {
      const base = p.type === "boolean" ? "boolean" : "number";
      const m = mathOf(p);
      if (m) return role === "in" ? { ts: MATH_IN[m], kind: "val" } : { ts: `M.${m}`, kind: "math" };
      if (p.len || p.dyn) {
        const two = (p.dims?.length ?? 0) > 1;
        if (role === "in") return { ts: two ? `readonly (readonly ${base}[])[]` : `readonly ${base}[]`, kind: "val" };
        return { ts: two ? `${base}[][]` : `${base}[]`, kind: "val" };
      }
      return { ts: base, kind: "val" };
    }
    case "string":
      return { ts: "string", kind: "val" };
    case "enum": {
      // an item function's enum (BL34) takes its static items or whatever else Blender gives at the time
      const u = p.dynamic || !p.items?.length ? "string" : n.enumType(p.items, owner, p.id) + (p.itemf ? " | (string & {})" : "");
      return { ts: p.flag ? `Set<${u}>` : u, kind: "val" };
    }
    case "pointer": {
      if (!p.fixed || !n.rna.has(p.fixed)) return { ts: "any", kind: "any" };
      const nullable = !p.never_none && !p.required;
      return { ts: role === "in" && nullable ? `R.${p.fixed} | null` : `R.${p.fixed}`, kind: "obj", nullable };
    }
    case "collection": {
      if (role === "in") return { ts: "readonly Record<string, any>[]", kind: "val" };
      const item = p.fixed && n.rna.has(p.fixed) ? `R.${p.fixed}` : "any";
      return { ts: `H.Coll<${item}>${p.srna && n.rna.has(p.srna) ? ` & R.${p.srna}` : ""}`, kind: "obj" };
    }
  }
  return { ts: "any", kind: "any" };
}

/** What a path to a value of this type is: a Ptr for an object, a Remote for a mathutils value, else a Ref. */
export function direct(t: Ty, p?: Prop): string {
  switch (t.kind) {
    case "obj":
      return t.nullable === false || p?.type === "collection" ? `H.Own<${t.ts}>` : `H.Ptr<${t.ts.replace(/ \| null$/, "")}>`;
    case "math":
      return `H.Remote<${t.ts}>`;
    case "seq":
      return `H.Seq<${t.elem}>`;
    case "void":
      return "H.Ref<void>";
    case "any":
      return "any";
  }
  if (p && (p.len || p.dyn) && !mathOf(p) && p.type !== "string") {
    const base = p.type === "boolean" ? "boolean" : "number";
    return (p.dims?.length ?? 0) > 1 ? `H.Arr2<${base}>` : `H.Arr<${base}>`;
  }
  return `H.Ref<${t.ts}>`;
}

/** An argument's type: the value, or a path to one. */
export const input = (t: Ty): string => (t.kind === "val" || t.kind === "math" ? `H.In<${t.ts}>` : t.ts);

function propDoc(p: Prop): string {
  const bits = [p.desc ?? p.name ?? ""];
  if (p.min !== undefined || p.max !== undefined) bits.push(`Range: ${p.min ?? "-inf"} to ${p.max ?? "inf"}.`);
  if (p.default !== undefined && p.type !== "pointer" && p.type !== "collection") bits.push(`Default: ${Array.isArray(p.default) ? `[${p.default.join(", ")}]` : p.default}.`);
  if (p.deprecated) bits.push(`@deprecated ${p.deprecated.join(" ")}`);
  return bits.filter(Boolean).join(" ") + enumDoc(p.type === "enum" ? p.items : undefined);
}

function propMember(p: Prop, n: Names, owner: string): string {
  const out = propTy(p, n, owner, "out");
  const doc = jsdoc(propDoc(p));
  if (p.type === "collection") return `${doc}  readonly ${key(p.id)}: ${direct(out, p)};`;
  const get = `${doc}  get ${key(p.id)}(): ${direct(out, p)};`;
  if (p.ro) return get;
  return `${get}\n  set ${key(p.id)}(v: ${input(propTy(p, n, owner, "in"))});`;
}

/** An RNA function's parameters: required ones positional, the rest positional or keyword, as Python takes them. */
export function rnaParams(args: Prop[], n: Names, owner: string): Param[] {
  return args.map((a) => ({
    name: a.id,
    ty: input(propTy(a, n, owner, "in")),
    opt: !a.required,
    mode: "any",
    doc: [a.desc, enumDoc(a.type === "enum" ? a.items : undefined)].filter(Boolean).join(""),
  }));
}

export function rnaReturn(ret: Prop[], n: Names, owner: string): string {
  if (!ret.length) return "H.Ref<void>";
  if (ret.length === 1) return direct(propTy(ret[0], n, owner, "out"), ret[0]);
  return `H.Ref<[${ret.map((r) => {
    const t = propTy(r, n, owner, "out");
    return t.kind === "obj" && t.nullable ? `${t.ts} | null` : t.ts;
  }).join(", ")}]>`;
}

/** A member Python adds to a struct, from its docstring. */
function pyMembers(s: Struct, n: Names, skip: Set<string>): string[] {
  const self = `R.${s.id}`;
  const out: string[] = [];
  for (const p of s.pyprops ?? []) {
    if (skip.has(p.id)) continue;
    const d = readDoc(p.doc);
    // no :type:: what the getter's own source returns (tools/returns.py), else any
    const type = d.type ?? p.ret;
    const t = type ? pyType(type, { names: n, role: "out", self }) : { ts: "any", kind: "any" as const };
    const get = `${jsdoc(d.text)}  get ${key(p.id)}(): ${direct(t)};`;
    out.push(p.ro ? get : `${get}\n  set ${key(p.id)}(v: ${type ? input(pyType(type, { names: n, role: "in", self })) : "any"});`);
  }
  for (const f of [...(s.pyfuncs ?? []), ...(s.cfuncs ?? []).map((c) => ({ ...c, sig: null, static: false }))]) {
    if (skip.has(f.id)) continue;
    out.push(pyCallable(f.id, f.doc, f.sig, n, self, undefined, "  ", false, known(f)));
  }
  return out;
}

/** What a function gives where its docstring doesn't say, read from its source: None (dump.py returns_none, or C), or
 * the Python type its C source returns (tools/cret.json). */
export type Known = string | undefined;
export const known = (m: { none?: boolean; ret?: string }): Known => (m.none ? "None" : m.ret);

/** A Python function or method's overloads, from its docstring (its `.. method::` line, :param:, :type:, :rtype:). */
export function pyCallable(name: string, doc: string, sig: string | null | undefined, n: Names, self?: string, module?: string, indent = "  ", call = false, kr?: Known): string {
  const d = readDoc(doc);
  const s = d.sig ?? (sig ? sig : null);
  const where = (role: "in" | "out") => ({ names: n, role, self, module });
  const ps: Param[] = s
    ? readSig(s).map((p) => {
        const info = d.params.get(p.name);
        const ty = info?.type ? input(pyType(info.type, where("in"))) : typeOfDefault(p.def);
        return { name: p.name, ty, opt: p.def !== undefined, mode: p.mode, rest: p.rest, doc: info?.doc };
      })
    : [{ name: "args", ty: "any", opt: true, mode: "pos", rest: "args" }, { name: "kwargs", ty: "any", opt: true, mode: "kw", rest: "kwargs" }];
  // no :rtype:: what its source shows, if it shows (Python's by dump.py returns_none, C's by tools/cret.json), else any
  const ret = d.rtype ? direct(pyType(d.rtype, where("out"))) : kr === "None" ? "H.Ref<void>" : kr ? direct(pyType(kr, where("out"))) : "any";
  const text = [d.text, d.returns ? `@returns ${d.returns}` : ""].filter(Boolean).join("\n");
  return overloads(name, ps, ret, text, indent, call);
}

export interface Emitted {
  id: string;
  text: string;
}

/** Every struct as an interface; srna structs (a collection's own functions) don't extend bpy_struct, so a
 * collection's `$` stays its items by name. */
export function emitStructs(d: Dump, n: Names): Emitted[] {
  const by = new Map(d.structs.map((s) => [s.id, s]));
  const srna = new Set(d.structs.flatMap((s) => s.props.filter((p) => p.srna).map((p) => p.srna!)));
  const base = new Set(d.bpy_struct.members?.map((m) => m.id) ?? []);
  const names = (s: Struct): string[] => [
    ...s.props.map((p) => p.id), ...s.funcs.map((f) => f.id),
    ...(s.pyprops ?? []).map((p) => p.id), ...(s.pyfuncs ?? []).map((p) => p.id), ...(s.cfuncs ?? []).map((p) => p.id),
  ];
  const refined = refinedCalls(d);
  const sockets = nodeSockets(d, new Set(by.keys()));
  return d.structs.map((s) => {
    const inherited = new Set<string>(srna.has(s.id) && !s.base ? [] : base);
    for (let b = s.base ? by.get(s.base) : undefined; b; b = b.base ? by.get(b.base) : undefined) for (const x of names(b)) inherited.add(x);
    const ext = s.base ? ` extends R.${s.base}` : srna.has(s.id) ? "" : " extends R.bpy_struct";
    const body: string[] = [];
    for (const p of s.props) if (!inherited.has(p.id) && p.id !== "rna_type") body.push(propMember(p, n, s.id));
    // a property wins over a callback of its name (RenderEngine.render: its RenderSettings, and the render() an engine defines)
    for (const p of s.props) inherited.add(p.id);
    for (const f of s.funcs) {
      if (inherited.has(f.id)) continue;
      inherited.add(f.id);
      const ps = rnaParams(f.args, n, s.id);
      // the class Python returns for the type asked for, then RNA's own signature for any other value
      const r = refined.get(`${s.id}.${f.id}`);
      if (r && ps.some((p) => p.name === r.arg)) {
        const typed = ps.map((p) => (p.name === r.arg ? { ...p, ty: "K" } : p));
        body.push(overloads(f.id, typed, `H.Ptr<R.${r.iface}[K]>`, f.desc, "  ", false, `<K extends keyof R.${r.iface}>`));
      }
      body.push(overloads(f.id, ps, rnaReturn(f.ret, n, s.id), f.desc));
    }
    body.push(...(sockets.get(s.id) ?? []));
    body.push(...pyMembers(s, n, inherited));
    const doc = jsdoc([s.desc, `bpy.types.${s.id}${s.nested ? ` (in ${s.nested})` : ""}`].filter(Boolean).join("\n\n"), "");
    return { id: s.id, text: `${doc}export interface ${s.id}${ext} {\n${body.join("\n")}\n}\n` };
  });
}
