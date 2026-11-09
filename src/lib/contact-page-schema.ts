import { z } from "zod";

export const contactPageSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Enter your name.")
    .max(100, "Keep your name under 100 characters."),
  email: z
    .email("Enter a valid email address.")
    .max(254, "Keep your email under 254 characters."),
  phone: z
    .string()
    .trim()
    .max(40, "Keep your phone number under 40 characters.")
    .refine(
      (value) =>
        !value ||
        (/^[+\d\s().-]+$/.test(value) && value.replace(/\D/g, "").length >= 7),
      "Enter a valid phone number, or leave it blank.",
    )
    .optional(),
  service: z
    .enum([
      "",
      "Hair",
      "Nails",
      "Waxing",
      "Brows & Lashes",
      "Multiple services",
    ])
    .optional(),
  message: z
    .string()
    .trim()
    .max(5000, "Keep your message under 5,000 characters."),
  website: z.string().max(200).optional(),
  inquiryType: z.enum(["contact", "application"]).optional(),
});
