"use client";

/** The wordmark / client bar that runs across the top of every deck slide. */
export default function SlideTopBar({ preparedFor = "Osotspa Public Company Limited" }) {
  return (
    <section className="cover-top">
      <div className="cover-brand">
        {/* eslint-disable-next-line @next/next/no-img-element -- flat SVG, nothing for the optimizer to do */}
        <img src="/credential/wordmark-horizontal.svg" alt="Mission Earth" />
        <span>Co., Ltd.</span>
      </div>

      <dl className="cover-client">
        <dt>PREPARED FOR</dt>
        <dd>{preparedFor}</dd>
      </dl>
    </section>
  );
}
