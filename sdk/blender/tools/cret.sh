#!/usr/bin/env bash
# Rewrites tools/cret.json (BL22): what Blender's C methods and properties return where their docstrings don't say,
# read from the Python bindings' own C source at the version gen.sh dumps (a sparse, blob-less clone of that tag). Run
# it when the Blender that gen.sh reads moves to a new version, then gen.sh.
#   tools/cret.sh VERSION      (e.g. 5.2.1: the tag v5.2.1 of github.com/blender/blender)
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
version="${1:?usage: tools/cret.sh VERSION (e.g. 5.2.1)}"
src="$(mktemp -d)"
trap 'rm -rf "$src"' EXIT
git clone -q --depth 1 --filter=blob:none --sparse --branch "v$version" https://github.com/blender/blender.git "$src" 2>/dev/null
git -C "$src" sparse-checkout set source/blender/python extern/audaspace/bindings/python
bun "$here/gen/cret.ts" "$src" "$version" "$here/cret.json"
