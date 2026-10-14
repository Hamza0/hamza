import { CONTACT_CATEGORIES, type ContactDetails } from "./schema";

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]!);

export function createContactEmail(input: ContactDetails, submittedAt: number) {
  const category = CONTACT_CATEGORIES[input.category];
  // The original attempt's time keeps both bodies identical on delayed retries.
  const timestamp = `${new Date(submittedAt).toISOString().slice(0, 19).replace("T", " ")} UTC`;
  const subject = `Portfolio enquiry · ${category.subject}`;
  const details = [["Name", input.name], ["Email", input.email], [category.contextLabel, input.context], [category.messageLabel, input.message]];
  const text = `HAMZA SHAKEEL / PORTFOLIO\nNew portfolio enquiry\n${category.label}\n\n${details.map(([label, value]) => `${label}: ${value}`).join("\n\n")}\n\nSent through hamzashakeel.ca\n${timestamp}`;
  const html = `<!doctype html>
<html lang="en" dir="ltr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="light dark"><title>${subject}</title>
<style>@media(prefers-color-scheme:dark){.email-surface{background-color:#181a1d!important;color:#f3f4f6!important}.email-muted{color:#b5bac2!important}.email-border{border-color:#3c4148!important}}</style></head>
<body style="margin:0;padding:0;background-color:#ffffff;color:#25282d;font-family:Arial,Helvetica,sans-serif;">
<div lang="en" dir="ltr" class="email-surface" style="background-color:#ffffff;color:#25282d;padding:24px 16px;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:600px;margin:0 auto;"><tr><td class="email-surface email-border" style="padding:28px 24px;border:1px solid #e1e4e8;border-radius:12px;background-color:#ffffff;color:#25282d;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td style="width:40px;height:40px;background-color:#25282d;color:#ffffff;border-radius:8px;text-align:center;font-size:14px;font-weight:bold;">HS</td><td class="email-muted" style="padding-left:12px;color:#535963;font-size:11px;line-height:18px;letter-spacing:1.2px;">HAMZA SHAKEEL / PORTFOLIO</td></tr></table>
<h1 style="margin:28px 0 8px;font-size:25px;line-height:32px;font-weight:600;letter-spacing:-0.5px;">New portfolio enquiry</h1>
<p class="email-muted" style="margin:0 0 24px;color:#535963;font-size:14px;line-height:22px;">${category.label}</p>
${details.map(([label, value]) => `<div class="email-border" style="padding:16px 0;border-top:1px solid #e1e4e8;"><p class="email-muted" style="margin:0 0 6px;color:#535963;font-size:12px;line-height:18px;">${label}</p><p style="margin:0;font-size:15px;line-height:24px;overflow-wrap:anywhere;word-break:break-word;">${escapeHtml(value).replace(/\r\n|\r|\n/g, "<br />")}</p></div>`).join("")}
<div class="email-border email-muted" style="margin-top:8px;padding-top:20px;border-top:1px solid #e1e4e8;color:#535963;font-size:12px;line-height:20px;">Sent through hamzashakeel.ca<br />${timestamp}</div>
</td></tr></table></div></body></html>`;
  return { subject, text, html };
}
