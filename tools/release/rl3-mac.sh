#!/bin/zsh
# RL3 on the Mac for a release tarball: unpacked in a fresh folder, run as a fresh user would (env -i, an empty HOME,
# PATH without bun or brew, RAEA_NO_TREE=1, raea's API at a closed port) under a sandbox that denies reads of
# ~/raea, ~/raea-trial and ~/.raea and all network but localhost. raea init, a frame and an MP4 of the template,
# play of the bench's pong offscreen with a snapshot, and a raea/bevy BevyApp program on the catalog.
set -u
tgz=${1:?usage: rl3-mac.sh TARBALL [PONG_DIR]}; pong=${2:-$HOME/raea/sdk/react/bench/games/pong}
R=$(mktemp -d /private/tmp/rl3-mac.XXXXXX); mkdir -p $R/home $R/p $R/game $R/bevy
tar -xzf $tgz -C $R && cp -R $pong/. $R/game/
cat > $R/sb <<SB
(version 1)
(allow default)
(deny file-read* (subpath "$HOME/raea") (subpath "$HOME/raea-trial") (subpath "$HOME/.raea"))
(deny network*)
(allow network* (remote ip "localhost:*") (local ip "localhost:*"))
(allow network* (remote unix-socket))
SB
ok=0
step() {  # NAME DIR ARGS...
  local n=$1 d=$2; shift 2; local t0=$(date +%s)
  # RAEA_AUDIO_MUTE: the play step's game makes no sound on the Mac's speakers while someone works at it
  (cd $d && sandbox-exec -f $R/sb env -i PATH=/usr/bin:/bin:/usr/sbin:/sbin HOME=$R/home RAEA_NO_TREE=1 RAEA_AUDIO_MUTE=1 RAEA_API=http://127.0.0.1:9 RAEA_GEN_API=http://127.0.0.1:9 $R/raea/bin/raea "$@") > $R/$n.log 2>&1
  local code=$?; echo "mac $n: exit $code, $(( $(date +%s) - t0 ))s"; grep -v '^\s*$' $R/$n.log | tail -2 | cut -c1-160
  [ $code = 0 ] || ok=1
}
step init $R/p init
step render-frame $R/p render edit.tsx --frame 15 -o card.png
step render-mp4 $R/p render edit.tsx -o edit.mp4
step play $R/game play edit.tsx --offscreen --seconds 2 --size 540x960 --snapshot 1 snap.png
# raea run calls the script's default export; print is raea's stdout
printf '%s\n' 'import { BevyApp } from "raea/bevy";' 'import { print } from "raea/native";' 'export default function main() {' \
  '  const app = BevyApp.open({ plugins: ["avian", "bevy"] });' '  const frame = app.step(30);' '  app.close();' \
  '  if (!(frame >= 30)) throw new Error(`stepped to ${frame}`);' '  print(`bevy ok: frame ${frame}`);' '}' > $R/bevy/check.ts
step bevy $R/bevy run check.ts
grep -q '^bevy ok' $R/bevy.log || { echo "mac: the BevyApp program didn't finish"; ok=1; }
for f in $R/p/card.png $R/p/edit.mp4 $R/game/snap.png; do [ -s $f ] || { echo "mac: no $f"; ok=1; }; done
echo "mac home left: $(cd $R/home && find . -maxdepth 3 -type d | sort | tr '\n' ' ')"
echo "mac dir: $R"; echo "mac done $ok"; exit $ok
