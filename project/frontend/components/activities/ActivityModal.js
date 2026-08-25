"use client";
import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useLanguageToggle } from "@/lib/useLanguageToggle";
import IconClose from "@/components/icons/IconClose";
import TranslateIcon from "@/components/icons/TranslateIcon";
import ActivityContent, { useActivityText } from "./ActivityContent";
import ActivityCalendarSidebar from "./ActivityCalendarSidebar";
import ActivityPriceBar from "./ActivityPriceBar";
import ActivityNotifyForm from "./ActivityNotifyForm";
import GalleryLightbox from "./GalleryLightbox";
import { nextTrip, tripAndActivityForDate, openActivityDates } from "./activityHelpers";

/** ป็อปอัพรายละเอียดกิจกรรม — พอร์ตมาจาก LocationModal ใน ForestBathingLocations.js
 *  แต่รับข้อมูลกิจกรรมทั้งหมด (allActivities) เพื่อให้ปฏิทินฝั่งขวาข้ามไปกิจกรรมอื่นได้เหมือนต้นฉบับ */
export default function ActivityModal({ activity, allActivities, onClose, onActivityChange }) {
  const t = useTranslations();
  const lang = useLocale();
  const toggleLang = useLanguageToggle();
  const [viewActivity, setViewActivity] = useState(activity);
  const [selectedTrip, setSelectedTrip] = useState(() => nextTrip(activity));
  const { name, region, blurb } = useActivityText(viewActivity);
  const [galleryIndex, setGalleryIndex] = useState(null);
  const galleryOpen = galleryIndex !== null;

  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      if (galleryOpen) setGalleryIndex(null);
      else onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, galleryOpen]);

  const handleSelectDate = (iso) => {
    const found = tripAndActivityForDate(allActivities, iso);
    if (!found) return;
    setSelectedTrip(found.trip);
    if (found.activity.id !== viewActivity.id) {
      setViewActivity(found.activity);
      onActivityChange?.(found.activity.id);
    }
  };

  if (activity.id !== viewActivity.id) {
    setViewActivity(activity);
    setSelectedTrip(nextTrip(activity));
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={name}
      className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm sm:p-8"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-[90vh] w-full max-w-[1160px] flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
      >
        <div className="absolute right-4 top-4 z-20 flex items-center gap-2">
          <button
            onClick={toggleLang}
            aria-label="Switch language"
            className="flex items-center gap-1 rounded-full bg-black/45 px-2 py-1.5 text-white backdrop-blur-sm transition-colors hover:bg-black/65"
          >
            <TranslateIcon className="h-3.5 w-3.5" />
            <span className="text-[10px] font-medium leading-none">{lang === "en" ? "TH" : "EN"}</span>
          </button>

          <button
            onClick={onClose}
            aria-label={t("activities.close")}
            className="rounded-full bg-black/45 p-1.5 text-white backdrop-blur-sm transition-colors hover:bg-black/65"
          >
            <IconClose size={28} className="h-3 w-3" />
          </button>
        </div>

        {viewActivity.is_open ? (
          <>
            <div className="flex min-h-0 flex-1 flex-col overflow-y-auto sm:flex-row sm:overflow-hidden">
              <ActivityContent
                activity={viewActivity}
                selectedTrip={selectedTrip}
                onOpenGallery={(i = 0) => setGalleryIndex(i)}
              />
              <ActivityCalendarSidebar
                selectedTrip={selectedTrip}
                allOpenDates={openActivityDates(allActivities)}
                onSelectDate={handleSelectDate}
              />
            </div>

            <ActivityPriceBar selectedTrip={selectedTrip} registerUrl={viewActivity.register_url} />
          </>
        ) : (
          <div className="min-h-0 flex-1 overflow-y-auto p-6 sm:p-10">
            <h3 className="text-[24px] font-semibold leading-tight text-[#484848]">{name}</h3>
            {region && <p className="mt-1 text-[16px] text-[#828282]">{region}</p>}
            <p className="mb-8 mt-3 text-[14px] font-light text-[#484848]/70">{blurb}</p>

            <ActivityNotifyForm activityId={viewActivity.id} name={name} />
          </div>
        )}
      </div>

      {galleryOpen && (
        <GalleryLightbox
          images={viewActivity.gallery_urls ?? []}
          startIndex={galleryIndex}
          onClose={() => setGalleryIndex(null)}
        />
      )}
    </div>
  );
}
