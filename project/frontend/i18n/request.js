import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";
import { NAMESPACES } from "./namespaces";

/* บอก next-intl ว่าจะหาไฟล์ข้อความของแต่ละภาษาได้ที่ไหน
 * โหลดเฉพาะภาษาที่ใช้จริง — ต่างจากระบบเดิมที่ import ทั้งสองภาษาเข้าเบราว์เซอร์เสมอ
 *
 * ข้อความแยกเป็นไฟล์ละ namespace (messages/th/about.json ฯลฯ) แล้วรวมกลับที่นี่
 * คีย์ที่โค้ดเรียกจึงเหมือนเดิมทุกประการ เช่น t("about.visionTitle")
 * ยังเป็น about.visionTitle ไม่ว่าจะเก็บไว้ไฟล์ไหน
 */
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  const loaded = await Promise.all(
    NAMESPACES.map(async (ns) => [ns, (await import(`../messages/${locale}/${ns}.json`)).default])
  );

  return { locale, messages: Object.fromEntries(loaded) };
});
