"use client";
import { useEffect, useState } from "react";

const BASE = "/blackIvory";

/* วิดีโอพื้นหลังเต็มจอแบบอยู่กับที่ (fixed) — เนื้อหาเลื่อนผ่านทับ
 *
 * มีสองไฟล์: แนวนอนกับแนวตั้ง เลือกตามรูปทรงจอด้วย JS แทนการวาง <video> สองตัวแล้วซ่อนด้วย CSS
 * เพราะ <video> ที่ซ่อนอยู่เบราว์เซอร์ยังโหลดไฟล์ด้วย = มือถือต้องโหลด 2 ไฟล์ทั้งที่ดูแค่อันเดียว
 *
 * ระหว่างรอ JS/วิดีโอ จะเห็นภาพเฟรมแรก (poster) ที่เลือกด้วย CSS ล้วน ๆ จึงไม่มีจอดำ
 * คนที่ตั้งเครื่องให้ลดภาพเคลื่อนไหว (prefers-reduced-motion) จะเห็นแค่ภาพนิ่งนี้
 *
 * ไฟล์ bg-*.mp4 บีบมาจาก VDOBITT2notext.mp4 (45MB → ~7MB, ตัดเสียง) — เวอร์ชันที่ไม่มีโลโก้ฝังในภาพ
 * ต้นฉบับมีแค่แนวนอน → แนวตั้งครอปตรงกลาง 608×1080 (เท่ากับที่ object-cover จะครอปบนมือถืออยู่แล้ว แต่ไฟล์เล็กกว่า)
 *   X="-an -c:v libx264 -preset slow -crf 27 -maxrate 2M -bufsize 4M -pix_fmt yuv420p -movflags +faststart"
 *   ffmpeg -i VDOBITT2notext.mp4 $X bg-landscape.mp4
 *   ffmpeg -i VDOBITT2notext.mp4 -vf crop=608:1080 $X bg-portrait.mp4
 *   ffmpeg -i bg-landscape.mp4 -frames:v 1 -q:v 4 bg-landscape.jpg   (bg-portrait.jpg เหมือนกัน)
 */
export default function BackgroundVideo() {
  const [shape, setShape] = useState(null); // "landscape" | "portrait" | null (ยังไม่รู้ / ไม่เล่น)

  useEffect(() => {
    const portrait = window.matchMedia("(orientation: portrait)");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pick = () => setShape(still.matches ? null : portrait.matches ? "portrait" : "landscape");
    pick();
    portrait.addEventListener("change", pick);
    still.addEventListener("change", pick);
    return () => {
      portrait.removeEventListener("change", pick);
      still.removeEventListener("change", pick);
    };
  }, []);

  return (
    <div aria-hidden className="fixed inset-0 z-0 overflow-hidden bg-[#0b2540]">
      <div
        className="absolute inset-0 bg-cover bg-center landscape:hidden"
        style={{ backgroundImage: `url(${BASE}/bg-portrait.jpg)` }}
      />
      <div
        className="absolute inset-0 bg-cover bg-center portrait:hidden"
        style={{ backgroundImage: `url(${BASE}/bg-landscape.jpg)` }}
      />
      {shape && (
        <video
          key={shape}
          src={`${BASE}/bg-${shape}.mp4`}
          poster={`${BASE}/bg-${shape}.jpg`}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      {/* ท้องฟ้าในวิดีโอสว่างมาก โลโก้ขาวด้านบนจะจม → ไล่เงาเข้มจากขอบบนลงมานิดหนึ่ง */}
      <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-black/45 to-transparent" />
    </div>
  );
}
