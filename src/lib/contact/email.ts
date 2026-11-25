import { CONTACT_CATEGORIES, type ContactDetails } from "./schema";

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]!);
const multiline = (value: string) => escapeHtml(value).replace(/\r\n|\r|\n/g, "<br />");
const paragraph = "margin:0 0 16px;font-size:16px;line-height:26px;overflow-wrap:anywhere;word-break:break-word;";
const muted = "color:#515158;font-size:13px;line-height:21px;";
const heading = "margin:0 0 10px;font-size:26px;line-height:34px;font-weight:700;letter-spacing:-0.6px;";
const field = "margin:0 0 6px;font-size:12px;line-height:18px;font-weight:600;";

function frame(subject: string, subtitle: string, content: string, footer: string, preheader: string) {
  return `<!doctype html>
<html lang="en" dir="ltr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="light dark"><meta name="supported-color-schemes" content="light dark"><title>${escapeHtml(subject)}</title>
<style>@media(prefers-color-scheme:dark){.email-outer{background-color:#151517!important;color:#f5f5f7!important}.email-card{background-color:#222224!important;color:#f5f5f7!important}.email-panel{background-color:#303033!important;color:#f5f5f7!important}.email-muted{color:#c5c5cc!important}.email-border{border-color:#46464b!important}.email-link{color:#79b9ff!important}.email-mark{background-color:#303033!important;color:#79b9ff!important}}</style></head>
<body style="margin:0;padding:0;background-color:#f5f5f7;color:#1d1d1f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,Helvetica,sans-serif;">
<div lang="en" dir="ltr" class="email-outer" style="background-color:#f5f5f7;color:#1d1d1f;padding:24px 12px;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;mso-hide:all;">${escapeHtml(preheader)}</div>
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" align="center" style="width:100%;max-width:560px;table-layout:fixed;margin:0 auto;"><tr><td>
<div style="padding:8px 16px 22px;"><p style="margin:0;font-size:17px;line-height:24px;font-weight:600;letter-spacing:-0.25px;">Hamza Shakeel</p>
<p class="email-muted" style="margin:3px 0 0;${muted}">${escapeHtml(subtitle)}</p></div>
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" class="email-card email-border" style="width:100%;table-layout:fixed;background-color:#ffffff;color:#1d1d1f;border:1px solid #e1e1e5;border-radius:20px;box-shadow:0 4px 18px rgba(0,0,0,0.035);"><tr><td style="padding:28px 24px;">${content}</td></tr></table>
<div class="email-muted" style="padding:20px 16px 8px;text-align:center;${muted}">${footer}</div>
</td></tr></table></div></body></html>`;
}
function panel(content: string) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" class="email-panel email-border" style="width:100%;table-layout:fixed;background-color:#f5f5f7;border:1px solid #e7e7ea;border-radius:12px;"><tr><td style="padding:16px;">${content}</td></tr></table>`;
}
const siteLink = '<a class="email-link" href="https://www.hamzashakeel.ca/" style="color:#005bb5;text-decoration:underline;">hamzashakeel.ca</a>';
const privacyLink = '<a class="email-link" href="https://www.hamzashakeel.ca/privacy" style="color:#005bb5;text-decoration:underline;">Privacy</a>';

export function createContactEmail(input: ContactDetails, submittedAt: number) {
  const category = CONTACT_CATEGORIES[input.category];
  const received = new Date(submittedAt);
  const timestamp = `${received.toISOString().slice(0, 19).replace("T", " ")} UTC`;
  const date = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(received);
  const subject = `Portfolio enquiry · ${category.subject}`;
  const unnamed = input.name === "Not provided";
  const contextLabel = input.category === "project" && unnamed ? "Note / topic" : category.contextLabel;
  const text = `Hamza Shakeel\nPortfolio inbox\n\nNew enquiry\n${category.label} · ${date}\n\nReply to\n${unnamed ? "" : input.name + "\n"}${input.email}\n\n${contextLabel}\n${input.context}\n\n${category.messageLabel}\n${input.message}\n\nReply directly to this email to contact the sender.\n\nReceived via hamzashakeel.ca\n${timestamp}`;
  const html = frame(subject, "Portfolio inbox", `
<h1 style="${heading}">New enquiry</h1>
<p class="email-muted" style="margin:0 0 24px;${muted}">${category.label} · ${date}</p>
<h2 class="email-muted" style="${field}color:#515158;">Reply to</h2>
${unnamed ? "" : `<p style="margin:0 0 2px;font-size:16px;line-height:24px;font-weight:600;word-break:break-word;">${escapeHtml(input.name)}</p>`}
<p style="${paragraph}">${escapeHtml(input.email)}</p>
<h2 class="email-muted" style="${field}color:#515158;">${contextLabel}</h2>
<p style="${paragraph}font-weight:600;">${multiline(input.context)}</p>
${panel(`<h2 class="email-muted" style="${field}color:#515158;">${category.messageLabel}</h2><p style="margin:0;font-size:16px;line-height:26px;overflow-wrap:anywhere;word-break:break-word;">${multiline(input.message)}</p>`)}
<p class="email-border email-muted" style="margin:24px 0 0;padding-top:16px;border-top:1px solid #e1e1e5;${muted}">Reply directly to this email to contact the sender.</p>`,
`Received via hamzashakeel.ca<br />${timestamp}`, "A new message from your portfolio website.");
  return { subject, text, html };
}

// Only server-authored wording goes into the receipt. Never reflect the
// visitor's name, free text, URLs, or contact details to an unverified inbox.
function confirmationCopy(input: ContactDetails): string {
  switch (input.category) {
    case "job": return "Thank you for considering me for an opportunity. I'll review what you've shared and get back to you.";
    case "collaboration": return "Thanks for sharing your idea with me. I'll read through it and get back to you so we can discuss what might make sense.";
    case "business_profile": return "I understand how important it is for customers to find your business. I'll review your enquiry and get back to you about the next steps.";
    case "project":
      if (/\b(website|wordpress|elementor|shopify|woocommerce|domain|ssl|checkout)\b/i.test(input.context)) return "I understand how frustrating it can be when your website isn't working as expected. I'll review what you've shared and get back to you about the next steps.";
      if (/\b(app|application|lovable|software)\b/i.test(input.context)) return "I'll take a look at what you've shared about your application and get back to you about where we could start.";
      return "I'll review what you've shared and get back to you. You don't need to have all the technical details figured out before we talk.";
  }
}
export function createContactConfirmation(input: ContactDetails) {
  const subject = "I've received your message";
  const copy = confirmationCopy(input);
  const text = `Hamza Shakeel\nSoftware developer\n\nThanks for reaching out.\n\nI've received your message. ${copy}\n\nNeed to add something? Simply reply to this email. You don't need to fill out another form.\n\nBest regards,\nHamza Shakeel\nSoftware developer · Greater Toronto Area, Canada\nhttps://www.hamzashakeel.ca/\n\nThis is a confirmation of a message submitted through my website. If that wasn't you, you can ignore this email.\nPrivacy: https://www.hamzashakeel.ca/privacy`;
  const html = frame(subject, "Software developer", `
<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 18px;"><tr><td class="email-mark" align="center" width="48" height="48" style="width:48px;height:48px;border-radius:24px;background-color:#eef3f8;color:#005bb5;font-size:26px;line-height:48px;font-weight:600;"><span aria-hidden="true">&#10003;</span></td></tr></table>
<h1 style="${heading}">Thanks for reaching out.</h1>
<p style="${paragraph}">I've received your message.</p>
<p style="${paragraph}">${escapeHtml(copy)}</p>
${panel(`<h2 style="margin:0 0 6px;font-size:15px;line-height:22px;font-weight:600;">Need to add something?</h2><p style="margin:0;font-size:15px;line-height:24px;">Simply reply to this email. You don't need to fill out another form.</p>`)}
<p style="margin:24px 0 14px;font-size:16px;line-height:26px;">Best regards,</p>
<p style="margin:0;font-size:16px;line-height:24px;font-weight:600;">Hamza Shakeel</p>
<p class="email-muted" style="margin:3px 0 5px;${muted}">Software developer · Greater Toronto Area, Canada</p>
<p style="margin:0;font-size:14px;line-height:22px;">${siteLink}</p>`,
`This is a confirmation of a message submitted through my website. If that wasn't you, you can ignore this email.<br />${privacyLink}`, "Thanks for reaching out. You can reply directly to this email.");
  return { subject, text, html };
}
