"use client";

import SlideTopBar from "./SlideTopBar";
import WorksIndexList from "./WorksIndexList";

/**
 * "ALL WORKS" — the deck's index slide. The list itself is WorksIndexList,
 * shared with the public /portfolio page; this only supplies the slide's frame.
 */
export default function WorksIndexSlide({ preparedFor }) {
  return (
    <div className="slide-stage flex flex-col pb-10 md:pb-8">
      <SlideTopBar preparedFor={preparedFor} />

      {/* centred in what the top bar leaves, as the reference index is — the
          list is shorter than the slide and would otherwise sit all at the top */}
      <section className="flex flex-1 flex-col justify-center">
        {/* the work pages live on the public site — open them alongside the
            deck rather than navigating the presentation away from itself */}
        <WorksIndexList newTab />
      </section>
    </div>
  );
}
