"use client";
import { useState, useEffect, useRef } from "react";
import TranslateIcon from "@/components/TranslateIcon";
import Image from "next/image";
import IconHamburger from "@/components/IconHamburger";
import IconClose from "@/components/IconClose";
import SocialMediaPackHorizon from "@/components/SocialMediaPackHorizon";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const DEFAULT_LINKS = [
  { href: "/", label: "Home", hoverColor: "#CEA870" },
  { href: "/about", label: "About Us", hoverColor: "#CEA870" },
  { href: "/services", label: "Services", hoverColor: "#CEA870" },
  { href: "/portfolio", label: "Portfolio", hoverColor: "#CEA870" },
  { href: "/contact", label: "Contact Us", hoverColor: "#CEA870" },
];

function NavLink({ href, label, hoverColor, textColor }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={href}
      style={{ color: hovered ? hoverColor : textColor, transition: "color 0.2s" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {label}
    </a>
  );
}

export default function NavbarSimple({ bg = "#002740", textColor = "#d1d5db", navLinks = DEFAULT_LINKS, solid = false }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [session, setSession] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <nav className="w-full h-[85px] fixed top-0 left-0 z-[60] backdrop-blur-md transition-colors duration-500" style={{ backgroundColor: solid ? bg : `${bg}e6` }}>

      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 h-full flex justify-between items-center">

        {/* Logo */}
        <a href="/"><Image src="/full-logo-me.svg" alt="Mission Earth Logo" width={120} height={37} className="object-contain" /></a>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center space-x-8 text-sm tracking-widest font-light" style={{ color: textColor }}>
          {navLinks.map((link) => (
            <NavLink key={link.href} {...link} textColor={textColor} />
          ))}
          <div className="group flex items-center gap-2">
            <a href="#"><TranslateIcon className="w-7 h-7 text-[#CEA870] group-hover:text-white transition-all duration-300" /></a>
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
                  <a
                    href="/admin"
                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-[#CEA870] transition-colors"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Admin Management
                  </a>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-red-400 transition-colors border-t border-white/5"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
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
          <a href="/"          className="text-2xl text-gray-300" onClick={() => setIsMenuOpen(false)}>Home</a>
          <a href="/about"     className="text-2xl text-gray-300" onClick={() => setIsMenuOpen(false)}>About Us</a>
          <a href="/services"  className="text-2xl text-gray-300" onClick={() => setIsMenuOpen(false)}>Services</a>
          <a href="/portfolio" className="text-2xl text-gray-300" onClick={() => setIsMenuOpen(false)}>Portfolio</a>
          <a href="/contact"   className="text-2xl text-gray-300" onClick={() => setIsMenuOpen(false)}>Contact Us</a>
          <SocialMediaPackHorizon />
          <div className="pt-8 border-t border-white/10 w-4/5 flex flex-col items-center gap-4">
            <TranslateIcon className="w-10 h-10 text-[#CEA870]" />
            {session ? (
              <>
                <a href="/admin" className="w-full max-w-xs border border-[#CEA870] py-4 rounded-full text-[#CEA870] text-lg font-medium text-center hover:bg-[#CEA870] hover:text-[#002740] transition-all duration-300">
                  Admin Management
                </a>
                <button onClick={handleLogout} className="text-gray-500 text-sm hover:text-red-400 transition-colors">
                  Log out
                </button>
              </>
            ) : (
              <a href="/login" className="w-full max-w-xs border border-[#CEA870] py-4 rounded-full text-[#CEA870] text-lg font-medium text-center hover:bg-[#CEA870] hover:text-[#002740] transition-all duration-300">
                Login
              </a>
            )}
          </div>
        </div>
      </div>

    </nav>
  );
}
