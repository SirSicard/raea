#!/bin/sh
# The Mac linker for raea's crates (.cargo/config.toml): cc links as always, then an executable it made is signed ad hoc
# with the JIT entitlement, which JavaScriptCore needs before it turns its JIT on (without it every script ran in its
# interpreter: pong's React work 3.3 ms a frame against 0.5 with the JIT). A failed signing never fails the build.
cc "$@" || exit $?
out=""
prev=""
for a in "$@"; do
  case "$a" in
    @*) f="${a#@}"; [ -f "$f" ] && o=$(grep -A1 -x -- '-o' "$f" | tail -1 | tr -d '"') && [ -n "$o" ] && out="$o" ;;
  esac
  [ "$prev" = "-o" ] && out="$a"
  prev="$a"
done
case "$out" in ""|*.dylib|*.so|*.a|*.rlib|*.o) exit 0 ;; esac
if file "$out" 2>/dev/null | grep -q "Mach-O.*executable"; then
  # what ships (the dist profile) loses its local symbols and debug map before it's signed (#88: 0.1.1-rc2's raea was
  # 707 MB, 394 MB stripped; .cargo/config.toml keeps rustc's own strip off, as it re-signs without the entitlement).
  # Its dSYM is made first, into target/dist/symbols, so a crash.txt's addresses still symbolicate (atos -o
  # raea.dSYM -l LOAD ADDR...). Not the release profile the agents build: dsymutil takes 5 minutes a link there, and
  # a stripped binary's panics name no functions. RAEA_KEEP_SYMBOLS=1 keeps a dist build's symbols.
  case "$out" in
    */dist/deps/*) if [ "${RAEA_KEEP_SYMBOLS:-}" != 1 ]; then
      syms="${out%/deps/*}/symbols"
      mkdir -p "$syms" && dsymutil "$out" -o "$syms/$(basename "$out" | sed 's/-[0-9a-f]\{16\}$//').dSYM" && strip -x "$out" || exit $?
    fi ;;
  esac
  codesign -s - --force --entitlements "$(dirname "$0")/jit.entitlements" "$out" >/dev/null 2>&1 || true
fi
exit 0
