#!/usr/bin/env bash
# A promoted release's binaries (tools/release/promoted-from.sh): the candidate FROM's archive for this machine's
# platform, downloaded from FROM's release, checked against its .sha256 and its attestation (signed by release.yml for
# FROM's tag in this repository), and unpacked into DEST as a build leaves them for tools/release.sh: raea and its
# bundler, raea-perceive, the two hosts, and symbols/: what the candidate's run kept of their symbols (never shipped;
# release.sh keeps them beside the new archive, and a Linux binary's debuglink names the same file).
#   GH_TOKEN=... tools/release/promoted-bins.sh FROM DEST
set -euo pipefail
die() { echo "promoted-bins: $*" >&2; exit 1; }
from=${1:?FROM}
dest=${2:?DEST}
repo=${GITHUB_REPOSITORY:-shinyobjectz/raea}
v=${from#v}
case $(uname -s) in
  Linux) platform=linux-x86_64 ext=tar.gz os=Linux ;;
  MINGW*|MSYS*|CYGWIN*) platform=windows-x86_64 ext=zip os=Windows ;;
  *) platform=macos-arm64 ext=tar.gz os=macOS ;;
esac
archive=raea-$v-$platform.$ext
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT
# the candidate's own release run (a tag push), for its symbols and to know whether an archive is still coming
run=$(gh run list -R "$repo" -w release.yml --branch "$from" -L 20 --json databaseId,event -q '[.[] | select(.event == "push")][0].databaseId')

# a release can go as soon as the Mac's archive is out (Shane, 11-11: "once mac is ready we can go live too"): a
# platform whose candidate archive is still being built waits for it here while the candidate's run goes on, and
# fails once that run has ended without one
attached() { local names; names=$(gh release view "$from" -R "$repo" --json assets -q '.assets[].name' 2>/dev/null) || return 1; grep -qx "$1" <<< "$names"; }
until attached "$archive" && attached "$archive.sha256"; do
  st=$([ -n "$run" ] && gh run view "$run" -R "$repo" --json status -q .status || echo unknown)
  [ "$st" = completed ] || [ "$st" = unknown ] && die "$from's release has no $archive, and its run ${run:-(not found)} isn't building one"
  echo "promoted-bins: waiting for $from's $archive (its run $run is $st)"
  sleep 120
done

gh release download "$from" -R "$repo" -p "$archive" -p "$archive.sha256" -D "$tmp" || die "$from's release has no $archive"
(cd "$tmp" && if command -v sha256sum >/dev/null; then sha256sum -c "$archive.sha256"; else shasum -a 256 -c "$archive.sha256"; fi) \
  || die "$archive doesn't match its .sha256"
gh attestation verify "$tmp/$archive" -R "$repo" --source-ref "refs/tags/$from" \
  --signer-workflow "github.com/$repo/.github/workflows/release.yml" >/dev/null \
  || die "$archive isn't attested as release.yml's build of $from"
echo "promoted-bins: $archive: sha256 and attestation checked"

mkdir -p "$tmp/x" "$dest"
if [ "$ext" = zip ]; then 7z x -y -bso0 -bsp0 -o"$tmp/x" "$tmp/$archive"; else tar -xzf "$tmp/$archive" -C "$tmp/x"; fi
[ -d "$tmp/x/raea/bin" ] || die "$archive has no raea/bin"
cp -p "$tmp/x/raea/bin/"* "$dest/"
ls -l "$dest"

# the symbols release.sh kept beside the candidate's archive, uploaded by its run as symbols-<OS> (Windows keeps none)
[ "$os" = Windows ] && exit 0
if [ -n "$run" ] && gh run download "$run" -R "$repo" -n "symbols-$os" -D "$tmp/sym" 2>/dev/null; then
  src=$tmp/sym
  # the artifact holds raea-VERSION-PLATFORM-symbols/ itself, or only what's in it
  for d in "$tmp/sym"/raea-*-symbols; do [ -d "$d" ] && src=$d; done
  mkdir -p "$dest/symbols" && cp -R "$src/." "$dest/symbols/"
  echo "promoted-bins: symbols from run $run: $(ls "$dest/symbols" | wc -l | tr -d ' ') files"
else
  echo "promoted-bins: note: no symbols-$os from $from's run ${run:-(none found)}; the release keeps none (they're never shipped)" >&2
fi
