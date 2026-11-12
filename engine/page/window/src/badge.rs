//! The badge drawn over the app's taskbar button on Windows (native.rs dock.badge; the Mac's Dock draws its own): a
//! red pill holding the count in a pixel font, crisp at the small-icon size the taskbar asks for (16 px at 100%, 20,
//! 24 and 32 as the display scales). Pure, so it's tested on every system.

/// What the badge says for the page's text: a count up to 9, "9+" above, a dot (empty) for anything else; None clears it.
pub fn label(text: &str) -> Option<String> {
    let t = text.trim();
    if t.is_empty() || t == "0" {
        return None;
    }
    Some(match t.parse::<u64>() {
        Ok(n) if n <= 9 => n.to_string(),
        Ok(_) => "9+".into(),
        Err(_) => String::new(),
    })
}

/// 3x5 glyphs, a row a nibble (the low 3 bits, left to right)
fn glyph(c: char) -> [u8; 5] {
    match c {
        '0' => [7, 5, 5, 5, 7],
        '1' => [2, 6, 2, 2, 7],
        '2' => [7, 1, 7, 4, 7],
        '3' => [7, 1, 7, 1, 7],
        '4' => [5, 5, 7, 1, 1],
        '5' => [7, 4, 7, 1, 7],
        '6' => [7, 4, 7, 5, 7],
        '7' => [7, 1, 1, 1, 1],
        '8' => [7, 5, 7, 5, 7],
        '9' => [7, 5, 7, 1, 7],
        '+' => [0, 2, 7, 2, 0],
        _ => [0; 5],
    }
}

const RED: [u8; 3] = [0xe5, 0x48, 0x4d];

/// `label` on a `size` x `size` badge, top row first, as BGRA with straight alpha (what a 32-bit icon holds): a circle
/// for one character, a pill for two, its edge antialiased; the characters white, each pixel of the font `size / 8`.
pub fn pixels(label: &str, size: u32) -> Vec<u8> {
    let s = size.max(8) as f32;
    let n = label.chars().count();
    // the pill's half width and height and its corner radius, centred
    let (hw, hh) = if n > 1 { (s / 2.0, s * 0.36) } else { (s / 2.0, s / 2.0) };
    // a circle for one character; for two, corners tight enough that the glyphs' own corners stay inside at 16 px
    let r = if n > 1 { hh * 0.55 } else { hh };
    let scale = (size / 8).max(1);
    let (gw, gh) = (3 * scale, 5 * scale);
    let tw = n as u32 * gw + n.saturating_sub(1) as u32 * scale;
    let (x0, y0) = (size.saturating_sub(tw) / 2, size.saturating_sub(gh) / 2);
    let dot = n == 0;
    let mut out = vec![0u8; (size * size * 4) as usize];
    for y in 0..size {
        for x in 0..size {
            let (px, py) = (x as f32 + 0.5 - s / 2.0, y as f32 + 0.5 - s / 2.0);
            // signed distance to the rounded box (a dot: a circle half the size)
            let d = if dot {
                (px * px + py * py).sqrt() - s / 4.0
            } else {
                let (qx, qy) = (px.abs() - (hw - r), py.abs() - (hh - r));
                (qx.max(0.0).powi(2) + qy.max(0.0).powi(2)).sqrt() + qx.max(qy).min(0.0) - r
            };
            let a = (0.5 - d).clamp(0.0, 1.0);
            if a <= 0.0 {
                continue;
            }
            let ink = !dot && x >= x0 && y >= y0 && x < x0 + tw && y < y0 + gh && {
                let (lx, ly) = (x - x0, (y - y0) / scale);
                let (k, col) = (lx / (gw + scale), (lx % (gw + scale)) / scale);
                col < 3 && glyph(label.chars().nth(k as usize).unwrap_or(' '))[ly as usize] >> (2 - col) & 1 == 1
            };
            let [r, g, b] = if ink { [255; 3] } else { RED };
            let i = ((y * size + x) * 4) as usize;
            out[i..i + 4].copy_from_slice(&[b, g, r, (a * 255.0).round() as u8]);
        }
    }
    out
}

#[cfg(test)]
mod tests {
    use super::{label, pixels};

    #[test]
    fn says_a_count_up_to_nine_then_nine_plus_and_clears_at_nothing() {
        assert_eq!(label(""), None);
        assert_eq!(label("0"), None);
        assert_eq!(label("3").as_deref(), Some("3"));
        assert_eq!(label("12").as_deref(), Some("9+"));
        assert_eq!(label("new").as_deref(), Some(""));
    }

    /// the badge as text: '#' white, 'o' red, '.' clear
    fn art(label: &str, size: u32) -> Vec<String> {
        let p = pixels(label, size);
        (0..size as usize)
            .map(|y| {
                (0..size as usize)
                    .map(|x| {
                        let i = (y * size as usize + x) * 4;
                        match (p[i + 3], p[i + 2]) {
                            (0, _) => '.',
                            (_, 255) => '#',
                            _ => 'o',
                        }
                    })
                    .collect()
            })
            .collect()
    }

    #[test]
    fn draws_the_count_white_on_a_red_badge_crisp_at_sixteen_pixels() {
        let a = art("7", 16);
        // a round badge: clear corners, red at the middle of each edge
        assert_eq!(&a[0][0..1], ".");
        assert_eq!(a[8].chars().next(), Some('o'));
        // the 7 at 2 px a font pixel: its top bar 6 px wide, then its stem down the right
        assert!(a.iter().any(|r| r.contains("######")), "{a:#?}");
        let stem = a.iter().filter(|r| r.contains("oo##o") || r.ends_with("##ooooo") || r.contains("##oo")).count();
        assert!(stem >= 8, "{a:#?}");
        // two characters fit inside a pill, none cut at the edge
        for r in art("9+", 16) {
            assert!(!r.starts_with('#') && !r.ends_with('#'), "{r}");
        }
        assert_eq!(pixels("9+", 32).len(), 32 * 32 * 4);
    }
}
