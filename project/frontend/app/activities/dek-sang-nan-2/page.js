"use client";
import { useState, useEffect, useRef } from "react";
import NavbarSimple from "@/components/NavbarSimple";
import FooterSection from "@/components/FooterSection";

const BASE = "/image/activities/dek-sang-nan-2/component";
const FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSeJyNXsXVk1OJr1JAVZWE2dhESF6eV3Lv0FjHHc0W4NNYOfLg/viewform?usp=header";
const COUNTDOWN_TARGET = new Date("2026-06-26T23:59:00+07:00");

const TIMELINE = [
  {
    label: "เปิดรับสมัครแล้ว!",
    date: "12 พฤษภาคม 2569",
    milestone: new Date("2026-05-12T23:59:00+07:00"),
    color: "#235c80",
  },
  {
    label: "กิจกรรม Kick-off Online",
    date: "26 พฤษภาคม 2569\nเวลา 13.00 – 15.00 น. (ระบบ Zoom)",
    milestone: new Date("2026-05-26T15:00:00+07:00"),
    action: { label: "Link Zoom", href: "#", bg: "#8aacbe" },
    color: "#235c80",
  },
  {
    label: "สิ้นสุดการรับสมัคร",
    date: "26 มิถุนายน 2569 เวลา 23:59 น.",
    milestone: new Date("2026-06-26T23:59:00+07:00"),
    color: "#90261d",
  },
  {
    label: "ประกาศผล",
    date: "6 กรกฎาคม 2569",
    milestone: new Date("2026-07-06T00:00:00+07:00"),
    badge: { label: "ประกาศผู้ผ่านเข้ารอบ (Soon)", bg: "#c4879a" },
    color: "#90261d",
  },
  {
    label: "กิจกรรม Boot Camp",
    date: "20 – 22 กรกฎาคม 2569\nณ ศูนย์การเรียนรู้และบริการวิชาการเครือข่ายแห่งจุฬาลงกรณ์มหาวิทยาลัย จังหวัดน่าน",
    milestone: new Date("2026-07-22T23:59:00+07:00"),
    color: "#254821",
  },
];

export default function DekSangNan2Page() {
  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]');
    const prev = meta?.getAttribute("content");
    if (meta) meta.setAttribute("content", "#e8dcc8");
    return () => { if (meta && prev) meta.setAttribute("content", prev); };
  }, []);

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [now, setNow] = useState(() => new Date());
  const [mobileExpanded, setMobileExpanded] = useState(false);

  const heroRef = useRef(null);
  const footerRef = useRef(null);
  const [heroVisible, setHeroVisible] = useState(true);
  const [footerVisible, setFooterVisible] = useState(false);
  useEffect(() => {
    const opts = { threshold: 0.5 };
    const heroObs = new IntersectionObserver(([e]) => setHeroVisible(e.isIntersecting), opts);
    const footerObs = new IntersectionObserver(([e]) => setFooterVisible(e.isIntersecting), opts);
    if (heroRef.current) heroObs.observe(heroRef.current);
    if (footerRef.current) footerObs.observe(footerRef.current);
    return () => { heroObs.disconnect(); footerObs.disconnect(); };
  }, []);

  useEffect(() => {
    const update = () => {
      const current = new Date();
      setNow(current);
      const diff = COUNTDOWN_TARGET - current;
      if (diff <= 0) { setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 }); return; }
      setTimeLeft({
        days:    Math.floor(diff / 86400000),
        hours:   Math.floor((diff / 3600000) % 24),
        minutes: Math.floor((diff / 60000) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <main className="h-screen overflow-y-scroll" style={{ backgroundColor: "#f5efe0" }}>
      {/* Fixed background */}
      <img src={`${BASE}/bg.png`} alt=""
        className="fixed inset-0 w-full h-full object-cover"
        style={{ zIndex: 0 }} />

      {/* Fixed animals */}
      <img src={`${BASE}/ani-puloo-left.svg`} alt=""
        className="fixed hidden sm:block opacity-50 hover:opacity-100 transition-opacity duration-300"
        style={{ bottom: "6.2vh", left: "3.5vw", width: "25%", zIndex: 1 }} />
      <img src={`${BASE}/ani-puloo-right.svg`} alt=""
        className="fixed hidden sm:block opacity-50 hover:opacity-100 transition-opacity duration-300"
        style={{ top: "-2.5vh", left: "24.3vw", width: "17%", zIndex: 1 }} />
      <img src={`${BASE}/ani-chanee.svg`} alt=""
        className="fixed hidden md:block opacity-50 hover:opacity-100 transition-opacity duration-300"
        style={{ top: "22.2vh", right: "5.6vw", width: "16%", zIndex: 2 }} />
      <img src={`${BASE}/ani-chompoo.svg`} alt=""
        className="fixed hidden md:block opacity-50 hover:opacity-100 transition-opacity duration-300"
        style={{ bottom: "11.1vh", right: "6.25vw", width: "15%", zIndex: 1 }} />
      <img src={`${BASE}/ani-katarng-left.svg`} alt=""
        className="fixed hidden md:block opacity-50 hover:opacity-100 transition-opacity duration-300"
        style={{ top: "12.3vh", left: "6.25vw", width: "14%", zIndex: 1 }} />
      <img src={`${BASE}/ani-katarng-right.svg`} alt=""
        className="fixed hidden md:block opacity-50 hover:opacity-100 transition-opacity duration-300"
        style={{ top: "-18.5vh", right: "27.8vw", width: "10.5%", zIndex: 3 }} />
      <img src={`${BASE}/ani-bird.svg`} alt=""
        className="fixed hidden md:block opacity-50 hover:opacity-100 transition-opacity duration-300"
        style={{ top: "14.8vh", right: "20.8vw", width: "6%", zIndex: 1 }} />
      <img src={`${BASE}/ani-fern.svg`} alt=""
        className="fixed hidden sm:block opacity-50 hover:opacity-100 transition-opacity duration-300"
        style={{ bottom: "6.2vh", right: "27.8vw", width: "10%", zIndex: 2 }} />
      <img src={`${BASE}/ani-mushroom-1.svg`} alt=""
        className="fixed hidden sm:block opacity-50 hover:opacity-100 transition-opacity duration-300"
        style={{ bottom: "34.6vh", left: "3.5vw", width: "4%", zIndex: 1 }} />
      <img src={`${BASE}/ani-mushroom-1.svg`} alt=""
        className="fixed hidden sm:block opacity-50 hover:opacity-100 transition-opacity duration-300"
        style={{ bottom: "37vh", right: "5.6vw", width: "3%", zIndex: 1 }} />
      <img src={`${BASE}/ani-mushroom-2.svg`} alt=""
        className="fixed hidden sm:block opacity-50 hover:opacity-100 transition-opacity duration-300"
        style={{ bottom: "32.1vh", left: "6.25vw", width: "3%", zIndex: 1 }} />
      <img src={`${BASE}/ani-mushroom-2.svg`} alt=""
        className="fixed hidden sm:block opacity-50 hover:opacity-100 transition-opacity duration-300"
        style={{ bottom: "33.3vh", right: "4.2vw", width: "2%", zIndex: 1 }} />
      <img src={`${BASE}/ani-mushroom-2.svg`} alt=""
        className="fixed hidden sm:block opacity-50 hover:opacity-100 transition-opacity duration-300"
        style={{ top: "24.7vh", left: "17.4vw", width: "2.5%", zIndex: 1 }} />
      <img src={`${BASE}/ani-bigger-tree.svg`} alt=""
        className="fixed hidden md:block opacity-50 hover:opacity-100 transition-opacity duration-300"
        style={{ bottom: "9.9vh", left: "38%", width: "3%", zIndex: 1 }} />
      <img src={`${BASE}/ani-2-tree.svg`} alt=""
        className="fixed hidden md:block opacity-50 hover:opacity-100 transition-opacity duration-300"
        style={{ top: "24.7vh", left: "5.6vw", width: "3.5%", zIndex: 1 }} />
      <img src={`${BASE}/ani-lil-tree.svg`} alt=""
        className="fixed hidden md:block opacity-50 hover:opacity-100 transition-opacity duration-300"
        style={{ top: "42vh", right: "25vw", width: "2%", zIndex: 1 }} />

      <NavbarSimple bg="#e8dcc8" textColor="#1a3320" solid />

      {/* ─── HERO ─── */}
      <section
        ref={heroRef}
        className="relative w-full overflow-hidden"
        style={{ height: "100dvh" }}
      >

        {/* ── Center content ── */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-4 pointer-events-none">
          <img
            src={`${BASE}/Logo-Chula-Nan.svg`}
            alt="โครงการรักษ์ป่าน่าน สามพระราชดำริ"
            className="mb-3 md:mb-5 pointer-events-auto"
            style={{ width: "clamp(120px, 22vw, 280px)" }}
          />
          <img
            src={`${BASE}/Logo-dek-sarng-nan-2.svg`}
            alt="เด็กสร้างน่าน ปีที่ 2 ปลูกความคิดเพื่อชีวิตแห่งป่าน่าน"
            className="pointer-events-auto"
            style={{ height: "clamp(240px, 52vh, 520px)", width: "auto", maxWidth: "80vw" }}
          />
          <a
            href={FORM_URL}
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

      {/* ─── Countdown card — fixed right ─── */}
      <div
        className={`fixed z-20 hidden md:flex flex-col right-6 lg:right-16 rounded-3xl overflow-y-auto transition-opacity duration-300 ${heroVisible || footerVisible ? "opacity-0 pointer-events-none" : "opacity-100"}`}
        style={{
          top: "50%", transform: "translateY(-50%)",
          width: "320px",
          backgroundColor: "rgba(255,255,255,0.88)",
          backdropFilter: "blur(8px)",
          boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
          maxHeight: "88dvh",
          padding: "24px 20px",
        }}
      >
        <p className="text-center font-semibold text-lg mb-4" style={{ color: "#2d5a52" }}>
          เหลือเวลาในการสมัคร
        </p>
        <div className="flex gap-2 mb-4">
          {[
            { value: timeLeft.days,    label: "วัน",     border: "#4a7a8c" },
            { value: timeLeft.hours,   label: "ชั่วโมง", border: "#8a3a2a" },
            { value: timeLeft.minutes, label: "นาที",    border: "#8a3a2a" },
            { value: timeLeft.seconds, label: "วินาที",  border: "#8a3a2a" },
          ].map(({ value, label, border }) => (
            <div key={label} className="flex flex-col items-center rounded-xl py-2 flex-1"
              style={{ border: `2px solid ${border}` }}>
              <span className="text-2xl font-bold leading-none" style={{ color: border }}>
                {String(value).padStart(2, "0")}
              </span>
              <span className="text-[11px] mt-1" style={{ color: border }}>{label}</span>
            </div>
          ))}
        </div>
        <a href={FORM_URL} target="_blank" rel="noopener noreferrer"
          className="block text-center w-full py-3 rounded-full font-semibold mb-5 hover:opacity-90 transition-opacity text-sm"
          style={{ backgroundColor: "#1a3320", color: "#f5efe0" }}>
          สมัครเข้าร่วม Bootcamp
        </a>
        <div className="relative pl-6">
          {TIMELINE.map((item, i) => (
            <div key={i} className="relative mb-4 last:mb-0" style={{ opacity: item.milestone <= now ? 1 : 0.4 }}>
              <div className="absolute -left-[26px] top-0 w-5 h-5"
                style={{
                  backgroundColor: item.color,
                  WebkitMaskImage: `url(${BASE}/ani-bigger-tree.svg)`,
                  maskImage: `url(${BASE}/ani-bigger-tree.svg)`,
                  WebkitMaskSize: "contain", maskSize: "contain",
                  WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat",
                  WebkitMaskPosition: "center", maskPosition: "center",
                }}
              />
              <p className="text-sm font-semibold leading-tight" style={{ color: "#2d3a2d" }}>{item.label}</p>
              <p className="text-xs mt-0.5 whitespace-pre-line leading-relaxed" style={{ color: "#5a6a5a" }}>{item.date}</p>
              {item.action && (
                <a href={item.action.href} target="_blank" rel="noopener noreferrer"
                  className="inline-block mt-1.5 px-4 py-1 rounded-full text-white text-xs font-medium hover:opacity-80 transition-opacity"
                  style={{ backgroundColor: item.action.bg }}>{item.action.label}</a>
              )}
              {item.badge && (
                <span className="inline-block mt-1.5 px-4 py-1 rounded-full text-white text-xs font-medium"
                  style={{ backgroundColor: item.badge.bg }}>{item.badge.label}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ─── Mobile countdown — fixed bottom ─── */}
      {mobileExpanded && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          style={{ backgroundColor: "rgba(0,0,0,0.35)" }}
          onClick={() => setMobileExpanded(false)}
        />
      )}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 md:hidden transition-transform duration-300 ${heroVisible || footerVisible ? "translate-y-full" : "translate-y-0"}`}
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="rounded-t-3xl overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.96)", backdropFilter: "blur(12px)", boxShadow: "0 -8px 40px rgba(0,0,0,0.15)" }}>

          {/* Expanded sheet */}
          {mobileExpanded && (
            <div className="overflow-y-auto px-5 pt-3 pb-2" style={{ maxHeight: "70dvh" }}>
              <button onClick={() => setMobileExpanded(false)} className="flex justify-center w-full mb-3">
                <div className="w-10 h-1 rounded-full" style={{ backgroundColor: "#c8b8a8" }} />
              </button>
              <p className="text-center font-semibold text-base mb-3" style={{ color: "#2d5a52" }}>เหลือเวลาในการสมัคร</p>
              <div className="flex gap-2 mb-3">
                {[
                  { value: timeLeft.days,    label: "วัน",     border: "#4a7a8c" },
                  { value: timeLeft.hours,   label: "ชั่วโมง", border: "#8a3a2a" },
                  { value: timeLeft.minutes, label: "นาที",    border: "#8a3a2a" },
                  { value: timeLeft.seconds, label: "วินาที",  border: "#8a3a2a" },
                ].map(({ value, label, border }) => (
                  <div key={label} className="flex flex-col items-center rounded-xl py-2 flex-1" style={{ border: `2px solid ${border}` }}>
                    <span className="text-xl font-bold leading-none" style={{ color: border }}>{String(value).padStart(2, "0")}</span>
                    <span className="text-[10px] mt-0.5" style={{ color: border }}>{label}</span>
                  </div>
                ))}
              </div>
              <a href={FORM_URL} target="_blank" rel="noopener noreferrer"
                className="block text-center w-full py-2.5 rounded-full font-semibold mb-4 text-sm"
                style={{ backgroundColor: "#1a3320", color: "#f5efe0" }}>
                สมัครเข้าร่วม Bootcamp
              </a>
              <div className="relative pl-6">
                {TIMELINE.map((item, i) => (
                  <div key={i} className="relative mb-3 last:mb-0" style={{ opacity: item.milestone <= now ? 1 : 0.4 }}>
                    <div className="absolute -left-[22px] top-0 w-4 h-4" style={{
                      backgroundColor: item.color,
                      WebkitMaskImage: `url(${BASE}/ani-bigger-tree.svg)`,
                      maskImage: `url(${BASE}/ani-bigger-tree.svg)`,
                      WebkitMaskSize: "contain", maskSize: "contain",
                      WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat",
                      WebkitMaskPosition: "center", maskPosition: "center",
                    }} />
                    <p className="text-sm font-semibold leading-tight" style={{ color: "#2d3a2d" }}>{item.label}</p>
                    <p className="text-xs mt-0.5 whitespace-pre-line leading-relaxed" style={{ color: "#5a6a5a" }}>{item.date}</p>
                    {item.action && (
                      <a href={item.action.href} target="_blank" rel="noopener noreferrer"
                        className="inline-block mt-1 px-3 py-0.5 rounded-full text-white text-xs font-medium"
                        style={{ backgroundColor: item.action.bg }}>{item.action.label}</a>
                    )}
                    {item.badge && (
                      <span className="inline-block mt-1 px-3 py-0.5 rounded-full text-white text-xs font-medium"
                        style={{ backgroundColor: item.badge.bg }}>{item.badge.label}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Compact bar */}
          <div
            className="flex items-center gap-3 px-4 py-3 cursor-pointer"
            onClick={() => setMobileExpanded(v => !v)}
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="shrink-0">
                <span className="text-2xl font-bold" style={{ color: "#4a7a8c" }}>{String(timeLeft.days).padStart(2, "0")}</span>
                <span className="text-xs ml-1" style={{ color: "#4a7a8c" }}>วัน</span>
              </div>
              <span className="text-sm" style={{ color: "#d0c4b4" }}>|</span>
              <span className="font-mono font-bold text-lg" style={{ color: "#8a3a2a" }}>
                {String(timeLeft.hours).padStart(2, "0")}:{String(timeLeft.minutes).padStart(2, "0")}:{String(timeLeft.seconds).padStart(2, "0")}
              </span>
            </div>
            <a
              href={FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="shrink-0 px-4 py-2 rounded-full text-xs font-semibold hover:opacity-80 transition-opacity"
              style={{ backgroundColor: "#1a3320", color: "#f5efe0" }}
            >
              สมัคร
            </a>
            <svg
              className={`shrink-0 w-5 h-5 transition-transform duration-200 ${mobileExpanded ? "rotate-180" : ""}`}
              style={{ color: "#7a8a7a" }}
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </div>
        </div>
      </div>

      {/* ─── SECTION 2 — วัตถุประสงค์ ─── */}
      <section
        className="relative flex items-center px-6 md:px-16 lg:px-24"
        style={{ height: "100dvh" }}
      >
        <div className="relative z-10 max-w-[560px]">
          {/* Title */}
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1.5 rounded-full self-stretch" style={{ backgroundColor: "#254821" }} />
            <h1 className="font-bold text-4xl md:text-5xl leading-tight" style={{ color: "#254821" }}>
              เด็กสร้างน่าน ปี 2
            </h1>
          </div>
          <p className="text-lg font-medium mb-7 pl-5" style={{ color: "#2d3a2d" }}>
            Theme : ปลูกความคิด เพื่อชีวิตแห่งป่าน่าน
          </p>

          {/* วัตถุประสงค์ */}
          <p className="font-semibold text-xl mb-3" style={{ color: "#235c80" }}>
            วัตถุประสงค์โครงการ
          </p>
          <ol className="flex flex-col gap-4 list-none">
            {[
              "เพื่อส่งเสริมให้เยาวชนได้สำรวจ ศึกษา และทำความเข้าใจสิ่งมีชีวิตในระบบนิเวศป่าน่าน ผ่านกระบวนการเรียนรู้เชิงบูรณาการที่เชื่อมโยงความรู้ด้านวิทยาศาสตร์ ระบบนิเวศ และบริบทท้องถิ่น พร้อมทั้งรวบรวม และจัดทำฐานข้อมูลของสิ่งมีชีวิตที่เยาวชนเลือกศึกษา",
              "เพื่อพัฒนาทักษะการสื่อสาร และการถ่ายทอดองค์ความรู้ของเยาวชนผ่านรูปแบบสร้างสรรค์และหลากหลาย อาทิ การนำเสนอเชิงวิชาการ (Species Pitch) การออกแบบเชิงศิลปะ (Species-Design) การผลิตสื่อคลิปสำรวจระบบนิเวศ (Storytelling) ของสิ่งมีชีวิตในป่าน่าน เพื่อสะท้อนคุณค่าและอัตลักษณ์ของทรัพยากรธรรมชาติในพื้นที่",
            ].map((t, i) => (
              <li key={i} className="flex items-start gap-3 text-base leading-relaxed" style={{ color: "#2d3a2d" }}>
                <span className="font-bold shrink-0 text-lg" style={{ color: "#235c80" }}>{i + 1}.</span>
                {t}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ─── SECTION 3 — คุณสมบัติ + รายละเอียด ─── */}
      <section
        className="relative flex items-center px-6 md:px-16 lg:px-24"
        style={{ height: "100dvh" }}
      >
        <div className="relative z-10 hidden md:flex flex-col gap-6 max-w-[480px]">
          <div>
            <p className="font-semibold text-xl mb-3" style={{ color: "#235c80" }}>👥 คุณสมบัติผู้สมัคร</p>
            <ul className="flex flex-col gap-2.5">
              {["น้อง ๆ อายุ 15–18 ปี", "กำลังศึกษาอยู่ในจังหวัดน่าน", "สมัครเป็นทีม ทีมละ 3 คน (ต่างโรงเรียนได้)"].map((t, i) => (
                <li key={i} className="flex items-start gap-2.5 text-base" style={{ color: "#2d3a2d" }}>
                  <span className="mt-2 w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: "#235c80" }} />{t}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-semibold text-xl mb-3" style={{ color: "#90261d" }}>📌 รายละเอียดการรับสมัคร</p>
            <ul className="flex flex-col gap-3">
              {[
                <>ต้องแนบใบ Certificate จาก Chula MOOC (สามารถเข้าเรียนวิชา "ผู้พิทักษ์ป่าต้นน้ำ" บน Chula MOOC ได้ที่{" "}<a href="https://mooc.chula.ac.th/course-detail/157" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "#235c80" }}>ลิงค์นี้</a>)</>,
                "อย่างน้อย 1 คนที่ได้รับ Certificate จาก Chula MOOC (หากเรียนครบ 3 คน จะได้คะแนนเพิ่ม)",
                "ตอบคำถามการรับสมัครให้ครบถ้วน",
              ].map((t, i) => (
                <li key={i} className="flex items-start gap-2.5 text-base" style={{ color: "#2d3a2d" }}>
                  <span className="mt-2 w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: "#90261d" }} />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ─── SECTION 4 — ขั้นตอนสมัคร CUmooc ─── */}
      <section
        className="relative flex items-start px-6 md:px-16 lg:px-24 py-24"
        style={{ minHeight: "100dvh" }}
      >
        <div className="relative z-10 w-full max-w-[620px] flex flex-col gap-6 pr-2">

          {/* Header */}
          <div>
            <p className="text-xs tracking-widest uppercase font-semibold mb-1" style={{ color: "#235c80" }}>วิธีรับ Certificate</p>
            <h2 className="font-bold text-3xl md:text-4xl leading-tight" style={{ color: "#254821" }}>
              ขั้นตอนการสมัคร<br />Chula MOOC
            </h2>
          </div>

          {/* Step 1 */}
          <div className="flex gap-4">
            <div className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-sm" style={{ backgroundColor: "#235c80" }}>1</div>
            <div className="flex flex-col gap-3 flex-1">
              <p className="font-semibold text-base leading-snug" style={{ color: "#2d3a2d" }}>ลงทะเบียนเรียนสำหรับบุคคลทั่วไป</p>
              <a
                href="https://mooc.chula.ac.th/course-detail/157"
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium hover:opacity-80 transition-opacity self-start"
                style={{ backgroundColor: "#90261d", color: "#fff" }}
              >
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                mooc.chula.ac.th/course-detail/157
              </a>
              <img src={`${BASE}/image.png`} alt="CU MOOC registration" className="w-full rounded-xl object-contain shadow-md border border-white/30" />
            </div>
          </div>

          {/* Divider */}
          <div className="h-px" style={{ backgroundColor: "#c8b8a8" }} />

          {/* Step 2 */}
          <div className="flex gap-4">
            <div className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-sm" style={{ backgroundColor: "#235c80" }}>2</div>
            <div className="flex gap-4 flex-1">
              <div className="flex flex-col gap-3 flex-1">
                <div>
                  <p className="font-semibold text-base" style={{ color: "#2d3a2d" }}>Log in เพื่อเข้าเรียน</p>
                  <p className="text-sm mt-0.5" style={{ color: "#5a6a5a" }}>วิชา "ผู้พิทักษ์ป่าต้นน้ำ" ได้ 2 ช่องทาง</p>
                </div>
                <div className="flex gap-3">
                  <div className="flex flex-col items-center gap-1.5">
                    <img src={`${BASE}/facebook.png`} alt="Facebook login" className="h-56 w-auto rounded-xl object-contain shadow-md border border-white/30" />
                    <span className="text-xs font-medium" style={{ color: "#5a6a5a" }}>Facebook</span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5">
                    <img src={`${BASE}/cu_mooc.PNG`} alt="myCourseVille login" className="h-56 w-auto rounded-xl object-contain shadow-md border border-white/30" />
                    <span className="text-xs font-medium" style={{ color: "#5a6a5a" }}>myCourseVille</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px" style={{ backgroundColor: "#c8b8a8" }} />

          {/* Step 3 */}
          <div className="flex gap-4">
            <div className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-sm" style={{ backgroundColor: "#235c80" }}>3</div>
            <div className="flex flex-col gap-1.5 flex-1">
              <p className="font-semibold text-base leading-snug" style={{ color: "#2d3a2d" }}>
                ทำแบบทดสอบก่อนเรียน เข้าเรียนให้ครบ<br />และทำแบบทดสอบหลังเรียน
              </p>
              <p className="text-sm" style={{ color: "#5a6a5a" }}>ครบทุกบทเรียนใน Learning Path</p>
            </div>
          </div>

          {/* Note */}
          <div className="px-5 py-3.5 rounded-2xl border text-sm leading-relaxed" style={{ borderColor: "#90261d", color: "#90261d", backgroundColor: "rgba(144,38,29,0.06)" }}>
            ทำคะแนน Quiz และ Posttest ให้ได้ร้อยละ 60 ขึ้นไป จึงจะสามารถขอรับใบประกาศนียบัตรได้
          </div>

        </div>
      </section>

      <section ref={footerRef} className="relative z-10">
        <FooterSection />
      </section>
    </main>
  );
}
