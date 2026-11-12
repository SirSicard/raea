// Reaching a Blender: a headless one started for the script (launch), a running one with raea's add-on (live), one at
// a URL, or the one `raea blender run` started (its native call). Node's modules are taken from
// process.getBuiltinModule, never imported, so raea's own engine (JavaScriptCore or QuickJS, which have none) still bundles this file.
import type { Transport } from "./session";

type Proc = {
  env: Record<string, string | undefined>;
  pid: number;
  platform: string;
  getBuiltinModule?(name: string): any;
  on?(ev: string, f: (...a: unknown[]) => void): void;
};
const proc = (): Proc | undefined => (globalThis as { process?: Proc }).process;
const node = (name: string): any => proc()?.getBuiltinModule?.(name);

export class HttpTransport implements Transport {
  constructor(readonly url: string, readonly token: string) {}
  async send(body: string): Promise<string> {
    const r = await fetch(`${this.url}/rpc`, { method: "POST", headers: { "content-type": "application/json", "x-raea-token": this.token }, body });
    const text = await r.text();
    if (!r.ok) throw new Error(`the bridge answered ${r.status}: ${text}`);
    return text;
  }
}

/** Inside raea's engine (`raea blender run`): the engine posts each batch to the Blender it started. */
export class NativeTransport implements Transport {
  async send(body: string): Promise<string> {
    const call = (globalThis as { __raea_call?: (n: string, j: string) => string }).__raea_call!;
    return call("blender.post", body);
  }
}
export const hasNative = (): boolean => typeof (globalThis as { __raea_call?: unknown }).__raea_call === "function";

export interface LaunchOptions {
  /** The Blender to run; else RAEA_BLENDER, `git config --global raea.blender`, raea's download, the usual places, PATH. */
  blender?: string;
  /** A .blend file to open. */
  file?: string;
  /** Blender's factory settings, no add-ons or preferences of the person's (default true). */
  factoryStartup?: boolean;
  /** More arguments for Blender, before --python. */
  args?: string[];
  /** Blender's own output (its prints, warnings) to this process's stderr (default true). */
  echo?: boolean;
}

export interface Launched {
  transport: HttpTransport;
  pid: number;
  /** asks Blender to quit (after the session closed) and waits for it to exit */
  stop(): Promise<void>;
}

function git(args: string[]): string | null {
  try {
    return String(node("node:child_process").execFileSync("git", args, { stdio: ["ignore", "pipe", "ignore"] })).trim() || null;
  } catch {
    return null;
  }
}

/** The Blender raea would run, and where it was found. */
export function findBlender(): { path: string; from: string } | null {
  const fs = node("node:fs"), path = node("node:path"), os = node("node:os");
  const p = proc();
  if (!fs || !p) return null;
  const is = (f: string | null | undefined): f is string => !!f && fs.existsSync(f) && fs.statSync(f).isFile();
  const win = p.platform === "win32", mac = p.platform === "darwin";
  if (is(p.env.RAEA_BLENDER)) return { path: p.env.RAEA_BLENDER!, from: "RAEA_BLENDER" };
  const configured = git(["config", "--global", "raea.blender"]);
  if (is(configured)) return { path: configured, from: "raea.blender in git config" };
  const own = path.join(os.homedir(), ".raea/tools/blender");
  const ownBin = mac ? path.join(own, "Blender.app/Contents/MacOS/Blender") : path.join(own, win ? "blender.exe" : "blender");
  if (is(ownBin)) return { path: ownBin, from: "raea's download" };
  const places: string[] = [];
  if (mac) places.push("/Applications/Blender.app/Contents/MacOS/Blender", path.join(os.homedir(), "Applications/Blender.app/Contents/MacOS/Blender"));
  if (win) {
    for (const root of [p.env.ProgramFiles, p.env["ProgramFiles(x86)"]].filter(Boolean) as string[]) {
      const base = path.join(root, "Blender Foundation");
      if (!fs.existsSync(base)) continue;
      const dirs = fs.readdirSync(base).filter((d: string) => d.startsWith("Blender")).sort((a: string, b: string) => b.localeCompare(a, undefined, { numeric: true }));
      for (const d of dirs) places.push(path.join(base, d, "blender.exe"));
    }
  }
  if (!mac && !win) places.push("/usr/bin/blender", "/usr/local/bin/blender", "/snap/bin/blender", "/var/lib/flatpak/exports/bin/org.blender.Blender");
  const found = places.find(is);
  if (found) return { path: found, from: "the usual install folder" };
  for (const dir of (p.env.PATH ?? "").split(win ? ";" : ":")) {
    const f = path.join(dir, win ? "blender.exe" : "blender");
    if (is(f)) return { path: f, from: "PATH" };
  }
  return null;
}

const token = (): string => {
  const b = new Uint8Array(16);
  crypto.getRandomValues(b);
  return [...b].map((x) => x.toString(16).padStart(2, "0")).join("");
};

/** The bridge script that ships beside this package's source. */
export function bridgeScript(): string {
  const url = node("node:url");
  return url.fileURLToPath(new URL("../python/headless.py", import.meta.url));
}

/** Starts a headless Blender serving this process; resolves once its bridge is listening. */
export async function launch(o: LaunchOptions = {}): Promise<Launched> {
  const cp = node("node:child_process");
  const p = proc();
  if (!cp || !p) throw new Error("raea/blender: starting Blender needs Node, Bun or Deno; inside raea, run the script with `raea blender run SCRIPT.ts`");
  const bin = o.blender ?? findBlender()?.path;
  if (!bin) throw new Error("raea/blender: no Blender found: `raea setup blender` finds or downloads one (or set RAEA_BLENDER)");
  const tok = token();
  const args = ["--background", ...(o.factoryStartup === false ? [] : ["--factory-startup"]), ...(o.file ? [o.file] : []), ...(o.args ?? []), "--python-exit-code", "1", "--python", bridgeScript()];
  const child = cp.spawn(bin, args, {
    env: { ...p.env, RAEA_BLENDER_TOKEN: tok, RAEA_BLENDER_PORT: "0", RAEA_BLENDER_PARENT: String(p.pid) },
    stdio: ["ignore", "pipe", "pipe"],
  });
  const echo = o.echo !== false;
  const early: string[] = [];
  let exited: Promise<number | null>;
  const port = await new Promise<number>((resolve, reject) => {
    let ready = false, buf = "";
    exited = new Promise((done) => child.on("exit", (code: number | null) => done(code)));
    child.on("error", (e: Error) => reject(new Error(`raea/blender: couldn't start ${bin}: ${e.message}`)));
    child.stdout.on("data", (d: Uint8Array) => {
      buf += String(d);
      let nl;
      while ((nl = buf.indexOf("\n")) >= 0) {
        const line = buf.slice(0, nl);
        buf = buf.slice(nl + 1);
        const m = /^RAEA_BLENDER_READY (.*)$/.exec(line.trim());
        if (m && !ready) {
          ready = true;
          resolve(JSON.parse(m[1]).port);
        } else if (!ready) early.push(line);
        else if (echo && !/^Blender (quit|\d+\.\d+)/.test(line.trim())) node("node:process").stderr.write(line + "\n");
      }
    });
    child.stderr.on("data", (d: Uint8Array) => {
      if (!ready) early.push(String(d));
      else if (echo) node("node:process").stderr.write(d);
    });
    void exited.then((code) => {
      if (!ready) reject(new Error(`raea/blender: Blender exited (${code}) before its bridge started:\n${early.join("\n").slice(-2000)}`));
    });
  });
  const transport = new HttpTransport(`http://127.0.0.1:${port}`, tok);
  // a script that ends without closing still leaves no Blender behind
  p.on?.("exit", () => {
    try { child.kill(); } catch { /* already gone */ }
  });
  child.unref?.();
  child.stdout.unref?.();
  child.stderr.unref?.();
  return {
    transport,
    pid: child.pid,
    async stop() {
      try {
        await transport.send(JSON.stringify({ sid: "launcher", ops: [{ o: "quit" }] }));
      } catch {
        child.kill();
      }
      const t = setTimeout(() => child.kill(), 10_000);
      await exited;
      clearTimeout(t);
    },
  };
}

/** The Blender running with raea's add-on on this machine (~/.raea/blender/live.json), if one is. */
export function liveBridge(): HttpTransport | null {
  const fs = node("node:fs"), path = node("node:path"), os = node("node:os");
  const p = proc();
  if (!fs || !p) return null;
  const file = path.join(p.env.RAEA_HOME ?? path.join(os.homedir(), ".raea"), "blender", "live.json");
  if (!fs.existsSync(file)) return null;
  const live = JSON.parse(fs.readFileSync(file, "utf8")) as { port: number; token: string; pid: number };
  try {
    node("node:process").kill(live.pid, 0);
  } catch {
    return null;
  }
  return new HttpTransport(`http://127.0.0.1:${live.port}`, live.token);
}

export const envOf = (name: string): string | undefined => proc()?.env?.[name];
