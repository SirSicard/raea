// The proxy that stands for a Python object or a path to one. Reading a property makes a longer path (nothing is sent);
// awaiting a path reads its value; assigning to one sets it; calling one calls it (sent at once, in order); a numeric
// key is an index (coll[0]); `$` is the string-key view (obj.$["prop"], coll.$["Cube"]), Python's obj["key"].
import type { Session } from "./session";

export type Step = readonly [".", string] | readonly ["[]", unknown];
export interface Expr {
  /** a module name, or a reference (slot or Python-side id) */
  readonly r: string | number;
  readonly p: readonly Step[];
}
interface Info {
  s: Session;
  x: Expr;
  /** keeps the reference alive while any proxy built on it is */
  a: object | null;
  /** awaitable (a path or a call's result), or the object itself (a reference) */
  t: boolean;
  /** what awaiting gives, when it isn't a plain read (a call that writes into buffers) */
  then?: () => Promise<unknown>;
}

const BY_TARGET = new WeakMap<object, Info>();
const BY_PROXY = new WeakMap<object, Info>();
const INSPECT = Symbol.for("nodejs.util.inspect.custom");

export const infoOf = (v: unknown): Info | undefined => (typeof v === "function" ? BY_PROXY.get(v) : undefined);

export function describe(x: Expr): string {
  let s = typeof x.r === "string" ? x.r : `<${x.r}>`;
  for (const [k, key] of x.p) s += k === "." ? `.${key}` : `[${JSON.stringify(key)}]`;
  return s;
}

function key(k: string): Step {
  return /^-?\d+$/.test(k) ? ["[]", Number(k)] : [".", k];
}
const longer = (i: Info, s: Step): unknown => proxy(i.s, { r: i.x.r, p: [...i.x.p, s] }, i.a, true);

const handler: ProxyHandler<object> = {
  get(t, k) {
    const i = BY_TARGET.get(t)!;
    if (typeof k === "symbol") {
      if (k === Symbol.asyncIterator) return () => iterate(i);
      if (k === Symbol.toPrimitive) return () => `[Blender ${describe(i.x)}]`;
      if (k === INSPECT) return () => `[Blender ${describe(i.x)}]`;
      if (k === Symbol.toStringTag) return "Blender";
      return undefined;
    }
    switch (k) {
      case "then":
        if (!i.t) return undefined;
        return (ok: (v: unknown) => unknown, fail: (e: unknown) => unknown) => (i.then ? i.then() : i.s.get(i.x)).then(ok, fail);
      case "$":
        return items(i);
      case "toString":
        return () => `[Blender ${describe(i.x)}]`;
      case "toJSON":
        return () => `[Blender ${describe(i.x)}]`;
    }
    return longer(i, key(k));
  },
  set(t, k, v) {
    if (typeof k === "symbol") return false;
    const i = BY_TARGET.get(t)!;
    i.s.set(i.x, key(k), v);
    return true;
  },
  deleteProperty(t, k) {
    if (typeof k === "symbol") return false;
    const i = BY_TARGET.get(t)!;
    i.s.del(i.x, key(k));
    return true;
  },
  apply(t, _this, args) {
    const i = BY_TARGET.get(t)!;
    return i.s.call(i.x, args);
  },
  has() {
    return false;
  },
  ownKeys() {
    return [];
  },
  getOwnPropertyDescriptor() {
    return undefined;
  },
};

export function proxy(s: Session, x: Expr, anchor: object | null, thenable: boolean, then?: () => Promise<unknown>): unknown {
  const target = (() => {}) as unknown as object;
  const info: Info = { s, x, a: anchor, t: thenable, then };
  BY_TARGET.set(target, info);
  const p = new Proxy(target, handler);
  BY_PROXY.set(p, info);
  return p;
}

function items(i: Info): unknown {
  return new Proxy(
    {},
    {
      get(_t, k) {
        if (typeof k === "symbol") return undefined;
        return longer(i, ["[]", k]);
      },
      set(_t, k, v) {
        if (typeof k === "symbol") return false;
        i.s.set(i.x, ["[]", k], v);
        return true;
      },
      deleteProperty(_t, k) {
        if (typeof k === "symbol") return false;
        i.s.del(i.x, ["[]", k]);
        return true;
      },
    },
  );
}

async function* iterate(i: Info): AsyncGenerator<unknown> {
  const list = i.s.module("builtins") as { list(x: unknown): PromiseLike<unknown[]> };
  const self = proxy(i.s, i.x, i.a, false);
  for (const x of await list.list(self)) yield x;
}
