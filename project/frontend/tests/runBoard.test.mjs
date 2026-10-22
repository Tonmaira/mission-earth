import assert from "node:assert/strict";
import { test } from "node:test";
import {
  addTarget, commuAddTarget, parseCommu, parseLooseDate, parseProgress, splitOwners,
} from "../lib/runBoard.mjs";

// ตัดมาจากแท็บ Progress จริงของ Black Ivory (ต.ค. 2026) — หน้าตาเดียวกับที่ getDisplayValues คืนมา
const row = (...cells) => [...cells, "", "", "", "", "", "", ""].slice(0, 7);
const progress = [
  row("Cherry", "ตัดสินใจทุกอย่าง"),
  row("Tonmai", "artwork+production"),
  row(),
  row("ลำดับ", "รายการ", "รายละเอียด", "สถานะ", "Next Step", "คนรับผิดชอบ", "Done"),
  row("1", "Productions"),
  row("", "KV"),
  row("", "- Logo", "", "", "", "Tonmai", "TRUE"),
  row("", "- Poster", "", "", "", "Tonmai", "TRUE"),
  row("", "เสื้อ", "600 ตัว", "ส่งแบบแล้ว (21 Oct)", "รอดูตัวอย่าง (27 Oct)", "Film, Tonmai", "FALSE"),
  row("2", "City Run"),
  row("", "บูธสปอนเซอร์"),
  row("", "- Kbank", "", "", "รอลูกค้า", "Fiat", "FALSE"),
  row("7", "Marketing Plan"),
  row("", "", "", "", "", "", "FALSE"),
  row("", "", "", "", "", "", "FALSE"),
];

test("แยกหมวด งาน กลุ่มย่อย และรายชื่อทีม", () => {
  const p = parseProgress(progress);
  assert.equal(p.headerRow, 4);
  assert.deepEqual(p.team, [
    { name: "Cherry", role: "ตัดสินใจทุกอย่าง" },
    { name: "Tonmai", role: "artwork+production" },
  ]);
  assert.deepEqual(p.categories.map((c) => c.name), ["Productions", "City Run", "Marketing Plan"]);

  const [prod] = p.categories;
  assert.deepEqual(prod.items.map((i) => [i.type, i.name]), [
    ["group", "KV"], ["task", "Logo"], ["task", "Poster"], ["task", "เสื้อ"],
  ]);
  const logo = prod.items[1];
  assert.equal(logo.row, 7);
  assert.equal(logo.group, "KV");
  assert.equal(logo.done, true);

  // งานที่ไม่มี "- " นำหน้า ปิดกลุ่มย่อยก่อนหน้า
  const shirt = prod.items[3];
  assert.equal(shirt.group, null);
  assert.deepEqual(shirt.owners, ["Film", "Tonmai"]);
  assert.equal(shirt.next, "รอดูตัวอย่าง (27 Oct)");
});

test("งานใหม่ใช้แถวว่างที่เตรียมไว้ก่อน ไม่มีจึงแทรกต่อท้ายหมวด", () => {
  const [prod, city, mkt] = parseProgress(progress).categories;
  assert.deepEqual(mkt.slots, [14, 15]);
  assert.deepEqual(addTarget(mkt), { position: "fill", row: 14 });
  assert.deepEqual(addTarget(prod), { position: "after", row: 9 });
  assert.deepEqual(addTarget(city), { position: "after", row: 12 });
});

test("ไม่เจอหัวตาราง ต้องบอกชัด ๆ ไม่ใช่คืนหน้าว่าง", () => {
  assert.throws(() => parseProgress([row("a", "b")]), /ลำดับ/);
});

test("แยกชื่อคนรับผิดชอบหลายแบบ", () => {
  assert.deepEqual(splitOwners("Film, SomO"), ["Film", "SomO"]);
  assert.deepEqual(splitOwners("Fiat / Mart"), ["Fiat", "Mart"]);
  assert.deepEqual(splitOwners(""), []);
});

// แท็บ Commu Plan จริง: B3:B5, D4:D5, E4:E5 ถูก merge
const c5 = (...cells) => [...cells, "", "", "", "", ""].slice(0, 5);
const commu = [
  c5("ช่องทาง", "วันลงโพสต์", "Plateform", "รูปแบบ/content", "Caption"),
  c5("Runlah", "22 Oct (10am)", "www.runlah.com", "post (เปิดรับสมัคร)", "..."),
  c5("", "23 Oct", "Facebook", "post (Carousel)", "เปิดรับสมัครแล้ว FB"),
  c5("", "", "Instagram", "post (Carousel)", "เปิดรับสมัครแล้ว IG"),
  c5("", "", "Tiktok"),
  c5(),
  c5(),
  c5("Mission Earth", "21 Oct (7pm)", "FB/IG", "(Clip01) เปิดตัวงาน", "เปิดรูทใหม่"),
  c5(),
  c5("", "", "", "(Onepage05) รวมคำถามที่พบบ่อย"),
];
const merges = [[3, 2, 3, 1], [4, 4, 2, 1], [4, 5, 2, 1]];

test("ช่องที่ merge ได้ค่าจากช่องซ้ายบน และถูกจดว่าแก้บนเว็บไม่ได้", () => {
  const { channels } = parseCommu(commu, merges);
  assert.deepEqual(channels.map((c) => c.name), ["Runlah", "Mission Earth"]);

  const tiktok = channels[0].posts[3];
  assert.equal(tiktok.platform, "Tiktok");
  assert.equal(tiktok.date, "23 Oct");
  assert.equal(tiktok.caption, "เปิดรับสมัครแล้ว IG");
  assert.deepEqual(tiktok.merged, { date: true, platform: false, content: true, caption: true });
  assert.equal(channels[0].posts[0].merged.date, false);
});

test("โพสต์ใหม่ใส่แถวว่างท้ายช่องทาง แต่ไม่ใช้แถวว่างที่คั่นกลางระหว่างโพสต์", () => {
  const [runlah, me] = parseCommu(commu, merges).channels;
  assert.deepEqual(commuAddTarget(runlah), { position: "fill", row: 6 });
  assert.deepEqual(me.slots, []);
  assert.deepEqual(commuAddTarget(me), { position: "after", row: 10 });
});

test("อ่านวันที่หลายรูปแบบที่ปนกันใน Sheet", () => {
  const d = (y, m, day) => new Date(y, m - 1, day).getTime();
  assert.equal(parseLooseDate("22 Oct (10am)", 2026).getTime(), d(2026, 10, 22));
  assert.equal(parseLooseDate("10/23/2026").getTime(), d(2026, 10, 23));
  assert.equal(parseLooseDate("23/10/2026").getTime(), d(2026, 10, 23));
  assert.equal(parseLooseDate("5 พ.ย.", 2026).getTime(), d(2026, 11, 5));
  assert.equal(parseLooseDate("", 2026), null);
  assert.equal(parseLooseDate("เร็ว ๆ นี้", 2026), null);
});
