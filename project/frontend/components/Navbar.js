"use client";
import TranslateIcon from "@/components/TranslateIcon";
import { useState, useEffect } from "react";
import Image from "next/image";
import IconHamburger from "./IconHamburger";
import IconClose from "./IconClose";
import SocialMediaPackHorizon from "./SocialMediaPackHorizon";

export default function Navbar() {
  const [showLogo, setShowLogo] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
          <Image src="/full-logo-me.svg" alt="Mission Earth Logo" width={120} height={37} className="object-contain" />
        </div>

        {/* Desktop Menu (แสดงเฉพาะจอใหญ่) */}
        <div className="hidden md:flex items-center space-x-8 text-sm tracking-widest font-light text-gray-300">
          <a href="" className="hover:text-[#CEA870] transition-colors">Home</a>
          <a href="about" className="hover:text-[#CEA870] transition-colors">About Us</a>
          <a href="#" className="hover:text-[#CEA870] transition-colors">Services</a>
          <a href="#" className="hover:text-[#CEA870] transition-colors">Projects</a>
          <a href="#" className="hover:text-[#CEA870] transition-colors">Contact Us</a>
          <div className="group flex items-center gap-2">
            <a href="#"><TranslateIcon className="w-7 h-7 text-[#CEA870] group-hover:text-white transition-all duration-300" /></a>
          </div>
          
          {/* --- <a href="#" className="border border-[#CEA870] px-6 py-2 rounded-full text-[#CEA870] hover:bg-[#CEA870] hover:text-[#002740] transition-all duration-300 font-medium">
            Login
          </a> --- */}
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
          <a href="#" className="text-2xl text-gray-300" onClick={() => setIsMenuOpen(false)}>Home</a>
          <a href="#" className="text-2xl text-gray-300" onClick={() => setIsMenuOpen(false)}>About Us</a>
          <a href="#" className="text-2xl text-gray-300" onClick={() => setIsMenuOpen(false)}>Service</a>
          <a href="#" className="text-2xl text-gray-300" onClick={() => setIsMenuOpen(false)}>Projects</a>
          <a href="#" className="text-2xl text-gray-300" onClick={() => setIsMenuOpen(false)}>Contact Us</a>
          <SocialMediaPackHorizon />
          <div className="pt-8 border-t border-white/10 w-4/5 flex flex-col items-center gap-8">
            <TranslateIcon className="w-10 h-10 text-[#CEA870]" />
            {/* --- <a href="#" className="w-full max-w-xs border border-[#CEA870] py-4 rounded-full text-[#CEA870] text-lg font-medium">
              Login
            </a> --- */}
            
          </div>
        </div>
      </div>
    </nav>
  );
}