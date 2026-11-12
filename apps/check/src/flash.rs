use super::*;
use raea_app_check_flash::FlashScreen;

/// The width each frame is decoded at for the flashing screen (raea-app-check-flash: its rule and its windows), twice over:
/// the area sample and the point sample side by side
const FLASH_W: usize = 192;

/// Every decoded frame, once: -fps_mode from FFmpeg 5.1 on, -vsync before it.
fn passthrough() -> [&'static str; 2] {
    let out = Command::new("ffmpeg").args(["-hide_banner", "-version"]).output().map(|o| o.stdout).unwrap_or_default();
    let head = String::from_utf8_lossy(&out);
    let version = head.split("version ").nth(1).and_then(|v| {
        let mut parts = v.trim_start_matches('n').split(|c: char| !c.is_ascii_digit());
        Some((parts.next()?.parse::<u32>().ok()?, parts.next()?.parse::<u32>().ok()?))
    });
    [if version.is_some_and(|v| v < (5, 1)) { "-vsync" } else { "-fps_mode" }, "passthrough"]
}

/// A frame's number and time from showinfo's log, exact: its `pts` in ticks of the time base. `pts_time` is rounded to six
/// significant digits, which is enough to push a legal third flash across the one-second line.
pub(crate) fn showinfo_frame(line: &str, base: Option<(i64, i64)>) -> Option<(usize, f64)> {
    let rest = line.split(" n:").nth(1)?;
    let n = rest.split_whitespace().next()?.parse().ok()?;
    let pts: i64 = rest.split("pts:").nth(1)?.split_whitespace().next()?.parse().ok()?;
    let (num, den) = base?;
    Some((n, pts as f64 * num as f64 / den as f64))
}

pub(crate) fn showinfo_base(line: &str) -> Option<(i64, i64)> {
    let (num, den) = line.split("config in time_base:").nth(1)?.split(',').next()?.trim().split_once('/')?;
    Some((num.parse().ok()?, den.parse().ok()?))
}

/// A line's severity under `-loglevel level+`: the first bracket after any `[context @ address]`. Searching the whole line
/// would take a file's own metadata for an error when its title happens to say one.
pub(crate) fn log_level(line: &str) -> Option<&str> {
    let mut rest = line.trim_start();
    if rest.starts_with('[') && rest[..rest.find(']')?].contains(" @ ") {
        rest = rest[rest.find(']')? + 1..].trim_start();
    }
    let rest = rest.strip_prefix('[')?;
    Some(&rest[..rest.find(']')?])
}

pub(crate) fn flashing(video: &str, probe: &Probe, issues: &mut Vec<Issue>, passed: &mut Vec<String>) -> R<()> {
    let w = FLASH_W;
    let h = (((w as f64 * probe.h / probe.w.max(1.0)) / 2.0).round() as usize * 2).max(6);
    let graph = format!("showinfo,split=2[area][point];[area]scale={w}:{h}:flags=area[a];[point]scale={w}:{h}:flags=neighbor[b];[a][b]hstack=inputs=2,format=rgb24");
    let sync = passthrough();
    let mut child = Command::new("ffmpeg")
        .args(["-hide_banner", "-nostats", "-nostdin", "-loglevel", "level+info", "-i", video, "-map", "0:v:0", "-vf", &graph, sync[0], sync[1], "-f", "rawvideo", "-"])
        .stdin(std::process::Stdio::null())
        .stdout(std::process::Stdio::piped())
        .stderr(std::process::Stdio::piped())
        .spawn()
        .map_err(|e| format!("ffmpeg: {e}"))?;
    let mut out = child.stdout.take().unwrap();
    let err = child.stderr.take().unwrap();
    let (times, clock) = std::sync::mpsc::channel();
    // read apart from the frames, so that neither pipe can fill while the other is being waited on
    let log = std::thread::spawn(move || {
        let mut err = std::io::BufReader::new(err);
        let (mut line, mut base, mut errors, mut first) = (Vec::new(), None, 0usize, String::new());
        while std::io::BufRead::read_until(&mut err, b'\n', &mut line).is_ok_and(|n| n > 0) {
            let text = String::from_utf8_lossy(&line);
            if matches!(log_level(&text), Some("error" | "fatal" | "panic")) {
                errors += 1;
                if first.is_empty() {
                    first = text.trim().to_string();
                }
            } else if text.trim_start().starts_with("[Parsed_showinfo") {
                base = showinfo_base(&text).or(base);
                if let Some(frame) = showinfo_frame(&text, base) {
                    let _ = times.send(frame);
                }
            }
            line.clear();
        }
        (errors, first)
    });
    let mut screen = FlashScreen::new(w, h);
    let mut buf = vec![0u8; w * 2 * h * 3];
    let mut frames = 0;
    let mut lost = false;
    while std::io::Read::read_exact(&mut out, &mut buf).is_ok() {
        // the frame's own line is written before its pixels, so one that doesn't come isn't going to
        match clock.recv_timeout(std::time::Duration::from_secs(60)) {
            Ok((n, t)) if n == frames => screen.push(&buf, t),
            _ => {
                lost = true;
                let _ = child.kill();
                break;
            }
        }
        frames += 1;
    }
    drop(out);
    let status = child.wait().map_err(|e| format!("ffmpeg: {e}"))?;
    let (errors, first) = log.join().unwrap_or_default();
    if lost {
        return Err(format!("{video}: flashing can't be screened, frame {frames} has no timestamp of its own"));
    }
    if !status.success() || frames == 0 {
        return Err(format!("{video}: flashing can't be screened, FFmpeg decoded {frames} frames ({first})"));
    }
    if errors > 0 {
        issues.push(Issue {
            rule: "decode",
            p: 1,
            at: None,
            says: format!("FFmpeg hit {errors} errors decoding the picture, so it may be damaged and flashing was only screened on what decoded: {first}"),
        });
    }
    match screen.finish() {
        Some((swings, at, kind)) => issues.push(Issue {
            rule: "flash",
            p: 1,
            at: Some(at),
            says: format!("{swings} opposing {kind} changes in one second, past WCAG 2.3.1's limit of 3 flashes (6 changes); flashing like this can cause seizures: slow it, shrink it or lower its contrast"),
        }),
        None if errors == 0 => passed.push("flashing: no more than 3 flashes a second found (a screen, not a certification)".to_string()),
        None => {}
    }
    Ok(())
}
