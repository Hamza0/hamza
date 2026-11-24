type NoteTopic = {
  label: string;
  tone: "sky";
  ctaTitle: string;
  ctaDescription: string;
};

const topics = {
  web: { label: "Websites", tone: "sky", ctaTitle: "Need help with your website?", ctaDescription: "Tell me what needs improving." },
  data: { label: "Data", tone: "sky", ctaTitle: "Numbers not adding up?", ctaDescription: "Tell me which report or records need attention." },
  systems: { label: "Business tools", tone: "sky", ctaTitle: "Something slowing your team down?", ctaDescription: "Tell me what should happen and where it gets stuck." },
  search: { label: "Google Search", tone: "sky", ctaTitle: "Need help getting found?", ctaDescription: "Share your website and what you want to improve." },
  practice: { label: "Behind the build", tone: "sky", ctaTitle: "Have a project in mind?", ctaDescription: "Tell me a little about it." },
} satisfies Record<string, NoteTopic>;

const noteTopics: Record<string, keyof typeof topics> = {
  "a-fast-website-still-needs-a-clear-next-step": "web",
  "accessibility-is-part-of-the-build": "web",
  "apis-are-where-systems-start-talking": "systems",
  "building-data-tools-for-non-technical-teams": "data",
  "how-i-approach-production-problems": "systems",
  "when-a-website-becomes-a-system": "systems",
  "the-work-behind-clean-digital-experiences": "web",
  "what-a-forecast-needs-around-the-number": "data",
  "database-changes-need-a-delivery-plan": "data",
  "documentation-that-helps-the-next-person": "practice",
  "ai-changes-the-development-process-not-just-the-code": "practice",
  "software-is-becoming-agent-ready": "systems",
  "healthcare-does-not-have-a-data-shortage": "data",
  "ai-in-healthcare-needs-traceability": "data",
  "from-gw-basic-to-java": "practice",
  "designing-auditable-financial-corrections": "data",
  "google-business-profile-address-change-help": "search",
  "seo-and-aeo-start-with-clear-answers": "search",
  "how-to-choose-the-first-workflow-to-automate": "systems",
  "why-a-dashboard-total-can-be-wrong": "data",
  "how-to-measure-google-ai-search-visibility": "search",
  "wordpress-form-sent-but-no-email": "web",
  "woocommerce-payment-succeeded-order-pending": "systems",
};

const noteCallsToAction: Record<string, Pick<NoteTopic, "ctaTitle" | "ctaDescription">> = {
  "how-to-measure-google-ai-search-visibility": {
    ctaTitle: "Need help with search visibility?",
    ctaDescription: "Share your website and what you want to understand.",
  },
  "wordpress-form-sent-but-no-email": {
    ctaTitle: "Missing enquiry emails?",
    ctaDescription: "Tell me which form you use and what happens.",
  },
  "woocommerce-payment-succeeded-order-pending": {
    ctaTitle: "Payment received, order stuck?",
    ctaDescription: "Tell me what the store and payment provider show.",
  },
};

export function getNotePresentation(slug: string): NoteTopic {
  return { ...topics[noteTopics[slug] ?? "practice"], ...noteCallsToAction[slug] };
}

export function readingMinutes(html: string) {
  const words = html.replace(/<[^>]*>/g, " ").trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}
