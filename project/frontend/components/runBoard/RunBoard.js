"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { RefreshCw } from "lucide-react";
import ProgressView, { Bar } from "./ProgressView";
import CommuView from "./CommuView";
import { SHEETS, parseCommu, parseProgress, splitOwners } from "@/lib/runBoard.mjs";

/* งานที่ dashboard นี้ดูแลอยู่ เปลี่ยนงานเมื่อไหร่แก้ตรงนี้กับ env สามตัวของ /api/run-board */
const EVENT = {
  title: "Black Ivory Trail Thailand",
  place: "แม่จริม · น่าน",
  dates: "20–21 พ.ย. 2026",
  raceDay: new Date("2026-11-20T00:00:00+07:00"),
  registrationCloses: new Date("2026-11-10T12:00:00+07:00"),
};

const POLL_MS = 30000;
const STORE = { me: "runBoard.me", tab: "runBoard.tab" };

const MESSAGES = {
  // หน้าต่างแก้ไขยังถือข้อมูลชุดเก่าอยู่ กดบันทึกซ้ำก็จะชนอีก ต้องปิดแล้วเปิดใหม่ถึงจะได้แถวล่าสุด
  conflict: "มีคนแก้แถวนี้ใน Sheet ไปก่อน (หรือมีการแทรก/ลบแถว) จึงยังไม่ได้บันทึก — หน้าเว็บโหลดข้อมูลล่าสุดแล้ว ปิดหน้าต่างนี้แล้วเปิดแก้ใหม่อีกครั้ง",
  forbidden: "ลิงก์นี้ใช้ไม่ได้แล้ว ขอลิงก์ใหม่จากทีม",
  not_configured: "ยังไม่ได้เชื่อมกับ Google Sheet (ยังไม่ได้ตั้งค่า RUN_BOARD_* ใน env)",
  unreachable: "ติดต่อ Google Sheet ไม่ได้ ลองใหม่อีกครั้ง",
  unauthorized: "สคริปต์ใน Sheet ไม่ยอมรับคีย์ — BOARD_KEY ใน Apps Script ไม่ตรงกับ env",
};
const messageFor = (json) => MESSAGES[json?.error] || json?.message || "บันทึกไม่สำเร็จ ลองใหม่อีกครั้ง";

const read = (k) => {
  try {
    return localStorage.getItem(k) || "";
  } catch {
    return "";
  }
};
const write = (k, v) => {
  try {
    localStorage.setItem(k, v);
  } catch {}
};

export default function RunBoard() {
  const [token, setToken] = useState(null);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchedAt, setFetchedAt] = useState(null);
  const [tab, setTab] = useState("progress");
  const [me, setMe] = useState("");
  const [toast, setToast] = useState("");
  const busy = useRef(0); // นับคำขอบันทึกที่ยังค้าง ระหว่างนั้นไม่ดึงข้อมูลมาทับ

  useEffect(() => {
    setToken(decodeURIComponent(window.location.hash.slice(1)));
    setMe(read(STORE.me));
    const t = read(STORE.tab);
    if (t === "commu" || t === "progress") setTab(t);
  }, []);

  const load = useCallback(async () => {
    if (!token || busy.current) return;
    setLoading(true);
    try {
      const res = await fetch("/api/run-board", { headers: { "x-board-token": token }, cache: "no-store" });
      const json = await res.json().catch(() => ({}));
      if (busy.current) return; // มีคนกดบันทึกระหว่างรอ ผลของการบันทึกใหม่กว่า
      if (json.ok) {
        setData(json.data);
        setFetchedAt(new Date());
        setError("");
      } else {
        setError(messageFor(json));
      }
    } catch {
      setError(MESSAGES.unreachable);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // ดึงใหม่ทุก 30 วินาทีเฉพาะตอนเปิดหน้านี้อยู่ และทันทีที่สลับกลับมาที่แท็บนี้
  useEffect(() => {
    if (!token) return;
    load();
    const id = setInterval(() => document.visibilityState === "visible" && load(), POLL_MS);
    const onVisible = () => document.visibilityState === "visible" && load();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [token, load]);

  /** ส่งการแก้ไปที่ Sheet คืน { ok, message } ให้หน้าต่างแก้ไขแสดงผล */
  const save = useCallback(
    async (payload, { optimistic } = {}) => {
      busy.current += 1;
      if (optimistic) {
        // ติ๊ก Done ให้เห็นผลทันที ไม่ต้องรอ Apps Script 2-3 วินาที
        setData((d) => {
          const values = d[optimistic.sheet].values.map((r, i) =>
            i === optimistic.row - 1 ? r.map((v, j) => (j === optimistic.col - 1 ? optimistic.value : v)) : r,
          );
          return { ...d, [optimistic.sheet]: { ...d[optimistic.sheet], values } };
        });
      }
      let json = {};
      try {
        const res = await fetch("/api/run-board", {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-board-token": token },
          body: JSON.stringify({ ...payload, by: me }),
        });
        json = await res.json().catch(() => ({}));
      } catch {
        json = { error: "unreachable" };
      }
      busy.current -= 1;

      if (json.data) {
        setData(json.data);
        setFetchedAt(new Date());
      }
      if (json.ok) return { ok: true };

      const message = messageFor(json);
      if (optimistic) {
        setToast(message);
        if (!json.data) load(); // คืนค่าที่ติ๊กไว้ก่อนหน้า
      }
      return { ok: false, message };
    },
    [token, me, load],
  );

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(""), 6000);
    return () => clearTimeout(id);
  }, [toast]);

  const parsed = useMemo(() => {
    if (!data) return null;
    try {
      return {
        progress: parseProgress(data[SHEETS.progress].values),
        commu: parseCommu(data[SHEETS.commu].values, data[SHEETS.commu].merges),
      };
    } catch (e) {
      return { error: e.message };
    }
  }, [data]);

  // รายชื่อคน: ทีมที่จดไว้หัว Sheet ก่อน ตามด้วยชื่ออื่นที่โผล่ในช่องคนรับผิดชอบ
  const people = useMemo(() => {
    if (!parsed?.progress) return [];
    const names = parsed.progress.team.map((t) => t.name);
    for (const c of parsed.progress.categories) {
      for (const t of c.items) for (const o of t.owners || []) if (!names.includes(o)) names.push(o);
    }
    return names;
  }, [parsed]);

  if (token === null) return <Shell />;
  if (!token) return <Shell message="ลิงก์ไม่ครบ ต้องเปิดจากลิงก์เต็มที่ทีมส่งให้ (มี # ตามด้วยรหัส)" />;
  if (!parsed) return <Shell message={error || "กำลังโหลดข้อมูลจาก Google Sheet…"} retry={error ? load : null} />;
  if (parsed.error) return <Shell message={`อ่าน Sheet ไม่ได้: ${parsed.error}`} retry={load} />;

  const tasks = parsed.progress.categories.flatMap((c) => c.items.filter((i) => i.type === "task"));
  const done = tasks.filter((t) => t.done).length;

  return (
    <main className="min-h-dvh bg-me-cream pb-16 text-me-navy">
      <header className="bg-me-navy px-4 pt-6 pb-5 text-white">
        <div className="mx-auto max-w-3xl">
          <p className="text-[11px] font-medium tracking-label text-me-gold uppercase">Mission Earth · Run Board</p>
          <h1 className="mt-1 text-2xl font-semibold">{EVENT.title}</h1>
          <p className="mt-0.5 text-sm text-white/60">
            {EVENT.dates} · {EVENT.place}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <Countdown label="วันงาน" to={EVENT.raceDay} now={fetchedAt} />
            <Countdown label="ปิดรับสมัคร" to={EVENT.registrationCloses} now={fetchedAt} />
          </div>

          <div className="mt-5">
            <div className="flex items-baseline justify-between text-sm">
              <span className="text-white/70">งานเสร็จแล้ว</span>
              <span className="font-semibold tabular-nums">
                {done}/{tasks.length} <span className="font-normal text-white/50">({tasks.length ? Math.round((done / tasks.length) * 100) : 0}%)</span>
              </span>
            </div>
            <Bar done={done} total={tasks.length} className="mt-2 h-2 bg-white/15" />
          </div>
        </div>
      </header>

      <div className="sticky top-0 z-30 border-b border-me-navy/10 bg-me-cream/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-2 px-4 py-2">
          {[
            ["progress", "งาน"],
            ["commu", "Commu Plan"],
          ].map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                setTab(key);
                write(STORE.tab, key);
              }}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold ${tab === key ? "bg-me-navy text-white" : "text-me-navy/60"}`}
            >
              {label}
            </button>
          ))}
          <button
            type="button"
            onClick={load}
            className="ml-auto flex items-center gap-1.5 rounded-full px-2 py-1.5 text-xs text-me-navy/50"
            title="ดึงข้อมูลล่าสุดจาก Sheet"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            {fetchedAt && fetchedAt.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" })}
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 pt-4">
        <WhoAmI me={me} people={people} onChange={(v) => { setMe(v); write(STORE.me, v); }} />
        {error && <p className="mb-3 rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-800">{error}</p>}

        {tab === "progress" ? (
          <ProgressView progress={parsed.progress} raw={data[SHEETS.progress].values} save={save} people={people} />
        ) : (
          <CommuView
            commu={parsed.commu}
            raw={data[SHEETS.commu].values}
            save={save}
            year={EVENT.raceDay.getFullYear()}
          />
        )}
      </div>

      {toast && (
        <div className="fixed inset-x-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 mx-auto max-w-md rounded-2xl bg-me-navy px-4 py-3 text-sm text-white shadow-xl">
          {toast}
        </div>
      )}
    </main>
  );
}

/* ชื่อคนแก้ไปลงแท็บ Web Log ใน Sheet จำไว้ในเครื่องนี้ เลือกครั้งเดียว */
function WhoAmI({ me, people, onChange }) {
  return (
    <label className="mb-4 flex items-center gap-2 text-sm text-me-navy/60">
      แก้ไขในชื่อ
      <select
        value={me}
        onChange={(e) => onChange(e.target.value)}
        className={`rounded-full border-0 bg-white px-3 py-1 text-sm font-medium ring-1 ring-me-navy/10 ${me ? "text-me-navy" : "text-me-gold"}`}
      >
        <option value="">เลือกชื่อคุณ</option>
        {people.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>
    </label>
  );
}

// นับจากเวลาที่ดึงข้อมูลล่าสุด ซึ่งขยับทุก 30 วินาทีอยู่แล้ว
function Countdown({ label, to, now }) {
  const days = Math.ceil((to - now) / 86400000);
  if (days < 0) return null;
  return (
    <span className="rounded-full bg-white/10 px-3 py-1 text-sm">
      {label} <span className="font-semibold text-me-gold">{days === 0 ? "วันนี้" : `อีก ${days} วัน`}</span>
    </span>
  );
}

function Shell({ message, retry }) {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-me-cream px-6 text-center text-me-navy">
      <div>
        <p className="text-[11px] font-medium tracking-label text-me-gold uppercase">Mission Earth · Run Board</p>
        {message && <p className="mt-3 max-w-sm text-sm text-me-navy/70">{message}</p>}
        {retry && (
          <button type="button" onClick={retry} className="mt-4 rounded-full bg-me-navy px-5 py-2 text-sm font-semibold text-white">
            ลองใหม่
          </button>
        )}
      </div>
    </main>
  );
}
