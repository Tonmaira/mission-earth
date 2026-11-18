/* รายชื่อร้านค้าที่เข้าร่วม ททท. x Black Ivory Trail — อ่านจากคำตอบ Google Form ที่ร้านกรอกเข้ามา
 *
 * ลิงก์ CSV อยู่ใน env BLACK_IVORY_SHOPS_CSV ไม่เขียนไว้ในโค้ด
 * เพราะแท็บเดียวกันมีชื่อผู้ติดต่อ เบอร์ส่วนตัว LINE และอีเมลของเจ้าของร้าน
 *   https://docs.google.com/spreadsheets/d/<id>/gviz/tq?tqx=out:csv&gid=<gid>
 *
 * ส่งออกไปแค่ ชื่อร้าน (ไทย/อังกฤษ) / ประเภท / ที่อยู่ / เบอร์ร้าน / ลิงก์แผนที่
 * ร้านกรอกใหม่ใน Form แล้วขึ้นเว็บเองภายใน 1 นาที (แคชเดียวกับยอดนักวิ่ง)
 */

import { fetchRows } from "./blackIvoryRunners.mjs";

// หาคอลัมน์จากข้อความหัว — ถ้าทีมแก้คำถามใน Form ต้องมาแก้ตรงนี้ด้วย
const COLUMNS = {
  name: "ชื่อร้านค้า (ภาษาไทย)",
  nameEn: "ชื่อร้านค้า (ภาษาอังกฤษ ถ้ามี)",
  type: "ประเภทร้านค้า",
  address: "ที่อยู่ร้านค้า",
  phone: "เบอร์โทรศัพท์ร้านค้า",
  map: "Google Maps Location",
};

// ช่องว่างยาวศูนย์ (U+200B) ติดมาจากการก๊อปวางในมือถือ — ตัดทิ้งแล้วยุบช่องว่างซ้อน
const clean = (s) => String(s ?? "").replace(/[​‌‍﻿]/g, "").replace(/\s+/g, " ").trim();

/** "081-9238879, 098-6146936" → ["0819238879", "0986146936"]
 *  Sheet ตัดเลข 0 หน้าเบอร์ทิ้งถ้าช่องเป็นตัวเลข ("889695362") — เติมกลับให้ */
export function parsePhones(text) {
  const groups = clean(text).match(/[\d-]+(?:[\s-]\d+)*/g) ?? [];
  return groups
    .flatMap((g) => {
      const d = g.replace(/\D/g, "");
      // สองเบอร์คั่นด้วยช่องว่างเฉย ๆ ("054710687 054772980") มาเป็นก้อนเดียว — แยกตามความยาวเบอร์
      if (d.length === 18) return [d.slice(0, 9), d.slice(9)];
      if (d.length === 20) return [d.slice(0, 10), d.slice(10)];
      return [d];
    })
    .map((d) => (d.length === 9 && !d.startsWith("0") ? `0${d}` : d))
    .filter((d) => d.length === 9 || d.length === 10);
}

/** 0819238879 → 081-923-8879, 054710687 → 054-710-687 */
export const formatPhone = (d) => `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`;

/** ลิงก์ที่ร้านแปะมา ถ้าไม่มี (ช่องว่าง / พิมพ์ว่า "มี" / ชื่อร้าน) ค้นใน Google Maps จากชื่อ + ที่อยู่แทน */
export function mapUrl(raw, name, address) {
  const link = clean(raw).match(/https?:\/\/\S+/)?.[0];
  if (link) return link;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} ${address}`.trim())}`;
}

/** แถวของแท็บ → [{ name, nameEn, type, address, phones, map }] หรือ null ถ้าหัวคอลัมน์ไม่ครบ
 *  ข้ามแถวที่ไม่มีชื่อร้าน */
export function parseShops(rows) {
  const header = rows[0]?.map((c) => c.trim()) ?? [];
  const col = Object.fromEntries(Object.entries(COLUMNS).map(([k, title]) => [k, header.indexOf(title)]));
  if (Object.values(col).some((i) => i < 0)) return null;
  return rows
    .slice(1)
    .map((r) => {
      const cell = (k) => clean(r[col[k]]);
      const name = cell("name");
      return {
        name,
        nameEn: cell("nameEn"),
        type: cell("type"),
        address: cell("address"),
        phones: parsePhones(cell("phone")),
        map: mapUrl(cell("map"), name, cell("address")),
      };
    })
    .filter((s) => s.name);
}

/** ดึงแท็บ → รายชื่อร้าน หรือ null ให้หน้าเว็บขึ้นว่า "เร็ว ๆ นี้" แทน */
export async function getShops() {
  const url = process.env.BLACK_IVORY_SHOPS_CSV;
  if (!url) return null;
  try {
    const shops = parseShops(await fetchRows(url));
    return shops?.length ? shops : null;
  } catch {
    return null;
  }
}
