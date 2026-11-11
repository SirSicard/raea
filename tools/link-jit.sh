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
  # Release and dist executables drop their local symbols (strip -x: ~5.6 M names, 331 of the CLI's 703 MB), before
  # signing so the entitlement stays: cargo's own strip runs after this script and would drop it. Global symbols stay
  # for crash backtraces; RAEA_KEEP_SYMBOLS=1 keeps everything (profiling). Before the strip, dsymutil keeps the line
  # tables in OUT.dSYM beside the executable, so a crash report from a stripped build (io/trace expects one) can still
  # be symbolicated: always for dist (what ships), for release with RAEA_DSYM=1, as it adds about 3.5 min and a 1.3 GB
  # dSYM to every link of the CLI.
  if [ -z "${RAEA_KEEP_SYMBOLS:-}" ]; then
    case "$out" in
      */dist/*) dsymutil "$out" -o "$out.dSYM" >/dev/null 2>&1 || true; strip -x "$out" 2>/dev/null || true ;;
      */release/*) [ -n "${RAEA_DSYM:-}" ] && { dsymutil "$out" -o "$out.dSYM" >/dev/null 2>&1 || true; }; strip -x "$out" 2>/dev/null || true ;;
    esac
  fi
  codesign -s - --force --entitlements "$(dirname "$0")/jit.entitlements" "$out" >/dev/null 2>&1 || true
fi
exit 0
