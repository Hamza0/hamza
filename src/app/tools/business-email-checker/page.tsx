import { Breadcrumbs } from "@/components/breadcrumbs";
import { BusinessEmailChecker } from "@/components/business-email-checker";
import { NoteContactCTA } from "@/components/note-contact-cta";
import { AUTHOR, WEBSITE_ID, pageMetadata, serializeJsonLd } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";
import Link from "next/link";

const path = "/tools/business-email-checker";
const title = "Free Business Email Checker (MX, SPF, DKIM & DMARC)";
const description = "Check your domain's public MX, SPF, DMARC and DKIM records for free. Understand missing email, Gmail rejection and website form delivery issues.";

export const metadata = pageMetadata({ title, description, path });

const related = [
  { path: "/blog/gmail-rejecting-business-email-550-5-7-26", label: "Gmail rejecting business emails (550 5.7.26)" },
  { path: "/blog/wordpress-form-sent-but-no-email", label: "WordPress contact form emails not arriving" },
  { path: "/blog/moving-website-keep-email-working", label: "Keep email working when moving your website" },
];

export default function EmailCheckerPage() {
  return (
    <main className="note-theme space-y-7 pb-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd({
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "@id": SITE_URL + path + "#tool",
        name: title,
        url: SITE_URL + path,
        description,
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Web browser",
        isAccessibleForFree: true,
        inLanguage: "en-CA",
        author: AUTHOR,
        isPartOf: { "@id": WEBSITE_ID },
        datePublished: "2026-11-28",
      }) }} />
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Notes", path: "/blog" }, { name: "Business email checker", path }]} />
      <header className="space-y-3">
        <p className="text-xs font-medium text-muted-foreground">Free diagnostic tool</p>
        <h1 className="text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">Business email checker</h1>
        <p className="text-base leading-relaxed text-muted-foreground">Are invoices bouncing, or are contact form emails not arriving? Check your domain&apos;s public MX, SPF, DKIM and DMARC records before changing your email settings.</p>
        <p className="text-xs text-muted-foreground">Built by <Link href="/#about" className="underline underline-offset-4">Hamza Shakeel</Link>, software developer in the Greater Toronto Area.</p>
      </header>
      <BusinessEmailChecker />
      <section aria-labelledby="email-what" className="space-y-4 text-sm leading-relaxed">
        <h2 id="email-what" className="text-xl font-semibold tracking-tight">What does the email checker look for?</h2>
        <dl className="divide-y divide-border rounded-xl border px-4">
          {[
            ["MX", "Where incoming mail is directed. A published record does not establish that a particular mailbox receives messages."],
            ["SPF", "Which senders the published domain policy authorizes. This is a record check, not a full SPF evaluation."],
            ["DMARC", "The directly published policy and its requested handling of messages that fail aligned authentication. Parent-domain policy discovery is not included."],
            ["DKIM", "Whether a public key is published for the specific signing domain and selector you enter. This does not verify a message signature."],
          ].map(([name, detail]) => <div key={name} className="py-3"><dt className="font-semibold">{name}</dt><dd className="mt-1 text-muted-foreground">{detail}</dd></div>)}
        </dl>
        <p className="text-muted-foreground">If you have multiple email providers, check the exact sending domains each one uses. Gmail has separate requirements for ordinary and bulk senders; see <a href="https://support.google.com/mail/answer/81126" className="underline underline-offset-4">Google&apos;s email sender guidelines</a>.</p>
      </section>
      <section aria-labelledby="email-next" className="space-y-3 text-sm leading-relaxed">
        <h2 id="email-next" className="text-xl font-semibold tracking-tight">What if a record is missing?</h2>
        <p className="text-muted-foreground">Start with the affected service and the exact bounce or error message. Do not delete existing records just to make a warning disappear. Website forms, staff email and automated invoices can use different sending services.</p>
        <p className="text-muted-foreground">This tool retrieves public DNS using <a href="https://developers.google.com/speed/public-dns/docs/doh/json" className="underline underline-offset-4">Google Public DNS over HTTPS</a>. It checks published records at the time of the request. DNS caches may retain earlier values. It does not test inbox placement, verify deliverability, recursively evaluate SPF, validate DKIM signatures or determine the effective inherited DMARC policy.</p>
        <p className="text-muted-foreground">Only public domain names should be entered. The lookup is performed in your browser; Google receives the queried names and connection information. No email is sent and the site does not save a lookup history. See <Link href="/privacy" className="underline underline-offset-4">privacy</Link>.</p>
      </section>
      <section aria-labelledby="email-notes" className="space-y-3">
        <h2 id="email-notes" className="text-xl font-semibold tracking-tight">Troubleshooting notes</h2>
        <ul className="space-y-2">{related.map(note => <li key={note.path}><Link href={note.path} className="text-sm underline underline-offset-4">{note.label}</Link></li>)}</ul>
      </section>
      <NoteContactCTA title="Need help with your email?" description="Tell me which service is affected and what happened. A copied DNS summary can help." context="Business email DNS checker" starters={[
        { label: "Emails not arriving", message: "My business emails are not reaching customers or our inbox." },
        { label: "Gmail rejection", message: "Gmail is rejecting messages from my business email domain." },
        { label: "DNS record help", message: "I need help understanding the email DNS records shown in the checker." },
      ]} />
    </main>
  );
}
