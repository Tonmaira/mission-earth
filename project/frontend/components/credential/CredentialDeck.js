"use client";

import CaseStudySlide from "./CaseStudySlide";
import CatModelSlide from "./CatModelSlide";
import ClientBriefSlide from "./ClientBriefSlide";
import ContactSlide from "./ContactSlide";
import CoverSlide from "./CoverSlide";
import { CASE_STUDIES } from "./caseStudies";
import { clientBrief } from "./clientBriefs";
import DeckShell from "./DeckShell";
import ExpertiseSlideV2 from "./ExpertiseSlideV2";
import FootprintSlide from "./FootprintSlide";
import PreparedForProvider from "./preparedFor";
import Slide from "./Slide";
import SummarySlide from "./SummarySlide";
import WhatWeDoSlide from "./WhatWeDoSlide";
import WorksIndexSlide from "./WorksIndexSlide";

/*
 * Mission Earth — the credentials deck itself.
 *
 * Every slide is a <Slide>; `scrollable` marks the ones allowed to grow past a
 * viewport and `bleed` the ones that lay out their own full frame. The case
 * studies come from caseStudies.js, so their number and order live there.
 *
 * `preparedFor` is decided by the route: blank on /credential, and the name
 * behind a client's own link on /credential/<slug>. See clients.js.
 *
 * `client` is that same route's slug, and it buys one extra slide: the read of
 * the client's own business, near the end. It comes as the slug rather than the
 * name because the content is keyed by the link we issued, not by a display
 * string. No slug, or a slug with nothing written for it yet, and the deck
 * simply doesn't carry that slide. See clientBriefs.js.
 */
export default function CredentialDeck({ preparedFor = "", client = "" }) {
  const brief = clientBrief(client);

  return (
    <PreparedForProvider value={preparedFor}>
      <DeckShell>
        {/* 01 — cover (built from Figma node 1:2) */}
        <Slide id="cover" label="Cover" bleed scrollable>
          <CoverSlide />
        </Slide>

        {/* 02 — what we do (built from Figma node 15:221) */}
        <Slide id="what-we-do" label="What we do" bleed scrollable>
          <WhatWeDoSlide />
        </Slide>

        {/*
      03 — our expertise, v2 (built from Figma node 41:363).

      v1 — the image-card version off node 20:2 — is parked, not deleted: it
      still lives in components/credential/ExpertiseSlideV1.js. To put it back,
      import ExpertiseSlideV1 and swap the component below.
    */}
        <Slide id="expertise" label="Our expertise" bleed scrollable>
          <ExpertiseSlideV2 />
        </Slide>

        {/* 04 — our model (built from Figma node 32:63) */}
        <Slide id="model" label="Our model" bleed scrollable>
          <CatModelSlide />
        </Slide>

        {/* 05 — index of every work, ahead of the case studies it points into */}
        <Slide id="all-works" label="All works" bleed scrollable>
          <WorksIndexSlide />
        </Slide>

        {/* 07+ — case studies, from the Figma frame at node 34:161 */}
        {CASE_STUDIES.map((study) => (
          <Slide
            key={study.id}
            id={study.id}
            label={study.label}
            bleed
            scrollable
          >
            <CaseStudySlide study={study} />
          </Slide>
        ))}

        {/*
      The deck closes on two pages that answer "so what did all that add up
      to" — the map of where the work actually happened, then the numbers.
      They are a pair and read in that order: place, then scale.
    */}
        <Slide id="footprint" label="Where we work" bleed scrollable>
          <FootprintSlide />
        </Slide>

        <Slide id="summary" label="Summary" bleed scrollable>
          <SummarySlide />
        </Slide>

        {/*
      Just before the close, and only on a client's own link — what we read in
      their business. These sit after our own numbers on purpose: we say what
      we have done, then turn to them, then ask for the meeting. How many pages
      there are, and their order, is clientBriefs.js's call, not this file's.
    */}
        {brief?.slides.map((slide) => (
          <Slide key={slide.id} id={slide.id} label={slide.label} bleed scrollable>
            <ClientBriefSlide brief={brief} slide={slide} />
          </Slide>
        ))}

        {/* last — contact, with the address/socials block the cover hides */}
        <Slide id="contact" label="Contact" bleed>
          <ContactSlide />
        </Slide>
      </DeckShell>
    </PreparedForProvider>
  );
}
