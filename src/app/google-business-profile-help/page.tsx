import { Breadcrumbs } from "@/components/breadcrumbs";
import { BusinessProfileInquiry } from "@/components/business-profile-inquiry";
import { contactFormAvailable } from "@/lib/contact/config";
import { AUTHOR, WEBSITE_ID, pageMetadata, serializeJsonLd } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";
import Link from "next/link";

const title = "Google Business Profile Address Change Help";
const description = "Address change not showing on your Google Business Profile? Tell Hamza Shakeel what is happening through a short enquiry form and get a review of your issue.";
const path = "/google-business-profile-help";

export const metadata = pageMetadata({ title, description, path });

export default function BusinessProfileHelpPage() {
  return (
    <main className="space-y-8 pb-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd({
        "@context": "https://schema.org", "@type": "WebPage",
        "@id": `${SITE_URL}${path}#webpage`, url: `${SITE_URL}${path}`,
        name: title, description, author: AUTHOR,
        isPartOf: { "@id": WEBSITE_ID }, inLanguage: "en-CA",
        about: { "@type": "Thing", name: "Google Business Profile address changes" },
      }) }} />
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Business Profile help", path }]} />
      <header className="space-y-4">
        <p className="text-sm text-muted-foreground">Google Business Profile support</p>
        <h1 className="page-opening-title text-3xl font-bold tracking-tight sm:text-4xl">Need help with a business address change?</h1>
        <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
          If an address change is stuck, showing the wrong location, or affecting customer enquiries, tell me what you are seeing.
          I&apos;ll review the details and let you know whether I can help, with the scope agreed before work begins.
        </p>
        <p className="text-sm text-muted-foreground">
          Work directly with <Link href="/#about" rel="author" className="underline underline-offset-4">Hamza Shakeel</Link>.
        </p>
      </header>
      <section id="get-help" aria-label="Google Business Profile enquiry" className="scroll-mt-6">
        <BusinessProfileInquiry available={contactFormAvailable()} />
      </section>
      <section className="border-t pt-6">
        <h2 className="text-base font-semibold">A client experience</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          I resolved an address-change issue for a client who was losing business.
          <Link href="/blog/google-business-profile-address-change-help" className="ml-1 underline underline-offset-4">Read the note and what to include in your request</Link>.
        </p>
      </section>
    </main>
  );
}
