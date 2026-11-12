# contents.py: what a .blend holds, read before anything is taken from it.
#   raea blender run blender/contents.py IN.blend
# One line for each mesh object (its triangles as modelled, its modifiers, the collections it is in, whether it is
# marked as an asset), each collection, each geometry-node group and each material (image textures or nodes only).
# It writes nothing. Then: raea blender run blender/take.py IN.blend OUT.glb NAME.
import bpy, sys, os

NAME = "contents.py"


def fail(why):
    print(f"FAILED  {NAME}: {why}", file=sys.stderr)
    sys.exit(1)


def argv():
    return sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []


def main():
    a = argv()
    if len(a) < 1:
        fail("usage: contents.py IN.blend")
    src = os.path.abspath(a[0])
    if not os.path.isfile(src):
        fail(f"no file {src}")
    bpy.ops.wm.open_mainfile(filepath=src)
    seen = {o.name for o in bpy.context.view_layer.objects}
    for o in sorted(bpy.data.objects, key=lambda o: o.name):
        if o.type != "MESH":
            continue
        tris = sum(len(p.vertices) - 2 for p in o.data.polygons)
        mods = ",".join(m.type.lower() for m in o.modifiers) or "none"
        cols = ",".join(c.name for c in o.users_collection) or "none"
        marks = ("  asset" if o.asset_data else "") + ("" if o.name in seen else "  outside the view layer")
        print(f"object  {o.name!r}  {tris} triangles  modifiers {mods}  in {cols}{marks}")
    for c in sorted(bpy.data.collections, key=lambda c: c.name):
        meshes = sum(1 for o in c.all_objects if o.type == "MESH")
        print(f"collection  {c.name!r}  {meshes} meshes" + ("  asset" if c.asset_data else ""))
    for g in sorted(bpy.data.node_groups, key=lambda g: g.name):
        if g.bl_idname == "GeometryNodeTree":
            print(f"geometry nodes  {g.name!r}" + ("  asset" if g.asset_data else ""))
    for m in sorted(bpy.data.materials, key=lambda m: m.name):
        images = sum(1 for n in m.node_tree.nodes if n.type == "TEX_IMAGE" and n.image) if m.node_tree else 0
        kind = f"{images} image textures" if images else "nodes only (exports as flat factors: bake.py, or set it in the TSX)"
        print(f"material  {m.name!r}  {kind}" + ("  asset" if m.asset_data else ""))
    print(f"APPLIED  {NAME}: {src} read, nothing written")


main()
