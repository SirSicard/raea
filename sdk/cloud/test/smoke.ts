// raea cloud's smoke test against a running server (docs/cloud.feature CL12), with test/echo-agent.mjs as its agent:
//   node test/smoke.ts URL TOKEN [BOX_URL BOX_TOKEN]
// BOX is a second server that hands its renders to the first (RAEA_CLOUD_GPU_URL; CL15). smoke.sh starts the
// containers and runs this. Each check prints one line; the exit code is the number that failed.
import { spawnSync } from "node:child_process"
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import os from "node:os"
import path from "node:path"
import { RaeaCloud, type Update } from "../src/index.ts"

const [url, token, boxUrl, boxToken] = process.argv.slice(2)
if (!url || !token) throw new Error("usage: node test/smoke.ts URL TOKEN [BOX_URL BOX_TOKEN]")
const cloud = new RaeaCloud({ url, token })
let failed = 0
const check = async (name: string, f: () => Promise<string>) => {
  const t0 = performance.now()
  try {
    console.log(`ok   ${name}: ${await f()} (${Math.round(performance.now() - t0)} ms)`)
  } catch (e) {
    failed++
    console.log(`FAIL ${name}: ${(e as Error).message}`)
  }
}
const status = async (path: string, init: RequestInit = {}) => (await fetch(url + path, init)).status
const expect = (cond: unknown, msg: string) => {
  if (!cond) throw new Error(msg)
}

await check("healthz needs no token", async () => {
  expect((await status("/healthz")) === 200, "not 200")
  return "200"
})
await check("no token, a wrong token: 401", async () => {
  const a = await status("/v1/health")
  const b = await status("/v1/health", { headers: { authorization: `Bearer ${"x".repeat(token.length)}` } })
  expect(a === 401 && b === 401, `${a}, ${b}`)
  return `${a}, ${b}`
})
let workspace = ""
await check("health", async () => {
  const h = await cloud.health()
  workspace = h.workspace
  expect(/^\d+\.\d+\.\d+/.test(h.raea), `raea ${h.raea}`)
  expect(h.device && (h.device.renders === "gpu" || h.device.renders === "cpu") && h.device.name, `device ${JSON.stringify(h.device)}`)
  return `${h.raea}, agent ${h.agent}, installed ${h.agents.map((a) => `${a.id} ${a.version}`).join(", ") || "none"}, ${h.workspace}, renders on ${h.device.renders} (${h.device.name})`
})
await check("files round trip", async () => {
  await cloud.write("smoke/a/b.txt", "hello cloud")
  const back = await cloud.text("smoke/a/b.txt")
  const ls = await cloud.list("smoke/a")
  expect(back === "hello cloud", `read back ${JSON.stringify(back)}`)
  expect(ls.some((e) => e.name === "b.txt" && e.bytes === 11), `listed ${JSON.stringify(ls)}`)
  return "written, read, listed"
})
await check("paths out of the workspace: 403", async () => {
  const auth = { authorization: `Bearer ${token}` }
  const got = [
    await status(`/v1/files?path=${encodeURIComponent("../../../etc/passwd")}`, { headers: auth }),
    await status(`/v1/files?path=${encodeURIComponent("/etc/passwd")}`, { headers: auth }),
    await status(`/v1/files?path=${encodeURIComponent("/tmp/x")}`, { method: "PUT", body: "x", headers: auth }),
    await status(`/v1/files?path=${encodeURIComponent("out-link/passwd")}`, { headers: auth }),
  ]
  expect(got.every((s) => s === 403), got.join(", "))
  return `.., absolute, PUT absolute, symlink out: ${got.join(", ")}`
})
await check("raea renders through /v1/run", async () => {
  let log = ""
  const init = await cloud.run(["init"], { cwd: "smoke/p", onOutput: (t) => (log += t) })
  expect(init === 0, `raea init exit ${init}: ${log.slice(-400)}`)
  const t0 = performance.now()
  const r = await cloud.run(["render", "edit.tsx", "--frame", "15", "-o", "card.png"], { cwd: "smoke/p", onOutput: (t) => (log += t) })
  expect(r === 0, `render exit ${r}: ${log.slice(-400)}`)
  const png = await cloud.read("smoke/p/card.png")
  expect(png[0] === 0x89 && png[1] === 0x50, "not a PNG")
  return `card.png ${png.length} bytes, render ${Math.round(performance.now() - t0)} ms`
})
/** A folder of the workspace copied here, file by file through /v1/files. */
async function fetchDir(c: RaeaCloud, rel: string, to: string) {
  mkdirSync(to, { recursive: true })
  for (const e of await c.list(rel))
    if (e.dir) await fetchDir(c, `${rel}/${e.name}`, path.join(to, e.name))
    else writeFileSync(path.join(to, e.name), await c.read(`${rel}/${e.name}`))
}

await check("a render job: a project in, what it made back", async () => {
  const tmp = mkdtempSync(path.join(os.tmpdir(), "raea-cloud-smoke-"))
  try {
    // the project raea init made in the last check, sent back as a job of its own
    await fetchDir(cloud, "smoke/p", path.join(tmp, "p"))
    rmSync(path.join(tmp, "p", "card.png"), { force: true })
    const tar = spawnSync("tar", ["-czf", "-", "-C", path.join(tmp, "p"), "."], { maxBuffer: 1 << 30 })
    expect(tar.status === 0, `tar: ${tar.stderr}`)
    let log = ""
    const t0 = performance.now()
    const { exit, files } = await cloud.job(["render", "edit.tsx", "--frame", "15", "-o", "out/job.png"], new Uint8Array(tar.stdout), { as: "gz", onOutput: (t) => (log += t) })
    expect(exit === 0, `job exit ${exit}: ${log.slice(-400)}`)
    writeFileSync(path.join(tmp, "back.tgz"), files)
    const listed = spawnSync("tar", ["-tzf", path.join(tmp, "back.tgz")], { encoding: "utf8" }).stdout.split("\n").filter(Boolean)
    expect(listed.some((f) => f.replace(/^\.\//, "") === "out/job.png"), `came back: ${listed.join(", ")}`)
    expect(!listed.some((f) => f.endsWith("edit.tsx")), `unchanged files came back: ${listed.join(", ")}`)
    mkdirSync(path.join(tmp, "back"))
    spawnSync("tar", ["-xzf", path.join(tmp, "back.tgz"), "-C", path.join(tmp, "back")])
    const png = readFileSync(path.join(tmp, "back", "out", "job.png"))
    expect(png[0] === 0x89 && png[1] === 0x50, "not a PNG")
    return `out/job.png ${png.length} bytes back of ${listed.length} file(s), ${Math.round(performance.now() - t0)} ms`
  } finally {
    rmSync(tmp, { recursive: true, force: true })
  }
})
await check("jobs: bad args 400, no such job 404", async () => {
  const auth = { authorization: `Bearer ${token}` }
  const a = await status(`/v1/jobs?args=${encodeURIComponent('"render"')}`, { method: "POST", body: "", headers: auth })
  const b = await status("/v1/jobs/00000000-0000-0000-0000-000000000000", { headers: auth })
  const c = await status("/v1/jobs/00000000-0000-0000-0000-000000000000/out", { headers: auth })
  expect(a === 400 && b === 404 && c === 404, `${a}, ${b}, ${c}`)
  return `${a}, ${b}, ${c}`
})
if (boxUrl && boxToken) {
  const box = new RaeaCloud({ url: boxUrl, token: boxToken })
  await check("a CPU box hands its renders to the worker", async () => {
    const h = await box.health()
    expect(h.offload?.url, `the box has no worker: ${JSON.stringify(h.offload)}`)
    let log = ""
    const init = await box.run(["init"], { cwd: "smoke/q", onOutput: (t) => (log += t) })
    expect(init === 0, `raea init exit ${init}: ${log.slice(-400)}`)
    const before = (await cloud.health()).jobs.length
    const r = await box.run(["render", "edit.tsx", "--frame", "15", "-o", "out/handed.png"], { cwd: "smoke/q", onOutput: (t) => (log += t) })
    expect(r === 0, `render exit ${r}: ${log.slice(-600)}`)
    expect(/raea cloud: rendering on .*sent/.test(log) && /done on the GPU worker/.test(log), `not handed on: ${log.slice(-600)}`)
    const png = await box.read("smoke/q/out/handed.png")
    expect(png[0] === 0x89 && png[1] === 0x50, "not a PNG")
    // the worker dropped the job once its files were fetched
    expect((await cloud.health()).jobs.length === before, "the worker still holds the job")
    return `${log.match(/raea cloud: rendering on [^\n]*/)?.[0]}; out/handed.png ${png.length} bytes on the box`
  })
}
await check("ACP turn with the stand-in agent", async () => {
  const s = await cloud.session({ cwd: "smoke" })
  const said: string[] = []
  const stop = await s.prompt("hello from the smoke test", (u: Update) => u.content?.text && said.push(u.content.text))
  s.close()
  const all = said.join(" | ")
  expect(stop === "end_turn", `stop ${stop}`)
  expect(said.includes("echo: hello from the smoke test"), all)
  expect(/raea: \d+\.\d+\.\d+/.test(all), `no raea in ${all}`)
  expect(all.includes(`cwd: ${workspace}`), `cwd not the workspace: ${all}`)
  expect(all.includes("token visible: no"), `the agent sees the token: ${all}`)
  expect(all.includes("permission: yes"), `permission not allowed once: ${all}`)
  return all
})
await check("ACP socket without a token: refused", async () => {
  const ws = new WebSocket(`${url.replace(/^http/, "ws")}/v1/acp`)
  const opened = await new Promise<boolean>((r) => ((ws.onopen = () => r(true)), (ws.onerror = () => r(false))))
  expect(!opened, "opened")
  return "refused"
})
console.log(failed ? `smoke: ${failed} FAILED` : "smoke: all passed")
process.exit(failed)
