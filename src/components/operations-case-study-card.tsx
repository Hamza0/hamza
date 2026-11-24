import { ArrowUpRight, Database, Receipt, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { CASE_STUDY } from "@/lib/case-study";

const capabilities = [
  { icon: Database, title: "Faster reads", detail: "PostgreSQL query tuning" },
  { icon: ShieldCheck, title: "Safer access", detail: "Tenant-aware permissions" },
  { icon: Receipt, title: "Clearer history", detail: "Auditable financial corrections" },
];

export function OperationsCaseStudyCard() {
  const href = `/projects/${CASE_STUDY.slug}`;
  return (
    <article className="group overflow-hidden rounded-2xl border bg-card text-card-foreground transition-colors hover:border-foreground/30">
      <div className="space-y-5 p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-medium text-muted-foreground">Featured engineering case study</p>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" /> Live system
          </span>
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">
            <Link href={href} className="rounded-sm hover:underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring">{CASE_STUDY.title}</Link>
          </h3>
          <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">I built and maintain a SaaS platform that brings daily operations, reporting and financial corrections together.</p>
        </div>
        <div className="rounded-xl border border-emerald-200/70 bg-emerald-50/50 p-4 dark:border-emerald-900/70 dark:bg-emerald-950/20 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-medium text-emerald-900 dark:text-emerald-200">Local API benchmark</p>
            <span className="text-xs font-medium text-emerald-800 dark:text-emerald-300">97.9% lower response time</span>
          </div>
          <div className="mt-3 flex items-center gap-5 font-semibold tabular-nums tracking-tight">
            <div><span className="block text-xs font-normal tracking-normal text-muted-foreground">Before</span><span className="mt-1 block text-2xl text-muted-foreground sm:text-3xl">4.52s</span></div>
            <span aria-hidden="true" className="pt-5 text-lg text-muted-foreground">→</span>
            <div><span className="block text-xs font-normal tracking-normal text-muted-foreground">After</span><span className="mt-1 block text-3xl text-emerald-800 dark:text-emerald-300 sm:text-4xl">94ms</span></div>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">Median of three samples per version, using synthetic local data. Not a live production latency measurement.</p>
        </div>
        <ul className="grid gap-3 sm:grid-cols-3">
          {capabilities.map(({ icon: Icon, title, detail }) => (
            <li key={title} className="flex items-start gap-2.5 sm:block">
              <Icon aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-muted-foreground sm:mb-2" />
              <div><p className="text-sm font-medium">{title}</p><p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{detail}</p></div>
            </li>
          ))}
        </ul>
        <p className="text-xs leading-relaxed text-muted-foreground">React · TypeScript · PostgreSQL · Supabase · Vercel</p>
      </div>
      <Link href={href} className="flex items-center justify-between gap-3 border-t px-5 py-4 text-sm font-medium transition-colors hover:bg-muted/50 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring sm:px-6">
        Read the case study
        <ArrowUpRight aria-hidden="true" className="size-4 shrink-0 transition-transform motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5" />
      </Link>
    </article>
  );
}
