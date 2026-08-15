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
export default function DeckShell({ children, bgTuning }) {
  const scrollerRef = useRef(null);
  const railRef = useRef(null);
  const tweenRef = useRef(0);
  const tweeningRef = useRef(false);
  // which slide the URL hash asked for on arrival, until `active` reaches it
  const openedOn = useRef(null);
  const [active, setActive] = useState(0);
  const [chromeHidden, setChromeHidden] = useState(true);
  const [railOpen, setRailOpen] = useState(false);
  const [railRow, setRailRow] = useState(-1);

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
   * Whether the rail is showing its names, worked out from where the pointer
   * actually is rather than from CSS :hover or mouseenter/mouseleave.
   *
   * Safari leaves :hover switched on for a `position: fixed` element after the
   * pointer has left it, and the rail is fixed — so the names stayed up there
   * while Chrome behaved perfectly. (The giveaway: the row's own :hover did
   * clear, so the pointed-at name faded and every other one hung around.)
   * A point-in-rectangle test has no such moods.
   *
   * The rail is fixed and centred, so its box only moves when the window
   * resizes — measure once and keep it rather than re-measuring per move.
   */
  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    let box = el.getBoundingClientRect();
    let rows = [];
    const remeasure = () => {
      box = el.getBoundingClientRect();
      rows = Array.from(el.querySelectorAll("button"), (b) => b.getBoundingClientRect());
    };
    const onMove = (e) => {
      const inside =
        e.clientX >= box.left && e.clientX <= box.right && e.clientY >= box.top && e.clientY <= box.bottom;
      // the gaps between rows count as on the rail but on no row in particular
      const row = inside ? rows.findIndex((r) => e.clientY >= r.top && e.clientY <= r.bottom) : -1;
      // returning the same value is a no-op, so these do not re-render on every
      // mouse move — only when the pointer crosses a boundary
      setRailOpen((was) => (was === inside ? was : inside));
      setRailRow((was) => (was === row ? was : row));
    };
    const close = () => {
      setRailOpen(false);
      setRailRow(-1);
    };

    remeasure();
    // Both pointer and mouse events, deliberately. WebKit has been known to
    // stop delivering `pointermove` after certain interactions while plain
    // `mousemove` keeps coming, and the rail closing depends entirely on
    // hearing that the pointer has moved away.
    document.addEventListener("pointermove", onMove);
    document.addEventListener("mousemove", onMove);
    // the pointer can also leave by going out of the window, where no further
    // moves arrive to notice it with
    document.addEventListener("pointerleave", close);
    document.addEventListener("mouseleave", close);
    window.addEventListener("blur", close);
    window.addEventListener("resize", remeasure);
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("pointerleave", close);
      document.removeEventListener("mouseleave", close);
      window.removeEventListener("blur", close);
      window.removeEventListener("resize", remeasure);
    };
  }, [slides.length]);

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
        Slide rail. Deliberately plain: the names sit on screen the whole time
        and the only moving part is a CSS hover, so there is no open/closed
        state to get stuck in. An earlier version faded the names in and out on
        a timer and kept ending up with labels hanging around; nothing here
        holds state beyond which slide is active.

        Every row stretches to the width of the longest name, so the blank
        ground in front of a short name still belongs to its row and can be
        clicked. The tick sits in a fixed-width box so growing on hover cannot
        shove the names sideways.
      */}
      <nav
        ref={railRef}
        aria-label="Slides"
        className="fixed right-4 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-3 md:flex"
      >
        {slides.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => goTo(i)}
            aria-current={i === active ? "true" : undefined}
            className="flex w-full cursor-pointer items-center justify-end gap-3 py-1"
          >
            {/* Pointing anywhere on the rail brings all six names up together
                and leaving takes them all away; `railRow` picks out the one
                being pointed at. Both come from the pointer's coordinates, not
                from :hover — see the measuring effect above for why.
                Appearing is quick, leaving is slow, and the duration travels
                with the state being moved into. */}
            <span
              className={`whitespace-nowrap text-[10px] uppercase tracking-[0.2em] transition-[opacity,color] ${
                railOpen ? "opacity-100 duration-150" : "opacity-0 duration-700"
              } ${i === active ? "text-me-gold" : i === railRow ? "text-white" : "text-white/45"}`}
            >
              {s.label || `Slide ${i + 1}`}
            </span>
            <span className="flex w-8 justify-end" aria-hidden="true">
              <span
                className={`block h-px transition-all ${i === railRow ? "duration-150" : "duration-700"} ${
                  i === active
                    ? "w-8 bg-me-gold"
                    : i === railRow
                      ? "w-6 bg-white"
                      : "w-4 bg-white/30"
                }`}
              />
            </span>
          </button>
        ))}
      </nav>

      {/* slide counter — hides on any slide that fills its own frame. The
          keyboard hint that used to sit bottom-centre is gone; ← →, space,
          Home/End and F still work, they are just no longer advertised. */}
      <div
        className={`pointer-events-none fixed bottom-6 left-6 z-20 font-mono text-[11px] tracking-[0.28em] text-white/45 transition-opacity duration-500 ${
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
