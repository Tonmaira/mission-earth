"use client";
import Image from "next/image";
import { useTranslations } from "next-intl";
import Popup, { NAVY } from "./Popup";

/* pop-up QR ของโซเชียลแต่ละช่องทาง — กดไอคอนไหน ขึ้น QR ของช่องทางนั้น
 * เหมาะกับตอนเปิดหน้านี้ค้างบนจอที่งาน คนเดินผ่านสแกนจากมือถือตัวเองได้
 * มีปุ่มเปิดลิงก์ด้วย สำหรับคนที่ดูบนมือถืออยู่แล้วสแกนจอตัวเองไม่ได้
 *
 * QR ใน public/blackIvory/social/ สร้างจากลิงก์ชุดเดียวกับหน้า Contact:
 *   qrencode -t SVG -m 1 -l M -o qr-line.svg "https://lin.ee/MDN9uJ4" */
export default function SocialQrDialog({ name, href, qr, className = "" }) {
  const t = useTranslations("blackIvory.social");
  return (
    <Popup
      className={className}
      width="max-w-[380px]"
      label={t("label", { name })}
      content={
        <div className="px-6 pb-8 pt-6 text-center">
          <h2 className="text-2xl font-bold">{name}</h2>
          <p className="mt-1 text-sm opacity-80">{t("scan")}</p>
          <div className="mx-auto mt-5 w-56 rounded-2xl bg-white p-3 shadow-sm">
            <Image src={qr} alt={t("label", { name })} width={240} height={240} unoptimized className="w-full" />
          </div>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block rounded-full px-8 py-2.5 font-semibold text-white"
            style={{ backgroundColor: NAVY }}
          >
            {t("open", { name })}
          </a>
        </div>
      }
    >
      <span className="sr-only">{name}</span>
    </Popup>
  );
}
