import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE = "shanzo_admin";
export const SESSION_SECONDS = 7 * 24 * 60 * 60;

export function adminConfigured() {
  const secret = process.env.SESSION_SECRET;
  return Boolean(process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD && secret && secret.length >= 32 && !secret.startsWith("replace-"));
}
export function equalSecret(left: string, right: string) {
  return timingSafeEqual(createHash("sha256").update(left).digest(), createHash("sha256").update(right).digest());
}
function signature(payload: string) {
  // Rotating the password/email also revokes existing sessions.
  return createHmac("sha256", process.env.SESSION_SECRET!)
    .update(JSON.stringify([process.env.ADMIN_EMAIL?.trim().toLowerCase(), process.env.ADMIN_PASSWORD, payload])).digest("hex");
}
export function createSession(now = Date.now()) {
  if (!adminConfigured()) throw new Error("Admin login is not configured.");
  const payload = Buffer.from(JSON.stringify({ expires: now + SESSION_SECONDS * 1000 })).toString("base64url");
  return `${payload}.${signature(payload)}`;
}
export function verifySession(token: string | undefined, now = Date.now()) {
  if (!adminConfigured() || !token || token.length > 1024) return false;
  try {
    const [payload, mac, extra] = token.split(".");
    if (!payload || !mac || extra !== undefined || !/^[a-f0-9]{64}$/.test(mac)) return false;
    if (!timingSafeEqual(Buffer.from(mac, "hex"), Buffer.from(signature(payload), "hex"))) return false;
    const { expires } = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return Number.isSafeInteger(expires) && expires > now && expires <= now + SESSION_SECONDS * 1000;
  } catch { return false; }
}
