import { NextResponse } from "next/server";
import { LOCALES, DEFAULT_LOCALE, isLocale, shouldIndex } from "@/lib/locale";

/* พา URL ที่ไม่มีภาษานำหน้า ไปยังภาษาเริ่มต้น
 *
 *   /            → /th
 *   /about       → /th/about
 *   /forest_bathing?trip=x → /th/forest_bathing?trip=x
 *   /th/about    → ปล่อยผ่าน
 *
 * ทำไมต้อง 308 ไม่ใช่ 307: ลิงก์เดิมของเว็บถูกแปะไว้ใน Facebook, LINE, QR ที่พิมพ์ไปแล้ว
 * และ Google เก็บ URL ชุดเดิมไว้ การเด้งแบบถาวรคือสิ่งที่บอก Google ว่า
 * "หน้านี้ย้ายไปอยู่ที่ใหม่แล้ว ให้โอนอันดับตามไปด้วย" — ถ้าใช้ 307 (ชั่วคราว)
 * Google จะยังเก็บ URL เดิมไว้และไม่โอนอันดับให้
 */

/** ไฟล์และเส้นทางที่ไม่ใช่หน้าเว็บ ห้ามยุ่ง */
const PASS_THROUGH = /^\/(api|_next|favicon\.ico|icon\.png|robots\.txt|sitemap\.xml)(\/|$)/;

export function middleware(request) {
  const { pathname, search } = request.nextUrl;

  if (PASS_THROUGH.test(pathname)) return NextResponse.next();

  const first = pathname.split("/")[1];
  if (isLocale(first)) {
    /* ทุกหน้าเปิดได้ทั้งสองภาษาเสมอ เพื่อไม่ให้เมนูพาผู้ใช้ข้ามภาษาโดยไม่ตั้งใจ
       แต่ภาษาที่ยังไม่มีเนื้อหาจริง ไม่ควรให้ Google เก็บ ไม่งั้นจะกลายเป็นหน้าซ้ำ
       ใช้ header แทนการใส่ meta ในทุกหน้า เพราะที่นี่รู้ path อยู่แล้วที่เดียว
       follow ไว้ด้วย ลิงก์ในหน้าจะได้ยังส่งต่อน้ำหนักไปหน้าอื่นได้ตามปกติ */
    if (!shouldIndex(pathname, first)) {
      const res = NextResponse.next();
      res.headers.set("X-Robots-Tag", "noindex, follow");
      return res;
    }
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${DEFAULT_LOCALE}${pathname === "/" ? "" : pathname}`;
  url.search = search;
  return NextResponse.redirect(url, 308);
}

export const config = {
  /* ไม่แตะไฟล์ static — ตัว matcher นี้กันไว้อีกชั้นนอกจาก PASS_THROUGH ข้างบน
     เพื่อไม่ให้ middleware ถูกเรียกโดยไม่จำเป็นทุกครั้งที่โหลดรูปหรือ chunk */
  matcher: ["/((?!_next/static|_next/image|api|.*\\..*).*)"],
};

export { LOCALES };
