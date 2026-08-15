import { Poppins, Noto_Sans_Thai } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/LanguageContext";

export const metadata = {
  title: "Mission Earth",
  description: "Your Trusted Partner in Sustainable Growth, Empowered by Experts.",
};

export const viewport = {
  themeColor: "#002740",
};

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

// true italic, so browsers don't fake it by skewing the upright face.
// Not preloaded — only the credential cover asks for it.
const poppinsItalic = Poppins({
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["italic"],
  variable: "--font-poppins-italic",
  preload: false,
});

const notoTh = Noto_Sans_Thai({
  subsets: ["thai"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-noto-sans-thai",
});

export default function RootLayout({ children }) {
  return (
    <html lang="th" className={`${poppins.variable} ${poppinsItalic.variable} ${notoTh.variable}`}>
      <body className="font-sans antialiased bg-[#002740]">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
