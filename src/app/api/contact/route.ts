import { Resend } from "resend";
import { contactSchema } from "@/lib/form-schemas";
import { attachmentError, MAX_ATTACHMENT_BYTES } from "@/lib/contact-attachments";
import { SITE_NAME } from "@/lib/site";

export async function POST(request: Request) {
  if (Number(request.headers.get("content-length")) > MAX_ATTACHMENT_BYTES + 128 * 1024) {
    return Response.json({ error: "Attachments must total 5 MB or less." }, { status: 413 });
  }
  let body: unknown;
  let files: File[] = [];
  try {
    if (request.headers.get("content-type")?.includes("multipart/form-data")) {
      const form = await request.formData();
      body = { name: form.get("name"), email: form.get("email"), message: form.get("message") };
      const entries = form.getAll("attachments");
      if (entries.some(file => !(file instanceof File))) return Response.json({ error: "Invalid attachments." }, { status: 400 });
      files = entries as File[];
    } else {
      body = await request.json();
    }
  } catch {
    return Response.json({ error: "Invalid form submission." }, { status: 400 });
  }
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) return Response.json({ error: "Please check your form fields." }, { status: 400 });
  const invalidAttachment = attachmentError(files);
  if (invalidAttachment) return Response.json({ error: invalidAttachment }, { status: 400 });
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !to || !from) return Response.json({ error: "Email delivery is not configured. Please call the salon." }, { status: 503 });
  const data = parsed.data;
  try {
    const attachments = await Promise.all(files.map(async file => ({ filename: file.name.replace(/[\\/\r\n]/g, "_"), content: Buffer.from(await file.arrayBuffer()), contentType: file.type })));
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({ from, to, replyTo: data.email, subject: `${SITE_NAME}: Contact inquiry`, text: `Name: ${data.name}\nEmail: ${data.email}\n\n${data.message}`, attachments });
    if (error) return Response.json({ error: "Unable to send. Please try again." }, { status: 502 });
    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Unable to send. Please try again." }, { status: 502 });
  }
}
