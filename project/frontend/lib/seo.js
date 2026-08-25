import { LOCALES, DEFAULT_LOCALE, isLocale, localesForPath } from "@/lib/locale";

/* ตัวสร้าง metadata ให้ทุกหน้า — จุดเดียวที่รู้ว่า canonical กับ hreflang ต้องหน้าตายังไง
 *
 * ทำไมต้องรวมไว้ที่เดียว: ก่อนหน้านี้แต่ละหน้าเขียน canonical เองเป็นข้อความตายตัว
 * พอเฟส 2 ย้าย URL ไปอยู่ใต้ /th กับ /en ทุกอันเลยชี้ไปที่อยู่เก่าที่ไม่มีหน้าอยู่จริง
 * ซึ่งเป็นการบอก Google ผิดว่า "ที่อยู่ทางการของหน้านี้คือตรงนั้น"
 */

export const SITE = "https://www.missionearth.co";
export const SITE_NAME = "Mission Earth";

const absolute = (locale, path) => `${SITE}/${locale}${path === "/" ? "" : path}`;

/**
 * สร้าง metadata ของหน้าหนึ่ง
 *
 *   locale       ภาษาของหน้านี้ (มาจาก params ของ [locale])
 *   path         เส้นทางแบบไม่มีภาษา เช่น "/forest_bathing"
 *   title        ชื่อหน้า — ต่อท้ายด้วย "| Mission Earth" ให้เอง
 *   description  คำอธิบายที่จะขึ้นใต้ชื่อในผลค้นหา
 *   image        รูปที่จะขึ้นตอนแปะลิงก์ใน LINE/Facebook (ไม่ใส่ก็ได้)
 */
export function pageMetadata({ locale, path, title, description, image, keywords }) {
  const lang = isLocale(locale) ? locale : DEFAULT_LOCALE;
  const canonical = absolute(lang, path);
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;

  // ประกาศภาษาอื่นเฉพาะที่มีเนื้อหาจริง — ถ้าประกาศทั้งที่ยังไม่ได้แปล
  // Google จะเจอสองหน้าที่เหมือนกันเป๊ะแล้วเลือกทิ้งอันหนึ่งเอง
  const available = localesForPath(path);
  const languages =
    available.length > 1
      ? Object.fromEntries([
          ...available.map((l) => [l, absolute(l, path)]),
          ["x-default", absolute(available.includes(DEFAULT_LOCALE) ? DEFAULT_LOCALE : available[0], path)],
        ])
      : undefined;

  return {
    title: fullTitle,
    description,
    ...(keywords ? { keywords } : {}),
    alternates: { canonical, ...(languages ? { languages } : {}) },
    openGraph: {
      title: fullTitle,
      description,
      url: canonical,
      siteName: SITE_NAME,
      locale: lang === "th" ? "th_TH" : "en_US",
      type: "website",
      ...(image ? { images: [{ url: image }] } : {}),
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: fullTitle,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}

/** ชื่อ/คำอธิบายของหน้าที่ยังไม่มี metadata เป็นของตัวเอง
 *  เก็บรวมไว้ที่นี่เพื่อไม่ต้องสร้าง layout.js เพิ่มอีก 8 ไฟล์
 *  ข้อความการตลาดควรให้ทีมตรวจอีกรอบ — ตอนนี้เขียนจากเนื้อหาที่มีอยู่บนหน้า */
export const PAGE_SEO = {
  "/": {
    th: { title: "ที่ปรึกษาด้านความยั่งยืน", description: "Mission Earth พาองค์กรลงมือเรื่องความยั่งยืนได้จริง ทั้งอบรม กิจกรรม ทริปเรียนรู้ และบอร์ดเกม" },
    en: { title: "Sustainability Partner", description: "Mission Earth turns sustainability into something your organisation can actually do — training, events, learning trips, and board games." },
  },
  "/about": {
    th: { title: "เกี่ยวกับเรา", description: "ทีม Mission Earth คือใคร ทำอะไร และทำไมเราถึงเชื่อว่าความยั่งยืนต้องจับต้องได้" },
    en: { title: "About Us", description: "Who Mission Earth is, what we do, and why we believe sustainability has to be something people can act on." },
  },
  "/services": {
    th: { title: "บริการของเรา", description: "อบรม ESG จัดอีเวนต์ ทริปเรียนรู้ และบอร์ดเกมเพื่อความยั่งยืน สำหรับองค์กรทุกขนาด" },
    en: { title: "Our Services", description: "ESG training, events, learning trips, and sustainability board games for organisations of every size." },
  },
  "/portfolio": {
    th: { title: "ผลงานที่ผ่านมา", description: "โครงการความยั่งยืนที่ Mission Earth ทำร่วมกับองค์กรชั้นนำทั่วประเทศไทย" },
    en: { title: "Our Work", description: "Sustainability projects Mission Earth has delivered with leading organisations across Thailand." },
  },
  "/contact": {
    th: { title: "ติดต่อเรา", description: "คุยกับ Mission Earth เรื่องอบรม กิจกรรม หรือโครงการความยั่งยืนขององค์กรคุณ" },
    en: { title: "Contact Us", description: "Talk to Mission Earth about training, events, or a sustainability programme for your organisation." },
  },
  "/survey/readiness": {
    th: { title: "แบบประเมินความพร้อมด้านความยั่งยืน", description: "ประเมินว่าองค์กรของคุณพร้อมแค่ไหนสำหรับการเปลี่ยนผ่านสู่ความยั่งยืน ใช้เวลาไม่กี่นาที" },
    en: { title: "Sustainability Readiness Check", description: "See how ready your organisation is for the sustainability transition — takes a few minutes." },
  },
  "/brand-guide": {
    th: { title: "คู่มือแบรนด์", description: "แนวทางการใช้โลโก้ สี และตัวอักษรของ Mission Earth" },
    en: { title: "Brand Guide", description: "How to use the Mission Earth logo, colours, and typefaces." },
  },
  "/activities": {
    th: { title: "กิจกรรมทั้งหมด", description: "รวมกิจกรรมของ Mission Earth และพาร์ทเนอร์ ทั้งอบรม ทริปเรียนรู้ และกิจกรรมเพื่อความยั่งยืน" },
    en: { title: "Activities", description: "Explore Mission Earth's activities and partner events — training, learning trips, and sustainability programmes." },
  },
};

/** ดึงชื่อ/คำอธิบายของหน้าตาม path และภาษา — ไม่มีก็คืน undefined ให้ไปใช้ค่าเริ่มต้น */
export const seoFor = (path, locale) => PAGE_SEO[path]?.[isLocale(locale) ? locale : DEFAULT_LOCALE];

export { LOCALES };
