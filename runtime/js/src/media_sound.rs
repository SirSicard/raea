//! A playing `video`'s or `audio`'s sound (media_html.rs's stream plays it): its source's samples out of the default
//! output device through cpal, resampled to the device's rate, from a time on. Where the sound has got to is the
//! element's clock, so a video's frames follow its sound and the two can't drift apart over a long film. A muted element
//! plays silence on the same clock. RAEA_AUDIO_MUTE=1 (agents' runs, tests) opens no device: the stream keeps the wall's
//! clock instead.

use std::sync::Arc;
use std::sync::atomic::{AtomicBool, AtomicU32, AtomicU64, Ordering::Relaxed};

use cpal::traits::{DeviceTrait, HostTrait, StreamTrait};

/// No time asked for (`Shared::jump`).
const NONE: u64 = u64::MAX;

struct Shared {
    /// where the sound is in the source, in source samples (f64 bits): only the device's callback writes it
    pos: AtomicU64,
    /// a time asked for, in source samples (f64 bits), taken by the next callback; NONE when there's none
    jump: AtomicU64,
    /// the device's delay from a callback to its sound reaching the speaker, in seconds (f64 bits)
    delay: AtomicU64,
    muted: AtomicBool,
    /// the element's volume, 0..1 (f32 bits): the gain while it isn't muted
    volume: AtomicU32,
    running: AtomicBool,
}

/// The device's stream for one element's sound.
pub struct Sound {
    stream: cpal::Stream,
    shared: Arc<Shared>,
    rate: f64,
    len: f64,
}

impl Sound {
    /// The default output device, playing `audio` when started; an error when there's no device (or it's muted for
    /// the whole process, or the source has no sound).
    pub fn open(audio: raea_io_media::Audio, muted: bool) -> Result<Sound, String> {
        if std::env::var("RAEA_AUDIO_MUTE").as_deref() == Ok("1") {
            return Err("RAEA_AUDIO_MUTE=1".into());
        }
        let len = audio.len();
        if len == 0 || audio.rate == 0 {
            return Err("no sound".into());
        }
        let dev = cpal::default_host().default_output_device().ok_or("no audio output device")?;
        let def = dev.default_output_config().map_err(|e| format!("audio output: {e}"))?;
        if def.sample_format() != cpal::SampleFormat::F32 {
            return Err(format!("audio output: {:?} samples, not f32", def.sample_format()));
        }
        let ch = (def.channels() as usize).max(1);
        let rate = audio.rate as f64;
        let step = rate / def.sample_rate().0 as f64;
        let shared = Arc::new(Shared { pos: AtomicU64::new(0f64.to_bits()), jump: AtomicU64::new(NONE), delay: AtomicU64::new(0f64.to_bits()), muted: AtomicBool::new(muted), volume: AtomicU32::new(1f32.to_bits()), running: AtomicBool::new(false) });
        let s = shared.clone();
        let src = audio.channels;
        let last = len - 1;
        // the sample at fractional position `p` of channel `c`, straight-line between its neighbours
        let at = move |c: &[f32], p: f64| -> f32 {
            let i = p as usize;
            if i >= last {
                return if i == last { c[last] } else { 0.0 };
            }
            let f = (p - i as f64) as f32;
            c[i] + (c[i + 1] - c[i]) * f
        };
        let callback = move |out: &mut [f32], info: &cpal::OutputCallbackInfo| {
            let ts = info.timestamp();
            if let Some(d) = ts.playback.duration_since(&ts.callback) {
                s.delay.store(d.as_secs_f64().to_bits(), Relaxed);
            }
            let jump = s.jump.swap(NONE, Relaxed);
            let mut p = if jump != NONE { f64::from_bits(jump) } else { f64::from_bits(s.pos.load(Relaxed)) };
            if !s.running.load(Relaxed) {
                out.fill(0.0);
                s.pos.store(p.to_bits(), Relaxed);
                return;
            }
            let gain = if s.muted.load(Relaxed) { 0.0 } else { f32::from_bits(s.volume.load(Relaxed)) };
            for frame in out.chunks_mut(ch) {
                if p as usize > last {
                    frame.fill(0.0);
                } else if src.len() == 1 || ch == 1 {
                    // mono out of a stereo source, or a mono source on every speaker
                    let v = src.iter().map(|c| at(c, p)).sum::<f32>() / src.len() as f32 * gain;
                    frame.fill(v);
                } else {
                    for (k, o) in frame.iter_mut().enumerate() {
                        *o = src.get(k).map(|c| at(c, p) * gain).unwrap_or(0.0);
                    }
                }
                p += step;
            }
            s.pos.store(p.to_bits(), Relaxed);
        };
        let stream = dev.build_output_stream(&def.config(), callback, |e| eprintln!("raea-runtime-js: media sound: {e}"), None).map_err(|e| format!("audio stream: {e}"))?;
        Ok(Sound { stream, shared, rate, len: len as f64 / rate })
    }

    /// Plays from `t` seconds on.
    pub fn start(&self, t: f64) {
        let p = (t.max(0.0) * self.rate).to_bits();
        self.shared.jump.store(p, Relaxed);
        self.shared.pos.store(p, Relaxed);
        self.shared.running.store(true, Relaxed);
        let _ = self.stream.play();
    }

    pub fn stop(&self) {
        self.shared.running.store(false, Relaxed);
        let _ = self.stream.pause();
    }

    pub fn set_muted(&self, muted: bool) {
        self.shared.muted.store(muted, Relaxed);
    }

    /// How loud it plays while it isn't muted, 0..1 (a page's element.volume).
    pub fn set_volume(&self, volume: f32) {
        let v = if volume.is_finite() { volume.clamp(0.0, 1.0) } else { 1.0 };
        self.shared.volume.store(v.to_bits(), Relaxed);
    }

    /// The source time now reaching the speaker: what the picture shows to be in step with it.
    pub fn time(&self) -> f64 {
        let t = f64::from_bits(self.shared.pos.load(Relaxed)) / self.rate - f64::from_bits(self.shared.delay.load(Relaxed));
        t.clamp(0.0, self.len)
    }
}
