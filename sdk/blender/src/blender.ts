// A Blender to script: its bpy, bmesh and mathutils, its Python builtins (py), and how the session ends.
import { routeConsole } from "./console";
import * as local from "./mathutils";
import { hasNative, HttpTransport, launch, liveBridge, NativeTransport, envOf, type LaunchOptions } from "./launch";
import { makePy, type Py } from "./py";
import { Session, type Transport } from "./session";
import type { Bpy, Bmesh, BpyExtras, Gpu, MathutilsModules } from "./gen/modules";

/** mathutils: the classes computed here (Vector, Matrix, ...), the submodules Blender computes (geometry, ...). */
export type Mathutils = typeof local & MathutilsModules;

export interface ConnectOptions {
  /** A bridge's address (http://127.0.0.1:PORT) and token; else RAEA_BLENDER_URL and RAEA_BLENDER_TOKEN. */
  url?: string;
  token?: string;
  /** The Blender running with raea's add-on on this machine, instead of starting one. */
  live?: boolean;
}

export class Blender {
  readonly session: Session;
  /** bpy: data, context, ops, types, utils, path, app, props, msgbus. */
  readonly bpy: Bpy;
  readonly bmesh: Bmesh;
  readonly mathutils: Mathutils;
  readonly bpy_extras: BpyExtras;
  readonly gpu: Gpu;
  /** Python's builtins and statements: len, in, isinstance, with, exec, ... */
  readonly py: Py;
  #stop: (() => Promise<void>) | null;

  constructor(transport: Transport | (() => Promise<Transport>), stop?: () => Promise<void>) {
    this.session = new Session(transport);
    this.#stop = stop ?? null;
    this.bpy = this.session.module("bpy") as Bpy;
    this.bmesh = this.session.module("bmesh") as Bmesh;
    this.bpy_extras = this.session.module("bpy_extras") as BpyExtras;
    this.gpu = this.session.module("gpu") as Gpu;
    const remote = (n: string) => this.session.module(`mathutils.${n}`);
    this.mathutils = Object.freeze({
      ...local,
      geometry: remote("geometry"),
      noise: remote("noise"),
      bvhtree: remote("bvhtree"),
      kdtree: remote("kdtree"),
      interpolate: remote("interpolate"),
    }) as unknown as Mathutils;
    this.py = makePy(this.session);
  }

  /** Any Python module in Blender, by import name. */
  module<T = any>(name: string): T {
    return this.session.module(name) as T;
  }
  /** Waits for everything sent so far; throws a failure nobody awaited. */
  flush(): Promise<void> {
    return this.session.flush();
  }
  /** Ends the session, and quits Blender if this session started it. Throws a failure nobody awaited. */
  async close(): Promise<void> {
    try {
      await this.session.close();
    } finally {
      const stop = this.#stop;
      this.#stop = null;
      await stop?.();
    }
  }
}

/** A headless Blender started for this script (Node, Bun or Deno). */
export async function start(o: LaunchOptions = {}): Promise<Blender> {
  const l = await launch(o);
  return new Blender(l.transport, l.stop);
}

/** A Blender already serving raea/blender: one at an address, or the person's own with the add-on (live). */
export async function connect(o: ConnectOptions = {}): Promise<Blender> {
  if (o.live) {
    const t = liveBridge();
    if (!t) throw new Error("raea/blender: no running Blender with raea's add-on (raea setup blender installs it; ~/.raea/blender/live.json)");
    return new Blender(t);
  }
  const url = o.url ?? envOf("RAEA_BLENDER_URL");
  const token = o.token ?? envOf("RAEA_BLENDER_TOKEN");
  if (url && token) return new Blender(new HttpTransport(url.replace(/\/$/, ""), token));
  if (hasNative()) return new Blender(new NativeTransport());
  throw new Error("raea/blender: connect() needs a url and token (or RAEA_BLENDER_URL/RAEA_BLENDER_TOKEN), or live: true");
}

/** The script's own Blender, behind `bpy`, `bmesh`, `py` and the rest exported from raea/blender: the one
 * `raea blender run` started, a bridge in RAEA_BLENDER_URL, the live one when RAEA_BLENDER=live, else a headless
 * Blender started on first use and quit when the script ends. */
function auto(): Blender {
  let stop: (() => Promise<void>) | undefined;
  const b = new Blender(
    async () => {
      if (hasNative()) return new NativeTransport();
      const url = envOf("RAEA_BLENDER_URL"), token = envOf("RAEA_BLENDER_TOKEN");
      if (url && token) return new HttpTransport(url.replace(/\/$/, ""), token);
      if (envOf("RAEA_BLENDER") === "live") {
        const t = liveBridge();
        if (!t) throw new Error("RAEA_BLENDER=live: no running Blender with raea's add-on");
        return t;
      }
      const l = await launch();
      stop = l.stop;
      endWithProcess(b, () => stop?.());
      return l.transport;
    },
    async () => stop?.(),
  );
  // `raea blender run`'s entry calls this when the script is done: the session closes, and a failure the script never
  // awaited is thrown there (Node and Bun get the same from endWithProcess)
  (globalThis as { __raea_blender_end?: () => Promise<void> }).__raea_blender_end = () => b.close();
  return b;
}

/** When the script's work is done (the event loop is empty), the session closes and a failure nobody awaited is
 * printed and fails the process, as an uncaught Python exception would. */
function endWithProcess(b: Blender, stop: () => Promise<void> | undefined): void {
  const p = (globalThis as { process?: { on(e: string, f: () => void): void; exitCode?: number } }).process;
  if (!p) return;
  let done = false;
  p.on("beforeExit", () => {
    if (done) return;
    done = true;
    void b.close().catch((e: unknown) => {
      console.error(e instanceof Error && e.name === "BlenderError" ? `${e.message}\n${(e as { pythonTrace?: string }).pythonTrace ?? ""}` : e);
      p.exitCode = 1;
      return stop();
    });
  });
}

routeConsole();
export const blender: Blender = auto();
