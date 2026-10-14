import { CONTACT_CATEGORIES, type ContactDetails } from "./schema";

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]!);
const multiline = (value: string) => escapeHtml(value).replace(/\r\n|\r|\n/g, "<br />");

export function createContactEmail(input: ContactDetails, submittedAt: number) {
  const category = CONTACT_CATEGORIES[input.category];
  // The original attempt's time keeps both bodies identical on delayed retries.
  const received = new Date(submittedAt);
  const timestamp = `${received.toISOString().slice(0, 19).replace("T", " ")} UTC`;
  const date = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(received);
  const subject = `Portfolio enquiry · ${category.subject}`;
  const text = `HAMZA SHAKEEL\nPORTFOLIO / INBOX\n\nNew enquiry\n${category.label} · ${date}\n\nFROM\n${input.name}\n${input.email}\n\n${category.contextLabel}\n${input.context}\n\n${category.messageLabel}\n${input.message}\n\nReceived via hamzashakeel.ca\n${timestamp}`;
  const html = `<!doctype html>
<html lang="en" dir="ltr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="light dark"><title>${subject}</title>
<style>@media(prefers-color-scheme:dark){.email-surface{background-color:#181a1d!important;color:#f3f4f6!important}.email-muted{color:#b5bac2!important}.email-border{border-color:#3c4148!important}}</style></head>
<body class="email-surface" style="margin:0;padding:0;background-color:#ffffff;color:#202124;font-family:Arial,Helvetica,sans-serif;">
<div lang="en" dir="ltr" class="email-surface" style="background-color:#ffffff;color:#202124;padding:32px 20px;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" align="center" style="width:100%;max-width:560px;margin:0 auto;"><tr><td>
<p style="margin:0;font-size:12px;line-height:20px;font-weight:700;letter-spacing:1.2px;">HAMZA SHAKEEL</p>
<p class="email-muted" style="margin:2px 0 0;color:#5f6368;font-size:11px;line-height:18px;letter-spacing:1px;">PORTFOLIO / INBOX</p>
<h1 style="margin:32px 0 6px;font-size:22px;line-height:30px;font-weight:600;letter-spacing:-0.4px;">New enquiry</h1>
<p class="email-muted" style="margin:0 0 24px;color:#5f6368;font-size:14px;line-height:22px;">${category.label} · ${date}</p>
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" class="email-border" style="width:100%;table-layout:fixed;border-top:1px solid #e5e7eb;"><tr><td style="padding-top:24px;">
<h2 class="email-muted" style="margin:0 0 8px;color:#5f6368;font-size:11px;line-height:18px;font-weight:600;letter-spacing:1px;">FROM</h2>
<p style="margin:0;font-size:16px;line-height:26px;font-weight:600;overflow-wrap:anywhere;word-break:break-word;">${escapeHtml(input.name)}</p>
<p style="margin:0;font-size:15px;line-height:24px;overflow-wrap:anywhere;word-break:break-word;">${escapeHtml(input.email)}</p>
${[[category.contextLabel, input.context], [category.messageLabel, input.message]].map(([label, value]) => `<h2 class="email-muted" style="margin:24px 0 8px;color:#5f6368;font-size:11px;line-height:18px;font-weight:600;letter-spacing:1px;text-transform:uppercase;">${label}</h2><p style="margin:0;font-size:16px;line-height:26px;overflow-wrap:anywhere;word-break:break-word;">${multiline(value)}</p>`).join("")}
</td></tr></table>
<p class="email-border email-muted" style="margin:28px 0 0;padding-top:18px;border-top:1px solid #e5e7eb;color:#5f6368;font-size:12px;line-height:20px;">Received via hamzashakeel.ca<br />${timestamp}</p>
</td></tr></table></div></body></html>`;
  return { subject, text, html };
}
