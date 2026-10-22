import RunBoard from "@/components/runBoard/RunBoard";

/*
 * Dashboard งานวิ่งของทีม — /th/run#<token>
 *
 * token อยู่หลัง # ไม่ใช่ใน path ตั้งใจ: ส่วนหลัง # ไม่ถูกส่งไป server ไม่ติดไปกับ Referer
 * และ Google Analytics ไม่เก็บ ลิงก์ที่ใครก็แก้ข้อมูลได้จึงไม่ไปโผล่ใน log หรือรายงานไหนเลย
 * หน้านี้เลยเป็นหน้า static ธรรมดา ตัว token ถูกตรวจที่ /api/run-board ทุกครั้งที่อ่านหรือเขียน
 */

export const metadata = {
  title: "Run Board | Mission Earth",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export const viewport = {
  themeColor: "#F0EEE9",
};

export default function RunBoardPage() {
  return <RunBoard />;
}
