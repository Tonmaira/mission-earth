import NavbarSimple from "@/components/NavbarSimple";
import FooterSection from "@/components/FooterSection";
import SlideServices from "@/components/SlideServices";

export default function AllServicesPage() {
  return (
    <main className="min-h-screen bg-[#002740] text-white">
      <NavbarSimple />

      {/* Header Section */}
      <section className="flex flex-col justify-center px-6 md:px-12 lg:px-[144px] py-24 pt-32 md:pt-40">
        <h1 className="font-semibold italic text-[#CEA870] text-[28px] md:text-[36px] lg:text-[48px] tracking-[0.48px] mb-4">
          Our Services
        </h1>
        <p className="text-white text-[14px] md:text-[16px] tracking-[0.16px] leading-relaxed max-w-[793px]">
          Discover the world of ESG through our multi-dimensional services, tailored for everyone
          from global businesses to individual explorers. From expert training and events to
          sustainable tourism and interactive board games, we make sustainability actionable for all.
        </p>
      </section>

      {/* Services Slide */}
      <SlideServices />

      <FooterSection />
    </main>
  );
}