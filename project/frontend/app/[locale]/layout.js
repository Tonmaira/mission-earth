import { Poppins, Noto_Sans_Thai } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { LOCALES, isLocale, DEFAULT_LOCALE } from "@/lib/locale";

/* บอก Next ว่ามีภาษาอะไรบ้าง เพื่อสร้างหน้าไว้ล่วงหน้าทั้งสองภาษาตอน build
   ถ้าไม่มีตัวนี้ ทุกหน้าจะกลายเป็น dynamic แล้วช้าลงทั้งเว็บ */
export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

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

/* layout นี้เป็น root layout ของทั้งเว็บ (มี html/body) แต่ย้ายมาอยู่ใต้ [locale]
   เพราะ lang ของ <html> ต้องเปลี่ยนตามภาษาใน URL — ตัวที่อยู่นอก [locale] อ่าน param ไม่ได้
   เดิมประกาศ lang="th" ตายตัวทั้งที่เนื้อหาเป็นอังกฤษ ซึ่งเป็นสัญญาณผิดที่ส่งให้ Google */
export default async function RootLayout({ children, params }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound(); // /xx/about ที่ไม่ใช่ภาษาที่รองรับ ต้องเป็น 404 ไม่ใช่หน้าเปล่า
  const lang = locale;

  // บอก next-intl ว่ากำลังเรนเดอร์ภาษาไหน เพื่อให้หน้ายังเป็น static ได้
  setRequestLocale(lang);
  const messages = await getMessages();

  return (
    <html lang={lang} className={`${poppins.variable} ${poppinsItalic.variable} ${notoTh.variable}`}>
      <body className="font-sans antialiased bg-[#002740]">
        <NextIntlClientProvider locale={lang} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
