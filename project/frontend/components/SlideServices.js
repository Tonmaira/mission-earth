"use client";
import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from 'next/image';
import ServicePopup from '@/components/ServicePopup';
import { allTags, ServicesCard } from '@/components/ServiceData';


export default function SlideServices() {
  // --- 1. ประกาศตัวแปร Mobile
    const scrollRef = useRef(null);
    const [activeSlideIndex, setActiveSlideIndex] = useState(0);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [popupView, setPopupView] = useState('categories');
    const [selectedCatIdx, setSelectedCatIdx] = useState(null);
    const [expandedCat, setExpandedCat] = useState(null);
  // --- 1. ประกาศตัวแปร Desktop
    const [currentSlide, setCurrentSlide] = useState(0);
    const [activeTagIndex, setActiveTagIndex] = useState(0);
    const searchParams = useSearchParams();


    const allTags = ServicesCard.flatMap((cat, catIdx) => 
        cat.tags.map((tag, tagIdx) => ({ // เพิ่ม tagIdx ตรงนี้
        ...tag,
        categoryTitle: cat.title,
        categoryDesc: cat.desc,
        categoryIndex: catIdx,
        tagIndex: tagIdx // เก็บลำดับ Tag ภายในหมวดไว้ใช้งาน
    }))
    );

    useEffect(() => {
      const cat = searchParams.get("cat");
      if (!cat) return;
      const catIdx = ServicesCard.findIndex(c => c.title.toLowerCase() === cat.toLowerCase());
      if (catIdx !== -1) {
        setTimeout(() => scrollToCategory(catIdx), 300);
        setCurrentSlide(catIdx);
      }
    }, [searchParams]);

    const scrollToSpecificTag = (catIdx, tagName) => {
        const targetIndex = allTags.findIndex(
            tag => tag.categoryIndex === catIdx && tag.name === tagName
            );
    
        if (targetIndex !== -1 && scrollRef.current) {
        // 0.85 คือสัดส่วน w-[84vw] ของการ์ด และ 20 คือช่องว่าง gap-5
        const cardWidth = scrollRef.current.offsetWidth * 0.85; 
        scrollRef.current.scrollTo({
        left: targetIndex * (cardWidth + 20), 
        behavior: 'smooth'
        });
        setIsPopupOpen(false); 
        }
    };

  
  // --- 3. ฟังก์ชันคำนวณตำแหน่งตอนปัดนิ้ว (Mobile) ---
    const handleScroll = (e) => {
    const scrollLeft = e.target.scrollLeft;
    const containerWidth = e.target.offsetWidth;
    const index = Math.round(scrollLeft / (containerWidth * 0.85)); 
        if (index >= 0 && index < allTags.length) {
        setActiveSlideIndex(index);
        }
    };

    const scrollToCategory = (catIdx) => {
        const targetIndex = allTags.findIndex(tag => tag.categoryIndex === catIdx);
    
        if (targetIndex !== -1 && scrollRef.current) {
        // คำนวณความกว้าง: กล่อง (84vw) + ช่องว่าง (gap-5 คือ 20px)
        const cardWidth = scrollRef.current.offsetWidth * 0.85; 
        scrollRef.current.scrollTo({
        left: targetIndex * (cardWidth + 20), 
        behavior: 'smooth'
        });
        setIsPopupOpen(false); 
        }
    };
  
    const changeSlide = (index) => {
        setCurrentSlide(index);
        setActiveTagIndex(0);
    };
    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % ServicesCard.length);
        setActiveTagIndex(0);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + ServicesCard.length) % ServicesCard.length);
        setActiveTagIndex(0);
    };

    const nextTag = () => {
        if (activeTagIndex < currentData.tags.length - 1) {
        setActiveTagIndex(activeTagIndex + 1);
        } 
        else {
        const nextSlideIndex = (currentSlide + 1) % ServicesCard.length;
        setCurrentSlide(nextSlideIndex);
        setActiveTagIndex(0); 
        }
    };

    const prevTag = () => {
        if (activeTagIndex > 0) {
        setActiveTagIndex(activeTagIndex - 1);
        } 
        else {
        const prevSlideIndex = (currentSlide - 1 + ServicesCard.length) % ServicesCard.length;
        setCurrentSlide(prevSlideIndex);
        setActiveTagIndex(ServicesCard[prevSlideIndex].tags.length - 1);
        }
    };

    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);


    const minSwipeDistance = 50;

    const onTouchStart = (e) => {
        setTouchEnd(null); 
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
        nextTag(); 
        } 
        else if (isRightSwipe) {
        prevTag(); 
        }
    };

  // ดึงข้อมูลมาเตรียมโชว์
    const currentTag = allTags[activeSlideIndex]; // สำหรับ Mobile
    const currentData = ServicesCard[currentSlide];
    const currentDetail = currentData.tags[activeTagIndex].detail;

  return (
    <section className="max-w-flex bg-[#052032] text-white">
      <div className="w-full md:max-w-6xl mx-auto px-0 md:px-4 py-10 md:py-20 bg-[#052032]">

      
      {/* --- 📱 MOBILE VERSION: SEAMLESS SNAP SLIDER --- */}
      <div className="md:hidden flex flex-col items-center relative overflow-hidden px-0">
  
        {/* 1. Top Dots & Heading (ส่วนนี้อยู่กับที่ด้านบน) */}
        <div className="flex gap-2 mb-8">
            {ServicesCard.map((_, idx) => (
            <div key={idx} className={`w-2 h-2 rounded-full transition-all duration-500 ${currentTag.categoryIndex === idx ? "bg-[#CEA870] w-6" : "bg-gray-700"}`} />
            ))}
        </div>

        <div className="text-center mb-6 z-20">
            <button onClick={() => setIsPopupOpen(true)} className="flex items-center justify-center gap-2 mx-auto active:scale-95 transition-transform">
                <h2 className="text-[24px] font-semibold text-[#CEA870] uppercase tracking-widest">{currentTag.categoryTitle}</h2>
                    <svg className="w-6 h-6 text-[#CEA870]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 9l-7 7-7-7" strokeWidth={2}/></svg>
            </button>
            <p className="text-gray-400 font-light mt-2 leading-relaxed px-6 text-[13px] h-[40px]">{currentTag.categoryDesc}</p>
        </div>

        {/* 2. Gradient ซ้าย-ขวา (ต้องอยู่นอก Container ที่เลื่อน เพื่อให้มันอยู่กับที่) */}
        <div className="absolute top-0 bottom-0 left-0 w-10 bg-gradient-to-r from-[#052032] to-transparent z-40 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-10 bg-gradient-to-l from-[#052032] to-transparent z-40 pointer-events-none" />

        {/* 3. Horizontal Snap Container (เฉพาะก้อนนี้ที่เลื่อนได้) */}
        <div 
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex w-full overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-2 px-[8vw] pb-6"
            >
            {allTags.map((tag, i) => (
            <div key={i} className="snap-center shrink-0 w-[84vw] relative aspect-[3/3.2] rounded-[20px] overflow-hidden border border-white/10 shadow-2xl">
            <Image src={tag.tagImage} alt={tag.name} fill className="object-cover" />
            <div className="absolute inset-0 bg-black/60 z-10 pointer-events-none" /> 

            <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col items-center text-center z-30">
                <h3 className="text-[#CEA870] text-[18px] font-semibold mb-1 uppercase tracking-wide">{tag.name}</h3>
                <p className="text-[11px] text-gray-400 mb-6 font-regular italic leading-tight">"{tag.summary}"</p>
          
            <div className="grid grid-cols-2 gap-2 w-full">
                <MobileInfoItem label="ภาษา" value={tag.detail.lang} />
                <MobileInfoItem label="ระยะเวลา" value={tag.detail.time} />
                <MobileInfoItem label="รูปแบบ" value={tag.detail.type} />
                <MobileInfoItem label="เครื่องมือ" value={tag.detail.tool} />
            </div>
          
          {/* --- more information (Mobile) --- */}
            <a
                href="https://lin.ee/MDN9uJ4"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-full border border-[#CEA870] text-[#CEA870] text-[10px] font-bold uppercase tracking-[0.2em] active:bg-[#CEA870] active:text-[#002740] transition-all flex items-center justify-center gap-2 mb-2 mt-2"
            >
                <span>ติดต่อสอบถาม</span>
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
            </a>

            </div>
            </div>
            ))}
        </div>

        {/* 4. Tag Dots ด้านล่าง (ย้ายออกมาอยู่นอก Container เพื่อให้นิ่งอยู่กับที่) */}
        <div className="flex gap-1.5 mt-4 mb-10 z-20">
            {ServicesCard[currentTag.categoryIndex].tags.map((_, dotIdx) => (
            <div 
            key={dotIdx} 
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
            // ตรวจสอบจากชื่อ Tag หรือ Index ของหมวดหมู่ปัจจุบัน
            ServicesCard[currentTag.categoryIndex].tags[dotIdx].name === currentTag.name ? "bg-white w-4" : "bg-white/30"
            }`} 
            />
            ))}
        </div>
      </div>



        {/* Desktop Desktop Desktop Desktop */}

        {/* 1. dot */}
        <div className="hidden md:flex gap-2 mb-10 gap-2 mb-12">
            {ServicesCard.map((_, idx) => (
                <button
                    key={idx}
                    onClick={() => changeSlide(idx)}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${
                    currentSlide === idx ? "bg-[#CEA870] w-8" : "bg-gray-600"
                    }`}
                />
            ))}
        </div>

        <div className="hidden md:grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-16 items-start">

            {/* 2. title and description */}
            <div className="space-y-10">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="space-y-6"
                    >
                        <div className="flex items-center gap-4 mb-6 group">
                            <button onClick={prevSlide} className="text-[#CEA870] hover:scale-125 transition-transform">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
  
                            <h2 className="text-5xl font-semibold text-[#CEA870] uppercase tracking-wider">
                                {currentData.title}
                            </h2>

                            <button onClick={nextSlide} className="text-[#CEA870] hover:scale-125 transition-transform">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                        <p className="text-gray-300 font-light max-w-lg leading-relaxed text-lg">
                            {currentData.desc}
                        </p>
                    </motion.div>
                </AnimatePresence>

          {/* 3. tag */}
          <div className="flex flex-wrap gap-3 pt-4">
            {currentData.tags.map((tag, idx) => (
              <button
                key={idx}
                onMouseEnter={() => setActiveTagIndex(idx)}
                className={`flex items-center gap-2 px-5 py-2 rounded-full border text-sm transition-all duration-300 ${
                  activeTagIndex === idx 
                  ? "bg-[#CEA870] border-[#CEA870] text-[#002740] font-bold" 
                  : "border-[#CEA870]/40 text-[#CEA870] hover:bg-[#CEA870]/10"
                }`}
              >
                <span className={`${activeTagIndex === idx ? "brightness-0" : ""}`}>
                  {tag.icon}
                </span>
                {tag.name}
              </button>
            ))}
          </div>
        </div>

        {/* Placeholder */}
        <div className="relative aspect-[4/5] bg-[#051622] rounded-3xl border border-white/5 shadow-2xl overflow-hidden flex flex-col items-center justify-center p-12 text-center group/card">
                {/* Background Image */}
                <Image 
                    src={currentData.tags[activeTagIndex].tagImage || currentData.image} 
                    alt={currentData.title}
                    fill
                    className="object-cover z-0 transition-transform duration-700 hover:scale-105"
                    priority
                />

            {/* Layer Overlay */}
                <div className="absolute inset-0 bg-black/60 z-10 pointer-events-none" />   

            {/* --- left right Tag --- */}
                <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 z-30 flex justify-between pointer-events-none">
                    {/* --- < left Button --- */}
                    <button 
                        onClick={prevTag}
                        className="pointer-events-auto p-3 rounded-full bg-black/30 hover:bg-[#CEA870] text-white backdrop-blur-sm transition-all duration-300 opacity-0 group-hover/card:opacity-100 -translate-x-4 group-hover/card:translate-x-0"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    {/* --- > right Button --- */}
                    <button 
                        onClick={nextTag}
                        className="pointer-events-auto p-3 rounded-full bg-black/30 hover:bg-[#CEA870] text-white backdrop-blur-sm transition-all duration-300 opacity-0 group-hover/card:opacity-100 translate-x-4 group-hover/card:translate-x-0"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>

        {/* Animation Tag */}
        <div className="relative z-20 w-full h-full flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">

                <motion.div
                    key={`${currentSlide}-${activeTagIndex}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex flex-col items-center space-y-8 w-full" 
                >
  
                    <div className="space-y-4">
                        <h4 className="text-[#CEA870] text-xl font-bold italic tracking-wide">
                            {currentData.tags[activeTagIndex].name}
                        </h4>
                        <p className="text-gray-400 font-light italic leading-relaxed text-base max-w-[280px] mx-auto">
                            "{currentData.tags[activeTagIndex].summary}"
                        </p>
                    </div>


      
            {/* more information */}
                <motion.a
                    href="https://lin.ee/MDN9uJ4"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="group flex items-center gap-3 border border-[#CEA870] text-[#CEA870] px-10 py-3.5 rounded-full text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#CEA870] hover:text-[#002740] transition-all duration-300"
                >
                    <span>ติดต่อสอบถาม</span>
                    <svg
                        className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                        fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </motion.a>
                </motion.div>
            </AnimatePresence>
            </div>
        </div>
      </div>

      {/* information box */}
      <div className="hidden md:grid md:grid-cols-4 gap-6 mt-8">
        <InfoItem label="ภาษา" value={currentDetail.lang} />
        <InfoItem label="ระยะเวลา" value={currentDetail.time} />
        <InfoItem label="รูปแบบ" value={currentDetail.type} />
        <InfoItem label="เครื่องมือ" value={currentDetail.tool} />
      </div>



{/* --- POPUP MODAL & OVERLAY --- */}
        <ServicePopup 
            isOpen={isPopupOpen}
            onClose={() => setIsPopupOpen(false)}
            services={ServicesCard}
            allTags={allTags}
            currentTag={currentTag}
            expandedCat={expandedCat}
            setExpandedCat={setExpandedCat}
            scrollRef={scrollRef}
            onSelectTag={scrollToSpecificTag}
        />

        </div>
        </section>
  );
}

    {/* label */}
function InfoItem({ label, value }) {
  return (
    <div className="p-8 border border-[#CEA870]/20 rounded-2xl bg-[#001f33]/60 backdrop-blur-sm hover:border-[#CEA870]/50 transition-colors">
      <p className="text-[#CEA870] text-[16px] font-bold mb-4">{label}</p>
      <p className="text-sm font-light text-gray-200 leading-relaxed">{value}</p>
    </div>
  );
}

function MobileInfoItem({ label, value }) {
  return (
    <div className="border border-[#CEA870]/30 rounded-2xl py-3 bg-black/20 backdrop-blur-sm">
      <p className="text-[10px] text-[#CEA870] font-bold uppercase mb-1">{label}</p>
      <p className="text-[11px] text-white font-light">{value}</p>
    </div>
  );
}