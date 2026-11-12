//! dock.badge on Windows (native.rs): the badge badge.rs draws, as an overlay icon on the window's taskbar button
//! (ITaskbarList3::SetOverlayIcon), Windows's counterpart of the Dock's badge. Nothing to clear is cleared; anything
//! that fails (no taskbar button yet, no COM) leaves the button as it was. Called on the main thread (drain).

use windows::Win32::Foundation::HWND;
use windows::Win32::Graphics::Gdi::{BI_RGB, BITMAPINFO, BITMAPINFOHEADER, CreateBitmap, CreateDIBSection, DIB_RGB_COLORS, DeleteObject};
use windows::Win32::System::Com::{CLSCTX_INPROC_SERVER, COINIT_APARTMENTTHREADED, CoCreateInstance, CoInitializeEx};
use windows::Win32::UI::Shell::{ITaskbarList3, TaskbarList};
use windows::Win32::UI::WindowsAndMessaging::{CreateIconIndirect, DestroyIcon, GetSystemMetrics, HICON, ICONINFO, SM_CXSMICON};
use windows::core::PCWSTR;

pub fn badge(text: &str) {
    let Some(hwnd) = primary() else { return };
    let label = super::badge::label(text);
    // SAFETY: COM and GDI calls on the main thread with a live window's handle; the icon is the taskbar's copy once set
    unsafe {
        // winit has already made this thread's apartment (OLE, for drag and drop): this only counts it again
        let _ = CoInitializeEx(None, COINIT_APARTMENTTHREADED);
        let Ok(bar) = CoCreateInstance::<_, ITaskbarList3>(&TaskbarList, None, CLSCTX_INPROC_SERVER) else { return };
        if bar.HrInit().is_err() {
            return;
        }
        let Some(label) = label else {
            let _ = bar.SetOverlayIcon(hwnd, HICON::default(), PCWSTR::null());
            return;
        };
        let size = GetSystemMetrics(SM_CXSMICON).clamp(16, 64) as u32;
        let Some(icon) = icon(&super::badge::pixels(&label, size), size) else { return };
        let said: Vec<u16> = format!("{} new in the Inbox", if label.is_empty() { "Something" } else { &label }).encode_utf16().chain([0]).collect();
        let _ = bar.SetOverlayIcon(hwnd, icon, PCWSTR(said.as_ptr()));
        let _ = DestroyIcon(icon);
    }
}

/// The primary window's handle, once winit has made it.
fn primary() -> Option<HWND> {
    use raw_window_handle::{HasWindowHandle, RawWindowHandle};
    bevy::winit::WINIT_WINDOWS.with_borrow(|ww| {
        let w = ww.windows.values().next()?;
        let RawWindowHandle::Win32(h) = w.window_handle().ok()?.as_raw() else { return None };
        Some(HWND(h.hwnd.get() as *mut core::ffi::c_void))
    })
}

/// A 32-bit icon (straight alpha, its mask unused) from `size` x `size` BGRA pixels, top row first.
unsafe fn icon(bgra: &[u8], size: u32) -> Option<HICON> {
    let bmi = BITMAPINFO { bmiHeader: BITMAPINFOHEADER { biSize: size_of::<BITMAPINFOHEADER>() as u32, biWidth: size as i32, biHeight: -(size as i32), biPlanes: 1, biBitCount: 32, biCompression: BI_RGB.0, ..Default::default() }, ..Default::default() };
    let mut bits: *mut core::ffi::c_void = core::ptr::null_mut();
    // SAFETY: the section is size x size x 4 bytes, the length of `bgra` (badge::pixels)
    unsafe {
        let color = CreateDIBSection(None, &bmi, DIB_RGB_COLORS, &mut bits, None, 0).ok()?;
        if bits.is_null() || bgra.len() != (size * size * 4) as usize {
            let _ = DeleteObject(color.into());
            return None;
        }
        core::ptr::copy_nonoverlapping(bgra.as_ptr(), bits.cast::<u8>(), bgra.len());
        let mask = CreateBitmap(size as i32, size as i32, 1, 1, None);
        let made = CreateIconIndirect(&ICONINFO { fIcon: true.into(), xHotspot: 0, yHotspot: 0, hbmMask: mask, hbmColor: color }).ok();
        let _ = DeleteObject(color.into());
        let _ = DeleteObject(mask.into());
        made
    }
}
