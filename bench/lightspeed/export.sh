#!/bin/bash
# Throughput and export fidelity (docs/lightspeed.feature): T1, T2, T4 and Q3.
#
#   bench/lightspeed/export.sh [--runs 3] [--only T1,T2,T4,Q3]
#
#   T1  ts1 (the 20 s, 595-frame 1080x1920 edit on real footage) rendered to MP4, warm: wall time, p50 of RUNS, with the
#       render's own split (frames, sound, finish) from RAEA_TIMES
#   T2  bench/lightspeed/t3d600 (a lit cube under moving text, 1080x1920, 600 frames) rendered to MP4, warm
#   T4  batch: titles (600 frames, no footage) rendered by K processes at once, for K = 1, 2, 4, 8 (2K renders each):
#       renders per hour and how it scales from K = 1
#   Q3  VMAF of ts1's MP4 against the same frames rendered losslessly (PNG), pooled mean and the worst frame; and
#       colour: bench/lightspeed/colour's patches rendered to MP4, decoded with the matrix and range the file declares,
#       each patch's centre against the value it was painted with (worst channel error, 8-bit; `raea ci
#       patches`), plus the tags. Both for the default export (H.264, 8-bit) and for `render --10bit` (HEVC Main10).
#       Q3.colour is the 10-bit export's (the exact one; 8-bit limited range's own round trip errs up to 2), with the
#       H.264 export's in its detail; Q3.vmaf is the default export's, with the 10-bit export's in its detail. The colour
#       decode is swscale with full_chroma_int+accurate_rnd: its default 10-bit -> RGB path errs 3-4 on ideal planes
#       (exact with these), and on 8-bit these give the exact round trip's own floor
#
# The footage fixtures (ts1, k4) are in RAEA_LIGHTSPEED_FIXTURES (~/Library/Caches/raea-lightspeed/fixtures): ts1's
# footage isn't in git. Wall times come from `raea ci time` (the clock just before the spawn to the exit).
. "$(dirname "$0")/lib.sh"
H=bench/lightspeed/export.sh
TS1=$FIXTURES/ts1/edit.tsx
T3D=$ROOT/bench/lightspeed/t3d600/edit.tsx
TITLES=$ROOT/sdk/react/bench/timelines/titles/edit.tsx
COLOUR=$ROOT/bench/lightspeed/colour/edit.tsx

runs=3; only=T1,T2,T4,Q3
while [ $# -gt 0 ]; do
  case $1 in
    --runs) runs=$2; shift ;;
    --only) only=$2; shift ;;
    *) echo "usage: bench/lightspeed/export.sh [--runs N] [--only T1,T2,T4,Q3]" >&2; exit 2 ;;
  esac
  shift
done
has() { case ",$only," in *",$1,"*) return 0 ;; esac; return 1; }

TMPS=()
trap 'cleanup_turn; [ ${#TMPS[@]} -gt 0 ] && rm -rf "${TMPS[@]}"' EXIT
newtmp() { local d; d=$(mktemp -d "${TMPDIR:-/tmp}/$1XXXXXX"); TMPS+=("$d"); echo "$d"; }

# render EDIT OUT [ARGS...]: prints the wall seconds, a tab, the start (unix ms), a tab, and the render's own split
# (RAEA_TIMES' JSON line, null without it). Every render renders: the export cache (3479eea) would answer a repeat
# in ~0.02 s, which isn't T1, T2 or T4. TIMES=1 asks for the split.
render() {
  local edit=$1 out=$2; shift 2
  local log=$out.log clock=$out.clock
  if [ "${TIMES:-}" = 1 ]; then
    RAEA_EXPORT_CACHE=0 RAEA_TIMES=1 RAEA_RENDER_STATS=1 "$MOTION" ci time --to "$clock" -- "$MOTION" render "$edit" -o "$out" "$@" > "$log.out" 2> "$log.err"
  else
    RAEA_EXPORT_CACHE=0 RAEA_RENDER_STATS=1 "$MOTION" ci time --to "$clock" -- "$MOTION" render "$edit" -o "$out" "$@" > "$log.out" 2> "$log.err"
  fi
  if [ $? != 0 ]; then
    if [ -s "$log.err" ]; then say_tail "render $edit: " 600 "$log.err" >&2; else say_tail "render $edit: " 600 "$log.out" >&2; fi
    return 1
  fi
  cat "$log.out" "$log.err" > "$log"
  jq -r --rawfile t "$log" '"\(.wall_s)\t\(.start_unix_ms)\t\([$t | split("\n")[] | select(startswith("{") and contains("\"frames\"")) | fromjson?] | last | tojson)"' "$clock"
  rm -f "$log" "$log.out" "$log.err" "$clock"
}

# timed EDIT RUNS [ARGS...]: a warm render, then RUNS timed ones; their lines (render's) on stdout
timed() {
  local edit=$1 n=$2 tmp; shift 2
  tmp=$(newtmp lightspeed-export-)
  render "$edit" "$tmp/warm.mp4" "$@" > /dev/null || return 1
  for i in $(seq 0 $((n - 1))); do TIMES=1 render "$edit" "$tmp/$i.mp4" "$@" || return 1; done
  rm -rf "$tmp"
}

t1_t2() {
  local d; d=$(newtmp lightspeed-t1t2-)
  turn_begin export:T1T2
  if has T1; then timed "$TS1" "$runs" > "$d/T1" || { turn_end; return 1; }; fi
  if has T2; then timed "$T3D" "$runs" > "$d/T2" || { turn_end; return 1; }; fi
  turn_end
  for row in T1 T2; do
    [ -f "$d/$row" ] || continue
    local detail
    detail=$(LS_JQ -Rsc 'include "lib"; [split("\n")[] | select(. != "") | split("\t") | {wall: (.[0] | tonumber), split: (.[2] | fromjson)}] as $r
      | [$r[].wall] as $w
      | {p50_s: ($w | pct(0.5) | pyround(3)), max_s: ($w | max | pyround(3)), runs: ($w | map(pyround(3))),
         split: ($r[($r | length) / 2 | floor].split | if . == null then null else
           {setup_s: .setup_s, frames_s: (if .times then (.times.ms_per_frame.wall * .frames / 1e3 | pyround(3)) else null end),
            sound_s: .sound_s, finish_s: .finish_s, fps: .fps_incl_encode, video: .video} end)}' "$d/$row")
    record $row "$(echo "$detail" | LS_JQ -r 'include "lib"; .p50_s | pyf')" s "$detail" $H
  done
}

t4() {
  local tmp res="" k i w
  tmp=$(newtmp lightspeed-batch-)
  render "$TITLES" "$tmp/warm.mp4" > /dev/null || return 1
  turn_begin export:T4
  for k in 1 2 4 8; do
    # K workers at once over the 2K renders, as a pool of K threads takes them
    local pids=""
    for w in $(seq 0 $((k - 1))); do
      ( for i in $w $((w + k)); do render "$TITLES" "$tmp/k$k-$i.mp4" > "$tmp/k$k-$i.line" || exit 1; done ) &
      pids="$pids $!"
    done
    # the workers only (a bare wait would wait for the turn's watcher too)
    for p in $pids; do wait $p; done
    for i in $(seq 0 $((2 * k - 1))); do [ -s "$tmp/k$k-$i.line" ] || { turn_end; echo "T4: a render failed (K=$k)" >&2; return 1; }; done
    res="$res$(cat "$tmp"/k$k-*.line | LS_JQ -Rsc --argjson k $k 'include "lib";
      [split("\n")[] | select(. != "") | split("\t") | {wall: (.[0] | tonumber), start: (.[1] | tonumber)}] as $r
      # the batch: the first spawn to the last exit
      | ((([$r[] | .start + .wall * 1e3] | max) - ([$r[].start] | min)) / 1e3) as $secs
      | {("\($k)"): {renders: (2 * $k), wall_s: ($secs | pyround(2)), per_hour: (2 * $k * 3600 / $secs | pyround(0)),
                    render_p50_s: ([$r[].wall] | pct(0.5) | pyround(2))}}')"$'\n'
    rm -f "$tmp"/k$k-*
  done
  turn_end
  local detail
  detail=$(printf '%s' "$res" | LS_JQ -sc --argjson cores "$(getconf _NPROCESSORS_ONLN)" 'include "lib"; add as $by
    | (reduce ($by | to_entries[]) as $e (null; if . == null or $e.value.per_hour > .per_hour then $e.value else . end)) as $best
    | {by_processes: $by, scaling_vs_1: ($best.per_hour / $by["1"].per_hour | pyround(2)), cores: $cores, best: $best.per_hour}')
  record T4 "$(echo "$detail" | jq .best)" "renders/hour (titles, 600 frames)" "$(echo "$detail" | jq -c 'del(.best)')" $H
}

probe_tags() {
  ffprobe -v error -select_streams v:0 -show_entries stream=pix_fmt,color_range,color_space,color_transfer,color_primaries,bit_rate \
    -of json "$1" | jq -c '.streams[0]'
}

# vmaf MP4 PNGDIR FPS: pooled mean, the 1st percentile, the worst frame
vmaf() {
  local mp4=$1 png=$2 fps=$3 log=$2/vmaf.json pf=yuv420p
  # a 10-bit file is compared at 10 bits (the reference made 10-bit too), an 8-bit one as before
  case $(probe_tags "$mp4" | jq -r '.pix_fmt // ""') in *10*) pf=yuv420p10le ;; esac
  if ! nice -n 15 ffmpeg -v error -i "$mp4" -framerate "$fps" -i "$png/frame-%05d.png" \
      -filter_complex "[0:v]setpts=PTS-STARTPTS,format=$pf[d];[1:v]scale=out_color_matrix=bt709:out_range=tv,format=$pf,setpts=PTS-STARTPTS[r];[d][r]libvmaf=log_fmt=json:log_path=$log:n_threads=4" \
      -f null - 2> "$png/vmaf.err"; then
    say_tail "vmaf: " 400 "$png/vmaf.err" >&2; return 1
  fi
  LS_JQ -c 'include "lib"; ([.frames[].metrics.vmaf] | sort) as $v
    | (reduce .frames[] as $f (null; if . == null or $f.metrics.vmaf < .metrics.vmaf then $f else . end)) as $worst
    | {mean: (.pooled_metrics.vmaf.mean | pyround(2)), p1: ($v[($v | length) / 100 | floor] | pyround(2)), min: ($v[0] | pyround(2)),
       worst_frame: $worst.frameNum, frames: ($v | length)}' "$log"
}

# colour TMP [ARGS...]: the colour fixture rendered (ARGS: --10bit), decoded as its tags say, each patch against its value
colour() {
  local tmp=$1; shift
  local mp4=$tmp/colour.mp4 tags matrix rng
  render "$COLOUR" "$mp4" "$@" > /dev/null || return 1
  tags=$(probe_tags "$mp4")
  matrix=$(echo "$tags" | jq -r '{"bt709": "bt709", "smpte170m": "bt601", "bt470bg": "bt601", "bt2020nc": "bt2020"}[.color_space // ""] // "bt709"')
  rng=$(echo "$tags" | jq -r 'if (.color_range // "tv") == "tv" then "tv" else "pc" end')
  ffmpeg -v error -i "$mp4" -vf "select=eq(n\\,15),scale=in_color_matrix=$matrix:in_range=$rng:out_range=pc:flags=full_chroma_int+accurate_rnd,format=rgb24" \
    -frames:v 1 -f rawvideo - > "$tmp/colour.rgb" 2> /dev/null
  # the patches as painted: the "#rrggbb" strings from PATCHES to the file's first "];"
  local hexes
  hexes=$(jq -rn --rawfile s "$COLOUR" '($s | split("PATCHES")) as $p
    | if ($p | length) < 2 or ($p[0] | contains("];")) then empty
      else ("PATCHES" + ($p[1:] | join("PATCHES"))) | split("];")[0] | [match("\"#([0-9a-f]{6})\""; "g") | .captures[0].string][] end')
  "$MOTION" ci patches "$tmp/colour.rgb" 1920 1080 6 $hexes > "$tmp/patches.json" || return 1
  jq -c --argjson tags "$tags" --arg as "$matrix $rng" --argjson bytes "$(stat -f %z "$mp4")" '
    (reduce .patches[] as $p ({}; .[$p[0]] = {want: $p[1], got: $p[2], err: $p[3]})) as $errs
    | {worst_err_8bit: .worst, tags: $tags, decoded_as: $as, bytes: $bytes,
       worst_patches: ([$errs | to_entries[] | [.key, .value.err]] | sort_by(-.[1]) | .[:5]), patches: $errs}' "$tmp/patches.json"
}

q3() {
  local tmp mp4 mp4_10 png w8 w10 vm vm10 col8 col
  tmp=$(newtmp lightspeed-q3-)
  mp4=$tmp/ts1.mp4; mp4_10=$tmp/ts1-10bit.mp4; png=$tmp/png
  mkdir -p "$png"
  turn_begin export:Q3
  w8=$(render "$TS1" "$mp4") || { turn_end; return 1; }; w8=${w8%%$'\t'*}
  w10=$(render "$TS1" "$mp4_10" --10bit) || { turn_end; return 1; }; w10=${w10%%$'\t'*}
  render "$TS1" "$png" > /dev/null || { turn_end; return 1; }
  vm=$(vmaf "$mp4" "$png" 30) || { turn_end; return 1; }
  vm=$(echo "$vm" | LS_JQ -c --argjson tags "$(probe_tags "$mp4")" --argjson b "$(stat -f %z "$mp4")" --argjson w "$w8" \
    'include "lib"; .tags = $tags | .bytes = $b | .render_s = ($w | pyround(2))')
  vm10=$(vmaf "$mp4_10" "$png" 30) || { turn_end; return 1; }
  vm10=$(echo "$vm10" | LS_JQ -c --argjson tags "$(probe_tags "$mp4_10")" --argjson b "$(stat -f %z "$mp4_10")" --argjson w "$w10" \
    'include "lib"; .tags = $tags | .bytes = $b | .render_s = ($w | pyround(2))')
  vm=$(echo "$vm" | jq -c --argjson t "$vm10" '.ten_bit = $t')
  rm -rf "$png"  # 1.4 GB of frames
  col8=$(colour "$tmp") || { turn_end; return 1; }
  col=$(colour "$tmp" --10bit) || { turn_end; return 1; }
  col=$(echo "$col" | jq -c --argjson c "$col8" '.h264_8bit = ($c | {worst_err_8bit, tags, decoded_as, bytes, worst_patches})')
  turn_end
  record Q3.vmaf "$(echo "$vm" | LS_JQ -r 'include "lib"; .mean | pyf')" "VMAF mean (ts1, MP4 vs lossless frames; --10bit in detail)" "$vm" $H
  record Q3.colour "$(echo "$col" | jq .worst_err_8bit)" "worst patch error /255 (render --10bit, HEVC Main10; H.264 8-bit in detail)" "$col" $H
}

status=0
if has T1 || has T2; then t1_t2 || exit 1; fi
if has T4; then t4 || exit 1; fi
if has Q3; then q3 || exit 1; fi
exit $status
