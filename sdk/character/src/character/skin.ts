// Skin, shaded as skin (<Character skin> puts it on a body's "skin" material, the name projects/psx gives it). Real-time
// skin as games do it, in the material's two hooks (docs/shaders.feature SH1), with no pass of its own:
//   surface  the photo's own surface detail (psx fit.py's skin_detail.png, from Marigold's normals of the photo: its
//            folds and the nose's and lips' shape finer than the mesh), against a frame made from the screen's
//            derivatives; then the skin's fine relief and pores from a photograph of real skin (psx skintile.py's
//            skin_micro.png, from a CC0 macro photo; 11-05, replacing pores drawn here as noise), tiled about 25 mm
//            across. It fades out as it shrinks below a pixel, so a wide shot shows smooth skin rather than shimmering
//            grain, and the skin goes a little rougher as it does (the shine it broke up spreads: Activision's
//            "Next-Gen Character Rendering", GDC 2013). How strongly it shows by region comes from the body's
//            skin_mask.png (psx fit.py: none on the lips). The same tile's height shades the colour, a crease or pore
//            darker, as the photo's colour is a blur up close.
//   lit      light scattered under the skin: each directional light's diffuse redone with a softer falloff, wider for
//            red than green, wider than blue, and with red shaded from the mesh's smooth normal rather than the fine relief's
//            (pre-integrated skin, Penner and Borshukov, GPU Pro 2, 2011, without its lookup table: a wrap per channel),
//            and red reaching further into a
//            shadow's soft edge. It adds the difference to Bevy's own diffuse, light by light, under the same shadow.
// The second, tighter shine of oily skin is the material's clearcoat (Bevy's own layer), set by <Character skin>.
export const SKIN_WESL = /* wgsl */ `
// a data texture's stored value: raea's shader textures load as sRGB colour images (no way yet to load one linear),
// so the GPU decoded the map's bytes as colour; encoded again here (unencoded, a flat 0.5 read as 0.21 and tilted
// every pixel along its triangle's own frame: faint facets over the face)
fn skin_stored(c: vec3<f32>) -> vec3<f32> {
  return select(1.055 * pow(c, vec3<f32>(1.0 / 2.4)) - 0.055, c * 12.92, c <= vec3<f32>(0.0031308));
}

fn surface(in: VertexOutput, pbr: ptr<function, PbrInput>) {
@if(SKIN_MASK)
  let mk = skin_stored(textureSample(tex_mask, samp_mask, in.uv).rgb);
@else
  let mk = vec3<f32>(1.0, 0.0, 0.0);
  // the texture's scale here against MakeHuman's layout (skin_mask.png's green, over 8: psx gives the face's island half
  // the texture), so the tile keeps its size on the skin; 0 (older bodies) is 1
  let uvs = select(mk.g * 8.0, 1.0, mk.g < 0.01);
  let p = in.uv * u_micro().x / uvs;                   // the tile's coordinates (unwrapped)
  // (derivatives first, in uniform control flow)
  let dp1 = dpdx(in.world_position.xyz);
  let dp2 = dpdy(in.world_position.xyz);
  let duv1 = dpdx(in.uv);
  let duv2 = dpdy(in.uv);
  let dq1 = dpdx(p);
  let dq2 = dpdy(p);
  let across = length(fwidth(p)) * u_micro().z;        // the tile's features per pixel
  let fade = 1.0 - smoothstep(u_fade().x, u_fade().y, across);
  let strength = mk.r;
@if(SKIN_DETAIL)
  let dtex = skin_stored(textureSample(tex_detail, samp_detail, in.uv).rgb) * 2.0 - 1.0;
  // (the shader's textures share one sampler, which clamps: the tile wraps by fract, its mip level kept from the
  // unwrapped coordinates' derivatives, so no seam line where it wraps)
@if(SKIN_MICRO)
  let msamp = textureSampleGrad(tex_micro, samp_micro, fract(p), dq1, dq2);
  let mtex = skin_stored(msamp.rgb) * 2.0 - 1.0;
  let grain = msamp.a * 2.0 - 1.0;                      // (alpha is never colour-decoded)
  var N = normalize((*pbr).N);
  // the directions in which u and v grow on the surface (Schuler, "Normal Mapping Without Precomputed Tangents"),
  // signed by the screen's handedness: his frame is GLSL's, whose y runs up the screen; WGSL's dpdy runs down, which
  // turned the old procedural pores inside out (dimples drawn as bumps) until the sign was taken from the derivatives
  let dp2perp = cross(dp2, N);
  let dp1perp = cross(N, dp1);
  let hand = select(-1.0, 1.0, dot(cross(dp1, dp2), N) >= 0.0);
  let T = (dp2perp * duv1.x + dp1perp * duv2.x) * hand;
  let B = (dp2perp * duv1.y + dp1perp * duv2.y) * hand;
  let Tu = T * inverseSqrt(max(dot(T, T), 1e-20));
  let Bu = B * inverseSqrt(max(dot(B, B), 1e-20));
@if(SKIN_DETAIL)
  {
    // the photo's surface detail (psx fit.py's skin_detail.png): a normal against this same frame
    N = normalize(u_detail() * (dtex.x * Tu + dtex.y * Bu) + dtex.z * N);
  }
@if(SKIN_MICRO)
  {
    // the skin's fine relief, from a photograph of real skin (psx skintile.py's skin_micro.png), tiled, by region,
    // and gone as it shrinks below a pixel; the skin a little rougher as it goes (the shine it broke up spreads)
    let k = u_micro().y * strength * fade;
    N = normalize(N + k * (mtex.x * Tu + mtex.y * Bu));
    // and its colour: darker in the creases and pores, green and blue more than red (the blood under them shows: a
    // grey darkening read as dust), as the photo's colour is a blur up close
    (*pbr).material.base_color = vec4<f32>((*pbr).material.base_color.rgb * (1.0 + u_grain() * grain * strength * fade * vec3<f32>(0.55, 1.0, 1.15)), (*pbr).material.base_color.a);
    (*pbr).material.perceptual_roughness = clamp((*pbr).material.perceptual_roughness + u_fade().z * (1.0 - fade) * strength, 0.0, 1.0);
  }
  (*pbr).N = N;
}

fn lit(in: VertexOutput, pbr: PbrInput, color: vec4<f32>) -> vec4<f32> {
  let Nd = normalize(pbr.N);              // the fine relief's normal: blue's, and Bevy's own diffuse
  let Ns = normalize(pbr.world_normal);   // the mesh's smooth one: red's mostly
  let lights = &bevy_pbr::render::mesh_view_bindings::lights;
  let n = (*lights).n_directional_lights;
  if (n == 0u) { return color; }
  let base = pbr.material.base_color.rgb * (1.0 - pbr.material.metallic) * (1.0 - pbr.material.diffuse_transmission);
  // (one width everywhere: widened by the curvature fwidth measured, it changed from triangle to triangle, the normal's
  // derivative being constant across each, and drew the head's facets as bands of orange at the light's edge)
  let w = u_scatter();
  let Nr = normalize(mix(Nd, Ns, u_soft().x));
  let Ng = normalize(mix(Nd, Ns, u_soft().y));
  let Nb = normalize(mix(Nd, Ns, u_soft().z));
  let view_z = dot(vec4<f32>(view.view_from_world[0].z, view.view_from_world[1].z, view.view_from_world[2].z, view.view_from_world[3].z), pbr.world_position);
  var add = vec3<f32>(0.0);
  for (var i = 0u; i < n; i++) {
    let light = &(*lights).directional_lights[i];
    let L = (*light).direction_to_light.xyz;
    var shadow = 1.0;
    if (((*light).flags & bevy_pbr::render::mesh_view_types::DIRECTIONAL_LIGHT_FLAGS_SHADOWS_ENABLED_BIT) != 0u) {
      shadow = bevy_pbr::render::shadows::fetch_directional_shadow(i, pbr.world_position, Ns, view_z, pbr.frag_coord.xy);
    }
    let nl = vec3<f32>(dot(Nr, L), dot(Ng, L), dot(Nb, L));
    // the plain falloff plus a band of scattered light round the light's edge, w wide for each colour: smooth on both
    // sides (a wrap that ended where the shadow map took over drew a hard red line down the cheek), shorter into the
    // dark side than the lit, and no brighter where the face is fully lit
    let t = clamp(abs(nl) / max(w, vec3<f32>(1e-3)), vec3<f32>(0.0), vec3<f32>(1.0));
    let side = select(vec3<f32>(1.0), vec3<f32>(0.6), nl < vec3<f32>(0.0));
    let band = w * u_band() * (1.0 - t) * (1.0 - t) * side;
    let skin = max(nl, vec3<f32>(0.0)) + band;
    // a soft shadow's edge reaches further for red: the light that went in on the lit side comes out in the shade
    let sh = pow(vec3<f32>(shadow), u_shadow());
    let bevy = max(dot(Nd, L), 0.0) * shadow;
    add += base * (skin * sh - vec3<f32>(bevy)) * (*light).color.rgb;
  }
  // (Bevy's Burley diffuse is about 1/pi of the light; exposure as Bevy applies it)
  return vec4<f32>(color.rgb + max(add * (0.31830988 * view.exposure), vec3<f32>(-color.rgb)), color.a);
}
`;

/** the skin look's settings. micro: the fine relief tile (skin_micro.png) [repeats per UV unit (psx bodies: about 1.2 m
 * of face to a unit, so 46 is the tile's 25 mm), how far it tilts the normal, its features across the tile (for the
 * fade)]; detail: how strongly the photo's surface detail (skin_detail.png) tilts the normal (1 as baked; 0.3, as at full strength its
 * soft folds caught the light in streaks and the face looked fried); fade: [the
 * relief's features per pixel where it starts to fade, where it's gone, the roughness added as it goes]; scatter: how
 * far each of red, green and blue wraps past the light's edge; soft: how much of the mesh's smooth normal each of red,
 * green and blue is shaded from (1 all, 0 the fine relief's); shadow: each colour's falloff into a soft shadow's edge
 * (below 1 reaches further); grain: how much the fine relief's height (skin_micro.png's alpha) shades the colour, a
 * crease or pore darker */
export interface SkinLook { micro: [number, number, number]; detail: number; fade: [number, number, number]; scatter: [number, number, number]; band: number; soft: [number, number, number]; shadow: [number, number, number]; grain: number }
export const SKIN_LOOK: SkinLook = { micro: [46, 0.5, 40], detail: 0.3, fade: [0.2, 0.55, 0.06], scatter: [0.35, 0.14, 0.07], band: 0.18, soft: [0.85, 0.45, 0.1], shadow: [0.9, 0.97, 1.0], grain: 0.4 };

/** the skin's material settings beside the shader: the second shine (clearcoat, smooth, over the fine relief's base layer),
 * the base layer's reflectance (skin's F0 about 0.028) */
export interface SkinSurface { clearcoat: number; clearcoatRoughness: number; reflectance: number }
export const SKIN_SURFACE: SkinSurface = { clearcoat: 0.15, clearcoatRoughness: 0.32, reflectance: 0.4 };
