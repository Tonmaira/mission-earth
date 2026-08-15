import Link from "next/link";
import { notFound } from "next/navigation";
import WorkPageChrome from "@/components/credential/WorkPageChrome";
import WorkRow from "@/components/credential/WorkRow";
import { WORKS, workBySlug } from "@/components/credential/works";

/*
 * One work, on its own page — the same /portfolio row for all 23, whether or
 * not the credential deck also carries a case study for it. This lives on the
 * public site: the deck is unlisted, and nothing here leads into it.
 *
 * Shows whatever the sheet holds so far and omits the rest, so the pages fill
 * in as the content arrives without the URL changing.
 */

export function generateStaticParams() {
  return WORKS.map((work) => ({ slug: work.slug }));
}

// `params` is a promise in this Next version — awaited, not read directly
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const work = workBySlug(slug);
  return { title: work ? `${work.title} | Mission Earth` : "Work | Mission Earth" };
}

export default async function WorkPage({ params }) {
  const { slug } = await params;
  const work = workBySlug(slug);
  if (!work) notFound();

  return (
    <WorkPageChrome>
      <div className="mx-auto max-w-[1200px]">
        <WorkRow work={work} />

        {work.target && (
          <div className="mt-10 border-t border-white/30 pt-6">
            <p className="text-[12px] tracking-[0.2px] text-[#afafaf] md:text-[20px]">Target</p>
            <p className="mt-2 whitespace-pre-line text-[13px] text-white md:text-[16px]">
              {work.target}
            </p>
          </div>
        )}

        {work.year && (
          <Link
            href={`/portfolio/year/${work.year}`}
            className="mt-10 inline-block text-[11px] uppercase tracking-[0.25em] text-me-cream/45 transition-colors hover:text-me-gold"
          >
            More from {work.year} →
          </Link>
        )}
      </div>
    </WorkPageChrome>
  );
}
