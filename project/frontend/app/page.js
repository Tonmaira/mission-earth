import FooterSection from "@/components/FooterSection";
import IconCorrect from "@/components/IconCorrect";
import Navbar from "@/components/Navbar";
import ScrollReveal from "@/components/ScrollReveal";
import ScrollRevealDown from "@/components/ScrollRevealDown";
import ServicesSection from "@/components/ServicesSection"
import SlideServices from "@/components/SlideServices";
import VisionMission from "@/components/VisionMission";
import Image from 'next/image';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#002740] text-white">
      <Navbar />

      {/* --- Hero / Logo Section --- */}
      <section className="flex flex-col items-center justify-center min-h-[100vh] w-full px-4 py-10">

  <div className="flex flex-col items-center">
    <div className="relative w-80 h-40 md:w-[349.81px] md:h-[109px]"> 
      <Image
        src="/full-logo-me.svg" 
        alt="Mission Earth Central Logo"
        fill
        className="object-contain drop-shadow-[0_0_0px_rgba(206,168,112,0.2)]"
      />
    </div>
    <div className="max-w-80 text-center space-y-24 mt-2">
            <ScrollRevealDown>
            <div className="space-y-2">
            <p className="text-[#cea870] text-sm leading-relaxed">
              Your Trusted Partner in Sustainable Growth,
Empowered by Experts.
            </p>
            </div> 
            </ScrollRevealDown>
  </div>
  </div>
  </section>


      {/* --- Service Section --- */}
              <ServicesSection />
              <SlideServices />

      {/* --- Footer --- */}
      <FooterSection />
    </main>
  );
}