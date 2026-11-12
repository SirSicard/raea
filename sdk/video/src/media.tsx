// Video, Audio, Img and staticFile (spec: "Media plays in step with the frame"). These render as plain elements
// that carry their props for the renderer, with the timing already worked out for the frame being rendered.
import { createContext, useContext, type CSSProperties, type ImgHTMLAttributes } from "react";
// assets stays in raea until it moves to @raea/asset (docs/sdk.feature S1d)
import { isGeneratedAsset, type GeneratedAsset } from "@raea/asset/assets";
import { useClockState, useLocalTime } from "@raea/app/clock";
import { jsx } from "react/jsx-runtime";

export type VolumeProp = number | ((mediaFrame: number) => number);

export interface MediaProps {
  /** the file: staticFile("clip.mp4"), or a generated asset */
  src: string;
  /** where in the media it starts playing (0), counted in the composition's frames, not the
   * media's own: a 24 fps clip in a 60 fps film starts at its 4 s with startFrom={240}; the same as trimBefore */
  startFrom?: number;
  /** where in the media it stops (exclusive), in the composition's frames like startFrom: it holds the last frame, or
   * loops; the same as trimAfter */
  endAt?: number;
  /** how much of the media is cut off its start, in the composition's frames (the newer name for startFrom) */
  trimBefore?: number;
  /** where the media is cut, in the composition's frames (the newer name for endAt) */
  trimAfter?: number;
  /** linear gain, 1 being unity (0.5 is about -6 dB, 1.78 about +5 dB), or a function of the media's own frame */
  volume?: VolumeProp;
  /** ours: the gain in decibels (or a function of the media's own frame returning it); wins over volume */
  gainDb?: VolumeProp;
  /** ours: seconds to ramp the sound in from silence at its start (applied by the renderer at the audio's rate) */
  fadeIn?: number;
  /** ours: seconds to ramp the sound out to silence by its end: the end of its Sequence or Loop pass, or endAt, whichever
   *  comes first (one removed some other way fades out after it's gone) */
  fadeOut?: number;
  /** how fast it plays (1): 2 is double speed */
  playbackRate?: number;
  /** play no sound */
  muted?: boolean;
  /** start again from `startFrom` when it reaches `endAt` */
  loop?: boolean;
  /** the bus it plays into: a named channel of the edit's Tone graph (music, sfx, voice, ambience, ui), so it takes
   *  that bus's volume, effects and ducking (raea/tone `buses`) */
  bus?: string;
  /** the entity's name, for picking, the inspector and world.* */
  name?: string;
  /** Tailwind or CSS classes */
  className?: string;
  /** inline style */
  style?: CSSProperties;
}

export interface VideoProps extends MediaProps {
  /** ours: frame the take on the largest face */
  framing?: "face";
  /** ours: multiplies the framing's scale (1.15 is the usual) */
  punchIn?: number;
}

export type AudioProps = Omit<MediaProps, "style" | "className" | "src"> & {
  /** a file URL, or a generated asset from lyria() or sao() */
  src: string | GeneratedAsset;
};

interface MediaTiming {
  /** source frame shown or heard, or null when the media has ended and is silent/held */
  sourceFrame: number;
  ended: boolean;
  volume: number;
}

function pick(owner: string, a: number | undefined, aName: string, b: number | undefined, bName: string) {
  if (a !== undefined && b !== undefined) {
    throw new Error(`${owner}: ${aName} and ${bName} name the same thing; give only one of them`);
  }
  return a ?? b;
}

function timing(owner: string, props: MediaProps, frame: number, src: string): MediaTiming {
  const startFrom = pick(owner, props.startFrom, "startFrom", props.trimBefore, "trimBefore") ?? 0;
  const endAt = pick(owner, props.endAt, "endAt", props.trimAfter, "trimAfter");
  const rate = props.playbackRate ?? 1;
  if (!Number.isFinite(startFrom) || startFrom < 0) {
    throw new RangeError(`${owner} ${src}: startFrom must be a non-negative number, got ${startFrom}`);
  }
  if (endAt !== undefined && !(endAt > startFrom)) {
    throw new RangeError(`${owner} ${src}: endAt (${endAt}) must come after startFrom (${startFrom})`);
  }
  if (!(rate > 0) || !Number.isFinite(rate)) {
    throw new RangeError(`${owner} ${src}: playbackRate must be a positive number, got ${rate}`);
  }

  let sourceFrame = startFrom + Math.max(0, frame) * rate;
  let ended = false;
  if (endAt !== undefined && sourceFrame >= endAt) {
    if (props.loop) {
      const span = endAt - startFrom;
      sourceFrame = startFrom + ((sourceFrame - startFrom) % span);
    } else {
      // endAt is exclusive: hold the last frame before it
      sourceFrame = Math.max(startFrom, endAt - 1);
      ended = true;
    }
  }

  let volume: number;
  if (props.gainDb !== undefined) {
    const db = typeof props.gainDb === "function" ? props.gainDb(frame) : props.gainDb;
    if (typeof db !== "number" || Number.isNaN(db) || db === Infinity) {
      throw new RangeError(`${owner} ${src}: gainDb must be a number of decibels, got ${db}`);
    }
    volume = Math.pow(10, db / 20); // -Infinity dB is silence
  } else {
    const v = props.volume ?? 1;
    volume = typeof v === "function" ? v(frame) : v;
    if (typeof volume !== "number" || !(volume >= 0) || !Number.isFinite(volume)) {
      throw new RangeError(`${owner} ${src}: volume must be a non-negative linear gain, got ${volume}`);
    }
  }
  // (one object, read at once by the one caller: each call made one, for every playing sound every frame)
  TIMING.sourceFrame = sourceFrame;
  TIMING.ended = ended;
  TIMING.volume = volume;
  return TIMING;
}
const TIMING: MediaTiming = { sourceFrame: 0, ended: false, volume: 1 };

/** A fade length in seconds, checked; the renderer applies it at the audio's own rate, so it can be under a frame. */
function fadeSeconds(owner: string, props: MediaProps, name: "fadeIn" | "fadeOut", src: string): number {
  const v = props[name] ?? 0;
  if (typeof v !== "number" || !(v >= 0) || !Number.isFinite(v)) {
    throw new RangeError(`${owner} ${src}: ${name} must be a non-negative number of seconds, got ${v}`);
  }
  return v;
}

/** The composition frame after the last one media under it plays (a Sequence's end, a Loop pass's): its fadeOut ends
 *  there, in the clip, not after it (timeline.tsx gives it; Infinity: none) */
export const MediaEndContext = createContext(Infinity);

/** `volume` turned down by the fade-out into `end` (a composition frame) at composition frame `now`. The mixer ramps
 *  each frame's gain over the frame after it, so a frame says the gain one frame on, and its last frame is 1/(fade * fps):
 *  a frame at 0 would drop the sound a frame early (a silent sound isn't played), and the stop at `end` takes it the rest
 *  of the way in the mixer's 5 ms edge. */
function fadedOut(volume: number, fade: number, fps: number, now: number, end: number): number {
  if (!(fade > 0) || end === Infinity) return volume;
  return volume * Math.min(1, Math.max(0, (end - now) / (fade * fps)));
}

// `src`: the file the element plays (an <Audio>'s generated sound passes its file; its props were copied to give it)
function useMediaAttrs(owner: string, props: MediaProps, src = props.src as string) {
  const { fps } = useClockState(owner).config;
  const { frame, origin } = useLocalTime(owner);
  if (typeof src !== "string" || src === "") throw new Error(`${owner}: src is required`);
  const t = timing(owner, props, frame, src);
  // where it stops: its Sequence's (or Loop pass's) end, or endAt reached (a loop never reaches it)
  const endAt = props.loop ? undefined : (props.endAt ?? props.trimAfter);
  const own = endAt === undefined ? Infinity : origin + Math.ceil((endAt - (props.startFrom ?? props.trimBefore ?? 0)) / (props.playbackRate ?? 1));
  const fadeOut = fadeSeconds(owner, props, "fadeOut", src);
  const end = Math.min(useContext(MediaEndContext), own);
  const volume = fadedOut(t.volume, fadeOut, fps, origin + frame, end);
  const attrs: Record<string, string | number | undefined> = {
    src,
    "data-source-time": t.sourceFrame / fps,
    "data-source-frame": t.sourceFrame,
    "data-volume": props.muted ? 0 : volume,
    "data-fade-in": fadeSeconds(owner, props, "fadeIn", src),
    // faded here into its end: the stop at the end is the mixer's edge. With no end, the mixer fades it once it's gone
    "data-fade-out": end === Infinity ? fadeOut : 0,
    "data-playback-rate": props.playbackRate ?? 1,
    "data-start-from": props.startFrom ?? props.trimBefore ?? 0,
    "data-end-at": props.endAt ?? props.trimAfter,
    "data-loop": props.loop ? "true" : undefined,
    "data-muted": props.muted ? "true" : undefined,
    "data-ended": t.ended ? "true" : undefined,
    "data-name": props.name,
    // the bus it plays into (a named channel of the edit's Tone graph: music, sfx, voice, ambience, ui; raea/tone)
    "data-bus": props.bus,
    // the composition frame this clip's frame 0 falls on (its Sequence's start): a live player tells one sound from
    // another by it, however many come and go around it
    "data-from": origin,
  };
  // its source stamps (engine/bundle stamp.rs: where its JSX is written, its list key and uses), so the element it
  // draws is selectable as its layer (docs/review.feature R2)
  for (const [k, v] of Object.entries(props)) {
    if (k.startsWith("data-raea-") && (typeof v === "string" || typeof v === "number")) attrs[k] = v;
  }
  return attrs;
}

/** A video clip in step with the frame; `data-source-time` is the source time (seconds) to show. */
export function Video(props: VideoProps) {
  const attrs = useMediaAttrs("Video", props);
  if (props.punchIn !== undefined && !(props.punchIn > 0)) {
    throw new RangeError(`Video ${props.src}: punchIn must be a positive number, got ${props.punchIn}`);
  }
  if (props.framing !== undefined && props.framing !== "face") {
    throw new RangeError(`Video ${props.src}: framing must be "face", got "${props.framing}"`);
  }
  // a framed Video's position is the engine's (its face track, punchIn): the centred default is left out, so only an
  // objectPosition the author gives wins over framing
  const framed = props.framing !== undefined || props.punchIn !== undefined;
  const style: CSSProperties = { objectFit: "cover", ...(framed ? {} : { objectPosition: "50% 50%" }), ...props.style };
  return (
    <video
      {...attrs}
      className={props.className}
      style={style}
      data-framing={props.framing}
      data-punch-in={props.punchIn}
    />
  );
}

/** Sound in step with the frame; no picture. A muted or ended Audio is silent. */
export function Audio(props: AudioProps) {
  const asset = isGeneratedAsset(props.src) ? props.src : null;
  // a generated sound is as long as it was made (its seconds): once its source time is past that it has ended, and it
  // leaves the page. A game's cues are Sequences without an end, so every sound it ever played stayed on the page with
  // its source time moving: a finished pong rendered 115 of them a frame and sent their 115 updates (12 KB)
  if (asset && !props.loop && props.endAt === undefined && props.trimAfter === undefined) {
    const { fps } = useClockState("Audio").config;
    const { frame } = useLocalTime("Audio");
    const startFrom = props.startFrom ?? props.trimBefore ?? 0;
    const rate = props.playbackRate ?? 1;
    if (rate > 0 && (startFrom + Math.max(0, frame) * rate) / fps >= asset.seconds) return null;
  }
  const file = asset ? asset.src : (props.src as string);
  const attrs = useMediaAttrs("Audio", { ...props, src: file }, file);
  if (attrs["data-ended"]) attrs["data-volume"] = 0;
  if (asset) {
    attrs["data-generate"] = asset.kind;
    attrs["data-prompt"] = asset.prompt;
    attrs["data-seconds"] = asset.seconds;
    // the generator's own settings (a TokenSynth note's midi, velocity, seed and precision),
    // which the renderer passes to it with the prompt (sdk/react audio.rs `generated_params`)
    if (asset.options && Object.keys(asset.options).length) attrs["data-options"] = JSON.stringify(asset.options);
  }
  // the attributes are the element's props as they are (a spread copied all of them, every frame)
  return jsx("audio", attrs);
}

export type ImgProps = ImgHTMLAttributes<HTMLImageElement> & { src: string };

/** An image; the renderer holds the frame until it has loaded and fails the render (naming src) if it can't. */
export function Img(props: ImgProps) {
  if (typeof props.src !== "string" || props.src === "") throw new Error("Img: src is required");
  // A low fetch priority keeps React's server renderer from hoisting a <link rel="preload"> for the image, which the
  // engine's renderer doesn't want; it loads every image before drawing the frame regardless.
  return <img fetchPriority="low" {...props} />;
}

/** Where the space's media folder is served from. */
export const MEDIA_ROOT = "/media/";

/** The URL of a file in the space's media folder, each path segment URL-encoded. */
export function staticFile(path: string): string {
  if (typeof path !== "string" || path.trim() === "") throw new Error("staticFile: give a path inside the media folder");
  if (/^[a-z][a-z0-9+.-]*:/i.test(path)) {
    throw new Error(`staticFile: "${path}" is a URL, not a path inside the media folder`);
  }
  const kept: string[] = [];
  for (const segment of path.split("/")) {
    if (segment === "" || segment === ".") continue;
    if (segment === "..") {
      if (kept.length === 0) throw new Error(`staticFile: "${path}" leaves the media folder`);
      kept.pop();
      continue;
    }
    kept.push(segment);
  }
  if (kept.length === 0) throw new Error(`staticFile: "${path}" names the media folder itself, not a file in it`);
  return MEDIA_ROOT + kept.map(encodeURIComponent).join("/");
}
