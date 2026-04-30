import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function GET() {
  const { data, error } = await supabase
    .from("activities")
    .select("*")
    .order("start_date", { ascending: true });

  if (error) return Response.json([], { status: 500 });

  const activities = data.map((a) => ({
    id: a.id,
    image: a.image_url,
    startDate: new Date(a.start_date),
    endDate: new Date(a.end_date),
    en: { label: a.en_label, title: a.en_title, desc: a.en_desc, tags: a.en_tags ?? [] },
    th: { label: a.th_label, title: a.th_title, desc: a.th_desc, tags: a.th_tags ?? [] },
  }));

  return Response.json(activities);
}
