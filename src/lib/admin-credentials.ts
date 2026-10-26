import "server-only";
import { scryptSync, timingSafeEqual } from "node:crypto";

export const ADMIN_EMAIL = "info@shanzosalon.com";
export const ADMIN_PASSWORD_HASH = "e2d1a3dcc3a41352eeaf90afbbd10e85:4b07b04d99dec70144e521c9782144777dc4657744b3b4ef48f5776d02586268f7bff8d33a60a66287e731249240f08101596200e1cc2cf7fa99f0450d7c0adb";

export function verifyAdminPassword(input: string): boolean {
  const [salt, hash, extra] = ADMIN_PASSWORD_HASH.split(":");
  if (extra !== undefined || !salt || !/^(?:[a-f0-9]{2})+$/i.test(salt) || !/^[a-f0-9]{128}$/i.test(hash || "")) return false;
  try {
    const expected = Buffer.from(hash, "hex");
    const actual = scryptSync(input, salt, 64);
    return actual.length === expected.length && timingSafeEqual(actual, expected);
  } catch { return false; }
}
