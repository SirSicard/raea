# GD9: raea's own GodotJS editor for Linux x86_64 (QuickJS-ng), built from source as GodotJS's CI builds its release
# (build_linux.yml at v1.1.0.beta1-4.6.1): Godot 4.6.1-stable with GodotJS as modules/GodotJS, its JS runtime built by
# pnpm (scripts/out), AccessKit-c 0.18.0, on Ubuntu 22.04 (one LTS back, for portability). Writes the stripped editor
# and its sha256 to a Modal volume; nothing is uploaded anywhere else.
#   MODAL_PROFILE=<profile> modal run sdk/godot/build/linux.py
import subprocess

import modal

image = (
    modal.Image.from_registry("ubuntu:22.04", add_python="3.12")
    .apt_install("build-essential", "pkg-config", "git", "curl", "ca-certificates", "xz-utils", "unzip",
                 "libx11-dev", "libxcursor-dev", "libxinerama-dev", "libgl1-mesa-dev", "libglu1-mesa-dev",
                 "libasound2-dev", "libpulse-dev", "libudev-dev", "libxi-dev", "libxrandr-dev", "libwayland-dev",
                 "libwayland-bin")
    .pip_install("scons==4.9.1")
)
vol = modal.Volume.from_name("raea-gd9", create_if_missing=True)
app = modal.App("raea-gd9-linux", image=image)

SCRIPT = r"""
set -euo pipefail
cd /build
echo "[1] node and pnpm"
v=$(curl -fsSL https://nodejs.org/dist/latest-v24.x/SHASUMS256.txt | awk '/linux-x64.tar.xz/{print $2}')
curl -fsSL -o "$v" "https://nodejs.org/dist/latest-v24.x/$v"
curl -fsSL https://nodejs.org/dist/latest-v24.x/SHASUMS256.txt | grep " $v\$" | sha256sum -c - >/dev/null && echo "  $v checked"
mkdir node && tar -xf "$v" -C node --strip-components 1 && rm "$v"
export PATH=/build/node/bin:$PATH
corepack enable --install-directory /build/node/bin && corepack prepare pnpm@10.11.0 --activate >/dev/null
node --version; pnpm --version
echo "[2] sources"
git clone -q --depth 1 --branch 4.6.1-stable https://github.com/godotengine/godot.git godot
git clone -q --depth 1 --branch v1.1.0.beta1-4.6.1 --recurse-submodules --shallow-submodules https://github.com/godotjs/GodotJS.git godot/modules/GodotJS
echo "  godot $(git -C godot rev-parse --short HEAD), GodotJS $(git -C godot/modules/GodotJS rev-parse --short HEAD), quickjs-ng $(git -C godot/modules/GodotJS/quickjs-ng rev-parse --short HEAD)"
curl -fsSL -o ak.zip https://github.com/AccessKit/accesskit-c/releases/download/0.18.0/accesskit-c-0.18.0.zip
unzip -q -o ak.zip -d /build && rm ak.zip && ls -d /build/accesskit-c-0.18.0
echo "[3] GodotJS's JS runtime (scripts/out)"
cd godot/modules/GodotJS
pnpm install --frozen-lockfile >/dev/null 2>&1 || pnpm install >/dev/null
pnpm build >/dev/null
ls scripts/out | tr '\n' ' '; echo
cd /build/godot
echo "[4] scons: editor, QuickJS-ng"
start=$(date +%s)
BUILD_NAME=raea scons -j$(nproc) platform=linuxbsd target=editor use_quickjs_ng=yes module_text_server_fb_enabled=yes \
  accesskit_sdk_path=/build/accesskit-c-0.18.0/ skip_js_runtime=yes > /build/scons.log 2>&1 || { tail -40 /build/scons.log; exit 1; }
echo "  built in $(( $(date +%s) - start )) s"
rm -rf bin/build_deps
strip bin/godot.*
chmod +x bin/godot.*
ls -la bin/
B=bin/godot.linuxbsd.editor.x86_64
$B --headless --version 2>&1 | tail -1
mkdir -p /out/linux && cp $B /out/linux/ && (cd /out/linux && sha256sum godot.linuxbsd.editor.x86_64 | tee godot.sha256)
echo "  size: $(stat -c %s /out/linux/godot.linuxbsd.editor.x86_64)"
"""


@app.function(cpu=16, memory=32768, timeout=5400, volumes={"/out": vol})
def build() -> str:
    import os
    os.makedirs("/build", exist_ok=True)
    r = subprocess.run(["bash", "-c", SCRIPT], capture_output=True, text=True)
    vol.commit()
    return r.stdout + ("\n--stderr--\n" + r.stderr[-4000:] if r.stderr.strip() else "") + f"\nexit {r.returncode}"


@app.local_entrypoint()
def main():
    print(build.remote())
