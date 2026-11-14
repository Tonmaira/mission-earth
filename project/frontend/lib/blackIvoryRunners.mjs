/* ยอดนักวิ่งที่สมัครแล้วของ Black Ivory Trail — อ่านจากแท็บสรุปใน Google Sheet ของทีม
 *
 * ทีมอัปเดตใน Sheet อย่างเดียว หน้าเว็บดึงมาเองทุก 1 นาที (REVALIDATE)
 * หน้าที่เปิดค้างไว้ก็ขอยอดใหม่เองทุก 1 นาทีเหมือนกัน (components/blackIvory/AutoRefresh.js)
 * แท็บนั้นเปิดแบบ "ทุกคนที่มีลิงก์" อยู่แล้ว จึงอ่านเป็น CSV ได้ตรง ๆ ไม่ต้องผ่าน Apps Script
 *
 * ลิงก์ CSV อยู่ใน env BLACK_IVORY_RUNNERS_CSV ไม่เขียนไว้ในโค้ด
 * เพราะแท็บเดียวกันมีรายได้และช่องทางขาย ใครได้ลิงก์ไปก็เปิดดูได้ทั้งหมด
 *   https://docs.google.com/spreadsheets/d/<id>/gviz/tq?tqx=out:csv&gid=<gid>
 *
 * หน้าเว็บโชว์แค่ยอดรวมกับยอดแยกระยะ (ทั้งหมด / Race / Non-race) — ไม่เอารายได้ ราคา หรือชื่อช่องทางออกไป
 *
 * ยอดรวมของแต่ละกลุ่ม = บวกสามระยะเอง ไม่อ่านช่อง "รวม" ของ Sheet
 * เพราะช่องนั้นนับกลุ่มที่ยังไม่มีระยะปนมาด้วย (เช่น Joursey ใน Non-race)
 * ตัวเลขบนเว็บจึงลงตัวเสมอ: ทั้งหมด = Race + Non-race
 *
 * ยอดชาย/หญิงของ Race 8K/12K นับจากแท็บ "รายชื่อ" (ROSTER_GID) ในไฟล์เดียวกัน
 * แท็บนั้นมีชื่อนักวิ่ง — อ่านแค่คอลัมน์ ระยะ / เพศ / ช่องทาง แล้วส่งออกไปเป็นตัวเลขเท่านั้น
 * ช่องทางไหนเป็น Race ดูจากตาราง "Race / Non-race" ในแท็บสรุป (ทีมแก้ใน Sheet แล้วเว็บตามเอง)
 */

export const REVALIDATE = 60;

// หาแถว/คอลัมน์จากข้อความหัว ไม่ใช้เลขช่อง ทีมแทรกคอลัมน์หรือแถวเพิ่มได้โดยเว็บไม่พัง
// (ถ้าเปลี่ยนชื่อหัวพวกนี้ใน Sheet ต้องมาแก้ตรงนี้ด้วย ไม่งั้นปุ่มจะหายไปเฉย ๆ)
const GROUP_ROWS = { all: "รวมนักวิ่ง (Paid + Free)", race: "รวม Race", nonRace: "รวม Non-race" };
const DISTANCE_HEADERS = { "12K": "12K Peak Challenge", "8K": "8K Forest Trail", "5K": "5K Fun Trail" };
const CHANNEL_TABLE = { name: "รายชื่อแท็บ", type: "Race / Non-race" }; // ตารางข้างในแท็บสรุป (หัวคอลัมน์ขึ้นต้นด้วยข้อความนี้)
const ROSTER = { km: "ระยะ", sex: "เพศ", channel: "ช่องทาง" };
const ROSTER_GID = "679418415"; // แท็บ "รายชื่อ" — ใช้ลิงก์เดียวกับแท็บสรุป แค่เปลี่ยน gid
const GENDER_KM = ["8K", "12K"];

/** CSV → แถวของข้อความ (รองรับช่องที่มี "..." ครอบ, จุลภาค และขึ้นบรรทัดใหม่ข้างใน) */
export function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else field += c;
  }
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

// ช่องว่างต้องเป็น null ไม่ใช่ 0 — Number("") ได้ 0 ซึ่งจะทำให้เว็บโชว์ยอดผิดแบบเงียบ ๆ
const toNumber = (v) => {
  const s = String(v ?? "").replace(/[,\s]/g, "");
  if (!s) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
};

/** แถวที่ขึ้นต้นด้วย label → { total, byDistance: { "12K": n, "8K": n, "5K": n } } หรือ null */
function readGroup(rows, header, label) {
  const row = rows.find((r) => r.some((c) => c.trim() === label));
  if (!row) return null;
  const byDistance = {};
  for (const [km, title] of Object.entries(DISTANCE_HEADERS)) {
    const n = toNumber(row[header.indexOf(title)]);
    if (n === null) return null;
    byDistance[km] = n;
  }
  const total = Object.values(byDistance).reduce((a, b) => a + b, 0);
  return { total, byDistance };
}

/** แถวจาก Sheet → { all, race, nonRace } แต่ละอันเป็น { total, byDistance }
 *  all หาไม่เจอ = null ทั้งก้อน (ซ่อนปุ่ม) ส่วน race/nonRace หาไม่เจอ = null เฉพาะตัว (ซ่อนแท็บกรอง) */
export function parseRunnerCounts(rows) {
  const headerIdx = rows.findIndex((r) => r.some((c) => c.trim() === DISTANCE_HEADERS["12K"]));
  if (headerIdx < 0) return null;
  const header = rows[headerIdx].map((c) => c.trim());

  const all = readGroup(rows, header, GROUP_ROWS.all);
  if (!all) return null;
  return {
    all,
    race: readGroup(rows, header, GROUP_ROWS.race),
    nonRace: readGroup(rows, header, GROUP_ROWS.nonRace),
  };
}

/** แท็บสรุป + แท็บรายชื่อ → { "8K": { M, F }, "12K": { M, F } } ของนักวิ่งประเภท Race หรือ null
 *  คนที่ไม่ได้กรอกเพศไม่ถูกนับทั้งสองฝั่ง (ชาย + หญิง จึงอาจน้อยกว่ายอด Race) */
export function parseRaceGenders(summaryRows, rosterRows) {
  const tableHeader = summaryRows.find((r) => r.some((c) => c.trim() === CHANNEL_TABLE.type));
  if (!tableHeader) return null;
  const typeCol = tableHeader.findIndex((c) => c.trim() === CHANNEL_TABLE.type);
  const nameCol = tableHeader.findIndex((c) => c.trim().startsWith(CHANNEL_TABLE.name));
  if (nameCol < 0) return null;
  const raceChannels = new Set(
    summaryRows.filter((r) => r[typeCol]?.trim() === "Race").map((r) => r[nameCol]?.trim())
  );

  const header = rosterRows[0]?.map((c) => c.trim()) ?? [];
  const col = Object.fromEntries(Object.entries(ROSTER).map(([k, title]) => [k, header.indexOf(title)]));
  if (Object.values(col).some((i) => i < 0)) return null;

  const out = Object.fromEntries(GENDER_KM.map((km) => [km, { M: 0, F: 0 }]));
  for (const r of rosterRows.slice(1)) {
    const km = r[col.km]?.trim();
    const sex = r[col.sex]?.trim().toUpperCase();
    if (out[km] && (sex === "M" || sex === "F") && raceChannels.has(r[col.channel]?.trim())) out[km][sex]++;
  }
  return out;
}

export const fetchRows = async (url) => {
  const res = await fetch(url, { next: { revalidate: REVALIDATE } });
  if (!res.ok) throw new Error(`Sheet ${res.status}`);
  return parseCsv(await res.text());
};

/** ดึงยอดล่าสุด — พลาดอะไรก็คืน null ให้หน้าเว็บซ่อนปุ่มไป ไม่ทำให้ทั้งหน้าพัง
 *  ยอดชาย/หญิงพลาดคนเดียว (raceGenders = null) ยอดอื่นยังขึ้นตามปกติ */
export async function getRunnerCounts() {
  const url = process.env.BLACK_IVORY_RUNNERS_CSV;
  if (!url) return null;
  try {
    const summary = await fetchRows(url);
    const counts = parseRunnerCounts(summary);
    if (!counts) return null;
    let raceGenders = null;
    try {
      raceGenders = parseRaceGenders(summary, await fetchRows(url.replace(/gid=\d+/, `gid=${ROSTER_GID}`)));
    } catch {
      // แท็บรายชื่ออ่านไม่ได้ — ซ่อนเฉพาะยอดชาย/หญิง
    }
    return { ...counts, raceGenders };
  } catch {
    return null;
  }
}
