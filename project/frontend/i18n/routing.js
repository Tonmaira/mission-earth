import { defineRouting } from "next-intl/routing";
import { LOCALES, DEFAULT_LOCALE } from "@/lib/locale";

/* ตั้งค่ากลางของ next-intl — อ่านรายชื่อภาษาจาก lib/locale.js ที่เดียว
   เพื่อไม่ให้มีสองแหล่งที่บอกว่าเว็บรองรับภาษาอะไร แล้วหลุดไม่ตรงกัน

   localePrefix "always" = ทุก URL ต้องมีภาษานำหน้าเสมอ ตรงกับที่ทำไว้ในเฟส 2 */
export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: "always",
  // ไม่ให้เดาภาษาจาก header ของเบราว์เซอร์ — คนไทยเป็นลูกค้าหลัก
  // และ Googlebot ที่ส่ง Accept-Language อังกฤษมา ต้องได้หน้าไทยเหมือนกัน
  localeDetection: false,
});
