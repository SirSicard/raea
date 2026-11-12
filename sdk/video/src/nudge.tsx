// Nudge: a part placed by hand on raea's picture (docs/editing.feature, E1). The editor writes a moved, scaled, turned
// or faded part back to the composition as one <Nudge x y scale rotate opacity> around the element that holds it; the
// next change to the same part re-writes that line.
import { cloneElement, isValidElement, type CSSProperties, type ReactElement, type ReactNode } from "react";
import { AbsoluteFill } from "./timeline";

export interface NudgeProps {
  /** how far to move it, in the composition's pixels */
  x?: number;
  /** how far to move it down, in the composition's pixels */
  y?: number;
  /** how much bigger (2) or smaller (0.5), about its centre */
  scale?: number;
  /** a turn, in degrees, about its centre */
  rotate?: number;
  /** 0 (gone) to 1 (as it was), times its own opacity */
  opacity?: number;
  /** the part it places: an element, or a component, which moves inside a full-frame layer */
  children?: ReactNode;
}

/** Places its child: an element gets the move in front of its own transform and the fade times its own opacity; a
 *  component, whose box it can't reach, is placed inside a full-frame layer. */
export function Nudge({ x = 0, y = 0, scale = 1, rotate = 0, opacity = 1, children }: NudgeProps) {
  for (const [k, v] of Object.entries({ x, y, scale, rotate, opacity }))
    if (!Number.isFinite(v)) throw new RangeError(`Nudge: ${k} must be a finite number, got ${v}`);
  if (scale <= 0) throw new RangeError(`Nudge: scale must be above 0, got ${scale}`);
  const fade = Math.min(1, Math.max(0, opacity));
  const move = [
    (x || y) && `translate(${x}px, ${y}px)`,
    rotate && `rotate(${rotate}deg)`,
    scale !== 1 && `scale(${scale})`,
  ].filter(Boolean).join(" ") || undefined;
  if (isValidElement(children) && typeof children.type === "string") {
    const style = ((children.props as { style?: CSSProperties }).style ?? {}) as CSSProperties;
    const own = typeof style.opacity === "number" ? style.opacity : style.opacity === undefined ? 1 : Number(style.opacity);
    return cloneElement(children as ReactElement<{ style?: CSSProperties }>, {
      style: {
        ...style,
        ...(move ? { transform: style.transform ? `${move} ${style.transform}` : move } : {}),
        ...(fade !== 1 ? { opacity: own * fade } : {}),
      },
    });
  }
  return <AbsoluteFill style={{ ...(move ? { transform: move } : {}), ...(fade !== 1 ? { opacity: fade } : {}) }}>{children}</AbsoluteFill>;
}
