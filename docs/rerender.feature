@spec
Feature: Re-render, don't stitch: one render changes anything per frame, redraws only what changed, and encodes on every platform's hardware
  Shane, 11-10: "when using the raea engine the agent always ends up using ffmpeg and stitching clips together again. so
  how do we actually make it so we optimize so fast it can rerender clips easily and not worry about using ffmpeg. or
  maybe investigate why that would be the case beyond my assumptions. also i dont specifically want iphone we have lots
  of mac and windows users so we have to plan for something that can use all of those". Then: keep wgpu, and make this
  the complete overhaul for v0.1.1.

  The research is docs/rerender.md (why agents stitch) and docs/gpu.md (the GPU layer on Mac, Windows and Linux). In
  short: a raea render holds its first frame's look and camera for its whole length, and can't redraw part of a video,
  so agents split films into chunk renders and join them with ffmpeg (the launch film: 80 chunks, 31-33 min a pass).
  Speed matters second. This feature fixes the causes first, then the speed, on macOS, Windows and Linux alike.

  Bars for every scenario: the same frames as before wherever nothing was meant to change (SSIM 1.000000 on decoded
  frames, or the exact bound a scenario names); every number measured on this Mac (M5 Pro) and on the Windows PC
  (cuda-box, RTX 4070), and on Linux where a scenario says so; a gate that can't be met goes to Shane with its
  measurements, never loosened in place. GPU-heavy runs check `antsy board` first and run one at a time.

  Rule: Measure first

    @done
    Scenario: RR0. A heavy multi-shot film to measure, and today's numbers on Mac and Windows
      # Status 11-10: measured. The film is made from code (shots.tsx; content/rome's sets are gone) and its frames cost
      # 10-45 ms on the Mac, so start-ups and joins weigh more than drawing does.
      # Mac (M5 Pro, the 08:52 raea build): six chunks 3 at a time joined with ffmpeg -c copy, 16.3 s on a quiet machine
      # and 25.0, 25.5, 26.9 s with 5-6 other jobs running; one render 31.4 s quiet, 30.9-38.5 s loaded. Each chunk's
      # first frame comes 1.7-1.8 s after its spawn (about 0.6 s of it the restart when a render meets its first 3D
      # frame; frame 0's sync 0.35-1.05 s, the pipelines being made), so the six chunks spend 10.5-16.2 s starting. A
      # steady frame: React 1.0-1.7 ms, sync 6-15 ms, GPU wait 0-43 ms, readback and encode (VideoToolbox) under 1 ms.
      # The note by hand (change.sh): shot 4 again 3.4-6.0 s and the join 0.15-0.23 s, against the whole film again
      # 29.4-43.5 s.
      # Windows (cuda-box, RTX 4070, v0.1.1-rc2, bench.ps1): no ffmpeg there, so the join is raea media concat, which
      # re-encodes. Chunked 71.0 s: renders 23.6 s and the join 47.3 s. One render 39.0 s; its first frame 6.8 s, as it
      # bakes all 900 frames' rows first (a chunk's 2.2-2.5 s; the first run on the machine 6.5-8.3 s). A steady frame:
      # React 12 ms (10x the Mac's: QuickJS there, JavaScriptCore here), sync 12-24 ms, GPU wait 2-24 ms; openh264 isn't
      # the bottleneck. The note by hand: 13.3 s and a 51.4 s join, 64.7 s, more than the whole film again (38.4 s).
      # One render holding six looks, estimated from the chunks' frame costs without their start-ups: 27.7 s on the
      # quiet Mac and 45.8 s on Windows (both over-counted: three chunks shared the GPU).
      # The two biggest costs: on the Mac the start-ups (six cold processes) and GPU wait; on Windows the re-encoding
      # join (47-51 s) and a frame's CPU side (React on QuickJS and sync, 24-36 ms). RR11-RR13 read their gates
      # against these.
      # The iPhone row (not a gate; ios/bench.sh on an iPhone 13 Pro Max, A15, iOS 27.0.1, jitless JavaScriptCore):
      # shots 3-5 at 134, 61 and 265 ms a frame (GPU wait 64, 22 and 184 ms; React 4-13 ms), first frame 2.5-3.2 s
      # after the launch and 5.0 s on a fresh install, peak footprint 2.4-2.8 GB. Shots 1 and 6 and the film can't be
      # drawn there: Bevy 0.20's atmosphere samples its Rgba32Float medium LUTs with a filtering sampler, which the A15
      # can't filter (RR9's, in vendor/ and upstream). raea said APPLIED on those videos without their 3D (handed to
      # DR3's lane). Shot 2 is killed by iOS (SIGKILL, no report) at its first 3D frame, with the increased-memory
      # entitlement as well.
      # Noise: the same binary ran 16-27 s chunked across four runs as the machine's load changed, so later gates run
      # the old and new binaries interleaved in one sitting.
      Given the plan
        | crate | file                          | lines | job                                                                                  |
        | -     | bench/rerender/shots.tsx      | 220   | six 5 s shots on one set made from code (no media files, so it renders alike on every OS; content/rome's sets are gone), 900 frames at 1920x1080, a different look on each (grade, fog, bloom, depth of field, tonemapping, SSAO, volumetric fog, sky) and two cameras |
        | -     | bench/rerender/film.tsx       | 40    | the film as one composition, and each shot as its own composition, as agents render today |
        | -     | bench/rerender/bench.sh       | 160   | renders it with RAEA_FRAME_LOG and RAEA_TIMES and writes run.json: wall time, and per frame the split into start-up, React/JS, Bevy CPU, wgpu submit, GPU by pass, readback and encode |
        | -     | bench/rerender/change.sh      | 80    | the "one note" case: changes shot 4's grade and lights, then times what it takes to get the whole film again |
        | -     | bench/rerender/bench.ps1      | 160   | bench.sh and change.sh for Windows, in its own PowerShell 5.1 (no bash, jq or ffmpeg there) |
        | raea-rerender-ios | bench/rerender/ios/src/lib.rs | 80 | the iPhone row, not a gate: one composition bundle rendered in a cold process, its start-up marks timed from the kernel's process start |
        | -     | bench/rerender/ios/bench.sh   | 140   | bench.sh's runs on the iPhone through a small app (ios/app), one launch a render, plus the first launch after a fresh install |
      Then bench.sh runs on the Mac and on the Windows PC, and this scenario records both splits
      And it records today's two ways to get the film: six chunk renders joined with ffmpeg (what agents do), and
        what one render would cost if it could hold six looks (the chunks' frame costs without their start-ups)
      And it records change.sh today: the changed chunk re-rendered and re-joined by hand
      And the two biggest costs in each split are named; RR11, RR12 and RR13's gates are read against them

  Rule: One render can change anything, every frame

    @done
    Scenario: RR1. Every look changes per frame
      # Status 11-10: done. A frame's post-processing is its own (post.rs frame_post: the sky, bloom, fog, grade,
      # vignette, AO, anti-aliasing, tonemapping, exposure, volumetric fog and depth of field's kind), and sets that
      # change go in a per-frame table (frame_sets, frame_set_i); each light's colour, shadows and shafts too
      # (light_sets). The camera takes a group off and puts it on again when its columns change (raea-sys-post, 12
      # groups). A draw across a cut (a set bringing or taking a sky, AO, anti-aliasing, a tonemapper, shadows or
      # volumetric fog: tables.rs Cuts) warms up 8 updates at its frame, as a load does, in frames() and in the page
      # path's draw: the sky's light (Bevy's generated environment map) takes three, and RR0's sunset opened 2 frames
      # dark without them. A ramp (a value moving within one set) is no cut. Play builds its rows the same way (live.rs:
      # tables, the page background keyed), and a seek back that makes a new engine sets play's rows on it again.
      # Measured on this Mac with bench/rerender/rr1.sh (the 13:00 build):
      #   the film as one composition against its six shot renders: 900/900 frames identical (it held shot 1's look)
      #   ramp.tsx's 60-frame grade, bloom and fog ramp against 60 stills each rendered alone: 60/60 SSIM 1.000000,
      #   its first and last frames 0.645 apart
      #   raea play seeking to the first and middle frame of each shot: the 3D and its looks as the render draws them
      #   12/12 (before: play held shot 1's sky, missed the page background on shots 3-5, opened without the sky's
      #   light and never put depth of field on, SSIM 0.43-0.93); a seek back (0, 400, 350, 0) equal to the forward
      #   seeks 2/2 (it drew the first frame's look: a plugin's clock makes a new engine from the load)
      #   not exact: the HTML caption over the 3D (text with a 12 px blurred shadow) differs between play and render by
      #   at most 2 levels at its edges, SSIM 0.999473-0.999999, as it did before RR1: the page's composite over the
      #   3D, not a look, handed to the issues lane
      # Cost, interleaved with the pre-RR1 binary under load 6-12: the film as one MP4 with its six looks in 20.4, 26.4,
      # 34.4 and 26.3 s; the old binary's one render (shot 1's look for all 900 frames) 30.1, 34.6, 31.8 and 34.7 s.
      # The five cuts cost 1.3-1.7 s together (0.4 s before RR1, the new shots' first frames), most of it their warm-up
      # updates. variants.rs isn't built: preparing every look's pipelines before frame 0 would move their compiles onto
      # the first frame, which RR10 makes 5x faster; RR10's cache takes compiles off every first use instead.
      Given the plan
        | crate             | file                          | lines | job                                                                              |
        | raea-runtime-look | runtime/look/src/post.rs      | 370   | each frame's post-processing from its own parts (atmosphere, bloom, fog, every Grade field and the vignette, SSAO, anti-aliasing, shadows, volumetric fog, tonemapping and exposure, depth of field's kind); sets that change go in a per-frame table (frame_sets, and frame_set_i keyed), as depth of field's aperture and aberration are already keyed; each light's colour, shadows and shafts as its own table (light_sets) |
        | raea-sys-frame    | systems/frame/src/tables.rs   | 225   | the frame_looks table generalised: each frame's set laid onto its row (FrameRows::vals), for a frame look and for the post-processing; where a render's frames cut (Cuts: a set that brings or takes a mode) |
        | raea-sys-post     | systems/post/src/camera.rs    | 233   | the post-processing on the camera by group, moved out of raea-runtime-scene3d (camera.rs), which is at its 2,000-line limit; a frame whose row changes a group takes it off and puts it on again, and MSAA goes off with AO or SMAA/FXAA and back on without them |
        | raea-sys-post     | systems/post/src/camera/on.rs | 199   | each group put on and taken off (scene3d's code, moved) |
        | raea-sys-fog-half | systems/fog-half/src/camera.rs | 91 | volumetric fog's group (VFOG), there because it puts on that crate's HalfFog and a system can't use another sideways: raea-runtime-scene3d hands it to raea-sys-post's apply and sync beside its own |
        | raea-runtime-scene| runtime/scene/src/live.rs     | 405   | play's rows as a render's: each frame's post-processing and light sets as tables, the page background keyed (bg_r..bg_a) |
        | raea-render       | engine/render/src/engine.rs   | 474   | a draw across a cut warms up as a load does (Engine::draw and output.rs frames); a seek back that makes a new engine sets play's rows on it again |
        | raea-runtime-gpuframe | runtime/gpuframe/src/downsample.rs | 52 | a supersampled readback shrunk (RAEA_SS), moved out of raea-render to keep it under 2,000 lines |
        | -                 | bench/rerender/rr1.sh         | 106   | the three checks below (equal, ramp, play), each writing its JSON, the frames deleted as they're compared |
        | -                 | bench/rerender/ramp.tsx       | 37    | the 60-frame ramp: grade, bloom, fog colour and vignette moving every frame |
      Then runtime/look/src/camera.rs stops reading these "as the first frame that has each asks"
      And a value (a grade's saturation, bloom's strength, fog's colour, the focus distance) is keyframed like any prop
      And RR0's film rendered as one composition equals its six chunk renders frame for frame (SSIM 1.000000)
      And a grade ramp over 60 frames equals 60 stills each rendered alone with that frame's grade
      And a play of the film (raea play) shows the same look changes as its render (render = play)

    @done
    Scenario: RR2. The camera changes per frame
      # Status 11-10: done. `<Camera3d is_active>` (Bevy's Camera field) says which camera draws: each frame's first
      # active camera in the tree is the piece's, the others are dropped from that frame (their depth of field and
      # ambient with them), and the camera row's `shot` column steps where another camera takes over (active.rs). A
      # frame where it steps is a cut (Shots), drawn as a shot rendered alone draws its first frame: motion blur's
      # step before it draws the frame itself, not the other camera's frame, and Solari's and the path tracer's
      # history start again (`reset`). Play sends the shot on its live camera row, 0 again when the first camera is
      # back, and its engine takes a changed shot as a cut (Moved). A teleport of one camera is no cut: it smears.
      # Found on the way, and fixed for cuts only: the step to f - 1 that motion blur needs never runs on any engine,
      # because the Engine's reads (react_share) count as a Bevy plugin. Renders are right anyway (export draws f - 1
      # before every f for those reads); play blurs from the frame drawn last. Handed to the issues lane.
      # RR0's film has no shot with two cameras, so bench/rerender/cams.tsx is the piece: camera A wide and dollying
      # (frames 0-39), B low and close at f/1.4 (40-89), A again (90-119), parts moving, motion blur on. Each shot is
      # also its own composition, as an agent's chunk is. Measured on this Mac with bench/rerender/rr2.sh:
      #   without motion blur, the piece against its three shot compositions: 120/120 frames identical (each cut
      #   frame is SSIM 0.707 and 0.688 from the frame before it: the cut is there)
      #   with motion blur, against the same compositions: the frames before the first cut and both cut frames
      #   identical; the other 78 differ by the blur's grain alone, SSIM >= 0.999439, because the grain is seeded by
      #   the frame number and a composition counts from 0 (raea-sys-post pin_frame_count). The control, one camera
      #   moved to B's place and back: its cut frames 0.810 and 0.785 against the shots' first frames
      #   with motion blur, each shot of the piece rendered alone (--at its frames): 120/120 identical, as RR3's
      #   re-rendered segments need
      #   raea play seeking onto a cut, across each cut frame by frame and back: 7/7 held seeks identical to the
      #   render. The seeks that jump (40 to 38, 41 to 88, 91 back to 90) are said, not held: with motion blur a jump
      #   differs from the render in play, cut or not, since before RR2
      # Cost: the piece in 2.3-2.9 s, its three shots as compositions in 4.9-6.0 s together.
      # Not covered: the three.js hosts (sdk/r3f, playables) still take the first camera node; a live game's cuts
      # take the same path as play's but weren't run.
      Given the plan
        | crate              | file                           | lines | job                                                                              |
        | raea-runtime-look  | runtime/look/src/active.rs     | 82    | which camera draws, per frame: the first active one (`<Camera3d is_active>`), the others dropped; its shot keyed where it steps |
        | raea-sys-frame     | systems/frame/src/shots.rs     | 41    | the frames a shot starts at (Shots), and a live camera row's shot changed (Moved) |
        | raea-render        | engine/render/src/engine.rs    | 490   | a cut drawn as a shot's first frame: the step before it draws the frame itself, with a plugin too; Solari reset (raytrace cut) |
        | raea-runtime-scene | runtime/scene/src/live.rs      | 432   | play's camera row says its shot, and 0 when the first camera is back |
        | -                  | sdk/render/src/bevy3d/core.tsx | 332   | `is_active` on `<Camera3d>`; an inactive camera isn't the one the pointer picks through |
        | -                  | bench/rerender/cams.tsx        | 82    | two cameras cut A, B, A with parts moving, each shot its own composition too, and a one-camera control |
        | -                  | bench/rerender/rr2.sh          | 141   | the four checks above (still, blur, range, play), each writing its JSON, frames deleted as they're compared |
      Then a film can cut between several cameras inside one render
      And RR0's two-camera shot rendered once equals the same shot rendered as one render per camera, frame for frame

  Rule: Redraw only what changed

    Scenario: RR3. A video is made of shot segments, assembled without re-encoding
      Given the plan
        | crate                 | file                           | lines | job                                                                          |
        | raea-runtime-segments | runtime/segments/src/lib.rs    | 120   | the crate: a render as segments (raea-runtime-export is at its limit)       |
        | raea-runtime-segments | runtime/segments/src/split.rs  | 160   | where a video splits: at every cut the timeline knows (a Sequence's start, a camera change), never inside a shot, merging shots under a minimum length |
        | raea-runtime-segments | runtime/segments/src/encode.rs | 180   | each segment encoded as its own run starting on a keyframe, on every backend (VideoToolbox, openh264, rav1e, RR8's) |
        | raea-runtime-segments | runtime/segments/src/join.rs   | 200   | segments muxed into one MP4 by stream copy (io/codec's remux, muxide), the sound laid under once from the render's own mix |
        | raea-runtime-segments | runtime/segments/src/warm.rs   | 120   | a segment's warm-up: the frames before it that temporal effects need (TAA, motion blur, MetalFX), drawn and not kept |
      Then `raea render` makes every video this way
      And a segmented render's decoded frames match a single-run render at the same --quality: SSIM >= 0.999 on every
        frame, and VMAF >= 99 over the film
      And joining a two-minute 1080p film's segments takes under 1 s

    @needs:RR3
    Scenario: RR4. Segments are cached by what made them
      Given the plan
        | crate                 | file                           | lines | job                                                                          |
        | raea-runtime-segments | runtime/segments/src/key.rs    | 220   | a segment's key: its frames' baked rows (the state at its first frame included, so physics and particles count), the assets they read, the render's settings, raea's version |
        | raea-runtime-segments | runtime/segments/src/store.rs  | 160   | segments on disk by key, beside the whole-video export cache (runtime/bundle/src/cache.rs), with a size cap and the oldest dropped first |
      Then a render reuses every segment whose key is unchanged and prints "N of M shots redrawn"
      And after change.sh's note, getting the whole film again costs shot 4's frames plus under 1 s
      And the film it gives equals a fresh full render with the cache off (SSIM 1.000000 on reused segments, RR3's
        bound on redrawn ones)
      And a change to a shared asset (a texture both shots use) redraws exactly the shots that use it

    @needs:RR3
    Scenario: RR5. Ranges and parallel workers inside one render
      Given the plan
        | crate                 | file                           | lines | job                                                                          |
        | raea-runtime-segments | runtime/segments/src/workers.rs| 240   | segments drawn by several workers at once, sized from the GPU's memory and the machine's free memory, never past antsy's floor; one worker on a GPU too small for two |
      Then `raea render EDIT.tsx --frames A-B -o OUT.mp4` renders that range as a video
      And a long render splits itself across workers and joins them with RR3; `--workers N` overrides the count
      And the default worker count is the one measured fastest for RR0's film on each machine, recorded here
      And no agent needs `xargs -P` or a chunk composition to render a film in parallel

  Rule: Assemble and look at renders without ffmpeg

    @needs:RR3
    Scenario: RR6. The media verbs agents reach ffmpeg for
      Given the plan
        | crate             | file                          | lines | job                                                                              |
        | raea-app-assemble | apps/assemble/src/lib.rs      | 80    | the crate (raea-app-media is at 1,776 lines), reached through `raea media`         |
        | raea-app-assemble | apps/assemble/src/concat.rs   | 180   | `raea media concat` by stream copy when the inputs match (codec, size, rate), re-encoding only when they don't and saying so |
        | raea-app-assemble | apps/assemble/src/compare.rs  | 200   | `raea media compare A B [C ...] -o OUT` side by side or in a grid, labelled, as a still, a sheet or a video: the commonest ffmpeg use in agents' sessions (2,627 commands) |
        | raea-app-assemble | apps/assemble/src/frames.rs   | 160   | `raea media encode DIR -o OUT.mp4|OUT.mov --fps N`: a PNG folder to H.264, HEVC or AV1 on every platform, ProRes 4444 with alpha on the Mac |
      Then concat of RR3's segments, or of any matching MP4s, takes under 1 s for two minutes of 1080p
      And every flag is in `raea help`, and docs/manual's CLI reference is regenerated

    @needs:RR1,RR2,RR4,RR5,RR6
    Scenario: RR7. The skill and the manual teach re-rendering
      Then the raea skill's "one camera, one set of effects" rule (3d.md rule 6, 3d/limits.md, 3d/post.md) says looks
        and cameras change per frame
      And it says how to change one shot of a film: edit it and render again, with the redraw count to check
      And its ffmpeg share line (SKILL.md) is a raea command, and it says raea's own renders never need ffmpeg
      And the change goes through raea-skills' own process (its SOP, `just ci`), and docs/manual's rendering concept
        page says the same

  Rule: Every platform encodes on its own hardware

    Scenario: RR8a. Windows: Media Foundation's hardware encoders
      Given the plan
        | crate            | file                         | lines | job                                                                               |
        | raea-io-windows  | io/windows/src/lib.rs        | 120   | the backend behind raea-io-codec's Backend trait, picked first on Windows          |
        | raea-io-windows  | io/windows/src/encode.rs     | 320   | H.264 and HEVC through Media Foundation's hardware encoder (NVIDIA, AMD and Intel behind one API), rate control as `--quality` asks, keyframes where RR3 asks |
        | raea-io-windows  | io/windows/src/texture.rs    | 220   | frames handed over as GPU textures through the DXGI device manager (wgpu's DX12 device by as_hal), no CPU copy where the driver allows; a copy where it doesn't, said once |
        | raea-io-windows  | io/windows/src/decode.rs     | 200   | hardware decode for footage, through the same API                                  |
      Then on the Windows PC, RR0's film is not encoder-bound: encode is under 20% of its frame time
      And its export scores VMAF >= 95 against the Mac's at `--quality high`, and its colours meet docs/lightspeed
        Q3's floors
      And a machine without a hardware encoder falls back to openh264 and says so once

    Scenario: RR8b. Linux: VAAPI and NVENC
      Given the plan
        | crate          | file                        | lines | job                                                                                  |
        | raea-io-linux  | io/linux/src/lib.rs         | 100   | the backend, picked first on Linux when a device answers                             |
        | raea-io-linux  | io/linux/src/vaapi.rs       | 300   | H.264 and HEVC through VAAPI (Intel and AMD)                                         |
        | raea-io-linux  | io/linux/src/nvenc.rs       | 300   | H.264 and HEVC through NVENC (NVIDIA, as on Modal), its headers' licence checked first (docs: permissive-licences) |
      Then RR0's film renders on a Linux NVIDIA machine (Modal or the Sprite's GPU path) not encoder-bound, with the
        same VMAF bound as RR8a
      And without a device it falls back to openh264 and says so once

  Rule: The GPU layer: keep wgpu, go native underneath where it pays (docs/gpu.md)

    Scenario: RR9. The wgpu fixes raea needs, ours, sent upstream
      Given the plan
        | crate | file                             | lines | job                                                                          |
        | -     | vendor/wgpu-hal/PROVENANCE.md    | 60    | each local change, the test that holds it, and when it goes (upstream merged) |
        | -     | vendor/wgpu/PROVENANCE.md        | 30    | likewise                                                                     |
      Then the Metal backend checks every command buffer's status, and a failed one reaches raea as a device loss
        from `poll` with its label, instead of a silent fault; tested by injection, never by provoking the GPU
      And MSL compiles with safe math where raea asks (naga's output and passthrough alike), so a frame doesn't depend
        on how its variant was compiled
      And each change is written by us (Vork's are under its preview licence and aren't copied), opened as a PR on
        gfx-rs/wgpu with a hand-written description, and carried in vendor/ until it merges
      And one-version, dupes and the size gates pass with the vendored crates

    @needs:RR9
    Scenario: RR10. No cold pipeline compiles, on any platform
      Given the plan
        | crate           | file                          | lines | job                                                                           |
        | raea-gpu-device | gpu/device/src/pipelines.rs   | 220   | one pipeline cache across launches: Metal as an MTLBinaryArchive through wgpu's PipelineCache (RR9's vendored change), Vulkan through wgpu's own, DX12 measured first (the driver's may be enough); keyed by adapter, driver and raea's version |
      Then Bevy's pipelines, Vello's and K's are made with it (a vendored bevy_render change if Bevy has no hook)
      And a cold first frame of RR0's film, and of an exported game's first play, is at least 5x faster on the Mac
        and on the Windows PC, measured with the OS's own shader cache cleared
      And RR5's workers share it, so N workers don't compile N times
      And RR1's cuts are timed again with it: the film's five cost 1.3-1.7 s together on 11-10, against 0.4 s with
        one look (RR1 left preparing every look's pipelines before frame 0 to this cache, so the first frame isn't
        made to pay for all of them)

    @needs:RR0
    Scenario: RR11. A draft tier, rendered small and upscaled
      Given the plan
        | crate            | file                          | lines | job                                                                          |
        | raea-sys-upscale | systems/upscale/src/lib.rs    | 100   | `--quality draft` (and the app's live preview, when asked): render at a lower scale, upscale with the platform's best |
        | raea-sys-upscale | systems/upscale/src/metalfx.rs| 220   | MetalFX's temporal scaler on the Mac, on the shared device as raytrace/metalfx.rs runs its denoiser |
        | raea-sys-upscale | systems/upscale/src/dlss.rs   | 120   | DLSS on NVIDIA through Bevy's `dlss` feature, only after NVIDIA's SDK terms are checked (docs/render-thirdparty.md) |
        | raea-sys-upscale | systems/upscale/src/resample.rs| 140  | the portable fallback: a WGSL upscale every GPU runs                         |
      Then a draft of RR0's film renders at least 3x faster than `--quality high` on the Mac and on the Windows PC
      And raea check and the render's findings flag the same problems on the draft as on the full render
      And delivery quality stays the default; a draft says it's a draft in its manifest

    @needs:RR0,RR9
    Scenario: RR12. Our own kernels, written once for every platform
      Given the plan
        | crate             | file                          | lines | job                                                                          |
        | raea-gpu-kernels  | gpu/kernels/src/lib.rs        | 160   | a kernel loaded as wgpu passthrough on the shared device: MSL on Metal, DXIL on DX12, SPIR-V on Vulkan, from the files below |
        | raea-gpu-kernels  | gpu/kernels/src/check.rs      | 140   | each kernel against its reference (WGSL, or K's interpreter): exact where K demands it, a stated bound elsewhere |
        | -                 | gpu/kernels/slang/README.md   | 40    | the sources are Slang; the compiled files are committed and a test fails when a source changed without them |
        | -                 | tools/kernels.sh              | 80    | slangc to MSL, SPIR-V and DXIL for each kernel (Slang's licence checked first)  |
      Then the first kernel is the most expensive raea-owned pass in RR0's split (traced AO, the paint look, the composite or what the split names)
      And it beats its WGSL reference by at least 1.5x on the Mac and on the Windows PC, or it's deleted and this
        scenario says why
      And K kernels stay WGSL: they already run everywhere

  Rule: Proof, on the machines our users have

    @needs:RR1,RR2,RR4,RR5,RR8a,RR10,RR11,RR12
    Scenario: RR13. The film, end to end, against RR0
      Then on the Mac and on the Windows PC, RR0's film renders as one composition with `raea render` alone
      And getting the film again after change.sh's note costs shot 4's frames plus under 1 s
      And a full render's wall time is at most half of RR0's chunked baseline on each machine
      And each of the two biggest costs RR0 named is at least halved, or this scenario carries the measurement that
        shows why it can't be, for Shane
      And docs/lightspeed.feature's scoreboard gains the rows: one-shot re-render, full film, draft, cold first frame

    @needs:RR7,RR13
    Scenario: RR14. Agents stop stitching
      Then the feed's agent (Kimi) and a Claude Code session with the raea skill each get the same brief three times:
        a six-shot film with three looks and two cameras, then one note that changes one shot
      And across all six runs no tool call runs ffmpeg or ffprobe on raea's own renders, no chunk composition is made,
        and each note's render says "1 of 6 shots redrawn"
      And spend is logged with antsy against the feed eval budget

    @needs:RR8b,RR14
    Scenario: RR15. It ships in v0.1.1
      Then every RR scenario is @done on origin/main, L1 green
      And a v0.1.1 rc's release run passes on macOS, Windows and Linux, RL3 included on the Windows PC
      And the v0.1.1 launch thread (releases/0.1.1) has a post showing a one-shot change re-rendered in seconds
      And the readiness list goes to Shane, who alone gives the release its go
