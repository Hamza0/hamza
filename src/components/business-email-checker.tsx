"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { AlertCircle, CheckCircle2, CircleHelp, Clipboard, Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { checkEmailDns, normalizeDomain, normalizeSelector, type EmailCheck } from "@/lib/email-dns.mjs";

type Report = { domain: string; selector: string; checkedAt: string; checks: EmailCheck[] };
const field = "mt-1.5 block w-full rounded-xl border bg-background px-3 py-3 text-base focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring disabled:opacity-60";

export function BusinessEmailChecker() {
  const [domain, setDomain] = useState("");
  const [selector, setSelector] = useState("");
  const [report, setReport] = useState<Report | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [copyStatus, setCopyStatus] = useState("");
  const request = useRef<AbortController | null>(null);
  const resultHeading = useRef<HTMLHeadingElement>(null);
  useEffect(() => () => { request.current?.abort(); request.current = null; }, []);
  useEffect(() => { if (report) resultHeading.current?.focus(); }, [report]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (request.current) return;
    const host = normalizeDomain(domain);
    if (!host) { setError("Enter a public domain, such as example.com, without https:// or an email address."); setReport(null); return; }
    const key = normalizeSelector(selector, host);
    if (key === null) { setError("Enter the DKIM selector from your email provider, such as google or selector1, or leave it blank."); setReport(null); return; }
    const controller = new AbortController();
    request.current = controller;
    setBusy(true); setError(""); setReport(null); setCopyStatus("");
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
    <section aria-label="Business email DNS checker" className="note-enquiry rounded-[1.5rem] border p-3 sm:p-4">
      <div className="px-2 pb-3 pt-1 text-sm font-medium">Check your domain</div>
      <div className="note-enquiry-inner rounded-2xl border p-4 sm:p-6">
        <form onSubmit={submit} className="space-y-4" aria-busy={busy}>
          <div>
            <label htmlFor="email-dns-domain" className="block text-sm font-medium">Domain name</label>
            <input id="email-dns-domain" type="text" inputMode="url" autoCapitalize="none" spellCheck={false} autoComplete="off" maxLength={253} required value={domain} onChange={event => { setDomain(event.target.value); setError(""); setReport(null); }} placeholder="yourbusiness.com" className={field} disabled={busy} aria-describedby="email-dns-domain-help" />
            <p id="email-dns-domain-help" className="mt-2 text-xs text-muted-foreground">For hello@example.com, enter example.com. Use the exact sending domain or subdomain.</p>
          </div>
          <details className="rounded-xl border px-3 py-3">
            <summary className="cursor-pointer text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring">DKIM selector (optional)</summary>
            <label htmlFor="email-dns-selector" className="mt-3 block text-xs text-muted-foreground">Selector from your email provider</label>
            <input id="email-dns-selector" autoComplete="off" autoCapitalize="none" spellCheck={false} maxLength={190} value={selector} onChange={event => { setSelector(event.target.value); setReport(null); setError(""); }} placeholder="e.g. google" className={field} disabled={busy} />
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">Leave blank if you don&apos;t know it. For DKIM, use the signing domain shown in the message header.</p>
          </details>
          <p role="alert" className="text-sm text-destructive empty:hidden">{error}</p>
          <Button type="submit" disabled={busy} className="h-11 w-full gap-2 rounded-full">
            {busy ? <Loader2 size={16} aria-hidden="true" className="motion-safe:animate-spin" /> : <Search size={16} aria-hidden="true" />}
            {busy ? "Checking records…" : "Check email records"}
          </Button>
          <p role="status" className="text-xs leading-relaxed text-muted-foreground">{busy ? "Looking up the public MX and TXT records." : "Free to use. No email address required. Lookups go directly to Google Public DNS."}</p>
          <noscript><p className="text-sm text-muted-foreground">Enable JavaScript to run the checker. The guide below is available without JavaScript.</p></noscript>
        </form>
        {report && (
          <div className="mt-6 space-y-4 border-t pt-5">
            <div>
              <h2 ref={resultHeading} tabIndex={-1} className="text-lg font-semibold tracking-tight outline-none">Your DNS report</h2>
              <p className="mt-1 break-all text-sm text-muted-foreground">{report.domain}{report.selector ? " · DKIM selector: " + report.selector : ""}</p>
              <p className="mt-1 text-xs text-muted-foreground"><time dateTime={report.checkedAt}>{new Date(report.checkedAt).toLocaleString()}</time> · Public DNS snapshot</p>
            </div>
            <ul className="divide-y divide-border overflow-hidden rounded-xl border">
              {report.checks.map(check => {
                const Icon = check.status === "found" ? CheckCircle2 : check.status === "review" ? AlertCircle : CircleHelp;
                const tone = check.status === "found" ? "text-emerald-700 dark:text-emerald-400" : check.status === "review" ? "text-amber-800 dark:text-amber-400" : "text-muted-foreground";
                return (
                  <li key={check.key} className="space-y-2 p-3 sm:p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="flex items-center gap-2 text-sm font-semibold"><Icon size={17} className={tone} aria-hidden="true" />{check.title}</span>
                      <span className={"text-xs font-medium " + tone}>{check.label}</span>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">{check.detail}</p>
                    {check.records.length > 0 && <details className="text-xs">
                      <summary className="cursor-pointer font-medium underline underline-offset-2">View published records</summary>
                      <div className="mt-2 space-y-2">{check.records.map((record, i) => <code key={i} className="block whitespace-pre-wrap break-all rounded-md bg-muted p-2">{record}</code>)}</div>
                    </details>}
                  </li>
                );
              })}
            </ul>
            <p className="text-xs leading-relaxed text-muted-foreground">A record found here is not proof of successful email delivery. This check does not send mail, validate a mailbox, or verify a real message&apos;s authentication.</p>
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" className="h-10 gap-2 rounded-full shadow-none" onClick={copyReport}><Clipboard size={14} aria-hidden="true"/>Copy summary</Button>
              <Button asChild className="h-10 rounded-full"><a href="#get-help">Ask me about these results</a></Button>
            </div>
            <p role="status" className="text-xs text-muted-foreground empty:hidden">{copyStatus}</p>
          </div>
        )}
      </div>
    </section>
  );
}
