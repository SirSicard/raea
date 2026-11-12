// A title of inline-block spans whose one span's transform changes after the first layout: a transform takes no part
// in layout, so the line box, and the block under it, stay where they were (#109: the line grew by the font's descent
// on a relayout, since the unchanged spans came back from the layout cache with their size but no baseline, and sat
// on the line by their bottom margin edge; a per-character spring title jumped 24 px on single frames).
// proves: css.properties.transform, css.properties.display.inline-block
import { useState } from "react";
export const steps = [{ click: "toggle" }];
export default function Case() {
  const [moved, setMoved] = useState(false);
  return (
    <div data-testid="root" className="flex h-full w-full flex-col items-center bg-white p-4">
      <button data-testid="toggle" className="mb-2 bg-slate-200 px-2" onClick={() => setMoved(!moved)}>toggle</button>
      <div data-testid="title" style={{ whiteSpace: "pre", fontFamily: "Parity Mono", fontSize: 40, lineHeight: 1.2 }}>
        {[..."2026 11"].map((ch, i) => (
          <span key={i} style={{ display: "inline-block", transform: `translateY(${i === 1 && moved ? 0.5 : 0}px)` }}>{ch}</span>
        ))}
      </div>
      <div data-testid="after" className="mt-2 h-1 w-64 bg-blue-600" />
    </div>
  );
}
