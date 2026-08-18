/*
 * แปลง public/THmap/TH-MAP.svg -> components/credential/thMapPaths.js
 *
 * ดึงเฉพาะ path d ของแต่ละจังหวัด ทิ้ง fill/stroke ที่ Figma ฝังมา
 * แล้วปัดทศนิยมเหลือ 2 ตำแหน่งเพื่อลดขนาดไฟล์
 */
const fs = require("fs");

const SRC = "public/THmap/TH-MAP.svg";
const OUT = "components/credential/thMapPaths.js";

const svg = fs.readFileSync(SRC, "utf8");

const viewBox = svg.match(/viewBox="([^"]+)"/)[1];

// ปัดทศนิยม: 101.857 -> 101.9 (viewBox แค่ 381x703 ทศนิยม 1 ตำแหน่ง = 0.1px ตาไม่เห็น)
const round = (d) =>
  d
    .replace(/-?\d+\.\d+/g, (n) => String(Math.round(parseFloat(n) * 10) / 10))
    .replace(/\s+/g, " ")
    .trim();

// เดินหา element ที่มี id="TH-xx" แล้วเก็บ d ของตัวมันเองหรือของลูกทุกตัว
const provinces = {};
const re = /<(path|g)\b([^>]*?)id="(TH-\d+)"([^>]*?)(\/?)>/g;
let m;

while ((m = re.exec(svg))) {
  const [, tag, pre, id, post, selfClose] = m;

  if (tag === "path") {
    const d = (pre + post).match(/\bd="([^"]+)"/);
    if (d) provinces[id] = [round(d[1])];
    continue;
  }

  // <g> — เก็บ d ของ path ลูกทั้งหมดจนกว่าจะปิด g (ไม่มี g ซ้อน g ในไฟล์นี้)
  const rest = svg.slice(re.lastIndex);
  const inner = rest.slice(0, rest.indexOf("</g>"));
  const ds = [...inner.matchAll(/\bd="([^"]+)"/g)].map((x) => round(x[1]));
  if (ds.length) provinces[id] = ds;
}

/*
 * กรอบสี่เหลี่ยมที่ล้อมจังหวัด — แผนที่เอาไปใช้สองอย่าง: หาจุดกึ่งกลางไว้วาง
 * หมุด และดูว่าจังหวัดนั้นเล็กเกินกว่าจะมองเห็นไหม (กรุงเทพ นนทบุรี สมุทรปราการ
 * เล็กจนหายไปเลยบนแผนที่ที่ย่อลงมาอยู่ในสไลด์)
 *
 * คำนวณตอน gen ไม่ใช่ตอนรัน เพราะไฟล์ path รวมกันครึ่งเมกะไบต์ ถ้าไปแกะใน
 * เบราว์เซอร์จะกินเวลาตอนหน้าโหลดฟรีๆ ทั้งที่ค่ามันคงที่
 *
 * ไฟล์นี้ใช้แค่ M L C V H Z และเป็นพิกัดสัมบูรณ์ทั้งหมด (ตัวพิมพ์ใหญ่)
 * ของโค้ง C เก็บแค่จุดปลาย ไม่เอาจุดควบคุม กรอบจะได้ไม่บวมเกินรูปจริง
 */
const boundsOf = (ds) => {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

  for (const d of ds) {
    const tokens = d.match(/[MLCVHZ]|-?\d*\.?\d+/g) ?? [];
    let x = 0, y = 0, cmd = null, i = 0;

    while (i < tokens.length) {
      if (/[A-Z]/.test(tokens[i])) {
        cmd = tokens[i++];
        continue;
      }
      if (cmd === "C") i += 4; // ข้ามจุดควบคุมสองจุด เหลือไว้แต่จุดปลาย
      if (cmd === "H") x = parseFloat(tokens[i++]);
      else if (cmd === "V") y = parseFloat(tokens[i++]);
      else {
        x = parseFloat(tokens[i++]);
        y = parseFloat(tokens[i++]);
      }

      minX = Math.min(minX, x); maxX = Math.max(maxX, x);
      minY = Math.min(minY, y); maxY = Math.max(maxY, y);
    }
  }

  const r1 = (n) => Math.round(n * 10) / 10;
  return {
    cx: r1((minX + maxX) / 2),
    cy: r1((minY + maxY) / 2),
    w: r1(maxX - minX),
    h: r1(maxY - minY),
  };
};

const codes = Object.keys(provinces).sort();
const shapes = codes.reduce((n, c) => n + provinces[c].length, 0);
const bounds = Object.fromEntries(codes.map((c) => [c, boundsOf(provinces[c])]));

const body = codes
  .map((c) => `  "${c}": [\n${provinces[c].map((d) => `    "${d}",`).join("\n")}\n  ],`)
  .join("\n");

fs.writeFileSync(
  OUT,
  `/**
 * รูปร่างของ 77 จังหวัด สร้างจาก public/THmap/TH-MAP.svg
 *
 * อย่าแก้ไฟล์นี้ด้วยมือ — ถ้า export แผนที่จาก Figma ใหม่ ให้สร้างใหม่ทั้งไฟล์
 * (ดูวิธีในคอมเมนต์หัวไฟล์ ThailandMap.js)
 *
 * key คือรหัส ISO 3166-2:TH ตรงกับ lib/thaiProvinces.js
 * value คือ path d — ส่วนใหญ่ชิ้นเดียว จังหวัดที่มีเกาะจะหลายชิ้น
 * ไม่มี fill/stroke ติดมา สีคุมจาก CSS ทั้งหมด
 */

export const TH_MAP_VIEWBOX = "${viewBox}";

export const TH_MAP_PATHS = {
${body}
};

/**
 * กรอบสี่เหลี่ยมของแต่ละจังหวัดในพิกัด viewBox เดียวกับ path ด้านบน
 * cx/cy คือจุดกึ่งกลางกรอบ (ไว้วางหมุด) w/h คือความกว้างสูง (ไว้ดูว่าเล็กไป)
 */
export const TH_MAP_BOUNDS = {
${codes
  .map((c) => {
    const b = bounds[c];
    return `  "${c}": { cx: ${b.cx}, cy: ${b.cy}, w: ${b.w}, h: ${b.h} },`;
  })
  .join("\n")}
};
`
);

console.log("จังหวัด:", codes.length, "| ชิ้นทั้งหมด:", shapes);
console.log(
  "ขนาด:",
  (fs.statSync(SRC).size / 1024).toFixed(0) + "KB ->",
  (fs.statSync(OUT).size / 1024).toFixed(0) + "KB"
);
const missing = codes.filter((c) => !provinces[c].length);
if (missing.length) console.log("!! ไม่มี path:", missing);
