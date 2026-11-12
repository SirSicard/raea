---
title: "raea/video"
summary: "Footage and time-shifted sequences: Video, Sequence, Series, Loop and Freeze."
order: 42
sources: ["sdk/raea/src/video.ts"]
---

`<Video>` shows a clip in step with the frame: the renderer decodes it natively and draws the frame the composition
asks for, so scrubbing and rendering agree. Trim it with `trimBefore` and `trimAfter`, set its level with `volume`
or `gainDb`, and frame a talking take on its face with `framing="face"`. `<Sequence>` shifts time for what it holds,
`<Series>` plays its children one after another, `<Loop>` repeats, and `<Freeze>` holds a frame.

```tsx
import { staticFile } from "raea";
import { Series, Video } from "raea/video";

function Cut() {
  return (
    <Series>
      <Series.Sequence durationInFrames={90}>
        <Video src={staticFile("media/interview.mp4")} trimBefore={120} framing="face" />
      </Series.Sequence>
      <Series.Sequence durationInFrames={60}>
        <Video src={staticFile("media/broll.mp4")} muted />
      </Series.Sequence>
    </Series>
  );
}
```

<!-- generated:begin by tools/manual-ref/sdk.ts from the SDK's exports and doc comments; edit outside this block -->

```ts
import { Freeze, Loop, Sequence, Series } from "raea/video"
```

`raea/video` exports 5 components, 7 types. Bevy's counterpart: `raea's own; Bevy has no video crate`. Source: [sdk/raea/src/video.ts](https://github.com/shinyobjectz/raea/blob/main/sdk/raea/src/video.ts).

## Components

### `Freeze`

Shows its children as they are at `frame`, whatever the parent's frame.

| Prop | Type | What it does |
| --- | --- | --- |
| `frame` (required) | `number` | the frame its children see, whatever the parent's frame |
| `children` | `ReactNode` | what's held |

### `Loop`

Repeats its children every `durationInFrames` frames, `times` times (forever by default).

| Prop | Type | What it does |
| --- | --- | --- |
| `durationInFrames` (required) | `number` | the length of one loop, in frames |
| `times` | `number` | how many times it plays (forever by default) |
| `name` | `string` | its label in the timeline and the render manifest |
| `layout` | `SequenceLayout` | "absolute-fill" (default) or "none", as a Sequence's |
| `style` | `CSSProperties` | the wrapping box's style |
| `className` | `string` | the wrapping box's classes |
| `children` | `ReactNode` | what loops |

### `Sequence`

Shifts time by `from` and shows its children only for `durationInFrames` frames.

| Prop | Type | What it does |
| --- | --- | --- |
| `from` | `number` | the parent frame its frame 0 falls on (0) |
| `durationInFrames` | `number` | how many frames it shows its children (forever by default) |
| `name` | `string` | its label in the timeline and the render manifest (`data-sequence`) |
| `layout` | `SequenceLayout` | "absolute-fill" (default) wraps the children in a full-size box; "none" adds no box |
| `width` | `number` | the width its children see, px (the parent's by default) |
| `height` | `number` | the height its children see, px (the parent's by default) |
| `style` | `CSSProperties` | the wrapping box's style |
| `className` | `string` | the wrapping box's classes |
| `children` | `ReactNode` | what plays in it, at its own local time |

### `Series`

Plays its Series.Sequence children back to back, each shifted by its own offset.

| Prop | Type | What it does |
| --- | --- | --- |
| `children` | `ReactNode` | the Series.Sequence slots, played back to back |

### `Video`

A video clip in step with the frame; `data-source-time` is the source time (seconds) to show.

| Prop | Type | What it does |
| --- | --- | --- |
| `framing` | `"face"` | ours: frame the take on the largest face |
| `punchIn` | `number` | ours: multiplies the framing's scale (1.15 is the usual) |

Also takes the props of [`MediaProps`](#mediaprops).

## Types

### `FreezeProps`

The props of [`Freeze`](#freeze), tabled there.

### `LoopProps`

The props of [`Loop`](#loop), tabled there.

### `MediaProps`

| Field | Type | What it is |
| --- | --- | --- |
| `src` (required) | `string` | the file: staticFile("clip.mp4"), or a generated asset |
| `startFrom` | `number` | where in the media it starts playing (0), counted in the composition's frames, not the media's own: a 24 fps clip in a 60 fps film starts at its 4 s with startFrom={240}; the same as trimBefore |
| `endAt` | `number` | where in the media it stops (exclusive), in the composition's frames like startFrom: it holds the last frame, or loops; the same as trimAfter |
| `trimBefore` | `number` | how much of the media is cut off its start, in the composition's frames (the newer name for startFrom) |
| `trimAfter` | `number` | where the media is cut, in the composition's frames (the newer name for endAt) |
| `volume` | `VolumeProp` | linear gain, 1 being unity (0.5 is about -6 dB, 1.78 about +5 dB), or a function of the media's own frame |
| `gainDb` | `VolumeProp` | ours: the gain in decibels (or a function of the media's own frame returning it); wins over volume |
| `fadeIn` | `number` | ours: seconds to ramp the sound in from silence at its start (applied by the renderer at the audio's rate) |
| `fadeOut` | `number` | ours: seconds to ramp the sound out to silence by its end: the end of its Sequence or Loop pass, or endAt, whichever comes first (one removed some other way fades out after it's gone) |
| `playbackRate` | `number` | how fast it plays (1): 2 is double speed |
| `muted` | `boolean` | play no sound |
| `loop` | `boolean` | start again from `startFrom` when it reaches `endAt` |
| `bus` | `string` | the bus it plays into: a named channel of the edit's Tone graph (music, sfx, voice, ambience, ui), so it takes that bus's volume, effects and ducking (raea/tone `buses`) |
| `name` | `string` | the entity's name, for picking, the inspector and world.* |
| `className` | `string` | Tailwind or CSS classes |
| `style` | `CSSProperties` | inline style |

### `SequenceLayout`

```ts
type SequenceLayout = "absolute-fill" | "none"
```

### `SequenceProps`

The props of [`Sequence`](#sequence), tabled there.

### `SeriesSequenceProps`

| Field | Type | What it is |
| --- | --- | --- |
| `offset` | `number` | frames from the previous slot's end to this one's start (0); negative overlaps |
| `height` | `number` | the height its children see, px (the parent's by default) |
| `style` | `CSSProperties` | the wrapping box's style |
| `children` | `ReactNode` | what plays in it, at its own local time |
| `className` | `string` | the wrapping box's classes |
| `name` | `string` | its label in the timeline and the render manifest (`data-sequence`) |
| `width` | `number` | the width its children see, px (the parent's by default) |
| `durationInFrames` | `number` | how many frames it shows its children (forever by default) |

### `VideoProps`

The props of [`Video`](#video), tabled there.

<!-- generated:end -->
