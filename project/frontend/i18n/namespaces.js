/* รายชื่อไฟล์ข้อความ — แหล่งความจริงเดียวว่าเว็บมี namespace อะไรบ้าง
 *
 * แยกไฟล์ตามส่วนของเว็บแทนที่จะรวมเป็นก้อนเดียวต่อภาษา เพราะพอแปลครบทุกหน้า
 * ไฟล์เดียวจะยาวเป็นพันบรรทัดจนหาอะไรไม่เจอ และคนสองคนแก้คนละหน้าจะชนกันใน git
 *
 * เพิ่ม namespace ใหม่ = สร้างไฟล์ใน messages/th/ กับ messages/en/ แล้วเติมชื่อที่นี่
 * ถ้าลืมเติม `npm run check:i18n` จะเตือนให้
 */
export const NAMESPACES = [
  "navbar",
  "earthfeed",
  "home",
  "exploreActivities",
  "forestBathing",
  "activities",
  "about",
  "team",
];
