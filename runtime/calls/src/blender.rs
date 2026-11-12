//! `blender.post {sid, ops}`: a batch of raea/blender's operations (sdk/blender) posted to the Blender bridge that
//! `raea blender run SCRIPT.ts` started (apps/engines/src/blender_bridge.rs), and its reply: the results the script
//! asked for and the batch's first error. On the JS thread, so the script waits for Blender as Python would.

use std::io::{Read, Write};
use std::net::TcpStream;
use std::sync::Mutex;

use serde_json::Value;

use super::R;

/// The bridge of this run: its port on 127.0.0.1 and its token. The CLI sets it before the script runs.
pub static BRIDGE: Mutex<Option<(u16, String)>> = Mutex::new(None);

/// One batch posted to the bridge, its reply parsed.
pub fn post(v: &Value) -> R<Value> {
    let bridge = BRIDGE.lock().map_err(|e| e.to_string())?.clone();
    let (port, token) = bridge.ok_or("raea/blender: no Blender for this run: run the script with `raea blender run SCRIPT.ts`")?;
    let body = serde_json::to_vec(v).map_err(|e| e.to_string())?;
    let io = |e: std::io::Error| format!("raea/blender: the bridge on port {port}: {e}");
    let mut s = TcpStream::connect(("127.0.0.1", port)).map_err(io)?;
    let head = format!(
        "POST /rpc HTTP/1.1\r\nHost: 127.0.0.1\r\nContent-Type: application/json\r\nx-raea-token: {token}\r\nContent-Length: {}\r\nConnection: close\r\n\r\n",
        body.len()
    );
    s.write_all(head.as_bytes()).and_then(|_| s.write_all(&body)).map_err(io)?;
    let mut reply = Vec::new();
    s.read_to_end(&mut reply).map_err(io)?;
    let at = reply.windows(4).position(|w| w == b"\r\n\r\n").ok_or("raea/blender: the bridge's reply had no body")?;
    let status = String::from_utf8_lossy(&reply[..at]).split_whitespace().nth(1).unwrap_or("").to_string();
    let text = &reply[at + 4..];
    if status != "200" {
        return Err(format!("raea/blender: the bridge answered {status}: {}", String::from_utf8_lossy(text)));
    }
    serde_json::from_slice(text).map_err(|e| format!("raea/blender: the bridge's reply: {e}"))
}
