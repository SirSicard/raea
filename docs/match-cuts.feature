@spec
Feature: Match cuts on the thirds: a piece's cuts planned as a chain of hooks, checked in the plan and in the render
  Shane, 11-10: "lets also ink in this match cut framework too to the skills library its a cool idea and worth sedning
  to a subagent to flesh out more ways to use and check and utilize it throughout ahot planning. the other agent workeid
  on it for the stay video".

  A film made for Stay planned its cuts on the frame's thirds: each shot takes the eye in where the last one left it,
  on the same kind of thing (a hook), and its action carries the eye to the place the next cut leaves from. This
  feature makes that a planning guide, a plan-level module with its checks, a render-level check, and a board any
  project can draw its chain on. All of it is craft: a guide, and a kit a project copies from the skill
  (sdk/guides/craft/match-cuts, copied to the skill's craft/match-cuts and from there to a project's
  checks/match-cuts), with no change to the SDK or the CLI. A chain lives in NAME.chain.ts beside its storyboard
  (cuts.ts is a project's footage edit, `raea cut`'s). The scenarios are built in the order MC2, MC1, MC3, MC4, MC5
  and land together at the release go, so none waits on another one landing.

  Background:
    Given the frame's thirds: nine points (the four intersections, the middles of the thirds lines, the centre), four
      lines (H1, H2 across, V1, V2 down) and FULL, a thing that fills the frame
    And a hook: what the eye is on (its glyph: circle, rect, hline, vline, vanish, diag, blob, streaks, dots), where on
      the thirds, and optionally the part that draws it, the way it moves, its colour and its light
    And a chain: the piece's shots in order, each with an in hook and an out hook, how it is cut into (graphic, motion,
      eye, full, sound or hard) and what carries the eye from in to out

  Rule: The plan is checked before anything renders

    @done
    Scenario: MC2. chain.ts: the thirds, hooks and the chain, with Stay's checks made general and run by name
      # Status 11-10: built. chain.ts holds the thirds, glyphs, hooks, chain() and eleven plan checks, imports nothing,
      # and runs under bun and inside raea check's bundle. toFrame and onFrame place a ball within 0.0004 of the frame of
      # where the render draws it. On good.chain.ts every check passes, and each of the fourteen cheats in cheats.ts fails
      # its own check and no other. plan.ts runs them all or by name (--only lands,glyph) and refuses an id it doesn't
      # have. Two of MC5's fresh agents found it skipping the file when --only was absent, which is fixed, with a bench
      # case. On Stay's chain lands, glyph and length pass, as its own checks do, and beats finds its montage 44-51 ms
      # off the song's beats.
      Given the plan
        | crate | file                                     | lines | job |
        | -     | sdk/guides/craft/match-cuts/chain.ts     | 300   | the thirds, glyphs, hooks, shots and chain(); the plan checks (hooks, length, lands, glyph, motion, carry, hard, beats, bridge, montage, loop), each a function of the chain; where a point in the world falls on the frame; no raea imports, so bun and raea check's bundle both run it |
        | -     | sdk/guides/craft/match-cuts/plan.ts      | 60    | `bun plan.ts NAME.chain.ts [--only ID,ID]`: the plan checks on a chain file, one line each, exit 1 on a failure |
        | -     | bench/direction/match-cuts/good.chain.ts | 80    | a short chain that uses every join: graphic, motion, eye on a beat, a FULL wipe, J and L sound bridges, a montage handing a circle on, a hard cut on a hit, and a loop back to the opening |
        | -     | bench/direction/match-cuts/cheats.ts     | 120   | one cheat per plan check, each made from good.chain.ts by one change, which that check must fail |
      Then every plan check passes on good.chain.ts and fails its own cheat, and no other check fails a cheat by accident
      And the checks Stay holds its chain to (twenty places aside: a film's own) are lands, glyph and length here

  Rule: The guide teaches the planner

    @done
    Scenario: MC1. `raea guide match-cuts`: planning cuts as a chain of hooks on the thirds
      # Status 11-10: built. The guide is sdk/guides/craft/motion/match-cuts.md (178 lines). The router's plan step, the
      # story, pitch and explain modes and motion.md's index route to it, and tools/skills.sh copies it and
      # craft/match-cuts into the skill. raea-skills PR #39 (d0e5e8d) carries the copies, stacked on #38. MC5's fresh
      # sessions found two wrong lines (the id --only takes, and where the rule's controller sits) and eight gaps, all
      # now in it: slideTo, names matched by prefix, a shot's progress over frames - 1, the bridge's sound name, a pass
      # seen to fail once, and the limits for a many-part hook, a hook's size and a hard cut's hooks.
      Given the plan
        | crate | file                                  | lines | job |
        | -     | sdk/guides/craft/motion/match-cuts.md | 200   | the chain, choosing hooks (shape, motion direction, colour, light, sound), the action that carries the eye, when a hard cut beats a match; graphic, motion, eye-trace on a beat, FULL wipe, J and L bridges, a montage's hand-off and a loop, each with how it is checked; the render check's limits |
      Then the story, pitch and explain modes and the router's plan step route to it
      And tools/skills.sh copies craft/match-cuts into the skill, so the guide's files are where it says

  Rule: The render is checked at every cut

    @done
    Scenario: MC3. thirds.ts: at each cut the hooked part sits at its thirds place on the frame before and the frame after
      # Status 11-10: built. landsOnThirds(chain) reads raea world's facts on the cut frames only, with no render. A part
      # is measured by its world box through the frame's camera, which is aimed with lookingAt or a rotation; a text by its
      # laid-out box. On the bench's graybox it finds nothing, and it finds each of the nine cheats above. It runs from a
      # note's ask (--only n1.1) or a controller's rule (--only and the check file's name: morning). The whole bench,
      # plan, render and board, runs in 9 s. What it can't see: a part hidden behind another, a camera rolled about its
      # view, the eye's way inside a shot, and a 2D graphic that isn't text.
      Given the plan
        | crate | file                                      | lines | job |
        | -     | sdk/guides/craft/match-cuts/thirds.ts     | 260   | landsOnThirds(chain): a raea/check system on the chain's cut frames; each hooked part projected through the frame's camera (or a text's box) and held to its place within a tolerance, FULL to a share of the frame; each chain cut a cut in the composition; J and L bridges' cues; the plan checks after the frames |
        | -     | bench/direction/match-cuts/graybox.tsx    | 160   | a graybox of good.chain.ts's chain whose hooks sit where the chain says, and its cheats |
        | -     | bench/direction/match-cuts/match-cuts.sh  | 120   | the plan cases, then raea check on the graybox (none found) and on each render cheat (some found), as asks.sh does |
      Then each cheat fails: a hook off its place; one there mid-shot but gone by the cut; a hooked part renamed or
        gone; a cut off the chain's frame; a FULL that doesn't fill the frame; a part behind the camera; a hook that
        names no part; a J bridge's sound starting at the cut; an L bridge's sound stopping at it

  Rule: The person picks from a board

    @done
    Scenario: MC4. board.tsx: any project's chain and places drawn on the thirds to pick from (`raea show board.tsx`)
      # Status 11-10: built. Board({ chain, places, title, intro }) draws the eye's way with its rests at each place, the
      # eleven plan checks, each shot's frame with its in and out hooks, and the place library with picks. Picks and
      # notes go back with app.result. The bench's board.tsx is three lines over good.chain.ts and places.ts, and
      # match-cuts.sh mounts it headless (raea app check --target web, @raea/app replaced by a stand-in with the board's
      # two calls) and fails when it throws.
      Given the plan
        | crate | file                                  | lines | job |
        | -     | sdk/guides/craft/match-cuts/board.tsx | 220   | Board({ chain, places }): the eye's path through the piece, each shot's frame with its in and out hooks, the place library with picks and notes sent back with app.result |
      Then a project's board.tsx is three lines: import Board, its chain and its places, and draw them

  Rule: The guide is shown to help

    @done
    Scenario: MC5. A fresh agent plans one short piece with the guide and without it; the plan checks compare them, and one graybox is rendered and checked
      # Status 11-10: measured. One-shot sessions (claude -p) planned the same 24-second loop for a bicycle shop's tenth
      # birthday: 16:9 at 30 fps on a 120 bpm grid, 8-14 shots, a storyboard and its chain, with the kit in
      # checks/match-cuts. Four read the guide. Two controls ran with raea's home on main's guides, which hold no
      # match-cut guide and no route to it; neither looked for one. All six chains pass all eleven plan checks: each
      # found plan.ts in its kit and ran it until they did. So the plan checks alone don't separate them, and the
      # guide's change is in the craft:
      #   - hard cuts: one in every guided plan (4 of 4), on a downbeat with a reason; none in either control
      #   - thirds places used: 7-9 guided, 6-7 controls
      #   - storyboard cut fields that name where the eye lands: 85-100% guided, 46-67% controls
      #   - joins used: 3-5 kinds guided, 3-4 controls; hooks resting at CC low in both (2-5 of 24-28 guided, 0-2 of
      #     24-26 controls); every plan named a part for every hook, had a montage and looped
      # A fifth session built a 13-shot graybox of one guided chain (graphic, motion, eye, FULL and hard joins, two J
      # bridges) from the guide's steps 6-7, at 1280x720. The render check found nothing on it. With every hook moved
      # in a copy of the chain, it failed all 22 measured hooks and both bridges. The render (720 frames, 9-12 ms a
      # frame) passed the cut check. The floor found 9 clips in three contacts (a trunk in its crown, a paper chain in
      # a person, a hand in a wheel), which were fixed to 0 errors, 0 warns, 0 notes. The frames either side of each cut
      # put the hooks on their places. All six planners hit plan.ts skipping its file without --only (fixed,
      # MC2), and the builder's notes went into the guide (MC1). Spend: $13.87 logged ($7.27 measured, $6.60 estimated
      # for the four guided runs, whose text logs carry no cost).
      Then both runs get chain.ts's types and the same brief; only one gets the guide
      And the plan checks' results for both are recorded here, with what the guide changed
      And the guided chain's graybox passes the render check, or its findings are recorded and fixed
