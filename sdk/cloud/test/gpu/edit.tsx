// raea cloud's GPU check (docs/cloud.feature CL13): a lit, shadowed 3D scene heavy enough that a GPU shows, 1920x1080
// at 30 fps for 3 s: 576 turning blocks on a floor under a sun with shadows. test/gpu.sh renders it on a server's GPU
// and on its CPU (llvmpipe) and compares the times.

import { AbsoluteFill, Composition, registerRoot, useCurrentFrame } from "raea";
import { Camera3d } from "raea/camera";
import { AmbientLight, DirectionalLight } from "raea/light";
import { Cuboid, Mesh3d } from "raea/mesh";
import { StandardMaterial } from "raea/pbr";
import { Quat, Transform } from "raea/transform";

const N = 24;
const COLOURS = ["#e05030", "#f0b030", "#30a0e0", "#60c070", "#d0d0d8"];

function Edit() {
  const f = useCurrentFrame();
  const blocks = []
  for (let x = 0; x < N; x++)
    for (let z = 0; z < N; z++) {
      const h = 0.4 + 0.35 * Math.sin(x * 0.7 + z * 0.4 + f * 0.12)
      blocks.push(
        <Mesh3d key={`${x}-${z}`} transform={Transform.fromXyz((x - N / 2) * 0.9, h, (z - N / 2) * 0.9).withRotation(Quat.fromEuler("XYZ", 0, f * 0.03 + x * 0.2, 0))}>
          <Cuboid half_size={[0.32, h, 0.32]} />
          <StandardMaterial base_color={COLOURS[(x + z) % COLOURS.length]} perceptual_roughness={0.35} metallic={(x * z) % 3 === 0 ? 0.8 : 0} />
        </Mesh3d>,
      )
    }
  return (
    <AbsoluteFill style={{ background: "#101018" }}>
      <Camera3d transform={Transform.fromXyz(Math.cos(f * 0.01) * 18, 11, Math.sin(f * 0.01) * 18).lookingAt([0, 0, 0])} projection={{ Perspective: { fov: 0.75 } }} />
      <AmbientLight brightness={120} />
      <DirectionalLight transform={Transform.fromXyz(6, 12, 4).lookingAt([0, 0, 0])} illuminance={20000} shadow_maps_enabled />
      <Mesh3d transform={Transform.fromXyz(0, -0.05, 0)}>
        <Cuboid half_size={[14, 0.05, 14]} />
        <StandardMaterial base_color="#2a2a33" perceptual_roughness={0.8} />
      </Mesh3d>
      {blocks}
    </AbsoluteFill>
  );
}

registerRoot(() => <Composition id="gpu" component={Edit} width={1920} height={1080} fps={30} durationInFrames={90} />);
