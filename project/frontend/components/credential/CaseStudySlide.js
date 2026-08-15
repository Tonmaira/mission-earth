"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import CatalystDonut from "./CatalystDonut";
import SlideTopBar from "./SlideTopBar";
import { sdgGoal } from "./caseStudies";

/**
 * "ผลงาน" — a case study, built from the Figma frame at node 34:161.
 *
 * Two columns over a dimmed photo: a bordered panel on the left (title, the
 * client/timeline/target rows, SDG alignment, the catalyst donut) and, on the
 * right, the headline numbers above the three C·A·T cards.
 *
 * Content comes in as `study` — see caseStudies.js. Plain Tailwind, as with
 * the other slides; below `md` the two columns stack and the slide is allowed
 * to run past one viewport (its <Slide> is `scrollable`).
 */

/**
 * The C·A·T badges are the same three marks on every case, so they live here
 * rather than in each case's data — nothing to fill in per project.
 */
const BADGES = {
  core: "/credential/cat-badges/badge-core.svg",
  action: "/credential/cat-badges/badge-action.svg",
  traceability: "/credential/cat-badges/badge-traceability.svg",
};

/** Largest the title is allowed to be — mirrors what the Tailwind classes on it
 *  would have been at each breakpoint, since an inline font-size overrides them. */
const titleCeiling = (width) => (width < 768 ? 28 : width < 1024 ? 32 : width < 1800 ? 36 : 46);
const TITLE_FLOOR = 20;

/**
 * Keeps a case title on one line by shrinking it until it fits the panel.
 *
 * Titles come from a spreadsheet and run from "ประโยชน์สุข" to
 * "Workshop: การจัดการน้ำ"; at one fixed size the long ones wrapped to a second
 * line, which pushed everything below down and shoved the catalyst donut off
 * the bottom of the panel. CSS has no shrink-to-fit, so this measures.
 *
 * If even the floor size doesn't fit, wrapping is allowed back — a title that
 * long is better on two lines than spilling out of the panel.
 */
function useFitTitle(title) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const fit = () => {
      let size = titleCeiling(window.innerWidth);
      el.style.whiteSpace = "nowrap";
      el.style.fontSize = `${size}px`;
      // +1 for sub-pixel rounding, which otherwise shrinks a title that fits
      while (size > TITLE_FLOOR && el.scrollWidth > el.clientWidth + 1) {
        size -= 1;
        el.style.fontSize = `${size}px`;
      }
      if (el.scrollWidth > el.clientWidth + 1) el.style.whiteSpace = "normal";
    };

    fit();
    // the panel's width tracks the viewport, so a resize changes what fits
    const observer = new ResizeObserver(fit);
    if (el.parentElement) observer.observe(el.parentElement);
    return () => observer.disconnect();
  }, [title]);

  return ref;
}

export default function CaseStudySlide({ study, preparedFor }) {
  const { title, quote, photo, meta, sdgGoals, stats, catalyst, catalystMix } = study;
  // `.filter(Boolean)` so an unknown goal number is simply left out rather than
  // rendering an empty row or throwing
  const goals = (sdgGoals || []).map(sdgGoal).filter(Boolean);

  /*
   * Every field is optional. Cases arrive from a spreadsheet where not each
   * project has each thing, and a blank cell should read as "this project
   * doesn't have one" — the row disappears rather than leaving a label with
   * nothing beside it, an empty stat column, or a donut of nothing.
   */
  const metaRows = (meta || []).filter((m) => m.value);
  const statTiles = (stats || []).filter((s) => s.figure || s.label);
  const cards = (catalyst || []).filter((c) => c.name || c.lead || c.body);
  const mixTotal = Object.values(catalystMix || {}).reduce((sum, n) => sum + (Number(n) || 0), 0);
  // the leads sit in a fixed-height row so the three bodies start on the same
  // line — pointless, and just dead space, when no card has a lead at all
  const hasLead = cards.some((c) => c.lead);
  const titleRef = useFitTitle(title);

  /*
   * Whether the three content panels are out of the way, leaving the slide's
   * photograph on its own. Per slide, so hiding one case's panels doesn't touch
   * the next. They fade rather than unmount: the layout stays put underneath,
   * so bringing them back can't reflow or restart the title measuring.
   */
  const [panelsHidden, setPanelsHidden] = useState(false);
  const panelClass = `transition-opacity duration-500 ${
    panelsHidden ? "pointer-events-none opacity-0" : "opacity-100"
  }`;

  return (
    // No padding of its own: `slide-stage` sets the gap above the top bar and
    // the bar repeats it below, and the photo band runs flush to the bottom.
    <div
      className="slide-stage flex flex-col"
      /*
        How tall the three C·A·T cards are — and, because the catalyst block in
        the left panel is given the same height and both sit against the same
        bottom padding, exactly where the gold rule above CATALYST MAPPING
        lands. The rule and the top of the cards stay on one line whatever a
        case's copy does. One number, both sides: change it here only.
      */
      style={{ "--cat-row-h": "15rem" }}
    >
      <SlideTopBar preparedFor={preparedFor} />

      {/* the photo bed. `flex-1` so the two columns fill whatever the top bar
          leaves, which is the Figma frame's 980-of-1080 band. */}
      <div className="relative flex flex-1 flex-col md:flex-row">
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          {/* no photo yet → the navy ground and the scrim below carry the slide
              on their own, rather than next/image throwing on an empty src */}
          {photo?.src && (
            <Image
              src={photo.src}
              alt=""
              fill
              sizes="100vw"
              priority={false}
              /*
                An ambient wash, not the subject: the framed copy in the right
                column is the one to read. Held at 35% — enough to tint the
                whole frame and show through the C·A·T cards, low enough that
                the same picture at two scales doesn't fight itself. (It ran at
                60% before the framed one existed.)
              */
              className="object-cover opacity-35"
              style={{ objectPosition: "center 30%" }}
            />
          )}
          {/* scrim: clear at the right edge, deepening leftwards so the panel's
              text keeps its contrast over the faces in the photo. Deepened from
              the Figma's 0.64 to 0.82 to match the brighter photo above. */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(to left, rgba(0,39,64,0) 0%, rgba(0,39,64,0.82) 75.48%)",
            }}
          />
        </div>

        {/* ── left panel ───────────────────────────────────────────────── */}
        <section
          className={`relative flex flex-col gap-5 bg-me-navy/85 px-6 pb-3 pt-4 text-me-gold md:w-[30%] md:shrink-0 md:border-r-4 md:border-me-gold md:pl-[4.583vw] md:pr-6 lg:gap-6 ${panelClass}`}
        >
          <header className="border-b-[3px] border-me-gold pb-4">
            {/* size is set by useFitTitle, not by a class — see there for why */}
            <h2 ref={titleRef} className="overflow-hidden font-normal leading-tight">
              {title}
            </h2>
            {quote && <p className="text-base md:text-lg lg:text-[19px] 3xl:text-[24px]!">{quote}</p>}
          </header>

          <dl className="flex flex-col gap-3 lg:gap-8">
            {metaRows.map((m) => (
              <div key={m.label} className="flex items-start justify-between gap-4">
                <dt className="text-sm font-semibold md:text-[15px] 3xl:text-[19px]!">{m.label}</dt>
                {/* `whitespace-pre-line`: the source sheet uses real line breaks
                    inside a cell (a two-line client name, say) and HTML would
                    otherwise run them together into one paragraph */}
                <dd className="w-[68%] whitespace-pre-line text-sm font-semibold md:text-[15px] 3xl:text-[19px]!">
                  {m.value}
                  {m.sub && <span className="block text-xs font-normal md:text-[13px] 3xl:text-[17px]!">{m.sub}</span>}
                </dd>
              </div>
            ))}

            <div className="flex items-start justify-between gap-4">
              <dt className="text-sm font-semibold leading-tight md:text-[15px] 3xl:text-[19px]!">
                {goals.length > 0 && (
                  <>
                    SDG
                    <span className="block text-[11px] 3xl:text-[14px]!">Alignment</span>
                  </>
                )}
              </dt>
              {/*
                Up to two goals get their number and name spelled out beside the
                tile, as in the Figma frame. From three on there isn't the
                height for that in this panel, so the tiles stand on their own,
                four to a row — the artwork already names the goal, and the full
                name stays available as each tile's alt text.
              */}
              <dd className="w-[68%]">
                {goals.length > 2 ? (
                  <div className="grid w-fit grid-cols-4 gap-2">
                    {goals.map((g) => (
                      <Image
                        key={g.n}
                        src={g.src}
                        alt={g.alt}
                        title={g.alt}
                        width={44}
                        height={44}
                        className="h-11 w-11"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {goals.map((g) => (
                      <div key={g.n} className="flex items-start gap-3">
                        {/* the SDG tiles are square badges — fixed on both axes
                            so a long name beside them can never squash one. The
                            source files are the 3000px print originals, so
                            next/image resizing them is doing real work here. */}
                        <Image src={g.src} alt={g.alt} width={44} height={44} className="h-11 w-11 shrink-0" />
                        <p className="text-sm font-semibold leading-tight md:text-[15px] 3xl:text-[19px]!">
                          {g.code}
                          <span className="block font-normal">{g.name}</span>
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </dd>
            </div>
          </dl>

          {mixTotal > 0 && (
            /*
              `mt-auto` parks this at the foot of the panel and the height is
              the shared --cat-row-h, so its top rule lines up with the top of
              the C·A·T cards across the divider. `min-h-0` lets it give height
              back when a case's rows above are unusually tall, rather than
              pushing the donut past the panel's lower edge — and the donut is
              an SVG with a viewBox, so a shorter box scales it down instead of
              cutting it off.
            */
            <div className="mt-auto flex min-h-0 flex-col items-center gap-3 border-t-[3px] border-me-gold pt-7 md:h-[var(--cat-row-h)]">
              <p className="shrink-0 text-sm font-semibold md:text-[15px] 3xl:text-[19px]!">CATALYST MAPPING</p>
              <CatalystDonut mix={catalystMix} className="min-h-0 w-[118px] flex-1 lg:w-[160px]" />
            </div>
          )}
        </section>

        {/* ── right column ─────────────────────────────────────────────── */}
        <section className={`relative flex flex-1 flex-col justify-between ${panelClass}`}>
          <div className="flex border-b-[3px] border-me-gold bg-me-navy/85 p-3 text-me-gold">
            {statTiles.map((s) => (
              <div key={s.label || s.figure} className="flex-1 text-center">
                <p className="text-lg font-semibold md:text-xl lg:text-[22px] 3xl:text-[28px]!">{s.figure}</p>
                <p className="text-xs md:text-[13px] 3xl:text-[17px]!">{s.label}</p>
              </div>
            ))}
          </div>

          {/*
            The photograph again, this time framed and at full strength, filling
            the band the stat bar and the cards leave between them. The copy of
            it behind everything stays as an ambient wash — this is the one you
            are meant to look at, and being the same picture at two scales is
            what lets a single supplied photo carry the whole slide.

            `min-h-0` so it yields rather than shoving the cards down when the
            slide is short.
          */}
          {photo?.src && (
            <div className="relative hidden min-h-0 flex-1 p-3 md:block">
              <div className="relative h-full w-full overflow-hidden rounded-lg ring-1 ring-me-gold/25">
                <Image
                  src={photo.src}
                  alt={photo.alt || ""}
                  fill
                  sizes="(max-width: 767px) 100vw, 70vw"
                  className="object-cover"
                />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3 p-3 md:flex-row md:gap-4">
            {cards.map((c) => (
              <article
                key={c.key}
                /* not solid any more, so the photograph carries on behind the
                   cards. `backdrop-blur` is what keeps the copy readable: it
                   softens whatever detail sits under each card rather than
                   relying on the tint alone. */
                className="flex flex-1 flex-col gap-4 rounded-lg bg-me-navy/70 p-4 text-me-gold backdrop-blur-sm md:min-h-[var(--cat-row-h)]"
              >
                <div className="flex items-center gap-3">
                  {BADGES[c.key] && (
                    // eslint-disable-next-line @next/next/no-img-element -- flat SVG, nothing for the optimizer to do
                    <img src={BADGES[c.key]} alt="" aria-hidden="true" className="h-8 w-8 shrink-0" />
                  )}
                  <h3 className="text-base font-semibold md:text-[17px] 3xl:text-[22px]!">{c.name}</h3>
                </div>
                {/* the lead sits in its own fixed-height row in the Figma so the
                    three body texts start on the same line; `min-h` does that
                    without clipping a lead that wraps to one more line. Held for
                    a blank lead too — otherwise one empty cell knocks the other
                    two cards' bodies out of line. */}
                {hasLead && (
                  <p className="whitespace-pre-line text-[13px] font-semibold leading-snug md:min-h-[3.6rem] 3xl:text-[17px]!">
                    {c.lead}
                  </p>
                )}
                {c.body && <p className="whitespace-pre-line text-[13px] leading-snug 3xl:text-[17px]!">{c.body}</p>}
              </article>
            ))}
          </div>
        </section>

        {/*
          Clears the slide down to its photograph. A sibling of the two panels
          rather than a child, so it stays put and clickable once they've faded.

          Deliberately quiet — this is a presentation slide, not an app screen —
          so it rests at low opacity and comes up on hover or keyboard focus.
          Bottom-centre keeps it off the slide rail on the right edge and off
          Next's dev badge in the bottom-left corner.
        */}
        <button
          type="button"
          onClick={() => setPanelsHidden((hidden) => !hidden)}
          aria-pressed={panelsHidden}
          className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 rounded-full border border-me-gold/40 bg-me-navy/70 px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-me-gold opacity-40 backdrop-blur transition hover:border-me-gold hover:text-white hover:opacity-100 focus-visible:opacity-100"
        >
          {panelsHidden ? "Show panels" : "Hide panels"}
        </button>
      </div>
    </div>
  );
}
