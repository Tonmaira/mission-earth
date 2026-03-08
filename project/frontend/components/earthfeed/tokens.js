// ── Data & Constants (ไม่มี color objects แล้ว — ย้ายไป Tailwind config)

export const MONTHS = [
  "JANUARY","FEBRUARY","MARCH","APRIL","MAY","JUNE",
  "JULY","AUGUST","SEPTEMBER","OCTOBER","NOVEMBER","DECEMBER",
];

export const DAYS = ["S","M","T","W","T","F","S"];

// Mock data — จะถูกแทนที่ด้วย API
export const ACTIVITY_CARDS = [
  { id:1, title:"ESG Course",      desc:"Description......",            tags:["Take a Quiz","Recap","Register Now"] },
  { id:2, title:"Forest Bathing",  desc:"Reconnect with nature.",       tags:["Register Now","Learn More"]          },
  { id:3, title:"Boardgame 101",   desc:"Sustainability through play.", tags:["Register Now"]                       },
];

export const FEED_ITEMS = [
  { id:1, cat:"ME Update", date:"Mar 7, 2025", title:"Forest Bathing in City",  sub:"with 6 senses",               bg:"#1a3a2a" },
  { id:2, cat:"ME Update", date:"Mar 7, 2025", title:"ROHxME Forest Bathing",   sub:"14-15 Feb, 2026 at Doi Tung",  bg:"#1a2a3a" },
  { id:3, cat:"ME Update", date:"Mar 7, 2025", title:"ROHxME MOU",              sub:"for Sustainable Tourism",     bg:"#2a1a1a" },
  { id:4, cat:"ME Update", date:"Mar 7, 2025", title:"BKK Design Week 2026",    sub:"Alive sustainable Planet",    bg:"#2a2a1a" },
  { id:5, cat:"ME Update", date:"Mar 7, 2025", title:"BMAxAFDxME",              sub:"Alive sustainable Planet",    bg:"#1a1a2a" },
];