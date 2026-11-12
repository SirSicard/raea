#!/bin/bash
# raea cloud's entrypoint (docs/cloud.feature CL3, CL10): the home folder back from RAEA_CLOUD_STATE when it's set,
# raea's skills for each installed agent (matched to this image's raea), then the server. On SIGTERM (a platform
# stopping or sleeping the container) the server stops and the home folder is saved again.
set -uo pipefail
here=/opt/raea-cloud
: "${RAEA_CLOUD_TOKEN:?raea-cloud: set RAEA_CLOUD_TOKEN (openssl rand -hex 32); every request must carry it}"

# started as root: give the home folder to raea (a new volume is root's) and go on as raea, environment kept
if [ "$(id -u)" = 0 ]; then
  [ "$(stat -c %u /home/raea)" = 1000 ] || chown -R raea:raea /home/raea
  # a platform may set its own HOME for root (Modal's is /root)
  export HOME=/home/raea
  exec setpriv --reuid=raea --regid=raea --init-groups "$0" "$@"
fi

"$here/image/state.sh" restore
mkdir -p "${RAEA_CLOUD_WORK:-$HOME/work}"

# the device raea renders on (CL13). auto: NVIDIA's Vulkan driver when the host passed a GPU in and the driver opens
# it (the host's ICD file, else the image's, which names the library the NVIDIA runtime mounts), else Mesa (llvmpipe
# on the CPU, or radv on an AMD card in /dev/dri). gpu: the same, but no GPU is an error. cpu: llvmpipe only.
device=${RAEA_CLOUD_DEVICE:-auto}
opens() {
  if [ -n "$1" ]; then VK_DRIVER_FILES=$1 timeout 60 vulkaninfo --summary; else timeout 60 vulkaninfo --summary; fi 2>/dev/null |
    grep -q 'PHYSICAL_DEVICE_TYPE_\(DISCRETE\|INTEGRATED\|VIRTUAL\)_GPU'
}
# raea renders through Vulkan. NVIDIA's Vulkan driver needs EGL installed (libegl1), and EGL is also a GL device to
# wgpu: NVIDIA's EGL counts as a discrete GPU and outranked lavapipe, so a render meant for the CPU went to GL and failed
# (11-10). Rendering on the CPU therefore hides EGL's vendors.
on_cpu() {
  # lvp_icd.json (Mesa 24 on), lvp_icd.x86_64.json before
  lvp=$(ls /usr/share/vulkan/icd.d/lvp_icd*.json 2>/dev/null | head -1)
  [ -n "$lvp" ] || { echo "raea-cloud: Mesa's lavapipe (lvp_icd*.json) isn't installed, so raea can't render on the CPU" >&2; exit 1; }
  export VK_DRIVER_FILES=$lvp __EGL_VENDOR_LIBRARY_DIRS=/nonexistent
}
if [ "$device" = cpu ]; then
  on_cpu
elif [ -z "${VK_DRIVER_FILES:-}" ]; then
  for icd in /etc/vulkan/icd.d/nvidia_icd.json /usr/share/vulkan/icd.d/nvidia_icd.json "$here/image/nvidia_icd.json"; do
    [ -f "$icd" ] && opens "$icd" && { export VK_DRIVER_FILES=$icd; break; }
  done
  if [ -z "${VK_DRIVER_FILES:-}" ] && ! opens ""; then
    if [ "$device" = gpu ]; then
      echo "raea-cloud: RAEA_CLOUD_DEVICE=gpu, but no GPU opened (vulkaninfo --summary lists none); was the container given one?" >&2
      exit 1
    fi
    on_cpu
  fi
fi

for a in $(node "$here/server/agents.ts" skills); do
  raea skills install --agent "$a" >/dev/null 2>&1 || echo "raea-cloud: raea's skills for $a weren't installed"
done

node "$here/server/main.ts" &
server=$!
stop() {
  kill -TERM "$server" 2>/dev/null
  wait "$server" 2>/dev/null
  "$here/image/state.sh" save
  exit 0
}
trap stop TERM INT
wait "$server"
