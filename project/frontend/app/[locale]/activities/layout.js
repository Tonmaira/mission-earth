import { pageMetadata, seoFor } from "@/lib/seo";

// metadata ของหน้านี้ — canonical กับ hreflang สร้างจาก lib/seo.js ที่เดียว
// ต้องแยกเป็น layout.js เพราะ page.js เป็น "use client" (ต้องอ่าน URL query
// เพื่อเปิดป็อปอัพกิจกรรม) และ metadata export ได้เฉพาะจาก Server Component
export async function generateMetadata({ params }) {
  const { locale } = await params;
  return pageMetadata({ locale, path: "/activities", ...seoFor("/activities", locale) });
}

export default function Layout({ children }) {
  return children;
}
