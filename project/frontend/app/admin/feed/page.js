import Link from "next/link";
import Image from "next/image";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function getArticles() {
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return [];
  return data.map(a => ({
    id: a.id,
    title: a.title,
    sub: a.sub,
    cat: a.cat,
    date: a.date,
    imageUrl: a.image_url,
  }));
}

const CAT_COLOR = {
  "ME Update": "#CEA870",
  "Event": "#7EB8A4",
  "News": "#8BA7C2",
};

export default async function AdminFeedPage() {
  const articles = await getArticles();

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-2xl font-semibold">Earth Feed</h1>
          <p className="text-gray-400 text-sm mt-1">{articles.length} บทความ</p>
        </div>
        <Link href="/admin/feed/new"
          className="flex items-center gap-2 bg-[#CEA870] text-[#002740] px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-[#CEA870]/90 active:scale-95 transition-all">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          บทความใหม่
        </Link>
      </div>

      {/* Table */}
      <div className="bg-[#052032] rounded-2xl border border-white/5 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-left text-xs text-gray-500 uppercase tracking-widest px-6 py-4">บทความ</th>
              <th className="text-left text-xs text-gray-500 uppercase tracking-widest px-4 py-4 hidden md:table-cell">หมวด</th>
              <th className="text-left text-xs text-gray-500 uppercase tracking-widest px-4 py-4 hidden md:table-cell">วันที่</th>
              <th className="px-4 py-4"></th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr key={article.id} className={`border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors`}>
                {/* Title + image */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="relative w-14 h-10 rounded-lg overflow-hidden shrink-0 bg-[#001f33]">
                      {article.imageUrl && (
                        <Image src={article.imageUrl} alt={article.title} fill className="object-cover" />
                      )}
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{article.title}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{article.sub}</p>
                    </div>
                  </div>
                </td>
                {/* Cat */}
                <td className="px-4 py-4 hidden md:table-cell">
                  <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: `${CAT_COLOR[article.cat] ?? "#CEA870"}20`, color: CAT_COLOR[article.cat] ?? "#CEA870" }}>
                    {article.cat}
                  </span>
                </td>
                {/* Date */}
                <td className="px-4 py-4 hidden md:table-cell">
                  <p className="text-gray-400 text-sm">{article.date}</p>
                </td>
                {/* Actions */}
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2 justify-end">
                    <Link href={`/feed/${article.id}`} target="_blank"
                      className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-all">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </Link>
                    <Link href={`/admin/feed/${article.id}`}
                      className="p-2 rounded-lg text-gray-500 hover:text-[#CEA870] hover:bg-[#CEA870]/10 transition-all">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
