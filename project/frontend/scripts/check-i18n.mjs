/* ตรวจความสอดคล้องของงานสองภาษา — `npm run check:i18n`
 *
 * จับความผิดพลาดที่ "ไม่ส่งเสียง" คือเว็บยังเปิดได้ปกติ ไม่มี error
 * แต่ผลลัพธ์ผิดโดยที่ไม่มีใครรู้จนกว่าจะมีคนบ่น หรือจนกว่าจะเห็นใน Search Console เดือนถัดไป
 *
 * ตรวจ 5 อย่าง:
 *   1. คีย์ที่มีในภาษาหนึ่งแต่ขาดอีกภาษา  → หน้าจะพังตอนสลับภาษา
 *   2. ชนิดข้อมูลไม่ตรงกัน (ข้อความ/ลิสต์) → t() กับ t.raw() ใช้คนละแบบ เรียกผิดแล้วพัง
 *   3. ตัวแปรใน {} ไม่ตรงกัน              → next-intl จะ error ตอนแทนค่า
 *   4. ทะเบียนบอกว่าแปลแล้ว แต่สองภาษาเนื้อหาเหมือนกันเป๊ะ → Google เจอหน้าซ้ำ
 *   5. ทะเบียนบอกว่ามีภาษาเดียว แต่จริง ๆ แปลไว้แล้ว      → หน้าติด noindex ทั้งที่ไม่ควร
 *
 * ข้อ 4-5 เทียบทะเบียนใน lib/locale.js กับปริมาณเนื้อหาจริงที่บันทึกใน
 * scripts/smoke-baseline.json จึงควรรัน `npm run smoke -- --save` ให้เป็นปัจจุบันก่อน
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { localesForPath } from "../lib/locale.js";
import { NAMESPACES } from "../i18n/namespaces.js";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, "..");
const read = (p) => JSON.parse(fs.readFileSync(p, "utf8"));

const LOCALES = ["th", "en"];

const problems = [];
const fail = (msg) => problems.push({ level: "fail", msg });
const warn = (msg) => problems.push({ level: "warn", msg });

/* ── 0: ไฟล์บนดิสก์ตรงกับ NAMESPACES ไหม ───────────────────
   สร้างไฟล์ใหม่แล้วลืมเติมชื่อใน i18n/namespaces.js = ข้อความในไฟล์นั้นจะไม่ถูกโหลดเลย
   หน้าเว็บจะขึ้น MISSING_MESSAGE โดยที่ไฟล์ก็อยู่ตรงนั้น หาสาเหตุยากมาก */
for (const locale of LOCALES) {
  const dir = path.join(ROOT, "messages", locale);
  const onDisk = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(/\.json$/, ""));
  for (const f of onDisk) {
    if (!NAMESPACES.includes(f)) {
      fail(`messages/${locale}/${f}.json มีอยู่ แต่ไม่ได้ลงทะเบียนใน i18n/namespaces.js — ข้อความในไฟล์นี้จะไม่ถูกโหลด`);
    }
  }
  for (const ns of NAMESPACES) {
    if (!onDisk.includes(ns)) fail(`ลงทะเบียน "${ns}" ไว้ แต่ไม่มีไฟล์ messages/${locale}/${ns}.json`);
  }
}

/* โหลดหลังตรวจไฟล์แล้ว และข้าม namespace ที่ไม่มีไฟล์ — รายงานไปแล้วข้างบน
   ถ้าโหลดก่อน สคริปต์จะตายตอนอ่านไฟล์ที่ไม่มี แล้วไม่ทันได้รายงานอะไรเลย */
const messages = Object.fromEntries(
  LOCALES.map((l) => [
    l,
    Object.fromEntries(
      NAMESPACES.filter((ns) => fs.existsSync(path.join(ROOT, "messages", l, `${ns}.json`)))
        .map((ns) => [ns, read(path.join(ROOT, "messages", l, `${ns}.json`))])
    ),
  ])
);

/* ── 1-3: เทียบไฟล์ภาษาสองไฟล์ ─────────────────────────── */

/** แผ่โครงสร้างซ้อนให้เป็นรายการ path → ค่า เพื่อเทียบกันได้ตรง ๆ */
function flatten(obj, prefix = "", out = new Map()) {
  if (Array.isArray(obj)) {
    // ลิสต์เทียบกันทั้งก้อน ไม่ไล่ทีละ index เพราะลำดับสำคัญกว่าตัวคีย์
    out.set(prefix, { type: "array", length: obj.length });
    obj.forEach((v, i) => flatten(v, `${prefix}.${i}`, out));
  } else if (obj && typeof obj === "object") {
    for (const [k, v] of Object.entries(obj)) flatten(v, prefix ? `${prefix}.${k}` : k, out);
  } else if (typeof obj === "string") {
    out.set(prefix, { type: "string", value: obj });
  }
  return out;
}

/** ชื่อตัวแปรใน {} — next-intl ต้องได้ค่าครบทุกตัว ไม่งั้น error ตอนเรนเดอร์ */
const placeholders = (s) =>
  [...s.matchAll(/\{(\w+)/g)].map((m) => m[1]).sort().join(",");

const flat = Object.fromEntries(LOCALES.map((l) => [l, flatten(messages[l])]));
const [a, b] = LOCALES;

for (const key of flat[a].keys()) {
  if (!flat[b].has(key)) {
    fail(`คีย์ขาดใน ${b}.json: ${key}`);
    continue;
  }
  const x = flat[a].get(key);
  const y = flat[b].get(key);
  if (x.type !== y.type) {
    fail(`ชนิดไม่ตรงกัน: ${key} — ${a}=${x.type} แต่ ${b}=${y.type}`);
  } else if (x.type === "array" && x.length !== y.length) {
    fail(`จำนวนรายการไม่เท่ากัน: ${key} — ${a}=${x.length} แต่ ${b}=${y.length}`);
  } else if (x.type === "string" && placeholders(x.value) !== placeholders(y.value)) {
    fail(
      `ตัวแปรใน {} ไม่ตรงกัน: ${key} — ${a}={${placeholders(x.value) || "ไม่มี"}} แต่ ${b}={${placeholders(y.value) || "ไม่มี"}}`
    );
  }
}
for (const key of flat[b].keys()) {
  if (!flat[a].has(key)) fail(`คีย์ขาดใน ${a}.json: ${key}`);
}

/* ── 4-5: ทะเบียนภาษาตรงกับความจริงไหม ────────────────── */

const baselinePath = path.join(HERE, "smoke-baseline.json");
let checkedRegistry = 0;

if (!fs.existsSync(baselinePath)) {
  warn("ยังไม่มี smoke-baseline.json — ข้ามการตรวจทะเบียนภาษา (รัน `npm run smoke -- --save` ก่อน)");
} else {
  const rows = read(baselinePath).filter((r) => r.status === 200);
  const by = new Map(rows.map((r) => [r.route, r]));

  for (const row of rows) {
    if (!row.route.startsWith(`/${LOCALES[0]}`)) continue;
    const bare = row.route.slice(3) || "/";
    const other = by.get(`/${LOCALES[1]}${bare === "/" ? "" : bare}`);
    if (!other) continue;

    /* อ่านทะเบียนจาก lib/locale.js โดยตรง ไม่ใช่จาก X-Robots-Tag ใน baseline
       เพราะ baseline เป็นภาพนิ่งของครั้งก่อน ถ้าอ่านจากตรงนั้นจะจับการแก้ทะเบียน
       ไม่ได้จนกว่าจะรัน smoke ใหม่ ซึ่งสายเกินไป */
    const declared = localesForPath(bare);
    const thIndexed = declared.includes("th");
    const enIndexed = declared.includes("en");
    if (!thIndexed && !enIndexed) continue; // ตั้งใจไม่ให้เก็บทั้งคู่ ไม่ต้องตรวจ
    checkedRegistry += 1;

    /* ทุกหน้ามี navbar กับ footer ที่แปลแล้วอยู่รอบ ๆ สองภาษาจึงไม่มีวันเหมือนกันเป๊ะ
       ต้องดูว่า "ต่างกันมากพอที่จะเรียกว่าแปลเนื้อหาแล้ว" ไม่ใช่แค่ต่างกันนิดหน่อย
       หน้าที่แปลจริงจะต่างกันหลายสิบจุด (หน้าแรก 58 จุด, อาบป่า 91 จุด)
       ส่วนที่ต่างเพราะเมนูอย่างเดียวจะอยู่ราว 1-12 จุด */
    const THAI_PCT_GAP = 25;
    const LENGTH_GAP = 0.25;

    const lengthGap =
      Math.abs(row.textLength - other.textLength) / Math.max(1, row.textLength);
    const translated =
      Math.abs(row.thaiPct - other.thaiPct) >= THAI_PCT_GAP || lengthGap >= LENGTH_GAP;
    const identical = !translated;

    if (thIndexed && enIndexed && identical) {
      fail(
        `${bare} — ทะเบียนบอกว่ามีสองภาษา แต่ /th กับ /en เนื้อหาเหมือนกันเป๊ะ ` +
          `(ไทย ${row.thaiPct}% ทั้งคู่, ยาว ${row.textLength} กับ ${other.textLength} ตัวอักษร) ` +
          `Google จะเจอหน้าซ้ำ`
      );
    }
    if (thIndexed !== enIndexed && translated) {
      const indexed = thIndexed ? "th" : "en";
      warn(
        `${bare} — ทะเบียนบอกว่ามีแค่ ${indexed} แต่สองภาษาเนื้อหาต่างกันแล้ว ` +
          `(th ${row.thaiPct}% / en ${other.thaiPct}% ไทย) ถ้าแปลเสร็จแล้วให้แก้ PAGE_LOCALES ` +
          `ใน lib/locale.js ไม่งั้นอีกภาษาจะติด noindex ต่อไปโดยไม่มีใครรู้`
      );
    }
  }
}

/* ── รายงาน ────────────────────────────────────────────── */

const counts = Object.fromEntries(LOCALES.map((l) => [l, flat[l].size]));
console.log(
  `\n  ตรวจ ${NAMESPACES.length} namespace · ${LOCALES.map((l) => `${l} ${counts[l]} คีย์`).join(" · ")} · ` +
    `คู่หน้าที่ตรวจทะเบียน ${checkedRegistry} คู่\n`
);

const fails = problems.filter((p) => p.level === "fail");
const warns = problems.filter((p) => p.level === "warn");

for (const [label, group] of [["พัง", fails], ["ควรดู", warns]]) {
  if (!group.length) continue;
  console.log(`  [${label}]`);
  for (const p of group) console.log(`    ${p.msg}`);
  console.log("");
}

if (!problems.length) console.log("  ✓ ไฟล์ภาษาสองไฟล์ตรงกัน และทะเบียนตรงกับความจริง\n");

process.exit(fails.length ? 1 : 0);
