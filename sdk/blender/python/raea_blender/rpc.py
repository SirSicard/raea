# What a batch of operations from raea/blender does in Blender. Each session (one TypeScript client) has its own
# reference table and its own open context managers. A batch runs in order and stops at its first error, as a Python
# script stops at its first exception; the reply holds the results the client asked for and that error.
#
#   get   {x}                 the value at a path
#   set   {x, k, v}           setattr / setitem on the object at a path
#   del   {x, k}              delattr / delitem
#   call  {f, a, k, s?}       call the object at a path; the result kept in slot s
#   pin   {x, s}              the object at a path kept in slot s
#   free  {ids}               references released
#   enter {x, s?} / exit {err?}   a context manager (bpy.context.temp_override, ...) entered and left
#   exec  {code, vars, s?}    Python source, for what a path can't say; an expression's value, else `result`
#   hello / close / quit
import builtins
import importlib
import sys
import time
import traceback

import bpy

from . import codec

VERSION = 1


class Session:
    def __init__(self, sid):
        self.sid = sid
        self.refs = codec.Refs()
        self.stack = []  # context managers entered and not yet left
        self.seen = time.monotonic()


class State:
    sessions = {}
    quit = False


def held():
    """Whether some session is inside a context manager, so its next batch must run before Blender goes on."""
    return any(s.stack for s in State.sessions.values())


def module(name):
    if name == "bpy":
        return bpy
    if name == "builtins":
        return builtins
    m = sys.modules.get(name)
    if m is not None:
        return m
    try:
        return importlib.import_module(name)
    except ImportError:
        head, _, tail = name.rpartition(".")
        if not head:
            raise
        return getattr(module(head), tail)  # bpy.msgbus, bpy.app.handlers: attributes, not importable modules


def resolve(s, x):
    r = x["r"]
    obj = s.refs.get(r) if isinstance(r, int) else module(r)
    for kind, key in x.get("p", ()):
        if kind == ".":
            obj = getattr(obj, key)
        else:
            obj = obj[dec(s, key)]
    return obj


def dec(s, v, bufs=None):
    return codec.dec(v, s.refs, lambda x: resolve(s, x), bufs)


def assign(s, op, delete=False):
    target = resolve(s, op["x"])
    kind, key = op["k"]
    if kind == ".":
        if delete:
            delattr(target, key)
        else:
            setattr(target, key, dec(s, op["v"]))
    else:
        key = dec(s, key)
        if delete:
            del target[key]
        else:
            target[key] = dec(s, op["v"])


def unwind(s, why):
    while s.stack:
        cm = s.stack.pop()
        try:
            err = RuntimeError(why)
            cm.__exit__(RuntimeError, err, None)
        except Exception:
            traceback.print_exc()


def execute(s, op):
    o = op["o"]
    if o == "get":
        x = op["x"]
        v = codec.enc(resolve(s, x), s.refs)
        if isinstance(v, dict) and "$ref" in v and isinstance(x["r"], int) and not x.get("p"):
            s.refs.free([v["$ref"]])  # the slot already names it
            v["$ref"] = x["r"]
        return v
    if o == "set":
        return assign(s, op)
    if o == "del":
        return assign(s, op, delete=True)
    if o == "call":
        fn = resolve(s, op["f"])
        bufs = []
        args = [dec(s, a, bufs) for a in op.get("a", ())]
        kw = {k: dec(s, v, bufs) for k, v in (op.get("k") or {}).items()}
        r = fn(*args, **kw)
        if op.get("s"):
            s.refs.set(op["s"], r)
        if op.get("w"):
            out = {"v": codec.enc(r, s.refs)}
            if bufs:
                out["b"] = [codec.enc(b, s.refs) for b in bufs]
            return out
        return None
    if o == "pin":
        s.refs.set(op["s"], resolve(s, op["x"]))
        return None
    if o == "free":
        s.refs.free(op["ids"])
        return None
    if o == "enter":
        cm = resolve(s, op["x"])
        v = cm.__enter__()
        s.stack.append(cm)
        if op.get("s"):
            s.refs.set(op["s"], v)
        return None
    if o == "exit":
        if len(s.stack) < op.get("d", 1):
            return None  # its enter failed, so there is nothing to leave
        cm = s.stack.pop()
        if op.get("err"):
            err = RuntimeError(op["err"])
            cm.__exit__(RuntimeError, err, None)
        else:
            cm.__exit__(None, None, None)
        return None
    if o == "exec":
        ns = {"bpy": bpy, "__name__": "__raea__"}
        for k, v in (op.get("vars") or {}).items():
            ns[k] = dec(s, v)
        code = op["code"]
        try:
            compiled = compile(code, "<raea/blender exec>", "eval")
            r = eval(compiled, ns)
        except SyntaxError:
            exec(compile(code, "<raea/blender exec>", "exec"), ns)
            r = ns.get("result")
        if op.get("s"):
            s.refs.set(op["s"], r)
        return codec.enc(r, s.refs) if op.get("w") else None
    if o == "hello":
        return {"bridge": VERSION, "blender": bpy.app.version_string, "version": list(bpy.app.version),
                "background": bpy.app.background, "file": bpy.data.filepath, "python": sys.version.split()[0]}
    if o == "close":
        unwind(s, "raea/blender: the session closed")
        State.sessions.pop(s.sid, None)
        return None
    if o == "quit":
        State.quit = True
        return None
    raise ValueError(f"raea/blender: unknown operation {o!r}")


def error(i, e):
    tb = traceback.extract_tb(e.__traceback__)
    # the frames past this bridge: where in Blender's own Python the error came from
    frames = [f for f in tb if "raea_blender" not in f.filename]
    return {"i": i, "type": type(e).__name__, "msg": str(e),
            "trace": "".join(traceback.format_list(frames[-6:])) if frames else ""}


def dispatch(req):
    """One batch: {sid, ops: [...]} -> {r: {index: result}, n: ops run, err?}."""
    sid = req.get("sid") or "default"
    s = State.sessions.get(sid)
    if s is None:
        s = State.sessions[sid] = Session(sid)
    s.seen = time.monotonic()
    results = {}
    ops = req.get("ops", ())
    for i, op in enumerate(ops):
        try:
            r = execute(s, op)
            if op.get("w"):
                results[str(i)] = r
        except Exception as e:
            return {"r": results, "n": i, "err": error(i, e)}
    # sessions nobody has used for an hour (a client that died without closing) are dropped
    now = time.monotonic()
    for k in [k for k, v in State.sessions.items() if now - v.seen > 3600 and not v.stack]:
        State.sessions.pop(k, None)
    return {"r": results, "n": len(ops)}
