---
title: "raea setup"
summary: "Find Blender, or download its current LTS, and install raea's add-on and the MCP add-on."
order: 128
sources: ["apps/tools/src/blender.rs"]
---

`raea setup blender` finds the Blender on this machine (from `git config raea.blender`, raea's own copy, /Applications or the `PATH`), or downloads the current LTS from blender.org into `~/.raea/tools/blender`. It then installs the add-on that
lets an agent drive Blender over MCP. [`raea blender run`](blender.md) uses the Blender it found.

```sh
raea setup blender --check
raea setup blender
```

<!-- generated:begin by tools/manual-ref/cli.ts from `raea help --json`; edit only the flag descriptions -->

## Usage

```sh
raea setup blender [--check] [--download]   (find Blender or download the LTS into ~/.raea/tools/blender, and install raea's add-on and the MCP add-on)
raea setup godot [--check]   (download Godot 4.6.1 with GodotJS, its TypeScript bindings (MIT), into ~/.raea/tools/godot: JavaScriptCore on the Mac, QuickJS on Windows and Linux; raea's own build (the Mac's notarized), else GodotJS's, each checked against its pinned sha256)
```

Headless: it needs nothing running and opens no window. Takes up to 1 argument besides its flags.

## Flags

| Flag | Takes | What it does |
| --- | --- | --- |
| `--check` | – | Say which Blender would be used, without downloading or installing anything. |
| `--download` | – | Download the LTS even when a Blender is already on this machine. |

<!-- generated:end -->
