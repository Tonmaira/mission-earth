"use client";
import { useDeferredValue, useState } from "react";
import { useTranslations } from "next-intl";
import Popup, { NAVY } from "./Popup";
import { matchesBib } from "@/lib/blackIvoryBib.mjs";

const DISTANCES = ["5K", "8K", "12K"];
const RING = { "12K": "#3b6bff", "8K": "#35b6e6", "5K": "#22a447" };

/* pop-up ตารางรายชื่อนักวิ่งทั้งหมด + เลข BIB — entries มาจากแท็บ BIB ใน Sheet ของทีม (lib/blackIvoryBib.mjs)
 * เปิดมาเห็นทุกคน พิมพ์ชื่อ/นามสกุล/เลข BIB เพื่อกรอง และกรองตามระยะได้
 * ตารางอัปเดตตาม Sheet เองทุก 1 นาทีพร้อมยอดนักวิ่ง (AutoRefresh ในหน้า) */
export default function BibSearchDialog({ children, className = "", entries }) {
  const t = useTranslations("blackIvory.bib");
  const [query, setQuery] = useState("");
  const [km, setKm] = useState("all");
  const q = useDeferredValue(query); // พิมพ์ลื่น ไม่ต้องรอกรอง 400+ แถวทุกตัวอักษร
  const shown = entries.filter((p) => (km === "all" || p.km === km) && matchesBib(p, q));

  return (
    <Popup
      className={className}
      theme="dark"
      width="max-w-[720px]"
      label={t("label")}
      content={
        <div className="px-4 pb-8 pt-6 sm:px-8 sm:pt-8">
          <h2 className="text-center text-2xl font-bold tracking-tight sm:text-3xl">{t("title")}</h2>
          <p className="mt-1 text-center text-sm text-white/70">{t("hint")}</p>

          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("placeholder")}
            aria-label={t("placeholder")}
            autoComplete="off"
            enterKeyHint="search"
            className="mt-5 w-full rounded-full bg-white px-5 py-3 text-base outline-none focus:ring-4 focus:ring-white/40"
            style={{ color: NAVY }}
          />

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <div role="tablist" aria-label={t("filter")} className="inline-flex rounded-full bg-black/30 p-1">
              {["all", ...DISTANCES].map((d) => (
                <button
                  key={d}
                  type="button"
                  role="tab"
                  aria-selected={d === km}
                  onClick={() => setKm(d)}
                  className={`rounded-full px-3 py-1 text-sm font-semibold transition-colors sm:px-4 ${
                    d === km ? "bg-white text-[#0b2540]" : "text-white/80 hover:text-white"
                  }`}
                >
                  {d === "all" ? t("all") : d}
                </button>
              ))}
            </div>
            <p aria-live="polite" className="text-sm text-white/70">
              {t("count", { count: shown.length.toLocaleString("en-US") })}
            </p>
          </div>

          {shown.length === 0 ? (
            <p className="mt-6 text-center text-white/80">{t("notFound", { query: query.trim() })}</p>
          ) : (
            <table className="mt-4 w-full border-separate border-spacing-y-1 text-left text-sm sm:text-base">
              <thead className="text-xs text-white/60 sm:text-sm">
                <tr>
                  <th className="px-3 py-1 font-semibold">BIB</th>
                  <th className="px-3 py-1 font-semibold">{t("name")}</th>
                  <th className="px-3 py-1 text-center font-semibold">{t("distance")}</th>
                </tr>
              </thead>
              <tbody>
                {shown.map((p, i) => (
                  <tr key={i} className="bg-[#0b2540]/70">
                    <td className="rounded-l-xl px-3 py-2 font-extrabold tabular-nums">
                      {p.bib}
                    </td>
                    <td className="px-3 py-2">
                      {p.first} {p.last}
                      {p.nonRace && <span className="ml-1.5 whitespace-nowrap text-xs text-white/60">({t("nonRace")})</span>}
                    </td>
                    <td className="rounded-r-xl px-3 py-2 text-center">
                      {p.km && (
                        <span
                          className="inline-block rounded-full border-2 px-2 text-xs font-bold"
                          style={{ borderColor: RING[p.km] ?? "#fff" }}
                        >
                          {p.km}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      }
    >
      {children}
    </Popup>
  );
}
