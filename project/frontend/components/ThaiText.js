import { Fragment } from "react";
import { thaiChunks } from "@/lib/thaiWrap";

/* ครอบข้อความไทยเพื่อคุมจุดตัดบรรทัด — ดูเหตุผลทั้งหมดใน lib/thaiWrap.js
 *
 *   <p className="...">
 *     <ThaiText>{topic.lead}</ThaiText>
 *   </p>
 *
 * ข้อความอังกฤษส่งผ่านได้เลย ไม่มีอะไรเปลี่ยน
 * ใช้กับ parent ที่เป็น whitespace-pre-line ได้ เพราะ \n ถูกปล่อยไว้นอกช่วง nowrap
 */
export default function ThaiText({ children }) {
  const parts = thaiChunks(children);
  if (!parts) return children ?? null;

  return parts.map((part, i) => {
    if (!part.nowrap) return <Fragment key={i}>{part.text}</Fragment>;

    // zero-width space คั่นไว้ให้ชัดว่ารอยต่อระหว่างสองช่วงตัดบรรทัดได้
    // (ตัวมันอยู่นอก span จึงไม่โดน nowrap คุม) ช่วงแรกไม่ต้องมี
    return (
      <Fragment key={i}>
        {i > 0 && parts[i - 1].nowrap ? "\u200B" : null}
        <span className="whitespace-nowrap">{part.text}</span>
      </Fragment>
    );
  });
}
