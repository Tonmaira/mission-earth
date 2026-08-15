"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/lib/LanguageContext";

/** แบนเนอร์กิจกรรมของ Mission Earth เอง (แท็บแรก)
 *  พื้นหลัง + โลโก้ export มาจาก Figma โดยตรง เก็บไว้ที่ /public/ActivitiesExplore
 *  (รูปต้นฉบับจาก Figma ใหญ่ 11 MB / 3.5 MB ย่อเหลือกว้าง 1100 แล้วเพราะการ์ดกว้างจริงแค่ 513) */
const ORIGINALS = [
  {
    id: "forest-bathing",
    href: "/forest_bathing",
    bg: "/ActivitiesExplore/original-forestbathing-bg.jpg",
    // การ์ดนี้มีฝ้าขาวทับรูปตาม Figma ส่วนของ Ekiden ไม่มี
    wash: true,
    objectPosition: "50% 50%",
    logos: [
      { src: "/ActivitiesExplore/original-forestbathing-title.svg", w: 217, h: 76 },
      { src: "/ActivitiesExplore/original-forestbathing-sub.svg", w: 122, h: 8 },
    ],
  },
  {
    id: "ekiden",
    href: "/ekiden",
    bg: "/ActivitiesExplore/original-ekiden-bg.jpg",
    wash: false,
    // Figma วางรูปสูง 432% แล้วเลื่อนขึ้น 138.75% → เห็นแถบกลางค่อนบน เทียบเท่า object-position แนวตั้ง ~42%
    objectPosition: "50% 42%",
    logos: [{ src: "/ActivitiesExplore/original-ekiden-logo.svg", w: 257, h: 101 }],
  },
];

/** ไอคอนแว่นขยายในช่องค้นหา — path เดียวกับที่ Figma export มา inline ไว้เลย */
function SearchIcon({ className }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M20 19.1331L14.5425 13.6757C15.8403 12.1744 16.5482 10.2787 16.5482 8.27412C16.5482 6.06386 15.6875 3.98613 14.125 2.42363C12.5621 0.860738 10.4844 0 8.27412 0C6.06386 0 3.98613 0.860738 2.42363 2.42363C0.860738 3.98613 0 6.06386 0 8.27412C0 10.4844 0.860738 12.5621 2.42324 14.1246C3.98613 15.6875 6.06386 16.5482 8.27412 16.5482C10.2787 16.5482 12.1744 15.8403 13.6757 14.5425L19.1331 20L20 19.1331ZM3.29011 13.2581C1.95897 11.9266 1.2258 10.1569 1.2258 8.27412C1.2258 6.39137 1.95897 4.62163 3.29011 3.29011C4.62163 1.95897 6.39137 1.2258 8.27412 1.2258C10.1569 1.2258 11.9266 1.95897 13.2581 3.29011C16.0062 6.03819 16.0062 10.5097 13.2581 13.2581C11.9266 14.5893 10.1569 15.3224 8.27412 15.3224C6.39137 15.3224 4.62163 14.5893 3.29011 13.2581Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** ปุ่ม pill ขอบทอง ขนาดตาม Figma (สูง 40 · radius 27 · 16px sentence-case)
 *  ไม่ใช้ components/ui/OutlineBtn เพราะตัวนั้นเป็น uppercase + semibold + 10-12px
 *  ซึ่งจะทำให้เครื่องหมาย "!" กับตัวพิมพ์เล็กในดีไซน์หายไป */
function PillButton({ label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-10 shrink-0 items-center justify-center rounded-[27px] border border-me-gold px-5 text-[16px] text-me-gold transition-colors duration-300 hover:bg-me-gold hover:text-white"
    >
      {label}
    </button>
  );
}

/** การ์ดในลิสต์ฝั่งขวา — สูง 64 radius 16 พื้นฝ้าขาวจาง ๆ บนพื้นกรมท่า
 *  sub ไม่ใส่ก็ได้ (การ์ด "See All" มีแต่หัวข้อ) */
function ListCard({ title, sub, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-16 w-full items-center rounded-2xl border border-white/30 bg-white/10 p-2 text-left transition-colors hover:bg-white/20"
    >
      <span className="min-w-0">
        <span className="block truncate text-[21px] leading-tight text-white">{title}</span>
        {sub && <span className="block truncate text-[14px] leading-tight text-white/90">{sub}</span>}
      </span>
    </button>
  );
}

/** แบนเนอร์หนึ่งใบในแท็บ Mission Earth's Original — ลิงก์ไปหน้าที่ทำไว้แล้ว (/forest_bathing, /ekiden) */
function OriginalCard({ item, title }) {
  return (
    <Link
      href={item.href}
      aria-label={title}
      className="group relative block h-[160px] w-full overflow-hidden rounded-2xl border border-white/30"
    >
      <Image
        src={item.bg}
        alt=""
        fill
        sizes="(max-width: 1024px) 100vw, 513px"
        style={{ objectPosition: item.objectPosition }}
        className="object-cover transition-transform duration-700 group-hover:scale-105"
      />
      {item.wash && <span className="absolute inset-0 bg-white/10" />}

      <span className="absolute inset-0 flex flex-col items-center justify-center gap-[3.5px]">
        {item.logos.map((logo) => (
          <Image
            key={logo.src}
            src={logo.src}
            alt=""
            width={logo.w}
            height={logo.h}
            style={{ width: logo.w, height: logo.h }}
            className="max-w-[80%] object-contain"
          />
        ))}
      </span>
    </Link>
  );
}

/** Explore Workshops & Activities — Figma node 2295:2892 (แท็บ Original) / 2295:3620 (แท็บ All)
 *
 *  แบนเนอร์ในแท็บ Original ลิงก์ไปหน้าจริงแล้ว (/forest_bathing, /ekiden)
 *  ส่วนปุ่ม ช่องค้นหา และการ์ดหมวด ยังเป็น MOCK ยังไม่ผูกปลายทาง
 *  แท็บสลับได้จริงเพราะเป็นการเปลี่ยนเนื้อหาในที่เดียว ไม่ใช่การนำทาง
 *
 *  ดีไซน์มีแค่เฟรมเดสก์ท็อป 1440 — จอแคบกว่านั้นสลับเป็นคอลัมน์เดียว (ตีความเอง)
 *
 *  อยู่ในหน้า Home ซึ่งแต่ละ section เป็น snap แบบ h-dvh overflow-hidden
 *  จึงใช้ h-full + overflow-y-auto แบบเดียวกับ EarthFeed เพื่อให้จอเตี้ย/มือถือ
 *  ที่เนื้อหาสูงเกินหนึ่งหน้าจอยังเลื่อนอ่านในกรอบได้ ไม่โดนตัดหาย */
export default function ExploreActivities() {
  const { t } = useLang();
  const [tab, setTab] = useState("original");

  const categories = t("exploreActivities.categories");
  const originals = t("exploreActivities.originals");

  const tabs = [
    { id: "original", label: t("exploreActivities.tabOriginal") },
    { id: "all", label: t("exploreActivities.tabAll") },
  ];

  return (
    <section className="h-full w-full overflow-y-auto bg-me-navy pt-[85px]">
      {/* จอกว้าง: ยึดหัวคอลัมน์ทั้งสองฝั่งให้เสมอกันด้วย items-start + ระยะบนคงที่ 127px (ตาม Figma)
          ห้ามใช้ items-center เพราะความสูงฝั่งขวาเปลี่ยนตามแท็บที่เลือก
          ถ้าจัดกลาง เนื้อหาทั้งสองฝั่งจะเด้งขึ้นลงทุกครั้งที่สลับแท็บ */}
      <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-12 px-6 py-12 lg:min-h-[calc(100dvh-85px)] lg:flex-row lg:items-start lg:justify-between lg:gap-10 lg:px-20 lg:pb-12 lg:pt-[127px]">
        {/* ซ้าย — หัวข้อ + คำอธิบาย + ปุ่ม */}
        <div className="flex w-full max-w-[573px] flex-col gap-6">
          <div className="flex flex-col italic text-me-gold">
            <p className="text-[22px] tracking-[0.32px] sm:text-[26px] lg:text-[32px]">
              {t("exploreActivities.eyebrow")}
            </p>
            <p className="text-[40px] font-semibold leading-tight tracking-[0.64px] sm:text-[52px] lg:text-[64px]">
              {t("exploreActivities.titleLine1")}
              <br />
              {t("exploreActivities.titleLine2")}
            </p>
          </div>

          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-6 text-[16px] tracking-[0.16px] text-white">
              <p>{t("exploreActivities.lead")}</p>
              <p>{t("exploreActivities.body")}</p>
              <p>{t("exploreActivities.closing")}</p>
            </div>

            <div className="flex flex-wrap gap-2.5">
              <PillButton label={t("exploreActivities.exploreBtn")} />
              <PillButton label={t("exploreActivities.vendorBtn")} />
            </div>
          </div>
        </div>

        {/* ขวา — ค้นหา + แท็บ + เนื้อหาตามแท็บ */}
        <div className="flex w-full max-w-[513px] shrink-0 flex-col gap-4">
          <div className="flex items-center gap-2 rounded-3xl border border-white/30 bg-white/10 px-4 py-2">
            <SearchIcon className="h-5 w-5 shrink-0 text-me-gold" />
            <input
              type="search"
              aria-label={t("exploreActivities.searchLabel")}
              placeholder={t("exploreActivities.searchPlaceholder")}
              className="min-w-0 flex-1 bg-transparent py-1 text-[16px] text-me-gold placeholder:text-me-gold focus:outline-none"
            />
          </div>

          {/* แถบแท็บ — ตัวอักษรทองทั้งสองแท็บ ต่างกันที่ขีดใต้หนา 5px ของแท็บที่เลือก */}
          <div className="flex h-12 w-full border-b border-me-gold bg-[#052032]">
            {tabs.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                aria-current={tab === item.id ? "true" : undefined}
                className={`flex flex-1 items-center justify-center px-2 text-center text-[16px] font-semibold tracking-[0.16px] text-me-gold ${
                  tab === item.id ? "border-b-[5px] border-me-gold" : ""
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {tab === "original" ? (
            <div className="flex flex-col gap-2">
              {ORIGINALS.map((item, i) => (
                <OriginalCard key={item.id} item={item} title={originals[i]?.title ?? item.id} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <ListCard title={t("exploreActivities.seeAll")} />
              {categories.map((c) => (
                <ListCard key={c.title} title={c.title} sub={c.sub} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
