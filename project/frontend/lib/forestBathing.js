// Forest Bathing locations + รอบทริปของแต่ละที่
//
// แต่ละรอบเป็น "ทริป" ที่มีวันเริ่ม–วันจบ (ทริปวันเดียวก็ใส่ start = end)
// เช่น Chet Kot เป็นทริป 2 วัน 1 คืน → { start: "2026-09-05", end: "2026-09-06" }
// กดเลือกวันไหนในทริปก็ได้ ระบบจะเลือกทั้งทริปให้
//
// ชื่อสถานที่/จังหวัด/คำบรรยายอยู่ใน messages/{en,th}.json ที่ forestBathing.locations.items.<id>
//
// TODO: ราคา/รายละเอียดรอบ รอข้อมูลจริง

// MOCK: ยังไม่มีรูปตัวอย่างจริง — วนรูปที่มีอยู่ให้ครบ 30 ช่องไว้ทดสอบป้ายนับรูปกับแกลเลอรี
// พอได้รูปจริงแล้วเปลี่ยน gallery ของแต่ละสถานที่เป็น array ของ path รูปจริงได้เลย
const MOCK_GALLERY = Array.from(
  { length: 30 },
  (_, i) =>
    [
      "/forestBathing/DSC00448.jpg",
      "/forestBathing/DSC05971.jpg",
      "/forestBathing/DSC06169.jpg",
      "/forestBathing/DSC07451-2.jpg",
      "/forestBathing/DSC07655.jpg",
      "/forestBathing/ASP_VisualWalkAndRun-138.jpg",
    ][i % 6]
);

// รูปจริงของ Urban Forest Bathing ที่คุ้งบางกะเจ้า — ไฟล์อยู่ใน /public/forestBathing/Bangkajao
// เพิ่มรูปใหม่ = วางไฟล์ในโฟลเดอร์นั้นแล้วเติมชื่อไฟล์ที่นี่ ป้ายนับรูปกับแกลเลอรีอัปเดตตามเอง
const BANGKAJAO_GALLERY = [
  "DSC09611.jpg",
  "DSC09625.jpg",
  "DSC09643.jpg",
  "DSC09645.jpg",
  "DSC09709.jpg",
  "DSC09717.jpg",
  "DSC09736.jpg",
  "DSC09790.jpg",
].map((file) => `/forestBathing/Bangkajao/${file}`);

// รายละเอียดรายหัวข้อที่แถบไอคอนซ้ายใน modal จองใช้กระโดดไปหา (ตาม Figma)
// แถบจะโชว์ครบทุกหัวข้อเสมอ หัวข้อไหนไม่มีข้อมูลจะขึ้นข้อความ "กำลังจัดเตรียม" แทน
// จึงเติมทีละหัวข้อได้ โดยไม่ต้องแก้ component
//
// ตัวข้อความทั้งหมดอยู่ใน messages/{en,th}.json ที่
//   forestBathing.locations.items.<id>.sections = {
//     info:     [{ title, desc }],           // จุดเด่นของทริป (ต่อจาก blurb)
//     location: { address, gettingThere },
//               // gettingThere ใส่เป็นข้อความก้อนเดียว หรือเป็น
//               // [{ title, desc, steps: [...] }] เมื่อมีหลายทางเลือก
//     schedule: [{ day, items: [{ time, title }] }],
//     prepare:  ["สิ่งที่ต้องเตรียม", ...],
//     includes: ["สิ่งที่รวมในราคา", ...],
//     reviews:  [{ name, text }],
//   }
// เติมภาษาไหนก่อนก็ได้ ภาษาที่ยังไม่มีคำแปลจะขึ้น "กำลังจัดเตรียม" แทน
//
// ส่วน sections ในไฟล์นี้เหลือไว้เฉพาะค่าที่ไม่ใช่ข้อความ (ตอนนี้คือ location.mapUrl)
// จะได้ไม่ต้องเขียนลิงก์เดิมซ้ำในไฟล์ภาษาทั้งสอง
//
// หัวข้อ Photo ไม่ต้องใส่ที่นี่ — ดึงจาก gallery ของสถานที่นั้นเอง
//
// ผู้นำกิจกรรม — นิยามไว้ที่เดียว แล้วแต่ละสถานที่อ้างด้วย id ผ่านฟิลด์ instructors
// (คนเดียวไปนำหลายที่ได้ ไม่ต้องเขียนรูป/ชื่อซ้ำ) — แพตเทิร์นเดียวกับ LOCATIONS ↔ locations.items
//
// ที่นี่เก็บแค่รูป ส่วน "ชื่อ" กับ "ตำแหน่ง" อยู่ใน messages/{en,th}.json
// ที่ forestBathing.instructors.<id> = { name, role } เพราะเป็นข้อความที่ต้องแปล 2 ภาษา
//
// role ไม่ใส่ก็ได้ → ใช้คำกลางจาก forestBathing.sections.instructor ("Instructor" / "ผู้นำกิจกรรม")
// ใส่เมื่อไหร่ก็ทับเฉพาะคนนั้น เช่น "Forest Bathing Instructor" / "Program Management"
//
// photo ไม่ใส่ก็ได้ → ขึ้นวงกลมเทาไว้ก่อนตาม Figma
export const INSTRUCTORS = {
  khemupsorn: { photo: "/forestBathing/instructorCherry.jpg" },
  yanudchara: { photo: "/instructor-yanudhara.jpg" },
  roh: { photo: "/forestBathing/instructorROH.png" }, // TODO: ใส่โลโก้/รูป ROH — ระหว่างนี้ขึ้นวงกลมเทา
};

// posterRatio = สัดส่วนของรูปปกในป็อปอัพจอง (กว้าง / สูง)
// จำเป็นเพราะกล่องปกต้องรู้ความสูงตั้งแต่ก่อนรูปโหลดเสร็จ ถ้าไม่บอกไว้
// มันจะใช้ค่ากลาง 2.4 ไปก่อนแล้วค่อยกระตุกเปลี่ยนตอนรูปโหลดเสร็จ
// เห็นชัดมากตอนสลับภาษา เพราะคอมโพเนนต์ถูกสร้างใหม่ ค่าที่วัดไว้เลยหายไป
// ไม่ใส่ก็ได้ — จะกลับไปใช้พฤติกรรมเดิมคือวัดจากรูปตอนโหลด
//
// instructors: ["<id ใน INSTRUCTORS>", ...] — ใส่กี่คนก็ได้ เรียงตามที่อยากให้โชว์
// ไม่ใส่ / ใส่ array ว่าง = ไม่ขึ้นแถวผู้นำกิจกรรมเลย
export const LOCATIONS = [
  {
    id: "chet-kot",
    image: "/forestBathing/ASP_VisualWalkAndRun-138.jpg",
    posterImage: "/forestBathing/ROH-forest-to-soul-original.jpg", // โปสเตอร์แคมเปญที่โชว์ในป็อปอัพจอง (ต่างจาก image ที่ใช้บนการ์ด)
    posterRatio: 1920 / 800,
    campaignEyebrow: "Mission Earth x ROH",
    campaignTitle: "FOREST TO SOUL",
    isOpen: true,
    withRoh: true, // จัดร่วมกับ ROH → ขึ้นโลโก้ Mission Earth × ROH บนรูป
    trips: [{ start: "2026-09-05", end: "2026-09-06", price: 16200 }], // ราคาต่อท่าน (บาท)
    registerUrl: "https://web.facebook.com/share/p/17dKwTMgNW/", // TODO: ใส่ลิงก์รับสมัครจริง (เช่น Google Form) ของ Chet Kot
    gallery: MOCK_GALLERY, // MOCK: รอรูปตัวอย่างจริง
    instructors: ["roh", "khemupsorn"],
    // TODO: รอเนื้อหาจริงจากทีม — ใส่ตามรูปแบบที่คอมเมนต์ไว้บน LOCATIONS
    // ระหว่างนี้แต่ละหัวข้อจะขึ้น "กำลังจัดเตรียมรายละเอียด" ใน modal
  },

  {
    id: "urban-bangkok",
    image: "/forestBathing/shinrin-yogu1st-1.png",
    posterImage: "/forestBathing/shinrin-yogu-ggf-banner.png", // ปกในป็อปอัพจอง (การ์ดยังใช้ image ตัวบน)
    posterRatio: 2400 / 755,
    isOpen: true,
    // fullPrice = ราคาเต็มก่อนลด ใส่เมื่อไหร่ราคานั้นจะขึ้นขีดฆ่าคู่กับ % ที่ลด
    // ให้อัตโนมัติ (% คำนวณสดจากสองตัวเลขนี้ ไม่ต้องกรอกเอง) ทริปไหนไม่ลดราคา
    // ก็ไม่ต้องใส่ จะโชว์ราคาเดียวเหมือนเดิม
    trips: [{ start: "2026-08-30", end: "2026-08-30", hours: 2, fullPrice: 1590, price: 990 }], // 08.00–10.00 น.
    registerUrl: "https://docs.google.com/forms/d/e/1FAIpQLSfK2ur5n-kLubB92sQdtvAUjgmrbrdbKL24H4BvEeJ0WWY_UQ/viewform?usp=publish-editor", // TODO: ใส่ลิงก์รับสมัครจริง (เช่น Google Form) ของ Urban Forest Bathing
    gallery: BANGKAJAO_GALLERY,
    instructors: ["yanudchara"],
    // ข้อความทุกหัวข้ออยู่ใน messages/{en,th}.json (ดูหมายเหตุบน LOCATIONS) เหลือที่นี่แค่ลิงก์แผนที่
    sections: { location: { mapUrl: "https://maps.google.com/?q=Bang+Krachao" } },
  },

  {
    id: "doi-tung",
    image: "/forestBathing/DSC07655-2.jpg",
    posterRatio: 2048 / 1365, // ไม่มี posterImage จึงใช้ image ตัวเดียวกันเป็นปก
    isOpen: false,
    withRoh: true,
    trips: [],
  },
];

const addDays = (iso, n) => {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + n));
  return dt.toISOString().slice(0, 10);
};

/** ทุกวันในทริป (รวมวันเริ่มและวันจบ) */
export function tripDates(trip) {
  const out = [];
  for (let d = trip.start; d <= trip.end; d = addDays(d, 1)) out.push(d);
  return out;
}

/** จำนวนวัน / คืน ของทริป */
export function tripLength(trip) {
  const days = tripDates(trip).length;
  return { days, nights: Math.max(0, days - 1) };
}

/** ทุกวันที่มีกิจกรรมของสถานที่หนึ่ง */
export const locationDates = (location) => location.trips.flatMap(tripDates);

/** ทุกวันที่มีกิจกรรม จากทุกสถานที่ — เผื่อใช้กับปฏิทินรวม */
export const allSessionDates = () => LOCATIONS.flatMap(locationDates);

/** ทุกวันที่มีกิจกรรม จากสถานที่ที่เปิดจองแล้วเท่านั้น
 *  ใช้โชว์เป็น event date ในปฏิทินของ modal จองเดียว ให้ข้ามไปเลือกทริปของสถานที่อื่นได้เลย */
export const openLocationDates = () =>
  LOCATIONS.filter((l) => l.isOpen).flatMap(locationDates);

/** ทริปที่ครอบวันนี้ (ใช้ตอนกดวันในปฏิทิน) */
export const tripForDate = (location, iso) =>
  location.trips.find((t) => iso >= t.start && iso <= t.end) ?? null;

/** หาว่าวันนี้เป็นทริปของสถานที่ไหน — ค้นข้ามทุกสถานที่ (ใช้ตอนปฏิทินเดียวโชว์ทุกทริป) */
export function tripAndLocationForDate(iso) {
  for (const location of LOCATIONS) {
    const trip = tripForDate(location, iso);
    if (trip) return { location, trip };
  }
  return null;
}

/** ทริปถัดไปที่ยังไม่จบ — null ถ้าไม่มี */
export function nextTrip(location, today = new Date()) {
  const todayIso = today.toISOString().slice(0, 10);
  return (
    location.trips
      .filter((t) => t.end >= todayIso)
      .sort((a, b) => a.start.localeCompare(b.start))[0] ?? null
  );
}

const TH_MONTHS = [
  "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
  "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค.",
];
const EN_MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const parts = (iso) => iso.split("-").map(Number);

/** "2026-09-05" -> "5 ก.ย. 2026" / "5 Sep 2026" */
export function formatDate(iso, lang = "th") {
  const [y, m, d] = parts(iso);
  const months = lang === "en" ? EN_MONTHS : TH_MONTHS;
  return `${d} ${months[m - 1]} ${y}`;
}

/** ช่วงวันของทริป — ย่อเดือน/ปีที่ซ้ำกันออก
 *  วันเดียว      -> "5 ก.ย. 2026"
 *  เดือนเดียวกัน -> "5–6 ก.ย. 2026"
 *  ข้ามเดือน     -> "30 ก.ย. – 1 ต.ค. 2026"  */
export function formatTrip(trip, lang = "th") {
  if (trip.start === trip.end) return formatDate(trip.start, lang);

  const [ys, ms, ds] = parts(trip.start);
  const [ye, me, de] = parts(trip.end);
  const months = lang === "en" ? EN_MONTHS : TH_MONTHS;

  if (ys === ye && ms === me) return `${ds}–${de} ${months[ms - 1]} ${ys}`;
  if (ys === ye) return `${ds} ${months[ms - 1]} – ${de} ${months[me - 1]} ${ys}`;
  return `${formatDate(trip.start, lang)} – ${formatDate(trip.end, lang)}`;
}
