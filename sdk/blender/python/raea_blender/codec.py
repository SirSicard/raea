# Values between TypeScript and Python. JSON carries None, bools, numbers, strings and lists as themselves; everything
# else is a tagged object ({"$tag": ...}). Python objects with identity (bpy structs, collections, bmesh elements,
# modules, functions) cross as references: {"$ref": id, "t": type name}, the id an index into the session's table.
# mathutils values cross by value, as raea/blender's local mathutils classes are the same maths in TypeScript.
import array
import base64
import math

import mathutils

# TypedArray kind -> array.array typecode (both sides little-endian on every platform Blender ships)
BUF = {"f32": "f", "f64": "d", "i8": "b", "u8": "B", "i16": "h", "u16": "H", "i32": "i", "u32": "I"}
BUF_KIND = {v: k for k, v in BUF.items()}
MAX_SAFE = 2**53
VIEWS = {"dict_keys", "dict_values", "dict_items", "odict_keys", "odict_values", "odict_items"}


class Refs:
    """A session's referenced Python objects. Ids the client chose are positive (slots: a call's result, a pin);
    ids this side chose for returned objects are negative."""

    def __init__(self):
        self.table = {}
        self.next = -1

    def put(self, obj):
        i = self.next
        self.next -= 1
        self.table[i] = obj
        return i

    def get(self, i):
        try:
            return self.table[i]
        except KeyError:
            raise ReferenceError(f"raea/blender: reference {i} was released or never set (an earlier error?)") from None

    def set(self, i, obj):
        self.table[i] = obj

    def free(self, ids):
        for i in ids:
            self.table.pop(i, None)


def type_name(v):
    rna = getattr(v, "bl_rna", None)
    if rna is not None and not isinstance(v, type):
        try:
            return rna.identifier
        except Exception:
            pass
    return type(v).__name__


def num(x):
    return x if math.isfinite(x) else {"$f": "nan" if math.isnan(x) else ("inf" if x > 0 else "-inf")}


def nums(v):
    return [num(x) for x in v]


def enc(v, refs):
    """A Python value for the wire."""
    if v is None or v is True or v is False or isinstance(v, str):
        return v
    if isinstance(v, int):
        return v if -MAX_SAFE < v < MAX_SAFE else {"$int": str(v)}
    if isinstance(v, float):
        return num(v)
    t = type(v)
    if t is list or t is tuple:
        return [enc(x, refs) for x in v]
    if isinstance(v, mathutils.Vector):
        return {"$vec": nums(v)}
    if isinstance(v, mathutils.Matrix):
        return {"$mat": [nums(r) for r in v]}
    if isinstance(v, mathutils.Quaternion):
        return {"$quat": nums(v)}
    if isinstance(v, mathutils.Euler):
        return {"$eul": nums(v), "o": v.order}
    if isinstance(v, mathutils.Color):
        return {"$col": nums(v)}
    if isinstance(v, (set, frozenset)):
        return {"$set": [enc(x, refs) for x in sorted(v, key=repr)]}
    if t is dict:
        return {"$dict": [[enc(k, refs), enc(x, refs)] for k, x in v.items()]}
    if isinstance(v, (bytes, bytearray)):
        return {"$bytes": base64.b64encode(v).decode("ascii")}
    if isinstance(v, array.array) and v.typecode in BUF_KIND:
        return {"$buf": base64.b64encode(v.tobytes()).decode("ascii"), "t": BUF_KIND[v.typecode]}
    name = t.__name__
    if name == "bpy_prop_array":
        return [enc(x, refs) for x in v]
    if name == "IDPropertyArray":
        return v.to_list()
    if name == "Buffer" and t.__module__ == "gpu.types":  # gpu.types.Buffer: its values, as nested lists
        return v.to_list()
    if isinstance(v, (list, tuple)) or name in VIEWS or name.startswith("IDPropertyGroupView"):
        # a subclass (a struct sequence like bpy.app.version_file), or a dict view (keys(), values(), items())
        return [enc(x, refs) for x in v]
    return {"$ref": refs.put(v), "t": type_name(v)}


def dec(v, refs, resolve, bufs=None):
    """A wire value as Python. `resolve` evaluates a lazy path ({"$x": expr}); `bufs`, when given, collects the
    array.array made for each {"$buf"} so a call can send back what it wrote into them (foreach_get)."""
    if isinstance(v, list):
        return [dec(x, refs, resolve, bufs) for x in v]
    if not isinstance(v, dict):
        return v
    if "$ref" in v:
        return refs.get(v["$ref"])
    if "$x" in v:
        return resolve(v["$x"])
    if "$vec" in v:
        return mathutils.Vector(dec(v["$vec"], refs, resolve))
    if "$mat" in v:
        return mathutils.Matrix(dec(v["$mat"], refs, resolve))
    if "$quat" in v:
        return mathutils.Quaternion(dec(v["$quat"], refs, resolve))
    if "$eul" in v:
        return mathutils.Euler(dec(v["$eul"], refs, resolve), v.get("o", "XYZ"))
    if "$col" in v:
        return mathutils.Color(dec(v["$col"], refs, resolve))
    if "$set" in v:
        return {dec(x, refs, resolve, bufs) for x in v["$set"]}
    if "$tuple" in v:
        return tuple(dec(x, refs, resolve, bufs) for x in v["$tuple"])
    if "$dict" in v:
        return {dec(k, refs, resolve, bufs): dec(x, refs, resolve, bufs) for k, x in v["$dict"]}
    if "$bytes" in v:
        return base64.b64decode(v["$bytes"])
    if "$buf" in v:
        a = array.array(BUF[v["t"]])
        a.frombytes(base64.b64decode(v["$buf"]))
        if bufs is not None:
            bufs.append(a)
        return a
    if "$f" in v:
        return {"nan": math.nan, "inf": math.inf, "-inf": -math.inf}[v["$f"]]
    if "$int" in v:
        return int(v["$int"])
    raise TypeError(f"raea/blender: unknown value tag {sorted(v)}")
