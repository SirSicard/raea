---
title: "raea bundle"
summary: "Bundle a composition into one JavaScript file that render_bundle draws, on the Mac or the iPhone."
order: 6
sources: ["engine/cli/src/cli.rs", "runtime/bundle/src/lib.rs"]
---

`raea bundle` runs the bundler `raea render` uses and stops there: the composition, its components and the SDK in
one JavaScript file. `raea render --bundle` draws such a file, and so does raea on the iPhone. With `--portable`,
the media the composition imports is copied next to the bundle and named relatively, so the two can travel together.

```sh
raea bundle piece.tsx --composition-bundle -o out/piece.comp.js --portable out/
raea render --bundle out/piece.comp.js --dir out/ --frame 0 -o check.png
```

<!-- generated:begin by tools/manual-ref/cli.ts from `raea help --json`; edit only the flag descriptions -->

## Usage

```sh
raea bundle EDIT.tsx --composition-bundle -o OUT.js [--portable DIR]   (a composition for render_bundle, on the Mac or the iPhone)
```

Headless: it needs nothing running and opens no window. Takes up to 1 argument besides its flags.

## Flags

| Flag | Takes | What it does |
| --- | --- | --- |
| `--composition-bundle` | – | Bundle a composition, with the entry that steps its Clock frame by frame. Without it the file is bundled as a plain script, as `raea run` bundles one. |
| `--portable` | `DIR` | Copy every media file the composition imports into `DIR/media` and name it relatively in the bundle. |
| `-o` | `OUT.js` | Where the bundle goes. |

<!-- generated:end -->
