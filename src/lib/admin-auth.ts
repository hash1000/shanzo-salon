import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, verifySession } from "@/lib/admin-session";

export async function requireAdmin() {
  if (!verifySession((await cookies()).get(SESSION_COOKIE)?.value)) redirect("/admin/login");
}
