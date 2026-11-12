//! RR0's film on the iPhone (docs/rerender.feature, bench/rerender/ios/bench.sh). The bench app's main.m calls
//! `raea_rerender_run` once a launch, so each composition renders in a process of its own, cold, as bench.sh renders
//! each chunk on the Mac. What it prints goes to the console devicectl streams back: raea's startup marks (timed from the
//! process's own start, read from the kernel, so no clock is shared with the Mac) and RAEA_TIMES' line; the frame log
//! goes to the app's Documents.

use std::ffi::{CStr, c_char};
use std::path::Path;

/// When this process started, in ms since the Unix epoch, from the kernel's process table: what RAEA_STARTUP_TRACE
/// counts its marks from (raea-cli's spawner passes its own clock; here the process is its own spawner).
fn started_ms() -> Option<u64> {
    #[cfg(target_vendor = "apple")]
    unsafe {
        // struct kinfo_proc (648 bytes) opens with kp_proc, whose first member is a union holding p_starttime (a
        // timeval: i64 seconds, i32 microseconds); read through sysctl, so no libc crate is needed for one call
        unsafe extern "C" {
            fn sysctl(name: *const i32, namelen: u32, oldp: *mut u8, oldlenp: *mut usize, newp: *const u8, newlen: usize) -> i32;
            fn getpid() -> i32;
        }
        const CTL_KERN: i32 = 1;
        const KERN_PROC: i32 = 14;
        const KERN_PROC_PID: i32 = 1;
        let mib = [CTL_KERN, KERN_PROC, KERN_PROC_PID, getpid()];
        let mut buf = [0u8; 648];
        let mut len = buf.len();
        if sysctl(mib.as_ptr(), 4, buf.as_mut_ptr(), &mut len, std::ptr::null(), 0) != 0 || len < 16 {
            return None;
        }
        let sec = i64::from_ne_bytes(buf[0..8].try_into().ok()?);
        let usec = i32::from_ne_bytes(buf[8..12].try_into().ok()?);
        Some((sec as u64) * 1000 + (usec as u64) / 1000)
    }
    #[cfg(not(target_vendor = "apple"))]
    None
}

/// Renders the bundled composition `bundle` (NAME.comp.js) to `out` (an .mp4), its media under the bundle's folder, and
/// returns raea's own line for it (APPLIED or REFUSED), as `raea render --bundle` prints it. 0 when it rendered.
///
/// # Safety
/// `bundle` and `out` are NUL-terminated paths.
#[unsafe(no_mangle)]
pub unsafe extern "C" fn raea_rerender_run(bundle: *const c_char, out: *const c_char) -> i32 {
    let js = unsafe { CStr::from_ptr(bundle) }.to_string_lossy().into_owned();
    let out = unsafe { CStr::from_ptr(out) }.to_string_lossy().into_owned();
    // SAFETY (both): set before any thread of raea's starts (main.m calls this first); the render's stats line is what
    // bench.sh reads from the console
    unsafe { std::env::set_var("RAEA_RENDER_STATS", "1") };
    if let Some(t0) = started_ms() {
        unsafe { std::env::set_var("RAEA_STARTUP_TRACE", t0.to_string()) };
    }
    raea_runtime_react::startup_mark("main");
    raea_runtime_react::native::register();
    raea_runtime_react::startup_mark("native calls registered");
    let js = Path::new(&js);
    let dir = js.parent().unwrap_or(Path::new("."));
    match raea_runtime_export::render_bundle(js, dir, Path::new(&out), None) {
        Ok(said) => {
            println!("{said}");
            0
        }
        Err(e) => {
            println!("REFUSED  {e}");
            1
        }
    }
}
