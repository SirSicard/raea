// raea cloud's live check (docs/cloud.feature CL12): one real agent turn that makes and renders a title card with
// raea in the container, then reads the video back through /v1/files.
//   node test/live.ts URL TOKEN [AGENT]
// The agent must be signed in (POST /v1/login for Kimi Code, or its key in the container's environment).
import { writeFileSync } from "node:fs"
import { RaeaCloud } from "../src/index.ts"

const [url, token, agent] = process.argv.slice(2)
if (!url || !token) throw new Error("usage: node test/live.ts URL TOKEN [AGENT]")
const cloud = new RaeaCloud({ url, token })
const dir = `live-${Date.now().toString(36)}`
const h = await cloud.health()
console.log(`raea ${h.raea}, agent ${agent ?? h.agent}, workspace ${h.workspace}`)

const t0 = performance.now()
const s = await cloud.session({ agent, cwd: dir })
const tools: string[] = []
let said = ""
const stop = await s.prompt(
  `In this folder, run \`raea init\`, then change edit.tsx so the whole composition is a 3 second title card that says "raea cloud" in large white text on a dark background. Render it with \`raea render edit.tsx -o card.mp4\`, and reply with the size of card.mp4 in bytes.`,
  (u) => {
    if (u.sessionUpdate === "agent_message_chunk") said += u.content?.text ?? ""
    if (u.sessionUpdate === "tool_call") tools.push(String((u as { title?: string }).title ?? "tool"))
  },
)
s.close()
console.log(`turn: ${stop} in ${Math.round((performance.now() - t0) / 1000)} s, ${tools.length} tool calls`)
console.log(`tools: ${tools.slice(0, 12).join(" | ")}`)
console.log(`agent: ${said.trim().slice(-400)}`)
const mp4 = await cloud.read(`${dir}/card.mp4`)
const out = `${process.env.OUT ?? "."}/live-card.mp4`
writeFileSync(out, mp4)
console.log(`card.mp4: ${mp4.length} bytes, ${new TextDecoder().decode(mp4.subarray(4, 8)) === "ftyp" ? "an mp4" : "NOT an mp4"} -> ${out}`)
process.exit(stop === "end_turn" && mp4.length > 1000 ? 0 : 1)
