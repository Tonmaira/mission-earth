import FooterSection from "@/components/FooterSection";
import Navbar from "@/components/Navbar";
import SocialMediaPack from "@/components/SocialMediaPack";
import ScrollRevealDown from "@/components/ScrollRevealDown";
import AboutUsPre from '@/components/AboutUsPre';
import HighlightService from '@/components/HighlightService';
import Image from 'next/image';
import { ServicesCard } from '@/components/ServiceData';
import ExploreActivities from "@/components/ExploreActivities";
import EarthFeedSection from "@/components/earthfeed/EarthFeedSection";
import SuccessCaseSection from "@/components/SuccessCaseSection";
import ScrollRestore from "@/components/ScrollRestore";
export default function Home() {
  return (
    /* มือถือ — ไม่ snap แล้ว section สูงตามเนื้อหา เลื่อนยาวเป็นหน้าเดียวตามปกติ
       md ขึ้นไป — snap ทีละ section เต็มจอเหมือนเดิม
       ตัวเลื่อนจึงเป็นคนละตัวกัน ดู lib/pageScroll.js */
    <main className="min-h-screen bg-[#002740] text-white md:snap-y md:snap-mandatory md:overflow-y-scroll md:h-screen">
      {/* กด back กลับมาแล้วให้อยู่ตำแหน่งเดิม — เดสก์ท็อป main เป็นตัวเลื่อนเอง เบราว์เซอร์เลยจำให้ไม่ได้ */}
      <ScrollRestore storageKey="home-scroll" />
      <Navbar />
      <SocialMediaPack />

      {/* --- Hero / Logo Section --- */}
      <section className="flex flex-col items-center justify-center h-dvh w-full px-4 py-10 md:snap-start md:snap-always">

  <div className="flex flex-col items-center">
    <div className="relative w-70 h-25 md:w-[349.81px] md:h-[109px]"> 
      <Image
        src="/full-logo-me.svg" 
        alt="Mission Earth Central Logo"
        fill
        className="object-contain drop-shadow-[0_0_0px_rgba(206,168,112,0.2)]"
      />
    </div>
    <div className="max-w-80 text-center space-y-24 mt-0.3 md:mt-2">
            <ScrollRevealDown>
            <div className="space-y-1 md:space-y-2">
            <p className="text-[#cea870] text-[13px] md:text-sm leading-relaxed">
              Your Trusted Partner in Sustainable Growth,
Empowered by Experts.
            </p>
            </div> 
            </ScrollRevealDown>
  </div>
  </div>
  </section>

      {/* --- About Us --- */}
      <section className="md:snap-start md:snap-always md:h-dvh md:overflow-hidden">
          <AboutUsPre />
      </section>
      {/* --- Highlight Service --- */}
      <section className="md:snap-start md:snap-always md:h-dvh md:overflow-hidden">
      {/* 2. ต้องมี services={...} และตัวแปรข้างในต้องตรงกับที่ Import มา */}
      <HighlightService services={ServicesCard} />
    </section>

      {/* --- Success Cases --- */}
      <section className="md:snap-start md:snap-always md:h-dvh md:overflow-hidden">
        <SuccessCaseSection />
      </section>

    {/* --- Activities --- */}
      <section className="md:snap-start md:snap-always md:h-dvh md:overflow-hidden">
          <ExploreActivities />
      </section>

      {/* --- Earth Feed --- */}
      <section className="md:snap-start md:snap-always md:h-dvh md:overflow-hidden">
        <EarthFeedSection />
      </section>

      {/* --- Service Section 
            <div className="hidden md:block">
              <ServicesSection />
            </div>
              <SlideServices /> --- */}

      {/* --- Footer --- */}
      <section className="md:snap-start md:snap-always">
      <FooterSection />
      </section>
    </main>
  );
}