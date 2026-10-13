import "server-only";
import type { ContactConfig } from "./server";

export function getContactConfig(): ContactConfig | null {
  const env = process.env;
  if (env.CONTACT_ENABLED !== "true") return null;
  const values = [env.RESEND_API_KEY, env.CONTACT_FROM_EMAIL, env.CONTACT_TO_EMAIL, env.NEXT_PUBLIC_TURNSTILE_SITE_KEY, env.TURNSTILE_SECRET_KEY, env.UPSTASH_REDIS_REST_URL, env.UPSTASH_REDIS_REST_TOKEN, env.CONTACT_HASH_SECRET, env.CONTACT_ALLOWED_ORIGIN];
  if (values.some(value => !value?.trim()) || env.CONTACT_HASH_SECRET!.length < 32) return null;
  const email = /^[^\s@<>\r\n]+@[^\s@<>\r\n]+\.[^\s@<>\r\n]+$/;
  if (!email.test(env.CONTACT_FROM_EMAIL!) || !email.test(env.CONTACT_TO_EMAIL!)) return null;
  try {
    const origin = new URL(env.CONTACT_ALLOWED_ORIGIN!);
    if (origin.origin !== env.CONTACT_ALLOWED_ORIGIN || !["https:", "http:"].includes(origin.protocol)) return null;
    if (origin.protocol !== "https:" && origin.hostname !== "localhost") return null;
    if (env.VERCEL_ENV === "production" && origin.origin !== "https://www.hamzashakeel.ca") return null;
    if (new URL(env.UPSTASH_REDIS_REST_URL!).protocol !== "https:") return null;
    return {
      origin: origin.origin, hostname: origin.hostname,
      resendKey: env.RESEND_API_KEY!, from: env.CONTACT_FROM_EMAIL!, to: env.CONTACT_TO_EMAIL!,
      turnstileSecret: env.TURNSTILE_SECRET_KEY!, redisUrl: env.UPSTASH_REDIS_REST_URL!.replace(/\/$/, ""),
      redisToken: env.UPSTASH_REDIS_REST_TOKEN!, hashSecret: env.CONTACT_HASH_SECRET!,
      onVercel: env.VERCEL === "1",
    };
  } catch { return null; }
}

export function contactFormAvailable() {
  return process.env.CONTACT_FORM_VERIFIED === "true" && getContactConfig() !== null;
}
