import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Privacy", path: "/privacy",
  description: "How Hamza Shakeel’s portfolio handles optional analytics, contact enquiries, spam protection and your privacy choices.",
});

export default function PrivacyPage() {
  return <main className="space-y-5 text-sm leading-relaxed">
    <h1 className="text-3xl font-semibold tracking-tight">Privacy</h1>
    <p>This portfolio uses optional Google Analytics 4 (G-1BKHGCCN3E) to understand visits to public pages and selected contact actions. Google Analytics loads only on the production site after you accept; until then it stays unloaded. Rejecting or withdrawing consent stops further collection. Changing your choice does not delete information previously sent to Google. You can change your choice using Analytics preferences at the bottom of any page.</p>
    <p>When browser storage is available, your analytics preference is saved in local storage. Otherwise it applies to this visit. If accepted, Google Analytics may set first-party analytics cookies and process technical information about your visit. Advertising storage, advertising user data, personalization, and Google signals are disabled.</p>
    <p>Analytics receives public page paths without query strings or fragments, and fixed event names for opening contact, accepted submissions, submission errors, LinkedIn clicks, and call clicks. Names, email addresses, phone numbers, messages, verification tokens, and form values are not included. Automatic form and outbound measurement are disabled in the GA4 web stream.</p>
    <p>When a protected contact form is enabled, its details are processed by the email provider to forward your enquiry and allow a reply. Cloudflare Turnstile verifies requests; Vercel Firewall limits contact requests by IP address, and the email provider uses temporary idempotency records to prevent duplicate sends. These services are independent of analytics consent. The form is unavailable until those services are configured and tested. LinkedIn and calling remain available.</p>
    <p>The hosting provider processes requests to serve this site. External links use their destination&apos;s own privacy practices. Rejecting analytics does not disable essential hosting or, when enabled, contact protection.</p>
  </main>;
}
