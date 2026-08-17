"use client";

import { useEffect, useRef, useState } from "react";
import SlideTopBar from "./SlideTopBar";

/**
 * "OUR MODEL" — approximated from the Figma frame at node 32:63 with plain
 * Tailwind classes (see ExpertiseSlideV2 for why: no calc(var(--u)) precision
 * scaling here, just eyeballed layout matching the rest of the site).
 *
 * The C→A→T ring is inlined as SVG (not an <img>) so each circle and arc can
 * animate on its own. Figma exported it as one flat asset, but every shape
 * inside is still its own <path> — public/credential/cat-model-ring.svg is
 * kept as the original reference and the path data below is copied straight
 * out of it, just regrouped:
 *   Vector_4+7 = C circle+letter · Vector_6+8 = A · Vector_5+9 = T
 *   Vector_3 = C→A arc · Vector_2 = A→T arc · Vector = T→C arc (the gradient one)
 *
 * Sequence and keyframes live in credential.css under `.cat-scene`.
 */

const RING_RATIO = 397.6 / 385.36;

/* The three arcs all ride the same circle. Radius and centre are measured back
   off the exported path endpoints, and each mask arc is padded a few degrees
   past its ribbon so the reveal never stops short of the ends. */
const ARCS = [
  {
    id: "ca",
    delay: 1000,
    fill: "#CEA872",
    d: "M361.11 249.75L355.2 248.69C356.86 239.45 357.7 229.96 357.7 220.48C357.7 187.26 347.56 155.45 328.37 128.48C309.59 102.09 283.66 82.29 253.38 71.21L255.44 65.58C286.87 77.07 313.77 97.62 333.26 125C353.18 152.99 363.7 186.01 363.7 220.48C363.7 230.31 362.83 240.15 361.11 249.75Z",
    // C (up top) round to A (lower right)
    mask: "M246.46 66.62A163 163 0 0 1 357.94 257.78",
  },
  {
    id: "at",
    delay: 1500,
    fill: "#CEA872",
    d: "M198.82 385.36C159.85 385.36 122.04 371.51 92.34 346.37L96.22 341.79C124.83 366.02 161.27 379.36 198.82 379.36C236.37 379.36 272.81 366.02 301.42 341.79L305.3 346.37C275.6 371.51 237.79 385.36 198.82 385.36Z",
    // A (lower right) along the bottom to T (lower left)
    mask: "M312.03 339.75A163 163 0 0 1 85.57 339.75",
  },
  {
    id: "tc",
    delay: 2000,
    fill: "url(#catRingGradient)",
    d: "M36.52 249.75C34.8 240.16 33.93 230.31 33.93 220.48C33.93 186.01 44.46 152.99 64.37 125C83.85 97.62 110.76 77.07 142.19 65.58L144.25 71.21C113.97 82.28 88.04 102.09 69.26 128.48C50.07 155.45 39.93 187.26 39.93 220.48C39.93 229.95 40.77 239.45 42.43 248.69L36.52 249.75Z",
    // T (lower left) back up to C
    mask: "M39.66 257.78A163 163 0 0 1 151.14 66.62",
  },
];

const NODES = [
  {
    id: "c",
    delay: 0,
    ring: "M198.82 117.19C166.51 117.19 140.22 90.9 140.22 58.59C140.22 26.28 166.51 0 198.82 0C231.13 0 257.42 26.29 257.42 58.6C257.42 90.91 231.13 117.2 198.82 117.2V117.19ZM198.82 6C169.82 6 146.22 29.59 146.22 58.6C146.22 87.61 169.81 111.2 198.82 111.2C227.83 111.2 251.42 87.61 251.42 58.6C251.42 29.59 227.82 6 198.82 6Z",
    letter:
      "M177.04 44.95C179.27 41.04 182.32 37.99 186.18 35.81C190.04 33.63 194.38 32.53 199.18 32.53C204.8 32.53 209.72 33.97 213.94 36.85C218.16 39.73 221.12 43.71 222.8 48.8H211.21C210.06 46.4 208.44 44.6 206.35 43.4C204.26 42.2 201.85 41.6 199.11 41.6C196.18 41.6 193.58 42.28 191.3 43.65C189.02 45.02 187.24 46.95 185.97 49.45C184.7 51.95 184.06 54.87 184.06 58.23C184.06 61.59 184.7 64.46 185.97 66.98C187.24 69.5 189.02 71.44 191.3 72.81C193.58 74.18 196.18 74.86 199.11 74.86C201.85 74.86 204.26 74.25 206.35 73.02C208.44 71.8 210.06 69.98 211.21 67.58H222.8C221.12 72.72 218.18 76.71 213.98 79.57C209.78 82.43 204.85 83.85 199.18 83.85C194.38 83.85 190.05 82.76 186.18 80.57C182.32 78.39 179.27 75.35 177.04 71.46C174.81 67.57 173.69 63.16 173.69 58.21C173.69 53.26 174.81 48.84 177.04 44.93V44.95Z",
  },
  {
    id: "a",
    delay: 300,
    ring: "M338.92 360.04C328.77 360.04 318.75 357.38 309.72 352.16C296.17 344.33 286.47 331.7 282.42 316.58C278.37 301.46 280.45 285.67 288.27 272.12C304.42 244.14 340.33 234.51 368.31 250.67C396.29 266.82 405.91 302.73 389.76 330.71C381.93 344.26 369.3 353.96 354.18 358.01C349.13 359.36 344.01 360.03 338.92 360.03V360.04ZM339.1 248.84C320.91 248.84 303.19 258.27 293.46 275.13C286.44 287.3 284.57 301.47 288.21 315.04C291.85 328.61 300.55 339.95 312.72 346.98C324.89 354 339.06 355.87 352.63 352.23C366.2 348.59 377.54 339.89 384.57 327.72C391.6 315.55 393.46 301.38 389.82 287.81C386.18 274.24 377.48 262.9 365.32 255.87C357.06 251.1 348.03 248.83 339.11 248.83L339.1 248.84Z",
    letter:
      "M348.91 316.75H328.89L325.58 326.33H315L333.07 276H344.81L362.88 326.33H352.22L348.91 316.75ZM346.17 308.68L338.9 287.66L331.63 308.68H346.17Z",
  },
  {
    id: "t",
    delay: 600,
    ring: "M58.72 360.04C53.63 360.04 48.51 359.37 43.46 358.02C28.34 353.97 15.71 344.27 7.88 330.72C0.05 317.17 -2.02 301.37 2.03 286.26C6.08 271.14 15.78 258.51 29.33 250.68C57.31 234.52 93.22 244.15 109.37 272.13C117.2 285.68 119.27 301.48 115.22 316.59C111.17 331.71 101.47 344.34 87.92 352.17C78.89 357.38 68.87 360.05 58.72 360.05V360.04ZM58.54 248.8C49.43 248.8 40.43 251.19 32.33 255.87C20.16 262.9 11.46 274.24 7.82 287.81C4.18 301.38 6.05 315.55 13.07 327.72C20.09 339.89 31.44 348.59 45.01 352.23C58.58 355.87 72.75 354 84.92 346.98C97.09 339.96 105.79 328.61 109.43 315.04C113.07 301.47 111.2 287.3 104.18 275.13C97.16 262.96 85.81 254.26 72.24 250.62C67.71 249.41 63.11 248.81 58.54 248.81V248.8Z",
    letter: "M77.86 276V284.14H64.47V326.26H54.39V284.14H41V276H77.86Z",
  },
];

const COPY_DELAY = 2550;
/* the T→C pulse only starts once that arc has finished drawing, then loops */
const PULSE_DELAY = 2550;
const TC_ARC = ARCS.find((a) => a.id === "tc");

function CatRing() {
  return (
    <svg viewBox="0 0 397.6 385.36" className="h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient
          id="catRingGradient"
          x1="89.09"
          y1="249.75"
          x2="89.09"
          y2="65.58"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.418269" stopColor="#E5E5E5" />
          <stop offset="1" stopColor="#33783B" />
        </linearGradient>
        {ARCS.map((a) => (
          <mask
            key={a.id}
            id={`catArcMask-${a.id}`}
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="397.6"
            height="385.36"
          >
            <path
              className="cat-draw"
              style={{ animationDelay: `${a.delay}ms` }}
              d={a.mask}
              fill="none"
              stroke="#fff"
              strokeWidth="22"
              pathLength="100"
              strokeDasharray="100"
            />
          </mask>
        ))}

        {/* the pulse that keeps running along T→C: a single dash on a copy of
            the same mask arc, blurred so the band feathers out at both ends
            instead of ending on two hard edges */}
        <filter id="catPulseBlur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
        <mask id="catPulseMask" maskUnits="userSpaceOnUse" x="0" y="0" width="397.6" height="385.36">
          <path
            className="cat-pulse"
            style={{ animationDelay: `${PULSE_DELAY}ms` }}
            d={TC_ARC.mask}
            fill="none"
            stroke="#fff"
            strokeWidth="22"
            pathLength="100"
            strokeDasharray="26 74"
            filter="url(#catPulseBlur)"
          />
        </mask>
      </defs>

      {ARCS.map((a) => (
        <path key={a.id} d={a.d} fill={a.fill} mask={`url(#catArcMask-${a.id})`} />
      ))}

      {/* Once T→C has finished drawing, its Figma gradient hands over to a plain
          white arc with the green riding along it as a moving band — with the
          gradient left underneath the green simply pooled at the C end and the
          travelling band had nothing to read against. Both layers fade in
          together, so the swap looks like the green letting go and setting off.
          Under reduced motion neither appears and the gradient stays put. */}
      <g className="cat-pulse-layer" style={{ animationDelay: `${PULSE_DELAY}ms` }}>
        <path d={TC_ARC.d} fill="#E5E5E5" />
        <path d={TC_ARC.d} fill="#5FB56E" mask="url(#catPulseMask)" />
      </g>

      {NODES.map((n) => (
        <g key={n.id} className="cat-node" style={{ animationDelay: `${n.delay}ms` }}>
          <path d={n.ring} fill="#CEA872" />
          <path d={n.letter} fill="#CEA872" />
        </g>
      ))}
    </svg>
  );
}

const POINTS = [
  {
    key: "traceability",
    title: "TRACEABILITY",
    copy: "Track, measure & communicate the impact with evidence.",
    align: "text-right items-end",
    enter: "cat-copy-left",
  },
  {
    key: "action",
    title: "ACTION",
    copy: "Turn priorities into concrete behaviors, initiatives, edutainment & tools.",
    align: "text-left items-start",
    enter: "cat-copy-right",
  },
];

export default function CatModelSlide({ preparedFor }) {
  const sceneRef = useRef(null);
  // 0 = never played. Every re-entry bumps it, which remounts the scene and
  // restarts the CSS animations from the top.
  const [playKey, setPlayKey] = useState(0);

  useEffect(() => {
    const el = sceneRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setPlayKey((k) => k + 1);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const copyStyle = { animationDelay: `${COPY_DELAY}ms` };

  return (
    // top padding comes from `slide-stage` (--deck-gap), which the top bar
    // mirrors underneath itself — only the bottom is set here
    <div className="slide-stage flex flex-col justify-between gap-8 pb-10 md:pb-8">
      <SlideTopBar preparedFor={preparedFor} />

      <section className="flex flex-col items-start gap-4 md:gap-2">
        <div className="flex items-center gap-4">
          <span className="h-px w-16 bg-me-gold/60" aria-hidden="true" />
          <p className="text-[16px] uppercase tracking-[0.3em] text-me-gold/60 3xl:text-[15px]!">Our Model</p>
        </div>
        <h2 className="text-3xl font-semibold leading-snug text-[#F0EEE9] md:text-4xl lg:text-5xl 3xl:text-[60px]!">
          The ESG <span className="text-me-gold">CAT</span>ALYST model
        </h2>
      </section>

      {/*
        From `md` this section takes all the height the other three rows leave
        over (`flex-1`), and hands it down to the ring — see the ring's own
        comment. `min-h-0` is the part that does the work: a flex item's default
        `min-height: auto` refuses to shrink below its content, which is exactly
        how the closing line got pushed off the bottom edge on a short screen.
      */}
      <section
        ref={sceneRef}
        className="mx-auto flex w-full max-w-4xl flex-col items-center md:min-h-0 md:flex-1"
      >
        <div
          key={playKey}
          className={`flex w-full flex-col items-center cat-scene md:min-h-0 md:flex-1 ${playKey > 0 ? "is-playing" : ""}`}
        >
          {/* CORE reads at the same size as ACTION and TRACEABILITY: all three
              are captions on a letter of the model, not a heading over it.
              `order` puts it under the ring on a phone — see the ring below. */}
          <div
            className="mb-2 max-w-xs text-center md:mb-4 cat-copy-top order-2 sm:order-none"
            style={copyStyle}
          >
            <h3 className="text-lg font-semibold text-me-gold md:text-xl 3xl:text-[26px]!">CORE</h3>
            <p className="mt-1 text-xs text-me-gold sm:text-sm 3xl:text-[18px]!">
              Define the ESG substance
              <br />
              what matters most, what must be proven.
            </p>
          </div>

          {/* the ring, with TRACEABILITY/ACTION anchored beside it at roughly the
              height of their circles — a percentage read off the Figma frame,
              not chased to the pixel. `right-full`/`left-full` push these two
              blocks entirely outside the ring's own box, which only has room to
              spare from `sm` up — below that they're switched for a plain
              stacked block underneath instead (see `sm:hidden` further down). */}
          {/*
            From `md` the ring is sized by the height left over rather than by a
            fixed 440px width: `flex-1` gives it the slack, and `aspect-ratio`
            turns that height back into a width. At a fixed width the slide came
            out taller than a 900px laptop screen and `justify-between` has no
            negative space to give back, so the closing line ran off the bottom.
            Capped at the design's 440px so a tall screen doesn't oversize it.
          */}
          <div
            /* `order-1` on a phone, so the ring comes first and the reading
               order down the screen is model → C → A → T. From `sm` up the
               three captions sit around the ring and order goes back to the
               source order. */
            className="relative order-1 w-[242px] sm:order-none sm:w-[286px] md:min-h-0 md:w-auto md:max-w-full md:flex-1"
            style={{ aspectRatio: RING_RATIO, maxHeight: 440 }}
          >
            <CatRing />

            <div
              className={`absolute top-[69%] hidden w-48 flex-col gap-1 sm:flex md:w-56 ${POINTS[0].align} ${POINTS[0].enter} right-full mr-3 sm:mr-4`}
              style={copyStyle}
            >
              <h3 className="text-lg font-semibold text-me-gold md:text-xl 3xl:text-[26px]!">{POINTS[0].title}</h3>
              <p className="text-xs text-me-gold sm:text-sm 3xl:text-[18px]!">{POINTS[0].copy}</p>
            </div>

            <div
              className={`absolute top-[69%] hidden w-48 flex-col gap-1 sm:flex md:w-56 ${POINTS[1].align} ${POINTS[1].enter} left-full ml-3 sm:ml-4`}
              style={copyStyle}
            >
              <h3 className="text-lg font-semibold text-me-gold md:text-xl 3xl:text-[26px]!">{POINTS[1].title}</h3>
              <p className="text-xs text-me-gold sm:text-sm 3xl:text-[18px]!">{POINTS[1].copy}</p>
            </div>
          </div>

          {/* mobile only: ACTION then TRACEABILITY stacked in normal flow below
              the ring instead of flanking it — there's no room to spare beside
              a 220px-wide ring on a phone screen. Read in model order, C·A·T,
              which is the reverse of how POINTS lists them for the sides (left
              of the ring first). */}
          <div className="order-3 mt-6 flex w-full max-w-xs flex-col gap-6 sm:hidden">
            {[...POINTS].reverse().map((p) => (
              <div key={p.key} className={`text-center ${p.enter}`} style={copyStyle}>
                <h3 className="text-lg font-semibold text-me-gold">{p.title}</h3>
                <p className="mt-1 text-sm text-me-gold">{p.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="flex flex-col items-center gap-6 px-6 text-center md:gap-8 md:pb-4">
        <span className="h-px w-full max-w-2xl bg-white/20" aria-hidden="true" />
        <p className="max-w-2xl text-sm leading-relaxed text-me-gold md:text-lg 3xl:text-[23px]!">
          From <b className="font-semibold">what matters</b>, to <b className="font-semibold">what we do</b>, to
          proven <b className="font-semibold">impact</b>
        </p>
      </section>
    </div>
  );
}
