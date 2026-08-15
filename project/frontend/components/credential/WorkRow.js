"use client";

import Image from "next/image";

/**
 * One work, laid out like a row on the site's /portfolio page: picture on the
 * left, title / subtitle / description stacked beside it, and a row of labelled
 * meta columns along the bottom.
 *
 * Same shape as /portfolio so the credential pages and the public portfolio
 * read as one family, but fed from works.js — which came from a sheet with
 * gaps in it, so every part here is allowed to be missing. A work with no
 * photograph yet gets a branded placeholder rather than a broken frame.
 */

/**
 * The meta columns, in the order /portfolio uses, minus the ones with no value.
 *
 * A work that has partner `logos` shows those instead of naming the same
 * organisations in text — a logo says it faster, and that is how the cards on
 * /portfolio were originally drawn.
 */
function metaOf(work) {
  const orgs = work.logos?.length
    ? work.logos.map((l) => ({ label: l.label, logo: l.src }))
    : [
        { label: "Client", value: work.client },
        { label: "Collab", value: work.collaboration },
        { label: "Sponsor", value: work.sponsor },
      ];

  return [
    ...orgs,
    // `dateLabel` is the public, English-language date; `timeline` is the
    // sheet's own wording, which is the fallback until one is written
    { label: "Date", value: work.dateLabel || work.timeline || (work.year ? String(work.year) : "") },
    { label: "Type", value: [work.type, work.subType].filter(Boolean).join(" / ") },
  ].filter((m) => m.value || m.logo);
}

/** Stands in until the photographs arrive — see `image` in works.js. */
function PhotoPlaceholder() {
  return (
    <div
      className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#0a3c5c] to-[#052032]"
      aria-hidden="true"
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- flat SVG, nothing for the optimizer to do */}
      <img
        src="/credential/wordmark-horizontal.svg"
        alt=""
        className="w-[70%] opacity-15"
      />
    </div>
  );
}

export default function WorkRow({ work, className = "" }) {
  const meta = metaOf(work);

  return (
    <article className={`flex flex-col gap-6 md:flex-row md:gap-[36px] ${className}`}>
      <div className="relative h-[240px] w-full shrink-0 overflow-hidden rounded-[10px] md:h-[400px] md:w-[320px]">
        {work.image ? (
          <Image src={work.image} alt={work.title} fill className="object-cover" />
        ) : (
          <PhotoPlaceholder />
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between gap-6 md:pb-6">
        <div className="flex flex-col gap-3 md:gap-4">
          <div>
            <p className="mb-1 text-[20px] font-semibold leading-snug tracking-[0.32px] text-me-gold md:text-[32px]">
              {work.title}
            </p>
            {work.quote && (
              <p className="whitespace-pre-line text-[13px] tracking-[0.16px] text-white md:text-[16px]">
                {work.quote}
              </p>
            )}
          </div>
          {work.description && (
            <p className="text-[13px] leading-relaxed tracking-[0.16px] text-[#afafaf] md:text-[16px]">
              {work.description}
            </p>
          )}
        </div>

        {meta.length > 0 && (
          <div className="flex gap-2 md:gap-[8px]">
            {meta.map((m) => (
              <div key={m.label} className="flex flex-1 flex-col gap-2 px-1 md:px-2">
                <div className="border-b border-[#adadad] pb-1">
                  <p className="text-[12px] tracking-[0.2px] text-[#afafaf] md:text-[20px]">{m.label}</p>
                </div>
                {m.logo ? (
                  <div className="relative h-[50px] w-[50px] overflow-hidden rounded-[8px] bg-white md:h-[80px] md:w-[80px]">
                    <Image src={m.logo} alt={m.label} fill className="object-contain p-1" />
                  </div>
                ) : (
                  <p className="whitespace-pre-line text-[12px] tracking-[0.16px] text-white md:text-[16px]">
                    {m.value}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
