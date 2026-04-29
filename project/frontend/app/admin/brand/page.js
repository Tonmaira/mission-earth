import Image from "next/image";

export default function BrandGuidelinePage() {
  return (
    <div className="space-y-10 max-w-4xl">

      {/* Hero */}
      <div
        className="w-full rounded-3xl flex flex-col items-center justify-center py-24 px-8 text-center gap-8"
        style={{ backgroundColor: "#edebe6" }}
      >
        <p className="text-sm tracking-[0.3em] uppercase" style={{ color: "#b5a98a" }}>
          Brand Guidelines 2026
        </p>
        <Image
          src="/full-logo-me.svg"
          alt="Mission Earth"
          width={280}
          height={90}
          className="object-contain opacity-30"
        />
        <div>
          <p className="text-2xl font-medium tracking-wide" style={{ color: "#a09880" }}>
            Visual Identity &amp; Communication
          </p>
          <p className="text-sm mt-1" style={{ color: "#b5a98a" }}>
            คู่มือการใช้งานดีไซน์
          </p>
        </div>
      </div>

    </div>
  );
}
