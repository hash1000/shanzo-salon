import { type Day, type DayHours, type Service, type WalkInConfig } from "@/data/walk-in-hours";

export const WEEK: { key: Day; label: string }[] = [
  { key: "mon", label: "Monday" }, { key: "tue", label: "Tuesday" },
  { key: "wed", label: "Wednesday" }, { key: "thu", label: "Thursday" },
  { key: "fri", label: "Friday" }, { key: "sat", label: "Saturday" },
  { key: "sun", label: "Sunday" },
];

export function getLocalNow(now: Date, timezone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone, year: "numeric", month: "2-digit", day: "2-digit",
    weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).formatToParts(now);
  const value = (type: Intl.DateTimeFormatPartTypes) => parts.find(p => p.type === type)!.value;
  return {
    date: `${value("year")}-${value("month")}-${value("day")}`,
    day: value("weekday").toLowerCase() as Day,
    minutes: Number(value("hour")) * 60 + Number(value("minute")),
  };
}

export function resolveHours(config: WalkInConfig, service: Service, date: string, day: Day): DayHours {
  const override = config.overrides?.find(item => item.date === date);
  return override?.[service] !== undefined ? override[service] : config.services[service].weekly[day];
}

const minutes = (time: string) => {
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
};
export const ranges = (hours: DayHours) => hours === null ? [] : Array.isArray(hours) ? hours : [hours];
export function getStatus(hours: DayHours, currentMinutes: number) {
  if (!ranges(hours).length) return "Not taking walk-ins today";
  return ranges(hours).some(({ open, close }) => currentMinutes >= minutes(open) && currentMinutes < minutes(close))
    ? "Open now" : "Closed now";
}
function formatTime(time: string) {
  const [hour, minute] = time.split(":").map(Number);
  return `${hour % 12 || 12}${minute ? `:${String(minute).padStart(2, "0")}` : ""} ${hour < 12 ? "AM" : "PM"}`;
}
export function formatHours(hours: DayHours) {
  return ranges(hours).map(({ open, close }) => `${formatTime(open)} – ${formatTime(close)}`);
}
