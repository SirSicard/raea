// In raea's engine (`raea blender run SCRIPT.ts`), console.log and its kin print through the run's `print` call, as
// they would under Node or Bun: raea's own headless runs print only through `print`, and a Blender script logs.
const show = (x: unknown): string => {
  if (typeof x === "string") return x;
  if (x instanceof Error) return `${x}${(x as { pythonTrace?: string }).pythonTrace ? `\n${(x as { pythonTrace?: string }).pythonTrace}` : ""}`;
  // a Blender proxy (a function) or a mathutils value names itself (toString); a plain object as JSON
  if (typeof x === "function" || (typeof x === "object" && x !== null && x.toString !== Object.prototype.toString)) return String(x);
  try {
    return JSON.stringify(x, (_k, v) => (typeof v === "bigint" ? v.toString() : v instanceof Set ? [...v] : v instanceof Map ? Object.fromEntries(v) : v));
  } catch {
    return String(x);
  }
};

export function routeConsole(): void {
  const g = globalThis as unknown as { __raea_call?: (n: string, j: string) => string; process?: { versions?: unknown }; console?: Record<string, unknown>; __raea_console?: boolean };
  // raea's engine has a process shim with no versions, and a console.log that goes to the engine's log
  if (typeof g.__raea_call !== "function" || g.process?.versions || g.__raea_console) return;
  g.__raea_console = true;
  const call = g.__raea_call;
  const print = (...a: unknown[]) => void call("print", JSON.stringify({ text: a.map(show).join(" ") }));
  g.console = { ...(g.console ?? {}), log: print, info: print, debug: print, warn: print, error: print };
}
