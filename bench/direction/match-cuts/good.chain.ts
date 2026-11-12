// MC2's chain (docs/match-cuts.feature): twelve seconds that use every join once or more, on 120 bpm's beats, and loop. The
// bench copies craft/match-cuts to checks/cuts beside it, as a project does; cuts.tsx is its graybox.
import { chain } from "./checks/match-cuts/chain";

const h = (what: string, at: import("./checks/match-cuts/chain").At, glyph: import("./checks/match-cuts/chain").Glyph, part: string, more: object = {}) => ({ what, at, glyph, part, ...more });

export default chain({
  title: "Morning",
  fps: 30,
  length: 12,
  aspect: [16, 9],
  beats: Array.from({ length: 25 }, (_, i) => i * 0.5),
  loop: true,
  shots: [
    // the loop's cut back into the first shot is graphic: the mug's circle at the centre to the kettle's lid there
    { name: "kitchen", scene: "kitchen", seconds: 2, in: h("the kettle's lid", "CC", "circle", "lid"), out: h("the steam", "TR", "streaks", "steam"), carry: "the steam rises to the upper right" },
    { name: "window", scene: "window", seconds: 2, cut: "graphic", in: h("rain on the glass", "TR", "streaks", "rain"), out: h("the tram passing below", "MR", "rect", "tram", { move: "right" }), carry: "a drop runs down the glass onto the tram" },
    { name: "street", scene: "street", seconds: 1.5, cut: "motion", in: h("a cyclist crossing", "MR", "rect", "cyclist", { move: "right" }), out: h("the stop's clock", "TL", "circle", "7:45"), carry: "the camera pans with the cyclist and tilts up to the clock" },
    { name: "cafe", scene: "cafe", seconds: 1.5, cut: "eye", on: "the downbeat at 5.5 s", in: h("the barista's face", "TL", "blob", "barista"), out: h("the cup, pushed into", "FULL", "rect", "cup"), carry: "the push into the cup until it fills the lens" },
    { name: "crema", scene: "cup", seconds: 1, cut: "full", in: h("the coffee filling the frame", "FULL", "blob", "coffee"), out: h("the crema's ring", "CC", "circle", "crema"), carry: "the pull back to the ring at the centre" },
    { name: "saucer", scene: "saucer", seconds: 0.5, cut: "graphic", montage: true, in: h("a saucer", "CC", "circle", "saucer"), out: h("a saucer", "CC", "circle", "saucer") },
    { name: "dial", scene: "clocktower", seconds: 0.5, cut: "graphic", montage: true, in: h("a clock's face", "CC", "circle", "dial"), out: h("a clock's face", "TC", "circle", "dial"), carry: "the tilt up hands the face to the upper third" },
    { name: "record", scene: "record shop", seconds: 0.5, cut: "graphic", montage: true, in: h("a record", "TC", "circle", "record"), out: h("a record", "TC", "circle", "record") },
    { name: "bus", scene: "bus", seconds: 1, cut: "sound", bridge: { kind: "J", sound: "brakes", seconds: 0.5 }, in: h("the bus doors", "ML", "rect", "doors"), out: h("the bus doors", "ML", "rect", "doors") },
    { name: "office", scene: "office", seconds: 1.5, cut: "hard", on: "the kick on the bar at 10.5 s", bridge: { kind: "L", sound: "doors", seconds: 0.5 }, in: h("the monitor", "BR", "rect", "monitor"), out: h("the mug on the desk", "CC", "circle", "mug"), carry: "the cursor drags the mug to the centre" },
  ],
});
