// <BlenderShot>: a layer of a composition drawn by Blender, frame for frame (docs/blender.feature BL36).
//   import { BlenderShot } from "raea/blender/shot";
//   <Sequence from={30} durationInFrames={90}><BlenderShot script="blender/orbit.ts" /></Sequence>
// The frames are rendered once (native call blender.shot, which runs `raea blender shot`) and kept in the
// composition's asset store, made again when the script, the .blend, the props or the size change.
import { useContext, type CSSProperties } from "react";
import { useCurrentFrame, useLocalTime, useVideoConfig } from "@raea/app/clock";
import { MediaEndContext } from "raea/media";
import { hasNative, native } from "@raea/app/native";
import type { ShotEngine } from "./shoot";

export interface BlenderShotProps {
  /** a raea/blender script whose default export builds or changes the scene, run before the frames are drawn */
  script?: string;
  /** a .blend: its own animation from its first frame, or the file the script opens */
  file?: string;
  /** eevee (the default), cycles or workbench */
  engine?: ShotEngine;
  samples?: number;
  /** alpha where Blender draws nothing, so the layers under it show */
  transparent?: boolean;
  /** the script's sys.argv after -- */
  args?: string[];
  /** the shot's own size and length; the composition's (or its Sequence's) when not given */
  width?: number;
  height?: number;
  frames?: number;
  style?: CSSProperties;
}

interface Shot {
  dir: string;
  frames: number;
}

const made = new Map<string, Shot>();

/** The shot's frames for these props, made once and kept. */
export function useBlenderShot(p: BlenderShotProps): Shot {
  const { fps, width, height, durationInFrames } = useVideoConfig();
  // as long as what is left of its Sequence (the composition frame media under it stops at), else of the composition
  const end = useContext(MediaEndContext);
  const { origin } = useLocalTime("Shot");
  const left = Math.max(1, (Number.isFinite(end) ? end : durationInFrames) - origin);
  if (!p.script && !p.file) throw new Error("BlenderShot: give script (a raea/blender script) or file (a .blend)");
  const req = {
    script: p.script,
    file: p.file,
    engine: p.engine,
    samples: p.samples,
    transparent: p.transparent,
    args: p.args,
    fps,
    width: p.width ?? width,
    height: p.height ?? height,
    frames: p.frames ?? left,
  };
  const key = JSON.stringify(req);
  let s = made.get(key);
  if (!s) {
    if (!hasNative()) throw new Error("BlenderShot: its frames are made by Blender through the raea engine (raea render)");
    s = native("blender.shot", req as never) as Shot;
    made.set(key, s);
  }
  return s;
}

/** Frame n of a shot's folder (0000.png on), held at its last frame past its end. */
export const shotFrame = (s: Shot, n: number) => `${s.dir}/${String(Math.min(Math.max(Math.floor(n), 0), s.frames - 1)).padStart(4, "0")}.png`;

export function BlenderShot(p: BlenderShotProps) {
  const s = useBlenderShot(p);
  const f = useCurrentFrame();
  return (
    <img
      fetchPriority="low"
      src={shotFrame(s, f)}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", ...p.style }}
    />
  );
}
