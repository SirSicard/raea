// MC2's cases (docs/match-cuts.feature): every plan check passes on good.chain.ts, and each cheat below, good.chain.ts with one
// thing changed, fails the check it names and no other. `bun cheats.ts` in the bench's copy; exit 1 on a miss.
import good from "./good.chain";
import { chain, planned, type Chain, type Hook, type Placed } from "./checks/match-cuts/chain";

/** good with shot `i` (by its name) changed */
const shot = (name: string, f: (s: Placed) => Partial<Placed>, top: Partial<Chain> = {}): Chain =>
  chain({ ...good, ...top, shots: good.shots.map((s) => (s.name === name ? { ...s, ...f(s) } : s)) });
const hook = (h: Hook, more: Partial<Hook>): Hook => ({ ...h, ...more });

export const CHEATS: { fails: string; what: string; chain: Chain }[] = [
  { fails: "hooks", what: "a hook that says nothing of what the eye is on", chain: shot("bus", (s) => ({ out: hook(s.out, { what: "" }) })) },
  { fails: "length", what: "the chain a second short of the piece", chain: chain({ ...good, length: 13 }) },
  { fails: "lands", what: "the rain lands on the upper left, the steam left the eye upper right", chain: shot("window", (s) => ({ in: hook(s.in, { at: "TL" }) })) },
  { fails: "lands", what: "a full cut into a shot that doesn't start filled", chain: shot("crema", (s) => ({ in: hook(s.in, { at: "CC" }) })) },
  { fails: "glyph", what: "a graphic cut from steam to a circle", chain: shot("window", (s) => ({ in: hook(s.in, { glyph: "circle" }) })) },
  { fails: "motion", what: "the cyclist rides left out of a tram going right", chain: shot("street", (s) => ({ in: hook(s.in, { move: "left" }) })) },
  { fails: "carry", what: "the eye moves from the lid to the steam with nothing carrying it", chain: shot("kitchen", () => ({ carry: undefined })) },
  { fails: "hard", what: "a hard cut on nothing", chain: shot("office", () => ({ on: undefined })) },
  { fails: "beats", what: "the montage's last cut off the beat", chain: chain({ ...good, shots: good.shots.map((s) => (s.name === "dial" ? { ...s, seconds: 0.4 } : s.name === "record" ? { ...s, seconds: 0.6 } : s)) }) },
  { fails: "beats", what: "an eye-trace cut in a chain with no beats", chain: chain({ ...good, beats: undefined }) },
  { fails: "bridge", what: "a J bridge longer than the shot it plays under", chain: shot("bus", (s) => ({ bridge: { ...s.bridge!, seconds: 0.75 } })) },
  { fails: "bridge", what: "a sound cut with no sound carried", chain: shot("bus", () => ({ bridge: undefined })) },
  { fails: "montage", what: "a montage of two shots", chain: shot("record", () => ({ montage: undefined })) },
  { fails: "loop", what: "the loop back from a square to the kettle's circle", chain: shot("office", (s) => ({ out: hook(s.out, { glyph: "rect" }) })) },
];

if (import.meta.main) {
  let bad = 0;
  const all = planned(good);
  const passed = all.every((r) => !r.fails.length);
  if (!passed) bad++;
  console.log(`${passed ? "ok  " : "FAIL"} good.chain.ts: ${all.filter((r) => !r.fails.length).length} of ${all.length} plan checks pass`);
  for (const r of all.filter((r) => r.fails.length)) console.log(`       ${r.id}: ${r.fails.join("; ")}`);
  for (const c of CHEATS) {
    const failed = planned(c.chain).filter((r) => r.fails.length);
    const ok = failed.length === 1 && failed[0].id === c.fails;
    if (!ok) bad++;
    console.log(`${ok ? "ok  " : "FAIL"} ${c.what}: fails ${failed.map((r) => r.id).join(", ") || "nothing"} (want ${c.fails})`);
    for (const r of failed) console.log(`       ${r.id}: ${r.fails.join("; ")}`);
  }
  process.exit(bad ? 1 : 0);
}
