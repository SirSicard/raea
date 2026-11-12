//! ProRes 4444 and HEVC with alpha through AVAssetWriter (VideoToolbox) into a QuickTime movie: BGRA pixel buffers
//! from the writer's pool, each marked straight alpha, as raea's --alpha frames are.

use std::path::Path;

use objc2::rc::Retained;
use objc2::runtime::AnyObject;
use objc2_av_foundation::*;
use objc2_core_media::CMTime;
use objc2_core_video::*;
use objc2_foundation::{NSDictionary, NSNumber, NSString, NSURL};

use crate::R;

use raea_io_apple::cf_key as key;

pub(crate) struct Writer {
    writer: Retained<AVAssetWriter>,
    input: Retained<AVAssetWriterInput>,
    adaptor: Retained<AVAssetWriterInputPixelBufferAdaptor>,
    fps: f64,
    n: i64,
}

impl Writer {
    /// `hevc`: HEVC with alpha (its colour and alpha at `quality`, 0..1); else ProRes 4444.
    pub(crate) fn new(out: &Path, hevc: bool, width: u32, height: u32, fps: f64, quality: f32) -> R<Writer> {
        let _ = std::fs::remove_file(out);
        unsafe {
            let url = NSURL::fileURLWithPath(&NSString::from_str(&out.display().to_string()));
            let writer = AVAssetWriter::assetWriterWithURL_fileType_error(&url, AVFileTypeQuickTimeMovie.ok_or("AVFileTypeQuickTimeMovie")?).map_err(|e| format!("AVAssetWriter: {}", e.localizedDescription()))?;
            let codec: &NSString = if hevc { AVVideoCodecTypeHEVCWithAlpha } else { AVVideoCodecTypeAppleProRes4444 }.ok_or("no alpha codec in this AVFoundation")?;
            let num = |v: f64| NSNumber::new_f64(v);
            let mut keys: Vec<&NSString> = vec![AVVideoCodecKey.ok_or("key")?, AVVideoWidthKey.ok_or("key")?, AVVideoHeightKey.ok_or("key")?];
            let (w, h) = (num(width as f64), num(height as f64));
            let mut vals: Vec<&AnyObject> = vec![codec as &AnyObject, &*w as &AnyObject, &*h as &AnyObject];
            // HEVC takes the alpha's mode and quality; ProRes 4444's alpha is lossless-ish and takes neither (an
            // unknown key there throws)
            let q = num(quality as f64);
            let compression: Retained<NSDictionary<NSString, AnyObject>> = NSDictionary::from_slices(
                &[key(objc2_video_toolbox::kVTCompressionPropertyKey_AlphaChannelMode), AVVideoQualityKey.ok_or("key")?, key(objc2_video_toolbox::kVTCompressionPropertyKey_TargetQualityForAlpha)],
                &[key(objc2_video_toolbox::kVTAlphaChannelMode_StraightAlpha) as &AnyObject, &*q as &AnyObject, &*q as &AnyObject],
            );
            if hevc {
                keys.push(AVVideoCompressionPropertiesKey.ok_or("key")?);
                vals.push(&*compression as &AnyObject);
            }
            let settings: Retained<NSDictionary<NSString, AnyObject>> = NSDictionary::from_slices(&keys, &vals);
            let input = AVAssetWriterInput::assetWriterInputWithMediaType_outputSettings(AVMediaTypeVideo.ok_or("video")?, Some(&settings));
            input.setExpectsMediaDataInRealTime(false);
            let (fmt, pw, ph) = (NSNumber::new_u32(kCVPixelFormatType_32BGRA), num(width as f64), num(height as f64));
            let attrs: Retained<NSDictionary<NSString, AnyObject>> = NSDictionary::from_slices(
                &[key(kCVPixelBufferPixelFormatTypeKey), key(kCVPixelBufferWidthKey), key(kCVPixelBufferHeightKey)],
                &[&*fmt as &AnyObject, &*pw as &AnyObject, &*ph as &AnyObject],
            );
            let adaptor = AVAssetWriterInputPixelBufferAdaptor::assetWriterInputPixelBufferAdaptorWithAssetWriterInput_sourcePixelBufferAttributes(&input, Some(&attrs));
            if !writer.canAddInput(&input) {
                return Err(format!("AVAssetWriter can't write {} here", if hevc { "HEVC with alpha" } else { "ProRes 4444" }));
            }
            writer.addInput(&input);
            if !writer.startWriting() {
                return Err(format!("AVAssetWriter didn't start: {:?}", writer.error().map(|e| e.localizedDescription().to_string())));
            }
            writer.startSessionAtSourceTime(CMTime::with_seconds(0.0, 600));
            Ok(Writer { writer, input, adaptor, fps, n: 0 })
        }
    }

    /// One frame, straight RGBA at the movie's size.
    pub(crate) fn push(&mut self, rgba: &[u8]) -> R<()> {
        objc2::rc::autoreleasepool(|_| unsafe {
            while !self.input.isReadyForMoreMediaData() {
                std::thread::sleep(std::time::Duration::from_micros(200));
            }
            let pool = self.adaptor.pixelBufferPool().ok_or("no pixel buffer pool")?;
            let mut pb: *mut CVPixelBuffer = std::ptr::null_mut();
            if CVPixelBufferPool::create_pixel_buffer(None, &pool, std::ptr::NonNull::new(&mut pb).unwrap()) != 0 || pb.is_null() {
                return Err("CVPixelBufferPoolCreatePixelBuffer failed".to_string());
            }
            let pb = objc2_core_foundation::CFRetained::from_raw(std::ptr::NonNull::new(pb).unwrap());
            CVPixelBufferLockBaseAddress(&pb, CVPixelBufferLockFlags(0));
            let (w, h, bpr) = (CVPixelBufferGetWidth(&pb), CVPixelBufferGetHeight(&pb), CVPixelBufferGetBytesPerRow(&pb));
            let base = CVPixelBufferGetBaseAddress(&pb) as *mut u8;
            for y in 0..h {
                let row = std::slice::from_raw_parts_mut(base.add(y * bpr), w * 4);
                let src = &rgba[y * w * 4..(y + 1) * w * 4];
                for x in 0..w {
                    row[x * 4..x * 4 + 4].copy_from_slice(&[src[x * 4 + 2], src[x * 4 + 1], src[x * 4], src[x * 4 + 3]]);
                }
            }
            CVPixelBufferUnlockBaseAddress(&pb, CVPixelBufferLockFlags(0));
            pb.set_attachment(kCVImageBufferAlphaChannelModeKey, kCVImageBufferAlphaChannelMode_StraightAlpha, CVAttachmentMode::ShouldPropagate);
            let t = CMTime::with_seconds(self.n as f64 / self.fps, 6000);
            if !self.adaptor.appendPixelBuffer_withPresentationTime(&pb, t) {
                return Err(format!("append failed: {:?}", self.writer.error().map(|e| e.localizedDescription().to_string())));
            }
            self.n += 1;
            Ok(())
        })
    }


    pub(crate) fn finish(self) -> R<()> {
        unsafe {
            self.input.markAsFinished();
            let done = std::sync::Arc::new(std::sync::atomic::AtomicBool::new(false));
            let d2 = done.clone();
            let block = block2::RcBlock::new(move || d2.store(true, std::sync::atomic::Ordering::SeqCst));
            self.writer.finishWritingWithCompletionHandler(&block);
            while !done.load(std::sync::atomic::Ordering::SeqCst) {
                std::thread::sleep(std::time::Duration::from_millis(2));
            }
            if self.writer.status() != AVAssetWriterStatus::Completed {
                return Err(format!("AVAssetWriter: {:?}", self.writer.error().map(|e| e.localizedDescription().to_string())));
            }
        }
        Ok(())
    }
}
