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

// รายละเอียดรายหัวข้อที่แถบไอคอนซ้ายใน modal จองใช้กระโดดไปหา (ตาม Figma)
// แถบจะโชว์ครบทุกหัวข้อเสมอ หัวข้อไหนไม่มีข้อมูลจะขึ้นข้อความ "กำลังจัดเตรียม" แทน
// จึงเติมทีละหัวข้อได้ โดยไม่ต้องแก้ component
//
//   sections: {
//     info:     [{ title, desc }],           // จุดเด่นของทริป (ต่อจาก blurb)
//     location: { address, gettingThere, mapUrl },
//     schedule: [{ day, items: [{ time, title }] }],
//     prepare:  ["สิ่งที่ต้องเตรียม", ...],
//     includes: ["สิ่งที่รวมในราคา", ...],
//     reviews:  [{ name, text }],
//   }
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

// instructors: ["<id ใน INSTRUCTORS>", ...] — ใส่กี่คนก็ได้ เรียงตามที่อยากให้โชว์
// ไม่ใส่ / ใส่ array ว่าง = ไม่ขึ้นแถวผู้นำกิจกรรมเลย
export const LOCATIONS = [
  {
    id: "chet-kot",
    image: "/forestBathing/ASP_VisualWalkAndRun-138.jpg",
    posterImage: "/forestBathing/ROH-forest-to-soul-original.jpg", // โปสเตอร์แคมเปญที่โชว์ในป็อปอัพจอง (ต่างจาก image ที่ใช้บนการ์ด)
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
    sections: {},
  },

  {
    id: "urban-bangkok",
    image: "/forestBathing/shinrin-yogu1st-1.png",
    posterImage: "/forestBathing/shinrin-yogu-ggf-banner.png", // ปกในป็อปอัพจอง (การ์ดยังใช้ image ตัวบน)
    isOpen: true,
    trips: [{ start: "2026-08-23", end: "2026-08-23", hours: 2, price: 1890 }], // 08.00–10.00 น.
    registerUrl: "https://docs.google.com/forms/d/e/1FAIpQLSdj7gaknaf_qGhjN3kmcOIrLF2O1eYDAVCxOkPilc6A93o19g/viewform?usp=publish-editor", // TODO: ใส่ลิงก์รับสมัครจริง (เช่น Google Form) ของ Urban Forest Bathing
    gallery: MOCK_GALLERY, // MOCK: รอรูปตัวอย่างจริง
    instructors: ["yanudchara"],
    // MOCK: ข้อมูลจำลองไว้ทดสอบ scroll + แถบไอคอนซ้ายของ modal — ลบ/แก้เป็นของจริงทีหลัง
    sections: {
      info: [
        {
          title: "Guided Breathwork",
          desc: "Start with slow, guided breathing to settle the mind before entering the forest trail.",
        },
        {
          title: "Sensory Walk",
          desc: "A slow walk through Bang Krachao's green canopy, engaging all five senses along the way.",
        },
        {
          title: "Tea Ceremony",
          desc: "Close the session with a quiet tea ceremony under the trees, reflecting on the morning.",
        },
        {
          title: "Who it's for",
          desc: "No fitness level required. The whole route is flat and slow-paced, suitable for children from age 10 and for anyone new to forest bathing. Come alone or bring someone — most people arrive on their own and leave having shared something with the group.",
        },
        {
          title: "What you'll take home",
          desc: "A simple set of practices you can repeat in any green space near you: how to slow your pace deliberately, how to notice what your senses pick up, and how to let a short walk actually reset your attention rather than just move your body.",
        },
      ],
      location: {
        address: "Bang Krachao pier, Phra Pradaeng, Samut Prakarn",
        gettingThere:
          "Bang Krachao sits directly across the river from Khlong Toei. From BTS Bang Na take a taxi to Wat Klong Phra Udom pier (about 20 minutes), then the cross-river boat runs every few minutes. If you drive, park at the pier — parking is free and the boat takes you and your bicycle across.",
        mapUrl: "https://maps.google.com/?q=Bang+Krachao",
      },
      schedule: [
        {
          day: "Sunday morning",
          items: [
            { time: "08.00", title: "Meet at the pier, cross the river together" },
            { time: "08.20", title: "Guided breathwork and opening circle" },
            { time: "08.45", title: "Sensory walk through the canopy" },
            { time: "09.30", title: "Tea ceremony under the trees" },
            { time: "10.00", title: "Closing circle, head back" },
          ],
        },
      ],
      prepare: [
        "Comfortable walking shoes",
        "Insect repellent",
        "A reusable water bottle",
        "A light rain jacket — the session runs rain or shine",
      ],
      includes: [
        "A certified forest bathing facilitator for the whole session",
        "Cross-river boat fare",
        "Tea ceremony and light refreshments",
        "Group size limited to 20 people",
        "Full refund if you cancel at least 7 days ahead",
      ],
      reviews: [
        {
          name: "Ploy S.",
          text: "I expected a walk and got something closer to a reset. Two hours felt longer than they were, in a good way.",
        },
        {
          name: "Nathan K.",
          text: "The facilitator never rushed anyone. First time I have noticed how many different sounds there are in one place.",
        },
      ],
    },
  },

  {
    id: "doi-tung",
    image: "/forestBathing/DSC07655-2.jpg",
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
