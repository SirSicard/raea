// tools/refine.py's findings as types. RNA says modifiers.new() returns a Modifier, nodes.new() a Node and an input a
// NodeSocket; Python gives the subclass the type argument names (a SubsurfModifier, a ShaderNodeBsdfPrincipled) and a
// node's sockets have names and types of their own. So:
//   - each refined call gets an interface from its type argument's values to the classes (rna/_refine.ts), and its
//     signature a generic overload: modifiers.new("Smooth", "SUBSURF") is a Ptr<SubsurfModifier>
//   - each node type's inputs and outputs are typed by name: nodes.new("ShaderNodeBsdfPrincipled").inputs.$["Base Color"]
//     is a Ptr<NodeSocketColor>, with its default_value
import type { Dump } from "./dump";
import { jsdoc } from "./names";

export interface Refined {
  /** the parameter whose value picks the class */
  arg: string;
  /** the interface in rna/_refine.ts from each value to its class */
  iface: string;
}

const ifaceOf = (struct: string, func: string) => `${struct}_${func}_types`;

/** "Struct.func" -> how its result is refined, for the calls refine.py measured. */
export function refinedCalls(d: Dump): Map<string, Refined> {
  return new Map((d.refine?.calls ?? []).map((c) => [`${c.struct}.${c.func}`, { arg: c.arg, iface: ifaceOf(c.struct, c.func) }]));
}

/** rna/_refine.ts: an interface per refined call, each type value to the class Python returns. */
export function emitRefine(d: Dump, structs: Set<string>): string {
  const out: string[] = [];
  for (const c of d.refine?.calls ?? []) {
    const rows = Object.entries(c.map).filter(([, cls]) => structs.has(cls)).sort(([a], [b]) => (a < b ? -1 : 1));
    out.push(`${jsdoc(`What bpy.types.${c.struct}.${c.func}() returns for each ${c.arg} (measured in Blender: tools/refine.py).`, "")}` +
      `export interface ${ifaceOf(c.struct, c.func)} {\n${rows.map(([v, cls]) => `  readonly ${JSON.stringify(v)}: R.${cls};`).join("\n")}\n}\n`);
  }
  return out.join("\n");
}

/** The members a node struct adds: its inputs and outputs typed by socket name (empty for any other struct). */
export function nodeSockets(d: Dump, structs: Set<string>): Map<string, string[]> {
  const by = new Map<string, string[]>();
  const named = (side: "inputs" | "outputs", list: [string, string][]) => {
    if (!list.length) return null;
    const rows = list.map(([name, cls]) => `      readonly ${JSON.stringify(name)}: H.Ptr<R.${structs.has(cls) ? cls : "NodeSocket"}>;`);
    return `  readonly ${side}: R.Node[${JSON.stringify(side)}] & {\n    /** This node's ${side} by name (any other name is a NodeSocket). */\n    readonly $: {\n${rows.join("\n")}\n    };\n  };`;
  };
  for (const n of Object.values(d.refine?.nodes ?? {})) {
    if (!structs.has(n.struct) || by.has(n.struct)) continue;
    const members = [named("inputs", n.in), named("outputs", n.out)].filter((m): m is string => m !== null);
    if (members.length) by.set(n.struct, members);
  }
  return by;
}
