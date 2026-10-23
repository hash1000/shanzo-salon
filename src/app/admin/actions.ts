"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-auth";
import { adminConfigured, createSession, equalSecret, SESSION_COOKIE, SESSION_SECONDS } from "@/lib/admin-session";
import { clearLoginFailures, loginLocked, recordLoginFailure } from "@/lib/login-rate-limit";
import { hoursSchema, loginSchema } from "@/lib/hours-schema";
import { getLocalNow } from "@/lib/walk-in-hours";
import { saveHours } from "@/lib/hours-store";
import type { WalkInConfig } from "@/data/walk-in-hours";

export async function login(input: unknown): Promise<{ error: string }> {
  const requestHeaders = await headers();
  // Trust forwarded addresses only when the deployment proxy replaces this header.
  const ip = process.env.ADMIN_TRUST_PROXY_HEADERS === "true"
    ? requestHeaders.get("x-forwarded-for")?.split(",")[0].trim().slice(0, 128) || "unknown" : "unknown";
  if (loginLocked(ip)) return { error: "Too many failed attempts. Please try again in 15 minutes." };
  const parsed = loginSchema.safeParse(input);
  const configured = adminConfigured();
  const emailMatches = equalSecret(parsed.success ? parsed.data.email.toLowerCase() : "", process.env.ADMIN_EMAIL?.trim().toLowerCase() || "");
  const passwordMatches = equalSecret(parsed.success ? parsed.data.password : "", process.env.ADMIN_PASSWORD || "");
  if (!configured || !parsed.success || !emailMatches || !passwordMatches) {
    recordLoginFailure(ip);
    return { error: "Invalid email or password" };
  }
  clearLoginFailures(ip);
  (await cookies()).set(SESSION_COOKIE, createSession(), {
    httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict",
    path: "/", maxAge: SESSION_SECONDS, expires: new Date(Date.now() + SESSION_SECONDS * 1000),
  });
  redirect("/admin");
}

export async function logout() {
  await requireAdmin();
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/admin/login");
}

export async function updateHours(input: unknown): Promise<{ config: WalkInConfig; error?: never } | { error: string; config?: never }> {
  await requireAdmin();
  const parsed = hoursSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues.map(issue => `${issue.path.join(".")}: ${issue.message}`).join("; ") };
  try {
    const today = getLocalNow(new Date(), "America/Chicago").date;
    const config = await saveHours({ ...parsed.data, overrides: parsed.data.overrides?.filter(item => item.date >= today) });
    revalidatePath("/hours");
    revalidatePath("/admin");
    return { config };
  } catch {
    return { error: "Could not save hours. Check that the hours file is on a writable disk, then try again." };
  }
}
