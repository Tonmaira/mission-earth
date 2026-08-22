import { pageMetadata } from "@/lib/seo";
export const viewport = {
  themeColor: "#f0eee9",
};

const BASE_METADATA = {
  title: "Ekiden — Saraburi Cross-Country Relay Run | Mission Earth",
  description:
    "Mission Earth Ekiden — Saraburi Cross-Country Relay Run วิ่งผลัดครอสคันทรีท่ามกลางธรรมชาติ Connect To Nature",
  keywords: [
    "Ekiden",
    "Relay Run",
    "Cross-Country",
    "Saraburi",
    "วิ่งผลัด",
    "Mission Earth",
    "trail run",
  ],
  openGraph: {
    title: "Ekiden — Saraburi Cross-Country Relay Run | Mission Earth",
    description:
      "Mission Earth Ekiden — Saraburi Cross-Country Relay Run วิ่งผลัดครอสคันทรีท่ามกลางธรรมชาติ",
    url: "https://www.missionearth.co/ekiden",
    siteName: "Mission Earth",
    locale: "th_TH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ekiden — Saraburi Cross-Country Relay Run | Mission Earth",
    description:
      "Mission Earth Ekiden — Saraburi Cross-Country Relay Run วิ่งผลัดครอสคันทรีท่ามกลางธรรมชาติ",
  },
};

/* canonical เดิมเขียนตายตัวชี้ไป /ekiden ซึ่งเฟส 2 ทำให้เด้ง 308 ไปที่อื่นแล้ว
   จึงให้ lib/seo.js สร้างให้ตามภาษาแทน ส่วนข้อความคงของเดิมไว้ทั้งหมด */
export async function generateMetadata({ params }) {
  const { locale } = await params;
  const seo = pageMetadata({
    locale,
    path: "/ekiden",
    description: BASE_METADATA.description,
  });
  return { ...BASE_METADATA, alternates: seo.alternates, openGraph: { ...BASE_METADATA.openGraph, url: seo.alternates.canonical } };
}

export default function Layout({ children }) {
  return children;
}

