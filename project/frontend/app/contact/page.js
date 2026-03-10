import NavbarSimple from "@/components/NavbarSimple";
import FooterSection from "@/components/FooterSection";
import IconFacebook from "@/components/IconFacebook";
import IconInstagram from "@/components/IconInstagram";
import IconLine from "@/components/IconLine";
import Link from "next/link";

const socials = [
  { name: "Facebook", href: "https://www.facebook.com/profile.php?id=61567764698039", Icon: IconFacebook, label: "Mission Earth" },
  { name: "Instagram", href: "https://instagram.com/missionearth.co/", Icon: IconInstagram, label: "@missionearth.co" },
  { name: "Line", href: "https://lin.ee/MDN9uJ4", Icon: IconLine, label: "@missionearth" },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#002740] text-white">
      <NavbarSimple />

      {/* Header */}
      <section className="px-6 md:px-12 lg:px-[144px] pt-32 md:pt-40 pb-16">
        <h1 className="font-semibold italic text-[#CEA870] text-[28px] md:text-[36px] lg:text-[48px] tracking-[0.48px] mb-4">
          Contact Us
        </h1>
        <p className="text-white text-[14px] md:text-[16px] tracking-[0.16px] leading-relaxed max-w-[600px]">
          Ready to bring sustainability to your organization or community? Let&apos;s talk — our team
          is here to help you find the right solution, big or small.
        </p>
      </section>

      {/* Contact Info */}
      <section className="px-6 md:px-12 lg:px-[144px] pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">

          {/* Address */}
          <div className="flex flex-col gap-4">
            <p className="text-[#CEA870] text-xs tracking-[0.3em] uppercase font-semibold">Address</p>
            <div className="border-t border-white/10 pt-4">
              <p className="text-white text-[15px] leading-relaxed">
                MISSION EARTH Co., Ltd.<br />
                88/5 Soi Phahon Yothin 7,<br />
                Phahon Yothin Rd. Phayathai,<br />
                Bangkok 10400
              </p>
            </div>
          </div>

          {/* Phone & Email */}
          <div className="flex flex-col gap-4">
            <p className="text-[#CEA870] text-xs tracking-[0.3em] uppercase font-semibold">Get in Touch</p>
            <div className="border-t border-white/10 pt-4 flex flex-col gap-3">
              <div>
                <p className="text-white/40 text-[11px] tracking-widest uppercase mb-1">Phone</p>
                <a href="tel:0925253595" className="text-white text-[15px] hover:text-[#CEA870] transition-colors duration-200">
                  092 525 3595
                </a>
              </div>
              <div>
                <p className="text-white/40 text-[11px] tracking-widest uppercase mb-1">Email</p>
                <a href="mailto:info@missionearth.co" className="text-white text-[15px] hover:text-[#CEA870] transition-colors duration-200">
                  info@missionearth.co
                </a>
              </div>
              <div>
                <p className="text-white/40 text-[11px] tracking-widest uppercase mb-1">Line</p>
                <a href="https://lin.ee/MDN9uJ4" target="_blank" rel="noopener noreferrer" className="text-white text-[15px] hover:text-[#CEA870] transition-colors duration-200">
                  @missionearth
                </a>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="flex flex-col gap-4">
            <p className="text-[#CEA870] text-xs tracking-[0.3em] uppercase font-semibold">Social Media</p>
            <div className="border-t border-white/10 pt-4 flex flex-col gap-4">
              {socials.map(({ name, href, Icon, label }) => (
                <Link key={name} href={href} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 group w-fit">
                  <Icon className="w-5 h-5 text-[#CEA870] group-hover:text-white transition-colors duration-200" />
                  <span className="text-white text-[15px] group-hover:text-[#CEA870] transition-colors duration-200">{label}</span>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </section>

      <FooterSection />
    </main>
  );
}
