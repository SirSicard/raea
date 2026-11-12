@spec
Feature: Reviewing a video in raea's player: comments written on the picture, every layer in it selectable
  Shane, 2026-11-09: "i want comments in video player i want to be able to do it all without having to open or look
  at the comment panel i want to leave them inline. also make sure we are able to whene exporting a video form raea we
  allow for the dom sleectable like 3d objects/layers if we want in the video player. right now i cant sleect anything.
  so how do we make sure that actually works and does so consistently across 3d and reacta nd dom objects equally"

  What the player is today (apps/app src/detail), read 11-09:
    - Comment (C) drops a pin on the picture, then opens the notes rail, where the words are written (DetailView.tsx
      opens it on every new pin). Replies, resolve, Edit/Note and sending the edits to the agent are all in the rail.
      Posted pins show on the picture at every moment of the video, not at their own.
    - Select (P) picks from item.parts: one fixed box per part for the whole video. Only the demo fixtures fill it; a
      real render never does (canPick is true, the list is empty), so nothing can be picked.
    - The render manifest (engine/page motion.rs) gives each text run and video a box per frame, and with E2's stamps
      (docs/editing.feature, branch stamps-wip, parked) the JSX that drew it. 3D entities, images, shapes and plain
      elements aren't in it, and 3D JSX isn't stamped (stamp.rs leaves R3F and bevy-react tags alone).

  The model this file sets:
    1. Reviewing happens on the picture. A comment is written where it's pinned, read where it's pinned, answered and
       resolved there; the rail is a list of the same threads, never the only place to act on one.
    2. A layer is anything the composition draws that a person can point at: a 3D mesh, a page element, a run of text,
       an image, a video, a component's use. Each has one key: its source stamp (file:line:col), the uses of the
       edit's components it was drawn in, and its place among what the same JSX drew (a .map()'s key or index). The
       same thing keeps the same key in every frame, in Layers, on the timeline and in a comment.
    3. What is at a pixel is decided once, by the engine, from the frame as drawn: a layer pass gives each pixel the
       key of the frontmost layer there, through the frame's real structure (the page over the 3D, a <Screen>'s page
       on a mesh, a 3D view in an element). The player, the editor and agents all read that pass; none of them guesses
       from boxes, so 3D, React and the page can't disagree.
    4. Layers ride with an export when asked: the render writes the layer pass beside the video, and the player makes
       the video selectable from it. A video without it says so, and how to get it.
    5. "Works" is checked against an oracle that knows nothing of the layer pass: hide one layer, render again, and
       the pixels that change are where that layer shows. A conformance composition holds the same shape as a 3D
       mesh, a React component and a page element, and every layer kind in it must match the oracle.

  Background:
    Given the player's code is apps/app src/detail (Frame.tsx, views/Watch.tsx, player.tsx, blocks/Review.tsx), the
      manifest's is engine/page (motion.rs), the 3D pass's is engine/render (engine/aov.rs is RT1's depth and motion),
      and the stamps' is engine/bundle (stamp.rs, on stamps-wip)
    And Rust changes go through the lanes' build rules (announce, `lane build --`, no edits under a peer's build)

  Rule: R1. Comments are written, read and answered on the picture (app only)
    # Status 11-09: built (raea-feed 281ce00, src/detail/blocks/Inline.tsx; Frame, Timeline, Watch, Look, DetailView).
    # Checked in headless Chrome on the reel fixture: composer beside the pin, rail closed; pins as the author's initial
    # ringed white (readable on bright and dark footage); hover reads, click opens to reply and resolve; marks show their
    # first line and open the comment; "Send 2 edits to Cutter" in the bar. e2e smoke: 5 pass (two new cases). Not yet
    # checked in raea.app's own runtime (next repackage).

    Scenario: R1a. A comment is written where it's pinned
      Given a video open in the player
      When I press C and click the picture
      Then the video pauses, a composer opens beside the pin, and the notes rail stays as it was
      When I type and press Enter
      Then the comment is posted with that place and moment, its pin stays on the picture, and Comment stays on for
        the next one; Esc closes the composer without posting

    Scenario: R1b. Edit or Note is chosen in place
      Given the video was made by an agent
      Then the inline composer offers Edit and Note, Edit first, as the rail's does

    Scenario: R1c. A comment shows at its own moment
      Given a comment pinned at 0:12
      Then its pin shows from 0:12 for 2 s while playing, and whenever the playhead is paused within 0.5 s of it
      When I hover the pin
      Then its words, author and replies show beside it
      When I click it
      Then it stays open with Reply, Resolve and Edit/Note, and a reply is written in it

    Scenario: R1d. The scrubber's marks open their comments
      When I hover a comment's mark on the scrubber
      Then its first line shows above the mark
      When I click the mark
      Then the video seeks to it, pauses, and its comment opens on the picture

    Scenario: R1e. The edits go to the agent from the bar
      Given three comments marked Edit and not sent
      Then the player's bar has "Send 3 edits" naming the agent, and pressing it sends them as one round

  Rule: R2. Every layer is selectable, the same way for 3D, React and the page (engine and app)
    # Status 11-09: the player side (R2d, R2f) is built (raea-feed 79f58c5, cc9e064, d331572): host/layers.ts reads
    # NAME.layers (v1: gzip, RAEALAYR, header JSON, per frame u32 N runs of u16 value + u16 count, N=0 repeats; a
    # parent as its key or index; "at" for a render of chosen moments), Select outlines a layer by its mask shape (text
    # by its box, and preferred within 2 mask px since its mask is glyph-exact), a pin follows its layer. The engine's
    # first file (issues lane, stamps-wip: systems/layers, bench/layers/compare.sh) has the 12 page layers of the
    # conformance composition at IoU >= 0.977 against the hide-and-diff oracle; the 3D half is next. `--layers` and its
    # manual entry land with stamps-wip; the app's export passes it once that raea ships (R2c's toggle).

    Scenario: R2a. Every drawn thing has its layer key
      Given a composition with a 3D mesh, a component used twice, a page element, text, an image and a video
      Then each carries its source stamp and use chain to what draws it: page elements as E2's data-raea-loc and
        data-raea-use, 3D entities as a component on the entity (never a prop the 3D kinds read)
      And a .map() drawing five cards gives five keys that differ only in their index

    Scenario: R2b. The engine gives each pixel its frontmost layer
      When a frame is rendered with the layer pass on
      Then a mask at a quarter of the frame's size holds, per pixel, the index of the frontmost layer in the frame's
        layer table, or none: 3D from the drawn meshes (skinned and morphed as drawn), the page in its paint order,
        a <Screen>'s page through its mesh, a 3D view through its element
      And the table gives each index its key, kind (mesh, element, text, image, video), name and parent

    Scenario: R2c. An export can carry its layers
      When I render with `raea render --layers`, or export from the app with "Selectable layers" on
      Then NAME.layers sits beside NAME.mp4 (the table and every frame's mask, run-length coded and compressed), and
        render.json names it
      And a render without it plays as before

    Scenario: R2d. The player selects from the layers
      Given a video exported with its layers
      When I press P and hover the picture
      Then the frontmost layer under the pointer is outlined by its own shape (a mesh's silhouette, not a box) with
        its name, at any moment, playing or paused
      When I click it
      Then it's selected, its path is shown (each step selects that parent), and E opens the editor at its JSX
      When I comment with it selected
      Then the comment is pinned to its key, and its pin follows the layer as it moves

    Scenario: R2e. 3D, React and the page agree with the oracle
      Given the conformance composition: one shape drawn as a 3D mesh, as a React component and as a page element,
        overlapping, with text, an image, a video, a <Screen> on a mesh, a rotated element, a skinned character and
        a .map() list
      When each layer is hidden in turn and the frame rendered again
      Then the pixels that change and the layer pass's pixels for it overlap with IoU 0.95 or better, for every layer,
        at three moments
      And mutants fail it: two keys swapped, the 3D mask shifted 2 px, occlusion ignored, the page drawn under the 3D

    Scenario: R2f. A video without layers says how to get them
      Given a raea render exported without layers
      Then Select is disabled and its tooltip says "Rendered without layers: export again with Selectable layers on"

  Rule: R3. Sent edits are tasks: the agent marks each working and done, and the person sees who's on which (app and CLI)
    # Shane 11-09: "can you also make edit comments become tasks that can be when i return to comments the agent shoudl
    # makr complete too. not sure hwo that works but that feedbakc is helpful for the ui to see what comment the agent or
    # an agent is working if multiple subagents and which are done"
    # Status 11-09: built in raea-feed (src/model/tasks.ts, taskChange.ts, detail/blocks/TaskBadge.tsx, Review.tsx,
    # Inline.tsx, host/tasks.ts; feed tool comment_task, feed_post answers) and the CLI (raea show --on). e2e smoke
    # "sent edits are tasks" passes; vitest tasks.test.ts, host/tasks.test.ts.

    Background:
      Given an item an agent made, in raea (over ACP) or from outside it (raea show), with edit comments on it

    Scenario: R3a. A sent edit is a task to do
      When I send the edits
      Then each sent comment shows "Sent to <agent> · to do", in the rail and in its pin's thread on the picture
      And the agent gets each comment's id with its words and place: in its turn's prompt over ACP, in the inbox line
        (`comments`, and `tasks` saying how to mark them) from outside raea

    Scenario: R3b. The agent marks the ones it's on, naming the subagent working each
      When the agent marks comments working: the comment_task tool over ACP, or `raea show --on ITEM --working ID
        [--sub NAME]` from outside raea
      Then each shows "<agent> · <subagent> is on it" with a pulse, and the rail's tally above the list says how many
        are being worked and by whom, how many are done and how many are still to do
      And an outside session's marks reach the open app within two seconds (the page asks the host while any of that
        item's sent edits isn't done)

    Scenario: R3c. Done stays in view, checked, until I resolve it
      When the agent marks comments done: comment_task done, feed_post with `answers`, or `raea show --on ITEM --done ID
        [--note LINE]` (or `raea show FILE --replaces ITEM --done ID...` with the version that settles them)
      Then each shows "Done by <agent>" with the version that settled it, and the agent's line under its words
      And it isn't resolved for me: Resolve is mine

    Scenario: R3d. Not done sends it back
      Given a comment the agent marked done
      When I press Not done
      Then it's an edit again, unsent, counted in the bar's edits to send, with no task on it

    Scenario: R3e. A wrong id is refused with the ones there are
      When the agent marks an id that isn't on the item, or a comment I haven't sent
      Then nothing changes and the refusal names the item's comment ids, or says the person hasn't asked for it yet

  Rule: R4. Review links: the person or their agent shares a cut, and anyone with the link watches and comments on the picture, like frame.io (built 11-11: raea-api review.ts, raea.io/r/, the app's Share button and the Library's Review links, R6)
    # Shane, 11-11, on Team: "maybe see if we can add to it that you can have claude share out review links so it
    # really does feel liek frame.io". Then, the same day: "important for pro and team plans to share review links
    # since it requires cloud to do so anyway". Reviewers and clients aren't team members: a link takes no place in
    # Team's 5 (docs/pricing.md). The link's page is raea.io's and its routes are raea-api's; this rule is the
    # product, the routes below are the contract.

    Background:
      Given a person on Pro or Team (a link's file lives in their raea storage and counts toward it); on Free, Share
        offers Upgrade to Pro and POST /v1/review-links answers 402 plan_required, asked by the file's hash before any
        upload. A link made before a downgrade stays listed, changeable and stoppable
      And their agents share only when the person has turned on Settings → Sharing → Let agents share (off until then,
        kept in ~/.raea/app-prefs.json); an agent never answers invites or leaves projects for them

    Scenario: R4a. The person or their agent shares an item
      When the person presses Share at the top right of an item in raea (a video, a still or a sound), or their agent
        calls the share_link tool over ACP
      Then the item's file goes up to their storage if it isn't there, and a link is made: raea.io/r/<token>, 128 bits
        (an HMAC of the link's id, so only its hash is stored and the owner can always be shown the URL again), good
        for 30 days unless set (7, 30 or 90 in the panel; 1 to 365 over the API), downloads off unless allowed, an
        optional password
      And the agent gets the link back to hand on, and the Share panel shows it with Copy, Open, its views, comments
        and expiry, Settings and Stop sharing
      And raea-api keeps it: POST /v1/review-links {sha256, type, item, title, project?, days?, download?, password?}
        -> link, GET /v1/review-links[?item=], GET/PATCH/DELETE /v1/review-links/:id, POST :id/comments, PATCH
        :id/comments/:cid (devices and raea.io; an agent key with the share scope may make one for a file it can reach)
      And the Library's Review links (R6) lists every link, live and ended, where each stands with its reviewers

    Scenario: R4b. A reviewer watches and comments without an account
      Given the link, opened in any browser
      When the reviewer gives a name (kept in that browser) and presses C on the picture
      Then the comment is pinned to that point at that frame, written where it's pinned, and answered and resolved there,
        as R1's are; the scrubber marks every comment's moment
      And the page plays from a presigned URL good for an hour that the page renews, frame by frame with J, K, L and
        arrows, timecode shown; nothing else of the account is reachable from it
      And Approve marks the version approved by that name

    Scenario: R4c. Comments flow back to the item and its agent
      When a reviewer comments
      Then the Share panel lists it (name, moment, version) with Reply, shown on the page as the owner's, and Mark done
        (built 11-11)
      And the agent reads them with share_links {link} and answers or resolves with share_change {link, reply | resolve}
        (built 11-11)
      And the comment becomes an R1 comment on the item by "<name> (guest)" (id rv-<comment>, kind edit, so it goes to
        the agent as an edit, R3), replies and resolves sync both ways, and when the agent's version answers it the
        reviewer sees "Done in v2" (built 11-11: the feed's share/sync.ts, every 60 s and on focus)
      And not built yet: a feed post saying who commented

    Scenario: R4d. A new version replaces the cut on the same link
      When the agent shares a newer item of the same version chain (share_link on it), or the person opens one and the
        Share panel says "The link shows v1. This one is newer" and they press Make it v2
      Then the link plays v2 with a version picker; v1's comments stay on v1 (the link is kept under the chain's first
        item; the same file again is no new version)
      And Compare on the page shows two versions side by side, each side picking its own (the other side's swaps
        them), played, stepped and scrubbed together by one transport with the right side's comments, the sound from
        the side whose speaker is on (built 11-11: raea.io's review/compare.tsx)

    Scenario: R4e. A link is the reviewer's only right, and it can be taken back
      Then a link reaches one item's versions, their comments and nothing else: no library, file list, search or account
      And a stopped or expired link is 404, at once; a wrong password is refused and slowed
      And guests' comments are plain text, rate limited per link and per address, and kept with the item when the link
        stops; pages are noindex
      And an account keeps up to 200 live links; views (name and time) are the owner's to see

  Rule: R4 open questions for Shane
    Scenario: To decide
      Then 1. Decided 11-11: Pro and Team (it was Team only earlier the same day)
      And 2. Downloads off by default, with a per-link switch (built that way; say if it should default on)
      And 3. Built 11-11 after v0.1.1's binaries: raea-api and the page (the private repo), Share in raea and the agents'
        share tools (raea-feed). `raea show --share` on the CLI is not built; agents share through the feed's tools

  Rule: R5. Collaborators: on Team, the owner invites people into a project, and they work in it from their own raea (built 11-11; ships after v0.1.1)
    # Shane, 11-11: "for team plans allow to invite collaborators to a project". A project is plain Git on the owner's
    # GitHub with its media in the owner's raea storage (docs/projects.feature PJ3), so access is two halves: raea's
    # (the media, through raea-api's LFS) and GitHub's (the history).

    Background:
      Given an owner on Team whose project is on GitHub with raea's storage (it gets both when it's made while signed in
        with GitHub); on Pro the People tab offers Upgrade to Team and POST /v1/projects/:repo/collaborators answers 402

    Scenario: R5a. The owner invites someone
      When the owner types a GitHub username or an email on the People tab of an item's Share panel, or in Settings →
        Sharing → People on, or their agent calls project_collaborators {invite} (when allowed)
      Then raea-api keeps the invite for that raea account (they must have one; Free is fine), up to 20 people a project
        and 100 invites a day, and the owner's own GitHub sign-in invites them to the repo with push access
      And the panel names the exact repo being shared and says what GitHub did (invited, already there, or why not)

    Scenario: R5b. The person invited accepts in their own raea
      When they open the Library's Shared with you (R6) and press Accept on the invite (never an agent)
      Then raea-api marks them joined and their raea accepts GitHub's invite to the same repo with their sign-in
      And from then on they reach the repo's media and its file locks through raea-api's LFS while the owner is on Team
      And Shared with you lists the project with Open in raea, GitHub and Leave

    Scenario: R5c. The owner removes someone
      When the owner presses Remove (or an allowed agent calls project_collaborators {remove})
      Then their raea access ends at once, and the panel says to take them off the repo on github.com too (raea-api
        holds no GitHub token, so it can't)

    Scenario: R5d. Open in raea brings a shared project into the sidebar (built 11-11: the feed's host/clone.ts)
      When the person invited presses Open in raea on a project in Shared with you
      Then raea clones the repo with their GitHub sign-in, history first and media after in the background (LFS through
        raea-api while the owner is on Team), into their raea folder, and shows it in the sidebar
      And a whole workspace's repo becomes its own workspace, "<name> (<owner>)", a name kept on this Mac only
      And a single project's repo joins the workspace "Shared with you" as a submodule, its commit saying who shared it
      And once it's here the button says Open and goes to it; a refusal says why (signed out of GitHub, GitHub refused
        the clone, not a raea project)

  Rule: R6. The Library: where the person's media lives and goes out, like frame.io (built 11-11: the feed's library/Hub.tsx)
    # Shane, 11-11: "we want frame.io capability of storage while using our vector search capabilities and statuses
    # and exploring the libraries like this", "we dont want share links to be buried in the settings". Libraries come
    # forward: they are how cloud content is organised. The sidebar has a Library row under Inbox; Settings → Sharing
    # keeps only the switches (Let agents share, People on) and points here.

    Scenario: R6a. One place with its own column
      When the person clicks Library in the sidebar
      Then a column lists Search, Review links, Shared with you and, under Libraries with a + to make one, every
        library with where it lives (this Mac or raea's cloud) and how many files it holds
      And the row and the column's Review links count reviewers' comments still open
      And it opens on the page last looked at, else Review links when there are comments to address, else Search

    Scenario: R6b. Search reaches every library by meaning
      When the person types what's in the shot, or a sound as they'd describe it with Sounds only on
      Then every library on this Mac and in raea's cloud is searched at once (docs/libraries.feature), to the moment,
        as a grid of tiles; until the search model is ready it searches by words and says so

    Scenario: R6c. Review links is a board of every link, where each stands
      Then every link shows as a card: the cut's poster, its version, its title and its state with its reviewers,
        Approved (on the version it shows now), To address (comments still open here, plus any not synced yet),
        Waiting, or Ended (expired or stopped), with views, comments, the project and when it ends
      And the cards filter by state (All leaves out Ended) and by words, and sort what needs the person first
      And picking a card opens a side panel with Open item, Copy, Open, Settings and Stop sharing
      And a file out for review says so wherever it shows: a library's tiles and every search hit whose file is the
        version a live link shows now carry its state at the poster's corner, and the file's panel names the link and
        opens it here, picked (built 11-11: the feed's share/links.ts and ReviewChip.tsx)

    Scenario: R6d. Shared with you is where invites and other people's projects are
      Then invites wait there for Accept or Decline (R5b) and joined projects show with Open in raea (R5d), GitHub and
        Leave

    @done
    Scenario: R6e. A status the person sets on any file (built 11-11: the feed's library/file-status.ts)
      When the person picks Needs review, In progress or Approved (or No status) at the top of a file's panel
      Then the file keeps it whether or not it's on a link, as a reserved tag status:<name> beside its own tags (synced
        to the cloud with them, never shown among them), and its tile says it under the poster
      And a library's grid filters by it: All, each status with its count, and No status; filtered, the grid reads the
        rest of the library first and counts only once it has every page

    @done
    Scenario: R6f. A cloud library's file goes out from its panel (built 11-11: the feed's library/ShareFile.tsx)
      # Shane, 11-11: "assumedly theres local only and cloud libraries. only cloud libraries can be shared."
      When the person presses Share for review in the Review row of a file in a cloud library
      Then the link is made there, nothing navigating away: a file in raea's storage by its hash with nothing uploaded,
        a folder's file from its copy on this Mac (uploaded first when raea doesn't hold it yet)
      And its address is copied, and the Review row names the link with Copy link and says Link copied
      And a library on this Mac only never shares: its Review row says only a cloud library's files can be shared, and
        the host refuses one (host library.shareable) whatever the page asks; so is a Google Drive file, and a file
        on another machine is shared from there

    @done
    Scenario: R6g. Several files on one link (built 11-11: the feed's library/ShareBar.tsx, raea-api review-sets.ts)
      # frame.io's presentation link: a folder of cuts, a round of stills
      When the person picks tiles in a cloud library (a box at the poster's corner, or ⌘/shift-click; once any is
        picked a click picks) and presses Share for review in the bar at the grid's foot
      Then one file goes out on its own link, and two or more on one link the person names
      And each file is a review link of its own (a file already on a live link joins with that link), and the set's
        page at raea.io/r/<token> shows them as a wall of posters, each opening its own page (versions, comments,
        Approve) with All items leading back
      And Review links lists live links of several items above its cards, with Copy link and Stop sharing; stopping a
        set leaves its items shared, and an item stopped on its own drops out of its set's page

    @done
    Scenario: R6h. A project saved to raea is a library with its code beside it (built 11-11: the feed's library/Projects.tsx)
      # Shane, 11-11: libraries "could be how we organize cloud content and sync code"
      Given the workspace has projects saved to raea (history on GitHub, media in raea's storage: Settings → Projects)
      Then the Library's column lists them under Projects, below Libraries
      And a project's page says where its code stands, read from git on this Mac with nothing fetched: its GitHub repo
        and Pushed, or the commits to push and to pull and the changes in its own folder not committed yet; the
        column's row shows a dot until it's pushed, and both are read again when the window comes back
      And one press makes its library: a cloud library over the project's folder, so its renders, stills and sounds
        are searched, given a status and shared for review like any cloud library's (R6e, R6f, R6g)
      And that library is listed once, under Projects, never again under Libraries
      And a project not saved to raea isn't listed; its folder can still be added to any library
