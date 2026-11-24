"use client";

import { useContact } from "@/components/contact-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowUpRight } from "lucide-react";
import { useId } from "react";

export function NoteContactCTA({ title, description }: { title: string; description: string }) {
  const { available, openContact } = useContact();
  const titleId = useId();

  return (
    <section aria-labelledby={titleId} className="mt-10">
      <Card className="note-callout rounded-xl border p-5 shadow-none sm:p-6">
        <h2 id={titleId} className="text-xl font-semibold tracking-tight">{title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
        {available ? (
          <>
            <Button type="button" aria-haspopup="dialog" onClick={(event) => openContact("section", event.currentTarget)} className="note-action mt-4 h-11 gap-2 rounded-lg px-4 shadow-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-offset-2 motion-reduce:transition-none">
              Start a conversation <ArrowUpRight aria-hidden="true" className="size-4" />
            </Button>
            <noscript><a href="https://www.linkedin.com/in/mianhamza" className="mt-3 block text-sm underline underline-offset-4">Connect on LinkedIn</a></noscript>
          </>
        ) : (
          <Button asChild className="note-action mt-4 h-11 gap-2 rounded-lg px-4 shadow-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-offset-2 motion-reduce:transition-none">
            <a href="https://www.linkedin.com/in/mianhamza">Connect on LinkedIn <ArrowUpRight aria-hidden="true" className="size-4" /></a>
          </Button>
        )}
      </Card>
    </section>
  );
}
