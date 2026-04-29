import NavbarSimple from "@/components/NavbarSimple";
import FooterSection from "@/components/FooterSection";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function FeedArticlePage({ params }) {
  const { id } = await params;

  const { data: article } = await supabase
    .from("articles")
    .select("*")
    .eq("id", id)
    .single();

  if (!article) {
    return (
      <main className="min-h-screen bg-[#002740] text-white flex items-center justify-center">
        <NavbarSimple />
        <p className="text-white/50">Article not found.</p>
      </main>
    );
  }

  const { data: related } = await supabase
    .from("articles")
    .select("id, title, sub, cat, image_url")
    .neq("id", id)
    .eq("cat", article.cat)
    .limit(2);

  return (
    <main className="min-h-screen bg-[#002740] text-white">
      <NavbarSimple />

      {/* Hero Image */}
      <div className="relative w-full h-[50vh] md:h-[65vh] mt-[85px]">
        {article.image_url && (
          <Image src={article.image_url} alt={article.title} fill className="object-cover" priority />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#002740] via-[#002740]/30 to-transparent" />
      </div>

      {/* Article Content */}
      <article className="max-w-[793px] mx-auto px-6 md:px-8 -mt-16 relative z-10">

        {/* Meta */}
        <div className="flex items-center gap-3 mb-4">
          <span className="border border-white/40 rounded-full px-3 py-0.5 text-[11px] text-white/70 tracking-widest uppercase">
            {article.cat}
          </span>
          <span className="text-white/40 text-[12px]">{article.date}</span>
        </div>

        {/* Title */}
        <h1 className="font-semibold italic text-[#CEA870] text-[28px] md:text-[40px] tracking-[0.4px] leading-snug mb-2">
          {article.title}
        </h1>
        <p className="text-white/60 text-[16px] md:text-[18px] mb-8">{article.sub}</p>

        {/* Divider */}
        <div className="border-t border-white/10 mb-8" />

        {/* Body */}
        <div className="flex flex-col gap-8">
          {(article.blocks ?? []).map((block, i) => {
            if (block.type === "paragraph") {
              return (
                <p key={i} className="text-white/80 text-[15px] md:text-[16px] leading-relaxed tracking-[0.16px]">
                  {block.text}
                </p>
              );
            }
            if (block.type === "image") {
              return (
                <figure key={i} className="flex flex-col gap-2">
                  <div className="relative w-full aspect-[16/9] rounded-sm overflow-hidden">
                    <Image src={block.src} alt={block.caption || ""} fill className="object-cover" />
                  </div>
                  <figcaption className="text-white/40 text-[12px] text-center italic">{block.caption}</figcaption>
                </figure>
              );
            }
            if (block.type === "quote") {
              return (
                <blockquote key={i} className="border-l-4 border-[#CEA870] pl-6 py-2">
                  <p className="text-[#CEA870] text-[16px] md:text-[18px] italic leading-relaxed">
                    &ldquo;{block.text}&rdquo;
                  </p>
                </blockquote>
              );
            }
            return null;
          })}
        </div>

        {/* Tags */}
        {article.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-10">
            {article.tags.map((tag) => (
              <span key={tag} className="border border-white/20 rounded-full px-4 py-1 text-[12px] text-white/50 tracking-widest uppercase">
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="border-t border-white/10 my-12" />

        {/* Related Articles */}
        {related?.length > 0 && (
          <section className="mb-16">
            <p className="text-[#CEA870] text-xs tracking-[0.3em] uppercase mb-6">Related</p>
            <div className="flex flex-col gap-4">
              {related.map((item) => (
                <Link key={item.id} href={`/feed/${item.id}`} className="flex gap-4 group items-center">
                  <div className="relative w-[80px] h-[60px] shrink-0 rounded-sm overflow-hidden">
                    {item.image_url && (
                      <Image src={item.image_url} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                    )}
                  </div>
                  <div>
                    <p className="text-[#CEA870] text-[10px] tracking-widest uppercase mb-1">{item.cat}</p>
                    <p className="text-white text-[14px] font-medium group-hover:text-[#CEA870] transition-colors duration-200 leading-snug">{item.title}</p>
                    <p className="text-white/40 text-[12px]">{item.sub}</p>
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
