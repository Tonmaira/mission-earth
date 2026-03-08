"use client";
import ScrollReveal from "@/components/ScrollReveal";
import Image from 'next/image';


export default function AboutUsPre() {
    return (
    <main className="max-w-flex mx-auto">

        {/* head hero session */}
        <section 
        className="relative min-h-screen overflow-hidden [clip-path:inset(0)] py-35"
        > 
          {/* 1. Background Layer (เหมือนเลเยอร์ล่างสุดใน Figma) */}
          <div className="absolute top-0 bottom-0 w-full h-20 bg-gradient-to-b from-[#002740] to-transparent z-10 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-[#002740] to-transparent z-10 pointer-events-none" />
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
          <div className="relative z-10 w-full max-w-6xl mx-auto px-4 py-40">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-12 items-center">
              <ScrollReveal>
                 <div className="p-0">
                  
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
                    About Us
                  </button>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

    </main>
    )
}