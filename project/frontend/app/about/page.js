
import NavbarSimple from "@/components/NavbarSimple";
import ScrollReveal from "@/components/ScrollReveal";
import TranslateIcon from "@/components/TranslateIcon";
import Members from "@/components/Members";
import VisionMission from "@/components/VisionMission";
import Image from "next/image";
import FooterSection from "@/components/FooterSection";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#002740] text-white">

      {/* Navbar */}
         <NavbarSimple />

      {/* Section 1: Hero - หัวข้อหน้า */}
      <section className="pt-40 pb-20 px-4 text-center">
        <ScrollReveal>
          <h1 className="text-[#CEA870] text-4xl md:text-3xl font-regular tracking-[0.3em] uppercase mb-6">
            About Us
          </h1>
          <div className="w-20 h-[1px] bg-[#CEA870] mx-auto mb-10"></div>
          <p className="max-w-3xl mx-auto text-gray-300 text-lg font-light leading-relaxed">
            Mission Earth, Your Trusted Partner in Sustainable Growth, Empowered by Experts.
          </p>
        </ScrollReveal>
      </section>

      {/* Section 2 */}
      <section className="relative py-24 overflow-hidden [clip-path:inset(0)] py-35"> 
  {/* 1. Background Layer (เหมือนเลเยอร์ล่างสุดใน Figma) */}
  <div className="fixed inset-0 z-0">
    <Image 
      src="/bggettoknow.png" // ใส่ Path รูปพื้นหลังของคุณตรงนี้ครับ
      alt="Mission Earth Background"
      fill
      className="object-cover"
      priority
    />
    {/* 2. Overlay: สำคัญมากเพื่อให้ตัวหนังสืออ่านออก (Contrast) */}
    <div className="absolute inset-0 bg-[#001f33]/85 backdrop-blur-[0px]"></div>
  </div>

  {/* 3. Content Layer (ต้องใส่ z-10 เพื่อให้ลอยเหนือรูป) */}
  <div className="relative z-10 max-w-6xl mx-auto px-4">
    <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-12 items-center">
      <ScrollReveal>
         <div className="p-6">
          
          </div>
      </ScrollReveal>

      <ScrollReveal>
        <div className="space-y-8">
          <div className="space-y-2">
            <h2 className="text-[#CEA870] text-sm tracking-[0.4em] uppercase font-medium">Get to know</h2>
            <h3 className="text-4xl md:text-5xl font-semibold text-white italic">
              <span className="text-[#CEA870]">Mission Earth</span>
            </h3>
          </div>
          
          <p className="text-gray-200 font-light text-lg leading-relaxed max-w-2xl">
            Mission Earth works as a trusted partner in sustainable growth, bringing together expertise, process, and people.
            We design learning journeys and collaborative processes that translate complexity into clarity.
          </p>

          <button className="border border-[#CEA870] text-[#CEA870] px-8 py-3 rounded-full hover:bg-[#CEA870] hover:text-white transition-all duration-500 uppercase tracking-widest text-xs font-semibold">
            Join Our Journey
          </button>
        </div>
      </ScrollReveal>
    </div>
  </div>
</section>

        {/* --- Vision & Mission --- */}
              <VisionMission />

      {/* Section 3: Members */}
      <section className="max-w-6xl mx-auto px-4 py-/0">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8">
          <div className="p-6">
          
          </div>
          <div className="p-6">
          <Members />
          </div>

      </div>
      </section>

      {/* Section 3: Our Philosophy - ปรัชญาของเรา */}
      <section className="py-24 px-4 max-w-5xl mx-auto">
        <ScrollReveal>
          <div className="text-center space-y-12">
            <h2 className="text-2xl font-light tracking-widest text-[#CEA870]">Our Philosophy</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="space-y-4">
                <div className="text-[#CEA870] text-3xl">01</div>
                <h4 className="font-medium">Biodiversity</h4>
                <p className="text-sm text-gray-400 font-light">มุ่งเน้นการรักษาความหลากหลายทางชีวภาพให้คงอยู่</p>
              </div>
              <div className="space-y-4">
                <div className="text-[#CEA870] text-3xl">02</div>
                <h4 className="font-medium">Green Finance</h4>
                <p className="text-sm text-gray-400 font-light">ขับเคลื่อนเศรษฐกิจด้วยแนวคิดการเงินสีเขียวที่ยั่งยืน</p>
              </div>
              <div className="space-y-4">
                <div className="text-[#CEA870] text-3xl">03</div>
                <h4 className="font-medium">Urban Design</h4>
                <p className="text-sm text-gray-400 font-light">ออกแบบพื้นที่เมืองให้สอดคล้องกับธรรมชาติและมนุษย์</p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* --- Footer --- */}
            <FooterSection />
    </main>
  );
}