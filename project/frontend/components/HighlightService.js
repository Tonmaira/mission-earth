"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useLang } from "@/lib/LanguageContext";

const HREFS = [
  "/services?cat=Sustainable Travel&tag=อาบป่า (Forest Bathing / Shinrin-yoku Experience)#slide-services",
  "/services?cat=Course&tag=Training#slide-services",
  "/services?cat=ESG Tools&tag=Board Game และ Games for Change#slide-services",
];

const IMAGES = [
  "/image/services/10-sustaintravel-forest.jpg",
  "/image/services/2-service-training.jpg",
  "/image/services/21-boardgame.jpg",
];

export default function HighlightService() {
  const [activeIndex, setActiveIndex] = useState(0);
  const { t } = useLang();

  const items = [0, 1, 2].map((i) => ({
    id: i + 1,
    image: IMAGES[i],
    tag: t(`home.highlight.items.${i}.tag`),
    title: t(`home.highlight.items.${i}.title`),
    desc: t(`home.highlight.items.${i}.desc`),
    button: t(`home.highlight.items.${i}.button`),
    href: HREFS[i],
  }));

  const nextSlide = () => setActiveIndex((prev) => (prev + 1) % items.length);
  const prevSlide = () => setActiveIndex((prev) => (prev - 1 + items.length) % items.length);

  return (
    <section className="relative w-full h-full pt-[85px] bg-[#002740] overflow-hidden flex flex-col items-center">

      {/* 1. Header Section */}
      <div className="relative w-full flex-[2] md:flex-[3] min-h-0 max-w-flex mx-auto overflow-hidden flex items-end justify-center pb-4 md:pb-10 mb-2">
        <div className="absolute top-0 bottom-0 w-full h-20 bg-gradient-to-b from-[#002740] to-transparent z-10 pointer-events-none" />

                    <Image
                      src="/DSC07451.jpg"
                      alt="Mission Earth Background"
                      fill
                      className="object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-[#002740]/90 z-10" />
      <div className="relative z-20 text-center px-8 md:px-6 max-w-4xl">
        <h4 className="text-[#CEA870] text-xs md:text-sm tracking-[0.4em] uppercase mb-1 md:mb-4 font-medium">{t("home.highlight.label")}</h4>
        <h2 className="text-[#CEA870] text-[24px] md:text-5xl font-semibold italic tracking-wider uppercase mb-2 md:mb-4">
          {t("home.highlight.title")}
        </h2>
        <p className="text-gray-300 font-light leading-relaxed hidden md:block text-[16px] opacity-90 mb-6">
          {t("home.highlight.desc")}
        </p>
        <p className="md:hidden text-gray-300 font-light leading-relaxed text-[13px] opacity-90 mb-4">
          {t("home.highlight.desc")}
        </p>
        <a href="/services" className="border border-[#CEA870] text-[#CEA870] px-8 py-3 rounded-full hover:bg-[#CEA870] hover:text-white transition-all duration-500 uppercase tracking-widest text-xs font-semibold">
          {t("home.highlight.more")}
        </a>
        </div>

      </div>

      {/* 2. Banner Slider */}
      <div className="relative w-full flex justify-center items-center flex-[2] md:flex-[4] min-h-0">
        <div className="relative w-full h-full flex items-center justify-center">
          {items.map((item, index) => {
            const isActive = index === activeIndex;

            let offset = index - activeIndex;
            const total = items.length;

            if (offset > total / 2) offset -= total;
            if (offset < -total / 2) offset += total;

            const isJumping = Math.abs(offset) > 1;

            return (
              <motion.div
                key={item.id}
                initial={false}
                animate={{
                  x: `${offset * 101}%`,
                  scale: isActive ? 1 : 1,
                  opacity: isJumping ? 0 : (isActive ? 1 : 0.3),
                  filter: isActive ? "blur(0px)" : "blur(0px)",
                  zIndex: isActive ? 30 : 10,
                }}
                transition={{
                duration: isJumping ? 0 : 0.1,
                ease: [0.2, 0, 0.1, 1]
                }}
                style={{
                display: Math.abs(offset) > 1 ? 'none' : 'block'
                }}
                className="absolute w-[85vw] md:w-[900px] h-full rounded-[10px] overflow-hidden shadow-2xl"
                >

                <img src={item.image} className="w-full h-full object-cover" alt={item.title} />
                <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-700 ${isActive ? 'opacity-100' : 'opacity-0'}`} />

                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute inset-0 flex flex-col justify-end p-10 md:p-8 text-white"
                  >
                    <p className="text-[#CEA870]/80 text-[12px] md:text-[18px] font-semibold tracking-widest mb-0.5">{item.tag}</p>
                    <h3 className="text-[20px] md:text-[24px] font-semibold uppercase italic mb-0.5">{item.title}</h3>
                    <p className="text-gray-200 text-[12px] md:text-[16px] font-light max-w-xl mb-2 leading-relaxed">
                      {item.desc}
                    </p>
                    <a href={item.href} className="w-fit border border-[#CEA870]/50 text-[#CEA870] px-6 py-2 rounded-full text-xs font-semibold hover:bg-[#CEA870] hover:text-[#002740] transition-all">
                      {item.button}
                    </a>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* 3. Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 md:left-[78px] z-[50] p-4 rounded-full border border-[#CEA870]/20 text-[#CEA870] opacity-80 hover:opacity-100 hover:bg-[#CEA870]/10 transition-all duration-300"
        >
          <ChevronLeft size={40} strokeWidth={2} />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 md:right-[78px] z-[50] p-4 rounded-full border border-[#CEA870]/20 text-[#CEA870] opacity-80 hover:opacity-100 hover:bg-[#CEA870]/10 transition-all duration-300"
        >
          <ChevronRight size={40} strokeWidth={2} />
        </button>
      </div>

      {/* 4. Indicators */}
      <div className="flex justify-center gap-3 mt-2 mb-2 flex-shrink-0">
        {items.map((_, i) => (
          <div
            key={i}
            className={`h-2 transition-all duration-500 rounded-full ${i === activeIndex ? "w-12 bg-[#CEA870]" : "w-2 bg-gray-700"}`}
          />
        ))}
      </div>
    </section>
  );
}
