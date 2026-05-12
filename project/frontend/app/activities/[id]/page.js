import NavbarSimple from "@/components/NavbarSimple";
import FooterSection from "@/components/FooterSection";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function formatDateTH(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("th-TH", { day: "numeric", month: "long", year: "numeric" });
}

export default async function ActivityDetailPage({ params }) {
  const { id } = await params;

  const { data: activity } = await supabase
    .from("activities")
    .select("*")
    .eq("id", id)
    .single();

  if (!activity) {
    return (
      <main className="min-h-screen bg-[#002740] text-white flex items-center justify-center">
        <NavbarSimple />
        <p className="text-white/50">Activity not found.</p>
      </main>
    );
  }

  const { data: related } = await supabase
    .from("activities")
    .select("id, en_title, en_desc, image_url, start_date")
    .neq("id", id)
    .limit(3);

  return (
    <main className="min-h-screen bg-[#002740] text-white">
      <NavbarSimple />

      {/* Hero Image */}
      <div className="relative w-full h-[50vh] md:h-[65vh] mt-[85px]">
        {activity.image_url ? (
          <Image src={activity.image_url} alt={activity.en_title} fill className="object-cover" priority />
        ) : (
          <div className="w-full h-full bg-[#052032]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#002740] via-[#002740]/30 to-transparent" />
      </div>

      {/* Content */}
      <article className="max-w-[793px] mx-auto px-6 md:px-8 -mt-16 relative z-10">

        {/* Tags */}
        {activity.en_tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {activity.en_tags.map((tag) => (
              <span key={tag} className="border border-white/40 rounded-full px-3 py-0.5 text-[11px] text-white/70 tracking-widest uppercase">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="font-semibold italic text-[#CEA870] text-[28px] md:text-[40px] leading-snug mb-1">
          {activity.en_title}
        </h1>
        {activity.th_title && (
          <p className="text-white/50 text-lg mb-4">{activity.th_title}</p>
        )}

        {/* Date */}
        <div className="flex items-center gap-2 text-white/40 text-sm mb-8">
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {formatDateTH(activity.start_date)}
          {activity.end_date && activity.end_date !== activity.start_date && (
            <> — {formatDateTH(activity.end_date)}</>
          )}
        </div>

        <div className="border-t border-white/10 mb-8" />

        {/* Description EN */}
        {activity.en_desc && (
          <p className="text-white/80 text-[15px] md:text-[16px] leading-relaxed mb-6">
            {activity.en_desc}
          </p>
        )}

        {/* Description TH */}
        {activity.th_desc && (
          <p className="text-white/60 text-[15px] leading-relaxed">
            {activity.th_desc}
          </p>
        )}

        <div className="border-t border-white/10 my-12" />

        {/* Related Activities */}
        {related?.length > 0 && (
          <section className="mb-16">
            <p className="text-[#CEA870] text-xs tracking-[0.3em] uppercase mb-6">กิจกรรมอื่นๆ</p>
            <div className="flex flex-col gap-4">
              {related.map((item) => (
                <Link key={item.id} href={`/activities/${item.id}`} className="flex gap-4 group items-center">
                  <div className="relative w-[80px] h-[60px] shrink-0 rounded-lg overflow-hidden">
                    {item.image_url ? (
                      <Image src={item.image_url} alt={item.en_title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full bg-white/5" />
                    )}
                  </div>
                  <div>
                    <p className="text-white/40 text-[11px] mb-0.5">{formatDateTH(item.start_date)}</p>
                    <p className="text-white text-[14px] font-medium group-hover:text-[#CEA870] transition-colors leading-snug">{item.en_title}</p>
                    {item.en_desc && <p className="text-white/40 text-[12px] line-clamp-1 mt-0.5">{item.en_desc}</p>}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

      </article>

      <FooterSection />
    </main>
  );
}
