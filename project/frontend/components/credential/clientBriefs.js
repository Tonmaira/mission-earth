/**
 * สไลด์ "อ่านลูกค้า" — หน้าท้ายเด็คที่เนื้อหาเป็นของลูกค้ารายนั้นล้วนๆ
 *
 * ทุกสไลด์ที่เหลือในเด็คเหมือนกันหมดไม่ว่าใครเปิด มีชุดนี้ชุดเดียวที่บอกว่า
 * "เราอ่านธุรกิจคุณมาแล้ว" เลยผูกกับ slug ใน clients.js ไม่ใช่ชื่อบริษัท —
 * ชื่อบริษัทเป็นข้อความที่แก้เมื่อไหร่ก็ได้ ส่วน slug คือลิงก์ที่ส่งออกไปแล้ว
 *
 * ลูกค้าที่ยังไม่มีข้อมูลตรงนี้ (และ /credential ตัวกลางที่ไม่มีลูกค้าเลย) จะ
 * ข้ามไปทั้งชุด ดีกว่าโชว์หน้าเปล่าหรือหน้าที่ใส่ข้อมูลมั่วๆ ไว้
 *
 * โครงสร้าง: ลูกค้าหนึ่งรายมีแถบชื่อ (eyebrow + โลโก้) ร่วมกันชุดเดียว แล้วมี
 * `slides` กี่หน้าก็ได้ เรียงตามลำดับในอาร์เรย์ แต่ละหน้าเลือกหน้าตาคอลัมน์เอง
 * ผ่าน `layout`:
 *
 *   bars   — แท่งสีตั้งหน้าหัวข้อ แล้วตามด้วย bullet (ใช้กับหน้าอ่านจุดแข็ง)
 *   panels — หัวข้อในกล่องพื้นสี + หัวข้อรองในกรอบมุมซ้ายบน แล้วตามด้วย bullet
 *            (ใช้กับหน้าที่ต้องจับคู่ "เรื่องของเขา → สิ่งที่เราทำร่วมกันได้")
 *
 * วิธีเพิ่มลูกค้าใหม่: เพิ่ม slug ใน clients.js ก่อน แล้วมาเพิ่มก้อนแบบข้างล่าง
 * สี่คอลัมน์คือจำนวนที่พอดีกับเฟรม 1920 — มากกว่านี้คอลัมน์จะแคบจนอ่านไม่ออก
 */

export const CLIENT_BRIEFS = {
  "001osot": {
    eyebrow: "OSOTSPA",
    /* โลโก้ลูกค้าวางในวงกลม — ไฟล์ต้นทางเป็นสี่เหลี่ยมจัตุรัสพื้นขาว */
    logo: { src: "/profilecredential/OSOTlogo.jpg", alt: "Osotspa" },

    slides: [
      /* สร้างจาก Figma node 62:89 ("OSOT1", เฟรม 1920×1080) */
      {
        id: "client-landscape",
        label: "Osotspa landscape",
        layout: "bars",
        /* สีแท่ง/กรอบของหน้านี้ — สีแบรนด์ของลูกค้า ไม่ใช่สีของเด็ค */
        accent: "#243F8C",

        /* หัวเรื่องแบ่งสองสี: ชื่อลูกค้าเป็นครีมหนา ที่เหลือเป็นทอง */
        title: { lead: "Osotspa", rest: "’s Strategic Landscape and Strengths" },

        columns: [
          {
            title: "Commercial Engine",
            points: [
              "Refocused on high-margin branded FMCG and health portfolios",
              "Unrivaled Route-to-Market via Cash Van network",
              "Strong brand equity in energy beverages and personal care",
            ],
          },
          {
            title: "Manufacturing & Circular Excellence",
            points: [
              "Closed-loop glass recycling and cullet processing facilities",
              "Resource-efficient production",
              "High operational safety standards",
            ],
          },
          {
            title: "People & Inclusive Culture Engagement",
            points: [
              "ACT culture driving execution speed and team performance",
              "Strong employer brand for top talent",
              "Disability employment and workplace inclusion model",
            ],
          },
          {
            title: "Regional Footprint",
            points: [
              "Expanding revenue streams in CLMV markets"
            ],
          },
        ],

        /* บรรทัดปิดใต้เส้น — ประโยคเดียวที่บอกว่าเรามองว่าก้าวต่อไปของเขาคืออะไร
           `lead` เป็นตัวหนา `rest` เป็นตัวปกติ สีทองทั้งคู่ */
        footer: {
          lead: "The Next Horizon",
          rest: " – Evolving strong internal ESG into external Shared Value",
        },
      },

      /* สร้างจาก Figma node 62:238 ("OSOT2", เฟรม 1920×1080) */
      {
        id: "client-shared-value",
        label: "Shared value",
        layout: "panels",
        accent: "#176199",

        title: { lead: "Osotspa", rest: "’s Co-creating Shared Value" },

        /* คอลัมน์หน้านี้อ่านจากบนลงล่างเป็นคู่: `title` คือเรื่องที่เขามีอยู่แล้ว
           `theme` คือสิ่งที่เราเข้าไปทำร่วมกันได้ แล้ว bullet คือผลที่ได้ */
        columns: [
          {
            title: "Circularity Ecosystem",
            theme: "Circular Trade Partnership",
            points: ["Material continuity", "Local partner empowerment"],
          },
          {
            title: "Sustainable Sourcing",
            theme: "Health Literacy",
            points: ["Agricultural product security", "Early health-brand affinity"],
          },
          {
            title: "Workforce Well-being",
            theme: "Talent Resilience",
            points: [
              "Productivity optimization via operational wellness",
              "Empowerment for disabled talent",
            ],
          },
          {
            title: "Cross-Border Regional ESG",
            theme: "Youth Empowerment",
            points: [
              "Social license to operate",
              "Regional workforce pipeline and brand trust",
            ],
          },
        ],

        /* หน้านี้บรรทัดปิดเป็นตัวหนาทั้งประโยค เลยไม่มี `rest` */
        footer: { lead: "Net Positive Impact & Sustainable Shared Prosperity" },
      },
    ],
  },
};

/** สไลด์ของ slug นั้น หรือ null ถ้ายังไม่ได้เขียนไว้ — ทั้งชุดจะถูกข้ามไป */
export const clientBrief = (slug) => CLIENT_BRIEFS[slug] ?? null;
