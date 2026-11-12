// Which device raea renders on here (docs/cloud.feature CL13): the Vulkan devices this container sees, from
// `vulkaninfo --summary` with the environment raea runs with. raea's 3D goes through wgpu, which takes a GPU over the
// CPU, so it renders on the first device that isn't the CPU's; with none it renders on Mesa's llvmpipe (the CPU).
// The entrypoint has already pointed the Vulkan loader at the GPU's driver when one opened (VK_DRIVER_FILES).

import { execFileSync } from "node:child_process"

export interface Gpu {
  name: string
  type: "discrete" | "integrated" | "virtual" | "cpu" | "other"
  driver: string
  vendor: string
}

export interface Device {
  /** where raea's renders run */
  renders: "gpu" | "cpu"
  /** the device they run on */
  name: string
  gpus: Gpu[]
  /** NVIDIA's own report, when nvidia-smi is here: name, memory, driver */
  nvidia?: string[]
}

/** The devices in `vulkaninfo --summary`'s output. */
export function parseSummary(text: string): Gpu[] {
  const out: Gpu[] = []
  for (const block of text.split(/^GPU\d+:\s*$/m).slice(1)) {
    const field = (k: string) => new RegExp(`^\\s*${k}\\s*=\\s*(.*)$`, "m").exec(block)?.[1].trim() ?? ""
    const t = field("deviceType").replace("PHYSICAL_DEVICE_TYPE_", "").toLowerCase()
    out.push({
      name: field("deviceName"),
      type: t === "discrete_gpu" ? "discrete" : t === "integrated_gpu" ? "integrated" : t === "virtual_gpu" ? "virtual" : t === "cpu" ? "cpu" : "other",
      driver: [field("driverName"), field("driverInfo")].filter(Boolean).join(" "),
      vendor: field("vendorID"),
    })
  }
  return out
}

const RANK = { discrete: 0, integrated: 1, virtual: 2, other: 3, cpu: 4 }

export function pick(gpus: Gpu[]): Pick<Device, "renders" | "name"> {
  const best = [...gpus].sort((a, b) => RANK[a.type] - RANK[b.type])[0]
  return best && best.type !== "cpu" ? { renders: "gpu", name: best.name } : { renders: "cpu", name: best?.name || "llvmpipe" }
}

let cached: Device | undefined

export function device(env: NodeJS.ProcessEnv): Device {
  if (cached) return cached
  let gpus: Gpu[] = []
  try {
    gpus = parseSummary(execFileSync("vulkaninfo", ["--summary"], { encoding: "utf8", env, timeout: 30_000, stdio: ["ignore", "pipe", "ignore"] }))
  } catch {
    // no vulkaninfo, or the loader found nothing: raea falls back the same way
  }
  let nvidia: string[] | undefined
  try {
    nvidia = execFileSync("nvidia-smi", ["--query-gpu=name,memory.total,driver_version", "--format=csv,noheader"], { encoding: "utf8", timeout: 10_000, stdio: ["ignore", "pipe", "ignore"] })
      .trim()
      .split("\n")
      .filter(Boolean)
  } catch {
    // not an NVIDIA host
  }
  cached = { ...pick(gpus), gpus, nvidia }
  return cached
}
