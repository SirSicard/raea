# convert.py: a model raea can't load (FBX, OBJ, .blend, or a .gltf with loose files) as one .glb.
#   raea blender run blender/convert.py IN OUT.glb [--textures DIR] [--unit auto|m|cm|mm] [--max-texture 2048]
# Its transforms are applied, it's written in metres, y up, and its PBR textures go with it: what the importer wired,
# else the maps in --textures DIR (or a textures/ folder beside it) found by their usual names (diff or albedo or
# basecolor, nor_gl or normal, rough, metal, ao). --unit auto scales a model whose biggest side is over 50 (authored in
# centimetres or millimetres) to metres. Float maps (EXR) are written as 8-bit and every map is scaled down to
# --max-texture pixels a side (2048; 1024 for a prop seen from metres away). Then: raea gen check OUT.glb --h HEIGHT.
import bpy, sys, os, json, glob

NAME = "convert.py"


def fail(why):
    print(f"FAILED  {NAME}: {why}", file=sys.stderr)
    sys.exit(1)


def argv():
    return sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []


def opt(a, k, d=None):
    return a[a.index(k) + 1] if k in a and a.index(k) + 1 < len(a) else d


def sidecar(src):
    for c in (src + ".json", os.path.splitext(src)[0] + ".json"):
        if os.path.isfile(c):
            return json.load(open(c))
    fail(f"no licence sidecar for {src}: write {src}.json as {{\"source\": URL, \"license\": \"CC0\", \"credit\": \"\"}}")


def load(src):
    ext = src.lower().rsplit(".", 1)[-1]
    if ext == "blend":
        bpy.ops.wm.open_mainfile(filepath=src)
        return
    bpy.ops.wm.read_factory_settings(use_empty=True)
    op = {"fbx": bpy.ops.import_scene.fbx, "obj": bpy.ops.wm.obj_import, "glb": bpy.ops.import_scene.gltf,
          "gltf": bpy.ops.import_scene.gltf, "stl": bpy.ops.wm.stl_import, "ply": bpy.ops.wm.ply_import}.get(ext)
    if op is None:
        fail(f"can't read .{ext} (FBX, OBJ, .blend, glTF, STL, PLY)")
    op(filepath=src)


def save(out, src, side, step):
    meshes = [o for o in bpy.context.scene.objects if o.type == "MESH"]
    if not meshes:
        fail("no mesh to write")
    bpy.ops.export_scene.gltf(filepath=out, export_format="GLB", export_apply=True, export_yup=True)
    steps = list(side.get("steps", [])) + [step]
    json.dump({**side, "steps": steps}, open(out + ".json", "w"), indent=2)
    tris = sum(sum(len(p.vertices) - 2 for p in o.data.polygons) for o in meshes)
    print(f"APPLIED  {NAME}: {out} ({len(meshes)} meshes, {tris} triangles), licence in {out}.json")


KINDS = {"base": ("diff", "albedo", "basecolor", "base_color", "color", "col"), "normal": ("nor_gl", "normal_gl", "normal", "nor"),
         "rough": ("rough", "roughness"), "metal": ("metal", "metallic", "metalness"), "ao": ("ao", "occlusion")}


def maps(folder):
    found = {}
    for f in sorted(glob.glob(os.path.join(folder, "*"))):
        stem = os.path.splitext(os.path.basename(f))[0].lower()
        for kind, words in KINDS.items():
            if kind not in found and any(f"_{w}" in stem or stem.startswith(w) for w in words):
                found[kind] = f
    return found


def wire(mat, found):
    mat.use_nodes = True
    nt = mat.node_tree
    bsdf = next((n for n in nt.nodes if n.type == "BSDF_PRINCIPLED"), None)
    if bsdf is None:
        return 0
    def img(path, colour):
        n = nt.nodes.new("ShaderNodeTexImage")
        n.image = bpy.data.images.load(path, check_existing=True)
        n.image.colorspace_settings.name = "sRGB" if colour else "Non-Color"
        return n
    done = 0
    if "base" in found and not bsdf.inputs["Base Color"].is_linked:
        nt.links.new(img(found["base"], True).outputs["Color"], bsdf.inputs["Base Color"]); done += 1
    if "rough" in found and not bsdf.inputs["Roughness"].is_linked:
        nt.links.new(img(found["rough"], False).outputs["Color"], bsdf.inputs["Roughness"]); done += 1
    if "metal" in found and not bsdf.inputs["Metallic"].is_linked:
        nt.links.new(img(found["metal"], False).outputs["Color"], bsdf.inputs["Metallic"]); done += 1
    if "normal" in found and not bsdf.inputs["Normal"].is_linked:
        nm = nt.nodes.new("ShaderNodeNormalMap")
        nt.links.new(img(found["normal"], False).outputs["Color"], nm.inputs["Color"])
        nt.links.new(nm.outputs["Normal"], bsdf.inputs["Normal"]); done += 1
    return done


def shrink(most):
    import tempfile
    tmp = tempfile.mkdtemp(prefix="raea-convert-")
    n = 0
    for i in list(bpy.data.images):
        if i.source != "FILE" or not i.has_data and not i.size[0]:
            continue
        w, h = i.size
        if w == 0:
            continue
        k = min(1.0, most / max(w, h))
        if k == 1.0 and not i.is_float:
            continue
        if k < 1.0:
            i.scale(max(1, int(w * k)), max(1, int(h * k)))
        w, h = i.size
        px = [0.0] * (w * h * 4)
        i.pixels.foreach_get(px)
        j = bpy.data.images.new(i.name + "-8bit", w, h, alpha=True, float_buffer=False)
        j.colorspace_settings.name = i.colorspace_settings.name
        j.pixels.foreach_set(px)
        j.filepath_raw = os.path.join(tmp, f"{len(os.listdir(tmp))}.png")
        j.file_format = "PNG"
        j.save()
        i.user_remap(j)
        n += 1
    return n


def main():
    a = argv()
    if len(a) < 2:
        fail("usage: convert.py IN OUT.glb [--textures DIR] [--unit auto|m|cm|mm]")
    src, out = os.path.abspath(a[0]), os.path.abspath(a[1])
    if not os.path.isfile(src):
        fail(f"no file {src}")
    side = sidecar(src)
    load(src)
    meshes = [o for o in bpy.context.scene.objects if o.type == "MESH"]
    if not meshes:
        fail(f"{src} holds no mesh")
    for o in bpy.context.scene.objects:
        o.select_set(o.type in ("MESH", "EMPTY", "ARMATURE"))
    bpy.context.view_layer.objects.active = meshes[0]
    bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)
    # units: a model authored in centimetres is 100 times too big
    unit = opt(a, "--unit", "auto")
    big = max(max(o.dimensions) for o in meshes)
    s = {"m": 1.0, "cm": 0.01, "mm": 0.001}.get(unit, 0.01 if big > 50 else 1.0)
    if s != 1.0:
        for o in bpy.context.scene.objects:
            if o.parent is None:
                o.scale = [x * s for x in o.scale]
        bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
    folder = opt(a, "--textures") or os.path.join(os.path.dirname(src), "textures")
    found = maps(folder) if os.path.isdir(folder) else {}
    wired = sum(wire(m, found) for m in {s.material for o in meshes for s in o.material_slots if s.material}) if found else 0
    shrunk = shrink(int(opt(a, "--max-texture", "2048")))
    # an image packed in the file (a .glb's own textures) has no path and isn't missing
    missing = [i.filepath for i in bpy.data.images if i.source == "FILE" and not i.packed_file and not os.path.isfile(bpy.path.abspath(i.filepath))]
    if missing and not found:
        fail(f"textures it names are missing ({', '.join(missing[:3])}): give --textures DIR")
    save(out, src, side, {"script": NAME, "from": os.path.basename(src), "scale": s, "texturesWired": wired, "texturesShrunk": shrunk})


main()
