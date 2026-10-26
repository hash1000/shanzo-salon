import "server-only";
import { timingSafeEqual, createHash } from "node:crypto";

export const ADMIN_EMAIL = "info@shanzosalon.com";
const ADMIN_PASSWORD = "info@shanzosalon#2026";

// admin-session.ts yeh naam import karta hai, is liye same rakha hai
export const ADMIN_PASSWORD_HASH = ADMIN_PASSWORD;

export function verifyAdminPassword(input: string): boolean {
  const a = createHash("sha256").update(input).digest();
  const b = createHash("sha256").update(ADMIN_PASSWORD).digest();
  return timingSafeEqual(a, b);
}