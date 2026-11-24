"use client";

import { useContact } from "@/components/contact-provider";
import { ArrowUpRight } from "lucide-react";

export function NoteContactCTA({ title, description }: { title: string; description: string }) {
  const { available, openContact } = useContact();
  return (
    <section aria-labelledby="note-contact-title" className="note-callout mt-10 rounded-2xl border p-5 sm:p-6">
      <p className="note-accent text-xs font-medium">Put this into practice</p>
      <h2 id="note-contact-title" className="mt-2 text-xl font-semibold tracking-tight">{title}</h2>
      <p className="mt-2 max-w-prose text-sm leading-relaxed text-muted-foreground">{description}</p>
      {available ? (
        <>
          <button type="button" onClick={(event) => openContact("section", event.currentTarget)} className="note-action mt-5 inline-flex min-h-11 items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring">
            Start a conversation <ArrowUpRight aria-hidden="true" className="size-4" />
          </button>
          <p className="mt-3 text-xs text-muted-foreground">Two short steps. I&apos;ll review your message and we can discuss what comes next.</p>
        </>
      ) : (
        <a href="https://www.linkedin.com/in/mianhamza" className="note-accent mt-5 inline-flex min-h-11 items-center gap-3 text-sm font-medium underline underline-offset-4">Connect on LinkedIn <ArrowUpRight aria-hidden="true" className="size-4" /></a>
      )}
    </section>
  );
}
