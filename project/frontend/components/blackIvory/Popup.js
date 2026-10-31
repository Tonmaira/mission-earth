"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

const BASE = "/blackIvory";
export const NAVY = "#0b2540";

// พื้นหลังของกล่อง: light = กระดาษครีมแบบโปสเตอร์ Race Pack, dark = กรมท่าลายดาวแบบโปสเตอร์ระยะทาง
const THEMES = {
  light: { bg: "mainBG_white.png", color: NAVY },
  dark: { bg: "mainBG.png", color: "#fff" },
};

/* ปุ่ม + pop-up ที่ทุก pop-up ในหน้า Black Ivory ใช้ร่วมกัน
 *   children = สิ่งที่กดได้ในหน้า, content = เนื้อหาในกล่อง
 *
 * ใช้ <dialog> ของเบราว์เซอร์: ลอยอยู่เหนือทุกอย่าง (รวมวิดีโอ fixed), กด Esc ปิดได้,
 * โฟกัสคีย์บอร์ดวนอยู่ข้างในให้เอง ไม่ต้องเขียนเอง
 * ล็อกการเลื่อนหน้าหลังไว้ระหว่างเปิด จะได้ไม่เลื่อนทะลุไปหน้าข้างหลังบนมือถือ */
export default function Popup({ children, content, label, className = "", theme = "light", width = "max-w-[880px]" }) {
  const ref = useRef(null);
  const [open, setOpen] = useState(false);
  const look = THEMES[theme];
  const t = useTranslations("blackIvory");

  // ฟัง close ของ <dialog> ตรง ๆ — ปิดด้วย Esc เบราว์เซอร์ปิดเองโดยไม่ผ่าน state
  // ถ้าไม่ sync กลับ open จะค้างเป็น true: หน้าหลังเลื่อนไม่ได้ และกดเปิดซ้ำไม่ขึ้น
  useEffect(() => {
    const dialog = ref.current;
    const sync = () => setOpen(false);
    dialog.addEventListener("close", sync);
    return () => dialog.removeEventListener("close", sync);
  }, []);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className} aria-haspopup="dialog">
        {children}
      </button>

      <dialog
        ref={ref}
        // กดพื้นมืดรอบกล่อง = ปิด (คลิกที่ตัว dialog เองคือคลิกนอกเนื้อหา)
        onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        aria-label={label}
        className={`m-auto max-h-[92dvh] w-[calc(100%-1.5rem)] overflow-hidden rounded-3xl p-0 backdrop:bg-black/70 backdrop:backdrop-blur-sm ${width}`}
      >
        {open && (
          <div
            className="max-h-[92dvh] overflow-y-auto bg-cover bg-center"
            style={{ backgroundImage: `url(${BASE}/${look.bg})`, color: look.color }}
          >
            <header
              className="sticky top-0 z-10 flex items-center justify-between gap-4 px-5 py-3 sm:px-8"
              style={{ backgroundColor: NAVY }}
            >
              <Image
                src={`${BASE}/BITTLOGO.png`}
                alt="Mission Earth Black Ivory Trail Thailand"
                width={6643}
                height={3065}
                sizes="180px"
                className="w-24 sm:w-32"
              />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={t("close")}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-5 w-5">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </header>
            {content}
          </div>
        )}
      </dialog>
    </>
  );
}
