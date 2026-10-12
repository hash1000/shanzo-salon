"use client";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ATTACHMENT_ACCEPT, attachmentError } from "@/lib/contact-attachments";
import { contactSchema } from "@/lib/form-schemas";
import {
  ADDRESS,
  PHONE,
  PHONE_HREF,
  CANCELLATION_POLICY,
  HOURS,
  SITE_NAME,
} from "@/lib/site";
export default function ContactSection({
  variant = "home",
}: {
  variant?: "home" | "page";
}) {
  const [attachments, setAttachments] = useState<File[]>([]);
  const [fileError, setFileError] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);
  const [today, setToday] = useState("");
  const [status, setStatus] = useState({ text: "", error: false });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
  });
  useEffect(() => {
    const update = () =>
      setToday(
        new Intl.DateTimeFormat("en-US", {
          weekday: "long",
          timeZone: "America/Chicago",
        }).format(new Date()),
      );
    update();
    const timer = setInterval(update, 60000);
    return () => clearInterval(timer);
  }, []);
  async function submit(values: z.infer<typeof contactSchema>) {
    setStatus({ text: "", error: false });
    const error = attachmentError(attachments);
    if (error) { setFileError(error); return; }
    const body = new FormData();
    Object.entries(values).forEach(([key, value]) => body.append(key, value));
    attachments.forEach(file => body.append("attachments", file));
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        body,
      });
      if (!response.ok) throw new Error();
      setStatus({
        text: "Thank you! Your message has been sent.",
        error: false,
      });
      reset();
      setAttachments([]);
      setFileError("");
      if (fileInput.current) fileInput.current.value = "";
    } catch {
      setStatus({
        text: "Your message could not be sent. Please try again or call us.",
        error: true,
      });
    }
  }
  return (
    <section className="contact-section section-space">
      <div className="home-container">
        {variant === "page" ? (
          <h1 className="eyebrow text-center">Contact Us</h1>
        ) : (
          <p className="eyebrow text-center">Contact us</p>
        )}
        <div className="contact-grid">
          <div>
            <h2 className="section-title font-script">
              {variant === "page" ? "Drop us a line!" : "Get in Touch"}
            </h2>
            <form
              onSubmit={handleSubmit(submit)}
              noValidate
              className="home-form"
            >
              <label htmlFor="contact-name">
                Name <span aria-hidden="true">*</span>
              </label>
              <input
                id="contact-name"
                placeholder="Name"
                autoComplete="name"
                required
                {...register("name")}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "name-error" : undefined}
              />
              {errors.name && (
                <p className="form-error" id="name-error">
                  {errors.name.message}
                </p>
              )}
              <label htmlFor="contact-email">
                Email <span aria-hidden="true">*</span>
              </label>
              <input
                id="contact-email"
                placeholder="Email*"
                type="email"
                autoComplete="email"
                required
                {...register("email")}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email && (
                <p className="form-error" id="email-error">
                  {errors.email.message}
                </p>
              )}
              <label htmlFor="contact-message">Message</label>
              <textarea
                id="contact-message"
                placeholder={
                  variant === "home"
                    ? "What services are you interested in?"
                    : "Message"
                }
                rows={5}
                {...register("message")}
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? "message-error" : undefined}
              />
              {errors.message && (
                <p className="form-error" id="message-error">
                  {errors.message.message}
                </p>
              )}
              <div className="attachment-row">
                <input ref={fileInput} id="contact-files" className="attachment-input" type="file" multiple accept={ATTACHMENT_ACCEPT} disabled={isSubmitting} aria-label="Attach files" aria-describedby="attachment-help attachment-error" onChange={event => {
                  const selected = Array.from(event.target.files ?? []);
                  const error = attachmentError(selected);
                  setFileError(error ?? "");
                  if (error) { event.target.value = ""; setAttachments([]); }
                  else setAttachments(selected);
                }} />
                <button type="button" className="attach-button" onClick={() => fileInput.current?.click()} disabled={isSubmitting}><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="m21 11-9 9a6 6 0 0 1-8.5-8.5l10-10a4 4 0 0 1 5.7 5.7l-10 10a2 2 0 0 1-2.8-2.8L16 5"/></svg> Attach Files</button>
                <span className="attachment-count">Attachments ({attachments.length})</span>
              </div>
              <p id="attachment-help" className="attachment-help">Up to 3 files · 5 MB total · JPG, PNG, WebP, PDF, TXT</p>
              <p id="attachment-error" className="form-error" role="status">{fileError}</p>
              {attachments.length > 0 && <ul className="attachment-list">{attachments.map((file, index) => <li key={`${file.name}-${index}`}><span>{file.name}</span><button type="button" aria-label={`Remove ${file.name}`} disabled={isSubmitting} onClick={() => { setAttachments(files => files.filter((_, item) => item !== index)); if (fileInput.current) fileInput.current.value = ""; }}>×</button></li>)}</ul>}
              <button className="gold-button" disabled={isSubmitting}>
                {isSubmitting ? "Sending…" : "Send"}
              </button>
              <p
                role="status"
                className={status.error ? "form-error" : "form-success"}
              >
                {status.text}
              </p>
            </form>
          </div>
          <div className="contact-details">
            {variant === "page" ? (
              <>
                <h2 className="font-script">Better yet, see us in person!</h2>
                <p>
                  We love our customers, so feel free to visit during normal
                  business hours.
                </p>
              </>
            ) : (
              <>
                <h2 className="font-script">Cancellation Policy</h2>
                <p>{CANCELLATION_POLICY}</p>
              </>
            )}
            <h2 className="font-script">
              {variant === "home" ? "Shanzo Salon" : SITE_NAME}
            </h2>
            <address>
              {ADDRESS}
              <br />
              <a href={PHONE_HREF}>{PHONE}</a>
            </address>
            <h2 className="font-script">Hours</h2>
            {variant === "home" ? (
              <details className="home-hours" open>
                <summary>
                  {today
                    ? `${HOURS.find((row) => row.day === today)?.hours === "Closed" ? "Closed today" : `Open today ${HOURS.find((row) => row.day === today)?.hours}`}`
                    : "View opening hours"}
                </summary>
                <table>
                  <caption className="sr-only">
                    Salon hours, Chicago local time
                  </caption>
                  <tbody>
                    {HOURS.map((row) => (
                      <tr
                        key={row.day}
                        className={today === row.day ? "today" : ""}
                      >
                        <th scope="row">
                          {row.day}
                          {today === row.day && (
                            <span className="sr-only"> (today)</span>
                          )}
                        </th>
                        <td>{row.hours}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </details>
            ) : (
              <table>
                <caption className="sr-only">
                  Salon hours, Chicago local time
                </caption>
                <tbody>
                  {HOURS.map((row) => (
                    <tr
                      key={row.day}
                      className={today === row.day ? "today" : ""}
                    >
                      <th scope="row">
                        {row.day}
                        {today === row.day && (
                          <span className="sr-only"> (today)</span>
                        )}
                      </th>
                      <td>{row.hours}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
