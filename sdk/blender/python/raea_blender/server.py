# The bridge's HTTP side: POST /rpc with the session's token, a JSON batch in, a JSON reply out, on 127.0.0.1 only.
# bpy is only safe on Blender's main thread, so:
#   headless (blender --background): the server runs on the main thread and runs each batch itself;
#   in a running Blender (the add-on): requests arrive on a thread, and a bpy.app.timers callback runs them on the
#   main thread, under a context override with the first window and its 3D view, as a script run from the UI would be.
import contextlib
import json
import os
import queue
import secrets
import sys
import threading
import time
from http.server import BaseHTTPRequestHandler, HTTPServer, ThreadingHTTPServer

import bpy

from . import rpc


class Handler(BaseHTTPRequestHandler):
    protocol_version = "HTTP/1.1"
    server_version = "raea-blender"
    timeout = 600  # an idle keep-alive connection is closed after this long

    def do_GET(self):
        self._send(200, json.dumps({"raea": "blender", "bridge": rpc.VERSION}).encode())

    def do_POST(self):
        if self.path != "/rpc":
            return self._send(404, b'{"error":"not found"}')
        if not secrets.compare_digest(self.headers.get("x-raea-token", ""), self.server.token):
            return self._send(403, b'{"error":"wrong or missing x-raea-token"}')
        n = int(self.headers.get("content-length") or 0)
        try:
            req = json.loads(self.rfile.read(n))
        except ValueError as e:
            return self._send(400, json.dumps({"error": f"not JSON: {e}"}).encode())
        res = self.server.run(req)
        self._send(200, json.dumps(res, separators=(",", ":"), allow_nan=False).encode())
        if rpc.State.quit:
            self.close_connection = True

    def _send(self, code, data):
        self.send_response(code)
        self.send_header("content-type", "application/json")
        self.send_header("content-length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def log_message(self, *args):
        pass


def ready_line(port):
    return "RAEA_BLENDER_READY " + json.dumps({"port": port, "pid": os.getpid(), "blender": bpy.app.version_string})


def alive(pid):
    if sys.platform == "win32":
        import ctypes
        h = ctypes.windll.kernel32.OpenProcess(0x00100000, False, pid)  # SYNCHRONIZE
        if not h:
            return False
        try:
            return ctypes.windll.kernel32.WaitForSingleObject(h, 0) == 0x102  # WAIT_TIMEOUT: still running
        finally:
            ctypes.windll.kernel32.CloseHandle(h)
    try:
        os.kill(pid, 0)
        return True
    except ProcessLookupError:
        return False
    except PermissionError:
        return True


def watch_parent(pid):
    """A headless Blender started by a program ends when that program does, even if it never said quit."""
    def loop():
        while alive(pid):
            time.sleep(1.0)
        os._exit(0)
    threading.Thread(target=loop, name="raea-blender-parent", daemon=True).start()


def serve_headless():
    """The bridge as the whole of a background Blender's run: RAEA_BLENDER_TOKEN (required), RAEA_BLENDER_PORT (0:
    any free port), RAEA_BLENDER_PARENT (a pid to outlive no longer). Prints the ready line with the port, then
    serves until a session says quit."""
    token = os.environ.get("RAEA_BLENDER_TOKEN")
    if not token:
        sys.exit("raea/blender: RAEA_BLENDER_TOKEN is not set")
    srv = HTTPServer(("127.0.0.1", int(os.environ.get("RAEA_BLENDER_PORT") or 0)), Handler)
    srv.token = token
    srv.run = rpc.dispatch
    if os.environ.get("RAEA_BLENDER_PARENT"):
        watch_parent(int(os.environ["RAEA_BLENDER_PARENT"]))
    print(ready_line(srv.server_address[1]), flush=True)
    try:
        while not rpc.State.quit:
            srv.handle_request()
    finally:
        srv.server_close()


# ---- in a running Blender (the add-on) ----

class Gui:
    server = None
    thread = None
    queue = queue.Queue()
    file = None


@contextlib.contextmanager
def ui_context():
    """A timer runs with no area in its context (Blender 5.2 gives it the window, older ones nothing); operators that
    need one (object.mode_set, view3d.*) get the window, its screen and its 3D view's main region, as a script run from
    Blender's UI would."""
    ctx = bpy.context
    wm = ctx.window_manager
    win = ctx.window or (wm.windows[0] if wm is not None and wm.windows else None)
    if ctx.area is not None or win is None:
        yield
        return
    kw = {"window": win, "screen": win.screen}
    area = next((a for a in win.screen.areas if a.type == "VIEW_3D"), None)
    if area is not None:
        kw["area"] = area
        region = next((r for r in area.regions if r.type == "WINDOW"), None)
        if region is not None:
            kw["region"] = region
    with ctx.temp_override(**kw):
        yield


def gui_run(req):
    """On a request thread: the batch handed to the main thread, and its reply waited for."""
    box = {}
    done = threading.Event()
    Gui.queue.put((req, box, done))
    done.wait()
    return box["r"]


def tick():
    """On the main thread (bpy.app.timers): queued batches run. A session inside a context manager holds Blender here,
    as a Python script would, until it leaves it; one that goes quiet for a minute there is unwound."""
    t0 = time.monotonic()
    quiet = 0.0
    while True:
        hold = rpc.held()
        try:
            req, box, done = Gui.queue.get(timeout=1.0) if hold else Gui.queue.get_nowait()
        except queue.Empty:
            if not hold:
                break
            quiet += 1.0
            if quiet >= 60.0:
                for s in rpc.State.sessions.values():
                    rpc.unwind(s, "raea/blender: the session went quiet inside a context manager")
            continue
        quiet = 0.0
        try:
            with ui_context():
                box["r"] = rpc.dispatch(req)
        except Exception as e:
            box["r"] = {"r": {}, "n": 0, "err": rpc.error(0, e)}
        done.set()
        if not rpc.held() and time.monotonic() - t0 > 0.05:
            break
    return 0.0 if not Gui.queue.empty() else 0.01


def live_file():
    base = os.environ.get("RAEA_HOME") or os.path.join(os.path.expanduser("~"), ".raea")
    return os.path.join(base, "blender", "live.json")


def start_gui(port=0):
    """Serves this Blender to raea/blender and writes ~/.raea/blender/live.json (port, token, pid) for connect()."""
    if Gui.server is not None:
        return Gui.server.server_address[1]
    srv = ThreadingHTTPServer(("127.0.0.1", int(os.environ.get("RAEA_BLENDER_PORT") or port)), Handler)
    srv.daemon_threads = True
    srv.token = os.environ.get("RAEA_BLENDER_TOKEN") or secrets.token_hex(16)
    srv.run = gui_run
    Gui.server = srv
    Gui.thread = threading.Thread(target=srv.serve_forever, name="raea-blender", daemon=True)
    Gui.thread.start()
    bpy.app.timers.register(tick, first_interval=0.0, persistent=True)
    path = live_file()
    os.makedirs(os.path.dirname(path), exist_ok=True)
    fd = os.open(path, os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o600)
    with os.fdopen(fd, "w") as f:
        json.dump({"port": srv.server_address[1], "token": srv.token, "pid": os.getpid(),
                   "blender": bpy.app.version_string}, f)
    Gui.file = path
    print(ready_line(srv.server_address[1]), flush=True)
    return srv.server_address[1]


def stop_gui():
    if Gui.server is None:
        return
    if bpy.app.timers.is_registered(tick):
        bpy.app.timers.unregister(tick)
    Gui.server.shutdown()
    Gui.server.server_close()
    Gui.server = None
    for s in list(rpc.State.sessions.values()):
        rpc.unwind(s, "raea/blender: the bridge stopped")
    rpc.State.sessions.clear()
    if Gui.file and os.path.exists(Gui.file):
        try:
            with open(Gui.file) as f:
                if json.load(f).get("pid") == os.getpid():
                    os.remove(Gui.file)
        except (OSError, ValueError):
            pass
    Gui.file = None
