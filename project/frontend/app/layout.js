import { Poppins, Noto_Sans_Thai } from "next/font/google";
import "./globals.css";
import Image from 'next/image';
import Link from 'next/link';
import { LanguageProvider } from "@/lib/LanguageContext";

export const metadata = {
  title: "Mission Earth",
  description: "Your Trusted Partner in Sustainable Growth, Empowered by Experts.",
  icons: {
    icon: [{ url: "/icon/goldenme.png", type: "image/png" }],
    shortcut: "/icon/goldenme.png",
    apple: "/icon/goldenme.png",
  },
};

export const viewport = {
  themeColor: "#002740",
};

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

const notoTh = Noto_Sans_Thai({
  subsets: ["thai"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-noto-sans-thai",
});

export default function RootLayout({ children }) {
  return (
    <html lang="th" className={`${poppins.variable} ${notoTh.variable}`}>
      <body className="font-sans antialiased bg-[#002740]">
        <LanguageProvider>
          {children}
          <Link
            href="/activities/dek-sang-nan-2"
            className="fixed bottom-5 right-5 z-[999] hover:scale-105 transition-transform duration-200 drop-shadow-xl"
          >
            <Image src="/popup-register.svg" alt="สมัครเข้าร่วม Bootcamp เด็กสร้างน่าน" width={180} height={80} />
          </Link>
        </LanguageProvider>
      </body>
    </html>
  );
}
