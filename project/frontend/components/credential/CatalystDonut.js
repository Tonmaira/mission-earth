"use client";

/**
 * CATALYST MAPPING — the C·A·T pie from the Figma case-study frame (node
 * 34:161), drawn from each project's own mix instead of being a fixed export.
 *
 * The geometry is the Figma one: a 189×200 box, a pie of radius 71 centred at
 * (94.5, 97), a broken gold ring on that same radius, and three 24-radius
 * badges sitting on it. What changes per project is the share each slice takes
 * and, with it, where its badge sits: **every badge is parked at the middle of
 * its own slice**, so the picture reads as the split without needing labels.
 * (The Figma frame drew ประโยชน์สุข with the badges evenly spaced at 120° —
 * that only happens here when a project splits 33/33/33.)
 *
 * The three letterforms are the vector outlines from the Figma export, moved
 * as a whole to wherever their badge lands, so the glyphs stay the designer's.
 */

const CX = 94.5;
const CY = 97;
const R_PIE = 71; // slice radius
const R_RING = 71; // the gold ring the badges sit on
const R_BADGE = 24.04;
const R_BADGE_RING = 24.385; // mid-radius of the badge's gold outline
const RING_STROKE = 2.63; // both the ring and the badge outlines, per the export

/**
 * The letters, verbatim from the export, each with the centre it was drawn
 * around — the difference between that and the badge's live position is the
 * translation applied below.
 */
const LETTERS = {
  core: {
    cx: 93.17,
    cy: 25.52,
    d: "M83.8686 19.7129C84.8465 17.9981 86.1841 16.6605 87.8769 15.7045C89.5697 14.7485 91.473 14.2661 93.5781 14.2661C96.0427 14.2661 98.2004 14.8976 100.051 16.1606C101.902 17.4236 103.2 19.169 103.937 21.4013H98.8538C98.3495 20.3488 97.6391 19.5594 96.7225 19.0331C95.8059 18.5068 94.749 18.2437 93.5474 18.2437C92.2624 18.2437 91.1222 18.5419 90.1223 19.1427C89.1224 19.7436 88.3418 20.59 87.7848 21.6863C87.2279 22.7827 86.9472 24.0633 86.9472 25.5368C86.9472 27.0103 87.2279 28.269 87.7848 29.3741C88.3418 30.4793 89.1224 31.3301 90.1223 31.9309C91.1222 32.5317 92.2624 32.8299 93.5474 32.8299C94.749 32.8299 95.8059 32.5624 96.7225 32.023C97.6391 31.4879 98.3495 30.6898 98.8538 29.6373H103.937C103.2 31.8914 101.911 33.6412 100.069 34.8955C98.2267 36.1497 96.0647 36.7725 93.5781 36.7725C91.473 36.7725 89.5741 36.2945 87.8769 35.334C86.1841 34.378 84.8465 33.0448 83.8686 31.3388C82.8906 29.6329 82.3994 27.6989 82.3994 25.528C82.3994 23.3572 82.8906 21.4188 83.8686 19.7041V19.7129Z",
  },
  action: {
    cx: 154.87,
    cy: 132.08,
    d: "M159.242 138.911H150.463L149.011 143.112H144.371L152.296 121.04H157.444L165.369 143.112H160.694L159.242 138.911ZM158.041 135.372L154.852 126.153L151.664 135.372H158.041Z",
  },
  traceability: {
    cx: 32.29,
    cy: 132.06,
    d: "M40.373 121.04V124.61H34.5008V143.082H30.0802V124.61H24.208V121.04H40.373Z",
  },
};

/** Slice order and colour, taken from the badge fills in the Figma frame. */
const SEGMENTS = [
  { key: "core", fill: "#205B80", letterFill: "#CEA872" },
  { key: "action", fill: "#FFFFFF", letterFill: "#CEA872" },
  { key: "traceability", fill: "#3085BB", letterFill: "#CEA872" },
];

const GOLD = "#CEA872";

/** Angle in degrees clockwise from 12 o'clock → a point on a circle. */
const pointAt = (angle, radius) => {
  const rad = ((angle - 90) * Math.PI) / 180;
  return [CX + radius * Math.cos(rad), CY + radius * Math.sin(rad)];
};

const round = (n) => Math.round(n * 1000) / 1000;

/** One pie slice, from `start` degrees for `sweep` degrees. */
const slicePath = (start, sweep) => {
  const [x1, y1] = pointAt(start, R_PIE);
  const [x2, y2] = pointAt(start + sweep, R_PIE);
  const largeArc = sweep > 180 ? 1 : 0;
  return `M ${round(CX)} ${round(CY)} L ${round(x1)} ${round(y1)} A ${R_PIE} ${R_PIE} 0 ${largeArc} 1 ${round(x2)} ${round(y2)} Z`;
};

/**
 * @param {{core: number, action: number, traceability: number}} mix
 *   shares of the project's effort. They are normalised, so 40/40/20 and
 *   2/2/1 draw the same picture.
 */
export default function CatalystDonut({ mix, className = "", title = "Catalyst mapping" }) {
  const total = SEGMENTS.reduce((sum, s) => sum + (mix[s.key] || 0), 0);
  if (!total) return null;

  // Anchor the wheel so CORE's badge is at 12 o'clock whatever its share, as
  // it is in the Figma frame; the other two then fall where their shares put
  // them. Starting the first slice at 12 o'clock instead would swing C off to
  // the side and the whole graphic would read as rotated.
  let cursor = -(((mix.core || 0) / total) * 360) / 2;
  const slices = SEGMENTS.map((s) => {
    const share = (mix[s.key] || 0) / total;
    const sweep = share * 360;
    const start = cursor;
    cursor += sweep;
    return { ...s, share, start, sweep, mid: start + sweep / 2 };
  });

  const label = slices
    .map((s) => `${s.key} ${Math.round(s.share * 100)}%`)
    .join(", ");

  return (
    <svg
      viewBox="0 0 189 200"
      /* Top-aligned rather than centred: the slide gives this a box that can be
         taller than the drawing needs, and the default centring would float it
         away from the CATALYST MAPPING label above. When the box is *shorter*
         than the drawing, `meet` still scales the whole thing down to fit. */
      preserveAspectRatio="xMidYMin meet"
      className={className}
      role="img"
      aria-label={`${title}: ${label}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* slices */}
      {slices.map((s) =>
        // a project that puts everything in one bucket has no arc to draw —
        // start and end land on the same point and the wedge collapses
        s.sweep >= 359.99 ? (
          <circle key={s.key} cx={CX} cy={CY} r={R_PIE} fill={s.fill} />
        ) : s.sweep > 0 ? (
          <path key={s.key} d={slicePath(s.start, s.sweep)} fill={s.fill} />
        ) : null
      )}

      {/* the gold ring: drawn whole, then broken wherever a badge covers it */}
      <circle cx={CX} cy={CY} r={R_RING} fill="none" stroke={GOLD} strokeWidth={RING_STROKE} />

      {slices.map((s) => {
        if (!s.sweep) return null;
        const [bx, by] = pointAt(s.mid, R_RING);
        const letter = LETTERS[s.key];
        return (
          <g key={s.key}>
            <circle cx={round(bx)} cy={round(by)} r={R_BADGE} fill={s.fill} />
            <circle
              cx={round(bx)}
              cy={round(by)}
              r={R_BADGE_RING}
              fill="none"
              stroke={GOLD}
              strokeWidth={RING_STROKE}
            />
            <g transform={`translate(${round(bx - letter.cx)}, ${round(by - letter.cy)})`}>
              <path d={letter.d} fill={s.letterFill} />
            </g>
          </g>
        );
      })}
    </svg>
  );
}
