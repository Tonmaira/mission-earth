"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

/* ขอข้อมูลฝั่งเซิร์ฟเวอร์ของหน้าใหม่ทุก ๆ everyMs (ยอดนักวิ่งจาก Sheet) โดยไม่โหลดหน้าใหม่
 * router.refresh() เก็บ state ฝั่งเบราว์เซอร์ไว้ครบ — วิดีโอเล่นต่อ, pop-up ที่เปิดอยู่ไม่ปิด, แท็บกรองไม่รีเซ็ต
 * แท็บที่ถูกซ่อน (สลับไปแอปอื่น/จอดับ) ไม่ขอ พอกลับมาค่อยขอทันทีหนึ่งครั้ง */
export default function AutoRefresh({ everyMs = 60_000 }) {
  const router = useRouter();

  useEffect(() => {
    const refresh = () => {
      if (document.visibilityState === "visible") router.refresh();
    };
    const id = setInterval(refresh, everyMs);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [router, everyMs]);

  return null;
}
