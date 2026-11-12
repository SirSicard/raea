// arcTo draws the corner's short arc, as a browser does (#97): one quarter circle between the tangent points for a
// right angle, whichever way the corner turns, never three quarters of the circle through the far side.
import { describe, expect, test } from "bun:test";
import { CanvasRenderingContext2D_ } from "../src/canvas/context";
import { C } from "../src/canvas/paths";

function path(build: (c: CanvasRenderingContext2D_) => void): number[] {
  const c = new CanvasRenderingContext2D_({ width: 100, height: 100 } as any);
  c.beginPath();
  build(c);
  return (c as any).path.d as number[];
}

/** The path's commands, with each cubic's end point. */
function cubics(d: number[]): [number, number][] {
  const out: [number, number][] = [];
  for (let i = 0; i < d.length; ) {
    const op = d[i];
    const len = op === C ? 6 : op === 4 ? 0 : op === 2 ? 4 : 2;
    if (op === C) out.push([d[i + 5], d[i + 6]]);
    i += 1 + len;
  }
  return out;
}

const near = (p: [number, number], q: [number, number]) => {
  expect(p[0]).toBeCloseTo(q[0], 6);
  expect(p[1]).toBeCloseTo(q[1], 6);
};

describe("arcTo", () => {
  test("a corner turning clockwise on screen is one quarter arc", () => {
    const arcs = cubics(path((c) => { c.moveTo(0, 0); c.arcTo(10, 0, 10, 10, 5); }));
    expect(arcs.length).toBe(1);
    near(arcs[0], [10, 5]);
  });

  test("the mirrored corner, turning the other way, is one quarter arc too", () => {
    const arcs = cubics(path((c) => { c.moveTo(0, 0); c.arcTo(10, 0, 10, -10, 5); }));
    expect(arcs.length).toBe(1);
    near(arcs[0], [10, -5]);
  });

  test("a rounded rectangle drawn with four arcTo corners has four quarter arcs", () => {
    const arcs = cubics(path((c) => {
      c.moveTo(20, 10);
      c.arcTo(90, 10, 90, 90, 10);
      c.arcTo(90, 90, 10, 90, 10);
      c.arcTo(10, 90, 10, 10, 10);
      c.arcTo(10, 10, 90, 10, 10);
    }));
    expect(arcs.length).toBe(4);
    near(arcs[0], [90, 20]);
    near(arcs[1], [80, 90]);
    near(arcs[2], [10, 80]);
    near(arcs[3], [20, 10]);
  });
});
