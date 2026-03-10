"use client";
import Image from "next/image";

export default function Members() {
  const team = [
    { name: "Khemupsorn Sirisukha", role: "Chief Executive Officer", image: "/pcherry.png" },
    { name: "Nattawin Chawaloephonshiya, PhD", role: "Chief Operating Officer", image: "/ajwid.png" },
    { name: "Muantawan Onnam", role: "Chief Product Officer", image: "/fiat.jpg" },
    { name: "Chonakporn Suthaporncharoenkhai", role: "Chief Financial Officer", image: "/zom.jpg" },
    { name: "Rattabhorn Sanitwong na Ayudhya", role: "Creative Director", image: "/tonmai.JPG" },
    { name: "Yanudhara Nuonpon", role: "Project Coordinator", image: "/film.jpg" },
    { name: "Nawapat Chothang", role: "Project Coordinator", image: "/Mart.jpg" },
    { name: "Pannita Karnjompanitcharoen", role: "Admin", image: "/praew.jpg" },
  ];

  return (
    <section className="max-w-6xl mx-auto px-4 py-24">
        <h2 className="text-[#CEA870] text-3xl mb-1 font-semibold">Team</h2>
        <p className="text-gray-200 font-light text-sm leading-relaxed max-w-2xl mb-6">
            Mission Earth works as a trusted partner in sustainable growth, bringing together expertise, process, and people.
            We design learning journeys and collaborative processes that translate complexity into clarity.
          </p>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {team.map((member, index) => (
          <div key={index} className="flex flex-col group min-w-0">
            <div className="relative aspect-[3/4] overflow-hidden rounded-sm mb-2 transition-transform duration-500 group-hover:scale-[1.02]">
              <Image
                src={member.image}
                alt={member.name}
                fill
                className="object-cover opacity-100 group-hover:opacity-90 transition-opacity duration-500"
              />
            </div>
            <h3 className="text-white text-[11px] font-bold mb-0.5 tracking-wide leading-snug [overflow-wrap:anywhere]">
              {member.name}
            </h3>
            <p className="text-[#CEA870] text-[9px] font-light tracking-widest uppercase [overflow-wrap:anywhere]">
              {member.role}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}