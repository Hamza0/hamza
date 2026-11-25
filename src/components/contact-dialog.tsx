"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";
import { CONTACT_CATEGORIES, CONTACT_LIMITS, parseContactDetails, type ContactCategory } from "@/lib/contact/schema";
import { Check, Plus, X } from "lucide-react";
import type { NoteStarter } from "@/lib/note-helpers";
import { hasNoteStarter, toggleNoteStarter } from "@/lib/contact/note-starters";
import Script from "next/script";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (element: HTMLElement, options: { sitekey: string; action: string; theme: string; callback: (token: string) => void; "expired-callback": () => void; "error-callback": () => void }) => string;
      remove: (id: string) => void;
      reset: (id: string) => void;
    };
  }
}
const OPTIONS = Object.keys(CONTACT_CATEGORIES) as ContactCategory[];
const EMPTY = { name: "", email: "", context: "", message: "", website: "" };
const fieldClass = "mt-1 w-full rounded-md border bg-background px-3 py-2 text-base focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring";

type InlineContact = { title: string; description: string; context: string; starters?: readonly NoteStarter[] };

export default function ContactDialog({ open, onOpenChange, restoreFocus, inline }: { open: boolean; onOpenChange: (value: boolean) => void; restoreFocus: () => void; inline?: InlineContact }) {
  const isInline = Boolean(inline);
  const uniqueId = useId();
  const fieldId = isInline ? `note-contact-${uniqueId}` : "contact";
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [category, setCategory] = useState<ContactCategory | "">(isInline ? "project" : "");
  // The existing mail contract requires a name; mark it as absent instead of collecting one.
  const [fields, setFields] = useState(() => ({ ...EMPTY, name: isInline ? "Not provided" : "", context: inline?.context.slice(0, CONTACT_LIMITS.context) ?? "" }));
  const [token, setToken] = useState("");
  const [scriptReady, setScriptReady] = useState(false);
  const [verificationError, setVerificationError] = useState(false);
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [viewport, setViewport] = useState<{ height: number; top: number } | null>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const challenge = useRef<HTMLDivElement>(null);
  const widget = useRef<string | undefined>(undefined);
  const attempt = useRef({ id: "", payload: "", uncertain: false });
  const busy = useRef(false);
  const activeRequest = useRef<AbortController | undefined>(undefined);
  const wasOpen = useRef(false);
  const inlineNavigated = useRef(false);
  const selected = category ? CONTACT_CATEGORIES[category] : null;

  useEffect(() => {
    if (open && !wasOpen.current && success) {
      setSuccess(false); setStep(1); setCategory(""); setFields(EMPTY); setStatus("");
      attempt.current = { id: "", payload: "", uncertain: false };
    }
    wasOpen.current = open;
  }, [open, success]);

  useEffect(() => {
    if (!open || (isInline && !success && !inlineNavigated.current)) return;
    inlineNavigated.current = false;
    title.current?.focus({ preventScroll: true });
  }, [open, step, success, isInline]);
  useEffect(() => () => activeRequest.current?.abort(), []);
  useEffect(() => {
    if (!open || isInline) return;
    const view = window.visualViewport;
    const update = () => setViewport({ height: view?.height ?? window.innerHeight, top: view?.offsetTop ?? 0 });
    update();
    view?.addEventListener("resize", update);
    view?.addEventListener("scroll", update);
    window.addEventListener("resize", update);
    return () => { view?.removeEventListener("resize", update); view?.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, [open, isInline]);
  const verificationActive = open && step === 2 && (!isInline || started);
  useEffect(() => {
    if (!verificationActive || !scriptReady || success || !challenge.current || !window.turnstile) return;
    try {
      widget.current = window.turnstile.render(challenge.current, {
        sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!, action: "portfolio_contact", theme: "auto",
        callback: value => { setToken(value); setVerificationError(false); },
        "expired-callback": () => { setToken(""); setStatus("Verification expired. Please verify again."); },
        "error-callback": () => { setToken(""); setVerificationError(true); },
      });
    } catch { setVerificationError(true); }
    return () => { if (widget.current) window.turnstile?.remove(widget.current); widget.current = undefined; setToken(""); };
  }, [verificationActive, scriptReady, success]);
  useEffect(() => {
    if (!cooldown) return;
    const timer = setInterval(() => setCooldown(value => Math.max(0, value - 1)), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy.current || !category || !token || cooldown || (isInline && step !== 2)) return;
    const details = parseContactDetails({ ...fields, category });
    if (!details) { setStatus("Please check the required fields and message (10–3,000 characters)."); return; }
    busy.current = true;
    setSending(true);
    setStatus("Sending your message…");
    const payload = JSON.stringify(details);
    if (attempt.current.uncertain && payload !== attempt.current.payload) {
      setStatus("The previous attempt may still be processing. Retry with the same details to avoid a duplicate message.");
      setSending(false); busy.current = false; return;
    }
    if (!attempt.current.id || payload !== attempt.current.payload) attempt.current = { id: `${Date.now()}.${crypto.randomUUID()}`, payload, uncertain: false };
    const wasUncertain = attempt.current.uncertain;
    attempt.current.uncertain = true;
    const controller = new AbortController();
    activeRequest.current = controller;
    const timeout = setTimeout(() => controller.abort(), 30000);
    try {
      const r = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...details, website: fields.website, token, submissionId: attempt.current.id }), signal: controller.signal });
      const data = await r.json().catch(() => ({})) as { code?: string };
      if (r.ok && data.code === "accepted") {
        setSuccess(true);
        setStatus("");
        trackEvent("contact_submit_success", { category });
      } else {
        if (!wasUncertain && [400, 403, 413, 429].includes(r.status)) attempt.current.uncertain = false;
        if (r.status === 429) {
          setCooldown(Math.max(1, Math.min(3600, Number(r.headers.get("Retry-After")) || 600)));
          setStatus("Too many attempts. Please wait before trying again, or reach me on LinkedIn.");
        } else if (data.code === "verification") setStatus("Verification was invalid or expired. Please verify again and retry.");
        else if (data.code === "validation") setStatus("Please check the required fields and message (10–3,000 characters).");
        else if (data.code === "pending") setStatus("Your previous attempt is still processing. Verify again and retry with the same details.");
        else setStatus("The sending service is unavailable. Your details are saved here; verify again and retry, or use LinkedIn.");
        trackEvent("contact_submit_error", { category });
      }
    } catch {
      setStatus("Unable to confirm sending. Your details are saved here; verify again and retry with the same details to avoid duplicates.");
      trackEvent("contact_submit_error", { category });
    } finally {
      clearTimeout(timeout);
      setToken("");
      if (widget.current) window.turnstile?.reset(widget.current);
      busy.current = false;
      setSending(false);
    }
  };

  function continueInline(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (fields.message.trim().length < CONTACT_LIMITS.messageMin) {
      setStatus("Tell me a little more about what is happening.");
      return;
    }
    if (!started) {
      setStarted(true);
      trackEvent("contact_open", { location: "section", category: "project" });
    }
    inlineNavigated.current = true;
    setStatus("");
    setStep(2);
  }

  function goBackInline() {
    if (busy.current || attempt.current.uncertain) return;
    inlineNavigated.current = true;
    setStatus("");
    setStep(1);
  }

  const Heading = isInline ? "h2" : Dialog.Title;
  const Description = isInline ? "p" : Dialog.Description;
  const formContent = (
    <>
        {success ? <div className="contact-step pt-7 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#DDF7E9] text-[#14532d]" aria-hidden="true"><Check size={26} strokeWidth={2} /></div>
          <Heading ref={title} tabIndex={-1} className="mt-5 text-xl font-semibold tracking-tight outline-none">Message received.</Heading>
          <Description className="mt-2 text-sm leading-6 text-muted-foreground">Thanks for reaching out. I&apos;ll get back to you soon.</Description>
          {!isInline && <Dialog.Close asChild><Button type="button" className="mt-7 w-full">Done</Button></Dialog.Close>}
        </div> : <>
        {isInline ? (
          <div className="mb-4 flex items-center justify-between gap-4">
            <span className="text-xs font-medium tabular-nums text-muted-foreground">Step {step} of 2</span>
            <div aria-hidden="true" className="flex w-14 gap-1.5">
              <span className="h-1 flex-1 rounded-full bg-primary" />
              <span className={`h-1 flex-1 rounded-full ${step === 2 ? "bg-primary" : "bg-border"}`} />
            </div>
          </div>
        ) : <p className="mb-2 text-xs tabular-nums text-muted-foreground">{step} of 2</p>}
        <Heading ref={title} tabIndex={-1} id={isInline ? `${fieldId}-heading` : undefined} className={isInline ? "text-xl font-semibold tracking-tight outline-none" : "pr-8 text-xl font-semibold tracking-tight outline-none"}>{isInline ? (step === 1 ? "What’s happening?" : "Where can I reach you?") : (step === 1 ? "What brings you here?" : selected?.title)}</Heading>
        <Description className="mt-2 text-sm text-muted-foreground">{isInline ? (step === 1 ? "You don’t need to know the cause. Tell me what you’re trying to do and where it gets stuck." : "I’ll use your email to reply about this issue.") : (step === 1 ? "Have a project, role, or collaboration in mind? Tell me a little about it." : selected?.description)}</Description>
        {isInline && step === 1 ? <form key="note-problem" className="contact-step mt-5 space-y-4" onSubmit={continueInline}>
          <label htmlFor={`${fieldId}-problem`} className="sr-only">What’s happening?</label>
          <textarea id={`${fieldId}-problem`} name="message" required minLength={CONTACT_LIMITS.messageMin} maxLength={CONTACT_LIMITS.message} rows={4} value={fields.message} onChange={event => { setFields(value => ({ ...value, message: event.target.value })); setStatus(""); }} placeholder="Tell me a little about it. A website or app link helps." className={`${fieldClass} note-message-field block min-h-[108px] resize-y rounded-xl p-3 leading-relaxed`} />
          {inline?.starters?.length ? (
            <div className="space-y-2">
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <p id={`${fieldId}-suggestions`} className="text-xs font-medium text-muted-foreground">Not sure what to write?</p>
                <span className="text-xs text-muted-foreground">Choose any that apply.</span>
              </div>
              <div role="group" aria-labelledby={`${fieldId}-suggestions`} className="flex flex-wrap items-start gap-2">
                {inline.starters.map(starter => {
                  const active = hasNoteStarter(fields.message, starter.message);
                  const tooLong = !active && toggleNoteStarter(fields.message, starter.message, CONTACT_LIMITS.message) === fields.message;
                  return (
                    <button
                      key={starter.label}
                      type="button"
                      aria-pressed={active}
                      disabled={tooLong}
                      className={`inline-flex min-h-9 max-w-full items-center gap-1.5 rounded-full border px-3 py-1.5 text-left text-xs font-medium leading-snug transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50 ${active ? "border-primary/60 bg-muted text-foreground" : "border-border bg-background text-foreground hover:bg-muted"}`}
                      onClick={() => {
                        setFields(value => ({ ...value, message: toggleNoteStarter(value.message, starter.message, CONTACT_LIMITS.message) }));
                        setStatus("");
                      }}
                    >
                      {active ? <Check aria-hidden="true" className="size-3.5 shrink-0 text-primary" /> : <Plus aria-hidden="true" className="size-3.5 shrink-0 text-muted-foreground" />}
                      <span className="min-w-0">{starter.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}
          <p role="status" aria-live="polite" className="text-sm empty:hidden">{status}</p>
          <Button type="submit" className="h-11 w-full rounded-full">Continue</Button>
          <div className="border-t pt-3 text-xs leading-relaxed text-muted-foreground">
            <p>No account needed. You’ll be able to email me in the next step.</p>
            <p className="mt-1">Please leave out passwords and private customer details. <a href="/privacy" className="underline underline-offset-2">Privacy</a>.</p>
          </div>
        </form> : step === 1 ? <form className="contact-step mt-6 space-y-4" onSubmit={event => { event.preventDefault(); if (category) { setStep(2); setStatus(""); } }}>
          <fieldset className="space-y-2" disabled={attempt.current.uncertain}><legend className="sr-only">Enquiry type</legend>{OPTIONS.map(option => <label key={option} className="flex min-h-12 cursor-pointer items-center gap-3 rounded-md border p-3 text-sm has-[:checked]:border-primary"><input type="radio" name="category" value={option} checked={category === option} onChange={() => { if (category !== option) setFields(value => ({ ...value, context: "" })); setCategory(option); }} required className="accent-primary" />{CONTACT_CATEGORIES[option].label}</label>)}</fieldset>
          <Button type="submit" className="w-full" disabled={!category}>Continue</Button>
        </form> : <form key="contact-details" className="contact-step mt-5 space-y-3" aria-busy={sending} onFocusCapture={() => { if (isInline && !started) { setStarted(true); trackEvent("contact_open", { location: "section", category: "project" }); } }} onSubmit={submit} onInvalid={() => setStatus("Please check the required fields.")}>
          {!isInline && <div><label htmlFor={`${fieldId}-name`} className="block text-sm">Name</label><input id={`${fieldId}-name`} name="name" autoComplete="name" placeholder="Your name" required maxLength={CONTACT_LIMITS.name} value={fields.name} readOnly={sending || attempt.current.uncertain} onChange={event => setFields(value => ({ ...value, name: event.target.value }))} className={fieldClass} /></div>}
          <div><label htmlFor={`${fieldId}-email`} className="block text-sm">Email</label><input id={`${fieldId}-email`} name="email" type="email" inputMode="email" autoComplete="email" placeholder="you@example.com" required maxLength={CONTACT_LIMITS.email} value={fields.email} readOnly={sending || attempt.current.uncertain} onChange={event => setFields(value => ({ ...value, email: event.target.value }))} className={isInline ? `${fieldClass} note-message-field rounded-xl py-3` : fieldClass} /></div>
          {!isInline && <div><label htmlFor={`${fieldId}-context`} className="block text-sm">{selected?.contextLabel}</label><input id={`${fieldId}-context`} name="context" autoComplete="off" placeholder={selected?.contextPlaceholder} required maxLength={CONTACT_LIMITS.context} value={fields.context} readOnly={sending || attempt.current.uncertain} onChange={event => setFields(value => ({ ...value, context: event.target.value }))} className={fieldClass} /></div>}
          {!isInline && <div><label htmlFor={`${fieldId}-message`} className="block text-sm">{selected?.messageLabel}</label><textarea id={`${fieldId}-message`} name="message" placeholder={selected?.messagePlaceholder} required minLength={CONTACT_LIMITS.messageMin} maxLength={CONTACT_LIMITS.message} rows={4} value={fields.message} readOnly={sending || attempt.current.uncertain} onChange={event => setFields(value => ({ ...value, message: event.target.value }))} className={`${fieldClass} block`} /></div>}
          <div hidden aria-hidden="true"><label>Leave this blank<input name="website" tabIndex={-1} autoComplete="off" value={fields.website} onChange={event => setFields(value => ({ ...value, website: event.target.value }))} /></label></div>
          {verificationActive && <Script id="contact-turnstile" src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" strategy="afterInteractive" onLoad={() => { setScriptReady(true); setVerificationError(false); }} onReady={() => { setScriptReady(true); setVerificationError(false); }} onError={() => setVerificationError(true)} />}
          <div ref={challenge} aria-label="Spam verification" />
          {verificationError && <p role="alert" className="text-sm">Verification could not load. Please retry later or use <a href="https://www.linkedin.com/in/mianhamza" className="underline">LinkedIn</a>.</p>}
          {verificationActive && !token && !verificationError && <p className="text-xs text-muted-foreground">Complete the spam verification to send.</p>}
          <p role="status" aria-live="polite" aria-atomic="true" className="text-sm empty:hidden">{status}</p>
          {cooldown > 0 && <p aria-live="off" className="text-xs text-muted-foreground">Try again in {cooldown}s.</p>}
          <div className="flex gap-3"><Button type="button" variant="outline" className={isInline ? "h-11 rounded-full shadow-none" : undefined} disabled={sending || (isInline && attempt.current.uncertain)} onClick={() => { if (isInline) goBackInline(); else { setStep(1); setStatus(""); } }}>Back</Button><Button type="submit" className={isInline ? "h-11 flex-1 rounded-full" : "flex-1"} disabled={sending || !token || cooldown > 0}>{sending ? "Sending…" : "Send message"}</Button></div>
          <p className="text-xs leading-relaxed text-muted-foreground">{isInline && <>I use your email to reply. <a href="/privacy" className="underline underline-offset-2">Privacy</a>. </>}Prefer another route? <a href="https://www.linkedin.com/in/mianhamza" className="underline">Message me on LinkedIn</a>.</p>
        </form>}
        </>}

    </>
  );

  if (isInline) return <div className="w-full min-w-0">{formContent}</div>;

  return <Dialog.Root open={open} onOpenChange={onOpenChange}>
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-[60] bg-black/40" />
      <Dialog.Content className="contact-dialog fixed left-1/2 top-1/2 z-[61] flex w-[calc(100%_-_2rem)] max-w-[460px] max-h-[calc(100dvh_-_2rem)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-xl border bg-background shadow-xl" style={viewport ? { maxHeight: Math.max(120, viewport.height - 32), top: viewport.top + viewport.height / 2 } : undefined} onOpenAutoFocus={event => { event.preventDefault(); title.current?.focus(); }} onCloseAutoFocus={event => { event.preventDefault(); restoreFocus(); }}>
        <Dialog.Close asChild><button type="button" aria-label="Close contact dialog" className="absolute right-3 top-3 z-10 flex size-10 items-center justify-center rounded-md bg-background hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring"><X size={18} aria-hidden="true" /></button></Dialog.Close>
        <div className="contact-dialog-scroll min-h-0 overflow-y-auto overscroll-contain p-5 sm:p-7">
        {formContent}
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>;
}
