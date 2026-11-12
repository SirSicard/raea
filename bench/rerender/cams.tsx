// RR2: two cameras in one scene, cut between inside one render (<Camera3d is_active>): A, wide and dollying in, for
// frames 0-39, B, low and close with a shallow depth of field, for 40-89, then A again for 90-119 (A's own nearly
// sharp, f/16: the same effects either side, so a cut changes the camera alone, not the look, which would warm up
// as RR1's cuts do). Parts move and the scene has motion blur, so a cut drawn with the frame before it (the other
// camera's) would smear. The piece ("cut")
// rendered once against the same frames rendered as one composition per shot ("a1", "b", "a2"), each starting at its
// frame 0 as an agent's chunk does, with motion blur and without ("-still"): bench/rerender/rr2.sh.
import { AbsoluteFill, Composition, interpolate, registerRoot, useCurrentFrame } from "raea";
import { Canvas3D, DepthOfField, MotionBlur, ToneMapping, manifold } from "raea/3d";
import { Camera3d } from "raea/camera";
import { AmbientLight, DirectionalLight } from "raea/light";
import { Mesh3d } from "raea/mesh";
import { StandardMaterial } from "raea/pbr";
import { Quat, Transform } from "raea/transform";

const GROUND = manifold.box(60, 1, 60).move(0, -0.5, 0);
const BOX = manifold.box(1.2, 1.2, 1.2);
const POST = manifold.cylinder(3, 0.25, 0.25, 24);

// the shots: which camera is the piece's from which frame
const SHOTS = [
  { id: "a1", cam: "A", from: 0, to: 40 },
  { id: "b", cam: "B", from: 40, to: 90 },
  { id: "a2", cam: "A", from: 90, to: 120 },
] as const;

// `jump`: one camera moved to B's place and back instead of two cameras, the control: its cut frames are drawn with
// the frame before them, so motion blur smears them from the other shot
function Scene({ t0, only, blur = true, jump = false }: { t0: number; only?: "A" | "B"; blur?: boolean; jump?: boolean }) {
  const f = useCurrentFrame() + t0;
  const on = SHOTS.find((s) => f >= s.from && f < s.to)?.cam ?? "A";
  const a = Transform.fromXyz(interpolate(f, [0, 119], [9, 5]), 4, interpolate(f, [0, 119], [12, 7])).lookingAt([0, 0.8, 0], [0, 1, 0]);
  const b = Transform.fromXyz(interpolate(f, [0, 119], [-3.5, -1.5]), 0.6, 2.4).lookingAt([0.5, 0.7, 0], [0, 1, 0]);
  const lens = { Perspective: { fov: 0.8, near: 0.1, far: 120 } };
  return (
    <AbsoluteFill style={{ background: "#1c2128" }}>
      <Canvas3D>
        {jump ? (
          <Camera3d transform={on === "A" ? a : b} projection={lens}><DepthOfField aperture_f_stops={on === "A" ? 16 : 1.4} /></Camera3d>
        ) : null}
        {!jump && only !== "B" ? (
          <Camera3d transform={a} projection={lens} is_active={only === "A" || on === "A"}>
            <DepthOfField aperture_f_stops={16} />
          </Camera3d>
        ) : null}
        {!jump && only !== "A" ? (
          <Camera3d transform={b} projection={lens} is_active={only === "B" || on === "B"}>
            <DepthOfField aperture_f_stops={1.4} />
          </Camera3d>
        ) : null}
        <DirectionalLight name="sun" transform={Transform.fromXyz(8, 14, 6).lookingAt([0, 0, 0], [0, 1, 0])} illuminance={15000} shadow_maps_enabled />
        <AmbientLight brightness={180} />
        <Mesh3d name="ground" shape={GROUND}><StandardMaterial base_color="#5d6b4a" perceptual_roughness={0.9} /></Mesh3d>
        <Mesh3d name="slider" shape={BOX} transform={Transform.fromXyz(interpolate(f, [0, 119], [-3, 3]), 0.6, 0).withRotation(Quat.fromEuler("XYZ", 0, f * 0.08, 0))}>
          <StandardMaterial base_color="#d04a2a" perceptual_roughness={0.4} />
        </Mesh3d>
        <Mesh3d name="spinner" shape={BOX} transform={Transform.fromXyz(0.5, 1.6 + Math.sin(f * 0.15) * 0.6, -2).withRotation(Quat.fromEuler("XYZ", f * 0.12, f * 0.2, 0))}>
          <StandardMaterial base_color="#e8d27a" metallic={0.6} perceptual_roughness={0.3} />
        </Mesh3d>
        <Mesh3d name="post1" shape={POST} transform={Transform.fromXyz(-2.5, 1.5, -4)}><StandardMaterial base_color="#8c9aa8" /></Mesh3d>
        <Mesh3d name="post2" shape={POST} transform={Transform.fromXyz(3, 1.5, -6)}><StandardMaterial base_color="#8c9aa8" /></Mesh3d>
        <ToneMapping mode="agx" />
        {blur ? <MotionBlur shutterAngle={1} samples={8} /> : null}
      </Canvas3D>
    </AbsoluteFill>
  );
}

registerRoot(() => (
  <>
    {[true, false].map((blur) => {
      const end = blur ? "" : "-still";
      return [
        <Composition key={`cut${end}`} id={`cut${end}`} component={() => <Scene t0={0} blur={blur} />} width={960} height={540} fps={30} durationInFrames={120} />,
        ...SHOTS.map((s) => (
          <Composition key={s.id + end} id={s.id + end} component={() => <Scene t0={s.from} only={s.cam} blur={blur} />} width={960} height={540} fps={30} durationInFrames={s.to - s.from} />
        )),
      ];
    })}
    <Composition id="jump" component={() => <Scene t0={0} jump />} width={960} height={540} fps={30} durationInFrames={120} />
  </>
));
