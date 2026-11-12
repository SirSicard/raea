// A note as the person said it, restated as asks held by the match-cut render check (MC3), copied to checks/ by
// match-cuts.sh with the kit, as a project copies them.
import { note } from "raea/note";

export default note({
  words: ["Every cut should land where my eye already is."],
  from: "session",
  round: 1,
  asks: [
    { text: "every cut lands on the thirds place the last shot left the eye", about: "cuts", not: ["the shots' order"], verb: "recut", check: "../../checks/morning.ts" },
    { text: "every hook names the part that draws it", about: "cuts", not: ["the shots' order"], verb: "recut", check: "../../checks/morning-nopart.ts" },
  ],
});
