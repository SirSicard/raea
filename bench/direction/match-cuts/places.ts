// The places the board's library offers (MC4): two in the chain, one not.
import type { Place } from "./checks/match-cuts/chain";

export const PLACES: Place[] = [
  { id: "kitchen", title: "Kitchen at dawn", kind: "INT", about: "a kettle on a gas ring, steam in the window light", hooks: [{ what: "the kettle's lid", at: "CC", glyph: "circle" }, { what: "the steam", at: "TR", glyph: "streaks" }], props: ["kettle", "hob", "window"] },
  { id: "window", title: "Rain on a tram window", kind: "EXT", hooks: [{ what: "rain on the glass", at: "TR", glyph: "streaks" }, { what: "the tram", at: "MR", glyph: "rect", move: "right" }] },
  { id: "laundromat", title: "Laundromat", kind: "INT", about: "a row of dryers turning", hooks: [{ what: "a dryer's window", at: "TR", glyph: "circle" }] },
];
