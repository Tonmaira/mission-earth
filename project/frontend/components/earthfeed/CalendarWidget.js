import { MONTHS, DAYS } from "./tokens";

/**
 * CalendarWidget
 * Props: year, month, today, eventDays (Set), onPrev, onNext
 */
export default function CalendarWidget({ year, month, today, eventDays = new Set(), onPrev, onNext, disablePrev = false, disableNext = false, activityRange = null, onDayClick }) {
  const cells = buildCalendar(year, month);
  const firstDay = new Date(year, month, 1).getDay();

  const isInRange = (day) => {
    if (!activityRange?.start || !activityRange?.end) return false;
    const d = new Date(year, month, day);
    return d >= activityRange.start && d <= activityRange.end;
  };
  const getCol = (day) => (firstDay + day - 1) % 7;
  const isSegStart = (day) => getCol(day) === 0 || !isInRange(day - 1);
  const isSegEnd   = (day) => getCol(day) === 6 || !isInRange(day + 1);

  return (
    <div className="flex items-center gap-7 shrink-0">
      <ArrowBtn direction="left" onClick={onPrev} disabled={disablePrev} />

      <div className="flex flex-col gap-2 min-w-[222px]">
        {/* Month / Year */}
        <div className="flex justify-between items-center">
          <span className="font-poppins font-semibold text-2xl text-me-gold">
            {MONTHS[month]}
          </span>
          <span className="font-poppins text-base text-white">
            {year}
          </span>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-0.5">
          {DAYS.map((d, i) => (
            <div key={i} className="w-[30px] h-[30px] flex items-center justify-center">
              <span className="font-poppins font-semibold text-xs text-me-dim6 text-center">
                {d}
              </span>
            </div>
          ))}
        </div>

        {/* Date cells */}
        <div className="grid grid-cols-7">
          {cells.map((day, i) => {
            if (!day) return <div key={i} className="w-[30px] h-[30px]" />;

            const isToday  = day === today;
            const isPast   = today !== null && day < today;
            const hasEvent = eventDays.has(day);
            const inRange  = isInRange(day);
            const segStart = inRange && isSegStart(day);
            const segEnd   = inRange && isSegEnd(day);
            const alone    = segStart && segEnd;

            let borderClass = "";
            if (inRange) {
              borderClass = "border-t border-b border-[#CEA870]";
              if (alone)          borderClass += " border-l border-r rounded-full";
              else if (segStart)  borderClass += " border-l rounded-l-full";
              else if (segEnd)    borderClass += " border-r rounded-r-full";
            }

            return (
              <div
                key={i}
                onClick={() => !isPast && onDayClick?.(day)}
                style={inRange && !isToday ? { backgroundColor: "rgba(206,168,112,0.15)" } : undefined}
                className={`
                  w-[30px] h-[30px] flex flex-col items-center justify-center
                  pt-1 pb-0.5 transition-opacity duration-200
                  ${isPast ? "opacity-25 cursor-default" : "cursor-pointer"}
                  ${borderClass}
                  ${isToday ? "!bg-[#CEA870] rounded-full" : ""}
                `}
              >
                <span className={`
                  font-poppins text-base text-center leading-none
                  ${isToday ? "text-[#002740] font-semibold" : "text-white"}
                `}
                style={isToday ? undefined : { textShadow: "0 0 8px rgba(0,39,64,0.9), 0 1px 5px rgba(0,0,0,0.85)" }}
                >
                  {day}
                </span>
                <div className={`
                  w-1 h-1 rounded-full mt-0.5
                  ${hasEvent && !isPast && !inRange ? "bg-[#CEA870]" : "bg-transparent"}
                `} />
              </div>
            );
          })}
        </div>
      </div>

      <ArrowBtn direction="right" onClick={onNext} disabled={disableNext} />
    </div>
  );
}

function buildCalendar(year, month) {
  const first = new Date(year, month, 1).getDay();
  const total = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < first; i++) cells.push(null);
  for (let d = 1; d <= total; d++) cells.push(d);
  return cells;
}

function ArrowBtn({ direction, onClick, disabled }) {
  const isLeft = direction === "left";
  return (
    <button onClick={onClick} disabled={disabled} className={`bg-transparent border-none p-0 flex items-center shrink-0 transition-opacity duration-200 ${disabled ? "opacity-20 cursor-not-allowed" : "cursor-pointer"}`}>
      <svg width="15" height="25" viewBox="0 0 15 25" fill="none">
        {isLeft
          ? <path d="M13 2L2 12.5L13 23" stroke="#cea870" strokeWidth="2.5" strokeLinecap="round"/>
          : <path d="M2 2L13 12.5L2 23"  stroke="#cea870" strokeWidth="2.5" strokeLinecap="round"/>
        }
      </svg>
    </button>
  );
}