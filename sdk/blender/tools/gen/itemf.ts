// BL34: the enums whose items Blender works out at the time, from an item function (Curve.fill_mode: the 3D items on
// a 3D curve, NONE and BOTH on a 2D one). Python can't tell them apart: with no context, Blender gives an enum's static
// items and never calls its item function. Blender's own source does: makesrna attaches one with
// RNA_def_property_enum_funcs(prop, get, set, "rna_..._itemf"). This reads those calls and writes tools/itemf.json, a list
// of `Struct.prop` and `Struct.func(param)`, which gen/main.ts types as their static items or any string.
//   bun tools/gen/itemf.ts MAKESRNA_INTERN_DIR VERSION OUT.json      (tools/itemf.sh fetches the dir for a Blender)
// Each call is placed on the struct being defined where it is. A helper that defines properties on a struct its caller
// passes in takes its caller's struct: a define("Base", "Struct", helper) entry, or the struct current where it's called.
// Helpers whose struct is a name built at run time (the node socket interfaces) stay unresolved and are listed: their
// enums have one item or none in the dump, which gen already types as any string.
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const [dir, version, out] = process.argv.slice(2);
if (!dir || !version || !out) throw new Error("usage: bun tools/gen/itemf.ts MAKESRNA_INTERN_DIR VERSION OUT.json");

const strip = (s: string) => s.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/[^\n]*/g, "");
const files = readdirSync(dir).filter((f) => /^rna_.*\.cc$/.test(f)).map((f) => strip(readFileSync(join(dir, f), "utf8")));

// in order, per file: a C function's start, a struct, an RNA function, an enum property or parameter, and its funcs call
const EV = new RegExp(
  [
    String.raw`^(?!\s)(?:[\w:<>]+[\s*]+)+(\w+)\s*\(`, // a function at column 0, whatever it returns
    String.raw`RNA_def_struct\(\s*\w+\s*,\s*"(\w+)"`,
    String.raw`RNA_def_function\(\s*\w+\s*,\s*"(\w+)"`,
    String.raw`RNA_def_(?:property\(\s*(\w+)\s*,\s*"(\w+)"\s*,\s*PROP_ENUM|enum(?:_flag)?\(\s*(\w+)\s*,\s*"(\w+)")`,
    String.raw`RNA_def_property_enum_funcs\(\s*\w+\s*,\s*[^,]+,\s*[^,]+,\s*([^)]+)\)`,
  ].join("|"),
  "gm",
);

const found = new Set<string>();
const pending = new Map<string, string[]>(); // helper -> what it defines with an item function, struct left out
for (const src of files) {
  let fn = "", struct: string | null = null, func: string | null = null, prop: string | null = null;
  for (const m of src.matchAll(EV)) {
    if (m[1]) [fn, struct, func, prop] = [m[1], null, null, null];
    else if (m[2]) [struct, func] = [m[2], null];
    else if (m[3]) func = m[3];
    else if (m[5] || m[7]) {
      const owner = m[4] ?? m[6];
      const id = m[5] ?? m[7];
      // a parameter when it's defined on the RNA function (`func`), else a property of the struct
      prop = owner === "func" && func ? `${func}(${id})` : id;
    } else if (m[8] && prop && !/^(nullptr|NULL)$/.test(m[8].trim())) {
      if (struct) found.add(`${struct}.${prop}`);
      else pending.set(fn, [...(pending.get(fn) ?? []), prop]);
    }
  }
}

// helpers placed on their callers' structs
const helpers = [...pending.keys()];
const resolved = new Set<string>();
if (helpers.length) {
  const alt = helpers.join("|");
  const CALL = new RegExp(
    String.raw`^(?!\s)(?:[\w:<>]+[\s*]+)+\w+\s*\(|RNA_def_struct\(\s*\w+\s*,\s*"(\w+)"|define\(\s*"\w+"\s*,\s*"(\w+)"\s*,\s*(${alt})\s*\)|\b(${alt})\s*\(`,
    "gm",
  );
  for (const src of files) {
    let struct: string | null = null;
    for (const m of src.matchAll(CALL)) {
      const [at, helper] = m[2] ? [m[2], m[3]] : m[4] ? [struct, m[4]] : [null, null];
      if (m[1]) struct = m[1];
      else if (!m[2] && !m[4]) struct = null;
      if (!at || !helper) continue;
      for (const p of pending.get(helper)!) found.add(`${at}.${p}`);
      resolved.add(helper);
    }
  }
}
const unresolved = helpers.filter((h) => !resolved.has(h)).map((h) => ({ helper: h, props: pending.get(h)! }));
writeFileSync(out, JSON.stringify({ blender: version, itemf: [...found].sort(), unresolved }, null, 1) + "\n");
console.log(`itemf: Blender ${version}: ${found.size} enums with an item function, ${unresolved.length} helpers unresolved -> ${out}`);
