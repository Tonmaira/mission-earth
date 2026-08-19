"use client";

import SlideTopBar from "./SlideTopBar";

/**
 * "OUR EXPERTISE" — v2, built from the Figma frame at node 41:363.
 *
 * Same four lenses as v1, stripped of the image cards: each is now a numbered
 * column, gold numeral over a cream title and one line of copy. Plain Tailwind
 * rather than calc(var(--u)) precision, matching v1 and the rest of the site;
 * the `slide-stage` class stays only so SlideTopBar keeps getting the --u/--fit
 * custom properties it reads.
 *
 * v1 is parked in ExpertiseSlideV1.js.
 */

const LENSES = [
  {
    lens: "knowledge",
    title: "Technical Knowledge",
    copy: "ESG & scientific expertise.",
  },
  {
    lens: "nature",
    title: "Nature Connected",
    copy: "Deep understanding of the living world.",
  },
  {
    lens: "people",
    title: "People Engagement",
    copy: "Turning insight into collective action.",
  },
  {
    lens: "creative",
    title: "Creative & Communication",
    copy: "Turning complexity into compelling stories.",
  },
];

export default function ExpertiseSlideV2({ preparedFor }) {
  return (
    // top padding comes from `slide-stage` (--deck-gap), which the top bar
    // mirrors underneath itself — only the bottom is set here
    <div className="slide-stage flex flex-col justify-between gap-10 pb-10 md:pb-8">
      <SlideTopBar preparedFor={preparedFor} />

      <section className="flex flex-col items-start gap-4 md:gap-2">
        <div className="flex items-center gap-4">
          <span className="h-px w-16 bg-me-gold/60" aria-hidden="true" />
          <p className="text-[16px] uppercase tracking-[0.3em] text-me-gold/60 3xl:text-[20px]!">Our Expertise</p>
        </div>
        <h2 className="text-[16px] font-light leading-snug text-me-gold md:text-5xl lg:text-[40px] 3xl:text-[52px]!">
          Four Pillars. One <b className="font-semibold">MISSION</b>
        </h2>
      </section>

      {/*
        Equal quarters that hug the top of their row — `items-start` keeps a
        two-line title from stretching its neighbours.

        The height and top padding are the Figma block verbatim as shares of the
        frame (480 and 100 of 1080). Left to size itself the row is only as tall
        as its text, and `justify-between` then spreads the leftover room evenly
        and drops the numbers a good deal below where the design puts them.
        Desktop only: on a phone the slide stacks and grows past one viewport,
        where a fixed share of the frame means nothing.
      */}
      <section className="grid grid-cols-2 items-start gap-x-6 gap-y-10 sm:grid-cols-4 sm:gap-x-8 md:h-[44%] md:pt-[9%]">
        {LENSES.map((l, i) => (
          <article key={l.lens} className="flex flex-col items-start gap-2">
            <p className="text-3xl font-semibold leading-none text-me-gold md:text-4xl lg:text-[40px] 3xl:text-[52px]!">
              {i + 1}
            </p>
            <h3 className="text-base font-semibold text-[#F5F5F5] md:text-xl lg:text-[20px] 3xl:text-[26px]!">
              {l.title}
            </h3>
            <p className="text-sm text-[#F5F5F5] md:text-base lg:text-[15px] 3xl:text-[19px]!">{l.copy}</p>
          </article>
        ))}
      </section>

      <section className="flex flex-col items-center gap-6 px-6 text-center md:gap-6 md:pb-8">
        {/* w-full first, so the rule shrinks with the phone instead of running
            off both edges at its designed 440px */}
        <span className="h-[1px] w-full max-w-[440px] bg-[#ffffff] opacity-[50%]" aria-hidden="true" />
        <p className="max-w-2xl text-base leading-relaxed text-me-gold md:text-xl lg:text-[16px] 3xl:text-[21px]!">
          We turn <b className="font-semibold">sustainability</b> into tangible{" "}
          <b className="font-semibold">implementation</b>,{" "}
          {/* the space above matters: below `sm` the break is off and the two
              halves would otherwise run together as "implementation,through" */}
          <br className="hidden sm:block" />
          through the <b className="font-semibold text-white">CAT Model</b>
        </p>
      </section>
    </div>
  );
}
