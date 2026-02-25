"use client";
import { useState } from "react";
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
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTagIndex, setActiveTagIndex] = useState(0);

  const changeSlide = (index) => {
    setCurrentSlide(index);
    setActiveTagIndex(0);
  };

  const currentData = ServicesCard[currentSlide];
  const currentDetail = currentData.tags[activeTagIndex].detail;

  return (
    <section className="max-w-6xl mx-auto px-4 py-20 bg-[#002740] text-white">
      {/* 1. dot */}
      <div className="flex gap-2 mb-12">
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

      <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-16 items-start">
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
              <h2 className="text-5xl font-semibold text-[#CEA870] uppercase tracking-wider">
                {currentData.title}
              </h2>
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

        {/* ฝั่งขวา: รูปภาพ Placeholder */}
        <div className="relative aspect-[4/5] bg-[#051622] rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center p-12 text-center">
            {/* Background Image */}
            <Image 
            src={currentData.tags[activeTagIndex].tagImage || currentData.image} 
            alt={currentData.title}
            fill
            className="object-cover z-0 transition-transform duration-700 hover:scale-105"
            priority
            />

        {/* 2. Layer Overlay (แผ่นกรองแสงสีดำ z-10) เพื่อให้ตัวหนังสืออ่านง่าย */}
        <div className="absolute inset-0 bg-black/60 z-10 pointer-events-none" />

           {/* ใส่ Animation ให้ข้อความตอนเปลี่ยน Tag ดูสมูทขึ้น */}
           <div className="relative z-20 w-full h-full flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
           {/* 2. ตัวลูก (motion.div): ต้องมี items-center เพื่อจัดปุ่มให้อยู่กึ่งกลางแนวนอน */}
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

      {/* ปุ่มติดต่อสอบถาม: จะอยู่ตรงกลางโดยอัตโนมัติเพราะ parent มี items-center */}
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

      {/* 3. ส่วนกล่องข้อมูล 4 ช่องด้านล่าง (Info Grid) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
        <InfoItem label="ภาษา" value={currentDetail.lang} />
        <InfoItem label="ระยะเวลา" value={currentDetail.time} />
        <InfoItem label="รูปแบบ" value={currentDetail.type} />
        <InfoItem label="เครื่องมือ" value={currentDetail.tool} />
      </div>
    </section>
  );
}

// คอมโพเนนต์ย่อยสำหรับกล่องข้อมูลด้านล่าง
function InfoItem({ label, value }) {
  return (
    <div className="p-8 border border-[#CEA870]/20 rounded-2xl bg-[#001f33]/60 backdrop-blur-sm hover:border-[#CEA870]/50 transition-colors">
      <p className="text-[#CEA870] text-[16px] font-bold mb-4">{label}</p>
      <p className="text-sm font-light text-gray-200 leading-relaxed">{value}</p>
    </div>
  );
}