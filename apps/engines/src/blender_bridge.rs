//! The Blender a TypeScript script drives (`raea blender run SCRIPT.ts`, sdk/blender): a headless Blender started with
//! raea's bridge (sdk/blender/python/headless.py), which serves raea/blender's batches on 127.0.0.1 behind a token,
//! and ends with this process. The CLI runs the script on raea's engine, posting each batch (the native call
//! blender.post, runtime/calls/src/blender.rs); Node and Bun start their own (sdk/blender/src/launch.ts).

use std::hash::{BuildHasher, Hasher};
use std::io::{BufRead, BufReader};
use std::path::{Path, PathBuf};
use std::process::{Child, Command, Stdio};
use std::time::{Duration, Instant};

type R<T> = Result<T, String>;

/// A script raea runs as TypeScript (against raea/blender) rather than as Python.
pub fn is_ts(script: &str) -> bool {
    [".ts", ".tsx", ".mts", ".js", ".mjs"].iter().any(|e| script.ends_with(e))
}

/// The bridge script in the SDK raea ships (its home's sdk/, else this checkout's).
pub fn bridge_script() -> R<PathBuf> {
    let shipped = raea_io_home::home().join("sdk/blender/python/headless.py");
    if shipped.is_file() {
        return Ok(shipped);
    }
    let here = Path::new(env!("CARGO_MANIFEST_DIR")).join("../../sdk/blender/python/headless.py");
    if here.is_file() {
        return Ok(here);
    }
    Err(format!("raea/blender's bridge isn't here ({}): reinstall raea", shipped.display()))
}

/// 128 bits from the OS's random keys (each RandomState is seeded from them), as hex.
fn token() -> String {
    let word = || {
        let mut h = std::collections::hash_map::RandomState::new().build_hasher();
        h.write_u128(Instant::now().elapsed().as_nanos() ^ u128::from(std::process::id()));
        h.finish()
    };
    format!("{:016x}{:016x}", word(), word())
}

pub struct Bridge {
    pub port: u16,
    pub token: String,
    child: Child,
}

/// Blender's own lines nobody needs from a script's run: its banner and its goodbye.
fn banner(l: &str) -> bool {
    let t = l.trim();
    t.starts_with("Blender quit") || (t.starts_with("Blender ") && t.as_bytes().get(8).is_some_and(u8::is_ascii_digit))
}

/// A headless Blender serving raea/blender: `file` (a .blend) opened, `args` after `--` (Python's sys.argv). Its
/// output after the bridge starts goes to stderr, as the script's prints.
pub fn start(blender: &Path, file: Option<&Path>, args: &[String]) -> R<Bridge> {
    let script = bridge_script()?;
    let token = token();
    let mut cmd = Command::new(blender);
    cmd.args(["--background", "--factory-startup"]);
    if let Some(f) = file {
        cmd.arg(f);
    }
    cmd.args(["--python-exit-code", "1", "--python"]).arg(&script).arg("--").args(args);
    cmd.env("RAEA_BLENDER_TOKEN", &token).env("RAEA_BLENDER_PORT", "0").env("RAEA_BLENDER_PARENT", std::process::id().to_string());
    let mut child = cmd.stdout(Stdio::piped()).stderr(Stdio::inherit()).spawn().map_err(|e| format!("{}: {e}", blender.display()))?;
    let mut lines = BufReader::new(child.stdout.take().ok_or("Blender's output")?).lines();
    let mut early = Vec::new();
    let port = loop {
        match lines.next() {
            Some(Ok(l)) => match l.trim().strip_prefix("RAEA_BLENDER_READY ") {
                Some(ready) => {
                    let v: serde_json::Value = serde_json::from_str(ready).map_err(|e| format!("the bridge's ready line {ready}: {e}"))?;
                    break v.get("port").and_then(serde_json::Value::as_u64).ok_or("the bridge's port")? as u16;
                }
                None => early.push(l),
            },
            _ => {
                let st = child.wait().map_err(|e| e.to_string())?;
                let tail = early[early.len().saturating_sub(30)..].join("\n");
                return Err(format!("Blender exited ({st}) before raea's bridge started:\n{tail}"));
            }
        }
    };
    std::thread::spawn(move || {
        for l in lines.map_while(Result::ok) {
            if !banner(&l) {
                eprintln!("{l}");
            }
        }
    });
    Ok(Bridge { port, token, child })
}

impl Bridge {
    /// Waits for Blender to exit (after the bridge was asked to quit), killing it after 10 s.
    pub fn wait(mut self) {
        let t0 = Instant::now();
        while t0.elapsed() < Duration::from_secs(10) {
            if let Ok(Some(_)) = self.child.try_wait() {
                return;
            }
            std::thread::sleep(Duration::from_millis(20));
        }
        let _ = self.child.kill();
        let _ = self.child.wait();
    }
}

impl Drop for Bridge {
    /// A run that ends early (an error, a panic) leaves no Blender behind.
    fn drop(&mut self) {
        if let Ok(None) = self.child.try_wait() {
            let _ = self.child.kill();
            let _ = self.child.wait();
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn typescript_scripts_by_extension() {
        assert!(is_ts("scene.ts") && is_ts("a/b.tsx") && is_ts("x.mjs"));
        assert!(!is_ts("convert.py") && !is_ts("blender/repair.py"));
    }

    #[test]
    fn tokens_differ_and_are_128_bits() {
        let (a, b) = (token(), token());
        assert_eq!(a.len(), 32);
        assert_ne!(a, b);
    }

    #[test]
    fn the_banner_is_dropped_and_prints_kept() {
        assert!(banner("Blender 5.2.1 LTS (hash 1a2b3c built 2026-10-01)") && banner("Blender quit"));
        assert!(!banner("Blender found 3 objects") && !banner("made Cube"));
    }
}
