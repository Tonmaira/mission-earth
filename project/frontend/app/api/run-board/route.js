// app/api/run-board/route.js
// GET  /api/run-board  → ข้อมูลแท็บ Progress + Commu Plan จาก Google Sheet
// POST /api/run-board  → แก้หรือเพิ่มแถว แล้วคืนข้อมูลล่าสุด
//
// หน้าเว็บไม่คุยกับ Apps Script ตรง ๆ เพื่อให้ URL ของสคริปต์และ BOARD_KEY อยู่แต่ฝั่ง server
// คนที่มีลิงก์ dashboard ก็แค่มี token ซึ่งเปลี่ยนได้ทันทีที่ env ถ้าลิงก์หลุด
// (เปลี่ยน RUN_BOARD_TOKEN แล้ว deploy ใหม่ ลิงก์เก่าใช้ไม่ได้เลย Sheet ไม่ต้องแตะ)

import { timingSafeEqual } from "node:crypto";

export const dynamic = "force-dynamic";

const SHEETS = { Progress: 8, "Commu Plan": 5 };

function authorized(request) {
  const expected = process.env.RUN_BOARD_TOKEN || "";
  const given = request.headers.get("x-board-token") || "";
  if (!expected || given.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(given), Buffer.from(expected));
}

async function callScript(init) {
  const url = process.env.RUN_BOARD_SCRIPT_URL;
  const key = process.env.RUN_BOARD_SCRIPT_KEY;
  if (!url || !key) return Response.json({ ok: false, error: "not_configured" }, { status: 503 });

  try {
    // Apps Script ตอบด้วย 302 ไปอีกโดเมนเสมอ fetch ตามให้เอง (POST กลายเป็น GET ตอนตาม ซึ่งถูกแล้ว)
    const res = await fetch(init.method === "POST" ? url : `${url}?key=${encodeURIComponent(key)}`, {
      ...init,
      cache: "no-store",
      redirect: "follow",
    });
    const json = JSON.parse(await res.text());
    const status = json.ok || json.error === "conflict" ? 200 : json.error === "unauthorized" ? 502 : 500;
    return Response.json(json, { status });
  } catch {
    return Response.json({ ok: false, error: "unreachable" }, { status: 502 });
  }
}

export async function GET(request) {
  if (!authorized(request)) return Response.json({ ok: false, error: "forbidden" }, { status: 403 });
  return callScript({ method: "GET" });
}

const str = (v, max) => typeof v === "string" && v.length <= max;

function validate(b) {
  const maxCol = SHEETS[b?.sheet];
  if (!maxCol) return false;
  if (b.op !== "write" && b.op !== "add") return false;
  if (b.op === "add" && b.position !== "fill" && b.position !== "after") return false;
  if (!Number.isInteger(b.row) || b.row < 2) return false;
  if (!Array.isArray(b.expect) || b.expect.length > maxCol || !b.expect.every((v) => str(v, 50000))) return false;
  if (!Array.isArray(b.cells) || b.cells.length === 0 || b.cells.length > maxCol) return false;
  return b.cells.every(
    (c) => Number.isInteger(c?.col) && c.col >= 1 && c.col <= maxCol && (typeof c.value === "boolean" || str(c.value, 5000)),
  );
}

export async function POST(request) {
  if (!authorized(request)) return Response.json({ ok: false, error: "forbidden" }, { status: 403 });

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "bad_request" }, { status: 400 });
  }
  if (!validate(body)) return Response.json({ ok: false, error: "bad_request" }, { status: 400 });

  const { op, sheet, row, position, expect, cells } = body;
  const by = typeof body.by === "string" ? body.by.slice(0, 40) : "";
  return callScript({
    method: "POST",
    // text/plain เพราะ Apps Script อ่าน body ดิบจาก e.postData.contents อยู่แล้ว
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ key: process.env.RUN_BOARD_SCRIPT_KEY, op, sheet, row, position, expect, cells, by }),
  });
}
