//! The render path's kernels as plain Rust, bit-equal to the K text (the CPU render, docs/cpu.feature C1).

/// kernels/nv12.k as plain Rust, on `threads` threads (the CPU render, docs/cpu.feature C1): the same fixed-point
/// formula per output word (with the kernel's ordered dither), the words split into bands; bit-equal.
pub fn nv12_cpu(rgba: &[u32], w: usize, h: usize, threads: usize) -> Vec<u32> {
    let ch = |c: u32, s: u32| ((c >> s) & 255) as i32;
    // the kernel's 4x4 ordered dither (in place of a fixed +128 / +512 rounding): 0..15 by (x, y) mod 4
    let bayer = |x: usize, y: usize| -> i32 {
        let e = (x & 3) ^ (y & 3);
        (8 * (e & 1) + 4 * (y & 1) + 2 * ((e >> 1) & 1) + ((y >> 1) & 1)) as i32
    };
    let luma = |c: u32, x: usize, y: usize| (16 + ((47 * ch(c, 0) + 157 * ch(c, 8) + 16 * ch(c, 16) + 16 * bayer(x, y) + 8) >> 8)).clamp(0, 255) as u32;
    let (ny, nuv) = (w * h / 4, w * h / 8);
    let mut out = vec![0u32; ny + nuv + 1];
    let cw = w / 2;
    let word = |j: usize| -> u32 {
        if j < ny {
            let p = 4 * j;
            let (y, x) = (p / w, p % w);
            let px = |d: usize| rgba[y * w + x + d];
            return luma(px(0), x, y) | luma(px(1), x + 1, y) << 8 | luma(px(2), x + 2, y) << 16 | luma(px(3), x + 3, y) << 24;
        }
        let j = j - ny;
        let mut wd = 0u32;
        for k in 0..2 {
            let s = 2 * j + k;
            let (cr, cc) = (s / cw, s % cw);
            let t = [rgba[2 * cr * w + 2 * cc], rgba[2 * cr * w + 2 * cc + 1], rgba[(2 * cr + 1) * w + 2 * cc], rgba[(2 * cr + 1) * w + 2 * cc + 1]];
            let sum = |sh: u32| t.iter().map(|c| ch(*c, sh)).sum::<i32>();
            let (r, g, b) = (sum(0), sum(8), sum(16));
            let q = 64 * bayer(cc, cr) + 32;
            let u = (128 + ((-26 * r - 87 * g + 112 * b + q) >> 10)).clamp(0, 255) as u32;
            let v = (128 + ((112 * r - 102 * g - 10 * b + q) >> 10)).clamp(0, 255) as u32;
            wd |= (u | v << 8) << (16 * k);
        }
        wd
    };
    let n = ny + nuv;
    let per = n.div_ceil(threads.max(1));
    std::thread::scope(|sc| {
        for (b, chunk) in out[..n].chunks_mut(per).enumerate() {
            let word = &word;
            sc.spawn(move || {
                for (i, o) in chunk.iter_mut().enumerate() {
                    *o = word(b * per + i);
                }
            });
        }
    });
    out[n] = rgba[h * w + 8];
    out
}

/// kernels/p010buf.k as plain Rust, on `threads` threads: RGBA ((w x (h+1)) packed words, the last row carrying the
/// frame tag at x = 8) to P010 words (two 16-bit luma samples a word, then one Cb Cr pair a word; 10-bit BT.709
/// limited range in each sample's top 10 bits), the tag last. Bit-equal to the kernel.
pub fn p010_cpu(rgba: &[u32], w: usize, h: usize, threads: usize) -> Vec<u32> {
    let ch = |c: u32, s: u32| ((c >> s) & 255) as i32;
    let luma = |c: u32| (64 + ((47864 * ch(c, 0) + 161017 * ch(c, 8) + 16255 * ch(c, 16) + 32768) >> 16)) as u32;
    let (ny, nuv) = (w * h / 2, w * h / 4);
    let mut out = vec![0u32; ny + nuv + 1];
    let cw = w / 2;
    let word = |j: usize| -> u32 {
        if j < ny {
            let p = 2 * j;
            return luma(rgba[p]) << 6 | luma(rgba[p + 1]) << 22;
        }
        let j = j - ny;
        let (cr, cc) = (j / cw, j % cw);
        let t = [rgba[2 * cr * w + 2 * cc], rgba[2 * cr * w + 2 * cc + 1], rgba[(2 * cr + 1) * w + 2 * cc], rgba[(2 * cr + 1) * w + 2 * cc + 1]];
        let sum = |sh: u32| t.iter().map(|c| ch(*c, sh)).sum::<i32>();
        let (r, g, b) = (sum(0), sum(8), sum(16));
        let u = (512 + ((-26383 * r - 88755 * g + 115138 * b + 131072) >> 18)) as u32;
        let v = (512 + ((115138 * r - 104581 * g - 10557 * b + 131072) >> 18)) as u32;
        u << 6 | v << 22
    };
    let n = ny + nuv;
    let per = n.div_ceil(threads.max(1));
    std::thread::scope(|sc| {
        for (b, chunk) in out[..n].chunks_mut(per).enumerate() {
            let word = &word;
            sc.spawn(move || {
                for (i, o) in chunk.iter_mut().enumerate() {
                    *o = word(b * per + i);
                }
            });
        }
    });
    out[n] = rgba[h * w + 8];
    out
}

/// One clip slot of the composite (the 12 words of kernels/composite.k's C buffer).
#[derive(Clone, Copy, Debug, Default)]
pub struct Slot {
    pub on: i32,
    pub bx: i32,
    pub by: i32,
    pub ex: i32,
    pub ey: i32,
    pub sw: i32,
    pub sh: i32,
    pub cx: i32,
    pub cy: i32,
    pub dx: i32,
    pub dy: i32,
    pub al: i32,
}

impl Slot {
    pub fn words(&self) -> [i32; 12] {
        [self.on, self.bx, self.by, self.ex, self.ey, self.sw, self.sh, self.cx, self.cy, self.dx, self.dy, self.al]
    }
    /// A slot that draws nothing (and reads inside a 4x4 dummy plane: give it at least 24 bytes).
    pub fn off() -> Slot {
        Slot { sw: 4, sh: 4, ..Default::default() }
    }
}

/// A masked slot's opacity (on = 2): byte s of the pixel's mask word is its coverage (none: 0), and opacity scales by
/// it as composite.k does, ((al * cov) + 127) / 255; an unmasked slot keeps its opacity exactly.
#[inline]
fn masked_al(sl: &Slot, s: usize, mask: Option<&[u32]>, i: usize) -> i32 {
    if sl.on > 1 {
        let cov = mask.and_then(|m| m.get(i)).map(|m| ((m >> (8 * s)) & 255) as i32).unwrap_or(0);
        (sl.al * cov + 127) / 255
    } else {
        sl.al
    }
}

/// The composite as plain Rust, on `threads` threads, with M, the per-pixel mask words of masked slots (kernels/composite.k's M).
#[allow(clippy::too_many_arguments)]
pub fn composite_cpu_masked(bg: &[u32], w: usize, h: usize, planes: &[&[u8]], slots: &[Slot], overlay: &[u32], threads: usize, mask: Option<&[u32]>) -> Vec<u32> {
    let cl = |e: i32, lo: i32, hi: i32| e.max(lo).min(hi);
    let mut out = bg[..w * h].to_vec();
    let threads = threads.max(1).min(h.max(1));
    let rows_per = h.div_ceil(threads);
    // per slot, per column of its box: (luma column ax, its weight wx, chroma column qx, its weight vx)
    let cols: Vec<Vec<(i32, i32, i32, i32)>> = slots
        .iter()
        .map(|sl| {
            if sl.on == 0 {
                return Vec::new();
            }
            (sl.bx.max(0)..sl.ex.min(w as i32))
                .map(|x| {
                    let fx = sl.cx.wrapping_add((x - sl.bx).wrapping_mul(sl.dx)).wrapping_add(sl.dx >> 1).wrapping_sub(32768);
                    let ax = cl(fx >> 16, 0, sl.sw - 2);
                    let wx = (((fx >> 8) & 255) * (fx > -1) as i32).clamp(0, 255);
                    let gx = (fx.wrapping_add(32768) >> 1) - 32768;
                    let qx = cl(gx >> 16, 0, sl.sw / 2 - 2);
                    let vx = (((gx >> 8) & 255) * (gx > -1) as i32).clamp(0, 255);
                    (ax, wx, qx, vx)
                })
                .collect()
        })
        .collect();
    std::thread::scope(|sc| {
        for (band, chunk) in out.chunks_mut(rows_per * w).enumerate() {
            let cols = &cols;
            sc.spawn(move || {
                let y0 = band * rows_per;
                let byte = |p: &[u8], k: i32| -> i32 { if k >= 0 && (k as usize) < p.len() { p[k as usize] as i32 } else { 0 } };
                for (s, sl) in slots.iter().enumerate() {
                    if sl.on == 0 {
                        continue;
                    }
                    let p = planes[s];
                    let x0 = sl.bx.max(0);
                    for y in (y0 as i32).max(sl.by)..((y0 + chunk.len() / w) as i32).min(sl.ey) {
                        let fy = sl.cy.wrapping_add((y - sl.by).wrapping_mul(sl.dy)).wrapping_add(sl.dy >> 1).wrapping_sub(32768);
                        let ay = cl(fy >> 16, 0, sl.sh - 2);
                        let wy = (((fy >> 8) & 255) * (fy > -1) as i32).clamp(0, 255);
                        let gy = (fy.wrapping_add(32768) >> 1) - 32768;
                        let qy = cl(gy >> 16, 0, sl.sh / 2 - 2);
                        let vy = (((gy >> 8) & 255) * (gy > -1) as i32).clamp(0, 255);
                        let row = &mut chunk[(y as usize - y0) * w..(y as usize - y0 + 1) * w];
                        for (k, &(ax, wx, qx, vx)) in cols[s].iter().enumerate() {
                            let x = (x0 + k as i32) as usize;
                            let (y00, y10) = (byte(p, ay * sl.sw + ax), byte(p, ay * sl.sw + ax + 1));
                            let (y01, y11) = (byte(p, (ay + 1) * sl.sw + ax), byte(p, (ay + 1) * sl.sw + ax + 1));
                            let ly = (y00 * (256 - wx) * (256 - wy) + y10 * wx * (256 - wy) + y01 * (256 - wx) * wy + y11 * wx * wy + 32768) >> 16;
                            let ci = sl.sw * sl.sh + qy * sl.sw + 2 * qx;
                            let bil = |o: i32| {
                                let (a, b, c, d) = (byte(p, ci + o), byte(p, ci + o + 2), byte(p, ci + sl.sw + o), byte(p, ci + sl.sw + o + 2));
                                ((a * (256 - vx) * (256 - vy) + b * vx * (256 - vy) + c * (256 - vx) * vy + d * vx * vy + 32768) >> 16) - 128
                            };
                            let (cu, cv) = (bil(0), bil(1));
                            let kk = 298 * (ly - 16);
                            let rr = cl((kk + 459 * cv + 128) >> 8, 0, 255);
                            let gg = cl((kk - 55 * cu - 136 * cv + 128) >> 8, 0, 255);
                            let bb = cl((kk + 541 * cu + 128) >> 8, 0, 255);
                            let c = row[x];
                            let (r, g, b) = ((c & 255) as i32, ((c >> 8) & 255) as i32, ((c >> 16) & 255) as i32);
                            let al = masked_al(sl, s, mask, y as usize * w + x);
                            let r = (al * rr + (256 - al) * r) >> 8;
                            let g = (al * gg + (256 - al) * g) >> 8;
                            let b = (al * bb + (256 - al) * b) >> 8;
                            row[x] = (r as u32 & 255) | (g as u32 & 255) << 8 | (b as u32 & 255) << 16 | (c & 0xff00_0000);
                        }
                    }
                }
                // the overlay (premultiplied); an empty pixel leaves the colour as it is, and the result is opaque
                let base = y0 * w;
                for (j, px) in chunk.iter_mut().enumerate() {
                    let o = overlay[base + j];
                    let (mut r, mut g, mut b) = ((*px & 255) as i32, ((*px >> 8) & 255) as i32, ((*px >> 16) & 255) as i32);
                    if o != 0 {
                        let oa = ((o >> 24) & 255) as i32;
                        r = (o & 255) as i32 + (r * (255 - oa) + 127) / 255;
                        g = ((o >> 8) & 255) as i32 + (g * (255 - oa) + 127) / 255;
                        b = ((o >> 16) & 255) as i32 + (b * (255 - oa) + 127) / 255;
                    }
                    *px = (r as u32 & 255) | (g as u32 & 255) << 8 | (b as u32 & 255) << 16 | 255 << 24;
                }
            });
        }
    });
    out
}

#[cfg(test)]
mod nv12_tests {
    use crate::*;
    use std::collections::HashMap;

    fn frame(w: usize, h: usize) -> Vec<u32> {
        let mut s = 0x9e37_79b9_7f4a_7c15u64;
        (0..w * (h + 1))
            .map(|_| {
                s ^= s << 13;
                s ^= s >> 7;
                s ^= s << 17;
                (s as u32) | 0xff00_0000
            })
            .collect()
    }

    /// kernels/nv12.k and nv12buf.k (through the interpreter, which the GPU matches bit for bit) equal nv12_cpu.
    #[test]
    fn nv12_kernels_equal_native() {
        let (w, h) = (64usize, 34usize);
        let words = frame(w, h);
        let sc: HashMap<&str, i32> = [("w", w as i32), ("h", h as i32), ("T_w", w as i32)].into();
        let n = w * h / 4 + w * h / 8 + 1;
        // nv12.k reads texture T (w wide, h + 1 rows); nv12buf.k reads buffer F and the tag from T
        let cpu = Cpu { buffers: [("F", &words[..]), ("T", &words[..])].into(), scalars: sc };
        let want = nv12_cpu(&words, w, h, 3);
        for src in [include_str!("../kernels/nv12.k"), include_str!("../kernels/nv12buf.k")] {
            let got = cpu.run(&parse(src).unwrap(), n, &["px"]).unwrap().into_iter().next().unwrap();
            assert_eq!(got, want);
        }
    }

    /// A slow dark ramp dithers to a mix of neighbouring codes whose mean tracks the ramp, where rounding gave flat steps.
    #[test]
    fn a_dark_ramp_keeps_its_mean_and_loses_its_steps() {
        let (w, h) = (256usize, 16usize);
        // grey 10.0 to 14.0 across the frame in 8.8 steps of the input: each input level a 64-px band
        let f: Vec<u32> = (0..w * (h + 1)).map(|i| { let g = 10 + ((i % w) as u32) / 64; 0xff00_0000 | g << 16 | g << 8 | g }).collect();
        let out = nv12_cpu(&f, w, h, 2);
        let y: Vec<u8> = bytemuck_like(&out[..w * h / 4]);
        // inside one input band the luma may take two codes (the dither) but its mean stays the rounded value
        for band in 0..4 {
            let vals: Vec<f64> = (0..h).flat_map(|r| (band * 64..band * 64 + 64).map(move |x| (r, x))).map(|(r, x)| y[r * w + x] as f64).collect();
            let mean = vals.iter().sum::<f64>() / vals.len() as f64;
            let g = (10 + band) as f64;
            let exact = 16.0 + (47.0 * g + 157.0 * g + 16.0 * g) / 256.0;
            assert!((mean - exact).abs() < 0.1, "band {band}: mean {mean} vs {exact}");
        }
    }

    fn bytemuck_like(w: &[u32]) -> Vec<u8> {
        w.iter().flat_map(|x| x.to_le_bytes()).collect()
    }
}

#[cfg(test)]
mod p010_tests {
    use crate::*;
    use std::collections::HashMap;

    /// kernels/p010buf.k (through the interpreter, which the GPU matches bit for bit) equals p010_cpu.
    #[test]
    fn p010buf_kernel_equals_native() {
        let (w, h) = (64usize, 34usize);
        let mut s = 0x2545_f491_4f6c_dd1du64;
        let words: Vec<u32> = (0..w * (h + 1))
            .map(|_| {
                s ^= s << 13;
                s ^= s >> 7;
                s ^= s << 17;
                (s as u32) | 0xff00_0000
            })
            .collect();
        let k = parse(include_str!("../kernels/p010buf.k")).unwrap();
        let sc: HashMap<&str, i32> = [("w", w as i32), ("h", h as i32), ("T_w", w as i32)].into();
        let cpu = Cpu { buffers: [("F", &words[..]), ("T", &words[..])].into(), scalars: sc };
        let n = w * h / 2 + w * h / 4 + 1;
        let interp = cpu.run(&k, n, &["px"]).unwrap().into_iter().next().unwrap();
        assert_eq!(interp, p010_cpu(&words, w, h, 3));
    }

    /// Every 8-bit colour, painted flat, comes back exact through a float BT.709 limited-range decode of its P010.
    #[test]
    fn p010_round_trip_is_exact_for_every_colour() {
        let (kr, kb) = (0.2126f64, 0.0722f64);
        let kg = 1.0 - kr - kb;
        // per red level: a 512 x 512 frame of 2x2 blocks, green across, blue down (and the tag row)
        let (w, h) = (512usize, 512usize);
        let mut worst = 0i32;
        let mut frame = vec![0u32; w * (h + 1)];
        for r in 0..256u32 {
            for y in 0..h {
                for x in 0..w {
                    frame[y * w + x] = 0xff00_0000 | ((y as u32 / 2) << 16) | ((x as u32 / 2) << 8) | r;
                }
            }
            let out = p010_cpu(&frame, w, h, 8);
            let (ny, cw) = (w * h / 2, w / 2);
            for b in 0..256usize {
                for g in 0..256usize {
                    let p = 2 * b * w + 2 * g;
                    let yv = (out[p / 2] >> 6) & 1023;
                    let c = out[ny + b * cw + g];
                    let (u, v) = ((c >> 6) & 1023, (c >> 22) & 1023);
                    let yf = (yv as f64 / 4.0 - 16.0) / 219.0;
                    let (uf, vf) = ((u as f64 / 4.0 - 128.0) / 224.0, (v as f64 / 4.0 - 128.0) / 224.0);
                    let rf = yf + 2.0 * (1.0 - kr) * vf;
                    let bf = yf + 2.0 * (1.0 - kb) * uf;
                    let gf = (yf - kr * rf - kb * bf) / kg;
                    let q = |f: f64| (f * 255.0).round().clamp(0.0, 255.0) as i32;
                    let e = (q(rf) - r as i32).abs().max((q(gf) - g as i32).abs()).max((q(bf) - b as i32).abs());
                    worst = worst.max(e);
                }
            }
        }
        assert_eq!(worst, 0, "worst channel error over all 16.7M colours");
    }
}
