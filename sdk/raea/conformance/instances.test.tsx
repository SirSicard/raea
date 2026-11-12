// <Instances> and scatter(): placements packed 9 numbers a copy onto a Mesh or Model node, the errors, and scatter's
// determinism, spacing, avoid, clearOf, ground height and density.
import { describe, expect, test } from "bun:test";
import { BufferMesh, Cuboid, Instances, scatter } from "raea/3d";
import { MeshStandardMaterial, MeshToonMaterial } from "@raea/render/three";
import { renderFrame } from "../src/test";

const html = (el: React.ReactElement) => renderFrame(el, { frame: 0, width: 320, height: 240, fps: 30, durationInFrames: 30 });
const props = (h: string, kind: string) => {
  const m = h.match(new RegExp(`data-3d="${kind}"[^>]*data-props="([^"]*)"`));
  if (!m) throw new Error(`no ${kind} in ${h.slice(0, 300)}`);
  return JSON.parse(m[1].replace(/&quot;/g, '"').replace(/&amp;/g, "&"));
};
// the placements: their own attribute, not data-props, so the engine shares one list across frames (#84)
const placed = (h: string, kind: string) => {
  const m = h.match(new RegExp(`data-3d="${kind}"[^>]*data-at="([^"]*)"`));
  if (!m) throw new Error(`no ${kind} data-at in ${h.slice(0, 300)}`);
  return JSON.parse(m[1].replace(/&quot;/g, '"').replace(/&amp;/g, "&"));
};

describe("Instances", () => {
  test("the mesh form: a Mesh node with its shape and the placements, 9 numbers a copy", () => {
    const at = [{ position: [1, 0, 2] as [number, number, number] }, { position: [0, 0, 0] as [number, number, number], rotation: [0, 1.5, 0] as [number, number, number], scale: 2 }];
    const h = html(<Instances at={at} shadow={false}><Cuboid args={[1, 1, 1]} /><MeshStandardMaterial color="#336633" /></Instances>);
    expect(h).toContain('data-shape="');
    const p = props(h, "Mesh");
    expect(placed(h, "Mesh")).toEqual([1, 0, 2, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1.5, 0, 2, 2, 2]);
    expect(p.at).toBeUndefined();
    expect(p.shadow).toBe(false);
  });
  test("the glTF form: a Model node", () => {
    const h = html(<Instances src="daisy.glb" at={[{ position: [0, 0, 0] }]} />);
    expect(props(h, "Model").src).toBe("daisy.glb");
    expect(placed(h, "Model")).toHaveLength(9);
  });
  test("a buffer mesh is a shape", () => {
    const h = html(<Instances at={[{ position: [0, 0, 0] }]}><BufferMesh positions={[0, 0, 0, 1, 0, 0, 0, 1, 0]} /><MeshStandardMaterial /></Instances>);
    expect(h).toContain("buffer:");
  });
  test("the same list is packed once", () => {
    const at = scatter({ area: { min: [0, 0], max: [4, 4] }, count: 50 });
    const a = placed(html(<Instances src="a.glb" at={at} />), "Model");
    const b = placed(html(<Instances src="a.glb" at={at} />), "Model");
    expect(a).toEqual(b);
  });
  test("errors say what's wrong", () => {
    expect(() => html(<Instances src="a.png" at={[]} />)).toThrow(/\.glb or \.gltf/);
    expect(() => html(<Instances at={[]} />)).toThrow(/geometry child/);
    expect(() => html(<Instances src="a.glb" at={{} as never} />)).toThrow(/at must be a list/);
    expect(() => html(<Instances src="a.glb" at={[{ position: [0, 0] as never }]} />)).toThrow(/at\[0\]\.position/);
    expect(() => html(<Instances src="a.glb" at={[{ position: [0, 0, 0], scale: 0 }]} />)).toThrow(/positive/);
    expect(() => html(<Instances src="a.glb" at={[]} {...({ animation: "Walk" } as object)} />)).toThrow(/can't play a clip/);
    expect(() => html(<Instances at={[{ position: [0, 0, 0] }]}><Cuboid /><MeshToonMaterial color="#fff" /></Instances>)).toThrow(/toon/);
  });
});

describe("scatter", () => {
  const area = { min: [-10, -10] as [number, number], max: [10, 10] as [number, number] };
  test("the same seed, the same points; another seed, others", () => {
    expect(scatter({ area, count: 200, seed: 3 })).toEqual(scatter({ area, count: 200, seed: 3 }));
    expect(scatter({ area, count: 200, seed: 4 })).not.toEqual(scatter({ area, count: 200, seed: 3 }));
  });
  test("spacing holds between every pair", () => {
    const pts = scatter({ area, count: 300, spacing: 0.8 });
    for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
      const [a, b] = [pts[i].position, pts[j].position];
      expect(Math.hypot(a[0] - b[0], a[2] - b[2])).toBeGreaterThanOrEqual(0.8);
    }
  });
  test("avoid and clearOf keep points off", () => {
    const road = { min: [-2, -10] as [number, number], max: [2, 10] as [number, number] };
    for (const p of scatter({ area, count: 300, avoid: [road], margin: 0.5 })) expect(Math.abs(p.position[0])).toBeGreaterThan(2.5);
    const first = scatter({ area, count: 40, spacing: 2, seed: 9 });
    for (const p of scatter({ area, count: 40, spacing: 2, clearOf: first, seed: 10 })) for (const q of first) {
      expect(Math.hypot(p.position[0] - q.position[0], p.position[2] - q.position[2])).toBeGreaterThanOrEqual(2);
    }
  });
  test("the ground's height and a density map", () => {
    const pts = scatter({ area, count: 100, y: (x, z) => x + z, density: (x) => (x > 0 ? 1 : 0), tilt: 0.2 });
    for (const p of pts) {
      expect(p.position[1]).toBeCloseTo(p.position[0] + p.position[2], 9);
      expect(p.position[0]).toBeGreaterThan(0);
      expect(Math.hypot(p.rotation![0], p.rotation![2])).toBeLessThanOrEqual(0.2 + 1e-9);
    }
  });
});
