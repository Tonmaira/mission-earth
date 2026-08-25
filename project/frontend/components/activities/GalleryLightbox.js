"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import IconClose from "@/components/icons/IconClose";

/** แกลเลอรีรูปเต็มจอ — พอร์ตมาจาก GalleryLightbox ใน ForestBathingLocations.js
 *  ใช้ร่วมกับ ActivityModal เท่านั้น (z-[80] ซ้อนเหนือ modal ที่ z-[70]) */
export default function GalleryLightbox({ images, startIndex = 0, onClose }) {
  const [index, setIndex] = useState(startIndex);
  const go = (step) => setIndex((i) => (i + step + images.length) % images.length);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [images.length]);

  return (
    <div
      className="fixed inset-0 z-[80] flex flex-col bg-black/92 backdrop-blur-sm"
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <div className="flex shrink-0 items-center justify-between px-4 py-3 text-white sm:px-6">
        <span className="text-[14px] tabular-nums">
          {index + 1}/{images.length}
        </span>
        <button
          onClick={onClose}
          aria-label="ปิด"
          className="rounded-full bg-white/10 p-1.5 transition-colors hover:bg-white/20"
        >
          <IconClose size={28} className="h-3 w-3" />
        </button>
      </div>

      <div className="relative min-h-0 flex-1" onClick={(e) => e.stopPropagation()}>
        <Image
          key={index}
          src={images[index]}
          alt={`รูปที่ ${index + 1}`}
          fill
          sizes="100vw"
          className="object-contain"
        />

        <button
          onClick={() => go(-1)}
          aria-label="รูปก่อนหน้า"
          className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 px-4 py-3 text-[22px] leading-none text-white transition-colors hover:bg-black/70 sm:left-6"
        >
          ‹
        </button>
        <button
          onClick={() => go(1)}
          aria-label="รูปถัดไป"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 px-4 py-3 text-[22px] leading-none text-white transition-colors hover:bg-black/70 sm:right-6"
        >
          ›
        </button>
      </div>

      <div className="flex shrink-0 gap-2 overflow-x-auto px-4 py-3 sm:px-6" onClick={(e) => e.stopPropagation()}>
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`ไปรูปที่ ${i + 1}`}
            className={`relative h-14 w-20 shrink-0 overflow-hidden rounded transition-opacity ${
              i === index ? "ring-2 ring-[#FDF164]" : "opacity-50 hover:opacity-90"
            }`}
          >
            <Image src={src} alt="" fill sizes="80px" className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
