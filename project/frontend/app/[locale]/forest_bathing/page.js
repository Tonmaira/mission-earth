"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import LocaleLink from "@/components/LocaleLink";
import IconHamburger from "@/components/icons/IconHamburger";
import IconClose from "@/components/icons/IconClose";
import TranslateIcon from "@/components/icons/TranslateIcon";
import ForestBathingLocations from "@/components/ForestBathingLocations";
import ForestBathingTopics from "@/components/ForestBathingTopics";
import FooterSection from "@/components/FooterSection";
import { useTranslations, useLocale } from "next-intl";
import { useLanguageToggle } from "@/lib/useLanguageToggle";

const BASE = "/MEForestBathing";
const BOOK_URL = "#locations";
// navy คุมพื้นที่ส่วนใหญ่ ม่วงโผล่แค่ช่วงท้าย
const GRADIENT =
  "bg-[linear-gradient(180deg,#002740_0%,#002740_45%,#2A2A5E_75%,#502B81_100%)]";

// NOTE: Figma มี Info / Calendar / Collaborations / Contact
// "Calendar" ตัดออกเพราะเอา section ปฏิทินรวมออกแล้ว
// "Collaborations" ตัดออกเพราะยังไม่มี section รองรับ
// "Locations" เพิ่มเข้ามา เพราะเป็น section ที่พาไปจอง
const NAV_LINKS = [
  { href: "#info", key: "info" },
  { href: "#locations", key: "locations" },
  { href: "/contact", key: "contact" },
];

function LangToggle({ className = "" }) {
  const lang = useLocale();
  const toggleLang = useLanguageToggle();
  return (
    <button
      onClick={toggleLang}
      aria-label="Switch language"
      className={`group flex items-center gap-1 ${className}`}
    >
      <TranslateIcon className="h-6 w-6 text-[#FCF063] transition-colors group-hover:text-white" />
      <span className="text-xs text-[#FCF063] transition-colors group-hover:text-white">
        {lang === "en" ? "TH" : "EN"}
      </span>
    </button>
  );
}

function BookNowBadge({ className = "", heightClass = "h-[42px]" }) {
  return (
    <a href={BOOK_URL} className={`block shrink-0 transition-transform duration-300 hover:scale-110 ${className}`}>
      <Image src={`${BASE}/BookNow.svg`} alt="Book Now" width={54} height={42} priority className={`${heightClass} w-auto`} />
    </a>
  );
}

// การ์ดจองโผล่ 2 ที่: ก่อนเนื้อหา 9 หัวข้อ และปิดท้ายอีกรอบหลังอ่านจบ
// id="locations" ใส่ได้แค่อันบน — navbar กับปุ่ม Book Now ชี้มาที่นั่น
function LocationsSection({ id }) {
  const t = useTranslations();

  return (
    <section id={id} className="scroll-mt-[74px] px-6 py-28">
      <div className="mx-auto max-w-[1321px]">
        <h2 className="text-[24px] font-bold leading-tight text-[#FDF164]">
          {t("forestBathing.locations.title")}
        </h2>
        <p className="mt-1 text-[16px] text-white">
          {t("forestBathing.locations.lead")}
        </p>

        <div className="mt-6">
          {/* modal อ่านจาก URL ให้ชุดบนเรนเดอร์ตัวเดียวพอ ไม่งั้นเปิดทริปแล้วได้ modal ซ้อนกัน 2 อัน */}
          <ForestBathingLocations withModal={Boolean(id)} />
        </div>
      </div>
    </section>
  );
}

export default function ForestBathingPage() {
  const t = useTranslations();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // พื้นหลัง navbar: ใสตอนอยู่บน hero แล้วค่อย ๆ เฟดเข้ามาช่วงท้ายของ hero
  // (คำนวณจากตำแหน่ง scroll จริง ไม่ใช่สลับ on/off ไม่งั้นมันจะกระตุก)
  const heroRef = useRef(null);
  const [navBg, setNavBg] = useState(0);

  useEffect(() => {
    const NAV_H = 74;
    const FADE = 260; // ระยะที่ใช้เฟด (px) ก่อน hero จะพ้นใต้ navbar
    let raf = null;

    const update = () => {
      raf = null;
      const hero = heroRef.current;
      if (!hero) return;
      const end = hero.offsetTop + hero.offsetHeight - NAV_H; // hero พ้นใต้ navbar พอดี
      const start = end - FADE;
      const p = (window.scrollY - start) / FADE;
      setNavBg(Math.min(1, Math.max(0, p)));
    };

    const onScroll = () => {
      if (raf === null) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <main className="relative w-full overflow-x-hidden">
      {/* Fixed backdrop — one gradient for the whole page, so sections don't seam */}
      <div aria-hidden className={`fixed inset-0 -z-10 ${GRADIENT}`} />

      {/* Top bar — พื้นหลังชิดขอบบน/ข้าง ไล่ #002740 จาก 100% ลงมาเป็น 0
          ทั้งแผ่นเฟดเข้า-ออกตาม scroll (navBg) จึงไม่กระตุก */}
      <nav className="fixed inset-x-0 top-0 z-50 p-4">
        {/* สูง 120px (เกินตัว navbar 74px) เพื่อให้มีที่ไล่จาง
            ทึบ 100% ถึง 50% ของความสูง = คลุมตัวหนังสือเมนูจนพ้น แล้วค่อยจางเป็น 0 */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[120px] bg-[linear-gradient(180deg,rgba(0,39,64,1)_0%,rgba(0,39,64,1)_50%,rgba(0,39,64,0)_100%)]"
          style={{ opacity: navBg }}
        />

        <div className="relative flex h-[42px] items-center justify-between">
          <div className="flex shrink-0 items-center gap-3 sm:gap-4">
            <LocaleLink href="/" aria-label="Mission Earth">
              <Image
                src="/me-circle-white.svg"
                alt="Mission Earth"
                width={345}
                height={350}
                priority
                className="h-[42px] w-auto"
              />
            </LocaleLink>
            <span aria-hidden className="h-[26px] w-px bg-[#FFFEF6]/25" />
            <LocaleLink href="/forest_bathing">
              <Image
                src={`${BASE}/ForestBathingLogoHead.svg`}
                alt="Forest Bathing"
                width={91}
                height={42}
                priority
                className="h-[42px] w-auto"
              />
            </LocaleLink>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center gap-8 lg:gap-12 xl:gap-16 text-[16px] font-normal text-[#FFFEF6]">
            {NAV_LINKS.map((link) => (
              <a
                key={link.key}
                href={link.href}
                className="whitespace-nowrap transition-colors duration-200 hover:text-[#FCF063]"
              >
                {t(`forestBathing.nav.${link.key}`)}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <LangToggle className="hidden md:flex" />
            <BookNowBadge />
            <button
              onClick={() => setIsMenuOpen(true)}
              aria-label="Open menu"
              className="md:hidden p-1 text-[#FCF063] active:scale-90 transition-transform"
            >
              <IconHamburger size={32} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <div
        className={`md:hidden fixed inset-0 z-[60] bg-[linear-gradient(180deg,#002740_0%,#502B81_100%)] transition-all duration-500 ${
          isMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <button
          onClick={() => setIsMenuOpen(false)}
          aria-label="Close menu"
          className="absolute right-4 top-4 p-1 text-[#FCF063] active:scale-90 transition-transform"
        >
          <IconClose size={32} />
        </button>
        <div className="flex h-full flex-col items-center justify-center gap-8 text-2xl tracking-wide text-[#FFFEF6]">
          {NAV_LINKS.map((link) => (
            <a key={link.key} href={link.href} onClick={() => setIsMenuOpen(false)}>
              {t(`forestBathing.nav.${link.key}`)}
            </a>
          ))}
          <LangToggle className="mt-4 scale-125" />
        </div>
      </div>

      {/* Hero lockup */}
      <section
        ref={heroRef}
        className="relative flex min-h-screen items-center justify-center overflow-hidden px-6"
      >
        {/* FBhero.png ปรับโทนมืดมาในตัวแล้ว จึงไม่ต้องมี scrim ทับซ้ำ */}
        <Image
          src="/forestBathing/FBhero.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        <Image
          src={`${BASE}/ForestBathingLockup.svg`}
          alt="Forest Bathing — Mission Earth"
          width={866}
          height={388}
          priority
          className="relative z-10 h-auto w-[78%] max-w-[495px]"
        />
      </section>

      {/* What is Forest Bathing */}
      <section id="info" className="scroll-mt-[74px] px-6 py-28">
        <div className="mx-auto flex max-w-[1344px] flex-col items-center gap-14 sm:gap-[85px]">
          <h2 className="text-center text-[26px] font-semibold leading-tight text-[#FDF164] sm:text-[32px] lg:text-[40px]">
            {t("forestBathing.info.title")}
          </h2>

          {/* เส้นคั่นล่างอยู่ติดกับก้อนนี้ตาม Figma ไม่ใช่ขอบล่างของทั้ง section */}
          <div className="flex w-full max-w-[765px] flex-col items-center gap-[30px] border-b-2 border-[#FDF164] pb-10">
            <p className="whitespace-pre-line text-center text-[20px] leading-normal text-[#FDF164] sm:text-[24px]">
              {t("forestBathing.info.tagline")}
            </p>
            <p className="max-w-[700px] text-center text-[15px] leading-relaxed text-[#FDF164] sm:text-[16px]">
              {t("forestBathing.info.lead")}
            </p>

            <BookNowBadge heightClass="h-[80px]" />

            <div className="flex max-w-[765px] flex-wrap items-start justify-center gap-2">
              {t.raw("forestBathing.info.topics").map((topic) => (
                <a
                  key={topic.key}
                  href={`#info-${topic.key}`}
                  className="rounded-[22px] border border-[#FDF164] px-4 py-2 text-[15px] font-semibold text-[#FDF164] transition-colors duration-200 hover:bg-[#FDF164] hover:text-[#002740] sm:text-[16px]"
                >
                  {topic.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Locations */}
      <LocationsSection id="locations" />

      {/* เนื้อหาของ 9 หัวข้อ — pill ใน #info เป็น anchor เลื่อนลงมาที่นี่
          วางไว้หลังการ์ด locations เพื่อให้คนเจอปุ่มจองก่อน แล้วค่อยอ่านรายละเอียด */}
      <section className="px-6">
        <ForestBathingTopics />
      </section>

      {/* Locations (ซ้ำ) — ปิดท้ายหน้าด้วยการ์ดจอง คนอ่านรายละเอียดจบแล้วกดจองต่อได้เลย */}
      <LocationsSection />

      {/*
        เอา section ปฏิทินรวมออกแล้ว — ยังมีรอบน้อยเกินไป (ปฏิทิน 4 เดือนเพื่อโชว์ 2 วัน)
        และกดจองจากมันไม่ได้ ข้อมูลก็ซ้ำกับการ์ด
        ตัว ForestBathingCalendar ยังใช้อยู่ในการ์ดแต่ละสถานที่ ไม่ได้ลบทิ้ง
        จะเอากลับมาตอนมีรอบเยอะพอ ก็แค่ใส่ section คืนพร้อม allSessionDates()
      */}

      <FooterSection />
    </main>
  );
}
