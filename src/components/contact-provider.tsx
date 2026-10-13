"use client";

import { Button } from "@/components/ui/button";
import { trackEvent, type ContactTrigger as TriggerLocation } from "@/lib/analytics";
import dynamic from "next/dynamic";
import { createContext, forwardRef, useContext, useRef, useState, type ComponentPropsWithoutRef, type ReactNode } from "react";

const ContactDialog = dynamic(() => import("@/components/contact-dialog"), { ssr: false });
const ContactContext = createContext({ available: false, openContact: (_location: TriggerLocation, _trigger: HTMLElement) => {} });
export const useContact = () => useContext(ContactContext);

export function ContactProvider({ available, children }: { available: boolean; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const trigger = useRef<HTMLElement | null>(null);
  const openContact = (location: TriggerLocation, element: HTMLElement) => {
    if (!available || open) return;
    trigger.current = element;
    setLoaded(true);
    setOpen(true);
    trackEvent("contact_open", { location });
  };
  return <ContactContext.Provider value={{ available, openContact }}>
    {children}
    {available && loaded && <ContactDialog open={open} onOpenChange={setOpen} restoreFocus={() => trigger.current?.focus({ preventScroll: true })} />}
  </ContactContext.Provider>;
}

export function ContactButton() {
  const { available, openContact } = useContact();
  return available ? <Button type="button" className="mt-2" onClick={event => openContact("section", event.currentTarget)}>Let&apos;s talk</Button> : null;
}

export const DockContactButton = forwardRef<HTMLButtonElement, ComponentPropsWithoutRef<"button">>(function DockContactButton({ children, ...props }, ref) {
  const { available, openContact } = useContact();
  return available ? <button {...props} ref={ref} type="button" aria-label="Contact Hamza" onClick={event => { props.onClick?.(event); if (!event.defaultPrevented) openContact("dock", event.currentTarget); }}>{children}</button> : null;
});
