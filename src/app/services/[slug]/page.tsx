import { Breadcrumbs } from "@/components/breadcrumbs";
import { NoteContactCTA } from "@/components/note-contact-cta";
import { servicePath, services } from "@/data/services";
import { AUTHOR, pageMetadata, serializeJsonLd } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";
import Link from "next/link";
import { notFound } from "next/navigation";

type PageProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return services.map(({ slug }) => ({ slug }));
}

async function getService(params: PageProps["params"]) {
  const { slug } = await params;
  return services.find(service => service.slug === slug) ?? notFound();
}

export async function generateMetadata({ params }: PageProps) {
  const service = await getService(params);
  return pageMetadata({ title: service.title, description: service.description, path: servicePath(service) });
}

export default async function ServicePage({ params }: PageProps) {
  const service = await getService(params);
  const path = servicePath(service);
  const url = SITE_URL + path;

  return (
    <main className="note-theme space-y-8 pb-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd({
        "@context": "https://schema.org", "@type": "Service", "@id": url + "#service",
        url, name: service.title, description: service.description, provider: AUTHOR,
        areaServed: service.areas.map(name => ({ "@type": "Place", name: name + ", Ontario, Canada" })),
      }) }} />
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: service.title, path }]} />
      <header className="space-y-4">
        <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">{service.title}</h1>
        <p className="text-base leading-relaxed text-muted-foreground">{service.intro}</p>
        <a href="#get-help" className="inline-block text-sm font-medium underline underline-offset-4">{service.action} ↓</a>
      </header>
      <section aria-labelledby="service-scope" className="space-y-5">
        <h2 id="service-scope" className="text-xl font-semibold tracking-tight">{service.heading}</h2>
        {service.sections.map(section => (
          <div key={section.title} className="space-y-2 border-t pt-4">
            <h3 className="font-semibold">{section.title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{section.body}</p>
          </div>
        ))}
        <Link href={service.link.path} className="inline-block text-sm underline underline-offset-4">{service.link.label}</Link>
        <div className="space-y-3 border-t pt-4">
          <h3 className="font-semibold">Practical notes about these problems</h3>
          <ul className="space-y-2">
            {service.related.map(note => (
              <li key={note.path}>
                <Link href={note.path} className="text-sm underline underline-offset-4">{note.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <NoteContactCTA title={service.action} description={service.prompt} context={service.title} starters={service.starters} />
    </main>
  );
}
