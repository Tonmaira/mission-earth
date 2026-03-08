"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from 'next/image';

const ServicesCard = [
  {
    id: 0,
    title: "Course",
    desc: "หลักสูตรฝึกอบรมและบรรยายที่ออกแบบเฉพาะเพื่อสร้างความเข้าใจและทักษะด้าน ESG",
    tags: [
      { name: "Training", 
        tagImage: "/image/services/2-service-training.jpg",
        icon: <span className="w-2 h-2 bg-[#CEA870]" />,  
        summary: "หลักสูตรอบรมด้านความยั่งยืนสำหรับองค์กร เยาวชน และประชาชนทั่วไป",
        detail: { lang: "ไทย / อังกฤษ", time: "ครึ่งวัน / เต็มวัน", type: "On-site / Online", tool: "Workbook / Case Study" } },
      { name: "Lecture", 
        tagImage: "/image/services/1-service-course.jpg",
        icon: <span className="w-2 h-2 bg-[#CEA870]" />, 
        summary: "การบรรยายเพื่อสื่อสารด้าน ESG ที่ทุกคนสามารถเข้าถึงได้",
        detail: { lang: "ไทย", time: "1-2 ชั่วโมง", type: "Seminar", tool: "Presentation Slide" } }
    ]
  },
  {
    id: 1,
    title: "Camp",
    desc: "กิจกรรมค่ายที่ผสมผสานการเรียนรู้กับการลงมือทำ เพื่อปลูกพลังการอนุรักษ์...",
    tags: [
      { name: "ค่ายวิชาการด้านสิ่งแวดล้อม", 
        tagImage: "/image/services/3-camp-bootcamp.JPG",
        icon: <span className="w-2 h-2 bg-[#CEA870]" />, 
        summary: "เสริมความรู้และทักษะด้านสิ่งแวดล้อม ผ่านการเรียนรู้เชิงลึกและกิจกรรมสนุกที่สร้างแรงบันดาลใจ",
        detail: { lang: "ไทย", time: "3 วัน 2 คืน", type: "Outdoor Camp", tool: "Field Gear" } },
      { name: "ค่ายสัมผัสธรรมชาติ (Reconnection to Nature)", 
        tagImage: "/image/services/5-camp.jpg",
        icon: <span className="w-2 h-2 bg-[#CEA870]" />,
        summary: "สร้างประสบการณ์เชื่อมโยงกับธรรมชาติ สังเกต และการใช้สติอย่างสงบในป่า",
        detail: { lang: "ไทย", time: "2 วัน 1 คืน", type: "Retreat", tool: "Nature Journal" } },
      { name: "ค่ายศึกษาธรรมชาติ", 
        tagImage: "/image/services/4-camp-touchnature.JPG",
        icon: <span className="w-2 h-2 bg-[#CEA870]" />, 
        summary: "เรียนรู้จากสิ่งแวดล้อมจริง สำรวจระบบนิเวศและความสัมพันธ์ของชีวิตในธรรมชาติ",
        detail: { lang: "ไทย", time: "2 วัน 1 คืน", type: "walk1", tool: "blank1" } },
      { name: "ค่ายผจญภัย (Survivor Camp)", 
        tagImage: "/image/services/6-camp.JPG",
        icon: <span className="w-2 h-2 bg-[#CEA870]" />, 
        summary: "ค่ายที่ผสานความสนุกกับการเอาตัวรอดจากธรรมชาติ ฝึกความกล้า การทำงานเป็นทีม และการตัดสินใจในสถานการณ์จริง",
        detail: { lang: "ไทย", time: "2 วัน 1 คืน", type: "walk2", tool: "blank2" } }
    ]
  },
  {
    id: 2,
    title: "Sustainable Travel",
    desc: "ทริปเรียนรู้และท่องเที่ยวอย่างยั่งยืน ที่ออกแบบเพื่อสร้างแรงบันดาลใจและมุมมองใหม่ต่อโลก",
    tags: [
      { name: "LuxCamp", 
        icon: <span className="w-2 h-2 bg-[#CEA870]" />, 
        tagImage: "/image/services/7-sustaintravel-lux.jpg",
        summary: "ทริประดับพรีเมียมที่ผสมผสานความสะดวกสบายกับการพักผ่อนท่ามกลางธรรมชาติ สร้างแรงบันดาลใจผ่านประสบการณ์จริงและกิจกรรมที่ออกแบบเฉพาะ",
        detail: { lang: "ไทย", time: "3 วัน 2 คืน", type: "Outdoor Camp", tool: "Field Gear" } },
      { name: "ดูงาน ESG ในและต่างประเทศ", 
        tagImage: "/image/services/8-sustaintravel-esgtrip.jpg",
        icon: <span className="w-2 h-2 bg-[#CEA870]" />, 
        summary: "หทริปศึกษาดูงานเพื่อเรียนรู้แนวทางการพัฒนาอย่างยั่งยืนจากองค์กรต้นแบบ ทั้งในประเทศไทยและต่างประเทศ",
        detail: { lang: "ไทย", time: "2 วัน 1 คืน", type: "Retreat", tool: "Nature Journal" } },
      { name: "อาบป่า (Forest Bathing / Shinrin-yoku Experience)", 
        tagImage: "/image/services/10-sustaintravel-forest.jpg",
        icon: <span className="w-2 h-2 bg-[#CEA870]" />, 
        summary: "ประสบการณ์การพักผ่อนและเยียวยาจิตใจผ่านธรรมชาติ ฝึกการรับรู้ด้วยประสาทสัมผัสและเชื่อมโยงกับสิ่งแวดล้อมอย่างลึกซึ้ง",
        detail: { lang: "ไทย", time: "2 วัน 1 คืน", type: "walk2", tool: "blank2" } }
    ]
  },
  {
    id: 3,
    title: "Communication",
    desc: "ทริปเรียนรู้และท่องเที่ยวอย่างยั่งยืน ที่ออกแบบเพื่อสร้างแรงบันดาลใจและมุมมองใหม่ต่อโลก",
    tags: [
      { name: "ESG Content Creative", 
        tagImage: "/image/services/11-commu.heic",
        icon: <span className="w-2 h-2 bg-[#CEA870]" />,  
        summary: "สร้างสรรค์คอนเทนต์ด้านความยั่งยืนในรูปแบบที่เข้าถึงง่าย มีเอกลักษณ์ และช่วยให้ผู้คนเข้าใจเรื่อง ESG อย่างเป็นมิตร",
        detail: { lang: "ไทย / อังกฤษ", time: "ครึ่งวัน / เต็มวัน", type: "On-site / Online", tool: "Workbook / Case Study" } },
      { name: "VDO และสื่อมัลติมีเดีย", 
        tagImage: "/image/services/11-commu2.JPG",
        icon: <span className="w-2 h-2 bg-[#CEA870]" />, 
        summary: "ผลิตวิดีโอและสื่อมัลติมีเดียเพื่อเล่าเรื่องสิ่งแวดล้อมและสังคมอย่างมีอิทธิพล ทั้งสารคดีสั้น แคมเปญองค์กร หรือคลิปออนไลน์สร้างแรงบันดาลใจ",
        detail: { lang: "ไทย", time: "1-2 ชั่วโมง", type: "Seminar", tool: "Presentation Slide" } },
      { name: "Infographic และ Visual Design", 
        tagImage: "/image/services/13-commu.png",
        icon: <span className="w-2 h-2 bg-[#CEA870]" />, 
        summary: "ออกแบบภาพข้อมูลและกราฟิกเชิงสร้างสรรค์ เพื่อสื่อสารประเด็นสิ่งแวดล้อมและ ESG ให้เข้าใจง่ายและน่าสนใจ",
        detail: { lang: "ไทย", time: "1-2 ชั่วโมง", type: "Seminar", tool: "Presentation Slide" } },
      { name: "Spot Radio / Podcast", 
        tagImage: "/image/services/11-commu.heic",
        icon: <span className="w-2 h-2 bg-[#CEA870]" />, 
        summary: "สื่อเสียงเพื่อการเรียนรู้และสร้างแรงบันดาลใจ ถ่ายทอดแนวคิดด้าน ESG อย่างใกล้ชิดและเป็นกันเอง",
        detail: { lang: "ไทย", time: "1-2 ชั่วโมง", type: "Seminar", tool: "Presentation Slide" } },
      { name: "Roadshow", 
        tagImage: "/image/services/12-commu.jpg",
        icon: <span className="w-2 h-2 bg-[#CEA870]" />, 
        summary: "ตะลอนทัวร์เข้าพื้นที่ พบปะกลุ่มเป้าหมาย จัดกิจกรรมและสื่อสารเรื่อง ESG อย่างสนุกและเข้าถึงง่าย",
        detail: { lang: "ไทย", time: "1-2 ชั่วโมง", type: "Seminar", tool: "Presentation Slide" } },
      { name: "PR & Communication Campaign", 
        tagImage: "/image/services/14-commu.JPG",
        icon: <span className="w-2 h-2 bg-[#CEA870]" />, 
        summary: "วางกลยุทธ์และออกแบบแคมเปญสื่อสารด้าน ESG  ให้เข้าถึงกลุ่มเป้าหมายและเกิดการเปลี่ยนแปลงอย่างแท้จริง",
        detail: { lang: "ไทย", time: "1-2 ชั่วโมง", type: "Seminar", tool: "Presentation Slide" } },
    ]
  },
  {
    id: 4,
    title: "Event",
    desc: "งานและกิจกรรมเพื่อสร้างการมีส่วนร่วมของสังคมในประเด็นสิ่งแวดล้อม",
    tags: [
      { name: "Green Organisation", 
        tagImage: "/image/services/15-green organise.jpg",
        icon: <span className="w-2 h-2 bg-[#CEA870]" />,  
        summary: "จัดอีเวนต์อย่างยั่งยืน ใส่ใจสิ่งแวดล้อมทุกขั้นตอน ตั้งแต่แนวคิดจนถึงการลงมือทำ",
        detail: { lang: "ไทย / อังกฤษ", time: "ครึ่งวัน / เต็มวัน", type: "On-site / Online", tool: "Workbook / Case Study" } },
      { name: "Forum", 
        tagImage: "/image/services/17-Talk.jpg",
        icon: <span className="w-2 h-2 bg-[#CEA870]" />, 
        summary: "เวทีพูดคุยและแลกเปลี่ยนแนวคิดด้าน ESG ระหว่างผู้เชี่ยวชาญ องค์กร และประชาชน",
        detail: { lang: "ไทย", time: "1-2 ชั่วโมง", type: "Seminar", tool: "Presentation Slide" } },
      { name: "Conference", 
        tagImage: "/image/services/17-Talk.jpg",
        icon: <span className="w-2 h-2 bg-[#CEA870]" />, 
        summary: "การประชุมหรือสัมมนาระดับองค์กรเพื่อแบ่งปันความรู้และแนวทางขับเคลื่อน ESG อย่างเป็นระบบ",
        detail: { lang: "ไทย", time: "1-2 ชั่วโมง", type: "Seminar", tool: "Presentation Slide" } },
      { name: "Hackathon", 
        tagImage: "/image/services/16-Hack.JPG",
        icon: <span className="w-2 h-2 bg-[#CEA870]" />, 
        summary: "กิจกรรมพัฒนาไอเดียและนวัตกรรมสิ่งแวดล้อม ภายในเวลาจำกัด เพื่อสร้างทางออกใหม่ให้กับโลก",
        detail: { lang: "ไทย", time: "1-2 ชั่วโมง", type: "Seminar", tool: "Presentation Slide" } },
      { name: "Talk", 
        tagImage: "/image/services/17-Talk2.jpg",
        icon: <span className="w-2 h-2 bg-[#CEA870]" />, 
        summary: "เวทีแบ่งปันแรงบันดาลใจจากผู้ขับเคลื่อนด้าน ESG ถ่ายทอดแนวคิดสู่การลงมือทำจริง",
        detail: { lang: "ไทย", time: "1-2 ชั่วโมง", type: "Seminar", tool: "Presentation Slide" } },
      { name: "Competition", 
        tagImage: "/image/services/18-competition.jpg",
        icon: <span className="w-2 h-2 bg-[#CEA870]" />, 
        summary: "การแข่งขันเชิงสร้างสรรค์ ที่เปิดโอกาสให้ผู้เข้าร่วมแสดงพลังและไอเดียเพื่อโลกอย่างยั่งยืน",
        detail: { lang: "ไทย", time: "1-2 ชั่วโมง", type: "Seminar", tool: "Presentation Slide" } },
      { name: "Exhibition", 
        tagImage: "/image/services/service-course.jpg",
        icon: <span className="w-2 h-2 bg-[#CEA870]" />, 
        summary: "นิทรรศการด้าน ESG ที่ออกแบบให้ผู้เข้าชมได้เรียนรู้และมีส่วนร่วมอย่างสนุกและเข้าใจง่าย",
        detail: { lang: "ไทย", time: "1-2 ชั่วโมง", type: "Seminar", tool: "Presentation Slide" } },
      { name: "Recreation", 
        tagImage: "/image/services/20-recreation.jpg",
        icon: <span className="w-2 h-2 bg-[#CEA870]" />, 
        summary: "กิจกรรมสันทนาการที่ผสมผสานความสนุกกับแนวคิดด้าน ESG เพื่อสร้างแรงบันดาลใจในการใช้ชีวิตอย่างยั่งยืน",
        detail: { lang: "ไทย", time: "1-2 ชั่วโมง", type: "Seminar", tool: "Presentation Slide" } },
      { name: "Scavenger Hunt", 
        tagImage: "/image/services/19-scaventure.jpg",
        icon: <span className="w-2 h-2 bg-[#CEA870]" />, 
        summary: "เกมผจญภัยตามหาความรู้ด้าน ESG ฝึกการสังเกต การคิดเป็นทีม และการเรียนรู้จากประสบการณ์จริง",
        detail: { lang: "ไทย", time: "1-2 ชั่วโมง", type: "Seminar", tool: "Presentation Slide" } },
    ]
  },
  {
  id: 5,
    title: "ESG Tools",
    desc: "เครื่องมือเพื่อการเรียนรู้และสื่อสารเรื่องสิ่งแวดล้อมที่เราพัฒนาด้วยทีมออกแบบของเราเอง",
    tags: [
      { name: "Board Game และ Games for Change", 
        tagImage: "/image/services/21-boardgame.jpg",
        icon: <span className="w-2 h-2 bg-[#CEA870]" />,  
        summary: "สื่อการเรียนรู้เชิงเกมที่ออกแบบให้เข้าใจ ESG อย่างสนุก สนับสนุนการคิดเชิงระบบและการลงมือเปลี่ยนแปลงจริง",
        detail: { lang: "ไทย / อังกฤษ", time: "ครึ่งวัน / เต็มวัน", type: "On-site / Online", tool: "Workbook / Case Study" } },
      { name: "หนังสือ และสื่อการเรียนรู้", 
        tagImage: "/image/services/service-course.jpg",
        icon: <span className="w-2 h-2 bg-[#CEA870]" />, 
        summary: "หนังสือและชุดสื่อที่ถ่ายทอดความรู้ด้าน ESG ผ่านภาพและเรื่องราว เข้าใจง่าย เหมาะสำหรับทุกวัย",
        detail: { lang: "ไทย", time: "1-2 ชั่วโมง", type: "Seminar", tool: "Presentation Slide" } },
      { name: "Edutainment Toolkit", 
        tagImage: "/image/services/service-course.jpg",
        icon: <span className="w-2 h-2 bg-[#CEA870]" />, 
        summary: "ออกแบบและพัฒนาแพลตฟอร์มดิจิทัลเพื่อการเรียนรู้ ESG และการสื่อสารเชิงโต้ตอบ รองรับทั้งองค์กรและชุมชน",
        detail: { lang: "ไทย", time: "1-2 ชั่วโมง", type: "Seminar", tool: "Presentation Slide" } },
      { name: "Website และ Application", 
        tagImage: "/image/services/service-course.jpg",
        icon: <span className="w-2 h-2 bg-[#CEA870]" />, 
        summary: "ชุดสื่อการเรียนรู้แบบผสมผสานความรู้และความบันเทิง ใช้ได้ทั้งในห้องเรียนและกิจกรรมองค์กร เพื่อสร้างความเข้าใจอย่างยั่งยืน",
        detail: { lang: "ไทย", time: "1-2 ชั่วโมง", type: "Seminar", tool: "Presentation Slide" } },
    ]
  }
  
];




export default function SlideServices() {
  // --- 1. สมองก้อนใหม่ (สำหรับ Mobile ปัดยาวๆ) ---
  const scrollRef = useRef(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false); // ควบคุมการเปิด/ปิดหน้าต่างเลือกหมวด
  const [popupView, setPopupView] = useState('categories'); // 'categories' หรือ 'tags'
const [selectedCatIdx, setSelectedCatIdx] = useState(null);
const [expandedCat, setExpandedCat] = useState(null); // ตัวแปรที่หายไปซึ่งทำให้เกิด Error


  const allTags = ServicesCard.flatMap((cat, catIdx) => 
  cat.tags.map((tag, tagIdx) => ({ // เพิ่ม tagIdx ตรงนี้
    ...tag,
    categoryTitle: cat.title,
    categoryDesc: cat.desc,
    categoryIndex: catIdx,
    tagIndex: tagIdx // เก็บลำดับ Tag ภายในหมวดไว้ใช้งาน
  }))
);

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

  // --- 2. สมองก้อนเก่า (สำหรับ Desktop กดคลิก) ---
  // ** ต้องมีบรรทัดพวกนี้ด้วยนะครับ ไม่อย่างนั้นมันจะหาตัวแปรไม่เจอ **
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTagIndex, setActiveTagIndex] = useState(0);

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
  } else {

    const nextSlideIndex = (currentSlide + 1) % ServicesCard.length;
    setCurrentSlide(nextSlideIndex);
    setActiveTagIndex(0); 
  }
};

const prevTag = () => {

  if (activeTagIndex > 0) {
    setActiveTagIndex(activeTagIndex - 1);
  } else {
 
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
  } else if (isRightSwipe) {
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
          
          {/* --- เพิ่มปุ่มติดต่อสอบถาม ตรงนี้ครับ --- */}
        <button 
          className="w-full py-3 rounded-full border border-[#CEA870] text-[#CEA870] text-[10px] font-bold uppercase tracking-[0.2em] active:bg-[#CEA870] active:text-[#002740] transition-all flex items-center justify-center gap-2 mb-2 mt-2"
        >
          <span>ติดต่อสอบถาม</span>
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>

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
      <button 
        onClick={prevTag}
        className="pointer-events-auto p-3 rounded-full bg-black/30 hover:bg-[#CEA870] text-white backdrop-blur-sm transition-all duration-300 opacity-0 group-hover/card:opacity-100 -translate-x-4 group-hover/card:translate-x-0"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

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
      <div className="">

      </div>
      <div className="space-y-4">
          <h4 className="text-[#CEA870] text-xl font-bold italic tracking-wide">
          {currentData.tags[activeTagIndex].name}
          </h4>
          <p className="text-gray-400 font-light italic leading-relaxed text-base max-w-[280px] mx-auto">
          "{currentData.tags[activeTagIndex].summary}"
          </p>
      </div>


      
      {/* more information */}
      <motion.button
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
      </motion.button>
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
<AnimatePresence>
  {isPopupOpen && (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      {/* 1. Backdrop Overlay */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setIsPopupOpen(false)}
        className="absolute inset-0 bg-black/20 backdrop-blur-md"
      />

      {/* 2. Central Popup Card: ล็อคความสูงไว้ที่ h-[550px] */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-sm bg-[#052032] border border-[#CEA870]/30 rounded-[30px] p-8 shadow-2xl h-[550px] flex flex-col"
      >
        <p className="text-[#CEA870]/60 text-xs font-bold uppercase tracking-[0.2em] mb-6 text-center shrink-0">
          All Services
        </p>
        
        {/* --- 3. ส่วนรายการ: ใส่ overflow-y-auto เพื่อให้ไถขึ้นลงในกล่องได้ --- */}
        <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide flex flex-col gap-3">
          {ServicesCard.map((cat, idx) => {
    const isExpanded = expandedCat === idx;
    const isActiveCategory = currentTag.categoryIndex === idx;

            return (
              <div key={idx} className="flex flex-col gap-1">
                {/* หมวดหมู่หลัก */}
                <button
  onClick={() => {
    // 1. สั่งคลี่/หุบ รายการย่อยเหมือนเดิม
    setExpandedCat(isExpanded ? null : idx); 
    
    // 2. สั่งเลื่อนสไลด์ไปที่ Tag แรกของหมวดนี้ทันที
    const firstTagIndex = allTags.findIndex(tag => tag.categoryIndex === idx);
    if (firstTagIndex !== -1 && scrollRef.current) {
      const cardWidth = scrollRef.current.offsetWidth * 0.84; // ใช้ค่าเดียวกับ w-[84vw]
      scrollRef.current.scrollTo({
        left: firstTagIndex * (cardWidth + 20), // 20 คือค่า gap-5
        behavior: 'smooth'
      });
    }
  }}
  className={`py-4 px-6 rounded-2xl text-left transition-all flex justify-between items-center ${
    isActiveCategory ? "bg-[#CEA870]/10 border border-[#CEA870]/30" : "hover:bg-white/5 border border-transparent"
  }`}
>
  <span className={`text-lg uppercase tracking-wider ${isActiveCategory ? "text-[#CEA870]" : "text-gray-300"}`}>
    {cat.title}
  </span>
  <svg className={`w-4 h-4 text-[#CEA870] transition-transform ${isExpanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path d="M19 9l-7 7-7-7" strokeWidth={2} />
  </svg>
</button>

                {/* รายการ Tag ย่อยที่ Dropdown ลงมา */}
                <AnimatePresence>
  {isExpanded && (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className="overflow-hidden flex flex-col gap-1 pl-4"
    >
      {/* 1. เพิ่มปุ่ม "All [หมวดหมู่]" เป็นเมนูแรกเสมอ */}
      <button
        onClick={() => {
          // เลื่อนไปที่ Tag แรกของหมวดนี้
          scrollToSpecificTag(idx, cat.tags[0].name);
          setIsPopupOpen(false); // เลือกเสร็จปิดทันที
        }}
        className="py-4 px-6 text-left text-sm font-bold text-[#CEA870] hover:bg-[#CEA870]/10 rounded-xl transition-all flex items-center gap-3"
      >
        <div className="w-2 h-2 bg-[#CEA870] rounded-full shadow-[0_0_8px_#CEA870]" />
        ALL {cat.title.toUpperCase()}
      </button>

      {/* 2. รายการ Tag ปกติ (ลูปเดิมของคุณ) */}
      {cat.tags.map((tag, tIdx) => (
        <button
          key={tIdx}
          onClick={() => {
            scrollToSpecificTag(idx, tag.name);
            setIsPopupOpen(false);
          }}
          className="py-3.5 px-6 text-left text-sm text-gray-400 hover:text-white flex items-center gap-3 transition-all active:scale-95"
        >
          <div className="w-1 h-1 bg-gray-600 rounded-full ml-1" />
          {tag.name}
        </button>
      ))}
    </motion.div>
  )}
</AnimatePresence>
              </div>
            );
          })}
        </div>

        <button 
          onClick={() => setIsPopupOpen(false)}
          className="mt-6 w-full py-2 text-gray-500 text-sm font-medium hover:text-white transition-colors shrink-0"
        >
          Close
        </button>
      </motion.div>
    </div>
  )}
</AnimatePresence>

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