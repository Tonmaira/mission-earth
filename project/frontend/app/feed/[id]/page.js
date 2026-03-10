import NavbarSimple from "@/components/NavbarSimple";
import FooterSection from "@/components/FooterSection";
import Image from "next/image";
import Link from "next/link";

const MOCK_ARTICLES = {
  1: {
    id: 1,
    cat: "ME Update",
    date: "March 7, 2026",
    title: "Forest Bathing in City",
    sub: "with 6 senses",
    imageUrl: "/image/earthfeed/forestbathingincity.jpg",
    author: "Mission Earth Team",
    readTime: "4 min read",
    content: [
      {
        type: "paragraph",
        text: "In the heart of Bangkok, Mission Earth brought the healing power of the forest into the city. The Forest Bathing in City experience invited participants to awaken all six senses — sight, sound, smell, taste, touch, and a sixth sense of presence — through guided nature immersion."
      },
      {
        type: "image",
        src: "/image/earthfeed/forestbathingincity.jpg",
        caption: "Participants experiencing mindful forest bathing in an urban setting"
      },
      {
        type: "paragraph",
        text: "Rooted in the Japanese practice of Shinrin-yoku, this urban adaptation was designed for city dwellers who rarely have access to deep nature. The session guided participants through breath awareness, sensory walks, and silent reflection — all within a green urban space."
      },
      {
        type: "quote",
        text: "Nature doesn't need to be far away. It lives in every leaf, every breath, every moment of stillness we allow ourselves."
      },
      {
        type: "paragraph",
        text: "The event was part of Mission Earth's ongoing effort to make sustainability and wellbeing accessible to everyone — regardless of where they live. By bringing the forest to the city, we hope to inspire a deeper connection between people and the natural world."
      },
    ],
    tags: ["Forest Bathing", "Wellbeing", "Urban Nature", "Shinrin-yoku"],
    related: [2, 3],
  },
  2: {
    id: 2,
    cat: "Event",
    date: "March 7, 2026",
    title: "ROHxME Forest Bathing",
    sub: "14-15 Feb, 2026 at Doi Tung",
    imageUrl: "/image/earthfeed/forestbathingdoitung.jpg",
    author: "Mission Earth Team",
    readTime: "5 min read",
    content: [
      {
        type: "paragraph",
        text: "Mission Earth partnered with Royal Orchid Holidays (ROH) to create a two-day immersive forest bathing experience at the pristine forests of Doi Tung, Chiangrai. The retreat brought together 30 participants for a transformative journey into nature."
      },
      {
        type: "image",
        src: "/image/earthfeed/forestbathingdoitung.jpg",
        caption: "Participants at Doi Tung forest, 14-15 February 2026"
      },
      {
        type: "paragraph",
        text: "Guided by certified Shinrin-yoku practitioners, participants spent two days awakening all six senses through mindful walks, sensory exercises, and reflective journaling. The towering pine forests of Doi Tung provided the perfect backdrop for deep reconnection with nature."
      },
      {
        type: "quote",
        text: "This is what sustainability feels like — not just a policy or a goal, but a lived experience of belonging to this Earth."
      },
      {
        type: "paragraph",
        text: "The collaboration with ROH marks a milestone in sustainable tourism, blending premium travel experiences with genuine environmental education and personal wellbeing."
      },
    ],
    tags: ["Forest Bathing", "ROH", "Sustainable Travel", "Doi Tung", "Chiangrai"],
    related: [1, 3],
  },
  3: {
    id: 3,
    cat: "News",
    date: "March 7, 2026",
    title: "ROHxME MOU",
    sub: "for Sustainable Tourism",
    imageUrl: "/image/earthfeed/rohxmemou.jpg",
    author: "Mission Earth Team",
    readTime: "3 min read",
    content: [
      {
        type: "paragraph",
        text: "Mission Earth and Royal Orchid Holidays (ROH) have signed a Memorandum of Understanding (MOU) to jointly develop and promote sustainable tourism experiences across Thailand. The partnership aims to integrate ESG principles into premium travel offerings."
      },
      {
        type: "image",
        src: "/image/earthfeed/rohxmemou.jpg",
        caption: "MOU signing ceremony between Mission Earth and Royal Orchid Holidays"
      },
      {
        type: "paragraph",
        text: "Under this agreement, both organizations will co-design nature-based experiences, responsible travel itineraries, and environmental education programs for ROH's clients — from corporate groups to individual travelers seeking meaningful journeys."
      },
      {
        type: "quote",
        text: "Sustainable tourism is not just about reducing impact — it's about creating experiences that inspire lasting change."
      },
      {
        type: "paragraph",
        text: "This MOU represents a shared commitment to demonstrating that luxury and sustainability are not opposites — they are complementary values that create richer, more meaningful travel experiences."
      },
    ],
    tags: ["MOU", "ROH", "Sustainable Tourism", "Partnership"],
    related: [1, 2],
  },
  4: {
    id: 4,
    cat: "Event",
    date: "March 7, 2026",
    title: "BKK Design Week 2026",
    sub: "Alive Sustainable Planet",
    imageUrl: "/image/earthfeed/DSC06796.jpg",
    author: "Mission Earth Team",
    readTime: "4 min read",
    content: [
      {
        type: "paragraph",
        text: "Mission Earth brought the Alive Sustainable Planet (ASP) board game to Bangkok Design Week 2026 at TCDC, inviting the public to step into the role of a city planner and design a sustainable urban future."
      },
      {
        type: "image",
        src: "/image/earthfeed/DSC06796.jpg",
        caption: "Bangkok Design Week 2026 — Alive Sustainable Planet workshop at TCDC"
      },
      {
        type: "paragraph",
        text: "Over five sessions across two weekends (January 30–31 and February 6–8), hundreds of participants engaged with the interactive game — balancing quality of life, environmental health, and economic vitality to build their ideal city."
      },
      {
        type: "quote",
        text: "Design is a tool for imagining better futures. And sustainability is the most important design challenge of our time."
      },
      {
        type: "paragraph",
        text: "The event was a resounding success, demonstrating that sustainability education can be engaging, creative, and accessible to people of all ages and backgrounds."
      },
    ],
    tags: ["Bangkok Design Week", "Board Game", "ESG Tools", "TCDC"],
    related: [5, 1],
  },
  5: {
    id: 5,
    cat: "ME Update",
    date: "March 7, 2026",
    title: "BMAxAFDxME",
    sub: "Alive Sustainable Planet",
    imageUrl: "/image/earthfeed/bma.jpg",
    author: "Mission Earth Team",
    readTime: "3 min read",
    content: [
      {
        type: "paragraph",
        text: "Mission Earth collaborated with Bangkok Metropolitan Administration (BMA) and Agence Française de Développement (AFD) to deliver a workshop on biodiversity and urban quality of life for architecture students and urban planners."
      },
      {
        type: "image",
        src: "/image/earthfeed/bma.jpg",
        caption: "BMA x AFD x Mission Earth workshop on sustainable urban planning"
      },
      {
        type: "paragraph",
        text: "The workshop used the Alive Sustainable Planet board game as a facilitation tool, helping participants explore the complex relationships between urban development, biodiversity, and human wellbeing. Teams competed to design the most sustainable and livable city."
      },
      {
        type: "quote",
        text: "Cities are ecosystems too. The decisions we make about urban space affect every living thing — human and non-human alike."
      },
      {
        type: "paragraph",
        text: "This three-way collaboration represents a growing recognition that sustainability challenges require cross-sector partnership — between government, international development agencies, and civil society organizations like Mission Earth."
      },
    ],
    tags: ["BMA", "AFD", "Urban Planning", "Biodiversity"],
    related: [4, 3],
  },
};

export default async function FeedArticlePage({ params }) {
  const { id } = await params;
  const article = MOCK_ARTICLES[Number(id)];

  if (!article) {
    return (
      <main className="min-h-screen bg-[#002740] text-white flex items-center justify-center">
        <NavbarSimple />
        <p className="text-white/50">Article not found.</p>
      </main>
    );
  }

  const related = article.related.map((id) => MOCK_ARTICLES[id]).filter(Boolean);

  return (
    <main className="min-h-screen bg-[#002740] text-white">
      <NavbarSimple />

      {/* Hero Image */}
      <div className="relative w-full h-[50vh] md:h-[65vh] mt-[85px]">
        <Image src={article.imageUrl} alt={article.title} fill className="object-cover" priority />
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
          <span className="text-white/40 text-[12px]">·</span>
          <span className="text-white/40 text-[12px]">{article.readTime}</span>
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
          {article.content.map((block, i) => {
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
                    <Image src={block.src} alt={block.caption} fill className="object-cover" />
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
        <div className="flex flex-wrap gap-2 mt-10">
          {article.tags.map((tag) => (
            <span key={tag} className="border border-white/20 rounded-full px-4 py-1 text-[12px] text-white/50 tracking-widest uppercase">
              {tag}
            </span>
          ))}
        </div>

        <div className="border-t border-white/10 my-12" />

        {/* Related Articles */}
        {related.length > 0 && (
          <section className="mb-16">
            <p className="text-[#CEA870] text-xs tracking-[0.3em] uppercase mb-6">Related</p>
            <div className="flex flex-col gap-4">
              {related.map((item) => (
                <Link key={item.id} href={`/feed/${item.id}`}
                  className="flex gap-4 group items-center">
                  <div className="relative w-[80px] h-[60px] shrink-0 rounded-sm overflow-hidden">
                    <Image src={item.imageUrl} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
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
