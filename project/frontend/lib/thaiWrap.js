/* คุมจุดตัดบรรทัดของข้อความไทย — ใช้ผ่าน <ThaiText> ใน components/ThaiText.js
 *
 * ปัญหา: ภาษาไทยไม่มีช่องว่างระหว่างคำ เบราว์เซอร์เลยตัดตามพจนานุกรม ICU
 * ซึ่งตัดถี่ระดับ "คำ" ไม่ใช่ "วลี" ผลคือได้บรรทัดแบบ
 *   ...ความดันลด / ลง หลับสบายขึ้น
 *   ...การเดินช้าลงและเปิดใจ / รับ ผู้สูงอายุ...
 * คำสั้น ๆ ไปห้อยหัวบรรทัดคนเดียว อ่านแล้วสะดุด
 *
 * วิธีแก้: หั่นข้อความเป็นช่วง ๆ ตามขอบเขตคำของ ICU แล้วให้ทุกช่วงเป็น
 * white-space: nowrap เบราว์เซอร์จึงตัดได้เฉพาะ "ระหว่างช่วง" เท่านั้น
 *
 * หมายเหตุ: ตอนแรกลอง word-break: keep-all แล้วไม่ได้ผล เพราะสเปกระบุว่า
 * keep-all คุมเฉพาะอักษรคลาส CJK ส่วนอักษรไทยเป็นคลาส SA จึงไม่โดน
 *
 * ช่องว่างที่คนเขียนใส่มาเองยังเป็นจุดตัดเสมอ (คนไทยใช้เว้นวรรคคั่นวลีอยู่แล้ว)
 * ส่วนวลียาว ๆ ที่ไม่มีเว้นวรรคจะถูกหั่นทุก ๆ CHUNK ตัวอักษร เผื่อคอลัมน์แคบ
 */

// ยิ่งมากยิ่งตัดห่าง อ่านลื่นขึ้น แต่ขอบขวายิ่งเว้าแหว่ง
// 12 = พอให้คอลัมน์แคบสุดในหน้า (การ์ดประสาทสัมผัส 300px) ยังมีจุดตัดให้เลือก 2 จุดต่อบรรทัด
const CHUNK = 12;
// เพดานความยาวช่วง — กันการรวมเศษคำต่อกันไปเรื่อย ๆ จนได้ก้อนยาวที่ตัดไม่ได้
// ทำให้คอลัมน์แคบขึ้นบรรทัดใหม่เร็วเกินไปจนขอบขวาเว้าแหว่ง
const MAX_CHUNK = 18;
// สั้นกว่านี้ถือเป็นเศษคำ ไม่ควรปล่อยให้ห้อยหัว/ท้ายบรรทัดคนเดียว
const MIN_CHUNK = 6;

// สระบน/ล่างกับวรรณยุกต์ลอยอยู่บนตัวอักษรอื่น ไม่กินความกว้าง จึงไม่นับ
const COMBINING = /[ัิ-ฺ็-๎]/;
const HAS_THAI = /[฀-๿]/;

// เครื่องหมายที่ห้ามขึ้นต้นบรรทัด ต้องห้อยท้ายคำก่อนหน้าเสมอ แม้จะมีเว้นวรรคคั่น
// ๆ (ไม้ยมก) ฯ (ไปยาลน้อย) และขีดยาวที่ใช้คั่นความ
const TRAILING_MARK = /^[ๆฯ—–]+$/;

const baseLength = (text) => {
  let n = 0;
  for (const char of text) if (!COMBINING.test(char)) n += 1;
  return n;
};

let segmenter = null;
let segmenterReady = false;

const getSegmenter = () => {
  if (!segmenterReady) {
    segmenterReady = true;
    // Intl.Segmenter มีทั้งใน Node และเบราว์เซอร์ยุคนี้ ถ้าไม่มีก็ถือว่าไม่ต้องหั่น
    if (typeof Intl !== "undefined" && Intl.Segmenter) {
      segmenter = new Intl.Segmenter("th", { granularity: "word" });
    }
  }
  return segmenter;
};

/** หั่นข้อความไทยเป็นช่วงที่ห้ามตัดกลาง
 *  คืน null ถ้าไม่ต้องทำอะไร (ไม่มีอักษรไทย / ไม่มี Intl.Segmenter)
 *  คืน [{ text, nowrap }] เมื่อหั่นแล้ว — nowrap:false คือช่องว่างที่ตัดบรรทัดได้ */
export function thaiChunks(text) {
  if (typeof text !== "string" || !HAS_THAI.test(text)) return null;

  const seg = getSegmenter();
  if (!seg) return null;

  const parts = [];
  let run = "";
  let runLength = 0;

  const flush = () => {
    if (run) parts.push({ text: run, nowrap: true });
    run = "";
    runLength = 0;
  };

  for (const { segment } of seg.segment(text)) {
    // ช่องว่าง/ขึ้นบรรทัดใหม่เป็นจุดตัดอยู่แล้ว ปล่อยไว้นอกช่วง
    if (!/\S/.test(segment)) {
      flush();
      parts.push({ text: segment, nowrap: false });
      continue;
    }

    const length = baseLength(segment);
    if (runLength > 0 && runLength + length > CHUNK) flush();

    run += segment;
    runLength += length;
  }
  flush();

  // เศษท้ายวรรคที่สั้นจู๋จะไปห้อยหัว/ท้ายบรรทัดคนเดียว รวมกลับเข้าช่วงข้าง ๆ ที่อยู่วรรคเดียวกัน
  // (ไล่จากหลังมาหน้า เพราะ splice ทำให้ index ข้างหลังขยับ)
  const merge = (at, count, text) => parts.splice(at, count, { text, nowrap: true });
  const fits = (...texts) => baseLength(texts.join("")) <= MAX_CHUNK;

  for (let i = parts.length - 1; i >= 0; i--) {
    if (!parts[i].nowrap || baseLength(parts[i].text) >= MIN_CHUNK) continue;

    const before = parts[i - 1];
    const after = parts[i + 1];
    if (before?.nowrap && fits(before.text, parts[i].text)) {
      merge(i - 1, 2, before.text + parts[i].text);
    } else if (after?.nowrap && fits(parts[i].text, after.text)) {
      merge(i, 2, parts[i].text + after.text);
    }
  }

  // "ช้า ๆ" ถูกเว้นวรรคคั่น ไม้ยมกเลยกลายเป็นช่วงของตัวเองแล้วไปโผล่หัวบรรทัด
  // ดึงกลับมาไว้ในช่วงเดียวกับคำก่อนหน้า โดยเอาเว้นวรรคเข้ามาด้วย
  // (ข้ามขึ้นบรรทัดใหม่ เพราะ nowrap จะยุบ \n ให้กลายเป็นเว้นวรรคธรรมดา)
  for (let i = parts.length - 1; i >= 2; i--) {
    const [word, gap, mark] = [parts[i - 2], parts[i - 1], parts[i]];
    if (!mark.nowrap || !TRAILING_MARK.test(mark.text)) continue;
    if (gap.nowrap || gap.text !== " " || !word.nowrap) continue;
    // ไม้ยมกต้องติดคำหน้าเสมอ แม้จะทำให้ช่วงยาวเกินเพดานไปหน่อยก็ยอม
    merge(i - 2, 3, word.text + gap.text + mark.text);
  }

  return parts;
}
