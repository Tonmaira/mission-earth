"use client";
import { useState } from "react";
import activityData from "@/lib/activityData";

export default function AdminActivitiesPage() {
  const [activities, setActivities] = useState(activityData);

  return (
    <div className="space-y-6 max-w-4xl">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-2xl font-semibold">Activities</h1>
          <p className="text-gray-400 text-sm mt-1">{activities.length} กิจกรรม</p>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {activities.map((item, i) => (
          <div key={item.id} className="bg-[#052032] border border-white/5 rounded-2xl overflow-hidden group">
            {/* Image */}
            <div className="relative h-40 overflow-hidden">
              <img src={item.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-[#002740]/40" />
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
              <div>
                <p className="text-[#CEA870] text-xs uppercase tracking-widest mb-1">กิจกรรม</p>
                <p className="text-white font-semibold">{item.en.title}</p>
                <p className="text-gray-400 text-xs mt-1">{item.en.desc}</p>
              </div>

              {/* Dates */}
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {item.startDate.toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" })}
                {item.endDate > item.startDate && ` — ${item.endDate.toLocaleDateString("th-TH", { day: "numeric", month: "short" })}`}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {(item.en.tags ?? []).map((tag) => {
                  const label = typeof tag === "string" ? tag : tag.label;
                  return (
                    <span key={label} className="px-2.5 py-0.5 rounded-full text-[10px] border border-[#CEA870]/30 text-[#CEA870]">
                      {label}
                    </span>
                  );
                })}
              </div>

              {/* Edit note */}
              <p className="text-gray-600 text-xs pt-1 border-t border-white/5">
                แก้ไขได้ที่ <code className="text-gray-500">lib/activityData.js</code>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Note */}
      <div className="bg-[#052032] border border-[#CEA870]/10 rounded-2xl p-5">
        <p className="text-[#CEA870] text-xs uppercase tracking-widest mb-2">หมายเหตุ</p>
        <p className="text-gray-400 text-sm leading-relaxed">
          ข้อมูล Activities ปัจจุบันอยู่ที่ <code className="text-gray-300 bg-white/5 px-1.5 py-0.5 rounded">lib/activityData.js</code> — พอเชื่อม Database แล้วจะสามารถเพิ่ม/แก้ไขได้จากหน้านี้เลย
        </p>
      </div>

    </div>
  );
}
