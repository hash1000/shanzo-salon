import { z } from "zod";
export const contactSchema = z.object({ name: z.string().trim().min(1, "Please enter your name.").max(100), email: z.email("Please enter a valid email address.").max(254), message: z.string().trim().max(5000, "Please keep your message under 5,000 characters.") });
export const newsletterSchema = z.object({ email: z.email("Please enter a valid email address.").max(254) });
