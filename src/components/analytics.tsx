"use client";

import { GA_ID, safePage, trackEvent } from "@/lib/analytics";
import Link from "next/link";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function Analytics({ production, paths }: { production: boolean; paths: string[] }) {
  const pathname = usePathname();
  const [eligible, setEligible] = useState(false);
  const [ready, setReady] = useState(false);
  const lastPage = useRef<string | null>(null);
  const pathsKey = paths.join("\n");

  useEffect(() => {
    const live = production && window.location.origin === "https://www.hamzashakeel.ca";
    setEligible(live);
    const initialized = window.portfolioAnalytics?.ready ?? false;
    window.portfolioAnalytics = { enabled: live, ready: initialized, paths: pathsKey.split("\n") };
    setReady(initialized);
    // Retire the former preference without storing a new analytics choice.
    try { localStorage.removeItem("hamza-analytics-v1"); } catch { /* Storage may be unavailable. */ }
    const click = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target.closest("a") : null;
      if (!target) return;
      if (target.href === "https://www.linkedin.com/in/mianhamza") trackEvent("linkedin_click", { location: target.closest("#contact") ? "section" : "dock" });
      if (target.href === "tel:+16476139953") trackEvent("call_click", { location: "dock" });
    };
    document.addEventListener("click", click);
    return () => { document.removeEventListener("click", click); };
  }, [production, pathsKey]);

  const initialize = () => {
    if (!window.portfolioAnalytics?.enabled) return;
    if (!window.gtag) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer!.push(arguments); };
      window.gtag("consent", "default", { analytics_storage: "granted", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
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
    if (!eligible || !ready || !window.portfolioAnalytics?.enabled) return;
    const path = safePage(pathname);
    if (lastPage.current === path) return;
    const pageTitle = path === "/" ? "Home" : path === "/privacy" ? "Privacy" : path === "/google-business-profile-help" ? "Google Business Profile help" : path.startsWith("/services/") ? "Development services" : path.startsWith("/projects/") ? "Engineering case study" : "Notes";
    window.gtag?.("event", "page_view", { send_to: GA_ID, page_location: `https://www.hamzashakeel.ca${path}`, page_referrer: lastPage.current ? `https://www.hamzashakeel.ca${lastPage.current}` : "", page_title: pageTitle });
    lastPage.current = path;
  }, [pathname, eligible, ready]);

  return <>
    {eligible && <Script id="portfolio-ga4" src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" onReady={initialize} />}
    <footer className="mt-8 mb-16 flex justify-center gap-4 text-xs text-muted-foreground">
      <Link href="/privacy" className="underline underline-offset-4">Privacy</Link>
    </footer>
  </>;
}
