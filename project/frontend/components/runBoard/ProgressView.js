"use client";

import { useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Plus, Undo2 } from "lucide-react";
import EditSheet, { Field, TextArea, TextInput } from "./EditSheet";
import {
  P, SHEETS, addStep, addTarget, asText, completeStep, parseSteps, splitOwners, undoStep,
} from "@/lib/runBoard.mjs";

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

  const write = (t, cells) =>
    save({ op: "write", sheet: SHEETS.progress, row: t.row, expect: raw[t.row - 1], cells }, { toast: true });

  const toggleDone = (t) => write(t, [{ col: P.done, value: !t.done }]);

  // ขั้นตอนเก็บอยู่ในช่องสถานะกับ Next Step (ดู parseSteps) เขียนสองช่องพร้อมกันเสมอ
  const writeSteps = (t, change) =>
    change &&
    write(t, [
      { col: P.status, value: asText(change.status) },
      { col: P.next, value: asText(change.next) },
    ]);
  const steps = {
    complete: (t) => writeSteps(t, completeStep(t)),
    undo: (t) => writeSteps(t, undoStep(t)),
    add: (t, text) => writeSteps(t, addStep(t, text)),
  };

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
                  <Items items={c.items} visible={visible} onToggle={toggleDone} onOpen={(t) => openTask(c, t)} steps={steps} />
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

function Items({ items, visible, onToggle, onOpen, steps }) {
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
    out.push(
      <TaskRow key={item.row} task={item} onToggle={() => onToggle(item)} onOpen={() => onOpen(item)} steps={steps} />,
    );
  });
  if (!out.length) out.push(<p key="empty" className="px-4 py-3 text-sm text-me-navy/40">ยังไม่มีงาน</p>);
  return out;
}

function TaskRow({ task: t, onToggle, onOpen, steps }) {
  return (
    <div className={`flex gap-1 border-b border-me-navy/5 last:border-0 ${t.group ? "pl-3" : ""}`}>
      <button
        type="button"
        onClick={onToggle}
        aria-label={t.done ? "ทำเครื่องหมายว่างานยังไม่เสร็จ" : "ทำเครื่องหมายว่างานเสร็จแล้ว"}
        className="shrink-0 self-start py-3 pr-1 pl-4"
      >
        <span
          className={`flex h-6 w-6 items-center justify-center rounded-md border-2 transition-colors ${
            t.done ? "border-emerald-600 bg-emerald-600 text-white" : "border-me-navy/25 bg-white"
          }`}
        >
          {t.done && <Check size={16} strokeWidth={3} />}
        </span>
      </button>
      <div className="min-w-0 flex-1 py-3 pr-4 pl-2">
        <button type="button" onClick={onOpen} className="block w-full text-left">
          <span className={`block font-medium ${t.done ? "text-me-navy/40 line-through" : "text-me-navy"}`}>
            {t.name}
            {t.detail && <span className="ml-2 text-sm font-normal whitespace-pre-line text-me-navy/45">{t.detail}</span>}
          </span>
        </button>
        {!t.done && <Steps task={t} steps={steps} onOpen={onOpen} />}
        {t.owners.length > 0 && (
          <button type="button" onClick={onOpen} className="mt-1.5 flex flex-wrap gap-1">
            {t.owners.map((o) => (
              <span key={o} className="rounded-full bg-me-cream px-2 py-0.5 text-xs text-me-navy/70">
                {o}
              </span>
            ))}
          </button>
        )}
      </div>
    </div>
  );
}

/* ขั้นที่ทำไปแล้ว (จาง) → ขั้นที่รอติ๊ก → ขั้นที่เพิ่มรอไว้ → ช่องเพิ่มขั้นใหม่ */
function Steps({ task: t, steps, onOpen }) {
  const { history, queue } = parseSteps(t);
  const [adding, setAdding] = useState(false);
  const [text, setText] = useState("");
  const sent = useRef(false); // Enter แล้วช่องหายไปจะมี blur ตามมา กันไม่ให้เพิ่มขั้นเดียวกันซ้ำ
  const lastDone = history.length > 0 && history.at(-1).done;

  const open = () => {
    sent.current = false;
    setAdding(true);
  };
  const submit = () => {
    if (sent.current) return;
    sent.current = true;
    if (text.trim()) steps.add(t, text);
    setText("");
    setAdding(false);
  };

  return (
    <div className="mt-1 space-y-1 text-sm">
      {history.map((h, i) => (
        <div key={`h${i}`} className="flex items-start gap-2">
          {h.done ? (
            <Check size={14} strokeWidth={3} className="mt-[3px] shrink-0 text-emerald-600/50" />
          ) : (
            <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-me-navy/30" />
          )}
          <button type="button" onClick={onOpen} className={`min-w-0 flex-1 text-left whitespace-pre-line ${h.done ? "text-me-navy/35" : "text-me-navy/70"}`}>
            {h.text}
            {h.done && <span className="ml-1">(Done {h.doneOn})</span>}
          </button>
          {h.done && i === history.length - 1 && lastDone && (
            <button
              type="button"
              onClick={() => steps.undo(t)}
              className="-my-1 shrink-0 rounded-full p-1 text-me-navy/30 hover:bg-me-navy/5 hover:text-me-navy/60"
              aria-label="ย้อนขั้นนี้ (ติ๊กผิด)"
              title="ย้อนขั้นนี้"
            >
              <Undo2 size={14} />
            </button>
          )}
        </div>
      ))}

      {queue.length > 0 && (
        <div className="flex items-start gap-2 pt-0.5">
          <button
            type="button"
            onClick={() => steps.complete(t)}
            aria-label={`ติ๊กว่าเสร็จ: ${queue[0]}`}
            className="group -m-1 shrink-0 p-1"
          >
            <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full border-2 border-me-gold bg-white group-hover:bg-me-gold/15">
              <Check size={11} strokeWidth={3} className="text-me-gold opacity-0 group-hover:opacity-100" />
            </span>
          </button>
          <button type="button" onClick={onOpen} className="min-w-0 flex-1 text-left text-me-navy">
            <span className="font-medium text-me-gold">ต่อไป → </span>
            {queue[0]}
          </button>
        </div>
      )}
      {queue.slice(1).map((q, i) => (
        <div key={`q${i}`} className="flex items-start gap-2 pl-[26px] text-me-navy/45">
          <span className="shrink-0">ถัดไป</span>
          <span className="min-w-0 flex-1">{q}</span>
        </div>
      ))}

      {adding ? (
        <form
          className="flex gap-2 pt-1 pl-[26px]"
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <input
            autoFocus
            value={text}
            onChange={(e) => setText(e.target.value)}
            onBlur={submit}
            onKeyDown={(e) => e.key === "Escape" && (setText(""), setAdding(false))}
            placeholder="ขั้นตอนถัดไป เช่น อนุมัติแบบ"
            className="min-w-0 flex-1 rounded-lg border border-me-navy/15 px-2.5 py-1.5 text-sm outline-none focus:border-me-gold focus:ring-2 focus:ring-me-gold/30"
          />
          <button type="submit" className="rounded-lg bg-me-navy px-3 text-sm font-medium text-white">
            เพิ่ม
          </button>
        </form>
      ) : (
        <button
          type="button"
          onClick={open}
          className="flex items-center gap-1 pt-0.5 pl-[26px] text-xs font-medium text-me-navy/40 hover:text-me-navy/70"
        >
          <Plus size={13} /> เพิ่มขั้นตอน
        </button>
      )}
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
      <Field label="สถานะ / ขั้นที่ทำไปแล้ว" hint="บรรทัดละขั้น">
        <TextArea value={form.status} onChange={set("status")} />
      </Field>
      <Field label="Next Step" hint="บรรทัดแรก = ขั้นที่รออยู่ ถัดไปคือคิว">
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
