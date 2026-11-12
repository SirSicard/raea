#!/usr/bin/env bash
# GD9: an editor raea built (macos.sh, linux.py) checked against GodotJS's own release build: raea runs the smoke
# script on it, and `raea godot types` writes the same typings from it as from the build `raea setup godot` downloads.
# A HOME of its own points raea.godot at the editor, so the person's own settings are never touched.
#   sdk/godot/build/verify.sh EDITOR WORK
set -uo pipefail
E=${1:?usage: verify.sh EDITOR WORK}; W=${2:?usage: verify.sh EDITOR WORK}
RAEA=${RAEA:-raea}
H=$W/home; rm -rf "$H" "$W/types-ours" "$W/types-theirs"; mkdir -p "$H" "$W/types-ours" "$W/types-theirs"
for d in ours theirs; do printf 'config_version=5\n\n[application]\nconfig/name="t"\n' > "$W/types-$d/project.godot"; done
printf '[raea]\n\tgodot = %s\n' "$E" > "$H/.gitconfig"
echo "[1] smoke on our build"
smoke=$(cd "$(dirname "$0")/../../.." && HOME=$H "$RAEA" godot run sdk/godot/test/scripts/smoke.ts alpha --beta 2>&1 | tail -3)
echo "$smoke"
grep -q 'PASS raea/godot' <<<"$smoke" || { echo "FAIL the smoke script didn't pass on $E"; exit 1; }
echo "[2] types from our build, then from GodotJS's"
(HOME=$H "$RAEA" godot types "$W/types-ours" 2>&1 | tail -1)
("$RAEA" godot types "$W/types-theirs" 2>&1 | tail -1)
n=$(diff -r -x .godot "$W/types-ours" "$W/types-theirs" | wc -l | tr -d ' ')
echo "[3] $(ls "$W/types-ours/typings" | wc -l | tr -d ' ') typing files; diff lines: $n"
[ "$n" = 0 ]
