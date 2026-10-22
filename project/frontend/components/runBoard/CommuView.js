"use client";

import { useState } from "react";
import { Pencil, Plus } from "lucide-react";
import EditSheet, { Field, TextArea, TextInput } from "./EditSheet";
import { C, SHEETS, asText, commuAddTarget, parseLooseDate } from "@/lib/runBoard.mjs";

const DAY = 86400000;

export default function CommuView({ commu, raw, save, year }) {
  const [hidePast, setHidePast] = useState(false);
  const [editing, setEditing] = useState(null);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const when = (post) => {
    const d = parseLooseDate(post.date, year);
    if (!d) return "unknown";
    const diff = Math.round((d - today) / DAY);
    return diff < 0 ? "past" : diff === 0 ? "today" : diff === 1 ? "tomorrow" : "later";
  };

  return (
    <div>
      <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-me-navy/70">
        <input type="checkbox" checked={hidePast} onChange={(e) => setHidePast(e.target.checked)} className="accent-me-navy" />
        ซ่อนโพสต์ที่เลยวันไปแล้ว
      </label>

      <div className="mt-4 space-y-4">
        {commu.channels.map((ch) => (
          <section key={ch.row} className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-me-navy/5">
            <h3 className="px-4 pt-4 pb-2 font-semibold text-me-navy">
              {ch.name}
              <span className="ml-2 text-sm font-normal text-me-navy/40">{ch.posts.length} โพสต์</span>
            </h3>
            {ch.posts.map((post) => {
              const w = when(post);
              if (hidePast && w === "past") return null;
              return (
                <PostRow
                  key={post.row}
                  post={post}
                  when={w}
                  onEdit={() => setEditing({ channel: ch, post, expect: raw[post.row - 1] })}
                />
              );
            })}
            <button
              type="button"
              onClick={() => {
                const target = commuAddTarget(ch);
                setEditing({ channel: ch, target, expect: raw[target.row - 1] });
              }}
              className="flex w-full items-center gap-2 border-t border-me-navy/5 px-4 py-3 text-sm font-medium text-me-navy/60 hover:bg-me-cream/60"
            >
              <Plus size={16} /> เพิ่มโพสต์ของ {ch.name}
            </button>
          </section>
        ))}
      </div>

      {editing && <PostEditor editing={editing} save={save} onClose={() => setEditing(null)} />}
    </div>
  );
}

const BADGE = {
  today: "bg-me-gold text-white",
  tomorrow: "bg-me-gold/20 text-me-navy",
  later: "bg-me-cream text-me-navy/80",
  past: "bg-me-navy/5 text-me-navy/40",
  unknown: "bg-me-navy/5 text-me-navy/50",
};

function PostRow({ post, when, onEdit }) {
  const [open, setOpen] = useState(false);
  const longCaption = post.caption.length > 140 || post.caption.split("\n").length > 3;

  return (
    <div className={`flex gap-3 border-t border-me-navy/5 px-4 py-3 ${when === "past" ? "opacity-60" : ""}`}>
      <div className="w-20 shrink-0">
        <span className={`inline-block rounded-lg px-2 py-1 text-xs leading-tight font-semibold ${BADGE[when]}`}>
          {when === "today" ? "วันนี้" : when === "tomorrow" ? "พรุ่งนี้" : post.date || "ไม่มีวัน"}
        </span>
        {(when === "today" || when === "tomorrow") && post.date && (
          <span className="mt-1 block text-[11px] text-me-navy/50">{post.date}</span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start gap-2">
          <p className="min-w-0 flex-1 text-[15px] font-medium whitespace-pre-line text-me-navy">{post.content || "—"}</p>
          <button type="button" onClick={onEdit} className="-mt-1 -mr-2 rounded-full p-2 text-me-navy/40 hover:bg-me-navy/5" aria-label="แก้ไข">
            <Pencil size={16} />
          </button>
        </div>
        {post.platform && (
          <span className="mt-1 inline-block rounded-full bg-me-navy/5 px-2 py-0.5 text-xs text-me-navy/60">{post.platform}</span>
        )}
        {post.caption && post.caption !== "..." && (
          <div className="mt-2">
            <p className={`text-sm whitespace-pre-line break-words text-me-navy/60 ${open || !longCaption ? "" : "line-clamp-3"}`}>
              {post.caption}
            </p>
            {longCaption && (
              <button type="button" onClick={() => setOpen(!open)} className="mt-1 text-xs font-medium text-me-gold">
                {open ? "ย่อแคปชั่น" : "ดูแคปชั่นทั้งหมด"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function PostEditor({ editing, save, onClose }) {
  const { channel, post, target, expect } = editing;
  const locked = post?.merged ?? {};
  const [form, setForm] = useState({
    date: post?.date ?? "",
    platform: post?.platform ?? "",
    content: post?.content ?? "",
    caption: post?.caption ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async () => {
    if (!form.content.trim() && !form.date.trim()) return setError("ใส่วันหรือรูปแบบ content อย่างน้อยหนึ่งช่อง");
    const cols = [
      // วันที่ลงไปแบบดิบ ให้ Sheet แปลง "25 Oct" เป็นวันที่ได้เหมือนพิมพ์เอง ช่องอื่นบังคับเป็นข้อความ
      ["date", C.date, (v) => v],
      ["platform", C.platform, asText],
      ["content", C.content, asText],
      ["caption", C.caption, asText],
    ];
    const cells = cols
      .filter(([k]) => !locked[k] && (!post || form[k].trim() !== post[k]))
      .map(([k, col, fmt]) => ({ col, value: fmt(form[k].trim()) }));
    if (!cells.length) return onClose();

    setSaving(true);
    setError("");
    const payload = post
      ? { op: "write", sheet: SHEETS.commu, row: post.row, expect, cells }
      : { op: "add", sheet: SHEETS.commu, position: target.position, row: target.row, expect, cells };
    const res = await save(payload);
    setSaving(false);
    if (res.ok) onClose();
    else setError(res.message);
  };

  return (
    <EditSheet
      title={post ? "แก้ไขโพสต์" : `เพิ่มโพสต์ของ ${channel.name}`}
      subtitle={post ? `${channel.name} · แถว ${post.row} ใน Sheet` : "จะไปต่อท้ายช่องทางนี้ใน Sheet"}
      onClose={onClose}
      onSave={submit}
      saving={saving}
      error={error}
    >
      <Field label="วันลงโพสต์" hint="เช่น 25 Oct หรือ 25 Oct (7pm)" locked={locked.date}>
        <TextInput value={form.date} onChange={set("date")} disabled={locked.date} />
      </Field>
      <Field label="Platform" locked={locked.platform}>
        <TextInput value={form.platform} onChange={set("platform")} placeholder="FB/IG" disabled={locked.platform} />
      </Field>
      <Field label="รูปแบบ / content" locked={locked.content}>
        <TextArea value={form.content} onChange={set("content")} disabled={locked.content} autoFocus={!post} />
      </Field>
      <Field label="Caption" locked={locked.caption}>
        <TextArea value={form.caption} onChange={set("caption")} rows={5} disabled={locked.caption} />
      </Field>
    </EditSheet>
  );
}
