import { createHash } from "node:crypto";
import { parseContactDetails, type ContactDetails } from "./schema";
import { createContactEmail } from "./email";

export type ContactConfig = {
  origin: string; hostname: string; resendKey: string; from: string; to: string;
  turnstileSecret: string;
};
type ContactInput = ContactDetails & { website: string; token: string; submissionId: string };
const MAX_BYTES = 8192;
const response = (status: number, code: string, extra: Record<string, string> = {}) => Response.json({ code }, { status, headers: { "Cache-Control": "no-store", ...extra } });

function validate(value: unknown): ContactInput | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const v = value as Record<string, unknown>;
  const details = parseContactDetails(v);
  if (!details || !["website", "token", "submissionId"].every(key => typeof v[key] === "string")) return null;
  const { website, token, submissionId } = v as Record<string, string>;
  if (website.length > 200 || token.length > 2048 || !/^\d{13}\.[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(submissionId)) return null;
  const age = Date.now() - Number(submissionId.split(".")[0]);
  // Refuse old attempts before the provider's 24-hour idempotency window expires.
  if (age < -30000 || age > 23 * 3600000) return null;
  return { ...details, website, token, submissionId };
}

async function readInput(request: Request) {
  if (!request.headers.get("content-type")?.startsWith("application/json")) throw new Error("media");
  const length = request.headers.get("content-length");
  if (length && (!/^\d+$/.test(length) || Number(length) > MAX_BYTES)) throw new Error("size");
  const reader = request.body?.getReader();
  if (!reader) throw new Error("input");
  const chunks: Uint8Array[] = [];
  let total = 0;
  const timeout = setTimeout(() => { void reader.cancel().catch(() => {}); }, 5000);
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.length;
      if (total > MAX_BYTES) { await reader.cancel(); throw new Error("size"); }
      chunks.push(value);
    }
    const bytes = new Uint8Array(total);
    let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
    return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes)) as unknown;
  } finally { clearTimeout(timeout); reader.releaseLock(); }
}

export async function handleContact(request: Request, config: ContactConfig | null, send: typeof fetch = fetch): Promise<Response> {
  if (request.method !== "POST") return response(405, "method", { Allow: "POST" });
  if (!config) return response(503, "unavailable");
  if (request.headers.get("origin") !== config.origin || request.headers.get("sec-fetch-site") === "cross-site") return response(403, "origin");
  let input: ContactInput | null;
  try { input = validate(await readInput(request)); }
  catch (error) { return response(error instanceof Error && error.message === "size" ? 413 : 400, "validation"); }
  if (!input || input.website) return response(400, "validation");
  // Turnstile owns single-use token redemption; Resend owns concurrency and
  // identical-request deduplication. No process-local or simulated persistence.
  const idempotencyKey = `portfolio-${createHash("sha256").update(input.submissionId).digest("hex")}`;
  try {
    if (!input.token) return response(400, "verification");
    const check = await send("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ secret: config.turnstileSecret, response: input.token }), signal: AbortSignal.timeout(5000), cache: "no-store" });
    if (!check.ok) throw new Error("service");
    const verification = await check.json() as { success?: boolean; hostname?: string; action?: string; challenge_ts?: string };
    const age = Date.now() - Date.parse(verification.challenge_ts ?? "");
    if (!verification.success || verification.hostname !== config.hostname || verification.action !== "portfolio_contact" || !Number.isFinite(age) || age < -30000 || age > 300000) return response(400, "verification");
    // A retry requires a fresh Turnstile token and the same submission ID and
    // email payload. Resend retains the key for 24 hours; input IDs expire at 23h.
    const provider = await send("https://api.resend.com/emails", {
      method: "POST", headers: { Authorization: `Bearer ${config.resendKey}`, "Content-Type": "application/json", "Idempotency-Key": idempotencyKey },
      body: JSON.stringify({ from: config.from, to: [config.to], reply_to: input.email, ...createContactEmail(input, Number(input.submissionId.split(".")[0])) }), signal: AbortSignal.timeout(8000), cache: "no-store",
    });
    if (!provider.ok) {
      const failure = await provider.json().catch(() => null) as { name?: string } | null;
      if (provider.status === 409 && failure?.name === "concurrent_idempotent_requests") return response(409, "pending", { "Retry-After": "5" });
      if (provider.status === 409 && failure?.name === "invalid_idempotent_request") return response(409, "conflict");
      return response(503, "service");
    }
    const accepted = await provider.json() as { id?: string };
    if (!accepted.id || typeof accepted.id !== "string") throw new Error("service");
    return response(200, "accepted");
  } catch { return response(503, "service"); }
}
