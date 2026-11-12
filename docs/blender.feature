@spec
Feature: Blender as a measured workshop step: an asset passes through it on its way into media/
  Shane, 2026-11-07: "how do we correctly utilize blender AND how do we correctly prompt in the skill how and when to
  use blender versus our manifold/3d-mesh building in typescript". The 11-06 research (REPORT.md sections 1, 2, 4, 8):
  Claude models badly in bpy (CADClamp: 0.889 in code-CAD, 0.499 in bpy) and well in code-shaped work on assets that
  are already good (rigs, bakes, LODs, batch fixes); a live Blender session is a bad source of truth (five agents on a
  shared MCP stacked their props at the origin; headless won the edit round). So TSX is the scene; solids, sdf and grow
  make what numbers or rules define; raea gen and CC0 libraries make what looks define; and Blender is the workshop
  between an asset's source and media/. It never places, lights, frames, materials or animates a scene.

  Background:
    Given a Blender step is a saved script in the project's blender/ folder, run by `raea blender run`, re-run when
      its source changes; the library ships in sdk/guides/craft/bevy/blender/ and `raea blender run blender/X.py`
      copies a library script there the first time
    And every script takes its arguments after `--`, writes one .glb with the source's licence sidecar beside it
      (MODEL.glb.json), and exits non-zero with the reason when it can't do its job
    And a step is triggered by a measured finding, never by taste: each finding below carries its fix as text
      ("fix: raea blender run blender/X.py ...") and in its JSON (`fix.blender`, `fix.run`)

  Rule: Getting a solid out

    @done
    Scenario: BL1. raea solid export writes a solid as one .glb
      Given a solid file and `raea solid export FILE.ts -o OUT.glb [--set k=v,...] [--part NAME]`
      Then the solid (or the one part) is written as a .glb, metres, y up
      And an empty or non-watertight solid is refused, with solid info's findings printed
      And the .glb read back has the same volume, pieces and box as the solid, within 0.5%

  Rule: The script library

    @done
    Scenario: BL2. convert.py: FBX, OBJ or .blend to one .glb
    @done
    Scenario: BL3. decimate.py: to a triangle budget (a ratio or a count), with LOD copies for far placements
    @done
    Scenario: BL4. repair.py: merged doubles, loose debris dropped, holes filled, normals out, or a voxel remesh
    @done
    Scenario: BL5. split.py: one blob into named parts by boxes, each its own node (a door that opens)
    @done
    Scenario: BL6. bake.py: unwrapped UVs, ambient occlusion baked, and a normal map from a high-poly source
    @done
    Scenario: BL7. rig.py: a bone chain and rigid or automatic weights for a model with no skeleton, and named pose clips
    @done
    Scenario: BL8. cloth.py: a cloth simulated and baked to a morph-target clip
    @done
    Scenario: BL9. Each script has run once on a real asset and its output passes raea gen check

  Rule: Measured triggers

    @done
    Scenario: BL10. Triangles over the budget for the viewing distance name decimate.py
      Given gen check's --seen M (or scene lint's camera distance to the model)
      Then the budget is 150 000 triangles at 1 m or closer, falling with the square of the distance, at least 2 000
    @done
    Scenario: BL11. A wrong piece count names repair.py (generator debris) or split.py (fewer parts than --parts)
    @done
    Scenario: BL12. Open or over-shared edges on a model meant to be solid name repair.py
    @done
    Scenario: BL13. A blob the brief says moves in parts (--parts door,body) names split.py
    @done
    Scenario: BL14. Textures wanted on a solid (its file's `needs.textured`) name solid export then bake.py
    @done
    Scenario: BL15. A model the brief says moves (--rig) with no skin names rig.py
    @done
    Scenario: BL16. A format raea can't load (gen check FILE.fbx, a Model src .obj) names convert.py

  Rule: The skill

    @done
    Scenario: BL17. scenes.md routes by what defines an object and says when it then goes through Blender
    @done
    Scenario: BL18. blender.md is written around the triggers: headless, saved scripts, live MCP to inspect only
    @done
    Scenario: BL19. prompts.md's builder prompt routes and uses Blender the same way

  Rule: Proven

    @done
    Scenario: BL20. A workbench corner uses a solid baked in Blender, a CC0 model converted and decimated, a Tripo
      model split into parts and a model rigged in Blender and posed in raea; every step re-runs from scratch
    @done
    Scenario: BL21. Its review sheets are judged by Kimi and clef every round until Kimi passes or 8 rounds stall (11-07: 8 rounds, stalled; best Kimi round 4)

  Rule: Blender's API from TypeScript (raea/blender, sdk/blender)
    Shane, 2026-11-10: "include natively a blender api package ... solid scripting parity to the official blender python
    api. we will own this ourselves". A workshop step can be TypeScript: the same bpy, bmesh and mathutils, typed, so an
    agent writes it in the language it writes the scene in, and tsc catches what Python finds only when it runs.

    @done
    Scenario: BL22. The whole API is typed from Blender's own: tools/gen.sh dumps Blender's RNA and docstrings, gen writes src/gen
      Given Blender 5.2.1: 1809 structs (bpy.types), 2498 operators in 77 bpy.ops modules, and 41 modules outside RNA
        (mathutils' submodules, bmesh, gpu, bpy.utils, bpy.path, bpy.props, bpy.msgbus, bpy_extras, aud, imbuf, idprop)
      Then 32 of bpy.types' 16 684 declarations are typed `any` (0.2%; 127 before 11-11), and 47 of the 1 440 of the
        modules outside RNA (423 before 11-11); operators have none. What's left is dynamic by nature (bpy_struct.get,
        path_resolve, an ID property group's get), context managers and draw handlers' handles, and Python helpers
        whose source returns another call's result
      And a function written in Python returns what its own source shows: nothing, as Python's None, where it returns
        no value anywhere (dump.py returns_none); else the type every `return` gives, when each shows one
        (tools/returns.py: a literal, a comparison, a builtin's result, a local only ever bound to such):
        CyclesPreferences.has_active_device() a boolean, Mesh.edge_keys an array, BoneCollection.bones_recursive a set.
        test/returns.test.ts runs its cases and reads every member it types on live meshes, bone collections and
        Cycles' preferences in Blender (11-11)
      And a sequence whose name doesn't give its items has them from Blender's C: bm.select_history[i] a vertex, edge
        or face, a BMElemSeq's any element, a layer collection's BMLayerItems, a deform vertex's [group] a weight, an
        IDPropertyArray's numbers or booleans; BMVert[layer] and an ID property group (by name, through `$`) take no
        number
      And Python's own names a Blender module imports (anim_utils' Mapping, Sequence, typing aliases) are left out, and
        bpy.props' functions give _PropertyDeferred, the private class their docstrings name
      And where a C method's or property's docstring gives no type, tools/cret.sh reads it from the bindings' own C
        source (tools/cret.json: 284 method and 123 property names, each where every C function bound to that name
        agrees, a returned local by its every assignment): None, bool, int, float, str, or a tuple a Py_BuildValue
        format makes; test/cret.test.ts reads every property so typed on live bmesh, aud, imbuf and mathutils objects
        in Blender and gets that type (11-11)
      And two dumps of one Blender write the same src/gen (sets sorted, no memory addresses)
      And tsc rejects a read-only property set, an enum value Blender doesn't have, a member that isn't there, a wrong
        argument type, and arithmetic on an unawaited path (test/typing.ts)
    @done
    Scenario: BL23. A path is lazy, as Python's attribute access is: reads awaited, writes and calls sent in order without waiting
      Then `ob.location.x = 5`, `ob.location.z = ob.scale.y` (read in Blender), operators with keyword arguments, objects a
        call returns used at once and stable once awaited, `for await` over a collection, foreach_get into a typed array,
        custom properties through `$`, `with` (temp_override) and Python source by exec all behave as in Python
        (test/bridge.test.ts, against a real headless Blender)
    @done
    Scenario: BL24. Errors are Python's: a batch stops at its first error, which the next await throws as a BlenderError
      Then the error has Python's type and message, and the session goes on after it is caught
      And under Node or Bun a failure no await saw fails the process when the script ends, as an uncaught exception would
    @done
    Scenario: BL25. mathutils is computed in TypeScript with Blender's own maths, and agrees with Blender's
      Then 58 operations on 25 seeded random inputs each (1450 values: Vector, Matrix, Quaternion, Euler, Color) match
        Blender's mathutils within 1e-5, and colour transforms within 2e-4 (Blender's go through OpenColorIO)
        (test/mathutils.test.ts)
    @done
    Scenario: BL26. A float array is typed as the value Blender gives: Vector, Matrix, Euler, Quaternion, Color, or a plain array
      Then every float array property on a fresh file's data (objects and their data, bones, mesh elements, curves,
        modifiers, constraints, scene, render, world, materials and their nodes: over 90) is the type src/gen says
        (test/rna.test.ts)
    @done
    Scenario: BL27. `raea blender run SCRIPT.ts [FILE.blend] [ARGS...]` runs the script on raea's engine against a headless Blender
      Given raea's engine has no sockets, each batch is the native call blender.post, which the CLI's bridge answers
      Then Blender is started with raea's bridge (sdk/blender/python), FILE.blend opened, ARGS its sys.argv after --
      And the script's default export is awaited, then the session closes: a failure no await saw ends the run with exit 1
      And Blender is quit when the script ends, and killed if the run ends any other way
      And console.log prints to the run's output, as under Node (raea's own console goes to the engine's log)
    @done
    Scenario: BL30. A call that makes a thing by its type gives that type's class, as Python does
      Given tools/refine.py asks Blender what each type value makes (bl_rna.identifier): modifiers and grease pencil
        modifiers, object and pose bone constraints, lights, textures, node trees, shader effects, and the nodes of the
        four node tree types
      Then modifiers.new("Smooth", "SUBSURF").levels, lights.new("key", "AREA").size, constraints.new("TRACK_TO").target
        and nodes.new("ShaderNodeBsdfPrincipled") type-check as those classes, and any other value as the base class
    @done
    Scenario: BL31. A node's sockets are typed by name: inputs.$["Base Color"].default_value is that socket's value
      Then a socket the node doesn't have is a tsc error, and links.new takes the typed sockets (test/typing.ts)
    @done
    Scenario: BL32. Every argument can be given by keyword, the required ones too, as Python allows
      Then keyframe_insert({ data_path: "location", frame: 1 }) type-checks, with data_path required
    @done
    Scenario: BL33. A film made with it: post 07b's logos and its left half (releases/0.1.1/src/engines)
      Then logos.ts imports two SVGs, extrudes each path and splits the pupils into their own child mesh, and
        blender-side.ts builds a set and keys 420 frames into action curves (fcurve_ensure_for_datablock, foreach_set),
        both type-checked against src/gen and run by `raea blender run`
    @done
    Scenario: BL35. The guide teaches a step in TypeScript: raea guide bevy/blender, "A step in TypeScript"
      Then its example (blender/lowpoly.ts) is sdk/blender/test/guide.ts, type-checked with the tests; run as shown it
        decimates a .glb and carries its sidecar with the step added, and refuses a source without one before
        writing anything (11-10)
      And it says where raea/blender reads differently from Python, and that an enum Blender works out at the time
        takes any string (BL34)
      And raea-skills' 3d/blender.md is its copy, routed from 3d.md and SKILL.md (raea-skills 7497067, unpushed
        until the v0.1.1 go; ARGS go after the script with no -- of their own, as for a .py step)
    @done
    Scenario: BL34. An enum whose items Blender works out at the time takes what Blender would take then
      Given Curve.fill_mode on a 2D curve takes NONE, BACK, FRONT or BOTH, but its static items (all the dump sees) are
        the 3D ones, so tsc refused `fill_mode = "BOTH"` (11-10, logos.ts); an enum with one item or none is typed
        string already
      Then the properties whose items come from an item function (RNA_def_property_enum_funcs in Blender's makesrna)
        are typed as their static items or any string
      And 11-11: tools/itemf.sh reads them from Blender 5.2.1's own makesrna (a sparse clone of its tag) into
        tools/itemf.json: 147 properties and RNA function parameters, a helper's taken from the struct its caller
        defines; 8 helpers whose struct is named at run time (the node socket interfaces) stay unresolved, and their
        enums have one item or none, typed string already. gen types 222 declarations so; Python can't tell them
        apart, since with no context Blender never calls an item function
      And test/typing.ts sets a 2D curve's fill_mode to "BOTH" and still refuses `rotation_mode = "XYZW"`; run in
        Blender, the same script prints fill_mode BOTH
    @done
    Scenario: BL28. The person's own Blender, live: raea's add-on serves the same bridge from a running Blender
      Given raea's add-on (sdk/blender/python/raea_blender) enabled in that Blender by `raea setup blender`, which copies
        it into Blender's add-ons folder (replacing an older copy; `--check` says whether it's current and on), and
        RAEA_BLENDER=live (or connect({ live: true }))
      Then batches run on Blender's main thread between its redraws, in the 3D view's context
      And a Blender with no window (a command-line render, setup's own checks) doesn't serve, so it never hides the one
        the person has open; once that Blender quits, connect({ live: true }) refuses its live.json
      And 11-11: test/live.ts (run by hand: it opens a window) set up Blender 5.2.1 in a scratch BLENDER_USER_RESOURCES,
        started it with its window and drove it from TypeScript: a cube made, moved and put in edit mode, and
        view3d.snap_cursor_to_center run, all on the main thread in the 3D view's context; 5 of 5 runs passed. It found
        two bugs, both fixed: Blender 5.2 gives a timer the window but no area, so view3d operators had no 3D view; and
        a slot freed by garbage collection was freed before the read an await had queued for it, in headless runs too
        (test/bridge.test.ts forces that race)
    @done
    Scenario: BL29. A clean machine on each platform (macOS, Windows, Linux) runs a TypeScript script through raea/blender
      Given an empty HOME, `raea setup blender` then `raea blender run smoke.ts`
      Then the script prints its PASS line, and the download size and the libraries a clean Linux needs are recorded
      And 11-11, macOS (Apple silicon): an empty HOME and only the system's PATH (no uv, no Bun), `raea setup blender
        --download` then `raea blender run smoke.ts alpha --beta` (sdk/blender/test/smoke.ts) printed its PASS line in
        Blender 5.2.4 LTS: a 346 MB download, 907 MB installed. Setup finishes without uv (the MCP add-on is a note)
        and without git
      And 11-11, Linux (debian:trixie-slim, x86_64, on Modal): setup needs curl, ca-certificates and xz-utils, and
        checks downloads with coreutils' sha256sum where perl's shasum is missing (a slim Debian has none). Blender
        5.2.4's Linux build (385 MB download, 1.2 GB installed) needs libx11-6 libxi6 libxext6 libxfixes3 libxrender1
        libxkbcommon0 libsm6 libice6 libgl1 libopengl0, which setup names when Blender can't start; with them,
        smoke.ts run under Bun through raea/blender printed its PASS line
      And 11-11, Windows 11 (x86_64): Blender 5.2.4's Windows zip (406 MB download, sha256 as blender.org
        lists it, 901 MB installed) needs nothing more, and smoke.ts run under Bun 1.4.2 through raea/blender printed
        its PASS line
      And 11-11, raea's own v0.1.1-rc4 builds: on Linux (debian:trixie-slim on Modal) setup installed Blender (1.2 GB)
        and smoke.ts printed its PASS line in Blender 5.2.4 LTS; on Windows 11, from the release zip in an empty home,
        setup installed it (911 MB) and `raea blender run smoke.ts alpha --beta` printed "PASS raea/blender: 3 cubes
        made (6 objects), the last 4.000 m out, volume 1.000, in Blender 5.2.4 LTS"
      And on that Windows, with uv on PATH, setup exited 1: the MCP add-on's installer (uvx mcp-for-blender
        install-addon) prints an arrow that Python can't encode for the cp1252 console, and threw. Setup now runs it
        with PYTHONIOENCODING=utf-8 and PYTHONUTF8=1 (apps/tools blender.rs); so run there, it installed the add-on
        and exited 0

  Rule: Blender in a raea project: a shot drawn by Blender, a scene sent to Blender and its changes read back
    Shane, 2026-11-11: "how do we get blender and godot full integrated", then "lets do all this and make sure it ends
    up in whatever capacity possible in v0.1.1". The TSX stays the scene. Blender draws a layer of it, is a place to
    look at and change the scene with Blender's tools, and is a source of models; what changes there comes back to the
    TSX as edits at their lines and as models, never as a second source of truth.

    @done
    Scenario: BL36. <BlenderShot> is a layer of a composition drawn by Blender, frame for frame
      Given `import { BlenderShot } from "raea/blender/shot"` and <BlenderShot script="blender/orbit.ts" /> (a
        raea/blender script whose default export builds or changes the scene) or <BlenderShot file="set.blend" />
        (its own animation from its first frame), with engine eevee (the default), cycles or workbench, samples, and
        transparent for a picture with alpha
      Then Blender renders the shot's frames at the composition's size and fps for the length of its Sequence, and
        frame N of the composition shows frame N of the shot
      And the frames are made once for the script's bundle (with what it imports), the .blend's identity, the props,
        the size, fps and length, and Blender's version, kept in the composition's asset store, and made again when
        any of those change (native call blender.shot)
      And `raea blender shot SCRIPT.ts|FILE.blend -o DIR --frames N [--fps F] [--size WxH] [--engine E] [--samples S]
        [--transparent]` renders the same frames from the command line, numbered from DIR/0000.png
      And 11-11: a composition with a <BlenderShot script>, a <BlenderShot file> (the .blend BL38 wrote) and a
        <GodotShot>, each in a 30-frame <Sequence> of a 90-frame composition, rendered with each shot 30 frames long
        (sized from the Sequence's end, not the composition's length); rendered again unchanged, it took 2 s, every
        shot read from the asset store. The .blend's own shot matches raea's frame of the same scene

    @done
    Scenario: BL37. `raea scene export EDIT.tsx -o DIR` writes a composition's 3D as data another tool builds
      Then DIR/scene.json lists each part with an id that holds across frames, its kind and name, the line of the TSX
        it comes from, its world placement (position, rotation as a quaternion, scale; y up, metres) and its material
        (base colour, metallic, roughness, emissive, alpha, unlit); a primitive with its sizes (cuboid, sphere,
        cylinder, plane), any other mesh as DIR/meshes/ID.glb, a model as its file copied into DIR/models/ with its
        sidecar; each light with its kind, colour, power and range; the camera with its field of view; the ambient
        light and the background colour
      And --frame N takes one frame (0 unless given); --at A-B takes each part's placement on every frame from A to B
        and the camera's field of view, for keyframes
      And what doesn't cross is listed by kind in scene.json's `left` (text, splats, particles, shaders, 2D layers)
      And 11-11 (apps/interchange, 9 unit tests): a test scene of a crate, a metal ball, a pole, a floor, a sun, a
        point light and a moving camera exported with --at 0-29 as 6 parts on 30 frames, each shape, material, light
        and the camera as the TSX gives them, and each part's TSX line from the bundle's source stamps
        (RAEA_SOURCE_STAMPS, which the export sets)

    @done
    Scenario: BL38. `raea blender open EDIT.tsx` builds the scene in Blender and opens it there
      Given scene export's folder, built by raea/blender (sdk/blender/src/scene.ts) in a headless Blender
      Then each primitive is Blender's own mesh of that shape, each model is imported from its .glb, each material a
        Principled BSDF, each light and the camera Blender's, keyed on each frame of --at, and every object carries
        its part's id (raea_id), which scene.json ties to its TSX line
      And the file is saved as out/blender/NAME/NAME.blend beside the scene's export (-o DIR elsewhere), then opened
        in a new Blender window (--no-window leaves it closed); a .blend, .glb, .gltf, .obj or .fbx given in place of
        the TSX is opened as it is
      And 11-11: `raea blender open edit.tsx --no-window` built the test scene's .blend in 5 s in Blender 5.2.4, each
        object named for its part (else Sun, PointLight, Cuboid as Godot's export names them) under one root empty
        turned from raea's y up to Blender's z up
    @done
    Scenario: BL39. `raea blender back FILE.blend` says what changed in Blender, as edits to the TSX at their lines
      Then each part moved, turned or scaled, recoloured or made more or less metal or rough, each light whose colour or
        power changed, the camera's move and field of view, and each part deleted is one line naming the TSX line and
        the prop with its new value
      And each object made in Blender (no raea_id) is written as media/NAME.glb with a sidecar naming the .blend, and
        its line is the <Model> that places it
      And --json prints the same as data; nothing in the TSX is changed by raea, the agent makes the edits
      And 11-11: after the crate was moved, the ball recoloured and made rougher, the camera's lens changed and a
        "Lamp Box" added in Blender, `raea blender back` said each at its TSX line (the camera's field of view 40.107
        to 33.3985) and wrote the new box as media/Lamp_Box.glb, placed at [-2, 0.25, 1] in raea's axes

    @done
    Scenario: BL40. A .blend from elsewhere comes in by the guide (bevy/blend-files): contents.py lists it, take.py takes named things
      Then `raea blender run blender/contents.py FILE.blend` lists each mesh object, collection, geometry-node group
        and material, and `raea blender run blender/take.py FILE.blend OUT.glb NAME...` writes those objects and
        collections as one .glb with modifiers applied and the file's licence sidecar
      And 11-11: on BL38's .blend, contents.py listed its meshes and materials, and take.py wrote crate and ball as a
        67 KB .glb of 2 meshes. Before, take.py wrote an empty .glb (132 bytes) whenever a taken object had a parent:
        glTF's export walks down from the scene's top objects, so it now links each one's parents into its scene
