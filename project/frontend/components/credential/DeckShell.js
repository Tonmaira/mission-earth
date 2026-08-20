"use client";

import { Children, isValidElement, useCallback, useEffect, useMemo, useRef, useState } from "react";
import LiquidGrainBackground from "./LiquidGrainBackground";
import RotateGate from "./RotateGate";

/** How long one slide change takes. The cross-fade is `--slide-fade` in globals.css. */
const SLIDE_MS = 1100;

const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

/**
 * The presentation shell: one full-viewport scroller holding the slides, the
 * liquid background behind them, and the slide counter.
 *
 * Snapping is `proximity`, not `mandatory` — with mandatory, any slide taller
 * than the viewport fights the user and snaps back to its own top.
 *
 * There is no on-screen slide rail. Navigation is by scroll and by keyboard:
 * ← → / space / PageUp / PageDown step (paging through a tall slide before
 * moving on), Home and End jump to the ends, F toggles fullscreen.
 */
export default function DeckShell({ children, bgTuning, client = "" }) {
  const scrollerRef = useRef(null);
  const railRef = useRef(null);
  const tweenRef = useRef(0);
  const tweeningRef = useRef(false);
  // which slide the URL hash asked for on arrival, until `active` reaches it
  const openedOn = useRef(null);
  const [active, setActive] = useState(0);
  const [chromeHidden, setChromeHidden] = useState(true);
  const [railOpen, setRailOpen] = useState(false);
  // "link copied" confirmation, cleared on a timer — see copyLink below
  const [linkCopied, setLinkCopied] = useState(false);
  // the PDF takes a few seconds to render server-side; the button says so
  const [pdfBusy, setPdfBusy] = useState(false);
  const [pdfFailed, setPdfFailed] = useState(false);

  // Read off the <Slide> props rather than the mounted sections: querying the
  // DOM for `data-label` could land mid-swap on a Fast Refresh and hand back
  // blank names, which then stuck until a full reload.
  const slides = useMemo(
    () =>
      Children.toArray(children)
        .filter(isValidElement)
        .map((child, i) => ({ id: child.props.id || `slide-${i}`, label: child.props.label || "" })),
    [children]
  );

  /*
   * The rail panel is closed until the corner icon is clicked, then stays
   * open until a click lands outside it (the icon itself counts as "outside
   * the panel" but is inside this same wrapper, so clicking it to close
   * doesn't get read as an outside click and immediately reopen it — see the
   * icon's own onClick below). Being click-driven rather than hover-driven
   * also sidesteps a Safari quirk this used to work around by hand: Safari
   * leaves :hover switched on for a `position: fixed` element after the
   * pointer has left it, which is a problem for hover-to-open but not for a
   * plain click listener.
   */
  useEffect(() => {
    const onDocClick = (e) => {
      if (railRef.current && !railRef.current.contains(e.target)) {
        setRailOpen(false);
      }
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const sections = useCallback(
    () => Array.from(scrollerRef.current?.querySelectorAll("[data-slide]") ?? []),
    []
  );

  // Active slide = the last one whose top has passed 60% of the viewport, so a
  // slide takes over once it fills the lower 40% of the screen. Earlier than
  // that and the fade lags the scroll, leaving the incoming slide blank while
  // it is already well in view.
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    let ticking = false;

    const measure = () => {
      ticking = false;
      const line = scroller.scrollTop + scroller.clientHeight * 0.6;
      const els = sections();
      let idx = 0;
      for (let i = 0; i < els.length; i++) {
        if (els[i].offsetTop <= line) idx = i;
      }
      // While we are driving the scroll, goTo has already flagged the slides —
      // re-deriving them from position here would light the outgoing slide back
      // up until the scroll passes the line.
      if (!tweeningRef.current) {
        els.forEach((el, i) => el.toggleAttribute("data-inactive", i !== idx));
        setActive(idx);
      }
      // a full-bleed slide is a finished design that owns its whole frame, so
      // the counter and hint step aside rather than land on top of its content
      setChromeHidden(els[idx]?.hasAttribute("data-bleed") ?? false);
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(measure);
    };

    measure();
    scroller.addEventListener("scroll", onScroll, { passive: true });
    return () => scroller.removeEventListener("scroll", onScroll);
  }, [sections, slides.length]);

  /**
   * Scrolls with our own tween. The browser's `behavior: "smooth"` runs at a
   * fixed pace that cannot be slowed down, and a deck wants a calmer move than
   * a web page does — so the duration lives here, in SLIDE_MS.
   */
  const animateTo = useCallback((top) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    cancelAnimationFrame(tweenRef.current);

    const start = scroller.scrollTop;
    const distance = top - start;
    if (Math.abs(distance) < 1) {
      tweeningRef.current = false;
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      scroller.scrollTop = top;
      tweeningRef.current = false;
      return;
    }

    // Scroll snapping has to stand down while we drive: left on, the browser
    // sees the tween approach a snap point and jumps the rest of the way, which
    // ends the move in roughly half the time we asked for.
    scroller.style.scrollSnapType = "none";

    const began = performance.now();
    const frame = (now) => {
      const p = Math.min((now - began) / SLIDE_MS, 1);
      scroller.scrollTop = start + distance * easeInOutCubic(p);
      if (p < 1) {
        tweenRef.current = requestAnimationFrame(frame);
      } else {
        scroller.style.scrollSnapType = "";
        tweeningRef.current = false;
      }
    };
    tweenRef.current = requestAnimationFrame(frame);
  }, []);

  // a tween must never fight the user: any manual scroll cancels it
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const stop = () => {
      cancelAnimationFrame(tweenRef.current);
      scroller.style.scrollSnapType = "";
      tweeningRef.current = false;
    };
    scroller.addEventListener("wheel", stop, { passive: true });
    scroller.addEventListener("touchstart", stop, { passive: true });
    return () => {
      cancelAnimationFrame(tweenRef.current);
      scroller.removeEventListener("wheel", stop);
      scroller.removeEventListener("touchstart", stop);
    };
  }, []);

  const goTo = useCallback(
    (i) => {
      const els = sections();
      const el = els[i];
      if (!el) return;
      // Start the cross-fade on the keypress, not once the scroll has travelled
      // far enough to re-derive it. Otherwise the outgoing slide sweeps most of
      // the way up the screen at full opacity first — very obvious on WHAT WE DO,
      // whose white logo strip crosses the whole viewport.
      tweeningRef.current = true;
      els.forEach((s, n) => s.toggleAttribute("data-inactive", n !== i));
      setActive(i);
      setChromeHidden(el.hasAttribute("data-bleed"));
      animateTo(el.offsetTop);
    },
    [animateTo, sections]
  );

  // paging: inside a tall slide, step through its content before jumping on
  const step = useCallback(
    (dir) => {
      const scroller = scrollerRef.current;
      if (!scroller) return;
      const els = sections();
      const el = els[active];
      if (!el) return;

      const page = scroller.clientHeight * 0.85;
      const top = scroller.scrollTop;

      if (dir > 0) {
        const slideEnd = el.offsetTop + el.offsetHeight;
        if (slideEnd - (top + scroller.clientHeight) > 8) {
          animateTo(Math.min(top + page, slideEnd - scroller.clientHeight));
          return;
        }
        goTo(Math.min(active + 1, els.length - 1));
      } else {
        if (top - el.offsetTop > 8) {
          animateTo(Math.max(top - page, el.offsetTop));
          return;
        }
        goTo(Math.max(active - 1, 0));
      }
    },
    [active, animateTo, goTo, sections]
  );

  /*
   * "Download PDF" hands over a file that already exists: the decks are
   * rendered once at build time by scripts/gen-credential-pdf.mjs and shipped
   * as static files. Nothing is generated per click, so the download starts
   * instantly and production needs no Chromium at all.
   *
   * (Two earlier cuts, for anyone wondering why it isn't simpler: the
   * browser's own `window.print()` makes the reader pick "Save as PDF" and —
   * on Safari, which ignores the CSS `@page` size — hand-fix A4 portrait
   * first. Rendering per request in an API route fixed that but cost ~1.2GB
   * of Chromium per click, which Vercel has no browser to run anyway.)
   *
   * `fetch` first rather than pointing a link straight at the file: a missing
   * file would otherwise navigate the reader away from the deck to a 404
   * page, and the deck's content only changes on deploy, so a stale build
   * without its PDF is exactly the case worth reporting in place.
   */
  const downloadPdf = useCallback(async () => {
    if (pdfBusy) return;
    setRailOpen(false);
    setPdfBusy(true);
    const file = `mission-earth-credential${client ? `-${client}` : ""}.pdf`;
    try {
      const res = await fetch(`/credential-pdf/${file}`);
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);

      const href = URL.createObjectURL(await res.blob());
      const a = document.createElement("a");
      a.href = href;
      a.download = file;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(href);
    } catch (err) {
      console.error(`[credential deck] PDF download failed: ${err.message}`);
      setPdfFailed(true);
      setTimeout(() => setPdfFailed(false), 4000);
    } finally {
      setPdfBusy(false);
    }
  }, [client, pdfBusy]);

  const copyLink = useCallback(async () => {
    try {
      /*
       * The hash is dropped on purpose. The deck keeps the slide you are on
       * in the URL (see the replaceState effect below), so `location.href`
       * mid-deck is a deep link into whatever slide happened to be on screen
       * when the button was pressed. What gets sent to a client should open
       * on the cover and be read from the top, so copy the bare deck URL.
       */
      const url = new URL(window.location.href);
      url.hash = "";
      await navigator.clipboard.writeText(url.toString());
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (err) {
      // clipboard writes need a secure context (https or localhost) and can be
      // refused outright by permissions policy — say so rather than leaving a
      // button that silently does nothing
      console.warn(`[credential deck] copy link failed: ${err.name}: ${err.message}`);
    }
  }, []);

  const toggleFullscreen = useCallback(() => {
    const el = document.documentElement;
    const inFS = document.fullscreenElement || document.webkitFullscreenElement;
    // requestFullscreen() rejects silently in a few real situations (an
    // embedding iframe without the `fullscreen` permission, some in-app
    // browser/webview shells) — log the reason instead of failing quietly,
    // since "press F, nothing happens" is otherwise undiagnosable.
    const action = !inFS
      ? (el.requestFullscreen || el.webkitRequestFullscreen)?.call(el)
      : (document.exitFullscreen || document.webkitExitFullscreen)?.call(document);
    action?.catch?.((err) => {
      console.warn(`[credential deck] fullscreen request failed: ${err.name}: ${err.message}`);
    });
  }, []);

  /*
   * The deck keeps the slide you are on in the URL hash, and opens on whatever
   * slide the hash names. That is what makes leaving for a work's own page and
   * coming back land you on the index you left from rather than the cover: the
   * history entry for /credential already reads #all-works.
   *
   * `replaceState`, so scrolling the deck doesn't fill the back button with a
   * step per slide. The opening jump is deliberately instant — animating a
   * scroll on arrival would look like the page had loaded wrong.
   */
  useEffect(() => {
    const scroller = scrollerRef.current;
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!scroller || !id) return;
    const els = sections();
    const index = els.findIndex((el) => el.id === id);
    if (index < 0) return;
    openedOn.current = index;
    scroller.scrollTop = els[index].offsetTop;
    els.forEach((el, i) => el.toggleAttribute("data-inactive", i !== index));
    setActive(index);
    setChromeHidden(els[index].hasAttribute("data-bleed"));
    // once, on arrival
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    /*
     * Wait for `active` to catch up with the arrival jump above before touching
     * the URL. `setActive` doesn't apply within the effect pass that calls it,
     * so without this the first run here would write the hash for slide 0 —
     * overwriting the very hash we arrived on, and the deck would then reopen
     * on the cover instead of where the visitor left.
     */
    if (openedOn.current !== null && openedOn.current !== active) return;
    openedOn.current = null;

    const id = slides[active]?.id;
    if (!id || window.location.hash === `#${id}`) return;
    window.history.replaceState(null, "", `#${id}`);
  }, [active, slides]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      switch (e.key) {
        case "ArrowDown":
        case "ArrowRight":
        case "PageDown":
        case " ":
          e.preventDefault();
          step(1);
          break;
        case "ArrowUp":
        case "ArrowLeft":
        case "PageUp":
          e.preventDefault();
          step(-1);
          break;
        case "Home":
          e.preventDefault();
          goTo(0);
          break;
        case "End":
          e.preventDefault();
          goTo(sections().length - 1);
          break;
        case "f":
        case "F":
          toggleFullscreen();
          break;
        default:
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goTo, sections, step, toggleFullscreen]);

  return (
    <>
      <LiquidGrainBackground tuning={bgTuning} />

      {/* upright phones get "turn me sideways" instead of the deck */}
      <RotateGate />

      <div
        ref={scrollerRef}
        className="deck-scroller h-[100svh] w-full snap-y snap-proximity overflow-y-auto overscroll-contain text-white/90"
      >
        {children}
      </div>

      {/*
        Slide picker — built from the Figma frame at node 70:150. A diamond
        icon sits fixed in the corner; click it and a panel of every slide
        name opens directly above it, current slide bold. Click a name and it
        both jumps there and closes the panel back up — click the icon again,
        or anywhere else on the page (the click-outside effect above), and it
        just closes with no jump.

        The panel is positioned `absolute` off the icon rather than stacked
        above it in normal flow, so it can be hidden with opacity/scale alone
        (no `hidden`/unmount) without shoving the icon out of its corner while
        closed — it only ever affects space above itself.
      */}
      <div ref={railRef} className="credential-chrome fixed right-6 bottom-6 z-20 hidden md:block">
        <div
          className={`absolute right-0 bottom-full mb-4 flex max-h-[calc(100svh-8rem)] origin-bottom-right flex-col overflow-hidden rounded-[13px] bg-[#052032] transition-[opacity,transform] duration-200 ${
            railOpen ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"
          }`}
        >
          {/* the list scrolls on its own rather than the whole panel, so the
              gold action bar below stays pinned to the bottom edge on a short
              window instead of scrolling away with the names */}
          <div className="flex min-h-0 flex-col items-end gap-3 overflow-y-auto p-5">
            {slides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  goTo(i);
                  setRailOpen(false);
                }}
                aria-current={i === active ? "true" : undefined}
                className={`whitespace-nowrap text-[13px] tracking-[0.12em] text-me-gold transition-colors hover:text-white ${
                  i === active ? "font-semibold opacity-[100%]" : "font-normal opacity-[50%]"
                }`}
              >
                {(s.label || `Slide ${i + 1}`).toUpperCase()}
              </button>
            ))}
          </div>

          {/*
            The actions are not slides, so they get their own bar rather than
            another row in the list — gold ground, edge to edge, clipped to
            the panel's rounded bottom by the `overflow-hidden` above.
            Icon-only: `title` carries the name on hover, `aria-label` for
            screen readers, and for COPY LINK the icon swapping to the whole
            chain is itself the "done" feedback.
          */}
          <div className="flex shrink-0 items-center justify-center gap-10 bg-me-gold px-5 py-3">
            {/*
              Download PDF is an internal tool, not something a client should
              see. The deck's PDFs are rendered on our own machine with
              `npm run pdf` (see scripts/gen-credential-pdf.mjs) and sent to
              clients by hand — they are never deployed, so on the live site
              this button would only ever 404.

              `NODE_ENV` is inlined at build time, so on the deployed site
              this whole branch is dropped from the bundle rather than merely
              hidden with CSS.
            */}
            {process.env.NODE_ENV === "development" && (
              <button
                type="button"
                onClick={downloadPdf}
                disabled={pdfBusy}
                title={
                  pdfBusy
                    ? "Rendering…"
                    : pdfFailed
                      ? "Not found — run `npm run pdf` first"
                      : "Download PDF (local only)"
                }
                aria-label={pdfBusy ? "Rendering PDF" : "Download PDF"}
                aria-busy={pdfBusy}
                className={`cursor-pointer transition-opacity hover:opacity-70 disabled:cursor-wait ${
                  pdfBusy ? "animate-pulse opacity-50" : pdfFailed ? "opacity-40" : ""
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- flat SVG, nothing for the optimizer to do */}
                <img src="/PDFDownload.svg" alt="" className="size-[30px]" />
              </button>
            )}

            <button
              type="button"
              onClick={copyLink}
              title={linkCopied ? "Link copied" : "Copy link"}
              aria-label={linkCopied ? "Link copied" : "Copy link"}
              className="cursor-pointer transition-opacity hover:opacity-70"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- flat SVG, nothing for the optimizer to do */}
              <img
                src={linkCopied ? "/AfterGetLinkIcon.svg" : "/BeforeGetLinkIcon.svg"}
                alt=""
                className="size-[34px]"
              />
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setRailOpen((was) => !was)}
          aria-label={railOpen ? "Close slide list" : "Open slide list"}
          aria-expanded={railOpen}
          className="flex size-[50px] cursor-pointer items-center justify-center"
        >
          <span className="block size-[25px] rotate-45 rounded-[7px] border border-me-gold/40 transition-colors hover:border-me-gold/70" />
        </button>
      </div>

      {/* slide counter — hides on any slide that fills its own frame. The
          keyboard hint that used to sit bottom-centre is gone; ← →, space,
          Home/End and F still work, they are just no longer advertised. */}
      <div
        className={`credential-chrome pointer-events-none fixed bottom-6 left-6 z-20 font-mono text-[11px] tracking-[0.28em] text-white/45 transition-opacity duration-500 ${
          chromeHidden ? "opacity-0" : "opacity-100"
        }`}
      >
        {String(active + 1).padStart(2, "0")}
        <span className="mx-1 text-white/25">/</span>
        {String(Math.max(slides.length, 1)).padStart(2, "0")}
      </div>
    </>
  );
}
