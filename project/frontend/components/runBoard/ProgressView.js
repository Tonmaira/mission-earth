"use client";

import { useMemo, useState } from "react";
import { Check, ChevronDown, Plus } from "lucide-react";
import EditSheet, { Field, TextArea, TextInput } from "./EditSheet";
import { P, SHEETS, addTarget, asText, splitOwners } from "@/lib/runBoard.mjs";

const NO_OWNER = "__none__";

export default function ProgressView({ progress, raw, save, people }) {
  const [owner, setOwner] = useState(null);
  const [hideDone, setHideDone] = useState(false);
  const [editing, setEditing] = useState(null); // { task?, category, form, expect }
  const [collapsed, setCollapsed] = useState({});

  const counts = useMemo(() => {
    const open = {};
    for (const c of progress.categories) {
      for (const t of c.items) {
        if (t.type !== "task" || t.done) continue;
        const names = t.owners.length ? t.owners : [NO_OWNER];
        for (const n of names) open[n] = (open[n] || 0) + 1;
      }
    }
    return open;
  }, [progress]);

  const visible = (t) => {
    if (hideDone && t.done) return false;
    if (!owner) return true;
    return owner === NO_OWNER ? t.owners.length === 0 : t.owners.includes(owner);
  };

  const toggleDone = (t) =>
    save(
      { op: "write", sheet: SHEETS.progress, row: t.row, expect: raw[t.row - 1], cells: [{ col: P.done, value: !t.done }] },
      { optimistic: { sheet: SHEETS.progress, row: t.row, col: P.done, value: t.done ? "FALSE" : "TRUE" } },
    );

  const openTask = (category, t) =>
    setEditing({
      category,
      task: t,
      expect: raw[t.row - 1],
      form: { name: t.name, detail: t.detail, status: t.status, next: t.next, owner: t.ownerText, done: t.done },
    });

  const openNew = (category) => {
    const target = addTarget(category);
    setEditing({
      category,
      target,
      expect: raw[target.row - 1],
      form: { name: "", detail: "", status: "", next: "", owner: owner && owner !== NO_OWNER ? owner : "", done: false },
    });
  };

  return (
    <div>
      {/* กรองตามคน */}
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none]">
        <Chip active={!owner} onClick={() => setOwner(null)}>
          ทั้งหมด
        </Chip>
        {people.map((p) => (
          <Chip key={p} active={owner === p} onClick={() => setOwner(owner === p ? null : p)} count={counts[p]}>
            {p}
          </Chip>
        ))}
        {counts[NO_OWNER] > 0 && (
          <Chip active={owner === NO_OWNER} onClick={() => setOwner(owner === NO_OWNER ? null : NO_OWNER)} count={counts[NO_OWNER]}>
            ยังไม่มีคนรับ
          </Chip>
        )}
      </div>
      <label className="mt-3 inline-flex cursor-pointer items-center gap-2 text-sm text-me-navy/70">
        <input type="checkbox" checked={hideDone} onChange={(e) => setHideDone(e.target.checked)} className="accent-me-navy" />
        ซ่อนงานที่เสร็จแล้ว
      </label>

      <div className="mt-4 space-y-4">
        {progress.categories.map((c) => {
          const tasks = c.items.filter((i) => i.type === "task");
          const done = tasks.filter((t) => t.done).length;
          const shown = c.items.filter((i) => i.type === "task" && visible(i));
          if (owner && shown.length === 0) return null;
          const isOpen = !collapsed[c.row];

          return (
            <section key={c.row} className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-me-navy/5">
              <button
                type="button"
                onClick={() => setCollapsed({ ...collapsed, [c.row]: isOpen })}
                className="flex w-full items-center gap-3 px-4 py-3.5 text-left"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-me-navy text-xs font-semibold text-white">
                  {c.no ?? "–"}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold text-me-navy">{c.name}</span>
                  <Bar done={done} total={tasks.length} />
                </span>
                <span className="text-sm tabular-nums text-me-navy/60">
                  {done}/{tasks.length}
                </span>
                <ChevronDown size={18} className={`text-me-navy/40 transition-transform ${isOpen ? "" : "-rotate-90"}`} />
              </button>

              {isOpen && (
                <div className="border-t border-me-navy/5">
                  <Items items={c.items} visible={visible} onToggle={toggleDone} onOpen={(t) => openTask(c, t)} />
                  <button
                    type="button"
                    onClick={() => openNew(c)}
                    className="flex w-full items-center gap-2 px-4 py-3 text-sm font-medium text-me-navy/60 hover:bg-me-cream/60"
                  >
                    <Plus size={16} /> เพิ่มงานใน {c.name}
                  </button>
                </div>
              )}
            </section>
          );
        })}
      </div>

      {editing && (
        <TaskEditor
          editing={editing}
          people={people}
          onClose={() => setEditing(null)}
          onSaved={() => setEditing(null)}
          save={save}
        />
      )}
    </div>
  );
}

function Items({ items, visible, onToggle, onOpen }) {
  const out = [];
  items.forEach((item, i) => {
    if (item.type === "group") {
      // แสดงหัวกลุ่มย่อยเฉพาะตอนที่ยังมีงานในกลุ่มให้เห็น
      const members = [];
      for (let j = i + 1; j < items.length && items[j].type === "task" && items[j].group === item.name; j++) members.push(items[j]);
      if (members.some(visible)) {
        out.push(
          <div key={item.row} className="px-4 pt-3 pb-1 text-[11px] font-semibold tracking-wider text-me-gold uppercase">
            {item.name}
          </div>,
        );
      }
      return;
    }
    if (!visible(item)) return;
    out.push(<TaskRow key={item.row} task={item} onToggle={() => onToggle(item)} onOpen={() => onOpen(item)} />);
  });
  if (!out.length) out.push(<p key="empty" className="px-4 py-3 text-sm text-me-navy/40">ยังไม่มีงาน</p>);
  return out;
}

function TaskRow({ task: t, onToggle, onOpen }) {
  return (
    <div className={`flex gap-1 border-b border-me-navy/5 last:border-0 ${t.group ? "pl-3" : ""}`}>
      <button
        type="button"
        onClick={onToggle}
        aria-label={t.done ? "ทำเครื่องหมายว่ายังไม่เสร็จ" : "ทำเครื่องหมายว่าเสร็จแล้ว"}
        className="shrink-0 py-3 pr-1 pl-4"
      >
        <span
          className={`flex h-6 w-6 items-center justify-center rounded-md border-2 transition-colors ${
            t.done ? "border-emerald-600 bg-emerald-600 text-white" : "border-me-navy/25 bg-white"
          }`}
        >
          {t.done && <Check size={16} strokeWidth={3} />}
        </span>
      </button>
      <button type="button" onClick={onOpen} className="min-w-0 flex-1 py-3 pr-4 pl-2 text-left">
        <span className={`block font-medium ${t.done ? "text-me-navy/40 line-through" : "text-me-navy"}`}>
          {t.name}
          {t.detail && <span className="ml-2 text-sm font-normal whitespace-pre-line text-me-navy/45">{t.detail}</span>}
        </span>
        {!t.done && (t.status || t.next) && (
          <span className="mt-1 block space-y-0.5 text-sm">
            {t.status && <span className="block whitespace-pre-line text-me-navy/70">{t.status}</span>}
            {t.next && (
              <span className="block whitespace-pre-line text-me-navy/55">
                <span className="font-medium text-me-gold">ต่อไป → </span>
                {t.next}
              </span>
            )}
          </span>
        )}
        {t.owners.length > 0 && (
          <span className="mt-1.5 flex flex-wrap gap-1">
            {t.owners.map((o) => (
              <span key={o} className="rounded-full bg-me-cream px-2 py-0.5 text-xs text-me-navy/70">
                {o}
              </span>
            ))}
          </span>
        )}
      </button>
    </div>
  );
}

function TaskEditor({ editing, people, onClose, onSaved, save }) {
  const { task, category, target, expect } = editing;
  const [form, setForm] = useState(editing.form);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const owners = splitOwners(form.owner);
  const toggleOwner = (p) =>
    setForm({ ...form, owner: (owners.includes(p) ? owners.filter((o) => o !== p) : [...owners, p]).join(", ") });

  const submit = async () => {
    if (!form.name.trim()) return setError("ใส่ชื่องานก่อน");
    // งานในกลุ่มย่อยต้องคง "- " ไว้ ไม่งั้นใน Sheet จะหลุดออกจากกลุ่ม
    const name = task?.group ? `- ${form.name.trim()}` : form.name.trim();
    const fields = [
      [P.name, name, task ? (task.group ? `- ${task.name}` : task.name) : ""],
      [P.detail, form.detail.trim(), task?.detail ?? ""],
      [P.status, form.status.trim(), task?.status ?? ""],
      [P.next, form.next.trim(), task?.next ?? ""],
      [P.owner, form.owner.trim(), task?.ownerText ?? ""],
    ];
    const cells = fields.filter(([, v, old]) => !task || v !== old).map(([col, v]) => ({ col, value: asText(v) }));
    if (!task || form.done !== task.done) cells.push({ col: P.done, value: form.done });
    if (!cells.length) return onClose();

    setSaving(true);
    setError("");
    const payload = task
      ? { op: "write", sheet: SHEETS.progress, row: task.row, expect, cells }
      : { op: "add", sheet: SHEETS.progress, position: target.position, row: target.row, expect, cells };
    const res = await save(payload);
    setSaving(false);
    if (res.ok) onSaved();
    else setError(res.message);
  };

  return (
    <EditSheet
      title={task ? "แก้ไขงาน" : `เพิ่มงานใน ${category.name}`}
      subtitle={task ? `${category.name}${task.group ? ` · ${task.group}` : ""} · แถว ${task.row} ใน Sheet` : "จะไปต่อท้ายหมวดนี้ใน Sheet"}
      onClose={onClose}
      onSave={submit}
      saving={saving}
      error={error}
    >
      <Field label="งาน">
        <TextInput value={form.name} onChange={set("name")} placeholder="เช่น ป้ายจุด CP" autoFocus={!task} />
      </Field>
      <Field label="รายละเอียด" hint="จำนวน ขนาด ฯลฯ">
        <TextArea value={form.detail} onChange={set("detail")} rows={1} />
      </Field>
      <Field label="สถานะตอนนี้">
        <TextArea value={form.status} onChange={set("status")} />
      </Field>
      <Field label="Next Step">
        <TextArea value={form.next} onChange={set("next")} />
      </Field>
      <Field label="คนรับผิดชอบ">
        <TextInput value={form.owner} onChange={set("owner")} placeholder="แตะชื่อด้านล่าง หรือพิมพ์เอง" />
        <span className="mt-2 flex flex-wrap gap-1.5">
          {people.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => toggleOwner(p)}
              className={`rounded-full px-3 py-1 text-sm ${
                owners.includes(p) ? "bg-me-navy text-white" : "bg-me-cream text-me-navy/70"
              }`}
            >
              {p}
            </button>
          ))}
        </span>
      </Field>
      <label className="flex items-center gap-3 rounded-xl bg-me-cream/70 px-3 py-3 text-sm font-medium text-me-navy">
        <input
          type="checkbox"
          checked={form.done}
          onChange={(e) => setForm({ ...form, done: e.target.checked })}
          className="h-5 w-5 accent-emerald-600"
        />
        เสร็จแล้ว
      </label>
    </EditSheet>
  );
}

function Chip({ active, onClick, count, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
        active ? "bg-me-navy text-white" : "bg-white text-me-navy/70 ring-1 ring-me-navy/10"
      }`}
    >
      {children}
      {count > 0 && (
        <span className={`rounded-full px-1.5 text-xs tabular-nums ${active ? "bg-white/20" : "bg-me-cream"}`}>{count}</span>
      )}
    </button>
  );
}

export function Bar({ done, total, className = "mt-1.5 h-1.5" }) {
  const pct = total ? Math.round((done / total) * 100) : 0;
  return (
    <span className={`block overflow-hidden rounded-full bg-me-navy/10 ${className}`}>
      <span className="block h-full rounded-full bg-emerald-600 transition-[width]" style={{ width: `${pct}%` }} />
    </span>
  );
}
