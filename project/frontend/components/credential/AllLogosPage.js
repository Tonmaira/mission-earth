"use client";

import PARTNER_LOGOS from "./partnerLogos";

/**
 * รวมโลโก้หน่วยงานทุกที่ (ทั้งลูกค้าและพาร์ทเนอร์ ไม่แยกกัน) ไว้หน้าเดียว
 * เล็กๆ เรียงเต็มกรอบ — ใช้ตอน export เด็คเป็น PDF เท่านั้น ไม่ได้อยู่ใน
 * สไลด์โชว์ปกติ
 *
 * ไม่ได้ห่อด้วย <Slide> โดยตั้งใจ: เลยไม่มีชื่อโผล่ใน nav rail ปุ่มลูกศร/
 * PageDown ก้าวข้ามไปไม่ถึง และ DeckShell ก็ไม่รู้จัก id นี้เพราะมันมองหาแค่
 * [data-slide] ในตัวมันเอง — ต่อท้าย DeckShell ในหน้า /credential ตรงๆ
 * ไปเปิดดูหรือสกรีนช็อตเองได้ที่ /credential#all-logos (เบราว์เซอร์เลื่อนลง
 * มาให้เองตามปกติของ id anchor)
 *
 * พื้นหลังขาวตั้งใจ ไม่ใช่กรอบเข้มแบบสไลด์อื่นในเด็ค — โลโก้เกือบทั้งหมดถูก
 * ทำมาสำหรับพื้นขาวอยู่แล้ว (ดู .logo-strip ในหน้า WHAT WE DO ที่ก็ใช้พื้น
 * ขาวเหมือนกัน)
 *
 * รายชื่อทั้งหมดมาจาก partnerLogos.js ไฟล์เดียวกับที่หน้า WHAT WE DO ใช้วิ่ง
 * เป็นแถบ — เพิ่มโลโก้ที่นั่นแล้วหน้านี้ได้เองไม่ต้องมาแก้ซ้ำ
 */
export default function AllLogosPage() {
  return (
    <section id="all-logos" className="flex justify-center bg-white px-6 py-16 md:px-16">
      <div className="w-full max-w-6xl border-4 border-me-navy p-8 md:p-12">
        <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-8">
          {PARTNER_LOGOS.map((logo) => (
            <li key={logo.src} className="flex h-9 items-center md:h-11">
              {/* eslint-disable-next-line @next/next/no-img-element -- fixed-height grid art, sized by CSS */}
              <img src={logo.src} alt={logo.name} className="h-full w-auto object-contain" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
