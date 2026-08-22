import { pageMetadata } from "@/lib/seo";
export const viewport = {
  themeColor: "#e8dcc8",
};

const BASE_METADATA = {
  title: "เด็กสร้างน่าน ปีที่ 2 | Mission Earth",
  description:
    "โครงการเด็กสร้างน่าน ปีที่ 2 Theme: ปลูกความคิด เพื่อชีวิตแห่งป่าน่าน สำหรับเยาวชนอายุ 15–18 ปี ในจังหวัดน่าน เปิดรับสมัครแล้ววันนี้ถึง 26 มิถุนายน 2569",
  keywords: [
    "เด็กสร้างน่าน",
    "เด็กสร้างน่าน ปีที่ 2",
    "bootcamp น่าน",
    "เยาวชนน่าน",
    "Mission Earth",
    "ป่าน่าน",
    "โครงการเยาวชน",
    "จุฬาลงกรณ์มหาวิทยาลัย",
    "Chula MOOC",
    "ผู้พิทักษ์ป่าต้นน้ำ",
  ],
  openGraph: {
    title: "เด็กสร้างน่าน ปีที่ 2 | Mission Earth",
    description:
      "โครงการ Bootcamp เยาวชนน่าน สมัครได้ถึง 26 มิถุนายน 2569 สำหรับน้อง ๆ อายุ 15–18 ปี ในจังหวัดน่าน",
    url: "https://www.missionearth.co/activities/dek-sang-nan-2",
    siteName: "Mission Earth",
    images: [
      {
        url: "https://www.missionearth.co/image/activities/dek-sang-nan-2/component/popup-register.png",
        width: 1200,
        height: 630,
        alt: "เด็กสร้างน่าน ปีที่ 2",
      },
    ],
    locale: "th_TH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "เด็กสร้างน่าน ปีที่ 2 | Mission Earth",
    description:
      "โครงการ Bootcamp เยาวชนน่าน สมัครได้ถึง 26 มิถุนายน 2569",
    images: [
      "https://www.missionearth.co/image/activities/dek-sang-nan-2/component/popup-register.png",
    ],
  },
};

/* canonical เดิมเขียนตายตัวชี้ไป /activities/dek-sang-nan-2 ซึ่งเฟส 2 ทำให้เด้ง 308 ไปที่อื่นแล้ว
   จึงให้ lib/seo.js สร้างให้ตามภาษาแทน ส่วนข้อความคงของเดิมไว้ทั้งหมด */
export async function generateMetadata({ params }) {
  const { locale } = await params;
  const seo = pageMetadata({
    locale,
    path: "/activities/dek-sang-nan-2",
    description: BASE_METADATA.description,
  });
  return { ...BASE_METADATA, alternates: seo.alternates, openGraph: { ...BASE_METADATA.openGraph, url: seo.alternates.canonical } };
}

export default function Layout({ children }) {
  return children;
}

