# What a function written in Python returns, read from its own source (BL22), for dump.py: "None" when no path
# returns a value, a Python type (bool, str, list[str], tuple[int, int] | None, ...) when every `return` gives one its
# expression shows, else nothing, and gen leaves it any. Only what the source shows for certain: a value passed in, a
# call to another function, an attribute or a subscript is unknown, and one unknown return leaves the whole function so.
import ast
import inspect
import textwrap

# builtins whose result's type doesn't depend on their arguments
CALLS = {"bool": "bool", "int": "int", "float": "float", "str": "str", "repr": "str", "len": "int", "isinstance": "bool",
         "issubclass": "bool", "hasattr": "bool", "callable": "bool", "any": "bool", "all": "bool", "list": "list",
         "tuple": "tuple", "dict": "dict", "set": "set", "frozenset": "set", "sorted": "list", "chr": "str", "ord": "int"}
# str's methods that give a str, called on a string the source writes
STR = {"join", "format", "replace", "strip", "lstrip", "rstrip", "lower", "upper", "title", "capitalize", "casefold"}
# os.path's functions, by their result
OSPATH = {"join": "str", "basename": "str", "dirname": "str", "abspath": "str", "normpath": "str", "realpath": "str",
          "expanduser": "str", "relpath": "str", "exists": "bool", "isfile": "bool", "isdir": "bool", "isabs": "bool"}
SCOPES = (ast.FunctionDef, ast.AsyncFunctionDef, ast.Lambda, ast.ClassDef)
WRAPPERS = {"staticmethod", "classmethod", "property"}


def join(a, b):
    """One type for two a name or the returns can give, or None where they don't agree."""
    if a == b:
        return a
    if {a, b} == {"int", "float"}:
        return "float"
    for kind in ("list", "tuple", "dict", "set"):
        if a.split("[")[0] == kind and b.split("[")[0] == kind:
            return kind
    return None


def own(body):
    """Every node of a function body, leaving out nested functions and classes (their names and returns are theirs)."""
    todo = list(body)
    while todo:
        node = todo.pop()
        yield node
        if not isinstance(node, SCOPES):
            todo.extend(ast.iter_child_nodes(node))


class Reader:
    def __init__(self, fn):
        self.binds = {}  # name -> the expressions bound to it (None: bound some way the source can't type)
        for a in fn.args.posonlyargs + fn.args.args + fn.args.kwonlyargs + [fn.args.vararg, fn.args.kwarg]:
            if a is not None:
                self.binds.setdefault(a.arg, []).append(None)
        for node in own(fn.body):
            if isinstance(node, ast.Assign):
                for t in node.targets:
                    self.bind(t, node.value)
            elif isinstance(node, (ast.AnnAssign, ast.AugAssign)):
                self.bind(node.target, node.value if isinstance(node, ast.AnnAssign) else node)
            elif isinstance(node, ast.NamedExpr):
                self.bind(node.target, node.value)
            elif isinstance(node, (ast.For, ast.AsyncFor, ast.comprehension)):
                self.bind(node.target, None)
            elif isinstance(node, ast.withitem) and node.optional_vars is not None:
                self.bind(node.optional_vars, None)
            elif isinstance(node, ast.ExceptHandler) and node.name:
                self.binds.setdefault(node.name, []).append(None)
            elif isinstance(node, (ast.Import, ast.ImportFrom)):
                for a in node.names:
                    self.binds.setdefault((a.asname or a.name).split(".")[0], []).append(None)
            elif isinstance(node, (ast.Global, ast.Nonlocal)):
                for name in node.names:
                    self.binds.setdefault(name, []).append(None)
            elif isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef)):
                self.binds.setdefault(node.name, []).append(None)
        self.busy = set()

    def bind(self, target, value):
        if isinstance(target, ast.Name):
            self.binds.setdefault(target.id, []).append(value)
        else:  # a, b = ...; x.y = ...; x[i] = ...: names inside are bound some way we don't type
            for n in ast.walk(target):
                if isinstance(n, ast.Name):
                    self.binds.setdefault(n.id, []).append(None)

    def name(self, id):
        if id not in self.binds or id in self.busy:
            return None  # a global, or a name whose type depends on itself
        self.busy.add(id)
        try:
            out = None
            for v in self.binds[id]:
                t = self.aug(v) if isinstance(v, ast.AugAssign) else self.type(v)
                out = t if out is None else join(out, t) if t else None
                if out is None:
                    return None
            return out
        finally:
            self.busy.discard(id)

    def aug(self, node):
        # x += y keeps x's type when y's is the same kind (counts, strings, lists)
        t = self.type(node.value)
        return t if t in ("int", "float", "str") or (t or "").startswith(("list", "tuple")) else None

    def type(self, e):
        if e is None:
            return None
        if isinstance(e, ast.Constant):
            v = e.value
            return ("bool" if isinstance(v, bool) else "int" if isinstance(v, int) else "float" if isinstance(v, float)
                    else "str" if isinstance(v, str) else "bytes" if isinstance(v, bytes) else "None" if v is None else None)
        if isinstance(e, ast.JoinedStr):
            return "str"
        if isinstance(e, ast.Compare) or (isinstance(e, ast.UnaryOp) and isinstance(e.op, ast.Not)):
            return "bool"
        if isinstance(e, ast.UnaryOp):
            t = self.type(e.operand)
            return t if t in ("int", "float") else None
        if isinstance(e, ast.BoolOp):  # `a and b` gives one of its operands
            ts = [self.type(v) for v in e.values]
            return ts[0] if None not in ts and len(set(ts)) == 1 else None
        if isinstance(e, ast.IfExp):
            a, b = self.type(e.body), self.type(e.orelse)
            return join(a, b) if a and b else None
        if isinstance(e, ast.BinOp):
            a, b = self.type(e.left), self.type(e.right)
            if a in ("int", "float") and b in ("int", "float"):
                return "float" if isinstance(e.op, ast.Div) else join(a, b)
            if a == "str" and (b == "str" or isinstance(e.op, ast.Mod)):
                return "str"
            return None
        if isinstance(e, ast.Name):
            return self.name(e.id)
        if isinstance(e, (ast.List, ast.Set)):
            kind = "list" if isinstance(e, ast.List) else "set"
            ts = {self.type(x) for x in e.elts}
            return f"{kind}[{ts.pop()}]" if len(ts) == 1 and None not in ts and "None" not in ts else kind
        if isinstance(e, ast.ListComp):
            t = self.type(e.elt)
            return f"list[{t}]" if t and t != "None" else "list"
        if isinstance(e, (ast.SetComp, ast.Dict, ast.DictComp)):
            return "set" if isinstance(e, ast.SetComp) else "dict"
        if isinstance(e, ast.Tuple):
            ts = [self.type(x) for x in e.elts]
            return f"tuple[{', '.join(ts)}]" if ts and None not in ts and "None" not in ts else "tuple"
        if isinstance(e, ast.Call):
            f = e.func
            if isinstance(f, ast.Name) and f.id in CALLS and f.id not in self.binds:
                return CALLS[f.id]
            if isinstance(f, ast.Attribute):
                if f.attr in STR and self.type(f.value) == "str":
                    return "str"
                if (isinstance(f.value, ast.Attribute) and f.value.attr == "path" and isinstance(f.value.value, ast.Name)
                        and f.value.value.id == "os" and f.attr in OSPATH):
                    return OSPATH[f.attr]
        return None


def falls_through(stmts):
    """True when control can reach the end of these statements (and so the function return None there)."""
    if not stmts:
        return True
    last = stmts[-1]
    if isinstance(last, (ast.Return, ast.Raise)):
        return False
    if isinstance(last, ast.If):
        return falls_through(last.body) or falls_through(last.orelse)
    if isinstance(last, (ast.With, ast.AsyncWith)):
        return falls_through(last.body)
    if isinstance(last, ast.Try):
        if last.finalbody and not falls_through(last.finalbody):
            return False
        return falls_through(last.orelse or last.body) or any(falls_through(h.body) for h in last.handlers)
    if isinstance(last, ast.While) and isinstance(last.test, ast.Constant) and last.test.value is True:
        return any(isinstance(n, ast.Break) for n in own(last.body))
    return True


def returns(fn):
    """What a function written in Python returns, as a Python type, "None", or None when its source doesn't show."""
    try:
        top = ast.parse(textwrap.dedent(inspect.getsource(fn))).body[0]
    except (OSError, TypeError, SyntaxError, IndexError):
        return None
    if not isinstance(top, (ast.FunctionDef, ast.AsyncFunctionDef)):
        return None
    deco = {d.id if isinstance(d, ast.Name) else d.attr if isinstance(d, ast.Attribute) else "" for d in top.decorator_list}
    if deco - WRAPPERS or isinstance(top, ast.AsyncFunctionDef):
        return None  # a decorator can change what's returned; an async function gives a coroutine
    nodes = list(own(top.body))
    if any(isinstance(n, (ast.Yield, ast.YieldFrom)) for n in nodes):
        return None
    r = Reader(top)
    out, none = None, falls_through(top.body)
    for n in nodes:
        if not isinstance(n, ast.Return):
            continue
        t = "None" if n.value is None else r.type(n.value)
        if t is None:
            return None
        if t == "None":
            none = True
            continue
        out = t if out is None else join(out, t)
        if out is None:
            return None
    if out is None:
        return "None" if none else None
    return f"{out} | None" if none else out
