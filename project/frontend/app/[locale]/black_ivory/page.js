import Image from "next/image";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import BackgroundVideo from "@/components/blackIvory/BackgroundVideo";
import FullscreenButton from "@/components/blackIvory/FullscreenButton";
import SouvenirDialog from "@/components/blackIvory/SouvenirDialog";
import DistanceDialog from "@/components/blackIvory/DistanceDialog";
import LangToggle from "@/components/blackIvory/LangToggle";
import SocialQrDialog from "@/components/blackIvory/SocialQrDialog";
import BibSearchDialog from "@/components/blackIvory/BibSearchDialog";
import { REVALIDATE } from "@/lib/blackIvoryRunners.mjs";
import { getBibData } from "@/lib/blackIvoryBib.mjs";
import AutoRefresh from "@/components/blackIvory/AutoRefresh";

const BASE = "/blackIvory";
const NAVY = "#0b2540";
// ลิงก์เดียวกับที่ฝังอยู่ใน qr-register-2026-11.png (Google Form สมัคร)
// เปลี่ยน QR เมื่อไร ให้ตั้งชื่อไฟล์ใหม่ด้วย — next/image เก็บรูปที่ย่อแล้วไว้ 30 วัน (minimumCacheTTL)
// ใช้ชื่อเดิมคนจะยังเห็น QR เก่าที่พาไปฟอร์มเก่า
const REGISTER_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLScTgb2Rnq_Zw_8cf4uodGdF15zAiMcZHqIGNmqpBXwNXFU39Q/viewform";

const DISTANCES = [
  { km: "5K", label: ["FUN TRAIL"] },
  { km: "8K", label: ["FOREST", "TRAIL"] },
  { km: "12K", label: ["PEAK", "CHALLENGE"] },
];

// contact.png เป็นรูปเดียวทั้งแถบ → วางปุ่มใสทับตามตำแหน่งไอคอนในรูป (% ของความกว้างรูป)
// ไอคอนโซเชียลกดแล้วขึ้น QR (qr) ส่วนชื่อเว็บเป็นลิงก์ธรรมดา
const CONTACT_LINKS = [
  { label: "Facebook", href: "https://www.facebook.com/profile.php?id=61567764698039", qr: "qr-facebook.svg", left: 0, width: 6.3 },
  { label: "LINE", href: "https://lin.ee/MDN9uJ4", qr: "qr-line.svg", left: 10.6, width: 6.3 },
  { label: "Instagram", href: "https://instagram.com/missionearth.co/", qr: "qr-instagram.svg", left: 21.1, width: 6.3 },
  { label: "www.missionearth.co", href: "/", left: 38.6, width: 61.4 },
];

/* ขนาดทุกอย่างอิงความกว้างจอ (vw) เพื่อให้หน้าตาเหมือนโปสเตอร์ไม่ว่าจอใหญ่เล็ก
   ตัวหนังสือในกล่องย่อยใช้ em = ปรับขนาดทั้งกล่องได้ด้วยการเปลี่ยน text-[..] ที่ตัวกล่องอย่างเดียว */

// ใต้ชื่อระยะโชว์จำนวนนักวิ่งประเภท Race (แท็บ BIB ใน Sheet ทีม) เฉพาะระยะที่แข่งจริง — 5K เป็น Fun Trail ไม่โชว์

/* แถบระยะทาง — ตัวเลข 5K/8K/12K ชิดบนเท่ากันทุกคอลัมน์ (ชื่อระยะยาวไม่เท่ากัน ถ้าจัดกึ่งกลางตัวเลขจะเหลื่อม)
   ชื่อระยะจองที่ไว้สองบรรทัดเสมอ บรรทัดยอดนักวิ่งข้างใต้จึงตรงกันทุกคอลัมน์ด้วย */
function Distances({ race, className = "" }) {
  const t = useTranslations("blackIvory.runners");
  return (
    <div className={`flex items-stretch text-white ${className}`} style={{ backgroundColor: NAVY }}>
      {DISTANCES.map((d, i) => (
        <div key={d.km} className="flex flex-1 items-center">
          {i > 0 && <span className="h-[0.8em] w-px bg-white/70" />}
          <div className="flex-1 self-start text-center leading-none">
            <div className="text-[1em] font-bold tracking-tight">{d.km}</div>
            <div className="mt-[0.3em] min-h-[2.5em] text-[0.42em] font-medium leading-tight">
              {d.label.map((l) => (
                <div key={l}>{l}</div>
              ))}
            </div>
            {race?.[d.km] && (
              <>
                <div className="mx-auto mt-[0.35em] w-fit whitespace-nowrap rounded-full bg-[#e5322d] px-[0.8em] py-[0.25em] text-[0.3em] font-bold shadow-sm">
                  {t("raceCount", { count: race[d.km].total.toLocaleString("en-US") })}
                </div>
                <div className="mt-[0.3em] whitespace-nowrap text-[0.27em] font-medium text-white/80">
                  {t("raceSexes", { men: race[d.km].M, women: race[d.km].F })}
                </div>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function QrCard({ className = "" }) {
  const t = useTranslations("blackIvory");
  return (
    <a
      href={REGISTER_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`block transition-transform hover:-translate-y-1 ${className}`}
    >
      <div
        className="rounded-t-[1.5em] py-[0.35em] text-center font-semibold text-white"
        style={{ backgroundColor: NAVY }}
      >
        {t("register")}
      </div>
      <div className="bg-white p-[0.5em]">
        <Image src={`${BASE}/qr-register-2026-11.png`} alt={t("qrAlt")} width={500} height={500} className="w-full" />
      </div>
    </a>
  );
}

function Contact({ className = "" }) {
  return (
    <div className={`relative ${className}`}>
      <Image src={`${BASE}/contact.png`} alt="" width={7572} height={508} sizes="40vw" className="w-full" />
      {CONTACT_LINKS.map((c) => (
        <div key={c.label} className="absolute inset-y-0" style={{ left: `${c.left}%`, width: `${c.width}%` }}>
          {c.qr ? (
            <SocialQrDialog name={c.label} href={c.href} qr={`${BASE}/social/${c.qr}`} className="block h-full w-full" />
          ) : (
            <a href={c.href} aria-label={c.label} className="block h-full w-full" />
          )}
        </div>
      ))}
    </div>
  );
}

function RegisterLabel() {
  return useTranslations("blackIvory")("register");
}

function EventDate({ className = "" }) {
  const t = useTranslations("blackIvory");
  return (
    <div className={`leading-tight text-white ${className}`}>
      <div className="text-[1em] font-bold tracking-tight">20-21 Nov 2026</div>
      <div className="text-[0.56em] font-medium">{t("place")}</div>
    </div>
  );
}

const Logo = ({ className, sizes }) => (
  <Image
    src={`${BASE}/BITTLOGO.png`}
    alt="Mission Earth Black Ivory Trail Thailand"
    width={6643}
    height={3065}
    priority
    sizes={sizes}
    className={className}
  />
);

const Sponsors = ({ className, sizes }) => (
  <Image
    src={`${BASE}/sponsorkmba.png`}
    alt="ThaiBev, เมืองไทยประกันชีวิต, KBank, supported by AMMO"
    width={5692}
    height={668}
    sizes={sizes}
    className={className}
  />
);

function Prizes({ className, sizes }) {
  const t = useTranslations("blackIvory");
  return (
    <Image
      src={`${BASE}/iconPACK.png`}
      alt={t("prizesAlt")}
      width={4169}
      height={1931}
      sizes={sizes}
      className={className}
    />
  );
}

// ป้ายเล็กใต้รูปชุดรางวัล บอกว่ากดดูรายละเอียดได้ (ขนาดตาม text-[..] ของปุ่มที่ครอบ)
function SouvenirHint() {
  const t = useTranslations("blackIvory");
  return (
    <span className="rounded-full px-[1em] py-[0.35em] font-semibold text-white" style={{ backgroundColor: NAVY }}>
      {t("souvenirHint")}
    </span>
  );
}

// ปุ่มแดงเด่น ๆ เปิดตารางรายชื่อนักวิ่ง — ให้คนที่สมัครแล้วเข้ามาเช็คชื่อตัวเองได้ง่าย
function BibButton({ entries, summary, className = "" }) {
  const t = useTranslations("blackIvory.bib");
  if (!entries?.length) return null;
  return (
    <BibSearchDialog
      entries={entries}
      summary={summary}
      className={`flex items-center justify-center gap-[0.5em] whitespace-nowrap rounded-full bg-[#e5322d] px-[1.3em] py-[0.55em] font-bold text-white shadow-lg transition-[filter,transform] hover:-translate-y-0.5 hover:brightness-110 ${className}`}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="h-[1.1em] w-[1.1em]" aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <path d="M20 20l-4-4" />
      </svg>
      {t("button", { count: entries.length.toLocaleString("en-US") })}
    </BibSearchDialog>
  );
}

/* จอแนวนอน — วางตามโปสเตอร์ (อ้างอิงแบบกว้าง 1174px: px ÷ 11.74 = vw) */
function LandscapeLayout({ bibs }) {
  return (
    <div className="flex min-h-dvh flex-col portrait:hidden">
      <header className="flex items-start justify-between">
        <div className="ml-[2.6vw] mt-[2.1vw] flex flex-col items-start gap-[1.6vw]">
          <Logo sizes="20vw" className="w-[18.5vw]" />
          <BibButton entries={bibs?.list} summary={bibs?.summary} className="text-[1.6vw]" />
        </div>
        <LangToggle className="ml-auto mr-[1.7vw] mt-[2.1vw] min-h-8 py-[0.4em] text-[1.1vw]" />
        <DistanceDialog className="block transition-[filter] hover:brightness-125">
          <Distances race={bibs?.race} className="w-[37.5vw] rounded-bl-[5vw] py-[1.4vw] pl-[3vw] pr-[1vw] text-[3.7vw]" />
        </DistanceDialog>
      </header>

      <div className="flex flex-1 items-end justify-end gap-[1.7vw] px-[1.7vw] pb-[1.4vw] pt-[2vw]">
        {/* ปุ่มเต็มจอชิดซ้ายล่าง ตรงที่โปสเตอร์ปล่อยว่างให้เห็นวิดีโอ */}
        <FullscreenButton className="mr-auto ml-[0.9vw] h-[3vw] min-h-9 w-[3vw] min-w-9" />
        <SouvenirDialog className="group flex w-[22vw] flex-col items-center gap-[0.6vw] text-[1vw]">
          <Prizes sizes="22vw" className="w-full transition-transform group-hover:-translate-y-1" />
          <SouvenirHint />
        </SouvenirDialog>
        <QrCard className="w-[13.8vw] text-[1.7vw]" />
      </div>

      <footer
        className="flex items-center justify-between gap-[3vw] px-[2.6vw] py-[1.4vw] pb-[max(1.4vw,env(safe-area-inset-bottom))]"
        style={{ backgroundColor: NAVY }}
      >
        <Sponsors sizes="40vw" className="w-[39vw]" />
        <Contact className="w-[27vw]" />
        <EventDate className="text-right text-[2.6vw]" />
      </footer>
    </div>
  );
}

/* จอแนวตั้ง (มือถือ) — ไม่มีแบบใน Figma จัดเรียงลงมาเป็นแนวเดียว
   QR เปลี่ยนเป็นปุ่มกด เพราะคนดูบนมือถือสแกนจอตัวเองไม่ได้ */
function PortraitLayout({ bibs }) {
  return (
    <div className="flex min-h-dvh flex-col landscape:hidden">
      <header className="flex items-start justify-between px-[6vw] pt-[max(8vw,env(safe-area-inset-top))]">
        <Logo sizes="65vw" className="w-[62vw]" />
        <div className="flex items-center gap-2">
          <LangToggle className="h-11 text-sm" />
          <FullscreenButton className="h-11 w-11" />
        </div>
      </header>

      <DistanceDialog className="mx-[6vw] mt-[6vw] block">
        <Distances race={bibs?.race} className="rounded-[5vw] py-[4vw] text-[9vw]" />
      </DistanceDialog>
      <BibButton entries={bibs?.list} summary={bibs?.summary} className="mx-[6vw] mt-[4vw] py-[0.7em] text-[5vw]" />

      <div className="flex flex-1 flex-col items-center justify-end gap-[5vw] px-[6vw] pb-[6vw] pt-[10vw]">
        <SouvenirDialog className="flex w-[85vw] flex-col items-center gap-[2vw] text-[3.4vw]">
          <Prizes sizes="85vw" className="w-full" />
          <SouvenirHint />
        </SouvenirDialog>
        <a
          href={REGISTER_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full rounded-full bg-white py-[4vw] text-center text-[5.5vw] font-bold"
          style={{ color: NAVY }}
        >
          <RegisterLabel />
        </a>
      </div>

      <footer
        className="flex flex-col items-center gap-[5vw] px-[6vw] pt-[6vw] pb-[max(6vw,env(safe-area-inset-bottom))]"
        style={{ backgroundColor: NAVY }}
      >
        <EventDate className="text-center text-[8vw]" />
        <Contact className="w-[80vw]" />
        <Sponsors sizes="90vw" className="w-[88vw]" />
      </footer>
    </div>
  );
}

export default async function BlackIvoryPage({ params }) {
  // ส่ง locale ให้ next-intl เอง ไม่งั้นตอน build หน้าไว้ล่วงหน้าทั้ง /th และ /en จะได้ภาษาเริ่มต้นทั้งคู่
  const { locale } = await params;
  setRequestLocale(locale);
  const bibs = await getBibData();
  return (
    <>
      <BackgroundVideo />
      {bibs && <AutoRefresh everyMs={REVALIDATE * 1000} />}
      <main className="relative z-10">
        <LandscapeLayout bibs={bibs} />
        <PortraitLayout bibs={bibs} />
      </main>
    </>
  );
}
