import { Badge } from "@/components/ui/badge";
import { DATA } from "@/data/resume";
import { articleJsonLd, pageMetadata, serializeJsonLd } from "@/lib/seo";
import { CASE_STUDY } from "@/lib/case-study";
import Link from "next/link";

const { title, description, slug, updatedAt } = CASE_STUDY;
const path = `/projects/${slug}`;
const image = `/og/${slug}`;
export const metadata = pageMetadata({ title, description, path, article: true, updatedAt, image });

export default function ProductionOperationsPlatform() {
  return (
    <main className="space-y-8 pb-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(articleJsonLd({
        type: "TechArticle", title, description, path, image, updatedAt,
        about: ["PostgreSQL query performance", "Multi-tenant authorization", "Financial transaction reliability", "Production validation"],
      })) }} />
      <Link href="/#projects" className="inline-block text-sm underline underline-offset-4">← Selected Work</Link>
      <header className="space-y-4">
        <p className="text-sm text-muted-foreground">Engineering case study · 2 minute read</p>
        <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
        <div className="flex flex-wrap gap-1">
          {["React", "TypeScript", "PostgreSQL", "Supabase", "Vercel"].map((technology) => (
            <Badge key={technology} variant="secondary">{technology}</Badge>
          ))}
        </div>
      </header>

      <article className="prose prose-sm max-w-none dark:prose-invert">
        <h2>Overview and business context</h2>
        <p>I built and maintain a multi-tenant production SaaS platform supporting operational, transactional and financial workflows. The work spans application development, tenant-aware access, reporting, database performance and ongoing maintenance. This case study is anonymized to protect customer and business information.</p>

        <h2>Engineering challenge</h2>
        <p>A financial list performed repeated authorization and record-resolution work before returning a page of results. Corrections also needed to preserve historical transactions and an audit trail. Improving response time had to retain tenant isolation, permission checks and exact financial results.</p>

        <h2 id="root-cause-investigation">Root-cause investigation</h2>
        <p>I compared before-and-after API responses and profiled database execution with synthetic local data. The query repeatedly checked permissions and resolved records to their current corrected version. This redundant work grew with the history being examined; returning fewer rows alone did not address the cost.</p>

        <h2 id="technical-solution">Technical solution</h2>
        <ul>
          <li>Evaluated equivalent authorization decisions once per request while preserving tenant and record-level restrictions.</li>
          <li>Resolved current records once for the candidate set, then filtered and paginated before performing bounded balance aggregation.</li>
          <li>Designed atomic reversal-and-replacement corrections: retain the original transaction, record its reversal and link the replacement. A failed correction rolls back as one unit.</li>
          <li>Kept reporting and operational workflows tenant-aware, and prevented stale financial results from appearing current during failed or pending refreshes.</li>
        </ul>
        <p>The read optimization preserved the existing financial writers, historical records and authorization boundaries.</p>

        <h2>Measurable result</h2>
        <div className="not-prose rounded-lg border p-5">
          <p className="text-xs font-medium text-muted-foreground">Median full-list API response · controlled local benchmark</p>
          <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">4,521 ms → 94 ms</p>
          <p className="mt-2 text-sm text-muted-foreground">Approximately 98% lower response time.</p>
        </div>
        <p>Three HTTP samples per version used the same synthetic fixture: 600 historical sales, 120 customers and a 50-row response. The unrounded medians were 4,520.77 ms and 94.12 ms, a 97.9% reduction. “Full-list” refers to the complete API call for that page, not downloading every historical record.</p>
        <p>These are controlled local measurements, not results under real production traffic or a production latency guarantee.</p>

        <h2 id="testing-and-production-validation">Testing and production validation</h2>
        <p>Validation covered financial correctness, immutable history, correction and retry behavior, response parity, cross-tenant denial and permission boundaries. Desktop and mobile browser regressions checked navigation, pagination, refresh, error recovery and action accessibility.</p>
        <p>Production database checks verified the intended change and preserved migration history, permissions and related definitions. Authenticated production list acceptance was unavailable for this release; local test results do not establish live-user performance. Production deployment checks are kept separate from benchmark evidence.</p>
        <h2>Related engineering Notes</h2>
        <p><Link href="/blog/how-i-approach-production-problems">How I Approach Production Problems</Link> explains the investigation and validation sequence behind this work. <Link href="/blog/database-changes-need-a-delivery-plan">Database Changes Need a Delivery Plan</Link> covers compatibility and release checks, while <Link href="/blog/apis-are-where-systems-start-talking">APIs Are Where Systems Start Talking</Link> examines retries and ambiguous outcomes at application boundaries.</p>
      </article>
      <nav aria-label="Case study navigation" className="flex flex-wrap gap-4 border-t pt-5 text-sm">
        <Link href="/#projects" className="underline underline-offset-4">Back to Selected Work</Link>
        <Link href="/blog" className="underline underline-offset-4">Technical Notes</Link>
        <Link href={DATA.contact.social.GitHub.url} className="underline underline-offset-4">GitHub</Link>
        <Link href="/#contact" className="underline underline-offset-4">Get in touch</Link>
      </nav>
    </main>
  );
}
