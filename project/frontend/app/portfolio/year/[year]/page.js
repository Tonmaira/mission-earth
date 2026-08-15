import Link from "next/link";
import { notFound } from "next/navigation";
import WorkPageChrome from "@/components/credential/WorkPageChrome";
import WorkRow from "@/components/credential/WorkRow";
import { activeYears, worksOfYear } from "@/components/credential/works";

/*
 * Everything Mission Earth ran in one year — where the YEARS column of the
 * works index leads, on the deck's index slide and on /portfolio alike. Laid out as the site's /portfolio page is, one row
 * per work, so the two read as the same thing in two places.
 */

export function generateStaticParams() {
  return activeYears().map((year) => ({ year: String(year) }));
}

// `params` is a promise in this Next version — awaited, not read directly
export async function generateMetadata({ params }) {
  const { year } = await params;
  return { title: `${year} | Mission Earth` };
}

export default async function YearPage({ params }) {
  const { year: yearParam } = await params;
  const works = worksOfYear(yearParam);
  if (works.length === 0) notFound();

  return (
    <WorkPageChrome>
      <div className="mx-auto max-w-[1200px]">
        <header className="flex items-baseline gap-5">
          <h1 className="text-5xl font-semibold italic text-me-gold md:text-[48px]">{yearParam}</h1>
          <p className="text-[13px] uppercase tracking-[0.25em] text-me-cream/45">
            {works.length} {works.length === 1 ? "work" : "works"}
          </p>
        </header>

        <div className="mt-12 flex flex-col">
          {works.map((work, i) => (
            <Link
              key={work.slug}
              href={`/portfolio/work/${work.slug}`}
              className={`block py-6 md:py-[24px] ${
                i < works.length - 1 ? "border-b border-white/30" : ""
              }`}
            >
              <WorkRow work={work} />
            </Link>
          ))}
        </div>

        <nav className="mt-16 flex gap-6 border-t border-me-gold/25 pt-6 text-[11px] uppercase tracking-[0.25em]">
          {activeYears().map((year) => (
            <Link
              key={year}
              href={`/portfolio/year/${year}`}
              className={
                String(year) === String(yearParam)
                  ? "text-me-gold"
                  : "text-me-cream/45 transition-colors hover:text-me-gold"
              }
            >
              {year}
            </Link>
          ))}
        </nav>
      </div>
    </WorkPageChrome>
  );
}
