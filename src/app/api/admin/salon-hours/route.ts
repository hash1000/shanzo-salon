import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { SESSION_COOKIE, verifySession } from "@/lib/admin-session";
import { getSalonHours, saveSalonHours } from "@/lib/salon-hours-store";
import { salonHoursSchema } from "@/lib/salon-hours-schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
async function authorized() {
  return verifySession((await cookies()).get(SESSION_COOKIE)?.value);
}
export async function GET() {
  if (!(await authorized()))
    return Response.json(
      { error: "Unauthorized. Please log in." },
      { status: 401 },
    );
  return Response.json(await getSalonHours(), {
    headers: { "Cache-Control": "no-store" },
  });
}
export async function PUT(request: Request) {
  if (!(await authorized()))
    return Response.json(
      { error: "Unauthorized. Please log in." },
      { status: 401 },
    );
  const origin = request.headers.get("origin");
  if (origin && new URL(origin).host !== request.headers.get("host"))
    return Response.json({ error: "Invalid request origin." }, { status: 403 });
  let input: unknown;
  try {
    input = await request.json();
  } catch {
    return Response.json({ error: "Send valid JSON." }, { status: 400 });
  }
  const parsed = salonHoursSchema.safeParse(input);
  if (!parsed.success)
    return Response.json(
      {
        error: parsed.error.issues
          .map((issue) => `${issue.path.join(" · ")}: ${issue.message}`)
          .join("; "),
      },
      { status: 400 },
    );
  try {
    const saved = await saveSalonHours(parsed.data);
    for (const path of ["/contact", "/", "/apply", "/admin/salon-hours"])
      revalidatePath(path);
    return Response.json(saved, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json(
      {
        error:
          "Could not save hours. Check that the salon hours file and its folder are writable, then try again.",
      },
      { status: 500 },
    );
  }
}
