/* รายชื่อนักวิ่งและเลข BIB ของ Black Ivory Trail — อ่านจากแท็บ "BIB" ใน Google Sheet ของทีม
 *
 * ใช้ลิงก์เดียวกับยอดนักวิ่ง (env BLACK_IVORY_RUNNERS_CSV) แค่เปลี่ยน gid เป็นแท็บ BIB
 * รายชื่อนี้เปิดให้ทุกคนดูบนหน้าเว็บ (ทีมตกลงแล้ว) — แต่ส่งออกไปแค่ ชื่อ / นามสกุล / ระยะ / BIB / Non-race หรือไม่
 * คอลัมน์อื่นในแท็บ (เพศ ไซส์เสื้อ หมายเหตุ ฯลฯ) ไม่ถูกส่งไปที่เบราว์เซอร์
 */

import { fetchRows } from "./blackIvoryRunners.mjs";

const BIB_GID = "895374520";
// หาคอลัมน์จากข้อความหัว (แถวแรกของแท็บ) — ถ้าทีมเปลี่ยนชื่อหัวพวกนี้ต้องมาแก้ตรงนี้ด้วย
const COLUMNS = { first: "ชื่อ", last: "นามสกุล", km: "ระยะ", bib: "BIB", race: "Race" };

// ตัวพิมพ์เล็ก/ใหญ่และช่องว่างไม่มีผล: "somchai  jai" ตรงกับ "Somchai Jaidee"
const normalize = (s) => String(s ?? "").normalize("NFC").toLowerCase().replace(/\s+/g, "");

/** แถวของแท็บ BIB → [{ first, last, km, bib, nonRace }] หรือ null ถ้าหัวคอลัมน์ไม่ครบ
 *  nonRace = ช่อง Race เป็น FALSE (ช่องว่างไม่นับว่าเป็น Non-race)
 *  ข้ามแถวที่ไม่มีชื่อ (เช่นแถวสรุปยอดใต้หัวตาราง) */
export function parseBibRows(rows) {
  const header = rows[0]?.map((c) => c.trim()) ?? [];
  const col = Object.fromEntries(Object.entries(COLUMNS).map(([k, title]) => [k, header.indexOf(title)]));
  if (Object.values(col).some((i) => i < 0)) return null;
  return rows
    .slice(1)
    .map((r) => {
      const cell = (k) => r[col[k]]?.trim() ?? "";
      return {
        first: cell("first"),
        last: cell("last"),
        km: cell("km"),
        bib: cell("bib"),
        nonRace: cell("race").toUpperCase() === "FALSE",
      };
    })
    .filter((p) => p.first && !/^\d+$/.test(p.first));
}

/** คำค้นอยู่ในชื่อ หรืออยู่ในนามสกุล หรือพิมพ์ชื่อเต็มตั้งแต่ต้น ("สมชาย ใจ") หรือตรงกับเลข BIB
 *  ไม่ค้นข้ามรอยต่อชื่อกับนามสกุล — ไม่งั้น "สม" ไปตรงกับ "ประภาส มูลวงค์"
 *  คำค้นว่าง = ทุกคน */
export function matchesBib(p, query) {
  const q = normalize(query);
  if (!q) return true;
  return (
    normalize(p.first).includes(q) ||
    normalize(p.last).includes(q) ||
    normalize(p.first + p.last).startsWith(q) ||
    (/^\d+$/.test(q) && p.bib !== "" && Number(p.bib) === Number(q)) // "20" เจอ BIB "020"
  );
}

/** ดึงแท็บ BIB (แคช 1 นาทีเหมือนยอดนักวิ่ง) — อ่านไม่ได้ก็คืน null ให้หน้าเว็บซ่อนปุ่ม
 *  คนที่ยังไม่มีเลข BIB ไม่ขึ้นในตาราง (ทีมขอซ่อนไว้ก่อน) — ได้เลขใน Sheet แล้วจะขึ้นเอง */
export async function getBibEntries() {
  const url = process.env.BLACK_IVORY_RUNNERS_CSV;
  if (!url) return null;
  try {
    const entries = parseBibRows(await fetchRows(url.replace(/gid=\d+/, `gid=${BIB_GID}`)));
    return entries?.filter((p) => p.bib) ?? null;
  } catch {
    return null;
  }
}
