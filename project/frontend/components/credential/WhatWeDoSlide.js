"use client";

import LogoMarquee from "./LogoMarquee";
import PARTNER_LOGOS from "./partnerLogos";
import SlideTopBar from "./SlideTopBar";

/**
 * "WHAT WE DO" — built from the Figma frame "02-Sustain to implementation"
 * (1920×1080, node 15:221). Layout lives in the `.wwd-*` block in globals.css.
 */

const STATS = [
  {
    figure: "2+",
    lines: ["Years", "as a company"],
    // the aside is Poppins Light Italic in the design
    aside: "(and just getting started)",
  },
  { figure: "10+", lines: ["Years", "of expertise", "on the team"] },
  { figure: "30+", lines: ["Partner organizations", "& institutions"] },
  { figure: "10k+", lines: ["People reached", "through classes,", "workshops,", "camps & talks"] },
  { figure: "20+", lines: ["Cross-disciplinary experts", "in our network"] },
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

      <LogoMarquee logos={PARTNER_LOGOS} />
    </div>
  );
}
