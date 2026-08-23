"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";

/* ไฟล์นี้เก็บแค่ id กับรูป ส่วนชื่อ ตำแหน่ง และคำบรรยาย อยู่ที่
   team.members.<id> ใน messages/{en,th}.json — id มาจากชื่อไฟล์รูป

   ชื่อในไฟล์ภาษาไทยยังเป็นอักษรโรมันอยู่ เพราะยังไม่มีการสะกดภาษาไทยที่ยืนยันแล้ว
   ได้มาเมื่อไรแก้ที่ th.json ได้เลย ไม่ต้องแตะโค้ด

   เพิ่มคนใหม่ต้องเติมทั้งที่นี่และในไฟล์ภาษาทั้งสอง
   (npm run check:i18n จะเตือนถ้าใส่ไม่ครบ) */
const members = [
  { id: "pcherry", image: "/pcherry.png" },
  { id: "ajwid", image: "/ajwid.png" },
  { id: "fiat", image: "/fiat.jpg" },
  { id: "zom", image: "/zom.jpg" },
  { id: "tonmai", image: "/tonmai.JPG" },
  { id: "film", image: "/film.jpg" },
  { id: "mart", image: "/Mart.jpg" },
  { id: "praew", image: "/praew.jpg" },
];

const advisors = [
  { id: "advisor-vitchayut", image: "/advisor-vitchayut.jpg" },
  { id: "advisor-onanong", image: "/advisor-onanong.jpg" },
  { id: "advisor-chuchart", image: "/advisor-chuchart.jpg" },
];

export default function TeamSection() {
  const t = useTranslations("team");
  const [hovered,  setHovered]  = useState(null);
  const [selected, setSelected] = useState(null);

  return (
    <>
    <section className="flex flex-col lg:flex-row gap-[10px] px-6 md:px-12 lg:px-[144px] py-[40px]">

      {/* Left panel — large screen only */}
      <div className="hidden lg:block shrink-0 w-[424px] sticky top-[120px] self-start h-[480px]">
        {hovered !== null ? (
          <div className="relative w-full h-full overflow-hidden rounded-sm animate-fade-in">
            {(() => { const m = hovered < members.length ? members[hovered] : advisors[hovered - members.length]; return (<>
              <Image src={m.image} alt={t(`members.${m.id}.name`)} fill className="object-cover object-top transition-all duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#002740]/90 via-[#002740]/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col gap-2">
                <p className="font-semibold text-white text-[20px] leading-snug">{t(`members.${m.id}.name`)}</p>
                <p className="text-[#CEA870] text-[14px] tracking-widest uppercase">{t(`members.${m.id}.role`)}</p>
                <p className="text-white/80 text-[14px] leading-relaxed mt-1">{t(`members.${m.id}.bio`)}</p>
              </div>
            </>); })()}
          </div>
        ) : null}
      </div>

      {/* Right grid */}
      <div className="lg:ml-10 flex flex-col gap-4 w-full">
        <h2 className="font-semibold italic text-[#CEA870] text-[28px] md:text-[36px] lg:text-[48px] tracking-[0.48px] mb-2">
          {t("ui.title")}
        </h2>
        <p className="text-white text-[16px] tracking-[0.16px] leading-relaxed max-w-[793px] mb-4">
          {t("ui.intro")}
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 md:gap-4">
          {members.map((member, i) => (
            <div
              key={member.id}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => setSelected(i)}
              className="flex flex-col gap-2 cursor-pointer group min-w-0"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm">
                <Image
                  src={member.image}
                  alt={t(`members.${member.id}.name`)}
                  fill
                  className={`object-cover object-top transition-all duration-500 ${hovered === i ? "scale-105 brightness-110" : "brightness-75"}`}
                />
              </div>
              <div className="flex flex-col gap-1">
                <p className={`font-semibold text-[13px] md:text-[15px] leading-snug transition-colors duration-300 [overflow-wrap:anywhere] ${hovered === i ? "text-[#CEA870]" : "text-white"}`}>
                  {t(`members.${member.id}.name`)}
                </p>
                <p className="text-[#CEA870] text-[10px] md:text-[12px] tracking-widest uppercase [overflow-wrap:anywhere]">{t(`members.${member.id}.role`)}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Advisors */}
        <p className="text-[#CEA870] text-xs tracking-[0.3em] uppercase mt-6 mb-2">{t("ui.advisors")}</p>
        <div className="flex flex-row gap-3 md:gap-4">
          {advisors.map((member, i) => (
            <div
              key={member.id}
              onMouseEnter={() => setHovered(members.length + i)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => setSelected(members.length + i)}
              className="flex flex-col gap-2 cursor-pointer group min-w-0 flex-1"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm">
                <Image
                  src={member.image}
                  alt={t(`members.${member.id}.name`)}
                  fill
                  className={`object-cover object-top transition-all duration-500 ${hovered === members.length + i ? "scale-105 brightness-110" : "brightness-75"}`}
                />
              </div>
              <div className="flex flex-col gap-1">
                <p className={`font-semibold text-[13px] md:text-[15px] leading-snug transition-colors duration-300 [overflow-wrap:anywhere] ${hovered === members.length + i ? "text-[#CEA870]" : "text-white"}`}>
                  {t(`members.${member.id}.name`)}
                </p>
                <p className="text-[#CEA870] text-[10px] md:text-[12px] tracking-widest uppercase [overflow-wrap:anywhere]">{t(`members.${member.id}.role`)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>

    {/* Mobile popup — md:hidden */}
    {selected !== null && (
      <div
        className="md:hidden fixed inset-0 z-50 flex items-center justify-center bg-[#002740]/80 backdrop-blur-md"
        onClick={() => setSelected(null)}
      >
        <div
          className="relative w-[85vw] max-w-[360px] overflow-hidden rounded-lg"
          onClick={e => e.stopPropagation()}
        >
          <div className="relative h-[420px] w-full">
            <Image
              src={selected < members.length ? members[selected].image : advisors[selected - members.length].image}
              alt={t(`members.${(selected < members.length ? members[selected] : advisors[selected - members.length]).id}.name`)}
              fill
              className="object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#002740]/95 via-[#002740]/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col gap-2">
              {(() => { const m = selected < members.length ? members[selected] : advisors[selected - members.length]; return (<>
                <p className="font-semibold text-white text-[18px] leading-snug">{t(`members.${m.id}.name`)}</p>
                <p className="text-[#CEA870] text-[12px] tracking-widest uppercase">{t(`members.${m.id}.role`)}</p>
                <p className="text-white/80 text-[13px] leading-relaxed mt-1">{t(`members.${m.id}.bio`)}</p>
              </>); })()}
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
