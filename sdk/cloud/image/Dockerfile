# raea cloud (docs/cloud.feature): raea's Linux release, the ACP agents named in AGENTS and the server
# (sdk/cloud/server) on one port. Build from sdk/cloud:
#
#   docker build --platform linux/amd64 -f image/Dockerfile --build-arg RAEA_VERSION=0.1.1 \
#     --build-arg AGENTS="kimi-code claude-acp" -t raea-cloud .
#   docker run -p 8080:8080 -e RAEA_CLOUD_TOKEN=$(openssl rand -hex 32) -v raea-home:/home/raea raea-cloud
#
# raea ships for Linux on x86_64 only, so the image is linux/amd64 (an arm64 machine runs it emulated, slowly).
# One image for both: given an NVIDIA GPU (deploy/compose.gpu.yaml, Kubernetes' nvidia.com/gpu, Modal) raea renders
# on it, and without one on Mesa's llvmpipe (Vulkan on the CPU); /v1/health says which (CL13).
FROM node:24-trixie-slim

# raea's runtime libraries (what its ldd and Vulkan loader need: tools/release/linux/rl3.sh's list), and what the
# agents and the entrypoint use: git, curl (and its --aws-sigv4 for RAEA_CLOUD_STATE), zstd, script(1); vulkaninfo,
# which picks and reports the device. NVIDIA's Vulkan driver (libGLX_nvidia, which the container runtime mounts from
# the host) loads through glvnd and X11's libraries: without libxext6 it doesn't load, and without libgl1, libegl1 and
# libx11-6 it loads but gives the Vulkan loader no vkCreateInstance (driver 610.57 on Modal's T4 and A10G, 11-10).
RUN apt-get update -qq && DEBIAN_FRONTEND=noninteractive apt-get install -y -qq --no-install-recommends \
      ca-certificates curl git zstd xz-utils bzip2 unzip procps less ripgrep \
      libasound2t64 libfontconfig1 libvulkan1 mesa-vulkan-drivers vulkan-tools \
      libxext6 libx11-6 libgl1 libegl1 \
    && rm -rf /var/lib/apt/lists/* \
    && userdel -r node \
    && useradd -m -u 1000 -s /bin/bash raea

# raea, checked against its release's .sha256 (and against RAEA_SHA256 too, when it's given)
ARG RAEA_VERSION=0.1.1
ARG RAEA_SHA256=""
ARG RAEA_REPO=shinyobjectz/raea
RUN set -e; f=raea-$RAEA_VERSION-linux-x86_64.tar.gz; u=https://github.com/$RAEA_REPO/releases/download/v$RAEA_VERSION; \
    cd /tmp && curl -fsSL -o $f "$u/$f" && curl -fsSL -o $f.sha256 "$u/$f.sha256" \
    && sha256sum -c $f.sha256 \
    && { [ -z "$RAEA_SHA256" ] || echo "$RAEA_SHA256  $f" | sha256sum -c -; } \
    && mkdir -p /opt/raea && tar -xzf $f -C /opt/raea --strip-components=1 && rm -f $f $f.sha256 \
    && ln -s /opt/raea/bin/raea /usr/local/bin/raea && raea --version

WORKDIR /opt/raea-cloud
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --no-fund --no-audit --loglevel=error

# the agents, by ACP registry id (cdn.agentclientprotocol.com/registry): kimi-code, claude-acp, codex-acp, gemini,
# opencode, ... Their sign-ins and settings live in the home folder; their programs live here, in the image.
COPY server/agents.ts server/
ARG AGENTS=kimi-code
RUN node server/agents.ts install $AGENTS

COPY server server
COPY src src
COPY image/entrypoint.sh image/state.sh image/raea.sh image/nvidia_icd.json image/
# raea on PATH is image/raea.sh: raea itself, or a render handed to a GPU worker (RAEA_CLOUD_GPU_URL)
RUN chmod +x image/*.sh && ln -sf /opt/raea-cloud/image/raea.sh /usr/local/bin/raea

# the entrypoint starts as root only to hand a freshly mounted home volume (Fly's, a bind mount) to raea, then drops to
# raea for everything else; a platform that starts it as uid 1000 (Kubernetes' runAsUser) skips that step.
# NVIDIA_*: what the NVIDIA container runtime mounts when the container is given a GPU (graphics for Vulkan)
# WGPU_BACKEND: Bevy takes Vulkan only (the entrypoint's on_cpu says why GL must stay out)
ENV HOME=/home/raea NODE_ENV=production PORT=8080 NVIDIA_VISIBLE_DEVICES=all NVIDIA_DRIVER_CAPABILITIES=all \
    WGPU_BACKEND=vulkan
RUN mkdir -p "$HOME/work" && chown -R raea:raea "$HOME"
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s CMD curl -fsS http://127.0.0.1:8080/healthz || exit 1
ENTRYPOINT ["/opt/raea-cloud/image/entrypoint.sh"]
