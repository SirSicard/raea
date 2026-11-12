// MC3's graybox (docs/match-cuts.feature): good.chain.ts built as a project would build it, each shot a Sequence from
// the chain and each hook a part placed on its thirds place with onFrame, the out hook carried there over the shot. One
// composition holds the chain; each other one is a cheat the render check must fail.
import { AbsoluteFill, Audio, Composition, Sequence, registerRoot, useCurrentFrame } from "raea";
import { Sphere } from "raea/3d";
import { Camera3d } from "raea/camera";
import { DirectionalLight } from "raea/light";
import { Cuboid, Mesh3d } from "raea/mesh";
import { StandardMaterial } from "raea/pbr";
import { Transform } from "raea/transform";
import good from "./good.chain";
import { centreOf, onFrame, sequences, type Glyph, type Hook } from "./checks/match-cuts/chain";

const W = 640, H = 360, ASPECT = W / H;
const EYE = [0, 0, 6], CAM = { eye: EYE, look: [0, 0, 0], fov: 45 };
/** the frame's half height and width on the plane the hooks stand on (6 m ahead) */
const HALF = 6 * Math.tan((22.5 * Math.PI) / 180);

type Cheat = "off" | "drift" | "renamed" | "late" | "unfilled" | "behind" | "jlate" | "lstop";
export const CHEATS: Cheat[] = ["off", "drift", "renamed", "late", "unfilled", "behind", "jlate", "lstop"];

const ease = (t: number) => t * t * (3 - 2 * t);
const lerp = (a: number[], b: number[], t: number) => a.map((x, i) => x + (b[i] - x) * t);

/** a hook's part: its glyph's shape at (u, v) on the frame, or filling it (`fill` 1: the frame, more: past it); `grow` scales it */
function Hooked({ name, glyph, uv, fill = 0, z = 0, grow = 1 }: { name: string; glyph: Glyph; uv: number[]; fill?: number; z?: number; grow?: number }) {
  const [x, y] = onFrame(uv[0], uv[1], 6 - z, CAM, ASPECT);
  const half: [number, number, number] = fill > 0 ? [HALF * ASPECT * fill, HALF * fill, 0.05]
    : glyph === "rect" ? [0.4, 0.28, 0.05] : glyph === "streaks" ? [0.06, 0.45, 0.06] : glyph === "blob" ? [0.35, 0.25, 0.2] : glyph === "hline" ? [1.2, 0.04, 0.04] : [0.25, 0.25, 0.25];
  const colour = { circle: "#e8a33d", rect: "#2bb3a6", streaks: "#9fd8ff", blob: "#d65a7a" }[glyph as string] ?? "#cccccc";
  return (
    <Mesh3d name={name} transform={Transform.fromXyz(x, y, z).withScale([grow, grow, grow])}>
      {glyph === "circle" && !fill ? <Sphere radius={0.25} /> : <Cuboid half_size={half} />}
      <StandardMaterial base_color={colour} />
    </Mesh3d>
  );
}

/** one shot: its in hook's part where the chain says, and its out hook's carried from the in place to its own */
function Shot({ i, frames, cheat }: { i: number; frames: number; cheat?: Cheat }) {
  const f = useCurrentFrame();
  const s = good.shots[i];
  const t = ease(Math.min(1, f / Math.max(1, frames - 1)));
  const at = (h: Hook) => centreOf(h.at);
  let inAt = at(s.in), outAt = at(s.out);
  if (cheat === "off" && s.name === "window") inAt = centreOf("TL");
  // drift: the steam is at its place halfway through, then leaves it
  const outUv = cheat === "drift" && s.name === "kitchen" ? (t < 0.5 ? lerp(inAt, outAt, t * 2) : lerp(outAt, centreOf("CC"), (t - 0.5) * 2)) : lerp(inAt, outAt, t);
  const outName = cheat === "renamed" && s.out.part === "steam" ? "vapour" : s.out.part!;
  // a FULL hook fills the frame at its end of the shot (1.15: past its edges); unfilled, half of it
  const outFill = s.out.at === "FULL" ? (cheat === "unfilled" ? 0.15 + 0.55 * t : 0.15 + t) : 0;
  const inFill = s.in.at === "FULL" ? 1.15 * (1 - t) + 0.1 * t : 0;
  // the carried part stands 0.6 m nearer the eye than the in part, so the two never pass through each other
  const behind = cheat === "behind" && s.out.part === "mug" ? 8 * t : 0.6;
  const same = s.in.part === s.out.part;
  return (
    <AbsoluteFill style={{ background: "#202630" }}>
      <Camera3d transform={Transform.fromXyz(EYE[0], EYE[1], EYE[2]).lookingAt([0, 0, 0])} />
      <DirectionalLight illuminance={9000} transform={Transform.fromXyz(2, 4, 6).lookingAt([0, 0, 0])} />
      {!same && s.in.part !== "7:45" && <Hooked name={s.in.part!} glyph={s.in.glyph} uv={s.in.at === "FULL" ? centreOf("CC") : inAt} fill={inFill} />}
      {s.out.part === "7:45" ? (
        // a text hook: the clock's time, its box centred on the out place
        <div style={{ position: "absolute", left: outAt[0] * W - 60, top: outAt[1] * H - 24, width: 120, height: 48, lineHeight: "48px", textAlign: "center", fontSize: 36, color: "#f4efe6" }}>7:45</div>
      ) : (
        <Hooked name={outName} glyph={s.out.glyph} uv={s.out.at === "FULL" ? lerp(inAt, centreOf("CC"), t) : outUv} fill={outFill} z={same ? 0 : behind} grow={same || outFill ? 1 : Math.max(0.01, Math.min(1, t * 4))} />
      )}
    </AbsoluteFill>
  );
}

function Piece({ cheat }: { cheat?: Cheat }) {
  const seqs = sequences(good);
  // late: the window shot starts ten frames after the chain's cut
  if (cheat === "late") { seqs[0].durationInFrames += 10; seqs[1].from += 10; seqs[1].durationInFrames -= 10; }
  const cut = (name: string) => seqs.find((s) => s.name === name)!.from;
  return (
    <AbsoluteFill style={{ background: "#202630" }}>
      {seqs.map((q, i) => (
        <Sequence key={q.name} name={q.name} from={q.from} durationInFrames={q.durationInFrames}>
          <Shot i={i} frames={q.durationInFrames} cheat={cheat} />
        </Sequence>
      ))}
      {/* J: the brakes start half a second before the cut into the bus; L: the doors run on half a second into the office */}
      <Sequence from={cut("bus") - (cheat === "jlate" ? 0 : 15)} durationInFrames={45}><Audio src="media/brakes.wav" /></Sequence>
      <Sequence from={cut("bus")} durationInFrames={cheat === "lstop" ? 30 : 60}><Audio src="media/doors.wav" /></Sequence>
    </AbsoluteFill>
  );
}

registerRoot(() => (
  <>
    <Composition id="graybox" component={Piece} width={W} height={H} fps={good.fps} durationInFrames={Math.round(good.length * good.fps)} />
    {CHEATS.map((c) => <Composition key={c} id={c} component={() => <Piece cheat={c} />} width={W} height={H} fps={good.fps} durationInFrames={Math.round(good.length * good.fps)} />)}
  </>
));
