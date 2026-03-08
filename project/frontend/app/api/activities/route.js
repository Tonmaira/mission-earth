// app/api/activities/route.js
// GET /api/activities

import activityData from "@/lib/activityData";

export async function GET() {
  const activities = activityData.map(({ id, title, desc, tags, image }) => ({
    id, title, desc, tags, image,
  }));

  return Response.json(activities);
}