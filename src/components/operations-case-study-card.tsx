"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight, BarChart3, Database, History, ListChecks, Receipt, RefreshCcw, ShieldCheck, Workflow } from "lucide-react";
import Link from "next/link";
import { useId, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CASE_STUDY } from "@/lib/case-study";
import { cn } from "@/lib/utils";

const areas = [
  {
    id: "operations",
    label: "Operations",
    icon: Workflow,
    title: "Daily work, connected.",
    description: "Transactions, reporting and financial corrections in one production application.",
    accent: "text-sky-800 dark:text-sky-200",
    surface: "border-sky-100 bg-sky-50/70 dark:border-sky-900/60 dark:bg-sky-950/25",
    steps: [
      { icon: ListChecks, label: "Workflows" },
      { icon: Receipt, label: "Entries" },
      { icon: BarChart3, label: "Reports" },
    ],
  },
  {
    id: "data",
    label: "Data",
    icon: Database,
    title: "Faster paths to the right data.",
    description: "Query tuning reduces repeated work while preserving the results people depend on.",
    accent: "text-violet-800 dark:text-violet-200",
    surface: "border-violet-100 bg-violet-50/70 dark:border-violet-900/60 dark:bg-violet-950/25",
    steps: [
      { icon: ShieldCheck, label: "Access checks" },
      { icon: Database, label: "Current records" },
      { icon: ListChecks, label: "Results" },
    ],
  },
  {
    id: "trust",
    label: "Trust",
    icon: ShieldCheck,
    title: "Corrections with a clear history.",
    description: "Tenant-aware permissions and linked corrections keep financial changes traceable.",
    accent: "text-teal-800 dark:text-teal-200",
    surface: "border-teal-100 bg-teal-50/70 dark:border-teal-900/60 dark:bg-teal-950/25",
    steps: [
      { icon: History, label: "Original" },
      { icon: RefreshCcw, label: "Reversal" },
      { icon: Receipt, label: "Corrected" },
    ],
  },
] as const;

export function OperationsCaseStudyCard() {
  const id = useId();
  const reduceMotion = useReducedMotion();
  const [selected, setSelected] = useState(0);
  const area = areas[selected];
  const href = `/projects/${CASE_STUDY.slug}`;

  return (
    <Card role="article" aria-labelledby={`${id}-title`} className="overflow-hidden rounded-2xl border shadow-none transition-colors hover:border-foreground/25">
      <CardHeader className="gap-3 p-5 pb-4 sm:p-6 sm:pb-4">
        <Badge variant="secondary" className="w-fit rounded-full bg-sky-50 px-3 py-1 font-medium text-sky-800 hover:bg-sky-50 dark:bg-sky-950/40 dark:text-sky-200 dark:hover:bg-sky-950/40">Selected project</Badge>
        <CardTitle id={`${id}-title`} className="text-xl leading-tight sm:text-2xl">
          <Link href={href} className="rounded-sm underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring">{CASE_STUDY.title}</Link>
        </CardTitle>
        <CardDescription className="max-w-prose leading-relaxed">A business platform I build and maintain, from everyday workflows to the data behind them.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-3 px-5 sm:px-6">
        <div role="group" aria-label="Explore project areas" className="flex gap-1 rounded-xl bg-muted/60 p-1">
          {areas.map((item, index) => {
            const Icon = item.icon;
            const active = selected === index;
            return (
              <Button
                key={item.id}
                id={`${id}-${item.id}`}
                type="button"
                variant="ghost"
                aria-pressed={active}
                aria-controls={`${id}-details`}
                onClick={() => setSelected(index)}
                className={cn("relative h-11 min-w-0 flex-1 gap-2 rounded-lg px-2 text-xs hover:bg-transparent focus-visible:z-10 sm:text-sm", active ? item.accent : "text-muted-foreground hover:text-foreground")}
              >
                {active && <motion.span aria-hidden="true" layoutId={`${id}-selection`} className="absolute inset-0 rounded-lg border border-border/60 bg-background" transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 450, damping: 36 }} />}
                <Icon aria-hidden="true" className="relative hidden size-4 sm:block" />
                <span className="relative">{item.label}</span>
              </Button>
            );
          })}
        </div>

        <div id={`${id}-details`} role="region" aria-labelledby={`${id}-${area.id}`} aria-live="polite" aria-atomic="true" className={cn("overflow-hidden rounded-xl border p-4 transition-colors motion-reduce:transition-none sm:p-5", area.surface)}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={area.id} initial={reduceMotion ? false : { opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -3 }} transition={{ duration: reduceMotion ? 0 : 0.14 }}>
              <h4 className="text-base font-semibold leading-snug text-foreground">{area.title}</h4>
              <p className="mt-1.5 min-h-[2.75rem] text-sm leading-relaxed text-muted-foreground">{area.description}</p>
              <ol aria-label={`${area.label} flow`} className={cn("mt-5 grid grid-cols-3 gap-2", area.accent)}>
                {area.steps.map(({ icon: Icon, label }, index) => (
                  <li key={label} className="relative flex min-w-0 flex-col items-center gap-2 text-center">
                    <motion.span aria-hidden="true" initial={reduceMotion ? false : { opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: reduceMotion ? 0 : 0.18, delay: reduceMotion ? 0 : index * 0.04 }} className="grid size-10 place-items-center rounded-xl border border-border/70 bg-background/80">
                      <Icon className="size-[18px]" strokeWidth={1.65} />
                    </motion.span>
                    {index < area.steps.length - 1 && <ArrowRight aria-hidden="true" className="absolute -right-3 top-3 size-4 opacity-40" />}
                    <span className="min-h-8 text-[11px] font-medium leading-4 sm:text-xs">{label}</span>
                  </li>
                ))}
              </ol>
            </motion.div>
          </AnimatePresence>
        </div>
      </CardContent>

      <CardFooter className="flex-wrap justify-between gap-3 p-5 pt-4 sm:p-6 sm:pt-4">
        <p className="text-xs text-muted-foreground">React · TypeScript · PostgreSQL</p>
        <Button asChild className="group h-11 w-full gap-2 rounded-xl shadow-none sm:w-auto">
          <Link href={href}>Explore the project <ArrowUpRight aria-hidden="true" className="size-4 transition-transform motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5" /></Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
