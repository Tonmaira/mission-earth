/* จุดเดียวที่รู้เรื่อง "ภาษาอยู่ใน URL ยังไง" (เฟส 1 ของงานแยก URL สองภาษา)
 *
 * ตอนนี้ทุกฟังก์ชันในไฟล์นี้ยังคืนเส้นทางเดิมไม่แตะอะไร ตั้งใจให้เป็นแบบนั้น
 * เป้าหมายของเฟสนี้คือรวบทุกจุดที่สร้างลิงก์ภายในเว็บ (96 จุดใน 33 ไฟล์)
 * ให้ไหลผ่านที่นี่ก่อน โดยเว็บต้องทำงานเหมือนเดิมเป๊ะ พิสูจน์ด้วย `npm run smoke`
 *
 * พอถึงเฟส 2 การเปิดใช้ /th กับ /en จะเป็นการแก้ที่ไฟล์นี้เป็นหลัก
 * แทนที่จะต้องไล่แก้ทีละจุดทั้งเว็บแล้วลุ้นว่าตกที่ไหนไปบ้าง
 */

export const LOCALES = ["th", "en"];

/** ภาษาที่ใช้เมื่อ URL ไม่ได้ระบุ — ไทย เพราะลูกค้าหลักเป็นคนไทยและต้องให้ Google เห็นเนื้อหาไทย */
export const DEFAULT_LOCALE = "th";

/** เฟส 2 จะเปลี่ยนเป็น true พร้อมกับย้ายหน้าเข้า app/[locale]/
 *  แยกเป็นธงไว้เพื่อให้เปิด/ปิดได้ทันทีถ้ามีอะไรผิดพลาดหลัง deploy */
export const LOCALE_PREFIX_ENABLED = true;

export const isLocale = (value) => LOCALES.includes(value);

/** ตัด prefix ภาษาออกจากเส้นทาง — "/en/about" → "/about"
 *  ใช้ตอนสลับภาษาและตอนเทียบว่าอยู่หน้าเดียวกันหรือเปล่า */
export function stripLocale(path) {
  const m = /^\/([^/]+)(\/.*)?$/.exec(path || "/");
  if (m && isLocale(m[1])) return m[2] || "/";
  return path || "/";
}

/** อ่านภาษาจากเส้นทาง — ไม่มี prefix ก็คืนภาษาเริ่มต้น */
export function localeFromPath(path) {
  const m = /^\/([^/]+)/.exec(path || "/");
  return m && isLocale(m[1]) ? m[1] : DEFAULT_LOCALE;
}

/* เส้นทางที่ไม่ต้องมีภาษาอยู่ใน URL — เหลือแค่ที่ไม่ใช่หน้าเว็บ
 * (admin ย้ายเข้า [locale] ด้วย เพื่อให้ทั้งเว็บมี root layout เดียว
 *  URL เดิม /admin ยังใช้ได้เพราะ middleware เด้งไป /th/admin ให้) */
const NO_LOCALE = /^\/(api|_next)(\/|$)/;

/**
 * ใส่ prefix ภาษาให้เส้นทางภายในเว็บ
 *
 * ปล่อยผ่านโดยไม่แตะ: ลิงก์ออกนอกเว็บ, mailto:, tel:, #anchor
 * และเส้นทางที่มี prefix อยู่แล้ว (กันการใส่ซ้ำเป็น /th/th/about)
 */
export function localePath(path, locale = DEFAULT_LOCALE) {
  if (typeof path !== "string" || path === "") return path;
  if (!path.startsWith("/") || path.startsWith("//")) return path; // ลิงก์นอกเว็บหรือ protocol-relative
  if (NO_LOCALE.test(path)) return path;
  if (!LOCALE_PREFIX_ENABLED) return path; // เฟส 1 — ยังไม่เปิดใช้

  const lang = isLocale(locale) ? locale : DEFAULT_LOCALE;
  const bare = stripLocale(path);
  return bare === "/" ? `/${lang}` : `/${lang}${bare}`;
}

/* ── ทะเบียนภาษาต่อหน้า ─────────────────────────────────────────────
 *
 * บอกว่าหน้านั้น "มีเนื้อหาจริง" ในภาษาอะไรบ้าง ไม่ใช่ว่าเปิด URL ไหนได้
 * ทุกหน้ายังเปิดได้ทั้ง /th และ /en เสมอ (ไม่งั้นเมนูจะพาไปหน้าที่เด้งข้ามภาษา
 * แล้วทั้งเว็บสลับภาษาให้ผู้ใช้โดยไม่ได้ตั้งใจ)
 *
 * ทะเบียนนี้คุมสองอย่างเท่านั้น:
 *   1. sitemap ส่งเฉพาะภาษาที่มีเนื้อหาจริง
 *   2. ภาษาที่ยังไม่มีเนื้อหา ติด noindex ไว้ Google จะได้ไม่เก็บเป็นหน้าซ้ำ
 *
 * ค่าตั้งต้นมาจากการวัดสัดส่วนอักษรไทยของทุกหน้าจริง (`npm run smoke`)
 * ไม่ได้กะเอา — หน้าไหนไทยเกินครึ่งถือว่าเขียนเป็นไทย ต่ำกว่านั้นถือว่าเป็นอังกฤษ
 *
 * แปลหน้าไหนเสร็จ ให้แก้เป็น ["th", "en"] บรรทัดเดียว แล้ว sitemap กับ noindex
 * จะตามให้เองทั้งคู่ ไม่มีทางหลุดไม่ตรงกันเพราะอ่านจากที่เดียว
 */
const PAGE_LOCALES = {
  // แปลครบสองภาษาแล้ว
  "/": ["th", "en"],
  "/forest_bathing": ["th", "en"],

  // เขียนเป็นภาษาไทย ยังไม่มีเวอร์ชันอังกฤษ
  "/services": ["th"],
  "/ekiden": ["th"],
  "/survey/readiness": ["th"],
  "/brand-guide": ["th"],

  "/about": ["th", "en"],

  // เขียนเป็นภาษาอังกฤษ ยังไม่มีเวอร์ชันไทย
  "/contact": ["en"],
  "/portfolio": ["en"],
  "/credential": ["en"],

  // ไม่ต้องการให้ Google เก็บเลย
  "/login": [],
  "/signup": [],
  "/survey": [],
};

/* หน้าที่สร้างจากข้อมูล (ผลงาน ฟีด กิจกรรม) มีเป็นสิบ ๆ หน้าและเพิ่มได้เรื่อย ๆ
 * จึงกำหนดเป็นกฎของทั้งกลุ่มแทนการไล่ใส่ทีละหน้า
 * เรียงจากเจาะจงไปกว้าง ตัวแรกที่ตรงเป็นตัวชนะ */
const SECTION_LOCALES = [
  [/^\/admin(\/|$)/, []],
  [/^\/portfolio\/work\//, ["en"]],
  [/^\/portfolio\/year\//, ["en"]],
  [/^\/credential\//, []], // เด็คของลูกค้าเฉพาะราย ไม่ควรอยู่ในผลค้นหา
  [/^\/feed(\/|$)/, ["th"]],
  [/^\/activities(\/|$)/, ["th"]],
];

/** ภาษาที่หน้านี้มีเนื้อหาจริง — รับ path แบบมีหรือไม่มี prefix ก็ได้ */
export function localesForPath(path) {
  const bare = stripLocale(path || "/").replace(/\/$/, "") || "/";
  if (bare in PAGE_LOCALES) return PAGE_LOCALES[bare];
  for (const [pattern, locales] of SECTION_LOCALES) {
    if (pattern.test(bare)) return locales;
  }
  return LOCALES; // ไม่ได้ระบุไว้ = ถือว่ามีครบทุกภาษา
}

/** หน้านี้ในภาษานี้ ควรให้ Google เก็บไหม */
export const shouldIndex = (path, locale) => localesForPath(path).includes(locale);
