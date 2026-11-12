---
title: "How storage and search work"
summary: "Every project is a plain Git repository with its media stored the Git LFS way, by hash, in raea's storage; libraries make that media searchable by what's in it, with vector search."
order: 10
sources: ["docs/platform.feature", "docs/libraries.feature", "docs/nodes.feature", "apps/site/api/src/storage.ts", "apps/site/api/src/library"]
tutorial: "storage-and-search"
---

raea's paid plans are storage and search. This tutorial explains how a project keeps its history in Git and its media
in storage, and how a search finds a shot by what's in it.

## A project is a Git repository

Every raea project is an ordinary Git repository. Its compositions, scripts, briefs and chats are files in Git, with
Git's history and branches. If you ever leave raea, you leave with a plain repository that any Git tool can open.

## Big files go to storage

Media is different. Footage, sound and models are too big for Git, so raea keeps each one in the repository as a small
pointer file, in the same format Git LFS uses. The pointer names the file's hash, and the bytes live in raea's storage
under that hash. So a file used in two projects, two versions or two forks is stored only once.

## raea speaks Git LFS

raea's server answers Git LFS's own requests. Your computer sends a list of hashes, and gets back a signed address for
each one, so media moves straight between your computer and storage. Plain git and Git LFS work against it too, so a
project you push to GitHub still finds its media.

## Without the rough edges

You never track files by hand. raea decides what's media when it commits, by its size and its type. Media downloads only
when something opens it, and opening a composition fetches exactly the files it uses. One local cache serves every
project, and every download is checked against its hash.

## Search by meaning

Libraries make your media searchable by what's in it, not only by its name. When a file is added, a computer that can
read it indexes it. It cuts video into shots, makes thumbnails, transcribes speech, and reads any text in the frame.
Then an embedding model turns each shot's picture, sound and words into vectors, all in one shared space.

## How a search runs

When you search, your words become a vector in that same space. raea compares it with every shot's picture, sound and
words, matches your words as keywords too, and ranks the results together. So a chip pulled apart, with cheese stretching between the halves, finds that
shot, even if no file is named that. The vectors are kept in turbopuffer, a vector database, one namespace for each
workspace, while the indexing runs on your own computers.

## Free, Pro and Team

On Free, your libraries and their index stay on your computer. On Pro and Team, each library can stay there too, or
live in raea's cloud, where you can search it on raea.io and from any device, and share its files for review.

That's the last tutorial. The rest of the docs go deeper: [How an agent should use raea](../start/agents.md) for the
loop, the [storage and search API](../guides/api.md), and the [CLI](../reference/cli/index.md) and
[SDK](../reference/sdk/index.md) references.
