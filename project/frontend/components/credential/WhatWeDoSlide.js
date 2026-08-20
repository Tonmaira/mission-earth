"use client";

import LogoMarquee from "./LogoMarquee";
import PARTNER_LOGOS from "./partnerLogos";
import SlideTopBar from "./SlideTopBar";

/**
 * "WHAT WE DO" — built from the Figma frame "02-Sustain to implementation"
 * (1920×1080, node 15:221). Layout lives in the `.wwd-*` block in globals.css.
 */

/*
 * Print-only stand-in for the marquee — built from Figma node 43:2. The
 * marquee only ever has a handful of logos actually visible on screen at
 * once (the rest are mid-scroll or waiting their turn), which is fine for a
 * live page but useless on a printed page: nothing scrolls, so most logos
 * would just never show up. This lays every logo from the same list out flat
 * instead, wrapping into rows, and only exists under `@media print` (`hidden
 * print:flex` — see credential.css for how the marquee it replaces gets the
 * opposite, `print:hidden`, so the two never show at the same time).
 */
function PrintLogoStrip({ logos }) {
  return (
    <div className="hidden flex-wrap items-center justify-center gap-x-8 gap-y-4 bg-white px-10 py-6 print:flex">
      {logos.map((logo) => (
        // eslint-disable-next-line @next/next/no-img-element -- print-only static art, no next/image benefit
        <img key={logo.src} src={logo.src} alt={logo.name} className="h-10 w-auto object-contain" />
      ))}
    </div>
  );
}

const STATS = [
  {
    figure: "2+",
    lines: ["Years", "as a company"],
    // the aside is Poppins Light Italic in the design
    aside: "",
  },
  { figure: "10+", lines: ["Years", "of expertise", "on the team"] },
  { figure: "30+", lines: ["Partner organizations", "& institutions"] },
  { figure: "6k+", lines: ["People engagement", "through classes,", "workshops,", "camps & talks"] },
  { figure: "21", lines: ["Fields of expert", "collaboration across", "environment, biodiversity,", "community development", "& more"] },
];

export default function WhatWeDoSlide({ preparedFor }) {
  return (
    <div className="slide-stage wwd-stage">
      <SlideTopBar preparedFor={preparedFor} />

      <section className="wwd-main">
        <div className="cover-eyebrow wwd-eyebrow">
          <span className="cover-rule" aria-hidden="true" />
          <p>
            <span className="cover-tracked">WHAT WE DO</span>
          </p>
        </div>

        <h2 className="wwd-headline">
          We turn <b>sustainable</b> intention into
          <br />
          <b>purposeful implementation.</b>
        </h2>
      </section>

      <section className="wwd-stats">
        {STATS.map((stat) => (
          <div className="wwd-stat" key={stat.figure}>
            <p className="wwd-figure">{stat.figure}</p>
            <p className="wwd-label">
              {stat.lines.map((line) => (
                <span key={line}>{line}</span>
              ))}
              {stat.aside && <i>{stat.aside}</i>}
            </p>
          </div>
        ))}
      </section>

      <div className="print:hidden">
        <LogoMarquee logos={PARTNER_LOGOS} />
      </div>
      <PrintLogoStrip logos={PARTNER_LOGOS} />
    </div>
  );
}
