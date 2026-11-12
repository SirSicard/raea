#!/bin/bash
# Every name the SDK hands out is a Bevy name, a web name, a deprecated alias of a Bevy name, or raea's own on a
# reasoned list (docs/sdk.feature M2, S2a).
#
#   tools/taxonomy.sh            each PascalCase export of raea and its Bevy-named modules with its class
#   tools/taxonomy.sh --check    exits 1 on a PascalCase export with no class, or a listed name that no longer needs
#                                listing (a Bevy name, an alias, or no longer exported); both fail on a prop named after a
#                                backend or a processor (S3b)
#
# A Bevy name is a public type of Bevy 0.20's crates or glam (their sources in cargo's registry), a type path in the
# generated plugin modules (*.gen.tsx, the registry's schema), or the last segment of an @bevy tag. An alias carries
# @deprecated naming its Bevy name (S2a). Web and raea names are in tools/taxonomy.list, a reason each. camelCase
# functions, use* hooks and CONSTANTS are TypeScript's conventions for raea's own (S2a) and are counted, not listed.
set -euo pipefail
export LC_ALL=C
ROOT=$(cd "$(dirname "$0")/.." && pwd)
LIST=$ROOT/tools/taxonomy.list
check=0
[ "${1:-}" = "--check" ] && check=1
tmp=$(mktemp -d "${TMPDIR:-/tmp}/raea-taxonomy-XXXXXX")
trap 'rm -rf "$tmp"' EXIT

# the values raea and its Bevy-named modules export (not the test helper, the native calls or the pure subset)
src=$ROOT/sdk/raea/src
mods=$(cd "$src" && ls ./*.ts ./*.tsx | grep -vE '/(native-calls|test|pure)\.tsx?$')
(cd "$ROOT/sdk/raea" && bun -e '
  for (const f of process.argv.slice(2)) for (const k of Object.keys(await import(f))) console.log(k);
' ${mods//.\//$src/}) | sort -u > "$tmp/all"
grep -E '^[A-Z][a-z]' "$tmp/all" > "$tmp/pascal" || true

# Bevy's names: its crates' and glam's public types, the generated modules' type paths, and @bevy tags
reg=$(ls -d "${CARGO_HOME:-$HOME/.cargo}"/registry/src/index.crates.io-*/ 2>/dev/null | head -1)
# a fresh checkout (CI) hasn't unpacked Bevy's sources: fetch the locked ones first
# Bevy's crates at the versions the lock pins (a patch release moves some of them: bevy_app is 0.20.1 while others
# stay 0.20.0), each as its registry folder
bevy_dirs=$(awk '/^name = "bevy_[a-z_0-9]+"$/ {n = $3; getline; if ($3 ~ /^"0\.20\./) print n "-" $3}' "$ROOT/Cargo.lock" | tr -d '"' | sort -u)
if [ -z "$reg" ] || [ ! -d "$reg/$(echo "$bevy_dirs" | grep '^bevy_app-' | head -1)" ]; then
  cargo fetch --locked -q --manifest-path "$ROOT/Cargo.toml" >&2
  reg=$(ls -d "${CARGO_HOME:-$HOME/.cargo}"/registry/src/index.crates.io-*/ | head -1)
fi
glam=$(grep -A1 '^name = "glam"$' "$ROOT/Cargo.lock" | awk -F'"' '/version/ {print $2}' | sort -V | tail -1)
{
  grep -rhoE '^\s*pub (struct|enum|trait|type) [A-Z][A-Za-z0-9_]*' $(for d in $bevy_dirs; do [ -d "$reg/$d/src" ] && echo "$reg/$d/src"; done) "$reg/glam-$glam/src" | awk '{print $NF}'
  find "$ROOT/sdk" -name '*.gen.tsx' -not -path '*/node_modules/*' -print0 | xargs -0 grep -hoE '[a-z_0-9]+(::[A-Za-z_0-9]+)+' |
    grep -vE '^(alloc|core|std)::' | awk -F'::' '{print $NF}'
  grep -rhoE '@bevy [a-z_0-9]+(::[A-Za-z_0-9]+)+' "$ROOT"/sdk/*/src | awk -F'::' '{print $NF}'
} | sort -u > "$tmp/bevy"

# aliases: an export whose doc comment says @deprecated (its Bevy name in the text)
find "$ROOT"/sdk/*/src -name '*.ts*' -not -name '*.gen.tsx' -print0 | xargs -0 awk '
  /@deprecated/ { d = 1 }
  d && match($0, /^export (function|const|class) [A-Za-z0-9_]+/) { n = substr($0, RSTART, RLENGTH); sub(/.* /, "", n); print n; d = 0 }
' | sort -u > "$tmp/alias"

# the list: "web NAME  reason" and "raea NAME  reason"
{ grep -E '^(web|raea) ' "$LIST" || true; } | awk '{print $2, $1}' | sort > "$tmp/listed"

status=0
while read -r name; do
  if grep -qx "$name" "$tmp/alias"; then cls=alias
  elif grep -qx "$name" "$tmp/bevy"; then cls=bevy
  else cls=$(awk -v n="$name" '$1 == n {print $2}' "$tmp/listed")
  fi
  if [ -z "$cls" ]; then
    echo "taxonomy: $name has no class: a Bevy name, @deprecated naming its Bevy name, or a line in tools/taxonomy.list"
    status=1
  elif [ $check = 0 ]; then
    printf '%-6s %s\n' "$cls" "$name"
  fi
done < "$tmp/pascal"

# a listed name that needs no line: Bevy's or an alias fails; one not exported is only noted, since a lane lists its
# new component in the commit that adds it and the two may land apart
while read -r name cls; do
  why=""
  grep -qx "$name" "$tmp/bevy" && why="a Bevy name"
  grep -qx "$name" "$tmp/alias" && why="an alias (@deprecated)"
  if [ -n "$why" ]; then echo "taxonomy: tools/taxonomy.list's $name is $why: drop its line"; status=1
  elif ! grep -qx "$name" "$tmp/pascal"; then echo "taxonomy: note: tools/taxonomy.list's $name isn't exported (yet, or any more)"; fi
done < "$tmp/listed"

n=$(wc -l < "$tmp/pascal"); a=$(wc -l < "$tmp/all")
# props named after the backend that draws them or the processor it runs on: the engine chooses where work runs
# (S3b), so a prop names what it does, never the path. Another program's API typed as it is (sdk/blender/src/gen, Blender's
# own names from its RNA: bpy.ops.render.opengl) is left out with the generated .gen.tsx
backend=$(grep -rnoE '^\s+(wgpu|metal|vulkan|opengl|webgl|webgpu|bevy|blitz|vello|skia|three|gpu|cpu|readback|software|hardware)([A-Z_][A-Za-z_]*)?\??:' \
  "$ROOT"/sdk/*/src --include='*.ts' --include='*.tsx' | grep -vE '\.gen\.tsx|/sdk/blender/src/gen/' | sed "s|$ROOT/||; s/: *\$//" || true)
if [ -n "$backend" ]; then
  echo "taxonomy: props named after a backend or a processor (S3b: the engine chooses where work runs):"
  echo "$backend" | sed 's/^/  /'
  status=1
fi
echo "taxonomy: $n PascalCase of $a exports; $(comm -12 "$tmp/pascal" "$tmp/bevy" | comm -23 - "$tmp/alias" | wc -l | tr -d ' ') Bevy names, $(comm -12 "$tmp/pascal" "$tmp/alias" | wc -l | tr -d ' ') aliases, $(wc -l < "$tmp/listed" | tr -d ' ') listed"
exit $status
