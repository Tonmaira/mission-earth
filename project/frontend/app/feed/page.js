"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";

export default function FeedPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    fetch("/api/feed")
      .then((r) => r.json())
      .then((data) => { setItems(data); setLoading(false); });
  }, []);

  const cats = ["All", ...Array.from(new Set(items.map((i) => i.cat).filter(Boolean)))];
  const filtered = activeFilter === "All" ? items : items.filter((i) => i.cat === activeFilter);

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#001a2c" }}>
      <Navbar />

      {/* Hero */}
      <div className="pt-[85px] pb-12 px-6 md:px-20 text-center">
        <div className="pt-20">
          <p className="text-xs tracking-[0.3em] uppercase mb-3" style={{ color: "#CEA870" }}>Latest</p>
          <h1 className="text-4xl md:text-5xl font-semibold italic" style={{ color: "#CEA870" }}>Earth Feed</h1>
          <p className="text-gray-400 text-sm mt-4">บทความและข่าวสารจาก Mission Earth</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="max-w-6xl mx-auto px-6 md:px-10 mb-8">
        <div className="flex flex-wrap gap-2">
          {cats.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-5 py-1.5 rounded-full text-xs uppercase tracking-widest font-medium border transition-all duration-300 ${
                activeFilter === cat
                  ? "bg-[#CEA870] text-[#002740] border-[#CEA870]"
                  : "border-[#CEA870]/30 text-[#CEA870] hover:border-[#CEA870]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <section className="max-w-6xl mx-auto px-6 md:px-10 pb-32">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#CEA870]/30 border-t-[#CEA870] rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-500 py-20">ไม่มีบทความในหมวดนี้</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item) => (
              <a
                key={item.id}
                href={`/feed/${item.id}`}
                className="rounded-2xl overflow-hidden border border-white/5 group flex flex-col hover:border-[#CEA870]/30 transition-colors"
                style={{ backgroundColor: "#052032" }}
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden shrink-0">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
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
                  {item.cat && (
                    <div className="absolute top-3 left-3">
                      <span className="border border-white/60 rounded-full px-2.5 py-0.5 text-[10px] text-white uppercase tracking-widest">
                        {item.cat}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col gap-2 flex-1">
                  <p className="text-gray-500 text-xs">{item.date}</p>
                  <h2 className="text-[#CEA870] font-semibold italic text-lg leading-snug group-hover:text-white transition-colors">{item.title}</h2>
                  {item.sub && <p className="text-gray-400 text-sm">{item.sub}</p>}
                </div>
              </a>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
