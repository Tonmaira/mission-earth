"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

const SURVEYS = [
  {
    id: "readiness",
    title: "แบบประเมินความยั่งยืนองค์กรเบื้องต้น",
    subtitle: "(Preliminary ESG Scoring Checklist)",
    desc: "ประเมินความพร้อมขององค์กรในการดำเนินธุรกิจอย่างยั่งยืน",
    image: "/nature-image/DSC07442.jpg",
    href: "/survey/readiness",
  },
];

export default function SurveyPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#002740] flex flex-col items-center justify-center px-4 py-16 gap-8">

      {/* Header */}
      <div className="text-center mb-4">
        <p className="text-[#CEA870] text-xs tracking-[0.4em] uppercase font-medium mb-2">Mission Earth</p>
        <h1 className="text-white text-3xl md:text-4xl font-semibold">แบบประเมิน</h1>
        <p className="text-gray-400 text-sm mt-2">เลือกแบบประเมินที่ต้องการทำ</p>
      </div>

      {/* Cards */}
      <div className="flex flex-col md:flex-row gap-6 w-full max-w-5xl">
        {SURVEYS.map((s) => (
          <div
            key={s.id}
            className="flex-1 bg-[#052032] rounded-[20px] overflow-hidden flex flex-col md:flex-row h-auto md:h-[400px] cursor-pointer group"
            onClick={() => router.push(s.href)}
          >
            {/* Image */}
            <div className="relative w-full md:w-1/2 h-52 md:h-full shrink-0 overflow-hidden">
              <Image
                src={s.image}
                alt={s.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-[#002740]/30" />
            </div>

            {/* Content */}
            <div className="flex flex-col items-center justify-center gap-6 p-8 flex-1 text-center">
              <div className="space-y-2">
                <h2 className="text-white text-xl font-semibold leading-snug">{s.title}</h2>
                <p className="text-[#CEA870] text-sm font-medium">{s.subtitle}</p>
                <p className="text-gray-400 text-sm leading-relaxed mt-2">{s.desc}</p>
              </div>

              <button
                onClick={() => router.push(s.href)}
                className="border border-[#CEA870] text-[#CEA870] px-6 py-2 rounded-full text-sm hover:bg-[#CEA870] hover:text-[#002740] transition-all duration-300 font-medium"
              >
                เริ่มทำแบบทดสอบ
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Back */}
      <a href="/" className="text-gray-600 text-xs hover:text-[#CEA870] transition-colors flex items-center gap-2 mt-4">
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to home
      </a>
    </main>
  );
}
