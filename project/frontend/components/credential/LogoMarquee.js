"use client";

/**
 * The partner logo strip: a continuous left-to-right loop that pauses while the
 * pointer is over it.
 *
 * The track holds two identical copies and slides by exactly one copy's width.
 * Spacing comes from a margin on each item rather than flex `gap`, because a
 * gap leaves the seam between the copies half a gap short and the loop visibly
 * jumps every cycle.
 */
export default function LogoMarquee({ logos, secondsPerLogo = 2.2 }) {
  const copy = (hidden) =>
    logos.map((logo) => (
      <li key={`${hidden ? "b" : "a"}-${logo.src}`} aria-hidden={hidden || undefined}>
        {/* eslint-disable-next-line @next/next/no-img-element -- fixed-height marquee art, sized by CSS */}
        <img src={logo.src} alt={hidden ? "" : logo.name} />
      </li>
    ));

  return (
    <div className="logo-strip">
      <ul
        className="logo-track"
        style={{ animationDuration: `${(logos.length * secondsPerLogo).toFixed(1)}s` }}
      >
        {copy(false)}
        {copy(true)}
      </ul>
    </div>
  );
}
