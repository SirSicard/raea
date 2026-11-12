//! A CapCut desktop draft written from a timeline of clips (docs/capcut.feature CC2): the project folder CapCut opens
//! with its tracks, clips and media in place. The format is CapCut's own, read from drafts CapCut made
//! (CapCut 8.5.0, with what 9.x needs as well); what CapCut itself writes is kept as it wrote it (skeleton.rs). This
//! crate takes clips in frames and media already probed; raea's export (apps/capcut) makes them from a composition.

mod build;
mod skeleton;
mod store;
mod write;
#[cfg(test)]
mod tests;

use std::path::PathBuf;

pub use build::{Built, build};
pub use store::{Markers, capcut_running, register, seed, store_root};
pub use write::{Written, write};

pub type R<T> = Result<T, String>;

/// A file a clip shows or plays, as probed: its picture's upright size (none for sound) and length in seconds.
#[derive(Clone, Debug)]
pub struct Media {
    pub path: PathBuf,
    pub kind: MediaKind,
    pub seconds: f64,
    pub width: u32,
    pub height: u32,
    pub has_audio: bool,
}

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum MediaKind {
    Video,
    Photo,
    Audio,
}

/// The draft's timeline: its canvas, its media, and its tracks bottom first (CapCut's first video track is its main
/// track, magnetic: clips butted from 0).
#[derive(Clone, Debug)]
pub struct Timeline {
    pub width: u32,
    pub height: u32,
    pub fps: f64,
    pub media: Vec<Media>,
    pub tracks: Vec<Track>,
}

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum Kind {
    Video,
    Audio,
}

#[derive(Clone, Debug)]
pub struct Track {
    pub kind: Kind,
    pub name: String,
    pub clips: Vec<Clip>,
}

/// One clip: `media` (an index into Timeline.media) from `source_in` seconds at `speed`, on the timeline from frame
/// `start` for `frames`; its gain, fades and, for a picture, where it sits.
#[derive(Clone, Debug)]
pub struct Clip {
    pub media: usize,
    pub start: i64,
    pub frames: i64,
    pub source_in: f64,
    pub speed: f64,
    /// linear gain, 1 = 0 dB; a picture's own sound
    pub volume: f64,
    pub fade_in: f64,
    pub fade_out: f64,
    pub place: Place,
}

/// Where a picture sits: its centre in canvas pixels from the top left, its scale against the media fitted inside
/// the canvas (CapCut's 1), its opacity, and the part of the media shown (left, top, right, bottom, 0..1).
#[derive(Clone, Copy, Debug, PartialEq)]
pub struct Place {
    pub x: f64,
    pub y: f64,
    pub scale: f64,
    pub opacity: f64,
    pub crop: [f64; 4],
}

impl Place {
    /// Filling the canvas, as CapCut places a clip it imports.
    pub fn centred(width: u32, height: u32) -> Place {
        Place { x: width as f64 / 2.0, y: height as f64 / 2.0, scale: 1.0, opacity: 1.0, crop: [0.0, 0.0, 1.0, 1.0] }
    }
}

impl Default for Clip {
    fn default() -> Clip {
        Clip { media: 0, start: 0, frames: 0, source_in: 0.0, speed: 1.0, volume: 1.0, fade_in: 0.0, fade_out: 0.0, place: Place { x: 0.0, y: 0.0, scale: 1.0, opacity: 1.0, crop: [0.0, 0.0, 1.0, 1.0] } }
    }
}

/// A fresh id: an uppercase UUID-shaped string, as CapCut's own ids are (random per process, counted within it).
pub fn uid() -> String {
    use std::hash::{BuildHasher, Hasher};
    use std::sync::atomic::{AtomicU64, Ordering};
    static N: AtomicU64 = AtomicU64::new(0);
    static SEED: std::sync::OnceLock<std::collections::hash_map::RandomState> = std::sync::OnceLock::new();
    let s = SEED.get_or_init(std::collections::hash_map::RandomState::new);
    let n = N.fetch_add(1, Ordering::Relaxed);
    let half = |salt: u64| {
        let mut h = s.build_hasher();
        h.write_u64(n);
        h.write_u64(salt);
        h.finish()
    };
    let (a, b) = (half(0x5eed), half(0xca9c));
    let b = (b & 0x3FFF_FFFF_FFFF_FFFF) | 0x8000_0000_0000_0000; // the variant
    let a = (a & 0xFFFF_FFFF_FFFF_0FFF) | 0x4000; // version 4
    format!("{:08X}-{:04X}-{:04X}-{:04X}-{:012X}", a >> 32, (a >> 16) & 0xFFFF, a & 0xFFFF, b >> 48, b & 0xFFFF_FFFF_FFFF)
}
