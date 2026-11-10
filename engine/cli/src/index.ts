// @raea/cli: the agent shell's own verbs of `raea` (init, cut, frame, part, brand), the project's files for editing video
// as a React + TypeScript project. The native raea runs this handler for the verbs in its SHELL list (motion.rs shell(),
// through src/native.ts on its JavaScriptCore); what needs perception, ffmpeg or raea's API is asked of `host`
// (native.ts answers it), and every other verb is the engine's own command line (`engine`: the native `raea`), so there
// is one `raea`, and its help is the native one. Every command prints what a person would read; files hold the rest.
import { REGISTRY, TEMPLATE } from "./registry.gen";
import { FEATURE_DIRS, featureLayout } from "./layout";

/** The host's answer to an op (src/native.ts answers shape, cut, frame and brand). Throws when there's no host. */
export type Host = (op: string, args: Record<string, unknown>) => any;

/** The engine's own command line (the native `raea`: render FILE.tsx, play, guide, song, add PKG ...), run in the shell's
 * folder. The shell gives it; without one, those verbs say so. */
export type Engine = (args: string[], ctx: unknown) => Promise<{ stdout: string; stderr: string; exitCode: number }>;

type Fs = {
  exists(p: string): Promise<boolean>;
  readFile(p: string, enc?: string): Promise<string>;
  writeFile(p: string, data: string): Promise<void>;
  mkdir(p: string, o?: { recursive?: boolean }): Promise<void>;
};
type Ctx = { cwd: string; fs: Fs };
const out = (stdout: string, exitCode = 0, stderr = "") => ({ stdout, stderr, exitCode });
// `raea library` (library.ts), kept apart from the imports above
import { libraryVerb } from "./library";
// `raea show` (show.ts): what a session shows the person, in the raea app
import { showVerb } from "./show";

function flag(args: string[], name: string): string | undefined {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
}

const clean = (args: string[], ...withValue: string[]) =>
  args.filter((a, i) => !a.startsWith("--") && !withValue.includes(args[i - 1] ?? ""));

/** A clip of a take: seconds in the take's own time, and the line it carries. */
export interface Cut {
  take: string;
  file: string;
  from: number;
  to: number;
  line: string;
}

/** cuts.ts from the clips: data the edit imports (each take's file as a module, so the bundler finds the media). */
/** audio-only takes (`raea cut`): a voice-over cut by its words, played as <Audio>; the edit's picture is the person's */
export const AUDIO = ["wav", "mp3", "m4a", "aac", "flac", "aif", "aiff", "ogg", "opus"];

export function cutsModule(clips: Cut[], edit: { width: number; height: number; fps: number }): string {
  const files = [...new Set(clips.map((c) => c.file))];
  const id = (f: string) => "m_" + f.replace(/\W/g, "_");
  const kind = (f: string) => (AUDIO.includes(f.split(".").pop()!.toLowerCase()) ? "audio" : "video");
  const rows = clips.map((c) => `  { take: ${JSON.stringify(c.take)}, src: ${id(c.file)}, kind: "${kind(c.file)}", from: ${c.from.toFixed(3)}, to: ${c.to.toFixed(3)}, line: ${JSON.stringify(c.line)} },`);
  return `// written by \`raea cut\`: the clips, in order, in each take's own seconds. Re-run raea cut to change them, or edit
// by hand (the edit reads only this file). cuts.json beside it is the same list for raea's checks.
${files.map((f) => `import ${id(f)} from ${JSON.stringify("./" + f)};`).join("\n")}

export const edit = ${JSON.stringify(edit)};
export type Cut = { take: string; src: string; kind?: "audio" | "video"; from: number; to: number; line: string };
export const cuts: Cut[] = [
${rows.join("\n")}
];
/** a clip's length in the edit's frames */
export const frames = (c: Cut) => Math.max(1, Math.round((c.to - c.from) * edit.fps));
/** the cuts end to end, in frames */
export const total = cuts.reduce((n, c) => n + frames(c), 0);
`;
}

const NOTES = `# This project

A video edit as a React + TypeScript project, rendered by raea.

- edit.tsx: the composition. Change anything: layout, timing, which component plays when.
- cuts.ts: the clips (\`raea cut\` writes it, with cuts.json and words.json beside it; re-run it rather than editing
  by hand, or captions and checks lose their timing). components/: parts you added (\`raea part add\`), yours to change.
- brand/brand.css: the brand's tokens (\`raea brand DOMAIN\` reads them from the brand's site). edit.tsx loads them with the project's
  Tailwind: \`<style>{css}</style>\`, css from "./styles.gen" (raea render writes it). Style only with the brand
  classes: colour text-brand-accent, bg-brand-accent, bg-brand-surface (bg-brand-bg), text-brand-on-surface,
  text-brand-on-accent, text-brand-ink, brand-1/2/3; face font-brand, font-brand-body; size text-display,
  text-title, text-caption, text-body, text-label (scaled for a 1080-wide frame); corners rounded-brand. Where a
  class can't reach, the --brand-* variables. Never a colour, font or size of your own.
- \`raea render edit.tsx -o final.mp4 --manifest render.json\`, then \`raea check final.mp4 --manifest render.json
  --words words.json --perception perception.json\` says what's wrong; \`raea render edit.tsx --at 105 -o stills/\`
  gives frame 105 to look at. \`raea guide\` has the craft (\`raea guide motion\` for writing the TSX);
  \`raea help\` lists the rest.

## raea (everything there is; import from "raea")

Time: useCurrentFrame() (frames, from 0 inside the nearest Sequence), useVideoConfig() {width, height, fps,
durationInFrames}, interpolate(frame, [in...], [out...], {extrapolateLeft, extrapolateRight: "clamp", easing}),
spring({frame, fps, config}), Easing.bezier(a, b, c, d) / Easing.inOut(...).
Layout: <AbsoluteFill>, <Sequence from durationInFrames>, <Series><Series.Sequence durationInFrames>, <Loop>, <Freeze>.
Media: <Video src startFrom endAt volume playbackRate muted framing="face" punchIn style> (framing="face" keeps the
eyes 38% down as the speaker moves; an objectPosition or transform turns it off), <Audio src startFrom endAt volume={n | (f) => n} gainDb fadeIn fadeOut>,
<Img src>. Media files import as modules: import take from
"./media/x.mov". Sound: music in Tone.js (import * as Tone from "raea/tone"): instruments in a Tone.Sampler
playing a Part or Sequence, the instrument's notes from Tone.tokensynth("a warm upright bass", ["C2", "C3", "C4"]) or a
sample library (\`raea sounds\`); sao("prompt", {seconds}) for an effect, as an <Audio src>; narration
is <Speech text start> from raea/speech (Pocket TTS). All of it local. <Mix lufs ceiling> masters the sound.
Words: useWords() -> [{text, from, to}] (frames, the cuts' words), word("phrase") -> the frame it's said,
findPhrase(words, "phrase", {occurrence, edge: "start" | "end"}).
Placement: <Region name="top" | "bottom" | "center" | "auto" | "full"> keeps a part in a band clear of the face and
the platforms' buttons; useRegion() gives its box.
Composition: registerRoot(() => <Composition id component width height fps durationInFrames />).
Not there: React hooks come from "react" (useMemo, useState), not from raea.
`;

/** The `raea` command's handler (the shell wraps it with just-bash's defineCommand, so this package needs no dependency). */
export function raeaHandler(host?: Host, engine?: Engine) {
  return async (args: string[], ctx: unknown) => {
    const c = ctx as unknown as Ctx;
    const p = (rel: string) => (rel.startsWith("/") ? rel : `${c.cwd.replace(/\/$/, "")}/${rel}`);
    const ask = (op: string, a: Record<string, unknown> = {}) => {
      if (!host) throw new Error(`raea ${op} needs a host (the native raea's src/native.ts); this shell has none`);
      return host(op, a);
    };
    const text = (v: unknown) => (typeof v === "string" ? v : JSON.stringify(v, null, 2)) + "\n";
    const native = (a: string[] = args) => {
      if (!engine) throw new Error(`raea ${a[0]} is the engine's (the native raea), and this shell has none`);
      return engine(a, ctx);
    };
    // a set is a folder of examples/parts (`raea part add reel` copies it whole); a part is one file of a set that says
    // `// raea part add NAME: ...` at its top, and copies alone
    const said = (src: string) => (/^\/\/ raea part add [\w-]+: (.*)$/m.exec(src)?.[1] ?? "").split(". ")[0];
    const single = (n: string) => Object.values(REGISTRY).map((set) => set[`${n}.tsx`]).find((src) => src && new RegExp(`^// raea part add ${n}:`, "m").test(src));
    const parts = () =>
      Object.entries(REGISTRY)
        .flatMap(([set, files]) => [
          `${set.padEnd(14)} the whole set, ${Object.keys(files).length} files, into components/${set}/`,
          ...Object.entries(files).filter(([f, src]) => single(f.replace(/\.tsx$/, "")) === src).map(([f, src]) => `${f.replace(/\.tsx$/, "").padEnd(14)} ${said(src)}`),
        ])
        .join("\n") + "\n";
    try {
      switch (args[0]) {
        // the native raea's help lists the shell's verbs with its own: one list
        case undefined:
        case "help":
        case "--help":
          return await native(["help"]);
        case "init": {
          const made: string[] = [];
          const put = async (name: string, body: string) => {
            if (await c.fs.exists(p(name))) return;
            await c.fs.writeFile(p(name), body);
            made.push(name);
          };
          const shape = ask("shape", {}) as { width: number; height: number; fps: number };
          // by feature, as a Bevy project is (S5a): opt-in until it's the default
          if (args.includes("--layout") && args[args.indexOf("--layout") + 1] !== "feature") return out("", 2, "raea init [--layout feature]\n");
          if (args.includes("--layout")) {
            for (const d of FEATURE_DIRS) await c.fs.mkdir(p(d), { recursive: true });
            const name = c.cwd.replace(/\/$/, "").split("/").pop() || "project";
            for (const [f, body] of Object.entries(featureLayout(name, shape))) await put(f, body);
            return out(made.length ? `made ${made.join(", ")}; render it with raea render src/main.tsx\n` : "nothing to make: the project's files are here\n");
          }
          await c.fs.mkdir(p("components"), { recursive: true });
          await put("edit.tsx", TEMPLATE["edit.tsx"]);
          await put("cuts.ts", cutsModule([], shape));
          await put("styles.gen.ts", `export const css = "";\n`);
          // AGENTS.md is raea's own notes: an older generated copy (it opens with this header) is brought up to date, a
          // person's own file is left alone
          const notes = p("AGENTS.md");
          if (await c.fs.exists(notes)) {
            const was = await c.fs.readFile(notes, "utf8");
            if (was !== NOTES && was.startsWith("# This project\n\nA video edit as a React + TypeScript project")) {
              await c.fs.writeFile(notes, NOTES);
              made.push("AGENTS.md (updated)");
            }
          } else await put("AGENTS.md", NOTES);
          return out(made.length ? `made ${made.join(", ")}\n` : "nothing to make: the project's files are here\n");
        }
        case "part": {
          if (args[1] === "list" || args[1] === undefined) return out(parts());
          if (args[1] !== "add") return out("", 2, "raea part list | raea part add NAME ... [--force]\n");
          const names = clean(args.slice(2));
          if (!names.length) return out("", 2, "raea part add NAME ...  (raea part list shows them)\n");
          const force = args.includes("--force");
          await c.fs.mkdir(p("components"), { recursive: true });
          const done: string[] = [];
          for (const n of names) {
            const set = REGISTRY[n];
            if (set) {
              // a set is the project's own once copied: never overwritten unasked, and said so loudly
              const dir = `components/${n}`;
              if (!force && (await c.fs.exists(p(dir)))) return out(done.join(""), 1, `raea part add: ${dir}/ is already here (yours now; --force replaces its files)\n`);
              await c.fs.mkdir(p(dir), { recursive: true });
              for (const [f, src] of Object.entries(set)) await c.fs.writeFile(p(`${dir}/${f}`), src);
              done.push(`${dir}/  ${Object.keys(set).length} files; import from "./${dir}"\n`);
              continue;
            }
            const src = single(n);
            if (!src) return out(done.join(""), 1, `raea part add: no part or set "${n}" (raea part list shows them)\n`);
            const dest = p(`components/${n}.tsx`);
            if (!force && (await c.fs.exists(dest))) {
              done.push(`components/${n}.tsx is already here (yours now; --force replaces it)\n`);
              continue;
            }
            await c.fs.writeFile(dest, src);
            done.push(`components/${n}.tsx  import it: import ${n.replace(/(^|-)(\w)/g, (_, __, ch) => ch.toUpperCase())} from "./components/${n}";\n`);
          }
          return out(done.join(""));
        }
        // `add` is npm packages (the engine's package manager); a registry part's name is pointed at `raea part add`
        case "add": {
          const r = await native();
          const part = clean(args.slice(1)).find((n) => REGISTRY[n] || single(n));
          return r.exitCode && part ? { ...r, stderr: r.stderr + `(a raea part? raea part add ${part})\n` } : r;
        }
        case "cut": {
          const spans: number[][] = [];
          args.forEach((a, i) => {
            if (a === "--at" && args[i + 1]) {
              const m = /^(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)$/.exec(args[i + 1]);
              if (m) spans.push([Number(m[1]), Number(m[2])]);
            }
          });
          const [take, ...lines] = clean(args.slice(1), "--at");
          if (!take || (!lines.length && !spans.length)) return out("", 2, `raea cut TAKE "line" ["line" ...] | --at A-B [--at C-D ...] [--append]\n`);
          const prev: Cut[] = args.includes("--append") && (await c.fs.exists(p("cuts.json"))) ? JSON.parse(await c.fs.readFile(p("cuts.json"), "utf8")).cuts : [];
          const r = ask("cut", { take, lines, spans, keep: prev }) as { edit: { width: number; height: number; fps: number }; cuts: Cut[]; words: unknown[]; perception?: unknown; said: string };
          await c.fs.writeFile(p("cuts.ts"), cutsModule(r.cuts, r.edit));
          await c.fs.writeFile(p("cuts.json"), JSON.stringify({ edit: r.edit, cuts: r.cuts }, null, 2) + "\n");
          await c.fs.writeFile(p("words.json"), JSON.stringify(r.words) + "\n");
          // where the face and the safe band are in the edit, for <Region> and the checks (a host may not see faces)
          if (r.perception) await c.fs.writeFile(p("perception.json"), JSON.stringify(r.perception) + "\n");
          return out(r.said.endsWith("\n") ? r.said : r.said + "\n");
        }
        case "frame": {
          const take = clean(args.slice(1), "--at")[0];
          if (!take) return out("", 2, "raea frame TAKE [--at SECONDS]\n");
          const at = flag(args, "--at");
          return out(text(ask("frame", { take, at: at === undefined ? undefined : Number(at) })));
        }
        case "brand": {
          const q = clean(args.slice(1)).join(" ");
          if (!q) return out("", 2, "raea brand DOMAIN|URL  (stripe.com, or the site's URL: read on this machine)\n");
          return out(text(ask("brand", { brand: q })));
        }
        case "library":
          return out(libraryVerb(ask, args.slice(1), (globalThis as { process?: { env: Record<string, string | undefined> } }).process?.env ?? {}));
        case "show":
          return out(showVerb(ask, args.slice(1), c.cwd, (globalThis as { process?: { env: Record<string, string | undefined> } }).process?.env ?? {}));
        default:
          return await native();
      }
    } catch (e) {
      return out("", 1, `raea ${args[0] ?? ""}: ${String((e as Error)?.message ?? e)}\n`);
    }
  };
}
