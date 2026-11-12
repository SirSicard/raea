---
title: "Libraries: keep, find and share your media"
summary: "Make a library on this Mac or in raea's cloud, find any shot or sound by what's in it, mark where each file stands, share from it, and keep a project's media beside its code."
order: 9.5
sources: ["docs/libraries.feature", "docs/review.feature", "apps/app/src/library", "apps/app/host/library"]
---

A library is a set of folders raea reads, so you can find footage, stills and sounds by what's in them. This tutorial
makes one, searches it, marks where its files stand, and shares from it.

## On this Mac, or in the cloud

Every library lives in one of two places. On this Mac, its files and their index stay on your computer, and nothing
leaves it. In raea's cloud, on Pro and Team, it's searchable from any device, and only a cloud library's files can be
shared.

## Make a library

Open Library in the sidebar and press the plus beside Libraries. Name it, choose This Mac or raea cloud, then add a
folder, a drive, or files from Google Drive. raea reads each file once, in the background. A folder an agent adds
waits for your yes.

## Search by what's in it

Search looks through every library at once. Describe what's in the shot, like a chip pulled apart with cheese
stretching between the halves, and raea finds that moment, even when no file is named that. Turn on Sounds only to
find a sound by how it sounds.

## Mark where a file stands

Open a file to see it large. At the top of its panel, mark it Needs review, In progress, or Approved. The row under the
library's sources filters by status, so what's still waiting is one click away.

## Share from a library

In a cloud library, a file's panel has Share for review: the link is made right there, with Copy beside it. Pick
several files to send them on one link. A library on this Mac says that its files can't be shared, since they never
leave.

## Your projects, with their code

Projects you've saved to raea are listed under Projects, each one a cloud library over the project's folder. Its page
shows the project's GitHub repository and whether the code is pushed, so a project's media and its code sit together.

## From the terminal, and your agents

Agents search the same libraries, with raea library search, while the app is open. And on Pro and Team, an agent key
lets any agent reach your cloud libraries through raea's API, from anywhere.

Next: [How storage and search work](storage-and-search.md). The [API guide](../guides/api.md) has the calls.
