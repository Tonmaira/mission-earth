/*
 * สร้าง PDF ของเด็ค /credential ทุกเวอร์ชัน เก็บลง public/credential-pdf/
 *
 * รันตอน build (ดู `build` ใน package.json) ไม่ใช่ตอนมีคนกดปุ่ม เพราะเนื้อหา
 * เด็คทั้งหมดอยู่ในโค้ด — works.js, caseStudies.js, clientBriefs.js,
 * partnerLogos.js — แก้ทีไรก็ต้อง deploy อยู่แล้ว ไฟล์ที่สร้างตอน build จึง
 * ไม่มีทางเก่ากว่าเว็บ ผลคือกดปุ่มแล้วได้ไฟล์ทันที ไม่กิน RAM ตอนใช้งาน และ
 * production ไม่ต้องมี Chromium (Vercel ก็ไม่มีให้อยู่แล้ว)
 *
 * ต้องรันหลัง `next build` เพราะมันเปิดเซิร์ฟเวอร์จาก build output ขึ้นมา
 * แล้วสั่งเบราว์เซอร์ไปโหลดหน้าเด็คจริงๆ
 *
 * รันเองได้ด้วย: npm run pdf   (ต้อง next build ไว้ก่อน)
 */
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { cp, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC_DIR = path.join(ROOT, "public");
const OUT_DIR = path.join(PUBLIC_DIR, "credential-pdf");
const PORT = Number(process.env.PDF_BUILD_PORT ?? 4321);
const ORIGIN = `http://127.0.0.1:${PORT}`;

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
 * เปิดเซิร์ฟเวอร์จาก build output แล้วรอจนกว่าจะตอบจริง — ไม่ใช่แค่รอเวลาเดาๆ
 *
 * ใช้ `.next/standalone/server.js` ไม่ใช่ `next start` เพราะโปรเจกต์ตั้ง
 * `output: "standalone"` ไว้ (สำหรับ Docker) ซึ่ง `next start` ใช้ด้วยกันไม่ได้
 * — มันจะเตือนแล้วเสิร์ฟไม่ถูกต้อง
 *
 * standalone server คาดหวังให้ `public/` กับ `.next/static/` วางอยู่ข้างๆ ตัวมัน
 * (Dockerfile ก็ copy แบบนี้) เลยต้องวางให้ก่อนสตาร์ต
 */
async function startServer() {
  const standalone = path.join(ROOT, ".next", "standalone");
  await cp(path.join(ROOT, "public"), path.join(standalone, "public"), {
    recursive: true,
    force: true,
  });
  await cp(path.join(ROOT, ".next", "static"), path.join(standalone, ".next", "static"), {
    recursive: true,
    force: true,
  });

  const server = spawn("node", ["server.js"], {
    cwd: standalone,
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, NODE_ENV: "production", PORT: String(PORT), HOSTNAME: "127.0.0.1" },
  });
  server.stderr.on("data", (d) => process.stderr.write(`[deck server] ${d}`));

  const deadline = Date.now() + 60_000;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(`${ORIGIN}/credential`, { signal: AbortSignal.timeout(3000) });
      if (res.ok) return server;
    } catch {
      // not up yet
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  server.kill("SIGTERM");
  throw new Error(`deck server did not become ready on ${ORIGIN} within 60s`);
}

async function renderDeck(browser, slug) {
  const page = await browser.newPage();
  try {
    // เท่ากับเฟรมออกแบบ เพื่อให้ทุกอย่างที่อิง viewport (svh, --fit) ตรงกับบนจอ
    await page.setViewport({ width: 1920, height: 1080 });

    await page.setRequestInterception(true);
    page.on("request", async (req) => {
      if (req.resourceType() !== "image") return req.continue();

      /*
       * เสิร์ฟไฟล์ใน public/ จากดิสก์ตรงๆ ไม่ผ่านเซิร์ฟเวอร์
       *
       * standalone server ตอบ 404 ให้ไฟล์ที่ชื่อมีช่องว่าง (เช่น
       * "ARCH cu@3x.png" — ส่วน "SCG@3x.png" ไม่เป็นไร) ซึ่งเป็นนิสัยของ
       * standalone โดยเฉพาะ Vercel กับ next dev เสิร์ฟได้ปกติทั้งคู่ แต่ตอน
       * build เราจำเป็นต้องใช้ standalone เลยอ่านจากไฟล์เองซะเลย — ได้ผลพลอย
       * ได้คือ asset ทุกใบไม่ต้องพึ่งพฤติกรรมของเซิร์ฟเวอร์อีกต่อไป
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

    const url = `${ORIGIN}/credential${slug ? `/${slug}` : ""}`;
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
    server = await startServer();
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-dev-shm-usage", "--hide-scrollbars"],
      // the flatten-and-load-images step is real work on a 15-slide deck, and
      // a CI box is slower than a laptop — the 30s default is not enough
      protocolTimeout: 180_000,
    });

    for (const deck of decks) {
      const started = Date.now();
      const pdf = await renderDeck(browser, deck.slug);
      await writeFile(path.join(OUT_DIR, deck.file), pdf);
      const kb = Math.round(pdf.length / 1024);
      console.log(`  ✓ ${deck.file} — ${kb}KB in ${((Date.now() - started) / 1000).toFixed(1)}s`);
    }
    console.log(`[credential pdf] ${decks.length} deck(s) written to public/credential-pdf/`);
  } finally {
    await browser?.close();
    server?.kill("SIGTERM");
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
