# raea cloud on Modal (docs/cloud.feature CL14): the image from image/Dockerfile, built by Modal, on an NVIDIA GPU that
# starts on the first request and stops when idle. From sdk/cloud:
#
#   modal secret create raea-cloud RAEA_CLOUD_TOKEN=$(openssl rand -hex 32)
#   modal deploy deploy/modal/raea_cloud.py                     # an L4, else an A10G, else a T4
#   RAEA_CLOUD_GPU=L40S modal deploy deploy/modal/raea_cloud.py # one kind: T4, A10G, L40S, A100, H100, ... (Modal's)
#   RAEA_CLOUD_GPU=none modal deploy deploy/modal/raea_cloud.py # CPU only, app raea-cloud-cpu
#
# The URL it prints is the server: GET /v1/health says which GPU raea renders on. Use it as a render worker for a CPU
# box (RAEA_CLOUD_GPU_URL, RAEA_CLOUD_GPU_TOKEN there) or on its own, agent and all.
#
# - A comma list is a fallback order: Modal starts the first kind it has free (L4s ran out for ten minutes on 11-10).
# - One container takes every request (max_containers=1): a render job is followed on the container that runs it.
# - It stops after RAEA_CLOUD_IDLE seconds without a request (300), and a request wakes it: about a minute cold.
# - Its home folder is the container's own, so it starts clean each time unless RAEA_CLOUD_STATE (in the secret) keeps
#   it in a bucket; a render worker needs nothing kept.
# - Python because Modal apps are Python.

import os
import subprocess

import modal

HERE = os.path.dirname(os.path.abspath(__file__))
CLOUD = os.path.dirname(os.path.dirname(HERE))
GPU = os.environ.get("RAEA_CLOUD_GPU", "L4,A10G,T4")
GPU = None if GPU.lower() in ("", "none", "cpu") else [g.strip() for g in GPU.split(",") if g.strip()]

image = modal.Image.from_dockerfile(
    os.path.join(CLOUD, "image", "Dockerfile"),
    context_dir=CLOUD,
    build_args={
        "RAEA_VERSION": os.environ.get("RAEA_VERSION", "0.1.1"),
        "AGENTS": os.environ.get("RAEA_CLOUD_AGENTS", "kimi-code"),
    },
    # Modal runs the function in Python, which the image doesn't have
    add_python="3.12",
).entrypoint([])

app = modal.App(os.environ.get("RAEA_CLOUD_APP", "raea-cloud" if GPU else "raea-cloud-cpu"), image=image)


@app.function(
    gpu=GPU,
    cpu=float(os.environ.get("RAEA_CLOUD_CPU", 8)),
    memory=int(os.environ.get("RAEA_CLOUD_MEMORY", 16384)),
    secrets=[modal.Secret.from_name(os.environ.get("RAEA_CLOUD_SECRET", "raea-cloud"))],
    scaledown_window=int(os.environ.get("RAEA_CLOUD_IDLE", 300)),
    timeout=24 * 3600,
    max_containers=1,
)
@modal.concurrent(max_inputs=64)
@modal.web_server(8080, startup_timeout=600)
def server():
    # gpu: a GPU that doesn't open is an error at start, never a quiet fall back to the CPU
    env = {**os.environ, "RAEA_CLOUD_DEVICE": "gpu" if GPU else "cpu"}
    subprocess.Popen(["/opt/raea-cloud/image/entrypoint.sh"], env=env)
