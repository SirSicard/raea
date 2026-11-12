// The raea cloud client (docs/cloud.feature CL11): raea and an ACP agent on a server of your own, from any TypeScript
// with fetch and WebSocket (Node 22+, Bun, a browser).
//
//   const cloud = new RaeaCloud({ url: "https://raea.example.com", token: process.env.RAEA_CLOUD_TOKEN })
//   await cloud.health()                                  // {raea, agent, agents, workspace}
//   await cloud.write("card/edit.tsx", source)            // into the workspace
//   await cloud.run(["render", "edit.tsx", "-o", "card.mp4"], { cwd: "card" })
//   const s = await cloud.session()                       // the default agent, over ACP
//   await s.prompt("Make card/edit.tsx a 3 s title card that says hello", (u) => console.log(u.sessionUpdate))
//   const mp4 = await cloud.read("card/card.mp4")
//   s.close()
//   const { exit, files } = await cloud.job(["render", "edit.tsx", "-o", "out/a.mp4"], projectTar)   // a render job:
//                                          // a project in as a tar, what the render made back as one (CL14)

import { Session, type Permission } from "./session.ts"

export { Session, type Permission, type Update } from "./session.ts"

export interface Health {
  raea: string
  agent: string | null
  agents: { id: string; version: string }[]
  workspace: string
  /** where raea renders on this server: a GPU (and which) or the CPU */
  device: { renders: "gpu" | "cpu"; name: string; gpus: { name: string; type: string; driver: string; vendor: string }[]; nvidia?: string[] }
  /** the GPU worker this server hands its renders to, when it has one */
  offload: { url: string; commands: string[] } | null
  jobs: { id: string; running: boolean }[]
}

export interface JobLog {
  log: ({ out: string } | { err: string })[]
  next: number
  exit?: number
}

export interface Entry {
  name: string
  dir: boolean
  bytes?: number
}

export interface Login {
  agent: string
  method?: string
  url?: string
  code?: string
  state: "waiting" | "done" | "failed" | "none"
  output: string
}

export class RaeaCloud {
  readonly url: string
  private token: string
  private ws?: Promise<string>

  constructor(o: { url: string; token: string }) {
    this.url = o.url.replace(/\/+$/, "")
    this.token = o.token
  }

  private async call(path: string, init: RequestInit = {}): Promise<Response> {
    const res = await fetch(this.url + path, { ...init, headers: { authorization: `Bearer ${this.token}`, ...init.headers } })
    if (!res.ok) throw new Error(`${init.method ?? "GET"} ${path}: ${res.status} ${await res.text()}`)
    return res
  }

  health(): Promise<Health> {
    return this.call("/v1/health").then((r) => r.json())
  }

  async read(path: string): Promise<Uint8Array> {
    return new Uint8Array(await (await this.call(`/v1/files?path=${encodeURIComponent(path)}`)).arrayBuffer())
  }

  async text(path: string): Promise<string> {
    return new TextDecoder().decode(await this.read(path))
  }

  list(path = "."): Promise<Entry[]> {
    return this.call(`/v1/files?path=${encodeURIComponent(path)}`).then((r) => r.json())
  }

  async write(path: string, data: string | Uint8Array): Promise<void> {
    await this.call(`/v1/files?path=${encodeURIComponent(path)}`, { method: "PUT", body: typeof data === "string" ? data : new Blob([data as BlobPart]) })
  }

  /** `raea ARGS` in the workspace (or `cwd` in it): resolves with its exit code; output goes to onOutput as it comes. */
  async run(args: string[], o: { cwd?: string; onOutput?: (text: string, stream: "out" | "err") => void; signal?: AbortSignal } = {}): Promise<number> {
    const res = await this.call("/v1/run", { method: "POST", body: JSON.stringify({ args, cwd: o.cwd }), headers: { "content-type": "application/json" }, signal: o.signal })
    const reader = res.body!.pipeThrough(new TextDecoderStream()).getReader()
    let buf = ""
    for (;;) {
      const { value, done } = await reader.read()
      if (done) break
      buf += value
      for (let i; (i = buf.indexOf("\n")) >= 0; buf = buf.slice(i + 1)) {
        const m = JSON.parse(buf.slice(0, i)) as { out?: string; err?: string; exit?: number }
        if (m.out !== undefined) o.onOutput?.(m.out, "out")
        if (m.err !== undefined) o.onOutput?.(m.err, "err")
        if (m.exit !== undefined) return m.exit
      }
    }
    throw new Error("raea's run ended without an exit code")
  }

  /** Starts `raea ARGS` on a folder sent as a tar (zstd, gzip or none), in a folder of its own on the server (a
   *  render job): its id. */
  async startJob(args: string[], folder: Uint8Array, signal?: AbortSignal): Promise<string> {
    const r = await this.call(`/v1/jobs?args=${encodeURIComponent(JSON.stringify(args))}`, { method: "POST", body: new Blob([folder as BlobPart]), headers: { "content-type": "application/octet-stream" }, signal })
    return ((await r.json()) as { id: string }).id
  }

  /** A job's output since line `from`; the server holds the request up to 20 s for more. `exit` once it's done. */
  followJob(id: string, from = 0, signal?: AbortSignal): Promise<JobLog> {
    return this.call(`/v1/jobs/${id}?from=${from}`, { signal }).then((r) => r.json())
  }

  /** A finished job's files: the ones its run made or changed, as a tar (zstd unless `as` says gz or tar). The server
   *  drops the job after. */
  async jobFiles(id: string, as: "zst" | "gz" | "tar" = "zst"): Promise<Uint8Array> {
    return new Uint8Array(await (await this.call(`/v1/jobs/${id}/out?as=${as}`)).arrayBuffer())
  }

  /** A job from start to end: its output to onOutput as it comes; its exit code and the files it made or changed. A
   *  dropped follow request (a platform's proxy, a cold start) is tried again, up to five times in a row. */
  async job(args: string[], folder: Uint8Array, o: { onOutput?: (text: string, stream: "out" | "err") => void; signal?: AbortSignal; as?: "zst" | "gz" | "tar" } = {}): Promise<{ exit: number; files: Uint8Array }> {
    const id = await this.startJob(args, folder, o.signal)
    let from = 0
    for (let misses = 0; ; ) {
      let f: JobLog
      try {
        f = await this.followJob(id, from, o.signal)
        misses = 0
      } catch (e) {
        if (o.signal?.aborted || ++misses > 5) throw e
        await new Promise((ok) => setTimeout(ok, 1000 * misses))
        continue
      }
      for (const l of f.log) "out" in l ? o.onOutput?.(l.out, "out") : o.onOutput?.(l.err, "err")
      from = f.next
      if (f.exit !== undefined) return { exit: f.exit, files: await this.jobFiles(id, o.as) }
    }
  }

  /** Starts an agent's terminal sign-in (Kimi Code's device code): open `url` and enter `code` once; the sign-in is
   *  kept in the server's home folder. */
  login(agent?: string): Promise<Login> {
    return this.call(`/v1/login${agent ? `?agent=${encodeURIComponent(agent)}` : ""}`, { method: "POST" }).then((r) => r.json())
  }

  loginState(agent?: string): Promise<Login> {
    return this.call(`/v1/login${agent ? `?agent=${encodeURIComponent(agent)}` : ""}`).then((r) => r.json())
  }

  /** An ACP session with an agent in the workspace (the default agent unless one is named). */
  async session(o: { agent?: string; cwd?: string; onPermission?: (p: Permission) => string | Promise<string> } = {}): Promise<Session> {
    const work = (this.ws ??= this.health().then((h) => h.workspace))
    const q = new URLSearchParams({ token: this.token, ...(o.agent ? { agent: o.agent } : {}) })
    const ws = new WebSocket(`${this.url.replace(/^http/, "ws")}/v1/acp?${q}`)
    await new Promise((ok, no) => {
      ws.onopen = ok
      ws.onerror = () => no(new Error(`couldn't open the ACP socket at ${this.url}`))
    })
    const s = new Session(ws, o.onPermission)
    await s.request("initialize", { protocolVersion: 1, clientCapabilities: {} })
    const root = await work
    const cwd = !o.cwd ? root : o.cwd.startsWith("/") ? o.cwd : `${root}/${o.cwd}`
    const { sessionId } = (await s.request("session/new", { cwd, mcpServers: [] })) as { sessionId: string }
    s.id = sessionId
    return s
  }
}
