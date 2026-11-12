@spec
Feature: A composition handed to CapCut, ready in its timeline, and transparent video for any editor
  Shane, 2026-11-10: "implementing an export to capcut ... how could we export to capcut a project composition
  component etc correctly so it would be ready in the timeline. as well included how do we make sure we can natively
  render transparent movs for overlay gfx that someone might need".

  A flattened MP4 in CapCut is one clip nobody can edit. The export hands CapCut the composition's own parts instead:
  its footage and sounds as clips of the original files at their own trims and gains, so an editor can retime a cut,
  swap a take or ride a level; and everything raea draws (titles, lower thirds, shapes, 3D, effects) as transparent
  overlay clips above them, cut where the drawing comes and goes. The format is CapCut 8.5.0's draft as CapCut
  writes it, read from an empty project CapCut made and one with a clip placed by hand, which gives the companion
  materials a segment carries.

  Background:
    Given a composition renders with --manifest (render.json): each frame's footage (its file, source time and box),
      each sound clip (its file, first and last frame, source time and gain) and what the page drew
    And RAEA_HIDE_MEDIA=1 draws a render with every <Video> hidden (any element carrying data-raea-src), everything
      else as it is; a still (<Img>) stays in the overlay

  Rule: CC1. `raea render EDIT.tsx -o OUT.mov --alpha` writes transparent video natively, no ffmpeg
    The frames are rendered as --alpha PNGs (straight alpha) and encoded in raea (io/alpha) as one of:
      | codec  | what                                       | where              | gfx.tsx: 3 s, 1080x1920 |
      | prores | Apple ProRes 4444 with alpha (ap4h)        | Mac (VideoToolbox) | 12.3 MB                 |
      | hevc   | HEVC with alpha (hvc1, an alpha layer)     | Mac (VideoToolbox) | 0.34 MB                 |
      | rle    | QuickTime Animation, 32-bit ARGB, lossless | every platform     | 0.84 MB                 |
      | png    | PNG frames in a QuickTime movie, lossless  | every platform     | 7.4 MB                  |
    `--alpha-codec C` picks one; prores on the Mac, rle elsewhere, when none is named. The movie has no sound.

    @done
    Scenario: CC1a. Each codec's movie decodes to the frames' own alpha
      Given the fixture's graphics (the lower third fading in over nothing) rendered with --alpha
      When it is written as each codec's .mov
      Then ffprobe reads the codec and an alpha pixel format, and the decoded alpha of every frame matches the PNG's:
        exactly for rle and png, within the codec's error for prores and hevc
      And a frame the composition leaves empty decodes fully transparent
      And on 11-10 (FFmpeg 9.0.2, frame 50 against its PNG; colour compared premultiplied, over black): prores
        yuva444p12le, alpha 61.5 dB, colour 80.7 dB; hevc yuva420p (ffprobe names the base layer yuv420p; FFmpeg
        decodes the alpha layer), alpha 61.3 dB, colour 52.8 dB at --quality 0.9; rle argb and png rgba identical
        (infinite PSNR); frame 85, which draws nothing, has no alpha above 0 in any of the four

  Rule: CC2. `raea export capcut EDIT.tsx` writes a CapCut draft whose timeline is the composition
    Scenario: CC2a. Footage is clips of the original files, placed as the composition shows them
      Then each run of frames showing one file continuously (its source time advancing with the frames) is a clip of
        that file from its source time, at its rate, on a video track
      And the clips covering the whole frame are the main track, butted shot after shot; the others (a picture in
        picture) are on tracks above it, in the composition's order, scaled and placed to their box
      And the footage's own sound stays on its clip at the composition's gain when the manifest plays it there (its
        sound clip of the same file over the same frames from the same time); otherwise the clip is muted, and any
        other sound of the file is an audio clip (CC2c), so nothing plays twice
      And each file is the one the render drew: a staticFile path (/media/x) in the edit's media/, then the
        project's media/ and assets/, as the renderer finds it (on 11-11 the export read /media/x as a file at the disk's
        root and refused every project that used staticFile)

    Scenario: CC2b. What raea draws is transparent overlay clips above the footage, and under it what's under it
      Given the composition rendered again with its footage hidden, --alpha (RAEA_HIDE_MEDIA=1), the backgrounds of
        the elements holding footage cleared, since they paint under it
      Then each run of frames that draws something is one clip of one overlay movie, on the track above the footage
      And frames that draw nothing are a gap, so an editor sees a clip where each title or graphic is
      And a third render draws only those backgrounds (RAEA_HIDE_MEDIA=under); unless it is all black, CapCut's own
        canvas, its movie's clips are the bottom track, under the footage
      And footage that something else raea draws covers (a full layer before it in the page, not holding it) goes
        above the overlay, and the export says so, since the overlay's drawing over it is hidden there

    Scenario: CC2c. Sounds are audio clips with their trims, gains and fades
      Then each sound clip in the manifest is an audio clip of its file from its source time, its gain as CapCut's
        volume, on audio tracks that never overlap a clip on the same track

    Scenario: CC2d. The draft is a CapCut project folder
      Then it is written into CapCut's draft store (~/Movies/CapCut/User Data/Projects/com.lveditor.draft on the Mac,
        %LOCALAPPDATA%\CapCut\User Data\Projects\com.lveditor.draft on Windows) or -o DIR, never over a folder there
      And every file it uses is cloned (APFS) or copied into its assets/ folder, where sandboxed CapCut can read it
      And its version markers are the newest app-made draft's in the store, else CapCut 8.5.0's
      And a draft written into the store is entered in root_meta_info.json (a copy kept first in
        ~/.raea/capcut/backups) unless --no-register; CapCut open is refused, since CapCut rewrites that file when it
        quits, and the draft stays in its folder for the next export or a restart to enter
      And the reference render (the composition as raea draws it) is kept beside the draft, not in it

    Scenario: CC2e. What doesn't carry is said, not dropped quietly
      Then footage drawn with a CSS filter, a rotation, a mask or a crop that isn't a box, sounds the Tone graph makes
        (notes), and <Mix>'s mastering are named in the export's output

  Rule: CC3. CapCut opens it
    Scenario: CC3a. CapCut, quit and opened, lists the draft and plays it as raea renders it
      Then the timeline has the main track's shots, the picture in picture above, the overlay clips above that and the
        audio below, and the frame at each shot's middle matches the reference render's
      And which overlay codecs stay transparent in CapCut is recorded here, and the export uses the first that does

  Rule: CC4. The raea skill says when to hand a cut over and when to make a transparent movie
    Scenario: CC4a. The delivery guide teaches both
      Then sdk/guides/craft/motion/delivery.md (the skill's motion/delivery.md) says a cut an editor finishes goes to
        CapCut in layers with raea export capcut, or the app's Export to, then CapCut, and to pass on what it notes
      And it says graphics for someone else's edit go out as a transparent .mov rendered with --alpha, nothing drawn
        behind them, and names a background in one, --alpha with an .mp4 and exporting while CapCut is open as mistakes
      And tools/skills.sh coverage counts raea export as taught, and the skill's copy matches the guide
