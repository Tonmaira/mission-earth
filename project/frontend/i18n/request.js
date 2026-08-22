import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

/* บอก next-intl ว่าจะหาไฟล์ข้อความของแต่ละภาษาได้ที่ไหน
   โหลดเฉพาะภาษาที่ใช้จริง — ต่างจากของเดิมที่ import ทั้งสองภาษาเข้าเบราว์เซอร์เสมอ */
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
