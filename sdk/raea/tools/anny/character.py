"""A character for raea/character: an Anny body (NAVER LABS' parametric human, Apache 2.0; MakeHuman's CC0
assets) on MakeHuman's game_engine rig, raea's one character skeleton (docs/skeleton.feature SK0a, the joints
sdk/character/src/character/bones.ts names): 22 for the body and 30 for the fingers, as projects/psx/export.py
writes a psx person.

    uv venv -p 3.12 ~/.cache/raea-anny-venv && uv pip install -p ~/.cache/raea-anny-venv/bin/python anny trimesh scipy roma pillow torch
    ~/.cache/raea-anny-venv/bin/python sdk/raea/tools/anny/character.py NAME [gender=0.5 age=0.3 ...] --out DIR

writes DIR/NAME/:
  body.glb       Anny's whole mesh skinned with her game_engine weights (MPFB2's) to the 52 joints, each a node of
                 its joint's name, the playtest's graph paper baked into its texture in the coordinates each face had
                 at rest (so the grid rides the body as it bends, and a paint look shades it)
  body.hull.glb  its ink outline (the mesh pushed out along its normals and turned inside out), skinned the same; looks
                 that draw their own outlines leave it out
  joint.glb      one tiny triangle: the hidden model each joint follows (<Model bones>)
  skeleton.json  raea's Skeleton (sdk/character/src/character/core.ts): the joints (names, parents, heads and tails
                 at rest, a finger's thickness), the body's sliders, its height and landmarks, and samples of the skin's
                 surface (each with its skin weights, so posed they are the skinned mesh's own points)

The rest is Anny's own A-pose (MakeHuman's), and every joint's rest frame is the world's (no bone roll), so the bind
matrices only undo each head's offset and a pose is each joint's turn from rest in the body's axes; raea's retarget lays
clips onto it. Coordinates: y up, the body facing +z, x its left, feet on y = 0, metres (Anny's (x, y, z) is (x, -z, y)
here). Until 0.1.1 this wrote Anny's cmu_mb rig (CMU's 31 joints, a `skin` list of 68 more), which raea no longer
reads (#68)."""
import io, json, os, struct, sys
import numpy as np, torch, trimesh, anny

CLAY = (236, 235, 230)
INK = (42, 42, 40)
OUTLINE = 0.007  # the outline's thickness, metres
GRID = 0.05  # the graph paper's cell, metres; every fourth line a major one
GRID_COLOUR = (169, 169, 164)
# the joints in skeleton order, parents first (bones.ts BODY_JOINTS, then FINGER_JOINTS)
BODY = ["pelvis", "spine_01", "spine_02", "spine_03", "neck_01", "head",
        "clavicle_l", "upperarm_l", "lowerarm_l", "hand_l", "clavicle_r", "upperarm_r", "lowerarm_r", "hand_r",
        "thigh_l", "calf_l", "foot_l", "ball_l", "thigh_r", "calf_r", "foot_r", "ball_r"]
FINGERS = [f"{f}_{k:02d}_{s}" for s in "lr" for f in ("thumb", "index", "middle", "ring", "pinky") for k in (1, 2, 3)]
ORDER = BODY + FINGERS
# surface samples a joint gives, the hands densest; and each joint's part (export.py's)
SAMPLES = {"hand": 40, "finger": 20, "pelvis": 120, "spine_01": 120, "spine_02": 120, "spine_03": 120, "head": 80}
PART = {"pelvis": "hips", "spine_01": "waist", "spine_02": "torso", "spine_03": "chest", "neck_01": "neck", "head": "head",
        "clavicle": "shoulder", "upperarm": "upperArm", "lowerarm": "foreArm", "hand": "palm", "thigh": "thigh",
        "calf": "shin", "foot": "foot", "ball": "toes"}
# the sliders' 0..1 (Anny extrapolates past them); the rest at 0.5
PRESETS = {
    "adult": {},
    "kid": {"gender": 0.5, "age": 0.3, "weight": 0.45, "height": 0.4},
    # the parkour course's man and woman (examples/character): about 1.77 m and 1.65 m
    "man": {"gender": 1.0, "age": 0.5, "muscle": 0.65, "weight": 0.5, "height": 0.68},
    "woman": {"gender": 0.0, "age": 0.5, "muscle": 0.45, "weight": 0.45, "height": 0.45},
}


def to_game(p):
    p = np.asarray(p)
    return np.stack([p[..., 0], p[..., 2], -p[..., 1]], axis=-1)


def paper(px=512):
    """one tile of graph paper (four cells a side, the major line on its edge) on the clay, as PNG bytes"""
    from PIL import Image
    img = np.tile(np.array(CLAY, np.uint8), (px, px, 1))
    cell = px // 4
    for k in range(4):
        w = 5 if k == 0 else 2
        for a in range(-(w // 2), w - w // 2):
            img[(k * cell + a) % px, :] = GRID_COLOUR
            img[:, (k * cell + a) % px] = GRID_COLOUR
    buf = io.BytesIO()
    Image.fromarray(img).save(buf, format="PNG")
    return buf.getvalue()


def glb(path, doc, chunks):
    """a GLB from its JSON and its chunks (bytes, target), laid one after another 4-byte aligned as buffer views"""
    views, blob = [], b""
    for data, target in chunks:
        blob += b"\0" * (-len(blob) % 4)
        v = {"buffer": 0, "byteOffset": len(blob), "byteLength": len(data)}
        if target:
            v["target"] = target
        views.append(v)
        blob += data
    blob += b"\0" * (-len(blob) % 4)
    doc = {"asset": {"version": "2.0", "generator": "raea sdk/raea/tools/anny/character.py"}, **doc,
           "bufferViews": views, "buffers": [{"byteLength": len(blob)}]}
    js = json.dumps(doc, separators=(",", ":")).encode()
    js += b" " * (-len(js) % 4)
    out = struct.pack("<III", 0x46546C67, 2, 12 + 8 + len(js) + 8 + len(blob))
    out += struct.pack("<II", len(js), 0x4E4F534A) + js + struct.pack("<II", len(blob), 0x004E4942) + blob
    with open(path, "wb") as fh:
        fh.write(out)


def export(model, eyes_model, name, body, out):
    names, parents = list(model.bone_labels), [int(p) for p in model.bone_parents]
    missing = [n for n in ORDER if n not in names]
    assert not missing, f"character.py: Anny's game_engine rig has no {missing}"
    with torch.no_grad():
        o = model(pose_parameters=torch.eye(4, dtype=torch.float64)[None, None].repeat(1, model.bone_count, 1, 1), phenotype_kwargs=body)
    V = to_game(o["rest_vertices"][0].numpy())
    heads, tails = to_game(o["rest_bone_heads"][0].numpy()), to_game(o["rest_bone_tails"][0].numpy())
    floor = V[:, 1].min()
    V[:, 1] -= floor; heads[:, 1] -= floor; tails[:, 1] -= floor
    faces = model.faces.numpy().astype(np.int64)
    J = len(ORDER)
    src = [names.index(n) for n in ORDER]
    par = []
    for n in ORDER:
        p = parents[names.index(n)]
        par.append(ORDER.index(names[p]) if p >= 0 and names[p] in ORDER else -1)
    assert par[0] == -1 and all(p < i for i, p in enumerate(par) if i), "character.py: parents come before children"
    H, T = heads[src], tails[src]
    # the skin: Anny's game_engine weights (six bones a vertex), Root's to the pelvis, the four largest kept
    Wd, Id = model.vertex_bone_weights.numpy().astype(np.float64), model.vertex_bone_indices.numpy().astype(np.int64)
    to_j = np.array([ORDER.index(n) if n in ORDER else 0 for n in names])
    W = np.zeros((len(V), J))
    np.add.at(W, (np.repeat(np.arange(len(V)), Wd.shape[1]), to_j[Id].reshape(-1)), Wd.reshape(-1))
    top = np.argsort(-W, axis=1)[:, :4]
    tw = np.take_along_axis(W, top, 1)
    tw[tw.sum(1) <= 0, 0] = 1
    tw /= tw.sum(1, keepdims=True)
    top[tw == 0] = 0
    normals = np.asarray(trimesh.Trimesh(V, faces, process=False).vertex_normals)
    # each face's graph paper on the pair of axes it faces least along at rest: a set of vertices per projection, so
    # no triangle mixes two
    fn = np.abs(np.cross(V[faces[:, 1]] - V[faces[:, 0]], V[faces[:, 2]] - V[faces[:, 0]]))
    dom = fn.argmax(1)
    vsrc, uv, idx, base = [], [], [], 0
    for ax, (a, b) in enumerate([(2, 1), (0, 2), (0, 1)]):
        g = faces[dom == ax]
        if len(g) == 0:
            continue
        used = np.unique(g)
        remap = -np.ones(len(V), dtype=np.int64); remap[used] = np.arange(len(used)) + base
        vsrc.append(used); uv.append(V[used][:, [a, b]]); idx.append(remap[g])
        base += len(used)
    vsrc, uv, idx = np.concatenate(vsrc), np.concatenate(uv) / (4 * GRID), np.concatenate(idx)
    jn, jw = top[vsrc].astype(np.uint16), tw[vsrc].astype(np.float32)
    # the joints' rest: at their heads, turned as the world (so the bind matrices only undo the head's offset)
    inv = np.zeros((J, 16), np.float32)
    for j in range(J):
        M = np.eye(4); M[:3, 3] = -H[j]
        inv[j] = M.T.reshape(-1)  # column-major
    folder = os.path.join(out, name)
    os.makedirs(folder, exist_ok=True)
    tex = paper()
    for kind in ("body", "hull"):
        hull = kind == "hull"
        pos = (V[vsrc] + (normals[vsrc] * OUTLINE if hull else 0)).astype(np.float32)
        nor = (-normals[vsrc] if hull else normals[vsrc]).astype(np.float32)
        tri = (idx[:, ::-1] if hull else idx).astype(np.uint32)
        chunks = [(pos.tobytes(), 34962), (nor.tobytes(), 34962), (uv.astype(np.float32).tobytes(), 34962),
                  (jn.tobytes(), 34962), (jw.tobytes(), 34962), (tri.tobytes(), 34963), (inv.tobytes(), None)]
        n = len(pos)
        accessors = [
            {"bufferView": 0, "componentType": 5126, "count": n, "type": "VEC3", "min": pos.min(0).tolist(), "max": pos.max(0).tolist()},
            {"bufferView": 1, "componentType": 5126, "count": n, "type": "VEC3"},
            {"bufferView": 2, "componentType": 5126, "count": n, "type": "VEC2"},
            {"bufferView": 3, "componentType": 5123, "count": n, "type": "VEC4"},
            {"bufferView": 4, "componentType": 5126, "count": n, "type": "VEC4"},
            {"bufferView": 5, "componentType": 5125, "count": int(tri.size), "type": "SCALAR"},
            {"bufferView": 6, "componentType": 5126, "count": J, "type": "MAT4"},
        ]
        attrs = {"POSITION": 0, "NORMAL": 1, "JOINTS_0": 3, "WEIGHTS_0": 4}
        if hull:
            material = {"pbrMetallicRoughness": {"baseColorFactor": [c / 255 for c in INK] + [1], "metallicFactor": 0.0, "roughnessFactor": 1.0}}
            extra = {}
        else:
            attrs["TEXCOORD_0"] = 2
            chunks.append((tex, None))
            material = {"pbrMetallicRoughness": {"baseColorTexture": {"index": 0}, "metallicFactor": 0.0, "roughnessFactor": 0.75}}
            extra = {"images": [{"bufferView": 7, "mimeType": "image/png"}], "samplers": [{"magFilter": 9729, "minFilter": 9987, "wrapS": 10497, "wrapT": 10497}],
                     "textures": [{"source": 0, "sampler": 0}]}
        joints = list(range(2, 2 + J))
        nodes = [{"name": kind, "mesh": 0, "skin": 0}, {"name": "skeleton", "children": joints}]
        nodes += [{"name": ORDER[j], "translation": H[j].tolist()} for j in range(J)]
        glb(os.path.join(folder, "body.glb" if not hull else "body.hull.glb"), {
            "scene": 0, "scenes": [{"nodes": [0, 1]}], "nodes": nodes, "accessors": accessors, "materials": [material],
            "meshes": [{"primitives": [{"attributes": attrs, "indices": 5, "material": 0}]}],
            "skins": [{"joints": joints, "inverseBindMatrices": 6, "skeleton": 1}], **extra}, chunks)
    # the hidden model a joint follows: one triangle a millimetre across
    t = np.array([[0, 0, 0], [1e-3, 0, 0], [0, 1e-3, 0]], np.float32)
    glb(os.path.join(folder, "joint.glb"), {"scene": 0, "scenes": [{"nodes": [0]}], "nodes": [{"mesh": 0}],
        "accessors": [{"bufferView": 0, "componentType": 5126, "count": 3, "type": "VEC3", "min": t.min(0).tolist(), "max": t.max(0).tolist()}],
        "meshes": [{"primitives": [{"attributes": {"POSITION": 0}}]}]}, [(t.tobytes(), 34962)])
    R = lambda v, k=5: [round(float(x), k) for x in v]
    # landmarks: between the eyes, from Anny's default rig (the game_engine rig has no eye bones); how far the hip
    # joint sits over a seat (the back of the upper thigh, the skin the thigh carries a hand's width under the hip,
    # behind the joint at rest)
    with torch.no_grad():
        eo = eyes_model(pose_parameters=torch.eye(4, dtype=torch.float64)[None, None].repeat(1, eyes_model.bone_count, 1, 1), phenotype_kwargs=body)
    EL = list(eyes_model.bone_labels)
    eh = to_game(eo["rest_bone_heads"][0].numpy())
    eyes = (eh[EL.index("eye.L")] + eh[EL.index("eye.R")]) / 2 - [0, floor, 0]
    th = ORDER.index("thigh_l"); hip = H[th]
    thigh = (W.argmax(1) == th) & (V[:, 1] < hip[1] - 0.03) & (V[:, 1] > hip[1] - 0.12)
    sit_drop = float(hip[2] - V[thigh, 2].min())
    # the skin's surface, sampled: for each joint the rest vertices it carries most (half their weight or more),
    # spread farthest point first; each its joints and weights, its offset from j[0]'s head and its normal
    surface, radius = [], {}
    for k, jn_ in enumerate(ORDER):
        base_, side = (jn_[:-2], jn_[-1].upper()) if jn_[-2:] in ("_l", "_r") else (jn_, "")
        finger = jn_ in FINGERS
        pt = (base_.split("_")[0] + str(int(base_.split("_")[1]))) if finger else PART.get(base_, PART.get(base_.split("_")[0], base_))
        want = SAMPLES.get("finger" if finger else base_, 30)
        cand = np.nonzero((top[:, 0] == k) & (tw[:, 0] >= 0.5))[0]
        if not len(cand):
            continue
        P = V[cand]
        if finger:
            # its thickness: the median of its skin's distance from the bone
            d = (T[k] - H[k]) / np.linalg.norm(T[k] - H[k]); v = P - H[k]
            radius[k] = float(np.median(np.linalg.norm(v - np.outer(v @ d, d), axis=1)))
        pick = [int(np.argmax(np.linalg.norm(P - P.mean(0), axis=1)))]
        dist = np.linalg.norm(P - P[pick[0]], axis=1)
        while len(pick) < min(want, len(cand)):
            pick.append(int(np.argmax(dist))); dist = np.minimum(dist, np.linalg.norm(P - P[pick[-1]], axis=1))
        for v in cand[pick]:
            js = [int(j) for j, x in zip(top[v], tw[v]) if x > 0]
            surface.append({"part": pt, "side": side, "j": js, "w": R(tw[v][:len(js)], 4), "o": R(V[v] - H[js[0]], 4), "n": R(normals[v], 3)})
    skel = {
        "name": name, "rig": "game_engine", "body": body, "height": round(float(V[:, 1].max()), 4),
        "joints": [{"name": ORDER[j], "parent": par[j], "head": R(H[j]), "tail": R(T[j]), **({"radius": round(radius[j], 5)} if j in radius else {})} for j in range(J)],
        "landmarks": {"eyes": R(eyes), "sitDrop": round(sit_drop, 4)},
    }
    # (a surface sample to a line: indented, the samples alone were 450 KB a body)
    body_js = json.dumps(skel, indent=1)
    lines = ",\n".join("  " + json.dumps(x, separators=(",", ":")) for x in surface)
    with open(os.path.join(folder, "skeleton.json"), "w") as fh:
        fh.write(body_js[:-2] + ',\n "surface": [\n' + lines + "\n ]\n}\n")
    print(f"{name}: {skel['height']:.3f} m, {J} joints, {len(surface)} surface samples, {len(idx)} faces -> {folder}")


if __name__ == "__main__":
    args = sys.argv[1:]
    out = args[args.index("--out") + 1]
    args = [a for i, a in enumerate(args) if a != "--out" and (i == 0 or args[i - 1] != "--out")]
    name, sliders = args[0], dict(a.split("=") for a in args[1:])
    model = anny.Anny(rig="game_engine", extrapolate_phenotypes=True).to(dtype=torch.float64)
    eyes_model = anny.Anny(extrapolate_phenotypes=True).to(dtype=torch.float64)
    body = {**{k: 0.5 for k in model.phenotype_labels}, **PRESETS.get(name, {}), **{k: float(v) for k, v in sliders.items()}}
    export(model, eyes_model, name, body, out)
