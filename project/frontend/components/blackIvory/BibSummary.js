"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";

const KM_ORDER = ["5K", "8K", "12K"];
const GROUP_ORDER = ["all", "M", "F", "nonRace", "unknown"];
const RING = { "12K": "#3b6bff", "8K": "#35b6e6", "5K": "#22a447" };

// ค่าที่ใช้เรียงของแต่ละคอลัมน์ — ระยะ/ประเภทเรียงตามลำดับที่ตั้งไว้ ไม่ใช่ตามตัวอักษร
const SORT_VALUE = {
  km: (r) => KM_ORDER.indexOf(r.km),
  group: (r) => GROUP_ORDER.indexOf(r.group),
  count: (r) => r.count,
};

/* ตารางสรุปจำนวนนักวิ่งต่อ ระยะ × ประเภท — rows มาจาก countGroups ใน lib/blackIvoryBib.mjs (แท็บ BIB)
 * กดหัวคอลัมน์เพื่อเรียง กดซ้ำสลับมาก→น้อย / น้อย→มาก
 * ชาย/หญิง นับเฉพาะ Race เพราะ Non-race ในแท็บ BIB ไม่ได้กรอกเพศ (เป็น C) — 5K แถวเดียวไม่แยก */
export default function BibSummary({ rows }) {
  const t = useTranslations("blackIvory.bib.summary");
  const [sort, setSort] = useState({ key: "km", dir: 1 });

  const sorted = [...rows].sort((a, b) => {
    const diff = SORT_VALUE[sort.key](a) - SORT_VALUE[sort.key](b);
    // ค่าเท่ากันเรียงตามระยะแล้วประเภทเสมอ ตารางจะได้ไม่สลับไปมา
    return diff * sort.dir || SORT_VALUE.km(a) - SORT_VALUE.km(b) || SORT_VALUE.group(a) - SORT_VALUE.group(b);
  });
  const total = rows.reduce((sum, r) => sum + r.count, 0);

  const toggle = (key) =>
    setSort((s) => (s.key === key ? { key, dir: -s.dir } : { key, dir: key === "count" ? -1 : 1 }));

  // หัวคอลัมน์ที่กดเรียงได้ (ฟังก์ชันธรรมดา ไม่ใช่ component ซ้อน — React จะได้ไม่สร้างใหม่ทุกครั้ง)
  const header = (id, className = "") => (
    <th
      key={id}
      className={`px-3 py-1 font-semibold ${className}`}
      aria-sort={sort.key === id ? (sort.dir > 0 ? "ascending" : "descending") : "none"}
    >
      <button type="button" onClick={() => toggle(id)} className="inline-flex items-center gap-1 hover:text-white">
        {t(id)}
        <span aria-hidden="true" className={sort.key === id ? "text-white" : "text-white/30"}>
          {sort.key === id && sort.dir < 0 ? "▼" : "▲"}
        </span>
      </button>
    </th>
  );

  return (
    <>
      <table className="mt-4 w-full border-separate border-spacing-y-1 text-left text-sm sm:text-base">
        <thead className="text-xs text-white/60 sm:text-sm">
          <tr>
            {header("km")}
            {header("group")}
            {header("count", "text-right")}
          </tr>
        </thead>
        <tbody>
          {sorted.map((r) => (
            <tr key={`${r.km}-${r.group}`} className="bg-[#0b2540]/70">
              <td className="rounded-l-xl px-3 py-2">
                <span className="inline-block rounded-full border-2 px-2 text-xs font-bold" style={{ borderColor: RING[r.km] }}>
                  {r.km}
                </span>
              </td>
              <td className="px-3 py-2">{t(`groups.${r.group}`)}</td>
              <td className="rounded-r-xl px-3 py-2 text-right font-extrabold tabular-nums">{r.count.toLocaleString("en-US")}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="font-bold">
            <td colSpan={2} className="px-3 pt-2">
              {t("total")}
            </td>
            <td className="px-3 pt-2 text-right tabular-nums">{total.toLocaleString("en-US")}</td>
          </tr>
        </tfoot>
      </table>
      <p className="mt-3 text-center text-xs text-white/60">{t("note")}</p>
    </>
  );
}
