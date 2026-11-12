# 3D and games with Bevy, in Bevy's names

You write 3D the way you write the rest of a composition: TSX components whose props are worked out from the frame.
raea's engine turns them into Bevy entities (meshes, lights, cameras, glTF models, post-processing) and draws them
under the page, so 2D parts (titles, captions, a score) sit over the 3D in the same composition. You never write Rust
or a render loop. Bevy's own components (`<BevyComponent>`, `raea/bevy-own`) and a shader of your own
(`<ShaderMesh>`) are there for what the components here don't reach (`bevy/limits`).

A render and a live play of the same file draw the same rows with the same code, so what you check in a render is what
plays. That holds only if every value comes from the frame (the rules below).

## Which file to read

Read one or two at a time with `raea guide bevy/NAME`, when the task reaches them. Two or three files cover most
pieces; then write the file. Each file's example is a complete composition you can start from.

| You are... | Read |
|---|---|
| setting up a scene: the Canvas3D, the camera, camera moves, groups, 2D over 3D | `bevy/scene` |
| lighting: sun, bulbs, spots, ambient, shadows, how bright | `bevy/lights` |
| surfaces: colour, metal, glass, glow, clearcoat, pictures on surfaces, toon (cel) shading and ink outlines, decals (labels, stains, tiles), a model's materials repainted | `bevy/materials` |
| people: bodies posed by goals (a hand on the mouse, sat, looking at the screen), motion capture, walking round the furniture to a spot | `bevy/characters` |
| interiors: rooms, cabinets along walls, windows and bays, chairs turned to tables, layout checks, wall decor, the garden outside, daylight, sounds placed in the scene | `bevy/rooms` |
| a whole scene to build and make believable: the brief, which tool makes which object, build order, review sheets, the judge, when to stop | `bevy/scenes` |
| the words to paste for a whole scene: the brief template, the builder prompt, the judge prompt | `bevy/prompts` |
| a Godot project: its scenes and resources scripted from TypeScript, run headless, recorded as frames to use as footage | `bevy/godot` |
| shapes: boxes to modelled solids, blended organic bodies (`sdf`), trees, terrain, rocks and plants (`grow`), 3D letters | `bevy/meshes` |
| moving things: spins, springs, reveals, things arriving later, model clips | `bevy/animation` |
| a 3D game: state, input, many entities, collisions, state machines | `bevy/games` |
| glTF models, pictures in space, where files go | `bevy/assets` |
| an asset to fix in Blender first (scale, pivot, heavy mesh, FBX/OBJ, rig, bake); never a whole scene | `bevy/blender` |
| a real scene or object from footage as gaussian splats, and animating them (assemble, disperse, morph...) | `bevy/splats` |
| liquids and goo: coffee dumped from a mug, a tap's stream, honey, things melting | `bevy/liquids` |
| water: seas, lakes and pools; waves, reflection, refraction, absorption, caustics, foam | `bevy/water` |
| ray-traced light (Solari): what it lights and traces, glowing lamps, rooms that don't leak, cuts, metering | `bevy/solari` |
| bloom, fog, tone mapping, exposure, fisheye and lens distortion, motion blur | `bevy/post` |
| how much the scene can hold, what isn't there yet | `bevy/limits` |

## What exists

Bevy's names, with Bevy's fields and units: `Camera3d {transform, projection}` (`raea/camera`), `Transform`
and `Quat` (`raea/transform`: `Transform.fromXyz(0, 2, 7).lookingAt([0, 0.5, 0])`), `Mesh3d {name, transform}`
holding one shape (`Cuboid`, `Sphere`, `Plane3d`, `Cylinder`, `Cone`, `Torus`, `Capsule3d`: `raea/mesh`; `Text3D`, or
`shape={manifold...}`) and one material (`StandardMaterial` with `base_color`, `perceptual_roughness`, `metallic`,
`emissive`, `unlit`, clearcoat and transmission as its fields; `ToonMaterial` for cel shading and ink outlines;
`ExtendedMaterial` for a shader of your own: `raea/pbr`), `Entity {transform}` to group parts, the lights in lux and lumens
(`DirectionalLight {illuminance}`, `PointLight`, `SpotLight`, `RectLight {intensity}`, `AmbientLight {brightness}`,
and `light_consts` for Bevy's named values: `raea/light`), `Model {src, animation, time}`, `ImagePlane {src, width}`,
`Decal {src, size, normal}`, `Refinish {materials}`, `Bloom`, `Fog`, `ToneMapping`, and the ECS world (`raea/ecs`)
drawn with `<Entities>`. `Canvas3D` (`raea/3d`) holds the 3D under the page; `staticFile`, `useCurrentFrame` and
the rest come from `raea`.

## The rules that keep a render equal to its play

1. **Every value from the frame.** Positions, angles, colours and intensities come from `useCurrentFrame()` (through
   `interpolate`, `spring` or plain arithmetic) or from a game's state at the frame. No `useState`, `useEffect`,
   `useRef` or `useFrame` mutation: there is no render loop to mutate in. `Math.random()` is seeded for each frame, so
   it draws new numbers every frame: seed a scatter or anything that holds still from an index. `Date` is the frame's
   time.
2. **Radians and quaternions for rotation**: a Transform turns by `Quat.fromRotationY(Math.PI / 4)` or
   `.lookingAt(...)`, never degrees; a Model and an ImagePlane take radians. Manifold's `.rotate()` is the one place
   that takes degrees.
3. **Colours are hex** (`"#ff7a00"`), from the brand kit in a branded piece. CSS variables don't reach the 3D.
4. **Name what comes and goes.** Parts are matched across frames by `name`, else by kind and shape in tree order.
   A Mesh that appears, disappears or swaps places with one of the same shape needs a `name`.
5. **A shape is fixed for the life of a part.** Animate position, rotation, scale, colour, opacity, glow,
   roughness and metalness; don't change `args` or `shape` frame to frame (that's a new part each frame).
6. **One camera a frame; each frame's own effects.** The first active camera in the tree is the piece's: give each
   shot its own `<Camera3d>` and switch them with `is_active={...}`, so a cut between cameras is one render, not one
   render a camera joined after (the frame another camera becomes active is drawn as a shot rendered alone starts,
   with no motion blur from the other camera's frame). The effects (the sky, Bloom, Fog, Grade, ToneMapping, Shadows
   and the rest) and each light's colour, shadows and shafts take each frame's values, so shots with different looks
   are one composition and one render too; the lens (Fisheye, LensDistortion) and MotionBlur animate per frame.
7. **Import what you use.** Every component in the scene comes from its module in the import line (`Camera3d`
   from `raea/camera`, `Mesh3d` and `Cuboid` from `raea/mesh`, `StandardMaterial` from `raea/pbr`, the lights from
   `raea/light`, `Transform` from `raea/transform`, `Canvas3D`, `Bloom` and the rest from `raea/3d`); a missing one
   fails the render. `staticFile`, `Sequence`, `spring` and the
   hooks come from `raea`.
8. **Render and look.** Render stills where things happen (`raea render edit.tsx --at A,B,C -o stills/`) and look at them. A 3D frame that renders
   black usually has no light or a camera inside or behind the subject.
