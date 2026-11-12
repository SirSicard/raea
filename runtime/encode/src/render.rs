//! An edit rendered to a file or a folder of frames: by Bevy (the engine) or, without 3D, the direct GPU or CPU path,
//! with its sound, encoded as the options say.

use super::*;
use raea_runtime_view::{cpuview, gpuview};

/// A render's timings as one JSON line on stderr, with RAEA_RENDER_STATS=1 (the benches read it; a person's terminal
/// shows only what the render made)
fn print_stats(line: serde_json::Value) {
    if std::env::var("RAEA_RENDER_STATS").as_deref() == Ok("1") {
        eprintln!("{line}");
    }
}

/// Render a loaded edit (see `render_file`; `dir` is where its relative media paths start).
pub fn render(prog: &Program, rows: &[Tup], dir: &Path, out: &Path, ro: &RenderOpts) -> Result<(), String> {
    render_with(prog, rows, dir, out, ro, None)
}

/// The direct render with its pages handed over on the GPU: `feed` gives frame f's page (premultiplied RGBA8 packed,
/// on the paint device, quads::page_buffer) just before f composites, so the pages go from the paint to the encoder
/// with no file and no readback but the NV12 the encoder takes (gate 5 of no-V8: renders hand pages over as
/// textures). `prog` is the picture's program (its size, rate, length and background; no rows: the page is the
/// picture), and `sound_of` the sound's, asked for once the last frame is made (the caller learns it from the frames):
/// a track mixed and mastered already (the one mixer core's bounce, raea-mixer).
/// The composite is premultiplied; a PNG holds straight colour. Only a transparent clear (render --alpha) leaves alpha
/// under 255, so an opaque frame is written as it comes.
fn straight(mut px: Vec<u8>) -> Vec<u8> {
    for p in px.chunks_exact_mut(4) {
        let a = p[3] as u32;
        if a > 0 && a < 255 {
            for c in &mut p[..3] {
                *c = ((*c as u32 * 255 + a / 2) / a).min(255) as u8;
            }
        }
    }
    px
}

/// A direct render's frame `f`: to the encoder's queue, or with none (an .txt out) its NV12 hash to `lines`.
fn direct_sink(tx: Option<&std::sync::mpsc::SyncSender<Vec<u8>>>, lines: &mut Vec<String>, f: i64, px: Vec<u8>) -> Result<(), String> {
    if let Some(tx) = tx {
        return tx.send(px).map_err(|_| "the encoder stopped".to_string());
    }
    let mut hsh = 0xcbf2_9ce4_8422_2325u64;
    for b in &px {
        hsh ^= *b as u64;
        hsh = hsh.wrapping_mul(0x100_0000_01b3);
    }
    lines.push(format!("{f} {hsh:016x}"));
    Ok(())
}

/// A render that failed after `n` frames reached `out` (#33): its error, and what of it is there, so a long render that
/// fails near its end keeps what it drew and says so
fn kept_note(e: String, out: &Path, n: usize) -> String {
    match n {
        0 => format!("{e}; no frame was written"),
        _ => format!("{e}; the {n} frames drawn before it are in {} (the render stops there)", out.display()),
    }
}

pub fn render_fed(
    prog: &Program,
    dir: &Path,
    out: &Path,
    ro: &RenderOpts,
    feed: impl FnMut(i64) -> Result<wgpu::Buffer, String>,
    sound_of: impl FnOnce() -> Result<Option<raea_io_media::Audio>, String>,
) -> Result<(), String> {
    if gpuview::paint_device().is_none() {
        return Err("a fed render needs the paint device on the GPU".into());
    }
    let list: Vec<i64> = ro.frames.clone().unwrap_or_else(|| (0..prog.frames).collect());
    let t0 = std::time::Instant::now();
    let mut v = gpuview::GpuView::new(prog, &[], dir)?;
    let (w, h) = (v.w, v.h);
    let hashes = out.extension().is_some_and(|x| x == "txt");
    let ten = ro.wants_10bit() && !hashes;
    v.ten_bit = ten;
    let setup_s = t0.elapsed().as_secs_f64();
    let mut lines = Vec::new();
    // the encoder on its own thread; the sound reaches it after the frames (the mix waits on every frame's sounds)
    let mut tx = None;
    let mut enc_thread = None;
    let (mix_tx, mix_rx) = std::sync::mpsc::channel::<Option<raea_io_media::Audio>>();
    if !hashes {
        let codec = ro.codec.clone().unwrap_or_else(raea_sys_frame::media_backend);
        let opts = ro.encode_opts(w, h, prog.fps, true, false, ten);
        let (t, rx) = std::sync::mpsc::sync_channel::<Vec<u8>>(4);
        tx = Some(t);
        let out = out.to_path_buf();
        enc_thread = Some(std::thread::spawn(move || -> Result<(raea_io_media::EncodeStats, f64), String> {
            let mut enc = direct_encoder(&codec, &out, &opts, ten)?;
            for px in rx {
                push_direct(&mut enc, &px, w, h, ten)?;
            }
            let mix = mix_rx.recv().map_err(|_| "the sound never came".to_string())?;
            let t = std::time::Instant::now();
            let st = enc.finish(mix.as_ref())?;
            Ok((st, t.elapsed().as_secs_f64()))
        }));
    }
    let t_frames = std::time::Instant::now();
    let mut n = 0;
    let dt = v.render_nv12_fed(&list, feed, |f, px| {
        n += 1;
        direct_sink(tx.as_ref(), &mut lines, f, px)
    });
    drop(tx);
    let sent = match dt {
        Ok(_) if !hashes => {
            let ta = std::time::Instant::now();
            let mix = sound_of()?;
            let _ = mix_tx.send(mix);
            Some(ta.elapsed().as_secs_f64())
        }
        // a failed render's frames are finished as they are, without sound (#33)
        _ => {
            let _ = mix_tx.send(None);
            None
        }
    };
    drop(mix_tx);
    let joined = match enc_thread {
        Some(j) => Some(j.join().map_err(|_| "the encoder panicked".to_string())?),
        None => None,
    };
    if let Err(e) = dt {
        if hashes {
            let _ = std::fs::write(out, lines.join("\n") + "\n");
        }
        return Err(kept_note(e, out, n));
    }
    let dt = dt?;
    let joined = joined.transpose()?;
    let finish_s = joined.as_ref().map(|j| j.1).unwrap_or(0.0);
    let frames_s = t_frames.elapsed().as_secs_f64() - finish_s - sent.unwrap_or(0.0);
    let stats = joined.map(|j| j.0);
    if hashes {
        std::fs::write(out, lines.join("\n") + "\n").map_err(|e| e.to_string())?;
    }
    print_stats(serde_json::json!({"direct": true, "fed": true, "frames": list.len(), "fps_incl_encode": list.len() as f64 / frames_s, "setup_s": setup_s, "finish_s": finish_s, "sound_s": sent,
        "bytes": stats.as_ref().map(|s| s.bytes), "video": stats.as_ref().map(|s| s.video_codec.clone()), "times": dt.json()}));
    Ok(())
}

/// As render; with a page (an HTML composition's own paint, html.rs) as the overlay over the clips, on the direct path.
pub fn render_with(prog: &Program, rows: &[Tup], dir: &Path, out: &Path, ro: &RenderOpts, page: Option<crate::html::HtmlPage>) -> Result<(), String> {
    // no frame of this render known to be the scene's own black yet (engine.rs `black_checked`)
    raea_gpu_device::check::scene_black(Some(false));
    raea_gpu_device::check::mem_fits(prog.width, prog.height, None)?;
    let (prog, rows) = (prog.clone(), rows.to_vec());
    let list: Vec<i64> = ro.frames.clone().unwrap_or_else(|| (0..prog.frames).collect());
    // every frame evaluated once, shared by the picture and the sound
    let tl = std::sync::Arc::new(timeline::Timeline::new(&prog, &rows)?);
    // a whole render says where the picture or the sound has nothing in it (an agent can't hear a silent tail)
    if ro.frames.is_none() {
        for w in coverage(&prog, &tl) {
            println!("warning: {w}");
        }
    }
    // frames in order reuse almost nothing from the pool: a small budget (RAEA_POOL_MB still wins)
    raea_runtime_view::LINEAR_RENDER.store(list.windows(2).all(|p| p[1] > p[0]), std::sync::atomic::Ordering::Relaxed);
    // the direct render is the default for edits without 3D going to video or hashes: the same bytes as the engine's
    // GPU path (the gate checks both against G8's reference), 1.8x the frames a second (a CJ concept: 197 fps vs 107)
    // (the engine's own path when one of its options is asked for: RAEA_READBACK, RAEA_COMPOSITE choose its stages)
    let engine_opts = std::env::var_os("RAEA_READBACK").is_some() || std::env::var_os("RAEA_COMPOSITE").is_some();
    let to_direct = out.extension().is_some_and(|x| matches!(x.to_str(), Some("mp4" | "mov" | "txt"))) && !ro.ssim && !engine::has_3d(&rows) && !engine_opts;
    // the CPU render (docs/cpu.feature C1): RAEA_CPU, or a machine with no GPU adapter; the same frames as the GPU's
    let cpu = page.is_none() && (std::env::var_os("RAEA_CPU").is_some() || ((to_direct || std::env::var_os("RAEA_DIRECT").is_some()) && !raea_sys_k::Gpu::available()));
    if cpu {
        let t0 = std::time::Instant::now();
        let mut v = cpuview::CpuView::new(&prog, &rows, dir)?;
        v.share_timeline(tl.clone());
        let (w, h) = (v.w, v.h);
        let setup_s = t0.elapsed().as_secs_f64();
        let hashes = out.extension().is_some_and(|x| x == "txt");
        let ten = ro.wants_10bit() && !hashes;
        v.ten_bit = ten;
        let mut lines = Vec::new();
        let mut tx = None;
        let mut enc_thread = None;
        if !hashes {
            let mix = match &ro.sound { Some(a) => Some(a.clone()), None => sound_tl(&prog, &tl, &rows, dir)? };
            let codec = ro.codec.clone().unwrap_or_else(raea_sys_frame::media_backend);
            let opts = ro.encode_opts(w, h, prog.fps, true, false, ten);
            let (t, rx) = std::sync::mpsc::sync_channel::<Vec<u8>>(4);
            tx = Some(t);
            let out = out.to_path_buf();
            enc_thread = Some(std::thread::spawn(move || -> Result<raea_io_media::EncodeStats, String> {
                let mut enc = direct_encoder(&codec, &out, &opts, ten)?;
                for px in rx {
                    push_direct(&mut enc, &px, w, h, ten)?;
                }
                enc.finish(mix.as_ref())
            }));
        }
        let t_frames = std::time::Instant::now();
        let tm = v.render_nv12(&list, |f, px| {
            if let Some(tx) = tx.as_ref() {
                return tx.send(px).map_err(|_| "the encoder stopped".to_string());
            }
            let mut hsh = 0xcbf2_9ce4_8422_2325u64;
            for b in &px {
                hsh ^= *b as u64;
                hsh = hsh.wrapping_mul(0x100_0000_01b3);
            }
            lines.push(format!("{f} {hsh:016x}"));
            Ok(())
        })?;
        drop(tx);
        let stats = match enc_thread {
            Some(j) => Some(j.join().map_err(|_| "the encoder panicked".to_string())??),
            None => None,
        };
        let frames_s = t_frames.elapsed().as_secs_f64();
        if hashes {
            std::fs::write(out, lines.join("\n") + "\n").map_err(|e| e.to_string())?;
        }
        print_stats(serde_json::json!({"direct": true, "cpu": true, "frames": list.len(), "fps_incl_encode": list.len() as f64 / frames_s, "setup_s": setup_s,
            "bytes": stats.as_ref().map(|s| s.bytes), "video": stats.as_ref().map(|s| s.video_codec.clone()), "times": tm.json()}));
        return Ok(());
    }
    if std::env::var_os("RAEA_DIRECT").is_some() || page.is_some() || to_direct {
        // the direct render (edits without 3D): gpuview's pool and kernels, no Bevy schedules; NV12 to the encoder
        let t0 = std::time::Instant::now();
        let mut v = gpuview::GpuView::new(&prog, &rows, dir)?;
        if let Some(p) = page {
            v.set_page(p);
        }
        v.share_timeline(tl.clone());
        let (w, h) = (v.w, v.h);
        let setup_s = t0.elapsed().as_secs_f64();
        let hashes = out.extension().is_some_and(|x| x == "txt");
        // PNGs (#32): OUT.png is one frame (the first unless --at names it), a folder one PNG a frame, each read back
        // as the composite's RGBA
        let still = out.extension().is_some_and(|x| x == "png");
        let pngs = still || !out.extension().is_some_and(|x| matches!(x.to_str(), Some("mp4" | "mov" | "txt")));
        let list = if still && ro.frames.is_none() { vec![0] } else { list };
        if still && list.len() != 1 {
            return Err(format!("{} is one frame, and {} were asked for: --at one frame, or -o a folder for several", out.display(), list.len()));
        }
        if pngs && !still {
            std::fs::create_dir_all(out).map_err(|e| format!("{}: {e}", out.display()))?;
        }
        let ten = ro.wants_10bit() && !hashes && !pngs;
        (v.ten_bit, v.rgba) = (ten, pngs);
        let mut lines = Vec::new();
        // the encoder on its own thread (frames over a short queue), so encoding overlaps the next frames
        let mut tx = None;
        let mut enc_thread = None;
        if !hashes && !pngs {
            let mix = match &ro.sound { Some(a) => Some(a.clone()), None => sound_tl(&prog, &tl, &rows, dir)? };
            let codec = ro.codec.clone().unwrap_or_else(raea_sys_frame::media_backend);
            let opts = ro.encode_opts(w, h, prog.fps, true, engine::has_3d(&rows), ten);
            let (t, rx) = std::sync::mpsc::sync_channel::<Vec<u8>>(4);
            tx = Some(t);
            let out = out.to_path_buf();
            enc_thread = Some(std::thread::spawn(move || -> Result<(raea_io_media::EncodeStats, f64), String> {
                let mut enc = direct_encoder(&codec, &out, &opts, ten)?;
                for px in rx {
                    push_direct(&mut enc, &px, w, h, ten)?;
                }
                let t = std::time::Instant::now();
                let st = enc.finish(mix.as_ref())?;
                Ok((st, t.elapsed().as_secs_f64()))
            }));
        }
        let t_frames = std::time::Instant::now();
        let mut n = 0;
        let dt = v
            .render_nv12(&list, |f, px| {
                match pngs {
                    true => save_png(&if still { out.to_path_buf() } else { out.join(format!("frame-{f:05}.png")) }, &straight(px), w, h)?,
                    false => direct_sink(tx.as_ref(), &mut lines, f, px)?,
                }
                n += 1;
                Ok(())
            });
        let t = std::time::Instant::now();
        drop(tx);
        let joined = match enc_thread {
            Some(j) => Some(j.join().map_err(|_| "the encoder panicked".to_string())??),
            None => None,
        };
        // a failed render: the encoder has finished the frames it got (#33)
        let dt = match dt {
            Ok(dt) => dt,
            Err(e) => {
                if hashes {
                    let _ = std::fs::write(out, lines.join("\n") + "\n");
                }
                return Err(kept_note(e, out, n));
            }
        };
        // frames: until the last frame is encoded (the queue drained), without the file's finishing
        let finish_s = joined.as_ref().map(|j| j.1).unwrap_or(0.0);
        let frames_s = t_frames.elapsed().as_secs_f64() - finish_s;
        let drain_s = t.elapsed().as_secs_f64() - finish_s;
        let stats = joined.map(|j| j.0);
        if hashes {
            std::fs::write(&out, lines.join("\n") + "\n").map_err(|e| e.to_string())?;
        }
        print_stats(serde_json::json!({"direct": true, "frames": list.len(), "fps_incl_encode": list.len() as f64 / frames_s, "setup_s": setup_s, "finish_s": finish_s, "encoder_drain_s": drain_s,
            "bytes": stats.as_ref().map(|s| s.bytes), "video": stats.as_ref().map(|s| s.video_codec.clone()), "times": dt.json(), "pool_mb": v.pool_bytes as f64 / 1e6, "upload_cpu_ms_per_upload": v.upload_cpu_ms / dt.uploads.max(1) as f64}));
        return Ok(());
    }
    // stills and folders of PNGs come back as RGBA; the encoder (and .txt frame hashes, kept comparable) take NV12.
    // RAEA_READBACK=nv12 brings stills back through NV12 too, as P26's references before 3c7d15cf were taken
    let video = out.extension().is_some_and(|x| matches!(x.to_str(), Some("mp4" | "mov" | "txt")));
    let nv12_stills = std::env::var("RAEA_READBACK").is_ok_and(|v| v == "nv12");
    raea_sys_frame::STILLS_RGBA.store(!video && !nv12_stills, std::sync::atomic::Ordering::Relaxed);
    let mut e = engine::Engine::new_shared(&prog, &rows, dir, Some(tl.clone()))?;
    let (w, h) = e.size();
    let t0 = std::time::Instant::now();
    if out.extension().is_some_and(|x| x == "mp4") {
        // the sound: every clip or audio row with a gain, its gain read off the rules frame by frame
        let ta = std::time::Instant::now();
        let mix = match &ro.sound { Some(a) => Some(a.clone()), None => sound_tl(&prog, &tl, &rows, dir)? };
        let audio_s = ta.elapsed().as_secs_f64();
        engine::mem_mark("render: audio mixed");
        let codec = ro.codec.clone().unwrap_or_else(raea_sys_frame::media_backend);
        let opts = ro.encode_opts(w, h, prog.fps, e.nv12, engine::has_3d(&rows), false);
        if ro.wants_10bit() {
            eprintln!("warning: 10-bit export: this render goes through the engine (3D, --ssim or RAEA_READBACK/RAEA_COMPOSITE), which makes 8-bit NV12; encoding 8-bit H.264");
        }
        let mut enc = raea_io_media::backend(&codec).and_then(|b| b.encoder(&out, &opts))?;
        engine::mem_mark("render: encoder made");
        let mut encode_s = 0.0;
        let t_all = std::time::Instant::now();
        // --ssim: keep every 30th frame uncompressed, and compare the encoded file's frames with them after
        let keep = ro.ssim;
        let mut kept: Vec<(i64, Vec<u8>)> = Vec::new();
        let nv12 = e.nv12;
        let mut n = 0;
        let drawn = e.frames(&list, |f, px| {
            n += 1;
            if keep && f % 30 == 0 {
                kept.push((f, px.clone()));
            }
            let t = std::time::Instant::now();
            let r = if nv12 { enc.push_nv12(&px, w as usize, h as usize) } else { enc.push(&px) };
            encode_s += t.elapsed().as_secs_f64();
            r
        });
        if let Err(e) = drawn {
            // the frames encoded so far finished as a file (#33)
            return Err(kept_note(e, &out, enc.finish(mix.as_ref()).map_or(0, |_| n)));
        }
        let render_s = t_all.elapsed().as_secs_f64() - encode_s;
        let t = std::time::Instant::now();
        let stats = enc.finish(mix.as_ref())?;
        encode_s += t.elapsed().as_secs_f64();
        let n = list.len() as f64;
        let st = e.stages();
        let ms = |ns: u64| ns as f64 / 1e6 / st.frames.max(1) as f64;
        let convert = raea_io_media::CONVERT_NS.load(std::sync::atomic::Ordering::Relaxed);
        let enc_convert = raea_io_media::ENCODE_CONVERT_NS.load(std::sync::atomic::Ordering::Relaxed);
        let stages = serde_json::json!({
            "frames": st.frames, "updates_per_frame": st.updates as f64 / st.frames.max(1) as f64,
            "rules": ms(st.rules), "decode": ms(st.clips.saturating_sub(st.clip_prep).saturating_sub(convert)),
            "yuv_to_rgba": ms(convert), "clip_texture_write": ms(st.clip_prep), "overlay": ms(st.overlay),
            "main_world_total": ms(st.main), "render_world": ms(st.update.saturating_sub(st.main)),
            "readback_copy": ms(st.readback_copy), "readback_bytes": if e.nv12 { (w * h / 4 + w * h / 8 + 1) as usize * 4 } else { (w as usize * 4).div_ceil(256) * 256 * (h as usize + 1) },
            "gpu_wait_serial": ms(st.gpu_wait),
            "encode_rgba_convert": ms(enc_convert), "encode_total": encode_s * 1e3 / st.frames.max(1) as f64,
            "wall_per_frame": t0.elapsed().as_secs_f64() * 1e3 / n,
        });
        let ssim = if keep {
            let mut d = raea_io_media::backend("ffmpeg").and_then(|b| b.open_video(&out))?;
            let v: Vec<f64> = kept
                .iter()
                .map(|(f, px)| -> Result<f64, String> {
                    let fr = d.frame_at(*f as f64 / prog.fps)?;
                    Ok(raea_io_media::ssim(&e.to_rgba(px), &fr.rgba, w as usize, h as usize))
                })
                .collect::<Result<_, _>>()?;
            Some(v.iter().sum::<f64>() / v.len().max(1) as f64)
        } else {
            None
        };
        print_stats(
            serde_json::json!({"frames": list.len(), "video": stats.video_codec, "audio": stats.audio_codec, "bytes": stats.bytes,
                "render_fps": n / render_s, "overlay_drawn_reused": e.overlay_stats(), "stages_ms_per_frame": stages, "pool_uploads_reuses_bytes": e.pool_stats(), "gpu_stage_ms": e.gpu_stage_times().map(|(m, n)| serde_json::json!({"clip_uploads": m[0], "overlay_upload": m[1], "composite": m[2], "nv12": m[3], "frames": n})), "encode_fps": n / encode_s, "ssim": ssim, "seconds": t0.elapsed().as_secs_f64(), "audio_s": audio_s,
                "lufs": mix.as_ref().map(raea_io_media::audio::lufs), "peak_db": mix.as_ref().map(raea_io_media::audio::peak_db)})
        );
    } else if out.extension().is_some_and(|x| x == "raw") {
        // raw: the frames as they came back (RGBA or NV12), concatenated (for exactness checks)
        let mut f = std::io::BufWriter::new(std::fs::File::create(&out).map_err(|e| e.to_string())?);
        e.frames(&list, |_, px| std::io::Write::write_all(&mut f, &px).map_err(|e| e.to_string()))?;
    } else if out.extension().is_some_and(|x| x == "txt") {
        // hash-only: one line per frame, "frame fnv64-of-rgba", nothing else on disk
        let mut lines = Vec::new();
        let drawn = e.frames(&list, |f, px| {
            let mut h = 0xcbf2_9ce4_8422_2325u64;
            for b in &px {
                h ^= *b as u64;
                h = h.wrapping_mul(0x100_0000_01b3);
            }
            lines.push(format!("{f} {h:016x}"));
            Ok(())
        });
        std::fs::write(&out, lines.join("\n") + "\n").map_err(|e| e.to_string())?;
        if let Err(e) = drawn {
            return Err(kept_note(e, &out, lines.len()));
        }
    } else {
        std::fs::create_dir_all(&out).map_err(|e| e.to_string())?;
        let nv12 = e.nv12;
        let rgba_of = |px: Vec<u8>| if nv12 { raea_io_media::yuv::nv12_to_rgba(&px, w as usize, h as usize) } else { straight(px) };
        let mut n = 0;
        e.frames(&list, |f, px| {
            save_png(&out.join(format!("frame-{f:05}.png")), &rgba_of(px), w, h)?;
            n += 1;
            Ok(())
        })
        .map_err(|e| kept_note(e, &out, n))?;
    }
    eprintln!("{} ({} frames) in {:.2}s", out.display(), list.len(), t0.elapsed().as_secs_f64());
    Ok(())
}
