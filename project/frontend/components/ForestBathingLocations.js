"use client";
import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Image from "next/image";
import ForestBathingCalendar from "@/components/ForestBathingCalendar";
import IconClose from "@/components/IconClose";
import TranslateIcon from "@/components/TranslateIcon";
import { useLang } from "@/lib/LanguageContext";
import { useLocalePath } from "@/lib/useLocalePath";
import {
  INSTRUCTORS,
  LOCATIONS,
  formatTrip,
  nextTrip,
  tripDates,
  tripLength,
  tripAndLocationForDate,
  openLocationDates,
} from "@/lib/forestBathing";

/** "2 วัน 1 คืน" / "2 days, 1 night" — เลือก key ให้ถูกพจน์ตอนคืนมากกว่า 1
 *  ทริปวันเดียวที่มี trip.hours (เช่น Urban Forest Bathing) โชว์เป็นจำนวนชั่วโมงแทน */
const useTripDuration = () => {
  const { t } = useLang();
  return (trip) => {
    if (trip.hours) {
      const key = trip.hours === 1 ? "hour" : "hours";
      return t(`forestBathing.booking.${key}`, { hours: trip.hours });
    }
    const { days, nights } = tripLength(trip);
    const key = nights === 1 ? "duration" : "durationPlural";
    return t(`forestBathing.booking.${key}`, { days, nights });
  };
};

/** ชื่อ + จังหวัด + คำบรรยายของสถานที่ ตามภาษาที่เลือก */
const useLocationText = (id) => {
  const { t } = useLang();
  return {
    name: t(`forestBathing.locations.items.${id}.name`),
    region: t(`forestBathing.locations.items.${id}.region`),
    blurb: t(`forestBathing.locations.items.${id}.blurb`),
  };
};

/** เนื้อหารายหัวข้อในป็อปอัพจอง ตามภาษาที่เลือก
 *  ข้อความอยู่ใน messages/{en,th}.json ส่วนค่าที่ไม่ใช่ข้อความ (mapUrl)
 *  อยู่กับตัวสถานที่ใน lib/forestBathing.js — ที่นี่รวมสองฝั่งเข้าด้วยกัน */
const useLocationSections = (location) => {
  const { t } = useLang();
  // t.raw() เพราะค่าที่ได้เป็นอ็อบเจ็กต์ ไม่ใช่ข้อความ — t() รับได้เฉพาะข้อความ
  // สถานที่ที่ยังไม่ได้เขียนเนื้อหาจะไม่มีคีย์นี้ next-intl คืน undefined มา
  // แล้วหน้าจะขึ้น "กำลังจัดเตรียม" ตามเดิม
  let text;
  try {
    text = t.raw(`forestBathing.locations.items.${location.id}.sections`);
  } catch {
    text = undefined;
  }
  const translated = text && typeof text === "object" ? text : {};
  const { mapUrl } = location.sections?.location ?? {};
  return { ...translated, location: { ...translated.location, mapUrl } };
};

const formatPrice = (n) => `THB ${n.toLocaleString("en-US")}`;

/**
 * ส่วนลดเป็น % จากราคาเต็ม ปัดเป็นจำนวนเต็ม — คำนวณสด ไม่ได้เก็บไว้ในข้อมูล
 * เพื่อไม่ให้ตัวเลข % ค้างเป็นค่าเก่าเวลามีคนแก้ราคาแล้วลืมแก้ %
 * คืน 0 เมื่อไม่ได้ตั้งราคาเต็มไว้ หรือราคาเต็มไม่ได้สูงกว่าราคาขาย
 */
const discountPct = (trip) => {
  const full = Number(trip?.fullPrice) || 0;
  const now = Number(trip?.price) || 0;
  if (!full || !now || full <= now) return 0;
  return Math.round(((full - now) / full) * 100);
};

/** ไอคอนกล้อง — ไฟล์ต้นฉบับเป็นเส้นสีเข้ม ใช้ brightness-0 invert กลับเป็นสีขาวให้เห็นบนป้ายพื้นดำ
 *  (แพตเทิร์นเดียวกับที่หน้า Ekiden ใช้กลับสีโลโก้) */
function CameraIcon({ className }) {
  return (
    <Image
      src="/icon/cameraIcon.svg"
      alt=""
      width={446}
      height={340}
      className={`brightness-0 invert ${className}`}
    />
  );
}

function PinIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 22s7-7.58 7-12.5A7 7 0 0 0 5 9.5C5 14.42 12 22 12 22Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="12" cy="9.5" r="2.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

/** Mission Earth × ROH — โลโก้ขาวเล็ก ๆ มุมซ้ายบนของรูป
 *  drop-shadow ไว้กันโลโก้ขาวจมกับส่วนสว่างของรูป */
function CoBrandLockup() {
  return (
    <div className="pointer-events-none absolute left-3 top-3 z-10 flex items-center gap-2 drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)]">
      <Image
        src="/full-logo-me-white.svg"
        alt="Mission Earth"
        width={1447}
        height={451}
        className="h-[16px] w-auto"
      />
      <span aria-hidden className="text-[11px] font-light leading-none text-white/80">
        ×
      </span>
      <Image
        src="/credential/LOGO ROH &Tagline-04.png"
        alt="ROH"
        width={1959}
        height={751}
        className="h-[20px] w-auto"
      />
    </div>
  );
}

function LocationCard({ location, onOpen }) {
  const { t, lang } = useLang();
  const { name, region, blurb } = useLocationText(location.id);
  const duration = useTripDuration();
  const next = nextTrip(location);

  return (
    <button
      type="button"
      onClick={() => onOpen(location)}
      className="group flex w-full flex-col overflow-hidden rounded-lg border border-white/80 bg-white/10 text-left transition-colors hover:border-[#FCF063]"
    >
      <div className="relative h-[247px] w-full shrink-0 overflow-hidden">
        <Image
          src={location.image}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, 429px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {location.withRoh && <CoBrandLockup />}
      </div>

      <div className="flex flex-1 flex-col px-4 pb-4 pt-3">
        <h3 className="text-[23px] leading-tight text-white">{name}</h3>
        <p className="mt-1 text-[16px] leading-tight text-white/80">{region}</p>

        <p className="mt-3 flex-1 text-[16px] font-light leading-relaxed text-white">{blurb}</p>

        {/* NOTE: Figma ไม่มีบรรทัดสถานะกับปุ่มนี้ แต่หน้านี้มีไว้เพื่อจอง
            ถ้าไม่มี คนจะแยกไม่ออกว่าที่ไหนเปิด/ไม่เปิด และไม่มีอะไรให้กด */}
        <div className="mt-4 flex flex-col gap-3 border-t border-white/20 pt-4">
          {location.isOpen && next ? (
            <div className="flex flex-col gap-0.5">
              <p className="text-[14px] text-[#FCF063]">
                {t("forestBathing.card.nextSession")} · {formatTrip(next, lang)}
              </p>
              <p className="text-[13px] text-white/50">{duration(next)}</p>
            </div>
          ) : (
            <p className="text-[14px] text-white/50">{t("forestBathing.card.notOpen")}</p>
          )}

          <span
            className={`inline-block rounded-full px-5 py-2 text-center text-[14px] font-medium transition-colors ${
              location.isOpen
                ? "bg-[#FCF063] text-[#002740] group-hover:bg-white"
                : "border border-white/40 text-white/80 group-hover:border-[#FCF063] group-hover:text-[#FCF063]"
            }`}
          >
            {location.isOpen ? t("forestBathing.card.book") : t("forestBathing.card.notify")}
          </span>
        </div>
      </div>
    </button>
  );
}

function NotifyForm({ location, name }) {
  const { t } = useLang();
  const [email, setEmail] = useState("");
  const [state, setState] = useState("idle"); // idle | sending | done | error
  const [message, setMessage] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setState("sending");
    setMessage("");

    try {
      const res = await fetch("/api/forest-bathing/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, locationId: location.id }),
      });
      const data = await res.json();

      if (!res.ok) {
        setState("error");
        setMessage(t("forestBathing.notify.failed"));
        return;
      }

      setState("done");
      setMessage(
        data.alreadySubscribed
          ? t("forestBathing.notify.already")
          : t("forestBathing.notify.done")
      );
    } catch {
      setState("error");
      setMessage(t("forestBathing.notify.network"));
    }
  };

  if (state === "done") {
    return (
      <p className="rounded-xl border border-[#CEA870]/40 bg-[#CEA870]/10 px-4 py-3 text-[14px] text-[#484848]">
        {message}
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3">
      <label htmlFor="notify-email" className="text-[14px] text-[#484848]/70">
        {t("forestBathing.notify.label", { name })}
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          id="notify-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("forestBathing.notify.placeholder")}
          className="flex-1 rounded-full border border-black/10 bg-black/[0.02] px-5 py-3 text-[15px] text-[#484848] placeholder:text-black/30 focus:border-[#CEA870] focus:outline-none"
        />
        <button
          type="submit"
          disabled={state === "sending"}
          className="rounded-full bg-[#FDF164] px-6 py-3 text-[15px] font-medium text-[#484848] transition-colors hover:bg-[#f5e94f] disabled:opacity-50"
        >
          {state === "sending"
            ? t("forestBathing.notify.sending")
            : t("forestBathing.notify.submit")}
        </button>
      </div>
      {state === "error" && <p className="text-[14px] text-red-600">{message}</p>}
    </form>
  );
}

/** หัวข้อในแถบไอคอนซ้ายของ modal (Figma node 135:3496)
 *  แยก 2 กลุ่มตามดีไซน์: กลุ่มบนคือรายละเอียดทริป กลุ่มล่างคือรีวิว/รูป คั่นด้วยเส้น
 *  id ใช้ผูกปุ่มในแถบเข้ากับ <section> ในเนื้อหา ทั้งตอนกดกระโดดและตอนไฮไลต์ตาม scroll */
const RAIL_MAIN = [
  { id: "info", icon: "/icon/InfoIcon.svg" },
  { id: "location", icon: "/icon/LocationIcon.svg" },
  { id: "schedule", icon: "/icon/scheduleIcon.svg" },
  { id: "prepare", icon: "/icon/prepareIcon.svg" },
  { id: "includes", icon: "/icon/WhatIncludedIcon.svg" },
];
const RAIL_EXTRA = [
  { id: "reviews", icon: "/icon/ReviewIcon.svg" },
  { id: "photos", icon: "/icon/cameraRollIcon.svg" },
];
const RAIL_SECTIONS = [...RAIL_MAIN, ...RAIL_EXTRA];

/** ปุ่มหนึ่งช่องในแถบไอคอน
 *  ไฟล์ไอคอนใน /public/icon เป็นเส้นสีดำล้วน จึงคุมน้ำหนักด้วย opacity แทนการเปลี่ยนสี
 *  0.3 บนพื้นขาว ≈ #b6b6b6 ตาม Figma ส่วนหัวข้อที่กำลังอ่านอยู่ใช้เต็ม 100% */
function RailButton({ item, size, active, onJump }) {
  const { t } = useLang();

  return (
    <button
      type="button"
      onClick={() => onJump(item.id)}
      aria-current={active ? "true" : undefined}
      className="group flex w-[38px] shrink-0 flex-col items-center"
    >
      <Image
        src={item.icon}
        alt=""
        width={446}
        height={340}
        style={{ width: size, height: size }}
        className={`object-contain transition-opacity ${
          active ? "opacity-100" : "opacity-30 group-hover:opacity-60"
        }`}
      />
      <span
        className={`text-center text-[9px] leading-tight transition-colors ${
          active ? "text-[#484848]" : "text-[#b6b6b6] group-hover:text-[#828282]"
        }`}
      >
        {t(`forestBathing.sections.nav.${item.id}`)}
      </span>
    </button>
  );
}

/** แถบไอคอนซ้าย — ซ่อนบนมือถือ เพราะที่นั่นทั้ง modal เลื่อนรวมเป็นคอลัมน์เดียว
 *  ตัว <nav> ยืดเต็มความสูงเนื้อหาเพื่อให้เส้นขอบขวาลากยาวตลอด ส่วนปุ่มข้างในปักไว้ที่ขอบบน */
function SectionRail({ active, onJump, hasReviews }) {
  const { t } = useLang();

  return (
    <nav
      aria-label={t("forestBathing.sections.navLabel")}
      className="hidden w-[54px] shrink-0 border-r border-[#e6e6e6] sm:block"
    >
      <div className="sticky top-0 flex flex-col items-center gap-2 px-2 py-4">
        {RAIL_MAIN.map((item) => (
          <RailButton
            key={item.id}
            item={item}
            size={25}
            active={active === item.id}
            onJump={onJump}
          />
        ))}

        <div className="mt-2 flex w-[38px] flex-col items-center gap-2 border-t border-[#e6e6e6] pt-3">
          {RAIL_EXTRA.filter((item) => item.id !== "reviews" || hasReviews).map((item) => (
            <RailButton
              key={item.id}
              item={item}
              size={20}
              active={active === item.id}
              onJump={onJump}
            />
          ))}
        </div>
      </div>
    </nav>
  );
}

/** กรอบหัวข้อหนึ่งอันในเนื้อหาฝั่งซ้าย
 *  scrollMarginTop เผื่อความสูงแถบหัวข้อที่ปักขอบบนไว้ เวลากดจากแถบไอคอนจะได้ไม่โดนบัง */
function ContentSection({ id, register, scrollOffset, children }) {
  const { t } = useLang();

  return (
    <section
      ref={(el) => register(id, el)}
      style={{ scrollMarginTop: scrollOffset }}
      className="border-t border-black/10 py-6 first:border-t-0 first:pt-0"
    >
      <h4 className="text-[15px] font-semibold text-[#484848] sm:text-[17px]">
        {t(`forestBathing.sections.heading.${id}`)}
      </h4>
      <div className="mt-3">{children}</div>
    </section>
  );
}

/** ข้อความแทนหัวข้อที่ยังไม่มีข้อมูลจริง — แถบไอคอนโชว์ครบทุกหัวข้อเสมอตาม Figma
 *  เนื้อหาจริงเติมได้ทีละหัวข้อที่ sections ใน lib/forestBathing.js */
function SectionEmpty() {
  const { t } = useLang();
  return <p className="text-[13px] italic text-[#b6b6b6]">{t("forestBathing.sections.empty")}</p>;
}

const BULLET_CLASS = "flex gap-2 text-[13px] font-light leading-relaxed text-[#484848]/80 sm:text-[15px]";

/** ผู้นำกิจกรรมหนึ่งราย — เป็นคนหรือองค์กรก็ได้ (เช่น "Royal Orchid Holidays (ROH)")
 *  ชื่อ/ตำแหน่งมาจาก messages/{en,th}.json ส่วนรูปมาจาก INSTRUCTORS ใน lib/forestBathing.js
 *  ไม่มีรูปก็ได้ — จะเป็นวงกลมเทาตามดีไซน์ */
function InstructorItem({ id }) {
  const { t } = useLang();
  const photo = INSTRUCTORS[id]?.photo;
  const name = t(`forestBathing.instructors.${id}.name`);
  // t คืนตัว key กลับมาเวลาหาไม่เจอ (ดู lib/LanguageContext.js) ใช้เช็คว่าใส่ role ไว้มั้ย
  const roleKey = `forestBathing.instructors.${id}.role`;
  const role = t(roleKey);

  return (
    <div className="flex items-center gap-2.5">
      <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-black/10">
        {photo && <Image src={photo} alt={name} fill sizes="44px" className="object-cover" />}
      </div>
      <div className="min-w-0 text-[12px] leading-normal text-[#828282]">
        <p className="font-semibold">
          {role === roleKey ? t("forestBathing.sections.instructor") : role}
        </p>
        <p>{name}</p>
      </div>
    </div>
  );
}

/** แถวผู้นำกิจกรรมใต้หัวข้อใน modal (Figma node 135:2706)
 *  ใส่ได้หลายราย เรียงลงมาในกรอบเส้นคาดเดียวกัน */
function InstructorRow({ instructorIds }) {
  return (
    <div className="flex flex-col gap-3 border-y border-[#e6e6e6] px-4 py-4 sm:px-8">
      {instructorIds.map((id) => (
        <InstructorItem key={id} id={id} />
      ))}
    </div>
  );
}

// padding บน/ล่างของแถบหัวข้อ — คงที่ ไม่ไล่ตาม scroll
// ถ้าไล่ ระยะห่างระหว่างหัวข้อกับคำอธิบายจะหด/ขยายตามไปด้วย
const HEADER_PAD = 14;

// ระยะ scroll (px) ที่ใช้ย่อตัวอักษรจาก 100% → 50% หลังหัวข้อติดขอบบนแล้ว
const SHRINK_TRAVEL = 140;

/** ความสูงแถบหัวข้อตอนย่อสุดแล้ว (scale 0.5) — ใช้เป็นระยะเผื่อของ scroll-spy กับปุ่มกระโดด
 *  เวลากดจากแถบไอคอน แถบหัวข้อจะย่อสุดอยู่แล้ว จึงเผื่อด้วยค่านี้ ไม่ใช่ความสูงตอนยังไม่ย่อ */
const shrunkBandHeight = (contentH) => contentH * 0.5 + HEADER_PAD * 2;

// ระยะเว้นใต้แถบหัวข้อตอนกดกระโดดจากแถบไอคอน
const JUMP_GAP = 8;
// ระยะที่ scroll-spy ยอมนับว่าหัวข้อ "ถึงแล้ว" — ต้องมากกว่า JUMP_GAP
// ไม่งั้นพอกดกระโดด หัวข้อจะไปหยุดพอดีเส้นแบ่ง แล้วไฮไลต์ค้างที่หัวข้อก่อนหน้า
const SPY_SLACK = 28;

/** โปสเตอร์ + รายละเอียดสถานที่ (คอลัมน์ซ้าย)
 *
 *  จอกว้าง: รูปปกเลื่อนหลบขึ้นไปตาม scroll ปกติ (ไม่ sticky) เหลือแค่หัวข้อ (ชื่อทริป + สถานที่)
 *  ที่ sticky ค้างขอบบน พื้นทึบ ให้เนื้อหากิจกรรมเลื่อนลอดใต้ไป
 *
 *  ลำดับเป็น 2 จังหวะ: (1) หัวข้อเลื่อนขึ้นไปติดขอบบนก่อน โดยยังไม่ย่อ
 *  (2) พอติดขอบบนแล้วค่อยเริ่มย่อจาก 100% → 50% ต่อเนื่องตาม scroll (ไม่ใช่สลับ 2 สถานะ จะได้ลื่น)
 *  ระยะที่ใช้ย่อ = ระยะ scroll ที่เหลือหลังติดขอบบน (ไม่เกิน SHRINK_TRAVEL)
 *
 *  ตัวอักษรย่อด้วย transform: scale() (ไม่กระทบ layout) ส่วนความสูงแถบหดจริงเพื่อไม่ให้เทอะทะ
 *  แล้วมี spacer โตขึ้นชดเชยเท่ากับส่วนที่หดไป เพื่อให้ scrollHeight คงที่
 *  ถ้าปล่อยให้ scrollHeight เปลี่ยน เบราว์เซอร์จะ clamp scrollTop → progress ลด → แถบขยายกลับ
 *  แล้ววนไม่จบ (อาการ "เด้งไม่หยุด")
 *
 *  มือถือ: ปิด effect ทั้งหมด (isDesktop = false) เป็น flow ปกติ */
function PosterPanel({
  viewLocation,
  poster,
  knownPosterRatio,
  eyebrow,
  title,
  name,
  region,
  blurb,
  selectedTrip,
  gallery = [],
  onOpenGallery,
}) {
  const { t, lang } = useLang();
  const hasGallery = gallery.length > 0 && typeof onOpenGallery === "function";

  // สัดส่วนรูปปก — อ่านจากขนาดจริงของไฟล์ตอนโหลดเสร็จ จะได้ไม่ต้องมาไล่ใส่ขนาดเองทุกครั้งที่เปลี่ยนรูป
  // ระหว่างรอโหลดใช้ 624/260 ตามกรอบ Figma ไปก่อน กันไม่ให้ layout กระโดด
  /* สัดส่วนปก: ใช้ค่าที่บันทึกไว้ใน lib/forestBathing.js ตั้งแต่ render แรก
     ถ้าสถานที่ไหนยังไม่ได้บันทึก ค่อยตกไปวัดจากรูปตอนโหลดเสร็จเหมือนเดิม
     เริ่มจาก null แล้ววัดทีหลังทำให้ปกกระตุกเปลี่ยนขนาด และเห็นชัดตอนสลับภาษา
     เพราะคอมโพเนนต์ถูกสร้างใหม่ ค่าที่วัดไว้รอบก่อนจึงหายไป */
  const [measuredRatio, setMeasuredRatio] = useState(null);
  const posterRatio = knownPosterRatio ?? measuredRatio;
  const setPosterRatio = setMeasuredRatio;
  const scrollRef = useRef(null);
  const imageRef = useRef(null);
  const contentRef = useRef(null);
  const sectionRefs = useRef({});
  const [progress, setProgress] = useState(0);
  const [contentH, setContentH] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const [activeSection, setActiveSection] = useState(RAIL_SECTIONS[0].id);

  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;

    // เปลี่ยนสถานที่ = คนละทริปกันเลย ดีดกลับขึ้นบนสุดก่อนคำนวณอะไรทั้งหมด
    // (ตอน mount ก็ 0 อยู่แล้ว การสั่งซ้ำไม่มีผล) แล้ว update() ข้างล่างจะรีเซ็ต
    // progress กับหัวข้อที่ไฮไลต์ให้เองจาก scrollTop ใหม่
    root.scrollTop = 0;

    const mq = window.matchMedia("(min-width: 640px)");
    let raf = null;

    const update = () => {
      raf = null;
      const desktop = mq.matches;
      setIsDesktop(desktop);
      const bandContentH = contentRef.current?.offsetHeight ?? 0;
      setContentH(bandContentH);

      if (!desktop) {
        setProgress(0);
        return;
      }
      const imageH = imageRef.current?.offsetHeight ?? 0;
      const maxScroll = root.scrollHeight - root.clientHeight;
      // จุดที่หัวข้อเลื่อนขึ้นไปชนขอบบนพอดี = ความสูงรูป (แต่ไม่เกินระยะ scroll ที่มีจริง)
      const stickPoint = Math.min(imageH, maxScroll);
      // เริ่มย่อ "หลัง" ติดขอบบนแล้วเท่านั้น โดยใช้ระยะ scroll ที่เหลือ (ไม่เกิน SHRINK_TRAVEL)
      // ถ้าไม่เหลือระยะเลย ก็จะไม่ย่อ — ดีกว่าย่อกระตุกจบในพริบตา
      const shrinkDist = Math.max(1, Math.min(SHRINK_TRAVEL, maxScroll - stickPoint));
      setProgress(Math.min(1, Math.max(0, (root.scrollTop - stickPoint) / shrinkDist)));

      // ไฮไลต์หัวข้อในแถบไอคอน = หัวข้อสุดท้ายที่เลื่อนพ้นใต้แถบหัวข้อไปแล้ว
      // วัดจาก viewport (getBoundingClientRect) จะได้ไม่ต้องพึ่ง offsetParent ของ section
      const rootTop = root.getBoundingClientRect().top;
      const headerH = shrunkBandHeight(bandContentH);
      let current = RAIL_SECTIONS[0].id;
      for (const s of RAIL_SECTIONS) {
        const el = sectionRefs.current[s.id];
        if (el && el.getBoundingClientRect().top - rootTop <= headerH + SPY_SLACK) current = s.id;
      }
      setActiveSection(current);
    };

    const onScroll = () => {
      if (raf === null) raf = requestAnimationFrame(update);
    };

    update();
    root.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    mq.addEventListener("change", onScroll);
    return () => {
      root.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      mq.removeEventListener("change", onScroll);
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, [viewLocation.id]);

  const applyEffect = isDesktop && contentH > 0;
  const scale = 1 - 0.5 * progress;
  const bandMax = contentH + HEADER_PAD * 2;
  const bandH = contentH * scale + HEADER_PAD * 2;

  const registerSection = (id, el) => {
    sectionRefs.current[id] = el;
  };

  // ปล่อยให้เบราว์เซอร์เลื่อนเอง แล้วเผื่อระยะแถบหัวข้อผ่าน scrollMarginTop ของแต่ละ section
  const jumpTo = (id) => sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth" });

  const sections = useLocationSections(viewLocation);
  const hasReviews = sections.reviews?.length > 0;
  const sectionProps = {
    register: registerSection,
    scrollOffset: shrunkBandHeight(contentH) + JUMP_GAP,
  };

  return (
    // มือถือ: ต้อง shrink-0 (สูงตามเนื้อหา) เพราะทั้ง modal เลื่อนรวมเป็นคอลัมน์เดียว
    // ถ้าใช้ flex-1 เหมือนจอกว้าง flex-basis จะเป็น 0 แล้วคอลัมน์นี้ยุบเหลือ 0px
    // เนื้อหาจะล้นไปอยู่ใต้แผงปฏิทินจนมองไม่เห็น
    <div
      ref={scrollRef}
      className="min-h-0 min-w-0 shrink-0 sm:flex-1 sm:self-stretch sm:overflow-y-auto"
    >
      {/* รูปปก — เลื่อนหลบขึ้นไปตาม scroll ปกติ ไม่ sticky จึงไม่มีทางไปบังเนื้อหาด้านล่าง
          กดที่ไหนก็ได้บนปกเพื่อเปิดดูรูปทั้งหมด (ป้ายนับรูปเป็นแค่ตัวบอกใบ้ ไม่ใช่ปุ่มแยก) */}
      <div
        ref={imageRef}
        className="relative w-full"
        style={{ aspectRatio: posterRatio ?? 624 / 260 }}
      >
        {hasGallery ? (
          <button
            type="button"
            onClick={onOpenGallery}
            aria-label={`ดูรูปทั้งหมด ${gallery.length} รูป`}
            className="group absolute inset-0 block cursor-zoom-in overflow-hidden"
          >
            <Image
              src={poster}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, 880px"
              onLoad={(e) =>
                setPosterRatio(e.currentTarget.naturalWidth / e.currentTarget.naturalHeight)
              }
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
            <span className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
            <span className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-1.5 rounded-lg bg-black/55 px-2.5 py-1 text-[13px] font-medium text-white backdrop-blur-sm">
              <CameraIcon className="h-4 w-auto" />
              1/{gallery.length}
            </span>
          </button>
        ) : (
          <Image
            src={poster}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 880px"
            onLoad={(e) =>
              setPosterRatio(e.currentTarget.naturalWidth / e.currentTarget.naturalHeight)
            }
            className="object-cover"
          />
        )}
      </div>

      {/* แถบไอคอนซ้าย + เนื้อหา — แถบเริ่มใต้รูปปกตาม Figma และปักค้างขอบบนตอนเลื่อน
          ตัว <nav> ยืดเต็มความสูงของแถวนี้อยู่แล้ว (flex stretch) เส้นขอบขวาจึงลากยาวตลอดเนื้อหา */}
      <div className="flex">
        <SectionRail active={activeSection} onJump={jumpTo} hasReviews={hasReviews} />

        <div className="min-w-0 flex-1">
      {/* หัวข้อ — sticky ค้างขอบบน พื้นทึบให้เนื้อหาเลื่อนลอดใต้ */}
      <div
        className="relative z-10 flex items-center bg-white px-4 py-4 sm:sticky sm:top-0 sm:px-8 sm:py-3.5"
        style={
          applyEffect
            ? {
                height: bandH,
                paddingTop: HEADER_PAD,
                paddingBottom: HEADER_PAD,
                boxShadow: `0 1px 0 rgba(0,0,0,${0.08 * progress})`,
              }
            : undefined
        }
      >
        <div
          ref={contentRef}
          className="w-full will-change-transform"
          style={applyEffect ? { transform: `scale(${scale})`, transformOrigin: "left center" } : undefined}
        >
          <p className="text-[14px] font-semibold text-[#afafaf] sm:text-[16px]">{eyebrow}</p>
          <h3 className="mt-1 text-[26px] font-semibold leading-tight text-[#484848] sm:text-[36px]">
            {title}
          </h3>
          <div className="mt-2 flex items-center gap-2">
            <PinIcon className="h-4 w-4 shrink-0 text-[#828282]" />
            {/* โชว์แค่ region — หัวเรื่องเหนือบรรทัดนี้บอกชื่ออยู่แล้ว
                (ถ้าไม่ได้ตั้ง campaignTitle หัวเรื่องจะใช้ name ทำให้ซ้ำกันสองบรรทัดติด) */}
            <p className="text-[13px] text-[#828282] sm:text-[16px]">{region}</p>
          </div>
        </div>
      </div>

      {/* ชดเชยความสูงที่แถบหัวข้อหดไป ให้ scrollHeight คงที่ (กันลูปเด้ง — ดูคอมเมนต์บนสุด)
          อยู่ตรงนี้ได้เพราะย่อเฉพาะ "หลัง" ติดขอบบนแล้ว ตอนนั้น spacer จะถูกบังอยู่ใต้แถบที่ปักไว้
          จึงไม่โผล่มาเป็นช่องว่าง และเนื้อหาด้านล่างก็ไม่ขยับตามตอนแถบหด */}
      {applyEffect && <div aria-hidden style={{ height: Math.max(0, bandMax - bandH) }} />}

      {/* อยู่นอกกรอบ section เพราะ Figma วางไว้ระหว่างหัวข้อกับเนื้อหา และมีเส้นคาดของตัวเอง
          ถ้าเอาเข้าไปในกรอบ section แรก เส้นล่างของแถวนี้จะซ้อนกับเส้นบนของหัวข้อ Info */}
      {viewLocation.instructors?.length > 0 && (
        <InstructorRow instructorIds={viewLocation.instructors} />
      )}

      {/* หัวข้อย่อยที่แถบไอคอนซ้ายกระโดดไปหา — เรียงตาม RAIL_SECTIONS
          หัวข้อไหนไม่มีข้อมูลใน lib/forestBathing.js จะขึ้น SectionEmpty แทน แต่ยังอยู่ครบตาม Figma */}
      <div className="flex flex-col px-4 pb-8 pt-4 sm:px-8">
        <ContentSection id="info" {...sectionProps}>
          <p className="text-[14px] font-light leading-relaxed text-[#484848]/80 sm:text-[15px]">
            {blurb}
          </p>
          {sections.info?.length > 0 && (
            <div className="mt-5 flex flex-col gap-4">
              {/* key มี index นำหน้าทุกที่ในหัวข้อพวกนี้ เพราะเนื้อหาซ้ำกันได้ (รีวิวชื่อซ้ำ,
                  กำหนดการเวลาเดียวกันสองรายการ) ถ้าใช้ตัวข้อความล้วนเป็น key จะชนกัน
                  ลิสต์พวกนี้มาจาก config ที่ไม่มีการสลับ/กรองตอน runtime index จึงนิ่ง */}
              {sections.info.map((h, i) => (
                <div key={`${i}-${h.title}`}>
                  <p className="text-[15px] font-semibold text-[#484848]">{h.title}</p>
                  <p className="mt-1 text-[13px] leading-relaxed text-[#828282]">{h.desc}</p>
                </div>
              ))}
            </div>
          )}
        </ContentSection>

        <ContentSection id="location" {...sectionProps}>
          <div className="flex items-start gap-2">
            <PinIcon className="mt-0.5 h-4 w-4 shrink-0 text-[#828282]" />
            <div>
              <p className="text-[14px] text-[#484848] sm:text-[15px]">{region}</p>
              {sections.location?.address && (
                <p className="mt-0.5 text-[13px] text-[#828282]">{sections.location.address}</p>
              )}
            </div>
          </div>

          {/* วิธีเดินทางรับได้สองแบบ
              - array = หลายทางเลือก แต่ละอันมีหัวข้อ + คำอธิบาย/ขั้นตอนย่อย (ใส่อย่างใดอย่างหนึ่งหรือทั้งคู่)
              - string = ข้อความก้อนเดียวแบบเดิม สำหรับที่ที่มีทางเดียว ไม่ต้องแตกเป็นข้อ */}
          {Array.isArray(sections.location?.gettingThere) ? (
            <ol className="mt-3 flex flex-col gap-4">
              {sections.location.gettingThere.map((opt, i) => (
                <li key={`${i}-${opt.title}`}>
                  <p className="text-[14px] font-semibold text-[#484848]">
                    {i + 1}. {opt.title}
                  </p>
                  {opt.desc && (
                    <p className="mt-1 text-[13px] font-light leading-relaxed text-[#484848]/80 sm:text-[15px]">
                      {opt.desc}
                    </p>
                  )}
                  {opt.steps?.length > 0 && (
                    <ul className="mt-1.5 flex flex-col gap-1.5">
                      {opt.steps.map((step, k) => (
                        <li key={`${k}-${step}`} className={BULLET_CLASS}>
                          <span aria-hidden className="text-[#b6b6b6]">
                            •
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ol>
          ) : sections.location?.gettingThere ? (
            <p className="mt-3 text-[13px] font-light leading-relaxed text-[#484848]/80 sm:text-[15px]">
              {sections.location.gettingThere}
            </p>
          ) : (
            <div className="mt-3">
              <SectionEmpty />
            </div>
          )}

          {sections.location?.mapUrl && (
            <a
              href={sections.location.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-[13px] text-[#0F8C82] underline underline-offset-2 hover:text-[#26A9E0]"
            >
              {t("forestBathing.sections.viewMap")}
            </a>
          )}
        </ContentSection>

        <ContentSection id="schedule" {...sectionProps}>
          {selectedTrip && (
            <p className="mb-3 text-[13px] text-[#828282]">{formatTrip(selectedTrip, lang)}</p>
          )}
          {sections.schedule?.length > 0 ? (
            <div className="flex flex-col gap-5">
              {sections.schedule.map((day, di) => (
                <div key={`${di}-${day.day}`}>
                  <p className="text-[14px] font-semibold text-[#484848]">{day.day}</p>
                  <ul className="mt-2 flex flex-col gap-1.5">
                    {day.items.map((it, i) => (
                      <li key={`${i}-${it.time}`} className={BULLET_CLASS}>
                        <span className="w-[46px] shrink-0 tabular-nums text-[#828282]">
                          {it.time}
                        </span>
                        <span>{it.title}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <SectionEmpty />
          )}
        </ContentSection>

        <ContentSection id="prepare" {...sectionProps}>
          {sections.prepare?.length > 0 ? (
            <ul className="flex flex-col gap-1.5">
              {sections.prepare.map((item, i) => (
                <li key={`${i}-${item}`} className={BULLET_CLASS}>
                  <span aria-hidden className="text-[#b6b6b6]">
                    •
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <SectionEmpty />
          )}
        </ContentSection>

        <ContentSection id="includes" {...sectionProps}>
          {sections.includes?.length > 0 ? (
            <ul className="flex flex-col gap-1.5">
              {sections.includes.map((item, i) => (
                <li key={`${i}-${item}`} className={BULLET_CLASS}>
                  <span aria-hidden className="text-[#0F8C82]">
                    ✓
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <SectionEmpty />
          )}
        </ContentSection>

        {/* รีวิวต่างจากหัวข้ออื่น — หัวข้ออื่นที่ยังไม่มีข้อมูลขึ้น "กำลังจัดเตรียม" ได้
            แต่ทริปที่ยังไม่เคยจัดย่อมไม่มีรีวิว การโชว์หัวข้อว่างไว้เลยดูเหมือนของขาด
            จึงซ่อนทั้งหัวข้อและปุ่มในแถบไอคอน แล้วจะกลับมาเองเมื่อมีรีวิวจริง */}
        {hasReviews && (
          <ContentSection id="reviews" {...sectionProps}>
            <div className="flex flex-col gap-3">
              {sections.reviews.map((r, i) => (
                <figure key={`${i}-${r.name}`} className="rounded-xl bg-black/[0.03] px-4 py-3">
                  <blockquote className="text-[13px] font-light leading-relaxed text-[#484848]/80 sm:text-[15px]">
                    “{r.text}”
                  </blockquote>
                  <figcaption className="mt-2 text-[13px] text-[#828282]">{r.name}</figcaption>
                </figure>
              ))}
            </div>
          </ContentSection>
        )}

        <ContentSection id="photos" {...sectionProps}>
          {hasGallery ? (
            <>
              <div className="grid grid-cols-3 gap-2">
                {gallery.slice(0, 9).map((src, i) => (
                  <button
                    key={`${src}-${i}`}
                    type="button"
                    onClick={() => onOpenGallery(i)}
                    aria-label={`ดูรูปที่ ${i + 1}`}
                    className="relative aspect-[4/3] overflow-hidden rounded-lg"
                  >
                    <Image
                      src={src}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 30vw, 180px"
                      className="object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </button>
                ))}
              </div>
              {gallery.length > 9 && (
                <button
                  type="button"
                  onClick={() => onOpenGallery(0)}
                  className="mt-3 text-[13px] text-[#0F8C82] underline underline-offset-2 hover:text-[#26A9E0]"
                >
                  {t("forestBathing.sections.viewAllPhotos", { count: gallery.length })}
                </button>
              )}
            </>
          ) : (
            <SectionEmpty />
          )}
        </ContentSection>
      </div>
        </div>
      </div>
    </div>
  );
}

/** แกลเลอรีรูปตัวอย่าง — ชั่วคราว รอดีไซน์จริงจาก Figma แล้วค่อยแทนที่
 *  z สูงกว่า modal จอง (z-[70]) เพราะซ้อนอยู่ข้างบน
 *  ปุ่มปิด/Esc คุมจาก LocationModal เพื่อให้ Esc ปิดแค่แกลเลอรี ไม่ปิด modal จองไปด้วย */
function GalleryLightbox({ images, startIndex = 0, onClose }) {
  const [index, setIndex] = useState(startIndex);
  const go = (step) => setIndex((i) => (i + step + images.length) % images.length);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [images.length]);

  return (
    <div
      className="fixed inset-0 z-[80] flex flex-col bg-black/92 backdrop-blur-sm"
      // stopPropagation สำคัญ: แกลเลอรีอยู่ข้างใน backdrop ของ modal จองซึ่งมี onClick=ปิด
      // ถ้าไม่หยุด คลิกปิดแกลเลอรีจะ bubble ไปปิด modal จองไปด้วยทั้งอัน
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <div className="flex shrink-0 items-center justify-between px-4 py-3 text-white sm:px-6">
        <span className="text-[14px] tabular-nums">
          {index + 1}/{images.length}
        </span>
        <button
          onClick={onClose}
          aria-label={"ปิด"}
          className="rounded-full bg-white/10 p-1.5 transition-colors hover:bg-white/20"
        >
          <IconClose size={28} className="h-3 w-3" />
        </button>
      </div>

      <div
        className="relative min-h-0 flex-1"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          key={index}
          src={images[index]}
          alt={`รูปที่ ${index + 1}`}
          fill
          sizes="100vw"
          className="object-contain"
        />

        <button
          onClick={() => go(-1)}
          aria-label="รูปก่อนหน้า"
          className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 px-4 py-3 text-[22px] leading-none text-white transition-colors hover:bg-black/70 sm:left-6"
        >
          ‹
        </button>
        <button
          onClick={() => go(1)}
          aria-label="รูปถัดไป"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 px-4 py-3 text-[22px] leading-none text-white transition-colors hover:bg-black/70 sm:right-6"
        >
          ›
        </button>
      </div>

      {/* แถบรูปย่อ */}
      <div
        className="flex shrink-0 gap-2 overflow-x-auto px-4 py-3 sm:px-6"
        onClick={(e) => e.stopPropagation()}
      >
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`ไปรูปที่ ${i + 1}`}
            className={`relative h-14 w-20 shrink-0 overflow-hidden rounded transition-opacity ${
              i === index ? "ring-2 ring-[#FDF164]" : "opacity-50 hover:opacity-90"
            }`}
          >
            <Image src={src} alt="" fill sizes="80px" className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}

/** Sidebar ปฏิทิน — พื้นไล่สีฟ้า-เขียว ตาม Figma, โชว์ทริปของทุกสถานที่ที่เปิดจอง */
function ActivityCalendarPanel({ selectedTrip, onSelectDate }) {
  const { t } = useLang();
  const selectedDates = selectedTrip ? tripDates(selectedTrip) : [];

  return (
    <div className="w-full min-h-0 shrink-0 bg-gradient-to-b from-[#26A9E0] to-[#0F8C82] p-4 sm:w-[277px] sm:self-stretch sm:overflow-y-auto sm:p-6">
      {/* เว้นที่ให้ปุ่มภาษา+ปิดที่ลอยทับมุมขวาบนของ modal
          กลุ่มปุ่มกว้าง ~79px ห่างขอบขวา 16px ส่วนแผงนี้มี padding 24px อยู่แล้ว → ล้ำเข้ามา ~71px
          ตั้ง 72px พอดีให้หัวข้อภาษาไทย (ยาวกว่า en) ยังอยู่บรรทัดเดียว */}
      <div className="sm:pr-[72px]">
        <p className="text-[16px] leading-snug text-white">
          {t("forestBathing.booking.activityDateTitle")}
        </p>
        <p className="mt-1 text-[11px] italic text-[#006894]">
          {t("forestBathing.booking.activityDateSubtitle")}
        </p>
      </div>
      <div className="mt-6 flex justify-center">
        <ForestBathingCalendar
          eventDates={openLocationDates()}
          monthCount={4}
          columns={1}
          selectedDates={selectedDates}
          onSelectDate={onSelectDate}
        />
      </div>
    </div>
  );
}

function LocationModal({ location, onClose, onLocationChange }) {
  const { t, lang, toggleLang } = useLang();
  // สถานที่ที่ modal กำลังแสดงอยู่ตอนนี้ — เปลี่ยนได้ถ้าผู้ใช้กดวันของสถานที่อื่นในปฏิทิน
  const [viewLocation, setViewLocation] = useState(location);
  // เริ่มด้วยทริปถัดไปที่ถูกเลือกไว้แล้ว (วันที่จัดกิจกรรมของสถานที่นี้)
  const [selectedTrip, setSelectedTrip] = useState(() => nextTrip(location));
  const { name, region, blurb } = useLocationText(viewLocation.id);
  const duration = useTripDuration();
  // รูปที่เปิดค้างอยู่ในแกลเลอรี — null คือปิดอยู่ (เก็บเป็น index เพราะกดจากตารางรูปในหัวข้อ Photo ได้)
  const [galleryIndex, setGalleryIndex] = useState(null);
  const galleryOpen = galleryIndex !== null;
  // ตัวที่เลื่อนจริงบนมือถือ (จอกว้างเป็น sm:overflow-hidden แล้วให้แต่ละคอลัมน์เลื่อนเอง)
  const mobileScrollRef = useRef(null);

  // สลับสถานที่จากปฏิทิน = เปลี่ยนไปทริปคนละอันเลย ต้องดีดกลับขึ้นบนสุด
  // ไม่งั้นจะค้างอยู่กลางเนื้อหาของทริปใหม่ ไม่เห็นทั้งรูปปกและชื่อทริป
  // (ฝั่งจอกว้างรีเซ็ตแยกใน PosterPanel เพราะตัวที่เลื่อนคือคอลัมน์นั้นเอง)
  useEffect(() => {
    if (mobileScrollRef.current) mobileScrollRef.current.scrollTop = 0;
  }, [viewLocation.id]);

  // Esc ต้องปิดแกลเลอรีก่อน ถ้าเปิดอยู่ ไม่งั้นจะปิด modal จองไปทั้งอันเลย
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      if (galleryOpen) setGalleryIndex(null);
      else onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, galleryOpen]);

  // ปฏิทินโชว์ทริปของ "ทุกสถานที่ที่เปิดจอง" ไม่ใช่แค่สถานที่นี้ที่เดียว
  // กดวันของอีกสถานที่ได้เลย แล้วให้ modal สลับไปแสดงข้อมูลสถานที่นั้นแทน
  const handleSelectDate = (iso) => {
    const found = tripAndLocationForDate(iso);
    if (!found) return;
    setSelectedTrip(found.trip);
    if (found.location.id !== viewLocation.id) {
      setViewLocation(found.location);
      onLocationChange?.(found.location.id); // ให้ URL ตามไปด้วย
    }
  };

  // ทางกลับกัน: URL เปลี่ยนจากข้างนอก (กด back/forward หรือเปิดลิงก์ตรง ๆ) ให้ modal ตาม
  // ปรับ state ระหว่าง render ไม่ใช่ใน effect — React จะ render ซ้ำให้ทันทีก่อนวาดจริง
  // จึงไม่เห็นเฟรมที่ยังเป็นสถานที่เก่าค้างอยู่ และเช็ค id กันวนกับ onLocationChange ข้างบน
  // (ถ้าไม่เช็ค วันที่ผู้ใช้เพิ่งเลือกจะโดนรีเซ็ตทิ้งทุกครั้งที่ URL ขยับ)
  if (location.id !== viewLocation.id) {
    setViewLocation(location);
    setSelectedTrip(nextTrip(location));
  }

  const eyebrow = viewLocation.campaignEyebrow ?? "Mission Earth";
  const title = viewLocation.campaignTitle ?? name;
  const poster = viewLocation.posterImage ?? viewLocation.image;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={name}
      className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm sm:p-8"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-[90vh] w-full max-w-[1160px] flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
      >
        {/* ปุ่มสลับภาษา + ปิด — จับคู่กันมุมขวาบน
            modal เป็น z-[70] ทับ navbar (z-50) มิด ถ้าไม่มีปุ่มนี้ต้องปิด modal ก่อนถึงจะเปลี่ยนภาษาได้
            พื้นเข้ม/ตัวขาว (แพตเทิร์นเดียวกับป้ายนับรูปบนปก) เพราะจอกว้างปุ่มทับแผงปฏิทินสีฟ้า
            แต่บนมือถือไปทับรูปปก ถ้าใช้ตัวอักษรสีเข้มจะจมหายไปกับรูป */}
        <div className="absolute right-4 top-4 z-20 flex items-center gap-2">
          <button
            onClick={toggleLang}
            aria-label="Switch language"
            className="flex items-center gap-1 rounded-full bg-black/45 px-2 py-1.5 text-white backdrop-blur-sm transition-colors hover:bg-black/65"
          >
            <TranslateIcon className="h-3.5 w-3.5" />
            <span className="text-[10px] font-medium leading-none">
              {lang === "en" ? "TH" : "EN"}
            </span>
          </button>

          <button
            onClick={onClose}
            aria-label={t("forestBathing.close")}
            className="rounded-full bg-black/45 p-1.5 text-white backdrop-blur-sm transition-colors hover:bg-black/65"
          >
            <IconClose size={28} className="h-3 w-3" />
          </button>
        </div>

        {viewLocation.isOpen ? (
          <>
            {/* บนมือถือ (คอลัมน์เดียว) ทั้งบล็อกนี้ scroll รวมกัน — บนจอกว้าง โปสเตอร์กับปฏิทิน scroll อิสระจากกัน (ดู sm:overflow-y-auto ในแต่ละคอลัมน์) */}
            <div
              ref={mobileScrollRef}
              className="flex min-h-0 flex-1 flex-col overflow-y-auto sm:flex-row sm:overflow-hidden"
            >
              <PosterPanel
                viewLocation={viewLocation}
                poster={poster}
                knownPosterRatio={viewLocation.posterRatio}
                eyebrow={eyebrow}
                title={title}
                name={name}
                region={region}
                blurb={blurb}
                selectedTrip={selectedTrip}
                gallery={viewLocation.gallery ?? []}
                onOpenGallery={(i = 0) => setGalleryIndex(i)}
              />

              <ActivityCalendarPanel selectedTrip={selectedTrip} onSelectDate={handleSelectDate} />
            </div>

            {/* แถบราคา + ปุ่มจอง — ปักอยู่นอก scroll เห็นตลอด. location.registerUrl ยังเป็น placeholder "#" สำหรับบางสถานที่ (lib/forestBathing.js) */}
            <div className="flex shrink-0 flex-col gap-3 border-t border-black/10 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
              <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-3">
                {selectedTrip?.price && (
                  <p className="flex items-baseline gap-2 text-[16px] font-semibold text-[#484848]">
                    {/* ราคาเต็มขีดฆ่านำหน้า แล้วตามด้วยราคาจริงกับ % ที่ลด —
                        ทั้งสองชิ้นขึ้นเฉพาะทริปที่ตั้ง fullPrice ไว้เท่านั้น
                        ทริปที่ไม่ได้ลดราคาจะเห็นแค่ราคาเดียวเหมือนเดิม */}
                    {discountPct(selectedTrip) > 0 && (
                      <span className="text-[13px] font-normal text-[#828282] line-through">
                        {formatPrice(selectedTrip.fullPrice)}
                      </span>
                    )}
                    <span>{formatPrice(selectedTrip.price)}</span>
                    {discountPct(selectedTrip) > 0 && (
                      <span className="text-[13px] font-semibold text-[#0F8C82]">
                        (-{discountPct(selectedTrip)}%)
                      </span>
                    )}
                  </p>
                )}
                {selectedTrip && (
                  <p className="text-[12px] text-[#484848]/70">
                    {duration(selectedTrip)} · {formatTrip(selectedTrip, lang)}
                  </p>
                )}
              </div>

              {selectedTrip ? (
                <a
                  href={viewLocation.registerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-[#FDF164] px-8 py-3 text-center text-[15px] font-medium text-[#484848] transition-colors hover:bg-[#f5e94f]"
                >
                  {t("forestBathing.booking.bookOn", { date: formatTrip(selectedTrip, lang) })}
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  className="rounded-lg bg-[#FDF164] px-8 py-3 text-[15px] font-medium text-[#484848] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {t("forestBathing.booking.pickFirst")}
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="min-h-0 flex-1 overflow-y-auto p-6 sm:p-10">
            <h3 className="text-[24px] font-semibold leading-tight text-[#484848]">{name}</h3>
            <p className="mt-1 text-[16px] text-[#828282]">{region}</p>
            <p className="mb-8 mt-3 text-[14px] font-light text-[#484848]/70">{blurb}</p>

            <NotifyForm location={viewLocation} name={name} />
          </div>
        )}
      </div>

      {galleryOpen && (
        <GalleryLightbox
          images={viewLocation.gallery ?? []}
          startIndex={galleryIndex}
          onClose={() => setGalleryIndex(null)}
        />
      )}
    </div>
  );
}

/** ชื่อพารามิเตอร์ใน URL ที่บอกว่าเปิดทริปไหนอยู่ — /forest_bathing?trip=urban-bangkok */
const TRIP_PARAM = "trip";

/** อ่านจาก URL ว่าจะเปิด modal ของสถานที่ไหน
 *  แยกเป็นคอมโพเนนต์ของตัวเองเพราะ useSearchParams ต้องอยู่ใต้ <Suspense>
 *  ไม่งั้น Next จะ error ตอน build (หน้านี้ prerender เป็น static)
 *  id ที่ไม่รู้จักคืน null เฉย ๆ — พิมพ์ URL มั่วมาก็แค่ไม่เปิด ไม่พัง */
function BookingModalFromUrl({ onClose, onLocationChange }) {
  const params = useSearchParams();
  const location = LOCATIONS.find((l) => l.id === params.get(TRIP_PARAM));
  if (!location) return null;
  return (
    <LocationModal location={location} onClose={onClose} onLocationChange={onLocationChange} />
  );
}

export default function ForestBathingLocations() {
  const router = useRouter();
  const pathname = usePathname();
  const path = useLocalePath();
  // pathname มี prefix ภาษาติดมาอยู่แล้วตั้งแต่เฟส 2 จึงส่งผ่านตัวช่วยเพื่อกันการใส่ซ้ำ
  const urlFor = (id) => `${path(pathname)}?${TRIP_PARAM}=${id}`;

  // เปิด = push เพื่อให้ปุ่มย้อนกลับของเบราว์เซอร์ปิด modal ได้
  // ปิด/สลับสถานที่ = replace เพื่อไม่ให้กด back แล้ววนกลับมาเปิดใหม่
  // scroll: false กันหน้าเด้งขึ้นบนสุดตอนเปลี่ยน URL
  const openTrip = (l) => router.push(urlFor(l.id), { scroll: false });
  const switchTrip = (id) => router.replace(urlFor(id), { scroll: false });
  const closeTrip = () => router.replace(path(pathname), { scroll: false });

  return (
    <>
      <div className="grid w-full grid-cols-1 gap-[17px] md:grid-cols-3">
        {LOCATIONS.map((l) => (
          <LocationCard key={l.id} location={l} onOpen={openTrip} />
        ))}
      </div>

      <Suspense fallback={null}>
        <BookingModalFromUrl onClose={closeTrip} onLocationChange={switchTrip} />
      </Suspense>
    </>
  );
}
