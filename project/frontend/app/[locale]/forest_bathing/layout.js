import { pageMetadata } from "@/lib/seo";

/* viewport-fit=cover ให้หน้าเว็บวาดยาวลอดใต้แถบของ Safari
   บน iOS 26 แถบล่างจึงกลายเป็นกระจกลอยทับเนื้อหาแทนแถบทึบที่ถูกย้อมด้วย themeColor
   (พื้นหลังหน้านี้เป็น gradient แบบ fixed ก้นจอเป็นม่วงเสมอ ย้อมสีเดียวให้ตรงทั้งบนล่างไม่ได้)
   แลกกับต้องกัน safe-area เองที่ navbar กับ footer — ดู env(safe-area-inset-*) ในไฟล์เหล่านั้น */
export const viewport = {
  themeColor: "#002740",
  viewportFit: "cover",
};

/* title ขึ้นต้นด้วย "อาบป่า" เพราะเป็นคำที่คนไทยใช้ค้นจริง
   ของเดิมเป็น "Forest Bathing | Mission Earth" ซึ่งไม่มีคำนี้อยู่เลย
   ส่วน canonical เดิมชี้ไป /forest_bathing ที่ตอนนี้เด้ง 308 ไปที่อื่นแล้ว
   จึงเปลี่ยนมาสร้างจาก lib/seo.js ให้ชี้มาที่ตัวเองตามภาษา */
const COPY = {
  th: {
    title: "อาบป่า Forest Bathing",
    description:
      "กิจกรรมอาบป่า (Shinrin-yoku) กับ Mission Earth เดินช้า ๆ ในป่าด้วยประสาทสัมผัสทั้งหก เชื่อมโยงร่างกายและจิตใจเข้ากับธรรมชาติ",
  },
  en: {
    title: "Forest Bathing",
    description:
      "Forest Bathing (Shinrin-yoku) with Mission Earth — slow, guided time among the trees with all six senses open.",
  },
};

const KEYWORDS = ["อาบป่า", "Forest Bathing", "Shinrin-yoku", "อาบป่า บางกะเจ้า", "Mission Earth", "กิจกรรมธรรมชาติ"];

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: "/forest_bathing",
    keywords: KEYWORDS,
    image: "https://www.missionearth.co/forestBathing/FBhero.png",
    ...(COPY[locale] ?? COPY.th),
  });
}

export default function Layout({ children }) {
  return children;
}
