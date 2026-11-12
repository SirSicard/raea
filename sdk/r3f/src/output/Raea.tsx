// <Raea>: a raea composition's 3D inside React Three Fiber. Its component renders as it does under raea (into a page
// of its own, off screen, at its frame), and the three.js host (../three) draws that page's parts into R3F's scene: its
// meshes, materials, lights, models and camera, the same units and shapes raea's engine draws. Its frame follows R3F's
// clock (`fps` frames a second from mount) unless `frame` is given; `camera` makes its camera R3F's, `settings` its
// tone mapping, shadows, fog and environment the canvas's.
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type ComponentType } from "react";
import { flushSync } from "react-dom";
import { createRoot, type Root } from "react-dom/client";
import * as THREE from "three";
import { Clock } from "@raea/app/clock";
import { Scene3d } from "../three/scene";
import { backgroundUnder3d } from "../three/page";
import { Effects } from "../three/effects";

export interface RaeaProps<P extends object = Record<string, never>> {
  /** the composition's component (what <Composition component> takes) */
  component: ComponentType<P>;
  /** its props */
  props?: P;
  /** its size, frame rate and length (a <Composition>'s): the size its camera's aspect and 2D parts follow */
  width?: number;
  height?: number;
  fps?: number;
  durationInFrames?: number;
  /** the frame to show; by default it plays from 0 at `fps`, looping over `durationInFrames` */
  frame?: number;
  /** make its camera R3F's camera (true by default) */
  camera?: boolean;
  /** put its tone mapping, exposure, shadows, fog and environment on the canvas (true by default) */
  settings?: boolean;
  /** draw the frame effects it asks for (Bloom, DepthOfField, Grade, Look, a lens ...) with three's EffectComposer,
   * which then draws the canvas (true by default); false leaves them to your own composer through onEffects */
  effects?: boolean;
  /** the frame effects it asks for, each time they change */
  onEffects?: (effects: Scene3d["effects"]) => void;
}

export function Raea<P extends object>({ component: C, props, width, height, fps = 30, durationInFrames = 300, frame, camera = true, settings = true, effects: drawEffects = true, onEffects }: RaeaProps<P>) {
  const { gl, size, set, scene: canvasScene, invalidate } = useThree();
  const host = useMemo(() => new Scene3d(), []);
  const page = useMemo(() => document.createElement("div"), []);
  const root = useRef<Root | null>(null);
  const shown = useRef(-1);
  const time = useRef(0);
  const effects = useRef("");
  const composer = useMemo(() => new Effects(gl), [gl]);
  useEffect(() => () => composer.dispose(), [composer]);
  const under = useRef<string | undefined>(undefined);

  useEffect(() => {
    root.current = createRoot(page);
    host.onLoad = () => invalidate();
    return () => {
      const r = root.current;
      root.current = null;
      // unmounted after this commit, not inside it
      queueMicrotask(() => r?.unmount());
    };
  }, [page, host, invalidate]);

  // the composition's size in whole pixels (a canvas laid out by CSS can be a fraction wide; the clock takes integers)
  const w = Math.max(1, Math.round(width ?? size.width)), h = Math.max(1, Math.round(height ?? size.height));

  useFrame((_state, dt) => {
    if (!root.current) return;
    time.current += dt;
    const f = frame ?? Math.floor(time.current * fps) % durationInFrames;
    if (f !== shown.current) {
      shown.current = f;
      flushSync(() =>
        root.current!.render(
          <Clock frame={f} fps={fps} width={w} height={h} durationInFrames={durationInFrames}>
            <C {...(props as P)} />
          </Clock>,
        ),
      );
      host.sync(page, f / fps);
      under.current = backgroundUnder3d(page);
      const e = JSON.stringify(host.effects);
      if (onEffects && e !== effects.current) {
        effects.current = e;
        onEffects(host.effects);
      }
    }
    host.fit(size.width, size.height);
    if (camera && host.camera !== _state.camera) set({ camera: host.camera as THREE.PerspectiveCamera });
    if (settings) {
      host.apply(gl);
      canvasScene.fog = host.scene.fog;
      canvasScene.environment = host.scene.environment;
      canvasScene.environmentIntensity = host.scene.environmentIntensity;
      canvasScene.environmentRotation.copy(host.scene.environmentRotation);
      if (host.scene.background) {
        canvasScene.background = host.scene.background;
        canvasScene.backgroundIntensity = host.scene.backgroundIntensity;
        canvasScene.backgroundRotation.copy(host.scene.backgroundRotation);
      } else if (under.current) {
        // the page's background behind its 3D, as raea clears to it
        if (!(canvasScene.background instanceof THREE.Color)) canvasScene.background = new THREE.Color();
        canvasScene.background.setStyle(under.current);
      }
    }
  });

  // after the frame's updates: through the composer when there are effects to draw, else as R3F would (a useFrame with
  // a priority makes the canvas this one's to draw)
  useFrame((state, dt) => {
    const cam = state.camera;
    const on = drawEffects && composer.set(host.effects, state.scene, cam, size.width, size.height, (cam.userData.focus as number) ?? 10, settings && host.settings.tony);
    if (on) composer.render(state.scene, dt);
    else state.gl.render(state.scene, cam);
  }, 1);

  return <primitive object={host.scene} />;
}
