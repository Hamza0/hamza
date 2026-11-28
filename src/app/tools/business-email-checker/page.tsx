import { Breadcrumbs } from "@/components/breadcrumbs";
import { BusinessEmailChecker } from "@/components/business-email-checker";
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
    <main className="note-theme space-y-8 pb-12">
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
      <header className="mx-auto max-w-xl space-y-3 text-center">
        <h1 className="text-balance text-[2.5rem] font-semibold leading-[1.06] tracking-[-0.045em] sm:text-[3.25rem]">Business email checker</h1>
        <p className="mx-auto max-w-md text-[17px] leading-relaxed text-muted-foreground">Find out why your business emails may not be arriving.</p>
      </header>
      <BusinessEmailChecker />
      <section aria-labelledby="email-what" className="space-y-2">
        <h2 id="email-what" className="text-xl font-semibold tracking-tight">What it checks</h2>
        <p className="text-[15px] leading-relaxed text-muted-foreground">MX, SPF and DMARC records help route and protect email. Check DKIM with a selector from your provider after the first check.</p>
        <p className="text-[13px] leading-relaxed text-muted-foreground">Public DNS records cannot confirm actual delivery, full SPF validity, DKIM signatures or inherited DMARC policies. Check your provider before changing records.</p>
        <p className="text-[13px] leading-relaxed text-muted-foreground">Powered by <a href="https://developers.google.com/speed/public-dns/docs/doh/json" className="underline underline-offset-4">Google Public DNS</a>. Enter public domains only. No lookup history is saved by this site. <Link href="/privacy" className="underline underline-offset-4">Privacy</Link>.</p>
      </section>
      <section aria-labelledby="email-notes" className="space-y-3">
        <h2 id="email-notes" className="text-xl font-semibold tracking-tight">Common email problems</h2>
        <ul className="space-y-2">{related.map(note => <li key={note.path}><Link href={note.path} className="text-[15px] leading-relaxed text-primary underline-offset-4 hover:underline">{note.label}</Link></li>)}</ul>
      </section>
    </main>
  );
}
