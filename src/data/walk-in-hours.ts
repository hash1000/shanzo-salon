/** Shared walk-in types and public contact links. Edit schedules through /admin. */
export type Day = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";
export type TimeRange = { open: string; close: string };
export type DayHours = TimeRange | TimeRange[] | null;
export type Service = "hair" | "nails";
export type WalkInConfig = {
  timezone: string;
  lastUpdated: string;
  announcement?: string;
  services: Record<Service, { weekly: Record<Day, DayHours>; note?: string }>;
  overrides?: Array<{ date: string } & Partial<Record<Service, DayHours>>>;
};

export const WALK_IN_BOOKING_URL = "https://goldcoastbeauty.glossgenius.com/";
// TODO: Owner to confirm/replace this placeholder phone before publishing.
export const WALK_IN_PHONE = "+13125550100";

