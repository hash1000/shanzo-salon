import "server-only";

const WINDOW = 15 * 60 * 1000;
const MAX_BUCKETS = 10000;
type Bucket = { failures: number; until: number };
const globalState = globalThis as typeof globalThis & { adminLoginFailures?: Map<string, Bucket> };
const buckets = globalState.adminLoginFailures ??= new Map<string, Bucket>();

export function loginLocked(ip: string, now = Date.now()) {
  for (const [key, bucket] of buckets) if (bucket.until <= now) buckets.delete(key);
  return (buckets.get(ip)?.failures ?? 0) >= 5 || (!buckets.has(ip) && buckets.size >= MAX_BUCKETS);
}
export function recordLoginFailure(ip: string, now = Date.now()) {
  const current = buckets.get(ip);
  const bucket = current && current.until > now ? current : { failures: 0, until: now + WINDOW };
  bucket.failures++;
  if (buckets.size < MAX_BUCKETS || buckets.has(ip)) buckets.set(ip, bucket);
}
export function clearLoginFailures(ip: string) { buckets.delete(ip); }
