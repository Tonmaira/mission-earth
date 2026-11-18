"use client";
import Image from "next/image";
import { useState } from "react";
import { useTranslations } from "next-intl";
import Popup, { NAVY } from "./Popup";

// รูปแผนที่ทำจากไฟล์ export @2x ของทีม (ME Work/ivory a lot/MAP/export) แปลงเป็น WebP 2160×2700
// SVG ต้นฉบับใช้ฟอนต์ ProximaNovaThai ที่เครื่องคนดูไม่มี จึงใช้ตรง ๆ ไม่ได้
// สีแท็บดูดมาจากแถบล่างของอาร์ตเวิร์กแต่ละระยะ ภาพรวมใช้สีกระดาษพื้นแผนที่
const MAPS = [
  { id: "cover", file: "bitt-map-cover.webp", bg: "#edebe7", fg: NAVY },
  { id: "5K", file: "bitt-map-5k.webp", bg: "#ef627f", fg: "#fff" },
  { id: "8K", file: "bitt-map-8k.webp", bg: "#00a554", fg: "#fff" },
  { id: "12K", file: "bitt-map-12k.webp", bg: "#51c5de", fg: "#fff" },
];

/* pop-up แผนที่เส้นทาง — ไม่มีกล่องครอบ (Popup bare) ตัวอาร์ตเวิร์กเป็นการ์ดเอง
 * มือถือ: แท็บ ภาพรวม / 5K / 8K / 12K เรียงแถวใต้รูป กว้างเท่ารูป
 * จอ md ขึ้นไป: แท็บเรียงเป็นคอลัมน์ข้างขวาของรูป ปุ่มปิดอยู่บนสุด ลิงก์รูปเต็มชิดล่าง
 * รูปสูงไม่เกินจอ จะได้เห็นทั้งแผ่นโดยไม่ต้องเลื่อน */
export default function MapDialog({ children, className = "" }) {
  const t = useTranslations("blackIvory.map");
  return (
    <Popup className={className} bare label={t("label")} content={(close) => <MapTabs t={t} close={close} />}>
      {children}
    </Popup>
  );
}

function MapTabs({ t, close }) {
  const tc = useTranslations("blackIvory");
  const [active, setActive] = useState(MAPS[0]);
  const src = `/blackIvory/map/${active.file}`;
  return (
    <div className="flex w-fit flex-col items-center md:flex-row md:items-stretch md:gap-4">
      <Image
        key={active.id}
        src={src}
        alt={t("alt", { name: label(active, t) })}
        width={2160}
        height={2700}
        sizes="(min-width: 768px) 720px, 100vw"
        className="h-auto max-h-[calc(96dvh-6.5rem)] w-auto max-w-full rounded-2xl shadow-2xl md:max-h-[92dvh]"
      />

      <div className="mt-3 flex w-full flex-col items-center md:mt-0 md:w-32">
        {/* ปุ่มปิดไม่วางบนรูป — จะทับโลโก้มุมขวาบนของอาร์ตเวิร์ก
            มือถืออยู่ท้ายแถวแท็บ, จอใหญ่ flex-col-reverse ดันขึ้นไปบนสุดของคอลัมน์ */}
        <div className="flex w-full gap-2 md:flex-col-reverse md:gap-3">
          <div role="tablist" className="grid flex-1 grid-cols-4 gap-2 md:grid-cols-1 md:gap-3">
            {MAPS.map((m) => {
              const on = m.id === active.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => setActive(m)}
                  className={`rounded-full py-2 text-sm font-bold transition-colors sm:text-base md:py-3 ${on ? "" : "bg-white/15 text-white hover:bg-white/25"}`}
                  style={on ? { backgroundColor: m.bg, color: m.fg } : undefined}
                >
                  {label(m, t)}
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={close}
            aria-label={tc("close")}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25 md:mb-3 md:self-end"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 text-center text-sm font-semibold text-white/70 underline underline-offset-4 hover:text-white md:mt-auto"
        >
          {t("full")}
        </a>
      </div>
    </div>
  );
}

const label = (m, t) => (m.id === "cover" ? t("overview") : m.id);
