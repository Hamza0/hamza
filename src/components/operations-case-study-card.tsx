import { ArrowUpRight, Database, Layers, Receipt, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { CASE_STUDY } from "@/lib/case-study";

const capabilities = [
  { icon: Database, title: "Database engineering", detail: "PostgreSQL query optimization" },
  { icon: ShieldCheck, title: "Access control", detail: "Tenant isolation and authorization" },
  { icon: Receipt, title: "Financial integrity", detail: "Auditable transaction corrections" },
  { icon: Layers, title: "System architecture", detail: "APIs, reporting and reliable operations" },
];

export function OperationsCaseStudyCard() {
  const href = `/projects/${CASE_STUDY.slug}`;
  return (
    <article className="group overflow-hidden rounded-2xl border bg-card text-card-foreground transition-colors hover:border-foreground/30">
      <div className="space-y-5 p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.13em] text-muted-foreground">Featured engineering case study</p>
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" /> Live system
          </span>
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">
            <Link href={href} className="rounded-sm hover:underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring">{CASE_STUDY.title}</Link>
          </h3>
          <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">I built and maintain a multi-tenant SaaS platform for reliable transactions, operational workflows and financial reporting.</p>
        </div>
        <div className="rounded-xl border bg-muted/25 p-4 sm:p-5">
          <p className="text-xs font-medium text-muted-foreground">Median API response time · controlled local benchmark</p>
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 font-semibold tabular-nums tracking-tight">
            <span className="text-2xl text-muted-foreground sm:text-3xl"><span className="sr-only">Before: </span>4.52s</span>
            <span aria-hidden="true" className="text-lg text-muted-foreground">→</span>
            <span className="text-3xl text-emerald-700 dark:text-emerald-400 sm:text-4xl"><span className="sr-only">After: </span>94ms</span>
          </div>
          <div aria-hidden="true" className="mt-4 space-y-1.5">
            <div className="h-1.5 w-full rounded-full bg-foreground/20" />
            <div className="h-1.5 w-[2.08%] min-w-1 rounded-full bg-emerald-600 dark:bg-emerald-400" />
          </div>
          <p className="mt-3 text-sm font-medium text-emerald-700 dark:text-emerald-400">97.9% reduction in response time</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Synthetic fixture, three samples per version. Not a live production latency measurement.</p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {capabilities.map(({ icon: Icon, title, detail }) => (
            <div key={title} className="flex items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-muted/30">
                <Icon aria-hidden="true" className="size-4" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium">{title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{detail}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground">React · TypeScript · PostgreSQL · Supabase · Vercel</p>
      </div>
      <Link href={href} className="flex items-center justify-between gap-3 border-t px-5 py-4 text-sm font-medium transition-colors hover:bg-muted/50 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring sm:px-6">
        Explore the engineering case study
        <ArrowUpRight aria-hidden="true" className="size-4 shrink-0 transition-transform motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5" />
      </Link>
    </article>
  );
}
