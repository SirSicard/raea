// A stand-in ACP agent for raea cloud's smoke test (docs/cloud.feature CL12): it answers initialize and session/new,
// and each prompt with two updates, the prompt's text echoed and the `raea --version` it finds in the container, so a
// turn shows the agent runs next to raea. It asks one permission per turn, to check the client answers it.
import { execFileSync } from "node:child_process"
import { createInterface } from "node:readline"

const send = (m) => process.stdout.write(JSON.stringify({ jsonrpc: "2.0", ...m }) + "\n")
const update = (sessionId, text) => send({ method: "session/update", params: { sessionId, update: { sessionUpdate: "agent_message_chunk", content: { type: "text", text } } } })
let asked = 1000
const pending = new Map()

createInterface({ input: process.stdin }).on("line", (line) => {
  const m = JSON.parse(line)
  if (m.id != null && !m.method && pending.has(m.id)) return pending.get(m.id)(m.result)
  if (m.method === "initialize") return send({ id: m.id, result: { protocolVersion: 1, agentCapabilities: {}, authMethods: [] } })
  if (m.method === "session/new") return send({ id: m.id, result: { sessionId: `echo-${process.pid}`, cwd: m.params.cwd } })
  if (m.method === "session/prompt") {
    const { sessionId, prompt } = m.params
    update(sessionId, `echo: ${prompt.map((p) => p.text ?? "").join("")}`)
    let v
    try {
      v = execFileSync("raea", ["--version"], { encoding: "utf8" }).trim()
    } catch (e) {
      v = `no raea: ${e.message}`
    }
    update(sessionId, `raea: ${v}; cwd: ${process.cwd()}; token visible: ${process.env.RAEA_CLOUD_TOKEN ? "yes" : "no"}`)
    const id = ++asked
    pending.set(id, (r) => {
      update(sessionId, `permission: ${r?.outcome?.optionId}`)
      send({ id: m.id, result: { stopReason: "end_turn" } })
    })
    return send({ id, method: "session/request_permission", params: { sessionId, toolCall: { toolCallId: "t1", title: "echo" }, options: [{ optionId: "yes", kind: "allow_once", name: "Allow" }, { optionId: "no", kind: "reject_once", name: "Reject" }] } })
  }
  if (m.id != null) send({ id: m.id, error: { code: -32601, message: `echo-agent: no ${m.method}` } })
})
