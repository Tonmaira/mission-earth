"use client";

import CaseStudySlide from "@/components/credential/CaseStudySlide";
import CatModelSlide from "@/components/credential/CatModelSlide";
import ContactSlide from "@/components/credential/ContactSlide";
import CoverSlide from "@/components/credential/CoverSlide";
import { CASE_STUDIES } from "@/components/credential/caseStudies";
import DeckShell from "@/components/credential/DeckShell";
import ExpertiseSlideV2 from "@/components/credential/ExpertiseSlideV2";
import Slide from "@/components/credential/Slide";
import WhatWeDoSlide from "@/components/credential/WhatWeDoSlide";
import WorksIndexSlide from "@/components/credential/WorksIndexSlide";

/*
 * Mission Earth — interactive credentials deck.
 *
 * Every slide is a <Slide>; `scrollable` marks the ones allowed to grow past a
 * viewport and `bleed` the ones that lay out their own full frame. The case
 * studies come from caseStudies.js, so their number and order live there.
 */

export default function CredentialPage() {
  return (
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

      {/* 06+ — case studies, from the Figma frame at node 34:161 */}
      {CASE_STUDIES.map((study) => (
        <Slide key={study.id} id={study.id} label={study.label} bleed scrollable>
          <CaseStudySlide study={study} />
        </Slide>
      ))}

      {/* last — contact, with the address/socials block the cover hides */}
      <Slide id="contact" label="Contact" bleed>
        <ContactSlide />
      </Slide>
    </DeckShell>
  );
}
