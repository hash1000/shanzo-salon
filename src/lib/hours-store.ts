import "server-only";
import { readFile, mkdir, writeFile, rename, unlink } from "node:fs/promises";
import { dirname, resolve, join } from "node:path";
import { randomUUID } from "node:crypto";
import { hoursSchema } from "@/lib/hours-schema";
import type { WalkInConfig } from "@/data/walk-in-hours";

// The deployed live path is runtime configuration. Trace only the seed JSON
// explicitly in next.config.ts, rather than every file in the project.
const filePath = () => resolve(/* turbopackIgnore: true */ process.env.HOURS_DATA_PATH || "data/walk-in-hours.json");

function safeDefaults(): WalkInConfig {
  const weekly = () => ({ mon: null, tue: null, wed: null, thu: null, fri: null, sat: null, sun: null });
  return {
    timezone: "America/Chicago", lastUpdated: new Date(0).toISOString(),
    announcement: "Walk-in availability is currently unconfirmed. Please call the salon.",
    services: { hair: { weekly: weekly() }, nails: { weekly: weekly() } }, overrides: [],
  };
}

/** Read and validate on every call; never cache file-backed hours. */
export async function getHours(): Promise<WalkInConfig> {
  try { return hoursSchema.parse(JSON.parse(await readFile(/* turbopackIgnore: true */ filePath(), "utf8"))); }
  catch { return safeDefaults(); }
}

export async function saveHours(config: unknown): Promise<WalkInConfig> {
  const validated = hoursSchema.parse(config);
  const saved = { ...validated, lastUpdated: new Date().toISOString() };
  const destination = filePath();
  const directory = dirname(destination);
  await mkdir(directory, { recursive: true });
  const temporary = join(directory, `.walk-in-hours-${randomUUID()}.tmp`);
  try {
    await writeFile(temporary, `${JSON.stringify(saved, null, 2)}\n`, { encoding: "utf8", flag: "wx", mode: 0o600 });
    await rename(temporary, destination);
  } finally {
    await unlink(temporary).catch(() => {});
  }
  return saved;
}
