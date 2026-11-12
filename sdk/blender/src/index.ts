// raea/blender: Blender's Python API from TypeScript. `bpy`, `bmesh`, `mathutils`, `bpy_extras`, `gpu` and `py` are
// the script's own Blender (raea blender run's, or a headless one started on first use); start() and connect() make
// more. Reads are awaited; writes and calls are sent in order without waiting (see README.md).
import { blender } from "./blender";

export { Blender, blender, connect, start, type ConnectOptions, type Mathutils } from "./blender";
export { findBlender, type LaunchOptions } from "./launch";
export { BlenderError, Session, type Transport } from "./session";
export { type Py, type Ref } from "./py";
export { Kw, PyBytes, PyDict, PyTuple } from "./wire";
export * as local from "./mathutils";
export { Color, Euler, Matrix, Quaternion, Vector } from "./mathutils";
/** bpy.types as types (types.Mesh, types.SubsurfModifier), and what a path to one is (Ptr), for a script's own signatures and casts. */
export type * as types from "./gen/rna";
export type { Coll, In, Own, Ptr } from "./types";

export const bpy = blender.bpy;
export const bmesh = blender.bmesh;
export const mathutils = blender.mathutils;
export const bpy_extras = blender.bpy_extras;
export const gpu = blender.gpu;
export const py = blender.py;
