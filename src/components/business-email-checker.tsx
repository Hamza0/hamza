"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { AlertCircle, CheckCircle2, CircleHelp, Clipboard, Globe, Loader2, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NoteContactCTA } from "@/components/note-contact-cta";
import { assessDkim, checkEmailDns, lookupDns, normalizeDomain, normalizeSelector, type EmailCheck } from "@/lib/email-dns.mjs";

type Report = { domain: string; selector: string; checkedAt: string; checks: EmailCheck[] };
const names = {
  mx: ["Receiving email", "MX records"],
  spf: ["Authorized senders", "SPF record"],
  dmarc: ["Email protection", "DMARC policy"],
  dkim: ["Email signing", "DKIM public key"],
} as const;
const inputClass = "h-14 w-full min-w-0 rounded-2xl border border-border bg-background px-4 text-[17px] text-foreground placeholder:text-muted-foreground/85 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-70";
const linkClass = "min-h-11 rounded-md text-[14px] font-medium text-primary underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring disabled:opacity-50";

function statusText(check: EmailCheck) {
  if (check.status === "skipped") return "Optional";
  if (check.label === "p=none") return "Monitoring only";
  if (check.label === "Null MX") return "Not set to receive";
  return check.label;
}

// Accept a pasted website URL without fetching it or changing the hostname.
// Only the validated public hostname is ever sent to the DNS resolver.
function domainFromInput(value: string) {
  const input = value.trim();
  if (/^https?:\/\//i.test(input)) {
    try {
      const url = new URL(input);
      if (url.username || url.password || url.port) return null;
      return normalizeDomain(url.hostname);
    } catch { return null; }
  }
  return normalizeDomain(input);
}

export function BusinessEmailChecker() {
  const [domain, setDomain] = useState("");
  const [selector, setSelector] = useState("");
  const [showSelector, setShowSelector] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [report, setReport] = useState<Report | null>(null);
  const [busy, setBusy] = useState<"domain" | "dkim" | null>(null);
  const [error, setError] = useState("");
  const [dkimError, setDkimError] = useState("");
  const [copyStatus, setCopyStatus] = useState("");
  const request = useRef<AbortController | null>(null);
  const resultHeading = useRef<HTMLHeadingElement>(null);
  const selectorField = useRef<HTMLInputElement>(null);
  const helpRegion = useRef<HTMLDivElement>(null);
  useEffect(() => () => { request.current?.abort(); request.current = null; }, []);
  useEffect(() => { if (report) resultHeading.current?.focus({ preventScroll: true }); }, [report]);
  useEffect(() => { if (showSelector) selectorField.current?.focus(); }, [showSelector]);
  useEffect(() => { if (showHelp) helpRegion.current?.focus(); }, [showHelp]);

  async function runCheck(kind: "domain" | "dkim", task: (signal: AbortSignal) => Promise<void>) {
    if (request.current) return;
    const controller = new AbortController();
    request.current = controller;
    setBusy(kind);
    const timer = setTimeout(() => controller.abort(), 9000);
    try { await task(controller.signal); }
    catch {
      if (request.current === controller) {
        const message = "Could not complete the check. Please try again.";
        if (kind === "domain") setError(message);
        else setDkimError(message);
      }
    } finally {
      clearTimeout(timer);
      if (request.current === controller) { request.current = null; setBusy(null); }
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (request.current) return;
    const host = domainFromInput(domain);
    if (!host) {
      setError("Enter a public domain, such as example.com.");
      setReport(null);
      return;
    }
    setDomain(host); setReport(null); setError(""); setDkimError("");
    setSelector(""); setShowSelector(false); setShowDetails(false); setCopyStatus("");
    void runCheck("domain", async signal => {
      const checks = await checkEmailDns(host, "", signal);
      if (request.current?.signal === signal) setReport({ domain: host, selector: "", checkedAt: new Date().toISOString(), checks });
    });
  }

  function submitDkim(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!report || request.current) return;
    const key = normalizeSelector(selector, report.domain);
    if (!key) { setDkimError("Enter the selector from your email provider, such as selector1."); return; }
    const current = report;
    setDkimError(""); setCopyStatus("");
    void runCheck("dkim", async signal => {
      const dns = await lookupDns(key + "._domainkey." + current.domain, 16, signal);
      if (request.current?.signal !== signal) return;
      const check = assessDkim(dns, key);
      setReport({ ...current, selector: key, checks: current.checks.map(item => item.key === "dkim" ? check : item) });
      setShowSelector(false);
    });
  }

  async function copyReport() {
    if (!report) return;
    const summary = ["Business email DNS check", report.domain, "Initial check: " + report.checkedAt, ...(report.selector ? ["DKIM selector: " + report.selector] : []), ...report.checks.map(c => c.title + ": " + c.label + "\n" + c.detail), "Public DNS only; not a delivery or authentication test."].join("\n\n");
    try { await navigator.clipboard.writeText(summary); setCopyStatus("Copied"); }
    catch { setCopyStatus("Copy unavailable. Select the report text instead."); }
  }

  const attention = report?.checks.filter(check => check.status === "review").length ?? 0;
  const uncertain = report?.checks.filter(check => check.status === "unknown").length ?? 0;
  const found = report?.checks.filter(check => check.status === "found").length ?? 0;
  const summaryTitle = attention ? (attention === 1 ? "1 item to review" : attention + " items to review") : uncertain ? "Some checks are unavailable" : "No obvious record issues";
  const summaryText = found + " records found" + (uncertain ? " · " + uncertain + " unavailable" : "") + ". Results show published DNS only.";

  return (
    <div className="space-y-6">
      <section aria-label="Check your email domain" className="email-check-surface rounded-[28px] px-5 py-6 sm:px-8 sm:py-8">
        <form onSubmit={submit} className="mx-auto max-w-lg" aria-busy={busy === "domain"}>
          <label htmlFor="email-dns-domain" className="block text-[15px] font-semibold tracking-tight">Enter your domain</label>
          <div className="relative mt-2.5">
            <Globe size={20} aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input id="email-dns-domain" inputMode="url" autoCapitalize="none" spellCheck={false} autoComplete="off" maxLength={500} required value={domain} onChange={event => {
              setDomain(event.target.value); setError(""); setReport(null); setShowSelector(false); setCopyStatus("");
            }} placeholder="yourbusiness.com" className={inputClass + " pl-12"} disabled={!!busy} aria-invalid={!!error} aria-describedby="email-dns-domain-help" />
          </div>
          <p id="email-dns-domain-help" className="mt-2 text-[13px] leading-relaxed text-muted-foreground">Use the part after @ in your business email.</p>
          {error && <p role="alert" className="mt-3 text-sm text-red-700 dark:text-red-300">{error}</p>}
          <Button type="submit" disabled={!!busy} className="mt-5 h-12 w-full rounded-full text-base font-semibold">
            {busy === "domain" && <Loader2 size={17} className="mr-2 motion-safe:animate-spin" aria-hidden="true" />}
            {busy === "domain" ? "Checking…" : "Check email"}
          </Button>
          <p role="status" className="mt-3 text-center text-[13px] text-muted-foreground">{busy === "domain" ? "Looking up public DNS records" : "Free. No sign-up required."}</p>
          <noscript><p className="mt-3 text-sm text-muted-foreground">Enable JavaScript to run the checker.</p></noscript>
        </form>
      </section>

      {report && <section aria-labelledby="email-result-title" className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="break-all text-sm text-muted-foreground">{report.domain}</p>
            <h2 ref={resultHeading} id="email-result-title" tabIndex={-1} className="mt-1 text-2xl font-semibold tracking-tight outline-none">{summaryTitle}</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{summaryText}</p>
          </div>
          <button type="button" onClick={copyReport} className={linkClass + " inline-flex items-center gap-1.5"}><Clipboard size={15} aria-hidden="true" />{copyStatus === "Copied" ? "Copied" : "Copy report"}</button>
        </div>
        <ul className="email-check-surface divide-y divide-border/70 rounded-[24px] px-4 sm:px-5">
          {report.checks.map(check => {
            const Icon = check.status === "found" ? CheckCircle2 : check.status === "review" ? AlertCircle : CircleHelp;
            const tone = check.status === "found" ? "text-emerald-700 dark:text-emerald-400" : check.status === "review" ? "text-amber-800 dark:text-amber-300" : "text-muted-foreground";
            return (
              <li key={check.key} className="py-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <Icon size={22} className={tone + " shrink-0"} aria-hidden="true" />
                    <div className="min-w-0">
                      <p className="text-[16px] font-semibold leading-snug tracking-tight">{names[check.key][0]}</p>
                      <p className="mt-0.5 text-[13px] text-muted-foreground">{names[check.key][1]}</p>
                    </div>
                  </div>
                  <span className={"max-w-[44%] text-right text-[13px] font-medium leading-snug " + tone}>{statusText(check)}</span>
                </div>
                {check.status === "review" && !showDetails && <p className="ml-[34px] mt-2 text-sm leading-relaxed text-muted-foreground">{check.detail}</p>}
                {showDetails && <div className="ml-[34px] mt-2 space-y-2">
                  <p className="text-sm leading-relaxed text-muted-foreground">{check.detail}</p>
                  {check.records.map((record, i) => <code key={i} className="block whitespace-pre-wrap break-all rounded-lg bg-background p-2 text-xs">{record}</code>)}
                </div>}
                {check.key === "dkim" && <>
                  {report.selector && <p className="ml-[34px] mt-2 break-all text-xs text-muted-foreground">Selector: {report.selector}</p>}
                  <button type="button" disabled={!!busy} aria-expanded={showSelector} aria-controls="email-dkim-field" onClick={() => {
                    setShowSelector(v => !v); setDkimError(""); setSelector(report.selector);
                  }} className={linkClass + " ml-[34px] inline-flex items-center gap-1.5"}>
                    {showSelector ? <X size={14} aria-hidden="true" /> : <Plus size={14} aria-hidden="true" />}{showSelector ? "Close" : report.selector ? "Change selector" : "Check DKIM"}
                  </button>
                  {showSelector && <form id="email-dkim-field" onSubmit={submitDkim} className="space-y-2 pb-1" aria-busy={busy === "dkim"}>
                    <label htmlFor="email-dns-selector" className="block text-sm font-medium">DKIM selector</label>
                    <input ref={selectorField} id="email-dns-selector" autoComplete="off" autoCapitalize="none" spellCheck={false} maxLength={190} value={selector} onChange={event => { setSelector(event.target.value); setDkimError(""); }} placeholder="e.g. selector1" className={inputClass} disabled={!!busy} required aria-describedby="email-dkim-hint" />
                    <p id="email-dkim-hint" className="text-[13px] leading-relaxed text-muted-foreground">Find this in your email provider. Use the exact signing domain.</p>
                    {dkimError && <p role="alert" className="text-sm text-red-700 dark:text-red-300">{dkimError}</p>}
                    <Button type="submit" disabled={!!busy} className="h-11 rounded-full px-5">{busy === "dkim" ? "Checking…" : "Check DKIM"}</Button>
                  </form>}
                </>}
              </li>
            );
          })}
        </ul>
        <div className="flex flex-wrap items-center justify-between gap-x-3">
          <p className="text-[13px] text-muted-foreground">DNS check, not a delivery test.</p>
          <button type="button" aria-expanded={showDetails} onClick={() => setShowDetails(v => !v)} className={linkClass}>{showDetails ? "Hide record details" : "View record details"}</button>
        </div>
        <p role="status" className="text-sm text-muted-foreground empty:hidden">{copyStatus}</p>
      </section>}

      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b pb-4">
        <p className="text-[15px] font-medium">{report ? "Need help with these results?" : "Still having email problems?"}</p>
        <button type="button" aria-expanded={showHelp} aria-controls="email-check-help" onClick={() => setShowHelp(v => !v)} className={linkClass}>{showHelp ? "Close enquiry" : "Get help"}</button>
      </div>
      <div id="email-check-help" hidden={!showHelp} ref={helpRegion} tabIndex={-1} className="outline-none">
        {showHelp && <NoteContactCTA title="Need help with your email?" description="Share the problem or paste your DNS report." context="Business email DNS checker" starters={[
          { label: "Emails not arriving", message: "My business emails are not reaching customers or our inbox." },
          { label: "Gmail rejection", message: "Gmail is rejecting messages from my business email domain." },
          { label: "DNS record help", message: "I need help understanding the email DNS records shown in the checker." },
        ]} />}
      </div>
      <noscript><a href="https://www.linkedin.com/in/mianhamza" className="text-sm underline underline-offset-4">Contact me on LinkedIn</a></noscript>
    </div>
  );
}
