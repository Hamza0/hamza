"use client";

import { useContact } from "@/components/contact-provider";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader } from "@/components/ui/card";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, MessageSquare } from "lucide-react";
import { useId } from "react";

export function NoteContactCTA({ title, description }: { title: string; description: string }) {
  const { available, openContact } = useContact();
  const prefersReducedMotion = useReducedMotion();
  const titleId = useId();

  return (
    <section aria-labelledby={titleId} className="mt-10">
      <Card className="note-callout rounded-2xl border p-5 shadow-none sm:p-6">
        <CardHeader className="gap-3">
          <div className="flex items-center gap-2.5">
            <span aria-hidden="true" className="note-chip flex size-8 items-center justify-center rounded-lg">
              <MessageSquare className="size-4" />
            </span>
            <p className="note-accent text-sm font-medium">Let&apos;s talk about it</p>
          </div>
          <h2 id={titleId} className="text-xl font-semibold tracking-tight sm:text-2xl">{title}</h2>
          <CardDescription className="max-w-prose leading-relaxed">{description}</CardDescription>
        </CardHeader>
        <CardFooter className="mt-5 flex-col items-start gap-3 pt-0 sm:flex-row sm:items-center sm:gap-4">
          <motion.div
            className="inline-flex rounded-xl"
            whileHover={prefersReducedMotion ? undefined : { y: -2 }}
            whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            {available ? (
              <Button
                type="button"
                onClick={(event) => openContact("section", event.currentTarget)}
                className="note-action h-auto min-h-11 gap-2 rounded-xl px-4 py-3 shadow-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-offset-2"
              >
                Start a conversation <ArrowUpRight aria-hidden="true" className="size-4" />
              </Button>
            ) : (
              <Button asChild className="note-action h-auto min-h-11 gap-2 rounded-xl px-4 py-3 shadow-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-offset-2">
                <a href="https://www.linkedin.com/in/mianhamza">
                  Connect on LinkedIn <ArrowUpRight aria-hidden="true" className="size-4" />
                </a>
              </Button>
            )}
          </motion.div>
          {available && <p className="text-xs text-muted-foreground">Two short steps</p>}
          {available && (
            <noscript>
              <a href="https://www.linkedin.com/in/mianhamza" className="inline-flex min-h-11 items-center text-sm underline underline-offset-4">Connect on LinkedIn</a>
            </noscript>
          )}
        </CardFooter>
      </Card>
    </section>
  );
}
