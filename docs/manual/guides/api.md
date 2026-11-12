---
title: "The storage, search and review API"
summary: "Who can call raea's API (anyone on Pro or Team, on their own or in a team), how an agent key is made and scoped, and the calls for cloud libraries, search by meaning, files and review links."
order: 5
sources: ["docs/libraries.feature", "docs/review.feature", "apps/site/api/src/agent-keys.ts", "apps/site/api/src/library/routes.ts", "apps/site/api/src/library/search.ts", "apps/site/api/src/storage.ts", "apps/site/api/src/review.ts"]
---

Your cloud libraries, their search and your review links are reachable over HTTP at `https://api.raea.io`, so an
agent, a script or your own tool can find a shot, fetch it, add files, and share them for review. The raea app uses
the same calls.

## Who can use it

Anyone on **Pro** or **Team** can, a person on their own included: there's no separate developer plan and no
per-call price. The API reaches what lives in raea's cloud, so it comes with the plans that have cloud storage.

On **Free**, libraries stay on your Mac, and so does their search. Search them from the app, or from a terminal or an
agent on the same Mac with [`raea library`](../reference/cli/library.md), which needs no key. Asking for an agent key
on Free answers `402 agent_keys_paid`.

## Make an agent key

On [raea.io/account](https://raea.io/account), open Storage, then Agent access. Name the key after the agent that will
use it, tick what it may do, and pick which libraries it reaches (all of them, or some). The key, `raea_ak_` and 64
hex characters, is shown once with a ready-made example: copy it then. raea keeps only its hash.

A key lasts 90 days unless you choose otherwise (365 at most), up to 50 at once. Revoking one stops it on its next
request. Every change made with a key goes in your storage log, with the key's name.

Send it as a bearer header on every call. Nothing else works with it: no cookie, no basic auth.

```sh
curl https://api.raea.io/v1/libraries -H "authorization: Bearer raea_ak_..."
```

## What a key may do

| Scope | Reaches |
| --- | --- |
| `files:read` | your libraries and their files, search, a file's download URL, storage used |
| `files:write` | uploads, naming files in a cloud library, tags, new libraries and cloud sources |
| `files:delete` | moving stored files to the trash, the trash, restoring from it |
| `share` | review links: making, changing and stopping them, their comments; a project's collaborators |

A key reaches only those. Billing, connections, publishing, your computers, devices, Git LFS and the keys themselves
answer `403 agent_scope`, whatever the key's scopes. A key limited to some libraries sees only their files (any other
is `404`) and the files it uploaded itself; making a library, the trash and collaborators need a key for all of them.

## Find your libraries

```sh
curl https://api.raea.io/v1/libraries -H "authorization: Bearer $RAEA_KEY"
```

Each library comes with its `id`, `name`, `workspace`, `sources` (each with its `kind`: a `folder` or `volume` on one of
your computers, `cloud`, or `drive` for Google Drive), and how many `files` it holds and has `indexed`. A library on
your Mac only isn't here: it never leaves the Mac.

List a library's files, 200 at a time (up to 500), each with its `path`, `sha256`, `kind` and thumbnail:

```sh
curl "https://api.raea.io/v1/libraries/lib_.../files?limit=200" -H "authorization: Bearer $RAEA_KEY"
```

Pass the last `path` you got as `after=` for the next page.

## Search

```sh
curl https://api.raea.io/v1/libraries/search \
  -H "authorization: Bearer $RAEA_KEY" -H "content-type: application/json" \
  -d '{"workspace": "<a library'\''s workspace>", "words": "a chip pulled apart, cheese stretching", "limit": 10}'
```

| Field | |
| --- | --- |
| `workspace` | required: the workspace the libraries are in, as the list names it |
| `words` | what you're looking for, as you'd describe it |
| `vector` | the words' embedding, to search by meaning (below) |
| `libraries` | a list: only these library ids |
| `kind` | a list of any of `video`, `image` and `audio` |
| `tags` | a list: only files with any of these tags |
| `path` | a glob over the files' paths, like `cuts/**` |
| `limit` | how many hits |
| `sound` | `true` to rank by how things sound, for a described sound effect |

Each hit is a moment: the file's `sha256`, the segment's `t0` and `t1` in seconds, a `score`, what `matched` (its
`picture`, `sound` or `words` by meaning, its `text` or `sound labels` by keyword), any `text` read or heard in it, its
`labels`, a `thumb_url`, and the `file` with every place it's kept. The answer's `by` says how it searched.

**By meaning, or by words.** With `vector`, raea compares it with every shot's picture, sound and words, and matches
your words as keywords too: `"by": "meaning"`. Without one, it searches by keywords alone: `"by": "words"`. The vector
is EmbeddingGemma 2's (`onnx-community/embeddinggemma-2-ONNX`, 768 numbers) for the text
`task: search result | query: ` followed by your words. raea never runs a model in its cloud for you: the app embeds
your words on your Mac, which is what `raea library search` and the app's Search do, and raea.io's Storage page
borrows one of your computers that's online.

## Get a file

```sh
curl https://api.raea.io/v1/storage/blobs/<sha256> -H "authorization: Bearer $RAEA_KEY"
```

The answer is a `url` good for an hour, and the file's `size`. Fetch the bytes from it directly. A file in a folder
on one of your computers is in storage only once something has uploaded it (sharing it does); until then the hit's
`file` says which computer has it.

## Add a file

Files go straight to storage, never through the API. Ask with the file's SHA-256 and size:

```sh
curl https://api.raea.io/v1/storage/uploads -H "authorization: Bearer $RAEA_KEY" \
  -H "content-type: application/json" -d '{"sha256": "<sha256>", "size": 1048576}'
```

The answer is `{"exists": true}` when raea has the file already, a `url` to `PUT` it to, or for a big file an
`upload_id` with a URL for each part. Then `POST /v1/storage/uploads/complete` with `{sha256, upload_id, parts}` (each
part's `n` and `etag`). An upload past your plan's storage is refused before it starts.

To put it in a cloud library, name it in one of the library's `cloud` sources:

```sh
curl https://api.raea.io/v1/libraries/sources/<source id>/files -H "authorization: Bearer $RAEA_KEY" \
  -H "content-type: application/json" \
  -d '{"upsert": [{"path": "cuts/teaser.mp4", "sha256": "<sha256>", "size": 1048576, "mtime": 1794400000000, "kind": "video"}]}'
```

raea doesn't index files on its own servers: one of your linked computers indexes it the next time it's online with
raea open, and then it turns up in search. The same call takes `rename:
[{from, to}]`, and `remove: [path]` with `files:delete`. Tags go on with `POST /v1/libraries/media/<sha256>/tags`
`{"tags": [...]}`.

## Delete, with a way back

`DELETE /v1/storage/blobs/<sha256>` moves a file to the trash. It's refused (`409 in_use`, saying where) while a
library still names it or a post is going out with it. `GET /v1/storage/trash` lists the trash, and
`POST /v1/storage/trash/<sha256>/restore` brings a file back. raea deletes it for good after 30 days, and only you, on
raea.io, can empty the trash sooner.

## Share for review

With the `share` scope, a key can send a stored file on a review link. Giving a key that scope is your say-so; Let
agents share, in the app's Settings, is the same choice for agents working inside the app.

```sh
curl https://api.raea.io/v1/review-links -H "authorization: Bearer $RAEA_KEY" \
  -H "content-type: application/json" \
  -d '{"sha256": "<sha256>", "type": "video/mp4", "title": "Teaser, cut 3", "days": 30}'
```

The answer has the link's `id` and its `url` (raea.io/r/...) to hand on. `days` is 1 to 365 (30 if left out),
`download` lets reviewers download the file, and `password` sets one. The file must be in your storage first:
`409 not_stored` says to upload it.

| Call | |
| --- | --- |
| `GET /v1/review-links` | every link, newest first |
| `GET /v1/review-links/<id>` | one link with its versions, comments and viewers |
| `POST /v1/review-links/<id>/versions` | `{sha256, type}`: the next version, on the same link |
| `POST /v1/review-links/<id>/comments` | `{body, version?, parent?}`: your answer to a reviewer |
| `PATCH /v1/review-links/<id>/comments/<comment id>` | `{"resolved": true}` |
| `PATCH /v1/review-links/<id>` | `{title?, days?, download?, password?}` |
| `DELETE /v1/review-links/<id>` | stop sharing: the link stops working for everyone at once |

A link of several files is made in the app for now (the Library's Share for review bar); a key can't make one yet.

## Errors

A missing, unknown, revoked or expired key gets a plain-text `401`. Every other refusal is JSON with an `error` code
and a `message` saying what to do: `402` for a plan without the feature, `403 agent_scope` for a call outside the key's scopes, `404` for
anything that isn't yours (raea never says whether it exists), `409` for a conflict, and `413` when storage or the
search index is full.
