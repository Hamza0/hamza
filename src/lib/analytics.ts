export const GA_ID = "G-1BKHGCCN3E";
export const ANALYTICS_CHOICE_KEY = "hamza-analytics-v1";
export type AnalyticsChoice = "accepted" | "rejected";
export type ContactCategory = "job" | "project" | "collaboration";
export type ContactTrigger = "section" | "dock" | "lanyard";
let transportGuardInstalled = false;
type AnalyticsEvent = "contact_open" | "contact_submit_success" | "contact_submit_error" | "linkedin_click" | "call_click";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    portfolioAnalytics?: { accepted: boolean; ready: boolean; paths: string[] };
    [key: `ga-disable-${string}`]: boolean | undefined;
  }
}

export function safePage(pathname: string) {
  return window.portfolioAnalytics?.paths.includes(pathname) ? pathname : "/";
}

export function trackEvent(event: AnalyticsEvent, parameters: { location?: ContactTrigger; category?: ContactCategory } = {}) {
  const state = window.portfolioAnalytics;
  if (!["contact_open", "contact_submit_success", "contact_submit_error", "linkedin_click", "call_click"].includes(event)) return;
  if (!state?.accepted || !state.ready || window[`ga-disable-${GA_ID}`]) return;
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

export function disableAnalytics() {
  window[`ga-disable-${GA_ID}`] = true;
  if (window.portfolioAnalytics) window.portfolioAnalytics.accepted = false;
  // Do not send denied-consent pings. Disable collection synchronously and
  // remove this site's GA cookies without touching unrelated preference cookies.
  for (const cookie of document.cookie.split(";")) {
    const name = cookie.trim().split("=")[0];
    if (name !== "_ga" && !name.startsWith("_ga_")) continue;
    for (const domain of ["", "; domain=www.hamzashakeel.ca", "; domain=.hamzashakeel.ca"]) {
      document.cookie = `${name}=; Max-Age=0; path=/${domain}; SameSite=Lax`;
    }
  }
}

export function installAnalyticsTransportGuard() {
  if (transportGuardInstalled) return;
  transportGuardInstalled = true;
  const blocked = (input: string | URL | Request) => {
    try {
      const url = new URL(input instanceof Request ? input.url : String(input), window.location.origin);
      return (url.hostname === "google-analytics.com" || url.hostname.endsWith(".google-analytics.com")) && url.searchParams.get("tid") === GA_ID && !window.portfolioAnalytics?.accepted;
    } catch { return false; }
  };
  // gtag batches events. Its opt-out flag stops new events but a previously
  // buffered batch can still flush later. Install before the tag loads so its
  // captured transports also discard this property's queued hits on withdrawal.
  // Every other destination, including contact and other properties, is untouched.
  const originalFetch = window.fetch.bind(window);
  window.fetch = (input, init) => blocked(input) ? Promise.resolve(new Response(null, { status: 204 })) : originalFetch(input, init);
  if (navigator.sendBeacon) {
    const originalBeacon = navigator.sendBeacon.bind(navigator);
    navigator.sendBeacon = (url, data) => blocked(url) ? true : originalBeacon(url, data);
  }
}
