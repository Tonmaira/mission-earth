"use client";

import { PROVINCE_BY_CODE } from "@/lib/thaiProvinces";
import { TH_MAP_BOUNDS, TH_MAP_PATHS, TH_MAP_VIEWBOX } from "./thMapPaths";

/**
 * แผนที่ประเทศไทย 77 จังหวัด กดเลือกได้
 *
 * รูปร่างมาจาก thMapPaths.js ซึ่งสร้างจาก public/THmap/TH-MAP.svg ด้วย
 * `node scripts/gen-th-map.js` (รันจาก project/frontend) — ถ้า export แผนที่จาก
 * Figma ใหม่ ให้ทับไฟล์ใน public/THmap/ แล้วรันสคริปต์นั้นซ้ำ
 *
 * สีทั้งหมดคุมจากที่นี่ ไม่ใช่จาก Figma: ตอน gen เราถอด fill ที่ Figma ฝังมา
 * ทิ้งหมดแล้ว เพราะ path ลูกของจังหวัดที่มีเกาะจะไม่ยอมรับสีที่สั่งจากตัว <g>
 * ถ้ามันมี fill ของตัวเองอยู่
 */

const ALL_CODES = Object.keys(TH_MAP_PATHS);

/*
 * ความเข้มของสีทองบอกว่าไปจังหวัดนั้นบ่อยแค่ไหน — ไปบ่อย = เข้ม
 *
 * ต้องเขียนคลาสเต็มๆ ไว้แบบนี้ ต่อสตริงเอาเองไม่ได้ เพราะ Tailwind อ่านซอร์ส
 * ด้วยการหาข้อความที่หน้าตาเหมือนคลาส ถ้าเขียน `fill-me-gold/${n}` มันจะไม่เห็น
 * แล้วไม่ generate CSS ให้
 *
 * ไล่ระดับด้วย √(งานในจังหวัดนี้ / งานของจังหวัดที่มากที่สุด) ไม่ใช่หารตรงๆ
 * เพราะจำนวนงานเบ้มาก (กรุงเทพ 10 งาน ส่วนใหญ่จังหวัดละ 1) ถ้าหารตรงๆ
 * จังหวัดที่มี 1-2 งานจะจมไปกองรวมกันที่ระดับจางสุดหมดจนดูไม่ออกว่าต่างกัน
 */
const TONES = [
  { upTo: 0.4, className: "fill-me-gold/45" },
  { upTo: 0.6, className: "fill-me-gold/62" },
  { upTo: 0.8, className: "fill-me-gold/78" },
  { upTo: Infinity, className: "fill-me-gold/95" },
];

const toneFor = (count, max) => {
  const ratio = max > 0 ? Math.sqrt(count / max) : 0;
  return TONES.find((tone) => ratio <= tone.upTo).className;
};

/*
 * หมุดสำหรับจังหวัดที่เล็กเกินกว่าจะมองเห็น
 *
 * แผนที่แบบระบายสีมีจุดอ่อนอยู่อย่าง: พื้นที่บนแผนที่แปรตามขนาดจังหวัด ไม่ใช่
 * ตามปริมาณงาน กรุงเทพซึ่งมีงานมากที่สุดเลยเป็นจุดเล็กๆ ที่คนดูจากท้ายห้อง
 * มองไม่เห็น ส่วนแม่ฮ่องสอนที่มีสองงานกินพื้นที่มหาศาล — สายตาสรุปกลับด้าน
 * กับข้อมูลจริง
 *
 * แก้ด้วยการวาดวงกลมทับจังหวัดที่กรอบเล็กกว่าเกณฑ์ ใช้สีเดียวกับจังหวัดนั้น
 * และอยู่ใน <g> เดียวกัน เลยกดได้และเปลี่ยนสีตอน hover เหมือนกันหมด
 *
 * 800 คือพื้นที่กรอบในหน่วย viewBox (381×703) — ต่ำกว่านี้คือกลุ่มจังหวัดภาคกลาง
 * เล็กๆ กับภูเก็ต ส่วนกรุงเทพอยู่ที่ 612 เชียงใหม่ 9,924 จึงห่างกันชัดเจน
 */
const SMALL_PROVINCE_AREA = 800;

const markerFor = (code) => {
  const box = TH_MAP_BOUNDS[code];
  return box && box.w * box.h < SMALL_PROVINCE_AREA ? box : null;
};

/*
 * ขนาดหมุดโตตามจำนวนงานด้วย ไม่ใช่วงกลมเท่ากันหมด — จังหวัดเล็กที่มีงานเดียว
 * ไม่ควรเด่นเท่ากรุงเทพที่มีสิบงาน ใช้ √ เหมือนตอนไล่สี เพราะพื้นที่วงกลมโตตาม
 * รัศมียกกำลังสอง ถ้าเอารัศมีไปผูกกับจำนวนตรงๆ ตาจะอ่านว่าต่างกันเว่อร์กว่าจริง
 */
const radiusFor = (count, max) => 4.5 + 4 * (max > 0 ? Math.sqrt(count / max) : 0);

export default function ThailandMap({
  /**
   * จำนวนงานของแต่ละจังหวัด { "TH-10": 10, ... } — จังหวัดที่อยู่ในนี้เท่านั้น
   * ที่กดได้ และตัวเลขเป็นตัวกำหนดความเข้มของสี
   */
  counts = {},
  selected = null,
  onSelect = () => {},
  className = "",
}) {
  const activeSet = new Set(Object.keys(counts));
  const max = Math.max(0, ...Object.values(counts));

  /*
   * SVG ไม่มี z-index — ชิ้นที่วาดทีหลังอยู่บนเสมอ ถ้าปล่อยตามลำดับเดิม
   * เส้นขอบของจังหวัดที่ไฮไลต์จะโดนจังหวัดข้างเคียงวาดทับจนไฮไลต์ดูขาดๆ
   * เลยเรียงใหม่: เทาก่อน แล้วทอง แล้วตัวที่เลือกไว้ท้ายสุด
   */
  const order = [
    ...ALL_CODES.filter((code) => !activeSet.has(code)),
    ...ALL_CODES.filter((code) => activeSet.has(code) && code !== selected),
    ...(TH_MAP_PATHS[selected] ? [selected] : []),
  ];

  return (
    <svg
      viewBox={TH_MAP_VIEWBOX}
      className={className}
      role="img"
      aria-label="แผนที่ประเทศไทย แสดงจังหวัดที่ Mission Earth เคยลงพื้นที่"
      /* non-scaling-stroke ทำให้ค่านี้เป็นพิกเซลจริงบนจอ เส้นเลยหนาเท่าเดิม
         ไม่ว่าแผนที่จะถูกย่อขยายแค่ไหน */
      strokeWidth={0.75}
      strokeLinejoin="round"
      /* กดที่ว่าง (ทะเล นอกแผนที่ หรือจังหวัดที่ยังไม่เคยไป) = เลิกเลือก
         กลับไปหน้าตั้งต้น — จังหวัดที่กดได้จะหยุด event ไว้เองไม่ให้มาถึงตรงนี้ */
      onClick={() => onSelect(null)}
    >
      {order.map((code) => {
        const isActive = activeSet.has(code);
        const isSelected = code === selected;
        const province = PROVINCE_BY_CODE[code];
        const marker = markerFor(code);

        const tone = isSelected
          ? "fill-me-gold stroke-me-cream"
          : isActive
            ? `${toneFor(counts[code], max)} stroke-me-navy hover:fill-me-gold`
            : "fill-me-cream/12 stroke-me-navy/50";

        /*
         * stopPropagation สำคัญ — ถ้าไม่หยุด event จะลอยขึ้นไปถึง onClick ของ
         * <svg> ที่สั่งเลิกเลือก กลายเป็นกดจังหวัดแล้วมันเคลียร์ตัวเองทันที
         */
        const pick = (event) => {
          event.stopPropagation();
          onSelect(isSelected ? null : code);
        };

        return (
          <g
            key={code}
            className={`${tone} transition-[fill] duration-200 ${
              isActive ? "cursor-pointer focus:outline-none" : ""
            }`}
            /* จังหวัดที่ไม่เคยลงพื้นที่เป็นแค่ฉากหลัง ไม่ให้กดและไม่ให้ tab ไปโดน */
            onClick={isActive ? pick : undefined}
            onKeyDown={
              isActive
                ? (event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      pick(event);
                    }
                  }
                : undefined
            }
            tabIndex={isActive ? 0 : undefined}
            role={isActive ? "button" : undefined}
            aria-pressed={isActive ? isSelected : undefined}
            aria-label={
              isActive ? `${province?.th} ${counts[code]} โครงการ` : undefined
            }
          >
            {/* tooltip ของเบราว์เซอร์เอง — กันเหนียวตอนชี้ค้าง */}
            {isActive && province && (
              <title>{`${province.th} — ${counts[code]} โครงการ`}</title>
            )}

            {TH_MAP_PATHS[code].map((d, i) => (
              <path key={i} d={d} vectorEffect="non-scaling-stroke" />
            ))}

            {/* วาดหลัง path เสมอ SVG ไม่มี z-index ชิ้นที่วาดทีหลังอยู่บน */}
            {isActive && marker && (
              <circle
                cx={marker.cx}
                cy={marker.cy}
                r={radiusFor(counts[code], max)}
                vectorEffect="non-scaling-stroke"
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}
