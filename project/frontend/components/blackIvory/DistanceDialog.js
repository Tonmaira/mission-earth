"use client";
import { useTranslations } from "next-intl";
import Popup from "./Popup";

const DISTANCES = [
  {
    km: "5K",
    name: ["FUN TRAIL"],
  },
  {
    km: "8K",
    name: ["FOREST", "TRAIL"],
  },
  {
    km: "12K",
    name: ["PEAK", "CHALLENGE"],
  },
];

/* pop-up รายละเอียดแต่ละระยะ — ตามโปสเตอร์ระยะทาง (ตัดสปอนเซอร์ออก)
 * จอกว้างเรียงสามคอลัมน์มีเส้นคั่น มือถือซ้อนลงมาทีละระยะ
 * คำอธิบายแบ่งบรรทัดตามโปสเตอร์ไว้ ไม่ให้เบราว์เซอร์ตัดคำไทยกลางวลีเอง */
export default function DistanceDialog({ children, className = "" }) {
  const t = useTranslations("blackIvory");
  return (
    <Popup
      className={className}
      theme="dark"
      width="max-w-[820px]"
      label={t("distances.label")}
      content={
        <div className="px-5 pb-10 pt-6 text-center sm:px-10 sm:pt-8">
          <div className="text-3xl font-bold tracking-tight sm:text-4xl">{t("distances.date")}</div>
          <div className="mt-1 text-xl font-semibold sm:text-2xl">{t("place")}</div>

          <div className="mt-8 grid gap-8 sm:mt-10 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-white/40">
            {DISTANCES.map((d) => (
              <section key={d.km} className="sm:px-4">
                <div className="text-6xl font-extrabold leading-none tracking-tight sm:text-7xl">{d.km}</div>
                <h3 className="mt-3 text-xl font-bold leading-tight sm:text-2xl">
                  {d.name.map((n) => (
                    <div key={n}>{n}</div>
                  ))}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-white/90 sm:mt-6 sm:text-base">
                  {t.raw(`distances.about.${d.km}`).map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </p>
              </section>
            ))}
          </div>
        </div>
      }
    >
      {children}
    </Popup>
  );
}
