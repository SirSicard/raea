// The shapes the generated API (src/gen) is built from: how a value in Blender looks from TypeScript. A property path
// is lazy: reading `ob.location.x` sends nothing, awaiting it reads, assigning to it sets. So a property's getter is a
// Ref (or a Ptr, for an object), and its setter takes the plain value, or another path (`a.x = b.x` copies in Blender).
import type { Color, Euler, Matrix, Quaternion, Vector } from "./mathutils";
import type { PyBytes, PyDict, TypedArray } from "./wire";

/** A value read from Blender when awaited. */
export type Ref<T> = PromiseLike<T>;
/** A value to pass to Blender: the value, or a path to one in Blender (read there, with no round trip). */
export type In<T> = T | Ref<T>;

/** A Blender object at a path, or a call's result: usable at once (its properties, its methods); awaited, the object
 * itself (a reference that stays the same object), or null for an empty pointer (Python's None). */
export type Ptr<T> = T & PromiseLike<T | null>;
/** As Ptr, for a pointer that is never empty. */
export type Own<T> = T & PromiseLike<T>;

/** The mathutils values Blender gives (an object's location, its matrix_world). */
export type MathValue = Vector | Matrix | Quaternion | Euler | Color;
type Operators = "add" | "sub" | "mul" | "div" | "matmul" | "neg" | "equals" | "toString" | "toJSON" | "read" | "write";
type RemoteKey<T> = Exclude<keyof T, `_${string}` | symbol | Operators>;
/** What a member of a value in Blender gives: a path to read, or (for a mathutils value) a value in Blender. */
export type Out<T> = [T] extends [MathValue] ? Remote<T> : Ref<T>;
/** A mathutils value in Blender: awaited, a local copy (Vector, Matrix, ...); its members are Blender's own, so
 * `ob.location.x = 1` sets it there and `ob.matrix_world.to_euler()` is computed there. */
export type Remote<T> = PromiseLike<T> & {
  -readonly [K in RemoteKey<T>]: T[K] extends (...a: infer A) => infer R ? (...a: A) => Out<R> : Out<T[K]> | T[K];
};

/** An array property (bpy_prop_array): awaited, its values; an index reads or sets one. */
export type Arr<T> = PromiseLike<T[]> & { [index: number]: Ref<T> | T };
/** A two-dimensional array property (bound_box): awaited, its rows. */
export type Arr2<T> = PromiseLike<T[][]> & { readonly [index: number]: Arr<T> };

/** A sequence of Blender objects (a context list, a tuple a property gives): awaited, the objects; an index is one
 * of them; `for await` walks them. */
export type Seq<T> = PromiseLike<T[]> & { readonly [index: number]: Ptr<T> } & AsyncIterable<T>;

/** A collection (bpy_prop_collection): items by index (coll[0]) or by name (coll.$["Cube"]), `for await`, and what
 * every collection has; a collection with its own functions (objects.new) is this and its RNA type. */
export interface Coll<T> extends AsyncIterable<T> {
  readonly [index: number]: Ptr<T>;
  /** Items by name: Python's coll["Cube"]. */
  readonly $: { readonly [name: string]: Ptr<T> };
  /** The item with this name, or the fallback (None). */
  get(key: string, fallback?: unknown): Ptr<T>;
  keys(): Ref<string[]>;
  values(): Ref<T[]>;
  items(): Ref<[string, T][]>;
  /** The index of the item with this name, or -1. */
  find(key: string): Ref<number>;
  /** Every item's `attr` into `seq` (a typed array is filled in place when awaited). */
  foreach_get(attr: string, seq: TypedArray | number[]): Ref<void>;
  /** Every item's `attr` from `seq`. */
  foreach_set(attr: string, seq: TypedArray | readonly number[] | readonly boolean[]): Ref<void>;
  /** The type this collection holds. */
  readonly bl_rna: Own<any>;
  readonly rna_type: Own<any>;
  readonly id_data: Ptr<any>;
  path_from_id(): Ref<string>;
}

/** A Python dict a call returns (bmesh.ops results): awaited, a Map; `.$["geom"]` reads one key in Blender. */
export type Dict<T = any> = PromiseLike<Map<string, T>> & { readonly $: { readonly [key: string]: Ref<T> & any } };

/** Bytes for Blender: a Uint8Array, or py.bytes(...) where Python must get bytes (not a buffer). */
export type Bytes = Uint8Array | PyBytes;
/** A dict for Blender: a Map, or py.dict(...) (a plain object as a call's last argument is keyword arguments). */
export type DictIn<V> = Map<string, V> | PyDict;

/** A Python object raea has no type for: anything goes. */
export type PyAny = any;

/** An operator's result: the states its execution ended in. */
export type OpResult = Set<"RUNNING_MODAL" | "CANCELLED" | "FINISHED" | "PASS_THROUGH" | "INTERFACE">;
/** How an operator runs: bpy.ops.x.y("INVOKE_DEFAULT") shows its dialog, as a button would. */
export type ExecContext =
  | "INVOKE_DEFAULT" | "INVOKE_REGION_WIN" | "INVOKE_REGION_CHANNELS" | "INVOKE_REGION_PREVIEW" | "INVOKE_AREA"
  | "INVOKE_SCREEN" | "EXEC_DEFAULT" | "EXEC_REGION_WIN" | "EXEC_REGION_CHANNELS" | "EXEC_REGION_PREVIEW"
  | "EXEC_AREA" | "EXEC_SCREEN";
/** An operator: called with its properties as keyword arguments, and an execution context (and undo) before them. */
export interface Operator<K> {
  (kw?: K): Ref<OpResult>;
  (context: ExecContext, kw?: K): Ref<OpResult>;
  (context: ExecContext, undo: boolean, kw?: K): Ref<OpResult>;
  /** Whether it can run in the current context. */
  poll(context?: ExecContext): Ref<boolean>;
  /** Its id as Python names it (MESH_OT_primitive_cube_add). */
  idname(): Ref<string>;
  /** Its id as bpy.ops names it (mesh.primitive_cube_add). */
  idname_py(): Ref<string>;
  get_rna_type(): Own<any>;
  readonly bl_options: Ref<Set<string>>;
}
