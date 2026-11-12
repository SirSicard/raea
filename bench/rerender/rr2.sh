#!/usr/bin/env bash
# RR2 (docs/rerender.feature): the camera changes per frame. cams.tsx has two cameras, cut between with
# <Camera3d is_active> (A 0-39, B 40-89 with its own depth of field, A 90-119) and parts moving. Four checks, each
# writing OUT/<check>.json; frames are compared and deleted as they go:
#   still  without motion blur, the piece ("cut-still") rendered once against its three shots rendered as compositions
#          of their own ("a1-still", "b-still", "a2-still"), each from its frame 0 as an agent's chunk: every frame
#          identical. Also how far each cut frame is from the frame before it (the cut is there) and the render times
#   blur   the same with motion blur: the frames before the first cut and each cut frame (drawn as a shot alone draws
#          its first: no blur from the other camera's frame) identical. The other frames can't be: the blur's noise is
#          seeded by the frame number (raea-sys-post pin_frame_count), and a shot's own composition counts from 0; each
#          one's SSIM is said, and must be at least 0.999. The control: "jump", one camera moved to B's place and back,
#          its cut frames against the shots' first frames (smeared from the other shot: what a second camera saves)
#   range  with motion blur, each shot of the piece rendered alone (--at its frames, the clock the piece's): identical
#          to the piece's frames, as RR3's re-rendered segments must be
#   play   raea play seeking (offscreen) onto a cut, across each cut frame by frame and back onto a cut, against the
#          piece's render of those frames
#   bench/rerender/rr2.sh [OUT] [CHECKS]
#     RAEA_BIN  the raea to run (target/release/raea)
#     CHECKS    "still blur range play" by default
# Exits 1 when a check fails.
set -u
cd "$(dirname "$0")/../.." || exit 2
ROOT=$PWD
BIN=${RAEA_BIN:-$ROOT/target/release/raea}
OUT=${1:-${TMPDIR:-/tmp}/raea-rr2}
CHECKS=${2:-still blur range play}
SRC=$ROOT/bench/rerender/cams.tsx
SHOTS=("a1 0 40" "b 40 90" "a2 90 120")
export RAEA_SIGN=0 RAEA_MARK=0 RAEA_EXPORT_CACHE=0
mkdir -p "$OUT"
fail=0

ssim() { ffmpeg -hide_banner -nostats -i "$1" -i "$2" -lavfi ssim -f null - 2>&1 | sed -n 's/.*All:\([0-9.]*\).*/\1/p'; }
lower() { echo "$1 $2" | awk '{print ($2 < $1) ? $2 : $1}'; }
now() { perl -MTime::HiRes=time -e 'printf "%.3f", time'; }
png() { echo "$1/frame-$(printf %05d "$2").png"; }

# render ID [--at LIST]: the composition into OUT/ID (OUT/ID-at with a list), printing its seconds
render() {
  local id=$1 dir=$OUT/$1 t0 t1
  shift
  [ $# -gt 0 ] && dir=$OUT/$id-at
  rm -rf "${dir:?}"
  t0=$(now)
  "$BIN" render "$SRC" --composition "$id" "$@" -o "$dir" > "$dir.log" 2>&1 || { echo "$id failed: $(grep -E 'REFUSED|error' "$dir.log" | head -2)" >&2; return 1; }
  t1=$(now)
  echo "$t0 $t1" | awk '{printf "%.1f", $2 - $1}'
}

# the piece against its shots' own compositions (END: "" or "-still"): sets RES to "identical differ worst
# must_be_identical_but_differ", CUTS and SECS, and writes the differing frames to OUT/CHECK-differ.txt
against_shots() {
  local check=$1 end=$2 same=0 diff=0 worst=1 need=0 s i id from to t ts=()
  t=$(render "cut$end") || return 1; ts+=("\"cut$end\": $t")
  : > "$OUT/$check-differ.txt"
  for shot in "${SHOTS[@]}"; do
    set -- $shot; id=$1$end from=$2 to=$3
    t=$(render "$id") || return 1; ts+=("\"$id\": $t")
    for i in $(seq "$from" $((to - 1))); do
      if cmp -s "$(png "$OUT/cut$end" "$i")" "$(png "$OUT/$id" $((i - from)))"; then same=$((same + 1)); continue; fi
      s=$(ssim "$(png "$OUT/cut$end" "$i")" "$(png "$OUT/$id" $((i - from)))")
      diff=$((diff + 1)); echo "frame $i ($id $((i - from))) ssim $s" >> "$OUT/$check-differ.txt"
      worst=$(lower "$worst" "$s")
      # a frame before the first cut, or a cut frame, must be identical
      if [ "$i" -lt 40 ] || [ "$i" = 40 ] || [ "$i" = 90 ]; then need=$((need + 1)); fi
    done
    rm -rf "${OUT:?}/$id"
  done
  CUTS="[$(ssim "$(png "$OUT/cut$end" 39)" "$(png "$OUT/cut$end" 40)"), $(ssim "$(png "$OUT/cut$end" 89)" "$(png "$OUT/cut$end" 90)")]"
  rm -rf "${OUT:?}/cut$end"
  SECS="{$(IFS=,; echo "${ts[*]}")}"
  RES="$same $diff $worst $need"
}

still() {
  against_shots still -still || return 1
  set -- $RES
  echo "{\"frames\": 120, \"identical\": $1, \"differ\": $2, \"worst_ssim\": $3, \"cut_vs_before_ssim\": $CUTS, \"seconds\": $SECS}" | tee "$OUT/still.json"
  [ "$2" = 0 ]
}

blur() {
  against_shots blur "" || return 1
  set -- $RES
  # the control: one camera moved instead of a second, its cut frames against the same shots' first frames
  local b0 a0 jump
  render b --at 0 > /dev/null && mv "$OUT/b-at/frame-00000.png" "$OUT/b0.png" && render a2 --at 0 > /dev/null && mv "$OUT/a2-at/frame-00000.png" "$OUT/a0.png" && render jump --at 40,90 > /dev/null || return 1
  jump="[$(ssim "$OUT/jump-at/frame-00000.png" "$OUT/b0.png"), $(ssim "$OUT/jump-at/frame-00001.png" "$OUT/a0.png")]"
  rm -rf "${OUT:?}"/b-at "${OUT:?}"/a2-at "${OUT:?}"/jump-at "$OUT/b0.png" "$OUT/a0.png"
  echo "{\"frames\": 120, \"identical\": $1, \"differ\": $2, \"worst_ssim\": $3, \"must_be_identical_but_differ\": $4, \"cut_vs_before_ssim\": $CUTS, \"one_camera_moved_cut_frames_ssim\": $jump, \"seconds\": $SECS}" | tee "$OUT/blur.json"
  [ "$4" = 0 ] && awk -v w="$3" 'BEGIN { exit !(w >= 0.999) }'
}

range() {
  local same=0 diff=0 i from to at t ts=()
  t=$(render cut) || return 1; ts+=("\"cut\": $t")
  : > "$OUT/range-differ.txt"
  for shot in "${SHOTS[@]}"; do
    set -- $shot; from=$2 to=$3
    at=$(seq "$from" $((to - 1)) | paste -sd, -)
    t=$(render cut --at "$at") || return 1; ts+=("\"$1\": $t")
    for i in $(seq "$from" $((to - 1))); do
      if cmp -s "$(png "$OUT/cut" "$i")" "$(png "$OUT/cut-at" $((i - from)))"; then same=$((same + 1)); else diff=$((diff + 1)); echo "frame $i" >> "$OUT/range-differ.txt"; fi
    done
    rm -rf "${OUT:?}/cut-at"
  done
  rm -rf "${OUT:?}/cut"
  echo "{\"frames\": 120, \"identical\": $same, \"differ\": $diff, \"seconds\": {$(IFS=,; echo "${ts[*]}")}}" | tee "$OUT/range.json"
  [ "$diff" = 0 ]
}

play() {
  # a jump onto a cut frame, then frames walked across each cut, then a seek back onto a cut. Held: the first seek and
  # each seek to the frame after the one before. The others (a jump to 38 or 88, the seek back) are said, not held:
  # with motion blur, a seek that isn't to the next frame has differed in play from the render since before RR2, cut
  # or no cut (main's raea, one camera: frame 20 seeked back from 21, SSIM 0.999776), and the frame after it is exact
  local d=$OUT/play seeks=(40 38 39 40 41 88 89 90 91 90) args=() at n f r v held=0 exact=0 worst=1 jump=""
  rm -rf "${d:?}"; mkdir -p "$d/seek"
  for n in "${!seeks[@]}"; do args+=(--seek "${seeks[$n]}" "$d/seek/$n.png"); done
  at=$(printf '%s\n' "${seeks[@]}" | sort -n | uniq | paste -sd, -)
  "$BIN" render "$SRC" --composition cut --at "$at" -o "$d/at" > "$OUT/play-at.log" 2>&1 || { echo "play: the render failed: $(tail -3 "$OUT/play-at.log")"; return 1; }
  # play shows the file's first composition: the piece ("cut")
  RAEA_AUDIO_MUTE=1 RAEA_LIVE3D_CHECK=1 "$BIN" play "$SRC" --offscreen --size 960x540 "${args[@]}" > "$OUT/play.log" 2>&1 || { echo "play: failed: $(tail -3 "$OUT/play.log")"; return 1; }
  : > "$OUT/play-differ.txt"
  for n in "${!seeks[@]}"; do
    f=${seeks[$n]}
    r=$(png "$d/at" "$(echo "$at" | tr , '\n' | grep -nx "$f" | cut -d: -f1 | awk '{print $1 - 1}')")
    v=$(ssim "$d/seek/$n.png" "$r")
    if [ "$n" != 0 ] && [ "${seeks[$((n - 1))]}" != $((f - 1)) ]; then jump="$jump\"${seeks[$((n - 1))]}->$f\": $v, "; continue; fi
    held=$((held + 1)); worst=$(lower "$worst" "$v")
    if [ "$v" = "1.000000" ]; then exact=$((exact + 1)); else echo "seek $n frame $f ssim $v" >> "$OUT/play-differ.txt"; fi
  done
  rm -rf "${d:?}"
  echo "{\"seeks_held\": $held, \"ssim_1\": $exact, \"worst_ssim\": $worst, \"seeks_not_held\": {${jump%, }}}" | tee "$OUT/play.json"
  [ "$exact" = "$held" ]
}

for c in $CHECKS; do
  "$c" || { echo "rr2: $c FAILED"; fail=1; }
done
exit $fail
