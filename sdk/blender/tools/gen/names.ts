// What a generated file can name: RNA structs (R.Object), Python classes outside RNA (P.bmesh_types.BMVert),
// mathutils (M.Vector), enums shared by many properties (E.UILayoutIcon), and the helpers in src/types.ts (H.Ptr).
import type { Dump, Item } from "./dump";
import type { Ty } from "./pytype";

const RESERVED = new Set(
  ("break case catch class const continue debugger default delete do else enum export extends false finally for function if " +
    "import in instanceof new null return super switch this throw true try typeof var void while with yield let static " +
    "implements interface package private protected public await arguments eval").split(" "),
);
/** A member name, quoted if it isn't an identifier (or is `new`, which unquoted would be a construct signature). */
export const key = (id: string): string => (/^[A-Za-z_$][\w$]*$/.test(id) && id !== "new" ? id : JSON.stringify(id));
/** A parameter name (a reserved word gets an underscore). */
export const param = (id: string): string => (RESERVED.has(id) ? `${id}_` : id.replace(/\W/g, "_"));
export const modId = (mod: string): string => mod.replace(/\./g, "_");
const pascal = (s: string): string => s.split(/[_\W]+/).filter(Boolean).map((w) => w[0].toUpperCase() + w.slice(1)).join("");

/** A JSDoc comment from text (blank lines kept as paragraph breaks), indented. */
export function jsdoc(text: string | undefined, indent = "  "): string {
  const t = (text ?? "").replace(/\*\//g, "*\\/").replace(/\r/g, "").trim();
  if (!t) return "";
  const lines = t.split("\n").map((l) => l.trimEnd());
  if (lines.length === 1) return `${indent}/** ${lines[0]} */\n`;
  return `${indent}/**\n${lines.map((l) => `${indent} *${l ? " " + l : ""}`).join("\n")}\n${indent} */\n`;
}

const MATH: Record<string, [string, string]> = {
  Vector: ["M.Vector", "M.VectorLike"],
  Matrix: ["M.Matrix", "M.MatrixLike"],
  Quaternion: ["M.Quaternion", "M.QuaternionLike"],
  Euler: ["M.Euler", "M.Euler | readonly number[]"],
  Color: ["M.Color", "M.Color | readonly number[]"],
};

export class Names {
  readonly rna = new Set<string>();
  /** Python class name (module.Class) -> its TypeScript reference */
  readonly py = new Map<string, string>();
  /** bare class name -> qualified names */
  readonly bare = new Map<string, string[]>();
  /** enum aliases: items' key -> name, and name -> its declaration */
  readonly enumByKey = new Map<string, string>();
  readonly enums = new Map<string, string>();

  constructor(d: Dump) {
    for (const s of d.structs) this.rna.add(s.id);
  }

  addPyClass(mod: string, name: string): void {
    const q = `${mod}.${name}`;
    this.py.set(q, `P.${modId(mod)}.${name}`);
    this.bare.set(name, [...(this.bare.get(name) ?? []), q]);
  }

  /** A class a docstring names, as a type for one role; null when raea has no type for it. */
  pyClass(name: string, module?: string): ((role: "in" | "out") => Ty) | null {
    const n = name.replace(/^~/, "").replace(/\(.*$/, "");
    const short = n.replace(/^mathutils\./, "");
    if (MATH[short]) return (role) => (role === "in" ? { ts: MATH[short][1], kind: "val" } : { ts: MATH[short][0], kind: "math" });
    // views of custom properties cross as lists (python/raea_blender/codec.py)
    const view = /IDPropertyGroupView(Keys|Values|Items)$/.exec(n)?.[1];
    if (view) return () => ({ ts: view === "Keys" ? "string[]" : view === "Values" ? "any[]" : "[string, any][]", kind: "val" });
    const rnaName = n.replace(/^bpy\.types\./, "");
    if (this.rna.has(rnaName) || rnaName === "bpy_struct") return () => ({ ts: `R.${rnaName}`, kind: "obj" });
    if (rnaName === "bpy_prop_collection") return () => ({ ts: "H.Coll<any>", kind: "obj" });
    const q = this.py.get(n) ?? (module ? this.py.get(`${module}.${n}`) : undefined);
    if (q) return () => ({ ts: q, kind: "obj" });
    const tail = n.split(".").pop()!;
    const found = this.bare.get(tail);
    if (found?.length === 1) return () => ({ ts: this.py.get(found[0])!, kind: "obj" });
    if (this.rna.has(tail)) return () => ({ ts: `R.${tail}`, kind: "obj" });
    return null;
  }

  /** An enum's items as a TypeScript type: inline when short, else a shared alias (E.Name) named after its first owner. */
  enumType(items: Item[], owner: string, prop: string): string {
    if (!items.length) return "string";
    const union = items.map(([id]) => JSON.stringify(id)).join(" | ");
    if (items.length <= 6) return union;
    const k = items.map(([id]) => id).join("\u0001");
    let name = this.enumByKey.get(k);
    if (!name) {
      const base = pascal(owner) + pascal(prop);
      name = base;
      for (let i = 2; this.enums.has(name); i++) name = `${base}${i}`;
      this.enumByKey.set(k, name);
      const docs = items.length <= 80 ? items.map(([id, nm, de]) => `- \`${id}\`: ${nm}${de ? ` (${de})` : ""}`).join("\n") : "";
      this.enums.set(name, `${jsdoc(docs, "")}export type ${name} =\n  | ${items.map(([id]) => JSON.stringify(id)).join("\n  | ")};\n`);
    }
    return `E.${name}`;
  }
}

/** Enum items as doc lines for a property whose type is inline. */
export function enumDoc(items: Item[] | undefined): string {
  if (!items || items.length > 6 || !items.some(([, n, d]) => n || d)) return "";
  return "\n" + items.map(([id, nm, de]) => `- \`${id}\`: ${nm}${de ? ` (${de})` : ""}`).join("\n");
}
