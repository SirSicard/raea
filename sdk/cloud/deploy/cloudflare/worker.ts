// raea cloud on Cloudflare Containers (docs/cloud.feature CL10): a Worker in front of one container, which sleeps when
// it's idle and wakes on the next request. A container's disk doesn't outlive it, so the home folder (the agents'
// sign-ins, the workspace) is kept in R2 through raea cloud's RAEA_CLOUD_STATE: restored on start, saved on stop.
// The server checks the token itself; the Worker passes every request, WebSockets too, to the container.
import { Container, getContainer } from "@cloudflare/containers"

interface Env {
  RAEA: DurableObjectNamespace<RaeaCloud>
  RAEA_CLOUD_TOKEN: string
  RAEA_CLOUD_STATE: string
  RAEA_CLOUD_STATE_KEY: string
  RAEA_CLOUD_STATE_SECRET: string
  RAEA_AGENT?: string
  ANTHROPIC_API_KEY?: string
  OPENAI_API_KEY?: string
  GEMINI_API_KEY?: string
}

export class RaeaCloud extends Container<Env> {
  defaultPort = 8080
  sleepAfter = "15m"

  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env)
    const pass = ["RAEA_CLOUD_TOKEN", "RAEA_CLOUD_STATE", "RAEA_CLOUD_STATE_KEY", "RAEA_CLOUD_STATE_SECRET", "RAEA_AGENT", "ANTHROPIC_API_KEY", "OPENAI_API_KEY", "GEMINI_API_KEY"] as const
    this.envVars = Object.fromEntries(pass.filter((k) => env[k]).map((k) => [k, env[k] as string]))
  }
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    return getContainer(env.RAEA, "raea").fetch(req)
  },
}
