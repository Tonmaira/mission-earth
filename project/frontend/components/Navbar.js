"use client";
import TranslateIcon from "@/components/TranslateIcon";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function Navbar() {
  const [showLogo, setShowLogo] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // ลองปรับเลข 300-500 ตามความสูงของโลโก้กลางจอคุณนะครับ
      if (window.scrollY > 350) {
        setShowLogo(true);
      } else {
        setShowLogo(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#002740]/80 backdrop-blur-md transition-all duration-500">
      <div className="flex justify-between items-center p-6 max-w-7xl mx-auto">
        
        {/* จุดสำคัญ: ต้องมี transition-opacity ถึงจะค่อยๆ Fade ครับ */}
        <div className={`transition-all duration-1000 transform ${showLogo ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"}`}>
          <Image 
            src="/full-logo-me.svg" 
            alt="Mission Earth Logo" 
            width={120} 
            height={37} 
            className="object-contain" 
          />
        </div>

        <div className="flex items-center space-x-8 text-sm tracking-widest text-gray-300">
          <a href="#" className="hover:text-[#CEA870] transition-colors">Home</a>
          <a href="#" className="hover:text-[#CEA870] transition-colors">About Us</a>
          <a href="#" className="hover:text-[#CEA870] transition-colors">Service</a>
          <div className="group flex items-center gap-2">
                 <a href="#"><TranslateIcon className="w-7 h-7 text-[#CEA870] group-hover:text-white transition-all duration-300" /></a>
          </div>
          <a href="#" className="border border-[#CEA870] px-6 py-2 rounded-full text-[#CEA870] hover:bg-[#CEA870] hover:text-[#002740] transition-all duration-300 font-medium">
            Login
          </a>
        </div>
      </div>
    </nav>
  );
}