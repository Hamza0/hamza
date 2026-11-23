"use client";

import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";
import {
  BUSINESS_PROFILE_ISSUES, BUSINESS_PROFILE_LIMITS, EMPTY_BUSINESS_PROFILE,
  createBusinessProfileDetails, validateBusinessProfileStep,
  type BusinessProfileError, type BusinessProfileValues,
} from "@/lib/business-profile-inquiry";
import { CONTACT_LIMITS } from "@/lib/contact/schema";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import Script from "next/script";
import { useEffect, useRef, useState, type FormEvent } from "react";

const LINKEDIN = "https://www.linkedin.com/in/mianhamza";
const QUESTIONS = [
  "What do you need help with?", "Which business is this for?", "What's happening with your profile?",
  "What should I call you?", "Where can I reply?", "Ready to send?",
];
const HINTS = [
  "Choose the closest option. We'll take it from there.",
  "Your business name is enough to start. A profile link helps if you have it.",
  "A few lines about the issue and when you noticed it. You can mention how it affects customers too.",
  "Just your name is fine.", "I'll use this email to respond to your enquiry.",
  "Check your details below. You can go back and change anything before sending.",
];
const inputClass = "mt-2 w-full rounded-none border-0 border-b border-foreground/25 bg-transparent px-0 py-3 text-xl tracking-tight outline-none transition-colors placeholder:text-muted-foreground/55 focus:border-[#2d4fe1] disabled:opacity-70 sm:text-2xl";
const issueEntries = Object.entries(BUSINESS_PROFILE_ISSUES);

export function BusinessProfileInquiry({ available }: { available: boolean }) {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<BusinessProfileValues>(EMPTY_BUSINESS_PROFILE);
  const [error, setError] = useState<BusinessProfileError | null>(null);
  const [exiting, setExiting] = useState(false);
  const [token, setToken] = useState("");
  const [scriptReady, setScriptReady] = useState(false);
  const [verificationError, setVerificationError] = useState(false);
  const [sending, setSending] = useState(false);
  const [retryLocked, setRetryLocked] = useState(false);
  const [success, setSuccess] = useState(false);
  const [status, setStatus] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const heading = useRef<HTMLHeadingElement>(null);
  const successHeading = useRef<HTMLHeadingElement>(null);
  const challenge = useRef<HTMLDivElement>(null);
  const widget = useRef<string | undefined>(undefined);
  const autoAdvance = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const transition = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const navigating = useRef(false);
  const busy = useRef(false);
  const mounted = useRef(true);
  const started = useRef(false);
  const focusStep = useRef(false);
  const currentStep = useRef(0);
  const activeRequest = useRef<AbortController | undefined>(undefined);
  const attempt = useRef({ id: "", payload: "", uncertain: false });
  const review = createBusinessProfileDetails(values);
  const locked = sending || retryLocked;
  const progress = Math.round((step / 5) * 100);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      clearTimeout(autoAdvance.current);
      clearTimeout(transition.current);
      activeRequest.current?.abort();
    };
  }, []);

  useEffect(() => {
    if (focusStep.current) { heading.current?.focus(); focusStep.current = false; }
  }, [step]);
  useEffect(() => { if (success) successHeading.current?.focus(); }, [success]);

  useEffect(() => {
    if (!cooldown) return;
    const timer = setInterval(() => setCooldown(value => Math.max(0, value - 1)), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  useEffect(() => {
    if (!available || step !== 5 || success || !scriptReady || !challenge.current || !window.turnstile) return;
    let active = true;
    try {
      widget.current = window.turnstile.render(challenge.current, {
        sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!, action: "portfolio_contact", theme: "auto",
        callback: value => { if (active) { setToken(value); setVerificationError(false); } },
        "expired-callback": () => { if (active) { setToken(""); setStatus("Verification expired. Please verify again before sending."); } },
        "error-callback": () => { if (active) { setToken(""); setVerificationError(true); } },
      });
    } catch { setVerificationError(true); }
    return () => {
      active = false;
      if (widget.current) window.turnstile?.remove(widget.current);
      widget.current = undefined;
      if (mounted.current) setToken("");
    };
  }, [available, step, scriptReady, success]);

  function markStarted() {
    if (!started.current) {
      started.current = true;
      trackEvent("contact_open", { location: "business_profile", category: "business_profile" });
    }
  }
  function update(field: keyof BusinessProfileValues, value: string) {
    if (locked || navigating.current) return;
    markStarted();
    setValues(previous => ({ ...previous, [field]: value }));
    if (error?.field === field) setError(null);
    setStatus("");
  }
  function navigate(target: number) {
    if (busy.current || retryLocked || navigating.current || target === currentStep.current) return;
    clearTimeout(autoAdvance.current);
    autoAdvance.current = undefined;
    setError(null);
    setStatus("");
    focusStep.current = true;
    const enter = () => {
      if (!mounted.current) return;
      currentStep.current = target;
      setStep(target);
      setExiting(false);
      navigating.current = false;
      transition.current = undefined;
    };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) enter();
    else {
      navigating.current = true;
      setExiting(true);
      transition.current = setTimeout(enter, 210);
    }
  }
  function chooseIssue(issue: string, advance = false) {
    if (locked || navigating.current) return;
    update("issue", issue);
    if (!advance) return;
    clearTimeout(autoAdvance.current);
    autoAdvance.current = setTimeout(() => {
      if (currentStep.current === 0) navigate(1);
    }, window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 180);
  }
  function showError(nextError: BusinessProfileError) {
    setError(nextError);
    document.getElementById(`gbp-${nextError.field}`)?.focus();
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current || navigating.current || success) return;
    clearTimeout(autoAdvance.current);
    if (step < 5) {
      const nextError = validateBusinessProfileStep(values, step);
      if (nextError) showError(nextError);
      else navigate(step + 1);
      return;
    }
    if (!available || cooldown) return;
    if (!token) { setStatus("Complete the verification below before sending."); return; }
    const details = createBusinessProfileDetails(values);
    if (!details) { setStatus("Please go back and check your details before sending."); return; }
    const payload = JSON.stringify(details);
    if (attempt.current.uncertain && payload !== attempt.current.payload) {
      setStatus("The earlier attempt may still be processing. Retry with the same details to avoid a duplicate enquiry.");
      return;
    }
    const age = attempt.current.id ? Date.now() - Number(attempt.current.id.split(".")[0]) : 0;
    if (attempt.current.uncertain && age > 23 * 3600000) {
      setStatus("This attempt has expired. Please message me on LinkedIn so I can check whether it arrived.");
      return;
    }
    if (!attempt.current.id || payload !== attempt.current.payload || age > 23 * 3600000) {
      attempt.current = { id: `${Date.now()}.${crypto.randomUUID()}`, payload, uncertain: false };
    }
    const wasUncertain = attempt.current.uncertain;
    attempt.current.uncertain = true;
    busy.current = true;
    setSending(true);
    setRetryLocked(true);
    setStatus("Sending your enquiry...");
    const controller = new AbortController();
    activeRequest.current = controller;
    const timeout = setTimeout(() => controller.abort(), 30000);
    try {
      const response = await fetch("/api/contact", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...details, website: values.website, token, submissionId: attempt.current.id }),
        signal: controller.signal,
      });
      const body = await response.json().catch(() => ({})) as { code?: string };
      if (!mounted.current) return;
      if (response.ok && body.code === "accepted") {
        setSuccess(true);
        setStatus("");
        trackEvent("contact_submit_success", { category: "business_profile" });
      } else {
        if (!wasUncertain && [400, 403, 413, 429].includes(response.status)) {
          attempt.current.uncertain = false;
          setRetryLocked(false);
        }
        if (response.status === 429) {
          setCooldown(Math.max(1, Math.min(3600, Number(response.headers.get("Retry-After")) || 600)));
          setStatus("Too many attempts. Please wait before trying again, or message me on LinkedIn.");
        } else if (body.code === "verification") setStatus("Verification expired or could not be confirmed. Please verify again and retry.");
        else if (body.code === "validation") setStatus("Please check your details. If your description is long, try shortening it before sending again.");
        else if (body.code === "pending") {
          setCooldown(Math.max(1, Math.min(60, Number(response.headers.get("Retry-After")) || 5)));
          setStatus("Your earlier attempt is still processing. Verify again and retry with the same details.");
        } else if (body.code === "conflict") setStatus("An earlier attempt may already have arrived. Please message me on LinkedIn before starting another enquiry.");
        else setStatus("I couldn't confirm sending. Your details are kept here. Verify again and retry, or message me on LinkedIn.");
        trackEvent("contact_submit_error", { category: "business_profile" });
      }
    } catch {
      if (mounted.current) {
        setStatus("I couldn't confirm sending. Your details are kept here. Verify again and retry with the same details to avoid duplicates.");
        trackEvent("contact_submit_error", { category: "business_profile" });
      }
    } finally {
      clearTimeout(timeout);
      activeRequest.current = undefined;
      busy.current = false;
      if (mounted.current) {
        setSending(false);
        setToken("");
        if (widget.current) window.turnstile?.reset(widget.current);
      }
    }
  }

  const fieldError = (field: keyof BusinessProfileValues) => error?.field === field ? (
    <p id={`gbp-${field}-error`} role="alert" className="mt-3 text-sm text-red-700 dark:text-red-400">{error.message}</p>
  ) : null;
  const fieldAria = (field: keyof BusinessProfileValues) => ({
    "aria-invalid": error?.field === field || undefined,
    "aria-describedby": error?.field === field ? `gbp-${field}-error` : undefined,
  });

  if (!available) return (
    <section id="enquiry" className="rounded-2xl border bg-background p-6 sm:p-8">
      <h2 className="text-2xl font-semibold tracking-tight">Tell me about your profile.</h2>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">Message me on LinkedIn with your business name and a short description of the address or location issue.</p>
      <Button asChild className="mt-6"><a href={LINKEDIN}>Message Hamza on LinkedIn <ArrowRight className="ml-2 size-4" aria-hidden="true" /></a></Button>
    </section>
  );

  return (
    <section id="enquiry" aria-label="Business profile enquiry" className="scroll-mt-8 rounded-2xl border border-border/80 bg-background p-5 sm:p-8">
      {success ? (
        <div className="inquiry-panel py-8 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted" aria-hidden="true"><Check className="size-6" /></div>
          <h2 ref={successHeading} tabIndex={-1} className="mt-5 text-2xl font-semibold tracking-tight outline-none">Your enquiry has been sent.</h2>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-muted-foreground">Thanks for sharing the details. I&apos;ll review your message and reply by email.</p>
          <Link href="/" className="mt-7 inline-block text-sm underline underline-offset-4">Back to my portfolio</Link>
        </div>
      ) : (
        <form onSubmit={submit} noValidate aria-busy={sending}>
          <div className="mb-6 flex items-center justify-between text-xs text-muted-foreground">
            <span>Google Business Profile</span>
            <span>{step < 5 ? `${step + 1} of 5` : "Review"}</span>
          </div>
          <div key={step} className={`inquiry-panel ${exiting ? "inquiry-panel-exit" : ""}`}>
            <h2 id="gbp-question-heading" ref={heading} tabIndex={-1} className="text-2xl font-semibold tracking-tight outline-none sm:text-3xl">{QUESTIONS[step]}</h2>
            <p className="mt-3 max-w-lg text-sm leading-6 text-muted-foreground">{retryLocked && step === 5 ? "Your details are held unchanged so you can safely retry this enquiry." : HINTS[step]}</p>
            <fieldset disabled={locked || exiting} className="mt-7 min-w-0 border-0 p-0">
              <legend className="sr-only">{QUESTIONS[step]}</legend>
              {step === 0 && (
                <div id="gbp-issue" tabIndex={-1} className="space-y-2.5 outline-none" onKeyDown={() => { clearTimeout(autoAdvance.current); autoAdvance.current = undefined; }} {...fieldAria("issue")}>
                  {issueEntries.map(([value, label], index) => (
                    <label key={value} onClick={event => { if (event.detail > 0) chooseIssue(value, true); }} className={`inquiry-choice flex min-h-[60px] cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm leading-5 focus-within:ring-2 focus-within:ring-[#2d4fe1] focus-within:ring-offset-2 focus-within:ring-offset-background ${values.issue === value ? "border-[#2d4fe1] bg-[#2d4fe1] text-white" : "border-border bg-background hover:bg-muted/50"}`}>
                      <input type="radio" name="issue" value={value} checked={values.issue === value} onChange={() => chooseIssue(value)} className="sr-only" />
                      <span className={`flex size-6 shrink-0 items-center justify-center rounded-md border text-xs ${values.issue === value ? "border-white/40" : "border-border text-muted-foreground"}`} aria-hidden="true">{String.fromCharCode(65 + index)}</span>
                      <span className="flex-1">{label}</span>
                      {values.issue === value && <Check className="size-4 shrink-0" aria-hidden="true" />}
                    </label>
                  ))}
                  {fieldError("issue")}
                </div>
              )}
              {step === 1 && (
                <div className="space-y-6">
                  <div><label htmlFor="gbp-businessName" className="text-sm font-medium">Business name</label><input id="gbp-businessName" name="businessName" autoComplete="organization" value={values.businessName} onChange={event => update("businessName", event.target.value)} maxLength={CONTACT_LIMITS.context} placeholder="Your business name" required className={inputClass} {...fieldAria("businessName")} />{fieldError("businessName")}</div>
                  <div><label htmlFor="gbp-profileUrl" className="text-sm font-medium">Profile link <span className="font-normal text-muted-foreground">(optional)</span></label><input id="gbp-profileUrl" name="profileUrl" type="url" inputMode="url" autoComplete="off" autoCapitalize="off" spellCheck={false} value={values.profileUrl} onChange={event => update("profileUrl", event.target.value)} maxLength={BUSINESS_PROFILE_LIMITS.profileUrl} placeholder="https://maps.app.goo.gl/..." className={`${inputClass} !text-base`} {...fieldAria("profileUrl")} />{fieldError("profileUrl")}</div>
                </div>
              )}
              {step === 2 && (
                <div><label htmlFor="gbp-details" className="sr-only">Describe the issue</label><textarea id="gbp-details" name="details" value={values.details} onChange={event => update("details", event.target.value)} minLength={CONTACT_LIMITS.messageMin} maxLength={BUSINESS_PROFILE_LIMITS.details} rows={5} required placeholder="For example, I updated our address last week, but customers still see the old location..." className="w-full resize-y rounded-xl border border-border bg-muted/20 p-4 text-base leading-7 outline-none transition-colors placeholder:text-muted-foreground/65 focus:border-[#2d4fe1]" {...fieldAria("details")} />{fieldError("details")}<p className="mt-2 text-right text-xs tabular-nums text-muted-foreground">{values.details.length.toLocaleString()} / 2,000</p></div>
              )}
              {step === 3 && (
                <div><label htmlFor="gbp-name" className="sr-only">Your name</label><input id="gbp-name" name="name" autoComplete="name" value={values.name} onChange={event => update("name", event.target.value)} maxLength={CONTACT_LIMITS.name} placeholder="Your name" required className={inputClass} {...fieldAria("name")} />{fieldError("name")}</div>
              )}
              {step === 4 && (
                <div><label htmlFor="gbp-email" className="sr-only">Your email address</label><input id="gbp-email" name="email" type="email" inputMode="email" autoComplete="email" autoCapitalize="off" spellCheck={false} value={values.email} onChange={event => update("email", event.target.value)} maxLength={CONTACT_LIMITS.email} placeholder="you@example.com" required className={inputClass} {...fieldAria("email")} />{fieldError("email")}</div>
              )}
              {step === 5 && review && (
                <dl className="space-y-5 rounded-xl border border-border bg-muted/20 p-4 text-sm sm:p-5">
                  <div><dt className="text-xs text-muted-foreground">Business</dt><dd className="mt-1 break-words font-medium">{review.context}</dd></div>
                  <div><dt className="text-xs text-muted-foreground">Reply to</dt><dd className="mt-1 break-words">{review.name}<br />{review.email}</dd></div>
                  <div><dt className="text-xs text-muted-foreground">Your enquiry</dt><dd className="mt-2 whitespace-pre-wrap break-words leading-6">{review.message}</dd></div>
                </dl>
              )}
            </fieldset>
          </div>
          <div hidden aria-hidden="true"><label htmlFor="gbp-website">Leave this empty</label><input id="gbp-website" name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={event => setValues(previous => ({ ...previous, website: event.target.value }))} /></div>
          {step === 5 && <div className="mt-6">
            <Script id="contact-turnstile" src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" strategy="afterInteractive" onLoad={() => { setScriptReady(true); setVerificationError(false); }} onReady={() => { setScriptReady(true); setVerificationError(false); }} onError={() => setVerificationError(true)} />
            <div ref={challenge} aria-label="Spam verification" />
            {verificationError ? <p role="alert" className="mt-2 text-sm">Verification couldn&apos;t load. Please retry later or <a href={LINKEDIN} className="underline underline-offset-4">message me on LinkedIn</a>.</p> : !token && <p className="mt-2 text-xs text-muted-foreground">Complete the verification to send your enquiry.</p>}
          </div>}
          <p role="status" aria-live="polite" aria-atomic="true" className="mt-4 text-sm leading-6 empty:hidden">{status}</p>
          {cooldown > 0 && <p aria-live="off" className="mt-2 text-xs text-muted-foreground">Try again in {cooldown}s.</p>}
          <div className="mt-8 border-t border-border/70 pt-5">
            <div role="progressbar" aria-label="Enquiry progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress} aria-valuetext={step < 5 ? `Question ${step + 1} of 5` : "Review and send"} className="mb-5 h-1.5 overflow-hidden rounded-full bg-muted"><div className="inquiry-progress h-full origin-left rounded-full bg-[#2d4fe1]" style={{ transform: `scaleX(${progress / 100})` }} /></div>
            <div className="flex items-center justify-between gap-3">
              <Button type="button" variant="ghost" disabled={step === 0 || locked || exiting} onClick={() => navigate(step - 1)} className="-ml-2"><ArrowLeft className="mr-2 size-4" aria-hidden="true" />Back</Button>
              <Button type="submit" disabled={sending || exiting || (step === 5 && (!token || cooldown > 0))} className="min-w-32 rounded-lg bg-[#2d4fe1] px-5 text-white hover:bg-[#203dbb]">{sending ? "Sending..." : step === 5 ? retryLocked ? "Retry enquiry" : "Send enquiry" : "Continue"}{!sending && <ArrowRight className="ml-2 size-4" aria-hidden="true" />}</Button>
            </div>
          </div>
          {step === 5 && <p className="mt-5 text-xs leading-5 text-muted-foreground">Your details are used to respond to this enquiry. <Link href="/privacy" className="underline underline-offset-4">Privacy</Link>. Prefer another route? <a href={LINKEDIN} className="underline underline-offset-4">Message me on LinkedIn</a>.</p>}
        </form>
      )}
      <style jsx>{`
        .inquiry-panel { min-height: 250px; animation: inquiry-enter 380ms cubic-bezier(.2,.7,.3,1) both; }
        .inquiry-panel-exit { animation: inquiry-exit 210ms ease-in both; pointer-events: none; }
        .inquiry-choice { transition: background-color 180ms ease, border-color 180ms ease, color 180ms ease; }
        .inquiry-progress { transition: transform 500ms ease; }
        @keyframes inquiry-enter { from { opacity: 0; transform: translateY(9px); filter: blur(2px); } to { opacity: 1; transform: translateY(0); filter: none; } }
        @keyframes inquiry-exit { from { opacity: 1; transform: translateY(0); filter: none; } to { opacity: 0; transform: translateY(-6px); filter: blur(2px); } }
        @media (prefers-reduced-motion: reduce) { .inquiry-panel, .inquiry-panel-exit { animation: none; } .inquiry-choice, .inquiry-progress { transition: none; } }
      `}</style>
    </section>
  );
}
