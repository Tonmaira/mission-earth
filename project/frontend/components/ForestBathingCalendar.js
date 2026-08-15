"use client";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];
const MONTH_NAMES = [
  "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
  "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER",
];

const pad = (n) => String(n).padStart(2, "0");
export const dateKey = (year, month, day) => `${year}-${pad(month + 1)}-${pad(day)}`;

function DayCell({ day, iso, isEvent, isSelected, todayIso, onSelect, disabled }) {
  if (day === null) return <div className="h-[30px] w-[30px]" />;

  const isToday = iso === todayIso;
  const isPast = iso < todayIso; // เทียบสตริงได้เลยเพราะ iso เป็น YYYY-MM-DD เติมศูนย์หน้าแล้ว

  // วันที่มีกิจกรรมกับวันนี้ = เต็ม 100%
  // วันธรรมดา: อนาคต 50% / อดีต 20% — ให้สายตาไหลไปข้างหน้า ไม่ไปติดวันที่จองไม่ได้แล้ว
  const dim = isEvent || isToday ? "" : isPast ? "opacity-20" : "opacity-50";

  const box = (
    <div
      className={`flex h-[30px] w-[30px] flex-col items-center justify-center rounded-md transition-colors ${dim} ${
        isEvent ? "border" : ""
      } ${isSelected ? "border-[#FDF164] bg-[#FDF164]" : isEvent ? "border-[#FDF164]" : ""}`}
    >
      <span
        className={`text-[14px] leading-none ${isSelected ? "text-[#002740]" : "text-white"} ${
          isToday ? "font-bold" : ""
        }`}
      >
        {day}
      </span>
      {isToday ? (
        /* วันนี้เท่านั้น = สามเหลี่ยมขาวชี้ขึ้น (clip-path อ่านง่ายกว่า border trick) */
        <span
          className="mt-[4px] h-[5px] w-[6px] bg-white"
          style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}
        />
      ) : (
        <span
          className={`mt-[4px] h-[5px] w-[5px] rounded-full ${
            isSelected ? "bg-[#002740]" : isEvent ? "bg-[#FDF164]" : "border border-white"
          }`}
        />
      )}
    </div>
  );

  // Only session days are clickable, and only when the location is open.
  if (!isEvent || !onSelect || disabled) return box;

  return (
    <button
      type="button"
      onClick={() => onSelect(iso)}
      aria-pressed={isSelected}
      aria-label={`เลือกวันที่ ${iso}`}
      className="rounded-md hover:scale-110 transition-transform"
    >
      {box}
    </button>
  );
}

function MonthCard({ year, month, eventDates, selectedDates, todayIso, onSelectDate, disabled }) {
  const startDow = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [
    ...Array.from({ length: startDow }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="w-[222px]">
      <div className="flex h-9 items-baseline justify-between">
        <span className="text-[24px] font-medium leading-none text-[#FDF164]">
          {MONTH_NAMES[month]}
        </span>
        <span className="text-[16px] leading-none text-white">{year}</span>
      </div>

      <div className="mt-[10px] grid grid-cols-7 gap-[2px]">
        {WEEKDAYS.map((w, i) => (
          <div
            key={i}
            className="flex h-[30px] w-[30px] items-center justify-center text-[13px] text-[#A1A9B9]"
          >
            {w}
          </div>
        ))}
        {cells.map((day, i) => {
          const iso = day === null ? null : dateKey(year, month, day);
          return (
            <DayCell
              key={i}
              day={day}
              iso={iso}
              isEvent={iso !== null && eventDates.has(iso)}
              isSelected={iso !== null && selectedDates.has(iso)}
              todayIso={todayIso}
              onSelect={onSelectDate}
              disabled={disabled}
            />
          );
        })}
      </div>
    </div>
  );
}

export default function ForestBathingCalendar({
  eventDates,
  monthCount = 4,
  from = new Date(),
  selectedDates = [],
  onSelectDate = null,
  disabled = false,
  columns = 2,
}) {
  const events = eventDates instanceof Set ? eventDates : new Set(eventDates);
  const selected =
    selectedDates instanceof Set ? selectedDates : new Set(selectedDates);

  const months = Array.from({ length: monthCount }, (_, i) => {
    const d = new Date(from.getFullYear(), from.getMonth() + i, 1);
    return { year: d.getFullYear(), month: d.getMonth() };
  });

  const now = new Date();
  const todayIso = dateKey(now.getFullYear(), now.getMonth(), now.getDate());

  return (
    <div
      className={`grid grid-cols-1 justify-items-center gap-x-[68px] gap-y-[54px] ${
        columns === 2 ? "md:grid-cols-2" : ""
      }`}
    >
      {months.map(({ year, month }) => (
        <MonthCard
          key={`${year}-${month}`}
          year={year}
          month={month}
          eventDates={events}
          selectedDates={selected}
          todayIso={todayIso}
          onSelectDate={onSelectDate}
          disabled={disabled}
        />
      ))}
    </div>
  );
}
