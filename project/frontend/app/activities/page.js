"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function formatDateTH(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" });
}

export default function ActivitiesPage() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("activities")
      .select("*")
      .order("start_date", { ascending: true })
      .then(({ data }) => {
        setActivities(data ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#001a2c" }}>
      <Navbar />

      {/* Hero */}
      <div className="pt-[85px] pb-16 px-6 md:px-20 text-center">
        <div className="pt-20">
          <p className="text-xs tracking-[0.3em] uppercase mb-3" style={{ color: "#CEA870" }}>Explore</p>
          <h1 className="text-4xl md:text-5xl font-semibold italic" style={{ color: "#CEA870" }}>Activities</h1>
          <p className="text-gray-400 text-sm mt-4">กิจกรรมทั้งหมดของ Mission Earth</p>
        </div>
      </div>

      {/* Grid */}
      <section className="max-w-6xl mx-auto px-6 md:px-10 pb-32">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#CEA870]/30 border-t-[#CEA870] rounded-full animate-spin" />
          </div>
        ) : activities.length === 0 ? (
          <p className="text-center text-gray-500 py-20">ยังไม่มีกิจกรรม</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl overflow-hidden border border-white/5 group flex flex-col"
                style={{ backgroundColor: "#052032" }}
              >
                {/* Image */}
                <div className="relative h-52 overflow-hidden shrink-0">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.en_title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-white/5 flex items-center justify-center">
                      <svg className="w-10 h-10 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#052032]/80 to-transparent" />
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col gap-3 flex-1">
                  <div className="flex-1">
                    <p className="text-[#CEA870] text-xs uppercase tracking-widest mb-1.5">กิจกรรม</p>
                    <h2 className="text-white font-semibold text-lg leading-snug">{item.en_title}</h2>
                    {item.en_desc && (
                      <p className="text-gray-400 text-sm mt-2 leading-relaxed line-clamp-3">{item.en_desc}</p>
                    )}
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {formatDateTH(item.start_date)}
                    {item.end_date && item.end_date !== item.start_date && (
                      <> — {formatDateTH(item.end_date)}</>
                    )}
                  </div>

                  {/* Tags */}
                  {item.en_tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {item.en_tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-0.5 rounded-full text-[10px] border border-[#CEA870]/30 text-[#CEA870] uppercase tracking-wide"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
