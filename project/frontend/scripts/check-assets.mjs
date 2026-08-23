/* ตรวจว่าเส้นทางรูป/ไฟล์ที่โค้ดอ้างถึง มีอยู่จริงใน public/ — `npm run check:assets`
 *
 * จับบั๊กที่ "เครื่องเราได้ แต่เว็บจริงพัง" ซึ่งหาเองยากมาก
 *
 * macOS ไม่สนตัวพิมพ์เล็กใหญ่ในชื่อไฟล์ ขอ EkidenLogo.svg แล้วได้ EKIDENLOGO.svg มา
 * แต่ Linux ที่ใช้รันเว็บจริง (Docker/Vercel) สนตัวพิมพ์ → 404
 * รูปจึงหายเฉพาะบนเว็บจริง โดยที่ทดสอบในเครื่องเท่าไรก็ไม่เจอ
 *
 * รันก่อน deploy ทุกครั้ง โดยเฉพาะหลังเพิ่มหรือเปลี่ยนชื่อรูป
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, "..");
const PUBLIC = path.join(ROOT, "public");

const EXT = "(?:png|jpe?g|svg|webp|gif|ico|pdf|woff2?|mp4|webm)";
const SKIP_DIRS = new Set(["node_modules", ".next", ".git", "public"]);

/* ── ไฟล์ที่มีอยู่จริง ─────────────────────────────────── */

const real = new Set();
const byLowercase = new Map();

function collect(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collect(full);
    } else {
      const rel = "/" + path.relative(PUBLIC, full).split(path.sep).join("/");
      real.add(rel);
      if (!byLowercase.has(rel.toLowerCase())) byLowercase.set(rel.toLowerCase(), rel);
    }
  }
}
collect(PUBLIC);

/* ── เส้นทางที่โค้ดอ้างถึง ──────────────────────────────── */

const refs = new Map();
const addRef = (p, file) => {
  const clean = decodeURIComponent(p);
  if (!refs.has(clean)) refs.set(clean, new Set());
  refs.get(clean).add(file);
};

function scan(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scan(full);
      continue;
    }
    if (!/\.(js|jsx|ts|tsx|json|css)$/.test(entry.name)) continue;

    let src;
    try {
      src = fs.readFileSync(full, "utf8");
    } catch {
      continue; // ไฟล์ที่อ่านเป็นข้อความไม่ได้ (เช่นไฟล์ ._ ของ macOS)
    }
    const rel = path.relative(ROOT, full);

    // ค่าคงที่ที่ใช้เป็นโฟลเดอร์นำหน้า เช่น const BASE = "/EkidenWeb"
    const consts = Object.fromEntries(
      [...src.matchAll(/const\s+(\w+)\s*=\s*"(\/[^"]*)"\s*;/g)].map((m) => [m[1], m[2]])
    );

    // เขียนเส้นทางเต็มตรง ๆ
    for (const m of src.matchAll(new RegExp(`["'\`](/[^"'\`]+\\.${EXT})["'\`]`, "g"))) {
      addRef(m[1], rel);
    }
    // ประกอบจากตัวแปร เช่น `${BASE}/EkidenLogo.svg`
    for (const m of src.matchAll(new RegExp(`\\$\\{(\\w+)\\}(/[^"'\`$]+\\.${EXT})`, "g"))) {
      if (consts[m[1]]) addRef(consts[m[1]] + m[2], rel);
    }
  }
}
scan(ROOT);

/* ── เทียบ ────────────────────────────────────────────── */

const mismatch = [];
const missing = [];

for (const [ref, where] of [...refs].sort()) {
  if (real.has(ref)) continue;
  const actual = byLowercase.get(ref.toLowerCase());
  (actual ? mismatch : missing).push({ ref, actual, where: [...where].sort() });
}

console.log(`\n  ตรวจ ${refs.size} เส้นทาง เทียบกับไฟล์จริง ${real.size} ไฟล์ใน public/\n`);

if (mismatch.length) {
  console.log(`  [พัง] ตัวพิมพ์ไม่ตรง ${mismatch.length} รายการ — เครื่องนี้เปิดได้ แต่เว็บจริงจะ 404`);
  for (const m of mismatch) {
    console.log(`    โค้ดขอ   ${m.ref}`);
    console.log(`    ไฟล์จริง ${m.actual}`);
    for (const w of m.where) console.log(`       ← ${w}`);
  }
  console.log("");
}

if (missing.length) {
  console.log(`  [พัง] ไม่มีไฟล์นี้ ${missing.length} รายการ`);
  for (const m of missing) {
    console.log(`    ${m.ref}`);
    for (const w of m.where) console.log(`       ← ${w}`);
  }
  console.log("");
}

if (!mismatch.length && !missing.length) {
  console.log("  ✓ ทุกเส้นทางตรงกับไฟล์จริง รวมถึงตัวพิมพ์เล็กใหญ่\n");
}

process.exit(mismatch.length + missing.length ? 1 : 0);
