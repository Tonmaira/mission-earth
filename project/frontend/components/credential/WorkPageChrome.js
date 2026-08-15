import Link from "next/link";
import NavbarSimple from "@/components/NavbarSimple";
import FooterSection from "@/components/FooterSection";

/**
 * Frame for the public work and year pages under /portfolio.
 *
 * These carry the site's own navbar and footer rather than the deck's chrome:
 * they are part of the public portfolio, and the credential deck stays
 * unlisted. Nothing here links back into /credential.
 */
export default function WorkPageChrome({ children }) {
  return (
    <main className="min-h-screen bg-[#002740] text-white">
      <NavbarSimple />

      <div className="px-6 pb-20 pt-32 md:px-12 md:pt-40 lg:px-[144px]">
        <Link
          href="/portfolio"
          className="text-[11px] uppercase tracking-[0.25em] text-white/50 transition-colors hover:text-[#CEA870]"
        >
          ← Back to portfolio
        </Link>

        <div className="mt-10">{children}</div>
      </div>

      <FooterSection />
    </main>
  );
}
