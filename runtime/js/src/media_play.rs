//! A `video` or `audio` playing (media_html.rs's stream, on its decoder's thread): seeks answered with the frame at the
//! time asked; played, frames as they fall due on the source's clock, which is its sound's (media_sound.rs) when it has
//! sound and the Mac a device, else the wall's. Frames are asked for at the clock's time, so a decoder that falls
//! behind skips frames rather than letting the picture lag its sound.

use std::path::Path;
use std::sync::mpsc::{Receiver, RecvTimeoutError, Sender};
use std::time::{Duration, Instant};

use crate::media_html::stream::{Cmd, Msg};
use crate::media_sound::Sound;

/// What was opened: a video's decoder, or an audio source's samples.
pub enum Source {
    Video(Box<dyn raea_io_media::VideoDecoder>),
    Audio(raea_io_media::Audio),
}

/// The clock while playing: the sound's, else the wall's from when play began.
enum Clock {
    Sound,
    Wall { from: f64, began: Instant },
}

pub struct Player<'a> {
    path: &'a Path,
    source: Source,
    duration: f64,
    fps: f64,
    /// the sound, opened on the first play; None after it couldn't be
    sound: Option<Option<Sound>>,
    muted: bool,
    volume: f32,
    clock: Option<Clock>,
    looping: bool,
    /// the frame (index at fps) last sent while playing, so a frame isn't decoded twice
    shown: Option<i64>,
    /// when the last Time news went (an audio source's, which has no frames)
    told: Option<Instant>,
}

impl<'a> Player<'a> {
    pub fn new(path: &'a Path, source: Source) -> Self {
        let (duration, fps) = match &source {
            Source::Video(d) => (d.info().duration, d.info().fps),
            Source::Audio(a) => (a.duration(), 0.0),
        };
        let fps = if fps.is_finite() && fps > 1.0 { fps } else { 30.0 };
        Player { path, source, duration, fps, sound: None, muted: false, volume: 1.0, clock: None, looping: false, shown: None, told: None }
    }

    /// Answers the element's asks until it's gone (its stream dropped).
    pub fn run(mut self, rx: Receiver<Cmd>, tx: Sender<Msg>) {
        loop {
            // playing: wake for the next frame; paused: wait for an ask
            let first = if self.clock.is_some() {
                match rx.recv_timeout(Duration::from_secs_f64(0.5 / self.fps)) {
                    Ok(c) => Some(c),
                    Err(RecvTimeoutError::Timeout) => None,
                    Err(RecvTimeoutError::Disconnected) => return self.stop(),
                }
            } else {
                match rx.recv() {
                    Ok(c) => Some(c),
                    Err(_) => return self.stop(),
                }
            };
            // the asks waiting, the latest of each kind
            let (mut seek, mut play, mut pause) = (None, None, false);
            for c in first.into_iter().chain(std::iter::from_fn(|| rx.try_recv().ok())) {
                match c {
                    Cmd::Seek(t) => seek = Some(t),
                    Cmd::Play { at, looping } => (play, pause) = (Some((at, looping)), false),
                    Cmd::Pause => (play, pause) = (None, true),
                    Cmd::Muted(m) => {
                        self.muted = m;
                        if let Some(Some(s)) = &self.sound {
                            s.set_muted(m);
                        }
                    }
                    Cmd::Volume(v) => {
                        self.volume = v;
                        if let Some(Some(s)) = &self.sound {
                            s.set_volume(v);
                        }
                    }
                }
            }
            if pause && self.clock.is_some() {
                let t = self.now();
                self.halt();
                if tx.send(Msg::Time(t)).is_err() {
                    return;
                }
            }
            if let Some(t) = seek {
                // the frame at exactly the time asked (the element's `seeked`), and a playing clock goes on from it
                if self.clock.is_some() {
                    self.go(t);
                }
                if !self.frame(t, &tx) {
                    return self.stop();
                }
            }
            if let Some((at, looping)) = play {
                self.looping = looping;
                if self.clock.is_none() {
                    self.go(seek.unwrap_or(at));
                    if tx.send(Msg::Playing(seek.unwrap_or(at))).is_err() {
                        return self.stop();
                    }
                }
            }
            if self.clock.is_some() && !self.tick(&tx) {
                return self.stop();
            }
        }
    }

    /// The clock's time now.
    fn now(&self) -> f64 {
        match (&self.clock, &self.sound) {
            (Some(Clock::Sound), Some(Some(s))) => s.time(),
            (Some(Clock::Wall { from, began }), _) => from + began.elapsed().as_secs_f64(),
            _ => 0.0,
        }
    }

    /// Plays from `t`: the sound when there is one (opened the first time), else the wall.
    fn go(&mut self, t: f64) {
        if self.sound.is_none() {
            let audio = match &self.source {
                Source::Audio(a) => Some(raea_io_media::Audio { rate: a.rate, channels: a.channels.clone() }),
                // a video's sound track, decoded once, on the first play (a video only looked at never pays for it)
                Source::Video(_) => raea_io_media::preferred().into_iter().find_map(|b| b.decode_audio(self.path).ok()).filter(|a| a.len() > 0),
            };
            let volume = self.volume;
            self.sound = Some(audio.and_then(|a| Sound::open(a, self.muted).inspect(|s| s.set_volume(volume)).inspect_err(|e| bevy::log::debug!("raea-runtime-js: media plays on the wall's clock: {e}")).ok()));
        }
        self.shown = None;
        self.told = None;
        self.clock = Some(match &self.sound {
            Some(Some(s)) => {
                s.start(t);
                Clock::Sound
            }
            _ => Clock::Wall { from: t, began: Instant::now() },
        });
    }

    fn halt(&mut self) {
        if let Some(Some(s)) = &self.sound {
            s.stop();
        }
        self.clock = None;
    }

    fn stop(mut self) {
        self.halt();
    }

    /// The frame at `t`, sent as the frame at exactly `t`; false when the element's gone.
    fn frame(&mut self, t: f64, tx: &Sender<Msg>) -> bool {
        match &mut self.source {
            Source::Video(dec) => tx.send(dec.frame_at(t).map_or_else(Msg::Fail, |f| Msg::Frame(t, f))).is_ok(),
            Source::Audio(_) => tx.send(Msg::Time(t)).is_ok(),
        }
    }

    /// One step of playing: the end (again from the start when looping), or the frame falling due now.
    fn tick(&mut self, tx: &Sender<Msg>) -> bool {
        let t = self.now();
        if self.duration.is_finite() && t >= self.duration - 0.5 / self.fps {
            if self.looping {
                self.go(0.0);
                return self.frame(0.0, tx);
            }
            self.halt();
            return tx.send(Msg::Ended(self.duration)).is_ok();
        }
        match &self.source {
            Source::Video(_) => {
                let i = (t * self.fps).floor() as i64;
                if self.shown == Some(i) {
                    return true;
                }
                self.shown = Some(i);
                self.frame(t, tx)
            }
            Source::Audio(_) => {
                if self.told.is_some_and(|w| w.elapsed() < Duration::from_millis(100)) {
                    return true;
                }
                self.told = Some(Instant::now());
                tx.send(Msg::Time(t)).is_ok()
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use crate::media_html::stream::{self, Cmd, Msg, Stream};
    use std::time::{Duration, Instant};

    /// The next news within `within`, polled as the page host polls it (each frame).
    fn next(st: &Stream, within: Duration) -> Option<Msg> {
        let t = Instant::now();
        while t.elapsed() < within {
            if let Some(m) = st.next() {
                return Some(m);
            }
            std::thread::sleep(Duration::from_millis(2));
        }
        None
    }

    /// A second of 30 fps picture and a tone (ffmpeg's test sources), or None without ffmpeg.
    fn clip() -> Option<std::path::PathBuf> {
        let p = std::env::temp_dir().join(format!("raea-media-play-{}.mp4", std::process::id()));
        let ok = std::process::Command::new("ffmpeg")
            .args(["-v", "error", "-y", "-f", "lavfi", "-i", "testsrc=size=160x90:rate=30", "-f", "lavfi", "-i", "sine=frequency=440:sample_rate=48000", "-t", "1", "-c:v", "libx264", "-pix_fmt", "yuv420p", "-c:a", "aac", "-shortest"])
            .arg(&p)
            .status()
            .is_ok_and(|s| s.success());
        ok.then_some(p)
    }

    /// Played on the wall's clock (RAEA_AUDIO_MUTE=1: no device), a video's frames come as they fall due and it ends
    /// at its end; a seek answers with the frame at exactly its time; looping, it goes round; paused, it stops.
    #[test]
    fn plays_seeks_loops_and_pauses() {
        // SAFETY: set before any stream reads it, and nothing else in this test binary reads it concurrently
        unsafe { std::env::set_var("RAEA_AUDIO_MUTE", "1") };
        let Some(path) = clip() else { return eprintln!("no ffmpeg: skipped") };
        let mut st = stream::open(path.to_str().unwrap(), true).expect("a stream");
        assert!(matches!(next(&st, Duration::from_secs(10)), Some(Msg::Meta { w: 160, h: 90, .. })));
        assert!(matches!(next(&st, Duration::from_secs(5)), Some(Msg::Frame(t, _)) if t == 0.0));

        let began = Instant::now();
        st.ask(Cmd::Play { at: 0.0, looping: false });
        assert!(matches!(next(&st, Duration::from_secs(1)), Some(Msg::Playing(t)) if t == 0.0));
        let (mut frames, mut last, mut ended) = (0, -1.0, None);
        while let Some(m) = next(&st, Duration::from_secs(3)) {
            match m {
                Msg::Frame(t, f) => {
                    assert!(t > last, "frames in order: {t} after {last}");
                    assert_eq!((f.width, f.height), (160, 90));
                    (frames, last) = (frames + 1, t);
                }
                Msg::Ended(t) => {
                    ended = Some((t, began.elapsed().as_secs_f64()));
                    break;
                }
                _ => {}
            }
        }
        let (end, took) = ended.expect("it ended");
        assert!((end - 1.0).abs() < 0.05, "ended at its duration: {end}");
        assert!((0.85..1.4).contains(&took), "a second's clip took {took} s");
        assert!(frames >= 20, "{frames} frames of 30");

        st.ask(Cmd::Seek(0.5));
        assert!(matches!(next(&st, Duration::from_secs(2)), Some(Msg::Frame(t, _)) if t == 0.5));

        st.ask(Cmd::Play { at: 0.5, looping: true });
        let (mut wrapped, mut last, until) = (false, 0.5, Instant::now() + Duration::from_millis(1200));
        while Instant::now() < until {
            match next(&st, Duration::from_millis(200)) {
                Some(Msg::Frame(t, _)) => {
                    wrapped |= t < last;
                    last = t;
                }
                Some(Msg::Ended(_)) => panic!("a looping source doesn't end"),
                _ => {}
            }
        }
        assert!(wrapped, "looping went round");

        st.ask(Cmd::Pause);
        let mut after = 0;
        while let Some(m) = next(&st, Duration::from_millis(300)) {
            if matches!(m, Msg::Frame(..)) {
                after += 1;
            }
        }
        assert!(after <= 1, "{after} frames after pausing");
        let _ = std::fs::remove_file(path);
    }
}
