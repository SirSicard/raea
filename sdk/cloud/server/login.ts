// An agent's own sign-in, for agents that sign in from a terminal by a device code (docs/cloud.feature CL8): Kimi Code,
// and any agent whose ACP initialize lists a terminal auth method. There's no terminal on a server, so the login runs
// under script(1) (the device code is printed only to a terminal) and what it prints is handed back: the link to open
// and the code to enter. The login itself keeps running until it's approved, then writes the agent's sign-in into
// the home folder, which outlives the container (a volume, or RAEA_CLOUD_STATE).

import { type ChildProcess, spawn } from "node:child_process"
import type { Spawn } from "./agents.ts"
import { WORK } from "./workspace.ts"

interface Method {
  id: string
  type?: string
  args?: string[]
  env?: Record<string, string>
  _meta?: { "terminal-auth"?: { command: string; args?: string[]; env?: Record<string, string> } }
}

export interface Login {
  agent: string
  method?: string
  url?: string
  code?: string
  state: "waiting" | "done" | "failed" | "none"
  output: string
}

const running = new Map<string, { login: Login; child: ChildProcess }>()

/** The agent's auth methods, from its ACP initialize. */
async function methods(a: Spawn, env: NodeJS.ProcessEnv): Promise<Method[]> {
  const child = spawn(a.command, a.args, { cwd: WORK, env: { ...env, ...a.env }, stdio: ["pipe", "pipe", "ignore"] })
  child.stdin.write(JSON.stringify({ jsonrpc: "2.0", id: 1, method: "initialize", params: { protocolVersion: 1, clientCapabilities: { terminal: true, _meta: { "terminal-auth": true } } } }) + "\n")
  return new Promise((ok) => {
    let buf = ""
    const done = (m: Method[]) => (child.kill(), clearTimeout(t), ok(m))
    const t = setTimeout(() => done([]), 30_000)
    child.stdout.setEncoding("utf8").on("data", (c: string) => {
      buf += c
      for (let i; (i = buf.indexOf("\n")) >= 0; buf = buf.slice(i + 1)) {
        try {
          const m = JSON.parse(buf.slice(0, i))
          if (m.id === 1) return done(m.result?.authMethods ?? [])
        } catch {}
      }
    })
    child.on("exit", () => done([]))
  })
}

const quote = (s: string) => `'${s.replace(/'/g, `'\\''`)}'`

/** Starts agent `a`'s terminal login (or answers the one already waiting): resolves once it has printed its link, or
 *  has finished, or after 20 s. */
export async function login(a: Spawn, env: NodeJS.ProcessEnv): Promise<Login> {
  const had = running.get(a.id)
  if (had && had.login.state === "waiting") return had.login
  const m = (await methods(a, env)).find((x) => x._meta?.["terminal-auth"] || x.type === "terminal")
  if (!m) return { agent: a.id, state: "none", output: `${a.id} lists no terminal sign-in; give it its key in the container's environment` }
  const t = m._meta?.["terminal-auth"]
  const command = t?.command ?? a.command
  const args = t ? (t.args ?? []) : [...a.args, ...(m.args ?? [])]
  // Kimi's login defaults to kimi.com (mainland China); kimi.ai's is "global"
  if (/(^|\/)kimi$/.test(command) && args.includes("login") && !args.includes("--region")) args.push("--region", env.RAEA_KIMI_REGION ?? "global")
  const line = [command, ...args].map(quote).join(" ")
  const child = spawn("script", ["-qfec", line, "/dev/null"], { cwd: WORK, env: { ...env, ...a.env, ...t?.env, ...m.env }, stdio: ["pipe", "pipe", "pipe"] })
  const l: Login = { agent: a.id, method: m.id, state: "waiting", output: "" }
  running.set(a.id, { login: l, child })
  const read = (c: string) => {
    l.output += c.replace(/\x1b\[[0-9;?]*[A-Za-z]/g, "")
    l.url ??= /https:\/\/\S+/.exec(l.output)?.[0]?.replace(/[)\].,'"]+$/, "")
    l.code ??= /\b[Cc]ode:?\s+([A-Z0-9]{3,}(?:-[A-Z0-9]{3,})*)\b/.exec(l.output)?.[1] ?? (l.url ? (new URL(l.url).searchParams.get("user_code") ?? undefined) : undefined)
  }
  child.stdout!.setEncoding("utf8").on("data", read)
  child.stderr!.setEncoding("utf8").on("data", read)
  child.on("exit", (code) => (l.state = code === 0 ? "done" : "failed"))
  for (let i = 0; i < 100 && !l.url && l.state === "waiting"; i++) await new Promise((r) => setTimeout(r, 200))
  return l
}

/** Where agent `id`'s login is now. */
export const loginState = (id: string): Login => running.get(id)?.login ?? { agent: id, state: "none", output: "" }
