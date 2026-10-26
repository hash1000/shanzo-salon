import "server-only";
import { timingSafeEqual, createHash } from "node:crypto";

export const ADMIN_EMAIL = "info@shanzosalon.com";
export const ADMIN_PASSWORD = "info@shanzosalon#2026";

export const SESSION_SECRET = "42517a973dbc188a652207df50ca196ae3cb98df1a09b1d56aa41f76789ac1eb";

export function verifyAdminPassword(input: string): boolean {
  const a = createHash("sha256").update(input).digest();
  const b = createHash("sha256").update(ADMIN_PASSWORD).digest();
  return timingSafeEqual(a, b);
}
