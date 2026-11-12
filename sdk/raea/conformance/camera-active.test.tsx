// <Camera3d is_active> (Bevy's Camera is_active, docs/rerender.feature RR2): a camera not drawing this frame is the
// camera alone, marked inactive, without its lens or ambient, so the scene knows which of its cameras is the piece's.
import { expect, test } from "bun:test";
import type { ReactElement } from "react";
import { Camera3d } from "raea/camera";
import { DepthOfField } from "raea/3d";
import { AmbientLight } from "raea/light";
import { Transform } from "raea/transform";

type El = ReactElement<Record<string, unknown>>;
const at = Transform.fromXyz(0, 1, 5);
const kids = (e: El) => ([] as unknown[]).concat((e.props as { children?: unknown }).children).filter(Boolean) as El[];

test("is_active={false}: the camera alone, marked, with no lens, ambient or children", () => {
  const off = Camera3d({ transform: at, is_active: false, children: [<DepthOfField key="d" aperture_f_stops={2} />, <AmbientLight key="a" brightness={50} />] }) as El;
  expect(off.props.active).toBe(false);
  expect(off.props).toHaveProperty("lookAt");
  expect(off.props.children).toBeUndefined();
  const ortho = Camera3d({ transform: at, is_active: false, projection: { Orthographic: { scaling_mode: { FixedVertical: { viewport_height: 4 } } } } }) as El;
  expect(ortho.props.active).toBe(false);
});

test("active (the default, or is_active={true}): no marker, and its lens and ambient as before", () => {
  for (const is_active of [undefined, true]) {
    const on = Camera3d({ transform: at, is_active, children: [<DepthOfField key="d" aperture_f_stops={2} />, <AmbientLight key="a" brightness={50} />] }) as El;
    const parts = kids(on);
    const cam = parts.find((k) => "lookAt" in (k.props as object)) as El;
    expect(cam.props).not.toHaveProperty("active");
    expect(parts.length).toBe(3);
  }
});
