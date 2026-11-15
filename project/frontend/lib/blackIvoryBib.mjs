/* รายชื่อนักวิ่งและเลข BIB ของ Black Ivory Trail — อ่านจากแท็บ "BIB" และ "รายชื่อ BIB" ใน Google Sheet ของทีม
 *
 * ใช้ลิงก์เดียวกับยอดนักวิ่ง (env BLACK_IVORY_RUNNERS_CSV) แค่เปลี่ยน gid เป็นแต่ละแท็บ
 * ทีมกรอกชื่อไว้ทั้งสองแท็บ (บางคนมีแค่แท็บเดียว) จึงรวมกันโดยใช้เลข BIB เป็นตัวจับคู่
 * รายชื่อนี้เปิดให้ทุกคนดูบนหน้าเว็บ (ทีมตกลงแล้ว) — แต่ส่งออกไปแค่ ชื่อ / นามสกุล / ระยะ / Non-race หรือไม่
 * เลข BIB ใช้แค่คัดว่าใครขึ้นตาราง ตัวเลขเองไม่ถูกส่งออกไป (ทีมขอยังไม่โชว์)
 * คอลัมน์อื่นในแท็บ (เพศ ไซส์เสื้อ หมายเหตุ ฯลฯ) ไม่ถูกส่งไปที่เบราว์เซอร์
 */

import { fetchRows } from "./blackIvoryRunners.mjs";

// เรียงตามลำดับความสำคัญ: เลข BIB เดียวกันมีชื่อทั้งสองแท็บ ใช้แท็บแรก
const BIB_GIDS = [
  "895374520", // "BIB" — ทุกคน
  "1560598165", // "รายชื่อ BIB"
];
// หาคอลัมน์จากข้อความหัว (แถวแรกของแท็บ) — ถ้าทีมเปลี่ยนชื่อหัวพวกนี้ต้องมาแก้ตรงนี้ด้วย
// ช่อง Race: แท็บ "BIB" ใช้ "Race" (TRUE/FALSE), แท็บ "รายชื่อ BIB" ใช้ "Race / Non-race"
const COLUMNS = { first: "ชื่อ", last: "นามสกุล", km: "ระยะ" };
const RACE_HEADERS = ["Race", "Race / Non-race"];
const NON_RACE = ["FALSE", "NON-RACE"];

// ตัวพิมพ์เล็ก/ใหญ่และช่องว่างไม่มีผล: "somchai  jai" ตรงกับ "Somchai Jaidee"
const normalize = (s) => String(s ?? "").normalize("NFC").toLowerCase().replace(/\s+/g, "");

/** แถวของแท็บ → [{ first, last, km, bib, nonRace }] หรือ null ถ้าหัวคอลัมน์ไม่ครบ
 *  มีคอลัมน์ "BIB" หลายช่องได้ (แท็บ "รายชื่อ BIB" มีช่องว่างหนึ่งช่อง) ใช้ช่องแรกที่มีเลข
 *  nonRace = ช่อง Race เป็น FALSE / Non-race (ช่องว่างไม่นับว่าเป็น Non-race)
 *  ข้ามแถวที่ไม่มีชื่อ (เช่นแถวสรุปยอดใต้หัวตาราง) */
export function parseBibRows(rows) {
  const header = rows[0]?.map((c) => c.trim()) ?? [];
  const col = Object.fromEntries(Object.entries(COLUMNS).map(([k, title]) => [k, header.indexOf(title)]));
  const bibCols = header.flatMap((h, i) => (h === "BIB" ? [i] : []));
  const raceCol = header.findIndex((h) => RACE_HEADERS.includes(h));
  if (Object.values(col).some((i) => i < 0) || !bibCols.length || raceCol < 0) return null;
  return rows
    .slice(1)
    .map((r) => {
      const cell = (i) => r[i]?.trim() ?? "";
      return {
        first: cell(col.first),
        last: cell(col.last),
        km: cell(col.km),
        bib: bibCols.map(cell).find(Boolean) ?? "",
        nonRace: NON_RACE.includes(cell(raceCol).toUpperCase()),
      };
    })
    .filter((p) => p.first && !/^\d+$/.test(p.first));
}

/** รวมหลายแท็บ → คนละหนึ่งแถวต่อเลข BIB เรียงตามเลข BIB
 *  ทิ้งแถวที่ยังไม่มีเลข BIB (ทีมขอซ่อนไว้ก่อน) — เลขซ้ำใช้แท็บที่มาก่อนใน lists */
export function mergeBibLists(lists) {
  const byBib = new Map();
  for (const p of lists.flat()) {
    const n = Number(p.bib);
    if (p.bib && Number.isFinite(n) && !byBib.has(n)) byBib.set(n, p);
  }
  return [...byBib.entries()].sort(([a], [b]) => a - b).map(([, p]) => p);
}

/** คำค้นอยู่ในชื่อ หรืออยู่ในนามสกุล หรือพิมพ์ชื่อเต็มตั้งแต่ต้น ("สมชาย ใจ")
 *  ไม่ค้นข้ามรอยต่อชื่อกับนามสกุล — ไม่งั้น "สม" ไปตรงกับ "ประภาส มูลวงค์"
 *  คำค้นว่าง = ทุกคน */
export function matchesBib(p, query) {
  const q = normalize(query);
  if (!q) return true;
  return (
    normalize(p.first).includes(q) ||
    normalize(p.last).includes(q) ||
    normalize(p.first + p.last).startsWith(q)
  );
}

/** ดึงทั้งสองแท็บ (แคช 1 นาทีเหมือนยอดนักวิ่ง) แล้วรวมกัน
 *  แท็บไหนอ่านไม่ได้ก็ใช้แท็บที่เหลือ — อ่านไม่ได้ทั้งคู่ถึงคืน null ให้หน้าเว็บซ่อนปุ่ม */
export async function getBibEntries() {
  const url = process.env.BLACK_IVORY_RUNNERS_CSV;
  if (!url) return null;
  const tabs = await Promise.allSettled(
    BIB_GIDS.map(async (gid) => parseBibRows(await fetchRows(url.replace(/gid=\d+/, `gid=${gid}`))))
  );
  const lists = tabs.map((t) => (t.status === "fulfilled" ? t.value : null)).filter(Boolean);
  if (!lists.length) return null;
  return mergeBibLists(lists).map(({ bib, ...p }) => p);
}
