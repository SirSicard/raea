use super::*;

/// a 96x54 picture drawn by `paint(frame index, sample, x, y)`, sample 0 the area sample and 1 the point sample, for
/// `frames` frames at `fps`
fn flash_samples(frames: usize, fps: f64, paint: impl Fn(usize, usize, usize, usize) -> [u8; 3]) -> Option<(usize, f64, &'static str)> {
    let (w, h) = (96, 54);
    let mut screen = FlashScreen::new(w, h);
    for f in 0..frames {
        let mut rgb = Vec::with_capacity(w * 2 * h * 3);
        for y in 0..h {
            for sample in 0..2 {
                for x in 0..w {
                    rgb.extend_from_slice(&paint(f, sample, x, y));
                }
            }
        }
        screen.push(&rgb, f as f64 / fps);
    }
    screen.finish()
}

fn flash_of(seconds: usize, paint: impl Fn(usize, usize, usize) -> [u8; 3]) -> Option<(usize, f64, &'static str)> {
    flash_samples(seconds * 60, 60.0, move |f, _, x, y| paint(f, x, y))
}

/// two colours taking turns `hz` times a second, over a box of the frame
fn turns(hz: usize, on: [u8; 3], off: [u8; 3], bx: (usize, usize, usize, usize)) -> Option<(usize, f64, &'static str)> {
    flash_of(3, move |f, x, y| {
        let inside = x >= bx.0 && x < bx.0 + bx.2 && y >= bx.1 && y < bx.1 + bx.3;
        if inside && f * hz * 2 / 60 % 2 == 0 { on } else { off }
    })
}

#[test]
fn flashing_is_found_past_three_a_second_and_not_at_it() {
    let (white, black) = ([255, 255, 255], [0, 0, 0]);
    let all = (0, 0, 96, 54);
    assert_eq!(turns(3, white, black, all), None, "three a second is the limit, not past it");
    let (swings, _, kind) = turns(4, white, black, all).expect("four a second");
    assert_eq!((swings / 2, kind), (4, "general"));
    // a small box: under a quarter of any window, and then over it
    assert_eq!(turns(5, white, black, (40, 20, 10, 10)), None);
    assert!(turns(5, white, black, (30, 18, 32, 18)).is_some());
    // too small a change, and both ends too bright for WCAG to count it
    assert_eq!(turns(5, [60, 60, 60], [30, 30, 30], all), None);
    assert_eq!(turns(5, [255, 255, 255], [235, 235, 235], all), None);
    // a dark saturated red: too dim to count as a general flash, past the limit as a red one
    assert_eq!(turns(5, [150, 0, 0], black, all).map(|t| t.2), Some("red"));
}

#[test]
fn a_flash_of_single_frames_counts_at_any_frame_rate() {
    // 120 fps with one white frame in every 30: four flashes a second, each gone within a sixtieth of a second
    let found = flash_samples(360, 120.0, |f, _, _, _| if f % 30 == 1 { [255, 255, 255] } else { [0, 0, 0] });
    assert_eq!(found.map(|(swings, _, kind)| (swings / 2, kind)), Some((4, "general")));
}

#[test]
fn a_flash_the_area_sample_averages_away_is_found_in_the_point_sample() {
    let found = flash_samples(180, 60.0, |f, sample, _, _| {
        if sample == 0 {
            return [128, 128, 128];
        }
        if f * 5 * 2 / 60 % 2 == 0 { [255, 255, 255] } else { [0, 0, 0] }
    });
    assert!(found.is_some(), "the same flash in the point sample alone");
}


#[test]
fn a_shape_sliding_past_and_ordinary_cuts_are_not_flashing() {
    let (white, black) = ([255, 255, 255], [0, 0, 0]);
    assert_eq!(flash_of(3, move |f, x, _| if x < f { white } else { black }), None, "one wipe across the frame");
    assert_eq!(flash_of(4, move |f, _, _| if (f / 30) % 2 == 0 { white } else { black }), None, "a cut every half second");
}

#[test]
fn a_patch_strobing_while_its_background_dims_is_still_found() {
    // a third of a window: 0 then 124 on a 148 background, then the background settles at 124 and the patch cycles 124 and 160.
    // The background's drop is under the 0.10 that counts, but it outweighs the patch in the window's mean.
    let found = flash_samples(180, 60.0, |f, _, x, y| {
        let patch = x < 16 && y < 12;
        let level = match (patch, f) {
            (true, 0) => 0,
            (true, 1) => 124,
            (true, _) => if (f - 2) * 5 * 2 / 60 % 2 == 0 { 160 } else { 124 },
            (false, 0 | 1) => 148,
            (false, _) => 124,
        };
        [level, level, level]
    });
    assert!(found.is_some(), "the patch flashes five times a second");
}

#[test]
fn a_colour_crossing_the_saturation_line_is_not_a_red_flash() {
    // one level of green moves the pixel across R/(R+G+B) = 0.8 and hardly changes its red at all
    let found = flash_samples(180, 60.0, |f, _, _, _| if f * 5 * 2 / 60 % 2 == 0 { [100, 49, 0] } else { [100, 50, 0] });
    assert_eq!(found, None);
}
