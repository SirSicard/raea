# A background Blender serving raea/blender until its session says quit:
#   RAEA_BLENDER_TOKEN=... blender --background [FILE.blend] --python headless.py
# raea/blender's launch() and `raea blender run SCRIPT.ts` start it this way and read the ready line it prints.
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from raea_blender import server  # noqa: E402

server.serve_headless()
