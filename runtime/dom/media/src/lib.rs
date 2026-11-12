//! The host page's `video` and `audio` (raea-runtime-js's media_html.rs, on the Blitz page): a source is decoded by raea-media
//! on a thread of its own (raea-runtime-js's stream), what it tells goes to the element's JS as raea-runtime-js's `media` host event
//! (`loadedmetadata`, `loadeddata`, `seeked`, `error`: sdk/ui's dom layer fires each at the element), and a video's
//! frame is its picture, which its natural size is. Its poster shows until the first seek; with none, the frame does.
//! A seek is the prop `__seek` ([time, n], set by the dom layer's `currentTime`); playing is `__play` ([on, time, n,
//! loop], set by `play()` and `pause()`), `__muted` the element's muted and `__volume` its volume. Playing, the decoder's frames come on the
//! source's clock (its sound's: raea-runtime-js media_play.rs), each a `time` news for the element's currentTime, with
//! `timeupdate` four times a second as a browser's, `playing` once it's going, and `ended` at its end. raea-runtime-dom's
//! page host keeps one `Medias` and syncs it after each commit.

use std::collections::HashMap;
use std::sync::Arc;

use blitz_dom::BaseDocument;
use blitz_dom::node::{ImageData, RasterImageData, SpecialElementData};
use raea_runtime_js::media_html::stream::{Cmd, Msg, Stream};
use serde_json::{Value, json};

use raea_sys_page::ops::Nodes;

/// One media element's source and what its decoder has told.
pub struct Media {
    src: String,
    /// `__load` as last seen (the dom layer's load() count)
    load: u64,
    poster: Option<String>,
    seek: Option<Value>,
    stream: Option<Stream>,
    video: bool,
    loaded: bool,
    /// a seek asked and not landed yet
    seeking: Option<f64>,
    /// a seek has landed (the poster's gone)
    seeked: bool,
    duration: f64,
    /// the latest frame: width, height, pixels
    frame: Option<(u32, u32, Arc<Vec<u8>>)>,
    /// `__play` as last seen, and whether it asks to play
    play: Option<Value>,
    playing: bool,
    muted: Option<bool>,
    volume: Option<f64>,
    /// when the last `timeupdate` went
    told: Option<std::time::Instant>,
}

impl Media {
    /// Whether `t` is where the seek asked for landed (it's then asked no more).
    fn landed(&mut self, t: f64) -> bool {
        self.seeking.take_if(|s| (*s - t).abs() < 1e-9).is_some()
    }
}

/// Each media element by its wire id.
pub type Medias = HashMap<u64, Media>;

/// The elements' sources and seeks brought up to their props, and what their decoders told since: the `media` events
/// for the element's JS in `out`, and each video's picture set.
/// `draw`: a video's frames are its picture; false when the page's caller places them itself (html.rs, each at the
/// time a seek asks, not when a stream gets there), and only the events go to the JS.
pub fn sync(doc: &mut BaseDocument, nodes: &Nodes, medias: &mut Medias, out: &mut Vec<Value>, draw: bool) {
    medias.retain(|id, _| nodes.by_id.contains_key(id));
    for id in nodes.media_ids() {
        let video = nodes.kind(id) == Some("video");
        let props = nodes.props.get(&id);
        let s = |k: &str| props.and_then(|p| p.get(k)).and_then(Value::as_str).filter(|v| !v.is_empty()).map(String::from);
        let (src, poster, seek) = (s("src").unwrap_or_default(), s("poster"), props.and_then(|p| p.get("__seek")).cloned());
        // load(): its source opened again, even the same one
        let load = props.and_then(|p| p.get("__load")).and_then(Value::as_u64).unwrap_or(0);
        let m = match medias.get_mut(&id) {
            Some(m) if m.src == src && m.load == load => m,
            _ => {
                let stream = (!src.is_empty()).then(|| raea_runtime_js::media_html::stream::open(&raea_sys_page::net::page_path(&src), video)).flatten();
                medias.insert(id, Media { src, load, poster: None, seek: None, stream, video, loaded: false, seeking: None, seeked: false, duration: f64::NAN, frame: None, play: None, playing: false, muted: None, volume: None, told: None });
                medias.get_mut(&id).unwrap()
            }
        };
        let mut redraw = false;
        if m.poster != poster {
            m.poster = poster;
            redraw = true;
        }
        let muted = props.and_then(|p| p.get("__muted")).and_then(Value::as_bool);
        if m.muted != muted {
            if let (Some(v), Some(st)) = (muted, m.stream.as_mut()) {
                st.ask(Cmd::Muted(v));
            }
            m.muted = muted;
        }
        let volume = props.and_then(|p| p.get("__volume")).and_then(Value::as_f64);
        if m.volume != volume {
            if let (Some(v), Some(st)) = (volume, m.stream.as_mut()) {
                st.ask(Cmd::Volume(v as f32));
            }
            m.volume = volume;
        }
        if m.seek != seek {
            if let Some(t) = seek.as_ref().and_then(|v| v.get(0)).and_then(Value::as_f64)
                && let Some(st) = m.stream.as_mut()
            {
                m.seeking = Some(t);
                st.ask(Cmd::Seek(t));
            }
            m.seek = seek;
        }
        let play = props.and_then(|p| p.get("__play")).cloned();
        if m.play != play {
            if let (Some(p), Some(st)) = (play.as_ref(), m.stream.as_mut()) {
                m.playing = p.get(0).and_then(Value::as_bool).unwrap_or(false);
                if m.playing {
                    st.ask(Cmd::Play { at: p.get(1).and_then(Value::as_f64).unwrap_or(0.0), looping: p.get(3).and_then(Value::as_bool).unwrap_or(false) });
                } else {
                    st.ask(Cmd::Pause);
                }
            }
            m.play = play;
        }
        while let Some(msg) = m.stream.as_ref().and_then(Stream::next) {
            match msg {
                Msg::Meta { w, h, duration } => {
                    m.duration = duration;
                    out.push(if m.video { json!({"id": id, "type": "loadedmetadata", "w": w, "h": h, "duration": duration}) } else { json!({"id": id, "type": "loadedmetadata", "duration": duration}) });
                }
                Msg::Fail(err) => {
                    bevy::log::warn!("raea-page: media: {err}");
                    out.push(json!({"id": id, "type": "error", "message": err}));
                }
                Msg::Frame(t, f) => {
                    let (w, h) = (f.width, f.height);
                    m.frame = Some((w, h, Arc::new(f.rgba)));
                    redraw = true;
                    if !m.loaded {
                        m.loaded = true;
                        out.push(json!({"id": id, "type": "loadeddata", "w": w, "h": h, "duration": m.duration}));
                    }
                    if m.landed(t) {
                        m.seeked = true;
                        out.push(json!({"id": id, "type": "seeked", "time": t}));
                    }
                    if m.playing {
                        m.seeked = true;
                        told(m, id, t, out);
                    }
                }
                Msg::Time(t) => {
                    if m.landed(t) {
                        out.push(json!({"id": id, "type": "seeked", "time": t}));
                    }
                    if m.playing {
                        told(m, id, t, out);
                    } else {
                        out.push(json!({"id": id, "type": "time", "time": t}));
                    }
                }
                Msg::Playing(t) => out.push(json!({"id": id, "type": "playing", "time": t})),
                Msg::Ended(t) => {
                    m.playing = false;
                    out.push(json!({"id": id, "type": "ended", "time": t}));
                }
            }
        }
        if redraw && m.video && draw {
            let pic = match (&m.poster, m.seeked) {
                (Some(p), false) => poster_image(p).map(|(w, h, px)| (w, h, Arc::new(px))),
                _ => None,
            }
            // the frame's pixels shared, not copied again (a 4K frame is 33 MB)
            .or_else(|| m.frame.as_ref().map(|(w, h, px)| (*w, *h, px.clone())));
            if let (Some((w, h, px)), Some(n)) = (pic, nodes.by_id.get(&id)) {
                set_image(doc, *n, w, h, px);
            }
        }
    }
}

/// A playing element's time: each as `time` (its currentTime), and a `timeupdate` four times a second.
fn told(m: &mut Media, id: u64, t: f64, out: &mut Vec<Value>) {
    out.push(json!({"id": id, "type": "time", "time": t}));
    if m.told.is_none_or(|w| w.elapsed() >= std::time::Duration::from_millis(250)) {
        m.told = Some(std::time::Instant::now());
        out.push(json!({"id": id, "type": "timeupdate", "time": t}));
    }
}

/// A poster's picture, decoded as an img's source is.
fn poster_image(src: &str) -> Option<(u32, u32, Vec<u8>)> {
    let (mime, bytes) = match raea_io_net::data_url(src) {
        Some(d) => d,
        None => {
            let path = raea_sys_page::net::page_path(src);
            let ext = path.rsplit_once('.')?.1.to_ascii_lowercase();
            (format!("image/{ext}"), std::fs::read(&path).ok()?)
        }
    };
    let img = raea_sys_image::decode::decode(&bytes, &mime)?;
    let size = img.size();
    Some((size.x, size.y, img.data?))
}

/// Node `n` drawn as an image: `rgba` as its raster, its layout made again for the picture's size.
fn set_image(doc: &mut BaseDocument, n: blitz_dom::NodeId, w: u32, h: u32, rgba: Arc<Vec<u8>>) {
    let Some(node) = doc.get_node_mut(n) else { return };
    let Some(el) = node.element_data_mut() else { return };
    el.special_data = SpecialElementData::Image(Box::new(ImageData::Raster(RasterImageData { width: w, height: h, data: vello::peniko::Blob::new(rgba) })));
    node.clear_layout_cache();
    node.insert_damage(raea_sys_page::ALL_DAMAGE);
    node.mark_ancestors_dirty();
}
