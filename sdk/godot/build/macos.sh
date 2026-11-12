#!/usr/bin/env bash
# GD9: raea's own GodotJS editor for macOS arm64 (JavaScriptCore), from source as GodotJS's CI builds it
# (build_macos.yml at v1.1.0.beta1-4.6.1), arm64 only and Metal only. Everything in WORK, the editor in WORK/out.
#   sdk/godot/build/macos.sh WORK
set -euo pipefail
W=${1:?usage: macos.sh WORK}
mkdir -p "$W" && cd "$W"
echo "[1] sources"
git clone -q --depth 1 --branch 4.6.1-stable https://github.com/godotengine/godot.git godot 2>/dev/null
git clone -q --depth 1 --branch v1.1.0.beta1-4.6.1 --recurse-submodules --shallow-submodules https://github.com/godotjs/GodotJS.git godot/modules/GodotJS 2>/dev/null
echo "  godot $(git -C godot rev-parse --short HEAD), GodotJS $(git -C godot/modules/GodotJS rev-parse --short HEAD), quickjs-ng $(git -C godot/modules/GodotJS/quickjs-ng rev-parse --short HEAD)"
curl -fsSL -o ak.zip https://github.com/AccessKit/accesskit-c/releases/download/0.18.0/accesskit-c-0.18.0.zip
unzip -q -o ak.zip && rm ak.zip
echo "[2] GodotJS's JS runtime (scripts/out)"
(cd godot/modules/GodotJS && { pnpm install --frozen-lockfile >/dev/null 2>&1 || pnpm install >/dev/null; } && pnpm build >/dev/null && ls scripts/out | tr '\n' ' '); echo
echo "[3] scons in a venv"
python3 -m venv venv && venv/bin/pip install -q scons==4.9.1
cd godot
start=$(date +%s)
BUILD_NAME=raea ../venv/bin/scons -j6 platform=macos target=editor arch=arm64 use_jsc=yes vulkan=no \
  module_text_server_fb_enabled=yes accesskit_sdk_path="$W/accesskit-c-0.18.0/" skip_js_runtime=yes > "$W/scons.log" 2>&1 \
  || { tail -40 "$W/scons.log"; exit 1; }
echo "  built in $(( $(date +%s) - start )) s"
B=bin/godot.macos.editor.arm64
strip -S "$B" 2>/dev/null || true
mkdir -p "$W/out" && cp "$B" "$W/out/" && (cd "$W/out" && shasum -a 256 godot.macos.editor.arm64 | tee godot.sha256)
echo "  size: $(stat -f %z "$W/out/godot.macos.editor.arm64")"
"$W/out/godot.macos.editor.arm64" --headless --version 2>&1 | tail -1
# the editor as Godot.app, made from Godot's own template as its official Mac builds are (package.sh signs it with
# the template's editor entitlements: JavaScriptCore's JIT needs allow-jit under the hardened runtime)
rm -rf "$W/out/Godot.app" && cp -R misc/dist/macos_tools.app "$W/out/Godot.app" && mkdir -p "$W/out/Godot.app/Contents/MacOS"
cp "$B" "$W/out/Godot.app/Contents/MacOS/Godot" && chmod +x "$W/out/Godot.app/Contents/MacOS/Godot"
cp misc/dist/macos/editor.entitlements "$W/out/editor.entitlements"
echo "  $W/out/Godot.app"
