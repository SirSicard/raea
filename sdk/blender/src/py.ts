// Python's builtins and statements, for what a TypeScript expression can't say: len(x), x in y, isinstance, with,
// del, a dict or tuple argument, keyword arguments, Python source. Each reads Blender, so each is awaited.
import type { Session } from "./session";
import { Kw, PyBytes, PyDict, PyTuple } from "./wire";
import { infoOf, type Expr } from "./proxy";

/** A value read from Blender when awaited. */
export type Ref<T> = PromiseLike<T>;

function expr(v: unknown, what: string): Expr {
  const i = infoOf(v);
  if (!i) throw new TypeError(`${what}: expects a Blender value (a proxy from bpy, bmesh, ...)`);
  return i.x;
}

export interface Py {
  /** len(x) */
  len(x: unknown): Ref<number>;
  /** list(x): a collection's items, a sequence's values */
  list<T = unknown>(x: unknown): Ref<T[]>;
  /** `item in container` */
  contains(container: unknown, item: unknown): Ref<boolean>;
  /** `x is None`, for a pointer that may be empty */
  isNone(x: unknown): Ref<boolean>;
  isinstance(x: unknown, cls: unknown): Ref<boolean>;
  issubclass(cls: unknown, base: unknown): Ref<boolean>;
  hasattr(x: unknown, name: string): Ref<boolean>;
  getattr<T = unknown>(x: unknown, name: string, fallback?: T): Ref<T>;
  setattr(x: unknown, name: string, value: unknown): void;
  delattr(x: unknown, name: string): void;
  dir(x: unknown): Ref<string[]>;
  str(x: unknown): Ref<string>;
  repr(x: unknown): Ref<string>;
  /** type(x).__name__ (an RNA struct's identifier for bpy values) */
  typeName(x: unknown): Ref<string>;
  bool(x: unknown): Ref<boolean>;
  sorted<T = unknown>(x: unknown): Ref<T[]>;
  /** A Python module by its import name (addon_utils, bpy_extras.io_utils, json, ...). */
  module<T = any>(name: string): T;
  /** Python source, run in Blender with `vars` as its globals (and bpy): an expression's value, else `result`'s. */
  exec<T = unknown>(code: string, vars?: Record<string, unknown>): Ref<T>;
  /** A stable handle to the object a path names now (a renamed object stays the same handle), with no round trip. */
  pin<T>(x: T): T;
  /** with cm as value: the body runs inside the context manager (bpy.context.temp_override(...), ...). */
  with<T, R>(cm: T, body: (value: any) => R | Promise<R>): Promise<R>;
  /** Keyword arguments, explicitly: f(a, py.kw({ x: 1 })). A plain object as the last argument is the same. */
  kw(args: Record<string, unknown>): Kw;
  /** A dict argument (a plain object as a call's last argument would be keyword arguments instead). */
  dict(entries: Record<string, unknown> | Iterable<[unknown, unknown]>): PyDict;
  tuple(...items: unknown[]): PyTuple;
  bytes(data: Uint8Array): PyBytes;
  /** Waits until everything sent so far has run. */
  flush(): Promise<void>;
}

export function makePy(s: Session): Py {
  const b = s.module("builtins") as Record<string, (...a: unknown[]) => PromiseLike<any>>;
  const op = s.module("operator") as Record<string, (...a: unknown[]) => PromiseLike<any>>;
  return {
    len: (x) => b.len(x),
    list: (x) => b.list(x),
    contains: (c, x) => op.contains(c, x),
    isNone: (x) => op.is_(x, null),
    isinstance: (x, c) => b.isinstance(x, c),
    issubclass: (c, base) => b.issubclass(c, base),
    hasattr: (x, n) => b.hasattr(x, n),
    getattr: (x, n, f) => (f === undefined ? b.getattr(x, n) : b.getattr(x, n, f)),
    setattr: (x, n, v) => void b.setattr(x, n, v),
    delattr: (x, n) => void b.delattr(x, n),
    dir: (x) => b.dir(x),
    str: (x) => b.str(x),
    repr: (x) => b.repr(x),
    typeName: (x) => (b.type(x) as unknown as { __name__: PromiseLike<string> }).__name__,
    bool: (x) => b.bool(x),
    sorted: (x) => b.sorted(x),
    module: (name) => s.module(name) as any,
    exec: (code, vars) => s.exec(code, vars) as PromiseLike<any>,
    pin: (x) => s.pin(expr(x, "py.pin")) as typeof x,
    with: async (cm, body) => {
      const value = s.enter(expr(cm, "py.with"));
      let r;
      try {
        r = await body(value);
        await s.flush();
      } catch (e) {
        await s.exit(e).catch(() => {});
        throw e;
      }
      await s.exit();
      return r;
    },
    kw: (args) => new Kw(args),
    dict: (entries) => new PyDict(entries),
    tuple: (...items) => new PyTuple(items),
    bytes: (data) => new PyBytes(data),
    flush: () => s.flush(),
  };
}
