"use client";

import ContactBlock from "./ContactBlock";
import SlideTopBar from "./SlideTopBar";

/**
 * Cover slide — built from the Figma frame "Frame 1" (1920×1080, node 1:2).
 *
 * Layout and type live in the `.cover-*` block in globals.css, which lays the
 * slide out on a scaled 16:9 stage so every measurement stays the Figma number.
 */


// no default client here either — SlideTopBar takes it from the URL
export default function CoverSlide({ preparedFor, year = "2026" }) {
  return (
    <div className="slide-stage cover-stage">
      <SlideTopBar preparedFor={preparedFor} />

      <section className="cover-main">
        <div className="cover-eyebrow">
          <span className="cover-rule" aria-hidden="true" />
          <p>
            <span className="cover-tracked">CREDENTIAL</span>
            <span className="cover-dot" aria-hidden="true" />
            <span className="cover-tracked">{year}</span>
          </p>
        </div>

        <div className="cover-lockup">
          {/* eslint-disable-next-line @next/next/no-img-element -- flat SVG, nothing for the optimizer to do */}
          <img src="/full-logo-me.svg" alt="Mission Earth" />
          {/* Tagline hidden for now, on request. `hidden` rather than
              `invisible`: the lockup is centred in the space below the top bar
              (see `.cover-main` in credential.css), so an empty two-line box
              held here would push the logo off that centre.
              To bring it back: delete `hidden` and the aria-hidden. */}
          <p className="hidden" aria-hidden="true">
            {/* the space survives when the break is hidden on phones */}
            Your Trusted Partner in Sustainable Growth,{" "}
            <br className="cover-break" />
            Empowered by Experts.
          </p>
        </div>
      </section>

      {/*
        Contacts and socials are hidden here, on request — they are the closing
        slide's job now (see ContactSlide), and this one component draws them in
        both places. `hidden` (display: none) takes the block out of the layout
        entirely so `.cover-main` can claim the space and centre the logo in it.

        To bring it back: drop the `hidden` and the aria-hidden — and note that
        `.cover-main` in credential.css then needs its `flex: 1` /
        `justify-content: center` removed, or this block will be pinned to the
        bottom edge with the logo floating well above it.
      */}
      <ContactBlock className="hidden" aria-hidden="true" />
    </div>
  );
}
