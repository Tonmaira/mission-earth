"use client";
import { useTranslations } from "next-intl";
import Popup from "./Popup";

// ราคาลดคิดไว้แล้ว (ราคาเต็ม × 0.7) — เปลี่ยนราคาให้แก้ทั้งสองช่องพร้อมกัน
const PRICES = [
  { km: "12K", name: "Peak Challenge", ring: "#3b6bff", full: "2,890", now: "2,023" },
  { km: "8K", name: "Forest Trail", ring: "#35b6e6", full: "2,490", now: "1,743" },
  { km: "5K", name: "Fun Trail", ring: "#22a447", full: "1,990", now: "1,393" },
];

/* pop-up ราคาค่าสมัคร — สามระยะ ราคาเต็มขีดฆ่าคู่กับราคาลด
 * จอกว้างเรียงสามการ์ด มือถือซ้อนลงมา */
export default function PriceDialog({ children, className = "", registerUrl }) {
  const t = useTranslations("blackIvory");
  return (
    <Popup
      className={className}
      theme="dark"
      width="max-w-[820px]"
      label={t("price.label")}
      content={
        <div className="px-5 pb-8 pt-6 text-center sm:px-10 sm:pt-8">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t("price.title")}</h2>
          <div className="mt-3 inline-block rounded-full bg-[#ffd23f] px-5 py-1 text-lg font-extrabold text-[#0b2540] sm:text-xl">
            {t("discount")}
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {PRICES.map((p) => (
              <section
                key={p.km}
                className="rounded-2xl border-[3px] bg-[#0b2540]/70 px-4 py-6"
                style={{ borderColor: p.ring }}
              >
                <div className="text-5xl font-extrabold leading-none tracking-tight sm:text-6xl">{p.km}</div>
                <h3 className="mt-2 text-base font-semibold">{p.name}</h3>
                <div className="mt-5 text-base text-white/60 line-through">{p.full} {t("price.baht")}</div>
                <div className="text-4xl font-extrabold tabular-nums">
                  {p.now}
                  <span className="ml-1 text-lg font-semibold">{t("price.baht")}</span>
                </div>
              </section>
            ))}
          </div>

          <a
            href={registerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-block rounded-full bg-white px-10 py-3 text-lg font-bold text-[#0b2540] hover:bg-white/90"
          >
            {t("register")}
          </a>
        </div>
      }
    >
      {children}
    </Popup>
  );
}
