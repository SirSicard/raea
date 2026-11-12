// The "godot" module in the bundle `raea godot run` makes (the bundler's --alias godot=this file), standing for
// GodotJS's own. GodotJS's godot module makes each class when it's first read, so it has almost no names of its own,
// and the bundler copies a CommonJS module's own names when a bundle imports it: this one answers every name the
// typings list (names.gen.js, generated) and reads each from GodotJS's module only when the script uses it.
// src/host/main.js sets __raea_godot_require (GodotJS's require) before the bundle runs.
const names = require("./names.gen.js");
const known = new Set(names);
const live = () => globalThis.__raea_godot_require("godot");
module.exports = new Proxy(
  {},
  {
    // GodotJS's module throws on a name it doesn't have (the bundler asks for __esModule): only its own are read
    get: (_t, k) => (known.has(k) ? live()[k] : undefined),
    has: (_t, k) => known.has(k),
    ownKeys: () => names.slice(),
    getOwnPropertyDescriptor: (_t, k) => (known.has(k) ? { configurable: true, enumerable: true, get: () => live()[k] } : undefined),
  },
);
