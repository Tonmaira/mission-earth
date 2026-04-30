"use client";
import Image from "next/image";
import NavbarSimple from "@/components/NavbarSimple";
import { useState } from "react";

const PRIMARY_COLORS = [
  { name: "Deep Ocean", desc: "สื่อถึงความลึก ความน่าเชื่อถือ", sub: "Sage", hex: "#002740", textLight: true },
  { name: "Horizon Blue", desc: "สื่อถึงการมองไกล การสำรวจ", sub: "Explorer", hex: "#205b80", textLight: true },
  { name: "Earth Gold", desc: "สื่อถึงคุณค่า ความอบอุ่น ความค้นพบ", sub: "Creator", hex: "#CEA871", textLight: true },
];

const SECONDARY_COLORS = [
  { name: "Sky Blue", hex: "#6fb3de", textLight: true },
  { name: "Earth Brown", hex: "#6b4f2a", textLight: true },
  { name: "Sand", hex: "#d6c0a2", textLight: false },
  { name: "Chalk", hex: "#f0eee9", textLight: false },
];

const ACCENT_COLORS = [
  { name: "Terracotta", hex: "#9b4e2f", textLight: true },
  { name: "Rust Red", hex: "#912203", textLight: true },
  { name: "Sage Green", hex: "#7a8c5e", textLight: true },
  { name: "Forest Green", hex: "#124700", textLight: true },
];

function ColorCard({ name, desc, sub, hex, textLight, large = false }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const textColor = textLight ? "white" : "#3a3028";

  return (
    <button
      onClick={handleCopy}
      className="rounded-3xl flex flex-col justify-between text-left transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98] cursor-pointer w-full border"
      style={{ backgroundColor: hex, padding: large ? "2rem" : "1.5rem", minHeight: large ? "220px" : "160px", borderColor: "rgba(255,255,255,0.4)" }}
    >
      <div>
        <p className="font-bold text-lg leading-snug" style={{ color: textColor }}>{name}</p>
        {desc && <p className="text-sm mt-1 opacity-80" style={{ color: textColor }}>{desc}</p>}
        {sub && <p className="text-sm italic opacity-70 mt-0.5" style={{ color: textColor }}>{sub}</p>}
      </div>
      <p className="text-sm font-mono mt-4 tracking-widest" style={{ color: textColor }}>
        {copied ? <span className="font-semibold">Copied!</span> : hex}
      </p>
    </button>
  );
}

export default function BrandGuidelinePage() {
  return (
    <main className="w-full" style={{ backgroundColor: "#edebe6" }}>
      <NavbarSimple
        bg="#edebe6"
        textColor="#cea871"
        navLinks={[
          { href: "/", label: "Home", hoverColor: "#002740" },
          { href: "/about", label: "About Us", hoverColor: "#205b80" },
          { href: "/services", label: "Services", hoverColor: "#6fb3de" },
          { href: "/portfolio", label: "Portfolio", hoverColor: "#9b4e2f" },
          { href: "/contact", label: "Contact Us", hoverColor: "#7a8c5e" },
        ]}
      />

      {/* Hero */}
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-8">
        <p className="text-sm tracking-[0.3em] uppercase mb-10" style={{ color: "#b5a98a" }}>
          Brand Guidelines 2026
        </p>
        <Image src="/full-logo-me.svg" alt="Mission Earth" width={320} height={100} className="object-contain opacity-25" />
        <div className="mt-10">
          <p className="text-2xl font-medium tracking-wide" style={{ color: "#a09880" }}>
            Visual Identity &amp; Communication
          </p>
          <p className="text-sm mt-2" style={{ color: "#b5a98a" }}>คู่มือการใช้งานดีไซน์</p>
        </div>
      </div>

      {/* Color Palette */}
      <section className="max-w-5xl mx-auto px-8 pb-24">
        <p className="text-xs tracking-[0.3em] uppercase mb-2" style={{ color: "#b5a98a" }}>Brand Colors</p>
        <h2 className="text-2xl font-semibold mb-10" style={{ color: "#6b5c4a" }}>Color Palette</h2>

        {/* Primary */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          {PRIMARY_COLORS.map((c) => <ColorCard key={c.hex} {...c} large />)}
        </div>

        {/* Secondary */}
        <div className="grid grid-cols-4 gap-4 mb-4">
          {SECONDARY_COLORS.map((c) => <ColorCard key={c.hex} {...c} />)}
        </div>

        {/* Accent */}
        <div className="grid grid-cols-4 gap-4">
          {ACCENT_COLORS.map((c) => <ColorCard key={c.hex} {...c} />)}
        </div>
      </section>

      {/* Logo Usage */}
      <section className="max-w-5xl mx-auto px-8 pb-32">
        <p className="text-xs tracking-[0.3em] uppercase mb-2" style={{ color: "#b5a98a" }}>Logo Usage</p>
        <h2 className="text-2xl font-semibold mb-10" style={{ color: "#6b5c4a" }}>การใช้งานโลโก้</h2>

        {/* Clearspace */}
        <p className="text-xs tracking-[0.2em] uppercase mb-3" style={{ color: "#b5a98a" }}>Clearspace & Variations</p>
        <div className="mb-10 rounded-xl overflow-hidden" style={{ backgroundColor: "#ffffff" }}>
          <Image
            src="/brand-guide/logo/logo-use-1.png"
            alt="Logo clearspace on colored backgrounds"
            width={1200}
            height={400}
            className="w-full object-cover"
          />

        {/* Caption row under logo-use-1 */}
        <div className="grid grid-cols-3 gap-8 px-6 py-5">
          {/* Left: logo info + download */}
          <div className="flex flex-col gap-3">
            <div>
              <p className="text-base font-semibold" style={{ color: "#6b5c4a" }}>โลโก้</p>
              <p className="text-base font-semibold" style={{ color: "#CEA871" }}>สี Earth Gold</p>
            </div>
            <a
              href="/brand-guide/download%20logo/me-earth-gold.png"
              download="me-earth-gold.png"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium w-fit transition-opacity hover:opacity-80"
              style={{ backgroundColor: "#002740", color: "#CEA871" }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              me-earth-gold.png
            </a>
          </div>

          {/* Middle: Do's */}
          <div className="flex flex-col gap-2">
            {[
              "พื้นหลังสี Deep Ocean",
              "พื้นหลังสีเข้ม โทนกรมท่า น้ำเงิน เขียว แดง/ส้ม",
              "พื้นหลังสีเข้ม และมีลวดลายอยู่ในกลุ่มสีเดียวกัน",
            ].map((text) => (
              <div key={text} className="flex items-start gap-2">
                <span className="mt-0.5 shrink-0" style={{ color: "#7a8c5e" }}>✓</span>
                <p className="text-sm leading-snug" style={{ color: "#6b5c4a" }}>{text}</p>
              </div>
            ))}
          </div>

          {/* Right: Don'ts */}
          <div className="flex flex-col gap-2">
            {[
              "พื้นหลังสีสด",
              "พื้นหลังสีกลืนกับ Logo",
              "พื้นหลังที่มีลวดลายรบกวน Logo",
            ].map((text) => (
              <div key={text} className="flex items-start gap-2">
                <span className="mt-0.5 shrink-0" style={{ color: "#912203" }}>✕</span>
                <p className="text-sm leading-snug" style={{ color: "#6b5c4a" }}>{text}</p>
              </div>
            ))}
          </div>
        </div>
        </div>

        {/* 3 logo variation cards */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            {
              img: "/brand-guide/logo/logo-use-2.png",
              alt: "White logo",
              titlePre: "โลโก้สี",
              titleHighlight: "ขาว",
              highlightColor: "#f0eee9",
              highlightBg: "#6b5c4a",
              desc: [
                "ใช้บนพื้นหลังสีอื่นๆ ที่ไม่ใช่สี CI บริษัท",
                "ใช้วางร่วมกับองค์กรอื่น ๆ บนอาร์ตเวิร์คเพื่อการประชาสัมพันธ์ (เมื่อองค์กรอื่น ๆ ใช้สีขาวเหมือนกัน)",
                "ใช้บนอาร์ตเวิร์คที่ไม่เข้าเงื่อนไขในการใช้โลโก้สี Earth Gold",
              ],
              dos: ["พื้นหลังสีดำ", "พื้นหลังสีสด", "พื้นหลังสีเข้ม และมีลวดลายอยู่ในกลุ่มสีเดียวกัน"],
              donts: ["พื้นหลังสี CI บริษัท", "พื้นหลังสีกลืนกับ Logo", "พื้นหลังที่มีลวดลายรบกวน Logo"],
              file: "me-white.png.png",
              fileLabel: "me-white.png",
            },
            {
              img: "/brand-guide/logo/logo-use-3.png",
              alt: "Black logo",
              titlePre: "โลโก้สี",
              titleHighlight: "ดำ",
              highlightColor: "#3a3028",
              highlightBg: null,
              desc: [
                "ใช้บนพื้นหลังสีขาว หรือสีอ่อนเกือบขาว",
                "ใช้วางร่วมกับองค์กรอื่น ๆ บนอาร์ตเวิร์คเพื่อการประชาสัมพันธ์ (เมื่อองค์กรอื่น ๆ ใช้สีดำเหมือนกัน)",
                "ใช้บนอาร์ตเวิร์คที่ไม่เข้าเงื่อนไขในการใช้โลโก้สี Earth Gold",
              ],
              dos: ["พื้นหลังสีขาว", "พื้นหลังสีอ่อนเกือบขาว", "พื้นหลังสีสว่าง/อ่อน และมีลวดลายอยู่ในกลุ่มสีเดียวกัน"],
              donts: ["พื้นหลังสี CI บริษัท", "พื้นหลังสีกลืนกับ Logo", "พื้นหลังที่มีลวดลายรบกวน Logo"],
              file: "me-black.png",
              fileLabel: "me-black.png",
            },
            {
              img: "/brand-guide/logo/logo-use-4.png",
              alt: "Earth Gold logo on Ocean Blue",
              titlePre: "โลโก้สี",
              titleHighlight: "Earth Gold",
              titleSub: "บนพื้นหลัง Ocean Blue",
              highlightColor: "#CEA871",
              highlightBg: null,
              desc: [
                "โลโก้พร้อมพื้นหลัง ใช้ในกรณีอยู่นอกทุกเงื่อนไขในการวางโลโก้",
                "ใช้วางร่วมกับองค์กรอื่น ๆ บนอาร์ตเวิร์คเพื่อการประชาสัมพันธ์ (เมื่อองค์กรอื่น ๆ ใช้ logo หลากสี)",
                "สามารถวางได้บนทุก ๆ พื้นหลัง",
              ],
              dos: ["ใช้ได้ทุกพื้นหลัง"],
              donts: ["สีพื้นหลังใกล้เคียงกับสี Ocean Blue"],
              file: "me-earth-gold-on-ocean-blue.png",
              fileLabel: "me-earth-gold-on-ocean-blue.png",
            },
          ].map((card) => (
            <div key={card.fileLabel} className="rounded-xl overflow-hidden flex flex-col" style={{ backgroundColor: "#ffffff" }}>
              <Image src={card.img} alt={card.alt} width={600} height={300} className="w-full object-cover" />
              <div className="p-5 flex flex-col gap-4 flex-1">
                {/* Title */}
                <div>
                  <p className="text-lg font-semibold leading-snug" style={{ color: "#3a3028" }}>
                    {card.titlePre}{" "}
                    <span style={{ color: card.highlightColor, backgroundColor: card.highlightBg, borderRadius: card.highlightBg ? "4px" : undefined, padding: card.highlightBg ? "0 4px" : undefined }}>
                      {card.titleHighlight}
                    </span>
                  </p>
                  {card.titleSub && (
                    <p className="text-lg font-semibold" style={{ color: "#3a3028" }}>
                      บนพื้นหลัง <span style={{ color: "#205b80" }}>Ocean Blue</span>
                    </p>
                  )}
                </div>
                {/* Description */}
                <div className="flex flex-col gap-1">
                  {card.desc.map((d) => (
                    <p key={d} className="text-xs leading-relaxed" style={{ color: "#8a7a6a" }}>{d}</p>
                  ))}
                </div>
                {/* Do's */}
                <div className="flex flex-col gap-1">
                  {card.dos.map((d) => (
                    <div key={d} className="flex items-start gap-1.5">
                      <span className="text-sm shrink-0" style={{ color: "#7a8c5e" }}>✓</span>
                      <p className="text-xs leading-snug" style={{ color: "#6b5c4a" }}>{d}</p>
                    </div>
                  ))}
                </div>
                {/* Don'ts */}
                <div className="flex flex-col gap-1">
                  {card.donts.map((d) => (
                    <div key={d} className="flex items-start gap-1.5">
                      <span className="text-sm shrink-0" style={{ color: "#912203" }}>✕</span>
                      <p className="text-xs leading-snug" style={{ color: "#6b5c4a" }}>{d}</p>
                    </div>
                  ))}
                </div>
                {/* Download */}
                <div className="mt-auto pt-2">
                  <a
                    href={`/brand-guide/download%20logo/${card.file}`}
                    download={card.fileLabel}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-opacity hover:opacity-80"
                    style={{ backgroundColor: "#002740", color: "#CEA871" }}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    {card.fileLabel}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Icon / Symbol */}
        <p className="text-xs tracking-[0.2em] uppercase mb-3" style={{ color: "#b5a98a" }}>Icon / Symbol</p>
        <div className="flex flex-col gap-3 mb-10">
          {[
            {
              img: "/brand-guide/logo/logo-use-5.png",
              alt: "Symbol Earth Gold",
              titlePre: "โลโก้ SYMBOLIC สี",
              titleHighlight: "Earth Gold",
              highlightColor: "#CEA871",
              dos: ["พื้นหลังสี Deep Ocean", "พื้นหลังสีเข้ม โทนกรมท่า น้ำเงิน เขียว แดง/ส้ม", "พื้นหลังสีเข้ม และมีลวดลายอยู่ในกลุ่มสีเดียวกัน"],
              donts: ["พื้นหลังสีสด", "พื้นหลังสีกลืนกับ Logo", "พื้นหลังที่มีลวดลายรบกวน Logo"],
              file: "symbol-me-earth-gold.png",
            },
            {
              img: "/brand-guide/logo/logo-use-6.png",
              alt: "Symbol White",
              titlePre: "โลโก้ SYMBOLIC สี",
              titleHighlight: "White",
              highlightColor: "#8a7a6a",
              dos: ["พื้นหลังสีดำ", "พื้นหลังสีสด", "พื้นหลังสีเข้ม และมีลวดลายอยู่ในกลุ่มสีเดียวกัน"],
              donts: ["พื้นหลังสี CI บริษัท", "พื้นหลังสีกลืนกับ Logo", "พื้นหลังที่มีลวดลายรบกวน Logo"],
              file: "symbol-me-earth-white.png",
            },
            {
              img: "/brand-guide/logo/logo-use-7.png",
              alt: "Symbol Black",
              titlePre: "โลโก้ SYMBOLIC สี",
              titleHighlight: "Black",
              highlightColor: "#3a3028",
              dos: ["พื้นหลังสีขาว", "พื้นหลังสีอ่อนเกือบขาว", "พื้นหลังสีสว่าง/อ่อน และมีลวดลายอยู่ในกลุ่มสีเดียวกัน"],
              donts: ["พื้นหลังสี CI บริษัท", "พื้นหลังสีกลืนกับ Logo", "พื้นหลังที่มีลวดลายรบกวน Logo"],
              file: "symbol-me-earth-black.png",
            },
            {
              img: "/brand-guide/logo/logo-use-8.png",
              alt: "Symbol Earth Gold on Ocean Blue",
              titlePre: "โลโก้ SYMBOLIC สี",
              titleHighlight: "Earth Gold",
              titleSub: "บน Ocean Blue",
              highlightColor: "#CEA871",
              subHighlight: "#205b80",
              dos: ["ใช้ได้ทุกพื้นหลัง"],
              donts: ["สีพื้นหลังใกล้เคียงกับสี Ocean Blue"],
              file: "symbol-me-me-gold-ocean.png",
            },
          ].map((card) => (
            <div key={card.file} className="rounded-xl overflow-hidden flex items-stretch" style={{ backgroundColor: "#ffffff" }}>
              {/* Image */}
              <div className="shrink-0 w-[200px]">
                <Image src={card.img} alt={card.alt} width={200} height={200} className="w-full h-full object-cover" />
              </div>
              {/* Content */}
              <div className="flex flex-1 items-center px-8 py-5 gap-8">
                {/* Title + download */}
                <div className="w-[220px] shrink-0 flex flex-col gap-3">
                  <p className="text-lg font-semibold leading-snug" style={{ color: "#3a3028" }}>
                    {card.titlePre}{" "}
                    <span style={{ color: card.highlightColor }}>{card.titleHighlight}</span>
                    {card.titleSub && (
                      <><br /><span style={{ color: "#3a3028" }}>บน </span><span style={{ color: card.subHighlight ?? "#205b80" }}>Ocean Blue</span></>
                    )}
                  </p>
                  <a
                    href={`/brand-guide/download%20logo/${card.file}`}
                    download={card.file}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium w-fit transition-opacity hover:opacity-80"
                    style={{ backgroundColor: "#002740", color: "#CEA871" }}
                  >
                    <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    {card.file}
                  </a>
                </div>
                {/* Do's */}
                <div className="flex flex-col gap-1.5 flex-1">
                  {card.dos.map((d) => (
                    <div key={d} className="flex items-start gap-2">
                      <span className="shrink-0 text-sm" style={{ color: "#7a8c5e" }}>✓</span>
                      <p className="text-sm leading-snug" style={{ color: "#6b5c4a" }}>{d}</p>
                    </div>
                  ))}
                </div>
                {/* Don'ts */}
                <div className="flex flex-col gap-1.5 flex-1">
                  {card.donts.map((d) => (
                    <div key={d} className="flex items-start gap-2">
                      <span className="shrink-0 text-sm" style={{ color: "#912203" }}>✕</span>
                      <p className="text-sm leading-snug" style={{ color: "#6b5c4a" }}>{d}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Do's and Don'ts */}
        <p className="text-xs tracking-[0.2em] uppercase mb-3" style={{ color: "#b5a98a" }}>Background Usage</p>
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-sm font-medium mb-2" style={{ color: "#7a8c5e" }}>✓ พื้นหลังที่แนะนำให้ใช้</p>
            <Image
              src="/brand-guide/logo/logo-use-9.png"
              alt="Recommended backgrounds"
              width={1200}
              height={300}
              className="w-full rounded-2xl object-cover"
            />
          </div>
          <div>
            <p className="text-sm font-medium mb-2" style={{ color: "#912203" }}>✕ พื้นหลังที่ไม่แนะนำให้ใช้</p>
            <Image
              src="/brand-guide/logo/logo-use-10.png"
              alt="Not recommended backgrounds"
              width={1200}
              height={300}
              className="w-full rounded-2xl object-cover"
            />
          </div>
        </div>
      </section>

    </main>
  );
}
