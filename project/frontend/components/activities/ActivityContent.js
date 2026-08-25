"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { formatTrip } from "./activityHelpers";

/** ข้อความของกิจกรรมหนึ่งตามภาษาที่เลือก — พอร์ตจาก useLocationText ใน ForestBathingLocations.js
 *  แต่ดึงจากคอลัมน์ en_*, th_* ของแถวใน Supabase ตรง ๆ แทน next-intl */
export function useActivityText(activity) {
  const lang = useLocale();
  const en = lang === "en";
  return {
    name: (en ? activity.en_title : activity.th_title) || activity.en_title,
    region: (en ? activity.en_region : activity.th_region) || "",
    blurb: (en ? activity.en_desc : activity.th_desc) || "",
    sections: (en ? activity.sections_en : activity.sections_th) || {},
    instructors: (activity.instructors ?? []).map((i) => ({
      name: (en ? i.name_en : i.name_th) || i.name_en,
      role: (en ? i.role_en : i.role_th) || "",
      photo: i.photo_url,
    })),
  };
}

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

/** โลโก้พาร์ทเนอร์ร่วมแคมเปญ — มุมซ้ายบนของรูปปก ทั่วไปกว่า CoBrandLockup ของ Forest Bathing
 *  (ที่ผูกกับโลโก้ ROH ตายตัว) เพราะกิจกรรมอื่นอาจร่วมกับพาร์ทเนอร์คนละราย */
function PartnerLockup({ logoUrl }) {
  if (!logoUrl) return null;
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
      <Image src={logoUrl} alt="" width={400} height={160} className="h-[20px] w-auto" />
    </div>
  );
}

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

function RailButton({ item, size, active, onJump }) {
  const t = useTranslations();
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
        className={`object-contain transition-opacity ${active ? "opacity-100" : "opacity-30 group-hover:opacity-60"}`}
      />
      <span
        className={`text-center text-[9px] leading-tight transition-colors ${
          active ? "text-[#484848]" : "text-[#b6b6b6] group-hover:text-[#828282]"
        }`}
      >
        {t(`activities.sections.nav.${item.id}`)}
      </span>
    </button>
  );
}

function SectionRail({ active, onJump, hasReviews }) {
  const t = useTranslations();
  return (
    <nav
      aria-label={t("activities.sections.navLabel")}
      className="hidden w-[54px] shrink-0 border-r border-[#e6e6e6] sm:block"
    >
      <div className="sticky top-0 flex flex-col items-center gap-2 px-2 py-4">
        {RAIL_MAIN.map((item) => (
          <RailButton key={item.id} item={item} size={25} active={active === item.id} onJump={onJump} />
        ))}
        <div className="mt-2 flex w-[38px] flex-col items-center gap-2 border-t border-[#e6e6e6] pt-3">
          {RAIL_EXTRA.filter((item) => item.id !== "reviews" || hasReviews).map((item) => (
            <RailButton key={item.id} item={item} size={20} active={active === item.id} onJump={onJump} />
          ))}
        </div>
      </div>
    </nav>
  );
}

function ContentSection({ id, register, scrollOffset, children }) {
  const t = useTranslations();
  return (
    <section
      ref={(el) => register(id, el)}
      style={{ scrollMarginTop: scrollOffset }}
      className="border-t border-black/10 py-6 first:border-t-0 first:pt-0"
    >
      <h4 className="text-[15px] font-semibold text-[#484848] sm:text-[17px]">
        {t(`activities.sections.heading.${id}`)}
      </h4>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function SectionEmpty() {
  const t = useTranslations();
  return <p className="text-[13px] italic text-[#b6b6b6]">{t("activities.sections.empty")}</p>;
}

const BULLET_CLASS = "flex gap-2 text-[13px] font-light leading-relaxed text-[#484848]/80 sm:text-[15px]";

function InstructorItem({ instructor }) {
  const t = useTranslations();
  const role = instructor.role || t("activities.sections.instructor");
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-black/10">
        {instructor.photo && (
          <Image src={instructor.photo} alt={instructor.name} fill sizes="44px" className="object-cover" />
        )}
      </div>
      <div className="min-w-0 text-[12px] leading-normal text-[#828282]">
        <p className="font-semibold">{role}</p>
        <p>{instructor.name}</p>
      </div>
    </div>
  );
}

function InstructorRow({ instructors }) {
  return (
    <div className="flex flex-col gap-3 border-y border-[#e6e6e6] px-4 py-4 sm:px-8">
      {instructors.map((instructor, i) => (
        <InstructorItem key={`${i}-${instructor.name}`} instructor={instructor} />
      ))}
    </div>
  );
}

const HEADER_PAD = 14;
const SHRINK_TRAVEL = 140;
const shrunkBandHeight = (contentH) => contentH * 0.5 + HEADER_PAD * 2;
const JUMP_GAP = 8;
const SPY_SLACK = 28;

/** โปสเตอร์ + รายละเอียดกิจกรรม (คอลัมน์ซ้าย) — พอร์ตมาจาก PosterPanel ใน ForestBathingLocations.js
 *  ดึงข้อความ/เนื้อหาจากแถว Supabase (ผ่าน useActivityText) แทน next-intl + LOCATIONS */
export default function ActivityContent({ activity, selectedTrip, onOpenGallery }) {
  const t = useTranslations();
  const lang = useLocale();
  const { name, region, blurb, sections, instructors } = useActivityText(activity);

  const eyebrow = activity.campaign_eyebrow || "Mission Earth";
  const title = activity.campaign_title || name;
  const poster = activity.poster_image_url || activity.image_url;
  const gallery = activity.gallery_urls ?? [];
  const hasGallery = gallery.length > 0 && typeof onOpenGallery === "function";

  const [measuredRatio, setMeasuredRatio] = useState(null);
  const posterRatio = activity.poster_ratio ?? measuredRatio;
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
      const stickPoint = Math.min(imageH, maxScroll);
      const shrinkDist = Math.max(1, Math.min(SHRINK_TRAVEL, maxScroll - stickPoint));
      setProgress(Math.min(1, Math.max(0, (root.scrollTop - stickPoint) / shrinkDist)));

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
  }, [activity.id]);

  const applyEffect = isDesktop && contentH > 0;
  const scale = 1 - 0.5 * progress;
  const bandMax = contentH + HEADER_PAD * 2;
  const bandH = contentH * scale + HEADER_PAD * 2;

  const registerSection = (id, el) => {
    sectionRefs.current[id] = el;
  };
  const jumpTo = (id) => sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth" });

  const hasReviews = sections.reviews?.length > 0;
  const sectionProps = { register: registerSection, scrollOffset: shrunkBandHeight(contentH) + JUMP_GAP };

  return (
    <div ref={scrollRef} className="min-h-0 min-w-0 shrink-0 sm:flex-1 sm:self-stretch sm:overflow-y-auto">
      <div ref={imageRef} className="relative w-full" style={{ aspectRatio: posterRatio ?? 624 / 260 }}>
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
              onLoad={(e) => setMeasuredRatio(e.currentTarget.naturalWidth / e.currentTarget.naturalHeight)}
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
            <span className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
            <span className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-1.5 rounded-lg bg-black/55 px-2.5 py-1 text-[13px] font-medium text-white backdrop-blur-sm">
              <CameraIcon className="h-4 w-auto" />
              1/{gallery.length}
            </span>
          </button>
        ) : (
          poster && (
            <Image
              src={poster}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, 880px"
              onLoad={(e) => setMeasuredRatio(e.currentTarget.naturalWidth / e.currentTarget.naturalHeight)}
              className="object-cover"
            />
          )
        )}
        <PartnerLockup logoUrl={activity.partner_logo_url} />
      </div>

      <div className="flex">
        <SectionRail active={activeSection} onJump={jumpTo} hasReviews={hasReviews} />

        <div className="min-w-0 flex-1">
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
              {region && (
                <div className="mt-2 flex items-center gap-2">
                  <PinIcon className="h-4 w-4 shrink-0 text-[#828282]" />
                  <p className="text-[13px] text-[#828282] sm:text-[16px]">{region}</p>
                </div>
              )}
            </div>
          </div>

          {applyEffect && <div aria-hidden style={{ height: Math.max(0, bandMax - bandH) }} />}

          {instructors.length > 0 && <InstructorRow instructors={instructors} />}

          <div className="flex flex-col px-4 pb-8 pt-4 sm:px-8">
            <ContentSection id="info" {...sectionProps}>
              <p className="text-[14px] font-light leading-relaxed text-[#484848]/80 sm:text-[15px]">{blurb}</p>
              {sections.info?.length > 0 && (
                <div className="mt-5 flex flex-col gap-4">
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
                              <span aria-hidden className="text-[#b6b6b6]">•</span>
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
                  {t("activities.sections.viewMap")}
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
                            <span className="w-[46px] shrink-0 tabular-nums text-[#828282]">{it.time}</span>
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
                      <span aria-hidden className="text-[#b6b6b6]">•</span>
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
                      <span aria-hidden className="text-[#0F8C82]">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <SectionEmpty />
              )}
            </ContentSection>

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
                        <Image src={src} alt="" fill sizes="(max-width: 768px) 30vw, 180px" className="object-cover transition-transform duration-500 hover:scale-105" />
                      </button>
                    ))}
                  </div>
                  {gallery.length > 9 && (
                    <button
                      type="button"
                      onClick={() => onOpenGallery(0)}
                      className="mt-3 text-[13px] text-[#0F8C82] underline underline-offset-2 hover:text-[#26A9E0]"
                    >
                      {t("activities.sections.viewAllPhotos", { count: gallery.length })}
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
