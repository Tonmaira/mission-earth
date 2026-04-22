"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const CATS = ["ME Update", "Event", "News"];

export default function NewArticlePage() {
  const router = useRouter();
  const [form, setForm] = useState({ title: "", sub: "", cat: "ME Update", date: "", imageUrl: "" });
  const [blocks, setBlocks] = useState([{ type: "paragraph", text: "" }]);
  const [tags, setTags] = useState("");

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const addBlock = (type) => setBlocks([...blocks, type === "image" ? { type, src: "", caption: "" } : type === "quote" ? { type, text: "" } : { type, text: "" }]);

  const updateBlock = (i, field, val) => {
    const updated = [...blocks];
    updated[i] = { ...updated[i], [field]: val };
    setBlocks(updated);
  };

  const removeBlock = (i) => setBlocks(blocks.filter((_, idx) => idx !== i));

  const moveBlock = (i, dir) => {
    const updated = [...blocks];
    const j = i + dir;
    if (j < 0 || j >= updated.length) return;
    [updated[i], updated[j]] = [updated[j], updated[i]];
    setBlocks(updated);
  };

  const handleSubmit = () => {
    // TODO: POST to /api/feed when backend is ready
    alert("บันทึกแล้ว! (mock — ยังไม่ได้ต่อ DB)");
    router.push("/admin/feed");
  };

  const isValid = form.title && form.cat && form.date;

  return (
    <div className="space-y-6 max-w-3xl">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-2xl font-semibold">บทความใหม่</h1>
          <p className="text-gray-400 text-sm mt-1">เขียนและจัดการเนื้อหา</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => router.back()}
            className="px-5 py-2.5 rounded-full text-sm border border-white/10 text-gray-400 hover:border-white/30 transition-all">
            ยกเลิก
          </button>
          <button onClick={handleSubmit} disabled={!isValid}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${isValid ? "bg-[#CEA870] text-[#002740] hover:bg-[#CEA870]/90" : "bg-white/5 text-gray-600 cursor-not-allowed"}`}>
            เผยแพร่
          </button>
        </div>
      </div>

      {/* Meta */}
      <div className="bg-[#052032] rounded-2xl border border-white/5 p-6 space-y-4">
        <p className="text-[#CEA870] text-xs uppercase tracking-widest font-medium">ข้อมูลบทความ</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="text-gray-400 text-xs uppercase tracking-widest block mb-2">ชื่อบทความ *</label>
            <input type="text" value={form.title} onChange={set("title")} placeholder="ชื่อบทความ"
              className="w-full bg-[#002740] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#CEA870]/60 transition-colors" />
          </div>
          <div>
            <label className="text-gray-400 text-xs uppercase tracking-widest block mb-2">คำอธิบายสั้น</label>
            <input type="text" value={form.sub} onChange={set("sub")} placeholder="subtitle"
              className="w-full bg-[#002740] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#CEA870]/60 transition-colors" />
          </div>
          <div>
            <label className="text-gray-400 text-xs uppercase tracking-widest block mb-2">หมวด *</label>
            <select value={form.cat} onChange={set("cat")}
              className="w-full bg-[#002740] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#CEA870]/60 transition-colors">
              {CATS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-gray-400 text-xs uppercase tracking-widest block mb-2">วันที่ *</label>
            <input type="date" value={form.date} onChange={set("date")}
              className="w-full bg-[#002740] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#CEA870]/60 transition-colors" />
          </div>
          <div>
            <label className="text-gray-400 text-xs uppercase tracking-widest block mb-2">URL รูป Hero</label>
            <input type="text" value={form.imageUrl} onChange={set("imageUrl")} placeholder="/image/earthfeed/..."
              className="w-full bg-[#002740] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#CEA870]/60 transition-colors" />
          </div>
          <div>
            <label className="text-gray-400 text-xs uppercase tracking-widest block mb-2">Tags (คั่นด้วยจุลภาค)</label>
            <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="ESG, Nature, Event"
              className="w-full bg-[#002740] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#CEA870]/60 transition-colors" />
          </div>
        </div>
      </div>

      {/* Content Blocks */}
      <div className="bg-[#052032] rounded-2xl border border-white/5 p-6 space-y-4">
        <p className="text-[#CEA870] text-xs uppercase tracking-widest font-medium">เนื้อหา</p>

        <div className="space-y-3">
          {blocks.map((block, i) => (
            <div key={i} className="bg-[#001f33] rounded-xl p-4 space-y-2">
              {/* Block header */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 uppercase tracking-widest">{block.type}</span>
                <div className="flex gap-1">
                  <button onClick={() => moveBlock(i, -1)} className="p-1 text-gray-600 hover:text-white transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                  </button>
                  <button onClick={() => moveBlock(i, 1)} className="p-1 text-gray-600 hover:text-white transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  <button onClick={() => removeBlock(i)} className="p-1 text-gray-600 hover:text-red-400 transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              </div>

              {/* Block content */}
              {(block.type === "paragraph" || block.type === "quote") && (
                <textarea rows={block.type === "quote" ? 2 : 4} value={block.text} onChange={(e) => updateBlock(i, "text", e.target.value)}
                  placeholder={block.type === "quote" ? "ข้อความ quote..." : "เนื้อหา paragraph..."}
                  className="w-full bg-[#002740] border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#CEA870]/60 transition-colors resize-none" />
              )}
              {block.type === "image" && (
                <div className="space-y-2">
                  <input type="text" value={block.src} onChange={(e) => updateBlock(i, "src", e.target.value)} placeholder="/image/earthfeed/..."
                    className="w-full bg-[#002740] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#CEA870]/60 transition-colors" />
                  <input type="text" value={block.caption} onChange={(e) => updateBlock(i, "caption", e.target.value)} placeholder="Caption..."
                    className="w-full bg-[#002740] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#CEA870]/60 transition-colors" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Add block */}
        <div className="flex gap-2 flex-wrap pt-2">
          {["paragraph", "image", "quote"].map((type) => (
            <button key={type} onClick={() => addBlock(type)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-white/10 text-gray-400 text-xs hover:border-[#CEA870]/40 hover:text-[#CEA870] transition-all">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              {type}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
