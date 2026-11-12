//! A frame's scene from the page: the tree of `data-3d` parts (sdk/web's collector writes it) as Node3s, the same
//! values native play reads from its React tree (raea-runtime-react's read3d).
//!
//! Each part comes as `{k: kind, i: id, p?: props JSON text, s?: shape text | null, c?: kids}`. The page keeps each
//! element's id while it lives and sends `p` and `s` only when their text changed since it last sent them; the rest
//! are this side's, kept by id. A ground's vertex buffer or a field's placements cross once, not every frame, and are
//! parsed once (native play keeps them the same way, props3d).

use std::collections::HashMap;
use std::sync::Arc;

use raea_core_scene::Node3;
use serde_json::{Map, Value};

#[derive(Default)]
pub struct Parts {
    kept: HashMap<u64, (Arc<Map<String, Value>>, Option<Arc<str>>)>,
}

impl Parts {
    /// The frame's parts: a list of parts. Ids not seen this frame are forgotten.
    pub fn nodes(&mut self, json: &str) -> Result<Vec<Node3>, String> {
        let v: Value = serde_json::from_str(json).map_err(|e| format!("raea: the scene isn't JSON: {e}"))?;
        let list = v.as_array().ok_or("raea: the scene is a list of parts")?;
        let mut seen = Vec::new();
        let out = list.iter().map(|n| self.node(n, &mut seen)).collect::<Result<Vec<_>, _>>()?;
        if self.kept.len() > seen.len() {
            let seen: std::collections::HashSet<u64> = seen.into_iter().collect();
            self.kept.retain(|k, _| seen.contains(k));
        }
        Ok(out)
    }

    fn node(&mut self, v: &Value, seen: &mut Vec<u64>) -> Result<Node3, String> {
        let kind = v["k"].as_str().ok_or_else(|| format!("raea: a part with no kind: {v}"))?;
        let id = v["i"].as_u64().ok_or_else(|| format!("raea: {kind} has no id"))?;
        seen.push(id);
        let had = self.kept.get(&id).cloned();
        let props = match &v["p"] {
            Value::String(s) => Arc::new(serde_json::from_str::<Map<String, Value>>(s).map_err(|e| format!("raea: {kind}'s props: {e}"))?),
            Value::Null if v.get("p").is_some() => Arc::default(),
            Value::Null => had.as_ref().map(|h| h.0.clone()).ok_or_else(|| format!("raea: {kind} #{id} sent without props, and none kept"))?,
            p => return Err(format!("raea: {kind}'s props are JSON text, got {p}")),
        };
        let shape = match v.get("s") {
            Some(Value::String(s)) => Some(s.as_str().into()),
            Some(_) => None,
            None => had.and_then(|h| h.1),
        };
        self.kept.insert(id, (props.clone(), shape.clone()));
        let kids = match v["c"].as_array() {
            Some(k) => k.iter().map(|n| self.node(n, seen)).collect::<Result<Vec<_>, _>>()?,
            None => Vec::new(),
        };
        Ok(Node3 { kind: kind.into(), props, shape, at: None, kids: kids.into() })
    }
}
