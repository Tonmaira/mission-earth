import Image from "next/image";
import Link from "next/link";
import IconInstagram from "@/components/IconInstagram";
import IconFacebook from "@/components/IconFacebook";
import IconLine from "@/components/IconLine";

const socials = [
  { name: "Facebook",  href: "https://www.facebook.com/profile.php?id=61567764698039", Icon: IconFacebook },
  { name: "Instagram", href: "https://instagram.com/missionearth.co/",                  Icon: IconInstagram },
  { name: "Line",      href: "https://lin.ee/MDN9uJ4",                                  Icon: IconLine },
];

const navLinks = [
  { label: "Home",     href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Contact",  href: "#contact" },
];

export default function FooterSection() {
  return (
    <footer className="bg-[#00375B] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 md:px-[144px] py-16 grid grid-cols-1 md:grid-cols-3 gap-12">

        {/* Col 1 — Logo + tagline */}
        <div className="flex flex-col gap-5">
          <div className="relative w-[160px] h-[50px]">
            <Image src="/full-logo-me.svg" alt="Mission Earth" fill className="object-contain object-left" />
          </div>
          <p className="text-white/50 text-[13px] leading-relaxed max-w-[260px]">
            Your Trusted Partner in Sustainable Growth, Empowered by Experts.
          </p>
          {/* Social icons */}
          <div className="flex gap-4 mt-2">
            {socials.map(({ name, href, Icon }) => (
              <Link key={name} href={href} target="_blank" rel="noopener noreferrer"
                className="group transition-transform hover:scale-110">
                <Icon className="w-6 h-6 text-[#CEA870] group-hover:text-white transition-all duration-300" />
              </Link>
            ))}
          </div>
        </div>

        {/* Col 2 — Nav links */}
        <div className="flex flex-col gap-3">
          <p className="text-[#CEA870] text-xs tracking-widest uppercase font-semibold mb-2">Navigation</p>
          {navLinks.map((l) => (
            <Link key={l.label} href={l.href}
              className="text-white/60 text-[14px] hover:text-[#CEA870] transition-colors duration-200 w-fit">
              {l.label}
            </Link>
          ))}
        </div>

        {/* Col 3 — Contact */}
        <div className="flex flex-col gap-3">
          <p className="text-[#CEA870] text-xs tracking-widest uppercase font-semibold mb-2">Contact</p>
          <p className="text-white/60 text-[14px] leading-relaxed">
            MISSION EARTH Co., Ltd.<br />
            88/5 Soi Phahon Yothin 7,<br />
            Phahon Yothin Rd. Phayathai,<br />
            Bangkok 10400
          </p>
          <div className="flex flex-col gap-1 mt-2">
            <a href="tel:0925253595" className="text-white/60 text-[14px] hover:text-[#CEA870] transition-colors duration-200">
              Tel. 092 525 3595
            </a>
            <a href="mailto:info@missionearth.co" className="text-white/60 text-[14px] hover:text-[#CEA870] transition-colors duration-200">
              info@missionearth.co
            </a>
            <p className="text-white/60 text-[14px]">Line: @missionearth</p>
          </div>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 py-5 px-6 md:px-[144px]">
        <p className="text-white/30 text-[12px] text-center">
          © {new Date().getFullYear()} Mission Earth Co., Ltd. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
