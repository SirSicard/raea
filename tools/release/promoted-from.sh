#!/usr/bin/env bash
# What a release is promoted from (11-11, Shane: "i dont want to wait so long"): a release whose code is a release
# candidate's is that candidate's binaries packed again, not a second three-hour compile. raea's version isn't compiled
# in (tools/release.sh writes share/raea/VERSION as it packs), so the candidate's binaries are the release's: what
# shipped is exactly what the candidate's checks ran.
#
# The candidate is the promote_from input when release.yml is run by hand ("none" builds from source even when the tag
# names one), else the annotated tag's "promoted-from: <tag>" line (tools/agents/release-go.sh writes it); with
# neither, the release is built from source as before. The candidate's commit may differ from the release's only in
# files no build reads (SAME below: the README, the workflows, the release and app-packing tools); anything else and
# this refuses, naming the files. Written to GITHUB_ENV as RAEA_PROMOTED_FROM (or printed, off Actions).
#   tools/release/promoted-from.sh TAG [FROM]       in release.yml, on the tag's checkout
#   tools/release/promoted-from.sh --check FROM REF  the files that differ, exit 1 if any (release-go.sh, before tagging)
set -euo pipefail
die() { echo "promoted-from: $*" >&2; exit 1; }

# what a candidate and its release may differ in: nothing a cargo build of the shipped binaries reads (engine/cli's
# tests include tools/release.sh and an sdk/guides page, and tests aren't in a release build). The skills (skills/, the
# raea-skills pin) and docs/ are read by no build either (11-11, Shane: "promote skills to the latest possible"):
# release.sh packs the skills the release's commit pins, and the skills gate (its skills-passed line) and check-cli
# hold them to the candidate's binaries, so newer skills go out on a candidate's binaries
SAME=(':(exclude)README.md' ':(exclude).github' ':(exclude)tools/release.sh' ':(exclude)tools/release-check.sh'
  ':(exclude)tools/release' ':(exclude)tools/agents' ':(exclude)tools/raea-app' ':(exclude)skills' ':(exclude)docs')

fetch_tag() { git cat-file -e "refs/tags/$1" 2>/dev/null || git fetch -q --depth=1 origin "refs/tags/$1:refs/tags/$1"; }
differ() { git diff --name-only "$1^{commit}" "$2^{commit}" -- . "${SAME[@]}"; }

if [ "${1:-}" = --check ]; then
  from=${2:?--check FROM REF}; ref=${3:?--check FROM REF}
  fetch_tag "$from" || die "no tag $from on origin"
  files=$(differ "refs/tags/$from" "$ref")
  [ -z "$files" ] && exit 0
  echo "promoted-from: $ref's code isn't $from's; these differ, so it can't be promoted (release from source instead):" >&2
  printf '  %s\n' $files >&2
  exit 1
fi

tag=${1:?tag}
from=${2:-}
if [ -z "$from" ]; then
  # the tag's own message; a branch or a SHA (a dry run by hand) has none
  git fetch -q --depth=1 origin "refs/tags/$tag:refs/tags/$tag" 2>/dev/null || true
  if [ "$(git cat-file -t "refs/tags/$tag" 2>/dev/null || true)" = tag ]; then
    from=$(git for-each-ref --format='%(contents)' "refs/tags/$tag" | sed -nE 's/^promoted-from: *(v[0-9][0-9A-Za-z.+-]*) *$/\1/p' | head -1)
  fi
fi
if [ -z "$from" ] || [ "$from" = none ]; then
  echo "promoted-from: none; built from source"
  exit 0
fi
[[ $from =~ ^v[0-9] ]] || die "$from isn't a release tag (v...)"
[ "$from" != "$tag" ] || die "$tag can't be promoted from itself"
fetch_tag "$from" || die "no tag $from on origin"
files=$(differ "refs/tags/$from" HEAD)
if [ -n "$files" ]; then
  echo "promoted-from: this checkout's code isn't $from's; these differ, so it can't be promoted (run release.yml by hand with promote_from: none to build it):" >&2
  printf '  %s\n' $files >&2
  exit 1
fi
echo "promoted-from: $from ($(git rev-parse --short "refs/tags/$from^{commit}")); its binaries, packed again as ${tag#v}"
if [ -n "${GITHUB_STEP_SUMMARY:-}" ]; then echo "Promoted from $from: its binaries, packed again as ${tag#v}; no compile." >> "$GITHUB_STEP_SUMMARY"; fi
if [ -n "${GITHUB_ENV:-}" ]; then echo "RAEA_PROMOTED_FROM=$from" >> "$GITHUB_ENV"; else echo "RAEA_PROMOTED_FROM=$from"; fi
