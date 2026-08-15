"use client";
import Image from "next/image";
import { useState, useEffect } from "react";

const BASE = "/EkidenWeb";
const NAVY = "#002740";
// TODO: ใส่ลิงก์หน้าจ่ายเงินจริงเมื่อมี (เช่น หน้าสมัคร/payment gateway)
const PAYMENT_URL = "#";

// รูป hero ที่สลับทุก 5 วิ — เพิ่มไฟล์ใหม่ที่นี่ (แนวตั้ง ~3:4 เช่น 1280×1720)
// lightText: true = รูปทึบ ต้องเปลี่ยน SARABURI/RELAY RUN เป็นขาวเพื่อให้อ่านออก
const HERO_IMAGES = [
  { src: "ekiden image hero.png", lightText: false },
  { src: "ekiden image hero-2.png", lightText: true },
  { src: "ekiden image hero-3.png", lightText: true },
  { src: "ekiden image hero-4.png", lightText: false },
];
// จุดเริ่มของรูป = บรรทัด SARABURI (ไม่ให้รูปเลยขึ้นไปด้านบน เหลือครีมไว้)
const IMG_TOP = "7.73%";

/* Hero card — สัดส่วน 640×657 ตาม Figma (Frame 17) พร้อม overlay ตามพิกัดจริง
   สไลด์รูป crossfade ทุก 5 วิ + สลับสีตัวหนังสือตามรูป */
function HeroCard() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (HERO_IMAGES.length <= 1) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % HERO_IMAGES.length), 6000);
    return () => clearInterval(id);
  }, []);

  // รูปทึบ → wordmark navy กลายเป็นขาว 80% (brightness-0 invert = ขาว)
  const wordmarkFx = `transition-[filter,opacity] duration-1500 ${
    HERO_IMAGES[idx].lightText ? "brightness-0 invert opacity-80" : ""
  }`;

  return (
    <div className="relative h-full w-full">
      {/* รูปคนวิ่ง (สไลด์โชว์) — เริ่มที่บรรทัด SARABURI ด้านบนเหลือครีม */}
      <div className="absolute inset-x-0 bottom-0 overflow-hidden" style={{ top: IMG_TOP }}>
        {HERO_IMAGES.map((img, i) => (
          <Image
            key={img.src}
            src={`${BASE}/${img.src}`}
            alt="นักวิ่งครอสคันทรีในเส้นทางธรรมชาติ"
            fill
            priority={i === 0}
            sizes="640px"
            className={`object-cover object-top transition-opacity duration-1000 ${
              i === idx ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>

      {/* SARABURI CROSS-COUNTRY */}
      <div className="absolute left-0 top-[7.73%] h-[3.76%] w-full">
        <Image src={`${BASE}/Saraburi cross-country.png`} alt="Saraburi Cross-Country" fill priority sizes="640px" className={`object-contain ${wordmarkFx}`} />
      </div>

      {/* RELAY RUN */}
      <div className="absolute left-0 top-[14.22%] h-[21.82%] w-full">
        <Image src={`${BASE}/Ekiden poster.png`} alt="Relay Run" fill priority sizes="640px" className={`object-contain ${wordmarkFx}`} />
      </div>

      {/* โลโก้ Mission Earth Ekiden (ขาว, ไม่มี tagline) */}
      <div className="absolute left-[24.93%] top-[72%] h-[19.02%] w-[50.13%]">
        <Image src={`${BASE}/EkidenLogo.svg`} alt="Mission Earth Ekiden" fill priority sizes="320px" className="object-contain" />
      </div>
    </div>
  );
}

/* ป้ายสปอนเซอร์ (ฟ้า) ในกริด — relative ให้ Image fill ทำงาน */
function SponsorLabel({ src, alt, className }) {
  return (
    <div className={`relative ${className}`}>
      <Image src={`${BASE}/${src}`} alt={alt} fill sizes="200px" className="object-contain" />
    </div>
  );
}

/* Panel ข้อมูลด้านขวาของ hero (Figma Frame 2271:2779) */
function InfoPanel() {
  return (
    <div className="flex w-full max-w-[367px] shrink-0 flex-col items-center gap-6 px-4">
      <div className="w-full">
        <p className="text-center text-[56px] font-semibold leading-none text-[#002740] sm:text-[72px] lg:text-[80px]">
          04.10.26
        </p>
        <p className="mt-2 text-center text-[22px] font-semibold text-[#00273f] sm:text-[26px] lg:text-[30px]">
          SARABURI
        </p>
      </div>

      <div className="h-0.5 w-full bg-[#002740]" />

      <div className="flex flex-col items-center gap-1">
        <p className="text-center font-semibold leading-none text-[#002740]">
          <span className="text-[42px] sm:text-[48px]">7</span>
          <span className="text-[30px] text-[#cea871] sm:text-[36px]">x3</span>
          <span className="text-[42px] sm:text-[48px]"> km</span>
        </p>
        <p className="text-[22px] font-semibold text-[#002740] sm:text-[24px]">REGISTER AS A TEAM!</p>
        <div className="mt-1 flex items-center gap-5 text-[#cea871]">
          <span className="text-[32px] leading-none sm:text-[36px]" aria-hidden>‹</span>
          <div className="text-center text-[15px] font-semibold leading-tight sm:text-[16px]">
            <p>7 km per person</p>
            <p>3 persons per team</p>
          </div>
          <span className="text-[32px] leading-none sm:text-[36px]" aria-hidden>›</span>
        </div>

        {/* ปุ่ม REGISTER NOW — ย้ายมาจากบนรูป hero */}
        <a
          href={PAYMENT_URL}
          className="mt-5 flex w-full items-center justify-center rounded-md bg-[#032740] px-10 py-3 text-[15px] font-semibold uppercase tracking-[0.15em] text-[#f0eee9] transition-colors hover:bg-[#0a3a5a]"
        >
          Register Now
        </a>
      </div>
    </div>
  );
}

function HeroBlock() {
  return (
    // เว้น ~85px ด้านบนเป็น navbar (ยังไม่ได้ทำ)
    <section className="flex min-h-screen w-full items-center justify-center px-4 pt-[85px] pb-6">
      <div className="flex flex-col items-center justify-center gap-10 lg:flex-row lg:gap-14">
        {/* คอลัมน์ซ้าย: Prime + hero card + สปอนเซอร์ (กล่อง aspect ย่อพอดีความสูงจอ) */}
        <div className="relative aspect-[640/800] h-[min(calc(100vh_-_110px),calc(min(100vw_-_2rem,600px)*1.25))]">
          {/* PRIME PARTNER — บนสุด ตำแหน่งพรีเมียม */}
          <SponsorLabel
            src="PrimePartnerBlue.svg"
            alt="Prime Partner"
            className="absolute left-[34.4%] top-0 h-[7.37%] w-[31.25%]"
          />

          {/* Hero card */}
          <div className="absolute left-0 top-[5.37%] h-[82.07%] w-full">
            <HeroCard />
          </div>

          {/* OFFICIAL SUPPORTER × 3 */}
          <div className="absolute left-0 top-[89.26%] grid h-[4.75%] w-full grid-cols-3 gap-x-[11.56%]">
            {[0, 1, 2].map((i) => (
              <SponsorLabel key={i} src="OfficialSupporterBlue.svg" alt="Official Supporter" className="h-full w-full" />
            ))}
          </div>

          {/* IMPACT PARTNER × 5 */}
          <div className="absolute left-0 top-[96.75%] grid h-[3.25%] w-full grid-cols-5 gap-x-[7.8%]">
            {[0, 1, 2, 3, 4].map((i) => (
              <SponsorLabel key={i} src="ImpactPartnerBlue.svg" alt="Impact Partner" className="h-full w-full" />
            ))}
          </div>
        </div>

        {/* คอลัมน์ขวา: panel วันที่ + ระยะ + register as team */}
        <InfoPanel />
      </div>
    </section>
  );
}

/* ── Section รายละเอียดงาน + ตารางเวลา (Figma Frame 2271:2778) ────── */
// NOTE: เวลาส่วนใหญ่เป็น "04.45 am" ตาม Figma (ยังเป็น placeholder) — รอเวลาจริง
const SCHEDULE = [
  { time: "04.30 am", title: "Meet up", lines: ["พบกันที่สถานที่นัดหมาย", "โรงเรียนวัดกะเหรี่ยงคอม้า"] },
  { time: "04.45 am", title: "เตรียมความพร้อม" },
  { time: "05.00 am", title: "รวมตัวแต่ละทีม และเดินทางสู่พื้นที่วิ่ง" },
  { time: "05.15 am", title: "ชี้แจงกิจกรรม", bullets: ["กฏ และกติกาการแข่งขัน", "แบ่งตัวนักวิ่งแต่ละผลัด", "วอร์มอัพ"] },
  { time: "05.30 am", title: "ปล่อยตัวนักวิ่ง Wave แรก", lines: ["(ผลัดที่ 1 ของแต่ละทีม)"] },
  { time: "09.00 am", title: "พิธีมอบรางวัล" },
  { time: "09.30 am", title: "Cut Off (DNF)" },
  { time: "09.45 am", title: "สิ้นสุดกิจกรรม" },
];

function ScheduleRow({ time, title, lines, bullets }) {
  return (
    <div className="flex gap-6 sm:gap-10">
      <p className="w-[92px] shrink-0 text-[18px] font-semibold text-black sm:w-[105px] sm:text-[20px]">
        {time}
      </p>
      <div className="flex flex-col items-start text-black">
        <p className="text-[18px] font-semibold sm:text-[20px]">{title}</p>
        {lines?.map((l) => (
          <p key={l} className="text-[15px] font-normal sm:text-[16px]">{l}</p>
        ))}
        {bullets && (
          <ul className="list-disc ps-6 text-[15px] font-normal sm:text-[16px]">
            {bullets.map((bl) => (
              <li key={bl}>{bl}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function EventDetailsSection() {
  return (
    <section id="details" className="w-full px-6 py-20 sm:py-24">
      <div className="mx-auto flex max-w-[464px] flex-col items-center gap-8">
        {/* โลโก้ + ชื่อ + สถานที่ + วันที่ */}
        <div className="flex w-full flex-col items-center gap-4 text-center">
          <div className="relative aspect-[315/103] w-[260px] sm:w-[315px]">
            <Image src={`${BASE}/EkidenLogoNavy.svg`} alt="Mission Earth Ekiden" fill sizes="315px" className="object-contain" />
          </div>
          <p className="text-[30px] font-semibold leading-tight text-[#00273f] sm:text-[36px]">
            Cross-Country Relay Run
          </p>
          <p
            className="text-[16px] font-semibold text-[#00273f]"
            style={{ fontFamily: "var(--font-noto-sans-thai), sans-serif" }}
          >
            หมู่บ้านกะเหรี่ยงคอม้า ต.ชะอม อ.แก่งคอย จ.สระบุรี
          </p>
          <p className="text-[40px] font-semibold text-[#002740] sm:text-[48px]">04.10.26</p>
        </div>

        {/* ตารางเวลา */}
        <div className="flex w-full flex-col gap-2.5" style={{ fontFamily: "var(--font-noto-sans-thai), sans-serif" }}>
          {SCHEDULE.map((row, i) => (
            <ScheduleRow key={i} {...row} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Section แพ็กเกจสมัคร (สิ่งที่ทีมจะได้รับ) ─────────────────────── */
function PricingCard() {
  // ตรงตาม Figma node 2273:2816 — หัวข้อฟ้า #71b3de, center, Early Bird เป็นแถบทอง #cea871
  return (
    <div
      className="overflow-hidden rounded-lg bg-[#002740] p-3"
      style={{ fontFamily: "var(--font-noto-sans-thai), sans-serif" }}
    >
      <div className="flex flex-col items-center gap-4 px-3 py-4 text-center">
        <h3 className="text-[30px] font-semibold leading-tight text-[#71b3de] sm:text-[36px]">
          สมัครในรูปแบบทีม<br />ทีมละ 3 คน
        </h3>
        <p className="text-[20px] font-semibold text-white sm:text-[24px]">
          จำนวนจำกัดเพียง 150 ทีม
        </p>
        <p className="flex items-baseline justify-center gap-2.5 text-white">
          <span className="text-[20px] font-semibold sm:text-[24px]">THB</span>
          <span className="text-[34px] font-semibold leading-none sm:text-[40px]">3,570</span>
          <span className="text-[20px] font-semibold sm:text-[24px]">/TEAM</span>
        </p>
        {/* แถบ Early Bird = ปุ่มไปหน้าจ่ายเงิน (ลิงก์รอใส่จริงที่ PAYMENT_URL) */}
        <a
          href={PAYMENT_URL}
          className="flex w-full flex-wrap items-baseline justify-center gap-x-2 gap-y-1 rounded-lg bg-[#cea871] px-4 py-2 text-white transition-colors hover:bg-[#d8b784] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#cea871]"
        >
          <span className="text-[18px] font-semibold sm:text-[24px]">Early Bird</span>
          <span className="text-[18px] font-normal line-through sm:text-[24px]">3,570</span>
          <span className="text-[18px] font-semibold sm:text-[24px]">เหลือ</span>
          <span className="text-[30px] font-semibold leading-none sm:text-[40px]">2,995</span>
          <span className="text-[18px] font-semibold sm:text-[24px]">บาท</span>
        </a>
      </div>
    </div>
  );
}

/* หมายเลข + ชื่อรายการ */
function ItemHead({ n, title, sub }) {
  return (
    <div className="flex items-start gap-4">
      <span className="text-[52px] font-bold leading-[0.8] text-[#002740]/25">{n}</span>
      <div>
        <h3 className="text-[26px] font-bold leading-tight text-[#002740]">{title}</h3>
        <p className="mt-1 text-[16px] font-semibold text-[#002740]/80">{sub}</p>
      </div>
    </div>
  );
}

/* รายการซ้าย (รูป + หมายเลข/ข้อความ) — Race Bib, Buff */
function ItemRow({ img, ratio, n, title, sub, desc }) {
  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:gap-7">
      <div className={`relative ${ratio} w-[62%] shrink-0 sm:w-[42%]`}>
        <Image src={`${BASE}/${img}`} alt={title} fill sizes="(max-width:640px) 62vw, 240px" className="object-contain" />
      </div>
      <div className="w-full">
        <ItemHead n={n} title={title} sub={sub} />
        <p className="mt-3 text-[15px] leading-relaxed text-[#002740]/70">{desc}</p>
      </div>
    </div>
  );
}

function PackageSection() {
  return (
    <section id="package" className="w-full px-6 py-20 sm:py-28">
      <div className="mx-auto grid max-w-[1100px] items-start gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        {/* ซ้าย: การ์ดราคา + Race Bib + Buff */}
        <div className="flex flex-col gap-12">
          <PricingCard />
          <ItemRow
            img="BibRaceCrop.svg"
            ratio="aspect-[1106/731]"
            n="2"
            title="Race Bib x3"
            sub="ป้ายเบอร์ประจำตัวนักวิ่ง"
            desc="หนึ่งทีมได้ 3 ใบ สำหรับนักวิ่ง 3 ผลัด"
          />
          <ItemRow
            img="BuffCrop.svg"
            ratio="aspect-[1344/780]"
            n="3"
            title="Buff x3"
            sub="ผ้าบัฟ"
            desc="ผ้าอเนกประสงค์ กันแดดและรังสี UV ซับเหงื่อระบายอากาศ และกันฝุ่นละออง หนึ่งทีมได้ 3 ชิ้น"
          />
        </div>

        {/* ขวา: Tasuki (นักวิ่งตัวใหญ่) */}
        <div className="flex flex-col items-center">
          <div className="w-full max-w-[360px]">
            <ItemHead n="1" title="Tasuki x1" sub="ผ้าผลัด" />
            <p className="mt-3 text-[15px] leading-relaxed text-[#002740]/70">
              สายสะพายผ้าที่นักวิ่งใช้ส่งต่อแทนไม้ผลัด โดยนักวิ่งจะสะพายเฉียงพาดผ่านไหล่และลำตัวด้านข้าง
              ซึ่งนอกจากจะเป็นสัญลักษณ์ของการส่งมอบภารกิจและความสามัคคี
            </p>
          </div>
          <div className="relative mt-6 aspect-[518/1080] w-[64%] max-w-[280px]">
            <Image src={`${BASE}/Tatsuki.svg`} alt="Tasuki" fill sizes="280px" className="object-contain" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function EkidenPage() {
  return (
    <main className="w-full bg-[#f0eee9]" style={{ color: NAVY }}>
      {/* TODO: navbar — เอา Navbar ของเว็บหลักออกก่อน (พื้นเข้ม อ่านไม่ออกบนครีม)
          จะทำ navbar ใหม่ให้เข้ากับพื้นครีม ที่ว่างด้านบน (pt-[85px]) เว้นไว้แล้ว */}
      <HeroBlock />
      <EventDetailsSection />
      <PackageSection />
    </main>
  );
}
