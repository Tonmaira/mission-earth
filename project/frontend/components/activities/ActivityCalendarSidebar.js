"use client";
import { useTranslations } from "next-intl";
import ForestBathingCalendar from "@/components/ForestBathingCalendar";
import { tripDates } from "./activityHelpers";

/** Sidebar ปฏิทิน — พอร์ตมาจาก ActivityCalendarPanel ใน ForestBathingLocations.js
 *  โชว์ทริปของทุกกิจกรรมที่เปิดจอง (allOpenDates) ให้กดข้ามไปกิจกรรมอื่นได้เลย */
export default function ActivityCalendarSidebar({ selectedTrip, allOpenDates, onSelectDate }) {
  const t = useTranslations();
  const selectedDates = selectedTrip ? tripDates(selectedTrip) : [];

  return (
    <div className="w-full min-h-0 shrink-0 bg-gradient-to-b from-[#26A9E0] to-[#0F8C82] p-4 sm:w-[277px] sm:self-stretch sm:overflow-y-auto sm:p-6">
      <div className="sm:pr-[72px]">
        <p className="text-[16px] leading-snug text-white">{t("activities.booking.activityDateTitle")}</p>
        <p className="mt-1 text-[11px] italic text-[#006894]">{t("activities.booking.activityDateSubtitle")}</p>
      </div>
      <div className="mt-6 flex justify-center">
        <ForestBathingCalendar
          eventDates={allOpenDates}
          monthCount={4}
          columns={1}
          selectedDates={selectedDates}
          onSelectDate={onSelectDate}
        />
      </div>
    </div>
  );
}
