// BL22: what Blender's C methods and properties return where their docstrings don't say (bmesh, gpu, aud, mathutils'
// submodules, idprop, imbuf, bpy's own): read from the bindings' C source, since Python can't read a C function's
// source. Each is given as the Python type its every return gives: None (Py_RETURN_NONE), bool (Py_RETURN_TRUE,
// PyBool_FromLong), int (PyLong_From*), float (PyFloat_FromDouble), str (PyUnicode_From*), or what a Py_BuildValue
// format makes ("f", "(fff)": tuple[float, float, float]); an error's nullptr gives nothing back, and any other
// return leaves it unknown. Methods are bound by name in PyMethodDef tables, properties in PyGetSetDef tables; a name
// is given for a family of bindings only when every C function bound to it there agrees. Writes tools/cret.json, which
// gen/main.ts reads.
//   bun tools/gen/cret.ts SRC_ROOT VERSION OUT.json      (SRC_ROOT: a Blender checkout; tools/cret.sh fetches one and runs this)
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const [root, version, out] = process.argv.slice(2);
if (!root || !version || !out) throw new Error("usage: bun tools/gen/cret.ts SRC_ROOT VERSION OUT.json");

// each family's sources (gen/main.ts maps a Python module to one by its first name)
const FAMILIES: Record<string, string> = {
  bmesh: "source/blender/python/bmesh",
  gpu: "source/blender/python/gpu",
  mathutils: "source/blender/python/mathutils",
  generic: "source/blender/python/generic",
  bpy: "source/blender/python/intern",
  aud: "extern/audaspace/bindings/python",
};

const strip = (s: string) => s.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/[^\n]*/g, "");
const sources = (dir: string): string[] =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) return sources(p);
    return /\.(cc|cpp|c)$/.test(f) ? [strip(readFileSync(p, "utf8"))] : [];
  });

const UNKNOWN = "?";
// a Py_BuildValue format's one value: f/d a float, the integer codes an int, s/U a str
const FORMAT: Record<string, string> = { f: "float", d: "float", i: "int", b: "int", h: "int", l: "int", n: "int", I: "int", k: "int", K: "int", L: "int", H: "int", B: "int", s: "str", U: "str" };
function built(format: string): string {
  const f = format.replace(/\s/g, "");
  const tuple = /^\((\w+)\)$/.exec(f);
  if (tuple) {
    const items = [...tuple[1]].map((c) => FORMAT[c] ?? UNKNOWN);
    return items.includes(UNKNOWN) ? UNKNOWN : `tuple[${items.join(", ")}]`;
  }
  return f.length === 1 ? (FORMAT[f] ?? UNKNOWN) : UNKNOWN;
}
// what one `return` gives: a Python type, "" for an error's nullptr, or UNKNOWN
function value(v: string): string {
  if (/^(Py_None|Py_NewRef\(Py_None\))$/.test(v)) return "None";
  if (/^(PyBool_From(Long|Bool)\(|Py_(True|False)$|Py_NewRef\(Py_(True|False)\)$)/.test(v)) return "bool";
  if (/^PyFloat_FromDouble\(/.test(v)) return "float";
  if (/^PyLong_From\w+\(/.test(v)) return "int";
  if (/^PyUnicode_From(String|Format)\(/.test(v)) return "str";
  const b = /^Py_BuildValue\(\s*"([^"]*)"/.exec(v);
  if (b) return built(b[1]);
  return /^(nullptr|NULL|0)?$/.test(v) ? "" : UNKNOWN;
}
// a C function's body: the one type all its returns give
const BODY = /^(?:static\s+)?PyObject\s*\*\s*(\w+)\s*\(([^)]*)\)\s*\{([\s\S]*?)^\}/gm;
const RET = /\bPy_RETURN_(NONE|TRUE|FALSE)\b|\breturn\b([^;]*);/g;
function kindOf(params: string, body: string): string {
  const kinds = new Set<string>();
  for (const m of body.matchAll(RET)) {
    const v = (m[2] ?? "").trim();
    const k = m[1] ? (m[1] === "NONE" ? "None" : "bool") : /^\w+$/.test(v) && value(v) === UNKNOWN ? local(params, body, v) : value(v);
    if (k) kinds.add(k);
  }
  return kinds.size === 1 ? [...kinds][0] : UNKNOWN;
}
// a local the function returns (`ret = Py_None;` ... `return ret;`, libraries.write): what all its assignments give;
// unknown for a parameter, or one whose address is passed (something else may set it)
function local(params: string, body: string, name: string): string {
  if (new RegExp(`\\b${name}\\b`).test(params) || new RegExp(`&\\s*${name}\\b`).test(body)) return UNKNOWN;
  const kinds = new Set<string>();
  for (const a of body.matchAll(new RegExp(`(?<![\\w.>])${name}\\s*=(?!=)\\s*([^;]*);`, "g"))) kinds.add(value(a[1].trim()));
  kinds.delete(""); // nullptr: an error
  return kinds.size === 1 ? [...kinds][0] : UNKNOWN;
}
// a method or property entry, in a table or a definition of its own: the Python name, the C function (the getter),
// however it's cast (gpu.types.GPUShaderCreateInfo's `(PyCFunction)(void *)(name)` too), and the rest, where a method
// has its METH_ flags; any other entry is taken as a property's (a name some other kind of table also has only
// disagrees, and is left unknown)
const ENTRY = /\{\s*(?:\(char\s*\*\)\s*)?"(\w+)"\s*,\s*(?:\w+_cast<[^>]+>\(\s*(\w+)\s*\)|\(\s*\w+\s*\)\s*(?:\(\s*void\s*\*\s*\)\s*)?\(?\s*(\w+)\s*\)?|(\w+))([^}]*)\}/g;

type Family = { methods: Record<string, string>; getters: Record<string, string> };
const result: Record<string, Family> = {};
for (const [family, dir] of Object.entries(FAMILIES)) {
  const files = sources(join(root, dir));
  const kinds = new Map<string, string>();
  for (const src of files) for (const m of src.matchAll(BODY)) kinds.set(m[1], kindOf(m[2], m[3]));
  const methods = new Map<string, Set<string>>();
  const getters = new Map<string, Set<string>>();
  for (const src of files) {
    for (const m of src.matchAll(ENTRY)) {
      const byName = /\bMETH_/.test(m[5]) ? methods : getters;
      const k = kinds.get(m[2] ?? m[3] ?? m[4]) ?? UNKNOWN; // a C function we can't read: unknown
      byName.set(m[1], (byName.get(m[1]) ?? new Set()).add(k));
    }
  }
  const agreed = (byName: Map<string, Set<string>>) =>
    Object.fromEntries([...byName].filter(([, ks]) => ks.size === 1 && !ks.has(UNKNOWN)).map(([n, ks]) => [n, [...ks][0]]).sort(([a], [b]) => (a < b ? -1 : 1)));
  result[family] = { methods: agreed(methods), getters: agreed(getters) };
}
writeFileSync(out, JSON.stringify({ blender: version, families: result }, null, 1) + "\n");
const count = (k: keyof Family) => Object.values(result).reduce((s, f) => s + Object.keys(f[k]).length, 0);
console.log(`cret: Blender ${version}: ${count("methods")} method names and ${count("getters")} property names typed -> ${out}`);
