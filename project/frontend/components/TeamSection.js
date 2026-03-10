"use client";
import { useState } from "react";
import Image from "next/image";

const members = [
  {
    name: "Khemupsorn Sirisukha",
    role: "Chief Executive Officer",
    image: "/pcherry.png",
    bio: "Leading Mission Earth with a vision to make sustainability a way of life for individuals and organizations across Thailand.",
  },
  {
    name: "Nattawin Chawaloephonshiya, PhD",
    role: "Chief Operating Officer",
    image: "/ajwid.png",
    bio: "Driving operational excellence with deep expertise in environmental science and sustainable development.",
  },
  {
    name: "Muantawan Onnam",
    role: "Chief Product Officer",
    image: "/fiat.jpg",
    bio: "Crafting impactful learning experiences and sustainability programs that translate complexity into clarity.",
  },
  {
    name: "Chonakporn Suthaporncharoenkhai",
    role: "Chief Financial Officer",
    image: "/zom.jpg",
    bio: "Ensuring Mission Earth's financial health while supporting our mission to grow sustainable impact.",
  },
  {
    name: "Rattabhorn Sanitwong na Ayudhya",
    role: "Creative Director",
    image: "/tonmai.JPG",
    bio: "Shaping the visual identity and creative direction of Mission Earth across all platforms and activations.",
  },
  {
    name: "Yanudhara Nuonpon",
    role: "Project Coordinator",
    image: "/film.jpg",
    bio: "Coordinating projects end-to-end to ensure every activity runs smoothly and delivers meaningful impact.",
  },
  {
    name: "Nawapat Chothang",
    role: "Project Coordinator",
    image: "/Mart.jpg",
    bio: "Supporting communities and partners in bringing sustainability initiatives to life on the ground.",
  },
  {
    name: "Pannita Karnjompanitcharoen",
    role: "Admin",
    image: "/praew.jpg",
    bio: "Keeping Mission Earth running day-to-day with care, precision, and a passion for our shared mission.",
  },
];

const advisors = [
  {
    name: "Vitchayut Tupwongse, PhD",
    role: "Advisor",
    image: "/advisor-vitchayut.jpg",
    bio: "Providing strategic guidance and expertise to advance Mission Earth's sustainability mission.",
  },
  {
    name: "On-anong Larpparisudthi, PhD",
    role: "Advisor",
    image: "/advisor-onanong.jpg",
    bio: "Contributing academic expertise and research insight to shape Mission Earth's programs and impact.",
  },
  {
    name: "Chuchart Vinitwatanakhun, MD",
    role: "Senior Advisor",
    image: "/advisor-chuchart.jpg",
    bio: "Guiding Mission Earth with senior-level expertise in health, environment, and sustainable development.",
  },
];

export default function TeamSection() {
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
              <Image src={m.image} alt={m.name} fill className="object-cover object-top transition-all duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#002740]/90 via-[#002740]/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col gap-2">
                <p className="font-semibold text-white text-[20px] leading-snug">{m.name}</p>
                <p className="text-[#CEA870] text-[14px] tracking-widest uppercase">{m.role}</p>
                <p className="text-white/80 text-[14px] leading-relaxed mt-1">{m.bio}</p>
              </div>
            </>); })()}
          </div>
        ) : null}
      </div>

      {/* Right grid */}
      <div className="lg:ml-10 flex flex-col gap-4 w-full">
        <h2 className="font-semibold italic text-[#CEA870] text-[28px] md:text-[36px] lg:text-[48px] tracking-[0.48px] mb-2">
          Our Team
        </h2>
        <p className="text-white text-[16px] tracking-[0.16px] leading-relaxed max-w-[793px] mb-4">
          Mission Earth is a passionate team of environmental experts and dedicated partners committed
          to making sustainability accessible to everyone.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 md:gap-4">
          {members.map((member, i) => (
            <div
              key={member.name}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => setSelected(i)}
              className="flex flex-col gap-2 cursor-pointer group min-w-0"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className={`object-cover object-top transition-all duration-500 ${hovered === i ? "scale-105 brightness-110" : "brightness-75"}`}
                />
              </div>
              <div className="flex flex-col gap-1">
                <p className={`font-semibold text-[13px] md:text-[15px] leading-snug transition-colors duration-300 [overflow-wrap:anywhere] ${hovered === i ? "text-[#CEA870]" : "text-white"}`}>
                  {member.name}
                </p>
                <p className="text-[#CEA870] text-[10px] md:text-[12px] tracking-widest uppercase [overflow-wrap:anywhere]">{member.role}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Advisors */}
        <p className="text-[#CEA870] text-xs tracking-[0.3em] uppercase mt-6 mb-2">Advisors</p>
        <div className="flex flex-row gap-3 md:gap-4">
          {advisors.map((member, i) => (
            <div
              key={member.name}
              onMouseEnter={() => setHovered(members.length + i)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => setSelected(members.length + i)}
              className="flex flex-col gap-2 cursor-pointer group min-w-0 flex-1"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className={`object-cover object-top transition-all duration-500 ${hovered === members.length + i ? "scale-105 brightness-110" : "brightness-75"}`}
                />
              </div>
              <div className="flex flex-col gap-1">
                <p className={`font-semibold text-[13px] md:text-[15px] leading-snug transition-colors duration-300 [overflow-wrap:anywhere] ${hovered === members.length + i ? "text-[#CEA870]" : "text-white"}`}>
                  {member.name}
                </p>
                <p className="text-[#CEA870] text-[10px] md:text-[12px] tracking-widest uppercase [overflow-wrap:anywhere]">{member.role}</p>
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
              alt={selected < members.length ? members[selected].name : advisors[selected - members.length].name}
              fill
              className="object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#002740]/95 via-[#002740]/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col gap-2">
              {(() => { const m = selected < members.length ? members[selected] : advisors[selected - members.length]; return (<>
                <p className="font-semibold text-white text-[18px] leading-snug">{m.name}</p>
                <p className="text-[#CEA870] text-[12px] tracking-widest uppercase">{m.role}</p>
                <p className="text-white/80 text-[13px] leading-relaxed mt-1">{m.bio}</p>
              </>); })()}
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
