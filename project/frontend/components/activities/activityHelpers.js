// Small date/price helpers for the data-driven activity detail components.
// Adapted from lib/forestBathing.js, but working directly on the column
// names that come back from Supabase (start_date/end_date/full_price)
// instead of the static LOCATIONS shape (start/end/fullPrice).

const addDays = (iso, n) => {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + n));
  return dt.toISOString().slice(0, 10);
};

/** ทุกวันในทริป (รวมวันเริ่มและวันจบ) */
export function tripDates(trip) {
  const out = [];
  for (let d = trip.start_date; d <= trip.end_date; d = addDays(d, 1)) out.push(d);
  return out;
}

/** จำนวนวัน / คืน ของทริป */
export function tripLength(trip) {
  const days = tripDates(trip).length;
  return { days, nights: Math.max(0, days - 1) };
}

/** ทริปที่ครอบวันนี้ ของกิจกรรมหนึ่ง (ใช้ตอนกดวันในปฏิทิน) */
export const tripForDate = (activity, iso) =>
  (activity.activity_trips ?? []).find((t) => iso >= t.start_date && iso <= t.end_date) ?? null;

/** หาว่าวันนี้เป็นทริปของกิจกรรมไหน — ค้นข้ามทุกกิจกรรมที่เปิดจอง */
export function tripAndActivityForDate(activities, iso) {
  for (const activity of activities) {
    const trip = tripForDate(activity, iso);
    if (trip) return { activity, trip };
  }
  return null;
}

/** ทริปถัดไปที่ยังไม่จบ — null ถ้าไม่มี */
export function nextTrip(activity, today = new Date()) {
  const todayIso = today.toISOString().slice(0, 10);
  return (
    (activity.activity_trips ?? [])
      .filter((t) => t.end_date >= todayIso)
      .sort((a, b) => a.start_date.localeCompare(b.start_date))[0] ?? null
  );
}

/** ทุกวันที่มีกิจกรรม ของกิจกรรมที่เปิดจองแล้วเท่านั้น — ใช้โชว์เป็น event date ในปฏิทิน */
export const openActivityDates = (activities) =>
  activities.filter((a) => a.is_open).flatMap((a) => (a.activity_trips ?? []).flatMap(tripDates));

const TH_MONTHS = [
  "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
  "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค.",
];
const EN_MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const parts = (iso) => iso.split("-").map(Number);

/** "2026-09-05" -> "5 ก.ย. 2026" / "5 Sep 2026" */
export function formatDate(iso, lang = "th") {
  const [y, m, d] = parts(iso);
  const months = lang === "en" ? EN_MONTHS : TH_MONTHS;
  return `${d} ${months[m - 1]} ${y}`;
}

/** ช่วงวันของทริป — ย่อเดือน/ปีที่ซ้ำกันออก */
export function formatTrip(trip, lang = "th") {
  if (trip.start_date === trip.end_date) return formatDate(trip.start_date, lang);

  const [ys, ms, ds] = parts(trip.start_date);
  const [ye, me, de] = parts(trip.end_date);
  const months = lang === "en" ? EN_MONTHS : TH_MONTHS;

  if (ys === ye && ms === me) return `${ds}–${de} ${months[ms - 1]} ${ys}`;
  if (ys === ye) return `${ds} ${months[ms - 1]} – ${de} ${months[me - 1]} ${ys}`;
  return `${formatDate(trip.start_date, lang)} – ${formatDate(trip.end_date, lang)}`;
}

export const formatPrice = (n) => `THB ${Number(n).toLocaleString("en-US")}`;

/** ส่วนลดเป็น % จากราคาเต็ม ปัดเป็นจำนวนเต็ม — คำนวณสด ไม่ได้เก็บไว้ในข้อมูล */
export const discountPct = (trip) => {
  const full = Number(trip?.full_price) || 0;
  const now = Number(trip?.price) || 0;
  if (!full || !now || full <= now) return 0;
  return Math.round(((full - now) / full) * 100);
};
