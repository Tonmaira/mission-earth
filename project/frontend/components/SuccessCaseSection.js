"use client";
import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";
import { useLang } from "@/lib/LanguageContext";

/*
 * The three cases the home page leads with. `href` points at each one's own
 * page rather than the portfolio index, so a card lands on the work it shows.
 * Titles are translated — see `home.successCase.items` in messages/*.json, in
 * this same order.
 */
const CASES = [
  {
    image: "/credential/case-scg/hero.jpg",
    subtitle: "SCG Cement · Communities in 21 Provinces",
    href: "/portfolio/work/scg-prayotsuk",
  },
  {
    image: "/profilecredential/case_deksarngnan.jpg",
    subtitle: "Youth Camp, Nan Province",
    href: "/portfolio/work/dek-sang-nan-1",
  },
  {
    image: "/project/20260214rohxmeforest bathing/IMG_7238-2.jpg",
    subtitle: "Forest Bathing at Doi Tung, Chiangrai",
    href: "/portfolio/work/forest-bathing",
  },
];

export default function SuccessCaseSection() {
  const { t } = useLang();

  const items = [0, 1, 2].map((i) => ({
    ...CASES[i],
    title: t(`home.successCase.items.${i}.title`),
  }));

  return (
    <section className="relative w-full md:h-full pt-[85px] bg-[#002740] overflow-hidden flex flex-col items-center">
      <ScrollReveal>
        <div className="relative z-10 text-center px-6 md:px-6 max-w-4xl mx-auto mb-8 md:mb-12">
          <h4 className="text-[#CEA870] text-xs md:text-sm tracking-[0.4em] uppercase mb-1 md:mb-4 font-medium">
            {t("home.successCase.label")}
          </h4>
          <h2 className="text-[#CEA870] text-[24px] md:text-5xl font-semibold italic tracking-wider uppercase mb-2 md:mb-4">
            {t("home.successCase.title")}
          </h2>
          <p className="text-gray-300 font-light leading-relaxed text-[13px] md:text-[16px] opacity-90">
            {t("home.successCase.desc")}
          </p>
        </div>
      </ScrollReveal>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 md:px-6 md:flex-1 md:min-h-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 h-full">
          {items.map((item, i) => (
            <Link
              key={i}
              href={item.href}
              className="group relative rounded-[10px] overflow-hidden min-h-[180px] md:min-h-0"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                <h3 className="text-white font-semibold italic text-lg md:text-xl leading-snug group-hover:text-[#CEA870] transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="text-white/60 text-xs md:text-sm mt-1 line-clamp-1">
                  {item.subtitle}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="relative z-10 py-6 md:py-10">
        <Link
          href="/portfolio"
          className="border border-[#CEA870] text-[#CEA870] px-8 py-3 rounded-full hover:bg-[#CEA870] hover:text-white transition-all duration-500 uppercase tracking-widest text-xs font-semibold"
        >
          {t("home.successCase.more")}
        </Link>
      </div>
    </section>
  );
}
