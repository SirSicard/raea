// The modules outside RNA (mathutils' submodules, bmesh, gpu, bpy.utils, bpy.path, bpy.props, bpy_extras, ...) as
// TypeScript, from their docstrings: each module an interface (its functions, classes, submodules and data), each
// class an instance interface and a class interface (its constructor and static methods).
import type { Dump, PyMember } from "./dump";
import { jsdoc, key, modId, type Names } from "./names";
import { pyType } from "./pytype";
import { direct, input, known, pyCallable } from "./rna";
import { readDoc, readSig } from "./sig";

const PYTYPE: Record<string, string> = { str: "string", int: "number", float: "number", bool: "boolean", tuple: "any[]", bytes: "Uint8Array", NoneType: "null", list: "any[]" };

export function registerClasses(d: Dump, n: Names): void {
  for (const [mod, m] of Object.entries(d.modules)) for (const x of m.members) if (x.kind === "class") n.addPyClass(mod, x.id);
}

const isRo = (m: PyMember): boolean => m.ro === true || /read[- ]?only/i.test(m.doc);

function propertyMember(m: PyMember, n: Names, self: string, mod: string): string {
  const d = readDoc(m.doc);
  // no :type:: what its C getter returns (tools/cret.json), else any; a setter takes the same
  const type = d.type ?? m.ret;
  const t = type ? pyType(type, { names: n, role: "out", self, module: mod }) : { ts: "any", kind: "any" as const };
  const get = `${jsdoc(d.text)}  get ${key(m.id)}(): ${direct(t)};`;
  if (isRo(m)) return get;
  const inT = type ? input(pyType(type, { names: n, role: "in", self, module: mod })) : "any";
  return `${get}\n  set ${key(m.id)}(v: ${inT});`;
}

const dataMember = (m: PyMember): string => `${jsdoc(m.doc || (m.value ? `= ${m.value}` : ""))}  readonly ${key(m.id)}: H.Ref<${PYTYPE[m.type ?? ""] ?? "any"}>;`;

/**
 * What a class's `[i]` (`at`) and iteration (`each`) give where its name doesn't say (BMVertSeq's are BMVert's), as
 * Blender 5.2's C gives them. `at` null: its `[]` takes no number (BMVert[layer], IDPropertyGroup["name"] through `$`).
 * gpu.types.Buffer stays any: its item is a number or, in a buffer of more dimensions, a Buffer.
 */
const ELEM = "P.bmesh_types.BMVert | P.bmesh_types.BMEdge | P.bmesh_types.BMFace";
const ITEMS: Record<string, { at: string | null; each: string }> = {
  // bmesh_py_types_select.cc bpy_bmeditselseq_subscript_int: the history's vertex, edge or face
  "bmesh.types.BMEditSelSeq": { at: `H.Ptr<${ELEM}>`, each: ELEM },
  // bmesh_py_types.cc bpy_bmelemseq_subscript_int: BPy_BMElem_CreatePyObject, any element (a face's loops too)
  "bmesh.types.BMElemSeq": { at: `H.Ptr<${ELEM} | P.bmesh_types.BMLoop>`, each: `${ELEM} | P.bmesh_types.BMLoop` },
  // bmesh_py_types_customdata.cc: subscript_int and iter give BMLayerItems
  "bmesh.types.BMLayerCollection": { at: "H.Ptr<P.bmesh_types.BMLayerItem>", each: "P.bmesh_types.BMLayerItem" },
  // bmesh_py_types_meshdata.cc bpy_bmdeformvert_subscript: a vertex group's weight
  "bmesh.types.BMDeformVert": { at: "H.Ref<number>", each: "any" },
  // bmesh_py_types.cc bpy_bmelem_subscript: keyed by a BMLayerItem
  "bmesh.types.BMVert": { at: null, each: "any" },
  "bmesh.types.BMEdge": { at: null, each: "any" },
  "bmesh.types.BMFace": { at: null, each: "any" },
  "bmesh.types.BMLoop": { at: null, each: "any" },
  // idprop_py_api.cc BPy_IDArray_GetItem: float, double, int or bool
  "idprop.types.IDPropertyArray": { at: "H.Ref<number | boolean>", each: "number | boolean" },
  // idprop_py_api.cc: a group is keyed by name (BPy_IDGroup_Map_GetItem), and iterates its keys (BPy_IDGroup_iter)
  "idprop.types.IDPropertyGroup": { at: null, each: "string" },
};

/** A class: its instance interface and its class interface (Name, NameClass). */
function emitClass(c: PyMember, mod: string, n: Names, classes: Set<string>): string {
  const self = n.py.get(`${mod}.${c.id}`)!;
  const inst: string[] = [];
  const stat: string[] = [];
  const ext: string[] = [];
  for (const b of c.bases ?? []) {
    const r = n.pyClass(b);
    const t = r?.("out");
    if (t?.kind === "obj" && t.ts.startsWith("P.")) ext.push(t.ts);
  }
  const elemName = c.id.endsWith("Seq") ? c.id.slice(0, -3) : null;
  const named = elemName && classes.has(elemName) ? elemName : null;
  const items = ITEMS[`${mod}.${c.id}`];
  const at = items ? items.at : named ? `H.Ptr<${named}>` : "any";
  const each = items ? items.each : named ?? "any";
  for (const m of c.members ?? []) {
    if (m.id === "__init__" || m.id === "__len__") continue;
    if (m.id === "__getitem__") {
      if (at) inst.push(`  readonly [index: number]: ${at};`);
      continue;
    }
    if (m.id === "__iter__") {
      ext.push(`AsyncIterable<${each}>`);
      continue;
    }
    if (m.id === "__call__") {
      inst.push(pyCallable(m.id, m.doc, m.sig, n, self, mod, "  ", true, known(m)));
      continue;
    }
    if (m.kind === "property") inst.push(propertyMember(m, n, self, mod));
    else if (m.kind === "method") (m.static ? stat : inst).push(pyCallable(m.id, m.doc, m.sig, n, self, mod, "  ", false, known(m)));
    else if (m.kind === "data") stat.push(dataMember(m));
  }
  const d = readDoc(c.doc);
  const ctor = d.sig !== null || c.sig ? pyCallable(c.id, c.doc, c.sig, n, self, mod, "  ", true).replace(/\): any;/g, `): H.Own<${c.id}>;`) : `  (...args: any[]): H.Own<${c.id}>;`;
  const doc = jsdoc([d.text, `${mod}.${c.id}`].filter(Boolean).join("\n\n"), "");
  const extText = ext.length ? ` extends ${[...new Set(ext)].join(", ")}` : "";
  return `${doc}export interface ${c.id}${extText} {\n${inst.join("\n")}\n}\n${jsdoc(`The class ${mod}.${c.id}: called, a new one.`, "")}export interface ${c.id}Class {\n${[ctor.replace(/\): H\.Own<[^>]+>;/g, `): H.Own<${c.id}>;`), ...stat].join("\n")}\n}\n`;
}

/** bmesh.ops: each operator takes the BMesh and its slots as keyword arguments, and gives a dict of its output slots. */
function bmeshOp(m: PyMember): string {
  const first = m.doc.split("\n")[0];
  const sig = /\((.*)\)/.exec(first)?.[1] ?? "";
  const ret = /->\s*dict\((.*)\)/.exec(m.doc)?.[1] ?? "";
  const ps = readSig(sig).filter((p) => p.name !== "bmesh");
  const ty = (def?: string) => (def === "True" || def === "False" ? "boolean" : /^-?[\d.]+$/.test(def ?? "") ? "number" : def?.startsWith("'") ? "string" : "any");
  const kw = ps.map((p) => `${key(p.name)}?: ${ty(p.def)}`).join("; ");
  const outs = ret ? `\n\nGives: ${ret.split(/,\s*/).map((s) => s.split("=")[0]).join(", ")}.` : "";
  return `${jsdoc(`bmesh.ops.${m.id}${outs}`)}  ${key(m.id)}(bm: P.bmesh_types.BMesh, kw?: { ${kw} }): H.Dict;`;
}

/** One module's file: its interface (Api) and its classes. */
export function emitModule(mod: string, data: { doc: string; members: PyMember[] }, n: Names, all: Set<string>): string {
  const classes = new Set(data.members.filter((m) => m.kind === "class").map((m) => m.id));
  const api: string[] = [];
  const decls: string[] = [];
  for (const m of data.members) {
    if (m.kind === "function") api.push(mod === "bmesh.ops" ? bmeshOp(m) : pyCallable(m.id, m.doc, m.sig, n, undefined, mod, "  ", false, known(m)));
    else if (m.kind === "class") {
      api.push(`${jsdoc(readDoc(m.doc).text.split("\n")[0])}  readonly ${key(m.id)}: ${m.id}Class;`);
      decls.push(emitClass(m, mod, n, classes));
    } else if (m.kind === "module") {
      const sub = `${mod}.${m.id}`;
      api.push(`  readonly ${key(m.id)}: ${all.has(sub) ? `P.${modId(sub)}.Api` : "any"};`);
    } else api.push(dataMember(m));
  }
  const head = `// Generated by tools/gen.sh from Blender's own API (tools/dump.py). Don't edit: regenerate.\n` +
    `import type * as H from "../../types";\nimport type * as M from "../../mathutils";\nimport type * as R from "../rna";\nimport type * as E from "../enums";\nimport type * as P from "../py";\n\n`;
  return `${head}${jsdoc(data.doc || mod, "")}export interface Api {\n${api.join("\n")}\n}\n\n${decls.join("\n")}`;
}

/** bpy_struct: what every RNA struct has (keyframe_insert, path_from_id, custom properties through `$`). */
export function emitBpyStruct(d: Dump, n: Names): string {
  const body: string[] = [
    `  /** Custom properties: Python's ob["key"] (read, set, delete). */\n  readonly $: { [key: string]: any };`,
    `  /** The struct's RNA definition. */\n  readonly bl_rna: H.Own<R.Struct>;\n  readonly rna_type: H.Own<R.Struct>;`,
  ];
  for (const m of d.bpy_struct.members ?? []) {
    if (m.id.startsWith("__")) continue;
    if (m.kind === "property") body.push(propertyMember(m, n, "R.bpy_struct", "bpy.types"));
    else if (m.kind === "method") body.push(pyCallable(m.id, m.doc, m.sig, n, "R.bpy_struct", "bpy.types", "  ", false, known(m)));
  }
  return `${jsdoc("What every Blender struct (bpy.types.bpy_struct) has.", "")}export interface bpy_struct {\n${body.join("\n")}\n}\n`;
}

/** bpy.app: Blender's version, paths and settings, and its handlers, timers, translations and icons. */
export function emitApp(d: Dump, n: Names): string {
  const body: string[] = [];
  const subs: string[] = [];
  for (const m of d.app) {
    if (m.kind === "function") body.push(pyCallable(m.id, m.doc, m.sig, n, undefined, "bpy.app", "  ", false, known(m)));
    else if (m.kind === "module" || m.kind === "class") {
      const inner: string[] = [];
      for (const x of m.members ?? []) {
        if (x.kind === "function" || x.kind === "method") inner.push(pyCallable(x.id, x.doc, x.sig, n, undefined, `bpy.app.${m.id}`, "  ", false, known(x)));
        else inner.push(`${jsdoc(x.doc)}  readonly ${key(x.id)}: any;`);
      }
      const name = `App_${m.id}`;
      subs.push(`${jsdoc(m.doc, "")}export interface ${name} {\n${inner.join("\n")}\n}\n`);
      body.push(`${jsdoc(m.doc.split("\n")[0])}  readonly ${key(m.id)}: ${name};`);
    } else {
      const isStruct = m.value?.startsWith("bpy.app.");
      body.push(`${jsdoc(m.doc)}  readonly ${key(m.id)}: ${isStruct ? "any" : `H.Ref<${PYTYPE[m.type ?? ""] ?? "any"}>`};`);
    }
  }
  return `${jsdoc("bpy.app: the running Blender (its version, paths, settings) and its handlers and timers.", "")}export interface App {\n${body.join("\n")}\n}\n\n${subs.join("\n")}`;
}
