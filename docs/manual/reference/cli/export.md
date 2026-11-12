---
title: "raea export"
summary: "The composition as a CapCut draft ready in its timeline: its footage and sounds as clips of their own files at their trims and gains, everything raea draws as transparent overlay clips above them."
order: 5
sources: ["engine/cli/src/cli.rs"]
---

The composition as a CapCut draft ready in its timeline: its footage and sounds as clips of their own files at their trims and gains, everything raea draws as transparent overlay clips above them.

```sh
raea export capcut edit.tsx            # into CapCut's projects; open CapCut and it's in the list
raea export capcut edit.tsx -o drafts/ # a draft folder to copy into CapCut's projects folder yourself
```

raea renders the composition three times. The first render, as it is, is kept in `out/capcut/NAME/reference.mp4` to compare against. The second hides the footage and draws everything else with a transparent background: titles, lower thirds, shapes, 3D and effects. That render becomes one transparent movie, cut into a clip wherever something is drawn, on a track above the footage. The third draws only the backgrounds that sit behind the footage (a card behind a picture in picture, a coloured page), and goes under it unless it's black.

Each stretch of frames that shows one video file becomes a clip of that file, starting where the composition starts it and playing at its rate. It is placed and scaled as `object-fit` shows it in raea (`cover`, `contain`, a crop). Clips covering the whole frame go on the main track; the others go on tracks above it. A video's own sound stays on its clip at the composition's volume; every other sound becomes an audio clip with its gain and fades. The output names what doesn't carry over, such as the Tone graph's music, which has no file, or a clip that moves or fades within its shot (placed as its first frame shows it).

CapCut rewrites its project list when it quits, so `raea export capcut` refuses to write into CapCut's projects while CapCut is open. Quit it first, or pass `--no-register` or `-o`. The previous project list is kept first in `~/.raea/capcut/backups` (`%LOCALAPPDATA%\raea\capcut\backups` on Windows), never in raea's own folder.

<!-- generated:begin by tools/manual-ref/cli.ts from `raea help --json`; edit only the flag descriptions -->

## Usage

```sh
raea export capcut EDIT.tsx [--composition ID] [-o DIR] [--name NAME] [--alpha-codec prores|hevc|rle|png] [--no-register]   (the composition as a CapCut draft ready in its timeline: its footage and sounds as clips of their own files at their trims and gains, everything raea draws as transparent overlay clips above them; into CapCut's projects, entered in its project list while CapCut is closed, or a draft folder in DIR; the reference render and the overlay movie kept in out/capcut/NAME)
```

Headless: it needs nothing running and opens no window. Takes up to 2 arguments besides its flags.

## Flags

| Flag | Takes | What it does |
| --- | --- | --- |
| `--alpha-codec` | `prores\|hevc\|rle\|png` | The overlay movie's codec. ProRes 4444 by default on a Mac, QuickTime Animation elsewhere; HEVC with alpha is far smaller and Mac-only, like ProRes. |
| `--composition` | `ID` | The composition to export when the file registers more than one. |
| `--name` | `NAME` | The draft's name in CapCut. The file's name by default; a name already taken gets " 2", " 3" and so on. |
| `--no-register` | – | Write the draft into CapCut's projects folder without adding it to CapCut's project list. |
| `-o` | `DIR` | Write the draft folder into DIR instead of CapCut's projects folder (to copy to another machine, or to look at first). |

<!-- generated:end -->
