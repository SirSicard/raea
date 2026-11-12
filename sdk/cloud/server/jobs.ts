// Render jobs (docs/cloud.feature CL14, CL15): a folder sent in, `raea ARGS` run on it here, and the files the run
// made or changed sent back. A CPU box hands its renders to a GPU worker this way (bin/raea, offload.ts); anyone can
// use it to render on this server without a workspace. A job runs in the background and is followed by short
// requests, so a platform's request timeout (a serverless GPU's proxy) never cuts a long render.
//
//   POST /v1/jobs?args=JSON      body: the folder as a tar (zstd, gzip, xz or none: GNU tar tells). {id}
//   GET  /v1/jobs/ID?from=N      {log: [{out}|{err}], next, exit?}: the output since line N, waiting up to 20 s for
//                                more while it runs; exit once it has finished
//   GET  /v1/jobs/ID/out?as=zst  the files the run made or changed, as tar.zst (as=gz: tar.gz, as=tar: a plain tar);
//                                the job is removed after
//
// Jobs live under ~/jobs and are removed an hour after they finish if nobody fetched them.

import { spawn, spawnSync } from "node:child_process"
import { randomUUID } from "node:crypto"
import { mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs"
import os from "node:os"
import path from "node:path"

const ROOT = path.join(os.homedir(), "jobs")
const KEEP_MS = 3_600_000

type Line = { out: string } | { err: string }
interface Job {
  id: string
  dir: string
  log: Line[]
  exit?: number
  ended?: number
  before: Map<string, string>
  wake: (() => void)[]
}

const jobs = new Map<string, Job>()

/** Every file under `dir` with its size and modification time, to tell what a run made or changed. */
function snapshot(dir: string, at = dir, into = new Map<string, string>()): Map<string, string> {
  for (const e of readdirSync(at, { withFileTypes: true })) {
    const p = path.join(at, e.name)
    if (e.isDirectory()) snapshot(dir, p, into)
    else if (e.isFile()) {
      const s = statSync(p)
      into.set(path.relative(dir, p), `${s.size}:${s.mtimeMs}`)
    }
  }
  return into
}

function sweep() {
  const now = Date.now()
  for (const j of jobs.values())
    if (j.ended && now - j.ended > KEEP_MS) {
      rmSync(j.dir, { recursive: true, force: true })
      jobs.delete(j.id)
    }
}

/** Starts `raea ARGS` on the folder in `tar` (a tar's bytes, compressed or not). */
export function start(args: string[], tar: Buffer, raea: string, env: NodeJS.ProcessEnv): Job {
  sweep()
  const id = randomUUID()
  const dir = path.join(ROOT, id)
  mkdirSync(dir, { recursive: true })
  const file = path.join(ROOT, `${id}.tar`)
  writeFileSync(file, tar)
  // GNU tar reads the compression from the file, refuses members with .., and strips a leading /, so nothing lands
  // outside the job's folder
  const x = spawnSync("tar", ["-xf", file, "-C", dir, "--no-same-owner", "--no-same-permissions"], { encoding: "utf8" })
  rmSync(file, { force: true })
  if (x.status !== 0) {
    rmSync(dir, { recursive: true, force: true })
    throw new Error(`the folder didn't unpack: ${x.stderr.trim()}`)
  }
  const j: Job = { id, dir, log: [], before: snapshot(dir), wake: [] }
  jobs.set(id, j)
  const push = (l: Line) => {
    j.log.push(l)
    for (const w of j.wake.splice(0)) w()
  }
  const child = spawn(raea, args, { cwd: dir, env, stdio: ["ignore", "pipe", "pipe"] })
  child.stdout.setEncoding("utf8").on("data", (out: string) => push({ out }))
  child.stderr.setEncoding("utf8").on("data", (err: string) => push({ err }))
  child.on("error", (e) => push({ err: String(e) }))
  child.on("close", (code) => {
    j.exit = code ?? 128
    j.ended = Date.now()
    for (const w of j.wake.splice(0)) w()
  })
  return j
}

/** The job's output from line `from`, waiting up to `wait` ms for more while it runs. */
export async function follow(id: string, from: number, wait = 20_000) {
  const j = jobs.get(id)
  if (!j) return undefined
  if (j.log.length <= from && j.exit === undefined) await new Promise<void>((ok) => (j.wake.push(ok), setTimeout(ok, wait)))
  return { log: j.log.slice(from), next: j.log.length, exit: j.exit }
}

const PACK = { zst: ["--zstd"], gz: ["--gzip"], tar: [] } as const
export type Packing = keyof typeof PACK
export const packing = (as: string | null): Packing => (as === "gz" || as === "tar" ? as : "zst")

/** The files the job's run made or changed, as a tar; the job is removed. */
export function out(id: string, as: Packing = "zst"): Buffer | undefined {
  const j = jobs.get(id)
  if (!j || j.exit === undefined) return undefined
  const after = snapshot(j.dir)
  const changed = [...after].filter(([p, s]) => j.before.get(p) !== s).map(([p]) => p)
  const list = path.join(ROOT, `${id}.list`)
  writeFileSync(list, changed.join("\n") + (changed.length ? "\n" : ""))
  const tar = spawnSync("tar", [...PACK[as], "-cf", "-", "-C", j.dir, "--verbatim-files-from", "-T", list], { maxBuffer: 16 << 30 })
  rmSync(list, { force: true })
  rmSync(j.dir, { recursive: true, force: true })
  jobs.delete(id)
  if (tar.status !== 0) throw new Error(`the results didn't pack: ${tar.stderr.toString().trim()}`)
  return tar.stdout
}

/** The ids of the jobs held now, for /v1/health. */
export const held = () => [...jobs.values()].map((j) => ({ id: j.id, running: j.exit === undefined }))

export const readArgs = (q: string | null): string[] => {
  const a = JSON.parse(q ?? "null") as unknown
  if (!Array.isArray(a) || !a.every((x) => typeof x === "string")) throw new Error("args must be a JSON array of strings: raea's own arguments")
  return a
}
