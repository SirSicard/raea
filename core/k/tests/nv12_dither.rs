//! The RGB to NV12 kernels round each sample through a 4x4 Bayer threshold of its pixel (#87: half-up rounding into
//! limited range banded every slow dark gradient), and nv12_cpu (the CPU render's twin) stays bit-equal to both the
//! texture kernel (nv12.k) and the buffer kernel (nv12buf.k), run here through the K interpreter.
use std::collections::HashMap;

use raea_core_k::{Cpu, nv12_cpu, parse};

const NV12_K: &str = include_str!("../kernels/nv12.k");
const NV12BUF_K: &str = include_str!("../kernels/nv12buf.k");

/// a w x (h + 1) frame of packed RGBA words from a small generator, the last row the frame tag's
fn frame(w: usize, h: usize, seed: u32) -> Vec<u32> {
    let mut s = seed;
    (0..w * (h + 1))
        .map(|_| {
            s ^= s << 13;
            s ^= s >> 17;
            s ^= s << 5;
            s
        })
        .collect()
}

fn through(k: &str, rgba: &[u32], w: usize, h: usize) -> Vec<u32> {
    let k = parse(k).unwrap();
    let cpu = Cpu { buffers: HashMap::from([("T", rgba), ("F", rgba)]), scalars: HashMap::from([("w", w as i32), ("h", h as i32), ("T_w", w as i32)]) };
    cpu.run(&k, w * h / 4 + w * h / 8 + 1, &["px"]).unwrap().remove(0)
}

#[test]
fn both_kernels_match_the_cpu_twin_bit_for_bit() {
    for (w, h, seed) in [(16, 8, 1u32), (24, 12, 7), (64, 36, 99)] {
        let rgba = frame(w, h, seed);
        let want = nv12_cpu(&rgba, w, h, 3);
        assert_eq!(through(NV12_K, &rgba, w, h), want, "nv12.k at {w}x{h}");
        assert_eq!(through(NV12BUF_K, &rgba, w, h), want, "nv12buf.k at {w}x{h}");
    }
}

/// A flat dark grey keeps its mean through the dither: the luma of RGB 10 is 24.63 in limited range, so a 4x4 block
/// lands on 24 and 25 in a ratio that averages to it, not on one band.
#[test]
fn a_flat_dark_grey_keeps_its_mean_and_spans_two_levels() {
    let (w, h) = (16, 8);
    let rgba = vec![0xff0a0a0au32; w * (h + 1)];
    let out = nv12_cpu(&rgba, w, h, 1);
    let luma: Vec<u32> = out[..w * h / 4].iter().flat_map(|wd| [wd & 255, wd >> 8 & 255, wd >> 16 & 255, wd >> 24]).collect();
    let mean = luma.iter().sum::<u32>() as f64 / luma.len() as f64;
    assert!((mean - 24.627).abs() < 0.1, "mean {mean}");
    let mut levels: Vec<u32> = luma.clone();
    levels.sort_unstable();
    levels.dedup();
    assert_eq!(levels, [24, 25]);
    // and black stays black, white stays white: the dither never lifts the ends of the range
    let black = nv12_cpu(&vec![0xff000000u32; w * (h + 1)], w, h, 1);
    assert!(black[..w * h / 4].iter().all(|wd| *wd == 0x10101010), "black luma");
    let white = nv12_cpu(&vec![0xffffffffu32; w * (h + 1)], w, h, 1);
    assert!(white[..w * h / 4].iter().all(|wd| *wd == 0xebebebeb), "white luma");
}
