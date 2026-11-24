type NoteTopic = {
  label: string;
  tone: "sky" | "teal" | "violet" | "amber" | "rose";
  ctaTitle: string;
  ctaDescription: string;
};

const topics = {
  web: { label: "Web experiences", tone: "sky", ctaTitle: "Make the next step easier.", ctaDescription: "Tell me where visitors get stuck and what you want your website to help them do." },
  data: { label: "Data & databases", tone: "teal", ctaTitle: "Make your data easier to trust.", ctaDescription: "Describe the report, query or workflow that needs attention. We can start with the result you need." },
  systems: { label: "Reliable systems", tone: "violet", ctaTitle: "Have a workflow that needs attention?", ctaDescription: "Tell me what should happen, what happens now and where your team gets stuck." },
  search: { label: "Search & discovery", tone: "amber", ctaTitle: "Help the right people find their next step.", ctaDescription: "Share your website and the questions your customers ask. Tell me what you would like to improve." },
  practice: { label: "Engineering practice", tone: "rose", ctaTitle: "Turn the idea into a practical next step.", ctaDescription: "Have a software project, role or collaboration in mind? Tell me a little about it." },
} satisfies Record<string, NoteTopic>;

const noteTopics: Record<string, keyof typeof topics> = {
  "a-fast-website-still-needs-a-clear-next-step": "web",
  "accessibility-is-part-of-the-build": "web",
  "apis-are-where-systems-start-talking": "systems",
  "building-data-tools-for-non-technical-teams": "data",
  "data-quality-comes-before-the-dashboard": "data",
  "how-i-approach-production-problems": "systems",
  "the-difference-between-a-website-and-a-digital-platform": "web",
  "when-a-website-becomes-a-system": "systems",
  "why-production-support-changes-how-you-build": "systems",
  "the-work-behind-clean-digital-experiences": "web",
  "what-a-forecast-needs-around-the-number": "data",
  "database-changes-need-a-delivery-plan": "data",
  "forms-are-part-of-the-workflow": "web",
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
  "why-an-api-timeout-does-not-always-mean-failure": "systems",
  "why-a-dashboard-total-can-be-wrong": "data",
};

export function getNotePresentation(slug: string): NoteTopic {
  return topics[noteTopics[slug] ?? "practice"];
}

export function readingMinutes(html: string) {
  const words = html.replace(/<[^>]*>/g, " ").trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}
