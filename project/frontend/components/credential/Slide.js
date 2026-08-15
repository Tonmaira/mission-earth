"use client";

/**
 * One deck slide.
 *
 * scrollable=false (default) — locked to exactly one viewport, content never scrolls.
 * scrollable=true            — grows past the viewport; the deck uses `proximity`
 *                              snapping so long slides scroll freely and only snap
 *                              when the next slide's edge comes near.
 * bleed=true                 — skips the centred, padded container so the slide
 *                              owns the full viewport and lays itself out.
 */
export default function Slide({
  id,
  label,
  scrollable = false,
  bleed = false,
  className = "",
  contentClassName = "",
  children,
}) {
  return (
    <section
      id={id}
      data-slide=""
      data-label={label}
      data-scrollable={scrollable ? "" : undefined}
      data-bleed={bleed ? "" : undefined}
      className={[
        "relative w-full snap-start",
        scrollable ? "min-h-[100svh]" : "h-[100svh] overflow-hidden",
        bleed ? "flex items-center" : "",
        className,
      ].join(" ")}
    >
      {bleed ? (
        children
      ) : (
        <div
          className={[
            "mx-auto flex w-full max-w-[1280px] flex-col justify-center",
            "px-6 md:px-12 lg:px-20",
            scrollable ? "min-h-[100svh] py-24 md:py-28" : "h-full py-16 md:py-20",
            contentClassName,
          ].join(" ")}
        >
          {children}
        </div>
      )}
    </section>
  );
}
