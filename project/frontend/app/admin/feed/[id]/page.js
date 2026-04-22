"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function EditArticlePage({ params }) {
  const router = useRouter();
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-white text-2xl font-semibold">แก้ไขบทความ #{params.id}</h1>
        <p className="text-gray-400 text-sm mt-1">ฟีเจอร์นี้จะพร้อมใช้เมื่อเชื่อมต่อ Database</p>
      </div>
      <div className="bg-[#052032] border border-white/5 rounded-2xl p-8 text-center space-y-4">
        <svg className="w-12 h-12 text-gray-600 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7M10 11v6M14 11v6M1 7h22M8 7V5c0-1 .5-2 2-2h4c1.5 0 2 1 2 2v2" />
        </svg>
        <p className="text-gray-400">ต้องการ Database เพื่อแก้ไขบทความ</p>
        <Link href="/admin/feed" className="inline-block border border-white/10 text-gray-400 px-5 py-2 rounded-full text-sm hover:border-white/30 transition-all">
          กลับ
        </Link>
      </div>
    </div>
  );
}
