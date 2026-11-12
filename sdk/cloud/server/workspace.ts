// The workspace a raea cloud works in (docs/cloud.feature CL5): every path a request names resolves inside it, or the
// request is refused. A path is checked twice: as written (no .., no absolute path out) and as the disk has it (no
// symlink inside the workspace pointing out), the second on the deepest part of the path that exists.

import { existsSync, realpathSync } from "node:fs"
import os from "node:os"
import path from "node:path"

export const WORK = path.resolve(process.env.RAEA_CLOUD_WORK ?? path.join(os.homedir(), "work"))

export class Outside extends Error {}

const inside = (root: string, p: string) => p === root || p.startsWith(root + path.sep)

/** The absolute path of `rel` in the workspace, or Outside. */
export function resolve(rel: string, root = WORK): string {
  // an absolute path must already be in the workspace; a relative one is taken from it
  const p = path.resolve(root, rel)
  if (!inside(root, p)) throw new Outside(`${rel} is outside the workspace`)
  const real = realpathSync(existsSync(root) ? root : path.dirname(root))
  let probe = p
  while (!existsSync(probe) && probe !== root) probe = path.dirname(probe)
  if (existsSync(probe) && !inside(real, realpathSync(probe))) throw new Outside(`${rel} leads outside the workspace`)
  return p
}
