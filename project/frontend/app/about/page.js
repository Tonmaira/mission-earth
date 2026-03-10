import NavbarSimple from "@/components/NavbarSimple";
import FooterSection from "@/components/FooterSection";
import Image from "next/image";
import TeamSection from "@/components/TeamSection";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#002740] text-white">
      <NavbarSimple />

      {/* 1. Welcome */}
      <section className="flex flex-col justify-center px-6 md:px-12 lg:px-[144px] py-24 pt-32 md:pt-40">
        <h1 className="font-semibold italic text-[#CEA870] text-[28px] md:text-[36px] lg:text-[48px] tracking-[0.48px] mb-6">
          Welcome to Mission Earth
        </h1>
        <p className="text-white text-[14px] md:text-[15px] lg:text-[16px] tracking-[0.16px] leading-relaxed">
          We are a team of environmental experts and passionate partners on a mission to make sustainability
          a way of life. From ESG training to hands-on environmental activities, we bring knowledge,
          experience, and heart to everything we do — empowering individuals and organizations to take
          meaningful action for our planet. Together, let&apos;s build a greener, more sustainable future.
        </p>
      </section>

      {/* 2. Vision + Mission */}
      <section className="px-6 md:px-12 lg:px-[144px] py-[40px]">
        <div className="flex flex-col lg:flex-row gap-[10px] lg:items-center">
          <div className="hidden lg:block shrink-0 w-[424px]" />
          <div className="lg:ml-10 flex flex-col gap-[28px] w-full lg:w-[662px]">
            <div>
              <h2 className="font-semibold italic text-[#CEA870] text-[28px] md:text-[36px] lg:text-[48px] tracking-[0.48px] mb-2">
                Vision
              </h2>
              <p className="text-white text-[14px] md:text-[15px] lg:text-[16px] tracking-[0.16px] leading-relaxed">
                To be the trusted partner in sustainability training, empowering green economy with capability
                for lasting environmental impact and lead the transition to a greener future.
              </p>
            </div>
            <div>
              <h2 className="font-semibold italic text-[#CEA870] text-[28px] md:text-[36px] lg:text-[48px] tracking-[0.48px] mb-4">
                Mission
              </h2>
              <div className="flex flex-col gap-[10px]">
                {[
                  "To provide training on sustainability capability and expertise.",
                  "To create activities that deliver sustainability to communities",
                ].map((item) => (
                  <div key={item} className="flex gap-[10px] items-center">
                    <div className="w-[28px] h-[1px] bg-[#CEA870] shrink-0" />
                    <p className="text-white text-[14px] md:text-[15px] lg:text-[16px] tracking-[0.16px] leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Our Team */}
      <TeamSection />

      {/* 4. Partners */}
      <section className="px-6 md:px-12 lg:px-[144px] pb-[60px]">
        <div className="flex flex-col lg:flex-row gap-[10px]">
          <div className="hidden lg:block shrink-0 w-[424px]" />
          <div className="lg:ml-10 w-full">
            <h2 className="font-semibold italic text-[#CEA870] text-[28px] md:text-[36px] lg:text-[48px] tracking-[0.48px] mb-4">
              Partners
            </h2>
            <div className="flex flex-wrap gap-[10px] items-center">
              {[
                { name: "INCOMM", src: "/partner/incomm.png" },
                { name: "ROH",    src: "/partner/ROH.png" },
                { name: "Jimi",   src: "/partner/Jimi.png" },
                { name: "KUAIT",  src: "/partner/KUAIT.png" },
              ].map((p) => (
                <div key={p.name} className="relative h-[100px] w-[100px] md:h-[120px] md:w-[120px] lg:h-[140px] lg:w-[140px] bg-white rounded-sm p-2">
                  <Image src={p.src} alt={p.name} fill className="object-contain p-2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. What we do */}
      <section className="px-6 md:px-12 lg:px-[144px] pb-[60px]">
        <div className="flex flex-col lg:flex-row gap-[10px] lg:items-center">
          <div className="hidden lg:block shrink-0 w-[424px]" />
          <div className="lg:ml-10 flex flex-col gap-[32px] w-full lg:w-[718px]">
            <div>
              <h2 className="font-semibold italic text-[#CEA870] text-[28px] md:text-[36px] lg:text-[48px] tracking-[0.48px] mb-2">
                What we do
              </h2>
              <p className="text-white text-[14px] md:text-[15px] lg:text-[16px] tracking-[0.16px] leading-relaxed">
                From ESG training and nature camps to creative events and sustainable travel — we design
                experiences that make people care, learn, and take action. Backed by experts and trusted
                by leading organizations across Thailand.
              </p>
            </div>
            <a href="/portfolio" className="border border-[#CEA870] text-[#CEA870] px-[20px] h-[40px] rounded-full text-[14px] lg:text-[16px] hover:bg-[#CEA870] hover:text-[#002740] transition-all duration-500 w-fit flex items-center">
              See Our Work in Action
            </a>
          </div>
        </div>
      </section>

      {/* 6. Contact Us */}
      <section className="px-6 md:px-12 lg:px-[144px] pb-[60px]">
        <div className="flex flex-col lg:flex-row gap-[10px] lg:items-center">
          <div className="hidden lg:block shrink-0 w-[424px]" />
          <div className="lg:ml-10 flex flex-col gap-[32px] w-full lg:w-[718px]">
            <div>
              <h2 className="font-semibold italic text-[#CEA870] text-[28px] md:text-[36px] lg:text-[48px] tracking-[0.48px] mb-2">
                Contact Us
              </h2>
              <p className="text-white text-[14px] md:text-[15px] lg:text-[16px] tracking-[0.16px] leading-relaxed">
                Ready to bring sustainability to your organization or community? Let&apos;s talk! Our team
                is here to help you find the right solution — big or small.
              </p>
            </div>
            <a href="/contact" className="border border-[#CEA870] text-[#CEA870] px-[20px] h-[40px] rounded-full text-[14px] lg:text-[16px] hover:bg-[#CEA870] hover:text-[#002740] transition-all duration-500 w-fit flex items-center">
              Contact Us
            </a>
          </div>
        </div>
      </section>

      <FooterSection />
    </main>
  );
}
