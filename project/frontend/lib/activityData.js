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
    label: "Forest Bathing",
    title: "Forest Bathing",
    desc: "Science-backed sensory immersions that bridge the gap between nature and wellbeing.",
    tags: ["Nature", "Wellbeing", "ESG"],
    image: "/image/services/10-sustaintravel-forest.jpg",
    startDate: new Date(2026, 5, 6),  // June 6, 2026
    endDate:   new Date(2026, 5, 7),  // June 7, 2026
  },
  {
    id: 2,
    label: "Boardgame 101",
    title: "Boardgame 101",
    desc: "Making sustainability actionable for all through interactive board games.",
    tags: ["Community", "Interactive", "Fun"],
    image: "/image/services/21-boardgame.jpg",
    startDate: new Date(2026, 2, 11),
    endDate:   new Date(2026, 2, 11),
  },
  {
    id: 3,
    label: "ESG Course",
    title: "ESG Course",
    desc: "Translate complexity into clarity through our collaborative learning journeys.",
    tags: ["Training", "ESG", "Corporate"],
    image: "/image/services/1-service-course.jpg",
    startDate: new Date(2026, 2, 19),
    endDate:   new Date(2026, 2, 19),
  },
];

export default activityData;
