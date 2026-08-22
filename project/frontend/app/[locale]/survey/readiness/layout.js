import { pageMetadata, seoFor } from "@/lib/seo";

/* หน้านี้เป็น client component จึง export generateMetadata เองไม่ได้
   ต้องมี layout คู่กันมาทำหน้าที่นี้แทน */
export async function generateMetadata({ params }) {
  const { locale } = await params;
  return pageMetadata({ locale, path: "/survey/readiness", ...seoFor("/survey/readiness", locale) });
}

export default function ReadinessLayout({ children }) {
  return children;
}
