"use client";
import { useTranslations } from "next-intl";
import Popup from "./Popup";

const RED = "#e5322d";
const RING = { "12K": "#3b6bff", "8K": "#35b6e6", "5K": "#22a447" };

/* pop-up กำหนดการกิจกรรม 20-21 พ.ย. — เนื้อหาทั้งหมดอยู่ใน messages/{th,en}/blackIvory.json → schedule.days
 * แต่ละกิจกรรมมีช่องไหนก็โชว์ช่องนั้น: time, place (+placeLabel), list (+listTitle), timeline, text
 * แก้เวลา / เพิ่มกิจกรรม แก้ที่ไฟล์ข้อความอย่างเดียว ไม่ต้องแตะไฟล์นี้ */
export default function ScheduleDialog({ children, className = "" }) {
  const t = useTranslations("blackIvory.schedule");
  const days = t.raw("days");
  return (
    <Popup
      className={className}
      theme="dark"
      width="max-w-[760px]"
      label={t("label")}
      content={
        <div className="px-4 pb-8 pt-6 sm:px-8 sm:pt-8">
          <h2 className="text-center text-2xl font-bold tracking-tight sm:text-3xl">{t("title")}</h2>
          <p className="mt-1 text-center text-sm text-white/70 sm:text-base">{t("subtitle")}</p>

          {days.map((day) => (
            <section key={day.date} className="mt-8">
              <h3
                className="inline-block rounded-full px-4 py-1 text-sm font-bold text-white sm:text-base"
                style={{ backgroundColor: RED }}
              >
                {day.date}
              </h3>
              <div className="mt-3 space-y-3">
                {day.events.map((e) => (
                  <Event key={e.name} event={e} t={t} />
                ))}
              </div>
            </section>
          ))}
        </div>
      }
    >
      {children}
    </Popup>
  );
}

function Event({ event: e, t }) {
  return (
    <article className="rounded-2xl bg-[#0b2540]/75 p-4 sm:p-5">
      <h4 className="text-lg font-extrabold tracking-tight sm:text-xl">{e.name}</h4>
      <p className="text-sm text-white/80 sm:text-base">{e.tagline}</p>

      {(e.time || e.place) && (
        <dl className="mt-3 space-y-1 text-sm sm:text-base">
          {e.time && <Meta label={t("time")} value={e.time} />}
          {e.place && <Meta label={e.placeLabel ?? t("place")} value={e.place} />}
        </dl>
      )}

      {e.list && (
        <div className="mt-3 text-sm sm:text-base">
          <div className="font-bold">{e.listTitle}</div>
          <ul className="mt-1 list-disc space-y-1 pl-5 marker:text-white/50">
            {e.list.map((i) => (
              <li key={i.lead}>
                <span className="font-semibold">{i.lead}:</span> {i.text}
              </li>
            ))}
          </ul>
        </div>
      )}

      {e.timeline && (
        <ol className="mt-3 space-y-2 border-l-2 border-white/25 pl-4 text-sm sm:text-base">
          {e.timeline.map((i) => (
            <li key={i.time} className="relative">
              <span className="absolute -left-[22px] top-[0.45em] h-2.5 w-2.5 rounded-full bg-white" />
              <span className="mr-2 font-extrabold tabular-nums">{i.time}</span>
              {i.km && (
                <span
                  className="mr-1.5 inline-block rounded-full border-2 px-2 text-xs font-bold"
                  style={{ borderColor: RING[i.km] }}
                >
                  {i.km}
                </span>
              )}
              {i.text}
              {i.sub && (
                <ul className="mt-1 list-disc pl-5 text-white/75 marker:text-white/40">
                  {i.sub.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ol>
      )}

      {e.text && <p className="mt-3 text-sm text-white/85 sm:text-base">{e.text}</p>}
    </article>
  );
}

const Meta = ({ label, value }) => (
  <div className="flex gap-2">
    <dt className="shrink-0 text-white/60">{label}:</dt>
    <dd className="font-semibold">{value}</dd>
  </div>
);
