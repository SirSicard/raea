// on* on a 3D part (docs/sdk.feature S3a; sdk/render events3d.tsx): the events a frame's pointer makes, and the parts'
// bounds in the world that a pick is made against.
import { describe, expect, test } from "bun:test";
import { events3d, local, onFlat, pickIn, under, worldBounds, IDENTITY, type Last } from "../../render/src/events3d";
import { pick } from "../../render/src/pick";
import { Mesh3d, Quat, StandardMaterial } from "../../render/src/bevy3d";
import { pickable3d } from "../../render/src/events3d";
import { Cone, Sphere } from "../src/3d";
import { renderFrame } from "../src/test";

type P = { x: number; y: number; down: boolean };
/** The event types per part over a run of frames: each frame's pointer and the part under it. */
function run(frames: [P | undefined, string | null][]): string[] {
  let last: Last = { hover: null, down: null };
  const out: string[] = [];
  for (const [p, hover] of frames) {
    const r = events3d(last, p, hover, hover ? [0, 0, 0] : undefined);
    for (const [id, evs] of r.events) for (const e of evs) out.push(`${id}:${e.type}`);
    last = r.last;
  }
  return out;
}

describe("a part's pointer events, as a page element's", () => {
  test("over, down, up and click on the same part; out when the pointer leaves it", () => {
    expect(run([
      [{ x: 0, y: 0, down: false }, null],
      [{ x: 5, y: 5, down: false }, "box"],
      [{ x: 6, y: 5, down: false }, "box"],
      [{ x: 6, y: 5, down: true }, "box"],
      [{ x: 6, y: 5, down: false }, "box"],
      [{ x: 90, y: 5, down: false }, null],
    ])).toEqual(["box:pointerover", "box:pointerenter", "box:pointermove", "box:pointerdown", "box:pointerup", "box:click", "box:pointerout", "box:pointerleave"]);
  });
  test("no click when pressed on one part and let go on another", () => {
    expect(run([
      [{ x: 5, y: 5, down: true }, "a"],
      [{ x: 50, y: 5, down: true }, "b"],
      [{ x: 50, y: 5, down: false }, "b"],
    ]).filter((e) => !/drag|drop/.test(e))).toEqual(["a:pointerover", "a:pointerenter", "a:pointerdown", "a:pointerout", "a:pointerleave", "b:pointerover", "b:pointerenter", "b:pointerup"]);
  });
  test("the wheel goes to the part under the pointer, with the DOM's deltas", () => {
    const r = events3d({ hover: "a", down: null, pointer: { x: 1, y: 1, down: false } }, { x: 1, y: 1, down: false }, "a", [0, 0, 0], { x: 0, y: -3 });
    expect(r.events.get("a")).toEqual([{ type: "wheel", x: 1, y: 1, button: 0, point: [0, 0, 0], deltaX: 0, deltaY: -3 }]);
  });
});

describe("drag and drop on parts, as Bevy picking's Drag* events by the web's names (S2c)", () => {
  test("a press that moves drags the part pressed; the part under it is entered, gone over, dropped on and left", () => {
    const evs = run([
      [{ x: 5, y: 5, down: false }, "a"],
      [{ x: 5, y: 5, down: true }, "a"],
      [{ x: 8, y: 5, down: true }, "a"],
      [{ x: 50, y: 5, down: true }, "b"],
      [{ x: 52, y: 5, down: true }, "b"],
      [{ x: 52, y: 5, down: false }, "b"],
    ]).filter((e) => /drag|drop/.test(e));
    // each part's own events in order (a frame calls each part's handlers in turn)
    expect(evs.filter((e) => e.startsWith("a:"))).toEqual(["a:dragstart", "a:drag", "a:drag", "a:drag", "a:dragend"]);
    expect(evs.filter((e) => e.startsWith("b:"))).toEqual(["b:dragenter", "b:dragover", "b:drop", "b:dragleave"]);
  });
  test("a press that doesn't move is no drag; a drag over nothing ends with no drop", () => {
    expect(run([
      [{ x: 5, y: 5, down: true }, "a"],
      [{ x: 5, y: 5, down: false }, "a"],
    ]).filter((e) => /drag|drop/.test(e))).toEqual([]);
    expect(run([
      [{ x: 5, y: 5, down: true }, "a"],
      [{ x: 90, y: 5, down: true }, null],
      [{ x: 90, y: 5, down: false }, null],
    ]).filter((e) => /drag|drop/.test(e))).toEqual(["a:dragstart", "a:drag", "a:dragend"]);
  });
  test("leaving one part for another mid-drag leaves the first; the events name the part dragged", () => {
    let last: Last = { hover: null, down: null };
    const out: string[] = [];
    for (const [p, hover] of [[{ x: 5, y: 5, down: true }, "a"], [{ x: 50, y: 5, down: true }, "b"], [{ x: 90, y: 5, down: true }, "c"]] as [P, string][]) {
      const r = events3d(last, p, hover, [0, 0, 0]);
      for (const [id, evs] of r.events) for (const e of evs) if (e.dragged) out.push(`${id}:${e.type}<${e.dragged}`);
      last = r.last;
    }
    expect(out).toEqual(["b:dragenter<a", "b:dragleave<a", "c:dragenter<a"]);
  });
});

describe("a 2D part's place, picked in frame px (S2c: <Sprite>, <Shape2D>)", () => {
  test("a rect about its centre, turned clockwise; a round part as its ellipse", () => {
    const r = { x: 100, y: 50, w: 40, h: 20, rotation: 0, z: 0, round: false };
    expect([onFlat({ x: 119, y: 59 }, r), onFlat({ x: 121, y: 50 }, r), onFlat({ x: 100, y: 61 }, r)]).toEqual([true, false, false]);
    // a quarter turn: 20 wide, 40 tall
    const t = { ...r, rotation: Math.PI / 2 };
    expect([onFlat({ x: 100, y: 69 }, t), onFlat({ x: 115, y: 50 }, t)]).toEqual([true, false]);
    const e = { ...r, round: true };
    expect([onFlat({ x: 119, y: 50 }, e), onFlat({ x: 118, y: 58 }, e)]).toEqual([true, false]);
  });
});

describe("the parts' bounds in the world", () => {
  test("a rotation [x, y, z] is placed as the engine turns it: Euler XYZ, the same matrix as its quaternion", () => {
    const r: [number, number, number] = [0.7, -0.4, 1.1];
    const a = local([1, 2, 3], r, 1), b = local([1, 2, 3], [0, 0, 0], 1, Quat.fromEuler("XYZ", ...r));
    expect(a.every((v, i) => Math.abs(v - b[i]) < 1e-12)).toBe(true);
  });

  test("a box turned a quarter about y swaps its x and z extents; under a parent it moves with it", () => {
    const m = local([1, 0, 0], [0, Math.PI / 2, 0], 1);
    const b = worldBounds("b", m, { box: [[-2, -0.5, -0.25], [2, 0.5, 0.25]] });
    if (!("box" in b)) throw new Error("a box");
    expect(b.box.min.map((v) => +v.toFixed(9))).toEqual([0.75, -0.5, -2]);
    expect(b.box.max.map((v) => +v.toFixed(9))).toEqual([1.25, 0.5, 2]);
    const c = worldBounds("c", under(local([0, 3, 0], [0, 0, 0], 2), local([1, 0, 0], [0, 0, 0], 1)), { radius: 0.5 });
    expect(c).toEqual({ name: "c", sphere: { center: [2, 3, 0], radius: 1 } });
  });
  test("the engine's Euler order: Rx Ry Rz (scene3d.rs local; its rows' YXZ rot_x/rot_y/rot_z are read back from the world)", () => {
    const m = local([0, 0, 0], [0.3, 0.7, 0], 1);
    // +Z turned about y first, then x, as Quat::from_euler(EulerRot::XYZ, x, y, z) turns it
    const z = [m[8], m[9], m[10]];
    expect(z.map((v) => +v.toFixed(9))).toEqual([Math.sin(0.7), -Math.sin(0.3) * Math.cos(0.7), Math.cos(0.3) * Math.cos(0.7)].map((v) => +v.toFixed(9)));
    expect(worldBounds("i", IDENTITY, { radius: 1 })).toEqual({ name: "i", sphere: { center: [0, 0, 0], radius: 1 } });
  });
  test("the nearer of two parts under the pointer is the one picked", () => {
    const cam = { position: [0, 0, 5] as [number, number, number], lookAt: [0, 0, 0] as [number, number, number], fov: 50 };
    const near = worldBounds("near", local([0, 0, 1], [0, 0, 0], 1), { radius: 0.5 });
    const far = worldBounds("far", local([0, 0, -1], [0, 0, 0], 1), { box: [[-1, -1, -1], [1, 1, 1]] });
    expect(pick({ x: 50, y: 50 }, cam, [far, near], { width: 100, height: 100 })?.name).toBe("near");
  });
  test("a camera in a page element picks in its box: the box's centre is the view's, outside it nothing", () => {
    const cam = { position: [0, 0, 5] as [number, number, number], lookAt: [0, 0, 0] as [number, number, number], fov: 50 };
    const ball = worldBounds("ball", IDENTITY, { radius: 0.5 });
    const frame = { width: 1000, height: 600 };
    const box = [600, 100, 300, 200];
    // the frame's centre is off the box (the whole-frame pick would hit the ball there)
    expect(pickIn({ x: 500, y: 300 }, cam, [ball], frame)?.name).toBe("ball");
    expect(pickIn({ x: 500, y: 300 }, cam, [ball], frame, box)).toBeNull();
    expect(pickIn({ x: 750, y: 200 }, cam, [ball], frame, box)?.name).toBe("ball");
    expect(pickIn({ x: 610, y: 110 }, cam, [ball], frame, box)).toBeNull();
  });
});

describe("a part is picked by its geometry's bounds (FC1b: worked out only for a part with handlers)", () => {
  test("a Mesh3d with an onClick is pickable as its Sphere, placed; one without handlers isn't", () => {
    const el = (
      <>
        <Mesh3d name="ball" transform={{ translation: [1, 2, 3] }} onClick={() => {}}>
          <Sphere radius={2} />
          <StandardMaterial />
        </Mesh3d>
        <Mesh3d name="still" transform={{ translation: [5, 0, 0] }}>
          <Sphere radius={1} />
          <StandardMaterial />
        </Mesh3d>
      </>
    );
    renderFrame(el, { frame: 0, width: 320, height: 240, fps: 30, durationInFrames: 30 });
    const parts = pickable3d();
    expect(parts.get("ball")).toEqual({ name: "ball", sphere: { center: [1, 2, 3], radius: 2 } });
    expect(parts.has("still")).toBe(false);
  });

  test("a Cone's bounds span its height, centred on its origin as it's drawn (#98)", () => {
    renderFrame(
      <Mesh3d name="cone" onClick={() => {}}>
        <Cone radius={0.5} height={2} />
        <StandardMaterial />
      </Mesh3d>,
      { frame: 0, width: 320, height: 240, fps: 30, durationInFrames: 30 },
    );
    expect(pickable3d().get("cone")).toEqual({ name: "cone", box: { min: [-0.5, -1, -0.5], max: [0.5, 1, 0.5] } });
  });
});
