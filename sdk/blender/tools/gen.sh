#!/usr/bin/env bash
# Regenerates src/gen (raea/blender's types) from a Blender's own API: tools/dump.py runs inside that Blender and
# writes its API as JSON; tools/gen/main.ts writes the TypeScript.
#   tools/gen.sh [BLENDER]      (default: RAEA_BLENDER, else /Applications/Blender.app, else blender on PATH)
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
blender="${1:-${RAEA_BLENDER:-}}"
if [[ -z "$blender" ]]; then
  if [[ -x /Applications/Blender.app/Contents/MacOS/Blender ]]; then blender=/Applications/Blender.app/Contents/MacOS/Blender
  else blender="$(command -v blender || true)"; fi
fi
[[ -n "$blender" ]] || { echo "gen.sh: no Blender (pass its path, or set RAEA_BLENDER)" >&2; exit 1; }
out="$(mktemp -d)"
trap 'rm -rf "$out"' EXIT
"$blender" --background --factory-startup --python-exit-code 1 --python "$here/dump.py" -- "$out/api.json" 2>&1 | grep -E '^dump:' >&2
bun "$here/gen/main.ts" "$out/api.json"
