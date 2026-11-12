//! Transparent video written natively (docs/capcut.feature CC1): straight-alpha RGBA frames into a QuickTime movie
//! an editor lays over footage. ProRes 4444 and HEVC with alpha through VideoToolbox on Apple; QuickTime Animation
//! (lossless run-length ARGB) and PNG frames on every platform, written here (mov.rs) with no other tool.

mod mov;
mod movie;
pub use movie::render_movie;
mod rle;
#[cfg(target_vendor = "apple")]
mod apple;
#[cfg(test)]
mod tests;

use std::path::{Path, PathBuf};

pub type R<T> = Result<T, String>;

/// The codecs a transparent movie can be.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum Codec {
    /// Apple ProRes 4444 with alpha (ap4h): what every editor reads with alpha. VideoToolbox, Apple only.
    ProRes,
    /// HEVC with alpha (muxa): a fraction of ProRes's size. VideoToolbox, Apple only.
    Hevc,
    /// QuickTime Animation at 32 bits ('rle '): lossless, small where little changes. Every platform.
    Rle,
    /// PNG frames in a QuickTime movie ('png '): lossless. Every platform.
    Png,
}

pub const NAMES: &str = "prores, hevc, rle or png";

impl Codec {
    pub fn parse(s: &str) -> R<Codec> {
        match s.to_ascii_lowercase().as_str() {
            "prores" | "prores4444" | "ap4h" => Ok(Codec::ProRes),
            "hevc" | "hevc-alpha" | "muxa" => Ok(Codec::Hevc),
            "rle" | "animation" | "qtrle" => Ok(Codec::Rle),
            "png" => Ok(Codec::Png),
            _ => Err(format!("--alpha-codec takes {NAMES}, not {s:?}")),
        }
    }

    /// ProRes 4444 on Apple, QuickTime Animation elsewhere.
    pub fn default_here() -> Codec {
        if cfg!(target_vendor = "apple") { Codec::ProRes } else { Codec::Rle }
    }

    pub fn name(self) -> &'static str {
        match self {
            Codec::ProRes => "ProRes 4444",
            Codec::Hevc => "HEVC",
            Codec::Rle => "QuickTime Animation",
            Codec::Png => "PNG",
        }
    }

    /// Whether this build can write it (VideoToolbox's two need Apple).
    pub fn here(self) -> bool {
        cfg!(target_vendor = "apple") || matches!(self, Codec::Rle | Codec::Png)
    }
}

/// A transparent movie being written: frames in, `finish` makes the file.
pub struct Writer {
    inner: Inner,
    width: u32,
    height: u32,
    /// frames pushed so far
    n: usize,
}

enum Inner {
    Mov(mov::Mov, Option<rle::Rle>, usize),
    #[cfg(target_vendor = "apple")]
    Apple(apple::Writer),
}

impl Writer {
    /// A movie of `codec` at `out`; `quality` (0..1) is HEVC's, which the others don't take.
    pub fn create(out: &Path, codec: Codec, width: u32, height: u32, fps: f64, quality: f32) -> R<Writer> {
        if !codec.here() {
            return Err(format!("{} is written through VideoToolbox, on a Mac: use --alpha-codec rle or png here", codec.name()));
        }
        if width == 0 || height == 0 || width > 0xFFFF || height > 0xFFFF {
            return Err(format!("a {width}x{height} movie can't be written"));
        }
        let inner = match codec {
            Codec::Rle => Inner::Mov(mov::Mov::create(out, b"rle ", "Animation", width, height, fps)?, Some(rle::Rle::new(width, height)), keyframe_every(fps)),
            Codec::Png => Inner::Mov(mov::Mov::create(out, b"png ", "PNG", width, height, fps)?, None, 1),
            #[cfg(target_vendor = "apple")]
            Codec::ProRes | Codec::Hevc => Inner::Apple(apple::Writer::new(out, codec == Codec::Hevc, width, height, fps, quality)?),
            #[cfg(not(target_vendor = "apple"))]
            Codec::ProRes | Codec::Hevc => unreachable!("{quality}"),
        };
        Ok(Writer { inner, width, height, n: 0 })
    }

    /// One frame: straight (not premultiplied) RGBA, the movie's size, in order.
    pub fn push(&mut self, rgba: &[u8]) -> R<()> {
        if rgba.len() != self.width as usize * self.height as usize * 4 {
            return Err(format!("a frame of {} bytes isn't {}x{} RGBA", rgba.len(), self.width, self.height));
        }
        match &mut self.inner {
            Inner::Mov(m, Some(r), every) => {
                let key = self.n.is_multiple_of(*every);
                let data = r.frame(rgba, key);
                m.add(&data, key)
            }
            Inner::Mov(m, None, _) => m.add(&png_frame(rgba, self.width, self.height)?, true),
            #[cfg(target_vendor = "apple")]
            Inner::Apple(a) => a.push(rgba),
        }?;
        self.n += 1;
        Ok(())
    }

    /// The movie finished; how many frames it holds.
    pub fn finish(self) -> R<usize> {
        match self.inner {
            Inner::Mov(m, _, _) => m.finish().map(drop)?,
            #[cfg(target_vendor = "apple")]
            Inner::Apple(a) => a.finish()?,
        }
        Ok(self.n)
    }
}

/// QuickTime Animation's keyframes: one a second, so an editor seeks without decoding far back.
fn keyframe_every(fps: f64) -> usize {
    (fps.round() as usize).max(1)
}

/// A frame as a PNG (RGBA, fast deflate).
fn png_frame(rgba: &[u8], width: u32, height: u32) -> R<Vec<u8>> {
    let mut out = Vec::new();
    let mut enc = png::Encoder::new(&mut out, width, height);
    enc.set_color(png::ColorType::Rgba);
    enc.set_depth(png::BitDepth::Eight);
    enc.set_compression(png::Compression::Fast);
    enc.write_header().and_then(|mut w| w.write_image_data(rgba)).map_err(|e| e.to_string())?;
    Ok(out)
}

/// A PNG read as straight RGBA8 (RGB gets an opaque alpha), with its size.
pub fn read_png(path: &Path) -> R<(Vec<u8>, u32, u32)> {
    let img = image::open(path).map_err(|e| format!("{}: {e}", path.display()))?.into_rgba8();
    let (w, h) = img.dimensions();
    Ok((img.into_raw(), w, h))
}

/// A folder's frame-NNNNN.png in order.
pub fn frames_in(dir: &Path) -> Vec<PathBuf> {
    let mut v: Vec<PathBuf> = std::fs::read_dir(dir).into_iter().flatten().flatten().map(|e| e.path()).filter(|p| p.file_name().is_some_and(|n| n.to_string_lossy().starts_with("frame-")) && p.extension().is_some_and(|x| x == "png")).collect();
    v.sort();
    v
}

/// What a folder of frames made: the movie's frames, size and bytes, and whether each frame draws anything (a pixel
/// not fully transparent), which the CapCut export cuts overlay clips by.
#[derive(Debug, Clone, Default)]
pub struct Made {
    pub frames: usize,
    pub width: u32,
    pub height: u32,
    pub bytes: u64,
    pub drawn: Vec<bool>,
}

/// A folder's --alpha frames (frame-NNNNN.png, straight alpha) encoded as one transparent movie.
pub fn encode_dir(dir: &Path, out: &Path, codec: Codec, fps: f64, quality: f32) -> R<Made> {
    let files = frames_in(dir);
    let first = files.first().ok_or_else(|| format!("{}: no frame-NNNNN.png to encode", dir.display()))?;
    let (_, width, height) = read_png(first)?;
    let mut w = Writer::create(out, codec, width, height, fps, quality)?;
    let mut drawn = Vec::with_capacity(files.len());
    for f in &files {
        let (px, fw, fh) = read_png(f)?;
        if (fw, fh) != (width, height) {
            return Err(format!("{}: {fw}x{fh}, not the first frame's {width}x{height}", f.display()));
        }
        drawn.push(px.as_chunks::<4>().0.iter().any(|p| p[3] != 0));
        w.push(&px)?;
    }
    let frames = w.finish()?;
    let bytes = std::fs::metadata(out).map(|m| m.len()).unwrap_or(0);
    Ok(Made { frames, width, height, bytes, drawn })
}
