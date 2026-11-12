//! A QuickTime movie of one video track whose every sample is a whole frame of a codec raea writes itself (QuickTime
//! Animation 'rle ', PNG 'png '): the samples into a 64-bit mdat as they come, the moov after them. Each sample is its
//! own chunk; the ones that aren't keyframes are left out of stss.

use std::fs::File;
use std::io::{BufWriter, Seek, SeekFrom, Write};
use std::path::Path;

use crate::R;

/// The track's timescale and each frame's duration in it: 30000/1001 for 29.97, 30000/1000 for 30.
pub(crate) fn timescale(fps: f64) -> (u32, u32) {
    let ntsc = (fps * 1.001).round();
    if ntsc > 0.0 && (ntsc * 1000.0 / 1001.0 - fps).abs() < 1e-3 {
        return ((ntsc as u32) * 1000, 1001);
    }
    (((fps * 1000.0).round() as u32).max(1), 1000)
}

pub(crate) struct Mov {
    file: BufWriter<File>,
    fourcc: [u8; 4],
    name: &'static str,
    width: u32,
    height: u32,
    fps: f64,
    /// where the mdat's 64-bit size is, and where its samples start
    mdat: u64,
    at: u64,
    sizes: Vec<u32>,
    offsets: Vec<u64>,
    keys: Vec<u32>,
}

fn atom(kind: &[u8; 4], parts: &[&[u8]]) -> Vec<u8> {
    let len: usize = parts.iter().map(|p| p.len()).sum();
    let mut v = Vec::with_capacity(len + 8);
    v.extend_from_slice(&(len as u32 + 8).to_be_bytes());
    v.extend_from_slice(kind);
    parts.iter().for_each(|p| v.extend_from_slice(p));
    v
}

fn atoms(kind: &[u8; 4], kids: &[Vec<u8>]) -> Vec<u8> {
    atom(kind, &kids.iter().map(Vec::as_slice).collect::<Vec<_>>())
}

const MATRIX: [u32; 9] = [0x0001_0000, 0, 0, 0, 0x0001_0000, 0, 0, 0, 0x4000_0000];

/// A Pascal string of `n` bytes in all (the sample description's compressor name).
fn pascal(s: &str, n: usize) -> Vec<u8> {
    let b = &s.as_bytes()[..s.len().min(n - 1)];
    let mut v = vec![b.len() as u8];
    v.extend_from_slice(b);
    v.resize(n, 0);
    v
}

impl Mov {
    pub(crate) fn create(out: &Path, fourcc: &[u8; 4], name: &'static str, width: u32, height: u32, fps: f64) -> R<Mov> {
        let mut file = BufWriter::new(File::create(out).map_err(|e| format!("{}: {e}", out.display()))?);
        let ftyp = atom(b"ftyp", &[b"qt  ", &0x2005_0300u32.to_be_bytes(), b"qt  "]);
        file.write_all(&ftyp).map_err(|e| e.to_string())?;
        // mdat with a 64-bit size (size 1, then the real size), patched when the movie is finished
        let mdat = ftyp.len() as u64;
        let head: [&[u8]; 3] = [&1u32.to_be_bytes(), b"mdat", &0u64.to_be_bytes()];
        file.write_all(&head.concat()).map_err(|e| e.to_string())?;
        Ok(Mov { file, fourcc: *fourcc, name, width, height, fps, mdat, at: mdat + 16, sizes: vec![], offsets: vec![], keys: vec![] })
    }

    /// One frame's sample; `key` when it decodes on its own.
    pub(crate) fn add(&mut self, sample: &[u8], key: bool) -> R<()> {
        self.file.write_all(sample).map_err(|e| e.to_string())?;
        self.offsets.push(self.at);
        self.sizes.push(sample.len() as u32);
        self.at += sample.len() as u64;
        if key {
            self.keys.push(self.sizes.len() as u32);
        }
        Ok(())
    }


    /// The moov after the samples, and the mdat's size: the movie is complete.
    pub(crate) fn finish(mut self) -> R<u64> {
        let (scale, delta) = timescale(self.fps);
        let n = self.sizes.len() as u32;
        let dur = n * delta;
        let matrix: Vec<u8> = MATRIX.iter().flat_map(|m| m.to_be_bytes()).collect();
        let zero4 = 0u32.to_be_bytes();
        let mvhd = atom(b"mvhd", &[&zero4, &zero4, &zero4, &scale.to_be_bytes(), &dur.to_be_bytes(), &0x0001_0000u32.to_be_bytes(), &0x0100u16.to_be_bytes(), &[0; 10], &matrix, &[0; 24], &2u32.to_be_bytes()]);
        let tkhd = atom(b"tkhd", &[&0x0000_000Fu32.to_be_bytes(), &zero4, &zero4, &1u32.to_be_bytes(), &zero4, &dur.to_be_bytes(), &[0; 8], &[0; 8], &matrix, &(self.width << 16).to_be_bytes(), &(self.height << 16).to_be_bytes()]);
        let mdhd = atom(b"mdhd", &[&zero4, &zero4, &zero4, &scale.to_be_bytes(), &dur.to_be_bytes(), &0u16.to_be_bytes(), &0u16.to_be_bytes()]);
        let hdlr = |kind: &[u8; 4], sub: &[u8; 4], name: &str| atom(b"hdlr", &[&zero4, kind, sub, b"appl", &zero4, &zero4, &pascal(name, name.len() + 1)]);
        let vmhd = atom(b"vmhd", &[&1u32.to_be_bytes(), &0x40u16.to_be_bytes(), &[0x80, 0, 0x80, 0, 0x80, 0]]);
        let dref = atom(b"dref", &[&zero4, &1u32.to_be_bytes(), &atom(b"alis", &[&1u32.to_be_bytes()])]);
        // the sample description: lossless spatial quality, 72 dpi, one frame a sample, 32-bit with no colour table;
        // BT.709 primaries and transfer (what the render's sRGB pixels are shown as), square pixels
        let colr = atom(b"colr", &[b"nclc", &1u16.to_be_bytes(), &1u16.to_be_bytes(), &1u16.to_be_bytes()]);
        let pasp = atom(b"pasp", &[&1u32.to_be_bytes(), &1u32.to_be_bytes()]);
        let desc = atom(&self.fourcc, &[&[0; 6], &1u16.to_be_bytes(), &0u16.to_be_bytes(), &0u16.to_be_bytes(), b"appl", &0u32.to_be_bytes(), &0x400u32.to_be_bytes(), &(self.width as u16).to_be_bytes(), &(self.height as u16).to_be_bytes(), &0x0048_0000u32.to_be_bytes(), &0x0048_0000u32.to_be_bytes(), &zero4, &1u16.to_be_bytes(), &pascal(self.name, 32), &32u16.to_be_bytes(), &0xFFFFu16.to_be_bytes(), &colr, &pasp]);
        let stsd = atom(b"stsd", &[&zero4, &1u32.to_be_bytes(), &desc]);
        let stts = atom(b"stts", &[&zero4, &1u32.to_be_bytes(), &n.to_be_bytes(), &delta.to_be_bytes()]);
        let stsc = atom(b"stsc", &[&zero4, &1u32.to_be_bytes(), &1u32.to_be_bytes(), &1u32.to_be_bytes(), &1u32.to_be_bytes()]);
        let sizes: Vec<u8> = self.sizes.iter().flat_map(|s| s.to_be_bytes()).collect();
        let stsz = atom(b"stsz", &[&zero4, &zero4, &n.to_be_bytes(), &sizes]);
        let offsets: Vec<u8> = self.offsets.iter().flat_map(|o| o.to_be_bytes()).collect();
        let co64 = atom(b"co64", &[&zero4, &n.to_be_bytes(), &offsets]);
        let mut table = vec![stsd, stts];
        // every sample a keyframe: no stss
        if self.keys.len() < self.sizes.len() {
            let keys: Vec<u8> = self.keys.iter().flat_map(|k| k.to_be_bytes()).collect();
            table.push(atom(b"stss", &[&zero4, &(self.keys.len() as u32).to_be_bytes(), &keys]));
        }
        table.extend([stsc, stsz, co64]);
        let stbl = atoms(b"stbl", &table);
        let minf = atoms(b"minf", &[vmhd, hdlr(b"dhlr", b"alis", "DataHandler"), atoms(b"dinf", &[dref]), stbl]);
        let mdia = atoms(b"mdia", &[mdhd, hdlr(b"mhlr", b"vide", "VideoHandler"), minf]);
        let moov = atoms(b"moov", &[mvhd, atoms(b"trak", &[tkhd, mdia])]);
        self.file.write_all(&moov).map_err(|e| e.to_string())?;
        let size = self.at - self.mdat;
        self.file.seek(SeekFrom::Start(self.mdat + 8)).map_err(|e| e.to_string())?;
        self.file.write_all(&size.to_be_bytes()).map_err(|e| e.to_string())?;
        self.file.flush().map_err(|e| e.to_string())?;
        Ok(self.at + moov.len() as u64)
    }
}
