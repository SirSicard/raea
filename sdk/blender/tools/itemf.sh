#!/usr/bin/env bash
# Rewrites tools/itemf.json (BL34): the enums whose items Blender works out at the time, read from Blender's own
# makesrna source at the version gen.sh dumps (a sparse, blob-less clone of that tag: about 13 MB). Run it when the
# Blender that gen.sh reads moves to a new version, then gen.sh.
#   tools/itemf.sh VERSION      (e.g. 5.2.1: the tag v5.2.1 of github.com/blender/blender)
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
version="${1:?usage: tools/itemf.sh VERSION (e.g. 5.2.1)}"
src="$(mktemp -d)"
trap 'rm -rf "$src"' EXIT
git clone -q --depth 1 --filter=blob:none --sparse --branch "v$version" https://github.com/blender/blender.git "$src" 2>/dev/null
git -C "$src" sparse-checkout set source/blender/makesrna/intern
bun "$here/gen/itemf.ts" "$src/source/blender/makesrna/intern" "$version" "$here/itemf.json"
