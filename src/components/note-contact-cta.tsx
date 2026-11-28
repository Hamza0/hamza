"use client";

import ContactDialog from "@/components/contact-dialog";
import { useContact } from "@/components/contact-provider";
import { useId } from "react";
import Image from "next/image";
import Link from "next/link";
import type { NoteStarter } from "@/lib/note-helpers";

export function NoteContactCTA({ title, description, context, starters }: { title: string; description: string; context: string; starters: readonly NoteStarter[] }) {
  const { available } = useContact();
  const headingId = useId();

  return (
    <section id="get-help" className="note-enquiry mt-10 scroll-mt-6 rounded-[1.5rem] border p-3 sm:p-4" aria-label={title}>
      <div className="flex items-center gap-3 px-2 pb-4 pt-1 sm:px-3 sm:pb-5">
        <Image src="/hamza-portrait.webp" alt="" width={44} height={44} className="size-11 shrink-0 rounded-full border border-border/70 object-cover" />
        <div className="min-w-0">
          <p className="text-sm font-semibold"><Link href="/#about" className="hover:underline underline-offset-4">Hamza Shakeel</Link></p>
          <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">Software developer · Greater Toronto Area</p>
        </div>
      </div>
      <div className="note-enquiry-inner rounded-2xl border p-4 sm:p-6">
      {available ? (
        <>
          <ContactDialog key={context} open={true} onOpenChange={() => {}} restoreFocus={() => {}} inline={{ title, description, context, starters }} />
          <noscript><a href="https://www.linkedin.com/in/mianhamza" className="mt-3 block text-sm underline underline-offset-4">Message me on LinkedIn</a></noscript>
        </>
      ) : (
        <>
          <h2 id={headingId} className="text-xl font-semibold tracking-tight">{title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
          <a href="https://www.linkedin.com/in/mianhamza" className="mt-3 inline-block text-sm font-medium text-[hsl(var(--note-accent))] underline underline-offset-4">Message me on LinkedIn</a>
        </>
      )}
      </div>
    </section>
  );
}
