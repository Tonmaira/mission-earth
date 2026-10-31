"use client";
import { useEffect, useState, useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";

const IDLE_MS = 3000;

const onFullscreenChange = (cb) => {
  document.addEventListener("fullscreenchange", cb);
  document.addEventListener("webkitfullscreenchange", cb);
  return () => {
    document.removeEventListener("fullscreenchange", cb);
    document.removeEventListener("webkitfullscreenchange", cb);
  };
};
const readSupported = () => Boolean(document.fullscreenEnabled || document.webkitFullscreenEnabled);
const readIsFull = () => Boolean(document.fullscreenElement || document.webkitFullscreenElement);
const onServer = () => false;

/* ปุ่มเต็มจอ — ซ่อนแถบเบราว์เซอร์ให้เหลือแต่หน้า (เปิดค้างบนจอ/ทีวีที่งาน)
 *
 * เบราว์เซอร์ยอมให้เข้าเต็มจอเฉพาะตอนผู้ใช้กดเท่านั้น สั่งเองตอนเปิดหน้าไม่ได้
 * iPhone ไม่รองรับเต็มจอทั้งหน้า (fullscreenEnabled = false) → ไม่แสดงปุ่มเลย
 * Safari รุ่นเก่า/iPad บางรุ่นมีแต่ชื่อ webkit* จึงเช็กทั้งสองแบบ
 * เมาส์นิ่งเกิน 3 วิ ปุ่มจะจางหาย ขยับเมาส์/แตะจอแล้วกลับมา */
export default function FullscreenButton({ className = "" }) {
  const supported = useSyncExternalStore(onFullscreenChange, readSupported, onServer);
  const isFull = useSyncExternalStore(onFullscreenChange, readIsFull, onServer);
  const [awake, setAwake] = useState(true);
  const t = useTranslations("blackIvory.fullscreen");

  useEffect(() => {
    let timer = setTimeout(() => setAwake(false), IDLE_MS);
    const wake = () => {
      setAwake(true);
      clearTimeout(timer);
      timer = setTimeout(() => setAwake(false), IDLE_MS);
    };
    window.addEventListener("pointermove", wake);
    window.addEventListener("pointerdown", wake);
    window.addEventListener("keydown", wake);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("pointermove", wake);
      window.removeEventListener("pointerdown", wake);
      window.removeEventListener("keydown", wake);
    };
  }, []);

  if (!supported) return null;

  const toggle = () => {
    const root = document.documentElement;
    if (isFull) (document.exitFullscreen || document.webkitExitFullscreen).call(document);
    else (root.requestFullscreen || root.webkitRequestFullscreen).call(root);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isFull ? t("exit") : t("enter")}
      title={isFull ? t("exitHint") : t("enter")}
      className={`flex items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-sm transition-opacity duration-500 hover:bg-black/55 focus-visible:opacity-100 ${
        awake ? "opacity-100" : "pointer-events-none opacity-0"
      } ${className}`}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-1/2 w-1/2">
        {isFull ? (
          <path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" />
        ) : (
          <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
        )}
      </svg>
    </button>
  );
}
