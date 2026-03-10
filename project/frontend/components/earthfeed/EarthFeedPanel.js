"use client";
import { useState } from "react";
import Link from "next/link";
import OutlineBtn from "../ui/OutlineBtn";
import { useFeedItems } from "./useEarthFeed";

const MOCK_FEED = [
  { id: 1, cat: "ME Update", date: "Mar 7, 2026", title: "Forest Bathing in City", sub: "with 6 senses", imageUrl: "/image/earthfeed/forestbathingincity.jpg" },
  { id: 2, cat: "Event",     date: "Mar 7, 2026", title: "ROHxME Forest Bathing", sub: "14-15 Feb, 2026 at Doi Tung", imageUrl: "/image/earthfeed/forestbathingdoitung.jpg" },
  { id: 3, cat: "News",      date: "Mar 7, 2026", title: "ROHxME MOU", sub: "for Sustainable Tourism", imageUrl: "/image/earthfeed/rohxmemou.jpg" },
  { id: 4, cat: "Event",     date: "Mar 7, 2026", title: "BKK Design Week 2026", sub: "Alive sustainable Planet", imageUrl: "/image/earthfeed/DSC06796.jpg" },
  { id: 5, cat: "ME Update", date: "Mar 7, 2026", title: "BMAxAFDxME", sub: "Alive sustainable Planet", imageUrl: "/image/earthfeed/bma.jpg" },
];

export default function EarthFeedPanel() {
  const { data: rawFeed, loading, error } = useFeedItems();
  const feedItems = rawFeed.length > 0 ? rawFeed : MOCK_FEED;

  return (
    <div className="w-full md:w-[390px] h-full flex flex-col">

      {/* Header */}
      <div className="h-[85px] flex items-center justify-between pl-6 pr-6 md:pr-20 border-l-4 border-[#CEA870]">
        <div>
          <p className="font-poppins text-xs text-[#CEA870] tracking-widest m-0">LATEST</p>
          <p className="font-poppins font-semibold italic text-[32px] text-[#CEA870] tracking-wide m-0">
            EARTH FEED
          </p>
        </div>
        <OutlineBtn label="All" small />
      </div>

      {/* Feed Cards */}
      <div className="flex-1 flex flex-col">
        {loading && <LoadingState />}
        {!loading && feedItems.map((item, i) => (
          <FeedCard key={item.id ?? i} item={item} />
        ))}
      </div>

    </div>
  );
}

function FeedCard({ item }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex-1 overflow-hidden flex flex-col justify-between cursor-pointer"
      onClick={() => window.location.href = `/feed/${item.id}`}
    >
      {/* Gold bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-[4px] bg-[#CEA870] transition-opacity duration-200 z-[3] ${hovered ? "opacity-100" : "opacity-0"}`} />
      {/* Background */}
      {item.imageUrl ? (
        <img
          src={item.imageUrl} alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-50 z-[0]"
        />
      ) : (
        <div
          className="absolute inset-0 z-[1] opacity-50"
          style={{ background: item.bg ?? "#1a2a3a" }}
        />
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 z-[2] bg-gradient-to-t from-[#002740]/95 via-[#002740]/0 to-transparent" />

      {/* Content */}
      <div className="relative z-[3] flex flex-col justify-between h-full py-2.5 pl-9 pr-[35px]">
        {/* Category + Date */}
        <div className="flex items-center gap-3">
          <span className="border border-white rounded-full px-2.5 py-0.5 font-poppins text-[10px] text-white tracking-cat">
            {item.cat}
          </span>
          <span className="font-poppins text-xs text-white">{item.date}</span>
        </div>

        {/* Title + Sub */}
        <div>
          <p className="font-poppins font-semibold italic text-[16px] text-[#CEA870] m-0">
            {item.title}
          </p>
          <p className="font-poppins text-[12px] text-white m-0">{item.sub}</p>
        </div>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex-1 flex flex-col gap-0.5">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="flex-1 bg-[#052032] animate-pulse opacity-60"
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  );
}