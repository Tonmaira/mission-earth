"use client";

import SlideTopBar from "./SlideTopBar";

/**
 * "อ่านลูกค้า" — สไลด์ท้ายเด็คก่อนหน้า CONTACT ที่สรุปว่าเรามองธุรกิจของลูกค้า
 * รายนี้ยังไง สี่คอลัมน์คือเนื้อหา แล้วปิดด้วยบรรทัดเดียวใต้เส้นคั่น
 *
 * สร้างจาก Figma node 62:89 ("OSOT1") กับ 62:238 ("OSOT2") เฟรม 1920×1080
 *
 * เนื้อหาไม่ได้อยู่ในไฟล์นี้ — อยู่ใน clientBriefs.js แยกตาม slug ของลูกค้า
 * ไฟล์นี้รู้แค่วิธีวางหน้า ลูกค้ารายไหนยังไม่มีข้อมูลก็ไม่มีสไลด์นี้เลย
 * ทุกหน้าของลูกค้าคนเดียวกันใช้แถบชื่อ (เส้น + ชื่อย่อ + โลโก้) ชุดเดียวกัน
 * ต่างกันแค่หัวเรื่อง หน้าตาคอลัมน์ (`layout`) และบรรทัดปิด
 *
 * ขนาดทุกตัวเป็น design pixel ของเฟรม Figma ผ่าน `calc(N * var(--u))` เหมือน
 * สไลด์อื่น — `--u` ย่อขยายตามจอให้เอง และต่ำกว่า 767px มัน re-base ตามความ
 * กว้างมือถือ ที่ต้องเขียน breakpoint เองมีแค่แถวคอลัมน์ซึ่งต้องเรียงลงมาเป็น
 * แนวตั้งบนมือถือ สี่คอลัมน์บนจอ 390px คือคอลัมน์ละสี่ตัวอักษร
 */

/**
 * bullet ท้ายคอลัมน์ — เหมือนกันทุก layout
 *
 * `points` ไม่ใส่ default เดิม เลยพังทั้งหน้าเวลาคอลัมน์ไหนแก้ points ค้างไว้
 * ไม่เสร็จ (ลบทิ้งแล้วยังไม่ได้พิมพ์ใหม่) — คอลัมน์ที่ยังไม่มี bullet ตอนนี้แค่
 * ไม่มี <ul> ไม่ทำให้ทั้งสไลด์ล้ม
 */
function Points({ points = [] }) {
  if (points.length === 0) return null;
  return (
    <ul className="list-disc pl-[calc(59*var(--u))] text-[calc(24*var(--u))] leading-normal text-me-cream">
      {points.map((point) => (
        <li key={point}>{point}</li>
      ))}
    </ul>
  );
}

/** layout "bars" — แท่งสีตั้งหน้าหัวข้อ */
function BarColumn({ column, accent }) {
  return (
    <div className="flex flex-col gap-[calc(20*var(--u))]">
      {/* สูงเท่าสองบรรทัดเป็นอย่างน้อย แล้วดันชิดล่าง — หัวข้อบรรทัดเดียวกับ
          สองบรรทัดจึงลงมาจบที่เส้นเดียวกันทั้งแถว เหมือนใน Figma
          เป็น min-h ไม่ใช่ h เพราะบนมือถือตัวอักษรกินที่มากกว่าสัดส่วนของ
          เฟรม 1920 หัวข้อสองบรรทัดจะล้นกรอบออกไปพ้นแท่งสี */}
      <div className="flex min-h-[calc(96*var(--u))] items-center gap-[calc(10*var(--u))]">
        <span
          className="w-[calc(8*var(--u))] shrink-0 self-stretch"
          style={{ backgroundColor: accent }}
          aria-hidden="true"
        />
        <h3 className="text-[calc(32*var(--u))] font-semibold leading-normal text-me-cream">
          {column.title}
        </h3>
      </div>

      <Points points={column.points} />
    </div>
  );
}

/**
 * layout "panels" — หัวข้อในกล่องพื้นสีจาง ต่อด้วยหัวข้อรองในกรอบมุมซ้ายบน
 *
 * กล่องกับกรอบติดกันสนิทไม่มีระยะห่าง (ตามเฟรม) จึงอ่านเป็นก้อนเดียว แล้ว
 * ค่อยเว้น 20px ก่อนถึง bullet
 *
 * พื้นกล่องคือสี accent ที่ความทึบ 20% — ต่อ "33" ท้ายรหัสสีเอา ไม่ได้เขียน
 * เป็นสีที่สองไว้ในข้อมูล เพิ่มลูกค้าใหม่จะได้กรอกสีเดียวจบ
 */
function PanelColumn({ column, accent }) {
  return (
    <div className="flex flex-col">
      <div
        className="flex min-h-[calc(96*var(--u))] items-center justify-center px-[calc(16*var(--u))] py-[calc(8*var(--u))]"
        style={{ backgroundColor: `${accent}33` }}
      >
        <h3 className="text-center text-[calc(32*var(--u))] font-semibold leading-normal text-me-cream">
          {column.title}
        </h3>
      </div>

      <div
        className="flex min-h-[calc(112*var(--u))] items-center border-l-[calc(8*var(--u))] border-t-[calc(8*var(--u))] pl-[calc(10*var(--u))] pt-[calc(8*var(--u))]"
        style={{ borderColor: accent }}
      >
        <p className="text-[calc(32*var(--u))] font-semibold leading-normal text-me-cream">
          {column.theme}
        </p>
      </div>

      <div className="pt-[calc(20*var(--u))]">
        <Points points={column.points} />
      </div>
    </div>
  );
}

export default function ClientBriefSlide({ brief, slide, preparedFor }) {
  if (!brief || !slide) return null;

  const { eyebrow, logo } = brief;
  const { title, accent, columns, footer, layout } = slide;
  const Column = layout === "panels" ? PanelColumn : BarColumn;

  return (
    <div className="slide-stage flex flex-col justify-between gap-10 pb-10 md:pb-16">
      <SlideTopBar preparedFor={preparedFor} />

      <section className="flex flex-col md:pb-0 gap-[calc(24*var(--u))]">
        {/* แถวชื่อลูกค้า — เส้น / ชื่อย่อ / โลโก้ในวงกลม */}
        <div className="flex items-center gap-[calc(23*var(--u))]">
          <span
            className="h-[calc(4*var(--u))] w-[calc(125*var(--u))] bg-me-gold/60"
            aria-hidden="true"
          />
          <p className="text-[calc(32*var(--u))] leading-normal tracking-[0.12em] text-me-cream/65">
            {eyebrow}
          </p>
          {logo && (
            /* eslint-disable-next-line @next/next/no-img-element -- โลโก้ลูกค้าเป็นไฟล์คงที่ในโฟลเดอร์ public */
            <img
              src={logo.src}
              alt={logo.alt}
              className="size-[calc(120*var(--u))] shrink-0 rounded-full object-cover"
            />
          )}
        </div>

        {/* ชื่อลูกค้าเป็นครีมหนา ส่วนที่เหลือของประโยคเป็นทอง */}
        <h2 className="text-[calc(64*var(--u))] leading-normal text-me-gold">
          <b className="font-semibold text-me-cream">{title.lead}</b>
          {title.rest}
        </h2>
      </section>

      {/* สี่คอลัมน์เท่ากัน เว้นระยะ 42px ตามเฟรม — บนมือถือเรียงลงมาทีละคอลัมน์
          items-start กันไม่ให้คอลัมน์สั้นถูกยืดตามคอลัมน์ที่ยาวที่สุด */}
      <section className="grid grid-cols-1 items-start gap-[2rem] md:grid-cols-4 md:gap-[calc(42*var(--u))] md:pb-20">
        {columns.map((column) => (
          <Column key={column.title} column={column} accent={accent} />
        ))}
      </section>

      {/* เส้นคั่นสั้นกลางสไลด์ แล้วบรรทัดปิด — ไม่ใช่หัวข้อใหม่ เลยไม่มีป้ายกำกับ */}
      <section className="flex flex-col items-center gap-[calc(46*var(--u))]">
        <span
          className="h-px w-[calc(840*var(--u))] max-w-full bg-me-cream/50"
          aria-hidden="true"
        />
        <p className="text-center text-[calc(32*var(--u))] leading-normal text-me-gold">
          <b className="font-semibold">{footer.lead}</b>
          {footer.rest}
        </p>
      </section>
    </div>
  );
}
