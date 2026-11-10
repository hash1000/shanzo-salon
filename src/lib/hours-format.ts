import type { SalonHours } from "@/lib/salon-hours-schema";

export const SALON_WEEK = [
  { key: "mon", label: "Monday" },
  { key: "tue", label: "Tuesday" },
  { key: "wed", label: "Wednesday" },
  { key: "thu", label: "Thursday" },
  { key: "fri", label: "Friday" },
  { key: "sat", label: "Saturday" },
  { key: "sun", label: "Sunday" },
] as const;
export type SalonDay = (typeof SALON_WEEK)[number]["key"];
export type SalonRanges = SalonHours["weekly"][SalonDay];
const minutesOf = (time: string) =>
  Number(time.slice(0, 2)) * 60 + Number(time.slice(3));

export function chicagoNow(
  now: Date,
  tz: string,
): { day: SalonDay; minutes: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);
  const get = (type: string) =>
    parts.find((part) => part.type === type)?.value ?? "";
  return {
    day: get("weekday").toLowerCase() as SalonDay,
    minutes: (Number(get("hour")) % 24) * 60 + Number(get("minute")),
  };
}
export function isOpenNow(ranges: SalonRanges, minutes: number) {
  return ranges.some(
    (range) =>
      minutesOf(range.open) <= minutes && minutes < minutesOf(range.close),
  );
}
export function fmtTime(time: string) {
  const [hour, minute] = time.split(":").map(Number);
  return `${hour % 12 || 12}${minute ? `:${String(minute).padStart(2, "0")}` : ""} ${hour >= 12 ? "PM" : "AM"}`;
}
export function todayDateString(now: Date, tz: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const get = (type: string) => parts.find((part) => part.type === type)!.value;
  return `${get("year")}-${get("month")}-${get("day")}`;
}
export function formatSalonRanges(ranges: SalonRanges) {
  return ranges.length
    ? [...ranges]
        .sort((a, b) => a.open.localeCompare(b.open))
        .map((range) => `${fmtTime(range.open)} – ${fmtTime(range.close)}`)
        .join(", ")
    : "Closed";
}
