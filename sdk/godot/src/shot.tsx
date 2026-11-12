// <GodotShot>: a layer of a composition drawn by Godot's Movie Maker, frame for frame (docs/godot.feature GD11).
//   import { GodotShot } from "raea/godot/shot";
//   <GodotShot project="godot" script="godot/rally.ts" />   or   <GodotShot project="godot" scene="res://main.tscn" />
// The frames are recorded once (native call godot.shot, which runs `raea godot shot`) and kept in the composition's
// asset store, made again when the script, the project's files, the props or the size change.
import { useContext, type CSSProperties } from "react";
import { useCurrentFrame, useLocalTime, useVideoConfig } from "@raea/app/clock";
import { MediaEndContext } from "raea/media";
import { hasNative, native } from "@raea/app/native";

export interface GodotShotProps {
  /** the Godot project's folder (its project.godot); an empty project when not given */
  project?: string;
  /** a raea/godot script whose default export builds the scene and returns; the scene plays on after it */
  script?: string;
  /** a scene of the project, res://PATH.tscn, playing as it would in the game */
  scene?: string;
  /** the script's arguments */
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
export function useGodotShot(p: GodotShotProps): Shot {
  const { fps, width, height, durationInFrames } = useVideoConfig();
  // as long as what is left of its Sequence (the composition frame media under it stops at), else of the composition
  const end = useContext(MediaEndContext);
  const { origin } = useLocalTime("Shot");
  const left = Math.max(1, (Number.isFinite(end) ? end : durationInFrames) - origin);
  if (!p.script && !p.scene) throw new Error("GodotShot: give script (a raea/godot script) or scene (res://PATH.tscn)");
  const req = {
    project: p.project,
    script: p.script,
    scene: p.scene,
    args: p.args,
    fps,
    width: p.width ?? width,
    height: p.height ?? height,
    frames: p.frames ?? left,
  };
  const key = JSON.stringify(req);
  let s = made.get(key);
  if (!s) {
    if (!hasNative()) throw new Error("GodotShot: its frames are made by Godot through the raea engine (raea render)");
    s = native("godot.shot", req as never) as Shot;
    made.set(key, s);
  }
  return s;
}

/** Frame n of a shot's folder (0000.png on), held at its last frame past its end. */
export const shotFrame = (s: Shot, n: number) => `${s.dir}/${String(Math.min(Math.max(Math.floor(n), 0), s.frames - 1)).padStart(4, "0")}.png`;

export function GodotShot(p: GodotShotProps) {
  const s = useGodotShot(p);
  const f = useCurrentFrame();
  return (
    <img
      fetchPriority="low"
      src={shotFrame(s, f)}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", ...p.style }}
    />
  );
}
