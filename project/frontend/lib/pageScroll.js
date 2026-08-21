/* หน้า Home เลื่อนคนละที่กันตามขนาดจอ
 *   เดสก์ท็อป — <main> เป็นตัวเลื่อนเอง (h-screen overflow-y-scroll + snap ทีละ section)
 *   มือถือ     — ไม่มี snap แล้ว section สูงตามเนื้อหา จึงปล่อยให้ document เลื่อนตามปกติ
 *                (แถบ address bar ของเบราว์เซอร์จะยุบ/กางได้ ซึ่ง scroller ซ้อนในทำไม่ได้)
 *
 * ผู้ใช้หมุนจอหรือย่อ/ขยายหน้าต่างข้ามเบรกพอยต์ได้ ตัวเลื่อนจึงสลับได้ตลอดอายุหน้า
 * ห้ามจำไว้ตั้งแต่ mount — ต้องเช็คใหม่ทุกครั้งที่จะอ่าน/เขียนตำแหน่ง */

/** คืน element ที่เลื่อนอยู่จริง หรือ null ถ้าเป็น document ที่เลื่อน */
export function getPageScroller(selector = "main") {
  const el = typeof document === "undefined" ? null : document.querySelector(selector);
  if (!el) return null;
  const overflowY = getComputedStyle(el).overflowY;
  if (overflowY !== "auto" && overflowY !== "scroll") return null;
  // ตั้ง overflow ไว้แต่เนื้อหาไม่ล้น = ยังไม่ได้เลื่อนจริง ให้ถือว่า document เลื่อน
  return el.scrollHeight > el.clientHeight + 1 ? el : null;
}

/** ตำแหน่ง scroll ปัจจุบันของหน้า ไม่ว่าตัวเลื่อนจะเป็นอะไร */
export function getPageScrollTop(selector = "main") {
  const el = getPageScroller(selector);
  return el ? el.scrollTop : window.scrollY;
}

/** ดักการเลื่อนของหน้า — ติดไว้ทั้งสองที่เพราะตัวเลื่อนสลับได้ระหว่างทาง
 *  (ที่ไม่ได้เลื่อนก็แค่ไม่ยิง event) คืนฟังก์ชันสำหรับถอด listener */
export function onPageScroll(handler, selector = "main") {
  const el = typeof document === "undefined" ? null : document.querySelector(selector);
  window.addEventListener("scroll", handler, { passive: true });
  el?.addEventListener("scroll", handler, { passive: true });
  return () => {
    window.removeEventListener("scroll", handler);
    el?.removeEventListener("scroll", handler);
  };
}
