# raea cloud

raea and an ACP agent on a server of your own. One image holds raea's Linux release, the agents you choose and a
small server. You deploy it wherever you run containers, and talk to it over HTTP and ACP. raea doesn't host it: the
server, the GPU and the agent's subscription are yours. Spec: [docs/cloud.feature](../../docs/cloud.feature).

```
your code ── RaeaCloud (src/) ──▶ :8080  raea-cloud server ──▶ raea (render, play, check, ...)  on a GPU or the CPU
             HTTPS + one token           /v1/acp  (WebSocket) ──▶ the agent, over ACP, in ~/work
                                         /v1/files, /v1/run, /v1/jobs, /v1/login, /v1/health
```

One image runs on a CPU or an NVIDIA GPU and says which (`/v1/health`'s `device`). Two shapes:

```
A. one server             agent + raea  ── on a GPU host, or a CPU host
B. a box and a worker     agent + raea (CPU, always on, cheap) ── raea render ──▶ GPU worker (asleep when idle)
                          RAEA_CLOUD_GPU_URL                        /v1/jobs: the project in, what it made back
```

## Run it

```bash
cd sdk/cloud
docker build --platform linux/amd64 -f image/Dockerfile \
  --build-arg RAEA_VERSION=0.1.1 --build-arg AGENTS="kimi-code" -t raea-cloud .
export RAEA_CLOUD_TOKEN=$(openssl rand -hex 32)
docker run -d -p 127.0.0.1:8080:8080 -e RAEA_CLOUD_TOKEN -v raea-home:/home/raea raea-cloud
curl -H "authorization: Bearer $RAEA_CLOUD_TOKEN" localhost:8080/v1/health
```

`AGENTS` takes any ids the [ACP registry](https://cdn.agentclientprotocol.com/registry/v1/latest/registry.json)
lists, several at once: `kimi-code`, `claude-acp`, `codex-acp`, `gemini`, `opencode`, `goose`, ... Each is installed
from its registry entry (npm at the registry's version, or its Linux archive checked by sha256), and raea's skill is
installed for it on every start. `RAEA_AGENT` picks the default; a socket can name another (`?agent=`).
`RAEA_AGENT_CMD` runs an agent the registry doesn't list, by its command line.

Signing the agent in:

- **Kimi Code** signs in by a device code: `POST /v1/login?agent=kimi-code` (or `cloud.login()`) returns a link and
  a code to approve once. The sign-in is kept in the home folder.
- **Claude, Codex, Gemini** take their key from the container's environment: `ANTHROPIC_API_KEY` (or
  `CLAUDE_CODE_OAUTH_TOKEN`), `OPENAI_API_KEY`, `GEMINI_API_KEY`.

## Use it

```ts
import { RaeaCloud } from "@raea/cloud" // sdk/cloud/src

const cloud = new RaeaCloud({ url: "https://raea.example.com", token: process.env.RAEA_CLOUD_TOKEN! })

// raea on its own
await cloud.run(["init"], { cwd: "card" })
await cloud.run(["render", "edit.tsx", "-o", "card.mp4"], { cwd: "card", onOutput: (t) => process.stdout.write(t) })
const mp4 = await cloud.read("card/card.mp4")

// or an agent that uses raea, over ACP
const s = await cloud.session()
const stop = await s.prompt("Make card/edit.tsx a 3 s title card that says hello, and render it", (u) => {
  if (u.sessionUpdate === "agent_message_chunk") process.stdout.write(u.content?.text ?? "")
})
s.close()
```

The client needs only `fetch` and `WebSocket`: Node 22+, Bun, Deno or a browser. Permission requests are allowed
once by default (the container is the sandbox); pass `onPermission` to decide them yourself.

| Route | |
|---|---|
| `GET /healthz` | `ok`, without the token, for health checks |
| `GET /v1/health` | raea's version, the agents, the workspace, the device raea renders on, the GPU worker it hands renders to |
| `GET /v1/files?path=P` | a file in the workspace, or a folder's entries as JSON |
| `PUT /v1/files?path=P` | writes the body there, making its folders |
| `POST /v1/run` `{args, cwd}` | `raea ARGS` in the workspace; NDJSON `{out}`, `{err}`, then `{exit}` |
| `POST /v1/jobs?args=JSON` | a render job: the body is a project as a tar (zstd, gzip or none), `raea ARGS` runs on it; `{id}` |
| `GET /v1/jobs/ID?from=N` | the job's output since line N (held up to 20 s for more), and `exit` once it's done |
| `GET /v1/jobs/ID/out?as=zst` | the files the job made or changed, as a tar (`zst`, `gz` or `tar`); the job is dropped |
| `POST /v1/login?agent=ID` | an agent's terminal sign-in: `{url, code, state}`; `GET` says where it is |
| `WS /v1/acp?agent=ID` | one agent per socket; each text frame is one ACP JSON-RPC message |

Every route but `/healthz` needs `Authorization: Bearer TOKEN` (or `?token=`, for a browser's WebSocket). Paths
outside the workspace are refused, symlinks out of it too. The agent and raea never see the token.

## Deploy it

| Where | File | The home folder lives on | Checked |
|---|---|---|---|
| Docker, Compose | `deploy/compose.yaml` | a named volume | end to end (test/smoke.sh) |
| Compose with an NVIDIA GPU | `+ deploy/compose.gpu.yaml` | a named volume | not yet on a GPU host |
| Fly Machines | `deploy/fly.toml` | a Fly volume; the Machine stops when idle | config only |
| Kubernetes | `deploy/k8s.yaml` | a PersistentVolumeClaim | config only |
| Any Linux VM | `docker run`, as above | a named volume | as Docker |

Where the disk doesn't outlive the container (Cloudflare Containers, Cloud Run), set `RAEA_CLOUD_STATE` to an
S3-compatible object (R2, S3) with
`RAEA_CLOUD_STATE_KEY` and `RAEA_CLOUD_STATE_SECRET`: the home folder is restored from it on start and saved to it
when the container stops (image/state.sh).

Each file says how to deploy with it at its top.

## Renders: CPU or GPU

raea renders through Vulkan. On start the entrypoint opens NVIDIA's Vulkan driver when the host passed a GPU in, and
raea renders on it; with no GPU it renders on Mesa's llvmpipe, on the CPU (an AMD card in `/dev/dri` gets Mesa's
radv). `GET /v1/health` says which:

```json
"device": { "renders": "gpu", "name": "NVIDIA L4", "nvidia": ["NVIDIA L4, 23034 MiB, 610.57.04"], "gpus": [...] }
```

`RAEA_CLOUD_DEVICE=gpu` makes a GPU that doesn't open an error at start, so a worker meant for a GPU never renders on
its CPU unnoticed; `RAEA_CLOUD_DEVICE=cpu` keeps raea on llvmpipe.

What one render costs where (`test/gpu/edit.tsx`: 576 lit blocks with shadows, 1920x1080, 90 frames, on Modal 11-10):

| Device | 90 frames | a frame |
|---|---|---|
| NVIDIA A10 | 115 s | 1229 ms |
| NVIDIA A10G | 133 s | 1392 ms |
| NVIDIA T4 | 156 s | 1652 ms |
| llvmpipe, 8 CPU cores of the T4's host | 203 s | 2005 ms |

That scene spends most of its time outside the GPU, so a GPU buys about 1.2-1.6x on it; heavier lighting (Solari,
path tracing) needs one.

Building your own image instead: NVIDIA's Vulkan driver, mounted by the container runtime, loads only with glvnd and
X11's libraries beside it (`libxext6 libx11-6 libgl1 libegl1` on Debian). With libEGL in the image, wgpu would pick
NVIDIA's OpenGL over llvmpipe for a CPU render and fail, so the image sets `WGPU_BACKEND=vulkan` and the entrypoint
hides EGL's vendors when it renders on the CPU.

**A. One server on a GPU.** Give the container an NVIDIA GPU: `compose.gpu.yaml`, `nvidia.com/gpu: 1` on Kubernetes,
or `deploy/modal/raea_cloud.py`. The image asks for the graphics capability, so the NVIDIA runtime mounts the Vulkan
driver.

**B. A CPU box that hands its renders to a GPU worker.** The agent lives on a small always-on CPU server; renders go
to a GPU that sleeps when idle. Deploy a worker (Modal below, or `deploy/k8s.gpu.yaml`), then set on the box:

```bash
RAEA_CLOUD_GPU_URL=https://you--raea-cloud-server.modal.run
RAEA_CLOUD_GPU_TOKEN=<the worker's token>
```

From then on, `raea render` on the box (from the agent, its shell or `/v1/run`) sends the render's project (its
folder, or the nearest one above with `package.json`, `raea.lock` or `brief.ts`; without `.git` or `out/`) to the
worker as a job, prints its output as it comes and lands the files it made back in the project. Every other raea
command runs on the box. An input outside the project renders on the box, with a line saying why;
`RAEA_CLOUD_GPU_ROOT` sends a wider folder. A worker that doesn't answer fails the render, unless
`RAEA_CLOUD_GPU_FALLBACK=cpu`. The project's `out/` goes to the worker empty, and raea renders only into a folder
that exists, so render into `out/` or another folder the project has.

The same jobs work from your own code: `cloud.job(["render", "edit.tsx", "-o", "out/a.mp4"], projectTar)`.

### A GPU on Modal

```bash
cd sdk/cloud
modal secret create raea-cloud RAEA_CLOUD_TOKEN=$(openssl rand -hex 32)
modal deploy deploy/modal/raea_cloud.py                      # an L4, else A10G, else T4; RAEA_CLOUD_GPU=L40S (or a list) for others
```

Modal builds the image from `image/Dockerfile`. One container takes every request (a job is followed on the
container that runs it); it starts on a request and stops after five idle minutes (`RAEA_CLOUD_IDLE`), so you pay
for the minutes it renders.

## Known limits

- raea ships for Linux on x86_64 only, so the image is linux/amd64; an arm64 machine (Graviton, Ampere, Apple
  Silicon's Docker) runs it emulated and slowly.
- One server is one workspace, for one person or one team that trusts each other: everyone with the token has the
  agent's whole sandbox.
- Agents installed with uvx (Python) aren't supported by the image; add Python in your own image or run them by
  `RAEA_AGENT_CMD`.

## Test it

`test/smoke.sh 0.1.1` builds the image, starts it with a stand-in agent (test/echo-agent.mjs) and checks the token,
the path rules, a render through `/v1/run` and an ACP turn.
