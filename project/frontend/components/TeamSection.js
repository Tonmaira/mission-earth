"use client";
import { useState } from "react";
import Image from "next/image";

const team = [
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
            <Image
              src={team[hovered].image}
              alt={team[hovered].name}
              fill
              className="object-cover object-top transition-all duration-500"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#002740]/90 via-[#002740]/20 to-transparent" />
            {/* Info */}
            <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col gap-2">
              <p className="font-semibold text-white text-[20px] leading-snug">{team[hovered].name}</p>
              <p className="text-[#CEA870] text-[14px] tracking-widest uppercase">{team[hovered].role}</p>
              <p className="text-white/80 text-[14px] leading-relaxed mt-1">{team[hovered].bio}</p>
            </div>
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-x-2 gap-y-0">
          {team.map((member, i) => (
            <div
              key={member.name}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => setSelected(i)}
              className="flex flex-col gap-[15px] pb-[8px] px-[8px] w-full lg:w-[260px] cursor-pointer group"
            >
              <div className="relative aspect-[3/3.5] w-full overflow-hidden rounded-sm">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className={`object-cover object-top transition-all duration-500 ${hovered === i ? "scale-105 brightness-110" : "brightness-75"}`}
                />
              </div>
              <div className="flex flex-col gap-[4px] py-[8px]">
                <p className={`font-semibold text-[16px] transition-colors duration-300 ${hovered === i ? "text-[#CEA870]" : "text-white"}`}>
                  {member.name}
                </p>
                <p className="text-[#CEA870] text-[14px] tracking-widest uppercase">{member.role}</p>
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
              src={team[selected].image}
              alt={team[selected].name}
              fill
              className="object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#002740]/95 via-[#002740]/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col gap-2">
              <p className="font-semibold text-white text-[18px] leading-snug">{team[selected].name}</p>
              <p className="text-[#CEA870] text-[12px] tracking-widest uppercase">{team[selected].role}</p>
              <p className="text-white/80 text-[13px] leading-relaxed mt-1">{team[selected].bio}</p>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
