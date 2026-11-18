import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { localePath } from "@/lib/locale";
import { formatPhone, getShops } from "@/lib/blackIvoryShops.mjs";

const BASE = "/blackIvory";
const RED = "#e5322d";

/* รายชื่อร้านค้าที่เข้าร่วม ททท. x Black Ivory Trail — URL นี้อยู่ใน QR ห้ามเปลี่ยน (/TATxBITT ตัวเก่าเด้งมาที่นี่ ดู next.config.mjs)
 * รายชื่อดึงจาก Google Form ของร้าน (lib/blackIvoryShops.mjs) อ่าน Sheet ไม่ได้ก็ขึ้นว่า "เร็ว ๆ นี้" แทน
 * ข้อความอยู่ใน messages/{th,en}/blackIvory.json → shops */
function Shops({ shops }) {
  const t = useTranslations("blackIvory.shops");
  const locale = useLocale();
  return (
    <main className="relative isolate flex min-h-dvh flex-col items-center px-4 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[max(2.5rem,env(safe-area-inset-top))] text-white sm:px-6">
      {/* พื้นหลังค้างไว้ทั้งจอ — background-attachment: fixed ใช้ไม่ได้บน iOS Safari */}
      <div className="fixed inset-0 -z-10" style={{ background: `url("${BASE}/mainBG.png") center/cover #0b2540` }} />
      <Link href={localePath("/black_ivory", locale)} aria-label="Black Ivory Trail Thailand">
        <Image src={`${BASE}/BITTLOGO.png`} alt="Mission Earth Black Ivory Trail Thailand" width={6643} height={3065} priority sizes="320px" className="w-[min(60vw,280px)]" />
      </Link>

      <div className="mt-8 flex flex-col items-center text-center">
        <span className="rounded-full px-5 py-1.5 text-sm font-bold sm:text-base" style={{ backgroundColor: RED }}>
          {t("kicker")}
        </span>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl">{t("title")}</h1>
        {shops && <p className="mt-2 text-white/75 sm:text-lg">{t("count", { count: shops.length })}</p>}
      </div>

      {shops ? (
        <ul className="mt-8 grid w-full max-w-5xl gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {shops.map((s) => (
            <ShopCard key={`${s.name}-${s.address}`} shop={s} t={t} />
          ))}
        </ul>
      ) : (
        <p className="mt-6 max-w-xl text-balance text-center text-base text-white/80 sm:text-lg">{t("soon")}</p>
      )}

      <Link
        href={localePath("/black_ivory", locale)}
        className="mb-12 mt-10 rounded-full bg-white px-7 py-3 font-bold text-[#0b2540] shadow-lg transition-transform hover:-translate-y-0.5"
      >
        {t("back")}
      </Link>

      <Image src={`${BASE}/sponsors-2026-11.svg`} alt="ThaiBev, เมืองไทยประกันชีวิต, KBank, Amazing Thailand, AMMO" width={1020} height={94} unoptimized className="mt-auto w-full max-w-2xl" />
    </main>
  );
}

function ShopCard({ shop: s, t }) {
  return (
    <li className="flex flex-col rounded-2xl bg-[#0b2540]/80 p-5 backdrop-blur-sm">
      {s.type && (
        <span className="self-start rounded-full bg-white/15 px-3 py-0.5 text-xs font-semibold text-white/90">{s.type}</span>
      )}
      <h2 className="mt-2 text-lg font-extrabold leading-snug">{s.name}</h2>
      {s.nameEn && <p className="text-sm text-white/60">{s.nameEn}</p>}

      <a href={s.map} target="_blank" rel="noopener noreferrer" className="group mt-3 flex gap-2 text-sm text-white/85 hover:text-white">
        <svg viewBox="0 0 24 24" fill="none" stroke={RED} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true">
          <path d="M12 21s-7-6.2-7-11.5a7 7 0 1 1 14 0C19 14.8 12 21 12 21z" />
          <circle cx="12" cy="9.5" r="2.5" />
        </svg>
        <span>
          {s.address}{" "}
          <span className="whitespace-nowrap font-semibold underline decoration-white/40 underline-offset-2 group-hover:decoration-white">{t("map")}</span>
        </span>
      </a>

      {s.phones.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm">
          <svg viewBox="0 0 24 24" fill="none" stroke={RED} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true">
            <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
          </svg>
          {s.phones.map((p) => (
            <a key={p} href={`tel:${p}`} className="font-semibold tabular-nums hover:underline">
              {formatPhone(p)}
            </a>
          ))}
        </div>
      )}
    </li>
  );
}

export default async function TatShopsPage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Shops shops={await getShops()} />;
}
