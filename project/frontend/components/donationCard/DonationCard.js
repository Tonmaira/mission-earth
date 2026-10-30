"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Cropper from "react-easy-crop";
import { Download, ImagePlus } from "lucide-react";

/* พิกัดทั้งหมดเป็นพิกัดบนการ์ดขนาดจริง 940x788
   ไฟล์ที่ดาวน์โหลดขยาย SCALE เท่า ตัวหนังสือกับรูปผู้บริจาคจะได้คมพอโพสต์ลง Facebook */
const W = 940;
const H = 788;
const SCALE = 2;

const PHOTO = { x: 545, y: 72, w: 331, h: 432, r: 6 };
const QR = { x: 64, y: 572, size: 158 };
// กล่องยอดเงิน ชื่อผู้บริจาคใช้ความกว้างเดียวกับกล่องนี้ จะได้ไม่ล้นไปทับรูป
const BOX = { x: 47, y: 277, w: 425, h: 93 };
const BANNER = { x: 38, y: 560, w: 864, h: 185, r: 20 };

/* ชิ้นส่วนกราฟิกใน public/maecharim/ ไฟล์พวกนี้มีขอบโปร่งใสรอบ ๆ เยอะ
     src    [x, y, w, h] ส่วนที่มองเห็นจริงในไฟล์ (พิกเซลของไฟล์ต้นฉบับ) ไม่ใส่ = ทั้งไฟล์
            ถ้าเปลี่ยนไฟล์ต้องวัดใหม่ — เปิดในโปรแกรมแต่งรูปแล้วดูกรอบของส่วนที่ไม่โปร่งใส
     dest   [x, y, w, h] ตำแหน่งบนการ์ด 940x788
     slice  ขนาดมุม (พิกเซลของไฟล์) สำหรับชิ้นที่ต้องยืดเป็นสัดส่วนอื่น มุมโค้งจะไม่บิดตาม
     k      ย่อมุมลงเท่าไหร่ (ไม่ใส่ = ตามสัดส่วนความสูงที่ย่อ) ใช้ทำเส้นกรอบทองให้บางลง
     alpha  ความทึบ
     clip   วาดเฉพาะในแถบด้านล่าง ไม่ให้ใบไม้ล้นออกไป */
const grow = ({ x, y, w, h }, d) => [x - d, y - d, w + d * 2, h + d * 2];
const ART = {
  background: { file: "01-background-base.png", dest: [0, 0, W, H] },
  sparkle: { file: "11-light-overlay.png", dest: [0, 0, W, H] },
  leaf: { file: "05-soft-leaf.png", src: [212, 95, 1125, 846], dest: [0, 190, 72, 54], alpha: 0.85 },
  logo: { file: "maeCharimLogo.png", src: [91, 69, 619, 620], dest: [13, 6, 84, 84] }, // เอาแค่วงกลม ไม่เอาชื่อใต้โลโก้
  whiteBox: { file: "06-white-box.png", src: [246, 211, 1681, 301], dest: grow(BOX, 4), slice: 70 },
  pill: { file: "07-green-pill.png", src: [357, 218, 1101, 428], dest: [46, 391, 64, 34], slice: 214 },
  frame: { file: "02-gold-frame.png", src: [85, 66, 948, 1285], dest: grow(PHOTO, 18), slice: 140, k: 0.25 },
  floralTopLeft: { file: "03-floral-top-left.png", src: [252, 42, 964, 967], dest: [482, 16, 168, 169] },
  floralBottomRight: { file: "04-floral-bottom-right.png", src: [279, 65, 1072, 1036], dest: [732, 345, 200, 193] },
  banner: { file: "08-bottom-banner.png", src: [53, 169, 2069, 422], dest: grow(BANNER, 3), slice: 90 },
  rose: { file: "09-pale-rose.png", src: [34, 79, 1314, 1034], dest: [716, 578, 200, 157], alpha: 0.55, clip: true },
  foliage: { file: "10-pale-foliage.png", src: [33, 25, 1445, 976], dest: [610, 650, 150, 101], alpha: 0.45, clip: true },
  /* ไฟล์ QR ที่ได้มาถูกยืดมาไม่เป็นจัตุรัส (728x699) ตัดเอาเฉพาะตัวโค้ดแล้ววางลงจัตุรัส
     เว้นขอบขาวรอบ ๆ ไว้ (quiet zone) ไม่งั้นแอปธนาคารบางตัวสแกนไม่ติด */
  qr: { file: "12-qr.png", src: [24, 22, 728, 699], dest: grow({ x: QR.x, y: QR.y, w: QR.size, h: QR.size }, -9) },
};
const BOX_CX = BOX.x + BOX.w / 2;
// ชื่อยาวขึ้นบรรทัดใหม่ได้ไม่เกิน 2 บรรทัด ยาวกว่านั้นย่อฟอนต์ลงจนพอดี
const NAME = { cx: BOX_CX, y: 230, size: 38, wrapSize: 34, maxW: BOX.w - 20, maxLines: 2, color: "#2B6895", weight: 400 };
const AMOUNT = { cx: BOX_CX, y: 340, size: 31, maxW: BOX.w - 30, color: "#0F4078", weight: 600 };

// ดาวน์โหลดเป็น JPG เสมอ ไฟล์เล็กกว่า PNG ราว 7 เท่า (~320KB กับ 2.2MB) ภาพแทบไม่ต่าง เหมาะกับโพสต์ลง Facebook/LINE
const JPG_QUALITY = 0.92;

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

/* "45.28" → "45.28", "1500" → "1,500", "1500.5" → "1,500.50"
   คืน null ถ้าไม่ใช่ตัวเลข */
export function formatBaht(raw) {
  const clean = raw.replace(/[,\s]/g, "");
  if (!/^\d+(\.\d+)?$/.test(clean)) return null;
  const hasSatang = clean.includes(".");
  return Number(clean).toLocaleString("en-US", {
    minimumFractionDigits: hasSatang ? 2 : 0,
    maximumFractionDigits: 2,
  });
}

// ยอดเงินยาวเกินกล่องให้ย่อฟอนต์ลงจนพอดี
function fitText(ctx, text, { size, maxW, weight }, family) {
  let s = size;
  do {
    ctx.font = `${weight} ${s}px ${family}`;
    if (ctx.measureText(text).width <= maxW) break;
    s -= 1;
  } while (s > 12);
}

/* จัดกึ่งกลางเองด้วยการวัดความกว้าง ไม่ใช้ textAlign = "center"
   เพราะ Safari ไม่สนค่านี้ ตัวหนังสือที่ควรอยู่กลางเลยไปเริ่มที่จุดกึ่งกลางแทน */
function fillCentered(ctx, str, cx, y) {
  ctx.textAlign = "left";
  ctx.fillText(str, cx - ctx.measureText(str).width / 2, y);
}

function text(ctx, str, x, y, { size, weight = 400, color, align = "left", italic = false, family }) {
  ctx.font = `${italic ? "italic " : ""}${weight} ${size}px ${family}`;
  ctx.fillStyle = color;
  if (align === "center") return fillCentered(ctx, str, x, y);
  ctx.textAlign = "left";
  ctx.fillText(str, x, y);
}

/* ตัดบรรทัดตามคำ คำเดียวที่ยาวเกินบรรทัดจะยังอยู่บรรทัดเดียว แล้วไปย่อฟอนต์เอาใน layoutName
   bySpace: ตัดเฉพาะตรงเว้นวรรค — ชื่อคนที่ตัดตามพจนานุกรมจะขาดกลางชื่อ เช่น "คุณสม|หญิง"
   ไม่งั้นให้ Intl.Segmenter แยกคำไทยที่ไม่มีเว้นวรรคให้ */
function wrapLines(ctx, str, maxW, bySpace) {
  const words = bySpace
    ? str.split(/(?<=\s)/)
    : [...new Intl.Segmenter("th", { granularity: "word" }).segment(str)].map((s) => s.segment);
  const lines = [];
  let line = "";
  for (const word of words) {
    if (line && ctx.measureText(line + word).width > maxW) {
      lines.push(line.trim());
      line = word.trimStart();
    } else {
      line += word;
    }
  }
  if (line.trim()) lines.push(line.trim());
  return lines;
}

function layoutName(ctx, name, family) {
  const { size, wrapSize, maxW, maxLines, weight } = NAME;
  ctx.font = `${weight} ${size}px ${family}`;
  if (ctx.measureText(name).width <= maxW) return { size, lines: [name] };
  const fits = (lines) => lines.length <= maxLines && lines.every((l) => ctx.measureText(l).width <= maxW);
  for (let s = wrapSize; s > 12; s -= 1) {
    ctx.font = `${weight} ${s}px ${family}`;
    for (const bySpace of /\s/.test(name) ? [true, false] : [false]) {
      const lines = wrapLines(ctx, name, maxW, bySpace);
      if (fits(lines)) return { size: s, lines };
    }
  }
  return { size: 12, lines: wrapLines(ctx, name, maxW) };
}

function pill(ctx, x, y, w, h, fill) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, h / 2);
  ctx.fillStyle = fill;
  ctx.fill();
}

/* วาดแบบ 9 ส่วน: มุมทั้งสี่ย่อตามสัดส่วนเดียวกัน ส่วนขอบกับตรงกลางยืดได้
   กล่องขาว/แถบล่าง/กรอบทองจึงยืดเป็นสัดส่วนไหนก็ได้โดยมุมโค้งไม่บิดเบี้ยว */
function drawSliced(ctx, img, [sx, sy, sw, sh], s, [dx, dy, dw, dh], k) {
  const d = s * k;
  const xs = [sx, sx + s, sx + sw - s, sx + sw];
  const ys = [sy, sy + s, sy + sh - s, sy + sh];
  const xd = [dx, dx + d, dx + dw - d, dx + dw];
  const yd = [dy, dy + d, dy + dh - d, dy + dh];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const w = xs[i + 1] - xs[i];
      const h = ys[j + 1] - ys[j];
      if (w <= 0 || h <= 0) continue; // ยาเม็ดสีเขียวเป็นครึ่งวงกลมสองข้าง ไม่มีแถวกลาง
      ctx.drawImage(img, xs[i], ys[j], w, h, xd[i], yd[j], xd[i + 1] - xd[i], yd[j + 1] - yd[j]);
    }
  }
}

function drawArt(ctx, art, img) {
  const src = art.src || [0, 0, img.naturalWidth, img.naturalHeight];
  ctx.save();
  if (art.alpha) ctx.globalAlpha = art.alpha;
  if (art.clip) {
    ctx.beginPath();
    ctx.roundRect(BANNER.x, BANNER.y, BANNER.w, BANNER.h, BANNER.r);
    ctx.clip();
  }
  if (art.slice) {
    const [, , dw, dh] = art.dest;
    // ย่อมุมตามความสูง ยาเม็ดที่เป็นครึ่งวงกลมล้วนจะได้เต็มความสูงพอดี (แต่มุมสองข้างต้องไม่เกินความกว้าง)
    drawSliced(ctx, img, src, art.slice, art.dest, art.k ?? Math.min(dh / src[3], dw / (2 * art.slice)));
  } else {
    ctx.drawImage(img, ...src, ...art.dest);
  }
  ctx.restore();
}

/* ---------- การ์ด ---------- */

function drawCard(ctx, { images, photo, crop, name, amountText, family }) {
  ctx.setTransform(SCALE, 0, 0, SCALE, 0, 0);
  ctx.imageSmoothingQuality = "high";
  ctx.textBaseline = "alphabetic";
  const t = (str, x, y, opts) => text(ctx, str, x, y, { family, ...opts });
  const art = (key) => drawArt(ctx, ART[key], images[key]);

  art("background");
  art("sparkle");
  art("leaf");

  // หัวการ์ด
  art("logo");
  t("โรงพยาบาลแม่จริม", 112, 46, { size: 22, weight: 600, color: "#2F3B4A" });
  t("Mae Charim Hospital จังหวัดน่าน", 112, 71, { size: 17, color: "#2F3B4A" });
  t("ขอขอบพระคุณ", 38, 146, { size: 30, weight: 600, color: "#3D6B45" });

  // ชื่อผู้บริจาค
  if (name) {
    const { size, lines } = layoutName(ctx, name, family);
    const lineH = size * 1.25;
    ctx.fillStyle = NAME.color;
    // หลายบรรทัดจัดให้ทั้งก้อนอยู่กึ่งกลางที่ตำแหน่งเดิมของชื่อบรรทัดเดียว
    lines.forEach((line, i) => fillCentered(ctx, line, NAME.cx, NAME.y + (i - (lines.length - 1) / 2) * lineH));
  }

  // กล่องยอดเงิน
  art("whiteBox");
  t("บริจาค", 52, 297, { size: 16, weight: 600, color: "#2B6895" });
  if (amountText) {
    fitText(ctx, amountText, AMOUNT, family);
    ctx.fillStyle = AMOUNT.color;
    fillCentered(ctx, amountText, AMOUNT.cx, AMOUNT.y);
  }

  // วัตถุประสงค์
  art("pill");
  t("เพื่อ", 78, 414, { size: 16, color: "#FFFFFF", align: "center" });
  ["เพื่อสนับสนุนอุปกรณ์การแพทย์", "สำหรับผู้ป่วยและการดำเนินงานของ", "โรงพยาบาลแม่จริม"].forEach((line, i) =>
    t(line, 118, 413 + i * 22, { size: 18, color: "#1F3A5F" }),
  );
  [
    "โรงพยาบาลแม่จริมขอให้ท่านและครอบครัว",
    "ประสบแต่ความสุข ความเจริญและสัมฤทธิ์ผลในสิ่งอันพึงปรารถนา",
    "ทุกประการ",
  ].forEach((line, i) => t(line, 45, 499 + i * 20, { size: 14, color: "#2B6895", italic: true }));

  // รูปผู้บริจาค แล้ววาดกรอบทับ
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(PHOTO.x, PHOTO.y, PHOTO.w, PHOTO.h, PHOTO.r);
  ctx.clip();
  if (photo && crop) {
    ctx.drawImage(photo, crop.x, crop.y, crop.width, crop.height, PHOTO.x, PHOTO.y, PHOTO.w, PHOTO.h);
  } else {
    ctx.fillStyle = "#E3E8EE";
    ctx.fillRect(PHOTO.x, PHOTO.y, PHOTO.w, PHOTO.h);
    t("รูปผู้บริจาค", PHOTO.x + PHOTO.w / 2, PHOTO.y + PHOTO.h / 2, { size: 18, color: "#8A97A6", align: "center" });
  }
  ctx.restore();
  // ขอบขาวรอบรูป
  ctx.lineWidth = 4;
  ctx.strokeStyle = "#FFFFFF";
  ctx.beginPath();
  ctx.roundRect(PHOTO.x - 2, PHOTO.y - 2, PHOTO.w + 4, PHOTO.h + 4, PHOTO.r + 2);
  ctx.stroke();
  art("frame");
  art("floralTopLeft");
  art("floralBottomRight");

  // แถบบริจาคด้านล่าง
  art("banner");
  art("foliage");
  art("rose");
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(QR.x, QR.y, QR.size, QR.size);
  art("qr");
  t("ร่วมบริจาคเพื่อโรงพยาบาลแม่จริม", 245, 600, { size: 18, weight: 600, color: "#3B2E2E" });
  t("ชื่อบัญชี เงินบริจาคโรงพยาบาลแม่จริม · ธนาคารออมสิน", 245, 629, { size: 18, color: "#2B6895" });
  t("020259058889", 245, 670, { size: 32, weight: 600, color: "#E0336A" });
  pill(ctx, 245, 688, 270, 29, "#FBE9B5");
  t("ลดหย่อนภาษีได้ 2 เท่า · e-Donation", 380, 708, { size: 14, color: "#2B4F7A", align: "center" });
  t("โทร. 054-711-036", 531, 708, { size: 16, color: "#4A4A4A" });
}

export default function DonationCard({ fontFamily }) {
  const canvasRef = useRef(null);
  const [images, setImages] = useState(null);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [photoUrl, setPhotoUrl] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [cropPixels, setCropPixels] = useState(null);

  const formatted = amount ? formatBaht(amount) : null;
  const amountText = formatted ? `เงินจำนวน ${formatted} บาท` : "";
  const ready = name.trim() && formatted && photo && cropPixels;

  // ไฟล์ประกอบกับฟอนต์ต้องมาครบก่อนวาด ไม่งั้น canvas จะวาดด้วยฟอนต์สำรองแล้วไม่วาดใหม่
  useEffect(() => {
    let alive = true;
    const entries = Object.entries(ART);
    Promise.all([
      ...entries.map(([key, a]) => loadImage(`/maecharim/${a.file}`).then((img) => [key, img])),
      ...["400", "600", "italic 400"].map((w) => document.fonts.load(`${w} 20px ${fontFamily}`, "ก")),
    ]).then((loaded) => {
      if (alive) setImages(Object.fromEntries(loaded.slice(0, entries.length)));
    });
    return () => {
      alive = false;
    };
  }, [fontFamily]);

  useEffect(() => {
    if (!photoUrl) return;
    let alive = true;
    loadImage(photoUrl).then((img) => alive && setPhoto(img));
    return () => {
      alive = false;
    };
  }, [photoUrl]);

  useEffect(() => {
    if (!images || !canvasRef.current) return;
    drawCard(canvasRef.current.getContext("2d"), {
      images,
      photo,
      crop: cropPixels,
      name: name.trim(),
      amountText,
      family: fontFamily,
    });
  }, [images, photo, cropPixels, name, amountText, fontFamily]);

  const onPick = (e) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // เลือกไฟล์เดิมซ้ำได้
    if (!file) return;
    setPhoto(null);
    setCropPixels(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    if (photoUrl) URL.revokeObjectURL(photoUrl);
    setPhotoUrl(URL.createObjectURL(file));
  };

  const onCropComplete = useCallback((_, pixels) => setCropPixels(pixels), []);

  const onDownload = () => {
    canvasRef.current.toBlob(
      (blob) => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `ขอบคุณ-${name.trim()}.jpg`;
        a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 1000);
      },
      "image/jpeg",
      JPG_QUALITY,
    );
  };

  const input =
    "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 outline-none focus:border-[#2B6895] focus:ring-2 focus:ring-[#2B6895]/20";

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 text-slate-900 md:px-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-2xl font-semibold">การ์ดขอบคุณผู้บริจาค</h1>
        <p className="mt-1 text-sm text-slate-500">โรงพยาบาลแม่จริม · กรอกข้อมูลแล้วดาวน์โหลดเป็นรูป</p>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
          <section className="space-y-5 rounded-2xl bg-white p-5 shadow-sm">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium">ชื่อผู้บริจาค</span>
              <input className={input} value={name} onChange={(e) => setName(e.target.value)} placeholder="เช่น น้องปลาจะระเม็ด" />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium">จำนวนเงิน (บาท)</span>
              <input
                className={input}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                inputMode="decimal"
                placeholder="เช่น 45.28"
              />
              {amount && !formatted && <span className="mt-1 block text-sm text-red-600">ใส่เป็นตัวเลข เช่น 1500 หรือ 45.28</span>}
            </label>

            <div>
              <span className="mb-1.5 block text-sm font-medium">รูปผู้บริจาค</span>
              {photoUrl && (
                <>
                  <div className="relative h-80 overflow-hidden rounded-xl bg-slate-800">
                    <Cropper
                      image={photoUrl}
                      crop={crop}
                      zoom={zoom}
                      aspect={PHOTO.w / PHOTO.h}
                      onCropChange={setCrop}
                      onZoomChange={setZoom}
                      onCropComplete={onCropComplete}
                    />
                  </div>
                  <div className="mt-3 flex items-center gap-3">
                    <span className="text-xs text-slate-500">ซูม</span>
                    <input
                      type="range" min={1} max={3} step={0.01}
                      value={zoom} onChange={(e) => setZoom(Number(e.target.value))}
                      className="flex-1 accent-[#2B6895]"
                    />
                  </div>
                  <p className="mt-1 text-xs text-slate-500">ลากรูปเพื่อเลือกส่วนที่จะแสดง</p>
                </>
              )}
              <label className="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-slate-400 px-4 py-3 text-sm text-slate-600 hover:border-[#2B6895] hover:text-[#2B6895]">
                <ImagePlus className="h-4 w-4" />
                {photoUrl ? "เปลี่ยนรูป" : "เลือกรูป"}
                <input type="file" accept="image/*" className="hidden" onChange={onPick} />
              </label>
            </div>

            <button
              onClick={onDownload}
              disabled={!ready}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#2B6895] px-5 py-3 font-semibold text-white transition hover:bg-[#245a82] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Download className="h-4 w-4" />
              ดาวน์โหลดรูป
            </button>
            {!ready && <p className="-mt-3 text-center text-xs text-slate-500">กรอกชื่อ จำนวนเงิน และใส่รูปให้ครบก่อน</p>}
          </section>

          <section>
            <canvas ref={canvasRef} width={W * SCALE} height={H * SCALE} className="block h-auto w-full rounded-2xl shadow-sm" />
          </section>
        </div>
      </div>
    </main>
  );
}
