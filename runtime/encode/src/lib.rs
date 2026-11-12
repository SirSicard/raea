//! An edit rendered to a file: by Bevy (raea-render's engine) or, without 3D, the direct GPU or CPU path
//! (raea-runtime-view), with its sound mixed on the one mixer core and encoded as the options say (render.rs, sound.rs),
//! and HTML compositions lowered to an edit and a Blitz page (html.rs).

use std::path::{Path, PathBuf};

use raea_core_program::{eval, ir, timeline};

use eval::Tup;
use ir::{Program, V};
use raea_render::engine;
pub use raea_render::{dir_of, inserted_of, save_png};

pub mod html;
mod sound;
pub use sound::*;
mod render;
pub use render::*;

/// What a render makes and how (the CLI's flags).
#[derive(Clone, Debug, Default)]
pub struct RenderOpts {
    /// the frames, in order (all of them when None)
    pub frames: Option<Vec<i64>>,
    /// the media backend that encodes (apple, soft, av1, ffmpeg); the platform's when None
    pub codec: Option<String>,
    /// the average video bitrate; raea_io_media::default_kbps (from the size and frame rate) when None
    pub kbps: Option<u32>,
    /// constant quality 0..1 in place of a bitrate (raea_io_media::EncodeOpts.quality); wins over `kbps`
    pub quality: Option<f32>,
    /// keep every 30th frame and report the encode's SSIM against them
    pub ssim: bool,
    /// the sound, mixed and mastered already (the one mixer core's bounce, raea-mixer), instead of the rows' mix
    pub sound: Option<raea_io_media::Audio>,
    /// 10-bit video (HEVC Main10 on Apple, from P010 made on the GPU), whose decoded colours match the render's 8-bit
    /// RGB exactly; 8-bit limited-range H.264 errs up to 2/255 by its own round trip. The direct and fed renders
    /// take it; RAEA_EXPORT_10BIT=1 asks for it too. 3D through the engine stays 8-bit.
    pub ten_bit: bool,
    /// PNGs kept transparent where the composition draws nothing: an HTML page's canvas clear instead of white (#32)
    pub alpha: bool,
}

impl RenderOpts {
    /// ten_bit, or RAEA_EXPORT_10BIT=1
    pub fn wants_10bit(&self) -> bool {
        self.ten_bit || std::env::var("RAEA_EXPORT_10BIT").as_deref() == Ok("1")
    }

    /// The encoder's options for a W x H render at `fps`: its bitrate or quality (`hevc`: the 10-bit HEVC encoder, which
    /// takes a lower default bitrate).
    fn encode_opts(&self, width: u32, height: u32, fps: f64, nv12: bool, realtime: bool, hevc: bool) -> raea_io_media::EncodeOpts {
        let kbps = self.kbps.unwrap_or_else(|| raea_io_media::default_kbps(width, height, fps, hevc));
        raea_io_media::EncodeOpts { width, height, fps, kbps, quality: self.quality, nv12, realtime }
    }
}

/// The encoder for a direct or fed render: 10-bit (P010 frames) when `ten_bit`, else the platform's 8-bit (NV12).
fn direct_encoder(codec: &str, out: &Path, opts: &raea_io_media::EncodeOpts, ten_bit: bool) -> Result<Box<dyn raea_io_media::VideoEncoder>, String> {
    let b = raea_io_media::backend(codec)?;
    if ten_bit { b.encoder_10bit(out, opts) } else { b.encoder(out, opts) }
}

/// One direct-render frame to the encoder: P010 or NV12, as the view made it.
fn push_direct(enc: &mut Box<dyn raea_io_media::VideoEncoder>, px: &[u8], w: u32, h: u32, ten_bit: bool) -> Result<(), String> {
    if ten_bit { enc.push_p010(px, w as usize, h as usize) } else { enc.push_nv12(px, w as usize, h as usize) }
}

/// Render an edit file (.sql or .rdb) to OUT: .mp4 (video and its sound), .txt (one hash per
/// frame), .raw (the frames as they came back) or a directory of PNGs. Edits without 3D take the direct path to .mp4,
/// .mov and .txt (RAEA_DIRECT=1 forces it). With RAEA_RENDER_STATS=1, its timings go to stderr as one JSON line.
pub fn render_file(edit: &str, out: &Path, opts: &RenderOpts) -> Result<(), String> {
    engine::mem_mark("render: start");
    // an HTML composition: its videos on the GPU, the page over them (html.rs)
    if edit.ends_with(".html") || edit.ends_with(".htm") {
        return html::render_file(edit, out, opts);
    }
    Err(format!("{edit}: raea-render renders HTML compositions; a composition renders with `raea render EDIT.tsx`"))
}

/// Where an edit with clips shows none, and where an edit with sound has none, as spans over a quarter second.
pub fn coverage(prog: &Program, tl: &timeline::Timeline) -> Vec<String> {
    let fps = prog.fps.max(1.0);
    let (mut pic, mut snd) = (vec![false; prog.frames.max(0) as usize], vec![false; prog.frames.max(0) as usize]);
    let (mut any_clip, mut any_sound) = (false, false);
    for f in 0..prog.frames {
        for t in tl.tups(f) {
            let g = |k: &str, d: f64| t.vals.get(k).map(V::num).unwrap_or(d);
            let on = (f as f64) >= g("from", 0.0) && (f as f64) < g("to", f64::INFINITY);
            let named = |k: &str| matches!(t.vals.get(k), Some(V::S(s)) if !s.is_empty());
            let muted = matches!(t.vals.get("sound"), Some(V::S(s)) if s.is_empty());
            if t.kind == "clip" {
                any_clip = true;
                pic[f as usize] |= on;
            }
            if !muted && (t.kind == "audio" || (t.kind == "clip" && (t.vals.contains_key("gain") || named("sound")))) {
                any_sound = true;
                snd[f as usize] |= on;
            }
        }
    }
    let spans = |covered: &[bool], what: &str| -> Vec<String> {
        let mut out = vec![];
        let mut f = 0;
        while f < covered.len() {
            if covered[f] {
                f += 1;
                continue;
            }
            let a = f;
            while f < covered.len() && !covered[f] {
                f += 1;
            }
            if (f - a) as f64 / fps > 0.25 {
                out.push(format!("{what} {:.2}–{:.2} s (frames {a}–{}) of {:.2} s", a as f64 / fps, f as f64 / fps, f - 1, prog.frames as f64 / fps));
            }
        }
        out
    };
    let mut out = vec![];
    if any_clip {
        out.extend(spans(&pic, "no clip on screen"));
    }
    if any_sound {
        out.extend(spans(&snd, "no sound"));
    }
    out
}
