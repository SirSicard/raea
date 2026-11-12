// The "godot.annotations" module in the bundle `raea godot run` makes (the bundler's --alias), GodotJS's own: src/host/main.js
// sets __raea_godot_require (GodotJS's require) before the bundle runs.
module.exports = globalThis.__raea_godot_require("godot.annotations");
