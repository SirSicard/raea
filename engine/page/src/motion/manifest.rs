//! The render manifest's videos and text (render.json, `raea render --manifest`), as the page laid them out.

use super::*;

impl BlitzPage {
    /// The render manifest's videos and text, as laid out (raea check's clipped, safe-area and reading rules read it):
    /// each shown element with a `data-raea-src` (a video: its source, time and box), and each element's own words
    /// (its text children's, inline elements' words going to the nearest element up with a box) with that box, its
    /// opacity, colour, size, weight and alignment as computed. In document order, as raea-runtime-js's page gave them.
    pub fn manifest(&mut self) -> (Vec<serde_json::Value>, Vec<serde_json::Value>) {
        use serde_json::json;
        use style::computed_values::visibility::T as Visibility;
        use style::values::specified::text::TextAlignKeyword;
        let docs = self.app.world().non_send::<Docs>();
        let Some(doc) = docs.0.get(&self.page) else { return (vec![], vec![]) };
        let r = |v: f64| (v * 10.0).round() / 10.0;
        let rect = |n: blitz_dom::NodeId| doc.get_client_bounding_rect(n).filter(|b| b.width > 0.0 && b.height > 0.0);
        // its own opacity times its parents', 0 when it or one of them isn't shown
        let alpha = |n: blitz_dom::NodeId| -> f64 {
            let (mut a, mut at) = (1.0f64, Some(n));
            while let Some(x) = at {
                let Some(node) = doc.get_node(x) else { break };
                if node.is_element() {
                    let Some(s) = node.primary_styles() else { return 0.0 };
                    if !node.has_boxes() || (x == n && matches!(s.clone_visibility(), Visibility::Hidden | Visibility::Collapse)) {
                        return 0.0;
                    }
                    a *= s.get_effects().opacity as f64;
                }
                at = node.parent;
            }
            a
        };
        // the source stamps (engine/bundle stamp.rs) of the nearest element up from `n` that has them: where the JSX
        // is written ("promo.tsx:12:7"), and the uses of the edit's components it was drawn in, nearest first
        let stamps = |n: blitz_dom::NodeId, entry: &mut serde_json::Value| {
            let mut at = Some(n);
            while let Some(x) = at {
                let Some(node) = doc.get_node(x) else { break };
                if let Some(loc) = node.attr(LocalName::from("data-raea-loc")) {
                    entry["loc"] = json!(loc);
                    if let Some(uses) = node.attr(LocalName::from("data-raea-use")).filter(|u| !u.is_empty()) {
                        entry["use"] = json!(uses.split('|').collect::<Vec<_>>());
                    }
                    // its place in a list (its .map()'s key), when it has one
                    if let Some(idx) = node.attr(LocalName::from("data-raea-idx")) {
                        entry["index"] = json!(idx);
                    }
                    return;
                }
                at = node.parent;
            }
        };
        let (mut videos, mut text) = (Vec::new(), Vec::new());
        let mut owned: Vec<(blitz_dom::NodeId, Vec<String>)> = Vec::new();
        // the whole document: a composition's sequences and screens are pages of their own under the root's
        let mut stack = vec![doc.root_node().id];
        while let Some(n) = stack.pop() {
            let Some(node) = doc.get_node(n) else { continue };
            if node.is_element() && matches!(node.element_data().map(|e| &*e.name.local), Some("style" | "script")) {
                continue;
            }
            stack.extend(node.children.iter().rev().copied());
            if let Some(src) = node.attr(LocalName::from("data-raea-src")) {
                let a = alpha(n);
                if let (Some(b), true) = (rect(n), a > 0.01) {
                    let at = node.attr(LocalName::from("data-raea-at")).and_then(|v| v.parse::<f64>().ok()).unwrap_or(0.0);
                    let mut v = json!({"src": src, "at": at, "box": [r(b.x), r(b.y), r(b.width), r(b.height)], "opacity": (a * 100.0).round() / 100.0});
                    // how the picture fills its box (the CapCut export places a clip by it, docs/capcut.feature CC2a)
                    if let Some(s) = node.primary_styles() {
                        use style::computed_values::object_fit::T as Fit;
                        v["fit"] = json!(match s.clone_object_fit() {
                            Fit::Contain => "contain",
                            Fit::Cover => "cover",
                            Fit::Fill => "fill",
                            Fit::None => "none",
                            Fit::ScaleDown => "scale-down",
                        });
                    }
                    stamps(n, &mut v);
                    videos.push(v);
                }
                continue;
            }
            if !node.is_text_node() {
                continue;
            }
            // kept untrimmed: a space in a span of its own is where a word ends in letters set one a span
            let words = node.text_content();
            if words.is_empty() {
                continue;
            }
            // an inline element (a <span> around a caption word) has no box of its own: its words belong to the
            // nearest element up that has one
            let mut up = node.parent;
            while let Some(p) = up {
                let inline = doc.get_node(p).and_then(|x| x.primary_styles()).is_some_and(|s| s.clone_display().outside() == style::values::specified::box_::DisplayOutside::Inline);
                if !inline && rect(p).is_some() {
                    break;
                }
                up = doc.get_node(p).and_then(|x| x.parent);
            }
            let Some(owner) = up else { continue };
            if node.parent.is_none_or(|p| alpha(p) <= 0.01) {
                continue;
            }
            match owned.iter_mut().find(|(o, _)| *o == owner) {
                Some((_, ws)) => ws.push(words.to_string()),
                None => owned.push((owner, vec![words.to_string()])),
            }
        }
        for (owner, words) in owned {
            let Some(words) = run_text(&words) else { continue };
            let (Some(b), Some(node)) = (rect(owner), doc.get_node(owner)) else { continue };
            let Some(s) = node.primary_styles() else { continue };
            let c = s.clone_color().to_color_space(style::color::ColorSpace::Srgb);
            let [cr, cg, cb] = [c.components.0, c.components.1, c.components.2].map(|v| (v.clamp(0.0, 1.0) * 255.0).round());
            let ca = c.alpha;
            let color = if ca >= 1.0 { format!("rgb({cr}, {cg}, {cb})") } else { format!("rgba({cr}, {cg}, {cb}, {})", (ca * 1000.0).round() / 1000.0) };
            let font = s.get_font();
            let align = match s.clone_text_align() {
                TextAlignKeyword::Center | TextAlignKeyword::MozCenter => "center",
                TextAlignKeyword::Right | TextAlignKeyword::End | TextAlignKeyword::MozRight => "right",
                TextAlignKeyword::Justify => "justify",
                _ => "left",
            };
            // words set in an element shorter or narrower than they are (a fixed height, overflow visible) are drawn
            // past it: the text's box is where they are, so it grows to cover its lines (DR4's caption cheat)
            let (mut w, mut h) = (b.width, b.height);
            if let Some(l) = node.element_data().and_then(|e| e.inline_layout_data.as_ref()) {
                let (fl, scale) = (node.final_layout(), doc.viewport().scale() as f64);
                // the element's own size to its bounding rect's (a transform scales one into the other)
                let (fx, fy) = (b.width / (fl.size.width as f64).max(1e-6), b.height / (fl.size.height as f64).max(1e-6));
                w = w.max(((fl.border.left + fl.padding.left) as f64 + l.layout.width() as f64 / scale) * fx);
                h = h.max(((fl.border.top + fl.padding.top) as f64 + l.layout.height() as f64 / scale) * fy);
            }
            let mut t = json!({"text": words, "box": [r(b.x), r(b.y), r(w), r(h)], "opacity": (alpha(owner) * 100.0).round() / 100.0,
                "color": color, "size": font.font_size.computed_size().px() as f64, "weight": font.font_weight.value() as f64, "align": align});
            // where the letters are across the lines (each line's offset is its alignment's), as a box of its own: a
            // centred line in a full-width box is tested by this, not the box (raea check's safe-area rule, #89)
            if let Some(l) = node.element_data().and_then(|e| e.inline_layout_data.as_ref()) {
                let (fl, scale) = (node.final_layout(), doc.viewport().scale() as f64);
                let fx = b.width / (fl.size.width as f64).max(1e-6);
                let (mut x0, mut x1) = (f64::MAX, f64::MIN);
                for line in l.layout.lines() {
                    let m = line.metrics();
                    x0 = x0.min(m.offset as f64);
                    x1 = x1.max((m.offset + m.advance) as f64);
                }
                if x1 > x0 {
                    let left = b.x + ((fl.border.left + fl.padding.left) as f64 + x0 / scale) * fx;
                    t["ink"] = json!([r(left), r(b.y), r((x1 - x0) / scale * fx), r(h)]);
                }
            }
            // its first named face and how many lines it was set on (docs/direction.feature DR1's Text)
            if let Some(f) = font.font_family.families.iter().find_map(|f| match f { style::values::computed::font::SingleFontFamily::FamilyName(n) => Some(n.name.to_string()), _ => None }) {
                t["family"] = json!(f);
            }
            if let Some(l) = node.element_data().and_then(|e| e.inline_layout_data.as_ref()) {
                t["lines"] = json!(l.layout.len());
            }
            stamps(owner, &mut t);
            text.push(t);
        }
        (videos, text)
    }
}

/// A run's words from its text nodes, in order: joined by a space, as caption words set one a span are; or, when every
/// one is a single letter (a word revealed letter by letter, its spaces spans of their own), as the letters read
/// ("49 BC", not "4 9 B C"). None when the run is only white space.
fn run_text(pieces: &[String]) -> Option<String> {
    let words: Vec<&str> = pieces.iter().map(|p| p.trim()).filter(|p| !p.is_empty()).collect();
    if words.is_empty() {
        return None;
    }
    if words.iter().all(|w| w.chars().count() == 1) {
        return Some(pieces.concat().split_whitespace().collect::<Vec<_>>().join(" "));
    }
    Some(words.join(" "))
}

#[cfg(test)]
mod tests {
    use super::run_text;

    #[test]
    fn letters_set_one_a_span_read_as_their_words() {
        let s = |v: &[&str]| v.iter().map(|p| p.to_string()).collect::<Vec<_>>();
        assert_eq!(run_text(&s(&["4", "9", " ", "B", "C"])).as_deref(), Some("49 BC"));
        assert_eq!(run_text(&s(&["won", "a", "civil war,"])).as_deref(), Some("won a civil war,"), "word spans keep a space between");
        assert_eq!(run_text(&s(&[" ", "\n"])), None);
    }
}
