"use client";

import ContactBlock from "./ContactBlock";
import SlideTopBar from "./SlideTopBar";

/**
 * Closing slide — the deck's last.
 *
 * Built on the cover's stage so the two bookends match: same top bar, same
 * centred middle, and the address / socials block the cover keeps hidden. The
 * ME mark sits small above the contacts, marking the foot of the deck the way
 * the big lockup opens it.
 */
export default function ContactSlide({ preparedFor }) {
  return (
    <div className="slide-stage cover-stage">
      <SlideTopBar preparedFor={preparedFor} />

      <section className="cover-main">
        <div className="cover-eyebrow">
          <span className="cover-rule" aria-hidden="true" />
          <p className="cover-tracked">LET&rsquo;S WORK TOGETHER</p>
        </div>

        <h2 className="text-3xl font-light leading-tight text-me-gold md:text-5xl lg:text-[44px] 3xl:text-[56px]!">
          พร้อมเริ่มต้นเส้นทาง
          <br />
          ความยั่งยืนไปด้วยกัน
        </h2>
      </section>

      {/* the mark, then the contacts. `cover-sign` sizes the logo on its own —
          the cover's `.cover-lockup img` rule is tuned for the 700px opening
          lockup, which is far too big to sign off with. */}
      <section className="cover-foot">
        {/* eslint-disable-next-line @next/next/no-img-element -- flat SVG, nothing for the optimizer to do */}
        <img src="/full-logo-me.svg" alt="Mission Earth" className="cover-sign" />
        <ContactBlock />
      </section>
    </div>
  );
}
