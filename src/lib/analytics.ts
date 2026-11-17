export const GA_ID = "G-1BKHGCCN3E";
export type ContactCategory = "job" | "project" | "collaboration";
export type ContactTrigger = "section" | "dock" | "lanyard";
type AnalyticsEvent = "contact_open" | "contact_submit_success" | "contact_submit_error" | "linkedin_click" | "call_click";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    portfolioAnalytics?: { enabled: boolean; ready: boolean; paths: string[] };
    [key: `ga-disable-${string}`]: boolean | undefined;
  }
}

export function safePage(pathname: string) {
  return window.portfolioAnalytics?.paths.includes(pathname) ? pathname : "/";
}

export function trackEvent(event: AnalyticsEvent, parameters: { location?: ContactTrigger; category?: ContactCategory } = {}) {
  const state = window.portfolioAnalytics;
  if (!["contact_open", "contact_submit_success", "contact_submit_error", "linkedin_click", "call_click"].includes(event)) return;
  if (!state?.enabled || !state.ready || window[`ga-disable-${GA_ID}`]) return;
  const allowed: Record<string, string> = {};
  if (["section", "dock", "lanyard"].includes(parameters.location ?? "")) allowed.trigger_location = parameters.location!;
  if (["job", "project", "collaboration"].includes(parameters.category ?? "")) allowed.enquiry_category = parameters.category!;
  window.gtag?.("event", event, {
    ...allowed,
    send_to: GA_ID,
    page_location: `https://www.hamzashakeel.ca${safePage(window.location.pathname)}`,
    page_referrer: "",
  });
}
