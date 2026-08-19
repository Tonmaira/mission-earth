"use client";

import Link from "next/link";
import { useState } from "react";
import { PROVINCE_BY_CODE } from "@/lib/thaiProvinces";
import SlideTopBar from "./SlideTopBar";
import ThailandMap from "./ThailandMap";
import { worksInProvince, worksPerProvince } from "./works";

/**
 * "WHERE WE WORK" — สไลด์สรุปพื้นที่ที่เราลงไปทำจริง วางไว้ก่อน ALL WORKS
 * ให้เป็นภาพรวมนำเข้าสู่รายการงานละเอียด
 *
 * จังหวัดที่ไฮไลต์คำนวณจาก `provinces` ในแต่ละงานใน works.js ไม่ได้ระบุที่นี่ —
 * เพิ่มงานใหม่แล้วทั้งแผนที่และตัวเลขขยับตามเอง
 */

/* จำนวนงานสูงสุดที่ลิสต์ในช่องรายละเอียด — กรุงเทพมีสิบงาน ถ้าเทลงมาหมด
   สไลด์จะกลายเป็นกำแพงตัวหนังสือ ที่เหลือคนดูไปดูต่อได้ที่สไลด์ ALL WORKS

   ห้าคือจำนวนที่พอดีกับความสูงของช่อง (h-[15rem]) เมื่อรวมบรรทัด "+ N more"
   แล้ว — ถ้าจะเพิ่มต้องขยายช่องตามด้วย ไม่งั้นบรรทัดท้ายโดนตัด */
const MAX_LISTED = 5;
export default function FootprintSlide({ preparedFor }) {
  const [selected, setSelected] = useState(null);

  const counts = worksPerProvince();
  const provinceCount = Object.keys(counts).length;
  const shown = selected ? worksInProvince(selected) : [];
  const province = selected ? PROVINCE_BY_CODE[selected] : null;

  const most = Math.max(1, ...Object.values(counts));

  /*
   * ห้าจังหวัดที่ลงบ่อยที่สุด — เดิมช่องนี้ว่างเปล่าจนกว่าจะมีคนกดแผนที่ ซึ่ง
   * แปลว่าถ้าส่งลิงก์ให้ลูกค้าเปิดดูเอง (ไม่มีเราอยู่ข้างๆ คอยกดให้ดู) เขาจะ
   * เห็นแค่ที่ว่างกับข้อความชวนให้กด — สไลด์ทั้งใบสื่อสารได้ครึ่งเดียว
   *
   * ลิสต์นี้ยังเป็นตัวยืนยันสิ่งที่แผนที่บอกไม่ได้ด้วย: กรุงเทพเป็นอันดับหนึ่ง
   * แต่บนแผนที่เป็นจุดเล็กนิดเดียว
   */
  const topProvinces = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="slide-stage flex flex-col pb-10 md:pb-8">
      <SlideTopBar preparedFor={preparedFor} />

      {/* ทั้งคู่กว้างเท่าเนื้อหาของตัวเองแล้วจับมาไว้กลางสไลด์ — ถ้าปล่อยให้
          คอลัมน์ยืดเต็มความกว้าง แผนที่ (ซึ่งเป็นแนวตั้ง ผอม) จะถูกดันไปติดขอบขวา
          จนเหลือช่องว่างกลางสไลด์เป็นแถบใหญ่ */}
      <section className="flex min-h-0 flex-1 flex-col items-center justify-center gap-8 md:flex-row md:items-stretch md:gap-16 lg:gap-24">
        {/* ข้อความอยู่ซ้ายบนจอกว้าง แต่บนมือถือแผนที่ควรมาก่อน — order สลับให้ */}
        <div className="order-2 flex w-full max-w-[34rem] flex-col justify-center gap-6 md:order-1 lg:gap-8">
          <div className="flex items-center gap-4">
            <span className="h-px w-16 bg-me-gold/60" aria-hidden="true" />
            <p className="text-[16px] uppercase tracking-[0.3em] text-me-gold/60 3xl:text-[20px]!">
              Where we work
            </p>
          </div>

          <h2 className="text-[26px] leading-tight text-me-cream lg:text-[34px] 3xl:text-[46px]!">
            We don't just work on paper.
            <br />
            <b className="text-me-gold">We work hand-in-hand with people on the ground.</b>
          </h2>

          <div className="flex flex-wrap items-end gap-x-10 gap-y-4">
            <p className="flex items-baseline gap-3">
              <span className="text-[64px] leading-none text-me-gold lg:text-[88px] 3xl:text-[112px]!">
                {provinceCount}
              </span>
              <span className="text-[15px] text-me-cream/70 lg:text-[17px] 3xl:text-[22px]!">
                Provinces
              </span>
            </p>

            {/* คีย์อ่านแผนที่ — สี่ระดับนี้ต้องตรงกับ TONES ใน ThailandMap.js
                หัวท้ายเป็นตัวเลขจริง ไม่ใช่ "Fewer/More" ลอยๆ ที่ไม่บอกว่าช่วง
                มันกว้างแค่ไหน — 1 ถึง 3 กับ 1 ถึง 30 คนละเรื่องกัน */}
            <p className="flex items-center gap-2 pb-2 text-[13px] text-me-cream/55 lg:text-[15px] 3xl:text-[19px]!">
              <span>1</span>
              {["bg-me-gold/45", "bg-me-gold/62", "bg-me-gold/78", "bg-me-gold/95"].map(
                (shade) => (
                  <span
                    key={shade}
                    className={`h-3 w-6 ${shade}`}
                    aria-hidden="true"
                  />
                )
              )}
              <span>{most} projects</span>
            </p>
          </div>

          {/* ความสูงตายตัว ไม่ใช่ min-h — สองสถานะนี้เนื้อหาไม่เท่ากัน (Top 5 กับ
              รายชื่องานของจังหวัดที่กด) ถ้าปล่อยให้ยืดตามเนื้อหา คอลัมน์ทั้งอัน
              จะจัดกึ่งกลางใหม่ทุกครั้งที่กด แผนที่ข้างๆ ขยับตาม เห็นชัดมากตอน
              ฉายขึ้นจอ */}
          <div className="h-[13rem] overflow-y-auto border-t border-me-cream/15 pt-5 lg:h-[15rem]">
            {province ? (
              <>
                <p className="text-[18px] text-me-gold lg:text-[21px] 3xl:text-[27px]!">
                  {province.th}
                </p>
                <ul className="mt-3 flex flex-col gap-[6px]">
                  {shown.slice(0, MAX_LISTED).map((work) => (
                    <li key={work.slug}>
                      {/* เปิดแท็บใหม่ ไม่ให้คนนำเสนออยู่ๆ หลุดออกจากเด็คกลางคัน */}
                      <Link
                        href={`/portfolio/work/${work.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="block text-[15px] leading-snug text-me-cream/70 transition-colors duration-200 hover:text-me-gold lg:text-[17px] 3xl:text-[22px]!"
                      >
                        {work.title}
                      </Link>
                    </li>
                  ))}
                  {shown.length > MAX_LISTED && (
                    <li className="text-[15px] leading-snug text-me-cream/45 lg:text-[17px] 3xl:text-[22px]!">
                      + {shown.length - MAX_LISTED} more projects
                    </li>
                  )}
                </ul>
              </>
            ) : (
              <>
                <p className="text-[15px] text-me-cream/45 lg:text-[17px] 3xl:text-[22px]!">
                  Where we return most often.
                </p>
                <ul className="mt-3 flex flex-col gap-[6px]">
                  {topProvinces.map(([code, count]) => (
                    <li key={code}>
                      <button
                        type="button"
                        onClick={() => setSelected(code)}
                        className="flex w-full items-baseline gap-3 text-left text-[15px] leading-snug text-me-cream/70 transition-colors duration-200 hover:text-me-gold lg:text-[17px] 3xl:text-[22px]!"
                      >
                        <span>{PROVINCE_BY_CODE[code]?.en ?? code}</span>
                        {/* เส้นประคั่นให้ตัวเลขไปเรียงชิดขวาตรงกันทุกบรรทัด */}
                        <span
                          className="min-w-0 flex-1 translate-y-[-4px] border-b border-dotted border-me-cream/20"
                          aria-hidden="true"
                        />
                        <span className="text-me-gold/80">{count}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>

        <div className="order-1 flex min-h-0 flex-none items-center justify-center md:order-2">
          <ThailandMap
            counts={counts}
            selected={selected}
            onSelect={setSelected}
            className="h-[42svh] w-auto max-w-full md:h-full"
          />
        </div>
      </section>
    </div>
  );
}
