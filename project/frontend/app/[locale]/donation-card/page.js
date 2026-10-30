import { Kanit } from "next/font/google";
import DonationCard from "@/components/donationCard/DonationCard";

/*
 * ทำการ์ดขอบคุณผู้บริจาคของโรงพยาบาลแม่จริม — /th/donation-card
 * กรอกชื่อ ยอดเงิน ใส่รูป แล้วดาวน์โหลดเป็น PNG ทั้งหมดทำในเบราว์เซอร์ ไม่มีอะไรส่งขึ้น server
 */

export const metadata = {
  title: "การ์ดขอบคุณผู้บริจาค | Mission Earth",
  robots: { index: false, follow: false },
};

// ฟอนต์ที่ใช้วาดตัวหนังสือทั้งหมดบนการ์ด (ตัวเอียงใช้กับคำอวยพร)
const kanit = Kanit({
  subsets: ["thai", "latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
});

export default function DonationCardPage() {
  return <DonationCard fontFamily={kanit.style.fontFamily} />;
}
