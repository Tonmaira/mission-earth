"use client";
import { useEffect } from "react";

/* หน้า Home เลื่อนด้วย <main> เอง (overflow-y-scroll h-screen snap-y) ไม่ใช่ document
   เบราว์เซอร์กับ Next จำตำแหน่ง scroll ให้อัตโนมัติเฉพาะ scroller ของหน้าเท่านั้น
   ตัวที่เราทำเองจึงต้องเก็บ/คืนตำแหน่งเอง

   popstate ยิงตอนยังอยู่หน้าเดิม ก่อน React จะ mount หน้าใหม่ ธงเลยต้องอยู่นอก component
   ไม่งั้นค่าจะหายไปพร้อมกับ component ที่ถูก unmount */
let cameFromHistory = false;

if (typeof window !== "undefined") {
  window.addEventListener("popstate", () => {
    cameFromHistory = true;
  });
  // กด back จนโหลดหน้าใหม่ทั้งหน้า (ไม่ได้วิ่งผ่าน client-side routing) popstate จะไม่ยิง
  const nav = performance.getEntriesByType("navigation")[0];
  if (nav?.type === "back_forward") cameFromHistory = true;
}

// เผื่อกรณีเนื้อหายังสูงไม่ครบตอน mount (ตั้ง scrollTop แล้วโดน clamp) ให้ลองซ้ำได้ไม่เกินเท่านี้เฟรม
const MAX_RESTORE_FRAMES = 40;

/** คืนตำแหน่ง scroll ให้ container ที่ไม่ใช่ document — คืนเฉพาะตอนกด back/forward
 *  ถ้าเข้าหน้านี้ด้วยวิธีอื่น (กด Home บน navbar, พิมพ์ URL, เปิดลิงก์ใหม่) จะเริ่มที่บนสุดตามปกติ */
export default function ScrollRestore({ selector = "main", storageKey }) {
  useEffect(() => {
    const el = document.querySelector(selector);
    if (!el) return;

    // อ่านค่าที่เก็บไว้ให้เสร็จก่อนติด listener เสมอ
    // ไม่งั้น scroll event ตอนหน้าเพิ่งโหลด (ยังอยู่ที่ 0) จะเขียนทับค่าเดิมทิ้ง
    const saved = Number(sessionStorage.getItem(storageKey)) || 0;

    let restoring = false;
    let restoreRaf = null;
    let saveRaf = null;

    // ปิด smooth ชั่วคราว ไม่งั้นจะเห็นหน้าไถลจากบนสุดลงมาแทนที่จะโผล่ตรงจุดเดิมเลย
    const applyRestore = () => {
      const prev = el.style.scrollBehavior;
      el.style.scrollBehavior = "auto";
      el.scrollTop = saved;
      el.style.scrollBehavior = prev;
      return Math.abs(el.scrollTop - saved) <= 1;
    };

    if (cameFromHistory && saved > 0) {
      restoring = true;

      // ตั้งแบบ synchronous ไปเลยก่อน — ปกติเนื้อหาสูงครบตั้งแต่ mount แล้ว (section เป็น h-dvh)
      // rAF ไว้เป็นทางสำรองเฉพาะตอนที่ยังไม่ครบ
      if (applyRestore()) {
        cameFromHistory = false;
        restoring = false;
      } else {
        let frames = 0;
        const retry = () => {
          restoreRaf = null;
          if (applyRestore() || (frames += 1) >= MAX_RESTORE_FRAMES) {
            cameFromHistory = false;
            restoring = false;
            return;
          }
          restoreRaf = requestAnimationFrame(retry);
        };
        restoreRaf = requestAnimationFrame(retry);
      }
      // หมายเหตุ: ห้ามล้างธงก่อนที่ scroll จะติดจริง
      // ตอน dev React StrictMode จะ mount/unmount ซ้ำ ทำให้ rAF ที่ตั้งไว้ถูกยกเลิก
      // ถ้าล้างธงไปแล้วรอบสองจะไม่คืนตำแหน่งให้อีกเลย
    }

    const save = () => {
      saveRaf = null;
      if (restoring) return; // ระหว่างกำลังคืนตำแหน่ง อย่าเพิ่งบันทึกทับ
      sessionStorage.setItem(storageKey, String(Math.round(el.scrollTop)));
    };
    const onScroll = () => {
      if (saveRaf === null) saveRaf = requestAnimationFrame(save);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      if (saveRaf !== null) cancelAnimationFrame(saveRaf);
      if (restoreRaf !== null) cancelAnimationFrame(restoreRaf);
      // ไม่บันทึกซ้ำตอน cleanup — ค่าล่าสุดถูกเก็บจาก scroll ไปแล้ว
      // ถ้าบันทึกตรงนี้ StrictMode จะเขียนทับด้วย 0 ตอน mount รอบแรก
    };
  }, [selector, storageKey]);

  return null;
}
