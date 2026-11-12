// One ACP session over raea cloud's WebSocket (agentclientprotocol.com): JSON-RPC requests out, their answers and the
// agent's session/update notifications in, and its permission requests answered by onPermission.

export interface Update {
  sessionUpdate: string
  content?: { type: string; text?: string }
  [k: string]: unknown
}

export interface Permission {
  sessionId: string
  options: { optionId: string; kind: string; name?: string }[]
  toolCall?: unknown
}

/** By default a permission is allowed once: the container is the sandbox. */
const allowOnce = (p: Permission) => (p.options.find((o) => o.kind === "allow_once") ?? p.options.find((o) => o.kind.startsWith("allow")) ?? p.options[0]).optionId

export class Session {
  id = ""
  private n = 0
  private waiting = new Map<number, { ok: (v: unknown) => void; no: (e: Error) => void }>()
  private onUpdate: ((u: Update) => void) | null = null
  private ws: WebSocket
  private permit: (p: Permission) => string | Promise<string>

  constructor(ws: WebSocket, permit?: (p: Permission) => string | Promise<string>) {
    this.ws = ws
    this.permit = permit ?? allowOnce
    ws.onmessage = async (e) => {
      const m = JSON.parse(String(e.data))
      if (m.id != null && !m.method && this.waiting.has(m.id)) {
        const w = this.waiting.get(m.id)!
        this.waiting.delete(m.id)
        return m.error ? w.no(new Error(m.error.message ?? JSON.stringify(m.error))) : w.ok(m.result)
      }
      if (m.method === "session/update") return this.onUpdate?.(m.params.update)
      if (m.method === "session/request_permission") {
        const optionId = await this.permit(m.params)
        return ws.send(JSON.stringify({ jsonrpc: "2.0", id: m.id, result: { outcome: { outcome: "selected", optionId } } }))
      }
      // a request this client doesn't serve (fs/*, terminal/*): it said so in initialize, but answer rather than hang
      if (m.id != null && m.method) ws.send(JSON.stringify({ jsonrpc: "2.0", id: m.id, error: { code: -32601, message: `${m.method} isn't offered by this client` } }))
    }
    ws.onclose = (e) => {
      for (const w of this.waiting.values()) w.no(new Error(`the ACP socket closed${e.reason ? `: ${e.reason}` : ""}`))
      this.waiting.clear()
    }
  }

  request(method: string, params: unknown): Promise<unknown> {
    const id = ++this.n
    this.ws.send(JSON.stringify({ jsonrpc: "2.0", id, method, params }))
    return new Promise((ok, no) => this.waiting.set(id, { ok, no }))
  }

  /** One turn: resolves with its stop reason once the agent is done; each update on the way goes to onUpdate. */
  async prompt(text: string, onUpdate?: (u: Update) => void): Promise<string> {
    this.onUpdate = onUpdate ?? null
    const r = (await this.request("session/prompt", { sessionId: this.id, prompt: [{ type: "text", text }] })) as { stopReason: string }
    return r.stopReason
  }

  cancel() {
    this.ws.send(JSON.stringify({ jsonrpc: "2.0", method: "session/cancel", params: { sessionId: this.id } }))
  }

  close() {
    this.ws.close()
  }
}
