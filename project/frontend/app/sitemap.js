import { LOCALES, DEFAULT_LOCALE, localesForPath } from "@/lib/locale";
import { WORKS } from "@/components/credential/works";

const BASE = "https://www.missionearth.co";

/* หน้าที่อยากให้ Google เก็บ พร้อมน้ำหนักความสำคัญ
 * ใส่เป็นเส้นทางแบบไม่มีภาษา แล้วเดี๋ยวขยายเป็นทุกภาษาให้เอง */
const PAGES = [
  { path: "/", changeFrequency: "weekly", priority: 1.0 },
  { path: "/forest_bathing", changeFrequency: "weekly", priority: 0.9 },
  { path: "/ekiden", changeFrequency: "weekly", priority: 0.9 },
  { path: "/activities/dek-sang-nan-2", changeFrequency: "weekly", priority: 0.9 },
  { path: "/services", changeFrequency: "monthly", priority: 0.7 },
  { path: "/about", changeFrequency: "monthly", priority: 0.7 },
  { path: "/portfolio", changeFrequency: "monthly", priority: 0.7 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.6 },
];

const url = (locale, path) => `${BASE}/${locale}${path === "/" ? "" : path}`;

/** ประกาศให้ Google รู้ว่าหน้านี้มีภาษาอะไรบ้างและอยู่ที่ไหน
 *  ประกาศเฉพาะภาษาที่มีเนื้อหาจริง — ถ้าประกาศภาษาที่ยังไม่ได้แปล
 *  Google จะเจอสองหน้าที่เนื้อหาเหมือนกันเป๊ะแล้วเลือกทิ้งอันหนึ่งเอง
 *  มีภาษาเดียวก็ไม่ต้องประกาศ hreflang เลย */
const languages = (path, locales) => {
  if (locales.length < 2) return undefined;
  return Object.fromEntries([
    ...locales.map((l) => [l, url(l, path)]),
    ["x-default", url(locales.includes(DEFAULT_LOCALE) ? DEFAULT_LOCALE : locales[0], path)],
  ]);
};

export default function sitemap() {
  const lastModified = new Date();

  // หน้าผลงานแต่ละชิ้นก็ควรอยู่ใน sitemap ด้วย — ของเดิมตกไป 22 หน้า
  const workPages = WORKS.map((w) => ({
    path: `/portfolio/work/${w.slug}`,
    changeFrequency: "yearly",
    priority: 0.5,
  }));

  return [...PAGES, ...workPages].flatMap(({ path, changeFrequency, priority }) => {
    // ส่งเฉพาะภาษาที่หน้านั้นมีเนื้อหาจริง ตามทะเบียนใน lib/locale.js
    const locales = localesForPath(path);
    return locales.map((locale) => ({
      url: url(locale, path),
      lastModified,
      changeFrequency,
      priority,
      alternates: languages(path, locales) ? { languages: languages(path, locales) } : undefined,
    }));
  });
}
