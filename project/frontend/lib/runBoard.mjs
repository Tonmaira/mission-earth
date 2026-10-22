/* อ่านแท็บ Progress กับ Commu Plan ของ Google Sheet งานวิ่ง แล้วแปลงเป็นโครงที่หน้า dashboard ใช้
 *
 * Sheet ยังเป็นที่เก็บข้อมูลตัวจริงที่เดียว หน้าเว็บไม่มีฐานข้อมูลของตัวเอง
 * ทีมจะแก้ใน Sheet หรือบนเว็บก็ได้ เลยไม่มีอะไรต้อง sync
 *
 * ข้อมูลที่ได้จาก Apps Script เป็นตารางข้อความดิบ (getDisplayValues) ไม่มีโครงอะไร
 * ไฟล์นี้จึงต้องเดาโครงจากหน้าตาของแถว แบบเดียวกับที่คนอ่าน Sheet:
 *   - แถวที่ช่อง A ขึ้นต้นด้วยตัวเลข       = หัวหมวด (1 Productions, 2 Communication ...)
 *   - แถวที่ช่อง Done เป็น checkbox     = งาน (หรือช่องว่างรอใส่งาน ถ้ายังไม่มีชื่อ)
 *   - แถวที่มีชื่อแต่ไม่มี checkbox       = หัวกลุ่มย่อย (KV, บูธสปอนเซอร์) งานที่ขึ้นต้นด้วย "- " ข้างใต้เป็นของกลุ่มนี้
 *
 * เลขแถวที่เก็บไว้ทุกตัวเป็นเลขแถวจริงใน Sheet (เริ่มที่ 1) ใช้ตอนเขียนกลับ
 */

export const SHEETS = { progress: "Progress", commu: "Commu Plan" };

// คอลัมน์ของแท็บ Progress (เริ่มที่ 1 แบบ Sheet)
// star (H) เพิ่มทีหลัง: มีอะไรอยู่ในช่อง (ปกติคือ ★) = ติดดาว ทีมพิมพ์เองใน Sheet ก็ได้
export const P = { no: 1, name: 2, detail: 3, status: 4, next: 5, owner: 6, done: 7, star: 8 };
// คอลัมน์ของแท็บ Commu Plan
export const C = { channel: 1, date: 2, platform: 3, content: 4, caption: 5 };

const cell = (row, col) => String(row?.[col - 1] ?? "").trim();
const isCheckbox = (v) => v === "TRUE" || v === "FALSE";
const SUB_PREFIX = /^-\s*/;

/** "Film, Tonmai" → ["Film", "Tonmai"] */
export function splitOwners(text) {
  return String(text || "")
    .split(/[,/+&]| และ /)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function parseProgress(values) {
  const headerIdx = values.findIndex((r) => cell(r, P.no) === "ลำดับ");
  if (headerIdx < 0) throw new Error('ไม่เจอแถวหัวตาราง ("ลำดับ") ในแท็บ Progress');

  // รายชื่อทีมที่จดไว้เหนือหัวตาราง (ชื่อ | หน้าที่)
  const team = values
    .slice(0, headerIdx)
    .filter((r) => cell(r, 1) && cell(r, 2))
    .map((r) => ({ name: cell(r, 1), role: cell(r, 2) }));

  const categories = [];
  let cat = null;
  let group = null;

  const ensureCat = (row) => {
    // เผื่อมีงานอยู่ก่อนหัวหมวดแรก จะได้ไม่หายไปเฉย ๆ
    if (!cat) {
      cat = { no: null, name: "ไม่มีหมวด", row, items: [], slots: [], lastRow: row };
      categories.push(cat);
    }
    return cat;
  };

  for (let i = headerIdx + 1; i < values.length; i++) {
    const r = values[i];
    const row = i + 1;
    const no = cell(r, P.no);
    const name = cell(r, P.name);
    const done = cell(r, P.done);

    if (/^\d/.test(no)) {
      cat = { no: parseInt(no, 10), name, row, items: [], slots: [], lastRow: row };
      categories.push(cat);
      group = null;
      continue;
    }

    if (isCheckbox(done)) {
      const c = ensureCat(row);
      c.lastRow = row;
      if (!name) {
        c.slots.push(row);
        continue;
      }
      const isSub = SUB_PREFIX.test(name);
      if (!isSub) group = null;
      c.items.push({
        type: "task",
        row,
        name: name.replace(SUB_PREFIX, ""),
        isSub: isSub && !!group,
        group: isSub ? group : null,
        detail: cell(r, P.detail),
        status: cell(r, P.status),
        next: cell(r, P.next),
        owners: splitOwners(cell(r, P.owner)),
        ownerText: cell(r, P.owner),
        done: done === "TRUE",
        starred: cell(r, P.star) !== "",
      });
      continue;
    }

    if (name) {
      const c = ensureCat(row);
      c.lastRow = row;
      group = name;
      c.items.push({ type: "group", row, name });
    }
  }

  return { headerRow: headerIdx + 1, team, categories };
}

/** ตำแหน่งที่จะใส่งานใหม่ของหมวดนี้: ใช้แถวว่างที่เตรียมไว้ก่อน ไม่มีค่อยแทรกแถวต่อท้ายหมวด */
export function addTarget(category) {
  if (category.slots.length) return { position: "fill", row: category.slots[0] };
  return { position: "after", row: category.lastRow };
}

/* ── Commu Plan ─────────────────────────────────────────────────────── */

/**
 * merges มาจาก Apps Script เป็น [แถว, คอลัมน์, จำนวนแถว, จำนวนคอลัมน์] (เริ่มที่ 1)
 * ช่องที่ถูก merge มีค่าอยู่แค่ช่องซ้ายบน ที่เหลือเป็นค่าว่าง
 * ตรงนี้คืนค่าของช่องซ้ายบนให้ทุกช่องในกลุ่ม แล้วจดไว้ว่าช่องไหนเป็นช่องที่ merge
 * (หน้าเว็บจะไม่ให้แก้ช่องพวกนี้ เพราะแก้ทีเดียวกระทบหลายแถว)
 */
export function parseCommu(values, merges = []) {
  const mergedAt = new Map(); // "row:col" → ค่าจากช่องซ้ายบน
  for (const [r0, c0, h, w] of merges) {
    const v = cell(values[r0 - 1], c0);
    for (let r = r0; r < r0 + h; r++) {
      for (let c = c0; c < c0 + w; c++) mergedAt.set(`${r}:${c}`, v);
    }
  }
  const get = (row, col) => mergedAt.get(`${row}:${col}`) ?? cell(values[row - 1], col);

  const headerIdx = Math.max(0, values.findIndex((r) => cell(r, C.channel) === "ช่องทาง"));
  const channels = [];
  let ch = null;

  for (let i = headerIdx + 1; i < values.length; i++) {
    const row = i + 1;
    const name = cell(values[i], C.channel);
    if (name) {
      ch = { name, row, posts: [], slots: [], lastRow: row };
      channels.push(ch);
    }
    if (!ch) continue;

    const fields = {
      date: get(row, C.date),
      platform: get(row, C.platform),
      content: get(row, C.content),
      caption: get(row, C.caption),
    };
    if (!Object.values(fields).some(Boolean)) {
      ch.slots.push(row);
      continue;
    }
    ch.lastRow = row;
    ch.posts.push({
      row,
      ...fields,
      merged: {
        date: mergedAt.has(`${row}:${C.date}`),
        platform: mergedAt.has(`${row}:${C.platform}`),
        content: mergedAt.has(`${row}:${C.content}`),
        caption: mergedAt.has(`${row}:${C.caption}`),
      },
    });
  }

  // แถวว่างที่อยู่หลังโพสต์สุดท้ายเท่านั้นที่นับเป็นที่ว่างรอใส่ ช่องว่างที่คั่นกลางระหว่างโพสต์ปล่อยไว้ตามเดิม
  for (const c of channels) c.slots = c.slots.filter((r) => r > c.lastRow);
  return { channels };
}

export function commuAddTarget(channel) {
  if (channel.slots.length) return { position: "fill", row: channel.slots[0] };
  return { position: "after", row: channel.lastRow };
}

/* ── วันที่ ──────────────────────────────────────────────────────────── */

const MONTHS = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
  "ม.ค.": 0, "ก.พ.": 1, "มี.ค.": 2, "เม.ย.": 3, "พ.ค.": 4, "มิ.ย.": 5,
  "ก.ค.": 6, "ส.ค.": 7, "ก.ย.": 8, "ต.ค.": 9, "พ.ย.": 10, "ธ.ค.": 11,
  "ตค": 9, "พย": 10, "ธค": 11,
};

/**
 * อ่านวันที่จากข้อความในช่องวันลงโพสต์ ซึ่งมีหลายแบบปนกัน
 * ("22 Oct (10am)", "23 Oct", "10/23/2026", "23/10/2026", "22 ต.ค.")
 * คืน Date ตอนเที่ยงคืน หรือ null ถ้าอ่านไม่ออก — ใช้แค่ไฮไลต์ว่าโพสต์ไหนเลยวันแล้ว/วันนี้
 */
export function parseLooseDate(text, year = new Date().getFullYear()) {
  const s = String(text || "").trim();
  if (!s) return null;

  let m = /(\d{1,2})\s*([A-Za-z]{3}|[ก-๙.]{2,5})/.exec(s);
  if (m) {
    const key = m[2].toLowerCase();
    const month = MONTHS[key] ?? MONTHS[key.replace(/\./g, "")];
    if (month !== undefined) return new Date(year, month, Number(m[1]));
  }

  m = /^(\d{1,2})\/(\d{1,2})\/(\d{2,4})/.exec(s);
  if (m) {
    let [a, b, y] = [Number(m[1]), Number(m[2]), Number(m[3])];
    if (y < 100) y += 2000;
    if (y > 2400) y -= 543; // พ.ศ.
    // ถ้าตัวแรกเกิน 12 ต้องเป็นวัน ไม่งั้นถือเป็นแบบเดือน/วัน (ค่าตั้งต้นของ Sheet ภาษาอังกฤษ)
    const [d, mo] = a > 12 ? [a, b] : [b, a];
    return new Date(y, mo - 1, d);
  }
  return null;
}

/* ── ขั้นตอนของงาน ──────────────────────────────────────────────────────
 *
 * ไม่มีคอลัมน์ใหม่ ใช้สองช่องเดิม บรรทัดละขั้น:
 *   สถานะ     = สิ่งที่เกิดไปแล้ว ขั้นที่ติ๊กจากเว็บจะลงท้ายด้วย "(Done 23 Oct)"
 *   Next Step = บรรทัดแรกคือขั้นที่รอติ๊กอยู่ บรรทัดถัดไปคือขั้นที่เพิ่มรอไว้
 * คนที่แก้ใน Sheet เห็นและแก้ได้แบบเดียวกัน (ขึ้นบรรทัดใหม่ในช่องด้วย ⌘+Enter)
 */

const DONE_TAG = /\s*\(Done ([^)]*)\)\s*$/i;
const lines = (text) => String(text || "").split("\n").map((s) => s.trim()).filter(Boolean);

export function parseSteps(task) {
  return {
    history: lines(task.status).map((line) => {
      const m = DONE_TAG.exec(line);
      return m ? { text: line.slice(0, m.index), doneOn: m[1], done: true } : { text: line, done: false };
    }),
    queue: lines(task.next),
  };
}

const SHORT_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
/** "23 Oct" — แบบเดียวกับวันที่ที่ทีมพิมพ์ไว้ใน Sheet อยู่แล้ว */
export const shortDate = (d) => `${d.getDate()} ${SHORT_MONTHS[d.getMonth()]}`;

/** ติ๊กขั้นที่รออยู่: ย้ายไปท้ายสถานะพร้อมวันที่ แล้วเลื่อนขั้นถัดไปขึ้นมารอ */
export function completeStep(task, today = new Date()) {
  const { queue } = parseSteps(task);
  if (!queue.length) return null;
  return {
    status: [...lines(task.status), `${queue[0]} (Done ${shortDate(today)})`].join("\n"),
    next: queue.slice(1).join("\n"),
  };
}

/** ย้อนขั้นที่ติ๊กล่าสุด (ติ๊กผิด): เอาออกจากสถานะ แล้วกลับไปเป็นขั้นที่รออยู่ */
export function undoStep(task) {
  const status = lines(task.status);
  const last = status.at(-1);
  const m = last && DONE_TAG.exec(last);
  if (!m) return null;
  return {
    status: status.slice(0, -1).join("\n"),
    next: [last.slice(0, m.index), ...lines(task.next)].join("\n"),
  };
}

export function addStep(task, text) {
  const step = String(text || "").replace(/\s+/g, " ").trim();
  if (!step) return null;
  return { status: lines(task.status).join("\n"), next: [...lines(task.next), step].join("\n") };
}

/* ── ส่งไปเขียน ──────────────────────────────────────────────────────── */

/** ข้อความที่ต้องลงเป็นข้อความเสมอ ไม่ให้ Sheet แปลง "27 Oct" เป็นวันที่หรือ "600" เป็นตัวเลข */
export const asText = (v) => (v === "" ? "" : `'${v}`);
