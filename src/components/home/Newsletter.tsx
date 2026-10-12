"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { newsletterSchema } from "@/lib/form-schemas";
export default function Newsletter() {
 const [status, setStatus] = useState({ text: "", error: false });
 const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<z.infer<typeof newsletterSchema>>({ resolver: zodResolver(newsletterSchema) });
 async function submit(values: z.infer<typeof newsletterSchema>) { setStatus({ text: "", error: false }); try { const response = await fetch("/api/newsletter", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) }); if (!response.ok) throw new Error(); setStatus({ text: "Thank you! Your newsletter signup has been received.", error: false }); reset(); } catch { setStatus({ text: "We couldn’t receive your signup. Please try again.", error: true }); } }
 return <section className="newsletter section-space"><div className="home-container text-center"><h2 className="section-title font-script">Stay on the cutting-edge</h2><p>Get 10% off your first purchase when you sign up for our newsletter!</p><form onSubmit={handleSubmit(submit)} noValidate><label htmlFor="newsletter-email" className="sr-only">Email address</label><div className="newsletter-fields"><input id="newsletter-email" placeholder="Email address" type="email" autoComplete="email" required {...register("email")} aria-invalid={!!errors.email} aria-describedby={errors.email ? "newsletter-error" : undefined}/><button className="gold-button" disabled={isSubmitting}>{isSubmitting ? "Signing up…" : "Sign Up"}</button></div>{errors.email && <p className="form-error" id="newsletter-error">{errors.email.message}</p>}<p role="status" className={status.error ? "form-error" : "form-success"}>{status.text}</p></form></div></section>;
}
