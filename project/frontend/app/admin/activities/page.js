"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const EMPTY_FORM = {
  image_url: "",
  start_date: "",
  end_date: "",
  en_title: "",
  en_label: "",
  en_desc: "",
  en_tags: "",
  th_title: "",
  th_label: "",
  th_desc: "",
  th_tags: "",
  page_url: "",
};

function toTagArray(str) {
  return str.split(",").map((s) => s.trim()).filter(Boolean);
}

function toTagString(arr) {
  if (!arr) return "";
  return arr.join(", ");
}

export default function AdminActivitiesPage() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("activities").upload(fileName, file, { upsert: true });
    if (!error) {
      const { data } = supabase.storage.from("activities").getPublicUrl(fileName);
      setForm((f) => ({ ...f, image_url: data.publicUrl }));
      showToast("อัพโหลดรูปสำเร็จ ✓");
    } else {
      showToast("อัพโหลดไม่สำเร็จ ลองใหม่อีกครั้ง", "error");
    }
    setUploading(false);
  };

  const fetchActivities = async () => {
    const { data } = await supabase
      .from("activities")
      .select("*")
      .order("start_date", { ascending: true });
    setActivities(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchActivities(); }, []);

  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEdit = (item) => {
    setEditingId(item.id);
    setForm({
      image_url: item.image_url ?? "",
      start_date: item.start_date ?? "",
      end_date: item.end_date ?? "",
      en_title: item.en_title ?? "",
      en_label: item.en_label ?? "",
      en_desc: item.en_desc ?? "",
      en_tags: toTagString(item.en_tags),
      th_title: item.th_title ?? "",
      th_label: item.th_label ?? "",
      th_desc: item.th_desc ?? "",
      th_tags: toTagString(item.th_tags),
      page_url: item.page_url ?? "",
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.en_title || !form.start_date || !form.end_date) return;
    setSaving(true);
    const payload = {
      image_url: form.image_url,
      start_date: form.start_date,
      end_date: form.end_date,
      en_title: form.en_title,
      en_label: form.en_label,
      en_desc: form.en_desc,
      en_tags: toTagArray(form.en_tags),
      th_title: form.th_title,
      th_label: form.th_label,
      th_desc: form.th_desc,
      th_tags: toTagArray(form.th_tags),
      page_url: form.page_url || null,
    };

    if (editingId) {
      await supabase.from("activities").update(payload).eq("id", editingId);
    } else {
      await supabase.from("activities").insert(payload);
    }

    await fetchActivities();
    setShowForm(false);
    setSaving(false);
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    await supabase.from("activities").delete().eq("id", id);
    await fetchActivities();
    setDeletingId(null);
  };

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

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
          onClick={openAdd}
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
          {activities.map((item) => (
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
                    onClick={() => openEdit(item)}
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
          ))}
        </div>
      )}

      {/* Form Drawer */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/50 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="w-full max-w-md bg-[#001a2c] border-l border-white/10 overflow-y-auto flex flex-col">
            {/* Drawer header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0">
              <h2 className="text-white font-semibold">{editingId ? "แก้ไขกิจกรรม" : "เพิ่มกิจกรรม"}</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form body */}
            <div className="flex-1 px-6 py-5 space-y-5 overflow-y-auto">

              {/* Image Upload */}
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">รูปภาพ</label>
                <div className="flex gap-2 mb-2">
                  <label className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium cursor-pointer transition-opacity ${uploading ? "opacity-50 pointer-events-none" : "hover:opacity-80"} bg-[#CEA870] text-[#002740]`}>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    {uploading ? "กำลังอัพโหลด..." : "อัพโหลดรูป"}
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                  </label>
                </div>
                <input value={form.image_url} onChange={set("image_url")} placeholder="หรือใส่ URL ตรงๆ" className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#CEA870]/50" />
                {form.image_url && (
                  <img src={form.image_url} alt="" className="mt-2 w-full h-28 object-cover rounded-lg opacity-70" onError={(e) => e.target.style.display = "none"} />
                )}
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">วันเริ่ม *</label>
                  <input type="date" value={form.start_date} onChange={set("start_date")} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#CEA870]/50" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">วันสิ้นสุด *</label>
                  <input type="date" value={form.end_date} onChange={set("end_date")} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#CEA870]/50" />
                </div>
              </div>

              {/* Page URL */}
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">Page URL <span className="text-gray-600">(ปล่อยว่าง = ใช้หน้า default)</span></label>
                <input value={form.page_url} onChange={set("page_url")} placeholder="/activities/forest-bathing" className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#CEA870]/50" />
              </div>

              {/* EN */}
              <div className="space-y-3">
                <p className="text-xs text-[#CEA870] uppercase tracking-widest">English</p>
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">Title *</label>
                  <input value={form.en_title} onChange={set("en_title")} placeholder="Forest Bathing" className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#CEA870]/50" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">Label (ชื่อสั้น)</label>
                  <input value={form.en_label} onChange={set("en_label")} placeholder="Forest Bathing" className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#CEA870]/50" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">Description</label>
                  <textarea value={form.en_desc} onChange={set("en_desc")} rows={3} placeholder="Short description..." className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#CEA870]/50 resize-none" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">Tags (คั่นด้วย comma)</label>
                  <input value={form.en_tags} onChange={set("en_tags")} placeholder="Nature, Wellbeing, ESG" className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#CEA870]/50" />
                </div>
              </div>

              {/* TH */}
              <div className="space-y-3">
                <p className="text-xs text-[#CEA870] uppercase tracking-widest">ภาษาไทย</p>
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">ชื่อกิจกรรม</label>
                  <input value={form.th_title} onChange={set("th_title")} placeholder="อาบป่า (Forest Bathing)" className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#CEA870]/50" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">Label (ชื่อสั้น)</label>
                  <input value={form.th_label} onChange={set("th_label")} placeholder="อาบป่า" className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#CEA870]/50" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">คำอธิบาย</label>
                  <textarea value={form.th_desc} onChange={set("th_desc")} rows={3} placeholder="คำอธิบายสั้นๆ..." className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#CEA870]/50 resize-none" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">Tags (คั่นด้วย comma)</label>
                  <input value={form.th_tags} onChange={set("th_tags")} placeholder="ธรรมชาติ, สุขภาวะ, ESG" className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#CEA870]/50" />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-white/10 flex gap-3 shrink-0">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-xl text-sm text-gray-400 bg-white/5 hover:bg-white/10 transition-colors">
                ยกเลิก
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !form.en_title || !form.start_date}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-[#CEA870] text-[#002740] hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {saving ? "กำลังบันทึก..." : editingId ? "บันทึก" : "เพิ่ม"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
