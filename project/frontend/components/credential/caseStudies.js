/**
 * Case-study content for the deck's "ผลงาน" slides, kept out of the component
 * the way partnerLogos.js is — one object per case, so a second case is a new
 * entry here plus a <Slide> in app/credential/page.js, not a new component.
 *
 * Copy is the Figma frame verbatim, including the "ㆍ" (U+318D) the designer
 * uses to separate items on one line.
 */

/**
 * The 17 UN goals, so a case only ever has to name its numbers. The artwork is
 * the official print set already sitting in public/SDGIcons — one file per
 * goal, zero-padded — so nothing new needs adding when a case cites a goal no
 * other case has used.
 */
export const SDG_GOALS = [
  "No Poverty",
  "Zero Hunger",
  "Good Health and Well-being",
  "Quality Education",
  "Gender Equality",
  "Clean Water and Sanitation",
  "Affordable and Clean Energy",
  "Decent Work and Economic Growth",
  "Industry, Innovation and Infrastructure",
  "Reduced Inequalities",
  "Sustainable Cities and Communities",
  "Responsible Consumption and Production",
  "Climate Action",
  "Life Below Water",
  "Life on Land",
  "Peace, Justice and Strong Institutions",
  "Partnerships for the Goals",
];

/** goal number → everything the slide needs to draw its row. */
export const sdgGoal = (n) => {
  const name = SDG_GOALS[n - 1];
  if (!name) return null; // a typo in the data shouldn't take the slide down
  return {
    n,
    code: `SDG ${n}`,
    name,
    src: `/SDGIcons/E_SDG_PRINT-${String(n).padStart(2, "0")}.jpg`,
    alt: `SDG ${n} — ${name}`,
  };
};

export const SCG_PRAYOTSUK = {
  id: "scg-prayotsuk",
  label: "ประโยชน์สุข · SCG",
  title: "ประโยชน์สุข",
  quote: "“เอสซีจีร่วมสร้างชุมชนยั่งยืน”",
  photo: { src: "/credential/case-scg/hero.jpg", alt: "ประโยชน์สุข" },
  meta: [
    { label: "Client", value: "SCG" },
    { label: "Timeline", value: "11 months", sub: "Jan to Nov 2025" },
    { label: "Target", value: "ชุมชนจาก 21 จังหวัด" },
  ],
  sdgGoals: [1, 11],
  stats: [
    { figure: "300+", label: "Engagement" },
    { figure: "1.2M+", label: "Reach" },
    { figure: "40+", label: "Change Makers" },
    { figure: "1.79", label: "SROI" },
  ],
  catalystMix: { core: 40, action: 40, traceability: 20 },
  catalyst: [
    {
      key: "core",
      name: "CORE",
      lead: "ESG Discovery",
      body: "กำหนดกรอบและประเด็นการเรียนรู้ㆍศึกษาพฤติกรรมดั้งเดิมของชุมชนㆍออกแบบหลักสูตรการเรียนรู้",
    },
    {
      key: "action",
      name: "ACTION",
      lead: "ESG Interaction Workshop ㆍ\nIntegrated Impact Activities ㆍ\nImpact Toolkit",
      body: "อบรมหลักสูตร 3 วันต่อชุมชน: WorkshopㆍCoachingㆍติดตามการเปลี่ยนแปลงของชุมชน 3-6 เดือนㆍพัฒนาเครื่องมือเรียนรู้",
    },
    {
      key: "traceability",
      name: "TRACEABILITY",
      lead: "Impact Assessment ㆍESG Narrative",
      body: "ประเมินความรู้ก่อน-หลังㆍประเมินผลกระทบทางสังคมㆍฐานข้อมูลการสร้างอาชีพชุมชนㆍจัดทำสื่อเผยแพร่ผลงาน",
    },
  ],
};

export const DEK_SANG_NAN_1 = {
  id: "dek-sang-nan-1",
  label: "เด็กสร้างน่าน ปีที่ 1",
  title: "เด็กสร้างน่าน ปีที่ 1",
  quote: "“กิจกรรมฟื้นฟูป่าต้นน้ำ”",
  photo: { src: "/profilecredential/case_deksarngnan.jpg", alt: "เยาวชนผู้เข้าร่วมค่ายเด็กสร้างน่าน" }, // no hero photo supplied yet
  meta: [
    { label: "Client", value: "ศูนย์พันธกิจเพื่อสังคม\nจุฬาลงกรณ์มหาวิทยาลัย และ โครงการรักษ์ป่าน่านตามพระราชดำริ" },
    { label: "Timeline", value: "6 months", sub: "Apr to Sep 2025" },
    { label: "Target", value: "เยาวชน จ.น่าน" },
  ],
  sdgGoals: [6, 13, 15],
  stats: [
    { figure: "500+", label: "Engagement" },
    { figure: "80K+", label: "Reach" },
    { figure: "2.1", label: "SROI" },
    { figure: "10", label: "Outputs" },
  ],
  catalystMix: { core: 50, action: 25, traceability: 25 },
  catalyst: [
    {
      key: "core",
      name: "CORE",
      lead: "ESG Discovery",
      body: "กำหนดกรอบและประเด็นการเรียนรู้ㆍBrief & Fundamental",
    },
    {
      key: "action",
      name: "ACTION",
      lead: "ESG Interaction Workshop ㆍ\nIntegrated Impact Activities ㆍ\nImpact Toolkit",
      body: "Roadshow 5 โรงเรียน\nค่าย 3 วัน: Walk RallyㆍWorkshopㆍDesign ThinkingㆍClinic",
    },
    {
      key: "traceability",
      name: "TRACEABILITY",
      lead: "Impact Assessment ㆍESG Narrative",
      body: "ประเมินความรู้ก่อน-หลังㆍประเมินผลกระทบทางสังคมㆍฐานข้อมูลสิ่งมีชีวิตㆍเผยแพร่ผลงานทาง social media",
    },
  ],
};

export const GREEN_MISSION = {
  id: "green-mission",
  label: "Green Mission",
  title: "Green Mission",
  quote: "“ก้าวต่อไปไร้รอยเท้า”",
  photo: { src: "/profilecredential/case_greenmission.jpg", alt: "เยาวชนผู้เข้าร่วมโครงการ Green Mission" }, // no hero photo supplied yet
  meta: [
    { label: "Client", value: "บริษัท กัลฟ์ ดีเวลลอปเมนท์ จำกัด (มหาชน)\nจุฬาลงกรณ์มหาวิทยาลัย" },
    { label: "Timeline", value: "6 months", sub: "May to Oct 2024" },
    { label: "Target", value: "เยาวชนทั่วประเทศ" },
  ],
  sdgGoals: [7, 9, 13, 17],
  stats: [
    { figure: "2000+", label: "Engagement" },
    { figure: "500K+", label: "Reach" },
    { figure: "20", label: "Outputs" },
  ],
  catalystMix: { core: 30, action: 60, traceability: 10 },
  catalyst: [
    {
      key: "core",
      name: "CORE",
      lead: "ESG Discovery",
      body: "กำหนดกรอบและประเด็นการเรียนรู้ㆍFundamental",
    },
    {
      key: "action",
      name: "ACTION",
      lead: "ESG Interaction Workshop ㆍ\nIntegrated Impact Activities ㆍ\nImpact Toolkit",
      body: "ค่ายภาคสนาม 4 วัน: WorkshopㆍDesign ThinkingㆍClinicㆍHackathon",
    },
    {
      key: "traceability",
      name: "TRACEABILITY",
      lead: "Impact Assessment ㆍESG Narrative",
      body: "ประเมินความรู้ก่อน-หลังㆍเผยแพร่ผลงานทาง social mediaㆍประเมิน Carbon Footprint หลังจัดกิจกรรม",
    },
  ],
};

export const WATER_WORKSHOP = {
  id: "water-workshop",
  label: "Workshop · การจัดการน้ำ",
  title: "Workshop:",
  quote: "การจัดทำแผนการจัดการน้ำจังหวัดระยอง พัฒนาศักยภาพผู้นำการเปลี่ยนแปลงด้านน้ำ",
  photo: { src: "/profilecredential/expertise_knowledge.jpg", alt: "การอบรมหลักสูตรการจัดการน้ำ" }, // no hero photo supplied yet
  meta: [
    { label: "Client", value: "สำนักงานทรัพยากรน้ำแห่งชาติ\nจุฬาลงกรณ์มหาวิทยาลัย" },
    { label: "Timeline", value: "5 months", sub: "Jul to Nov 2025" },
    { label: "Target", value: "อปท.ระยอง และหน่วยงานผู้ใช้น้ำ" },
  ],
  sdgGoals: [6, 9, 11],
  stats: [
    { figure: "200+", label: "Engagement" },
    { figure: "24K+", label: "Reach" },
    { figure: "30+", label: "Concept Proposals" },
  ],
  catalystMix: { core: 20, action: 70, traceability: 10 },
  catalyst: [
    {
      key: "core",
      name: "CORE",
      lead: "ESG Discovery",
      body: "กำหนดกรอบและประเด็นการเรียนรู้ㆍออกแบบหลักสูตรการจัดการน้ำ",
    },
    {
      key: "action",
      name: "ACTION",
      lead: "ESG Interaction Workshop ㆍ\nIntegrated Impact Activities ㆍ\nImpact Toolkit",
      body: "อบรมหลักสูตร 3 วัน: LectureㆍWorkshopㆍติดตามการดำเนินงาน 2 เดือนㆍพัฒนาเครื่องมือเรียนรู้",
    },
    {
      key: "traceability",
      name: "TRACEABILITY",
      lead: "Impact Assessment ㆍESG Narrative",
      body: "ประเมินความรู้ก่อน-หลังㆍจัดทำสื่อเผยแพร่ผลงาน",
    },
  ],
};

export const FOREST_BATHING = {
  id: "forest-bathing",
  label: "Forest Bathing",
  title: "Forest Bathing",
  quote: "“Awaken All Six Senses with Nature”",
  photo: { src: "/profilecredential/expertise_nature.jpg", alt: "กิจกรรม Forest Bathing ในป่า" }, // no hero photo supplied yet
  meta: [
    { label: "Client", value: "Royal Orchid Holidays (ROH)" },
    { label: "Timeline", value: "3 months", sub: "Dec 2025 to Feb 2026" },
    { label: "Target", value: "ประชาชนทั่วประเทศ" },
  ],
  sdgGoals: [3, 15, 8],
  stats: [
    { figure: "30+", label: "Engagement" },
    { figure: "500K+", label: "Reach" },
    { figure: "฿300k", label: "To Local Hands" },
    { figure: "90%", label: "CSAT" },
  ],
  catalystMix: { core: 40, action: 60, traceability: 0 },
  catalyst: [
    {
      key: "core",
      name: "CORE",
      lead: "ESG Discovery",
      body: "ศึกษาหลักการ Forest Bathingㆍออกแบบกระบวนการจัดกิจกรรม Forest Bathing",
    },
    {
      key: "action",
      name: "ACTION",
      lead: "ESG Interaction Workshop ㆍ\nIntegrated Impact Activities ㆍ\nImpact Toolkit",
      body: "Survey พื้นที่ㆍจัดกิจกรรม",
    },
    {
      key: "traceability",
      name: "TRACEABILITY",
      lead: "",
      body: "",
    },
  ],
};

export const BKKCAW_2025 = {
  id: "bkkcaw-2025",
  label: "BKKCAW Workshop 2025",
  title: "BKKCAW Workshop 2025",
  quote: "“Designing a Planet Full of Life”",
  photo: {  src: "/profilecredential/case_bkkcaw.jpg", alt: "วงเสวนาในงาน Bangkok Climate Action Week"  }, // no hero photo supplied yet
  meta: [
    { label: "Client", value: "Asia Plus Group Holdings\nCUD4S" },
    { label: "Timeline", value: "5 months", sub: "May to Sep 2025" },
    { label: "Target", value: "ประชาชนทั่วประเทศ" },
  ],
  sdgGoals: [9, 11, 13, 16],
  stats: [
    { figure: "200+", label: "Engagement" },
    { figure: "700K+", label: "Reach" },
    { figure: "1", label: "Board Game Prototype" },
  ],
  catalystMix: { core: 30, action: 60, traceability: 10 },
  catalyst: [
    {
      key: "core",
      name: "CORE",
      lead: "ESG Discovery",
      body: "กำหนดประเด็นการเรียนรู้\nออกแบบกิจกรรม: TalkㆍWorkshop",
    },
    {
      key: "action",
      name: "ACTION",
      lead: "ESG Interaction Workshop ㆍ\nIntegrated Impact Activities ㆍ\nImpact Toolkit",
      body: "ออกแบบและจัดทำ Board Game เพื่อเรียนรู้ด้านความหลากหลายทางชีวภาพ/การวางผังเมือง/Green Finance\nจัดกิจกรรม Workshop",
    },
    {
      key: "traceability",
      name: "TRACEABILITY",
      lead: "Impact Assessment ㆍESG Narrative",
      body: "ประเมินความรู้ก่อน-หลังㆍจัดทำสื่อเผยแพร่ผลงานทาง social media",
    },
  ],
};

/**
 * Deck order for the case-study slides. app/credential/page.js walks this, so
 * adding or reordering a case is a change here alone — one entry above, one
 * name in this list.
 */
/** A case by its slide id — how works.js's `caseId` is resolved. */
export const caseById = (id) => CASE_STUDIES.find((c) => c.id === id);

export const CASE_STUDIES = [
  SCG_PRAYOTSUK,
  DEK_SANG_NAN_1,
  GREEN_MISSION,
  WATER_WORKSHOP,
  FOREST_BATHING,
  BKKCAW_2025,
];
