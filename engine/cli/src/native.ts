// The agent shell's own verbs (init ...) on the native `raea`, which runs this file on its JavaScriptCore with Node's core
// (runtime/react/src/scene.rs shell(), raea_native::js::run_node), so each verb has one source: this package's handler.
// The host's ops it needs are answered here, one more with each verb ported (docs/agent-surfaces.md); the rest refuse.
//
//   native.ts RAEA VERB ARGS...    RAEA: the native raea's path, for the engine's own verbs
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, realpathSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, delimiter, dirname, extname } from "node:path";
import { brandKit } from "./brand";
import { readSite, stylesOf } from "./scrape";
import { wordsOf } from "./heard";
import { harness, library, show, task } from "./app";
import { AUDIO, raeaHandler, type Engine, type Host } from "./index";

const [raea, ...args] = process.argv.slice(2);
const cwd = process.cwd();
const at = (p: string) => (p.startsWith("/") ? p : `${cwd}/${p}`);

/** The project's shape: its cut's (cuts.json's edit), else a 1080x1920 vertical at 30 fps */
function shape() {
  const file = at("cuts.json");
  const edit = existsSync(file) ? (JSON.parse(readFileSync(file, "utf8")) as { edit?: { width?: number; height?: number; fps?: number } }).edit : undefined;
  return edit?.width && edit.height && edit.fps ? { width: edit.width, height: edit.height, fps: edit.fps } : { width: 1080, height: 1920, fps: 30 };
}

/** The engine's own verb run for its effect (`raea media still ...`); its answer, or why it refused */
function engineRun(a: string[]): string {
  const r = spawnSync(raea, a, { cwd, encoding: "utf8" });
  if (r.status !== 0) throw new Error(`raea ${a.join(" ")}: ${(r.stdout + r.stderr).trim()}`);
  return r.stdout;
}

/** The engine's own answer as JSON (`raea media probe|cuts ...`) */
const engineJson = (a: string[]): any => JSON.parse(engineRun(a));

const VIDEO = ["mp4", "mov", "m4v", "mkv", "webm"];
const isAudio = (p: string) => AUDIO.includes(extname(p).slice(1).toLowerCase());

/** Every take under media/: its path from the project's root */
function takes(): string[] {
  const out: string[] = [];
  const walk = (dir: string) => {
    for (const e of existsSync(at(dir)) ? readdirSync(at(dir), { withFileTypes: true }) : []) {
      const p = `${dir}/${e.name}`;
      if (e.isDirectory()) walk(p);
      else if (VIDEO.includes(extname(e.name).slice(1).toLowerCase()) || isAudio(e.name)) out.push(p);
    }
  };
  walk("media");
  return out.sort();
}

/** A take named by its path (with or without its extension), file name, stem or folder */
function takeOf(name: string): string {
  const t = name.trim().replace(/^\.?\//, "");
  const all = takes();
  const bare = (p: string) => p.slice(0, p.length - extname(p).length);
  const found = all.find((p) => p === t || bare(p) === t) ?? all.find((p) => basename(p) === t || basename(bare(p)) === t || p.endsWith(`/${t}`) || p.includes(`${t}/`));
  if (!found) throw new Error(`no take "${name}" under media/ (${all.join(", ") || "none"})`);
  return found;
}

type Word = { text: string; from: number; to: number };

/** A take's transcript: its words.json (TAKE.words.json, or words.json in its folder), [{text, start_ms, end_ms}] */
function wordsFile(take: string): string {
  const own = at(`${take.slice(0, take.length - extname(take).length)}.words.json`);
  const folder = at(`${dirname(take)}/words.json`);
  return existsSync(own) || !existsSync(folder) ? own : folder;
}

/** A take's words in its own seconds; with `hear`, a take with no transcript is transcribed first (parakeet-mlx, local),
 *  into TAKE.words.json, kept */
function words(take: string, hear = false): Word[] {
  const file = wordsFile(take);
  if (!existsSync(file)) {
    if (!hear) return [];
    hearTake(take, file);
  }
  return (JSON.parse(readFileSync(file, "utf8")) as { text: string; start_ms: number; end_ms: number }[])
    .filter((w) => w.text?.trim())
    .map((w) => ({ text: w.text.trim(), from: w.start_ms / 1000, to: w.end_ms / 1000 }));
}

/** A tool a clean Mac lacks, found or installed once by raea's tools/ensure.sh (docs/app.feature AP6), which sits in
 *  share/raea/tools beside a release's bin/raea, or in the tree a built raea is in; the bare name if there's none */
function ensure(name: string): string {
  const real = realpathSync(raea);
  const script = [`${dirname(real)}/../share/raea/tools/ensure.sh`, `${dirname(real)}/../../tools/ensure.sh`].find(existsSync);
  if (!script) return name;
  const r = spawnSync("bash", [script, name], { encoding: "utf8", stdio: ["ignore", "pipe", "inherit"] });
  return r.status === 0 && r.stdout.trim() ? r.stdout.trim() : name;
}

function hearTake(take: string, out: string) {
  const dir = mkdtempSync(`${tmpdir()}/raea-hear-`);
  try {
    const wav = `${dir}/take.wav`;
    const a = spawnSync(raea, ["media", "audio", at(take), "--rate", "16000", "--mono", "-o", wav], { encoding: "utf8" });
    if (a.status !== 0) throw new Error(`no sound to transcribe in ${take}: ${(a.stdout + a.stderr).trim()}`);
    const p = spawnSync(ensure("parakeet-mlx"), [wav, "--output-format", "json", "--output-dir", dir], { encoding: "utf8" });
    if (p.status !== 0) throw new Error(`transcribing ${take} needs parakeet-mlx (tools/ensure.sh installs it: ${(p.stderr ?? "").trim().split("\n").pop()}), or cut it by time: --at A-B`);
    const heard = JSON.parse(readFileSync(`${dir}/take.json`, "utf8")) as { sentences: { tokens: { text: string; start: number; end: number }[] }[] };
    const ws = heard.sentences.flatMap((s) => wordsOf(s.tokens)).map((w) => ({ text: w.text, start_ms: Math.round(w.start * 1000), end_ms: Math.round(w.end * 1000) }));
    writeFileSync(out, JSON.stringify(ws) + "\n");
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

/** Where to cut a take for each line: found word for word in its transcript, in order (a line that follows the last one
 *  in the take joins its clip), else where 70% of its words are said in a window its length (and a note says so); each
 *  cut inside the pauses around it, off the take's own jump cuts, on the take's frame grid. [from, to, said] in the
 *  take's seconds. */
function cutPlan(take: string, ws: Word[], lines: string[]): { plan: [number, number, string][]; notes: string[] } {
  const norm = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}'\s]/gu, "");
  const toks = ws.map((w) => norm(w.text).trim());
  // an audio take has no picture: no jump cuts to stay off, and the edit's 30 fps grid (`media cuts` refuses audio)
  const cuts = isAudio(take) ? [] : (engineJson(["media", "cuts", at(take), "--threshold", "0.08"]).cuts as { at: number }[]).map((c) => c.at);
  const fps = isAudio(take) ? 30 : (engineJson(["media", "probe", at(take)]).video?.fps as number) || 30;
  let from = 0;
  const spans: [number, number][] = [];
  const notes: string[] = [];
  lines.forEach((line, k) => {
    const want = norm(line).split(/\s+/).filter(Boolean);
    if (!want.length) throw new Error(`line ${k + 1} is empty`);
    const fits = (i: number) => want.every((t, o) => toks[i + o] === t);
    const close = () => {
      const n = want.length;
      if (n < 3 || toks.length < n) return undefined;
      const score = (i: number) => want.filter((t) => toks.slice(i, i + n).includes(t)).length;
      let best = 0;
      for (let i = 1; i <= toks.length - n; i++) {
        const [s, b] = [score(i), score(best)];
        if (s > b || (s === b && Math.abs(i - from) < Math.abs(best - from))) best = i;
      }
      return score(best) * 10 >= n * 7 ? best : undefined;
    };
    let exact: number | undefined;
    for (let i = from; i < toks.length && exact === undefined; i++) if (fits(i)) exact = i;
    for (let i = 0; i < toks.length && exact === undefined; i++) if (fits(i)) exact = i;
    const i = exact ?? close();
    if (i === undefined) {
      const near = toks.flatMap((t, n) => (t === want[0] ? [ws.slice(n, n + 10).map((w) => w.text).join(" ")] : [])).slice(0, 3);
      throw new Error(`line ${k + 1} isn't in the transcript word for word: "${line}"; it says near there: ${near.length ? near.join(" | ") : "(no match for its first word)"}`);
    }
    const j = Math.min(i + want.length - 1, toks.length - 1);
    if (exact === undefined) notes.push(`line ${k + 1} isn't said word for word; cut where the take says "${ws.slice(i, j + 1).map((w) => w.text).join(" ")}"`);
    from = j + 1;
    const last = spans[spans.length - 1];
    if (last && last[1] + 1 === i) last[1] = j;
    else spans.push([i, j]);
  });
  const sf = 1 / fps;
  const plan = spans.map(([i, j], k): [number, number, string] => {
    const before = i > 0 ? ws[i].from - ws[i - 1].to : 0.4;
    const after = j + 1 < ws.length ? ws[j + 1].from - ws[j].to : 0.6;
    // transcript word ends run early: a generous tail (more on the last line), a short lead-in, both inside the pause
    let a = ws[i].from - Math.min(before * 0.6, 0.12);
    let b = ws[j].to + Math.min(after * 0.7, k + 1 === spans.length ? 0.35 : 0.22);
    // a jump cut in the take near a join: start one take frame after it (or end one before), never on it, or the
    // other shot's last frame can show
    const ca = cuts.find((c) => Math.abs(c - a) <= 0.25 && c <= ws[i].from + 0.05);
    if (ca !== undefined) a = Math.max(a, ca + sf);
    const cb = cuts.find((c) => Math.abs(c - b) <= 0.25 && c >= ws[j].to - 0.05);
    if (cb !== undefined) b = Math.min(b, cb - sf);
    return [Math.ceil(Math.max(a, 0) * fps) / fps, Math.floor(b * fps) / fps, ws.slice(i, j + 1).map((w) => w.text).join(" ")];
  });
  return { plan, notes };
}

/** A clip's length in the edit's frames: cuts.ts's `frames` */
const framesOf = (from: number, to: number, fps: number) => Math.max(1, Math.round((to - from) * fps));
const ms = (s: number) => Math.round(s * 1000) / 1000;

type Clip = { take: string; file: string; from: number; to: number; line: string };

/** `raea cut`'s host step: the clips for the lines (or --at spans), the words in the edit's frames, and what was cut */
function cut(a: { take: string; lines: string[]; spans: number[][]; keep: Clip[] }) {
  const file = takeOf(a.take);
  if (!a.lines.length && !a.spans.length) throw new Error(`cut needs lines ("what's said") or spans (--at A-B, in the take's seconds)`);
  const edit = shape();
  const stem = basename(file, extname(file));
  const clips: Clip[] = [...a.keep];
  let notes: string[] = [];
  if (a.lines.length) {
    const r = cutPlan(file, words(file, true), a.lines);
    notes = r.notes;
    for (const [from, to, line] of r.plan) clips.push({ take: stem, file, from: ms(from), to: ms(to), line });
  }
  const { dur } = probeOf(file);
  for (const [s, e] of a.spans) {
    const [from, to] = [Math.max(s, 0), dur > 0 ? Math.min(e, dur) : e];
    if (!(to > from)) throw new Error(`the span ${s}-${e} is outside ${file} (${dur.toFixed(1)} s)`);
    const line = words(file).filter((w) => w.from >= from - 0.02 && w.to <= to + 0.08).map((w) => w.text).join(" ");
    clips.push({ take: stem, file, from: ms(from), to: ms(to), line });
  }
  // the words in the edit's frames, for captions (useWords())
  let t = 0;
  const timeline: { text: string; from: number; to: number }[] = [];
  const said: string[] = [];
  clips.forEach((c, k) => {
    const n = framesOf(c.from, c.to, edit.fps);
    const f = (s: number) => t + Math.round((s - c.from) * edit.fps);
    for (const w of words(c.file)) if (w.from >= c.from - 0.02 && w.to <= c.to + 0.08) timeline.push({ text: w.text, from: Math.max(f(w.from), t), to: Math.max(Math.min(f(w.to), t + n), f(w.from) + 1) });
    said.push(`${String(k + 1).padStart(2)}  ${(t / edit.fps).toFixed(2).padStart(5)}-${((t + n) / edit.fps).toFixed(2).padStart(5)} s  ${c.take}  "${c.line}"`);
    t += n;
  });
  const head = `cuts.ts: ${clips.length} clips, ${(t / edit.fps).toFixed(1)} s (${t} frames at ${edit.fps} fps); words.json for captions`;
  return { edit, cuts: clips, words: timeline, perception: perception(edit, clips), said: [head, ...said, ...notes.map((n) => `note: ${n}`)].join("\n") };
}

/** raea-perceive, as `raea song` finds it (runtime/react/src/runtime/page/src/faces.rs perceive_bin): $RAEA_PERCEIVE, else beside raea, else on PATH */
function perceive(): string {
  // raea's path (a bare name, as a test may pass, is found on PATH)
  const self = raea.includes("/") ? raea : (process.env.PATH ?? "").split(delimiter).map((d) => `${d}/${raea}`).find((p) => existsSync(p)) ?? raea;
  // raea-perceive.exe on Windows (#43)
  const name = process.platform === "win32" ? "raea-perceive.exe" : "raea-perceive";
  const beside = existsSync(self) ? `${dirname(realpathSync(self))}/${name}` : "";
  return process.env.RAEA_PERCEIVE || (existsSync(beside) ? beside : name);
}

/** `raea frame`'s host step: how a take fits the edit's shape, from where its face is at a moment (raea-perceive's
 *  layout of one still): a talking take (FaceFrame), a screen wider than the edit (ScreenFit), or a plain cover */
type Box = { x: number; y: number; w: number; h: number };

/** Where the face is in a take at a moment, as shares of its picture (raea-perceive's layout of a still), if there's one */
function faceAt(file: string, t: number): Box | undefined {
  const dir = mkdtempSync(`${tmpdir()}/raea-face-`);
  try {
    const still = `${dir}/still.jpg`;
    engineRun(["media", "still", at(file), "--at", t.toFixed(2), "-o", still]);
    const r = spawnSync(perceive(), ["see-layout", still], { encoding: "utf8" });
    if (r.status !== 0) throw new Error(`finding the face needs raea-perceive (beside raea; RAEA_PERCEIVE names another): ${(r.stderr || r.error?.message || "").trim()}`);
    const zones = (JSON.parse(r.stdout.split("\n")[0] || "{}").layout?.zones ?? []) as { face?: Box }[];
    return zones.find((z) => z.face)?.face;
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

/** The take's length and picture size (raea media probe) */
function probeOf(file: string): { dur: number; sw: number; sh: number } {
  const p = engineJson(["media", "probe", at(file)]);
  return { dur: (p.duration as number) || 0, sw: (p.video?.width as number) || 0, sh: (p.video?.height as number) || 0 };
}

/** perception.json for the clips (what <Region> and the checks place parts by): for each clip, keyed by its first frame,
 *  the face at its middle mapped through the edit's centred cover crop into the edit's pixels, and the safe band (220 px
 *  under the top, 420 over the bottom at 1920 high). A take raea-perceive can't read gets the band alone. */
function perception(edit: { width: number; height: number; fps: number }, clips: Clip[]) {
  const k = edit.height / 1920;
  const safe = { top: Math.round(220 * k), bottom: Math.round(edit.height - 420 * k) };
  const seen = new Map<string, Box | undefined>();
  const out: Record<string, { safe: typeof safe; face?: Box }> = {};
  let t = 0;
  for (const c of clips) {
    const mid = (c.from + c.to) / 2;
    const key = `${c.file}|${Math.floor(mid * 10)}`;
    if (!seen.has(key)) {
      let face: Box | undefined;
      try {
        const f = faceAt(c.file, mid);
        const { sw, sh } = probeOf(c.file);
        if (f && sw && sh) {
          const s = Math.max(edit.width / sw, edit.height / sh);
          const [ox, oy] = [(edit.width - sw * s) / 2, (edit.height - sh * s) / 2];
          face = { x: Math.round(f.x * sw * s + ox), y: Math.round(f.y * sh * s + oy), w: Math.round(f.w * sw * s), h: Math.round(f.h * sh * s) };
        }
      } catch {
        face = undefined;
      }
      seen.set(key, face);
    }
    const face = seen.get(key);
    out[String(t)] = face ? { safe, face } : { safe };
    t += framesOf(c.from, c.to, edit.fps);
  }
  return out;
}

function frame(a: { take: string; at?: number }): string {
  const file = takeOf(a.take);
  const { dur, sw, sh } = probeOf(file);
  const t = Math.min(Math.max(a.at ?? dur / 2, 0), Math.max(dur - 0.1, 0));
  const edit = shape();
  const face = faceAt(file, t);
  const [aspect, editAspect] = [sw / Math.max(sh, 1), edit.width / edit.height];
  const pct = (v: number) => `${Math.round(v * 100)}%`;
  const lines = [`${file} at ${t.toFixed(1)} s: ${sw}x${sh} (${aspect.toFixed(2)}:1); the edit is ${edit.width}x${edit.height}`];
  if (face)
    lines.push(`a face at x ${pct(face.x + face.w / 2)} y ${pct(face.y + face.h / 2)}, ${pct(face.h)} of the height: a talking take. <FaceFrame src={...} /> (raea part add face-frame) finds the face and keeps it framed for the edit's shape as it moves; punchIn={1.15} to tighten on a key line`);
  else if (aspect > editAspect * 1.3)
    lines.push(`no face, and wider than the edit: a cover crop keeps only the middle ${pct(editAspect / aspect)} of its width. <ScreenFit src={...} aspect={${aspect.toFixed(3)}} /> (raea part add screen-fit) shows it whole, with room above and below for a headline and captions`);
  else lines.push(`no face here: it fills the frame as it is (a <Video> with objectFit "cover"); try another --at if a person should be in it`);
  return lines.join("\n");
}

/** One request by curl (the host steps are synchronous): its body and where it ended up, or why it failed */
function curl(url: string, o: { out?: string; secs?: number } = {}): { body: string; url: string } {
  // a browser's agent: some sites send a bare page, or none, to anything else
  const a = ["-sS", "-L", "--compressed", "--max-time", String(o.secs ?? 30), "-w", "\n%{http_code} %{url_effective}", "-A", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15"];
  if (o.out) a.push("-o", o.out);
  const r = spawnSync("curl", [...a, url], { encoding: "utf8", maxBuffer: 64 << 20 });
  const text = r.stdout ?? "";
  const cut = text.lastIndexOf("\n");
  const [body, tail] = [text.slice(0, cut), text.slice(cut + 1)];
  const [code, final] = [Number(tail.split(" ")[0]), tail.slice(tail.indexOf(" ") + 1)];
  if (r.status !== 0 || !(code >= 200 && code < 300)) throw Object.assign(new Error(`${url}: ${code || r.stderr.trim()} ${body.slice(0, 200)}`), { code });
  return { body, url: final || url };
}

/** A logo's size: an SVG's viewBox or width/height, a raster's pixels by sips */
function sizeOf(file: string): { width?: number; height?: number } {
  if (file.endsWith(".svg")) {
    const head = readFileSync(file, "utf8").slice(0, 2000);
    const vb = /viewBox\s*=\s*["']\s*[-\d.]+[\s,]+[-\d.]+[\s,]+([\d.]+)[\s,]+([\d.]+)/i.exec(head);
    return vb ? { width: Math.round(+vb[1]), height: Math.round(+vb[2]) } : {};
  }
  const r = spawnSync("sips", ["-g", "pixelWidth", "-g", "pixelHeight", file], { encoding: "utf8" });
  const n = (k: string) => Number(new RegExp(`${k}: (\\d+)`).exec(r.stdout ?? "")?.[1]) || undefined;
  return { width: n("pixelWidth"), height: n("pixelHeight") };
}

/** `raea brand DOMAIN|URL`: the brand's website read on this machine (scrape.ts: its HTML and CSS, no raea API), its
 *  logos saved in media/brand/ and the kit written (brand.ts: BRAND.md, brand/brand.json, brand/brand.css,
 *  brand/styleguide.json). What a plain fetch couldn't see is said, and a kit with nothing in it refuses. */
function brand(a: { brand: string }): string {
  const q = a.brand.trim();
  if (!/[.:]/.test(q)) throw new Error(`raea brand: give the brand's website (its domain or URL, e.g. ${q.toLowerCase().replace(/\s+/g, "")}.com); raea reads the site itself`);
  const page = curl(/^https?:\/\//.test(q) ? q : `https://${q}`);
  const { links, inline } = stylesOf(page.body, page.url);
  const sheets = [...inline];
  for (const l of links.slice(0, 16)) {
    try {
      const sheet = curl(l);
      sheets.push(sheet.body);
      // one level of @import (a theme's tokens are often a sheet of their own)
      for (const m of sheet.body.matchAll(/@import\s+(?:url\()?["']?([^"')\s;]+)/g))
        if (!/fonts\.googleapis/.test(m[1])) sheets.push(curl(new URL(m[1], sheet.url).href).body);
    } catch {
      // a sheet the CDN won't give is left out
    }
  }
  const site = readSite(page.body, sheets, page.url);
  const d = site.brand.domain;
  mkdirSync(at("media/brand"), { recursive: true });
  const logos: { file: string; type?: string; mode?: string; width?: number; height?: number }[] = [];
  for (const l of site.logos) {
    const ext = l.svg ? "svg" : (/\.(svg|png|jpe?g|webp|ico|gif)$/i.exec(l.url.split(/[?#]/)[0])?.[1] ?? "png").toLowerCase();
    const file = `media/brand/${d}-${l.type}${logos.some((x) => x.type === l.type) ? `-${logos.length + 1}` : ""}.${ext}`;
    try {
      if (l.svg) writeFileSync(at(file), l.svg.includes("xmlns") ? l.svg : l.svg.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"'));
      else curl(l.url, { out: at(file) });
      logos.push({ file, type: l.type, ...sizeOf(at(file)) });
    } catch {
      // a logo the site won't give is left out, not guessed
    }
  }
  const kit = brandKit({ brand: site.brand, styleguide: site.styleguide, logos, thin: site.thin });
  for (const [f, text] of Object.entries(kit.files)) {
    mkdirSync(dirname(at(f)), { recursive: true });
    writeFileSync(at(f), text);
  }
  if (!site.styleguide)
    throw new Error(`raea brand: ${page.url} gave no colours or faces to a plain fetch (${site.thin.join("; ")}). BRAND.md says what to do: open the site in your browser tool, read the live page's computed styles, and write brand/brand.css and brand/brand.json yourself`);
  return kit.said;
}

const host: Host = (op, a) => {
  switch (op) {
    case "shape":
      return shape();
    case "frame":
      return frame(a as Parameters<typeof frame>[0]);
    case "cut":
      return cut(a as Parameters<typeof cut>[0]);
    case "brand":
      return brand(a as Parameters<typeof brand>[0]);
    case "library":
      return library(a);
    case "show":
      return show(a);
    case "harness":
      return harness();
    case "task":
      return task(a);
    default:
      throw new Error(`raea: this step (${op}) isn't in the native raea yet`);
  }
};

const engine: Engine = async (a) => {
  const r = spawnSync(raea, a, { cwd, encoding: "utf8" });
  return { stdout: r.stdout ?? "", stderr: r.stderr ?? "", exitCode: r.status ?? 1 };
};

const fs = {
  exists: async (p: string) => existsSync(p),
  readFile: async (p: string) => readFileSync(p, "utf8"),
  writeFile: async (p: string, data: string) => writeFileSync(p, data),
  mkdir: async (p: string, o?: { recursive?: boolean }) => void mkdirSync(p, o),
};

const r = await raeaHandler(host, engine)(args, { cwd, fs });
process.stdout.write(r.stdout);
process.stderr.write(r.stderr);
process.exitCode = r.exitCode;
