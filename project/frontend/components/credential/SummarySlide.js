"use client";

import PARTNER_LOGOS from "./partnerLogos";
import SlideTopBar from "./SlideTopBar";
import { WORKS, provincesWorked, sumStat, worksWithStat } from "./works";

/**
 * หน้าสรุป — สไลด์ก่อนสุดท้าย ปิดท้ายด้วยตัวเลขของงานทั้งหมดก่อนถึงหน้า CONTACT
 * สร้างจาก Figma node 53:2927 ("02-Sustain to implementation", เฟรม 1920×1080)
 *
 * ขนาดทุกตัวเขียนเป็น design pixel ของเฟรม Figma ตรงๆ ผ่าน `calc(N * var(--u))`
 * เหมือนสไลด์อื่นในเด็ค — `--u` มาจาก .slide-stage ซึ่งย่อขยายตามจอให้เอง และ
 * ต่ำกว่า 767px มันจะ re-base ตัวเองตามความกว้างมือถือ เลยไม่ต้องเขียน
 * breakpoint ซ้ำที่นี่
 *
 * ตัวเลขทุกตัวคำนวณจาก works.js กับ partnerLogos.js ไม่ได้พิมพ์ทิ้งไว้ที่นี่
 * เพิ่มงานใหม่เข้าไปในชีตแล้วหน้านี้ขยับตามเอง ไม่ต้องมาแก้
 *
 * แผนที่อยู่คนละสไลด์ (FootprintSlide) ที่วางไว้ก่อนหน้านี้
 */

/* แถวบน — ขนาดของงาน นับจากรายการงานเองเลยจึงมีค่าเสมอ */
const SCOPE_STATS = [
  { label: "Provinces", value: () => provincesWorked().length },
  { label: "Projects", value: () => WORKS.length },
  { label: "Partner organizations", value: () => PARTNER_LOGOS.length },
];

/*
 * แถวล่าง — ผลลัพธ์ เรียงจาก "ตัวที่พิสูจน์ได้" ไป "ตัวที่พิสูจน์ยาก"
 *
 * เดิมเรียงเป็นกรวย reach → participants → changemakers ซึ่งอ่านลื่นกว่า แต่
 * ผลคือ reach ได้ตำแหน่งซ้ายสุดที่คนอ่านก่อนเพื่อน ทั้งที่เป็นตัวเลขที่ป้องกัน
 * ยากที่สุดในห้องประชุม (นับจาก impression? คนเดินผ่านบูธ?) ถ้าลูกค้าติดใจ
 * ตัวแรก จะพาลไม่เชื่อทั้งแถว
 *
 * เงินที่ลงถึงชุมชนกับจำนวน change maker มีต้นทางตรวจสอบได้ เลยขึ้นก่อน
 * แล้วค่อยไล่ลงไปหา reach ปิดท้าย
 *
 * ตัวไหนยังไม่มีข้อมูลสักงานจะหายไปเองทั้งช่อง ไม่ต้องมาคอมเมนต์ทิ้งไว้
 */
const IMPACT_STATS = [
  { key: "toLocalHands", label: "THB into local hands" },
  { key: "changeMakers", label: "Changemakers" },
  { key: "engagement", label: "Active participants" },
  { key: "reach", label: "Total reach" },
];

/*
 * ตัวเลขบนสไลด์ต้องอ่านออกจากท้ายห้อง "8.2M" อ่านได้ในแวบเดียว
 * ส่วน "8,200,000" ต้องนั่งนับหลัก
 *
 * ย่อทุกช่องที่ถึงล้าน ไม่ใช่เฉพาะช่องเงินเหมือนเดิม — ตอนนั้น "12,338,000"
 * กับ "13.1M" ไปยืนติดกันในแถวเดียว สองรูปแบบในบรรทัดเดียวดูเหมือนทำไม่เสร็จ
 */
const format = (value) =>
  value >= 1_000_000
    ? `${(value / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`
    : value.toLocaleString("en-US");

/** ตัวเลขหนึ่งช่อง — เลข 64px วางทับป้าย 24px ชิดซ้าย ไม่มีระยะห่างคั่น */
function Stat({ figure, label }) {
  return (
    <div className="flex flex-col items-start">
      <p className="text-[calc(64*var(--u))] font-semibold leading-normal text-me-gold">
        {figure}
      </p>
      <p className="text-[calc(24*var(--u))] leading-normal text-me-gold">{label}</p>
    </div>
  );
}

export default function SummarySlide({ preparedFor }) {
  const scope = SCOPE_STATS.map((stat) => ({
    label: stat.label,
    figure: format(stat.value()),
  }));

  const impact = IMPACT_STATS.filter((stat) => worksWithStat(stat.key) > 0).map(
    (stat) => ({
      label: stat.label,
      figure: format(sumStat(stat.key)),
    })
  );

  /* ช่วงปีของงานทั้งหมด — ตัวเลขก้อนใหญ่ขนาดนี้ถ้าไม่บอกว่ากี่ปี คนฟังเดาเอง
     ไม่ได้ว่ามันน่าประทับใจแค่ไหน ปีเดียวกับห้าปีความหมายคนละเรื่อง */
  const years = WORKS.map((work) => work.year).filter(Boolean);
  const span = years.length
    ? [Math.min(...years), Math.max(...years)]
    : null;

  return (
    /* .slide-stage เป็น flex column ที่ justify-between อยู่แล้ว ลูกทั้งสี่ก้อน
       (แถบบน / หัวเรื่อง / แถวบน / แถวล่าง) เลยกระจายตัวเองตามเฟรม Figma พอดี */
    <div className="slide-stage pb-[calc(200*var(--u))]">
      <SlideTopBar preparedFor={preparedFor} />

      <section className="flex flex-col gap-[calc(32*var(--u))]">
        <div className="flex items-center gap-[calc(23*var(--u))] text-me-gold/60">
          <span
            className="h-[calc(4*var(--u))] w-[calc(125*var(--u))] bg-current"
            aria-hidden="true"
          />
          <p className="text-[calc(32*var(--u))] leading-normal tracking-[0.12em]">
            SUMMARY
          </p>
          {span && (
            <p className="text-[calc(32*var(--u))] leading-normal tracking-[0.12em]">
              {span[0] === span[1] ? span[0] : `${span[0]}–${span[1]}`}
            </p>
          )}
        </div>

        {/* ทั้งสองบรรทัดเป็นสีทอง ต่างกันแค่น้ำหนักตัวอักษร */}
        <h2 className="text-[calc(64*var(--u))] leading-normal text-me-gold">
          Everything so far,
          <br />
          <b className="font-semibold">adds up to this.</b>
        </h2>
      </section>

      {/* ระยะห่างระหว่างช่องเป็นค่าคงที่ 180px ไม่ใช่ตารางแบ่งเท่าๆ กัน — แต่ละช่อง
          กว้างเท่าป้ายของตัวเอง เรียงต่อกันไปจากซ้าย เหมือนใน Figma
          flex-wrap กันแถวล่างล้นจอตอนอยู่บนมือถือ */}
      {[scope, impact].map((row, i) => (
        <section
          key={i}
          className="flex flex-wrap gap-x-[calc(180*var(--u))] gap-y-[calc(48*var(--u))]"
        >
          {row.map((stat) => (
            <Stat key={stat.label} figure={stat.figure} label={stat.label} />
          ))}
        </section>
      ))}
    </div>
  );
}
