"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import Popup from "./Popup";

const DISTANCES = [
  { km: "12K", name: "Peak Challenge", ring: "#3b6bff" },
  { km: "8K", name: "Forest Trail", ring: "#35b6e6" },
  { km: "5K", name: "Fun Trail", ring: "#22a447" },
];
const GROUPS = ["all", "race", "nonRace"];

/* pop-up ยอดนักวิ่งที่สมัครแล้ว — counts มาจาก lib/blackIvoryRunners.mjs (Google Sheet ของทีม)
 * ทีมอัปเดตใน Sheet แล้วหน้าเว็บตามไปเองภายใน 1 นาที (หน้าที่เปิดค้างก็เปลี่ยนเอง ไม่ต้องรีเฟรช)
 * แท็บกรอง ทั้งหมด / Race / Non-race แสดงเฉพาะกลุ่มที่ Sheet มีแถวให้อ่าน */
export default function RunnersDialog({ children, className = "", counts }) {
  const t = useTranslations("blackIvory.runners");
  const [group, setGroup] = useState("all");
  const groups = GROUPS.filter((g) => counts[g]);
  // ยอดใหม่ที่รีเฟรชมาอาจไม่มีกลุ่มที่เลือกอยู่แล้ว (มีคนแก้หัวแถวใน Sheet) → กลับไปโชว์ทั้งหมด
  const shown = counts[group] ?? counts.all;
  const n = (v) => v.toLocaleString("en-US");

  return (
    <Popup
      className={className}
      theme="dark"
      width="max-w-[720px]"
      label={t("label")}
      content={
        <div className="px-5 pb-8 pt-6 text-center sm:px-10 sm:pt-8">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{t("title")}</h2>

          {groups.length > 1 && (
            <div role="tablist" aria-label={t("filter")} className="mx-auto mt-4 inline-flex rounded-full bg-black/30 p-1">
              {groups.map((g) => (
                <button
                  key={g}
                  type="button"
                  role="tab"
                  aria-selected={g === group}
                  onClick={() => setGroup(g)}
                  className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors sm:px-5 ${
                    g === group ? "bg-white text-[#0b2540]" : "text-white/80 hover:text-white"
                  }`}
                >
                  {t(`groups.${g}`)}
                </button>
              ))}
            </div>
          )}

          <div className="mt-5 text-7xl font-extrabold leading-none tabular-nums sm:text-8xl">{n(shown.total)}</div>
          <div className="mt-2 text-lg font-semibold">{t("people")}</div>

          <div className="mt-8 grid grid-cols-3 gap-3 sm:gap-4">
            {DISTANCES.map((d) => (
              <section
                key={d.km}
                className="rounded-2xl border-[3px] bg-[#0b2540]/70 px-2 py-4 sm:px-4 sm:py-5"
                style={{ borderColor: d.ring }}
              >
                <div className="text-2xl font-extrabold leading-none sm:text-4xl">{d.km}</div>
                <div className="mt-1 text-xs font-semibold sm:text-sm">{d.name}</div>
                <div className="mt-3 text-3xl font-extrabold tabular-nums sm:text-5xl">{n(shown.byDistance[d.km])}</div>
                <div className="text-xs text-white/70 sm:text-sm">{t("people")}</div>
              </section>
            ))}
          </div>

          <p className="mt-6 text-xs text-white/60">{t("note")}</p>
        </div>
      }
    >
      {children}
    </Popup>
  );
}
