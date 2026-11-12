// Video and Audio sound props, from spec/motion.feature ("Video and Audio"): gain above unity, gainDb, sub-frame fades.
import { expect, test } from "bun:test";
import { Audio, Loop, Sequence, Video } from "../src";
import { renderFrame } from "../src/test";

const base = { frame: 0, fps: 30, width: 1080, height: 1920, durationInFrames: 60 };
const attr = (html: string, name: string) => new RegExp(`${name}="([^"]*)"`).exec(html)?.[1];

test("volume above 1 is a gain, not an error", () => {
  const html = renderFrame(<Audio src="media/a.wav" volume={1.78} />, base);
  expect(Number(attr(html, "data-volume"))).toBeCloseTo(1.78, 3);
});

test("a negative volume fails", () => {
  expect(() => renderFrame(<Audio src="media/a.wav" volume={-0.1} />, base)).toThrow();
});

test("gainDb gives the linear volume and wins over volume", () => {
  const html = renderFrame(<Audio src="media/a.wav" volume={0.2} gainDb={5} />, base);
  expect(Number(attr(html, "data-volume"))).toBeCloseTo(Math.pow(10, 5 / 20), 3);
  const quiet = renderFrame(<Video src="media/v.mp4" gainDb={-6} />, base);
  expect(Number(attr(quiet, "data-volume"))).toBeCloseTo(Math.pow(10, -6 / 20), 3);
});

test("fades shorter than a frame are carried in seconds for the renderer", () => {
  const html = renderFrame(<Video src="media/v.mp4" fadeIn={0.012} fadeOut={0.012} />, base);
  expect(Number(attr(html, "data-fade-in"))).toBeCloseTo(0.012, 6);
  expect(Number(attr(html, "data-fade-out"))).toBeCloseTo(0.012, 6);
});

// #89: a fadeOut ends at its clip's end (its Sequence's, a Loop pass's, endAt), not after it. Each frame says the gain
// the mixer ramps to over the frame after it, so frame f is (end - f) / (fadeOut * fps), and the stop at the end is the
// mixer's 5 ms edge (data-fade-out 0): its last frame isn't 0, or the sound would be dropped a frame early
test("fadeOut fades inside its Sequence and is silent by its end", () => {
  // 1 s Sequence at 60 fps, fadeOut 0.5 s: full to frame 30, half at 45, 1/30 at 59, the clip's last
  const at = (frame: number) =>
    Number(attr(renderFrame(<Sequence from={0} durationInFrames={60}><Audio src="media/a.wav" fadeOut={0.5} /></Sequence>, { ...base, fps: 60, frame }), "data-volume"));
  expect(at(0)).toBe(1);
  expect(at(30)).toBe(1);
  expect(at(45)).toBeCloseTo(0.5, 6);
  expect(at(59)).toBeCloseTo(1 / 30, 6);
  const last = renderFrame(<Sequence durationInFrames={60}><Audio src="media/a.wav" fadeOut={0.5} /></Sequence>, { ...base, fps: 60, frame: 59 });
  expect(Number(attr(last, "data-fade-out"))).toBe(0);
});

test("fadeOut ends at endAt, at a Loop pass's end, and at the nearest of nested ends", () => {
  const vol = (el: any, frame: number) => Number(attr(renderFrame(el, { ...base, frame }), "data-volume"));
  // endAt 40 from startFrom 10 at rate 1: it stops at frame 30; fadeOut 0.5 s = 15 frames at 30 fps
  expect(vol(<Audio src="media/a.wav" startFrom={10} endAt={40} fadeOut={0.5} />, 22)).toBeCloseTo(8 / 15, 6);
  // a 20-frame Loop pass: frame 30 is pass 2's frame 10, 10 frames from its end
  expect(vol(<Loop durationInFrames={20}><Audio src="media/a.wav" fadeOut={0.5} /></Loop>, 30)).toBeCloseTo(10 / 15, 6);
  // the outer Sequence ends first
  const nested = <Sequence durationInFrames={30}><Sequence durationInFrames={50}><Audio src="media/a.wav" fadeOut={0.5} /></Sequence></Sequence>;
  expect(vol(nested, 20)).toBeCloseTo(10 / 15, 6);
  // no end: the gain as given, and the mixer fades it once it's gone
  expect(vol(<Audio src="media/a.wav" fadeOut={0.5} volume={0.8} />, 50)).toBeCloseTo(0.8, 6);
  expect(Number(attr(renderFrame(<Audio src="media/a.wav" fadeOut={0.5} />, base), "data-fade-out"))).toBe(0.5);
});
