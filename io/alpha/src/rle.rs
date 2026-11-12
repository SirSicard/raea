//! QuickTime Animation ('rle ') at 32 bits: lossless ARGB, run-length coded, as FFmpeg's qtrle decoder and
//! QuickTime read it. A keyframe codes every line; a frame after it codes only the lines from the first that changed to
//! the last, skipping the pixels that didn't, so a still title costs almost nothing. A frame:
//!   u32 size (all of it) | u16 header: 0, or 8 then u16 first line, u16 0, u16 lines, u16 0 | the lines | u8 0
//! and a line: u8 skip+1, then codes until -1: n > 0 that many ARGB pixels; n < 0 one pixel repeated -n times; 0 then
//! u8 skip+1. A frame the same as the one before is the header alone (7 bytes), which decoders keep as it was.

/// Pixels as big-endian ARGB words, from straight RGBA.
pub(crate) fn argb(rgba: &[u8]) -> Vec<u32> {
    rgba.as_chunks::<4>().0.iter().map(|p| u32::from_be_bytes([p[3], p[0], p[1], p[2]])).collect()
}

pub(crate) struct Rle {
    width: usize,
    height: usize,
    prev: Option<Vec<u32>>,
}

impl Rle {
    pub(crate) fn new(width: u32, height: u32) -> Rle {
        Rle { width: width as usize, height: height as usize, prev: None }
    }

    /// One frame coded; a keyframe when `key` (or the first).
    pub(crate) fn frame(&mut self, rgba: &[u8], key: bool) -> Vec<u8> {
        let px = argb(rgba);
        let (w, h) = (self.width, self.height);
        let prev = self.prev.as_deref().filter(|_| !key);
        let row = |p: &[u32], y: usize| p[y * w..(y + 1) * w].to_vec();
        let (mut first, mut end) = (0, h);
        if let Some(p) = prev {
            while first < h && px[first * w..(first + 1) * w] == p[first * w..(first + 1) * w] {
                first += 1;
            }
            while end > first && px[(end - 1) * w..end * w] == p[(end - 1) * w..end * w] {
                end -= 1;
            }
        }
        let mut out = vec![0u8; 4];
        if (first == 0 && end == h) || first == h {
            out.extend_from_slice(&0u16.to_be_bytes());
        } else {
            for v in [8u16, first as u16, 0, (end - first) as u16, 0] {
                out.extend_from_slice(&v.to_be_bytes());
            }
        }
        for y in first..end {
            line(&mut out, &row(&px, y), prev.map(|p| row(p, y)).as_deref());
        }
        out.push(0);
        let size = out.len() as u32;
        out[..4].copy_from_slice(&size.to_be_bytes());
        self.prev = Some(px);
        out
    }
}

/// Skip `n` pixels after a line's first skip byte: 0 then skip+1, as many times as it takes (254 at most each).
fn skip(out: &mut Vec<u8>, mut n: usize) {
    while n > 0 {
        let k = n.min(254);
        out.push(0);
        out.push(k as u8 + 1);
        n -= k;
    }
}

/// One line: the pixels that differ from the line before it (all of them on a keyframe), as runs and literals.
fn line(out: &mut Vec<u8>, px: &[u32], prev: Option<&[u32]>) {
    let w = px.len();
    let same = |x: usize| prev.is_some_and(|p| p[x] == px[x]);
    let mut x = 0;
    // the leading skip is the line's first byte (skip + 1, 254 at most), the rest through skip codes
    let mut lead = 0;
    while x < w && same(x) {
        x += 1;
        lead += 1;
    }
    if lead == w {
        // a line between two that changed, itself the same: no skip at all, and its end
        out.extend_from_slice(&[1, 0xFF]);
        return;
    }
    out.push(lead.min(254) as u8 + 1);
    skip(out, lead.saturating_sub(254));
    while x < w {
        // an unchanged stretch worth a skip code (two pixels or more), or the line's unchanged end: nothing to write
        let mut s = x;
        while s < w && same(s) {
            s += 1;
        }
        if s == w {
            break;
        }
        if s > x && s - x >= 2 {
            skip(out, s - x);
            x = s;
            continue;
        }
        // a run of one colour (two or more), or literals up to the next run or unchanged stretch
        let mut r = x + 1;
        while r < w && px[r] == px[x] && r - x < 128 {
            r += 1;
        }
        if r - x >= 2 {
            out.push((-((r - x) as i32)) as i8 as u8);
            out.extend_from_slice(&px[x].to_be_bytes());
            x = r;
            continue;
        }
        let mut e = x + 1;
        while e < w && e - x < 127 && !(e + 1 < w && px[e + 1] == px[e]) && !(same(e) && e + 1 < w && same(e + 1)) {
            e += 1;
        }
        out.push((e - x) as u8);
        for p in &px[x..e] {
            out.extend_from_slice(&p.to_be_bytes());
        }
        x = e;
    }
    out.push(0xFF);
}

/// A frame decoded onto the frame before it (`img`, ARGB words), as FFmpeg's qtrle decoder does: for the tests.
#[cfg(test)]
pub(crate) fn decode(data: &[u8], img: &mut [u32], width: usize, height: usize) {
    if data.len() < 8 {
        return;
    }
    let mut i = 4;
    let rd16 = |i: &mut usize| {
        let v = u16::from_be_bytes([data[*i], data[*i + 1]]) as usize;
        *i += 2;
        v
    };
    let header = rd16(&mut i);
    let (start, lines) = if header & 8 != 0 {
        let s = rd16(&mut i);
        i += 2;
        let n = rd16(&mut i);
        i += 2;
        (s, n)
    } else {
        (0, height)
    };
    for y in start..start + lines {
        let mut x = data[i] as usize - 1;
        i += 1;
        loop {
            let code = data[i] as i8;
            i += 1;
            if code == -1 {
                break;
            }
            if code == 0 {
                x += data[i] as usize - 1;
                i += 1;
            } else if code < 0 {
                let p = u32::from_be_bytes([data[i], data[i + 1], data[i + 2], data[i + 3]]);
                i += 4;
                for _ in 0..(-(code as i32)) {
                    img[y * width + x] = p;
                    x += 1;
                }
            } else {
                for _ in 0..code {
                    img[y * width + x] = u32::from_be_bytes([data[i], data[i + 1], data[i + 2], data[i + 3]]);
                    i += 4;
                    x += 1;
                }
            }
        }
    }
}
