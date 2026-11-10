// The edit: a React composition rendered by raea (`raea render`). The clips come from cuts.ts (`raea cut` writes it),
// the parts from components/ (`raea part add` copies them in; they're yours to change), the look from brand/brand.css.
// Change anything here: layout, timing, what plays when. `raea check` renders it and says what's wrong.
import { AbsoluteFill, Audio, Composition, Series, Video, registerRoot } from "raea";
import { cuts, edit, frames, total } from "./cuts";
import { css } from "./styles.gen";

// Before any cuts: a card saying what comes next, three seconds long. Its colours are its own on purpose, not a brand's
// (`raea brand SITE` writes brand/brand.css); delete it once the edit has clips.
function Start() {
  return (
    <AbsoluteFill style={{ background: "#14120f", color: "#f2ede4", justifyContent: "center", padding: "0 8%", fontFamily: "Helvetica, Arial, sans-serif" }}>
      <div style={{ fontSize: edit.width * 0.11, fontWeight: 700, letterSpacing: "-0.02em" }}>raea</div>
      <div style={{ fontSize: edit.width * 0.04, marginTop: edit.width * 0.03, lineHeight: 1.4, opacity: 0.8 }}>
        No clips yet. Run raea cut on a take to put its footage in cuts.ts, and this edit plays it.
      </div>
    </AbsoluteFill>
  );
}

function Edit() {
  if (cuts.length === 0) return <Start />;
  return (
    <AbsoluteFill className="bg-brand-bg">
      <style>{css}</style>
      <Series>
        {cuts.map((c, i) => (
          <Series.Sequence key={i} durationInFrames={frames(c)}>
            {/* a talking take: <FaceFrame>; a screen recording: <ScreenFit> (`raea frame TAKE` says which) */}
            {c.kind === "audio" ? (
              // a voice-over take: heard, nothing drawn (put the picture over it)
              <Audio src={c.src} startFrom={Math.round(c.from * edit.fps)} endAt={Math.round(c.to * edit.fps)} />
            ) : (
              <Video src={c.src} startFrom={Math.round(c.from * edit.fps)} endAt={Math.round(c.to * edit.fps)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            )}
          </Series.Sequence>
        ))}
      </Series>
    </AbsoluteFill>
  );
}

registerRoot(() => <Composition id="edit" component={Edit} width={edit.width} height={edit.height} fps={edit.fps} durationInFrames={total || edit.fps * 3} />);
