import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { localePath } from "@/lib/locale";

const BASE = "/blackIvory";

/* รายชื่อร้านค้าที่เข้าร่วม ททท. x Black Ivory Trail — URL นี้อยู่ใน QR ห้ามเปลี่ยน (/TATxBITT ตัวเก่าเด้งมาที่นี่ ดู next.config.mjs)
 * ตอนนี้ยังไม่มีรายชื่อ เป็นหน้า "เร็ว ๆ นี้" ไว้ก่อน ข้อความอยู่ใน messages/{th,en}/blackIvory.json → shops */
function Shops() {
  const t = useTranslations("blackIvory.shops");
  const locale = useLocale();
  return (
    <main
      className="flex min-h-dvh flex-col items-center px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[max(2.5rem,env(safe-area-inset-top))] text-center text-white"
      style={{ background: `url("${BASE}/mainBG.png") center/cover #0b2540` }}
    >
      <Link href={localePath("/black_ivory", locale)} aria-label="Black Ivory Trail Thailand">
        <Image src={`${BASE}/BITTLOGO.png`} alt="Mission Earth Black Ivory Trail Thailand" width={6643} height={3065} priority sizes="320px" className="w-[min(70vw,320px)]" />
      </Link>

      <div className="flex flex-1 flex-col items-center justify-center py-12">
        <span className="rounded-full bg-[#e5322d] px-5 py-1.5 text-sm font-bold sm:text-base">{t("kicker")}</span>
        <h1 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-5xl">{t("title")}</h1>
        <p className="mt-4 max-w-xl text-balance text-base text-white/80 sm:text-lg">{t("soon")}</p>
        <Link
          href={localePath("/black_ivory", locale)}
          className="mt-10 rounded-full bg-white px-7 py-3 font-bold text-[#0b2540] shadow-lg transition-transform hover:-translate-y-0.5"
        >
          {t("back")}
        </Link>
      </div>

      <Image src={`${BASE}/sponsors-2026-11.svg`} alt="ThaiBev, เมืองไทยประกันชีวิต, KBank, Amazing Thailand, AMMO" width={1020} height={94} unoptimized className="w-full max-w-2xl" />
    </main>
  );
}

export default async function TatShopsPage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Shops />;
}
