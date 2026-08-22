"use client";
import { useCallback } from "react";
import { usePathname } from "next/navigation";
import { localePath, localeFromPath } from "@/lib/locale";

/* ตัวช่วยฝั่ง client สำหรับสร้างลิงก์ที่มีภาษาติดไปด้วย
 *
 *   const path = useLocalePath();
 *   <a href={path("/contact")}>ติดต่อ</a>
 *   router.push(path("/portfolio"))
 *
 * เฟส 1 ยังคืนเส้นทางเดิม เพราะ localePath() ยังปิดการใส่ prefix อยู่
 * ภาษาอ่านจาก URL ปัจจุบัน ไม่ใช่จาก localStorage โดยตั้งใจ —
 * เป้าหมายของงานนี้คือให้ URL เป็นตัวบอกภาษา ไม่ใช่ค่าที่เก็บไว้ในเครื่องผู้ใช้
 * ซึ่งเป็นสาเหตุที่ Googlebot เห็นแต่ภาษาอังกฤษมาตลอด
 */
export function useLocalePath() {
  const locale = localeFromPath(usePathname());
  // ต้องเป็นฟังก์ชันตัวเดิมข้าม render ไม่งั้นใครที่เอาไปใส่ใน dependency ของ
  // useEffect จะวนไม่รู้จบ (ฟังก์ชันใหม่ทุกครั้ง = dependency เปลี่ยนทุกครั้ง)
  return useCallback((path) => localePath(path, locale), [locale]);
}

/** ภาษาปัจจุบันตาม URL — ใช้ตอนทำปุ่มสลับภาษาในเฟส 2 */
export function useLocale() {
  return localeFromPath(usePathname());
}
