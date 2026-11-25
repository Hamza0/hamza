import BlurFade from "@/components/magicui/blur-fade";
import { DiaTextReveal } from "@/components/ui/dia-text-reveal";
import { ProjectCard } from "@/components/project-card";
import { ResumeCard } from "@/components/resume-card";
import { HeroLanyard } from "@/components/hero-lanyard";
import { ContactButton } from "@/components/contact-provider";
import { contactFormAvailable } from "@/lib/contact/config";
import { DATA } from "@/data/resume";
import { getBlogPosts } from "@/data/blog";
import { getFeaturedNotes } from "@/lib/note-order";
import { getNotePresentation } from "@/lib/note-presentation";
import { PROFILE, SITE_UPDATED_AT } from "@/lib/site";
import { PERSON_ID, WEBSITE_ID, serializeJsonLd } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";
import Markdown from "react-markdown";

export const metadata: Metadata = {
  alternates: { canonical: DATA.url },
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
  const editorialNotes = getFeaturedNotes(posts);
  const latestNotes = posts.slice(0, 2);
  const featuredNotes = [
    ...latestNotes,
    ...posts.filter((note) => note.slug === "google-business-profile-address-change-help"),
    ...editorialNotes,
  ].filter((note, index, notes) => notes.findIndex((entry) => entry.slug === note.slug) === index).slice(0, 5);
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

      <section id="projects">
        <div className="space-y-6 w-full">
          <BlurFade delay={BLUR_FADE_DELAY * 11}>
            <div className="flex flex-col space-y-3">
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  {DATA.projectsTitle}
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {DATA.projectsIntro}
                </p>
              </div>
            </div>
          </BlurFade>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 max-w-[800px] mx-auto">
            {DATA.projects.filter((project) => "featured" in project && project.featured).map((project, id) => (
              <BlurFade
                key={project.title}
                delay={BLUR_FADE_DELAY * 4 + id * 0.05}
              >
                <ProjectCard
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

      <section id="about">
        <BlurFade delay={BLUR_FADE_DELAY * 3}>
          <h2 className="text-xl font-bold">About</h2>
        </BlurFade>
        <BlurFade delay={BLUR_FADE_DELAY * 4}>
          <Markdown className="prose max-w-full text-pretty font-sans text-sm text-muted-foreground dark:prose-invert">
            {DATA.summary}
          </Markdown>
          <nav aria-label="Professional profiles" className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
            <Link href={DATA.contact.social.LinkedIn.url} rel="me" className="underline underline-offset-4">LinkedIn</Link>
            <Link href="https://www.codedsquare.com/" className="underline underline-offset-4">Coded Square</Link>
          </nav>
        </BlurFade>
      </section>

      <section id="work">
        <div className="flex min-h-0 flex-col gap-y-3">
          <BlurFade delay={BLUR_FADE_DELAY * 5}>
            <h2 className="text-xl font-bold">Work Experience</h2>
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
            <h2 className="text-xl font-bold">Education</h2>
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

      <section id="skills">
        <div className="flex min-h-0 flex-col gap-y-3">
          <BlurFade delay={BLUR_FADE_DELAY * 9}>
            <h2 className="text-xl font-bold">Skills</h2>
          </BlurFade>
          <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
            {DATA.skillGroups.map((group, index) => (
              <BlurFade key={group.title} delay={BLUR_FADE_DELAY * 10 + index * 0.05}
                className={index === 0 || index === DATA.skillGroups.length - 1 ? "sm:col-span-2" : undefined}>
                <div className={index === 0 ? "rounded-lg border p-4" : undefined}>
                  <h3 className="mb-2 text-sm font-semibold">{group.title}</h3>
                  {index === 0 ? (
                    <ul className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
                      {group.skills.map((skill) => <li key={skill}>{skill}</li>)}
                    </ul>
                  ) : (
                    <p className="text-xs leading-relaxed text-muted-foreground">{group.skills.join(" · ")}</p>
                  )}
                </div>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>

      {featuredNotes.length > 0 && (
        <section id="notes" aria-labelledby="technical-notes-title" className="scroll-mt-8">
          <div className="flex items-baseline justify-between gap-4">
            <h2 id="technical-notes-title" className="text-xl font-bold">Notes</h2>
            <Link href="/blog" className="shrink-0 text-sm underline underline-offset-4">All notes →</Link>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
              Practical help with websites and business tools.
          </p>
          <ul className="mt-3 divide-y divide-border/50">
            {featuredNotes.map((note) => (
              <li key={note.slug}>
                <Link href={`/blog/${note.slug}`} className={`note-theme note-tone-${getNotePresentation(note.slug).tone} note-list-link group -mx-3 block rounded-lg px-3 py-4 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring`}>
                  <span className="note-accent mb-2 block text-xs font-medium">{getNotePresentation(note.slug).label}</span>
                  <h3 className="text-sm font-semibold group-hover:underline underline-offset-4">{note.metadata.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{note.metadata.summary}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section id="additional-projects" aria-labelledby="additional-projects-title" className="scroll-mt-8">
        <BlurFade delay={BLUR_FADE_DELAY * 11}>
          <h2 id="additional-projects-title" className="text-xl font-bold">Additional Projects</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Earlier web, design and digital experience delivery, alongside independent architecture explorations.
          </p>
        </BlurFade>
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {DATA.projects.filter((project) => !("featured" in project && project.featured)).map((project, index) => (
            <BlurFade key={project.title} delay={BLUR_FADE_DELAY * 12 + index * 0.05}>
              <ProjectCard title={project.title} href={project.href} description={project.description}
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
              <div className="inline-block rounded-lg bg-foreground text-background px-3 py-1 text-sm">
                Contact
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Get in Touch
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
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
