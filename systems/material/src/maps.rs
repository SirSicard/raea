use super::*;
use std::path::Path;
use raea_core_program::eval::Tup;
use bevy::render::render_resource::TextureFormat;

/// A material's maps, made once per load (file or data: URL, colour or data, clamped or repeating): a floor of tiles
/// and its plinths share one texture each. Cleared at each load, so a reload frees the last one's.
#[derive(Resource, Default)]
pub struct Maps(pub HashMap<String, Handle<Image>>);

/// An image a texture source names instead of a file, by whoever draws it (raea-sys-screen's named_image: a UiTexture's
/// `raea-screen:name@WxH`, render_ui_to_texture); None for any other source.
#[derive(Resource)]
pub struct NamedImages(pub fn(&mut World, &str) -> Option<Handle<Image>>);

/// How a map's texels are read: colour (sRGB, the base colour) or data (linear: normals, roughness, occlusion).
#[derive(Clone, Copy, PartialEq)]
pub enum MapKind {
    Colour,
    Data,
}

/// A picture as a material's texture: a full mip chain (2x2 box averages, in linear light for colour) sampled
/// trilinearly and anisotropically, so a tiled floor going away from the camera doesn't shimmer; repeating when the
/// material tiles its maps, else clamped (a label's edge doesn't bleed into the other side).
pub fn map_image(pic: image::RgbaImage, kind: MapKind, repeat: bool, sampling: Option<&raea_sys_sampler::Sampling>) -> Image {
    let (w, h) = pic.dimensions();
    let srgb = kind == MapKind::Colour;
    let (data, levels) = mips_rgba8(pic.into_raw(), w, h, srgb);
    let mut img = Image::new(
        bevy::render::render_resource::Extent3d { width: w, height: h, depth_or_array_layers: 1 },
        bevy::render::render_resource::TextureDimension::D2,
        data,
        if srgb { TextureFormat::Rgba8UnormSrgb } else { TextureFormat::Rgba8Unorm },
        bevy::asset::RenderAssetUsages::default(),
    );
    img.texture_descriptor.mip_level_count = levels;
    let address = if repeat { bevy::image::ImageAddressMode::Repeat } else { bevy::image::ImageAddressMode::ClampToEdge };
    let d = bevy::image::ImageSamplerDescriptor {
        anisotropy_clamp: 16,
        address_mode_u: address,
        address_mode_v: address,
        ..bevy::image::ImageSamplerDescriptor::linear()
    };
    // a material's own `sampler` over that (raea-sys-sampler)
    img.sampler = bevy::image::ImageSampler::Descriptor(match sampling {
        Some(s) => s.over(d),
        None => d,
    });
    img
}

/// RGBA8 texels with every mip level after them (2x2 box averages; in linear light when `srgb`): the data and the
/// level count.
pub fn mips_rgba8(mut data: Vec<u8>, w: u32, h: u32, srgb: bool) -> (Vec<u8>, u32) {
    let to_lin: Vec<f32> = (0..256).map(|i| {
        let c = i as f32 / 255.0;
        if srgb { if c <= 0.04045 { c / 12.92 } else { ((c + 0.055) / 1.055).powf(2.4) } } else { c }
    }).collect();
    let enc = |l: f32| -> u8 {
        let c = if !srgb { l } else if l <= 0.0031308 { l * 12.92 } else { 1.055 * l.powf(1.0 / 2.4) - 0.055 };
        (c.clamp(0.0, 1.0) * 255.0 + 0.5) as u8
    };
    let mut cur: Vec<[f32; 4]> = data[..(w * h * 4) as usize].chunks_exact(4).map(|p| [to_lin[p[0] as usize], to_lin[p[1] as usize], to_lin[p[2] as usize], p[3] as f32 / 255.0]).collect();
    let (mut cw, mut ch) = (w, h);
    let mut levels = 1;
    while cw > 1 || ch > 1 {
        let (nw, nh) = ((cw / 2).max(1), (ch / 2).max(1));
        let mut next = vec![[0.0f32; 4]; (nw * nh) as usize];
        for y in 0..nh {
            for x in 0..nw {
                let mut acc = [0.0f32; 4];
                for (dx, dy) in [(0, 0), (1, 0), (0, 1), (1, 1)] {
                    let p = cur[((y * 2 + dy).min(ch - 1) * cw + (x * 2 + dx).min(cw - 1)) as usize];
                    for k in 0..4 {
                        acc[k] += p[k] * 0.25;
                    }
                }
                next[(y * nw + x) as usize] = acc;
            }
        }
        for p in &next {
            data.extend_from_slice(&[enc(p[0]), enc(p[1]), enc(p[2]), (p[3].clamp(0.0, 1.0) * 255.0 + 0.5) as u8]);
        }
        cur = next;
        (cw, ch) = (nw, nh);
        levels += 1;
    }
    (data, levels)
}

/// A glTF's textures given their mip chains: Bevy's glTF loader makes none, so a stone's normal map, minified 4-16x
/// on a column across the street, aliased into per-pixel speckle wherever the sun lit it (worst along the terminator,
/// where N.L flips sign texel to texel), and the albedo shimmered as the camera moved. RGBA8 images still in main-world
/// memory only (compressed and float ones keep what they have); sampled trilinearly, 16x anisotropic, keeping the
/// file's address modes. An image two models share is done once.
pub fn mip_gltf_textures(g: &Gltf, mats: &Assets<bevy::gltf::GltfMaterial>, images: &mut Assets<Image>) {
    for mh in &g.materials {
        let Some(m) = mats.get(mh) else { continue };
        let texs = [&m.base_color_texture, &m.normal_map_texture, &m.metallic_roughness_texture, &m.occlusion_texture, &m.emissive_texture];
        for t in texs.into_iter().flatten() {
            let Some(img) = images.get(t) else { continue };
            let fmt = img.texture_descriptor.format;
            let srgb = fmt == TextureFormat::Rgba8UnormSrgb;
            if img.texture_descriptor.mip_level_count > 1 || !(srgb || fmt == TextureFormat::Rgba8Unorm) || img.data.is_none() || img.texture_descriptor.size.depth_or_array_layers != 1 {
                continue;
            }
            let Some(mut img) = images.get_mut(t) else { continue };
            let (w, h) = (img.texture_descriptor.size.width, img.texture_descriptor.size.height);
            let (data, levels) = mips_rgba8(img.data.take().unwrap_or_default(), w, h, srgb);
            img.data = Some(data);
            img.texture_descriptor.mip_level_count = levels;
            let mut d = match &img.sampler {
                bevy::image::ImageSampler::Descriptor(d) => d.clone(),
                _ => bevy::image::ImageSamplerDescriptor::default(),
            };
            d.mag_filter = bevy::image::ImageFilterMode::Linear;
            d.min_filter = bevy::image::ImageFilterMode::Linear;
            d.mipmap_filter = bevy::image::ImageFilterMode::Linear;
            d.anisotropy_clamp = 16;
            img.sampler = bevy::image::ImageSampler::Descriptor(d);
        }
    }
}

/// A map column's picture, decoded: a file (resolved as every media path is) or a data: URL.
pub fn map_picture(t: &Tup, inserted: &[Tup], dir: &Path, col: &str, src: &str) -> Result<image::RgbaImage, String> {
    if src.starts_with("data:") {
        return data_picture(src).map_err(|e| format!("mesh {}: {col} (a data: URL): {e}", t.id));
    }
    let path = resolve_src(inserted, src, dir).map_err(|e| format!("mesh {}: {col}: {e}", t.id))?;
    Ok(image::open(&path).map_err(|e| format!("mesh {}: {col}: {}: {e}", t.id, path.display()))?.to_rgba8())
}

/// A map's texture from the load's cache, or made: `make` builds the picture (one file, or two packed into one).
pub fn cached_map(world: &mut World, key: String, kind: MapKind, repeat: bool, sampling: Option<&raea_sys_sampler::Sampling>, make: impl FnOnce() -> Result<image::RgbaImage, String>) -> Result<Handle<Image>, String> {
    // one image per sampler: Bevy keeps the sampler on the Image
    let key = format!("{key}|{}|{}|{}", kind == MapKind::Colour, repeat, sampling.map_or("", |s| s.key.as_str()));
    if let Some(h) = world.get_resource::<Maps>().and_then(|m| m.0.get(&key)) {
        return Ok(h.clone());
    }
    let img = map_image(make()?, kind, repeat, sampling);
    let h = world.resource_mut::<Assets<Image>>().add(img);
    world.get_resource_or_insert_with(Maps::default).0.insert(key, h.clone());
    Ok(h)
}

/// Whether a mesh row has any texture map (it then needs texture coordinates; a normal map needs tangents too).
pub fn has_maps(vals: &BTreeMap<String, V>) -> bool {
    any_map(vals, &["map", "normal_map", "rough_map", "metal_map", "mr_map", "ao_map", "emissive_map", "clearcoat_normal_map"])
}

/// Whether a mesh row has a normal map, its own or its clearcoat's: its mesh then needs tangents.
pub fn needs_tangents(vals: &BTreeMap<String, V>) -> bool {
    any_map(vals, &["normal_map", "clearcoat_normal_map"])
}

fn any_map(vals: &BTreeMap<String, V>, keys: &[&str]) -> bool {
    keys.iter().any(|k| vals.get(*k).is_some_and(V::truthy))
}

/// A mesh row's surface: the standard material from its columns.
pub fn material(world: &mut World, t: &Tup, inserted: &[Tup], dir: &Path) -> Result<StandardMaterial, String> {
    let vals = &t.vals;
    let g = |k: &str, d: f32| num(vals, k, d);
    let mut base = colour(vals.get("color"), [0.8, 0.8, 0.8, 1.0]);
    if vals.contains_key("col_r") {
        base = Color::srgb(g("col_r", 0.8), g("col_g", 0.8), g("col_b", 0.8));
    }
    let opacity = g("opacity", 1.0).clamp(0.0, 1.0);
    base.set_alpha(opacity);
    let em = colour(vals.get("emissive"), [0.0, 0.0, 0.0, 1.0]).to_linear() * g("emissive_k", 1.0);
    let mut m = StandardMaterial {
        base_color: base,
        perceptual_roughness: g("rough", 0.45),
        metallic: g("metal", 0.0),
        emissive: LinearRgba::rgb(em.red, em.green, em.blue),
        unlit: flag(vals, "unlit", false),
        clearcoat: g("clearcoat", 0.0),
        clearcoat_perceptual_roughness: g("clearcoat_rough", 0.5),
        reflectance: g("reflectance", 0.5),
        // see-through below opacity 1, at 1 opaque and writing depth (sync_meshes switches it, #38); a fading picture blends
        alpha_mode: if opacity < 1.0 || vals.contains_key("opacity") && vals.contains_key("map") { AlphaMode::Blend } else { AlphaMode::Opaque },
        ..default()
    };
    // texture maps (Poly Haven's diff, nor_gl, rough, arm, ao), all tiled by repeat_u/repeat_v
    let src = |k: &str| match vals.get(k) { Some(V::S(s)) if !s.is_empty() => Some(s.clone()), _ => None };
    let (ru, rv) = (g("repeat_u", 1.0), g("repeat_v", 1.0));
    let repeat = ru != 1.0 || rv != 1.0;
    if repeat {
        m.uv_transform = bevy::math::Affine2::from_scale(Vec2::new(ru, rv));
    }
    // how each map is read (raea-sys-sampler): `samplers` per map by its prop name, over `sampler` for all of them
    let all = raea_sys_sampler::Sampling::col(vals, "sampler").map_err(|e| format!("mesh {}: {e}", t.id))?;
    let own: BTreeMap<String, raea_sys_sampler::Sampling> = match vals.get("samplers") {
        Some(V::S(js)) => {
            let o: serde_json::Map<String, serde_json::Value> = serde_json::from_str(js).map_err(|e| format!("mesh {}: samplers: {e}", t.id))?;
            o.iter().map(|(k, v)| raea_sys_sampler::Sampling::of(v).map(|s| (k.clone(), s)).map_err(|e| format!("mesh {}: samplers.{k}: {e}", t.id))).collect::<Result<_, _>>()?
        }
        _ => BTreeMap::new(),
    };
    let sam = |prop: &str| own.get(prop).or(all.as_ref());
    // a UiTexture's image (raea-screen:name@WxH) in any map: the screen image its UI is drawn into, as it is drawn
    // (a panel that glows: its UI as the emissive map, so it shows under Solari, which draws no unlit surface)
    let named = world.get_resource::<NamedImages>().map(|n| n.0);
    let screen = |world: &mut World, s: &str| named.and_then(|named| named(world, s));
    if let Some(s) = src("map") {
        m.base_color_texture = Some(match screen(world, &s) {
            Some(h) => h,
            None => cached_map(world, s.clone(), MapKind::Colour, repeat, sam("map"), || map_picture(t, inserted, dir, "map", &s))?,
        });
    }
    if let Some(s) = src("normal_map") {
        m.normal_map_texture = Some(match screen(world, &s) {
            Some(h) => h,
            None => cached_map(world, s.clone(), MapKind::Data, repeat, sam("normalMap"), || map_picture(t, inserted, dir, "normalMap", &s))?,
        });
    }
    // the clearcoat layer's own normals, data not colour (rotate_environment_map loads it with is_srgb false); Bevy
    // binds them only with its multi-layer textures (this crate's `multi-layer` feature)
    if let Some(s) = src("clearcoat_normal_map") {
        #[cfg(feature = "multi-layer")]
        {
            m.clearcoat_normal_texture = Some(cached_map(world, s.clone(), MapKind::Data, repeat, sam("clearcoatNormalMap"), || map_picture(t, inserted, dir, "clearcoatNormalMap", &s))?);
        }
        #[cfg(not(feature = "multi-layer"))]
        return Err(format!("{}: clearcoat_normal_texture {s}: this raea is built without Bevy's clearcoat textures (raea-sys-material's multi-layer feature, off by default: docs/control.feature FC0a)", t.id));
    }
    if let Some(s) = src("mr_map") {
        m.metallic_roughness_texture = Some(match screen(world, &s) {
            Some(h) => h,
            None => cached_map(world, s.clone(), MapKind::Data, repeat, sam("metallicRoughnessMap"), || map_picture(t, inserted, dir, "metallicRoughnessMap", &s))?,
        });
    } else if src("rough_map").is_some() || src("metal_map").is_some() {
        // separate greyscale maps packed into glTF's layout: green roughness, blue metalness (white where there's no
        // map, so the factor alone sets it)
        let (rs, ms) = (src("rough_map"), src("metal_map"));
        let key = format!("pack:{}:{}", rs.clone().unwrap_or_default(), ms.clone().unwrap_or_default());
        m.metallic_roughness_texture = Some(cached_map(world, key, MapKind::Data, repeat, sam("roughnessMap").or(sam("metalnessMap")), || {
            let r = rs.as_ref().map(|s| map_picture(t, inserted, dir, "roughnessMap", s)).transpose()?;
            let mt = ms.as_ref().map(|s| map_picture(t, inserted, dir, "metalnessMap", s)).transpose()?;
            let (w, h) = r.as_ref().or(mt.as_ref()).map(|p| p.dimensions()).unwrap_or((1, 1));
            let at = |p: &Option<image::RgbaImage>, x: u32, y: u32| p.as_ref().map(|p| {
                let (pw, ph) = p.dimensions();
                p.get_pixel(x * pw / w, y * ph / h)[0]
            }).unwrap_or(255);
            Ok(image::RgbaImage::from_fn(w, h, |x, y| image::Rgba([255, at(&r, x, y), at(&mt, x, y), 255])))
        })?);
    }
    if let Some(s) = src("ao_map") {
        m.occlusion_texture = Some(match screen(world, &s) {
            Some(h) => h,
            None => cached_map(world, s.clone(), MapKind::Data, repeat, sam("aoMap"), || map_picture(t, inserted, dir, "aoMap", &s))?,
        });
    }
    if let Some(s) = src("emissive_map") {
        m.emissive_texture = Some(match screen(world, &s) {
            Some(h) => h,
            None => cached_map(world, s.clone(), MapKind::Colour, repeat, sam("emissiveMap"), || map_picture(t, inserted, dir, "emissiveMap", &s))?,
        });
    }
    // how its alpha and faces draw (alphaMode, alphaCutoff, side) and real transmission (transmission, ior, thickness)
    if let Some(V::S(a)) = vals.get("alpha") {
        m.alpha_mode = match a.as_str() {
            "mask" => AlphaMode::Mask(g("alpha_cutoff", 0.5)),
            "blend" => AlphaMode::Blend,
            "add" => AlphaMode::Add,
            "multiply" => AlphaMode::Multiply,
            "premultiplied" => AlphaMode::Premultiplied,
            // soft cut-outs from the alpha over MSAA's samples (hair cards, foliage); without MSAA Bevy draws it solid
            "coverage" => AlphaMode::AlphaToCoverage,
            _ => AlphaMode::Opaque,
        };
    }
    match vals.get("side") {
        Some(V::S(s)) if s == "double" => {
            m.double_sided = true;
            m.cull_mode = None;
        }
        Some(V::S(s)) if s == "back" => m.cull_mode = Some(bevy::render::render_resource::Face::Front),
        _ => {}
    }
    m.specular_transmission = g("transmission", 0.0);
    m.ior = g("ior", 1.5);
    m.thickness = g("thickness", 0.0);
    // a height map for parallax, and the rest of StandardMaterial's fields (docs/shaders.feature SH7: fields.rs)
    if let Some(s) = src("depth_map") {
        m.depth_map = Some(cached_map(world, s.clone(), MapKind::Data, repeat, sam("depthMap"), || map_picture(t, inserted, dir, "depthMap", &s))?);
    }
    super::fields::apply(&mut m, vals, &format!("mesh {}", t.id))?;
    Ok(m)
}

/// A picture given inline as a data: URL (`data:image/png;base64,...`, `data:image/svg+xml;utf8,<svg ...>`), decoded in
/// memory: a raster through `image`, an SVG drawn by usvg and vello_cpu at its own size (at least 512 px on its long
/// side, at most 4096). Before this a data: URL was read as a file path and failed ("map: .../data:image/svg+xml...: No
/// such file"), the way the legacy app's agent first wrote a label into a perfume shot.
pub fn data_picture(src: &str) -> Result<image::RgbaImage, String> {
    let (mime, bytes) = raea_io_net::data_url(src).ok_or("a data: URL that doesn't decode")?;
    let svg = mime == "image/svg+xml" || (mime.is_empty() && bytes.trim_ascii_start().starts_with(b"<svg"));
    if !svg {
        return image::load_from_memory(&bytes).map(|i| i.to_rgba8()).map_err(|e| format!("a {mime} picture: {e}"));
    }
    svg_picture(&bytes)
}

/// An SVG's bytes drawn by resvg, at least 512 px on its long side, at most 4096.
#[cfg(feature = "native")]
pub fn svg_picture(bytes: &[u8]) -> Result<image::RgbaImage, String> {
    let tree = resvg::usvg::Tree::from_data(bytes, &resvg::usvg::Options::default()).map_err(|e| format!("its SVG: {e}"))?;
    let (sw, sh) = (tree.size().width().max(1.0), tree.size().height().max(1.0));
    let k = (512.0 / sw.max(sh)).max(1.0).min(4096.0 / sw.max(sh));
    let (w, h) = ((sw * k).round().max(1.0) as u32, (sh * k).round().max(1.0) as u32);
    let mut pm = resvg::tiny_skia::Pixmap::new(w, h).ok_or("the SVG's size")?;
    resvg::render(&tree, resvg::tiny_skia::Transform::from_scale(k, k), &mut pm.as_mut());
    let mut px = pm.take();
    // resvg paints premultiplied alpha; a texture wants it straight
    for p in px.chunks_exact_mut(4) {
        let a = p[3] as u32;
        if a > 0 && a < 255 {
            for c in &mut p[..3] {
                *c = ((*c as u32 * 255 + a / 2) / a).min(255) as u8;
            }
        }
    }
    image::RgbaImage::from_raw(w, h, px).ok_or_else(|| "the SVG's pixels".to_string())
}

/// Without native the CPU's SVG renderer isn't linked (a browser build can draw an SVG in the page instead).
#[cfg(not(feature = "native"))]
pub fn svg_picture(_bytes: &[u8]) -> Result<image::RgbaImage, String> {
    Err("an SVG picture: SVG textures are drawn only in the native build".into())
}

#[cfg(all(test, feature = "native"))]
mod data_url_tests {
    /// data: URL pictures decode in memory: an SVG (utf8, percent-escaped) drawn at least 512 px wide with its fill, and
    /// a base64 PNG to its own pixels
    #[test]
    fn data_pictures_decode() {
        let svg = super::data_picture("data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"64\" height=\"32\"><rect width=\"64\" height=\"32\" fill=\"%23ff0000\"/></svg>").unwrap();
        assert_eq!(svg.dimensions(), (512, 256));
        assert_eq!(svg.get_pixel(100, 100).0, [255, 0, 0, 255]);
        let mut png = Vec::new();
        image::RgbaImage::from_pixel(3, 2, image::Rgba([0, 128, 255, 255])).write_to(&mut std::io::Cursor::new(&mut png), image::ImageFormat::Png).unwrap();
        use base64::Engine as _;
        let url = format!("data:image/png;base64,{}", base64::engine::general_purpose::STANDARD.encode(&png));
        let pic = super::data_picture(&url).unwrap();
        assert_eq!((pic.dimensions(), pic.get_pixel(2, 1).0), ((3, 2), [0, 128, 255, 255]));
        assert!(super::data_picture("data:image/png;base64,!!!").is_err());
    }
}

/// A panel's picture: inline (a data: URL, raster or SVG) or a file.
pub fn panel_picture(src: &str, inserted: &[Tup], dir: &Path) -> Result<image::RgbaImage, String> {
    if src.starts_with("data:") {
        return data_picture(src).map_err(|e| format!("src (a data: URL): {e}"));
    }
    let path = resolve_src(inserted, src, dir)?;
    Ok(image::open(&path).map_err(|e| format!("{}: {e}", path.display()))?.to_rgba8())
}

/// A panel's texture. A panel is usually drawn smaller than it was painted: a full mip chain and trilinear, anisotropic
/// sampling keep its text from shimmering as it moves (without them a 2x minified glyph flickers).
pub fn panel_image(pic: image::RgbaImage) -> Image {
    let (pw, ph) = pic.dimensions();
    let (data, levels) = mip_chain(pic.into_raw(), pw, ph);
    let mut img = Image::new(
        bevy::render::render_resource::Extent3d { width: pw, height: ph, depth_or_array_layers: 1 },
        bevy::render::render_resource::TextureDimension::D2,
        data,
        TextureFormat::Rgba8UnormSrgb,
        bevy::asset::RenderAssetUsages::default(),
    );
    img.texture_descriptor.mip_level_count = levels;
    img.sampler = bevy::image::ImageSampler::Descriptor(bevy::image::ImageSamplerDescriptor {
        anisotropy_clamp: 16,
        ..bevy::image::ImageSamplerDescriptor::linear()
    });
    img
}

/// Straight-alpha RGBA8 (sRGB) as premultiplied-alpha RGBA8 (the colour premultiplied in linear light, then encoded), with
/// every mip level after it (2x2 box averages of the premultiplied linear values): the data and the level count, for a
/// texture sampled trilinearly and blended premultiplied.
pub fn mip_chain(data: Vec<u8>, w: u32, h: u32) -> (Vec<u8>, u32) {
    let to_lin: Vec<f32> = (0..256).map(|i| {
        let c = i as f32 / 255.0;
        if c <= 0.04045 { c / 12.92 } else { ((c + 0.055) / 1.055).powf(2.4) }
    }).collect();
    let to_srgb = |l: f32| -> u8 {
        let c = if l <= 0.0031308 { l * 12.92 } else { 1.055 * l.powf(1.0 / 2.4) - 0.055 };
        (c.clamp(0.0, 1.0) * 255.0 + 0.5) as u8
    };
    // level 0, premultiplied, kept in linear floats for the averages
    let mut cur: Vec<[f32; 4]> = data.chunks_exact(4).map(|p| {
        let a = p[3] as f32 / 255.0;
        [to_lin[p[0] as usize] * a, to_lin[p[1] as usize] * a, to_lin[p[2] as usize] * a, a]
    }).collect();
    let encode = |px: &[[f32; 4]], out: &mut Vec<u8>| {
        for p in px {
            out.extend_from_slice(&[to_srgb(p[0]), to_srgb(p[1]), to_srgb(p[2]), (p[3].clamp(0.0, 1.0) * 255.0 + 0.5) as u8]);
        }
    };
    let mut out = Vec::with_capacity(data.len() * 4 / 3 + 16);
    encode(&cur, &mut out);
    let (mut cw, mut ch) = (w as usize, h as usize);
    let mut levels = 1;
    while cw > 1 || ch > 1 {
        let (nw, nh) = ((cw / 2).max(1), (ch / 2).max(1));
        let mut next = vec![[0f32; 4]; nw * nh];
        for y in 0..nh {
            for x in 0..nw {
                let mut acc = [0f32; 4];
                for (dx, dy) in [(0, 0), (1, 0), (0, 1), (1, 1)] {
                    let p = cur[(y * 2 + dy).min(ch - 1) * cw + (x * 2 + dx).min(cw - 1)];
                    for c in 0..4 {
                        acc[c] += p[c] / 4.0;
                    }
                }
                next[y * nw + x] = acc;
            }
        }
        encode(&next, &mut out);
        cur = next;
        (cw, ch) = (nw, nh);
        levels += 1;
    }
    (out, levels)
}

#[cfg(test)]
mod screen_map_tests {
    use super::*;

    #[derive(Resource)]
    struct Panel(Handle<Image>);

    fn named(world: &mut World, src: &str) -> Option<Handle<Image>> {
        (src == "raea-screen:panel@8x4").then(|| world.resource::<Panel>().0.clone())
    }

    /// A UiTexture's image (raea-screen:name@WxH) is the texture of whichever map names it, the same handle its UI is
    /// drawn into: as the emissive map a panel glows, and shows under Solari, which draws no unlit surface. Before, only
    /// the base colour looked it up and an emissive one was refused as a missing file.
    #[test]
    fn a_screen_image_is_the_texture_of_any_map() {
        let mut world = World::new();
        world.init_resource::<Assets<Image>>();
        let h = world.resource_mut::<Assets<Image>>().add(Image::default());
        world.insert_resource(Panel(h.clone()));
        world.insert_resource(NamedImages(named));
        let mut vals = BTreeMap::new();
        for k in ["map", "emissive_map", "normal_map", "ao_map", "mr_map"] {
            vals.insert(k.to_string(), V::S("raea-screen:panel@8x4".into()));
        }
        let t = Tup { kind: "mesh".into(), id: "panel".into(), vals };
        let m = material(&mut world, &t, &[], Path::new(".")).unwrap();
        for (slot, tex) in [("map", &m.base_color_texture), ("emissive", &m.emissive_texture), ("normal", &m.normal_map_texture), ("ao", &m.occlusion_texture), ("mr", &m.metallic_roughness_texture)] {
            assert_eq!(tex.as_ref(), Some(&h), "{slot}");
        }
        // a screen nobody draws is still a file name, and a missing file is refused
        let mut vals = BTreeMap::new();
        vals.insert("emissive_map".to_string(), V::S("raea-screen:other@8x4".into()));
        let t = Tup { kind: "mesh".into(), id: "panel".into(), vals };
        assert!(material(&mut world, &t, &[], Path::new(".")).is_err());
    }
}
