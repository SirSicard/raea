# take.py: the named objects and collections of a .blend as one .glb, the rest of the file left behind.
#   raea blender run blender/take.py IN.blend OUT.glb NAME [NAME ...]
# For a library or production .blend that holds many things (contents.py lists them). Each NAME is an object (its
# children come with it) or a collection. Modifiers are applied, so a subdivided mesh comes out at its subdivided
# count and a geometry-node setup as the mesh it makes on the file's frame: take a scatter's source meshes, not the
# scattered ground. The rest of the file stays loaded while it exports, so what the named things read from still
# works, and they export from a scene of their own, so a collection the file's view layer leaves out still exports.
# Lights and cameras aren't written. Then: raea gen check OUT.glb --h HEIGHT -o FIXED.glb (a library lays its assets
# out in a row, so the origin is rarely under the object).
import bpy, sys, os, json

NAME = "take.py"


def fail(why):
    print(f"FAILED  {NAME}: {why}", file=sys.stderr)
    sys.exit(1)


def argv():
    return sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []


def sidecar(src):
    for c in (src + ".json", os.path.splitext(src)[0] + ".json"):
        if os.path.isfile(c):
            return json.load(open(c))
    fail(f"no licence sidecar for {src}: write {src}.json as {{\"source\": URL, \"license\": \"CC0\", \"credit\": \"\"}}")


def main():
    a = argv()
    if len(a) < 3:
        fail("usage: take.py IN.blend OUT.glb NAME [NAME ...]")
    src, out, names = os.path.abspath(a[0]), os.path.abspath(a[1]), a[2:]
    if not os.path.isfile(src):
        fail(f"no file {src}")
    side = sidecar(src)
    bpy.ops.wm.open_mainfile(filepath=src)
    want = []
    for n in names:
        if n in bpy.data.collections:
            want += list(bpy.data.collections[n].all_objects)
        elif n in bpy.data.objects:
            o = bpy.data.objects[n]
            want += [o, *o.children_recursive]
        else:
            have = sorted([o.name for o in bpy.data.objects if o.type == "MESH"] + [c.name for c in bpy.data.collections])
            fail(f"nothing named {n!r} in {src}; it has: {', '.join(have)}")
    # each one's parents come too (as empty nodes), or the exporter, which walks down from the scene's top objects,
    # finds none to start from and writes an empty file; their other children stay behind
    for o in list(want):
        p = o.parent
        while p is not None:
            want.append(p)
            p = p.parent
    scene = bpy.data.scenes.new("take")
    for o in dict.fromkeys(want):
        scene.collection.objects.link(o)
        o.hide_viewport = o.hide_render = False
    meshes = [o for o in scene.objects if o.type == "MESH"]
    if not meshes:
        fail(f"no mesh among {', '.join(names)}")
    with bpy.context.temp_override(scene=scene, view_layer=scene.view_layers[0]):
        bpy.ops.export_scene.gltf(filepath=out, export_format="GLB", use_active_scene=True, export_apply=True, export_yup=True,
                                  export_gn_mesh=True, export_cameras=False, export_lights=False)
    steps = list(side.get("steps", [])) + [{"script": NAME, "from": os.path.basename(src), "took": names}]
    json.dump({**side, "steps": steps}, open(out + ".json", "w"), indent=2)
    print(f"APPLIED  {NAME}: {out} ({len(meshes)} meshes), licence in {out}.json")


main()
