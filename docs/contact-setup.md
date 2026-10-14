# Portfolio contact configuration

Use only the existing Vercel `hamzas-projects-58f26d2b/hamza` project. Configure secrets privately, never in source, chat, or logs. Production uses these variables:

| Service | Exact variables | Configuration |
| --- | --- | --- |
| Resend | `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, `CONTACT_TO_EMAIL` | Dedicated sending-only key restricted to the verified sending domain. Temporary sender: `contact@codedsquare.com`; recipient: `hamza@codedsquare.com`, kept server-side. Switch to `contact@send.hamzashakeel.ca` and a matching domain-restricted key only after Resend verifies that domain. |
| Turnstile | `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | Reuse Hamza Portfolio Contact. Production requires hostname `www.hamzashakeel.ca`, action `portfolio_contact`, and a fresh token. The site key is public; the secret is sensitive. |
| Origin | `CONTACT_ALLOWED_ORIGIN` | `https://www.hamzashakeel.ca` in Production. Local testing uses its own exact origin and hostname, never a broader production allowlist. |
| Activation | `CONTACT_ENABLED`, `CONTACT_FORM_VERIFIED` | Both remain false until the firewall, framework, API, UI, and labelled delivery checks pass. Controls require both gates and complete configuration. Environment changes require a new build. |

## Protection changes

Redis is no longer called or required. `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, and `CONTACT_HASH_SECRET` are obsolete. Do not create a Redis service.

Vercel Firewall must enforce a fixed-window limit of five requests per IP per 600 seconds for **POST /api/contact** before enabling the endpoint. Its counters are per region, and fixed-window boundaries can allow bursts. It does not provide the former per-email or global shared quotas. Other pages and GET requests are excluded.

Cloudflare Siteverify redeems single-use, five-minute tokens and checks hostname, action, success, and timestamp. Replay protection belongs to Cloudflare; there is no local token cache. Resend retains idempotency keys for 24 hours and handles identical retries, changed-payload conflicts, and concurrent requests. Application submission IDs expire at 23 hours; retries preserve the ID, payload, and provider key and require a fresh token. There is no application-wide lock or durable status table, no process-local Map, and no global submission guarantee. A new submission ID represents a new enquiry.

The existing origin check, honeypot, JSON/body and field limits, header validation, plain-text email, bounded timeouts, and fail-closed responses remain. Firewall HTML/429 responses are handled without false success. Uncertain attempts keep their details locked across verification errors or throttled retries. Provider acceptance requires an email ID; it is distinct from a delivered event or an inbox confirmation.

## Release checks

Run `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`, and `git diff --check` with pnpm 9.15.9. Next.js 15.5.27 is the supported maintenance security release used here; React and required peer/type compatibility changes are scoped to that upgrade.

Before activation, verify invalid and reused Turnstile tokens, provider failure/uncertain retry and duplicate handling, the published firewall limit, mobile/desktop and light/dark dialog behavior, and one clearly labelled real message to the configured recipient. Record provider acceptance, provider delivery, and inbox visibility separately. Keep the gates false if any essential check remains blocked.

GA4, consent behavior, page tracking, approved portfolio copy and metadata remain unchanged. Enhanced Measurement stays off. LinkedIn and call actions remain; the badge switches from email copy only after the protected form is verified.
