"use client";
import Image from "next/image";
import { useState } from "react";

// ─── DATA ───────────────────────────────────────────────────────────────────

const SECTIONS = [
  {
    id: "esg",
    title: "ESG Readiness",
    subtitle: "ส่วนที่ 1",
    color: "#CEA870",
    questions: [
      {
        id: "e1", type: "mc",
        question: "การจัดการพลังงานและคาร์บอนฟุตพริ้นท์ ระดับการตรวจวัดและตั้งเป้าหมายลดการปล่อยก๊าซเรือน กระจกขององค์กร (CFO)",
        choices: [
          { score: 1, label: "ยังไม่มีการเก็บข้อมูลหรือนโยบายชัดเจน" },
          { score: 2, label: "มีนโยบายหรือแผนงานลดการใช้ทรัพยากรเบื้องต้นในสำนักงาน" },
          { score: 3, label: "มีการจัดทำรายงาน Carbon Footprint องค์กร (CFO) และวัดผลได้ต่อเนื่อง" },
          { score: 4, label: "มีเป้าหมายและแผนงานการลดก๊าซเรือนกระจกที่ชัดเจน เช่น Net Zero Pathway" },
          { score: 5, label: "มีนวัตกรรมลดการปล่อยก๊าซเรือนกระจกอย่างชัดเจนจนเป็นผู้นำในกลุ่มอุตสาหกรรม" },
        ],
      },
      {
        id: "e2", type: "mc",
        question: "ห่วงโซ่อุปทานสีเขียว (Green Supply Chain) การจัดการสิ่งแวดล้อมตลอดห่วงโซ่คุณค่า",
        choices: [
          { score: 1, label: "ยังไม่มีการนำเกณฑ์สิ่งแวดล้อมหรือความยั่งยืนมาใช้คัดเลือกคู่ค้า" },
          { score: 2, label: "เริ่มมีการสื่อสารความคาดหวังด้านความยั่งยืนไปยังคู่ค้า" },
          { score: 3, label: "มีข้อกำหนดด้านความยั่งยืน (Supplier Code of Conduct) ในสัญญาจัดซื้อจัดจ้าง" },
          { score: 4, label: "มีระบบการตรวจประเมิน (Audit) ด้านสิ่งแวดล้อมของคู่ค้าอย่างสม่ำเสมอ" },
          { score: 5, label: "ร่วมกับคู่ค้าเพื่อพัฒนานวัตกรรมหรือวัตถุดิบที่ยั่งยืนร่วมกัน" },
        ],
      },
      {
        id: "e3", type: "mc",
        question: "การดูแลพนักงานและความเท่าเทียม มาตรฐานการดูแลคุณภาพชีวิตและสิทธิมนุษยชน",
        choices: [
          { score: 1, label: "ปฏิบัติตามกฎหมายแรงงานขั้นพื้นฐานเท่านั้น" },
          { score: 2, label: "มีสวัสดิการและระบบจัดเก็บข้อมูลความปลอดภัย และมีการฝึกอบรมอย่างสม่ำเสมอ" },
          { score: 3, label: "มีนโยบายและสวัสดิการที่รองรับความหลากหลายของพนักงาน" },
          { score: 4, label: "มีโครงการพัฒนาศักยภาพพนักงานเพื่อรองรับธุรกิจในอนาคต" },
          { score: 5, label: "เป็นองค์กรต้นแบบด้านความเท่าเทียม/สิทธิมนุษยชนที่ได้รับการยอมรับในระดับสากล" },
        ],
      },
      {
        id: "e4", type: "mc",
        question: "การพัฒนาชุมชนและสังคม การสร้างผลกระทบเชิงบวกต่อสังคมภายนอก",
        choices: [
          { score: 1, label: "มีเพียงกิจกรรมบริจาคเป็นครั้งคราว" },
          { score: 2, label: "มีกิจกรรม CSR ที่พนักงานมีส่วนร่วมเป็นครั้งคราว" },
          { score: 3, label: "มีโครงการพัฒนาชุมชนรอบข้างอย่างต่อเนื่องและมีการติดตามผล" },
          { score: 4, label: "นำความเชี่ยวชาญหลักของธุรกิจไปช่วยแก้ปัญหาสังคม" },
          { score: 5, label: "มีโครงการที่สร้างการเปลี่ยนแปลงในสังคมอย่างชัดเจนและวัดผลกระทบได้" },
        ],
      },
      {
        id: "e5", type: "mc",
        question: "ความโปร่งใสและการต่อต้านคอร์รัปชัน ระบบการตรวจสอบและความเปิดเผยข้อมูล",
        choices: [
          { score: 1, label: "ยังไม่มีระบบรับเรื่องร้องเรียนหรือรายงานทางการ" },
          { score: 2, label: "มีระบบรับเรื่องร้องเรียนเบื้องต้น" },
          { score: 3, label: "มีการเปิดเผยรายงานความยั่งยืนที่ผ่านการพิจารณาภายใน" },
          { score: 4, label: "รายงานความยั่งยืนได้รับการเผยแพร่และตรวจสอบจากหน่วยงานภายนอก" },
          { score: 5, label: "มีระบบการกำกับดูแลที่โปร่งใสและเปิดเผยข้อมูลตามมาตรฐานสากล" },
        ],
      },
      {
        id: "e6", type: "mc",
        question: "โครงสร้างการบริหารจัดการ ESG ขององค์กร ความสำคัญของ ESG ในระดับนโยบาย",
        choices: [
          { score: 1, label: "ยังไม่มีการกำหนดผู้รับผิดชอบหรือแผนงานเฉพาะด้าน ESG" },
          { score: 2, label: "มีแผนงาน ESG หรือคณะทำงานที่ประกอบด้วยตัวแทนจากหลายฝ่าย" },
          { score: 3, label: "มีหน่วยงานหรือแผนกประจำที่ดูแลงานด้าน ESG โดยเฉพาะ" },
          { score: 4, label: "มีหน่วยงาน ESG ที่รายงานผลต่อผู้บริหารระดับสูงหรือคณะกรรมการอย่างสม่ำเสมอ" },
          { score: 5, label: "คณะกรรมการบริษัทมีส่วนร่วมกำหนดกลยุทธ์ ESG และติดตามผลทุกไตรมาส" },
        ],
      },
      {
        id: "e7", type: "mc",
        question: "นวัตกรรมผลิตภัณฑ์และบริการ การสร้างรายได้จากกิจกรรมเพื่อโลกและสังคม",
        choices: [
          { score: 1, label: "สินค้าหรือบริการหลักยังไม่ถูกออกแบบโดยคำนึงถึงประเด็นด้านความยั่งยืน" },
          { score: 2, label: "เริ่มปรับเลี่ยนบรรจุภัณฑ์หรือวัสดุ/ขั้นตอนบางส่วนให้เป็นมิตรต่อโลก" },
          { score: 3, label: "มีสินค้า/บริการที่เป็นมิตรต่อสิ่งแวดล้อมวางจำหน่ายและสร้างรายได้จริง" },
          { score: 4, label: "สินค้าส่วนใหญ่ถูกออกแบบตามหลัก Circular Economy" },
          { score: 5, label: "นวัตกรรมยั่งยืนกลายเป็นหัวใจหลักที่ขับเคลื่อนรายได้และโมเดลธุรกิจของบริษัท" },
        ],
      },
      {
        id: "e8", type: "mc",
        question: "การเชื่อมโยงความยั่งยืนกับผลตอบแทน การนำ ESG มาเป็นตัวชี้วัดความสำเร็จของคนในองค์กร",
        choices: [
          { score: 1, label: "ยังไม่มีการนำตัวชี้วัด ESG มาใช้ในการประเมินผลงานพนักงาน" },
          { score: 2, label: "มีการตั้งเป้าหมาย ESG เป็นรายโครงการ (Project-based KPI)" },
          { score: 3, label: "ESG เป็นส่วนหนึ่งของตัวชี้วัดความสำเร็จ (KPI) ของแผนกที่เกี่ยวข้อง" },
          { score: 4, label: "มีการนำผลงานด้าน ESG มาประกอบการพิจารณาโบนัสหรือค่าตอบแทนของผู้บริหาร" },
          { score: 5, label: "ทุกระดับตำแหน่งมีตัวชี้วัดความยั่งยืนที่เชื่อมโยงกับค่าตอบแทนอย่างเป็นรูปธรรม" },
        ],
      },
    ],
  },
  {
    id: "brand",
    title: "Brand & DNA Readiness",
    subtitle: "ส่วนที่ 2",
    color: "#7EB8A4",
    questions: [
      {
        id: "b1", type: "mc",
        question: "Brand Purpose & ESG Fit ปัจจุบัน Brand Purpose ขององค์กร มีการเชื่อมโยงกับ ESG มากน้อยเพียงใด",
        choices: [
          { score: 1, label: "ยังไม่มีการเชื่อมโยงกับ ESG" },
          { score: 2, label: "เริ่มระบุ ESG ใน Brand Purpose แล้ว แต่ยังไม่ได้นำไปใช้จริง" },
          { score: 3, label: "เชื่อมโยงชัดเจน และมีบางหน่วยงานเริ่มนำไปใช้" },
          { score: 4, label: "เชื่อมโยงชัดเจน และหลายหน่วยงานนำไปใช้" },
          { score: 5, label: "เชื่อมโยงชัดเจน ใช้จริงทั้งองค์กร และมีการติดตามหรือวัดผลอย่างต่อเนื่อง" },
        ],
      },
      {
        id: "b_open1", type: "open",
        question: "Brand Purpose ปัจจุบันขององค์กรคุณคืออะไร",
        placeholder: "เช่น “เราสร้างนวัตกรรมเพื่อปกป้องและยกระดับชีวิตของผู้คน”",
      },
      {
        id: "b2", type: "mc",
        question: "Say–Do Consistency (ESG) สิ่งที่องค์กรเขียนเป็นนโยบายหรือเป้าหมายด้าน ESG สอดคล้องกับสิ่งที่องค์กรดำเนินการจริงมากน้อยเพียงใด",
        choices: [
          { score: 1, label: "ไม่สอดคล้องการดำเนินงานจริง" },
          { score: 2, label: "สอดคล้องบางเรื่อง การดำเนินงานกระจัดกระจาย" },
          { score: 3, label: "ค่อนข้างสอดคล้อง ต้องปรับปรุง" },
          { score: 4, label: "สอดคล้องดี มีการดำเนินงานชัดเจน" },
          { score: 5, label: "สอดคล้องมาก มีติดตามผลต่อเนื่อง" },
        ],
      },
      {
        id: "b3", type: "mc",
        question: "ESG Focus for Brand องค์กรของคุณมีการเลือกประเด็น ESG หลักเพื่อใช้เป็นแนวทางของแบรนด์ชัดเจนเพียงใด?",
        choices: [
          { score: 1, label: "ยังไม่ชัดว่าแบรนด์ควรโฟกัส ESG เรื่องใด" },
          { score: 2, label: "มีหลายประเด็น ยังไม่เลือกเรื่องหลัก" },
          { score: 3, label: "เลือกได้แล้ว ยังไม่นำไปใช้จริง" },
          { score: 4, label: "เลือกเรื่องหลักชัดเจน เริ่มนำไปใช้" },
          { score: 5, label: "เลือกเรื่องหลักได้ชัดเจน ใช้สม่ำเสมอ และคนในองค์กรเข้าใจตรงกัน" },
        ],
      },
            {
        id: "b_open2", type: "open",
        question: "ประเด็น ESG ที่องค์กรให้ความสำคัญสำหรับแบรนด์",
        placeholder: "เช่น Carbon Reduction, DEI, Community Investment...",
      },
      {
        id: "b4", type: "mc",
        question: "Internal Alignment คนในองค์กรมีความเข้าใจตรงกันมากน้อยเพียงใดว่า “ESG มีความหมายอย่างไรต่อแบรนด์ขององค์กร”",
        choices: [
          { score: 1, label: "แต่ละทีมยังเข้าใจไม่ตรงกัน" },
          { score: 2, label: "เริ่มมีการสื่อสารในทิศทางเดียวกัน แต่ยังไม่สม่ำเสมอ" },
          { score: 3, label: "ทีมเข้าใจตรงกันบ้าง แต่ยังไม่ทั้งหมด" },
          { score: 4, label: "ค่อนข้างเข้าใจตรงกัน และใช้กรอบหรือภาษาเดียวกันในหลายทีม" },
          { score: 5, label: "ทั้งองค์กรเข้าใจตรงกันมาก และนำไปใช้ในการทำงานได้จริง" },
        ],
      },
      {
        id: "b5", type: "mc",
        question: "Credibility & Stakeholder Trust ผู้มีส่วนได้ส่วนเสีย เช่น ลูกค้า นักลงทุน หรือคู่ค้า เชื่อถือมากน้อยเพียงใดว่าองค์กรของคุณทำเรื่อง ESG จริงและต่อเนื่อง ไม่ใช่เพียงการสื่อสาร",
        choices: [
          { score: 1, label: "ยังไม่เกิดความเชื่อมั่น" },
          { score: 2, label: "มีความเชื่อมั่นบ้าง แต่ยังจำกัด" },
          { score: 3, label: "เชื่อมั่นระดับหนึ่ง แต่ยังมีข้อสงสัย" },
          { score: 4, label: "เชื่อมั่นสูง และมีข้อมูลหรือหลักฐานรองรับ" },
          { score: 5, label: "เชื่อมั่นสูงมาก และได้รับการยอมรับจากหลายฝ่าย" },
        ],
      },
      {
        id: "b_open3", type: "open",
        question: "ตัวชี้วัด/หลักฐาน (Proof) ที่คุณใช้ยืนยันความน่าเชื่อถือด้าน ESG ของแบรนด์คืออะไร?",
        placeholder: "เช่น รายงานความยั่งยืน / KPI / การรับรองมาตรฐาน / โครงการที่ทำจริง",
      },
    ],
  },
  {
    id: "narrative",
    title: "ESG & Brand Narrative",
    subtitle: "ส่วนที่ 3",
    color: "#8BA7C2",
    questions: [
      {
        id: "n1", type: "mc",
        question: "ESG Narrative Clarity ปัจจุบันองค์กรของคุณสามารถอธิบาย “เรื่องเล่า ESG ขององค์กร” (ESG Narrative) ได้อย่างชัดเจนและเชื่อมโยง กับธุรกิจหลักมากน้อยเพียงใด?  ",
        choices: [
          { score: 1, label: "ยังไม่มี Narrative ชัดเจน / สื่อสารเป็นกิจกรรมแยกส่วน" },
          { score: 2, label: "มีประเด็น ESG หลายเรื่อง แต่ยังไม่เชื่อมเป็นภาพเดียว" },
          { score: 3, label: "เริ่มมี Theme หลัก แต่ยังไม่คมและไม่ต่อเนื่อง" },
          { score: 4, label: "มี Narrative ชัด เชื่อมธุรกิจ และใช้สื่อสารหลายช่องทาง" },
          { score: 5, label: "ชัดเจนมาก เป็น Strategic Storyline ที่ทุกฝ่ายใช้ตรงกัน" },
        ],
      },
            {
        id: "n_open1", type: "open",
        question: "โปรดสรุป ESG Story ขององค์กรคุณ 3–4 บรรทัด",
      },
      {
        id: "n2", type: "mc",
        question: "Stakeholder Mapping & Message Fit องค์กรของคุณมีการแยก “Stakeholder กลุ่มสำคัญ” (เช่น นักลงทุน ลูกค้า พนักงาน ชุมชน คู่ค้า สื่อ) และปรับ ข้อความ ESG ให้เหมาะกับแต่ละกลุ่มมากน้อยเพียงใด?",
        choices: [
          { score: 1, label: "ยังไม่เคยจัดลำดับ stakeholder ชัดเจน" },
          { score: 2, label: "มีรายชื่อ stakeholder แต่ยังไม่แยก message" },
          { score: 3, label: "เริ่มแยกบางกลุ่ม แต่ยังใช้ message คล้ายกัน" },
          { score: 4, label: "แยกชัดหลายกลุ่ม และมี key message เฉพาะ" },
          { score: 5, label: "มี stakeholder framework ชัด พร้อม message matrix ใช้งานจริง" },
        ],
      },
      {
        id: "n_open2", type: "open",
        question: "Stakeholder กลุ่มใดที่คุณคิดว่า “สื่อสารยากที่สุด” เรื่อง ESG และเพราะอะไร?",
      },
      {
        id: "n3", type: "mc",
        question: "ESG Risk & Issue Preparedness องค์กรของคุณมีความพร้อมในการรับมือประเด็น ESG ที่อาจกระทบชื่อเสียง (เช่น Greenwashing, แรงงาน, สิ่งแวดล้อม, Supply Chain) มากน้อยเพียงใด?",
        choices: [
          { score: 1, label: "ยังไม่มีแผน/ไม่เคยประเมินความเสี่ยงด้าน ESG" },
          { score: 2, label: "ตระหนักถึงความเสี่ยง แต่ยังไม่มีแผนชัด" },
          { score: 3, label: "มี guideline เบื้องต้น" },
          { score: 4, label: "มี crisis/issue framework และทีมรับผิดชอบ" },
          { score: 5, label: "มี scenario planning + media response framework พร้อมใช้" },
        ],
      },
            {
        id: "n_open3", type: "open",
        question: "หากเกิดประเด็น ESG เชิงลบในสื่อวันนี้ คุณคิดว่าองค์กรพร้อมรับมือระดับใด? เพราะอะไร?",
      },
      {
        id: "n4", type: "mc",
        question: "ESG Disclosure & Transparency ปัจจุบันองค์กรของคุณมีการเปิดเผยข้อมูล ESG (เช่น Sustainability Report, One Report, Website, Social Media, Fact Sheet) อย่างเป็นระบบมากน้อยเพียงใด?",
        choices: [
          { score: 1, label: "ยังไม่มีการเปิดเผยอย่างเป็นทางการ" },
          { score: 2, label: "เปิดเผยบางกิจกรรม แต่ไม่เป็นระบบ" },
          { score: 3, label: "มีรายงาน แต่ยังไม่สม่ำเสมอหรือยังไม่สื่อสารต่อยอด" },
          { score: 4, label: "มีรายงานชัดเจน และสื่อสารต่อเนื่องหลายช่องทาง" },
          { score: 5, label: "มี data-backed disclosure โปร่งใส ตรวจสอบได้ และสื่อสารอย่าง strategic" },
        ],
      },
      {
        id: "n_open4", type: "open",
        question: "ช่องทางใดที่องค์กรใช้สื่อสาร ESG มากที่สุด?",
      },
      {
        id: "n5", type: "mc",
        question: "Measurement of ESG Communication Impact องค์กรของคุณวัดผล “ความสำเร็จของการสื่อสาร ESG” อย่างไร?",
        choices: [
          { score: 1, label: "ยังไม่เคยวัดผล" },
          { score: 2, label: "วัดเพียง engagement/basic metrics" },
          { score: 3, label: "วัด perception บางส่วน" },
          { score: 4, label: "มี KPI ชัด เช่น Brand Trust / Reputation Score / Investor Feedback" },
          { score: 5, label: "มี dashboard เชื่อม ESG performance + Reputation Impact" },
        ],
      },
      {
        id: "n_open5", type: "open",
        question: "ปัจจุบันคุณมีตัวชี้วัดใดบ้างที่สะท้อนผลลัพธ์ด้านชื่อเสียงหรือความเชื่อมั่น?",
      },
    ],
  },
];

// flatten all questions with section info
const ALL_QUESTIONS = SECTIONS.flatMap((s) =>
  s.questions.map((q) => ({ ...q, sectionId: s.id, sectionTitle: s.title, sectionColor: s.color, sectionSubtitle: s.subtitle }))
);
const TOTAL_Q = ALL_QUESTIONS.length;

const BG_IMAGES = [
  "/nature-image/DSC07442.jpg",
  "/nature-image/DSC06963.jpg",
  "/nature-image/DSC06896.jpg",
  "/nature-image/DSC07447.jpg",
  "/nature-image/DSC04624.JPG",
];

// ─── RESULT HELPERS ──────────────────────────────────────────────────────────

function calcSectionScore(answers, sectionId) {
  const qs = SECTIONS.find((s) => s.id === sectionId).questions.filter((q) => q.type === "mc");
  const total = qs.reduce((sum, q) => sum + (answers[q.id] ?? 0), 0);
  const max = qs.length * 5;
  return { score: total, max, pct: Math.round((total / max) * 100) };
}

function getLevel(pct) {
  if (pct <= 40) return { label: "Early Stage", desc: "องค์กรเพิ่งเริ่มต้นเส้นทาง ESG ยังมีพื้นที่ให้พัฒนาอีกมาก", color: "#E07070" };
  if (pct <= 60) return { label: "Developing", desc: "องค์กรมีความตระหนักด้าน ESG แต่ยังต้องการความสม่ำเสมอ", color: "#CEA870" };
  if (pct <= 80) return { label: "Advanced", desc: "องค์กรมีระบบ ESG ที่ชัดเจน และกำลังขยายผลในวงกว้าง", color: "#7EB8A4" };
  return { label: "Leader", desc: "องค์กรเป็นผู้นำด้าน ESG ที่มีระบบครบถ้วนและวัดผลได้", color: "#6BAED6" };
}

// ─── COMPONENTS ─────────────────────────────────────────────────────────────

function ProgressBar({ value, max, color }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-gray-400 mb-1">
        <span>{value} / {max} คะแนน</span>
        <span>{pct}%</span>
      </div>
      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

// ─── MAIN PAGE ───────────────────────────────────────────────────────────────

export default function ReadinessSurvey() {
  const [step, setStep] = useState(0); // 0=info, 1..N=questions, N+1=result
  const [form, setForm] = useState({ firstName: "", lastName: "", org: "", position: "" });
  const [answers, setAnswers] = useState({});
  const [openAnswers, setOpenAnswers] = useState({});

  const setField = (key) => (e) => setForm({ ...form, [key]: e.target.value });
  const isInfoValid = form.firstName && form.lastName && form.org && form.position;

  const currentQ = ALL_QUESTIONS[step - 1];
  const bgImage = BG_IMAGES[(step) % BG_IMAGES.length];

  const canNext =
    step === 0 ? isInfoValid :
    currentQ?.type === "mc" ? !!answers[currentQ.id] :
    true; // open-ended optional

  const handleNext = () => {
    if (step <= TOTAL_Q) setStep(step + 1);
  };
  const handlePrev = () => setStep(step - 1);

  // scores
  const esgScore   = calcSectionScore(answers, "esg");
  const brandScore = calcSectionScore(answers, "brand");
  const narScore   = calcSectionScore(answers, "narrative");
  const totalScore = esgScore.score + brandScore.score + narScore.score;
  const totalMax   = esgScore.max + brandScore.max + narScore.max;
  const totalPct   = Math.round((totalScore / totalMax) * 100);
  const level      = getLevel(totalPct);

  return (
    <main className="min-h-screen bg-[#002740] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl bg-[#052032] rounded-[20px] overflow-hidden flex flex-col md:flex-row min-h-[580px]">

        {/* ── LEFT PANEL ── */}
        <div className="relative w-full md:w-[42%] h-56 md:h-auto shrink-0 overflow-hidden">
          <Image src={bgImage} alt="" fill className="object-cover transition-all duration-700" priority />
          <div className="absolute inset-0 bg-[#002740]/55" />
          <div className="absolute inset-0 flex flex-col justify-between p-7">
            <a href="/"><Image src="/full-logo-me.svg" alt="Mission Earth" width={100} height={32} className="object-contain" /></a>
            <div className="text-center">
              <p className="text-[#CEA870] text-xs tracking-widest uppercase mb-1">Preliminary ESG Scoring Checklist</p>
              <h1 className="text-white text-lg font-semibold leading-snug">แบบประเมินความยั่งยืนองค์กรเบื้องต้น</h1>

              {/* Progress */}
              {step > 0 && step <= TOTAL_Q && (
                <div className="mt-5">
                  <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                    <span className="text-[#CEA870] text-xs">{currentQ?.sectionSubtitle} — {currentQ?.sectionTitle}</span>
                    <span>{step}/{TOTAL_Q}</span>
                  </div>
                  <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.round((step / TOTAL_Q) * 100)}%`, backgroundColor: currentQ?.sectionColor ?? "#CEA870" }} />
                  </div>
                </div>
              )}

              {/* Dots per section */}
              {step > 0 && step <= TOTAL_Q && (
                <div className="flex justify-center gap-1.5 mt-4">
                  {SECTIONS.map((s) => (
                    <div key={s.id} className={`h-1.5 rounded-full transition-all duration-300 ${currentQ?.sectionId === s.id ? "w-6" : "w-1.5 opacity-30"}`} style={{ backgroundColor: s.color }} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="flex-1 flex flex-col justify-between p-8 md:p-10">

          {/* ── STEP 0: ข้อมูลส่วนตัว ── */}
          {step === 0 && (
            <>
              <div className="mb-6">
                <p className="text-[#CEA870] text-xs tracking-widest uppercase">ขั้นตอนที่ 1 จาก 4</p>
                <h2 className="text-white text-xl font-semibold mt-1">ข้อมูลผู้ตอบแบบสอบถาม</h2>
                <p className="text-gray-400 text-sm mt-1">กรุณากรอกข้อมูลให้ครบถ้วนก่อนเริ่มทำแบบประเมิน</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                {[
                  { key: "firstName", label: "ชื่อ", placeholder: "ชื่อจริง" },
                  { key: "lastName",  label: "นามสกุล", placeholder: "นามสกุล" },
                  { key: "org",       label: "ชื่อองค์กร", placeholder: "ชื่อบริษัท / องค์กร" },
                  { key: "position",  label: "ตำแหน่ง", placeholder: "ตำแหน่งงาน" },
                ].map(({ key, label, placeholder }) => (
                  <div key={key}>
                    <label className="text-[#CEA870] text-xs tracking-widest font-medium block mb-2">{label} <span className="text-red-400">*</span></label>
                    <input type="text" value={form[key]} onChange={setField(key)} placeholder={placeholder}
                      className="w-full bg-[#002740] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#CEA870]/60 transition-colors" />
                  </div>
                ))}
              </div>
              <div className="flex justify-end mt-8">
                <NextBtn onClick={handleNext} disabled={!canNext} label="เริ่มทำแบบประเมิน" />
              </div>
            </>
          )}

          {/* ── STEP 1..N: คำถาม ── */}
          {step >= 1 && step <= TOTAL_Q && (
            <>
              <div className="mb-6">
                <p className="text-xs tracking-widest uppercase mb-1" style={{ color: currentQ.sectionColor }}>{currentQ.sectionSubtitle} · ข้อที่ {step}</p>
                <h2 className="text-white text-lg font-medium leading-relaxed">{currentQ.question}</h2>
              </div>

              {currentQ.type === "mc" ? (
                <div className="flex flex-col gap-2.5 flex-1 overflow-y-auto pr-1">
                  {currentQ.choices.map((c) => {
                    const selected = answers[currentQ.id] === c.score;
                    return (
                      <button key={c.score} onClick={() => setAnswers({ ...answers, [currentQ.id]: c.score })}
                        className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-xl border text-left transition-all duration-200 ${selected ? "border-[#CEA870] bg-[#CEA870]/10 text-white" : "border-white/10 text-gray-300 hover:border-white/30 hover:bg-white/5"}`}>
                        <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${selected ? "bg-[#CEA870] text-[#002740]" : "bg-white/10 text-gray-400"}`}>{c.score}</span>
                        <span className="text-sm">{c.label}</span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="flex-1">
                  <textarea
                    rows={5}
                    value={openAnswers[currentQ.id] ?? ""}
                    onChange={(e) => setOpenAnswers({ ...openAnswers, [currentQ.id]: e.target.value })}
                    placeholder={currentQ.placeholder}
                    className="w-full bg-[#002740] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#CEA870]/60 transition-colors resize-none"
                  />
                  <p className="text-gray-600 text-xs mt-1.5">* ไม่บังคับ สามารถข้ามได้</p>
                </div>
              )}

              <div className="flex justify-between mt-6">
                <PrevBtn onClick={handlePrev} />
                <NextBtn onClick={handleNext} disabled={!canNext} label={step === TOTAL_Q ? "ดูผลลัพธ์" : "ถัดไป"} />
              </div>
            </>
          )}

          {/* ── RESULT ── */}
          {step === TOTAL_Q + 1 && (
            <div className="flex flex-col gap-6 overflow-y-auto">
              <div>
                <p className="text-[#CEA870] text-xs tracking-widest uppercase">ผลการประเมิน</p>
                <h2 className="text-white text-xl font-semibold mt-1">{form.firstName} {form.lastName} · {form.org}</h2>
              </div>

              {/* Overall */}
              <div className="border border-white/10 rounded-2xl p-5 text-center">
                <p className="text-gray-400 text-xs uppercase tracking-widest mb-2">คะแนนรวม</p>
                <div className="text-5xl font-bold mb-1" style={{ color: level.color }}>{totalScore}</div>
                <p className="text-gray-400 text-sm mb-3">จาก {totalMax} คะแนน ({totalPct}%)</p>
                <span className="px-5 py-1.5 rounded-full text-sm font-semibold" style={{ backgroundColor: `${level.color}20`, color: level.color, border: `1px solid ${level.color}40` }}>
                  {level.label}
                </span>
                <p className="text-gray-400 text-sm mt-3 leading-relaxed">{level.desc}</p>
              </div>

              {/* Section breakdown */}
              <div className="space-y-4">
                <p className="text-gray-400 text-xs uppercase tracking-widest">คะแนนแยกตาม Section</p>
                {[
                  { label: "ESG Readiness", ...esgScore, color: "#CEA870" },
                  { label: "Brand & DNA Readiness", ...brandScore, color: "#7EB8A4" },
                  { label: "ESG & Brand Narrative", ...narScore, color: "#8BA7C2" },
                ].map((s) => (
                  <div key={s.label}>
                    <p className="text-sm font-medium mb-2" style={{ color: s.color }}>{s.label}</p>
                    <ProgressBar value={s.score} max={s.max} color={s.color} />
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a href="/contact" className="flex-1 text-center border border-[#CEA870] text-[#CEA870] py-3 rounded-full text-sm font-semibold hover:bg-[#CEA870] hover:text-[#002740] transition-all">
                  ปรึกษาผู้เชี่ยวชาญ
                </a>
                <button onClick={() => { setStep(0); setAnswers({}); setOpenAnswers({}); }}
                  className="flex-1 border border-white/10 text-gray-400 py-3 rounded-full text-sm hover:border-white/30 transition-all">
                  ทำใหม่
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}

// ─── SMALL COMPONENTS ────────────────────────────────────────────────────────

function NextBtn({ onClick, disabled, label = "ถัดไป" }) {
  return (
    <button onClick={onClick} disabled={disabled}
      className={`px-7 py-3 rounded-full text-sm font-semibold tracking-widest uppercase transition-all duration-300 flex items-center gap-2 ${disabled ? "border border-white/10 text-gray-600 cursor-not-allowed" : "bg-[#CEA870] text-[#002740] hover:bg-[#CEA870]/90 active:scale-95"}`}>
      {label}
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </button>
  );
}

function PrevBtn({ onClick }) {
  return (
    <button onClick={onClick}
      className="px-6 py-3 rounded-full text-sm border border-white/10 text-gray-400 hover:border-white/30 hover:text-[#CEA870] transition-all flex items-center gap-2">
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      ย้อนกลับ
    </button>
  );
}
