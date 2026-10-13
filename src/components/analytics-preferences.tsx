"use client";

import { Button } from "@/components/ui/button";
import { ANALYTICS_CHOICE_KEY, GA_ID, disableAnalytics, installAnalyticsTransportGuard, safePage, trackEvent, type AnalyticsChoice } from "@/lib/analytics";
import Link from "next/link";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function AnalyticsPreferences({ production, paths }: { production: boolean; paths: string[] }) {
  const pathname = usePathname();
  const [eligible, setEligible] = useState(false);
  const [choice, setChoice] = useState<AnalyticsChoice | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [ready, setReady] = useState(false);
  const lastPage = useRef<string | null>(null);
  const pathsKey = paths.join("\n");
  const showPreferences = (eligible && choice === null && !dismissed) || expanded;
  const closePreferences = () => { setExpanded(false); setDismissed(true); };

  useEffect(() => {
    const live = production && window.location.origin === "https://www.hamzashakeel.ca";
    setEligible(live);
    const initialized = window.portfolioAnalytics?.ready ?? false;
    window.portfolioAnalytics = { accepted: false, ready: initialized, paths: pathsKey.split("\n") };
    setReady(initialized);
    let saved: string | null = null;
    try { saved = localStorage.getItem(ANALYTICS_CHOICE_KEY); } catch { /* Optional storage may be unavailable. */ }
    const accepted = saved === "accepted";
    setChoice(accepted ? "accepted" : saved === "rejected" ? "rejected" : null);
    window.portfolioAnalytics.accepted = live && accepted;
    window[`ga-disable-${GA_ID}`] = !(live && accepted);
    if (live) installAnalyticsTransportGuard();
    const sync = (event: StorageEvent) => {
      if (event.key !== ANALYTICS_CHOICE_KEY && event.key !== null) return;
      // Another tab's acceptance requires a fresh explicit choice here; rejection
      // takes effect immediately, including while a script is still loading.
      disableAnalytics();
      setChoice(event.newValue === "rejected" ? "rejected" : null);
      lastPage.current = null;
    };
    const click = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target.closest("a") : null;
      if (!target) return;
      if (target.href === "https://www.linkedin.com/in/mianhamza") trackEvent("linkedin_click", { location: target.closest("#contact") ? "section" : "dock" });
      if (target.href === "tel:+16476139953") trackEvent("call_click", { location: "dock" });
    };
    window.addEventListener("storage", sync);
    document.addEventListener("click", click);
    return () => { window.removeEventListener("storage", sync); document.removeEventListener("click", click); };
  }, [production, pathsKey]);

  const choose = (value: AnalyticsChoice) => {
    if (value === "rejected") { disableAnalytics(); lastPage.current = null; }
    else if (eligible && window.portfolioAnalytics) {
      window.portfolioAnalytics.accepted = true;
      window[`ga-disable-${GA_ID}`] = false;
    }
    try { localStorage.setItem(ANALYTICS_CHOICE_KEY, value); } catch { /* Keep this visit's choice in memory. */ }
    setChoice(value);
    setExpanded(false);
  };

  const initialize = () => {
    if (!window.portfolioAnalytics?.accepted) return;
    if (!window.gtag) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer!.push(arguments); };
      window.gtag("consent", "default", { analytics_storage: "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
      window.gtag("consent", "update", { analytics_storage: "granted", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
      window.gtag("js", new Date());
      window.gtag("config", GA_ID, {
        send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false,
        ignore_referrer: true, page_title: "Portfolio", page_referrer: "", page_location: `https://www.hamzashakeel.ca${safePage(window.location.pathname)}`,
      });
    }
    window.portfolioAnalytics.ready = true;
    setReady(true);
  };

  useEffect(() => {
    if (!eligible || choice !== "accepted" || !ready || !window.portfolioAnalytics?.accepted) return;
    const path = safePage(pathname);
    if (lastPage.current === path) return;
    window.gtag?.("event", "page_view", { send_to: GA_ID, page_location: `https://www.hamzashakeel.ca${path}`, page_referrer: lastPage.current ? `https://www.hamzashakeel.ca${lastPage.current}` : "", page_title: path === "/" ? "Home" : path === "/privacy" ? "Privacy" : "Notes" });
    lastPage.current = path;
  }, [pathname, eligible, choice, ready]);

  return <>
    {eligible && choice === "accepted" && <Script id="portfolio-ga4" src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" onReady={initialize} />}
    <footer className="mt-8 mb-16 flex justify-center gap-4 text-xs text-muted-foreground">
      <Link href="/privacy" className="underline underline-offset-4">Privacy</Link>
      <button type="button" onClick={() => showPreferences ? closePreferences() : setExpanded(true)} aria-expanded={showPreferences} aria-controls="analytics-preferences" className="underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring">Analytics preferences</button>
    </footer>
    {showPreferences && <section id="analytics-preferences" aria-label="Analytics preferences" className="fixed inset-x-4 bottom-24 z-40 mx-auto max-w-sm rounded-xl border bg-background p-4 text-sm shadow-lg">
      <p className="font-medium">Optional analytics</p>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">With your permission, Google Analytics measures page visits and selected contact actions. No form content is sent. <Link href="/privacy" className="underline">Privacy notice</Link></p>
      <div className="mt-3 flex gap-2">
        <Button type="button" variant="outline" className="flex-1" onClick={() => choose("accepted")}>Accept</Button>
        <Button type="button" variant="outline" className="flex-1" onClick={() => choose("rejected")}>Reject</Button>
      </div>
      <button type="button" className="mt-3 text-xs underline" onClick={closePreferences}>Close preferences</button>
    </section>}
  </>;
}
