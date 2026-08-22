/* ตาข่ายนิรภัยของงานแยก URL สองภาษา (เฟส 0)
 *
 *   npm run smoke              ตรวจทุกหน้าแล้วเทียบกับ baseline ที่บันทึกไว้
 *   npm run smoke -- --save    บันทึก baseline ใหม่ (ทำตอนที่รู้ว่าเว็บยังปกติดี)
 *   npm run smoke -- --url=https://www.missionearth.co   ตรวจเว็บจริงแทน localhost
 *
 * ทำไมต้องมี: เฟสถัดไปต้องย้ายทุกหน้าไปอยู่ใต้ /th กับ /en ซึ่งแตะทั้งเว็บพร้อมกัน
 * ถ้าไม่มีตัวเทียบว่า "ก่อนย้ายหน้าตาเป็นยังไง" จะรู้ว่าพังก็ต่อเมื่อมีคนบ่น
 *
 * เก็บสัดส่วนอักษรไทย/อังกฤษของแต่ละหน้าด้วย เพราะเป้าหมายของงานนี้คือ
 * ทำให้เนื้อหาไทยออกมาใน HTML ให้ Google เห็น ตัวเลขนี้จึงเป็นทั้งตัวจับ regression
 * และตัววัดความคืบหน้าไปในตัว
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const BASELINE = path.join(HERE, "smoke-baseline.json");

const args = process.argv.slice(2);
const SAVE = args.includes("--save");
const BASE = (args.find((a) => a.startsWith("--url="))?.slice(6) ?? "http://localhost:3000").replace(/\/$/, "");

/* หน้าที่ต้องเปิดได้เสมอ — ตัวเริ่มต้นของการไล่เก็บ URL
 * หน้าไดนามิก ([id], [slug], ...) ไม่ต้องใส่เอง เดี๋ยวเก็บจากลิงก์ในหน้าพวกนี้
 * admin กับ login/signup ไม่เอา เพราะต้องล็อกอินและไม่เกี่ยวกับ SEO */
const SEEDS = [
  // ไล่จากหน้าแรกของแต่ละภาษา ลิงก์ในหน้าจะพาไปหน้าที่เหลือเอง
  "/th",
  "/en",
  // หน้าที่ไม่มีลิงก์เข้าจากหน้าอื่น ต้องระบุเอง
  "/th/survey/readiness",
  "/en/survey/readiness",
  "/th/brand-guide",
  "/th/credential",
];

const SKIP = /^\/(admin|api|login|signup)(\/|$)/;

/* หมายเหตุ: อย่าตรวจหน้า error ด้วยการหาข้อความอย่าง "This page could not be found"
 * ตอน dev นั้น Next ฝังเทมเพลตหน้า not-found ไว้ในทุกหน้าอยู่แล้ว จะกลายเป็นจับผิดทุกหน้า
 * ใช้ status code คู่กับปริมาณเนื้อหาแทน — หน้าที่เรนเดอร์พังจะเหลือข้อความน้อยผิดปกติ */
const MIN_TEXT = 200;

const stripTags = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const countScripts = (text) => ({
  th: (text.match(/[฀-๿]/g) ?? []).length,
  en: (text.match(/[A-Za-z]/g) ?? []).length,
});

/** ลิงก์ภายในทั้งหมดในหน้า — ใช้เก็บ URL ของหน้าไดนามิกที่มีอยู่จริง
 *  จะได้ไม่ต้องมานั่ง hardcode id ไว้ในสคริปต์แล้วลืมอัปเดตตอนข้อมูลเปลี่ยน */
function internalLinks(html) {
  const out = new Set();
  for (const m of html.matchAll(/href="(\/[^"#?]*)"/g)) {
    const href = m[1].replace(/\/$/, "") || "/";
    if (!SKIP.test(href) && !/\.[a-z0-9]{2,4}$/i.test(href)) out.add(href);
  }
  return [...out];
}

async function probe(route) {
  const started = Date.now();
  try {
    const res = await fetch(BASE + route, { redirect: "manual" });
    const status = res.status;

    // 3xx ไม่ใช่ความผิดพลาด แต่ต้องรู้ว่าเด้งไปไหน (สำคัญมากตอนทำ redirect ในเฟส 2)
    if (status >= 300 && status < 400) {
      return { route, status, redirectTo: res.headers.get("location"), ms: Date.now() - started };
    }

    const robots = res.headers.get("x-robots-tag") ?? "";
    const html = await res.text();
    const text = stripTags(html);
    const { th, en } = countScripts(text);
    const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? "";
    const lang = html.match(/<html[^>]*lang="([^"]*)"/)?.[1] ?? "";
    const h1 = stripTags(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? "");
    const error =
      status !== 200
        ? `status ${status}`
        : text.length < MIN_TEXT
          ? `เนื้อหาน้อยผิดปกติ (${text.length} ตัวอักษร)`
          : null;

    return {
      route,
      status,
      error,
      robots,
      title,
      lang,
      h1,
      thaiChars: th,
      latinChars: en,
      thaiPct: th + en === 0 ? 0 : Math.round((th * 100) / (th + en)),
      textLength: text.length,
      hasJsonLd: html.includes("application/ld+json"),
      ms: Date.now() - started,
      html,
    };
  } catch (err) {
    return { route, status: 0, error: String(err.message ?? err), ms: Date.now() - started };
  }
}

async function crawl() {
  const seen = new Map();
  const queue = [...SEEDS];

  while (queue.length) {
    const route = queue.shift();
    if (seen.has(route) || SKIP.test(route)) continue;
    const result = await probe(route);
    // เก็บลิงก์จากหน้าที่โหลดได้ แล้วค่อยทิ้ง html ไม่ให้ baseline บวม
    if (result.html) {
      for (const link of internalLinks(result.html)) {
        if (!seen.has(link) && !queue.includes(link)) queue.push(link);
      }
      delete result.html;
    }
    seen.set(route, result);
  }

  return [...seen.values()].sort((a, b) => a.route.localeCompare(b.route));
}

/* ── เทียบกับ baseline ─────────────────────────────────────── */

const FIELDS = ["status", "robots", "title", "lang", "h1", "hasJsonLd"];
// เนื้อหาขยับเล็กน้อยได้ (ฟีดโหลดข่าวใหม่ ฯลฯ) เกินเท่านี้ถึงจะถือว่าผิดปกติ
const TEXT_DRIFT = 0.25;

function compare(now, before) {
  const byRoute = new Map(before.map((r) => [r.route, r]));
  const problems = [];

  for (const cur of now) {
    const old = byRoute.get(cur.route);
    if (!old) {
      problems.push({ level: "info", route: cur.route, msg: "หน้าใหม่ที่ยังไม่มีใน baseline" });
      continue;
    }
    byRoute.delete(cur.route);

    // error ที่มีอยู่แล้วตั้งแต่ baseline ไม่นับเป็นของใหม่ — งานนี้คือจับ "สิ่งที่เปลี่ยน"
    // ส่วนของที่พังอยู่ก่อนแล้ว แยกไปดูในรายการท้ายรายงาน
    if (cur.error && !old.error) {
      problems.push({ level: "fail", route: cur.route, msg: `เพิ่งพัง: ${cur.error}` });
    } else if (!cur.error && old.error) {
      problems.push({ level: "info", route: cur.route, msg: `หายพังแล้ว (เดิม: ${old.error})` });
    }

    for (const f of FIELDS) {
      if (JSON.stringify(cur[f]) !== JSON.stringify(old[f])) {
        problems.push({ level: "fail", route: cur.route, msg: `${f}: "${old[f]}" → "${cur[f]}"` });
      }
    }

    if (old.textLength > 0) {
      const drift = Math.abs(cur.textLength - old.textLength) / old.textLength;
      if (drift > TEXT_DRIFT) {
        problems.push({
          level: "warn",
          route: cur.route,
          msg: `เนื้อหาเปลี่ยนไป ${Math.round(drift * 100)}% (${old.textLength} → ${cur.textLength} ตัวอักษร)`,
        });
      }
    }
  }

  for (const missing of byRoute.values()) {
    problems.push({ level: "fail", route: missing.route, msg: "หน้าหายไป เคยเปิดได้แต่ตอนนี้ไม่เจอ" });
  }

  return problems;
}

/* ── รายงาน ────────────────────────────────────────────────── */

function report(results) {
  const pad = (s, n) => String(s).padEnd(n);
  console.log(`\n  ${pad("หน้า", 34)}${pad("สถานะ", 8)}${pad("ไทย%", 7)}${pad("lang", 7)}ชื่อหน้า`);
  console.log("  " + "─".repeat(92));
  for (const r of results) {
    if (r.redirectTo) {
      console.log(`  ${pad(r.route, 34)}${pad(r.status, 8)}→ ${r.redirectTo}`);
      continue;
    }
    const flag = r.status !== 200 || r.error ? "✗" : " ";
    console.log(
      `${flag} ${pad(r.route, 34)}${pad(r.status, 8)}${pad(r.thaiPct + "%", 7)}${pad(r.lang, 7)}${(r.title ?? "").slice(0, 40)}`
    );
  }

  const noindexed = results.filter((r) => (r.robots ?? "").includes("noindex")).length;
  const broken = results.filter((r) => r.error);
  const thai = results.filter((r) => r.thaiPct >= 50).length;
  const avgThai = Math.round(
    results.reduce((sum, r) => sum + (r.thaiPct ?? 0), 0) / Math.max(1, results.length)
  );
  console.log("  " + "─".repeat(92));
  console.log(
    `  เปิดได้ ${results.length - broken.length}/${results.length} หน้า · ` +
      `เนื้อหาเป็นไทยเกินครึ่ง ${thai}/${results.length} หน้า · เฉลี่ยไทย ${avgThai}%\n` +
      `  ให้ Google เก็บ ${results.length - noindexed} หน้า · ติด noindex ${noindexed} หน้า`
  );
  if (broken.length) {
    console.log("\n  หน้าที่มีปัญหาอยู่ตอนนี้:");
    for (const b of broken) console.log(`    ${b.route}  —  ${b.error}`);
  }
  console.log("");
}

/* ── main ──────────────────────────────────────────────────── */

console.log(`\nกำลังตรวจ ${BASE} ...`);
const results = await crawl();
report(results);

/* URL ชุดเดิมที่ Google เก็บไว้ และที่แปะไว้ตาม Facebook/LINE/QR ต้องเด้งไปที่ใหม่เสมอ
   ถ้าข้อนี้พัง อันดับที่สะสมมาจะหายทั้งหมด จึงตรวจแยกจากการไล่หน้าปกติ */
const LEGACY = ["/", "/about", "/services", "/portfolio", "/contact", "/forest_bathing", "/ekiden", "/feed", "/activities", "/admin"];
const legacyProblems = [];
for (const old of LEGACY) {
  const res = await fetch(BASE + old, { redirect: "manual" });
  const to = res.headers.get("location") ?? "";
  const want = old === "/" ? "/th" : `/th${old}`;
  if (res.status !== 308 || !to.endsWith(want)) {
    legacyProblems.push(`${old} → ${res.status} ${to || "(ไม่มีปลายทาง)"} — ควรเป็น 308 ไป ${want}`);
  }
}
if (legacyProblems.length) {
  console.log("  [พัง] URL เดิมไม่เด้งไปที่ใหม่:");
  for (const p of legacyProblems) console.log(`    ${p}`);
  console.log("");
} else {
  console.log(`  ✓ URL เดิมทั้ง ${LEGACY.length} เส้นเด้ง 308 ไปภาษาไทยถูกต้อง\n`);
}

if (SAVE) {
  fs.writeFileSync(BASELINE, JSON.stringify(results, null, 2) + "\n");
  console.log(`  บันทึก baseline แล้ว: ${path.relative(process.cwd(), BASELINE)} (${results.length} หน้า)\n`);
  process.exit(0);
}

if (!fs.existsSync(BASELINE)) {
  console.log("  ยังไม่มี baseline — รัน `npm run smoke -- --save` ตอนที่เว็บยังปกติดีเพื่อบันทึกไว้ก่อน\n");
  process.exit(0);
}

const problems = compare(results, JSON.parse(fs.readFileSync(BASELINE, "utf8")));
const fails = problems.filter((p) => p.level === "fail");

if (problems.length === 0) {
  console.log("  ✓ ตรงกับ baseline ทุกหน้า\n");
  process.exit(0);
}

for (const level of ["fail", "warn", "info"]) {
  const group = problems.filter((p) => p.level === level);
  if (!group.length) continue;
  const label = { fail: "พัง", warn: "ควรดู", info: "ข้อมูล" }[level];
  console.log(`  [${label}]`);
  for (const p of group) console.log(`    ${p.route}  —  ${p.msg}`);
  console.log("");
}

process.exit(fails.length ? 1 : 0);
