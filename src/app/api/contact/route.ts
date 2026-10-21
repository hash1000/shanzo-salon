import { Resend } from "resend";
import { contactSchema } from "@/lib/form-schemas";
import {
  attachmentError,
  MAX_ATTACHMENT_BYTES,
} from "@/lib/contact-attachments";
import { SITE_NAME } from "@/lib/site";

const FROM_EMAIL = "info@shanzosalon.com";
const MAX_REQUEST_BYTES = MAX_ATTACHMENT_BYTES + 128 * 1024;

export async function POST(request: Request) {
  if (Number(request.headers.get("content-length")) > MAX_REQUEST_BYTES) {
    return Response.json(
      { error: "Attachments must total 5 MB or less." },
      { status: 413 },
    );
  }

  let body: unknown;
  let files: File[] = [];
  try {
    // Bound the body even when Content-Length is missing or inaccurate.
    const reader = request.body?.getReader();
    const chunks: Uint8Array[] = [];
    let size = 0;
    if (reader) {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          size += value.byteLength;
          if (size > MAX_REQUEST_BYTES) {
            await reader.cancel();
            return Response.json(
              { error: "Attachments must total 5 MB or less." },
              { status: 413 },
            );
          }
          chunks.push(value);
        }
      } finally {
        reader.releaseLock();
      }
    }
    const payload = new Response(Buffer.concat(chunks), {
      headers: request.headers,
    });
    if (request.headers.get("content-type")?.includes("multipart/form-data")) {
      const form = await payload.formData();
      body = {
        name: form.get("name"),
        email: form.get("email"),
        message: form.get("message"),
        service: form.get("service") ?? undefined,
        inquiryType: form.get("inquiryType") ?? undefined,
      };
      const entries = form.getAll("attachments");
      if (entries.some((file) => !(file instanceof File))) {
        return Response.json(
          { error: "Invalid attachments." },
          { status: 400 },
        );
      }
      files = entries as File[];
    } else {
      body = await payload.json();
    }
  } catch {
    return Response.json(
      { error: "Invalid form submission." },
      { status: 400 },
    );
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Please check your form fields." },
      { status: 400 },
    );
  }
  const invalidAttachment = attachmentError(files);
  if (invalidAttachment) {
    return Response.json({ error: invalidAttachment }, { status: 400 });
  }
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL || FROM_EMAIL;
  if (!apiKey) {
    return Response.json(
      { error: "Email delivery is not configured. Please call the salon." },
      { status: 503 },
    );
  }

  const { name, email, message, service, inquiryType } = parsed.data;
  try {
    const attachments = await Promise.all(
      files.map(async (file) => ({
        filename: file.name.replace(/[\\/\r\n]/g, "_"),
        content: Buffer.from(await file.arrayBuffer()),
        contentType: file.type,
      })),
    );
    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      replyTo: email,
      subject: `${SITE_NAME}: ${inquiryType === "application" ? "Job application" : "Contact inquiry"}`,
      text: `Name: ${name}\nEmail: ${email}\nService: ${service || "Not specified"}\n\n${message}`,
      attachments,
    });
    if (error || !data) {
      return Response.json(
        { error: "Unable to send. Please try again." },
        { status: 502 },
      );
    }
    return Response.json({ success: true, id: data.id });
  } catch {
    return Response.json(
      { error: "Unable to send. Please try again." },
      { status: 502 },
    );
  }
}
