// A shot's frames rendered by the script's Blender (docs/blender.feature BL36): `raea blender shot` calls this after the
// script's default export has built the scene (or on a .blend as it opened), and <BlenderShot> through it. Blender
// writes OUT/0001.png on (its frame numbers); raea numbers them from 0000.png after.
import { blender } from "./blender";

export type ShotEngine = "eevee" | "cycles" | "workbench";

export interface ShootOptions {
  /** the folder the frames go into */
  out: string;
  frames: number;
  fps: number;
  width: number;
  height: number;
  /** eevee unless given */
  engine?: ShotEngine;
  /** EEVEE's or Cycles' render samples; the file's or Blender's own when not given */
  samples?: number;
  /** a picture with alpha where nothing is drawn (film_transparent, RGBA PNGs) */
  transparent?: boolean;
}

const ENGINES = { eevee: "BLENDER_EEVEE", cycles: "CYCLES", workbench: "BLENDER_WORKBENCH" } as const;

export async function shoot(o: ShootOptions): Promise<void> {
  const { bpy, py } = blender;
  const scene = bpy.context.scene;
  if (!(await py.exec<boolean>("result = bpy.context.scene.camera is not None"))) {
    throw new Error("the shot has no camera: the script sets bpy.context.scene.camera, or the .blend has one");
  }
  const engine = o.engine ?? "eevee";
  const r = scene.render;
  r.engine = ENGINES[engine];
  r.resolution_x = o.width;
  r.resolution_y = o.height;
  r.resolution_percentage = 100;
  r.fps = Math.round(o.fps);
  r.fps_base = Math.round(o.fps) / o.fps;
  r.film_transparent = !!o.transparent;
  r.image_settings.file_format = "PNG";
  r.image_settings.color_mode = o.transparent ? "RGBA" : "RGB";
  if (o.samples !== undefined) {
    if (engine === "cycles") await py.exec(`bpy.context.scene.cycles.samples = ${Math.max(1, Math.round(o.samples))}`);
    else if (engine === "eevee") scene.eevee.taa_render_samples = Math.max(1, Math.round(o.samples));
  }
  const start = await scene.frame_start;
  scene.frame_end = start + o.frames - 1;
  r.filepath = o.out.endsWith("/") ? o.out : `${o.out}/`;
  bpy.ops.render.render({ animation: true });
  // the render is sent without waiting, as every call is: a read after it returns once Blender has drawn every frame
  await scene.frame_end;
}
