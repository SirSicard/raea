#!/usr/bin/env bash
# GD9: raea's Godot editors as the zips `raea setup godot` downloads from raea's release (apps/engines/src/godot.rs pins
# each one's sha256 and size). Each zip has one top folder, as GodotJS's do. The Mac editor (macos.sh's Godot.app) is
# signed with raea's Developer ID under the hardened runtime with Godot's editor entitlements, notarized and stapled;
# Linux's (linux.py) and Windows' (windows.py, both executables) are zipped as built.
#   sdk/godot/build/package.sh MAC_OUT LINUX_DIR WINDOWS_DIR DEST
# MAC_OUT is macos.sh's WORK/out; LINUX_DIR and WINDOWS_DIR hold what linux.py and windows.py wrote to the raea-gd9
# volume. Needs the signing keychain (~/Library/Keychains/raea-signing.keychain-db, its password in the login keychain)
# and RAEA_NOTARY_ENV, a file that sets ASC_KEY_PATH, ASC_KEY_ID and ASC_ISSUER_ID. Prints each zip's pin line.
set -euo pipefail
M=${1:?usage: package.sh MAC_OUT LINUX_DIR WINDOWS_DIR DEST}; L=${2:?}; WIN=${3:?}; D=${4:?}
V=4.6.1-raea
kc="$HOME/Library/Keychains/raea-signing.keychain-db"
mkdir -p "$D"
D=$(cd "$D" && pwd)
work=$(mktemp -d)
trap 'rm -rf "$work"' EXIT

pin() { # ZIP PROGRAM
  printf '%s  %s  %s  %s\n' "$(basename "$1")" "$(shasum -a 256 "$1" | cut -d' ' -f1)" "$(stat -f %z "$1")" "$2"
}

echo "[mac] sign, notarize, staple"
top="$work/godot-$V-macos-arm64"
mkdir -p "$top" && ditto "$M/Godot.app" "$top/Godot.app"
app="$top/Godot.app"
security unlock-keychain -p "$(security find-generic-password -s raea-signing-keychain -a raea -w)" "$kc"
identity=$(security find-identity -v -p codesigning "$kc" | awk '/Developer ID Application/ { print $2; exit }')
[ -n "$identity" ] || { echo "FAIL no Developer ID Application identity in $kc"; exit 1; }
codesign --force --options runtime --timestamp --keychain "$kc" --entitlements "$M/editor.entitlements" -s "$identity" "$app"
codesign --verify --deep --strict "$app"
ditto -c -k --keepParent "$app" "$work/notarize.zip"
set -a; . "${RAEA_NOTARY_ENV:?RAEA_NOTARY_ENV: a file that sets ASC_KEY_PATH, ASC_KEY_ID and ASC_ISSUER_ID}"; set +a
xcrun notarytool submit "$work/notarize.zip" --key "$ASC_KEY_PATH" --key-id "$ASC_KEY_ID" --issuer "$ASC_ISSUER_ID" --wait --output-format json | tee "$work/notary.json"
grep -q '"status" *: *"Accepted"' "$work/notary.json" || { echo "FAIL notarization: $(cat "$work/notary.json")"; exit 1; }
xcrun stapler staple "$app"
spctl --assess --type execute -vv "$app" 2>&1 | head -3
mac="$D/godot-$V-macos-arm64.zip"
rm -f "$mac" && (cd "$work" && ditto -c -k --norsrc --noextattr --keepParent "godot-$V-macos-arm64" "$mac")

echo "[linux]"
top="$work/godot-$V-linux-x86_64"
mkdir -p "$top" && cp "$L/godot.linuxbsd.editor.x86_64" "$top/" && chmod +x "$top/godot.linuxbsd.editor.x86_64"
(cd "$L" && shasum -a 256 -c godot.sha256)
linux="$D/godot-$V-linux-x86_64.zip"
rm -f "$linux" && (cd "$work" && zip -qrX "$linux" "godot-$V-linux-x86_64")

echo "[windows]"
top="$work/godot-$V-windows-x86_64"
mkdir -p "$top" && cp "$WIN/godot.windows.editor.x86_64.exe" "$WIN/godot.windows.editor.x86_64.console.exe" "$top/"
(cd "$WIN" && shasum -a 256 -c godot.sha256)
win="$D/godot-$V-windows-x86_64.zip"
rm -f "$win" && (cd "$work" && zip -qrX "$win" "godot-$V-windows-x86_64")

echo "[pins] asset  sha256  size  program"
{
  pin "$mac" "Godot.app/Contents/MacOS/Godot"
  pin "$linux" "godot.linuxbsd.editor.x86_64"
  pin "$win" "godot.windows.editor.x86_64.exe"
} | tee "$D/pins.txt"
