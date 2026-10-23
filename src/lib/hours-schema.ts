import { z } from "zod";
import type { WalkInConfig } from "@/data/walk-in-hours";

const time = z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/, "Use a valid 24-hour time.");
const range = z.object({ open: time, close: time }).refine(v => v.close > v.open, {
  message: "Closing time must be after opening time (same day).", path: ["close"],
});
export const dayHoursSchema = z.union([z.null(), range, z.array(range).min(1).max(12)]).superRefine((value, ctx) => {
  if (!Array.isArray(value)) return;
  const sorted = [...value].sort((a, b) => a.open.localeCompare(b.open));
  if (sorted.some((v, i) => i > 0 && v.open < sorted[i - 1].close)) {
    ctx.addIssue({ code: "custom", message: "Shifts must not overlap." });
  }
});
const weekly = z.object({ mon: dayHoursSchema, tue: dayHoursSchema, wed: dayHoursSchema,
  thu: dayHoursSchema, fri: dayHoursSchema, sat: dayHoursSchema, sun: dayHoursSchema });
const service = z.object({ weekly, note: z.string().max(1000).optional() });
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(value => {
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === value;
}, "Choose a valid calendar date.");
export const overrideSchema = z.object({ date, hair: dayHoursSchema.optional(), nails: dayHoursSchema.optional() })
  .refine(v => v.hair !== undefined || v.nails !== undefined, "Choose at least one service.");

export const hoursSchema: z.ZodType<WalkInConfig, WalkInConfig> = z.object({
  timezone: z.string().max(100).refine(value => {
    try { new Intl.DateTimeFormat("en-US", { timeZone: value }); return true; } catch { return false; }
  }, "Use a valid timezone."),
  lastUpdated: z.iso.datetime({ offset: true }),
  announcement: z.string().max(2000).optional(),
  services: z.object({ hair: service, nails: service }),
  overrides: z.array(overrideSchema).max(730).optional(),
}).superRefine((value, ctx) => {
  const dates = value.overrides?.map(v => v.date) ?? [];
  if (new Set(dates).size !== dates.length) ctx.addIssue({ code: "custom", path: ["overrides"], message: "Use one override per date." });
});

export const loginSchema = z.object({
  email: z.string().trim().max(254).pipe(z.email("Enter a valid email address.")),
  password: z.string().min(1, "Enter your password.").max(1024),
});
