"use client";
import { useEffect } from "react";
import NavbarSimple from "@/components/NavbarSimple";
import FooterSection from "@/components/FooterSection";

const BASE = "/image/activities/dek-sang-nan-2/component";

export default function DekSangNan2Page() {
  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]');
    const prev = meta?.getAttribute("content");
    if (meta) meta.setAttribute("content", "#e8dcc8");
    return () => { if (meta && prev) meta.setAttribute("content", prev); };
  }, []);

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#f5efe0" }}>
      <NavbarSimple bg="#e8dcc8" textColor="#1a3320" solid />

      {/* ─── HERO ─── */}
      <section
        className="relative w-full overflow-hidden"
        style={{ height: "100dvh", backgroundColor: "#f5efe0" }}
      >
        {/* Background */}
        <img src={`${BASE}/bg.png`} alt=""
          className="absolute inset-0 w-full h-full object-cover" />

        {/* ── Animals — back layer (z-0) ── */}

        {/* ปูลู ซ้าย */}
        <img src={`${BASE}/ani-puloo-left.svg`} alt=""
          className="absolute hidden sm:block opacity-50 hover:opacity-100 transition-opacity duration-300"
          style={{ bottom: "6.2vh", left: "3.5vw", width: "25%", zIndex: 1 }} />

        {/* ปูลู ขวา */}
        <img src={`${BASE}/ani-puloo-right.svg`} alt=""
          className="absolute hidden sm:block opacity-50 hover:opacity-100 transition-opacity duration-300"
          style={{ top: "-2.5vh", left: "24.3vw", width: "17%", zIndex: 1 }} />

        {/* ชะนี */}
        <img src={`${BASE}/ani-chanee.svg`} alt=""
          className="absolute hidden md:block opacity-50 hover:opacity-100 transition-opacity duration-300"
          style={{ top: "22.2vh", right: "5.6vw", width: "16%", zIndex: 2 }} />

        {/* ชมพู */}
        <img src={`${BASE}/ani-chompoo.svg`} alt=""
          className="absolute hidden md:block opacity-50 hover:opacity-100 transition-opacity duration-300"
          style={{ bottom: "11.1vh", right: "6.25vw", width: "15%", zIndex: 1 }} />

        {/* กระแตซ้าย */}
        <img src={`${BASE}/ani-katarng-left.svg`} alt=""
          className="absolute hidden md:block opacity-50 hover:opacity-100 transition-opacity duration-300"
          style={{ top: "12.3vh", left: "6.25vw", width: "14%", zIndex: 1 }} />

        {/* กระแตขวา */}
        <img src={`${BASE}/ani-katarng-right.svg`} alt=""
          className="absolute hidden md:block opacity-50 hover:opacity-100 transition-opacity duration-300"
          style={{ top: "-18.5vh", right: "27.8vw", width: "10.5%", zIndex: 3 }} />

        {/* นก */}
        <img src={`${BASE}/ani-bird.svg`} alt=""
          className="absolute hidden md:block opacity-50 hover:opacity-100 transition-opacity duration-300"
          style={{ top: "14.8vh", right: "20.8vw", width: "6%", zIndex: 1 }} />

        {/* เฟิร์น */}
        <img src={`${BASE}/ani-fern.svg`} alt=""
          className="absolute hidden sm:block opacity-50 hover:opacity-100 transition-opacity duration-300"
          style={{ bottom: "6.2vh", right: "27.8vw", width: "10%", zIndex: 2 }} />

        {/* เห็ด 1 */}
        <img src={`${BASE}/ani-mushroom-1.svg`} alt=""
          className="absolute hidden sm:block opacity-50 hover:opacity-100 transition-opacity duration-300"
          style={{ bottom: "34.6vh", left: "3.5vw", width: "4%", zIndex: 1 }} />

        {/* เห็ด 1 — อีกอัน */}
        <img src={`${BASE}/ani-mushroom-1.svg`} alt=""
          className="absolute hidden sm:block opacity-50 hover:opacity-100 transition-opacity duration-300"
          style={{ bottom: "37vh", right: "5.6vw", width: "3%", zIndex: 1 }} />

        {/* เห็ด 2 */}
        <img src={`${BASE}/ani-mushroom-2.svg`} alt=""
          className="absolute hidden sm:block opacity-50 hover:opacity-100 transition-opacity duration-300"
          style={{ bottom: "32.1vh", left: "6.25vw", width: "3%", zIndex: 1 }} />

        {/* เห็ด 2 — อีกอัน */}
        <img src={`${BASE}/ani-mushroom-2.svg`} alt=""
          className="absolute hidden sm:block opacity-50 hover:opacity-100 transition-opacity duration-300"
          style={{ bottom: "33.3vh", right: "4.2vw", width: "2%", zIndex: 1 }} />

        {/* เห็ด 2 — อีกอัน 2 */}
        <img src={`${BASE}/ani-mushroom-2.svg`} alt=""
          className="absolute hidden sm:block opacity-50 hover:opacity-100 transition-opacity duration-300"
          style={{ top: "24.7vh", left: "17.4vw", width: "2.5%", zIndex: 1 }} />

        {/* ต้นไม้ใหญ่ */}
        <img src={`${BASE}/ani-bigger-tree.svg`} alt=""
          className="absolute hidden md:block opacity-50 hover:opacity-100 transition-opacity duration-300"
          style={{ bottom: "9.9vh", left: "38%", width: "3%", zIndex: 1 }} />

        {/* ต้นไม้ 2 */}
        <img src={`${BASE}/ani-2-tree.svg`} alt=""
          className="absolute hidden md:block opacity-50 hover:opacity-100 transition-opacity duration-300"
          style={{ top: "24.7vh", left: "5.6vw", width: "3.5%", zIndex: 1 }} />

        {/* ต้นไม้เล็ก */}
        <img src={`${BASE}/ani-lil-tree.svg`} alt=""
          className="absolute hidden md:block opacity-50 hover:opacity-100 transition-opacity duration-300"
          style={{ top: "42vh", right: "25vw", width: "2%", zIndex: 1 }} />


        {/* ── Center content — z-10 ── */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-4 pointer-events-none">

          {/* Org logo */}
          <img
            src={`${BASE}/Logo-Chula-Nan.svg`}
            alt="โครงการรักษ์ป่าน่าน สามพระราชดำริ"
            className="mb-3 md:mb-5 pointer-events-auto"
            style={{ width: "clamp(120px, 22vw, 280px)" }}
          />

          {/* Main KV — size by height so portrait SVG fits the viewport */}
          <img
            src={`${BASE}/Logo-dek-sarng-nan-2.svg`}
            alt="เด็กสร้างน่าน ปีที่ 2 ปลูกความคิดเพื่อชีวิตแห่งป่าน่าน"
            className="pointer-events-auto"
            style={{
              height: "clamp(240px, 52vh, 520px)",
              width: "auto",
              maxWidth: "80vw",
            }}
          />

          {/* Register button */}
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSeJyNXsXVk1OJr1JAVZWE2dhESF6eV3Lv0FjHHc0W4NNYOfLg/viewform?usp=header"
            target="_blank"
            rel="noopener noreferrer"
            className="pointer-events-auto mt-4 md:mt-6 px-8 py-3 rounded-full font-semibold text-sm md:text-base tracking-wide transition-all duration-200 hover:scale-105 hover:opacity-90"
            style={{ backgroundColor: "#1a3320", color: "#f5efe0", letterSpacing: "0.05em" }}
          >
            สมัครเข้าร่วม Bootcamp
          </a>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <svg className="w-5 h-5" style={{ color: "#2d5a3d55" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ─── SECTIONS ต่อมา ─── */}

      <FooterSection />
    </main>
  );
}
