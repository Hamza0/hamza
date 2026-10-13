"use client";

import { useEffect, useRef, useState } from "react";
import { copyContactEmail } from "@/lib/copy-contact-email";
import { useContact } from "@/components/contact-provider";

export function AvailableWorkBadge() {
  const { available, openContact } = useContact();
  const [copied, setCopied] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const busy = useRef(false);
  const mounted = useRef(false);
  const reset = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      clearTimeout(reset.current);
    };
  }, []);

  const copy = async () => {
    if (busy.current) return;
    busy.current = true;
    setAnnouncement("");
    const success = await copyContactEmail();
    if (!mounted.current) return;
    if (!success) {
      busy.current = false;
      setAnnouncement("Unable to copy the contact email. Please try again.");
      return;
    }
    setCopied(true);
    setAnnouncement("Contact email copied to clipboard.");
    reset.current = setTimeout(() => {
      setCopied(false);
      setAnnouncement("");
      busy.current = false;
    }, 1800);
  };

  return (
    <>
      <button
        type="button"
        className="available-work-badge"
        aria-label={available ? "Available for work — contact Hamza" : `${copied ? "Email copied" : "Available for work"} — copy contact email`}
        aria-disabled={copied}
        onClick={event => available ? openContact("lanyard", event.currentTarget) : void copy()}
      >
        {copied ? (
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path d="m3 8 3 3 7-7" />
          </svg>
        ) : <span className="available-work-dot" aria-hidden="true" />}
        <span>{copied ? "Email copied" : "Available for work"}</span>
      </button>
      <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">{announcement}</span>
    </>
  );
}
