"use client";

import Link from "next/link";
import { WORKS, activeTypes, activeYears, worksOfType } from "./works";

/**
 * Every work as a line of type, grouped by the sheet's `type` column with a
 * YEARS group alongside — modelled on the Mikiya Takimoto index the client
 * sent: nothing but names, each group's label set small against the right edge
 * of its column.
 *
 * Just the list. The deck wraps it in slide chrome (WorksIndexSlide) and the
 * public /portfolio page drops it in above its cards; both get the same thing
 * from one place.
 *
 * Groups come from the data, so a type gaining its first work (COMMUNICATION,
 * when it lands) appears here on its own.
 */

/** A group's worth of rows: how tall it is, roughly, for balancing columns. */
const weightOf = (group) => group.rows.length + 1.5;

/**
 * Splits the groups across two columns at whichever point leaves the two sides
 * closest in height. Hand-assigning them would need revisiting every time a
 * type is added or a type's list grows.
 */
function splitColumns(groups) {
  const total = groups.reduce((sum, g) => sum + weightOf(g), 0);
  let best = { at: 1, gap: Infinity };
  for (let at = 1; at < groups.length; at++) {
    const left = groups.slice(0, at).reduce((sum, g) => sum + weightOf(g), 0);
    const gap = Math.abs(left - (total - left));
    if (gap < best.gap) best = { at, gap };
  }
  return [groups.slice(0, best.at), groups.slice(best.at)];
}

const rowClass =
  "block w-full text-left leading-snug text-[15px] text-me-cream/70 transition-colors duration-200 hover:text-me-gold lg:text-[17px] 3xl:text-[22px]!";

function Group({ label, rows }) {
  return (
    <section className="relative">
      {/* the label rides the first row's line, hard against the column's right
          edge — `pr` on the rows keeps a long title from running under it */}
      <p className="absolute right-0 top-[3px] text-[10px] uppercase tracking-[0.25em] text-me-gold/55 lg:text-[11px] 3xl:text-[14px]!">
        {label}
      </p>
      <ul className="flex flex-col gap-[6px] pr-[9rem]">
        {rows.map((row) => (
          <li key={row.key}>{row.node}</li>
        ))}
      </ul>
    </section>
  );
}

/**
 * @param newTab  open the pages in a new tab. The deck sets this: a row there
 *   leads out to the public site, and a presenter mid-pitch should not lose
 *   their place in the deck to follow one.
 */
export default function WorksIndexList({ showHeading = true, newTab = false, className = "" }) {
  const away = newTab ? { target: "_blank", rel: "noreferrer" } : {};

  const groups = [
    ...activeTypes().map((type) => ({
      label: type,
      rows: worksOfType(type).map((work) => ({
        key: work.slug,
        node: (
          <Link href={`/portfolio/work/${work.slug}`} className={rowClass} {...away}>
            {work.title}
          </Link>
        ),
      })),
    })),
    {
      label: "Years",
      rows: activeYears().map((year) => ({
        key: `year-${year}`,
        node: (
          <Link href={`/portfolio/year/${year}`} className={rowClass} {...away}>
            {year}
          </Link>
        ),
      })),
    },
  ].filter((group) => group.rows.length > 0);

  const [left, right] = splitColumns(groups);

  return (
    <div className={`flex flex-col gap-8 ${className}`}>
      {showHeading && (
        <div className="flex items-center gap-4">
          <span className="h-px w-16 bg-me-gold/60" aria-hidden="true" />
          <p className="text-[16px] uppercase tracking-[0.3em] text-me-gold/60 3xl:text-[20px]!">All Works</p>
          <span className="text-[13px] text-me-cream/40 3xl:text-[17px]!">{WORKS.length}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-x-16 gap-y-10 md:grid-cols-2 lg:gap-x-24">
        {[left, right].map((column, i) => (
          <div key={i} className="flex flex-col gap-9">
            {column.map((group) => (
              <Group key={group.label} label={group.label} rows={group.rows} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
