import { Poppins, Noto_Sans_Thai } from "next/font/google";
import "./globals.css";

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
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
