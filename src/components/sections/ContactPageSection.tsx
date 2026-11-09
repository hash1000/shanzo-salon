"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Check, FileText, LoaderCircle, Upload, X } from "lucide-react";
import { contactPageSchema } from "@/lib/contact-page-schema";
import { ATTACHMENT_ACCEPT, attachmentError } from "@/lib/contact-attachments";
import { ADDRESS, BOOKING_URL, CANCELLATION_POLICY, HOURS } from "@/lib/site";

type Values = z.infer<typeof contactPageSchema>;
export default function ContactPageSection() {
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState<Values | null>(null);
  const [clock, setClock] = useState<{ day: string; open: boolean } | null>(
    null,
  );
  const input = useRef<HTMLInputElement>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(contactPageSchema) });
  useEffect(() => {
    function update() {
      const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/Chicago",
        weekday: "long",
        hour: "numeric",
        minute: "numeric",
        hourCycle: "h23",
      }).formatToParts(new Date());
      const get = (type: string) =>
        parts.find((part) => part.type === type)?.value ?? "";
      const day = get("weekday");
      const minutes = Number(get("hour")) * 60 + Number(get("minute"));
      setClock({
        day,
        open: minutes >= (day === "Sunday" ? 13 : 10) * 60 && minutes < 19 * 60,
      });
    }
    update();
    const timer = setInterval(update, 30000);
    return () => clearInterval(timer);
  }, []);
  function addFiles(selected: File[]) {
    const next = [...files, ...selected];
    const problem = attachmentError(next);
    setFileError(problem ?? "");
    if (!problem) setFiles(next);
    if (input.current) input.current.value = "";
  }
  async function submit(values: Values) {
    setError("");
    const problem = attachmentError(files);
    setFileError(problem ?? "");
    if (problem) return;
    const body = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined) body.append(key, value);
    });
    files.forEach((file) => body.append("attachments", file));
    try {
      const response = await fetch("/api/contact", { method: "POST", body });
      const result = await response.json();
      if (!response.ok || result.success !== true)
        throw new Error("send failed");
      setSent(values);
      setFiles([]);
    } catch {
      setError(
        "Your message could not be sent. Please try again, email info@shanzosalon.com or call (312) 754-0191.",
      );
    }
  }
  return (
    <section
      className="about-wrap contact-page-grid"
      aria-label="Contact and visiting information"
    >
      <div className="contact-note contact-card">
        <h2 className="site-form-title">
          Send a little <em>note.</em>
        </h2>
        <div aria-live="polite" aria-atomic="true">
          {sent && (
            <div className="contact-sent">
              <Check aria-hidden="true" size={32} />
              <p>
                Thank you, {sent.name.split(/\s+/)[0]}. Your message is with our
                team and we will reply to {sent.email}.
              </p>
            </div>
          )}
        </div>
        {!sent && (
          <form
            className="contact-note-form"
            noValidate
            onSubmit={handleSubmit(submit)}
            aria-busy={isSubmitting}
          >
            <fieldset disabled={isSubmitting}>
              <div className="contact-field-pair">
                <div className="contact-field">
                  <label htmlFor="note-name">
                    Name <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id="note-name"
                    autoComplete="name"
                    required
                    {...register("name")}
                    aria-invalid={!!errors.name}
                    aria-describedby={
                      errors.name ? "note-name-error" : undefined
                    }
                  />
                  {errors.name && (
                    <p id="note-name-error" className="contact-error">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div className="contact-field">
                  <label htmlFor="note-email">
                    Email <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id="note-email"
                    type="email"
                    autoComplete="email"
                    required
                    {...register("email")}
                    aria-invalid={!!errors.email}
                    aria-describedby={
                      errors.email ? "note-email-error" : undefined
                    }
                  />
                  {errors.email && (
                    <p id="note-email-error" className="contact-error">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="contact-field">
                <label htmlFor="note-phone">
                  Phone <span>(optional)</span>
                </label>
                <input
                  id="note-phone"
                  type="tel"
                  autoComplete="tel"
                  {...register("phone")}
                  aria-invalid={!!errors.phone}
                  aria-describedby={
                    errors.phone ? "note-phone-error" : undefined
                  }
                />
                {errors.phone && (
                  <p id="note-phone-error" className="contact-error">
                    {errors.phone.message}
                  </p>
                )}
              </div>
              <div className="contact-field">
                <label htmlFor="note-service">Services interested in</label>
                <select
                  id="note-service"
                  {...register("service")}
                  aria-invalid={!!errors.service}
                  aria-describedby={
                    errors.service ? "note-service-error" : undefined
                  }
                >
                  <option value="">Select a service (optional)</option>
                  {[
                    "Hair",
                    "Nails",
                    "Waxing",
                    "Brows & Lashes",
                    "Multiple services",
                  ].map((service) => (
                    <option key={service}>{service}</option>
                  ))}
                </select>
                {errors.service && (
                  <p id="note-service-error" className="contact-error">
                    Choose a service from the list.
                  </p>
                )}
              </div>
              <div className="contact-field">
                <label htmlFor="note-message">Message</label>
                <textarea
                  id="note-message"
                  rows={4}
                  placeholder="Tell us what you have in mind."
                  {...register("message")}
                  aria-invalid={!!errors.message}
                  aria-describedby={
                    errors.message ? "note-message-error" : undefined
                  }
                />
                {errors.message && (
                  <p id="note-message-error" className="contact-error">
                    {errors.message.message}
                  </p>
                )}
              </div>
              <div className="contact-honeypot" aria-hidden="true">
                <label htmlFor="note-website">Website</label>
                <input
                  id="note-website"
                  tabIndex={-1}
                  autoComplete="off"
                  {...register("website")}
                />
              </div>
              <div>
                <button
                  className="contact-dropzone"
                  type="button"
                  onClick={() => input.current?.click()}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => {
                    event.preventDefault();
                    if (!isSubmitting)
                      addFiles(Array.from(event.dataTransfer.files));
                  }}
                  aria-describedby="note-files-help note-files-error"
                >
                  <Upload size={21} aria-hidden="true" />
                  <span>Add inspiration photos or files (optional)</span>
                  <small>Choose files or drag them here</small>
                </button>
                <input
                  ref={input}
                  type="file"
                  multiple
                  accept={ATTACHMENT_ACCEPT}
                  className="sr-only"
                  tabIndex={-1}
                  aria-label="Add inspiration photos or files"
                  onChange={(event) =>
                    addFiles(Array.from(event.target.files ?? []))
                  }
                />
                <p id="note-files-help" className="contact-help">
                  Up to 3 files · 5 MB total · JPG, PNG, WebP, PDF, TXT
                </p>
                <p
                  id="note-files-error"
                  className="contact-error"
                  aria-live="polite"
                >
                  {fileError}
                </p>
                {!!files.length && (
                  <ul className="contact-files">
                    {files.map((file, index) => (
                      <li key={`${file.name}-${index}`}>
                        <FileText size={18} aria-hidden="true" />
                        <span title={file.name}>{file.name}</span>
                        <small>
                          {file.size >= 1024 * 1024
                            ? `${(file.size / 1024 / 1024).toFixed(1)} MB`
                            : `${Math.ceil(file.size / 1024)} KB`}
                        </small>
                        <button
                          type="button"
                          aria-label={`Remove ${file.name}`}
                          onClick={() => {
                            setFiles(files.filter((_, item) => item !== index));
                            setFileError("");
                          }}
                        >
                          <X size={17} aria-hidden="true" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <button
                type="submit"
                className="contact-submit"
                disabled={isSubmitting}
              >
                {isSubmitting && (
                  <LoaderCircle
                    className="contact-spinner"
                    size={18}
                    aria-hidden="true"
                  />
                )}
                {isSubmitting ? "Sending…" : "Send message"}
              </button>
            </fieldset>
            <p className="contact-book">
              <a href={BOOKING_URL}>Prefer to book online?</a>
            </p>
          </form>
        )}
        <p className="contact-error" role="status" aria-live="polite">
          {error}
        </p>
      </div>
      <aside className="contact-visit contact-card">
        <p className="about-label">Plan your visit</p>
        <h2 className="site-form-title">
          Shanzo <em>Salon</em>
        </h2>
        <address>
          {ADDRESS}
          <a href="mailto:info@shanzosalon.com">info@shanzosalon.com</a>
          <a href="tel:+13127540191">(312) 754-0191</a>
        </address>
        <div className="contact-hours-heading">
          <h3>Opening hours</h3>
          {clock && (
            <span className="contact-open-badge">
              {clock.open ? "Open now" : "Closed"}
            </span>
          )}
        </div>
        <table>
          <caption className="sr-only">Salon hours in America/Chicago</caption>
          <tbody>
            {HOURS.map((row) => (
              <tr
                key={row.day}
                className={clock?.day === row.day ? "contact-today" : undefined}
              >
                <th scope="row">
                  {row.day}
                  {clock?.day === row.day && (
                    <span className="sr-only"> (today)</span>
                  )}
                </th>
                <td>{row.day === "Sunday" ? "1 PM - 7 PM" : row.hours}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="contact-policy">
          <h3>Cancellation policy</h3>
          <p>{CANCELLATION_POLICY}</p>
        </div>
      </aside>
    </section>
  );
}
