"use client";
import { useState } from "react";
import Link from "next/link";

export default function PopupRegister() {
  const [closed, setClosed] = useState(false);

  if (closed) return null;

  return (
    <div className="fixed bottom-5 left-5 z-[999] group">
      <button
        onClick={() => setClosed(true)}
        className="absolute -top-2 -right-2 z-10 w-5 h-5 rounded-full bg-white/80 text-black flex items-center justify-center text-xs leading-none hover:bg-white transition-colors"
        aria-label="ปิด"
      >
        ✕
      </button>
      <Link href="/activities/dek-sang-nan-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/image/activities/dek-sang-nan-2/component/popup-register.png"
          alt="สมัครเข้าร่วม Bootcamp เด็กสร้างน่าน"
          width={180}
          className="drop-shadow-xl opacity-50 group-hover:opacity-100 transition-opacity duration-200"
        />
      </Link>
    </div>
  );
}
