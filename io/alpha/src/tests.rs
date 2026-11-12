//! CC1: what each codec writes reads back as the frames given (rle and png exactly), and the movie is one QuickTime
//! file a parser walks to its samples.

use super::*;

/// A frame with a soft-edged box that moves, over nothing: straight alpha, a gradient of partial alphas.
fn frame(w: usize, h: usize, at: usize) -> Vec<u8> {
    let mut px = vec![0u8; w * h * 4];
    for y in (h / 4)..(h * 3 / 4) {
        for x in (4 + at)..(40 + at).min(w) {
            let a = (40 + (x - at) * 5).min(255) as u8;
            px[(y * w + x) * 4..(y * w + x) * 4 + 4].copy_from_slice(&[200, 30, (x * 3) as u8, a]);
        }
    }
    px
}

fn tmp(name: &str) -> PathBuf {
    let d = std::env::temp_dir().join(format!("raea-alpha-{}-{name}", std::process::id()));
    let _ = std::fs::remove_file(&d);
    d
}

/// The movie's atoms: (kind, offset of body, body length), top level and inside moov's boxes.
fn walk(data: &[u8], at: usize, end: usize, out: &mut Vec<(String, usize, usize)>) {
    let mut i = at;
    while i + 8 <= end {
        let mut size = u32::from_be_bytes(data[i..i + 4].try_into().unwrap()) as usize;
        let kind = String::from_utf8_lossy(&data[i + 4..i + 8]).into_owned();
        let mut head = 8;
        if size == 1 {
            size = u64::from_be_bytes(data[i + 8..i + 16].try_into().unwrap()) as usize;
            head = 16;
        }
        out.push((kind.clone(), i + head, size - head));
        if matches!(kind.as_str(), "moov" | "trak" | "mdia" | "minf" | "stbl") {
            walk(data, i + head, i + size, out);
        }
        i += size;
    }
}

fn samples(data: &[u8]) -> Vec<Vec<u8>> {
    let mut atoms = vec![];
    walk(data, 0, data.len(), &mut atoms);
    let body = |k: &str| atoms.iter().find(|a| a.0 == k).map(|a| &data[a.1..a.1 + a.2]).unwrap();
    let stsz = body("stsz");
    let n = u32::from_be_bytes(stsz[8..12].try_into().unwrap()) as usize;
    let sizes: Vec<usize> = (0..n).map(|k| u32::from_be_bytes(stsz[12 + k * 4..16 + k * 4].try_into().unwrap()) as usize).collect();
    let co64 = body("co64");
    (0..n).map(|k| { let o = u64::from_be_bytes(co64[8 + k * 8..16 + k * 8].try_into().unwrap()) as usize; data[o..o + sizes[k]].to_vec() }).collect()
}

#[test]
fn rle_reads_back_exactly_and_keeps_still_frames_small() {
    let (w, h) = (64usize, 32usize);
    let out = tmp("rle.mov");
    let mut m = Writer::create(&out, Codec::Rle, w as u32, h as u32, 30.0, 0.9).unwrap();
    // moving, then still for three frames, then an empty frame
    let frames: Vec<Vec<u8>> = (0..4).map(|k| frame(w, h, k * 3)).chain([frame(w, h, 9), frame(w, h, 9), vec![0; w * h * 4]]).collect();
    for f in &frames {
        m.push(f).unwrap();
    }
    assert_eq!(m.finish().unwrap(), frames.len());
    let data = std::fs::read(&out).unwrap();
    let got = samples(&data);
    assert_eq!(got.len(), frames.len());
    let mut img = vec![0u32; w * h];
    for (k, s) in got.iter().enumerate() {
        rle::decode(s, &mut img, w, h);
        assert_eq!(img, rle::argb(&frames[k]), "frame {k}");
    }
    // a frame the same as the one before is its header alone
    assert_eq!(got[5].len(), 7);
    let _ = std::fs::remove_file(&out);
}

#[test]
fn rle_keyframes_decode_alone() {
    let (w, h) = (300usize, 4usize); // a line longer than one skip or run code
    let mut r = rle::Rle::new(w as u32, h as u32);
    let mut px = vec![0u8; w * h * 4];
    for x in 0..w {
        px[(w + x) * 4 + 3] = if x % 7 == 0 { 9 } else { 255 };
    }
    r.frame(&frame(w, h, 0), true);
    let key = r.frame(&px, true);
    let mut img = vec![0xDEAD_BEEFu32; w * h];
    rle::decode(&key, &mut img, w, h);
    assert_eq!(img, rle::argb(&px));
}

#[test]
fn png_movie_holds_each_frame_as_given() {
    let (w, h) = (48usize, 24usize);
    let out = tmp("png.mov");
    let mut m = Writer::create(&out, Codec::Png, w as u32, h as u32, 29.97, 0.9).unwrap();
    let frames: Vec<Vec<u8>> = (0..3).map(|k| frame(w, h, k)).collect();
    for f in &frames {
        m.push(f).unwrap();
    }
    m.finish().unwrap();
    let data = std::fs::read(&out).unwrap();
    for (k, s) in samples(&data).iter().enumerate() {
        let p = tmp(&format!("f{k}.png"));
        std::fs::write(&p, s).unwrap();
        assert_eq!(read_png(&p).unwrap().0, frames[k]);
        let _ = std::fs::remove_file(&p);
    }
    let _ = std::fs::remove_file(&out);
}

#[test]
fn timescales_are_exact() {
    assert_eq!(mov::timescale(30.0), (30000, 1000));
    assert_eq!(mov::timescale(30000.0 / 1001.0), (30000, 1001));
    assert_eq!(mov::timescale(24000.0 / 1001.0), (24000, 1001));
    assert_eq!(mov::timescale(25.0), (25000, 1000));
    assert_eq!(mov::timescale(60.0), (60000, 1000));
}

#[test]
fn videotoolbox_codecs_are_said_off_apple() {
    for c in [Codec::ProRes, Codec::Hevc] {
        assert_eq!(c.here(), cfg!(target_vendor = "apple"));
    }
    assert!(Codec::parse("webm").is_err());
    assert_eq!(Codec::parse("ProRes").unwrap(), Codec::ProRes);
}

#[cfg(target_vendor = "apple")]
#[test]
fn videotoolbox_writes_both_alpha_codecs() {
    for (c, name) in [(Codec::ProRes, "prores.mov"), (Codec::Hevc, "hevc.mov")] {
        let out = tmp(name);
        let mut m = Writer::create(&out, c, 64, 64, 30.0, 0.9).unwrap();
        for k in 0..5 {
            m.push(&frame(64, 64, k)).unwrap();
        }
        assert_eq!(m.finish().unwrap(), 5);
        assert!(std::fs::metadata(&out).unwrap().len() > 100, "{name}");
        let _ = std::fs::remove_file(&out);
    }
}
