#!/usr/bin/env bash
# RR0 (docs/rerender.feature): the re-render baseline. Renders bench/rerender/film.tsx (six 5 s shots, 900 frames at
# 1920x1080) the ways the overhaul is measured against, and writes OUT/run.json:
#   chunked  the six shot compositions as six renders, P at a time (as agents run them: xargs -P), joined with ffmpeg's
#            concat demuxer and -c copy (raea media concat where there's no ffmpeg, which re-encodes; run.json says
#            which joined them)
#   one      the "film" composition as one render. Before RR1 it holds shot 1's look and camera for all 900 frames, so
#            its cost is what one render of the film would cost; its picture isn't the film's
# For each render: its wall time, its first frame's time from the spawn (RAEA_STARTUP_TRACE: the cold start), RAEA_TIMES'
# split a frame (fed: React, the page and the 3D made; submit; wait: the GPU; copy: the readback; sink: the encoder) and
# RAEA_FRAME_LOG's per-frame react / sync / gpu, first frame apart.
#   bench/rerender/bench.sh [OUT]
#     RAEA_BIN  the raea to run (target/release/raea; on Windows target/release/raea.exe)
#     P         chunk renders at once (3, as the launch film's film.sh ran them)
#     MODES     "chunked one" by default; either alone
#     KEEP=1    keep the rendered MP4s (by default only run.json and the logs stay)
# Exits 1 when a render fails.
set -u
cd "$(dirname "$0")/../.." || exit 2
ROOT=$PWD
EXE=raea; case "$(uname -s)" in MINGW*|MSYS*|CYGWIN*) EXE=raea.exe ;; esac
BIN=${RAEA_BIN:-$ROOT/target/release/$EXE}
OUT=${1:-${TMPDIR:-/tmp}/raea-rerender-bench}
P=${P:-3}
MODES=${MODES:-chunked one}
FILM=$ROOT/bench/rerender/film.tsx
[ -x "$BIN" ] || { echo "bench: no raea at $BIN (set RAEA_BIN)"; exit 2; }
command -v jq > /dev/null || { echo "bench: needs jq"; exit 2; }
mkdir -p "$OUT"
# pixels and timing only: no Content Credentials, no watermark, no export cache (a hit would time nothing)
export RAEA_SIGN=0 RAEA_MARK=0 RAEA_EXPORT_CACHE=0 RAEA_TIMES=1 RAEA_RENDER_STATS=1
export BIN FILM OUT

now() { perl -MTime::HiRes=time -e 'printf "%.3f", time'; }
export -f now

# render ID OUTFILE: one render, its logs in OUT/ID.{log,tsv}, its wall time in OUT/ID.wall
render() {
  local id=$1 out=$2 t0 t1
  t0=$(now)
  RAEA_STARTUP_TRACE=$(perl -MTime::HiRes=time -e 'printf "%d", time*1000') RAEA_FRAME_LOG="$OUT/$id.tsv" \
    "$BIN" render "$FILM" --composition "$id" -o "$out" > "$OUT/$id.log" 2>&1
  local rc=$?
  t1=$(now)
  echo "$t0 $t1" | awk '{printf "%.3f", $2 - $1}' > "$OUT/$id.wall"
  [ $rc = 0 ] && grep -q '^APPLIED' "$OUT/$id.log" || { echo "bench: $id failed (exit $rc): $(grep -E 'REFUSED|error' "$OUT/$id.log" | head -2)"; return 1; }
}
export -f render

# stats ID: one render's numbers as JSON
stats() {
  local id=$1
  local times first frames
  times=$(grep -m1 '^{"direct"' "$OUT/$id.log" || echo '{}')
  # the last "first frame" mark: a piece with 3D starts again once it meets its first 3D frame
  first=$(grep "the fed render's first frame" "$OUT/$id.log" | tail -1 | awk '{print $3}')
  # RAEA_FRAME_LOG: frame, react, sync, draw3d, gpu3d, page, gpupage, gpu (ms); frame 0 is the cold one
  frames=$(awk -F'\t' 'NR == 2 { r0 = $2; s0 = $3; g0 = $8 }
    NR > 2 { n++; r += $2; s += $3; g += $8 }
    END { printf "{\"first\":{\"react\":%.2f,\"sync\":%.2f,\"gpu\":%.2f},\"rest_mean\":{\"react\":%.2f,\"sync\":%.2f,\"gpu\":%.2f},\"rows\":%d}", r0, s0, g0, (n ? r / n : 0), (n ? s / n : 0), (n ? g / n : 0), n + 1 }' "$OUT/$id.tsv" 2> /dev/null || echo '{}')
  jq -n --arg id "$id" --argjson wall "$(cat "$OUT/$id.wall")" --argjson first "${first:-null}" --argjson times "$times" --argjson log "$frames" \
    '{id: $id, wall_s: $wall, first_frame_ms: $first, frames: $times.frames, encoder: $times.video,
      ms_per_frame: $times.times.ms_per_frame, fps_incl_encode: $times.fps_incl_encode, frame_log: $log}'
}

machine() {
  local os gpu
  os=$(uname -sm)
  case "$(uname -s)" in
    Darwin) gpu=$(system_profiler SPDisplaysDataType 2> /dev/null | awk -F': ' '/Chipset Model/ {print $2; exit}') ;;
    MINGW*|MSYS*|CYGWIN*) gpu=$(powershell -NoProfile -Command "(Get-CimInstance Win32_VideoController | Select-Object -First 1).Name" 2> /dev/null | tr -d '\r') ;;
    *) gpu=$(lspci 2> /dev/null | awk -F': ' '/VGA|3D/ {print $2; exit}') ;;
  esac
  jq -n --arg os "$os" --arg gpu "${gpu:-unknown}" --arg host "$(hostname -s 2> /dev/null || hostname)" --arg raea "$("$BIN" --version 2> /dev/null | head -1)" \
    '{os: $os, gpu: $gpu, host: $host, raea: $raea}'
}

status=0
chunked=null one=null
if [[ " $MODES " == *" chunked "* ]]; then
  echo "bench: six shot renders, $P at a time"
  t0=$(now)
  printf '%s\n' 1 2 3 4 5 6 | xargs -P "$P" -I{} bash -c 'render shot-{} "$OUT/shot-{}.mp4"' || status=1
  t1=$(now)
  # the join, as agents do it
  : > "$OUT/list.txt"
  for k in 1 2 3 4 5 6; do echo "file '$OUT/shot-$k.mp4'" >> "$OUT/list.txt"; done
  j0=$(now)
  if command -v ffmpeg > /dev/null; then
    joiner="ffmpeg -f concat -c copy"
    ffmpeg -y -loglevel error -f concat -safe 0 -i "$OUT/list.txt" -c copy "$OUT/film-chunked.mp4" || status=1
  else
    joiner="raea media concat"
    "$BIN" media concat "$OUT"/shot-{1,2,3,4,5,6}.mp4 -o "$OUT/film-chunked.mp4" > "$OUT/concat.log" 2>&1 || status=1
  fi
  j1=$(now)
  shots=$(for k in 1 2 3 4 5 6; do stats shot-$k; done | jq -s .)
  chunked=$(jq -n --argjson shots "$shots" --argjson p "$P" --arg joiner "$joiner" \
    --argjson renders "$(echo "$t0 $t1" | awk '{printf "%.3f", $2 - $1}')" --argjson join "$(echo "$j0 $j1" | awk '{printf "%.3f", $2 - $1}')" \
    '{p: $p, renders_s: $renders, joiner: $joiner, join_s: $join, total_s: ($renders + $join),
      startups_s: ([$shots[].first_frame_ms // 0] | add / 1000),
      frames_s: ([$shots[] | (.frames // 0) * (.ms_per_frame.wall // 0)] | add / 1000),
      shots: $shots}')
  echo "bench: chunked $(echo "$chunked" | jq -r '"\(.total_s) s (renders \(.renders_s) s, join \(.join_s) s)"')"
fi
if [[ " $MODES " == *" one "* ]]; then
  echo "bench: the film as one render"
  render film "$OUT/film-one.mp4" || status=1
  one=$(stats film)
  echo "bench: one render $(echo "$one" | jq -r '"\(.wall_s) s, first frame \(.first_frame_ms) ms"')"
fi
jq -n --argjson machine "$(machine)" --argjson chunked "$chunked" --argjson one "$one" \
  '{film: {frames: 900, width: 1920, height: 1080, fps: 30, shots: 6}, machine: $machine, chunked: $chunked, one: $one,
    one_estimate_s: (if $chunked == null then null else ($chunked.frames_s + ($chunked.shots[0].first_frame_ms // 0) / 1000) end)}' > "$OUT/run.json"
[ "${KEEP:-0}" = 1 ] || rm -f "$OUT"/*.mp4
echo "bench: $OUT/run.json"
exit $status
