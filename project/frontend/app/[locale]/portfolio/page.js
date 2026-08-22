import LocaleLink from "@/components/LocaleLink";
import NavbarSimple from "@/components/NavbarSimple";
import FooterSection from "@/components/FooterSection";
import WorkRow from "@/components/credential/WorkRow";
import WorksIndexList from "@/components/credential/WorksIndexList";
import { WORKS } from "@/components/credential/works";
import { pageMetadata, seoFor } from "@/lib/seo";

// metadata ของหน้านี้ — canonical กับ hreflang สร้างจาก lib/seo.js ที่เดียว
export async function generateMetadata({ params }) {
  const { locale } = await params;
  return pageMetadata({ locale, path: "/portfolio", ...seoFor("/portfolio", locale) });
}

/*
 * Cards come from works.js — the same list the credential deck's index reads —
 * newest year first. The eight that used to be hand-written here kept their
 * photograph, blurb, partner logos and public date: those moved onto their
 * works.js entries, so there is one list rather than two that drift.
 *
 * Within a year the sheet's own order stands; the sheet gives no finer date
 * than the year for most works.
 */
const cards = [...WORKS].sort((a, b) => (b.year || 0) - (a.year || 0));


export default function PortfolioPage() {
  return (
    <main className="min-h-screen bg-[#002740] text-white">
      <NavbarSimple />

      {/* Header */}
      <section className="flex flex-col justify-center px-6 md:px-12 lg:px-[144px] py-24 pt-32 md:pt-40">
        <h1 className="font-semibold italic text-[#CEA870] text-[28px] md:text-[36px] lg:text-[48px] tracking-[0.48px] mb-4">
          Portfolio
        </h1>
        <p className="text-white text-[14px] md:text-[16px] tracking-[0.16px] leading-relaxed max-w-[793px]">
          From ESG training and nature camps to creative events and sustainable travel — we design
          experiences that make people care, learn, and take action. Backed by experts and trusted
          by leading organizations across Thailand.
        </p>
      </section>

      {/*
        Index of everything we have done, above the cards that tell a few of
        them in full. Same component the credential deck's index slide uses, so
        adding a work to works.js puts it in both places at once.
      */}
      <section className="px-6 pb-16 md:px-12 lg:px-[144px]">
        <WorksIndexList />
        <div className="mt-16 border-b border-white/30" />
      </section>

      {/* Portfolio List — every work, newest first */}
      <section className="px-6 md:px-12 lg:px-[144px] pb-[80px]">
        <div className="flex flex-col">
          {cards.map((work, index) => (
            <LocaleLink
              key={work.slug}
              href={`/portfolio/work/${work.slug}`}
              className={`block py-6 md:py-[24px] ${
                index < cards.length - 1 ? "border-b border-white/30" : ""
              }`}
            >
              <WorkRow work={work} />
            </LocaleLink>
          ))}
        </div>
      </section>

      <FooterSection />
    </main>
  );
}
