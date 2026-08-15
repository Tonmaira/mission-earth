import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid body" }, { status: 400 });
  }

  const email = String(body.email ?? "").trim().toLowerCase();
  const locationId = String(body.locationId ?? "").trim();

  if (!EMAIL_RE.test(email)) {
    return Response.json({ error: "อีเมลไม่ถูกต้อง" }, { status: 400 });
  }
  if (!locationId) {
    return Response.json({ error: "missing locationId" }, { status: 400 });
  }

  const { error } = await supabase
    .from("forest_bathing_notify")
    .insert({ email, location_id: locationId });

  // 23505 = unique violation: already signed up for this location. Not an error
  // from the visitor's point of view.
  if (error && error.code !== "23505") {
    console.error("forest_bathing_notify insert failed:", error);
    return Response.json({ error: "บันทึกไม่สำเร็จ ลองใหม่อีกครั้ง" }, { status: 500 });
  }

  return Response.json({ ok: true, alreadySubscribed: error?.code === "23505" });
}
