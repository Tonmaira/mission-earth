import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function GET() {
  const { data, error } = await supabase
    .from("articles")
    .select("id, cat, date, title, sub, image_url")
    .order("created_at", { ascending: false });

  if (error) return Response.json([], { status: 500 });

  const feed = data.map(a => ({
    id: a.id,
    cat: a.cat,
    date: a.date,
    title: a.title,
    sub: a.sub,
    imageUrl: a.image_url,
  }));

  return Response.json(feed);
}
