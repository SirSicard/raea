"""What a collection's new() returns for each type it takes, and each node type's sockets by name: found by making one
of each in the scratch file dump.py runs in. RNA declares new() as returning the base (a Modifier), but Python gives the
subclass (modifiers.new(name, 'SUBSURF') is a SubsurfModifier), so the types can say what the script gets.
dump.py puts refine() into the dump as "refine"; tools/gen/refine.ts writes the types from it."""
import bpy


def enum_ids(struct, func, arg):
    return [i.identifier for i in getattr(bpy.types, struct).bl_rna.functions[func].parameters[arg].enum_items]


def probe(make, ids):
    out = {}
    for t in ids:
        try:
            x = make(t)
        except Exception:
            continue
        if x is not None:
            out[t] = x.bl_rna.identifier
    return out


def owner(data):
    ob = bpy.data.objects.new("refine-probe", data)
    bpy.context.scene.collection.objects.link(ob)
    return ob


def node_classes():
    """Every node type Python knows by bl_idname (built-in and add-on)."""
    seen = {}
    for name in dir(bpy.types):
        c = getattr(bpy.types, name, None)
        if isinstance(c, type) and issubclass(c, bpy.types.Node) and c is not bpy.types.Node:
            idname = getattr(c, "bl_idname", None) or name
            seen.setdefault(idname, c)
    return sorted(seen)


def sockets(coll):
    out, names = [], set()
    for s in coll:
        if s.name in names:
            continue  # Python's coll[name] is the first of that name
        names.add(s.name)
        out.append([s.name, s.bl_rna.identifier])
    return out


def nodes():
    trees = []
    for idname in ("ShaderNodeTree", "GeometryNodeTree", "CompositorNodeTree", "TextureNodeTree"):
        try:
            trees.append(bpy.data.node_groups.new("refine-" + idname, idname))
        except Exception:
            pass
    out = {}
    for idname in node_classes():
        for tree in trees:
            try:
                n = tree.nodes.new(idname)
            except Exception:
                continue
            out[idname] = {"struct": n.bl_rna.identifier, "in": sockets(n.inputs), "out": sockets(n.outputs)}
            break
    return out


def refine():
    mesh = owner(bpy.data.meshes.new("refine-probe"))
    gp = None
    for coll in ("grease_pencils", "grease_pencils_v3"):
        if hasattr(bpy.data, coll):
            try:
                gp = owner(getattr(bpy.data, coll).new("refine-gp"))
                break
            except Exception:
                pass

    def modifier(t):
        try:
            return mesh.modifiers.new("m", t)
        except Exception:
            return gp.modifiers.new("m", t) if gp else None

    def shader_fx(t):
        return (gp or mesh).shader_effects.new("fx", t)

    constraints = probe(lambda t: mesh.constraints.new(t), enum_ids("ObjectConstraints", "new", "type"))
    calls = [
        ("ObjectModifiers", "new", "type", probe(modifier, enum_ids("ObjectModifiers", "new", "type"))),
        ("ObjectConstraints", "new", "type", constraints),
        ("PoseBoneConstraints", "new", "type", constraints),
        ("BlendDataLights", "new", "type", probe(lambda t: bpy.data.lights.new("l", t), enum_ids("BlendDataLights", "new", "type"))),
        ("BlendDataTextures", "new", "type", probe(lambda t: bpy.data.textures.new("t", t), enum_ids("BlendDataTextures", "new", "type"))),
        ("BlendDataNodeTrees", "new", "type", probe(lambda t: bpy.data.node_groups.new("n", t), enum_ids("BlendDataNodeTrees", "new", "type"))),
    ]
    if hasattr(bpy.types, "ObjectShaderFx"):
        calls.append(("ObjectShaderFx", "new", "type", probe(shader_fx, enum_ids("ObjectShaderFx", "new", "type"))))
    found = nodes()
    calls.append(("Nodes", "new", "type", {k: v["struct"] for k, v in found.items()}))
    return {"calls": [{"struct": s, "func": f, "arg": a, "map": m} for (s, f, a, m) in calls if m], "nodes": found}
