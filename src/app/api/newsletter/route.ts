import { Resend } from "resend";
import { newsletterSchema } from "@/lib/form-schemas";
import { SITE_NAME } from "@/lib/site";
export async function POST(request: Request) {
 let body: unknown;
 try { body = await request.json(); } catch { return Response.json({ error: "Invalid JSON." }, { status: 400 }); }
 const parsed = newsletterSchema.safeParse(body);
 if (!parsed.success) return Response.json({ error: "Please check your form fields." }, { status: 400 });
 const apiKey = process.env.RESEND_API_KEY;
 const to = process.env.CONTACT_TO_EMAIL;
 const from = process.env.CONTACT_FROM_EMAIL;
 if (!apiKey || !to || !from) return Response.json({ error: "Email delivery is not configured. Please call the salon." }, { status: 503 });
 const data = parsed.data;
 try {
  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({ from, to, replyTo: data.email, subject: `${SITE_NAME}: Newsletter signup`, text: `Newsletter signup request: ${data.email}\n\nPlease add this email to the salon newsletter list.` });
  if (error) return Response.json({ error: "Unable to send. Please try again." }, { status: 502 });
  return Response.json({ success: true });
 } catch { return Response.json({ error: "Unable to send. Please try again." }, { status: 502 }); }
}
