// app/api/events/calendar/route.js
// GET /api/events/calendar?year=2026&month=3

import activityData from "@/lib/activityData";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const year  = parseInt(searchParams.get("year"),  10) || new Date().getFullYear();
  const month = parseInt(searchParams.get("month"), 10) || new Date().getMonth() + 1;

  // ดึง day numbers ที่มี activity ในเดือน/ปีที่ขอ จาก activityData
  const days = new Set();

  activityData.forEach(({ startDate, endDate }) => {
    if (!startDate || !endDate) return;
    const cursor = new Date(startDate);
    while (cursor <= endDate) {
      if (cursor.getFullYear() === year && cursor.getMonth() + 1 === month) {
        days.add(cursor.getDate());
      }
      cursor.setDate(cursor.getDate() + 1);
    }
  });

  return Response.json({ year, month, days: [...days] });
}
