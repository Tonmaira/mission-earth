"use client";
import { useCallback } from "react";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { stripLocale, localePath } from "@/lib/locale";

/** ปุ่มสลับภาษา — พาไป URL ของอีกภาษาหนึ่งโดยอยู่หน้าเดิม
 *
 *  สลับภาษาคือการ "เปลี่ยนหน้า" ไม่ใช่เปลี่ยน state เพราะภาษาอยู่ใน URL
 *  ผู้ใช้จึง copy ลิงก์ส่งต่อแล้วอีกฝ่ายเห็นภาษาเดียวกัน
 */
export function useLanguageToggle() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  return useCallback(() => {
    const next = locale === "en" ? "th" : "en";

    // ต้องพา query string ไปด้วย — usePathname() ไม่รวมให้
    // หน้าอาบป่าใช้ ?trip=<id> บอกว่าเปิดป็อปอัพจองของทริปไหนอยู่
    // ถ้าทิ้งไว้ กดเปลี่ยนภาษาระหว่างดูทริปแล้วป็อปอัพจะปิดหายไป
    //
    // อ่านจาก window ตอนกด ไม่ใช้ useSearchParams เพราะ hook นั้นจะทำให้
    // ทุกหน้าที่เรียกใช้กลายเป็น dynamic แทนที่จะ prerender ได้
    const search = typeof window === "undefined" ? "" : window.location.search;

    // scroll: false ไม่งั้นหน้าเด้งขึ้นบนสุดทุกครั้งที่เปลี่ยนภาษา
    router.push(localePath(stripLocale(pathname), next) + search, { scroll: false });
  }, [locale, pathname, router]);
}
