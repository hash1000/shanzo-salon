"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { unstable_rethrow } from "next/navigation";
import { loginSchema } from "@/lib/hours-schema";
import { login } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginForm() {
  const [error, setError] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<z.infer<typeof loginSchema>>({ resolver: zodResolver(loginSchema) });
  return (
    <form className="grid gap-4" onSubmit={handleSubmit(async values => {
      setError("");
      try {
        const result = await login(values);
        setError(result?.error || "");
      } catch (cause) {
        unstable_rethrow(cause);
        setError("Could not sign in. Check your connection and try again.");
      }
    })}>
      <div className="grid gap-2"><Label htmlFor="email">Email</Label>
        <Input id="email" type="email" autoComplete="username" {...register("email")} aria-invalid={!!errors.email} aria-describedby="email-error" />
        <p id="email-error" className="admin-error">{errors.email?.message}</p>
      </div>
      <div className="grid gap-2"><Label htmlFor="password">Password</Label>
        <Input id="password" type="password" autoComplete="current-password" {...register("password")} aria-invalid={!!errors.password} aria-describedby="password-error" />
        <p id="password-error" className="admin-error">{errors.password?.message}</p>
      </div>
      <p role="alert" className="admin-error">{error}</p>
      <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Signing in…" : "Sign in"}</Button>
    </form>
  );
}
