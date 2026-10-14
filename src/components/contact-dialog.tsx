"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { trackEvent, type ContactCategory } from "@/lib/analytics";
import { X } from "lucide-react";
import Script from "next/script";
import { useEffect, useRef, useState, type FormEvent } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (element: HTMLElement, options: { sitekey: string; action: string; theme: string; callback: (token: string) => void; "expired-callback": () => void; "error-callback": () => void }) => string;
      remove: (id: string) => void;
      reset: (id: string) => void;
    };
  }
}
const OPTIONS = [{ value: "job", label: "Job opportunity" }, { value: "project", label: "Project enquiry" }, { value: "collaboration", label: "Collaboration" }] as const;
const EMPTY = { name: "", email: "", message: "", website: "" };
const fieldClass = "mt-1 w-full rounded-md border bg-background px-3 py-2 text-base focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring";

export default function ContactDialog({ open, onOpenChange, restoreFocus }: { open: boolean; onOpenChange: (value: boolean) => void; restoreFocus: () => void }) {
  const [step, setStep] = useState<1 | 2>(1);
  const [category, setCategory] = useState<ContactCategory | "">("");
  const [fields, setFields] = useState(EMPTY);
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

  useEffect(() => {
    if (open && !wasOpen.current && success) {
      setSuccess(false); setStep(1); setCategory(""); setFields(EMPTY); setStatus("");
      attempt.current = { id: "", payload: "", uncertain: false };
    }
    wasOpen.current = open;
  }, [open, success]);

  useEffect(() => {
    if (!open) return;
    title.current?.focus({ preventScroll: true });
  }, [open, step, success]);
  useEffect(() => () => activeRequest.current?.abort(), []);
  useEffect(() => {
    if (!open) return;
    const view = window.visualViewport;
    const update = () => setViewport({ height: view?.height ?? window.innerHeight, top: view?.offsetTop ?? 0 });
    update();
    view?.addEventListener("resize", update);
    view?.addEventListener("scroll", update);
    window.addEventListener("resize", update);
    return () => { view?.removeEventListener("resize", update); view?.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, [open]);
  useEffect(() => {
    if (!open || step !== 2 || !scriptReady || success || !challenge.current || !window.turnstile) return;
    try {
      widget.current = window.turnstile.render(challenge.current, {
        sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!, action: "portfolio_contact", theme: "auto",
        callback: value => { setToken(value); setVerificationError(false); },
        "expired-callback": () => { setToken(""); setStatus("Verification expired. Please verify again."); },
        "error-callback": () => { setToken(""); setVerificationError(true); },
      });
    } catch { setVerificationError(true); }
    return () => { if (widget.current) window.turnstile?.remove(widget.current); widget.current = undefined; setToken(""); };
  }, [open, step, scriptReady, success]);
  useEffect(() => {
    if (!cooldown) return;
    const timer = setInterval(() => setCooldown(value => Math.max(0, value - 1)), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy.current || !category || !token || cooldown) return;
    busy.current = true;
    setSending(true);
    setStatus("Sending your message…");
    const payload = JSON.stringify([category, fields.name, fields.email, fields.message]);
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
      const r = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...fields, category, token, submissionId: attempt.current.id }), signal: controller.signal });
      const data = await r.json().catch(() => ({})) as { code?: string };
      if (r.ok && data.code === "accepted") {
        setSuccess(true);
        setStatus("Your message was accepted for sending. Thank you — I’ll respond when I can.");
        trackEvent("contact_submit_success", { category });
      } else {
        if (!wasUncertain && [400, 403, 413, 429].includes(r.status)) attempt.current.uncertain = false;
        if (r.status === 429) {
          setCooldown(Math.max(1, Math.min(3600, Number(r.headers.get("Retry-After")) || 600)));
          setStatus("Too many attempts. Please wait before trying again, or reach me on LinkedIn.");
        } else if (data.code === "verification") setStatus("Verification was invalid or expired. Please verify again and retry.");
        else if (data.code === "validation") setStatus("Please check your name, email, and message (10–3,000 characters).");
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

  return <Dialog.Root open={open} onOpenChange={onOpenChange}>
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-[60] bg-black/40" />
      <Dialog.Content className="contact-dialog fixed left-1/2 top-1/2 z-[61] flex w-[calc(100%_-_2rem)] max-w-[460px] max-h-[calc(100dvh_-_2rem)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-xl border bg-background shadow-xl" style={viewport ? { maxHeight: Math.max(120, viewport.height - 32), top: viewport.top + viewport.height / 2 } : undefined} onOpenAutoFocus={event => { event.preventDefault(); title.current?.focus(); }} onCloseAutoFocus={event => { event.preventDefault(); restoreFocus(); }}>
        <Dialog.Close asChild><button type="button" aria-label="Close contact dialog" className="absolute right-3 top-3 z-10 flex size-10 items-center justify-center rounded-md bg-background hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring"><X size={18} aria-hidden="true" /></button></Dialog.Close>
        <div className="contact-dialog-scroll min-h-0 overflow-y-auto overscroll-contain p-5 sm:p-7">
        <p className="mb-2 text-xs text-muted-foreground">{step} of 2</p>
        <Dialog.Title ref={title} tabIndex={-1} className="pr-8 text-xl font-semibold tracking-tight outline-none">{step === 1 ? "What brings you here?" : "Tell me a little more."}</Dialog.Title>
        <Dialog.Description className="mt-2 text-sm text-muted-foreground">{success ? "Thanks for getting in touch." : "Have a project, role, or collaboration in mind? Tell me a little about it."}</Dialog.Description>
        {success ? <div className="mt-6 space-y-4"><p role="status" className="text-sm">{status}</p><Dialog.Close asChild><Button type="button">Close</Button></Dialog.Close></div> : step === 1 ? <form className="contact-step mt-6 space-y-4" onSubmit={event => { event.preventDefault(); if (category) { setStep(2); setStatus(""); } }}>
          <fieldset className="space-y-2" disabled={attempt.current.uncertain}><legend className="sr-only">Enquiry type</legend>{OPTIONS.map(option => <label key={option.value} className="flex min-h-12 cursor-pointer items-center gap-3 rounded-md border p-3 text-sm has-[:checked]:border-foreground"><input type="radio" name="category" value={option.value} checked={category === option.value} onChange={() => setCategory(option.value)} required className="accent-current" />{option.label}</label>)}</fieldset>
          <Button type="submit" className="w-full" disabled={!category}>Continue</Button>
        </form> : <form className="contact-step mt-5 space-y-4" onSubmit={submit} onInvalid={() => setStatus("Please check the required fields.")}>
          <div><label htmlFor="contact-name" className="block text-sm">Name</label><input id="contact-name" name="name" autoComplete="name" required maxLength={100} value={fields.name} readOnly={sending || attempt.current.uncertain} onChange={event => setFields(value => ({ ...value, name: event.target.value }))} className={fieldClass} /></div>
          <div><label htmlFor="contact-email" className="block text-sm">Email</label><input id="contact-email" name="email" type="email" inputMode="email" autoComplete="email" required maxLength={254} value={fields.email} readOnly={sending || attempt.current.uncertain} onChange={event => setFields(value => ({ ...value, email: event.target.value }))} className={fieldClass} /></div>
          <div><label htmlFor="contact-message" className="block text-sm">Message</label><textarea id="contact-message" name="message" required minLength={10} maxLength={3000} rows={4} value={fields.message} readOnly={sending || attempt.current.uncertain} onChange={event => setFields(value => ({ ...value, message: event.target.value }))} className={fieldClass} /></div>
          <div hidden aria-hidden="true"><label>Leave this blank<input name="website" tabIndex={-1} autoComplete="off" value={fields.website} onChange={event => setFields(value => ({ ...value, website: event.target.value }))} /></label></div>
          {open && <Script id="contact-turnstile" src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" strategy="afterInteractive" onReady={() => { setScriptReady(true); setVerificationError(false); }} onError={() => setVerificationError(true)} />}
          <div ref={challenge} className="min-h-[65px]" aria-label="Spam verification" />
          {verificationError && <p role="alert" className="text-sm">Verification could not load. Please retry later or use <a href="https://www.linkedin.com/in/mianhamza" className="underline">LinkedIn</a>.</p>}
          {!token && !verificationError && <p className="text-xs text-muted-foreground">Complete the spam verification to send.</p>}
          <p role="status" aria-live="polite" aria-atomic="true" className="text-sm">{status}</p>
          {cooldown > 0 && <p aria-live="off" className="text-xs text-muted-foreground">Try again in {cooldown}s.</p>}
          <div className="flex gap-3"><Button type="button" variant="outline" disabled={sending} onClick={() => { setStep(1); setStatus(""); }}>Back</Button><Button type="submit" className="flex-1" disabled={sending || !token || cooldown > 0}>{sending ? "Sending…" : "Send message"}</Button></div>
          <p className="text-xs text-muted-foreground">Prefer another route? <a href="https://www.linkedin.com/in/mianhamza" className="underline">Message me on LinkedIn</a>.</p>
        </form>}
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>;
}
