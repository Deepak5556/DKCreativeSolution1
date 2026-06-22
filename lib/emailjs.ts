import emailjs from "@emailjs/browser";

/**
 * EmailJS configuration.
 *
 * Create a free account at https://www.emailjs.com, then add the three
 * values below to a `.env.local` file (see `.env.example`). None of these
 * values are secret — EmailJS is designed to be called from the browser —
 * but keeping them in env vars makes it easy to swap services per
 * environment (dev / staging / production).
 */
const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? "";
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? "";
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? "";

export interface ContactFormPayload {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}

export const isEmailJsConfigured = Boolean(
  SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY
);

/**
 * Sends the contact form payload via EmailJS.
 * Throws if EmailJS has not been configured or the request fails, so the
 * caller (the contact form) can surface an actionable error to the user.
 */
export async function sendContactEmail(payload: ContactFormPayload) {
  if (!isEmailJsConfigured) {
    throw new Error(
      "EmailJS is not configured. Add NEXT_PUBLIC_EMAILJS_SERVICE_ID, NEXT_PUBLIC_EMAILJS_TEMPLATE_ID and NEXT_PUBLIC_EMAILJS_PUBLIC_KEY to your .env.local file."
    );
  }

  return emailjs.send(
    SERVICE_ID,
    TEMPLATE_ID,
    {
      from_name: payload.name,
      reply_to: payload.email,
      phone_number: payload.phone,
      service_required: payload.service,
      message: payload.message,
    },
    { publicKey: PUBLIC_KEY }
  );
}
