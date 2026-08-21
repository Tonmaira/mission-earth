/*
 * สร้าง PDF ของเด็ค /credential ทุกเวอร์ชัน เก็บลง public/credential-pdf/
 *
 *     npm run dev      # เปิดค้างไว้
 *     npm run pdf      # ~5 วินาที
 *
 * เป็นเครื่องมือสำหรับเราใช้เอง ไม่ใช่ฟีเจอร์ของเว็บ — ไฟล์ที่ได้เอาไปส่งลูกค้า
 * เองทางอีเมล ปุ่มดาวน์โหลดในเด็คจึงโผล่เฉพาะตอน dev (ดู DeckShell.js) และ
 * public/credential-pdf/ ถูก gitignore ไว้ ไม่ได้ deploy ขึ้นเว็บจริง
 *
 * ทำไมไม่สร้างบน Vercel ตอน build: ลองมาแล้วทุกทางและแพงเกินคุ้ม —
 * serverless ไม่มี Chrome, @sparticuz/chromium ทำได้แต่ build พุ่งจาก 1.5 นาที
 * เป็น 9 นาทีทุกครั้งที่ push (เครื่อง build เป็นเครื่องใหม่ทุกรอบ ต้องแตกไฟล์
 * Chromium ใหม่ แถมมันรัน --single-process ซึ่งช้ากับหน้าหนักๆ) บนเครื่องเรา
 * ใช้ Chrome ที่มีอยู่แล้ว จบใน 5 วินาที
 *
 * ถ้าวันหนึ่งอยากให้ลูกค้าโหลดเองได้: อัปไฟล์ที่ได้ขึ้น Google Drive เอง แล้ว
 * เปลี่ยนปุ่มใน DeckShell.js เป็น <a href="ลิงก์ Drive"> (เอาเงื่อนไข NODE_ENV ออก)
 * — จะได้เปลี่ยนไฟล์ได้โดยไม่ต้อง deploy ใหม่ ไม่ต้องเอา PDF เข้า git
 */
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import next from "next";
import puppeteer from "puppeteer-core";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC_DIR = path.join(ROOT, "public");
const OUT_DIR = path.join(PUBLIC_DIR, "credential-pdf");
const PORT = Number(process.env.PDF_BUILD_PORT ?? 4321);


const MIME = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".avif": "image/avif",
};

/**
 * แปลง URL เป็น path ของไฟล์ใน public/ ถ้ามีอยู่จริง — คืน null ถ้าไม่ใช่
 *
 * กัน path traversal ด้วยการเช็คว่าไฟล์ที่ resolve แล้วยังอยู่ใต้ public/ จริง
 * (URL มาจากหน้าเว็บของเราเองก็จริง แต่กฎนี้ราคาถูกและกันพลาดในอนาคต)
 */
function publicFileFor(rawUrl) {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(rawUrl).pathname);
  } catch {
    return null;
  }
  const ext = path.extname(pathname).toLowerCase();
  if (!MIME[ext]) return null;

  const candidate = path.join(PUBLIC_DIR, pathname);
  if (!candidate.startsWith(PUBLIC_DIR + path.sep)) return null;
  return existsSync(candidate) ? candidate : null;
}

/**
 * หา Chrome ที่ติดตั้งอยู่ในเครื่อง
 *
 * สคริปต์นี้รันบนเครื่องคนทำงาน ไม่ได้รันบน CI (ดู scripts/check-credential-pdf.mjs
 * ว่าทำไม) จึงพึ่ง Chrome ที่มีอยู่แล้วได้เลย ไม่ต้องโหลด Chromium 150MB มาเก็บ
 */
function resolveBrowser() {
  const candidates = [
    process.env.CHROME_PATH,
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
  ].filter(Boolean);
  const executablePath = candidates.find((p) => existsSync(p));
  if (!executablePath) {
    throw new Error(
      `ไม่พบ Chrome บนเครื่องนี้ ลองแล้ว:\n  ${candidates.join("\n  ")}\n` +
        `ถ้าติดตั้งไว้ที่อื่น ตั้ง CHROME_PATH ชี้ไปที่ไฟล์นั้น`
    );
  }
  return {
    executablePath,
    args: ["--no-sandbox", "--disable-dev-shm-usage", "--hide-scrollbars"],
  };
}

/* ทุกเด็คที่ต้องสร้าง — เด็คกลางหนึ่ง บวกของลูกค้าทุกรายใน clients.js
   อ่านจากไฟล์เดียวกับที่เว็บใช้ เพิ่มลูกค้าที่นั่นแล้วที่นี่ตามเอง */
async function decksToRender() {
  const { clientSlugs } = await import("../components/credential/clients.js");
  return [
    { slug: "", file: "mission-earth-credential.pdf" },
    ...clientSlugs().map((slug) => ({
      slug,
      file: `mission-earth-credential-${slug}.pdf`,
    })),
  ];
}

/**
 * เปิด Next ขึ้นมาเสิร์ฟ build output ที่เพิ่งสร้าง แล้วรอจนกว่าจะตอบจริง
 *
 * เรียก Next แบบ programmatic (`next({ dev: false })`) ไม่ใช่ spawn
 * `.next/standalone/server.js` และไม่ใช่ `next start`:
 *
 *   - standalone: Vercel build ไม่ได้สร้าง `.next/standalone` แบบเดียวกับ
 *     `next build` บนเครื่อง (มันมี pipeline ของตัวเอง) เคยลองแล้วเซิร์ฟเวอร์
 *     ตายด้วย MODULE_NOT_FOUND ตอน deploy ทั้งที่บนเครื่องผ่าน
 *   - `next start`: ใช้กับ `output: "standalone"` ไม่ได้ (มันเตือนแล้วเสิร์ฟ
 *     ไม่ถูก) ซึ่งโปรเจกต์นี้ตั้งไว้เพื่อ Docker
 *
 * วิธีนี้อ่านจาก `.next` ตรงๆ เลยได้เหมือนกันทุกที่ และยังได้ image optimization
 * ของ next/image มาด้วย — สำคัญมาก เพราะรูปต้นฉบับใหญ่กว่าที่ใช้จริงหลายเท่า
 * ถ้าเสิร์ฟไฟล์ดิบ PDF จะบวมกลับไปอีก
 */
async function startServer() {
  /*
   * ถ้ามีเซิร์ฟเวอร์เปิดอยู่แล้วก็ใช้ตัวนั้นเลย (ปกติคือ `npm run dev`)
   *
   * เหตุผลไม่ใช่แค่เร็วกว่า แต่เป็นเรื่องความถูกต้อง: เซิร์ฟเวอร์ที่เราเปิดเอง
   * อ่านจาก `.next` ซึ่งเป็นผลของ `next build` ครั้งล่าสุด ถ้าเพิ่งแก้เนื้อหา
   * แล้วยังไม่ build ใหม่ มันจะสร้าง PDF จากโค้ดเก่าอย่างเงียบๆ แล้วรายงานว่า
   * สำเร็จ — เคยเจอมาแล้วจริงตอนทดสอบ ส่วน dev server hot-reload อยู่แล้ว
   * จึงเห็นของล่าสุดเสมอ
   *
   * ตอน build บน CI ไม่มีใครเปิด dev ไว้ ก็ตกไปเปิดเองตามเดิม
   */
  for (const port of [3000, PORT]) {
    try {
      const probe = `http://127.0.0.1:${port}/credential`;
      const res = await fetch(probe, { signal: AbortSignal.timeout(2000) });
      if (res.ok) {
        console.log(`[credential pdf] ใช้เซิร์ฟเวอร์ที่เปิดอยู่แล้วที่พอร์ต ${port}`);
        return { origin: `http://127.0.0.1:${port}`, close: async () => {} };
      }
    } catch {
      // ไม่มีใครเปิดอยู่ ก็เปิดเอง
    }
  }

  const ORIGIN = `http://127.0.0.1:${PORT}`;
  const app = next({ dev: false, dir: ROOT });
  await app.prepare();
  const handler = app.getRequestHandler();

  const server = createServer((req, res) => handler(req, res));
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(PORT, "127.0.0.1", resolve);
  });

  const deadline = Date.now() + 60_000;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(`${ORIGIN}/credential`, { signal: AbortSignal.timeout(3000) });
      if (res.ok) {
        return {
          origin: ORIGIN,
          close: async () => {
            await app.close?.();
            server.close();
          },
        };
      }
    } catch {
      // ยังไม่พร้อม
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  server.close();
  throw new Error(`deck server did not become ready on ${ORIGIN} within 60s`);
}

async function renderDeck(browser, origin, slug) {
  const page = await browser.newPage();
  try {
    // เท่ากับเฟรมออกแบบ เพื่อให้ทุกอย่างที่อิง viewport (svh, --fit) ตรงกับบนจอ
    await page.setViewport({ width: 1920, height: 1080 });

    await page.setRequestInterception(true);
    page.on("request", async (req) => {
      if (req.resourceType() !== "image") return req.continue();

      /*
       * <img> ที่ชี้ไฟล์ใน public/ ตรงๆ (แถบโลโก้ WHAT WE DO, โลโก้ลูกค้า)
       * อ่านจากดิสก์เลย ไม่ต้องผ่านเซิร์ฟเวอร์ — asset พวกนี้ไม่ได้ต้องการ
       * optimization อะไร และการอ่านไฟล์ตรงๆ ทำให้ไม่ต้องพึ่งว่าเซิร์ฟเวอร์
       * จัดการชื่อไฟล์แปลกๆ (เว้นวรรค, อักษรไทย) ได้ถูกหรือเปล่า ซึ่งเคยเป็น
       * ปัญหาจริงมาแล้วตอนใช้ standalone server
       *
       * ส่วน next/image (`/_next/image?url=...`) ไม่เข้าเงื่อนไขนี้ (pathname
       * ไม่มีนามสกุล) จึงตกไปให้เซิร์ฟเวอร์ทำ resize ให้ตามปกติ — ตั้งใจ
       */
      const filePath = publicFileFor(req.url());
      if (filePath) {
        try {
          return await req.respond({
            status: 200,
            contentType: MIME[path.extname(filePath).toLowerCase()],
            body: await readFile(filePath),
          });
        } catch {
          // อ่านไม่ได้ก็ปล่อยให้ไปตามทางปกติ
        }
      }

      /*
       * ขอ JPEG แทน WebP: next/image ส่ง WebP มาถ้า Accept รับได้ แต่ PDF เก็บ
       * WebP ไม่ได้ Chrome เลยถอดแล้วฝังใหม่แบบไม่สูญเสีย (Flate) ซึ่งกับรูปถ่าย
       * ใหญ่มหาศาล — เคยทำให้ไฟล์บวมจาก 3.6MB เป็น 19MB
       */
      return req.continue({
        headers: { ...req.headers(), accept: "image/jpeg,image/png,image/svg+xml,*/*" },
      });
    });

    const url = `${origin}/credential${slug ? `/${slug}` : ""}`;
    await page.goto(url, { waitUntil: "networkidle0", timeout: 60_000 });

    await page.evaluate(async () => {
      /*
       * 1. คลี่ breakpoint ของ desktop ออกมาใช้แบบไม่มีเงื่อนไข
       *
       * Chrome ตอนพิมพ์ PDF ไม่แมตช์ media query แบบ min-width (พิสูจน์แล้ว:
       * ใส่ `text-[10px] lg:text-[40px]` ออกมาได้ 10px) สไลด์ที่ใช้ Tailwind
       * lg:/xl:/3xl: จึงพิมพ์ออกมาด้วยขนาดเล็กสุด ส่วนสไลด์ที่ใช้
       * calc(N * var(--u)) ไม่กระทบ — จึงเพี้ยนแค่บางหน้า
       *
       * สองกับดักตอนเขียนโค้ดส่วนนี้: Tailwind v4 ซ่อน media rule ไว้ใน
       * @layer (ต้องไล่ลงไปข้างใน) และเขียนหน่วยเป็น rem ไม่ใช่ px
       */
      const FRAME_WIDTH = 1920;
      const rootPx = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
      const flattened = [];

      const collect = (rules) => {
        for (const rule of rules) {
          if (rule.type === CSSRule.MEDIA_RULE) {
            const query = rule.conditionText ?? rule.media.mediaText;
            if (!/max-width|max-height/.test(query)) {
              const min = /min-width:\s*(\d+(?:\.\d+)?)(px|rem)/.exec(query);
              if (min) {
                const px = min[2] === "rem" ? Number(min[1]) * rootPx : Number(min[1]);
                if (px <= FRAME_WIDTH) {
                  for (const inner of rule.cssRules) flattened.push(inner.cssText);
                  continue;
                }
              }
            }
          }
          if (rule.cssRules) collect(rule.cssRules);
        }
      };
      for (const sheet of document.styleSheets) {
        try {
          collect(sheet.cssRules);
        } catch {
          continue; // cross-origin, อ่านไม่ได้
        }
      }
      if (flattened.length) {
        const style = document.createElement("style");
        style.textContent = flattened.join("\n");
        document.head.appendChild(style);
      }

      /*
       * 2. บังคับโหลดรูปที่ตั้ง lazy ไว้
       *
       * next/image ตั้ง loading="lazy" ให้รูปนอกจอ และการพิมพ์ไม่มีการ scroll
       * รูปในสไลด์ท้ายๆ จึงไม่เคยถูกโหลดเลย ออกมาเป็นช่องว่าง
       */
      const imgs = Array.from(document.images);
      for (const img of imgs) {
        img.loading = "eager";
        if (img.fetchPriority) img.fetchPriority = "high";
      }
      await Promise.all(
        imgs.map((img) =>
          /*
           * เงื่อนไข "เสร็จแล้ว" คือ `complete` เฉยๆ ไม่ใช่ `complete &&
           * naturalWidth > 0` — รูปที่โหลดพลาดไปแล้วจะมี complete=true แต่
           * naturalWidth=0 ถ้าเช็ครวมกันมันจะไปรอ event ที่ยิงจบไปตั้งแต่ก่อน
           * เราผูก listener แล้วค้างตลอดกาล (เคยทำให้ build ค้างจริง)
           *
           * timeout เป็นตาข่ายชั้นสุดท้าย: ไม่ว่าจะเกิดอะไรกับรูปสักใบ
           * การสร้าง PDF ต้องเดินต่อได้เสมอ
           */
          img.complete
            ? Promise.resolve()
            : new Promise((resolve) => {
                const done = () => resolve();
                img.addEventListener("load", done, { once: true });
                img.addEventListener("error", done, { once: true });
                setTimeout(done, 15_000);
              })
        )
      );
    });

    // ให้เลย์เอาต์นิ่งหลังคลี่ breakpoint แล้วรอฟอนต์
    await page.evaluate(
      () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))
    );
    await page.evaluateHandle("document.fonts.ready");

    return await page.pdf({
      printBackground: true,
      // ใช้ @page { size: 1920px 1080px } ใน credential.css
      preferCSSPageSize: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });
  } finally {
    await page.close();
  }
}

async function main() {
  const decks = await decksToRender();
  await mkdir(OUT_DIR, { recursive: true });

  let server;
  let browser;
  try {
    const { executablePath, args } = resolveBrowser();
    console.log(`[credential pdf] chromium: ${executablePath}`);

    server = await startServer();
    browser = await puppeteer.launch({
      executablePath,
      args,
      headless: true,
      // การคลี่ breakpoint + รอรูปเป็นงานจริงจังบนเด็ค 15 หน้า และเครื่อง CI
      // ช้ากว่าโน้ตบุ๊ก — ค่า default 30 วิไม่พอ
      protocolTimeout: 180_000,
    });

    for (const deck of decks) {
      const started = Date.now();
      const pdf = await renderDeck(browser, server.origin, deck.slug);
      await writeFile(path.join(OUT_DIR, deck.file), pdf);
      const kb = Math.round(pdf.length / 1024);
      console.log(`  ✓ ${deck.file} — ${kb}KB in ${((Date.now() - started) / 1000).toFixed(1)}s`);
    }
    console.log(`[credential pdf] เสร็จแล้ว ${decks.length} ไฟล์ อยู่ใน public/credential-pdf/`);
  } finally {
    await browser?.close();
    await server?.close();
  }
}

main().catch((err) => {
  /*
   * ล้ม build ไปเลย
   *
   * ตอนแรกเลือกให้แค่เตือนแล้วปล่อยผ่าน ด้วยเหตุผลว่าเว็บทั้งเว็บไม่ควรขึ้นไม่ได้
   * เพราะ PDF — แต่ของจริงคือมัน deploy ออกไปพร้อมปุ่มที่กดแล้วเงียบ ไม่มีใคร
   * รู้จนกว่าจะมีคนไปกด การเตือนใน log ที่ไม่มีใครอ่านไม่ใช่การเตือน
   *
   * ล้มตรงนี้แปลว่า deploy ที่ผ่านคือ deploy ที่ปุ่มใช้งานได้จริงเสมอ และของ
   * เดิมที่ยังใช้งานได้อยู่ก็ยังคงเสิร์ฟต่อไป เพราะ Vercel ไม่สลับไป deployment
   * ที่ build ไม่ผ่าน
   */
  console.error("\n[credential pdf] FAILED — deck PDFs were not generated, failing the build.");
  console.error("  The download button would ship dead, so this stops the deploy instead.");
  console.error(err);
  process.exitCode = 1;
});
