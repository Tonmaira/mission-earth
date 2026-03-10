import FooterSection from "@/components/FooterSection";
import Navbar from "@/components/Navbar";
import SocialMediaPack from "@/components/SocialMediaPack";
import ScrollRevealDown from "@/components/ScrollRevealDown";
import AboutUsPre from '@/components/AboutUsPre';
import HighlightService from '@/components/HighlightService';
import Image from 'next/image';
import { ServicesCard } from '@/components/ServiceData';
import EarthFeed from "@/components/earthfeed/EarthFeed";
import EarthFeedPanel from "@/components/earthfeed/EarthFeedPanel";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#002740] text-white snap-y snap-mandatory overflow-y-scroll h-screen">
      <Navbar />
      <SocialMediaPack />

      {/* --- Hero / Logo Section --- */}
      <section className="flex flex-col items-center justify-center h-dvh w-full px-4 py-10 snap-start snap-always">

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
      <section className="snap-start snap-always h-dvh overflow-hidden">
          <AboutUsPre />
      </section>
      {/* --- Highlight Service --- */}
      <section className="snap-start snap-always h-dvh overflow-hidden">
      {/* 2. ต้องมี services={...} และตัวแปรข้างในต้องตรงกับที่ Import มา */}
      <HighlightService services={ServicesCard} />
    </section>

    {/* --- Earth Feed --- */}
      <section className="snap-start snap-always h-dvh overflow-hidden">
          <EarthFeed />
      </section>

      {/* --- Earth Feed Panel (mobile only, stacked below) --- */}
      <section className="md:hidden snap-start snap-always h-dvh overflow-y-auto bg-[#002740] pt-[85px]">
        <EarthFeedPanel />
      </section>

      {/* --- Service Section 
            <div className="hidden md:block">
              <ServicesSection />
            </div>
              <SlideServices /> --- */}

      {/* --- Footer --- */}
      <section className="snap-start snap-always">
      <FooterSection />
      </section>
    </main>
  );
}