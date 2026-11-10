import "server-only";
import { readFile, mkdir, writeFile, rename, unlink } from "node:fs/promises";
import { dirname, resolve, join } from "node:path";
import { randomUUID } from "node:crypto";
import { salonHoursSchema, type SalonHours } from "@/lib/salon-hours-schema";

const filePath = () =>
  resolve(
    /* turbopackIgnore: true */ process.env.SALON_HOURS_DATA_PATH ||
      "data/salon-hours.json",
  );
function safeDefaults(): SalonHours {
  const day = () => [{ open: "10:00", close: "19:00" }];
  return {
    timezone: "America/Chicago",
    lastUpdated: "2026-11-10T00:00:00.000Z",
    weekly: {
      mon: day(),
      tue: day(),
      wed: day(),
      thu: day(),
      fri: day(),
      sat: day(),
      sun: [{ open: "13:00", close: "19:00" }],
    },
    overrides: [],
  };
}
/** Read and validate on every call; never cache file-backed hours. */
export async function getSalonHours(): Promise<SalonHours> {
  try {
    return salonHoursSchema.parse(
      JSON.parse(
        await readFile(/* turbopackIgnore: true */ filePath(), "utf8"),
      ),
    );
  } catch {
    return safeDefaults();
  }
}
export async function saveSalonHours(input: unknown): Promise<SalonHours> {
  const validated = salonHoursSchema.parse(input);
  const saved = { ...validated, lastUpdated: new Date().toISOString() };
  const destination = filePath();
  const directory = dirname(destination);
  await mkdir(directory, { recursive: true });
  const temporary = join(directory, `.salon-hours-${randomUUID()}.tmp`);
  try {
    await writeFile(temporary, `${JSON.stringify(saved, null, 2)}\n`, {
      encoding: "utf8",
      flag: "wx",
      mode: 0o600,
    });
    await rename(temporary, destination);
  } finally {
    await unlink(temporary).catch(() => {});
  }
  return saved;
}
