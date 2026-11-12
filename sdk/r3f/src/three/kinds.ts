// Every kind of part raea's SDK renders (a `data-3d` element) and what three.js does with it: the coverage of raea's
// 3D in three.js and React Three Fiber, one row a kind. test/coverage.test.ts reads the SDK's sources for every kind it
// can render and fails when one is missing here, so a kind added to raea is a decision made here too.
//   drawn      three.js draws it as raea's engine does (same shape, surface, light units, transform)
//   near       drawn by the nearest thing three.js has; `note` says what differs
//   setting    a setting of the renderer or the scene, not an object (tone mapping, shadows, fog)
//   effect     a frame effect, drawn by effects.ts with three's EffectComposer (<Raea> runs it; a three app calls
//              Effects.set and render); `note` says where it differs from raea's engine
//   engine     Bevy's own (a component, a resource, a WESL shader, a compute pass, raymarched fog): GPU code and ECS
//              data that three.js has no counterpart for. On the web, raea-web (engine/web, @raea/web) runs raea's own
//              engine in the page on WebGPU, the same rows and passes (docs/web-export.md says what stays native)
export type Status = "drawn" | "near" | "setting" | "effect" | "engine";

export const KINDS: Record<string, { status: Status; three: string; note?: string }> = {
  Canvas3D: { status: "drawn", three: "the Scene the parts hang from" },
  Group: { status: "drawn", three: "Group" },
  Entity: { status: "drawn", three: "Group (an ECS entity's transform); a Gizmo component in it is drawn as lines" },
  Mesh: { status: "drawn", three: "Mesh, or InstancedMesh when it has `at`; shadow=\"catch\" a ShadowMaterial in its material's colour and opacity" },
  Box: { status: "drawn", three: "three's BoxGeometry with the same args (the same surface; three's own segment counts)" },
  Sphere: { status: "drawn", three: "three's SphereGeometry with the same args (the same surface; three's own segment counts)" },
  Plane: { status: "drawn", three: "three's PlaneGeometry with the same args (the same surface; three's own segment counts)" },
  Cylinder: { status: "drawn", three: "three's CylinderGeometry with the same args (the same surface; three's own segment counts)" },
  Cone: { status: "drawn", three: "three's ConeGeometry with the same args (the same surface; three's own segment counts)" },
  Torus: { status: "drawn", three: "three's TorusGeometry with the same args (the same surface; three's own segment counts)" },
  Capsule: { status: "drawn", three: "three's CapsuleGeometry with the same args (the same surface; three's own segment counts)" },
  BufferMesh: { status: "drawn", three: "BufferGeometry from its arrays" },
  Text3D: { status: "drawn", three: "the shape module's text3d triangles (raea's own glyphs)" },
  MeshStandardMaterial: { status: "drawn", three: "MeshStandardMaterial (maps, alpha modes, sides, uv transform, samplers)" },
  MeshPhysicalMaterial: { status: "drawn", three: "MeshPhysicalMaterial (clearcoat, transmission, ior, thickness, attenuation, anisotropy, specular)" },
  MeshBasicMaterial: { status: "drawn", three: "MeshBasicMaterial" },
  ThreeShaderMaterial: { status: "drawn", three: "three's own ShaderMaterial from its GLSL, uniforms and samplers set each frame (a node material's WGSL is raea's engine's, drawn in its colour)", note: "it came from three.js (a ShaderMaterial's GLSL or a node material's WGSL); exported back to three.js, the original material is the one to keep" },
  MeshToonMaterial: { status: "near", three: "MeshToonMaterial with a gradient of its steps or bands", note: "raea's rim, highlight and ink outline are its own shader's: three's toon shades the bands only" },
  PerspectiveCamera: { status: "drawn", three: "PerspectiveCamera, or OrthographicCamera when `ortho`" },
  AmbientLight: { status: "drawn", three: "AmbientLight (units.ts)" },
  DirectionalLight: { status: "drawn", three: "DirectionalLight with its target and shadow (units.ts)" },
  PointLight: { status: "drawn", three: "PointLight (units.ts)" },
  SpotLight: { status: "drawn", three: "SpotLight with its target (units.ts)" },
  RectAreaLight: { status: "drawn", three: "RectAreaLight facing its target (units.ts; RectAreaLightUniformsLib)" },
  Environment: { status: "drawn", three: "the panorama as scene.environment (and background), RGBE/EXR/picture loaders" },
  Model: { status: "drawn", three: "GLTFLoader's scene: its clip at `time` (or blended `animations`), morphs, hidden nodes, re-covered materials, a copy for each placement in `at`", note: "a cloth bake, `attach`, `bones` and an authored `graph` are raea's engine's" },
  Refinish: { status: "drawn", three: "the models inside it re-covered (MeshStandardMaterial props on each glTF material)" },
  ImagePlane: { status: "drawn", three: "a plane with the picture (grid cells, cutout)" },
  Fog: { status: "setting", three: "scene.fog: Fog (near, far) or FogExp2 (density)" },
  ToneMapping: { status: "setting", three: "renderer.toneMapping and toneMappingExposure (ACES at 0.6: three's ACES scales by 1/0.6, Bevy's doesn't); tony, raea's default, is Bevy's TonyMcMapface table drawn by the composer (effects.ts), AgX for a renderer drawing without it" },
  Shadows: { status: "setting", three: "renderer.shadowMap on, the sun's map size" },
  AntiAliasing: { status: "setting", three: "a WebGLRenderer's antialias is fixed when made: the app's <Canvas gl={{ antialias }}>" },
  Atmosphere: { status: "near", three: "three's Sky (Preetham) lit by the first DirectionalLight", note: "Bevy's atmosphere is a physically based scattering model; Sky is the analytic one" },
  Decal: { status: "near", three: "a quad at its place facing out of the surface, polygon-offset", note: "raea projects it onto whatever it covers; the quad lies flat" },
  Sprite: { status: "near", three: "a quad in the scene facing the camera, its size in pixels at the camera's distance", note: "raea draws it in 2D over the 3D" },
  Shape2D: { status: "near", three: "a flat shape facing the camera", note: "raea draws it in 2D over the 3D" },
  RichText: { status: "near", three: "text drawn to a canvas on a plane", note: "raea lays text out with its own fonts and shapes" },
  Plate: { status: "near", three: "a video texture on a plane behind the scene", note: "raea composites a plate under the 3D in linear light" },
  Screen: { status: "near", three: "a plane where its page is shown", note: "raea renders the page into the texture each frame; three shows the plane in the page's background colour" },
  Fire: { status: "near", three: "additive flame sprites rising and flickering by `time`", note: "raea's fire is a raymarched volume" },
  Grass: { status: "near", three: "its blades as one instanced mesh", note: "raea's wind sway and LOD are its shader's" },
  Splat: { status: "near", three: "the splats' centres as coloured points (.ply)", note: "three.js core has no gaussian splatting" },
  Bloom: { status: "effect", three: "UnrealBloomPass mixed energy-conserving as Bevy's (the frame kept 1 - k, k of its blur; raea's 1 is Bevy's 0.15), threshold", note: "three's blur is its own mip chain, so a halo's shape differs; skip and passes aren't drawn" },
  DepthOfField: { status: "effect", three: "BokehPass focused at the camera's focus, its f-number as the aperture, maxBlur in pixels", note: "three's bokeh is a single gather; the gaussian mode draws as bokeh" },
  Outline: { status: "effect", three: "OutlinePass round every mesh in its colour and width", note: "three's outline is a silhouette round objects, not raea's depth-step and crease lines; depth, normal and far aren't read" },
  Grade: { status: "effect", three: "Bevy's grade ported: fringes and vignette, white balance, saturation, contrast, gain, lift and gamma per level of light before tone mapping, saturation after", note: "white balance is a channel scale where Bevy's is a CIE matrix; skip and passes aren't drawn" },
  Look: { status: "effect", three: "a look pass: pixel, site and ink as raea draws them (cells, Bayer dither, ink lines); paint and cartoon as flat bands", note: "paint and cartoon's lit bands, ragged edges and grain are raea's material shader" },
  MotionBlur: { status: "effect", three: "AfterimagePass, its shutter angle as the trail", note: "a trail of the frames drawn before, not each part's velocity: it holds only while frames play in order" },
  Fisheye: { status: "effect", three: "a lens pass: equidistant or stereographic to its fov, strength, zoom, edges" },
  LensDistortion: { status: "effect", three: "a lens pass: Brown-Conrady k1, k2, zoom, edges" },
  AmbientOcclusion: { status: "effect", three: "GTAOPass, its quality as samples and thickness as the radius", note: "it darkens all light, where Bevy's darkens only ambient and environment light" },
  VolumetricFog: { status: "engine", three: "the scene's distance fog stays; light shafts are raymarched in Bevy" },
  FogVolume: { status: "engine", three: "not drawn: a volume of fog lit by the lights through it, raymarched in Bevy" },
  FramePass: { status: "engine", three: "a WESL frame pass runs in Bevy" },
  SurfaceShader: { status: "engine", three: "WESL runs in Bevy; the mesh keeps its material's colour" },
  Compute: { status: "engine", three: "a WGSL compute pass runs in Bevy" },
  BevyComponent: { status: "engine", three: "a Bevy component (a gizmo's is drawn as lines)" },
  BevyResource: { status: "engine", three: "a Bevy resource" },
  Skybox: { status: "engine", three: "not drawn: Bevy's cubemap sky, a .ktx2 (rgb9e5, zstd) three's KTX2Loader doesn't read", note: "an <Environment background> is the sky three draws" },
  Lightmap: { status: "engine", three: "not drawn: a light bake on a Model's meshes, a .ktx2 sampled by their second UVs", note: "three's lightMap on uv1 could draw a PNG bake; raea's are .ktx2" },
  Entities: { status: "drawn", three: "a mesh per Mesh entity of World.scene() (its shape, a standard surface of its colour, roughness and metalness, world space), as the engine reads it" },
};

/** the geometry kinds, each a primitive three.js has too */
export const PRIMITIVES = ["Box", "Sphere", "Plane", "Cylinder", "Cone", "Torus", "Capsule", "Circle", "Ring"];
