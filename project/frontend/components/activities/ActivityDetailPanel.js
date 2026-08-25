"use client";
import { useState } from "react";
import ActivityContent, { useActivityText } from "./ActivityContent";
import ActivityCalendarSidebar from "./ActivityCalendarSidebar";
import ActivityPriceBar from "./ActivityPriceBar";
import ActivityNotifyForm from "./ActivityNotifyForm";
import GalleryLightbox from "./GalleryLightbox";
import { nextTrip, tripDates } from "./activityHelpers";

/** เหมือน ActivityModal ทุกอย่าง แต่ไม่มีกรอบ dialog/backdrop/ปุ่มปิด — สำหรับหน้า /activities/[id]
 *  ที่เปิดตรงจากลิงก์ (ไม่ได้มาจากการคลิกการ์ดในกริด) ปฏิทินโชว์แค่ทริปของกิจกรรมนี้ที่เดียว
 *  (ไม่ข้ามไปกิจกรรมอื่นเหมือนตอนเปิดจากกริด เพราะหน้านี้มีข้อมูลกิจกรรมเดียว) */
export default function ActivityDetailPanel({ activity }) {
  const [selectedTrip, setSelectedTrip] = useState(() => nextTrip(activity));
  const { name, region, blurb } = useActivityText(activity);
  const [galleryIndex, setGalleryIndex] = useState(null);
  const galleryOpen = galleryIndex !== null;

  const handleSelectDate = (iso) => {
    const trip = (activity.activity_trips ?? []).find((t) => tripDates(t).includes(iso));
    if (trip) setSelectedTrip(trip);
  };

  return (
    <div className="relative mx-auto flex h-[calc(100vh-140px)] max-h-[900px] w-full max-w-[1160px] flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
      {activity.is_open ? (
        <>
          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto sm:flex-row sm:overflow-hidden">
            <ActivityContent
              activity={activity}
              selectedTrip={selectedTrip}
              onOpenGallery={(i = 0) => setGalleryIndex(i)}
            />
            <ActivityCalendarSidebar
              selectedTrip={selectedTrip}
              allOpenDates={(activity.activity_trips ?? []).flatMap(tripDates)}
              onSelectDate={handleSelectDate}
            />
          </div>

          <ActivityPriceBar selectedTrip={selectedTrip} registerUrl={activity.register_url} />
        </>
      ) : (
        <div className="min-h-0 flex-1 overflow-y-auto p-6 sm:p-10">
          <h3 className="text-[24px] font-semibold leading-tight text-[#484848]">{name}</h3>
          {region && <p className="mt-1 text-[16px] text-[#828282]">{region}</p>}
          <p className="mb-8 mt-3 text-[14px] font-light text-[#484848]/70">{blurb}</p>

          <ActivityNotifyForm activityId={activity.id} name={name} />
        </div>
      )}

      {galleryOpen && (
        <GalleryLightbox
          images={activity.gallery_urls ?? []}
          startIndex={galleryIndex}
          onClose={() => setGalleryIndex(null)}
        />
      )}
    </div>
  );
}
