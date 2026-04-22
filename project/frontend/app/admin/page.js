import Link from "next/link";

const STATS = [
  { label: "บทความทั้งหมด", value: "5", sub: "Earth Feed", href: "/admin/feed", color: "#CEA870" },
  { label: "กิจกรรม", value: "3", sub: "Activities", href: "/admin/activities", color: "#7EB8A4" },
  { label: "แบบประเมิน", value: "1", sub: "Survey", href: "/survey/readiness", color: "#8BA7C2" },
];

const QUICK = [
  { label: "เขียนบทความใหม่", href: "/admin/feed/new", icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" },
  { label: "ดูหน้าเว็บ", href: "/", icon: "M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-white text-2xl font-semibold">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">ยินดีต้อนรับสู่ Mission Earth Admin</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {STATS.map((s) => (
          <Link key={s.label} href={s.href}
            className="bg-[#052032] border border-white/5 rounded-2xl p-6 hover:border-[#CEA870]/20 transition-all group">
            <p className="text-gray-500 text-xs uppercase tracking-widest mb-3">{s.sub}</p>
            <p className="text-4xl font-bold mb-1" style={{ color: s.color }}>{s.value}</p>
            <p className="text-gray-300 text-sm group-hover:text-white transition-colors">{s.label}</p>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <p className="text-gray-400 text-xs uppercase tracking-widest mb-3">Quick Actions</p>
        <div className="flex flex-wrap gap-3">
          {QUICK.map((q) => (
            <Link key={q.label} href={q.href}
              className="flex items-center gap-2 border border-[#CEA870]/30 text-[#CEA870] px-5 py-2.5 rounded-full text-sm hover:bg-[#CEA870] hover:text-[#002740] transition-all">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={q.icon} />
              </svg>
              {q.label}
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}
