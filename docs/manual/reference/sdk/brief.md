---
title: "raea/brief"
summary: "The specs an agent writes as data: brief, script, taste, plan and controller, checked against raea's schemas."
order: 4
sources: ["sdk/raea/src/brief.ts", "core/brief/src"]
---

A spec is a TypeScript module whose default export is data: what a project is for (`brief`), a storyboard
(`script`), the person's or the house's taste (`taste`), a frozen plan for a build (`plan`) and a workspace's settings
(`controller`). It renders nothing and imports nothing that renders. The types are generated from the Rust schemas
raea reads them with, so what TypeScript accepts is what raea accepts; [`raea spec`](../cli/spec.md) prints one as
checked JSON.

```ts
// brief.ts
import { brief } from "raea/brief";

export default brief({
  title: "Spring launch",
  for: "Acme Running",
  audience: "runners who already own our shoes, on their phones",
  believe: "the new sole makes an easy run feel easier",
  mode: ["pitch"],
  deliver: [{ name: "launch-9x16", specs: ["30 s", "9:16", "with sound"] }],
});
```

See [Workspaces and projects](../../concepts/workspaces.md) for where each spec lives.

<!-- generated:begin by tools/manual-ref/sdk.ts from the SDK's exports and doc comments; edit outside this block -->

```ts
import { brief, controller, plan, script } from "raea/brief"
```

`raea/brief` exports 5 functions, 28 types. Source: [sdk/raea/src/brief.ts](https://github.com/shinyobjectz/raea/blob/main/sdk/raea/src/brief.ts).

## Functions

### `brief`

A project's brief (brief.ts): what to make, for whom, the one thing to believe, its deliverables and staged tasks.

```ts
function brief(b: Brief): Brief
```

### `controller`

A workspace's controller (controllers/<id>.ts): settings in groups of typed fields that every agent works to.
A standing decision ("every ad is 9:16"), not one piece of work: that's a feed item, and a note on it. The raea app
shows a new controller in the project's feed, and an agent brings one to the person with `controller_post`.

```ts
function controller(c: ControllerInput): ControllerInput
```

### `plan`

An object's plan (plan.ts): its parts by name, levels, counts, materials.

```ts
function plan(p: Plan): Plan
```

### `script`

A storyboard or a screenplay (script.ts): scenes, beats, lines, camera and cut.

```ts
function script(s: Script): Script
```

### `taste`

Taste (taste.ts): standing rules, some with a check `raea check --taste` holds every export to.

```ts
function taste(t: Taste): Taste
```

## Types

### `Agent`

```ts
type Agent = { name: string, role?: string, }
```

### `Beat`

```ts
type Beat = { /** * what's seen (a screenplay's action) */ onScreen: string, /** * the move ("push in on the knife", "orbit left, keeps moving through the cut") */ camera?: string, /** * how this beat is cut into ("match on motion", "hard cut") */ cut?: string, lines?: Array<Line>, /** * sound and music cues…
```

### `Brief`

```ts
type Brief = { title: string, logline?: string, /** * who the work is for (a person or a client) */ for?: string, /** * YYYY-MM-DD */ due?: string, /** * who watches or plays it, and where */ audience?: string, /** * the one thing they should think afterwards */ believe?: string, /** * pitch, explain, story, …
```

### `Check`

```ts
type Check = { "form": "text-hold", "value": number } | { "form": "text-above", "value": number } | { "form": "text-below", "value": number } | { "form": "text-margin", "value": number } | { "form": "loudness", "value": number } | { "form": "still-max", "value": number }
```

### `Concept`

```ts
type Concept = { /** * what it is ("flight feather", "toy rocking horse") */ what: string, style: string, /** * its largest extent, in metres */ size: number, /** * how close it's seen, in metres: sets how much detail up close must hold */ seenFrom: number, material?: string, use?: string, }
```

### `Controller`

```ts
type Controller = { id: string, title: string, help?: string, groups: Array<Group>, }
```

### `ControllerInput`

A controller as written: ids are filled in from titles and labels when left out.

```ts
type ControllerInput = Omit<Controller, "id" | "groups"> & { id?: string; groups: (Omit<Group, "id" | "fields"> & { id?: string; fields: FieldInput[] })[]; }
```

### `Count`

```ts
type Count = number | { min: number, max: number, }
```

### `Deliverable`

```ts
type Deliverable = { name: string, /** * "90 s", "16:9", "with sound" */ specs?: Array<string>, /** * the feed item it lands as */ item?: string, /** * its own brief module, when it differs from the project in mode, look or audience */ brief?: string, /** * its script module (storyboard or screenplay) */ script?: s…
```

### `Field`

```ts
type Field = { id: string, label: string, help?: string, } & ({ "type": "toggle", value: boolean, } | { "type": "choice", options: Array<string>, value: string, } | { "type": "number", value: number, unit?: string, min?: number, max?: number, step?: number, } | { "type": "text", value: string, placeholder?: s…
```

### `FieldInput`

A field as written: its id is filled in from its label when left out.

```ts
type FieldInput = Field extends infer F ? (F extends Field ? Omit<F, "id"> & { id?: string } : never) : never
```

### `Group`

```ts
type Group = { id: string, title: string, help?: string, fields: Array<Field>, }
```

### `Kind`

```ts
type Kind = { "type": "toggle", value: boolean, } | { "type": "choice", options: Array<string>, value: string, } | { "type": "number", value: number, unit?: string, min?: number, max?: number, step?: number, } | { "type": "text", value: string, placeholder?: string, multiline?: boolean, } | { "type": "list",…
```

### `Level`

```ts
type Level = "primary" | "secondary" | "tertiary"
```

### `Line`

```ts
type Line = { /** * a character, or "narrator" */ who: string, says: string, /** * a screenplay's parenthetical ("quietly") */ how?: string, }
```

### `Mark`

```ts
type Mark = "todo" | "done" | "dropped"
```

### `Part`

```ts
type Part = { /** * the label it carries into the world ("seat", "leaf", "gem") */ role: string, level: Level, /** * the part it sits on or in; none for the root */ parent?: string, count?: Count, /** * its own, else its parent's, else the concept's */ material?: string, style?: string, /** * what a near cro…
```

### `Plan`

```ts
type Plan = { concept: Concept, /** * by name; the build's parts are typed from these keys, so a planned part the build skips is a tsc error */ parts: { [key in string]: Part }, }
```

### `Reference`

```ts
type Reference = { target: string, note?: string, }
```

### `Rule`

```ts
type Rule = { text: string, check?: Check, }
```

### `Scene`

```ts
type Scene = { /** * where and when ("INT. SENATE - NIGHT", or "The brief page") */ heading?: string, beats: Array<Beat>, /** * what the scene must land */ payoff?: string, }
```

### `Script`

```ts
type Script = { title: string, logline?: string, scenes: Array<Scene>, }
```

### `Section`

```ts
type Section = { heading: string, text: string, }
```

### `Stage`

```ts
type Stage = { name: string, tasks: Array<Task>, }
```

### `Step`

```ts
type Step = { name: string, by?: string, back?: string, }
```

### `Task`

```ts
type Task = { text: string, /** * a task linked to an item takes the item's state (the work is the truth); this is for unlinked ones */ mark?: Mark, agents?: Array<string>, item?: string, tags?: Array<string>, due?: string, /** * the craft verb it was written as ("quieter"): agents read it, the page shows th…
```

### `Taste`

```ts
type Taste = { title: string, /** * when this file is read ("Read for pitch, explain and story") */ note?: string, for?: string, /** * the kinds of work with their own taste file (motion, games, sound, ui) */ kinds?: Array<string>, sections: Array<TasteSection>, }
```

### `TasteSection`

```ts
type TasteSection = { /** * "Always", "Never", "Camera" */ heading: string, rules: Array<Rule>, }
```

<!-- generated:end -->
