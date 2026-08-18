/**
 * ⚠️ ข้อมูลสมมติทั้งไฟล์ — ใส่ไว้ให้หน้า SUMMARY กับแผนที่ FOOTPRINT มีของครบ
 * ก่อน CSV ตัวจริงจะมาถึง ตัวเลขทุกตัวที่นี่ "แต่งขึ้น" ห้ามเอาไปอ้างที่อื่น
 *
 * วิธีลบทิ้งตอนของจริงมา:
 *   1. ลบไฟล์นี้
 *   2. ใน works.js ลบ import แล้วเปลี่ยนบรรทัดสุดท้ายเป็น
 *      `export const WORKS = SHEET_WORKS;`
 *
 * key ของ object = slug ใน works.js ค่าที่ใส่จะไป spread ทับฟิลด์ของงานนั้น
 * ความหมายของแต่ละคอลัมน์อธิบายไว้ใน works.js ท้ายไฟล์
 *
 * จังหวัดที่สุ่มมา 20 จังหวัด (รหัส ISO 3166-2:TH ตาม lib/thaiProvinces.js)
 * กระจายทุกภาค และงานไหนที่ชีตบอกพื้นที่ไว้ชัดอยู่แล้ว (น่าน ระยอง เชียงใหม่
 * กรุงเทพ สระบุรี) ก็ใส่ให้ตรงตามนั้น ที่เหลือสุ่มล้วน
 */

export const MOCK_WORK_DATA = {
  "scg-prayotsuk": {
    provinces: [
      "TH-50", "TH-57", "TH-58", "TH-65", "TH-63",
      "TH-40", "TH-30", "TH-34", "TH-47", "TH-19",
      "TH-71", "TH-77",
    ],
    reach: 1_850_000,
    engagement: 4_200,
    changeMakers: 310,
    toLocalHands: 4_800_000,
    outputs: 21,
    conceptProposals: 34,
  },
  "dek-sang-nan-1": {
    provinces: ["TH-55"],
    reach: 420_000,
    engagement: 860,
    changeMakers: 120,
    toLocalHands: 650_000,
    outputs: 6,
    conceptProposals: 12,
  },
  "green-mission": {
    provinces: ["TH-10", "TH-50", "TH-40", "TH-90", "TH-21"],
    reach: 2_600_000,
    engagement: 3_150,
    changeMakers: 240,
    toLocalHands: 1_200_000,
    outputs: 9,
    conceptProposals: 48,
  },
  "water-workshop": {
    provinces: ["TH-21"],
    reach: 180_000,
    engagement: 420,
    changeMakers: 65,
    toLocalHands: 380_000,
    outputs: 4,
    conceptProposals: 15,
  },
  "forest-bathing": {
    provinces: ["TH-50", "TH-58"],
    reach: 760_000,
    engagement: 340,
    changeMakers: 28,
    toLocalHands: 920_000,
    outputs: 3,
  },
  "bkkcaw-2025": {
    provinces: ["TH-10"],
    reach: 540_000,
    engagement: 1_100,
    changeMakers: 45,
    outputs: 2,
  },
  "alive-sustainable-board-game-workshop": {
    provinces: ["TH-10"],
    reach: 310_000,
    engagement: 680,
    changeMakers: 32,
    outputs: 2,
  },
  "designing-the-future-we-want-to-live-in": {
    provinces: ["TH-50"],
    reach: 95_000,
    engagement: 260,
    changeMakers: 18,
    outputs: 1,
  },
  "ความหลากหลายทางชีวภาพและคุณภาพชีวิต": {
    provinces: ["TH-10"],
    reach: 140_000,
    engagement: 320,
    changeMakers: 40,
    outputs: 2,
  },
  "ent-2026": {
    provinces: ["TH-10"],
    reach: 88_000,
    engagement: 210,
    changeMakers: 15,
    outputs: 1,
  },
  "15th-cpa-tutor-2025": {
    provinces: ["TH-21", "TH-22"],
    reach: 260_000,
    engagement: 1_450,
    changeMakers: 95,
    toLocalHands: 540_000,
    outputs: 3,
  },
  "trip-for-earth": {
    provinces: ["TH-84", "TH-81", "TH-86", "TH-77"],
    reach: 1_100_000,
    engagement: 980,
    changeMakers: 140,
    toLocalHands: 2_300_000,
    outputs: 7,
    conceptProposals: 22,
  },
  "alive-sustainable-planet-1st-edition": {
    reach: 430_000,
    engagement: 2_600,
    changeMakers: 55,
    outputs: 1,
    boardGames: 1,
  },
  "pttep-bif": {
    provinces: ["TH-90", "TH-84"],
    reach: 210_000,
    engagement: 380,
    changeMakers: 22,
    outputs: 1,
  },
  biocourse: {
    provinces: ["TH-55", "TH-19"],
    reach: 165_000,
    engagement: 540,
    changeMakers: 88,
    toLocalHands: 760_000,
    outputs: 5,
    conceptProposals: 18,
  },
  "pathways-to-a-sustainable-urban-future": {
    provinces: ["TH-10"],
    reach: 380_000,
    engagement: 450,
    changeMakers: 20,
    outputs: 1,
  },
  "green-mission-1-press-conference": {
    provinces: ["TH-10"],
    reach: 620_000,
    engagement: 720,
    changeMakers: 60,
    outputs: 2,
  },
  "transition-in-action": {
    provinces: ["TH-10"],
    reach: 290_000,
    engagement: 340,
    changeMakers: 12,
    outputs: 1,
  },
  "biogang-challenge-2024": {
    provinces: ["TH-10"],
    reach: 350_000,
    engagement: 1_250,
    changeMakers: 110,
    toLocalHands: 420_000,
    outputs: 4,
    conceptProposals: 26,
  },
  "โครงการการจัดการไฟป่า-ลดปัญหาหมอกควัน": {
    provinces: ["TH-50", "TH-63"],
    reach: 480_000,
    engagement: 1_600,
    changeMakers: 150,
    toLocalHands: 1_150_000,
    outputs: 6,
    conceptProposals: 14,
  },
  "คู่มือการป้องกันการเผาในที่โล่ง": {
    provinces: ["TH-50"],
    reach: 220_000,
    engagement: 260,
    outputs: 2,
  },
  "dcce-stop-the-climate-crisis-together": {
    provinces: ["TH-10", "TH-30"],
    reach: 510_000,
    engagement: 890,
    changeMakers: 48,
    outputs: 3,
  },
  "carbon-neutral-in-daily-life": {
    reach: 340_000,
    engagement: 1_900,
    changeMakers: 35,
    outputs: 1,
    boardGames: 1,
  },
};
