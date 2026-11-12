@spec
Feature: Godot from TypeScript: raea/godot (sdk/godot) on GodotJS
  Shane, 2026-11-10: "make sure to add https://github.com/godotjs/GodotJS which should add a more complete integration
  and bindings for godot integration", and on how: vendor it to run "on javascriptcore or what we run not their v8".
  GodotJS (MIT) is a Godot module that runs JavaScript in Godot with bindings for its whole API, on one of several
  engines. raea uses its JavaScriptCore build on the Mac and its QuickJS-ng build on Windows and Linux, the same pair
  raea runs on, so no V8 ships with raea. A script is TypeScript like the rest of a project: an agent writes a Godot
  step in the language it writes the scene in, and tsc checks it against Godot's own API before Godot runs it.

  Background:
    Given GodotJS release v1.1.0.beta1-4.6.1 (Godot 4.6.1), its editor builds pinned by size and sha256 in
      apps/engines/src/godot.rs, the typings generated from that build by sdk/godot/tools/gen.sh
    And `raea setup godot` downloads raea's own builds of GodotJS (GD9), else GodotJS's own release builds

  Rule: Godot is installed by raea, pinned
    @done
    Scenario: GD1. `raea setup godot` downloads GodotJS's editor build for this platform into ~/.raea/tools/godot
      Then the download is checked against the pinned size and sha256, and nothing is installed when it doesn't match
      And it unpacks without unzip (a clean Linux has none) and the program is made executable (the zips keep no modes)
      And raea.json beside it names the release, so a moved pin downloads again
      And `git config --global raea.godot PATH` names a GodotJS build of the person's own instead
    @done
    Scenario: GD2. A platform GodotJS doesn't build for is told how to bring its own build, not given a stock Godot
      Then a stock Godot is never looked for: without GodotJS it can't run raea/godot's scripts
      And 11-11: find() takes only raea.godot and raea's download; Linux and Windows on arm64, and any other system,
        are told to build GodotJS and `git config --global raea.godot PATH` (apps/engines godot.rs, a unit test)

  Rule: Godot's whole API is typed
    @done
    Scenario: GD3. src/types is GodotJS's codegen of Godot 4.6.1 (--generate-types, headless, on an empty project)
      Then every class, singleton, enum, builtin and utility of the godot module is declared (1195 runtime names)
      And raea/godot re-exports the godot module and references the types, so `import ... from "raea/godot"` and
        `import ... from "godot"` both type-check
      And tsc rejects a class or member that doesn't exist and a wrong argument type (test/typing.ts)
      And GodotJS's own globals (console, timers) are left out, so a project with DOM or Bun types can import it
    @done
    Scenario: GD4. `raea godot types [DIR]` writes the project's own typings: Godot's API with its scenes, resources and input actions
      Then DIR/typings holds what GodotJS's editor writes for that project, headless

  Rule: `raea godot run SCRIPT.ts` runs a script in Godot
    @done
    Scenario: GD5. The script is bundled by raea and run by Godot as its main loop, on GodotJS's engine
      Given raea's bundler, with GodotJS's modules (godot, godot.annotations, godot-jsb, godot.lib.api, godot.worker)
        aliased to stand-ins that read GodotJS's own when the script runs (the godot module makes each class on first
        read, so its stand-in answers the 1195 names the typings list)
      Then the bundle and sdk/godot/src/host/main.js go into the project's .godot/raea/<pid>/, removed after the run
      And the default export, a function, is called with the SceneTree and ARGS (after the script), awaited, then Godot
        quits with 0, or 1 with the error printed when it throws; a MainLoop class default export is the main loop as is
    @done
    Scenario: GD6. The project is --project DIR, else the nearest project.godot above the script, else an empty one
      Then a project Godot never opened is imported first (godot --headless --import), so its scenes load
    @done
    Scenario: GD7. Headless unless --window; --timeout S stops Godot and fails the run
      And what the script prints comes out without GodotJS's [JS] prefix, and the leak reports printed at every exit
        are dropped (GodotJS 1.1's values, Godot's RIDs and ObjectDB instances, each with its "at:" line)
    @done
    Scenario: GD7b. --movie FILE records what Godot draws as footage a raea workflow can use: Godot's Movie Maker
      Then every frame is drawn and written at a fixed --fps (30 unless given), offline: NAME.png numbered from
        NAME00000000.png, or an .avi; the run opens Godot's window, since headless Godot draws nothing
      And the window is kept on top (--always-on-top): macOS stops drawing a covered window, and Movie Maker then
        writes its last frame again (found 11-10: frames 5 to 419 of a render all one picture)
      And the frames are the window's size, which Godot takes from the project, not from its --resolution: --size WxH
        sets it in the empty project; a project's own must match its project.godot, or the run is refused saying so
    @done
    Scenario: GD7c. A callback of the script that throws stops the run: GodotJS prints the error, Godot would carry on
      Then the run ends with exit 1 once the error's stack is out ("SCRIPT threw (above); Godot was stopped")
    @done
    Scenario: GD7d. Paths: Godot runs in the project's folder; raea/godot's resolve(path) names one where raea ran
      Then RAEA_CWD is the folder `raea godot run` ran from, cwd() reads it, and a relative path read through
        resolve() is found there
    @done
    Scenario: GD8. A clean machine on each platform (macOS, Windows, Linux) runs a TypeScript script through raea/godot
      Given an empty HOME, `raea setup godot` then `raea godot run smoke.ts`
      Then the script prints its PASS line, and the download size and the libraries a clean Linux needs are recorded
      And 11-11, macOS: an empty HOME and only the system's PATH, `raea setup godot` then `raea godot run smoke.ts alpha
        --beta` (sdk/godot/test/scripts/smoke.ts) printed its PASS line: GodotJS v1.1.0.beta1-4.6.1 with
        JavaScriptCore, a 144 MB download, 280 MB installed
      And 11-11, Linux (debian:trixie-slim, x86_64, on Modal): GodotJS's QuickJS-ng editor (a 79 MB download, 155 MB
        installed) needs no library a slim Debian lacks and starts headless; without libfontconfig1 it says system fonts
        are off. Setup checks the download with coreutils' sha256sum there (a slim Debian has no shasum)
      And 11-11, Windows 11 (x86_64): GodotJS's QuickJS-ng editor zip (83 915 786 bytes, raea's pinned sha256,
        178 MB installed) reports 4.6.1.stable and starts and quits headless with exit 0
      And 11-11, raea's own v0.1.1-rc4 builds: on Linux (debian:trixie-slim on Modal) setup installed GodotJS's
        editor (155 MB) and smoke.ts printed its PASS line; on Windows 11, from the release zip in an empty home,
        setup installed it (178 MB) and smoke.ts printed "PASS raea/godot: 3 boxes, the last 4.000 m out, in Godot
        4.6.1-stable (gh)"

  Rule: The guide teaches it
    @done
    Scenario: GD10. raea guide bevy/godot: when Godot, setting it up, a script, paths, footage with --movie, mistakes
      Then it routes a Godot project there and raea's own scenes and games to bevy/scene and bevy/games
      And its recording example (turn.ts) is sdk/godot/test/guide.ts, type-checked with the tests and run headless
      And raea guide bevy routes to it, and raea-skills' 3d/godot.md is its copy, routed from 3d.md, games.md and
        SKILL.md (raea-skills 7497067, unpushed until the v0.1.1 go; raea-verbs gains godot with a v0.1.1 snapshot)

  Rule: GodotJS is ours to build
    @done
    Scenario: GD9. GodotJS's source is vendored at the release's tag, and raea builds the JavaScriptCore and QuickJS-ng editors itself
      Then `raea setup godot` downloads raea's own builds, and the typings are generated from them
      And sdk/godot/build holds the builds, from source as GodotJS's CI builds its release (Godot 4.6.1-stable 14d1969,
        GodotJS a8e2567 at v1.1.0.beta1-4.6.1, AccessKit-c 0.18.0): macos.sh (arm64, JavaScriptCore, Metal only) and
        linux.py (x86_64, QuickJS-ng, on Ubuntu 22.04 on Modal); verify.sh checks an editor against GodotJS's own
      And on 11-10 macos.sh built the editor in 370 s at -j6 (133,184,648 bytes, sha256 7908bf67...a92310, reporting
        4.6.1.stable.raea.14d19694e); verify.sh on it: raea's smoke printed "PASS raea/godot: 3 boxes, the last
        4.000 m out, in Godot 4.6.1-stable (raea)" and the 17 typing files matched GodotJS's build's byte for byte
      And linux.py built the editor in 511 s on 16 cores (161,938,768 bytes, sha256 8fd01803...699684), before its
        BUILD_NAME=raea line, so that build reports custom_build; it hasn't run raea's smoke yet
      And 11-11 (Shane: "make sure it ends up in whatever capacity possible in v0.1.1"): the pins move to raea's builds
        in 0.1.1. windows.py cross-builds the Windows editor on Linux with MinGW-w64, the toolchain Godot's own Windows
        releases use; the Mac editor is signed with raea's Developer ID and notarized; each passes verify.sh's smoke
      And `raea setup godot` tries raea's build first and GodotJS's pinned one after it, each checked against its own
        size and sha256, so a release made before raea's builds are uploaded (they go up with the release's files) still
        installs, and says which one it installed
      And 11-11: all three editors report 4.6.1.stable.raea. The Mac's is Godot.app made from Godot's own
        misc/dist/macos_tools.app, signed with raea's Developer ID and Godot's editor entitlements (its JIT), notarized
        (Accepted) and stapled (spctl: Notarized Developer ID); from its zip, verify.sh's smoke printed "PASS
        raea/godot: 3 boxes, the last 4.000 m out, in Godot 4.6.1-stable (raea)" and its 17 typing files matched
        GodotJS's build's byte for byte. The Linux editor passed the same smoke and typings check under raea's rc4 in
        debian:trixie-slim on Modal. The Windows editor needs only Windows' own DLLs
      And package.sh makes the three zips, one folder each (godot-4.6.1-raea-macos-arm64.zip 69,132,728 bytes,
        -linux-x86_64.zip 78,737,822, -windows-x86_64.zip 73,171,472), whose sizes and sha256 are godot.rs's pins; they
        are uploaded to v0.1.1's release with its other files. RAEA_GODOT_FROM=URL installs from elsewhere (file://DIR
        too): setup from a folder of the zips installed raea's build, which passed the smoke; with no override, before
        the upload, the download failed and setup installed GodotJS's build and said why (apps/engines, unit tests)
      And 11-11, Windows 11 under raea's v0.1.1-rc4 build: the Windows zip's sha256 matched its pin, the editor reports
        4.6.1.stable.raea.14d19694e, and smoke.ts printed "PASS raea/godot: 3 boxes, the last 4.000 m out, in Godot
        4.6.1-stable (raea)". Its 18 typing files hold the same text as GodotJS's build's; 4 differ in bytes only
        because GodotJS's Windows build writes those with CRLF line ends and raea's, cross-built on Linux, with LF

  Rule: Godot in a raea project: a shot drawn by Godot, a scene sent to Godot and its changes read back, its scenes taken in
    Shane, 2026-11-11: "how do we get blender and godot full integrated", then "lets do all this and make sure it ends
    up in whatever capacity possible in v0.1.1". The TSX stays the scene, as with Blender (docs/blender.feature BL36 to
    BL40): Godot draws a layer, runs the scene as a Godot project, and is a source of models.

    @done
    Scenario: GD11. <GodotShot> is a layer of a composition drawn by Godot's Movie Maker, frame for frame
      Given `import { GodotShot } from "raea/godot/shot"` and <GodotShot script="godot/rally.ts" project="godot" />
        (a raea/godot script whose default export builds the scene and returns) or <GodotShot scene="res://main.tscn"
        project="godot" /> (that scene as it plays)
      Then Godot records the shot's frames at the composition's size and fps for the length of its Sequence (GD7b's
        --movie), and frame N of the composition shows frame N of the shot
      And the frames are made once for the script's bundle, the project's files, the props, size, fps and length,
        kept in the composition's asset store, and made again when any change (native call godot.shot)
      And `raea godot shot SCRIPT.ts|res://SCENE.tscn --project DIR -o DIR --frames N [--fps F] [--size WxH]` records
        the same frames from the command line, numbered from DIR/0000.png
      And 11-11: in the composition of BL36's evidence, the <GodotShot> of GD12's project recorded 30 frames in its
        30-frame Sequence, and `raea godot shot res://main.tscn --project out/godot/edit` 30 frames at 1920x1080 (the
        shot's default size; Movie Maker records the window's) that match raea's frames of the scene

    @done
    Scenario: GD12. `raea godot export EDIT.tsx -o DIR` writes the composition's 3D as a Godot project that runs
      Given scene export's data (docs/blender.feature BL37)
      Then DIR holds project.godot (the composition's size, Forward+) and main.tscn, its main scene: each primitive
        Godot's own mesh (BoxMesh, SphereMesh, CylinderMesh, PlaneMesh) with a StandardMaterial3D, any other mesh an
        .obj and each model its .glb, which Godot imports, each light and the camera Godot's, the ambient and
        background a WorldEnvironment; each node named for its part (else for what it is: Sun, PointLight, Cuboid) and
        carrying its part's id as metadata (raea_id), which scene.json ties to its TSX line
      And with --at A-B an AnimationPlayer plays each part's placement and the camera's, autoplaying, a channel that
        holds still left out, so `raea godot run --project DIR --scene res://main.tscn --window` plays it (no script
        needed), `raea godot shot res://main.tscn --project DIR` records it, and `raea godot open DIR` opens it in the
        editor
      And 11-11: BL37's test scene became "6 parts, 3 animation tracks over 30 frames" (the crate's, the ball's and
        the camera's; still channels left out), with nodes named Sun, PointLight, crate, ball, pole, floor and
        Camera3D. A --script main loop doesn't load run/main_scene, so the scene is given with --scene; with no
        script raea runs sdk/godot/src/host/none.ts, and a scene in --window plays until the window is closed
    @done
    Scenario: GD13. `raea godot back DIR` says what changed in Godot, as edits to the TSX at their lines
      Then main.tscn is read by Godot, and each node moved, turned or scaled, recoloured, each light changed, the
        camera, each part deleted, and each node added (written as media/NAME.glb with a sidecar) is said as BL39 says
        it, from the same comparison
      And 11-11: after the crate was moved, the ball recoloured, the camera moved and a box added in Godot's editor,
        `raea godot back` said each at its TSX line and wrote the box as media/Lamp_Box.glb

    @done
    Scenario: GD14. A Godot project's scene or mesh comes in as one .glb (bevy/godot-projects)
      Then `raea godot run godot/scene-glb.ts --project KIT res://PATH.tscn media/X.glb` writes the scene's meshes,
        materials, skins and clips as one .glb, its cameras and lights left behind (sdk/godot/test/guide-scene-glb.ts,
        type-checked with the tests and run on a kit)
      And the guide lists which open Godot demos and kits may be used, by the licence of their art
      And 11-11: the guide's own example on Godot's 3d/platformer demo (res://stage/stage.tscn) wrote a 759 KB .glb of
        2,923 meshes with no camera or light. On GD12's project, the camera's clip pointed at the removed camera and
        glTF's export printed an ERROR, so the script now drops each track whose node it took out
