"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowDownRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { NoteHeading } from "@/lib/note-reading";

export function NoteReadingNav({ headings }: { headings: readonly NoteHeading[] }) {
  const prefersReducedMotion = useReducedMotion();

  if (headings.length === 0) return null;

  return (
    <nav aria-label="In this note" className="my-8">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <p className="text-xs font-medium text-muted-foreground">In this note</p>
        <span className="text-xs text-muted-foreground">{headings.length} {headings.length === 1 ? "section" : "sections"}</span>
      </div>
      <ol className="grid gap-2 sm:grid-cols-2">
        {headings.map((heading, index) => (
          <motion.li
            key={heading.id}
            initial={false}
            whileHover={prefersReducedMotion === false ? { y: -1 } : undefined}
            transition={{ duration: 0.15 }}
            className="min-w-0"
          >
            <Button
              asChild
              variant="ghost"
              className="group h-full min-h-11 w-full justify-start gap-2.5 whitespace-normal rounded-xl bg-muted/40 px-3 py-2.5 text-left text-xs leading-relaxed text-foreground hover:bg-muted/80 hover:text-[hsl(var(--note-accent))] focus-visible:ring-2 focus-visible:ring-[hsl(var(--note-accent))] focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:text-sm"
            >
              <a href={`#${heading.id}`}>
                <span aria-hidden="true" className="note-accent self-start pt-px text-[10px] font-medium tabular-nums sm:pt-0.5">{String(index + 1).padStart(2, "0")}</span>
                <span className="min-w-0 flex-1 break-words">{heading.title}</span>
                <ArrowDownRight aria-hidden="true" className="size-3.5 shrink-0 text-muted-foreground group-hover:text-[hsl(var(--note-accent))]" />
              </a>
            </Button>
          </motion.li>
        ))}
      </ol>
    </nav>
  );
}
