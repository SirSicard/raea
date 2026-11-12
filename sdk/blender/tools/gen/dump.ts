// The shape of tools/dump.py's output: Blender's Python API as data.
export type Item = [id: string, name: string, desc: string];

export interface Prop {
  id: string;
  type: "boolean" | "int" | "float" | "string" | "enum" | "pointer" | "collection";
  name?: string;
  desc?: string;
  /** a pointer's or collection's struct */
  fixed?: string;
  /** a collection's own struct (its new/remove) */
  srna?: string;
  len?: number;
  dims?: number[];
  dyn?: boolean;
  subtype?: string;
  ro?: boolean;
  never_none?: boolean;
  required?: boolean;
  optional?: boolean;
  items?: Item[];
  flag?: boolean;
  dynamic?: boolean;
  /** BL34: items Blender works out at the time, by an item function (tools/itemf.json): its static items or any string */
  itemf?: boolean;
  min?: number;
  max?: number;
  default?: string | unknown[];
  deprecated?: string[];
}

export interface Func {
  id: string;
  desc: string;
  cls: boolean;
  args: Prop[];
  ret: Prop[];
}

export interface PyMember {
  id: string;
  kind: "module" | "class" | "function" | "method" | "property" | "data";
  doc: string;
  sig?: string | null;
  static?: boolean;
  /** written in Python (dump.py written): what it returns is read from its source, never from tools/cret.json */
  py?: boolean;
  /** gives None: written in Python and returns no value anywhere (dump.py returns_none), or C (tools/cret.json) */
  none?: boolean;
  /** the Python type its C source returns, a method's or a property's, where its docstring doesn't say (tools/cret.json) */
  ret?: string;
  ro?: boolean;
  type?: string;
  value?: string;
  bases?: string[];
  members?: PyMember[];
}

export interface Struct {
  id: string;
  base: string | null;
  name: string;
  desc: string;
  props: Prop[];
  funcs: Func[];
  nested?: string;
  /** ret: what the getter's own source returns (tools/returns.py), where its docstring has no :type: */
  pyprops?: { id: string; doc: string; ro: boolean; ret?: string }[];
  pyfuncs?: { id: string; sig: string | null; doc: string; static: boolean; py?: boolean; none?: boolean; ret?: string }[];
  cfuncs?: { id: string; doc: string; none?: boolean; ret?: string }[];
}

export interface Op {
  mod: string;
  name: string;
  desc: string;
  args: Prop[];
}

export interface Dump {
  blender: string;
  version_string: string;
  structs: Struct[];
  ops: Op[];
  modules: Record<string, { doc: string; members: PyMember[] }>;
  context: string[];
  bpy_struct: PyMember;
  bpy_prop_collection: PyMember;
  bpy_prop_array: PyMember;
  bpy_func: PyMember | null;
  app: PyMember[];
  refine?: Refine;
}

/** tools/refine.py: what refined calls return per type value, and each node type's sockets ([name, socket class]). */
export interface Refine {
  calls: { struct: string; func: string; arg: string; map: Record<string, string> }[];
  nodes: Record<string, { struct: string; in: [string, string][]; out: [string, string][] }>;
}
