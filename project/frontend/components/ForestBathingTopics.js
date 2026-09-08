"use client";
import { useTranslations } from "next-intl";
import ThaiText from "@/components/ThaiText";

/* เนื้อหา 9 หัวข้อของหน้า Forest Bathing — pill ใน section #info เป็น anchor ลงมาที่นี่
 *
 * ข้อความทั้งหมดอยู่ใน messages/{en,th}/forestBathing.json ที่ info.topics[]
 * หัวข้อที่มี heading แล้ว = มีเนื้อหาจริง จะเรนเดอร์เต็มรูปแบบ
 * หัวข้อที่ยังมีแต่ body = ยังรอ copy จากทีม ขึ้นเป็นบล็อกสั้น ๆ ไปก่อน
 *
 * layout ของแต่ละหัวข้อต่างกัน จึงเลือกจาก key (ดู TOPIC_BODY ท้ายไฟล์)
 * หัวข้อใหม่ที่ไม่ได้อยู่ใน TOPIC_BODY จะได้แค่ heading + lead ซึ่งก็ใช้ได้เลย
 */

// ไอคอนจับคู่กับ items[] ตามลำดับ — อยู่ในโค้ดไม่ใช่ไฟล์ภาษา เพราะไม่ใช่ข้อความที่ต้องแปล
const SENSE_ICONS = [
  "SightIcon",
  "SoundIcon",
  "SmellIcon",
  "TasteIcon",
  "TouchIcon",
  "SixthSenseIcon",
];
const PILLAR_ICONS = ["physicalIcon", "BiochemicalIcon_4", "CognitiveIcon", "socialIcon_2"];

/** ไอคอนใน /public/icon ถูก export มาคนละสี (บ้างขาว บ้างเหลือง บ้างดำ)
 *  เลยใช้ตัว svg เป็น mask แล้วระบายสีเอง — สีคุมจากที่นี่ที่เดียว
 *  และ export ไฟล์ใหม่ทับเมื่อไหร่ก็ไม่ต้องมาแก้สีซ้ำ */
function TopicIcon({ name, className = "" }) {
  const url = `url(/icon/${name}.svg)`;

  return (
    <span
      aria-hidden
      className={`block bg-[#FDF164] ${className}`}
      style={{
        maskImage: url,
        WebkitMaskImage: url,
        maskSize: "contain",
        WebkitMaskSize: "contain",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskPosition: "center",
      }}
    />
  );
}

/** แถวหัวเรื่องที่มีเส้นคาดใต้ — ซ้ายคือคำเกริ่น ขวาคือชื่อหัวข้อ */
function TopicHeader({ eyebrow, title }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-[#FDF164] pb-2 text-[14px] text-[#FDF164] sm:text-[16px]">
      <p><ThaiText>{eyebrow}</ThaiText></p>
      <p className="text-right font-semibold"><ThaiText>{title}</ThaiText></p>
    </div>
  );
}

/** ประสาทสัมผัสทั้ง 6 — ไอคอน + ชื่อ + คำอธิบาย เรียง 3 คอลัมน์ */
function SensesGrid({ items, t }) {
  return (
    <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, i) => (
        <div key={item.name} className="flex flex-col items-center text-center">
          <TopicIcon name={SENSE_ICONS[i]} className="h-[88px] w-[88px]" />
          <p className="mt-4 text-[15px] font-semibold text-white sm:text-[16px]">
            {t("forestBathing.info.senseNo", { n: i + 1 })}
          </p>
          <h4 className="text-[20px] font-semibold text-white sm:text-[24px]">
            <ThaiText>{item.name}</ThaiText>
          </h4>
          <p className="mt-2 max-w-[300px] text-pretty text-[15px] leading-relaxed text-white/85 sm:text-[16px]">
            <ThaiText>{item.desc}</ThaiText>
          </p>
        </div>
      ))}
    </div>
  );
}

/** เสาหลัก 4 ข้อ — ไอคอนใหญ่ซ้าย เลขกำกับขวา เรียง 2 คอลัมน์ */
function PillarsGrid({ items }) {
  return (
    <div className="mt-14 grid grid-cols-1 gap-x-16 gap-y-12 md:grid-cols-2">
      {items.map((item, i) => (
        <div key={item.name} className="flex items-start gap-4">
          <TopicIcon name={PILLAR_ICONS[i]} className="h-[140px] w-[110px] shrink-0 sm:w-[140px]" />

          <div className="flex-1">
            <p className="font-sans text-[36px] font-semibold leading-none text-[#CEA872] sm:text-[45px]">
              {i + 1}
            </p>
            <h4 className="mt-4 text-[18px] font-semibold text-[#F5F5F5] sm:text-[20px]">
              <ThaiText>{item.name}</ThaiText>
            </h4>
            {/* ไฟล์ภาษาอังกฤษชื่อไทยกับชื่ออังกฤษเป็นอันเดียวกัน ไม่ต้องขึ้นซ้ำ */}
            {item.en !== item.name && (
              <p className="text-[15px] text-[#F5F5F5] sm:text-[17px]">{item.en}</p>
            )}
            <p className="mt-3 text-pretty text-[15px] leading-relaxed text-[#F5F5F5]/85 sm:text-[17px]">
              <ThaiText>{item.desc}</ThaiText>
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

/** จุดแข็ง 2 ข้อ — ข้อความล้วน ไม่มีไอคอน */
function StrengthsGrid({ items, t }) {
  return (
    <div className="mt-14 grid grid-cols-1 gap-x-16 gap-y-10 md:grid-cols-2">
      {items.map((item, i) => (
        <div key={item.name}>
          <p className="text-[15px] text-[#FDF164] sm:text-[17px]">
            {t("forestBathing.info.strengthNo", { n: i + 1 })}
          </p>
          <h4 className="mt-2 text-[18px] font-semibold text-[#FDF164] sm:text-[20px]">
            <ThaiText>{item.name}</ThaiText>
          </h4>
          <p className="mt-3 whitespace-pre-line text-pretty text-[15px] leading-relaxed text-[#FDF164] sm:text-[17px]">
            <ThaiText>{item.desc}</ThaiText>
          </p>
        </div>
      ))}
    </div>
  );
}

const TOPIC_BODY = {
  senses: SensesGrid,
  pillars: PillarsGrid,
  why: StrengthsGrid,
};

export default function ForestBathingTopics() {
  const t = useTranslations();
  const topics = t.raw("forestBathing.info.topics");

  return (
    <div className="mx-auto flex max-w-[1200px] flex-col gap-28">
      {topics.map((topic) => {
        const Body = TOPIC_BODY[topic.key];

        return (
          <section key={topic.key} id={`info-${topic.key}`} className="scroll-mt-[90px]">
            {topic.heading ? (
              <>
                <TopicHeader eyebrow={topic.eyebrow} title={topic.title} />

                <div className="mt-[30px] flex flex-col items-center gap-[30px]">
                  <h3 className="whitespace-pre-line text-center text-[20px] leading-normal text-[#FDF164] sm:text-[24px]">
                    <ThaiText>{topic.heading}</ThaiText>
                  </h3>
                  <p className="max-w-[700px] whitespace-pre-line text-pretty text-center text-[15px] leading-relaxed text-[#FDF164] sm:text-[16px]">
                    <ThaiText>{topic.lead}</ThaiText>
                  </p>
                </div>

                {Body && <Body items={topic.items} t={t} />}
              </>
            ) : (
              // ยังรอ copy จริง — แก้ที่ messages/{en,th}/forestBathing.json → info.topics[]
              <>
                <TopicHeader eyebrow="" title={topic.label} />
                <p className="mt-6 text-pretty text-[15px] leading-relaxed text-white/75 sm:text-[16px]">
                  <ThaiText>{topic.body}</ThaiText>
                </p>
              </>
            )}
          </section>
        );
      })}
    </div>
  );
}
