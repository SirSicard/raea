---
title: "raea app"
summary: "Run, check headless and package a desktop app written as one TSX file on @raea/ui."
order: 7
sources: ["engine/cli/src/cli.rs", "engine/rune/src/main.rs"]
---

`raea app` takes a desktop app written in React on `@raea/ui` and runs it in a window (`run`), runs it headless
through scripted steps and writes a PNG after each one (`check`), or packages it as a Mac app (`bundle`). The web
target draws it with Blitz on Bevy; the native target with Rune. The app's `export const app` picks the target, and
`--target` overrides it.

```sh
raea app run signin.tsx
raea app check signin.tsx --png out/                 # 00-mount.png, a PNG after each step, tree.json
raea app check signin.tsx --target native --script steps.json --png out/native/
raea app bundle signin.tsx -o "Sign In.app"
```

The check's steps find elements by `data-testid`. Read the PNGs it writes: `tree.json` gives each element's role,
label, text and box.

<!-- generated:begin by tools/manual-ref/cli.ts from `raea help --json`; edit only the flag descriptions -->

## Usage

```sh
raea app run|check|bundle APP.tsx [--target web|native] [--size WxH] [--script steps.json] [--png DIR] [-o App.app]   (a TSX app on @raea/ui: its window, the headless check, a Mac app; web is Blitz on Bevy, native is Rune; the app's `export const app` sets the target, web when it doesn't; raea rune ... is --target native)
```

Headless: it needs nothing running and opens no window. Takes up to 2 arguments besides its flags.

## Flags

| Flag | Takes | What it does |
| --- | --- | --- |
| `--png` | `DIR` | Where `check` writes its PNGs and `tree.json`. |
| `--script` | `steps.json` | The steps `check` runs, when they aren't in the app's own file. |
| `--size` | `WxH` | The window's size in pixels. |
| `--target` | `web\|native` | Draw with Blitz on Bevy (`web`) or with Rune (`native`), over what the app's `export const app` says. |
| `-o` | `App.app` | Where `bundle` writes the Mac app. |

<!-- generated:end -->

## See also

- [Apps](../../guides/apps.md) walks through writing, checking and bundling an app on both targets.
