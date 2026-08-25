"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminActivitiesPage() {
  const router = useRouter();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchActivities = async () => {
    const { data } = await supabase
      .from("activities")
      .select("*, activity_trips(count)")
      .order("start_date", { ascending: true });
    setActivities(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchActivities(); }, []);

  const handleDelete = async (id) => {
    setDeletingId(id);
    const { error } = await supabase.from("activities").delete().eq("id", id);
    if (error) showToast(error.message, "error");
    await fetchActivities();
    setDeletingId(null);
  };

  return (
    <div className="space-y-6 max-w-5xl">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-[100] flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium shadow-lg ${toast.type === "error" ? "bg-red-500/90 text-white" : "bg-[#CEA870] text-[#002740]"}`}>
          {toast.type === "error" ? "✕" : "✓"} {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-2xl font-semibold">Activities</h1>
          <p className="text-gray-400 text-sm mt-1">{activities.length} กิจกรรม</p>
        </div>
        <button
          onClick={() => router.push("/admin/activities/new")}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#CEA870] text-[#002740] text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          เพิ่มกิจกรรม
        </button>
      </div>

      {/* Cards */}
      {loading ? (
        <p className="text-gray-500 text-sm">กำลังโหลด...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {activities.map((item) => {
            const tripCount = item.activity_trips?.[0]?.count ?? 0;
            return (
              <div key={item.id} className="bg-[#052032] border border-white/5 rounded-2xl overflow-hidden group flex flex-col">
                <div className="relative h-40 overflow-hidden shrink-0">
                  {item.image_url ? (
                    <img src={item.image_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full bg-white/5 flex items-center justify-center">
                      <svg className="w-8 h-8 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-[#002740]/40" />
                  {tripCount > 0 && (
                    <span className="absolute left-2 top-2 rounded-full bg-black/60 px-2.5 py-0.5 text-[10px] font-medium text-[#CEA870] backdrop-blur-sm">
                      {tripCount} ทริป · {item.is_open ? "เปิดจอง" : "ยังไม่เปิด"}
                    </span>
                  )}
                </div>

                <div className="p-4 space-y-3 flex flex-col flex-1">
                  <div className="flex-1">
                    <p className="text-[#CEA870] text-xs uppercase tracking-widest mb-1">กิจกรรม</p>
                    <p className="text-white font-semibold text-sm">{item.en_title}</p>
                    <p className="text-gray-400 text-xs mt-1 line-clamp-2">{item.en_desc}</p>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {item.start_date}
                    {item.end_date !== item.start_date && ` — ${item.end_date}`}
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {(item.en_tags ?? []).map((tag) => (
                      <span key={tag} className="px-2.5 py-0.5 rounded-full text-[10px] border border-[#CEA870]/30 text-[#CEA870]">{tag}</span>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-white/5">
                    <button
                      onClick={() => router.push(`/admin/activities/${item.id}/edit`)}
                      className="flex-1 py-1.5 rounded-lg text-xs text-gray-300 bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      แก้ไข
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={deletingId === item.id}
                      className="flex-1 py-1.5 rounded-lg text-xs text-red-400 bg-red-400/5 hover:bg-red-400/10 transition-colors disabled:opacity-50"
                    >
                      {deletingId === item.id ? "กำลังลบ..." : "ลบ"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
