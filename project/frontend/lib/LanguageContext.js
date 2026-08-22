"use client";
import { useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { stripLocale, localePath } from "@/lib/locale";

/* ตัวห่อบาง ๆ ครอบ next-intl ให้โค้ดเดิมที่เรียก useLang() ใช้ได้เหมือนเดิม
 *
 * ของเดิมเป็นระบบแปลที่เขียนเองทั้งหมด ตอนนี้เปลี่ยนมาใช้ next-intl ซึ่งเป็น
 * ไลบรารีมาตรฐานของ Next.js ได้สามอย่างที่ของเดิมทำไม่ได้:
 *   1. ส่งเฉพาะภาษาที่ใช้ไปให้เบราว์เซอร์ (เดิมส่งทั้งสองภาษาเสมอ)
 *   2. คีย์ที่หายจะเตือนตอนพัฒนา ไม่ใช่ขึ้นชื่อคีย์ดิบให้ลูกค้าเห็นเงียบ ๆ
 *   3. แทนค่าในข้อความได้ในตัว — t("key", { name }) ไม่ต้อง .replace() เอง
 *
 * เก็บ useLang ไว้เพื่อไม่ต้องแก้ 133 จุดพร้อมกัน
 * โค้ดใหม่ควรเรียก useTranslations() ของ next-intl ตรง ๆ
 * และหน้าที่เป็น server component ใช้ getTranslations() ได้ด้วย ซึ่งของเดิมทำไม่ได้เลย
 */
export function useLang() {
  const t = useTranslations();
  const lang = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  // สลับภาษา = ไปอีก URL หนึ่ง ไม่ใช่เปลี่ยน state ในหน้าเดิม
  const toggleLang = useCallback(() => {
    const next = lang === "en" ? "th" : "en";

    // ต้องพา query string ไปด้วย — usePathname() ไม่รวมให้
    // หน้าอาบป่าใช้ ?trip=<id> เป็นตัวบอกว่าเปิดป็อปอัพจองของทริปไหนอยู่
    // ถ้าทิ้งไว้ กดเปลี่ยนภาษาระหว่างดูทริปแล้วป็อปอัพจะปิดหายไปเลย
    //
    // อ่านจาก window ตอนกด ไม่ใช้ useSearchParams เพราะ hook นั้นจะทำให้
    // ทุกหน้าที่อยู่ใต้ provider นี้ (คือทั้งเว็บ) กลายเป็น dynamic แทนที่จะ prerender ได้
    const search = typeof window === "undefined" ? "" : window.location.search;

    // scroll: false ไม่งั้นหน้าเด้งขึ้นบนสุดทุกครั้งที่เปลี่ยนภาษา
    router.push(localePath(stripLocale(pathname), next) + search, { scroll: false });
  }, [lang, pathname, router]);

  return { t, lang, toggleLang };
}
