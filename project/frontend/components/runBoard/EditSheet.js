"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

/* หน้าต่างแก้ไขที่ใช้ร่วมกันทั้งงานและโพสต์
 * บนมือถือเลื่อนขึ้นมาจากขอบล่าง (นิ้วโป้งเอื้อมถึงปุ่มบันทึก) บนจอใหญ่ลอยกลางจอ */
export default function EditSheet({ title, subtitle, onClose, onSave, saving, error, children }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && !saving && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose, saving]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
      <div className="absolute inset-0 bg-me-navy/40" onClick={() => !saving && onClose()} />
      <form
        className="relative flex max-h-[92dvh] w-full max-w-lg flex-col rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
        onSubmit={(e) => {
          e.preventDefault();
          onSave();
        }}
      >
        <div className="flex items-start gap-3 border-b border-me-navy/10 px-5 pt-5 pb-4">
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-semibold text-me-navy">{title}</h2>
            {subtitle && <p className="mt-0.5 text-xs text-me-navy/50">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="-mr-1 rounded-full p-2 text-me-navy/50 hover:bg-me-navy/5"
            aria-label="ปิด"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">{children}</div>

        <div className="border-t border-me-navy/10 px-5 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
          {error && <p className="mb-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="flex-1 rounded-full border border-me-navy/15 py-3 text-sm font-medium text-me-navy"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-[2] rounded-full bg-me-navy py-3 text-sm font-semibold text-white disabled:opacity-60"
            >
              {saving ? "กำลังบันทึกลง Sheet…" : "บันทึก"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export function Field({ label, hint, locked, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-baseline justify-between gap-2 text-xs font-medium text-me-navy/60">
        {label}
        {locked && <span className="font-normal text-me-navy/40">ช่องนี้ merge ไว้ แก้ใน Sheet</span>}
        {!locked && hint && <span className="font-normal text-me-navy/40">{hint}</span>}
      </span>
      {children}
    </label>
  );
}

/* ช่องพิมพ์ทุกช่องบนมือถือต้องใหญ่อย่างน้อย 16px ไม่งั้น Safari บน iPhone ซูมเข้าเองทุกครั้งที่แตะ
 * (ไม่แก้ด้วยการปิดซูมทั้งหน้า เพราะคนที่ต้องซูมอ่านจะซูมไม่ได้เลย) */
const inputClass =
  "w-full rounded-xl border border-me-navy/15 bg-white px-3 py-2.5 text-base sm:text-[15px] text-me-navy outline-none " +
  "placeholder:text-me-navy/30 focus:border-me-gold focus:ring-2 focus:ring-me-gold/30 disabled:bg-me-navy/5 disabled:text-me-navy/50";

export function TextInput(props) {
  return <input type="text" {...props} className={inputClass} />;
}

/* ขยายสูงตามข้อความ ข้อความในช่องสถานะ/แคปชั่นมักมีหลายบรรทัด */
export function TextArea({ rows = 2, ...props }) {
  return <textarea rows={rows} {...props} className={`${inputClass} field-sizing-content resize-none`} />;
}
