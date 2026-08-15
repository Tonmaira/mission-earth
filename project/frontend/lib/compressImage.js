"use client";

/**
 * ย่อ + บีบรูปก่อนอัปโหลดขึ้น Supabase Storage
 *
 * ทำไมต้องมี: เดิมอัปโหลดไฟล์ดิบจากกล้อง/สกรีนช็อต ทำให้มีรูป 8–10 MB อยู่ใน
 * storage ซึ่ง (1) กิน egress มหาศาล และ (2) ใหญ่เกินกว่าที่ next/image
 * จะดึงมาแปลงทันใน timeout 7 วินาที → คืน HTTP 500 รูปไม่ขึ้นเลย
 *
 * 1600px กว้างพอสำหรับทุกจุดที่ใช้จริงบนเว็บ (การ์ด/hero กว้างสุด ~1440px)
 */
export async function compressImage(input, { maxWidth = 1600, quality = 0.85 } = {}) {
  const bitmap = await createImageBitmap(input);

  const scale = Math.min(1, maxWidth / bitmap.width);
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close?.();

  const blob = await new Promise((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", quality)
  );
  if (!blob) throw new Error("บีบอัดรูปไม่สำเร็จ");
  return blob;
}
