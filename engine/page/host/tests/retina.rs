//! The page the host shows is painted at the window's scale (page.rs size): on a Retina display its document lays out
//! at hidpi_scale 2 and its image is twice the points each way, so text and hairlines land on the display's pixels.
//! v0.1.1 left the page at scale 1 and stretched it over the window ("UI renders at 1x on Retina", a bug report of
//! 2026-11-12). Headless, the image target's scale stands.
use bevy::camera::{NormalizedRenderTarget, RenderTarget};
use bevy::ecs::system::RunSystemOnce;
use bevy::prelude::*;
use bevy::window::{PrimaryWindow, WindowRef, WindowResolution};
use raea_page_host::inject::Target;
use raea_page_host::page::{self, HostPage};
use raea_sys_page::Page;

fn app(scale: f32, windowed: bool) -> (App, Entity) {
    let mut app = App::new();
    app.add_plugins(MinimalPlugins);
    let window = app.world_mut().spawn((Window { resolution: WindowResolution::new((1440.0 * scale) as u32, (900.0 * scale) as u32).with_scale_factor_override(scale), ..default() }, PrimaryWindow)).id();
    let norm: NormalizedRenderTarget = RenderTarget::Window(WindowRef::Primary).normalize(Some(window)).unwrap();
    app.world_mut().insert_resource(Target { image: Handle::default(), norm, scale: 1.0, windowed });
    let page = app.world_mut().spawn(Page { size: UVec2::new(400, 300), scale: 1.0 }).id();
    app.world_mut().insert_resource(HostPage(page));
    (app, page)
}

#[test]
fn on_screen_the_page_takes_the_windows_scale_and_its_size_in_points() {
    let (mut app, page) = app(2.0, true);
    app.world_mut().run_system_once(page::size).unwrap();
    let p = *app.world().get::<Page>(page).unwrap();
    assert_eq!((p.size, p.scale), (UVec2::new(1440, 900), 2.0));
    // the window moved to a 1x display: the page follows
    app.world_mut().query_filtered::<&mut Window, With<PrimaryWindow>>().single_mut(app.world_mut()).unwrap().resolution.set_scale_factor_override(Some(1.0));
    app.world_mut().run_system_once(page::size).unwrap();
    assert_eq!(app.world().get::<Page>(page).unwrap().scale, 1.0);
}

#[test]
fn headless_the_page_keeps_the_images_scale() {
    let (mut app, page) = app(2.0, false);
    app.world_mut().run_system_once(page::size).unwrap();
    let p = *app.world().get::<Page>(page).unwrap();
    assert_eq!((p.size, p.scale), (UVec2::new(1440, 900), 1.0));
}
