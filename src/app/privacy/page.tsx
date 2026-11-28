import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Privacy", path: "/privacy",
  description: "How Hamza Shakeel’s portfolio handles Google Analytics, cookies, contact enquiries and spam protection.",
});

export default function PrivacyPage() {
  return <main className="space-y-5 text-sm leading-relaxed">
    <h1 className="text-3xl font-semibold tracking-tight">Privacy</h1>
    <p>This portfolio uses Google Analytics 4 (G-1BKHGCCN3E) to understand visits to public pages and selected contact actions. Analytics loads automatically on the production site without a consent banner or an on-site analytics preference control.</p>
    <p>Google Analytics uses first-party cookies, including _ga and _ga_ cookies, to distinguish browsers and maintain session information. Google processes analytics events and technical information about visits, such as browser and device details. The site configures advertising storage, advertising user data, ad personalization and Google signals as disabled.</p>
    <p>The site sends public page paths without query strings or fragments, and fixed event names for opening contact, accepted submissions, submission errors, LinkedIn clicks and call clicks. Custom event parameters are limited to the contact entry point and enquiry category; they do not include names, email addresses, phone numbers, messages, verification tokens or other form values.</p>
    <p>You can manage or delete cookies through your browser settings and use browser tools to block Google Analytics. Deleting cookies does not delete information already sent to Google. This site no longer stores an analytics preference in local storage; it removes the previous preference when a page loads. Theme preferences may still use local storage.</p>
    <p>When a protected contact form is enabled, its details are processed by the email provider to forward your enquiry and allow a reply. A short confirmation may also be sent to the email address you provide. It does not repeat the private details of your message. Enquiry confirmations are not a mailing-list subscription and do not contain open or click tracking. Cloudflare Turnstile verifies requests; Vercel Firewall limits contact requests by IP address, and the email provider uses temporary idempotency records to prevent duplicate sends. These services operate separately from Google Analytics. The form is unavailable until those services are configured and tested. LinkedIn and calling remain available.</p>
    <p>The business email checker sends public DNS queries directly from your browser to Google Public DNS. Google receives the queried domain or selector and connection information according to its own <a href="https://developers.google.com/speed/public-dns/privacy" className="underline">privacy practices</a>. This site does not store a lookup history or intentionally include lookup values in its analytics events. Enter public domains only, not email addresses or private hostnames. If you choose to paste a report into an enquiry, it is handled like other contact form details.</p>
    <p>The hosting provider processes requests to serve this site. External links use their destination&apos;s own privacy practices. Blocking analytics does not disable essential hosting or, when enabled, contact protection.</p>
  </main>;
}
