"use client";
import TranslateIcon from "@/components/TranslateIcon";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import IconHamburger from "./IconHamburger";
import IconClose from "./IconClose";
import SocialMediaPackHorizon from "./SocialMediaPackHorizon";
import { useLang } from "@/lib/LanguageContext";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [showLogo, setShowLogo] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [session, setSession] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { t, toggleLang, lang } = useLang();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollEl = document.querySelector("main");
      const scrollY = scrollEl ? scrollEl.scrollTop : window.scrollY;
      setShowLogo(scrollY > 350);
    };
    const scrollEl = document.querySelector("main") ?? window;
    scrollEl.addEventListener("scroll", handleScroll);
    return () => scrollEl.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`w-full h-[85px] fixed top-0 left-0 z-[60] transition-colors duration-500 ${
  showLogo || isMenuOpen ? "bg-[#002740]/80 backdrop-blur-md" : "bg-transparent"
}`}>
      
      {/* --- ส่วนที่ 1: Header (Logo + Icons) --- */}
      {/* ใส่ z-[60] เพื่อให้ลอยเหนือ Overlay และใส่พื้นหลังเมื่อ Scroll หรือเปิดเมนู */}
      <div className="max-w-7xl mx-auto p-6 flex justify-between items-center">
     
        
        {/* Logo Section: โชว์เมื่อ scroll ถึงระยะ หรือ เมื่อเปิดเมนู */}
        <div className={`z-[60] transition-all duration-1000 transform ${
          showLogo || isMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"
        }`}>
          <a href="/"><Image src="/full-logo-me.svg" alt="Mission Earth Logo" width={120} height={37} className="object-contain" /></a>
        </div>

        {/* Desktop Menu (แสดงเฉพาะจอใหญ่) */}
        <div className="hidden md:flex items-center space-x-8 text-sm tracking-widest font-light text-gray-300">
          <a href="/" className="hover:text-[#CEA870] transition-colors">{t("navbar.home")}</a>
          <a href="/about" className="hover:text-[#CEA870] transition-colors">{t("navbar.about")}</a>
          <a href="/services" className="hover:text-[#CEA870] transition-colors">{t("navbar.services")}</a>
          <a href="/portfolio" className="hover:text-[#CEA870] transition-colors">{t("navbar.portfolio")}</a>
          <a href="/contact" className="hover:text-[#CEA870] transition-colors">{t("navbar.contact")}</a>
          <div className="group flex items-center gap-2">
            <button onClick={toggleLang} className="flex items-center gap-1">
              <TranslateIcon className="w-7 h-7 text-[#CEA870] group-hover:text-white transition-all duration-300" />
              <span className="text-xs text-[#CEA870] group-hover:text-white transition-colors">{lang === "en" ? "TH" : "EN"}</span>
            </button>
          </div>
          
          {session ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-9 h-9 rounded-full bg-[#CEA870]/20 border border-[#CEA870]/40 flex items-center justify-center hover:bg-[#CEA870]/30 transition-all"
              >
                <span className="text-[#CEA870] text-sm font-semibold">A</span>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#002740] border border-white/10 rounded-2xl shadow-xl overflow-hidden">
                  <a href="/admin" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-[#CEA870] transition-colors" onClick={() => setDropdownOpen(false)}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    Admin Management
                  </a>
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-red-400 transition-colors border-t border-white/5">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <a href="/login" className="border border-[#CEA870] px-6 py-2 rounded-full text-[#CEA870] hover:bg-[#CEA870] hover:text-[#002740] transition-all duration-300 font-medium text-sm">
              Login
            </a>
          )}
        </div>
        
        {/* Mobile Button: ใส่ z-[100] และแยกออกมาให้ชัดเจน */}
        <div className="md:hidden flex items-center">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className="text-[#CEA870] focus:outline-none p-2 active:scale-90 transition-transform relative z-[100]"
          >
            {isMenuOpen ? <IconClose size={32} /> : <IconHamburger size={32} />}
          </button>
        </div>
      </div>

      {/* --- ส่วนที่ 2: Mobile Menu Overlay (แผ่นเต็มจอ) --- */}
      {/* ใช้ z-[40] เพื่อให้อยู่ใต้ Header */}
      <div className={`md:hidden fixed inset-0 w-full h-screen bg-[#002740] z-[40] transition-all duration-500 flex flex-col ${
        isMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      }`}>
        <div className="flex flex-col items-center justify-center h-full space-y-8 text-center tracking-widest">
          <a href="/" className="text-2xl text-gray-300" onClick={() => setIsMenuOpen(false)}>{t("navbar.home")}</a>
          <a href="/about" className="text-2xl text-gray-300" onClick={() => setIsMenuOpen(false)}>{t("navbar.about")}</a>
          <a href="/services" className="text-2xl text-gray-300" onClick={() => setIsMenuOpen(false)}>{t("navbar.services")}</a>
          <a href="/portfolio" className="text-2xl text-gray-300" onClick={() => setIsMenuOpen(false)}>{t("navbar.portfolio")}</a>
          <a href="/contact" className="text-2xl text-gray-300" onClick={() => setIsMenuOpen(false)}>{t("navbar.contact")}</a>
          <SocialMediaPackHorizon />
          <div className="pt-8 border-t border-white/10 w-4/5 flex flex-col items-center gap-8">
            <button onClick={toggleLang} className="flex items-center gap-2">
              <TranslateIcon className="w-10 h-10 text-[#CEA870]" />
              <span className="text-[#CEA870] text-lg">{lang === "en" ? "ภาษาไทย" : "English"}</span>
            </button>
            {session ? (
              <>
                <a href="/admin" className="w-full max-w-xs border border-[#CEA870] py-4 rounded-full text-[#CEA870] text-lg font-medium text-center hover:bg-[#CEA870] hover:text-[#002740] transition-all duration-300" onClick={() => setIsMenuOpen(false)}>
                  Admin Management
                </a>
                <button onClick={handleLogout} className="text-gray-500 text-sm hover:text-red-400 transition-colors">
                  Log out
                </button>
              </>
            ) : (
              <a href="/login" className="w-full max-w-xs border border-[#CEA870] py-4 rounded-full text-[#CEA870] text-lg font-medium text-center hover:bg-[#CEA870] hover:text-[#002740] transition-all duration-300" onClick={() => setIsMenuOpen(false)}>
                Login
              </a>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}