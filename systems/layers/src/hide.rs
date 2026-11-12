//! Layers hidden by key (RAEA_HIDE_LAYERS), as the layer pass's oracle needs them (bench/layers/oracle.sh): a page
//! element as CSS (this), a 3D part as its Visibility (runtime/scene). And the footage hidden (RAEA_HIDE_MEDIA), for
//! the CapCut export (docs/capcut.feature CC2b): `1` hides every <Video> drawn from a file and the backgrounds of what
//! holds one, so what's left is what raea draws over the footage; `under` keeps only those backgrounds, what raea
//! draws under it.

use crate::Layer;

/// RAEA_HIDE_LAYERS: the layers keyed (a key a line or comma) drawn hidden, each element with its stamps and all
/// inside it; RAEA_HIDE_MEDIA: the footage (the page's only elements with data-raea-src) and what's over it or under
/// it, as above; as page CSS. None when neither hides anything.
pub fn hidden_css() -> Option<String> {
    let keys = std::env::var("RAEA_HIDE_LAYERS").unwrap_or_default();
    let mut hide: Vec<String> = keys.split([',', '\n']).filter(|k| !k.trim().is_empty()).map(|k| layer_selector(k.trim())).collect();
    let mut css = String::new();
    match std::env::var("RAEA_HIDE_MEDIA").as_deref() {
        // an element holding footage paints its background before it, under it
        Ok("1") => {
            hide.push("[data-raea-src]".into());
            css.push_str(":has([data-raea-src]) { background: transparent !important; box-shadow: none !important; }\n");
        }
        Ok("under") => {
            hide.extend(["[data-raea-src]".into(), ":not(:has([data-raea-src]))".into()]);
            css.push_str(":has([data-raea-src]) { color: transparent !important; text-shadow: none !important; }\n");
        }
        _ => {}
    }
    if !hide.is_empty() {
        css.push_str(&format!("{} {{ visibility: hidden !important; }}", hide.join(", ")));
    }
    (!css.is_empty()).then_some(css)
}

/// The CSS selector of the element a layer key names, and of everything inside it: "loc[#index][|use|use…]" as its
/// data-raea-loc, data-raea-idx and data-raea-use (engine/bundle stamp.rs)
pub fn layer_selector(key: &str) -> String {
    let l = Layer::of(key.to_string(), "element", String::new(), None, None);
    let q = |v: &str| serde_json::to_string(v).unwrap_or_default();
    let mut sel = format!("[data-raea-loc={}]", q(&l.loc));
    sel.push_str(&l.index.map_or_else(|| ":not([data-raea-idx])".to_string(), |i| format!("[data-raea-idx={}]", q(&i))));
    sel.push_str(&Some(l.uses.join("|")).filter(|u| !u.is_empty()).map_or_else(|| ":not([data-raea-use])".to_string(), |u| format!("[data-raea-use={}]", q(&u))));
    format!("{sel}, {sel} *")
}
