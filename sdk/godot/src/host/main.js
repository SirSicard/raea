// The main loop of `raea godot run SCRIPT.ts` (engine/cli/src/godot.rs): Godot loads this with --script, from the
// project's .godot/raea/, beside the script's bundle (run.js). It runs on GodotJS, in Godot's own JavaScript engine
// (JavaScriptCore on the Mac, QuickJS on Windows and Linux), so it is CommonJS as GodotJS's scripts are.
//
// The script's default export:
//   a function       called with the SceneTree and the arguments after the script; awaited, then Godot quits (0, or
//                    1 with the error printed when it throws)
//   a MainLoop class (SceneTree or its subclass) Godot's main loop as it is: it quits when it calls quit()
//   nothing          the script's top level ran when it loaded; Godot quits
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

// what the bundle's shims (src/shim) read GodotJS's modules through
globalThis.__raea_godot_require = require;
const godot = require("godot");
require("./run.js");
const M = globalThis.__raea_godot_main || {};
const main = M.default;

// raea reads this to tell a script that ran from one Godot couldn't load (Godot exits 0 either way)
const marker = godot.OS.get_environment("RAEA_GODOT_LOADED");
if (marker) {
  const f = godot.FileAccess.open(marker, godot.FileAccess.ModeFlags.WRITE);
  if (f) {
    f.store_string("loaded");
    f.close();
  }
}

const userArgs = () => {
  const a = godot.OS.get_cmdline_user_args();
  const out = [];
  for (let i = 0; i < a.size(); i++) out.push(a.get(i));
  return out;
};

const report = (e) => {
  // JavaScriptCore's stack has no message line: the error itself, then where
  const text = e instanceof Error ? `${e}${e.stack ? `\n${e.stack}` : ""}` : String(e);
  console.error(`error: ${text}`);
};

// `--scene res://X.tscn`: that scene playing in the tree before the script runs; `--frames N`: Godot stops after N
// frames (--quit-after), so the script returning doesn't end the run (a shot, GD11); a scene in a window (--window)
// plays until the window is closed
const scenePath = godot.OS.get_environment("RAEA_GODOT_SCENE");
const hold = godot.OS.get_environment("RAEA_GODOT_HOLD") === "1" || (scenePath !== "" && godot.DisplayServer.get_name() !== "headless");

class RaeaMain extends godot.SceneTree {
  _initialize() {
    if (scenePath) {
      const packed = godot.ResourceLoader.load(scenePath);
      if (!(packed instanceof godot.PackedScene)) {
        report(new Error(`${scenePath}: not a scene this project has`));
        this.quit(1);
        return;
      }
      this.root.add_child(packed.instantiate());
    }
    Promise.resolve()
      .then(() => (typeof main === "function" ? main(this, userArgs()) : undefined))
      .then(
        () => {
          if (!hold) this.quit(0);
        },
        (e) => {
          report(e);
          this.quit(1);
        },
      );
  }
}

exports.default = typeof main === "function" && main.prototype instanceof godot.MainLoop ? main : RaeaMain;
