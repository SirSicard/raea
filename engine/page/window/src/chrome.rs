//! The window's own chrome (--chrome inset, the desktop app): macOS's title bar made transparent with the page drawn
//! under it, its traffic lights kept, and what a title bar does left to the page. The page knows from
//! `globalThis.__raea_window` ({chrome, lights}: the lights' box in points, for the page to leave room for) and asks
//! through two host calls: `window.drag` (a press on the page's title area moves the window, as winit's drag_window
//! does from that press) and `window.zoom` (a double-click there zooms, as a native title bar's does).

use bevy::prelude::*;
use bevy::window::PrimaryWindow;
use raea_runtime_js::HostCalls;
use serde_json::json;

/// How the window's frame is drawn.
#[derive(Clone, Copy, PartialEq, Eq, Debug, Default)]
pub enum Chrome {
    /// the system's title bar above the page
    #[default]
    Native,
    /// the page fills the window, under a transparent title bar with only the traffic lights
    Inset,
}

impl Chrome {
    pub fn parse(s: &str) -> Result<Self, String> {
        match s {
            "native" => Ok(Self::Native),
            "inset" => Ok(Self::Inset),
            _ => Err(format!("--chrome {s}: native or inset")),
        }
    }

    /// The primary window, titled and sized, with this chrome's title bar.
    pub fn window(self, title: &str, size: UVec2) -> Window {
        let inset = self == Self::Inset;
        let mut resolution = bevy::window::WindowResolution::new(size.x, size.y);
        // RAEA_WINDOW_SCALE=2: the window at that scale whatever the display's, so a Retina window can be checked on a
        // 1x display (the page paints at the window's scale: raea-page-host page.rs size)
        if let Some(s) = std::env::var("RAEA_WINDOW_SCALE").ok().and_then(|s| s.parse::<f32>().ok()).filter(|s| *s > 0.0) {
            resolution = resolution.with_scale_factor_override(s);
        }
        Window { title: title.into(), resolution, titlebar_transparent: inset, titlebar_show_title: !inset, fullsize_content_view: inset, ..default() }
    }

    /// JS run before the page's bundle: what the page reads to draw its own title area.
    pub fn preamble(self) -> String {
        // the traffic lights under the empty unified toolbar (toolbar, below): three 14 pt buttons from x 20, 6 pt
        // apart, centred in the 52 pt title area; elsewhere (no toolbar) AppKit's standard 28 pt bar's, from x 7
        let lights = if cfg!(all(target_os = "macos", feature = "window")) {
            json!({ "x": 20, "y": 19, "w": 54, "h": 14 })
        } else {
            json!({ "x": 7, "y": 6, "w": 54, "h": 14 })
        };
        let bar = if cfg!(all(target_os = "macos", feature = "window")) { 52 } else { 28 };
        let v = match self {
            Self::Native => json!({ "chrome": "native" }),
            Self::Inset => json!({ "chrome": "inset", "lights": lights, "bar": bar }),
        };
        format!("globalThis.__raea_window = {v};")
    }
}

/// The primary window, once winit has made it, given an empty unified toolbar (macOS): AppKit then draws a 52 pt title
/// area with the traffic lights centred in it, as in an app with a toolbar, under the page (inset chrome only).
#[cfg(all(target_os = "macos", feature = "window"))]
pub fn toolbar(_main: bevy::ecs::system::NonSendMarker, mut done: Local<bool>, chrome: Res<ChromeIs>) {
    use objc2::MainThreadMarker;
    use objc2_app_kit::{NSToolbar, NSView, NSWindowToolbarStyle};
    use raw_window_handle::{HasWindowHandle, RawWindowHandle};
    if *done || chrome.0 != Chrome::Inset {
        return;
    }
    let Some(mtm) = MainThreadMarker::new() else { return };
    bevy::winit::WINIT_WINDOWS.with_borrow(|ww| {
        let Some(w) = ww.windows.values().next() else { return };
        let Ok(handle) = w.window_handle() else { return };
        let RawWindowHandle::AppKit(h) = handle.as_raw() else { return };
        // SAFETY: winit's handle names its window's live content view, on this (the main) thread
        let view: &NSView = unsafe { h.ns_view.cast().as_ref() };
        let Some(win) = view.window() else { return };
        let tb = NSToolbar::new(mtm);
        win.setToolbar(Some(&tb));
        win.setToolbarStyle(NSWindowToolbarStyle::Unified);
        *done = true;
    });
}

/// The chrome the window was opened with.
#[derive(Resource, Clone, Copy)]
pub struct ChromeIs(pub Chrome);

/// `window.drag` and `window.zoom`, on the primary window.
pub fn install(world: &mut World) {
    world.init_resource::<HostCalls>();
    world
        .resource_mut::<HostCalls>()
        .on("window.drag", |w, _args, answer| {
            let mut q = w.query_filtered::<&mut Window, With<PrimaryWindow>>();
            match q.single_mut(w) {
                Ok(mut win) => {
                    win.start_drag_move();
                    answer.ok(json!(true))
                }
                Err(_) => answer.err("no window"),
            }
        })
        .on("window.zoom", |w, _args, answer| {
            let zoomed = {
                let mut z = w.get_resource_or_insert_with(|| Zoomed(false));
                z.0 = !z.0;
                z.0
            };
            let mut q = w.query_filtered::<&mut Window, With<PrimaryWindow>>();
            match q.single_mut(w) {
                Ok(mut win) => {
                    win.set_maximized(zoomed);
                    answer.ok(json!(zoomed))
                }
                Err(_) => answer.err("no window"),
            }
        });
}

/// Whether `window.zoom` last zoomed the window (AppKit's zoom toggles; Bevy keeps no maximized state to read).
#[derive(Resource)]
struct Zoomed(bool);
