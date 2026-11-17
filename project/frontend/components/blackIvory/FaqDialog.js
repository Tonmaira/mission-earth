"use client";
import { useTranslations } from "next-intl";
import Popup from "./Popup";

const RED = "#e5322d";
const LINE_URL = "https://lin.ee/MDN9uJ4";
const LINE_GREEN = "#06c755";

/* pop-up ถาม–ตอบก่อนวันวิ่ง — คำถามทั้งหมดอยู่ใน messages/{th,en}/blackIvory.json → faq.sections
 * แต่ละข้อเป็น <details> กดเปิด/ปิดได้ ข้อแรกของแต่ละหมวดเปิดไว้ให้เห็นว่ากดได้
 * คำตอบขึ้นบรรทัดใหม่ตาม \n ในไฟล์ข้อความ */
export default function FaqDialog({ children, className = "" }) {
  const t = useTranslations("blackIvory.faq");
  const sections = t.raw("sections");
  return (
    <Popup
      className={className}
      theme="dark"
      width="max-w-[720px]"
      label={t("label")}
      content={
        <div className="px-4 pb-8 pt-6 sm:px-8 sm:pt-8">
          <h2 className="text-center text-3xl font-extrabold tracking-tight sm:text-4xl">{t("title")}</h2>
          <p className="mt-1 text-center text-sm text-white/70 sm:text-base">{t("subtitle")}</p>

          {sections.map((s) => (
            <section key={s.title} className="mt-8">
              <h3
                className="inline-block rounded-full px-4 py-1 text-sm font-bold text-white sm:text-base"
                style={{ backgroundColor: RED }}
              >
                {s.title}
              </h3>
              <div className="mt-3 space-y-2">
                {s.items.map((i, n) => (
                  <details key={i.q} open={n === 0} className="group rounded-2xl bg-[#0b2540]/75">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 font-bold sm:px-5 sm:text-lg [&::-webkit-details-marker]:hidden">
                      <span>
                        <span className="mr-2 text-[#ff6b66]">Q</span>
                        {i.q}
                      </span>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="h-5 w-5 shrink-0 transition-transform group-open:rotate-180" aria-hidden="true">
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </summary>
                    <p className="whitespace-pre-line px-4 pb-4 text-sm text-white/85 sm:px-5 sm:text-base">
                      <span className="mr-2 font-bold text-white">A</span>
                      {i.a}
                    </p>
                  </details>
                ))}
              </div>
            </section>
          ))}

          <div className="mt-10 text-center">
            <div className="text-xl font-bold">{t("more")}</div>
            <p className="mt-1 text-sm text-white/75 sm:text-base">{t("moreText")}</p>
            <a
              href={LINE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block rounded-full px-6 py-2 font-bold text-white hover:brightness-110"
              style={{ backgroundColor: LINE_GREEN }}
            >
              {t("line")}
            </a>
            <div className="mt-8 text-2xl font-extrabold tracking-tight">{t("bye")}</div>
          </div>
        </div>
      }
    >
      {children}
    </Popup>
  );
}
