@spec
Feature: Editing a video in raea: the composition is the document, every change is a change to its code, live
  Shane, 2026-11-07: "right now its confusing, broken, and weird to have to make changes then confirm them? the
  comments are fine but i noticed moving text doesnt really seem to apply or how does that actually effect how its
  built in react. i feel like theres a lot more to explore here that we could unify and model a complete video editing
  experience and timeline and how the tools work. also consolidating toolbars in the ui so its clear where my tools
  are, they have tooltips and clear action states and states"

  What the editor is today (apps/app src/detail, src/compositions, host/edit.ts), read 11-07:
    - A change is held in the page until "Render edit" in a "…" menu (or ⌘↵): it writes NAME-vN.tsx, renders it, and
      posts it. Nothing on screen says the change isn't real yet, and the save is hidden.
    - Moving text matches its words in the source and wraps that element in <Nudge x y> (sdk/video nudge.tsx). Text
      from a prop, a variable, a .map() or the words can't be found ("isn't written out in the composition"); the same
      words twice move the first; the picture doesn't change until the save renders (drafts, host/draft.ts, 11-07,
      now render it while unsaved).
    - The Properties panel offers position, scale and opacity, but the save sends x and y only: scale and opacity
      are dropped without a word.
    - The timeline edits the render, not the composition: cuts are frame ranges over the mp4 (Segments), <Ad> parts
      can be retimed, captions come from the words. A <Sequence>'s from and length, a clip's trim, a component's
      place in time: none of them are on it.
    - Tools are in three places: the player bar (play, ±5 s, comment, pick, outlines, the summary, the "…" menu),
      the strip's own bar (undo, redo, split, delete, zoom), and the right panel's tabs.
    - The render manifest (engine/page/src/motion.rs) records per frame the text runs and videos with their boxes,
      and nothing about which JSX drew them, so the editor can only guess what a picked thing is by its words.

  The model this file sets:
    1. The composition's file is the document. An edit is an edit to its code, made the moment you make it, the
       way a design tool saves: no confirm step. The first change in a sitting starts the next version
       (NAME-vN.tsx, "Editing v4"); each further change rewrites that same file; undo and redo step through them.
       Leaving the editor, or pausing a while, closes the version: rendered at full quality, posted once to the feed
       as one line with what changed (11-07's compact row). "Discard" removes the version the sitting made.
    2. What you see is what the code draws, as you change it: the picture is the draft render of the working file
       (host/draft.ts) until the engine can play the composition live in the editor (E4).
    3. Everything picked is a place in the code. Every element drawn carries its source location (file:line:col),
       so picking in the frame, in Layers, or on the timeline picks the same JSX element, whatever made its words.
    4. A property is a prop. Position, scale, opacity and rotation go through one wrapper the person can read,
       <Nudge x y scale opacity rotate> (one line, re-written in place on the next change); a component's props are
       its props (host/props.ts); a <Sequence>'s time is its from and durationInFrames.
    5. The timeline is the composition's structure: a track per layer of the tree (sequences, media, components,
       text), each clip a JSX element with a span; dragging, trimming, splitting and deleting a clip edits that
       element. The render's own reference (thumbnails, the sound, captions) sits under it, and a cut over the whole
       picture (Segments) stays for footage edits.
    6. One toolbar. Between the picture and the timeline, left to right: transport (play, ±5 s, sound, the time),
       tools (Select P, Comment C, Outlines O; in the feed's player, E opens this editor), history (undo, redo), the clip tools
       (Split S, Delete), the picked part's values, timeline view (zoom), and on the right the document's state
       ("Saved to v4", "Rendering v4…", "Couldn't save") with Discard and Done. Every button has a
       tooltip naming it and its key, a pressed look when on, and a disabled look with the reason in its tooltip.
    7. An agent edits through the same operations, on the same working version, and the person sees each change
       land (editor_selection, 11-07, tells it what's picked).

  Background:
    Given the editor's code is apps/app src/detail/timeline, src/compositions, and host
      edit.ts, draft.ts, props.ts; and the engine's is engine/page (the manifest) and engine/bundle (TSX, oxc)
    And Rust changes go through the lanes' build rules (announce, `lane build --`, no edits under a peer's build)

  Rule: E1. Changes apply as you make them, and the tools are in one bar (app only)
    # Status 11-07: built and checked by hand in the composition editor (a throwaway composition in p-ides):
    # the first arrow-key move wrote sit-v2.tsx with <Nudge x={0} y={-100}> ("Saved to v2"), the scale slider re-wrote the
    # same file with scale={1.01}, undo re-wrote it without, Done rendered v2 and moved the editor to it; a move after
    # that started v3 and Discard removed it; leaving the editor with a change rendered v3. Since 11-07 the feed's player
    # doesn't edit (Shane's call): its Edit (E) opens this editor on the piece, in the project's folder or, for a source
    # kept in another raea project, that one (#/compositions/<project>/<id>/in/<folder>). Checked: i-parts' Edit opened
    # "parts" from raea-feed with its three parts on the strip. host/edit.test.ts: 9 pass (scale and opacity on one Nudge; a sitting's file). Not
    # run: e2e/edit.spec.ts needs the tutorial's render, which isn't on this Mac.

    Scenario: E1a. A change is saved the moment it's made
      Given a composition open in the editor at v3
      When I move a title
      Then promo-v4.tsx exists with the move, the bar says "Editing v4 · saved", and the picture plays the draft
      When I move it again
      Then promo-v4.tsx is rewritten, and no promo-v5.tsx is made
      When I press Done
      Then v4 renders at full quality and the feed gets one row: "You edited promo → v4 · title moved"

    Scenario: E1b. Discard takes back the sitting
      Given I've made changes that started v4
      When I press Discard and confirm
      Then promo-v4.tsx is gone and the editor shows v3 as it was

    Scenario: E1c. Scale and opacity are applied
      When I set a title's scale to 120% and its opacity to 50%
      Then the working file has <Nudge x={…} y={…} scale={1.2} opacity={0.5}> around it, and the draft shows it

    Scenario: E1d. One toolbar with tooltips and states
      Then the editor has one bar between the picture and the timeline, in the order the model sets
      And every control in it has a tooltip with its name (and key), aria-pressed when on, and when disabled says why
      And there is no "…" Edit actions menu and no second bar on the strip

  Rule: E2. Every drawn element knows its place in the code (engine)
    # Status 11-07: built. engine/bundle stamp.rs (a load plugin, on when raea is asked with RAEA_SOURCE_STAMPS=1, which
    # the app's host sets on its manifest renders; the bundle cache keys on it) stamps the edit's own files: an HTML
    # element gets data-raea-loc="file:line:col" (the attribute named data-raea-src in E2a is the video manifest's
    # media source already) and data-raea-use, the uses of the edit's components it was drawn in, nearest first, read
    # from a context each use of an own component is wrapped in (not inside a package component, which may read its
    # children's types). runtime/page keeps both; engine/page's manifest gives each text and video "loc" and "use".
    # The editor keys a picked text by its words and place, and host/edit.ts writes a move at the first stamp in the
    # composition's own file (the element, else the use of the component that drew it); a text only a component file
    # draws says to move it on that component's page. Checked: two <Card title="Same words"> came out as two runs
    # (card.tsx:4:7 used at lab.tsx:8:9 and lab.tsx:9:9); picking the second in the editor and moving it wrapped only the
    # second use in <Nudge>. engine/bundle: 6 tests; host/edit.test.ts: 13.

    Scenario: E2a. The bundler stamps elements
      Given engine/bundle compiles a composition's TSX
      Then each intrinsic JSX element gets data-raea-src="<file>:<line>:<col>" (not for the SDK's own files)

    Scenario: E2b. The manifest carries it
      Then each text and video entry in render.json has "src" from its owner or nearest stamped ancestor

    Scenario: E2c. Picking is by source
      Given text made by {title} inside <Card>, used twice with different titles
      When I pick the second one and move it
      Then the move is written at the second <Card> use's line, and the first doesn't move

  Rule: E3. The timeline is the composition
    # Status 11-07: built for <Sequence> (host/sequences.ts). A composition with no <Ad> shows its sequences on the strip's
    # Sequences track, a lane per nesting level, named by their name prop or what they hold; dragging and trimming one
    # rewrites its from and durationInFrames (in its parent's time), S splits the picked one at the playhead (written
    # twice, its <Video>/<Audio> startFrom moved on in the second), Delete removes it. Edits are an ordered list in the
    # editor's history, so undo steps back through them, and the sitting writes them into the working version. A from
    # or length written as an expression is shown "(set in code)" and refused. Checked in the editor: S on "Second
    # scene" at 3 s wrote two sequences meeting at frame 90 into lab-v2.tsx. host/sequences.test.ts: 5. Not yet:
    # media and components as clips of their own, and a <Series>'s children.

    Scenario: E3a. Tracks from the tree
      Given a composition with <Sequence from={0} durationInFrames={45}> and <Sequence from={45} …>
      Then the timeline shows two clips at those spans, named by what they hold

    Scenario: E3b. Moving, trimming, splitting and deleting a clip edit its element
      When I drag the second clip 10 frames later
      Then its from is 55 in the working file
      When I split a clip at the playhead
      Then the element is written twice with spans that meet there (media keep their place with their trim)
      When I delete a clip
      Then its element is gone from the working file

  Rule: E4. The picture plays the working file live
    # Status 11-07, the step before live play: level of detail and buffering. A render gets a light copy (host/proxy.ts:
    # 540 lines, low bitrate, renders/proxies/, made once per render; a render under 4 MB or 540 lines is its own) and
    # the editor plays it until the full render can play through (src/detail/lod.ts), keeping its place across the swap;
    # the stage says "Light copy · full quality loading" meanwhile, and "Buffering" when the player stalls. The versions
    # either side of the open one are prefetched. Checked in the browser with the full render held back 3 s: film4.mp4
    # (205 MB) -> proxies/film4-540.mp4 (2.6 MB, made in 3 s) -> film4.mp4, the playhead at 20.00 throughout.
    # host/proxy.test.ts: 3 pass.
    # E4b, 11-07: a piece over 20 s drafts the seconds around the playhead first (1 s before, 4 s after), as the
    # composition's own cut (edit={{ segments }}, host/draft.ts window), shown over the render while those seconds play
    # ("Draft here · the rest rendering"), then the whole draft. Checked: a move at 20 s of a 30 s piece drafted frames
    # 570-720 first and showed them, and the full draft took over when it came.
    # E4a, 11-07: in the raea app the editor's Live button (the bolt) puts the engine's stage in place of the video
    # (src/compositions/live.tsx, engine/page/stage's new stage.seek): it plays the working version, opened again each
    # time the sitting saves it at the frame it was on; no drafts are made meanwhile. Not in Chrome (no stage).
    # Checked in a dev window (raea-page-host built from this tree, the app's page over the dev host): Live on drew lab
    # v2 at 0:00, play ran it to "Second scene" at 2.5 s, and a Shift+↓ on the first card at 0.45 s wrote lab-v3.tsx
    # (<Nudge y={30}>) and the stage drew v3 with the card lower at the same moment ("Live · the engine draws v3").
    # The packaged raea.app needs a repackage (its own raea and raea-window) before it has stamps and stage.seek.

    Scenario: E4a. No render between a change and the picture
      Given the engine plays a composition on the editor's stage, as games already play live in the feed
      When I change a prop
      Then the next frame shows it, and the mp4 draft is only a fallback

    Scenario: E4b. Long pieces start where you are
      Given a 3-minute composition with no live player
      When I change something at 2:10
      Then the draft renders the seconds around the playhead first, then the rest

  Rule: E5. Agents edit the same way
    # Status 11-07, the part before shared sittings: an agent's new version file shows in the open editor's Versions
    # (checked: lab-v3.tsx appeared 4.4 s after it was written, the 4 s re-read) without taking the picture off the
    # version open; its feed_post with replaces and changed posts a card with the render's first frame and the line
    # ("lab v2 · Title now says …"). A posted render with no poster used to show as a broken image: cards.tsx now
    # holds the render's first frame. editor_selection tells the agent what's picked.
    # E5a, 11-07: built. editor_edit (a PAGE tool) changes the open editor as the person does: a part moved, scaled or
    # faded, or a <Sequence> moved, trimmed, split or deleted, into the same history and working version;
    # editor_selection now lists the frame's parts and the timeline's clips to name. Checked: an editor_edit on the
    # first card wrote its <Nudge> into the open lab-v2.tsx beside the person's own move and split, and ⌘Z took back
    # only the agent's.

    Scenario: E5a. An agent's change lands in the open sitting
      Given I have promo open at "Editing v4"
      When the agent moves the title through the editor's operations
      Then v4 is rewritten, the picture shows it, and undo takes it back like my own change
