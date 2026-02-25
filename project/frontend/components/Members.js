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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8">
        {team.map((member, index) => (
          <div key={index} className="flex flex-col group">
            {/* 1. เพิ่ม relative ตรงนี้เพื่อให้ Image fill ทำงานได้ถูกต้อง */}
            <div className="relative aspect-[3/3.5] bg-white mb-2 overflow-hidden rounded-sm transition-transform duration-500 group-hover:scale-[1.02]">
              <Image 
                src={member.image} 
                alt={member.name} 
                fill 
                /* 2. ปรับ opacity เป็น 100% (หรือ 90%) เพื่อให้เห็นหน้าทีมงานชัดเจน ไม่ดูเป็น "เงา" */
                className="object-cover opacity-100 group-hover:opacity-90 transition-opacity duration-500"
              />
            </div>
            
            <h3 className="text-white text-sm font-bold mb-1 tracking-wide">
              {member.name}
            </h3>
            {/* 3. ใช้สีทอง #CEA870 ตาม CI ของ Mission Earth */}
            <p className="text-[#CEA870] text-xs font-light tracking-widest uppercase">
              {member.role}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}