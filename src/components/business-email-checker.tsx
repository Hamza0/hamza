"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { AlertCircle, CheckCircle2, CircleHelp, Clipboard, Loader2, Plus, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { checkEmailDns, normalizeDomain, normalizeSelector, type EmailCheck } from "@/lib/email-dns.mjs";

type Report = { domain: string; selector: string; checkedAt: string; checks: EmailCheck[] };
const field = "note-message-field block h-12 w-full min-w-0 rounded-xl border px-3.5 text-base focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring disabled:opacity-60";
const recordNames = { mx: "Incoming email", spf: "Authorized senders", dmarc: "Domain protection", dkim: "Email signing" } as const;

function shortStatus(check: EmailCheck) {
  if (check.status === "skipped") return "Not checked";
  if (check.label === "p=none") return "Monitoring only";
  if (check.label === "Null MX") return "Null MX published";
  return check.label;
}

export function BusinessEmailChecker() {
  const [domain, setDomain] = useState("");
  const [selector, setSelector] = useState("");
  const [showSelector, setShowSelector] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [report, setReport] = useState<Report | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [copyStatus, setCopyStatus] = useState("");
  const request = useRef<AbortController | null>(null);
  const resultHeading = useRef<HTMLHeadingElement>(null);
  const selectorField = useRef<HTMLInputElement>(null);
  useEffect(() => () => { request.current?.abort(); request.current = null; }, []);
  useEffect(() => { if (report) resultHeading.current?.focus(); }, [report]);
  useEffect(() => { if (showSelector) selectorField.current?.focus(); }, [showSelector]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (request.current) return;
    const host = normalizeDomain(domain);
    if (!host) { setError("Enter a public domain, such as example.com, without https:// or an email address."); setReport(null); return; }
    const key = normalizeSelector(showSelector ? selector : "", host);
    if (key === null) { setError("Enter the DKIM selector from your email provider, such as google or selector1, or leave it blank."); setReport(null); return; }
    const controller = new AbortController();
    request.current = controller;
    setBusy(true); setError(""); setReport(null); setCopyStatus(""); setShowDetails(false);
    const timer = setTimeout(() => controller.abort(), 9000);
    try {
      const checks = await checkEmailDns(host, key, controller.signal);
      if (request.current === controller) setReport({ domain: host, selector: key, checkedAt: new Date().toISOString(), checks });
    } catch {
      if (request.current === controller) setError("The check could not be completed. Please try again.");
    } finally {
      clearTimeout(timer);
      if (request.current === controller) { request.current = null; setBusy(false); }
    }
  }

  async function copyReport() {
    if (!report) return;
    const summary = ["Business email DNS check", report.domain, report.checkedAt, ...report.checks.map(c => c.title + ": " + c.label + "\n" + c.detail), "Public DNS only; not a delivery or authentication test."].join("\n\n");
    try { await navigator.clipboard.writeText(summary); setCopyStatus("Summary copied."); }
    catch { setCopyStatus("Copy is unavailable in this browser. You can select the report text instead."); }
  }

  return (
    <section aria-label="Business email DNS checker" className="note-enquiry-inner rounded-[1.25rem] border p-4 sm:p-6">
      <form onSubmit={submit} className="space-y-3" aria-busy={busy}>
        <label htmlFor="email-dns-domain" className="block text-sm font-semibold">Email domain</label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input id="email-dns-domain" type="text" inputMode="url" autoCapitalize="none" spellCheck={false} autoComplete="off" maxLength={253} required value={domain} onChange={event => { setDomain(event.target.value); setError(""); setReport(null); }} placeholder="yourbusiness.com" className={field + " flex-1"} disabled={busy} aria-describedby="email-dns-domain-help" />
          <Button type="submit" disabled={busy} className="h-12 shrink-0 gap-2 rounded-xl px-6">
            {busy ? <Loader2 size={16} aria-hidden="true" className="motion-safe:animate-spin" /> : <Search size={16} aria-hidden="true" />}
            {busy ? "Checking…" : "Check domain"}
          </Button>
        </div>
        <p id="email-dns-domain-help" className="text-xs text-muted-foreground">For hello@example.com, enter example.com.</p>
        <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-3">
          <p className="text-xs text-muted-foreground">MX · SPF · DMARC</p>
          <button type="button" disabled={busy} aria-expanded={showSelector} aria-controls="email-dns-dkim-options" onClick={() => {
            if (showSelector) {
              if (selector) setReport(null);
              setSelector(""); setError(""); setShowSelector(false);
            } else setShowSelector(true);
          }} className="inline-flex min-h-8 items-center gap-1.5 rounded-md text-xs font-medium text-foreground underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring disabled:opacity-50">
            {showSelector ? <X size={14} aria-hidden="true" /> : <Plus size={14} aria-hidden="true" />}
            {showSelector ? "Remove DKIM check" : "Add DKIM check"}
          </button>
        </div>
        <div id="email-dns-dkim-options" hidden={!showSelector} className="space-y-2">
          <label htmlFor="email-dns-selector" className="block text-sm font-medium">DKIM selector <span className="font-normal text-muted-foreground">(optional)</span></label>
          <input ref={selectorField} id="email-dns-selector" autoComplete="off" autoCapitalize="none" spellCheck={false} maxLength={190} value={selector} onChange={event => { setSelector(event.target.value); setReport(null); setError(""); }} placeholder="e.g. selector1" className={field} disabled={busy} aria-describedby="email-dns-selector-help" />
          <p id="email-dns-selector-help" className="text-xs text-muted-foreground">Use the selector and signing domain from your email provider.</p>
        </div>
        <p role="alert" className="text-sm text-destructive empty:hidden">{error}</p>
        <p role="status" className="text-xs text-muted-foreground">{busy ? "Looking up public DNS records…" : "Free · No sign-up · Google Public DNS"}</p>
        <noscript><p className="text-sm text-muted-foreground">Enable JavaScript to run the checker.</p></noscript>
      </form>
      {report && (
        <div className="mt-5 space-y-4 border-t pt-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="min-w-0">
              <h2 ref={resultHeading} tabIndex={-1} className="text-lg font-semibold tracking-tight outline-none">Email records</h2>
              <p className="mt-1 break-all text-sm text-muted-foreground">{report.domain}</p>
            </div>
            <button type="button" onClick={copyReport} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border px-3 text-xs font-medium hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring"><Clipboard size={14} aria-hidden="true"/>Copy report</button>
          </div>
          <ul className="divide-y divide-border rounded-xl border px-3 sm:px-4">
            {report.checks.map(check => {
              const Icon = check.status === "found" ? CheckCircle2 : check.status === "review" ? AlertCircle : CircleHelp;
              const tone = check.status === "found" ? "text-emerald-700 dark:text-emerald-400" : check.status === "review" ? "text-amber-800 dark:text-amber-400" : "text-muted-foreground";
              return (
                <li key={check.key} className="py-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <Icon size={19} className={tone + " shrink-0"} aria-hidden="true" />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold">{check.key.toUpperCase()}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">{recordNames[check.key]}</p>
                      </div>
                    </div>
                    <span className={"max-w-[48%] text-right text-xs font-medium " + tone}>{shortStatus(check)}</span>
                  </div>
                  {check.status === "skipped" && !showSelector && <button type="button" onClick={() => setShowSelector(true)} className="ml-7 mt-2 text-xs font-medium underline underline-offset-4">Add a selector</button>}
                  {showDetails && <div className="ml-7 mt-2 space-y-2">
                    <p className="text-sm leading-relaxed text-muted-foreground">{check.detail}</p>
                    {check.records.map((record, i) => <code key={i} className="block whitespace-pre-wrap break-all rounded-md bg-muted p-2 text-xs">{record}</code>)}
                  </div>}
                </li>
              );
            })}
          </ul>
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">DNS check, not a delivery test.</p>
            <button type="button" aria-expanded={showDetails} onClick={() => setShowDetails(value => !value)} className="shrink-0 text-xs font-medium underline underline-offset-4">{showDetails ? "Hide details" : "View details"}</button>
          </div>
          {report.selector && <p className="break-all text-xs text-muted-foreground">DKIM selector: {report.selector}</p>}
          <Button asChild variant="outline" className="h-11 w-full rounded-xl shadow-none"><a href="#get-help">Need help with these results?</a></Button>
          <p role="status" className="text-xs text-muted-foreground empty:hidden">{copyStatus}</p>
        </div>
      )}
    </section>
  );
}
