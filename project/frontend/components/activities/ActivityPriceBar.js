"use client";
import { useTranslations, useLocale } from "next-intl";
import { tripLength, formatTrip, formatPrice, discountPct } from "./activityHelpers";

/** "2 วัน 1 คืน" / "2 days, 1 night" — ทริปวันเดียวที่มี trip.hours โชว์เป็นจำนวนชั่วโมงแทน */
const useTripDuration = () => {
  const t = useTranslations();
  return (trip) => {
    if (trip.hours) {
      const key = trip.hours === 1 ? "hour" : "hours";
      return t(`activities.booking.${key}`, { hours: trip.hours });
    }
    const { days, nights } = tripLength(trip);
    const key = nights === 1 ? "duration" : "durationPlural";
    return t(`activities.booking.${key}`, { days, nights });
  };
};

/** แถบราคา + ปุ่มจอง — พอร์ตมาจากส่วนท้ายของ LocationModal ใน ForestBathingLocations.js */
export default function ActivityPriceBar({ selectedTrip, registerUrl }) {
  const t = useTranslations();
  const lang = useLocale();
  const duration = useTripDuration();

  return (
    <div className="flex shrink-0 flex-col gap-3 border-t border-black/10 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
      <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-3">
        {selectedTrip?.price && (
          <p className="flex items-baseline gap-2 text-[16px] font-semibold text-[#484848]">
            {discountPct(selectedTrip) > 0 && (
              <span className="text-[13px] font-normal text-[#828282] line-through">
                {formatPrice(selectedTrip.full_price)}
              </span>
            )}
            <span>{formatPrice(selectedTrip.price)}</span>
            {discountPct(selectedTrip) > 0 && (
              <span className="text-[13px] font-semibold text-[#0F8C82]">(-{discountPct(selectedTrip)}%)</span>
            )}
          </p>
        )}
        {selectedTrip && (
          <p className="text-[12px] text-[#484848]/70">
            {duration(selectedTrip)} · {formatTrip(selectedTrip, lang)}
          </p>
        )}
      </div>

      {selectedTrip ? (
        <a
          href={registerUrl || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg bg-[#FDF164] px-8 py-3 text-center text-[15px] font-medium text-[#484848] transition-colors hover:bg-[#f5e94f]"
        >
          {t("activities.booking.bookOn", { date: formatTrip(selectedTrip, lang) })}
        </a>
      ) : (
        <button
          type="button"
          disabled
          className="rounded-lg bg-[#FDF164] px-8 py-3 text-[15px] font-medium text-[#484848] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {t("activities.booking.pickFirst")}
        </button>
      )}
    </div>
  );
}
