"use client";
import Image from "next/image";
import { useTranslations } from "next-intl";
import Popup, { NAVY } from "./Popup";

const BASE = "/blackIvory";
const BLUE = "#2b3f9e"; // น้ำเงินหัวข้อ/ตาราง ตามโปสเตอร์ Race Pack

/* รูปใน souvenir/ เตรียมมาจากไฟล์ที่ทีมส่งมา (ชื่อไทย/มีเว้นวรรค → เปลี่ยนเป็นชื่ออังกฤษ กันหาไม่เจอบน Linux)
 *   medal.jpg     ← 2026-10-29_เหรียญและสายคล้องBITT.svg (SVG 6.5MB แปลงเป็นรูป)
 *   shirts.png    ← แบบเสื้อส่งร้านBITT.png
 *   box.png       ← Artboard 4-80.png
 *   visor.jpg     ← Artboard 2-80.jpg
 *   trophies.jpg  ← Artboard 3-80.jpg
 *   buff.png      ← ตัดจาก iconPACK.png */
const RACE_PACK = [
  { src: "shirts.png", w: 1400, h: 680, id: "shirts", span: "col-span-2 sm:col-span-3" },
  { src: "buff.png", w: 553, h: 700, id: "buff" },
  { src: "box.png", w: 773, h: 1289, id: "box" },
  // มือถือมี 2 คอลัมน์ ชิ้นที่ 4 จะเหลือโดดตัวเดียว → ให้กินเต็มแถว
  { src: "medal.jpg", w: 988, h: 1400, id: "medal", span: "col-span-2 sm:col-span-1" },
];

const SIZES = [
  ["S", 36, 25],
  ["M", 38, 26],
  ["L", 40, 27],
  ["XL", 42, 28],
  ["2XL", 44, 29],
  ["3XL", 46, 29],
  ["4XL", 48, 30],
  ["5XL", 50, 30],
  ["6XL", 52, 31],
];

// สีกรอบของแต่ละระยะตามโปสเตอร์ Rewards
const REWARDS = [
  {
    km: "12",
    name: "Peak Challenge",
    ring: "#3b6bff",
    prize: ["5,000", "4,000", "3,000"],
    trophy: "1-5",
  },
  {
    km: "8",
    name: "Forest Trail",
    ring: "#35b6e6",
    prize: ["3,000", "2,000", "1,000"],
    trophy: "1-3",
  },
  { km: "5", name: "Fun Trail", ring: "#22a447" },
];

function SectionTitle({ children }) {
  return (
    <h3
      className="inline-block rounded-full px-6 py-1.5 text-lg font-semibold text-white sm:text-xl"
      style={{ backgroundColor: BLUE }}
    >
      {children}
    </h3>
  );
}

function ItemCard({ src, w, h, label, className = "" }) {
  return (
    <figure className={`flex flex-col rounded-2xl bg-white p-3 shadow-sm ${className}`}>
      <div className="relative flex flex-1 items-center justify-center">
        <Image
          src={`${BASE}/souvenir/${src}`}
          alt={label}
          width={w}
          height={h}
          sizes="(max-width: 640px) 90vw, 420px"
          className="max-h-48 w-auto object-contain sm:max-h-56"
        />
      </div>
      <figcaption className="mt-2 text-center text-sm font-semibold" style={{ color: NAVY }}>
        {label}
      </figcaption>
    </figure>
  );
}

function SizeChart() {
  const t = useTranslations("blackIvory.souvenir");
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
      <table className="w-full text-center tabular-nums">
        <thead className="text-white" style={{ backgroundColor: BLUE }}>
          <tr>
            <th className="py-2.5 font-semibold">
              Size <span className="text-xs font-normal opacity-80">(inch)</span>
            </th>
            <th className="py-2.5 font-semibold">{t("chest")}</th>
            <th className="py-2.5 font-semibold">{t("length")}</th>
          </tr>
        </thead>
        <tbody>
          {SIZES.map(([size, chest, length]) => (
            <tr key={size} className="border-t border-black/5">
              <td className="py-1.5 font-bold" style={{ color: BLUE }}>
                {size}
              </td>
              <td className="py-1.5 font-semibold">{chest}</td>
              <td className="py-1.5 font-semibold">{length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* หนึ่งแถวต่อหนึ่งระยะ — จอกว้างเรียงเป็นคอลัมน์เหมือนตารางในโปสเตอร์ มือถือซ้อนลงมา */
function RewardRow({ r }) {
  const t = useTranslations("blackIvory.souvenir");
  const ranks = t.raw("ranks");
  return (
    <div className="overflow-hidden rounded-2xl text-white sm:flex" style={{ backgroundColor: BLUE }}>
      <div
        className="flex shrink-0 items-center gap-3 border-[3px] px-5 py-3 sm:w-40 sm:flex-col sm:items-start sm:justify-center sm:gap-0 sm:rounded-2xl"
        style={{ backgroundColor: NAVY, borderColor: r.ring }}
      >
        <div className="text-5xl font-extrabold italic leading-none tracking-tight">
          {r.km}
          <span className="text-3xl">K</span>
        </div>
        <div className="text-sm font-semibold">{r.name}</div>
      </div>

      {r.prize ? (
        <div className="grid flex-1 gap-px bg-white/15 sm:grid-cols-[1.4fr_1fr_1fr]">
          <div className="px-4 py-3" style={{ backgroundColor: BLUE }}>
            <div className="text-xs font-medium text-white/70">
              {t("prizeLabel")} <span className="whitespace-nowrap">{t("top3")}</span>
            </div>
            <ol className="mt-1.5 space-y-1">
              {r.prize.map((baht, i) => (
                <li key={baht} className="flex items-center gap-2">
                  <span className="rounded-md bg-white px-1.5 text-xs font-semibold" style={{ color: BLUE }}>
                    {ranks[i]}
                  </span>
                  <span className="text-lg font-bold">{t("baht", { amount: baht })}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="px-4 py-3" style={{ backgroundColor: BLUE }}>
            <div className="text-xs font-medium text-white/70">{t("trophyLabel")}</div>
            <div className="mt-1.5 text-sm font-semibold">
              {t("trophyPrefix")} <span className="whitespace-nowrap">{t("trophyRange", { range: r.trophy })}</span>
            </div>
          </div>
          <div className="px-4 py-3" style={{ backgroundColor: NAVY }}>
            <div className="text-xs font-medium text-white/70">{t("visorLabel")}</div>
            <div className="mt-1.5 text-sm">
              {t("visorPrefix")} <span className="whitespace-nowrap font-bold">{t("visorTop")}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center px-4 py-5 text-lg font-medium">{t("noRace")}</div>
      )}
    </div>
  );
}

/* pop-up ของที่ระลึก — children คือสิ่งที่กดได้ (รูปชุดรางวัลในหน้า) */
export default function SouvenirDialog({ children, className = "" }) {
  const t = useTranslations("blackIvory.souvenir");
  return (
    <Popup
      className={className}
      label={t("label")}
      content={
        <div className="space-y-10 px-4 py-6 sm:px-8 sm:py-8">
          <section className="space-y-4">
            <SectionTitle>Race Pack</SectionTitle>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {RACE_PACK.map((item) => (
                <ItemCard key={item.src} {...item} label={t(`items.${item.id}`)} className={item.span ?? ""} />
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <SectionTitle>{t("sizes")}</SectionTitle>
            <div className="mx-auto max-w-md">
              <SizeChart />
            </div>
          </section>

          <section className="space-y-4">
            <SectionTitle>Rewards</SectionTitle>
            <div className="grid grid-cols-2 gap-3">
              <ItemCard src="trophies.jpg" w={1172} h={1116} label={t("items.trophies")} />
              <ItemCard src="visor.jpg" w={1277} h={1057} label={t("items.visor")} />
            </div>
            <div className="space-y-3">
              {REWARDS.map((r) => (
                <RewardRow key={r.km} r={r} />
              ))}
            </div>
            <p className="rounded-2xl bg-white/70 px-4 py-3 text-sm sm:text-base">
              <span className="font-bold" style={{ color: BLUE }}>
                Special!
              </span>{" "}
              {t("special")} <span className="whitespace-nowrap">{t("specialTail")}</span>
            </p>
          </section>
        </div>
      }
    >
      {children}
    </Popup>
  );
}
