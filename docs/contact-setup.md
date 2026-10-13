# Protected contact setup

The new submission flow is disabled. Existing LinkedIn, call, and lanyard email-copy actions continue to work. No services or paid accounts were created. The implementation uses Resend, Cloudflare Turnstile, and Upstash Redis REST; it does not use Balans configuration.

Configure these only in the **existing portfolio Vercel project's Production environment variables**. Use separate Development/Preview values for testing; never copy secrets into source, chat, or logs. `.env.local` is the gitignored local destination. `.env.example` has empty placeholders.

| Service / purpose | Exact variables | Required setup |
| --- | --- | --- |
| Resend | `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, `CONTACT_TO_EMAIL` | Use a sending key scoped to the verified sending domain. Verify that domain's required DNS records through your email provider; set `CONTACT_FROM_EMAIL` to a verified sender on it. Set the private `CONTACT_TO_EMAIL` to the intended receiving mailbox supplied in this task. The validated visitor email goes in Reply-To. No auto-replies are sent. |
| Cloudflare Turnstile | `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | Register `www.hamzashakeel.ca` for the widget. The site key is public; keep the secret private. The server requires hostname `www.hamzashakeel.ca`, action `portfolio_contact`, and a fresh single-use token. |
| Shared Upstash Redis | `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Use a dedicated database or token authorized for `EVAL`, `INCR`, `EXPIRE`, `TTL`, `SET`, `GET`, and `DEL`. REST URL must use HTTPS. Do not reuse unrelated projects' credentials. |
| Hashing and origin | `CONTACT_HASH_SECRET`, `CONTACT_ALLOWED_ORIGIN` | Generate a private random secret of at least 32 characters directly in your secret tooling. Set origin to `https://www.hamzashakeel.ca`. Non-Vercel deployments conservatively use one shared IP bucket; do not trust arbitrary forwarding headers. |
| Activation gates | `CONTACT_ENABLED`, `CONTACT_FORM_VERIFIED` | Keep both `false` initially. With all credentials configured, set `CONTACT_ENABLED=true` to enable the endpoint for a labelled delivery test. Keep `CONTACT_FORM_VERIFIED=false` until live anti-spam, Redis, sender, and delivery checks pass. Then set it to `true` and rebuild through main/Vercel to expose the dialog and replace the badge activation. Missing configuration always hides the new controls and makes the endpoint unavailable. |

Before activating, address the existing Next.js 14.2.4 security advisories in a separately reviewed compatibility update. This task did not silently upgrade the framework or suppress the audit findings.

The release checklist is: verify valid/invalid/expired/replayed Turnstile tokens with the real widget; confirm rate limits across multiple function invocations; exercise provider failure and an uncertain retry; send **one clearly labelled delivery test** to the configured recipient; inspect provider acceptance and separately check the destination inbox. Record those as distinct results. No live delivery test or inbox check has been performed while services are unconfigured. Only then activate the public controls. Configuration changes affecting the statically rendered controls require a new build.

For the initial end-to-end test, enable the UI gates in an isolated Development/Preview environment with that environment's own origin and Turnstile hostname, while keeping Production `CONTACT_FORM_VERIFIED=false`. Use private preview access. Once the live service checks pass, activate Production through the existing main/Vercel workflow.

## Behavior and limits

- POST-only `/api/contact`; 8 KiB body cap, bounded fields, exact origin check, hidden honeypot, five-second body-read limit, server-side Turnstile check, and four/five/eight-second Redis/Turnstile/email timeouts. Failures never produce fake success.
- Shared budgets: 5 attempts per IP per 10 minutes, 3 sends per visitor email per hour, and 100 attempts per hour globally. Redis stores HMAC identifiers, verification replay markers, and submission status, rather than raw personal fields. Replay markers live five minutes; submission records live 24 hours.
- Verified retries use the original submission ID and a fresh verification token. Concurrent identical attempts return a processing state. Accepted identical retries return recorded acceptance. An uncertain provider timeout can retry with the same provider idempotency key. Changed payloads under the same ID are rejected. Attempts expire after 23 hours, before Resend's 24-hour idempotency window ends. Unknown persistence failures fail closed and may require operator investigation.
- Provider acceptance is the success condition; it does not prove inbox delivery. Plain-text messages avoid HTML injection. Strict sender/reply-to validation and fixed subjects prevent header injection. The application does not log submitted fields, tokens, or secrets.
- Dialog and verification code load only after the visitor opens contact and reaches step two. Analytics consent or a blocked Google tag does not gate sending. If Turnstile itself cannot load, the dialog explains that verification is unavailable and retains LinkedIn as an alternative.
- The original copy-email implementation remains present until live configuration is verified. Changing the badge's activation later does not erase the address from historical public code or guarantee a spam-free mailbox.

## Analytics

G-1BKHGCCN3E uses one `next/script` tag and manual pageviews for allowlisted public routes. Enhanced Measurement was disabled by the owner during this task; keep it off to prevent duplicate history pageviews and automatic form/outbound collection. The tag only loads after acceptance, on `https://www.hamzashakeel.ca`, in production builds/deployments. Advertising consent and Google signals stay disabled. The footer allows changing preferences. Do not add GTM or a second route-change tracker for this property.

Use `pnpm@9.15.9` and the existing `pnpm-lock.yaml`. Checks: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`, and `git diff --check`. The npm lockfile is historical; the declared package manager selects pnpm for this project.
