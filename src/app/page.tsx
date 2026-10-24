import BlurFade from "@/components/magicui/blur-fade";
import { DiaTextReveal } from "@/components/ui/dia-text-reveal";
import { ProjectCard } from "@/components/project-card";
import { ResumeCard } from "@/components/resume-card";
import { HeroLanyard } from "@/components/hero-lanyard";
import { ContactButton } from "@/components/contact-provider";
import { contactFormAvailable } from "@/lib/contact/config";
import { DATA } from "@/data/resume";
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
  visible: { y: 0, opacity: 1, filter: "blur(0px)" },
};
const HERO_REVEAL_PROPS = {
  respectReducedMotion: true,
  variant: HERO_REVEAL_VARIANT,
  duration: HERO_REVEAL_DURATION,
  className: "motion-reduce:!opacity-100 motion-reduce:!transform-none motion-reduce:!filter-none",
};

export default function Page() {
  const contactReady = contactFormAvailable();
  return (
    <main className="flex flex-col min-h-[100dvh] space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "WebSite",
                "@id": `${DATA.url}/#website`,
                name: DATA.name,
                url: DATA.url,
                publisher: { "@id": `${DATA.url}/#person` },
              },
              {
                "@type": "Person",
                "@id": `${DATA.url}/#person`,
                name: DATA.name,
                url: DATA.url,
                jobTitle: DATA.professionalLabel,
                knowsAbout: DATA.skillGroups[0].skills,
                image: new URL(DATA.avatarUrl, DATA.url).toString(),
                sameAs: [DATA.contact.social.LinkedIn.url, DATA.contact.social.GitHub.url],
              },
            ],
          }).replace(/</g, "\\u003c"),
        }}
      />
      <section id="hero">
        <div className="mx-auto w-full max-w-2xl space-y-8">
          <div className="grid grid-cols-[minmax(0,1fr)_88px] items-center gap-x-3 gap-y-1.5 sm:flex sm:items-start sm:gap-2 sm:justify-between">
            <div className="contents sm:flex sm:flex-col min-w-0 flex-1 sm:space-y-1.5">
              <BlurFade {...HERO_REVEAL_PROPS} delay={0.02}
                className={`${HERO_REVEAL_PROPS.className} col-start-1 row-start-1 min-w-0`}>
                <p className="mb-2 text-base font-medium text-muted-foreground sm:text-xl">Hi, I&apos;m Hamza 👋</p>
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
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-foreground text-background px-3 py-1 text-sm">
                  Engineering & Delivery
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  {DATA.projectsTitle}
                </h2>
                <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
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
                className={id === 0 ? "sm:col-span-2" : undefined}
              >
                <ProjectCard
                  href={project.href}
                  key={project.title}
                  title={project.title}
                  description={project.description}
                  highlights={"highlights" in project ? project.highlights : undefined}
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
