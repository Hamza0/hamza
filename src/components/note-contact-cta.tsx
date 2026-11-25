"use client";

import ContactDialog from "@/components/contact-dialog";
import { useContact } from "@/components/contact-provider";
import { useId } from "react";

export function NoteContactCTA({ title, description, context }: { title: string; description: string; context: string }) {
  const { available } = useContact();
  const headingId = useId();

  return (
    <section className="mt-10 rounded-2xl border bg-muted/25 p-5 sm:p-6" aria-label="Contact Hamza about this note">
      {available ? (
        <>
          <ContactDialog key={context} open={true} onOpenChange={() => {}} restoreFocus={() => {}} inline={{ title, description, context }} />
          <noscript><a href="https://www.linkedin.com/in/mianhamza" className="mt-3 block text-sm underline underline-offset-4">Message me on LinkedIn</a></noscript>
        </>
      ) : (
        <>
          <h2 id={headingId} className="text-xl font-semibold tracking-tight">{title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
          <a href="https://www.linkedin.com/in/mianhamza" className="mt-3 inline-block text-sm font-medium text-[hsl(var(--note-accent))] underline underline-offset-4">Message me on LinkedIn</a>
        </>
      )}
    </section>
  );
}
