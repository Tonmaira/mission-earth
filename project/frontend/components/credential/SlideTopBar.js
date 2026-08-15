"use client";

import { usePreparedFor } from "./preparedFor";

/**
 * The wordmark / client bar that runs across the top of every deck slide.
 *
 * The client name comes from the URL (see preparedFor.js) unless a slide passes
 * one explicitly. With no name the whole right-hand block is left out rather
 * than printed empty, so the generic deck simply carries the wordmark.
 */
export default function SlideTopBar({ preparedFor }) {
  const fromUrl = usePreparedFor();
  const client = preparedFor ?? fromUrl;

  return (
    <section className="cover-top">
      <div className="cover-brand">
        {/* eslint-disable-next-line @next/next/no-img-element -- flat SVG, nothing for the optimizer to do */}
        <img src="/credential/wordmark-horizontal.svg" alt="Mission Earth" />
        <span>Co., Ltd.</span>
      </div>

      {client && (
        <dl className="cover-client">
          <dt>PREPARED FOR</dt>
          <dd>{client}</dd>
        </dl>
      )}
    </section>
  );
}
