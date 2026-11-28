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
    <main className="note-theme space-y-6 pb-12">
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
      <header className="space-y-2">
        <h1 className="text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">Business email checker</h1>
        <p className="text-base leading-relaxed text-muted-foreground">Emails bouncing or not arriving? Check the DNS records your business email depends on.</p>
      </header>
      <BusinessEmailChecker />
      <section aria-labelledby="email-what" className="space-y-3 text-sm leading-relaxed">
        <h2 id="email-what" className="text-lg font-semibold tracking-tight">What we check</h2>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-3 rounded-xl border p-4">
          {[
            ["MX", "Where incoming email goes."],
            ["SPF", "Which senders your domain authorizes."],
            ["DMARC", "Your published email protection policy."],
            ["DKIM", "The public key for a given selector."],
          ].map(([name, detail]) => <div key={name}><dt className="font-semibold">{name}</dt><dd className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{detail}</dd></div>)}
        </dl>
        <p className="text-xs leading-relaxed text-muted-foreground">Public DNS records alone cannot confirm email delivery, complete SPF validity, a DKIM signature or an inherited DMARC policy. Do not remove existing records without checking your provider. See <a href="https://support.google.com/mail/answer/81126" className="underline underline-offset-4">Gmail sender guidelines</a>.</p>
        <p className="text-xs leading-relaxed text-muted-foreground">Lookups go directly to <a href="https://developers.google.com/speed/public-dns/docs/doh/json" className="underline underline-offset-4">Google Public DNS</a>. Enter public domains only. No lookup history is saved by this site. <Link href="/privacy" className="underline underline-offset-4">Privacy</Link>.</p>
      </section>
      <section aria-labelledby="email-notes" className="space-y-3">
        <h2 id="email-notes" className="text-lg font-semibold tracking-tight">Common email problems</h2>
        <ul className="space-y-2">{related.map(note => <li key={note.path}><Link href={note.path} className="text-sm underline underline-offset-4">{note.label}</Link></li>)}</ul>
      </section>
      <NoteContactCTA title="Need help with your email?" description="Share the problem or paste your DNS report." context="Business email DNS checker" starters={[
        { label: "Emails not arriving", message: "My business emails are not reaching customers or our inbox." },
        { label: "Gmail rejection", message: "Gmail is rejecting messages from my business email domain." },
        { label: "DNS record help", message: "I need help understanding the email DNS records shown in the checker." },
      ]} />
    </main>
  );
}
