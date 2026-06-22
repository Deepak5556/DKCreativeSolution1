import { z } from "zod";

export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, "Please enter your full name.")
    .max(80, "Name is too long."),
  email: z.string().min(1, "Email is required.").email("Enter a valid email address."),
  phone: z
    .string()
    .min(7, "Enter a valid phone number.")
    .max(20, "Phone number is too long.")
    .regex(/^[\d+\-\s()]+$/, "Use digits, spaces, +, - or ( ) only."),
  service: z.string().min(1, "Please select a service."),
  message: z
    .string()
    .min(15, "Please share a few more details (15+ characters).")
    .max(1000, "Message is too long."),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
