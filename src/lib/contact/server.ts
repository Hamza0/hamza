import { createHmac } from "node:crypto";
import { isIP } from "node:net";

export type ContactConfig = {
  origin: string; hostname: string; resendKey: string; from: string; to: string;
  turnstileSecret: string; redisUrl: string; redisToken: string; hashSecret: string;
  onVercel: boolean;
};
type ContactInput = { category: "job" | "project" | "collaboration"; name: string; email: string; message: string; website: string; token: string; submissionId: string };
const MAX_BYTES = 8192;
const RETENTION = 86400;
const CATEGORIES = { job: "Job opportunity", project: "Project enquiry", collaboration: "Collaboration" };
const RATE_SCRIPT = `local n=redis.call('INCR',KEYS[1]); if n==1 then redis.call('EXPIRE',KEYS[1],ARGV[1]) end; return {n,redis.call('TTL',KEYS[1])}`;
const LOCK_SCRIPT = `local v=redis.call('GET',KEYS[1]); if v and v~=ARGV[3] then return v end; redis.call('SET',KEYS[1],ARGV[1],'EX',ARGV[2]); return 'new'`;
const RELEASE_SCRIPT = `if redis.call('GET',KEYS[1])==ARGV[1] then return redis.call('DEL',KEYS[1]) end; return 0`;
const response = (status: number, code: string, extra: Record<string, string> = {}) => Response.json({ code }, { status, headers: { "Cache-Control": "no-store", ...extra } });

function validate(value: unknown): ContactInput | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const v = value as Record<string, unknown>;
  if (!["category", "name", "email", "message", "website", "token", "submissionId"].every(key => typeof v[key] === "string")) return null;
  const { category, name, email, message, website, token, submissionId } = v as Record<string, string>;
  if (!Object.hasOwn(CATEGORIES, category) || name.trim().length < 1 || name.length > 100 || /[\u0000-\u001f\u007f]/.test(name)) return null;
  if (email.length > 254 || !/^[^\s@<>\r\n]+@[^\s@<>\r\n]+\.[^\s@<>\r\n]+$/.test(email)) return null;
  if (message.trim().length < 10 || message.length > 3000 || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(message)) return null;
  if (website.length > 200 || token.length > 2048 || !/^\d{13}\.[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(submissionId)) return null;
  const age = Date.now() - Number(submissionId.split(".")[0]);
  // Refuse old attempts before the provider's 24-hour idempotency window expires.
  if (age < -30000 || age > 23 * 3600000) return null;
  return { category: category as ContactInput["category"], name: name.trim(), email, message: message.trim(), website, token, submissionId };
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
  const hash = (value: string) => createHmac("sha256", config.hashSecret).update(value).digest("hex");
  const redis = async (...command: (string | number)[]) => {
    const r = await send(config.redisUrl, { method: "POST", headers: { Authorization: `Bearer ${config.redisToken}`, "Content-Type": "application/json" }, body: JSON.stringify(command), signal: AbortSignal.timeout(4000), cache: "no-store" });
    if (!r.ok) throw new Error("service");
    const data = await r.json() as { result?: unknown; error?: string };
    if (data.error || !("result" in data)) throw new Error("service");
    return data.result;
  };
  const rate = async (key: string, max: number, seconds: number) => {
    const result = await redis("EVAL", RATE_SCRIPT, 1, `portfolio:contact:rate:${key}`, seconds);
    if (!Array.isArray(result) || result.length !== 2 || !Number.isFinite(Number(result[0]))) throw new Error("service");
    return Number(result[0]) > max ? Math.max(1, Number(result[1]) || seconds) : 0;
  };
  // Vercel replaces X-Forwarded-For at its edge. Other hosts share a conservative
  // bucket rather than trusting arbitrary client-supplied forwarding headers.
  const forwarded = config.onVercel ? request.headers.get("x-forwarded-for")?.split(",")[0].trim() : undefined;
  const ip = forwarded && isIP(forwarded) ? forwarded : "unknown";
  const fingerprint = hash(JSON.stringify([input.category, input.name, input.email.toLowerCase(), input.message]));
  const idKey = `portfolio:contact:submission:${hash(input.submissionId)}`;
  const pending = `pending:${fingerprint}`;
  try {
    const limited = await rate(hash(`ip:${ip}`), 5, 600);
    if (limited) return response(429, "rate_limit", { "Retry-After": String(limited) });
    const globalLimit = await rate("global", 100, 3600);
    if (globalLimit) return response(429, "rate_limit", { "Retry-After": String(globalLimit) });
    if (!input.token) return response(400, "verification");
    const check = await send("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ secret: config.turnstileSecret, response: input.token }), signal: AbortSignal.timeout(5000), cache: "no-store" });
    if (!check.ok) throw new Error("service");
    const verification = await check.json() as { success?: boolean; hostname?: string; action?: string; challenge_ts?: string };
    const age = Date.now() - Date.parse(verification.challenge_ts ?? "");
    if (!verification.success || verification.hostname !== config.hostname || verification.action !== "portfolio_contact" || !Number.isFinite(age) || age < -30000 || age > 300000) return response(400, "verification");
    const tokenClaim = await redis("SET", `portfolio:contact:token:${hash(input.token)}`, "used", "NX", "EX", 300);
    if (tokenClaim !== "OK") return response(400, "verification");
    // A retry must use a fresh verification token. Only a verified retry can
    // retrieve acceptance for an identical, already accepted submission.
    const claim = await redis("EVAL", LOCK_SCRIPT, 1, idKey, pending, RETENTION, `retry:${fingerprint}`);
    if (claim === `accepted:${fingerprint}`) return response(200, "accepted");
    if (claim !== "new") return response(409, claim === pending ? "pending" : "conflict", { "Retry-After": "5" });
    const emailLimit = await rate(hash(`email:${input.email.toLowerCase()}`), 3, 3600);
    if (emailLimit) {
      await redis("EVAL", RELEASE_SCRIPT, 1, idKey, pending);
      return response(429, "rate_limit", { "Retry-After": String(emailLimit) });
    }
    let provider: Response;
    try {
      // Plain text avoids HTML injection; fixed headers and strict email
      // validation prevent visitor-controlled header or subject injection.
      provider = await send("https://api.resend.com/emails", {
        method: "POST", headers: { Authorization: `Bearer ${config.resendKey}`, "Content-Type": "application/json", "Idempotency-Key": `portfolio-${hash(input.submissionId)}` },
        body: JSON.stringify({ from: config.from, to: [config.to], reply_to: input.email, subject: `Portfolio: ${CATEGORIES[input.category]}`, text: `Name: ${input.name}\nEnquiry: ${CATEGORIES[input.category]}\n\n${input.message}` }), signal: AbortSignal.timeout(8000), cache: "no-store",
      });
    } catch {
      // Acceptance is uncertain after a timeout. Keep a durable uncertain marker
      // and use the same provider key for a verified retry, never a fresh send.
      await redis("SET", idKey, `retry:${fingerprint}`, "EX", RETENTION);
      return response(503, "service");
    }
    if (!provider.ok) {
      await redis("SET", idKey, `retry:${fingerprint}`, "EX", RETENTION);
      return response(503, "service");
    }
    const accepted = await provider.json() as { id?: string };
    if (!accepted.id) throw new Error("service");
    await redis("SET", idKey, `accepted:${fingerprint}`, "EX", RETENTION);
    return response(200, "accepted");
  } catch { return response(503, "service"); }
}
