"use client";
import Link from "next/link";
import { useLocalePath } from "@/lib/useLocalePath";

/* <Link> ที่เติมภาษาให้ href เอง
 *
 * เป็น client component จึงเรียกใช้จากหน้า server ได้ตามปกติ ทำให้หน้า server
 * ไม่ต้องรับ locale มาส่งต่อเอง และเฟส 2 แก้ที่ lib/locale.js ที่เดียวได้จริง
 *
 * รับ props เหมือน <Link> ทุกอย่าง เปลี่ยนแค่ href
 */
export default function LocaleLink({ href, ...rest }) {
  const path = useLocalePath();
  return <Link href={path(href)} {...rest} />;
}
