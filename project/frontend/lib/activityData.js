/**
 * activityData.js — Single source of truth สำหรับข้อมูล Activity ทั้งหมด
 *
 * ใช้โดย:
 *   - components/earthfeed/ActivitiesPanel.js  (upcoming list + slider)
 *   - app/api/activities/route.js              (GET /api/activities)
 *   - app/api/events/calendar/route.js         (GET /api/events/calendar)
 */

const activityData = [
  {
    id: 1,
    image: "/image/services/10-sustaintravel-forest.jpg",
    startDate: new Date(2026, 5, 6),
    endDate:   new Date(2026, 5, 7),
    en: {
      label: "Forest Bathing",
      title: "Forest Bathing",
      desc: "Science-backed sensory immersions that bridge the gap between nature and wellbeing.",
      tags: ["Nature", "Wellbeing", "ESG"],
    },
    th: {
      label: "อาบป่า",
      title: "อาบป่า (Forest Bathing)",
      desc: "ประสบการณ์สัมผัสธรรมชาติที่มีพื้นฐานจากวิทยาศาสตร์ เชื่อมโยงช่องว่างระหว่างธรรมชาติและความเป็นอยู่ที่ดี",
      tags: ["ธรรมชาติ", "สุขภาวะ", "ESG"],
    },
  },
  {
    id: 2,
    image: "/image/services/21-boardgame.jpg",
    startDate: new Date(2026, 2, 11),
    endDate:   new Date(2026, 2, 11),
    en: {
      label: "Boardgame 101",
      title: "Boardgame 101",
      desc: "Making sustainability actionable for all through interactive board games.",
      tags: ["Community", "Interactive", "Fun"],
    },
    th: {
      label: "บอร์ดเกม 101",
      title: "บอร์ดเกม 101",
      desc: "ทำให้ความยั่งยืนเป็นเรื่องที่ทุกคนลงมือทำได้ ผ่านบอร์ดเกมเชิงโต้ตอบ",
      tags: ["ชุมชน", "โต้ตอบ", "สนุก"],
    },
  },
  {
    id: 3,
    image: "/image/services/1-service-course.jpg",
    startDate: new Date(2026, 2, 19),
    endDate:   new Date(2026, 2, 19),
    en: {
      label: "ESG Course",
      title: "ESG Course",
      desc: "Translate complexity into clarity through our collaborative learning journeys.",
      tags: [{ label: "Take Questionnaire", href: "/survey/readiness" }],
    },
    th: {
      label: "หลักสูตร ESG",
      title: "หลักสูตร ESG",
      desc: "แปลงความซับซ้อนให้เป็นความชัดเจน ผ่านการเดินทางแห่งการเรียนรู้เชิงร่วมมือ",
      tags: [{ label: "ทำแบบประเมิน", href: "/survey/readiness" }],
    },
  },
];

export default activityData;
