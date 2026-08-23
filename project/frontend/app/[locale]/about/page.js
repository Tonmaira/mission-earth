import LocaleLink from "@/components/LocaleLink";
import NavbarSimple from "@/components/NavbarSimple";
import FooterSection from "@/components/FooterSection";
import Image from "next/image";
import TeamSection from "@/components/TeamSection";
import { pageMetadata, seoFor } from "@/lib/seo";
import { getTranslations, setRequestLocale } from "next-intl/server";

// metadata ของหน้านี้ — canonical กับ hreflang สร้างจาก lib/seo.js ที่เดียว
export async function generateMetadata({ params }) {
  const { locale } = await params;
  return pageMetadata({ locale, path: "/about", ...seoFor("/about", locale) });
}

export default async function AboutPage({ params }) {
  /* server component แปลได้ตั้งแต่ฝั่งเซิร์ฟเวอร์ ไม่ต้องส่ง messages ลงไปที่เบราว์เซอร์เลย
     ต้องส่ง locale เข้าไปเอง — getTranslations() เปล่า ๆ จะไม่รู้ว่ากำลังเรนเดอร์ภาษาไหน
     ตอนที่ Next สร้างหน้าไว้ล่วงหน้า แล้วตกไปใช้ภาษาเริ่มต้นทั้งสอง URL */
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "about" });

  return (
    <main className="min-h-screen bg-[#002740] text-white">
      <NavbarSimple />

      {/* 1. Welcome */}
      <section className="flex flex-col justify-center px-6 md:px-12 lg:px-[144px] py-24 pt-32 md:pt-40">
        <h1 className="font-semibold italic text-[#CEA870] text-[28px] md:text-[36px] lg:text-[48px] tracking-[0.48px] mb-6">
          {t("welcomeTitle")}
        </h1>
        <p className="text-white text-[14px] md:text-[15px] lg:text-[16px] tracking-[0.16px] leading-relaxed">
          {t("welcomeBody")}
        </p>
      </section>

      {/* 2. Vision + Mission */}
      <section className="px-6 md:px-12 lg:px-[144px] py-[40px]">
        <div className="flex flex-col lg:flex-row gap-[10px] lg:items-center">
          <div className="hidden lg:block shrink-0 w-[424px]" />
          <div className="lg:ml-10 flex flex-col gap-[28px] w-full lg:w-[662px]">
            <div>
              <h2 className="font-semibold italic text-[#CEA870] text-[28px] md:text-[36px] lg:text-[48px] tracking-[0.48px] mb-2">
                {t("visionTitle")}
              </h2>
              <p className="text-white text-[14px] md:text-[15px] lg:text-[16px] tracking-[0.16px] leading-relaxed">
                {t("visionBody")}
              </p>
            </div>
            <div>
              <h2 className="font-semibold italic text-[#CEA870] text-[28px] md:text-[36px] lg:text-[48px] tracking-[0.48px] mb-4">
                {t("missionTitle")}
              </h2>
              <div className="flex flex-col gap-[10px]">
                {t.raw("missionPoints").map((item) => (
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
              {t("partnersTitle")}
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
                {t("whatWeDoTitle")}
              </h2>
              <p className="text-white text-[14px] md:text-[15px] lg:text-[16px] tracking-[0.16px] leading-relaxed">
                {t("whatWeDoBody")}
              </p>
            </div>
            <LocaleLink href="/portfolio" className="border border-[#CEA870] text-[#CEA870] px-[20px] h-[40px] rounded-full text-[14px] lg:text-[16px] hover:bg-[#CEA870] hover:text-[#002740] transition-all duration-500 w-fit flex items-center">
              {t("seeWork")}
            </LocaleLink>
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
                {t("contactTitle")}
              </h2>
              <p className="text-white text-[14px] md:text-[15px] lg:text-[16px] tracking-[0.16px] leading-relaxed">
                {t("contactBody")}
              </p>
            </div>
            <LocaleLink href="/contact" className="border border-[#CEA870] text-[#CEA870] px-[20px] h-[40px] rounded-full text-[14px] lg:text-[16px] hover:bg-[#CEA870] hover:text-[#002740] transition-all duration-500 w-fit flex items-center">
              {t("contactCta")}
            </LocaleLink>
          </div>
        </div>
      </section>

      <FooterSection />
    </main>
  );
}
