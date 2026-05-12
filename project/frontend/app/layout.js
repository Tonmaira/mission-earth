import { Poppins, Noto_Sans_Thai } from "next/font/google";
import "./globals.css";
import Image from 'next/image';
import { LanguageProvider } from "@/lib/LanguageContext";

export const metadata = {
  title: "Mission Earth",
  description: "Your Trusted Partner in Sustainable Growth, Empowered by Experts.",
  icons: {
    icon: [{ url: "/icon/goldenme.png", type: "image/png" }],
    shortcut: "/icon/goldenme.png",
    apple: "/icon/goldenme.png",
  },
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
        </LanguageProvider>
      </body>
    </html>
  );
}
