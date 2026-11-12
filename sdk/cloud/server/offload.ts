// raea on a CPU box with its renders on a GPU worker (docs/cloud.feature CL15). image/raea.sh runs this for
// `raea render ...` when RAEA_CLOUD_GPU_URL names a raea cloud server on a GPU (RAEA_CLOUD_GPU_TOKEN its token):
//
//   1. the render's project goes there as tar.zst: the folder of its composition, or the nearest one above it with
//      package.json, raea.lock or brief.ts (RAEA_CLOUD_GPU_ROOT names another), without .git or what's in out/
//      (RAEA_CLOUD_GPU_EXCLUDE: tar patterns, space-separated, to send instead);
//   2. `raea render` runs there with the same arguments, its paths made relative to that folder, and prints here as
//      it comes;
//   3. the files it made or changed land back here: an output path outside the folder (-o /tmp/x.mp4) is written
//      there under .raea-cloud-out and moved to its place after.
//
// A render that reads a path outside its project (an input, --words, ...) can't go: it runs here, on the CPU, and
// says why. So does every render when the worker can't be reached and RAEA_CLOUD_GPU_FALLBACK=cpu; otherwise that
// fails, so a box meant to render on a GPU never quietly renders on its CPU.

import { spawnSync } from "node:child_process"
import { existsSync, mkdirSync, mkdtempSync, readFileSync, renameSync, rmSync, writeFileSync } from "node:fs"
import os from "node:os"
import path from "node:path"
import { pathToFileURL } from "node:url"
import { RaeaCloud } from "../src/index.ts"

const REAL = process.env.RAEA_REAL ?? "/opt/raea/bin/raea"
// flags whose value is a path raea writes; the rest of a render's path arguments are read
const WRITES = new Set(["-o", "--out", "--audio", "--manifest", "--review"])
const READS = new Set(["--input", "--words", "--perception", "--bundle", "--dir", "--taste"])
const COMPOSITION = /\.(tsx|ts|jsx|js|mjs|html)$/

const say = (s: string) => process.stderr.write(`raea cloud: ${s}\n`)

function local(args: string[], why?: string): never {
  if (why) say(`${why}, so this runs here, on the CPU`)
  const r = spawnSync(REAL, args, { stdio: "inherit" })
  process.exit(r.status ?? 1)
}

const inside = (root: string, p: string) => p === root || p.startsWith(root + path.sep)

/** The project a render's composition is in: its folder, or the nearest above it that holds a project's files. */
export function projectRoot(composition: string, cwd: string, stop = os.homedir()): string {
  const start = path.dirname(path.resolve(cwd, composition))
  for (let d = start; ; d = path.dirname(d)) {
    if (["package.json", "raea.lock", "brief.ts"].some((f) => existsSync(path.join(d, f)))) return d
    if (d === stop || d === path.dirname(d)) return start
  }
}

export interface Plan {
  root: string
  args: string[]
  /** outputs outside the root: where the worker writes them (relative to root), and where they go after */
  moves: { from: string; to: string }[]
}

/** The render's arguments made relative to its project, or why it can't leave this machine. */
export function plan(args: string[], cwd: string, root?: string): Plan | string {
  const comp = args.find((a, i) => i > 0 && !a.startsWith("-") && COMPOSITION.test(a) && !WRITES.has(args[i - 1]))
  const bundle = args[args.indexOf("--bundle") + 1]
  const from = comp ?? (args.includes("--bundle") ? bundle : undefined)
  if (!from) return "this render names no composition"
  const r = root ? path.resolve(cwd, root) : projectRoot(from, cwd)
  const moves: Plan["moves"] = []
  const out: string[] = []
  for (let i = 0; i < args.length; i++) {
    const a = args[i]
    const flag = args[i - 1]
    const isPath = i > 0 && !a.startsWith("-") && (WRITES.has(flag) || READS.has(flag) || a === from || existsSync(path.resolve(cwd, a)))
    if (!isPath) {
      out.push(a)
      continue
    }
    const abs = path.resolve(cwd, a)
    if (inside(r, abs)) out.push(path.relative(r, abs) || ".")
    else if (WRITES.has(flag)) {
      const rel = path.join(".raea-cloud-out", `${moves.length}-${path.basename(abs)}`)
      moves.push({ from: rel, to: abs })
      out.push(rel)
    } else return `${a} is outside the project sent to the GPU (${r})`
  }
  return { root: r, args: out, moves }
}

async function main() {
  const args = process.argv.slice(2)
  const url = process.env.RAEA_CLOUD_GPU_URL
  const token = process.env.RAEA_CLOUD_GPU_TOKEN ?? ""
  if (!url) local(args)
  const p = plan(args, process.cwd(), process.env.RAEA_CLOUD_GPU_ROOT)
  if (typeof p === "string") local(args, p)

  const tmp = mkdtempSync(path.join(os.tmpdir(), "raea-offload-"))
  try {
    const excludes = (process.env.RAEA_CLOUD_GPU_EXCLUDE ?? "./.git ./out/* ./.raea-cloud-out").split(/\s+/).filter(Boolean)
    // zstd with GNU tar (the image's); gzip with another tar (a Mac's), whose zstd needs a program of its own
    const gnu = spawnSync("tar", ["--version"], { encoding: "utf8" }).stdout?.includes("GNU")
    const sent = path.join(tmp, "in.tar")
    const pack = spawnSync("tar", [gnu ? "--zstd" : "-z", "-cf", sent, ...excludes.map((e) => `--exclude=${e}`), "-C", p.root, "."], { encoding: "utf8" })
    if (pack.status !== 0) throw new Error(`the project didn't pack: ${pack.stderr.trim()}`)
    const folder = new Uint8Array(readFileSync(sent))

    const cloud = new RaeaCloud({ url, token })
    const t0 = performance.now()
    let h
    try {
      h = await cloud.health()
    } catch (e) {
      if (process.env.RAEA_CLOUD_GPU_FALLBACK === "cpu") local(args, `the GPU worker at ${url} didn't answer (${(e as Error).message})`)
      throw new Error(`the GPU worker at ${url} didn't answer: ${(e as Error).message} (RAEA_CLOUD_GPU_FALLBACK=cpu renders here instead)`)
    }
    say(`rendering on ${new URL(url).host}, ${h.device.renders === "gpu" ? `GPU ${h.device.name}` : `its CPU (${h.device.name})`}: ${p.root} (${(folder.length / 1e6).toFixed(1)} MB) sent`)
    const { exit, files } = await cloud.job(p.args, folder, { as: gnu ? "zst" : "gz", onOutput: (t, s) => (s === "out" ? process.stdout : process.stderr).write(t) })

    const back = path.join(tmp, "out.tar")
    writeFileSync(back, files)
    const unpack = spawnSync("tar", ["-xf", back, "-C", p.root], { encoding: "utf8" })
    if (unpack.status !== 0) throw new Error(`the results didn't unpack: ${unpack.stderr.trim()}`)
    for (const m of p.moves) {
      const from = path.join(p.root, m.from)
      if (!existsSync(from)) continue
      mkdirSync(path.dirname(m.to), { recursive: true })
      // a move across filesystems (into /tmp) is a copy
      try {
        renameSync(from, m.to)
      } catch {
        spawnSync("cp", ["-R", from, m.to])
      }
    }
    rmSync(path.join(p.root, ".raea-cloud-out"), { recursive: true, force: true })
    say(`done on the GPU worker in ${((performance.now() - t0) / 1000).toFixed(1)} s, exit ${exit}`)
    process.exitCode = exit
  } finally {
    rmSync(tmp, { recursive: true, force: true })
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href)
  main().catch((e) => {
    say((e as Error).message)
    process.exit(1)
  })
