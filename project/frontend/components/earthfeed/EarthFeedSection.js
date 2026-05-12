"use client";
import { useFeedItems } from "./useEarthFeed";
import Link from "next/link";
import OutlineBtn from "../ui/OutlineBtn";

export default function EarthFeedSection() {
  const { data: items, loading } = useFeedItems();

  const featured = items[0] ?? null;
  const sideItems = items.slice(1, 6);

  return (
    <div className="w-full h-full flex flex-col bg-[#001a2c] pt-[85px]">

      {/* Header */}
      <div className="h-[72px] shrink-0 flex items-center justify-between px-6 md:px-14 border-l-4 border-[#CEA870] ml-0">
        <div className="pl-4 md:pl-6">
          <p className="text-[#CEA870] text-[10px] tracking-[0.35em] uppercase m-0">Latest</p>
          <p className="font-semibold italic text-[26px] md:text-[30px] text-[#CEA870] m-0 leading-none">Earth Feed</p>
        </div>
        <OutlineBtn label="ALL" small href="/feed" />
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 flex flex-col md:flex-row gap-0 overflow-hidden">

        {/* Featured Article — left */}
        {loading ? (
          <div className="flex-[3] bg-[#052032] animate-pulse" />
        ) : featured ? (
          <Link
            href={`/feed/${featured.id}`}
            className="relative flex-[3] overflow-hidden group block"
          >
            {featured.imageUrl ? (
              <img
                src={featured.imageUrl}
                alt={featured.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            ) : (
              <div className="absolute inset-0 bg-[#052032]" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#001a2c]/95 via-[#001a2c]/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
              {featured.cat && (
                <span className="border border-white/60 rounded-full px-3 py-0.5 text-[11px] text-white/80 tracking-widest uppercase mb-3 inline-block">
                  {featured.cat}
                </span>
              )}
              <h2 className="text-white font-semibold italic text-2xl md:text-[32px] leading-snug group-hover:text-[#CEA870] transition-colors duration-300">
                {featured.title}
              </h2>
              {featured.sub && (
                <p className="text-white/50 text-sm mt-2 leading-relaxed">{featured.sub}</p>
              )}
            </div>
          </Link>
        ) : (
          <div className="flex-[3] flex items-center justify-center bg-[#052032]">
            <p className="text-white/30 italic text-sm">No articles yet.</p>
          </div>
        )}

        {/* Latest Stories — right */}
        <div className="flex-[2] flex flex-col bg-[#001a2c] border-l border-white/10 overflow-y-auto">
          <div className="px-6 md:px-8 pt-5 pb-3 border-b border-white/10 shrink-0">
            <p className="text-white font-bold text-[13px] tracking-[0.25em] uppercase">
              Latest Stories
            </p>
          </div>

          <div className="flex flex-col divide-y divide-white/10 overflow-y-auto">
            {loading
              ? [...Array(4)].map((_, i) => (
                  <div key={i} className="flex gap-3 px-6 md:px-8 py-4 items-center animate-pulse">
                    <div className="w-[80px] h-[58px] shrink-0 bg-white/10" />
                    <div className="flex-1 space-y-2">
                      <div className="h-2.5 bg-white/10 rounded w-1/3" />
                      <div className="h-3 bg-white/10 rounded w-4/5" />
                      <div className="h-3 bg-white/10 rounded w-3/5" />
                    </div>
                  </div>
                ))
              : sideItems.map((item) => (
                  <Link
                    key={item.id}
                    href={`/feed/${item.id}`}
                    className="flex gap-4 px-6 md:px-8 py-4 items-center group hover:bg-white/[0.03] transition-colors"
                  >
                    <div className="relative w-[80px] h-[58px] shrink-0 overflow-hidden">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-white/10" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      {item.cat && (
                        <p className="text-[#CEA870] text-[10px] font-semibold tracking-[0.2em] uppercase mb-1">
                          {item.cat}
                        </p>
                      )}
                      <p className="text-white text-[13px] font-medium leading-snug line-clamp-2 group-hover:text-[#CEA870] transition-colors duration-200">
                        {item.title}
                      </p>
                      {item.sub && (
                        <p className="text-white/40 text-[11px] mt-0.5 line-clamp-1">{item.sub}</p>
                      )}
                    </div>
                  </Link>
                ))}

            {!loading && sideItems.length === 0 && (
              <p className="text-white/30 italic text-sm px-8 py-6">No more articles.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
