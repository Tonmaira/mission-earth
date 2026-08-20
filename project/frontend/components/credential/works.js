/**
 * Every Mission Earth work, for the deck's index slide and the pages behind it.
 *
 * Generated from the "every-work" sheet; hand-editing is fine. `caseId` is the
 * only link back to caseStudies.js — it marks the six the deck also tells in
 * full as slides. Every work, those six included, gets its own public page at
 * /portfolio/work/<slug>; the deck itself stays unlisted.
 *
 * `subType` is carried but not shown: it is there for filtering later.
 *
 * `provinces` และตัวเลขผลลัพธ์มาจากคอลัมน์ location กับ stats_* ในชีตแล้ว
 * (ก่อนหน้านี้เป็น mock ใน mockWorkData.js ซึ่งเลิกใช้แล้ว ลบไฟล์นั้นทิ้งได้)
 *
 * `image` and `description` have no column in the sheet — they are the two
 * things the /portfolio row layout wants. Blank for now: the row falls back to
 * a placeholder panel and simply omits the description. Paste a path from
 * /public into `image` as the photographs arrive.
 */

const SHEET_WORKS = [
  {
    slug: "scg-prayotsuk",
    title: "ประโยชน์สุข",
    quote: "เอสซีจีร่วมสร้างชุมชนยั่งยืน",
    client: "SCG",
    target: "ชุมชนจาก 22 จังหวัด",
    type: "COURSE",
    timeline: "ม.ค. - พ.ย. 2568 (11 เดือน)",
    image: "",
    description: "",
    year: 2025,
    caseId: "scg-prayotsuk",
    provinces: [
      "TH-41", "TH-38", "TH-36", "TH-71", "TH-80",
      "TH-92", "TH-19", "TH-25", "TH-16", "TH-14",
      "TH-60", "TH-57", "TH-51", "TH-18", "TH-61",
      "TH-54", "TH-50", "TH-55", "TH-52", "TH-40",
      "TH-21", "TH-20",
    ],
    reach: 1_200_000,
    engagement: 300,
    changeMakers: 40,
  },
  {
    slug: "dek-sang-nan-1",
    title: "เด็กสร้างน่าน ปีที่ 1",
    quote: "กิจกรรมฟื้นฟูป่าต้นน้ำ",
    client: "ศูนย์พันธกิจเพื่อสังคม\nจุฬาลงกรณ์มหาวิทยาลัย และ โครงการรักษ์ป่าน่านตามพระราชดำริ",
    target: "เยาวชน จ.น่าน",
    type: "CAMP",
    subType: "ค่ายวิชาการด้านสิ่งแวดล้อม",
    timeline: "เม.ย. - ก.ย. 2568 (6 เดือน)",
    image: "",
    description: "",
    year: 2025,
    caseId: "dek-sang-nan-1",
    provinces: ["TH-55"],
    reach: 80_000,
    engagement: 500,
    outputs: 10,
  },
  {
    slug: "green-mission",
    title: "Green Mission",
    quote: "ก้าวต่อไปไร้รอยเท้า",
    client: "บริษัท กัลฟ์ ดีเวลลอปเมนท์ จำกัด (มหาชน)\nจุฬาลงกรณ์มหาวิทยาลัย",
    target: "เยาวชนทั่วประเทศ",
    type: "CAMP",
    subType: "ค่ายวิชาการด้านสิ่งแวดล้อม",
    timeline: "พ.ค. - ต.ค. 2567 (6 เดือน)",
    image: "",
    description: "",
    year: 2024,
    caseId: "green-mission",
    provinces: [
      "TH-19",
    ],
    reach: 500_000,
    engagement: 2_000,
    outputs: 20,
  },
  {
    slug: "water-workshop",
    title: "Workshop: การจัดการน้ำ",
    quote: "พัฒนาศักยภาพผู้นำการเปลี่ยนแปลงด้านน้ำ",
    client: "สำนักงานทรัพยากรน้ำแห่งชาติ\nจุฬาลงกรณ์มหาวิทยาลัย",
    target: "อปท.ระยอง และหน่วยงานผู้ใช้น้ำ",
    type: "COURSE",
    subType: "Workshop",
    timeline: "ก.ค. - พ.ย. 2568 (5 เดือน)",
    image: "",
    description: "",
    year: 2025,
    caseId: "water-workshop",
    provinces: ["TH-21"],
    reach: 24_000,
    engagement: 200,
    outputs: 30,
    conceptProposals: 30,
  },
  {
    slug: "forest-bathing",
    title: "Forest Bathing",
    quote: "Awaken All Six Senses with Nature",
    client: "Royal Orchid Holidays (ROH)",
    target: "ประชาชนทั่วประเทศ",
    type: "SUSTAINABLE TOURISM",
    timeline: "ธ.ค. - ก.พ. 2568 - 2569 (3 เดือน)",
    image: "/project/20260214rohxmeforest bathing/IMG_7238-2.jpg",
    description: "Immersive forest bathing in collaboration with ROH, designed to awaken all six senses and reconnect with nature.",
    year: 2025,
    caseId: "forest-bathing",
    dateLabel: "14-15 February, 2026",
    logos: [
      { label: "Partner", src: "/partner/ROH.png" },
    ],
    provinces: ["TH-57","TH-19"],
    reach: 500_000,
    engagement: 30,
    toLocalHands: 300_000,
  },
  {
    slug: "bkkcaw-2025",
    title: "BKKCAW Workshop 2025",
    quote: "Designing a Planet Full of Life",
    client: "Asia Plus Group Holdings\nCUD4S",
    target: "ประชาชนทั่วประเทศ",
    type: "EVENT",
    subType: "Talk",
    timeline: "พ.ค. - ก.ย. 2568 (5 เดือน)",
    image: "/project/20250927bkkcaw/CAW-poster-3.jpg",
    description: "Alive Sustainable Planet board game experience at Bangkok Climate Action Week, fostering climate action through play.",
    year: 2025,
    caseId: "bkkcaw-2025",
    dateLabel: "27-28 September, 2025",
    logos: [
      { label: "Sponsor", src: "/project/20250927bkkcaw/ASP@3x.png" },
      { label: "Collab", src: "/project/20250927bkkcaw/ARCH cu@3x.png" },
    ],
    provinces: ["TH-10"],
    reach: 700_000,
    engagement: 200,
    outputs: 1,
    boardGames: 1,
  },
  {
    slug: "alive-sustainable-board-game-workshop",
    title: "Alive Sustainable Board Game Workshop",
    quote: "Bangkok Design Week 2026",
    target: "ประชาชนทั่วไป",
    type: "COURSE",
    subType: "Workshop",
    timeline: "30-31 Jan, 6-8 Feb 2026",
    image: "/project/20260130bkkdw/2026-1-21-ASP-BKKDW2026_3.jpg",
    description: "An interactive learning experience using a board game, designing an ideal city that balances quality of life, environment, and economy.",
    year: 2026,
    dateLabel: "30-31 January, 2026\n6-7 February, 2026",
    logos: [
      { label: "Partner", src: "/project/20260130bkkdw/BKKDW.jpg" },
    ],
    provinces: ["TH-10"],
    reach: 60_000,
    engagement: 30,
  },
  {
    slug: "designing-the-future-we-want-to-live-in",
    title: "Designing the Future We Want to Live In",
    quote: "ออกแบบโลกด้วยมือเรา",
    client: "คณะสถาปัตยกรรมศาสตร์ \nมหาวิทยาลัยเชียงใหม่",
    target: "นักศึกษา อาจารย์ และบุคลากร มหาวิทยาลัยเชียงใหม่",
    type: "EVENT",
    subType: "Talk",
    timeline: "16-Jan-26",
    image: "/project/20260116cmutalk/DSC05737 copy.jpg",
    description: "A guest lecture on sustainable design and biodiversity, inspiring the next generation of architects.",
    year: 2026,
    dateLabel: "15 January, 2026",
    logos: [
      { label: "Host", src: "/project/20260116cmutalk/ARCH2024-A4-vio.png" },
    ],
    provinces: ["TH-50"],
    reach: 2_500,
    engagement: 200,
  },
  {
    slug: "ความหลากหลายทางชีวภาพและคุณภาพชีวิต",
    title: "ความหลากหลายทางชีวภาพและคุณภาพชีวิต",
    quote: "ผ่านการเล่นบอร์ดเกม ASP: Alive Sustainable Planet",
    client: "กรุงเทพมหานคร (BMA)",
    target: "เจ้าหน้าที่สังกัดกรุงเทพมหานคร",
    type: "COURSE",
    subType: "Workshop",
    timeline: "14-Jan-26",
    collaboration: "AFD",
    image: "/project/20260115bmaxmexafd/DSC05603.jpg",
    description: "Collaborative workshop on biodiversity and quality of life in partnership with BMA and AFD.",
    year: 2026,
    dateLabel: "16 January, 2026",
    logos: [
      { label: "To", src: "/project/20260115bmaxmexafd/BMA.png" },
      { label: "Collab", src: "/project/20260115bmaxmexafd/AFD.png" },
    ],
    provinces: ["TH-10"],
    reach: 1_500,
    engagement: 60,
  },
  {
    slug: "ent-2026",
    title: "ENT 2026",
    quote: "Community Engagement \nThrough Student Development Activities & Social Enterprise",
    client: "ENT 2026 by Chulalongkorn University",
    target: "ประชาชนทั่วไป",
    type: "EVENT",
    subType: "Talk",
    timeline: "15-Jan-26",
    image: "/project/20260114ent/ENT2026.jpg",
    description: "A talk on community engagement and social enterprise in the context of sustainability.",
    year: 2026,
    dateLabel: "14 January, 2026",
    logos: [
      { label: "To", src: "/project/20260114ent/CU@3x.png" },
    ],
    provinces: ["TH-10"],
    reach: 2_000,
    engagement: 100,
  },
  {
    slug: "15th-cpa-tutor-2025",
    title: "15th CPA Tutor 2025",
    quote: "เพื่อนชุมชนติวเตอร์ ครั้งที่ 15 ประจำปี 2568",
    client: "สมาคมเพื่อนชุมชน",
    target: "นักเรียนชั้นมัธยมปลาย จังหวัดระยอง",
    type: "EVENT",
    timeline: "2025",
    image: "/project/20251117cpatutor2025/2025 CPA Tutor.png",
    description: "Educational event for Smakom Puen Chumchon, helping high school students in Rayong prepare for university entrance exams.",
    year: 2025,
    dateLabel: "18-21 November, 2025",
    logos: [
      { label: "To", src: "/project/20251117cpatutor2025/CPA@3x.png" },
    ],
    provinces: ["TH-21"],
    reach: 65_000,
    engagement: 600,
  },
  {
    slug: "trip-for-earth",
    title: "TRIP for EARTH",
    quote: "TAT Academy Boot Camp 2025",
    client: "การท่องเที่ยวแห่งประเทศไทย (ททท.)",
    target: "ผู้มีความเกี่ยวข้องหรือสนใจในธุรกิจท่องเที่ยว",
    type: "COURSE",
    timeline: "2025",
    image: "/project/20250912tattripforearth/กระเป๋าผ้า-Trip-for-EARTH_print.png",
    description: "Sustainable tourism boot camp promoting responsible tourism marketing and environmental awareness.",
    year: 2025,
    dateLabel: "12-14 September, 2025",
    logos: [
      { label: "To", src: "/project/20250912tattripforearth/TAT@3x.png" },
    ],
    provinces: ["TH-75", "TH-73"],
    reach: 64_000,
    engagement: 30,
    toLocalHands: 200_000,
    outputs: 6,
  },
  {
    slug: "alive-sustainable-planet-1st-edition",
    title: "Alive Sustainable Planet 1st Edition",
    quote: "ASP Board game",
    target: "ประชาชนทั่วไป",
    type: "ESG TOOLS",
    subType: "Board Game",
    timeline: "2025",
    sponsor: "asiaplus",
    image: "",
    description: "",
    year: 2025,
    provinces: ["TH-10", "TH-40"],
    reach: 760_000,
    engagement: 230,
  },
  {
    slug: "pttep-bif",
    title: "PTTEP-BIF",
    quote: "Under the project “eDNA for Biodiversity Determination at Petroleum Platform in the Gulf of Thailand”",
    client: "PTTEP",
    target: "เจ้าหน้าที่ PTTEP และประชาชนผู้สนใจด้านความหลากหลายทางชีวภาพ",
    type: "ESG TOOLS",
    subType: "Website",
    timeline: "2025",
    image: "",
    description: "",
    year: 2025,
    provinces: ["TH-90"],
  },
  {
    slug: "biocourse",
    title: "BIOCOURSE",
    quote: "โครงการพัฒนาหลักสูตรด้านการอนุรักษ์และใช้ประโยชน์จากความหลากหลายทางชีวภาพเพื่อการเสริมสร้างศักยภาพองค์กรปกครองส่วนท้องถิ่น",
    client: "Biodiversity-Based Economy Development Office (BEDO)\nin collaboration with Chulalongkorn University",
    target: "เจ้าหน้าที่ และผู้บริหารท้องถิ่น ในพื้นที่ต้นแบบ จังหวัดน่าน และสระบุรี",
    type: "COURSE",
    timeline: "2025",
    image: "",
    description: "",
    year: 2025,
    provinces: ["TH-55", "TH-19"],
    reach: 250,
    engagement: 250,
  },
  {
    slug: "pathways-to-a-sustainable-urban-future",
    title: "Pathways to a Sustainable Urban Future",
    quote: "เส้นทางสู่อนาคตที่ยั่งยืน",
    client: "Sustainability Expo 2024",
    target: "ประชาชนทั่วไป",
    type: "EVENT",
    subType: "Talk",
    timeline: "2024",
    image: "",
    description: "",
    year: 2024,
    provinces: ["TH-10"],
    reach: 300,
    engagement: 300,
  },
  {
    slug: "green-mission-1-press-conference",
    title: "Green Mission 1 : Press Conference",
    quote: "Mini Hackathon “Carbon Paws Print”",
    client: "Gulf Development Public Company Limited \nin collaboration with Faculty of Engineering, \nChulalongkorn University",
    target: "นักเรียนมัธยมทั่วประเทศ",
    type: "EVENT",
    subType: "Hackathon",
    timeline: "2024",
    image: "",
    description: "",
    year: 2024,
    provinces: [
      ""
    ],
    reach: 1_000,
    engagement: 50,
  },
  {
    slug: "transition-in-action",
    title: "การบรรยายหัวข้อ “Transition in Action ความยั่งยืนที่ทำได้จริง”",
    quote: "Krungsri MUFG ESG Symposium 2024",
    client: "Bank of Ayudhya",
    target: "ประชาชนทั่วไป",
    type: "EVENT",
    subType: "Talk",
    timeline: "2024",
    image: "",
    description: "",
    year: 2024,
    provinces: ["TH-10"],
    reach: 100,
    engagement: 100,
  },
  {
    slug: "biogang-challenge-2024",
    title: "Biogang Challenge 2024",
    client: "Biodiversity-Based Economy Development Office (BEDO)",
    target: "นักเรียนมัธยม กรุงเทพและปริมณฑล",
    type: "CAMP",
    subType: "ค่ายวิชาการด้านสิ่งแวดล้อม",
    timeline: "2024",
    image: "",
    description: "",
    year: 2024,
    provinces: ["TH-10", "TH-12", "TH-11", "TH-13"],
    reach: 1_000,
    engagement: 45,
    outputs: 15,
  },
  {
    slug: "โครงการการจัดการไฟป่า-ลดปัญหาหมอกควัน",
    title: "โครงการการจัดการไฟป่า ลดปัญหาหมอกควัน",
    client: "กรมการเปลี่ยนแปลงสภาพภูมิอากาศและสิ่งแวดล้อม \nกระทรวงทรัพยากรธรรมชาติและสิ่งแวดล้อม",
    target: "ผู้เกี่ยวข้องและประชาชนจังหวัดเชียงใหม่",
    type: "COURSE",
    timeline: "2024",
    image: "",
    description: "",
    year: 2024,
    provinces: ["TH-50", "TH-51", "TH-57"],
    reach: 300,
    engagement: 300,
  },
  {
    slug: "คู่มือการป้องกันการเผาในที่โล่ง",
    title: "คู่มือการป้องกันการเผาในที่โล่ง",
    quote: "ไฟป่า ลดปัญหาหมอกควัน ฝุ่น PM2.5 เพื่อปรับตัวต่อการเปลี่ยนแปลงสภาพภูมิอากาศและสิ่งแวดล้อม",
    client: "กรมการเปลี่ยนแปลงสภาพภูมิอากาศและสิ่งแวดล้อม \nกระทรวงทรัพยากรธรรมชาติและสิ่งแวดล้อม",
    target: "ผู้เกี่ยวข้องและประชาชนจังหวัดเชียงใหม่",
    type: "ESG TOOLS",
    subType: "หนังสือ และสื่อการเรียนรู้",
    timeline: "2024",
    image: "",
    description: "",
    year: 2024,
    provinces: ["TH-50", "TH-51", "TH-57"],
  },
  {
    slug: "dcce-stop-the-climate-crisis-together",
    title: "DCCE Stop the Climate Crisis Together",
    client: "กรมการเปลี่ยนแปลงสภาพภูมิอากาศและสิ่งแวดล้อม \nกระทรวงทรัพยากรธรรมชาติและสิ่งแวดล้อม",
    target: "ประชาชนทั่วไป",
    type: "EVENT",
    subType: "Workshop",
    timeline: "2024",
    image: "",
    description: "",
    year: 2024,
    provinces: ["TH-14", "TH-72"],
    reach: 100,
    engagement: 100,
  },
  {
    slug: "carbon-neutral-in-daily-life",
    title: "Carbon Neutral in Daily Life",
    quote: "Card Game",
    client: "กรมการเปลี่ยนแปลงสภาพภูมิอากาศและสิ่งแวดล้อม \nกระทรวงทรัพยากรธรรมชาติและสิ่งแวดล้อม",
    target: "ประชาชนทั่วไป",
    type: "ESG TOOLS",
    subType: "Board Game",
    timeline: "2024",
    image: "",
    description: "",
    year: 2024,
    provinces: ["TH-14", "TH-72"],
  },
  {
    slug: "dek-sang-nan-2",
    title: "เด็กสร้างน่าน ปีที่ 2",
    quote: "ปลูกความคิด เพื่อชีวิตแห่งป่าน่าน",
    client: "ศูนย์พันธกิจเพื่อสังคม\nจุฬาลงกรณ์มหาวิทยาลัย",
    target: "เยาวชน จ.น่าน",
    type: "CAMP",
    subType: "ค่ายวิชาการด้านสิ่งแวดล้อม",
    timeline: "ก.พ. - ก.ค. 2569 (6 เดือน)",
    image: "",
    description: "",
    year: 2026,
    provinces: ["TH-55"],
    reach: 100_000,
    engagement: 200,
    outputs: 31,
  },
];

export const WORKS = SHEET_WORKS;

/**
 * The order the index slide lists its groups in. A type with no works simply
 * doesn't appear, and COMMUNICATION is here ready for when its first work lands
 * — nothing to change in the component when it does.
 */
export const TYPE_ORDER = [
  "COURSE",
  "CAMP",
  "SUSTAINABLE TOURISM",
  "EVENT",
  "ESG TOOLS",
  "COMMUNICATION",
];

/** Works of one type, in sheet order. */
export const worksOfType = (type) => WORKS.filter((w) => w.type === type);

/** Types that actually have works, in TYPE_ORDER, then any unexpected ones. */
export const activeTypes = () => {
  const present = [...new Set(WORKS.map((w) => w.type).filter(Boolean))];
  const known = TYPE_ORDER.filter((t) => present.includes(t));
  return [...known, ...present.filter((t) => !TYPE_ORDER.includes(t))];
};

/** Years that have works, newest first. */
export const activeYears = () =>
  [...new Set(WORKS.map((w) => w.year).filter(Boolean))].sort((a, b) => b - a);

export const worksOfYear = (year) => WORKS.filter((w) => w.year === Number(year));

export const workBySlug = (slug) => WORKS.find((w) => w.slug === slug);

/*
 * พื้นที่ที่เราลงไปทำจริง — ใช้โดยสไลด์แผนที่ (FootprintSlide)
 *
 * `provinces` ของแต่ละงานเป็นรหัส ISO 3166-2:TH เช่น ["TH-55", "TH-19"]
 * ชื่อจังหวัดของแต่ละรหัสอยู่ใน lib/thaiProvinces.js และเป็นรหัสเดียวกับชื่อ
 * layer ในไฟล์ Figma ของแผนที่ งานไหนยังไม่ระบุก็ปล่อยว่างไว้ได้
 */

/*
 * ตัวเลขผลลัพธ์ของแต่ละงาน — ใช้โดยหน้าสรุป (SummarySlide)
 *
 * ทุกคอลัมน์เป็นจำนวนนับล้วน บวกข้ามงานได้ตรงๆ งานไหนยังไม่มีข้อมูลให้เว้นว่าง
 * (อย่าใส่ 0 — 0 แปลว่า "วัดแล้วได้ศูนย์" ส่วนเว้นว่างแปลว่า "ยังไม่ได้วัด"
 * หน้าสรุปนับจำนวนโครงการที่มีข้อมูลจากตรงนี้)
 *
 *   reach             ครั้งการเข้าถึง — คนเดียวไปหลายงานถูกนับหลายครั้ง
 *   engagement        จำนวนคนที่มีส่วนร่วม
 *   changeMakers      จำนวน change maker
 *   toLocalHands      เงินที่ลงถึงมือชุมชน (บาท)
 *   outputs           จำนวนผลงานที่ส่งมอบ
 *   conceptProposals  จำนวนข้อเสนอเชิงแนวคิด
 *   boardGames        จำนวนเกมที่ออกแบบ (ไม่ใช่จำนวน copy ที่ผลิต)
 *
 * CSAT ยังไม่ได้ใส่: เป็นคะแนนเฉลี่ย บวกกันไม่ได้ ต้องถ่วงน้ำหนักด้วยจำนวน
 * ผู้ตอบ ถ้าจะใส่ต้องมีคอลัมน์จำนวนผู้ตอบมาคู่กันด้วย
 */

/** รวมคอลัมน์ตัวเลขหนึ่งคอลัมน์จากทุกงาน */
export const sumStat = (key) =>
  WORKS.reduce((total, work) => total + (Number(work[key]) || 0), 0);

/**
 * จำนวนงานที่กรอกคอลัมน์นั้นไว้จริง — เอาไว้เขียนกำกับว่า "จาก N โครงการ"
 *
 * ช่องว่างต้องไม่ถูกนับ และ `Number("")` คืน 0 ซึ่งเป็นตัวเลขที่ถูกต้องตามหลัก
 * เพราะงั้นต้องคัดสตริงว่างทิ้งก่อน ไม่ใช่พึ่ง Number.isFinite อย่างเดียว
 */
export const worksWithStat = (key) =>
  WORKS.filter((work) => {
    const value = work[key];
    return value !== undefined && value !== null && value !== "" && Number.isFinite(Number(value));
  }).length;

/** งานทั้งหมดที่เกิดขึ้นในจังหวัดหนึ่ง เรียงตามลำดับในชีต */
export const worksInProvince = (code) =>
  WORKS.filter((w) => (w.provinces ?? []).includes(code));

/** ทุกจังหวัดที่เคยลงพื้นที่ ไม่ซ้ำ — ตัวเลข "XX จังหวัด" มาจากตรงนี้ */
export const provincesWorked = () => [
  ...new Set(WORKS.flatMap((w) => w.provinces ?? [])),
];

/**
 * จำนวนงานของแต่ละจังหวัด { "TH-10": 10, "TH-55": 2, ... }
 * แผนที่เอาไปไล่ความเข้มของสีทอง — ไปบ่อย = เข้ม
 */
export const worksPerProvince = () =>
  WORKS.reduce((count, work) => {
    for (const code of work.provinces ?? []) count[code] = (count[code] ?? 0) + 1;
    return count;
  }, {});
