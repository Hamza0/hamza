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
  "why-google-shows-old-website-text": "search",
  "ai-crawlers-search-and-training": "search",
  "wordpress-slow-after-update": "web",
  "cdn-googlebot-crawl-problems": "search",
  "google-crawled-page-not-indexed": "search",
  "website-redesign-google-traffic-drop": "search",
  "google-business-profile-not-showing-maps": "search",
  "woocommerce-no-shipping-options": "systems",
  "woocommerce-payment-methods-missing": "systems",
  "spreadsheet-or-custom-web-app": "systems",
  "website-crm-sync-stopped": "systems",
  "wordpress-scheduled-task-missed": "web",
  "website-backup-restore-check": "web",
  "ai-chatbot-wrong-answers": "systems",
};

const noteCallsToAction: Record<string, Pick<NoteTopic, "ctaTitle" | "ctaDescription">> = {
  "google-crawled-page-not-indexed": {
    ctaTitle: "Is an important page missing from Google?",
    ctaDescription: "Share the page and the status you see in Search Console.",
  },
  "website-redesign-google-traffic-drop": {
    ctaTitle: "Did search traffic drop after your redesign?",
    ctaDescription: "Tell me what changed and which pages lost visitors.",
  },
  "google-business-profile-not-showing-maps": {
    ctaTitle: "Need help with your Google listing?",
    ctaDescription: "Share your profile link and what customers see when they search.",
  },
  "woocommerce-no-shipping-options": {
    ctaTitle: "Are shipping options missing at checkout?",
    ctaDescription: "Tell me which products and delivery areas are affected.",
  },
  "woocommerce-payment-methods-missing": {
    ctaTitle: "Can’t see the payment option you need?",
    ctaDescription: "Share the payment provider and the checkout behaviour you’re seeing.",
  },
  "spreadsheet-or-custom-web-app": {
    ctaTitle: "Wondering if your team needs a web app?",
    ctaDescription: "Tell me what your spreadsheet handles and where the work gets difficult.",
  },
  "website-crm-sync-stopped": {
    ctaTitle: "Have your tools stopped sharing updates?",
    ctaDescription: "Tell me which systems should connect and what information is missing.",
  },
  "wordpress-scheduled-task-missed": {
    ctaTitle: "Is a scheduled task running late?",
    ctaDescription: "Tell me what should run, when it was due and what happened.",
  },
  "website-backup-restore-check": {
    ctaTitle: "Not sure your backup would restore the site?",
    ctaDescription: "Tell me how your backups are stored and what your business needs to recover.",
  },
  "ai-chatbot-wrong-answers": {
    ctaTitle: "Need help improving your chatbot’s answers?",
    ctaDescription: "Share an example question and the information it should use, without customer details.",
  },
  "why-google-shows-old-website-text": {
    ctaTitle: "Want me to check what Google sees?",
    ctaDescription: "Share your page and the search result you’re seeing.",
  },
  "ai-crawlers-search-and-training": {
    ctaTitle: "Unsure which crawlers to allow?",
    ctaDescription: "Tell me what you want people to find and what you want to restrict.",
  },
  "wordpress-slow-after-update": {
    ctaTitle: "Did an update slow your site down?",
    ctaDescription: "Tell me what changed and which page or feature feels slow.",
  },
  "cdn-googlebot-crawl-problems": {
    ctaTitle: "Did a hosting change affect your search traffic?",
    ctaDescription: "Share the affected page and when the change happened.",
  },
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
