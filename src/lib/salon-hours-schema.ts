import { z } from "zod";

const time = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Use a valid 24-hour time.");
const range = z
  .object({ open: time, close: time })
  .refine((value) => value.close > value.open, {
    message: "Close must be after open",
    path: ["close"],
  });
export const salonDaySchema = z
  .array(range)
  .max(3, "Use at most 3 shifts.")
  .superRefine((ranges, context) => {
    const sorted = [...ranges].sort((a, b) => a.open.localeCompare(b.open));
    if (
      sorted.some(
        (value, index) => index > 0 && value.open < sorted[index - 1].close,
      )
    ) {
      context.addIssue({ code: "custom", message: "Shifts must not overlap." });
    }
  });
const date = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD.")
  .refine((value) => {
    const parsed = new Date(`${value}T00:00:00Z`);
    return (
      !Number.isNaN(parsed.valueOf()) &&
      parsed.toISOString().slice(0, 10) === value
    );
  }, "Choose a valid calendar date.");
export const salonHoursSchema = z
  .object({
    timezone: z.literal("America/Chicago").default("America/Chicago"),
    lastUpdated: z.string(),
    weekly: z.object({
      mon: salonDaySchema,
      tue: salonDaySchema,
      wed: salonDaySchema,
      thu: salonDaySchema,
      fri: salonDaySchema,
      sat: salonDaySchema,
      sun: salonDaySchema,
    }),
    overrides: z
      .array(
        z.object({
          date,
          note: z.string().max(80).optional(),
          ranges: salonDaySchema,
        }),
      )
      .default([]),
  })
  .superRefine((value, context) => {
    if (
      new Set(value.overrides.map((item) => item.date)).size !==
      value.overrides.length
    ) {
      context.addIssue({
        code: "custom",
        path: ["overrides"],
        message: "Use one special schedule per date.",
      });
    }
  });
export type SalonHours = z.infer<typeof salonHoursSchema>;
