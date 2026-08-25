"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { compressImage } from "@/lib/compressImage";

const INPUT = "w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#CEA870]/50";
const LABEL = "text-xs text-gray-400 mb-1.5 block";

function toTagArray(str) {
  return str.split(",").map((s) => s.trim()).filter(Boolean);
}
function toTagString(arr) {
  return (arr ?? []).join(", ");
}

const EMPTY_FORM = {
  image_url: "",
  poster_image_url: "",
  poster_ratio: "",
  campaign_eyebrow: "",
  campaign_title: "",
  is_open: true,
  partner_logo_url: "",
  register_url: "",
  page_url: "",
  start_date: "",
  end_date: "",
  en_title: "",
  en_label: "",
  en_region: "",
  en_desc: "",
  en_tags: "",
  th_title: "",
  th_label: "",
  th_region: "",
  th_desc: "",
  th_tags: "",
  trips: [],
  sections_en: { info: [], location: { address: "", gettingThere: "", mapUrl: "" }, schedule: [], prepare: [], includes: [], reviews: [] },
  sections_th: { info: [], location: { address: "", gettingThere: "", mapUrl: "" }, schedule: [], prepare: [], includes: [], reviews: [] },
  instructors: [],
  gallery_urls: [],
};

function useImageUpload() {
  const [uploading, setUploading] = useState(false);
  const upload = async (file) => {
    setUploading(true);
    try {
      const blob = await compressImage(file);
      const fileName = `${Date.now()}-${Math.round(Math.random() * 1e6)}.jpg`;
      const { error } = await supabase.storage
        .from("Activities")
        .upload(fileName, blob, { upsert: true, contentType: "image/jpeg" });
      if (error) throw error;
      const { data } = supabase.storage.from("Activities").getPublicUrl(fileName);
      return data.publicUrl;
    } finally {
      setUploading(false);
    }
  };
  return { uploading, upload };
}

function ImageField({ label, value, onChange }) {
  const { uploading, upload } = useImageUpload();
  const onFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      onChange(await upload(file));
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div>
      <label className={LABEL}>{label}</label>
      <div className="flex gap-2 mb-2">
        <label className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium cursor-pointer transition-opacity ${uploading ? "opacity-50 pointer-events-none" : "hover:opacity-80"} bg-[#CEA870] text-[#002740]`}>
          {uploading ? "กำลังอัพโหลด..." : "อัพโหลดรูป"}
          <input type="file" accept="image/*" className="hidden" onChange={onFile} disabled={uploading} />
        </label>
      </div>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder="หรือใส่ URL ตรงๆ" className={INPUT} />
      {value && <img src={value} alt="" className="mt-2 w-full h-28 object-cover rounded-lg opacity-70" onError={(e) => (e.target.style.display = "none")} />}
    </div>
  );
}

function GalleryAdder({ onAdd }) {
  const [draft, setDraft] = useState("");
  const { uploading, upload } = useImageUpload();

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      onAdd(await upload(file));
    } catch (err) {
      console.error(err);
    }
  };

  const addDraft = () => {
    const url = draft.trim();
    if (!url) return;
    onAdd(url);
    setDraft("");
  };

  return (
    <div>
      <label className={LABEL}>เพิ่มรูปในแกลเลอรี</label>
      <div className="flex gap-2 mb-2">
        <label className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium cursor-pointer transition-opacity ${uploading ? "opacity-50 pointer-events-none" : "hover:opacity-80"} bg-[#CEA870] text-[#002740]`}>
          {uploading ? "กำลังอัพโหลด..." : "อัพโหลดรูป"}
          <input type="file" accept="image/*" className="hidden" onChange={onFile} disabled={uploading} />
        </label>
      </div>
      <div className="flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addDraft();
            }
          }}
          placeholder="หรือใส่ URL ตรงๆ แล้วกด Enter"
          className={INPUT}
        />
        <button type="button" onClick={addDraft} className="px-3 py-2 rounded-xl text-xs text-white bg-white/10 hover:bg-white/20 transition-colors shrink-0">
          เพิ่ม
        </button>
      </div>
    </div>
  );
}

function RepeatableList({ items, onChange, addLabel, newItem, renderItem }) {
  const list = items ?? [];
  const add = () => onChange([...list, newItem()]);
  const remove = (i) => onChange(list.filter((_, idx) => idx !== i));
  const update = (i, patch) => onChange(list.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  return (
    <div className="space-y-3">
      {list.map((item, i) => (
        <div key={i} className="relative rounded-xl border border-white/10 bg-white/5 p-3 pr-8">
          <button type="button" onClick={() => remove(i)} className="absolute right-2 top-2 text-red-400/70 hover:text-red-400 text-xs">✕</button>
          {renderItem(item, (patch) => update(i, patch), i)}
        </div>
      ))}
      <button type="button" onClick={add} className="text-xs text-[#CEA870] hover:opacity-80">+ {addLabel}</button>
    </div>
  );
}

function RepeatableStrings({ items, onChange, addLabel, placeholder }) {
  const list = items ?? [];
  const add = () => onChange([...list, ""]);
  const remove = (i) => onChange(list.filter((_, idx) => idx !== i));
  const update = (i, v) => onChange(list.map((s, idx) => (idx === i ? v : s)));
  return (
    <div className="space-y-2">
      {list.map((v, i) => (
        <div key={i} className="flex gap-2">
          <input value={v} onChange={(e) => update(i, e.target.value)} placeholder={placeholder} className={INPUT} />
          <button type="button" onClick={() => remove(i)} className="text-red-400/70 hover:text-red-400 text-xs px-2">✕</button>
        </div>
      ))}
      <button type="button" onClick={add} className="text-xs text-[#CEA870] hover:opacity-80">+ {addLabel}</button>
    </div>
  );
}

const TABS = ["basic", "trips", "sections", "instructors", "gallery"];
const TAB_LABEL = { basic: "ข้อมูลพื้นฐาน", trips: "ทริป & ราคา", sections: "เนื้อหารายละเอียด", instructors: "วิทยากร", gallery: "แกลเลอรี" };

export default function ActivityEditor({ activityId }) {
  const router = useRouter();
  const [form, setForm] = useState(EMPTY_FORM);
  const [tab, setTab] = useState("basic");
  const [loading, setLoading] = useState(!!activityId);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    if (!activityId) return;
    supabase
      .from("activities")
      .select("*, activity_trips(*)")
      .eq("id", activityId)
      .order("sort_order", { foreignTable: "activity_trips", ascending: true })
      .single()
      .then(({ data }) => {
        if (!data) return;
        setForm({
          image_url: data.image_url ?? "",
          poster_image_url: data.poster_image_url ?? "",
          poster_ratio: data.poster_ratio ?? "",
          campaign_eyebrow: data.campaign_eyebrow ?? "",
          campaign_title: data.campaign_title ?? "",
          is_open: data.is_open ?? true,
          partner_logo_url: data.partner_logo_url ?? "",
          register_url: data.register_url ?? "",
          page_url: data.page_url ?? "",
          start_date: data.start_date ?? "",
          end_date: data.end_date ?? "",
          en_title: data.en_title ?? "",
          en_label: data.en_label ?? "",
          en_region: data.en_region ?? "",
          en_desc: data.en_desc ?? "",
          en_tags: toTagString(data.en_tags),
          th_title: data.th_title ?? "",
          th_label: data.th_label ?? "",
          th_region: data.th_region ?? "",
          th_desc: data.th_desc ?? "",
          th_tags: toTagString(data.th_tags),
          trips: (data.activity_trips ?? []).map((t) => ({
            start_date: t.start_date ?? "",
            end_date: t.end_date ?? "",
            hours: t.hours ?? "",
            price: t.price ?? "",
            full_price: t.full_price ?? "",
          })),
          sections_en: { info: [], location: { address: "", gettingThere: "", mapUrl: "" }, schedule: [], prepare: [], includes: [], reviews: [], ...data.sections_en },
          sections_th: { info: [], location: { address: "", gettingThere: "", mapUrl: "" }, schedule: [], prepare: [], includes: [], reviews: [], ...data.sections_th },
          instructors: data.instructors ?? [],
          gallery_urls: data.gallery_urls ?? [],
        });
        setLoading(false);
      });
  }, [activityId]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const setVal = (key, v) => setForm((f) => ({ ...f, [key]: v }));
  const setSection = (lang, key, v) => setForm((f) => ({ ...f, [lang]: { ...f[lang], [key]: v } }));
  const setLocation = (lang, patch) => setForm((f) => ({ ...f, [lang]: { ...f[lang], location: { ...f[lang].location, ...patch } } }));

  const handleSave = async () => {
    if (!form.en_title) return;
    setSaving(true);
    try {
      const payload = {
        image_url: form.image_url,
        poster_image_url: form.poster_image_url || null,
        poster_ratio: form.poster_ratio ? Number(form.poster_ratio) : null,
        campaign_eyebrow: form.campaign_eyebrow || null,
        campaign_title: form.campaign_title || null,
        is_open: form.is_open,
        partner_logo_url: form.partner_logo_url || null,
        register_url: form.register_url || null,
        page_url: form.page_url || null,
        start_date: form.start_date || null,
        end_date: form.end_date || form.start_date || null,
        en_title: form.en_title,
        en_label: form.en_label,
        en_region: form.en_region || null,
        en_desc: form.en_desc,
        en_tags: toTagArray(form.en_tags),
        th_title: form.th_title,
        th_label: form.th_label,
        th_region: form.th_region || null,
        th_desc: form.th_desc,
        th_tags: toTagArray(form.th_tags),
        sections_en: form.sections_en,
        sections_th: form.sections_th,
        instructors: form.instructors,
        gallery_urls: form.gallery_urls,
      };

      let id = activityId;
      if (id) {
        const { error } = await supabase.from("activities").update(payload).eq("id", id);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from("activities").insert(payload).select("id").single();
        if (error) throw error;
        id = data.id;
      }

      // ทริป: ลบของเดิมทั้งหมดแล้วใส่ชุดใหม่ทั้งชุด — ง่ายและปลอดภัยเพราะจำนวนทริปต่อกิจกรรมมีไม่มาก
      await supabase.from("activity_trips").delete().eq("activity_id", id);
      const validTrips = form.trips.filter((t) => t.start_date && t.price);
      if (validTrips.length > 0) {
        const { error } = await supabase.from("activity_trips").insert(
          validTrips.map((t, i) => ({
            activity_id: id,
            start_date: t.start_date,
            end_date: t.end_date || t.start_date,
            hours: t.hours ? Number(t.hours) : null,
            price: Number(t.price),
            full_price: t.full_price ? Number(t.full_price) : null,
            sort_order: i,
          }))
        );
        if (error) throw error;
      }

      showToast("บันทึกสำเร็จ ✓");
      router.push("/admin/activities");
    } catch (err) {
      console.error(err);
      showToast(err.message ?? "บันทึกไม่สำเร็จ", "error");
    }
    setSaving(false);
  };

  if (loading) return <p className="text-gray-500 text-sm">กำลังโหลด...</p>;

  return (
    <div className="max-w-4xl space-y-6">
      {toast && (
        <div className={`fixed top-6 right-6 z-[100] flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium shadow-lg ${toast.type === "error" ? "bg-red-500/90 text-white" : "bg-[#CEA870] text-[#002740]"}`}>
          {toast.type === "error" ? "✕" : "✓"} {toast.msg}
        </div>
      )}

      <div className="flex items-center justify-between">
        <h1 className="text-white text-2xl font-semibold">{activityId ? "แก้ไขกิจกรรม" : "เพิ่มกิจกรรม"}</h1>
        <div className="flex gap-2">
          <button onClick={() => router.push("/admin/activities")} className="px-4 py-2 rounded-xl text-sm text-gray-400 bg-white/5 hover:bg-white/10 transition-colors">ยกเลิก</button>
          <button onClick={handleSave} disabled={saving || !form.en_title} className="px-5 py-2 rounded-xl text-sm font-semibold bg-[#CEA870] text-[#002740] hover:opacity-90 transition-opacity disabled:opacity-50">
            {saving ? "กำลังบันทึก..." : "บันทึก"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-white/10">
        {TABS.map((key) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
              tab === key ? "border-[#CEA870] text-[#CEA870]" : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            {TAB_LABEL[key]}
          </button>
        ))}
      </div>

      {/* Basic */}
      {tab === "basic" && (
        <div className="space-y-5">
          <ImageField label="รูปภาพการ์ด" value={form.image_url} onChange={(v) => setVal("image_url", v)} />
          <ImageField label="รูปปกในป็อปอัพ (poster)" value={form.poster_image_url} onChange={(v) => setVal("poster_image_url", v)} />
          <ImageField label="โลโก้พาร์ทเนอร์ร่วมแคมเปญ (ถ้ามี)" value={form.partner_logo_url} onChange={(v) => setVal("partner_logo_url", v)} />

          <div>
            <label className={LABEL}>เปิดรับสมัครแล้วหรือยัง</label>
            <button
              type="button"
              onClick={() => setVal("is_open", !form.is_open)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${form.is_open ? "bg-[#CEA870] text-[#002740]" : "bg-white/5 text-gray-400 border border-white/10"}`}
            >
              {form.is_open ? "เปิดรับสมัครแล้ว" : "ยังไม่เปิด (โชว์ฟอร์มแจ้งเตือน)"}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={LABEL}>Campaign eyebrow</label>
              <input value={form.campaign_eyebrow} onChange={set("campaign_eyebrow")} placeholder="Mission Earth x ..." className={INPUT} />
            </div>
            <div>
              <label className={LABEL}>Campaign title</label>
              <input value={form.campaign_title} onChange={set("campaign_title")} placeholder="ทับชื่อกิจกรรมในป็อปอัพ" className={INPUT} />
            </div>
          </div>

          <div>
            <label className={LABEL}>ลิงก์รับสมัคร (register URL)</label>
            <input value={form.register_url} onChange={set("register_url")} placeholder="https://..." className={INPUT} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={LABEL}>วันเริ่ม (ใช้เรียงการ์ด ถ้าไม่มีทริป)</label>
              <input type="date" value={form.start_date} onChange={set("start_date")} className={INPUT} />
            </div>
            <div>
              <label className={LABEL}>วันสิ้นสุด</label>
              <input type="date" value={form.end_date} onChange={set("end_date")} className={INPUT} />
            </div>
          </div>

          <div>
            <label className={LABEL}>Page URL <span className="text-gray-600">(ปล่อยว่าง = ใช้หน้า default)</span></label>
            <input value={form.page_url} onChange={set("page_url")} placeholder="/activities/forest-bathing" className={INPUT} />
          </div>

          <div className="space-y-3">
            <p className="text-xs text-[#CEA870] uppercase tracking-widest">English</p>
            <div><label className={LABEL}>Title *</label><input value={form.en_title} onChange={set("en_title")} className={INPUT} /></div>
            <div><label className={LABEL}>Label (ชื่อสั้น)</label><input value={form.en_label} onChange={set("en_label")} className={INPUT} /></div>
            <div><label className={LABEL}>Region</label><input value={form.en_region} onChange={set("en_region")} placeholder="Saraburi, Thailand" className={INPUT} /></div>
            <div><label className={LABEL}>Description / blurb</label><textarea value={form.en_desc} onChange={set("en_desc")} rows={3} className={`${INPUT} resize-none`} /></div>
            <div><label className={LABEL}>Tags (คั่นด้วย comma)</label><input value={form.en_tags} onChange={set("en_tags")} className={INPUT} /></div>
          </div>

          <div className="space-y-3">
            <p className="text-xs text-[#CEA870] uppercase tracking-widest">ภาษาไทย</p>
            <div><label className={LABEL}>ชื่อกิจกรรม</label><input value={form.th_title} onChange={set("th_title")} className={INPUT} /></div>
            <div><label className={LABEL}>Label (ชื่อสั้น)</label><input value={form.th_label} onChange={set("th_label")} className={INPUT} /></div>
            <div><label className={LABEL}>Region</label><input value={form.th_region} onChange={set("th_region")} placeholder="สระบุรี, ประเทศไทย" className={INPUT} /></div>
            <div><label className={LABEL}>คำอธิบาย</label><textarea value={form.th_desc} onChange={set("th_desc")} rows={3} className={`${INPUT} resize-none`} /></div>
            <div><label className={LABEL}>Tags (คั่นด้วย comma)</label><input value={form.th_tags} onChange={set("th_tags")} className={INPUT} /></div>
          </div>
        </div>
      )}

      {/* Trips */}
      {tab === "trips" && (
        <div className="space-y-3">
          <p className="text-xs text-gray-500">แต่ละแถวคือหนึ่งรอบ/ทริปที่เปิดจอง มีกี่รอบก็เพิ่มได้ ไม่ใส่ full price = ไม่มีขีดฆ่าลดราคา</p>
          <RepeatableList
            items={form.trips}
            onChange={(v) => setVal("trips", v)}
            addLabel="เพิ่มทริป"
            newItem={() => ({ start_date: "", end_date: "", hours: "", price: "", full_price: "" })}
            renderItem={(trip, update) => (
              <div className="grid grid-cols-2 gap-3">
                <div><label className={LABEL}>วันเริ่ม *</label><input type="date" value={trip.start_date} onChange={(e) => update({ start_date: e.target.value })} className={INPUT} /></div>
                <div><label className={LABEL}>วันจบ</label><input type="date" value={trip.end_date} onChange={(e) => update({ end_date: e.target.value })} className={INPUT} /></div>
                <div><label className={LABEL}>ชั่วโมง (ถ้าเป็นทริปวันเดียวแบบไม่กี่ชม.)</label><input type="number" value={trip.hours} onChange={(e) => update({ hours: e.target.value })} className={INPUT} /></div>
                <div><label className={LABEL}>ราคาเต็ม (ถ้ามีส่วนลด)</label><input type="number" value={trip.full_price} onChange={(e) => update({ full_price: e.target.value })} className={INPUT} /></div>
                <div className="col-span-2"><label className={LABEL}>ราคาขาย (บาท) *</label><input type="number" value={trip.price} onChange={(e) => update({ price: e.target.value })} className={INPUT} /></div>
              </div>
            )}
          />
        </div>
      )}

      {/* Sections — bilingual, side by side */}
      {tab === "sections" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[
            { key: "sections_en", label: "English" },
            { key: "sections_th", label: "ภาษาไทย" },
          ].map(({ key, label }) => (
            <div key={key} className="space-y-6">
              <p className="text-xs text-[#CEA870] uppercase tracking-widest">{label}</p>

              <div>
                <p className="text-sm text-white font-medium mb-2">Info (จุดเด่น)</p>
                <RepeatableList
                  items={form[key].info}
                  onChange={(v) => setSection(key, "info", v)}
                  addLabel="เพิ่มหัวข้อ"
                  newItem={() => ({ title: "", desc: "" })}
                  renderItem={(item, update) => (
                    <div className="space-y-2">
                      <input value={item.title} onChange={(e) => update({ title: e.target.value })} placeholder="หัวข้อ" className={INPUT} />
                      <textarea value={item.desc} onChange={(e) => update({ desc: e.target.value })} placeholder="รายละเอียด" rows={2} className={`${INPUT} resize-none`} />
                    </div>
                  )}
                />
              </div>

              <div>
                <p className="text-sm text-white font-medium mb-2">Location</p>
                <div className="space-y-2">
                  <input value={form[key].location?.address ?? ""} onChange={(e) => setLocation(key, { address: e.target.value })} placeholder="ที่อยู่" className={INPUT} />
                  <textarea value={form[key].location?.gettingThere ?? ""} onChange={(e) => setLocation(key, { gettingThere: e.target.value })} placeholder="วิธีเดินทาง" rows={3} className={`${INPUT} resize-none`} />
                  <input value={form[key].location?.mapUrl ?? ""} onChange={(e) => setLocation(key, { mapUrl: e.target.value })} placeholder="ลิงก์ Google Maps" className={INPUT} />
                </div>
              </div>

              <div>
                <p className="text-sm text-white font-medium mb-2">Schedule</p>
                <RepeatableList
                  items={form[key].schedule}
                  onChange={(v) => setSection(key, "schedule", v)}
                  addLabel="เพิ่มวัน"
                  newItem={() => ({ day: "", items: [] })}
                  renderItem={(day, update) => (
                    <div className="space-y-2">
                      <input value={day.day} onChange={(e) => update({ day: e.target.value })} placeholder="ชื่อวัน เช่น เช้าวันอาทิตย์" className={INPUT} />
                      <RepeatableList
                        items={day.items}
                        onChange={(v) => update({ items: v })}
                        addLabel="เพิ่มรายการเวลา"
                        newItem={() => ({ time: "", title: "" })}
                        renderItem={(it, updateIt) => (
                          <div className="flex gap-2">
                            <input value={it.time} onChange={(e) => updateIt({ time: e.target.value })} placeholder="07.30" className={`${INPUT} w-24`} />
                            <input value={it.title} onChange={(e) => updateIt({ title: e.target.value })} placeholder="รายการ" className={INPUT} />
                          </div>
                        )}
                      />
                    </div>
                  )}
                />
              </div>

              <div>
                <p className="text-sm text-white font-medium mb-2">Prepare</p>
                <RepeatableStrings items={form[key].prepare} onChange={(v) => setSection(key, "prepare", v)} addLabel="เพิ่มรายการ" placeholder="สิ่งที่ต้องเตรียม" />
              </div>

              <div>
                <p className="text-sm text-white font-medium mb-2">Includes</p>
                <RepeatableStrings items={form[key].includes} onChange={(v) => setSection(key, "includes", v)} addLabel="เพิ่มรายการ" placeholder="สิ่งที่รวมในราคา" />
              </div>

              <div>
                <p className="text-sm text-white font-medium mb-2">Reviews</p>
                <RepeatableList
                  items={form[key].reviews}
                  onChange={(v) => setSection(key, "reviews", v)}
                  addLabel="เพิ่มรีวิว"
                  newItem={() => ({ name: "", text: "" })}
                  renderItem={(r, update) => (
                    <div className="space-y-2">
                      <input value={r.name} onChange={(e) => update({ name: e.target.value })} placeholder="ชื่อผู้รีวิว" className={INPUT} />
                      <textarea value={r.text} onChange={(e) => update({ text: e.target.value })} placeholder="ข้อความรีวิว" rows={2} className={`${INPUT} resize-none`} />
                    </div>
                  )}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Instructors */}
      {tab === "instructors" && (
        <RepeatableList
          items={form.instructors}
          onChange={(v) => setVal("instructors", v)}
          addLabel="เพิ่มวิทยากร"
          newItem={() => ({ name_en: "", name_th: "", role_en: "", role_th: "", photo_url: "" })}
          renderItem={(ins, update) => (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><label className={LABEL}>ชื่อ (EN)</label><input value={ins.name_en} onChange={(e) => update({ name_en: e.target.value })} className={INPUT} /></div>
                <div><label className={LABEL}>ชื่อ (TH)</label><input value={ins.name_th} onChange={(e) => update({ name_th: e.target.value })} className={INPUT} /></div>
                <div><label className={LABEL}>ตำแหน่ง (EN)</label><input value={ins.role_en} onChange={(e) => update({ role_en: e.target.value })} placeholder="Instructor" className={INPUT} /></div>
                <div><label className={LABEL}>ตำแหน่ง (TH)</label><input value={ins.role_th} onChange={(e) => update({ role_th: e.target.value })} placeholder="ผู้นำกิจกรรม" className={INPUT} /></div>
              </div>
              <ImageField label="รูปวิทยากร" value={ins.photo_url} onChange={(v) => update({ photo_url: v })} />
            </div>
          )}
        />
      )}

      {/* Gallery */}
      {tab === "gallery" && (
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-3">
            {form.gallery_urls.map((url, i) => (
              <div key={i} className="relative rounded-lg overflow-hidden">
                <img src={url} alt="" className="w-full h-28 object-cover" />
                <button
                  type="button"
                  onClick={() => setVal("gallery_urls", form.gallery_urls.filter((_, idx) => idx !== i))}
                  className="absolute top-1 right-1 bg-black/60 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center hover:bg-black/80"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <GalleryAdder onAdd={(url) => setVal("gallery_urls", [...form.gallery_urls, url])} />
        </div>
      )}
    </div>
  );
}
