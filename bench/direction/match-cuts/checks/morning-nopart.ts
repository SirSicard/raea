// A cheat on the chain, not the render: the dial's out hook names no part, so nothing could measure it.
import { chain } from "./match-cuts/chain";
import { landsOnThirds } from "./match-cuts/thirds";
import morning from "../good.chain";

const { part: _, ...out } = morning.shots.find((s) => s.name === "dial")!.out;
export default landsOnThirds(chain({ ...morning, shots: morning.shots.map((s) => (s.name === "dial" ? { ...s, out } : s)) }), { id: "lands-on-thirds-nopart", plan: false });
