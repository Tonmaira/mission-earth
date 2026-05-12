"use client";
import { useState, useEffect } from "react";
import OutlineBtn from "../ui/OutlineBtn";
import CalendarWidget from "./CalendarWidget";
import { useCalendarEvents } from "./useEarthFeed";
import { useLang } from "@/lib/LanguageContext";

export default function ActivitiesPanel() {
  const { t, lang } = useLang();
  const now = new Date();

  const [activities, setActivities] = useState([]);
  useEffect(() => {
    fetch("/api/activities")
      .then((r) => r.json())
      .then((data) => {
        setActivities(data.map((a) => ({
          ...a,
          startDate: a.startDate ? new Date(a.startDate) : null,
          endDate: a.endDate ? new Date(a.endDate) : null,
        })));
      });
  }, []);

  const translatedActivities = activities.map((item) => ({
    ...item,
    ...item[lang] ?? item.en,
  }));
  const [calYear,  setCalYear]  = useState(now.getFullYear());
  const [calMonth, setCalMonth] = useState(now.getMonth());
  const [displayIndex, setDisplayIndex] = useState(1);
  const [animated, setAnimated] = useState(true);
  const [activeItem, setActiveItem] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [cardSlot, setCardSlot] = useState(525);

  useEffect(() => {
    const update = () => {
      const isMobile = window.innerWidth < 768;
      const cardW = isMobile ? window.innerWidth * 0.85 : 515;
      setCardSlot(cardW + 10);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const upcomingItems = translatedActivities;

  const handleActivityClick = (item, i) => {
    setActiveItem(i);
    setSelectedActivity(item);
    setDisplayIndex(i + 1);
    if (item.startDate) {
      setCalYear(item.startDate.getFullYear());
      setCalMonth(item.startDate.getMonth());
    }
  };

  const handleDayClick = (day) => {
    const clicked = new Date(calYear, calMonth, day);
    const idx = translatedActivities.findIndex(({ startDate, endDate }) =>
      startDate && endDate && clicked >= startDate && clicked <= endDate
    );
    if (idx !== -1) handleActivityClick(translatedActivities[idx], idx);
  };

  const resetActivity = () => {
    setActiveItem(null);
    setSelectedActivity(null);
    setCalYear(now.getFullYear());
    setCalMonth(now.getMonth());
  };

  const activityCards = translatedActivities;

  const n = activityCards.length;
  const extendedCards = n > 0 ? [activityCards[n - 1], ...activityCards, activityCards[0]] : [];

  const handleTransitionEnd = () => {
    if (displayIndex === 0) {
      setAnimated(false);
      setDisplayIndex(n);
    } else if (displayIndex === n + 1) {
      setAnimated(false);
      setDisplayIndex(1);
    }
  };

  useEffect(() => {
    if (!animated) {
      const raf = requestAnimationFrame(() => requestAnimationFrame(() => setAnimated(true)));
      return () => cancelAnimationFrame(raf);
    }
  }, [animated]);
  const { eventDays } = useCalendarEvents(calYear, calMonth);

  const isAtMin = calYear === now.getFullYear() && calMonth === now.getMonth();
  const maxDate = new Date(now.getFullYear(), now.getMonth() + 12);
  const isAtMax = calYear === maxDate.getFullYear() && calMonth === maxDate.getMonth();

  const prevMonth = () => {
    if (isAtMin) return;
    if (calMonth === 0) { setCalYear(y => y - 1); setCalMonth(11); }
    else setCalMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (isAtMax) return;
    if (calMonth === 11) { setCalYear(y => y + 1); setCalMonth(0); }
    else setCalMonth(m => m + 1);
  };

  return (
    <div className="flex-1 bg-[#052032] flex flex-col overflow-hidden">

      {/* Header */}
      <div className="h-[85px] flex items-center justify-between px-4 md:px-20">
        <div>
          <p className="font-poppins text-xs text-me-gold tracking-label m-0">{t("earthfeed.explore")}</p>
          <p className="font-poppins font-semibold italic text-[32px] text-me-gold m-0">{t("earthfeed.activities")}</p>
        </div>
        <OutlineBtn label={t("earthfeed.allActivities")} href="/activities" />
      </div>

      {/* Upcoming + Calendar */}
      <div
        className="relative flex items-center justify-between flex-[2] min-h-0 px-4 md:px-20 overflow-hidden cursor-default"
        onClick={resetActivity}
      >

        {/* Background images — cross-fade on click */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-500"
          style={{
            backgroundImage: "url('/image/services/19-scaventure.jpg')",
            opacity: activeItem === null ? 1 : 0,
          }}
        />
        {upcomingItems.map((item, i) => (
          <div
            key={i}
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-500"
            style={{
              backgroundImage: `url('${item.image}')`,
              opacity: activeItem === i ? 1 : 0,
            }}
          />
        ))}
        {/* Overlay */}
        <div className="absolute inset-0 bg-[#002740]/70" />

        {/* Content */}
        <div className="relative z-10 flex flex-col gap-6" onClick={e => e.stopPropagation()}>
          <p className="font-poppins font-semibold italic text-[36px] text-[#CEA870] m-0">
            {t("earthfeed.upcoming")}
          </p>
          <div className="flex flex-col gap-1">
            {upcomingItems.length === 0 ? (
              <p className="font-poppins text-sm text-white/40 italic">No upcoming activities at this time.</p>
            ) : (
              upcomingItems.map((item, i) => (
                <button
                  key={item.label}
                  onClick={() => handleActivityClick(item, i)}
                  className="flex items-center gap-3 text-left cursor-pointer bg-transparent border-none py-1"
                >
                  <span className={`block h-[1.5px] transition-all duration-300 bg-[#CEA870] ${activeItem === i ? "w-5" : "w-2 opacity-40"}`} />
                  <span className={`font-poppins text-sm tracking-widest uppercase transition-all duration-300 ${activeItem === i ? "text-[#CEA870]" : "text-white/60"}`}>
                    {item.label}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="hidden md:block relative z-10" onClick={e => e.stopPropagation()}>
          <CalendarWidget
            year={calYear} month={calMonth}
            today={calYear === now.getFullYear() && calMonth === now.getMonth() ? now.getDate() : null}
            eventDays={eventDays}
            onPrev={prevMonth} onNext={nextMonth}
            disablePrev={isAtMin} disableNext={isAtMax}
            activityRange={selectedActivity ? { start: selectedActivity.startDate, end: selectedActivity.endDate } : null}
            onDayClick={handleDayClick}
          />
        </div>
      </div>

      {/* Activity Card Slider */}
      <div className="flex-[3] min-h-0 relative overflow-hidden mt-2.5">
        {extendedCards.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="font-poppins text-sm text-white/30 italic">No activities to display.</p>
          </div>
        ) : (
          <>
            <div
              className={`absolute flex gap-2.5 top-0 bottom-0 ${animated ? "transition-all duration-500 ease-in-out" : ""}`}
              style={{ left: `calc(50% - ${displayIndex * cardSlot + Math.floor(cardSlot / 2)}px)` }}
              onTransitionEnd={handleTransitionEnd}
            >
              {extendedCards.map((card, i) => (
                <ActivityCard
                  key={i}
                  card={card}
                  isActive={i === displayIndex}
                  onClick={() => setDisplayIndex(i)}
                />
              ))}
            </div>
            <SlideArrow side="left"  onClick={() => setDisplayIndex(i => i - 1)} />
            <SlideArrow side="right" onClick={() => setDisplayIndex(i => i + 1)} />
          </>
        )}
      </div>
    </div>
  );
}

function ActivityCard({ card, isActive, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`
        relative w-[85vw] md:w-[515px] h-full overflow-hidden bg-[#1a3040] shrink-0 cursor-pointer
        transition-all duration-500
        ${isActive ? "brightness-100" : "brightness-[0.35]"}
      `}
    >
      {/* Background image */}
      {card.image && (
        <img
          src={card.image} alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#002740]/90 via-[#002740]/30 to-transparent" />

      {isActive && (
        <div className="absolute bottom-0 left-0 right-0 p-4 pl-5 md:pl-9 flex flex-col gap-2 md:gap-4">
          <div>
            <p className="font-poppins font-semibold italic text-2xl text-[#CEA870] m-0">
              {card.title}
            </p>
            <p className="font-poppins text-base text-white m-0">{card.desc}</p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {(card.tags ?? []).map(tag => {
                const label = typeof tag === "string" ? tag : tag.label;
                const href  = typeof tag === "object" ? tag.href : null;
                return href
                  ? <a key={label} href={href} onClick={e => e.stopPropagation()}><OutlineBtn label={label} small /></a>
                  : <OutlineBtn key={label} label={label} small />;
              })}
          </div>
        </div>
      )}
    </div>
  );
}

function SlideArrow({ side, onClick }) {
  const isLeft = side === "left";
  return (
    <button
      onClick={onClick}
      className={`
        absolute top-1/2 -translate-y-1/2 z-10
        bg-me-navy/50 border-none cursor-pointer px-1.5 py-2 rounded
        ${isLeft ? "left-3.5" : "right-3.5"}
      `}
    >
      <svg width="20" height="34" viewBox="0 0 20 34" fill="none">
        {isLeft
          ? <path d="M17 2L3 17L17 32" stroke="#cea870" strokeWidth="2.5" strokeLinecap="round"/>
          : <path d="M3 2L17 17L3 32"  stroke="#cea870" strokeWidth="2.5" strokeLinecap="round"/>
        }
      </svg>
    </button>
  );
}