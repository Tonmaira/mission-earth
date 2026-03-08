"use client";
import { useState } from "react";
import TranslateIcon from "@/components/TranslateIcon";
import Image from "next/image";
import IconHamburger from "@/components/IconHamburger";
import IconClose from "@/components/IconClose";
import SocialMediaPackHorizon from "@/components/SocialMediaPackHorizon";

export default function NavbarSimple() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className={`w-full h-[85px] fixed top-0 left-0 z-[60] bg-[#002740]/80 backdrop-blur-md transition-colors duration-500`}>

      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 h-full flex justify-between items-center">

        {/* Logo */}
        <Image src="/full-logo-me.svg" alt="Mission Earth Logo" width={120} height={37} className="object-contain" />

        {/* Desktop menu */}
        <div className="hidden md:flex items-center space-x-8 text-sm tracking-widest font-light text-gray-300">
          <a href="/" className="hover:text-[#CEA870] transition-colors">Home</a>
          <a href="/about" className="hover:text-[#CEA870] transition-colors">About Us</a>
          <a href="#" className="hover:text-[#CEA870] transition-colors">Services</a>
          <a href="#" className="hover:text-[#CEA870] transition-colors">Projects</a>
          <a href="#" className="hover:text-[#CEA870] transition-colors">Contact Us</a>
          <div className="group flex items-center gap-2">
            <a href="#"><TranslateIcon className="w-7 h-7 text-[#CEA870] group-hover:text-white transition-all duration-300" /></a>
          </div>
        </div>

        {/* Mobile hamburger */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-[#CEA870] focus:outline-none p-2 active:scale-90 transition-transform relative z-[100]"
          >
            {isMenuOpen ? <IconClose size={32} /> : <IconHamburger size={32} />}
          </button>
        </div>
      </div>

      {/* Mobile menu overlay */}
      <div className={`md:hidden fixed inset-0 w-full h-screen bg-[#002740] z-[40] transition-all duration-500 flex flex-col ${
        isMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      }`}>
        <div className="flex flex-col items-center justify-center h-full space-y-8 text-center tracking-widest">
          <a href="/"       className="text-2xl text-gray-300" onClick={() => setIsMenuOpen(false)}>Home</a>
          <a href="/about"  className="text-2xl text-gray-300" onClick={() => setIsMenuOpen(false)}>About Us</a>
          <a href="#"       className="text-2xl text-gray-300" onClick={() => setIsMenuOpen(false)}>Services</a>
          <a href="#"       className="text-2xl text-gray-300" onClick={() => setIsMenuOpen(false)}>Projects</a>
          <a href="#"       className="text-2xl text-gray-300" onClick={() => setIsMenuOpen(false)}>Contact Us</a>
          <SocialMediaPackHorizon />
          <div className="pt-8 border-t border-white/10 w-4/5 flex flex-col items-center gap-8">
            <TranslateIcon className="w-10 h-10 text-[#CEA870]" />
          </div>
        </div>
      </div>

    </nav>
  );
}
