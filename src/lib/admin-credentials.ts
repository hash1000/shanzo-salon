import "server-only";
import { scryptSync, timingSafeEqual } from "node:crypto";

export const ADMIN_EMAIL = "info@shanzosalon.com";
export const ADMIN_PASSWORD_HASH = "PASTE_HASH_HERE";

export function verifyAdminPassword(input: string): boolean {
  const [salt, hash, extra] = ADMIN_PASSWORD_HASH.split(":");
  if (extra !== undefined || !salt || !/^(?:[a-f0-9]{2})+$/i.test(salt) || !/^[a-f0-9]{128}$/i.test(hash || "")) return false;
  try {
    const expected = Buffer.from(hash, "hex");
    const actual = scryptSync(input, salt, 64);
    return actual.length === expected.length && timingSafeEqual(actual, expected);
  } catch { return false; }
}
