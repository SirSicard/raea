//! The files a draft uses, probed through raea's media backends (a picture's upright size and length, whether it has
//! sound; a sound's length), and the draft's cover: the reference render's first frame as a small JPEG.

use std::path::Path;

use raea_io_capcut::{Media, MediaKind};

use crate::R;

/// A video file: its display size (rotation applied) and length from the first backend that opens it, and whether a
/// short window of its sound decodes to samples.
pub fn video(path: &Path) -> R<Media> {
    let mut why = Vec::new();
    for b in raea_io_media::preferred() {
        match b.open_video(path) {
            Ok(d) => {
                let i = d.info();
                let has_audio = raea_io_media::decode_audio_window(path, 0.0, 0.05).is_ok_and(|a| a.len() > 0);
                return Ok(Media { path: path.to_path_buf(), kind: MediaKind::Video, seconds: i.duration, width: i.width, height: i.height, has_audio });
            }
            Err(e) => why.push(format!("{}: {e}", b.name())),
        }
    }
    Err(format!("{} didn't open as video ({})", path.display(), why.join("; ")))
}

/// A sound file: its length from its container.
pub fn sound(path: &Path) -> R<Media> {
    let seconds = raea_io_media::probe_seconds(path).ok_or_else(|| format!("{}: no sound length", path.display()))?;
    Ok(Media { path: path.to_path_buf(), kind: MediaKind::Audio, seconds, width: 0, height: 0, has_audio: true })
}

/// The first frame of `video`, at most 540 pixels on its long side, as a JPEG.
pub fn cover(video: &Path) -> Option<Vec<u8>> {
    let mut d = raea_io_media::preferred().into_iter().find_map(|b| b.open_video(video).ok())?;
    let f = d.frame_at(0.0).ok()?;
    let (w, h) = (f.width as usize, f.height as usize);
    let step = (w.max(h)).div_ceil(540).max(1);
    let (tw, th) = (w / step, h / step);
    let mut rgb = Vec::with_capacity(tw * th * 3);
    for y in 0..th {
        for x in 0..tw {
            let k = ((y * step) * w + x * step) * 4;
            rgb.extend_from_slice(&f.rgba[k..k + 3]);
        }
    }
    let mut out = Vec::new();
    image::codecs::jpeg::JpegEncoder::new_with_quality(&mut out, 82).encode(&rgb, tw as u32, th as u32, image::ExtendedColorType::Rgb8).ok()?;
    Some(out)
}
