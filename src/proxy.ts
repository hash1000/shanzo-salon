import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/admin-session";

export function proxy(request: NextRequest) {
  let response: NextResponse;
  if (request.nextUrl.pathname !== "/admin/login" && !verifySession(request.cookies.get(SESSION_COOKIE)?.value)) {
    response = NextResponse.redirect(new URL("/admin/login", request.url));
  } else response = NextResponse.next();
  response.headers.set("Cache-Control", "private, no-store");
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}
export const config = { matcher: ["/admin/:path*"] };
