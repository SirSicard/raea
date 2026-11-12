// A session with one Blender: operations queue in the order the script makes them and go to the bridge in batches,
// one batch at a time, so Blender runs them in order. Writes and calls don't wait for an answer; a read (await) is the
// one that waits, and it waits for everything before it. A failure stops the script as a Python exception would:
// what came after it is not run, and the next await (or close) throws it.
import { dec, enc, fillBack, isPlain, Kw, type TypedArray } from "./wire";
import { infoOf, proxy, type Expr, type Step } from "./proxy";

export interface Transport {
  /** One batch's JSON in, the bridge's JSON reply out. */
  send(body: string): Promise<string>;
}

/** An exception raised in Blender's Python, with its type and where it came from. */
export class BlenderError extends Error {
  readonly type: string;
  readonly pythonTrace: string;
  constructor(e: { type: string; msg: string; trace?: string }) {
    super(`${e.type}: ${e.msg}`);
    this.name = "BlenderError";
    this.type = e.type;
    this.pythonTrace = e.trace ?? "";
  }
}

interface Pending {
  op: Record<string, unknown>;
  ok?: (v: unknown) => void;
  fail?: (e: unknown) => void;
  /** turns the raw reply into the value (default: decoded) */
  read?: (raw: unknown) => unknown;
  /** sent even after a failure (leaving a context manager, closing) */
  always?: boolean;
  /** an answer asked for internally: its failure still counts as unseen until someone awaits it */
  weak?: { seen: boolean };
}

let sessions = 0;
const random = (): string => {
  const c = (globalThis as { crypto?: { getRandomValues(a: Uint8Array): Uint8Array } }).crypto;
  const b = new Uint8Array(8);
  if (c) c.getRandomValues(b);
  else for (let i = 0; i < 8; i++) b[i] = Math.floor(Math.random() * 256);
  return [...b].map((x) => x.toString(16).padStart(2, "0")).join("");
};

export class Session {
  readonly id = `ts-${random()}-${++sessions}`;
  #connect: () => Promise<Transport>;
  #transport: Promise<Transport> | null = null;
  #queue: Pending[] = [];
  #busy = false;
  #scheduled = false;
  #failure: Error | null = null;
  #slots = 0;
  #frees: number[] = [];
  #anchors = new Map<number, WeakRef<object>>();
  #registry: FinalizationRegistry<number> | null;
  #depth = 0;
  closed = false;

  constructor(connect: Transport | (() => Promise<Transport>)) {
    this.#connect = typeof connect === "function" ? connect : async () => connect;
    const FR = (globalThis as { FinalizationRegistry?: typeof FinalizationRegistry }).FinalizationRegistry;
    this.#registry = FR
      ? new FR<number>((id) => {
          if (this.#anchors.get(id)?.deref() === undefined) this.#anchors.delete(id);
          if (!this.closed) {
            this.#frees.push(id);
            this.#kick();
          }
        })
      : null;
  }

  /** The transport, connecting the first time it's needed. */
  transport(): Promise<Transport> {
    return (this.#transport ??= this.#connect());
  }

  // ---- proxies ----
  /** A proxy for a module (bpy, bmesh, mathutils.geometry, any importable name). */
  module(name: string): unknown {
    return proxy(this, { r: name, p: [] }, null, true);
  }
  /** @internal a reference Python sent: a proxy that holds it (not awaitable: it is the object) */
  ref(id: number): unknown {
    return proxy(this, { r: id, p: [] }, this.#anchor(id), false);
  }
  #anchor(id: number): object {
    const have = this.#anchors.get(id)?.deref();
    if (have) return have;
    const a = { id };
    const WR = (globalThis as { WeakRef?: typeof WeakRef }).WeakRef;
    if (WR) this.#anchors.set(id, new WR(a));
    this.#registry?.register(a, id);
    return a;
  }
  #slot(): { id: number; anchor: object } {
    const id = ++this.#slots;
    return { id, anchor: this.#anchor(id) };
  }

  // ---- the operations a proxy makes ----
  /** @internal */
  get(x: Expr): Promise<unknown> {
    return this.push({ o: "get", x }, true)!;
  }
  /** @internal */
  set(x: Expr, k: Step, value: unknown): void {
    this.push({ o: "set", x, k, v: this.encode(value).v });
  }
  /** @internal */
  del(x: Expr, k: Step): void {
    this.push({ o: "del", x, k });
  }
  /** @internal a call: sent now, its result kept in a slot; the proxy returned stands for that result */
  call(f: Expr, args: unknown[]): unknown {
    let kw: Record<string, unknown> | undefined;
    const pos = args.slice();
    while (pos.length && pos[pos.length - 1] === undefined) pos.pop();
    const last = pos[pos.length - 1];
    if (last instanceof Kw) {
      kw = last.args;
      pos.pop();
    } else if (isPlain(last)) {
      kw = last;
      pos.pop();
    }
    const bufs: TypedArray[] = [];
    const ctx = { proxy: (v: unknown) => this.#wire(v), bufs };
    const a = pos.map((x) => enc(x, ctx));
    const k = kw ? Object.fromEntries(Object.entries(kw).filter(([, x]) => x !== undefined).map(([n, x]) => [n, enc(x, ctx)])) : undefined;
    const slot = this.#slot();
    const op: Record<string, unknown> = { o: "call", f, a, s: slot.id };
    if (k) op.k = k;
    let result: Promise<unknown> | undefined;
    if (bufs.length) {
      // foreach_get and friends write into the buffers passed: ask for them back and copy them into the caller's arrays
      const weak = { seen: false };
      result = this.push(op, true, {
        weak,
        read: (raw) => {
          const r = raw as { v: unknown; b?: unknown[] };
          (r.b ?? []).forEach((w, i) => bufs[i] && fillBack(bufs[i], w));
          return dec(r.v, this);
        },
      });
      result?.catch(() => {});
      return proxy(this, { r: slot.id, p: [] }, slot.anchor, true, () => {
        weak.seen = true;
        return result!;
      });
    }
    this.push(op);
    return proxy(this, { r: slot.id, p: [] }, slot.anchor, true);
  }
  /** @internal the object at a path kept in a slot: a stable handle, no round trip */
  pin(x: Expr): unknown {
    const slot = this.#slot();
    this.push({ o: "pin", x, s: slot.id });
    return proxy(this, { r: slot.id, p: [] }, slot.anchor, false);
  }
  /** @internal Python source run in Blender (an expression's value, else the variable `result`) */
  exec(code: string, vars?: Record<string, unknown>): unknown {
    const slot = this.#slot();
    const v = vars ? Object.fromEntries(Object.entries(vars).map(([n, x]) => [n, this.encode(x).v])) : undefined;
    this.push({ o: "exec", code, vars: v, s: slot.id });
    return proxy(this, { r: slot.id, p: [] }, slot.anchor, true);
  }
  /** @internal enter a context manager; its value as a proxy */
  enter(x: Expr): unknown {
    const slot = this.#slot();
    this.#depth++;
    this.push({ o: "enter", x, s: slot.id });
    return proxy(this, { r: slot.id, p: [] }, slot.anchor, false);
  }
  /** @internal leave the innermost context manager (sent even after a failure) */
  exit(error?: unknown): Promise<unknown> {
    const d = this.#depth--;
    const op: Record<string, unknown> = { o: "exit", d };
    if (error !== undefined) op.err = error instanceof Error ? error.message : String(error);
    return this.push(op, true, { always: true })!;
  }

  /** Waits until everything sent so far has run; throws the first failure nobody awaited yet. */
  flush(): Promise<void> {
    return this.push({ o: "get", x: { r: "builtins", p: [[".", "None"]] } }, true) as Promise<void>;
  }
  /** Flushes, then ends the session (its references are released in Blender). Throws a failure nobody saw. */
  async close(): Promise<void> {
    if (this.closed) return;
    try {
      await this.flush();
    } finally {
      const done = this.push({ o: "close" }, true, { always: true });
      this.closed = true;
      await done?.catch(() => {});
    }
  }
  /** A failure no await has seen yet, if any (it is cleared: the caller reports it). */
  takeFailure(): Error | null {
    const f = this.#failure;
    this.#failure = null;
    return f;
  }

  /** @internal a value for the wire */
  encode(v: unknown): { v: unknown; bufs: TypedArray[] } {
    const bufs: TypedArray[] = [];
    return { v: enc(v, { proxy: (x) => this.#wire(x), bufs }), bufs };
  }
  #wire(v: unknown): unknown {
    const i = infoOf(v);
    if (!i) return undefined;
    if (i.s !== this) throw new TypeError("raea/blender: a value from one Blender session was passed to another");
    return i.x.p.length === 0 && typeof i.x.r === "number" ? { $ref: i.x.r } : { $x: i.x };
  }

  // ---- the queue ----
  /** @internal */
  push(op: Record<string, unknown>, want = false, opts: Omit<Pending, "op" | "ok" | "fail"> = {}): Promise<unknown> | undefined {
    if (this.closed && !opts.always) throw new Error("raea/blender: this Blender session is closed");
    if (this.#failure && !opts.always) {
      // the script stopped at the failure: this never runs; an await gets the failure
      if (!want) return undefined;
      const f = this.#failure;
      this.#failure = null;
      return Promise.reject(f);
    }
    const p: Pending = { op, ...opts };
    const promise = want ? new Promise<unknown>((ok, fail) => ((p.ok = ok), (p.fail = fail))) : undefined;
    this.#queue.push(p);
    this.#kick();
    return promise;
  }
  #kick(): void {
    if (this.#scheduled || this.#busy) return;
    this.#scheduled = true;
    // a microtask (Promise, not queueMicrotask: raea's JavaScriptCore and QuickJS contexts have no web globals)
    void Promise.resolve().then(() => {
      this.#scheduled = false;
      void this.#pump();
    });
  }
  async #pump(): Promise<void> {
    if (this.#busy) return;
    this.#busy = true;
    try {
      while (this.#queue.length || (this.#frees.length && !this.closed)) {
        const batch = this.#queue.splice(0);
        // frees go last: an op queued before its proxy was collected still names the slot (the read an await queues
        // while its call is in Blender), and `always` sends them again after a batch that fails before them
        if (this.#frees.length && !this.closed) batch.push({ op: { o: "free", ids: this.#frees.splice(0) }, always: true });
        await this.#send(batch);
      }
    } finally {
      this.#busy = false;
    }
  }
  async #send(batch: Pending[]): Promise<void> {
    const ops = batch.map((p) => (p.ok ? { ...p.op, w: 1 } : p.op));
    let reply: { r?: Record<string, unknown>; n?: number; err?: { i: number; type: string; msg: string; trace?: string } };
    try {
      const t = await this.transport();
      reply = JSON.parse(await t.send(JSON.stringify({ sid: this.id, ops })));
    } catch (e) {
      const err = e instanceof Error ? e : new Error(String(e));
      this.#fail(new Error(`raea/blender: lost the bridge to Blender (${err.message})`, { cause: err }), batch, []);
      return;
    }
    const n = reply.n ?? 0;
    for (let i = 0; i < n; i++) {
      const p = batch[i];
      if (!p.ok) continue;
      try {
        const raw = reply.r?.[String(i)];
        p.ok(p.read ? p.read(raw) : dec(raw, this));
      } catch (e) {
        p.fail?.(e);
      }
    }
    if (reply.err) this.#fail(new BlenderError(reply.err), batch.slice(n), batch.slice(n + 1).filter((p) => p.always));
  }
  /** A failure: every operation from the failed one on (and all queued since) is not run; the first await told. */
  #fail(err: Error, notRun: Pending[], resend: Pending[]): void {
    let told = false;
    const later = this.#queue.splice(0);
    for (const p of [...notRun, ...later]) {
      if (p.always && later.includes(p)) continue;
      if (p.fail && !resend.includes(p)) {
        p.fail(err);
        if (!p.weak || p.weak.seen) told = true;
      }
    }
    this.#queue.unshift(...resend, ...later.filter((p) => p.always));
    if (!told) this.#failure = err;
    if (this.#queue.length) this.#kick();
  }
}

export type { Expr, Step };
