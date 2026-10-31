"use client";
import { useTranslations } from "next-intl";
import { useLanguageToggle } from "@/lib/useLanguageToggle";

/* ปุ่มสลับ ไทย/English — หน้านี้ไม่มี navbar ของเว็บ จึงต้องมีปุ่มของตัวเอง
 * ป้ายบอกภาษาที่จะเปลี่ยนไป (หน้าไทยขึ้น "English", หน้าอังกฤษขึ้น "ภาษาไทย") */
export default function LangToggle({ className = "" }) {
  const t = useTranslations("blackIvory");
  const toggle = useLanguageToggle();
  return (
    <button
      type="button"
      onClick={toggle}
      className={`whitespace-nowrap rounded-full bg-black/35 px-[1em] font-semibold text-white backdrop-blur-sm hover:bg-black/55 ${className}`}
    >
      {t("langSwitch")}
    </button>
  );
}
