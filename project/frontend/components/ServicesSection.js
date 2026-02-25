"use client";
import ScrollReveal from "@/components/ScrollReveal";
import Image from 'next/image';

export default function ServicesSection() {
  const services = [
            { title: "Course", desc: "หลักสูตรการเรียนรู้เพื่อความยั่งยืน", image: "/product-course.jpg" },
            { title: "Camp", desc: "ค่ายกิจกรรมสำหรับเยาวชนและผู้สนใจ", image: "/product-camp.jpg" },
            { title: "Sustainable Travel", desc: "การท่องเที่ยวเชิงอนุรักษ์", image: "/product-sustainable-tour.jpg" },
            { title: "Communication", desc: "การสื่อสารเพื่อสิ่งแวดล้อม", image: "/product-commu.jpg" },
            { title: "Event", desc: "กิจกรรมพิเศษและนิทรรศการ", image: "/product-event.jpg" },
            { title: "ESG Tools", desc: "เครื่องมือวัดผลด้านความยั่งยืน", image: "/product-esgtool.jpg" },
          ]

return (
<section className="max-w-6xl mx-auto px-4 py-20">
        <ScrollReveal>
        <h2 className="text-[#CEA870] text-3xl mb-12 font-semibold italic">Service</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">

          {services.map((item, index) => (
            <div key={index} className="relative group overflow-hidden rounded-lg aspect-[16/9] bg-gray-800 border border-gray-700">
              {/* Overlay Image Placeholder */}
              <Image src={item.image} alt={item.title} fill className="object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all"></div>
              
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-300 mb-4">{item.desc}</p>
                <button className="w-fit border border-white px-4 py-1 text-xs rounded hover:bg-white hover:text-black transition-colors">
                  ดูรายละเอียด
                </button>
              </div>
            </div>
          ))}
        </div>
        </ScrollReveal>
      </section>
);
};