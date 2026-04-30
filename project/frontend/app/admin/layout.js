"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const NAV = [
  { label: "Dashboard", href: "/admin", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { label: "Earth Feed", href: "/admin/feed", icon: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" },
  { label: "Activities", href: "/admin/activities", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
  { label: "Brand Guideline", href: "/brand-guide", icon: "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push("/login");
    });
  }, [router]);

  return (
    <div className="min-h-screen bg-[#001a2c] flex">

      {/* Sidebar */}
      <aside className={`${collapsed ? "w-16" : "w-56"} shrink-0 bg-[#002740] border-r border-white/5 flex flex-col transition-all duration-300`}>

        {/* Logo */}
        <div className={`h-[64px] flex items-center ${collapsed ? "justify-center px-2" : "px-5"} border-b border-white/5`}>
          {!collapsed && (
            <Image src="/full-logo-me.svg" alt="Mission Earth" width={100} height={30} className="object-contain" />
          )}
          {collapsed && (
            <Image src="/icon/goldenme.png" alt="ME" width={28} height={28} className="object-contain" />
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 flex flex-col gap-1 px-2">
          {NAV.map((item) => {
            const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                  active ? "bg-[#CEA870]/15 text-[#CEA870]" : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}>
                <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                </svg>
                {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-2 border-t border-white/5 space-y-1">
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-500 hover:text-white hover:bg-white/5 transition-all text-sm">
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            {!collapsed && <span>View Site</span>}
          </Link>
          <button onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-500 hover:text-white hover:bg-white/5 transition-all text-sm">
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={collapsed ? "M13 5l7 7-7 7M5 5l7 7-7 7" : "M11 19l-7-7 7-7m8 14l-7-7 7-7"} />
            </svg>
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-h-screen overflow-auto">
        {/* Topbar */}
        <div className="h-[64px] bg-[#002740] border-b border-white/5 flex items-center justify-between px-6 shrink-0">
          <p className="text-white/40 text-sm">Admin Panel</p>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#CEA870]/20 border border-[#CEA870]/30 flex items-center justify-center">
              <span className="text-[#CEA870] text-xs font-bold">A</span>
            </div>
            <span className="text-gray-400 text-sm">Admin</span>
          </div>
        </div>

        <div className="flex-1 p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
