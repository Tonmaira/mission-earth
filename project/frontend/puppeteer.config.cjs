const path = require("node:path");

/**
 * เก็บ Chrome ที่ puppeteer โหลดมาไว้ "ในโปรเจกต์" ไม่ใช่ ~/.cache/puppeteer
 *
 * ค่า default ของ puppeteer คือ os.homedir()/.cache/puppeteer ซึ่งบน Vercel
 * ไม่ถูก cache ข้าม build — ส่วน node_modules ถูก cache เลยกลายเป็นว่า build
 * รอบถัดๆ ไป npm install ไม่รันใหม่ (เพราะกู้จาก cache) postinstall ของ
 * puppeteer จึงไม่ทำงาน แล้ว Chrome ก็ไม่เคยมีอยู่จริง สคริปต์สร้าง PDF เลย
 * ล้มเงียบๆ และเว็บได้ปุ่มที่กดแล้วไม่มีอะไรเกิดขึ้น
 *
 * ย้ายมาไว้ใต้ node_modules/.cache ทำให้มันติดไปกับ cache ก้อนเดียวกัน
 */
module.exports = {
  cacheDirectory: path.join(__dirname, "node_modules", ".cache", "puppeteer"),
};
