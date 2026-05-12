"use client";
import ActivitiesPanel from "./ActivitiesPanel";

/**
 * EarthFeed — full section for the Home page
 *
 * Structure:
 *   <EarthFeed>
 *     <ActivitiesPanel />   ← left 72% (calendar + card slider)
 *     <EarthFeedPanel />    ← right 28% (latest articles/events)
 *   </EarthFeed>
 *
 * Usage in Home page:
 *   import EarthFeed from "./earthfeed/EarthFeed";
 *   <EarthFeed />
 */
export default function EarthFeed() {
  return (
    <section className="w-full h-full bg-[#002740] pt-[85px]">
      <div className="w-full h-[calc(100dvh-85px)] flex">
        <ActivitiesPanel />
      </div>
    </section>
  );
}