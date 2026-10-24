export const CONTACT_CATEGORIES = {
  job: {
    label: "Job opportunity", subject: "Job opportunity",
    title: "Let's talk about the opportunity.", description: "Share the role and a little about your team.",
    contextLabel: "Company and role", contextPlaceholder: "Acme · Software Developer",
    messageLabel: "Opportunity details", messagePlaceholder: "Tell me about the role and your team.",
  },
  project: {
    label: "Project enquiry", subject: "Project",
    title: "Tell me about your project.", description: "What are you looking to build or improve?",
    contextLabel: "Project type", contextPlaceholder: "Website, application, or dashboard",
    messageLabel: "Project details", messagePlaceholder: "What would you like to build or improve?",
  },
  collaboration: {
    label: "Collaboration", subject: "Collaboration",
    title: "Let's explore working together.", description: "Tell me about the idea and how we could collaborate.",
    contextLabel: "Collaboration type", contextPlaceholder: "Partnership, open source, or creative work",
    messageLabel: "Your idea", messagePlaceholder: "Share your idea and how we could work together.",
  },
} as const;

export type ContactCategory = keyof typeof CONTACT_CATEGORIES;
export type ContactDetails = { category: ContactCategory; name: string; email: string; context: string; message: string };
export const CONTACT_LIMITS = { name: 100, email: 254, context: 160, message: 3000, messageMin: 10 } as const;

// Shared by the form and API; context is one bounded, single-line text field.
export function parseContactDetails(value: unknown): ContactDetails | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const v = value as Record<string, unknown>;
  if (!["category", "name", "email", "context", "message"].every(key => typeof v[key] === "string")) return null;
  const { category, name, email, context, message } = v as Record<string, string>;
  if (!Object.hasOwn(CONTACT_CATEGORIES, category)) return null;
  if (!name.trim() || name.length > CONTACT_LIMITS.name || /[\u0000-\u001f\u007f]/.test(name)) return null;
  if (email.length > CONTACT_LIMITS.email || !/^[^\s@<>\r\n]+@[^\s@<>\r\n]+\.[^\s@<>\r\n]+$/.test(email)) return null;
  if (!context.trim() || context.length > CONTACT_LIMITS.context || /[\u0000-\u001f\u007f]/.test(context)) return null;
  if (message.trim().length < CONTACT_LIMITS.messageMin || message.length > CONTACT_LIMITS.message || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(message)) return null;
  return { category: category as ContactCategory, name: name.trim(), email, context: context.trim(), message: message.trim() };
}
