"use client";

import { useEffect, useState } from "react";

/**
 * Suggests turning the phone sideways, and gets out of the way when asked.
 *
 * The slides are a 1920×1080 design. Held upright a phone can only show that
 * as a letterbox a fifth of the screen tall, so the deck is far better read
 * turned — but this only offers, it doesn't insist: dismiss it and the upright
 * layout (stacked, with a single top bar at the very top) is there to read.
 *
 * The choice is kept for the tab, so it asks once rather than every time the
 * phone is turned back upright.
 */

const UPRIGHT_PHONE = "(max-width: 767px) and (orientation: portrait)";
const DISMISSED = "credential:rotate-hint-dismissed";

export default function RotateGate() {
  const [upright, setUpright] = useState(false);
  const [dismissed, setDismissed] = useState(true); // assume dismissed until we've checked

  useEffect(() => {
    setDismissed(sessionStorage.getItem(DISMISSED) === "1");

    const mq = window.matchMedia(UPRIGHT_PHONE);
    const sync = () => setUpright(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const dismiss = () => {
    sessionStorage.setItem(DISMISSED, "1");
    setDismissed(true);
  };

  if (!upright || dismissed) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 bg-me-navy px-10 text-center"
      onClick={dismiss}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- flat SVG, nothing for the optimizer to do */}
      <img src="/credential/wordmark-horizontal.svg" alt="Mission Earth" className="w-40" />

      <svg
        viewBox="0 0 120 88"
        className="w-28 text-me-gold"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {/* the phone as it should end up: on its side */}
        <rect x="22" y="34" width="76" height="46" rx="7" />
        <line x1="90" y1="48" x2="90" y2="66" opacity="0.4" />
        {/* and the turn to get there */}
        <path d="M28 26a34 34 0 0 1 64 0" opacity="0.75" />
        <path d="M92 26l-9-3M92 26l-3 9" />
      </svg>

      <div className="space-y-2">
        <p className="text-lg font-semibold text-me-gold">หมุนโทรศัพท์เพื่อดูสไลด์เต็มจอ</p>
        <p className="text-sm text-me-cream/60">Rotate your phone for the full slides</p>
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          dismiss();
        }}
        className="rounded-full border border-me-gold/50 px-6 py-3 text-[13px] text-me-gold transition-colors hover:bg-me-gold hover:text-me-navy"
      >
        อ่านแบบแนวตั้งต่อ
      </button>
    </div>
  );
}
