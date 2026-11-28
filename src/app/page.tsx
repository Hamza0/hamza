import BlurFade from "@/components/magicui/blur-fade";
import { DiaTextReveal } from "@/components/ui/dia-text-reveal";
import { ProjectCard } from "@/components/project-card";
import { NotePinboardCard } from "@/components/note-pinboard-card";
import { getNotePresentation, readingMinutes } from "@/lib/note-presentation";
import { ResumeCard } from "@/components/resume-card";
import { HeroLanyard } from "@/components/hero-lanyard";
import { ContactButton } from "@/components/contact-provider";
import { contactFormAvailable } from "@/lib/contact/config";
import { servicePath, services } from "@/data/services";
import { DATA } from "@/data/resume";
import { getBlogPosts } from "@/data/blog";
import { PROFILE, SITE_UPDATED_AT } from "@/lib/site";
import { PERSON_ID, WEBSITE_ID, serializeJsonLd } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Markdown from "react-markdown";

export const metadata: Metadata = {
  alternates: { canonical: DATA.url },
};

const SECTION_TITLE = "text-2xl font-semibold leading-tight tracking-[-0.03em] sm:text-3xl";
const SERVICE_SUMMARIES: Record<(typeof services)[number]["slug"], string> = {
  "website-repair-toronto": "Broken pages, forms, checkout and website errors.",
  "wordpress-development-toronto-mississauga": "WordPress, WooCommerce, Elementor and ongoing support.",
  "existing-web-application-development-support": "Fix, finish or improve an existing web application.",
};

const BLUR_FADE_DELAY = 0.04;
const HERO_REVEAL_DURATION = 0.6;
const HERO_REVEAL_VARIANT = {
  hidden: { y: 14, opacity: 0, filter: "blur(6px)" },
  visible: { y: 0, opacity: 1, filter: "none", transitionEnd: { filter: "none" } },
};
const HERO_REVEAL_PROPS = {
  respectReducedMotion: true,
  variant: HERO_REVEAL_VARIANT,
  duration: HERO_REVEAL_DURATION,
  className: "motion-reduce:!opacity-100 motion-reduce:!transform-none motion-reduce:!filter-none",
};

export default async function Page() {
  const contactReady = contactFormAvailable();
  const posts = await getBlogPosts();
  // Hand-picked for owners who need help with an existing website or app.
  // New publication dates do not displace these useful starting points.
  const featuredSlugs = [
    "fix-existing-website-without-rebuild",
    "fix-existing-lovable-app",
    "google-business-profile-address-change-help",
    "wordpress-critical-error-help",
    "customers-cannot-log-into-web-app",
    "shopify-checkout-payment-not-working",
    "shopify-discount-code-not-working",
    "website-developer-stopped-responding",
  ];
  const featuredNotes = featuredSlugs.flatMap(slug => posts.filter(note => note.slug === slug));
  return (
    <main className="flex flex-col min-h-[100dvh] space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "WebSite",
                "@id": WEBSITE_ID,
                name: DATA.name,
                alternateName: "hamzashakeel.ca",
                url: DATA.url,
                publisher: { "@id": PERSON_ID },
                inLanguage: "en-CA",
              },
              {
                "@type": "ProfilePage",
                "@id": `${DATA.url}/#profile`,
                name: `${DATA.name} | ${DATA.professionalLabel}`,
                url: DATA.url,
                description: PROFILE.description,
                dateModified: SITE_UPDATED_AT,
                mainEntity: { "@id": PERSON_ID },
                hasPart: featuredNotes.map((note) => ({
                  "@type": "Article",
                  "@id": `${DATA.url}/blog/${note.slug}#article`,
                  headline: note.metadata.title,
                  url: `${DATA.url}/blog/${note.slug}`,
                  datePublished: note.metadata.publishedAt,
                  author: { "@id": PERSON_ID },
                })),
                isPartOf: { "@id": WEBSITE_ID },
                inLanguage: "en-CA",
              },
              {
                "@type": "Person",
                "@id": PERSON_ID,
                name: DATA.name,
                url: DATA.url,
                jobTitle: DATA.professionalLabel,
                description: PROFILE.description,
                homeLocation: { "@type": "Place", name: PROFILE.location },
                mainEntityOfPage: { "@id": `${DATA.url}/#profile` },
                contactPoint: {
                  "@type": "ContactPoint", contactType: "Professional enquiries", url: `${DATA.url}/#contact`,
                  areaServed: { "@type": "Place", name: PROFILE.location },
                },
                alumniOf: { "@type": "CollegeOrUniversity", name: DATA.education[0].school, url: DATA.education[0].href },
                hasCredential: { "@type": "EducationalOccupationalCredential", name: DATA.education[0].degree, credentialCategory: "Bachelor of Computer Science" },
                knowsAbout: [...DATA.skillGroups[0].skills, "Production Support", "WooCommerce Integrations", "Cloud Deployment", "Technical Project Delivery"],
                image: new URL(DATA.avatarUrl, DATA.url).toString(),
                sameAs: [DATA.contact.social.LinkedIn.url, DATA.contact.social.GitHub.url],
                worksFor: { "@id": "https://www.codedsquare.com/#organization" },
              },
              {
                "@type": "Organization",
                "@id": "https://www.codedsquare.com/#organization",
                name: "Coded Square",
                url: "https://www.codedsquare.com/",
                founder: { "@id": PERSON_ID },
              },
            ],
          }),
        }}
      />
      <section id="hero">
        <div className="mx-auto w-full max-w-2xl space-y-8">
          <div className="grid grid-cols-[minmax(0,1fr)_88px] items-center gap-x-3 gap-y-1.5 sm:flex sm:items-start sm:gap-2 sm:justify-between">
            <div className="contents sm:flex sm:flex-col min-w-0 flex-1 sm:space-y-1.5">
              <BlurFade {...HERO_REVEAL_PROPS} delay={0.02}
                className={`${HERO_REVEAL_PROPS.className} col-start-1 row-start-1 min-w-0`}>
                <p className="mb-2 text-base font-medium text-muted-foreground sm:text-xl">Hi, I&apos;m {DATA.name} 👋</p>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  {DATA.professionalLabel}
                </h1>
              </BlurFade>
              <BlurFade {...HERO_REVEAL_PROPS} delay={0.03}
                className={`${HERO_REVEAL_PROPS.className} col-span-2`}>
                <p className="max-w-[600px] text-base font-medium sm:text-lg md:text-xl">
                  <DiaTextReveal
                    text={DATA.heroHeadline}
                    repeat={false}
                    once={true}
                    duration={1.35}
                    delay={0}
                    colors={["#64748b", "#94a3b8", "hsl(var(--foreground))"]}
                    textColor="hsl(var(--foreground))"
                    className="motion-reduce:!bg-none motion-reduce:!text-foreground"
                  />
                </p>
              </BlurFade>
              <BlurFade {...HERO_REVEAL_PROPS} delay={0.06}
                className={`${HERO_REVEAL_PROPS.className} col-span-2`}>
                <p className="max-w-[600px] text-sm sm:text-base md:text-xl">{DATA.heroDescription}</p>
              </BlurFade>
            </div>
            <HeroLanyard />
          </div>
        </div>
      </section>

      <section aria-labelledby="services-title" id="services">
        <h2 id="services-title" className={SECTION_TITLE}>Work with me</h2>
        <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-muted-foreground">Website repairs, WordPress development and web app support in the Greater Toronto Area and remotely.</p>
        <ul className="portfolio-project-featured mt-4 divide-y divide-border/70 rounded-[20px] px-4 sm:px-5">
          {services.map(service => (
            <li key={service.slug}>
              <Link href={servicePath(service)} className="group -mx-2 flex items-center gap-3 rounded-xl px-2 py-3.5 transition-colors hover:bg-background/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none">
                <div className="min-w-0 flex-1">
                  <h3 className="text-[16px] font-semibold leading-snug tracking-tight group-hover:text-primary dark:group-hover:text-[#64b5ff]">{service.title}</h3>
                  <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{SERVICE_SUMMARIES[service.slug]}</p>
                </div>
                <ArrowUpRight className="size-4 shrink-0 text-muted-foreground group-hover:text-primary dark:group-hover:text-[#64b5ff]" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section id="projects">
        <div className="space-y-4 w-full">
          <BlurFade delay={BLUR_FADE_DELAY * 11}>
            <div className="flex flex-col space-y-3">
              <div className="space-y-2">
                <h2 className={SECTION_TITLE}>
                  {DATA.projectsTitle}
                </h2>
                <p className="text-[15px] leading-relaxed text-muted-foreground">
                  {DATA.projectsIntro}
                </p>
              </div>
            </div>
          </BlurFade>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {DATA.projects.filter((project) => "featured" in project && project.featured).map((project, id) => (
              <BlurFade
                key={project.title}
                delay={BLUR_FADE_DELAY * 4 + id * 0.05}
                className="h-full"
              >
                <ProjectCard
                  variant="featured"
                  href={project.href}
                  title={project.title}
                  description={project.description}
                  dates={project.dates}
                  tags={project.technologies}
                  image={project.image}
                  video={project.video}
                  links={project.links}
                />
              </BlurFade>
            ))}
          </div>
          <Link href="#additional-projects" className="inline-block text-sm underline underline-offset-4">
            Explore additional projects ↓
          </Link>
        </div>
      </section>

      <section id="about" aria-labelledby="about-title">
        <BlurFade delay={BLUR_FADE_DELAY * 3}>
          <h2 id="about-title" className={SECTION_TITLE}>About</h2>
        </BlurFade>
        <BlurFade delay={BLUR_FADE_DELAY * 4}>
          <Markdown className="home-about-copy mt-3 max-w-full font-sans text-[15px] leading-[1.7] text-muted-foreground">
            {DATA.summary}
          </Markdown>
          <nav aria-label="Professional profiles" className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[14px] font-medium">
            <Link href={DATA.contact.social.LinkedIn.url} rel="me" className="portfolio-project-link inline-flex items-center gap-1.5 rounded-sm underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring">LinkedIn <ArrowUpRight aria-hidden="true" className="size-3.5" /></Link>
            <Link href="https://www.codedsquare.com/" className="portfolio-project-link inline-flex items-center gap-1.5 rounded-sm underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring">Coded Square <ArrowUpRight aria-hidden="true" className="size-3.5" /></Link>
          </nav>
        </BlurFade>
      </section>

      <section id="work">
        <div className="flex min-h-0 flex-col gap-y-3">
          <BlurFade delay={BLUR_FADE_DELAY * 5}>
            <h2 className={SECTION_TITLE}>Work Experience</h2>
          </BlurFade>
          {DATA.work.map((work, id) => (
            <BlurFade
              key={work.company}
              delay={BLUR_FADE_DELAY * 6 + id * 0.05}
            >
              <ResumeCard
                key={work.company}
                variant="experience"
                logoUrl={work.logoUrl}
                altText={`${work.company} logo`}
                title={work.company}
                subtitle={work.title}
                href={work.href}
                externalLink={"externalLink" in work && work.externalLink}
                badges={work.badges}
                period={`${work.start} - ${work.end ?? "Present"}`}
                description={work.description}
              />
            </BlurFade>
          ))}
        </div>
      </section>

      <section id="education">
        <div className="flex min-h-0 flex-col gap-y-3">
          <BlurFade delay={BLUR_FADE_DELAY * 7}>
            <h2 className={SECTION_TITLE}>Education</h2>
          </BlurFade>
          {DATA.education.map((education, id) => (
            <BlurFade
              key={education.school}
              delay={BLUR_FADE_DELAY * 8 + id * 0.05}
            >
              <ResumeCard
                key={education.school}
                href={education.href}
                logoUrl={education.logoUrl}
                altText={education.school}
                title={education.school}
                subtitle={education.degree}
                period={`${education.start} - ${education.end}`}
              />
            </BlurFade>
          ))}
        </div>
      </section>

      <section id="skills" aria-labelledby="skills-title">
        <BlurFade delay={BLUR_FADE_DELAY * 9}>
          <h2 id="skills-title" className={SECTION_TITLE}>Skills</h2>
        </BlurFade>
        <div className="mt-4 space-y-4">
          {DATA.skillGroups.slice(0, 1).map(group => (
            <BlurFade key={group.title} delay={BLUR_FADE_DELAY * 10}>
              <div className="portfolio-project-featured rounded-[20px] p-4 sm:p-5">
                <h3 className="text-[17px] font-semibold tracking-[-0.025em]">{group.title}</h3>
                <ul className="mt-3 grid grid-cols-1 gap-x-6 gap-y-2.5 sm:grid-cols-2">
                  {group.skills.map(skill => (
                    <li key={skill} className="flex min-w-0 items-start gap-2.5 text-[14px] leading-relaxed">
                      <span aria-hidden="true" className="mt-[8px] size-1.5 shrink-0 rounded-full bg-muted-foreground/60" />
                      <span>{skill}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </BlurFade>
          ))}
          <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-2">
            {DATA.skillGroups.slice(1).map((group, index) => (
              <BlurFade key={group.title} delay={BLUR_FADE_DELAY * 10 + index * 0.03} className="h-full">
                <div className="h-full border-b border-border/70 py-3">
                  <h3 className="text-[15px] font-semibold leading-snug tracking-tight">{group.title}</h3>
                  <p className="mt-1.5 text-[13px] leading-[1.7] text-muted-foreground">{group.skills.join(" · ")}</p>
                </div>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>

      {featuredNotes.length > 0 && (
        <section id="notes" aria-labelledby="technical-notes-title" className="note-theme scroll-mt-8">
          <div className="flex items-baseline justify-between gap-4">
            <h2 id="technical-notes-title" className={SECTION_TITLE}>Notes</h2>
            <Link href="/blog" className="portfolio-project-link shrink-0 rounded-sm text-[14px] font-medium underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring">All notes <span aria-hidden="true">→</span></Link>
          </div>
          <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
            Practical answers when a website or app needs attention.
          </p>
          <ul className="mt-3 divide-y divide-border/70">
            {featuredNotes.map(note => (
              <li key={note.slug}>
                <NotePinboardCard
                  slug={note.slug}
                  title={note.metadata.title}
                  summary={note.metadata.summary}
                  minutes={readingMinutes(note.source)}
                  topic={getNotePresentation(note.slug).label}
                  compact
                />
              </li>
            ))}
          </ul>
        </section>
      )}

      <section id="additional-projects" aria-labelledby="additional-projects-title" className="scroll-mt-8">
        <BlurFade delay={BLUR_FADE_DELAY * 11}>
          <h2 id="additional-projects-title" className={SECTION_TITLE}>Additional Projects</h2>
          <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
            Earlier web, design and digital experience delivery, alongside independent architecture explorations.
          </p>
        </BlurFade>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {DATA.projects.filter((project) => !("featured" in project && project.featured)).map((project, index) => (
            <BlurFade key={project.title} delay={BLUR_FADE_DELAY * 12 + index * 0.05} className="h-full">
              <ProjectCard variant="compact" title={project.title} href={project.href} description={project.description}
                dates={project.dates} tags={project.technologies} image={project.image}
                video={project.video} links={project.links} />
            </BlurFade>
          ))}
        </div>
      </section>

      <section id="contact">
        <div className="grid items-center justify-center gap-4 px-4 text-center md:px-6 w-full py-12">
          <BlurFade delay={BLUR_FADE_DELAY * 16}>
            <div className="space-y-3">
              <p className="text-[13px] font-medium text-muted-foreground">Contact</p>
              <h2 className="text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
                Get in Touch
              </h2>
              <p className="mx-auto max-w-md text-[15px] leading-relaxed text-muted-foreground sm:text-base">
                {contactReady ? <>Have a project, role, or collaboration in mind? Tell me a little about it.</> : <>
                Want to chat? The best way to reach me is on{" "}
                <Link
                  href={DATA.contact.social.LinkedIn.url}
                  className="text-blue-600 dark:text-blue-400 underline underline-offset-4"
                >
                  LinkedIn
                </Link>
                . Send me a connection request or message with a clear question,
                and I&apos;ll respond whenever I can.
                </>}
              </p>
              <ContactButton />
              {contactReady && <p className="text-sm text-muted-foreground">Or connect on <Link href={DATA.contact.social.LinkedIn.url} className="underline underline-offset-4">LinkedIn</Link>.</p>}
            </div>
          </BlurFade>
        </div>
      </section>

    </main>
  );
}
