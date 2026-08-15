"use client";

import Image from "next/image";
import SlideTopBar from "./SlideTopBar";

/**
 * "OUR EXPERTISE" — v1, the image-card version. PARKED: it is no longer in the
 * deck (see app/credential/page.js); ExpertiseSlideV2 took its slot. Kept whole
 * so the card treatment can be brought back without rebuilding it.
 *
 * Approximated from the Figma frame at node 20:2 with plain
 * Tailwind classes (no calc(var(--u)) precision scaling — see the other
 * slides for that approach, kept here deliberately simple to match the rest
 * of the site).
 *
 * The outer element keeps the shared `slide-stage` class only so SlideTopBar
 * (used by every slide) keeps getting the --u/--fit custom properties it
 * needs — nothing below the top bar depends on them.
 */

// Static film-grain tile — an SVG fractal-noise filter, the same technique
// LiquidGrainBackground draws to canvas, but as a fixed image so there's no
// per-frame redraw and no motion.
// baseFrequency high enough to read as fine grain rather than smoky turbulence
const GRAIN_BG =
  `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.4' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

const LENSES = [
  {
    lens: "knowledge",
    src: "/profilecredential/expertise_demo_2.png",
    title: "Technical Knowledge",
    copy: "ESG & scientific expertise.",
    alt: "Mission Earth leading a local water-resource management workshop",
    color: "text-[#9ad8ff]",
    deep: "#0e3355", // same hue as `color`, darkened — the card's resting gradient
    showImage: true, // the other cards stay image-off for now
  },
  {
    lens: "nature",
    src: "/profilecredential/expertise_natureconnected.png",
    title: "Nature Connected",
    copy: "Deep understanding of the living world.",
    alt: "A guided forest walk through the trees",
    color: "text-[#80c79d]",
    deep: "#153a26",
    showImage: true,
  },
  {
    lens: "people",
    src: "/profilecredential/expertise_peopleengage.png",
    title: "People Engagement",
    copy: "Turning insight into collective action.",
    alt: "A team workshop in discussion around a table",
    color: "text-[#f5dc7e]",
    deep: "#42350f",
    objectPosition: "23% center", // keeps the group in frame on this crop
  },
  {
    lens: "creative",
    src: "/profilecredential/expertise_peopleengage.png",
    title: "Creative & Communication",
    copy: "Turning insight into collective action.",
    alt: "A team workshop in discussion around a table",
    color: "text-[#F2B4CF]",
    deep: "#CD4D84",
    objectPosition: "23% center", // keeps the group in frame on this crop
  },
];

export default function ExpertiseSlideV1({ preparedFor }) {
  return (
    <div className="slide-stage flex flex-col justify-between gap-8 py-10 md:py-8">
      {/*
        `justify-between` only creates space when the content is shorter than
        the viewport — on mobile this slide stacks tall enough to exceed
        100svh, at which point it has nothing left to distribute and every
        section would sit flush against the next. `gap-8` is the floor that
        keeps a minimum breathing room regardless.
      */}
      <SlideTopBar preparedFor={preparedFor} />

      <section className="flex flex-col items-start gap-4 md:gap-2">
        <div className="flex items-center gap-4">
          <span className="h-px w-16 bg-me-gold/60" aria-hidden="true" />
          <p className="text-[16px] uppercase tracking-[0.3em] text-me-gold/60">Our Expertise</p>
        </div>
        <h2 className="text-3xl font-light leading-snug text-me-gold md:text-5xl lg:text-[40px]">
          Four Expertise. One <b className="font-semibold">MISSION</b>
        </h2>
      </section>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-4 sm:gap-2">
        {LENSES.map((l) => (
          <article
            key={l.lens}
            className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/15 sm:aspect-[2.5/4]"
          >
            {/* resting card face: dark bottom fading up into a darkened version of the
                card's own accent colour, with a soft blurred bloom and the deck's own
                static grain — no motion. Stays fully opaque always; the image (below,
                painted on top of it) is what fades with hover, not this. */}
            <div className="absolute inset-0" aria-hidden="true">
              {/* #002740 matches the deck's own navy floor — also keeps the base
                  light enough for the overlay-blend grain below to actually show;
                  overlay's 2×base term crushes it to nothing on a near-black base */}
              <div
                className="absolute inset-0"
                style={{ backgroundImage: `linear-gradient(to top, #052032, ${l.deep})` }}
              />
              {/* oversized + blurred so the falloff never shows a hard edge at the card's border */}
              <div
                className="absolute -inset-16 blur-2xl"
                style={{ background: `radial-gradient(0% 55% at 50% 100%, ${l.deep} 0%, transparent 72%)` }}
              />
              <div
                className="absolute inset-0 opacity-[0.35] mix-blend-overlay"
                style={{ backgroundImage: GRAIN_BG, backgroundSize: "180px 180px" }}
              />
            </div>
            {/* image sits above the gradient face, confined to the card's top half —
                half-visible at rest, fully clear on hover */}
            {l.showImage && (
              <div className="absolute inset-x-0 top-0 h-[70%] overflow-hidden">
                <Image
                  src={l.src}
                  alt={l.alt}
                  fill
                  sizes="(max-width: 767px) 100vw, 33vw"
                  className="scale-100 object-cover opacity-50 transition-all duration-500 group-hover:scale-110 group-hover:opacity-100"
                  style={l.objectPosition ? { objectPosition: l.objectPosition } : undefined}
                />
              </div>
            )}
            <div className="absolute inset-x-0 bottom-0 space-y-1 p-4 md:p-6">
              <h3 className={`text-xl font-semibold md:text-2xl lg:text-[18px] ${l.color}`}>{l.title}</h3>
              <p className="text-sm text-neutral-100 md:text-base">{l.copy}</p>
            </div>
          </article>
        ))}
      </section>
{/*
      <section className="flex justify-center">
        <span className="h-0.5 w-full max-w-2xl bg-[#205b80]" aria-hidden="true" />
      </section>
*/}
      <section className="flex flex-col items-center gap-6 px-6 text-center md:gap-6 md:pb-8">
        <span className="h-[1px] w-[440px] max-w-2xl bg-[#ffffff] opacity-[50%]" aria-hidden="true" />
        <p className="max-w-2xl text-base leading-relaxed text-me-gold md:text-xl lg:text-[16px]">
          We turn <b className="font-semibold">sustainability</b> into tangible{" "}
          <b className="font-semibold">implementation</b>,
          <br className="hidden sm:block" />
          through the <b className="font-semibold text-white">CAT Model</b>
        </p>
      </section>
    </div>
  );
}
