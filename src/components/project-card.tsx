import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import Markdown from "react-markdown";

interface Props {
  title: string;
  href?: string;
  description: string;
  dates: string;
  highlights?: readonly string[];
  tags: readonly string[];
  link?: string;
  image?: string;
  video?: string;
  links?: readonly {
    icon: React.ReactNode;
    type: string;
    href: string;
  }[];
  className?: string;
  variant?: "featured" | "compact";
}

export function ProjectCard({
  title, href, description, dates, highlights, tags, link, image, video, links,
  className, variant = "compact",
}: Props) {
  const trimmedHref = href?.trim();
  const projectHref = trimmedHref && trimmedHref !== "#" ? trimmedHref : undefined;
  const projectLinks = links?.filter(item => item.href.trim() && item.href.trim() !== "#") ?? [];
  const divider = title.indexOf(" – ");
  const organization = divider >= 0 ? title.slice(0, divider) : undefined;
  const projectName = divider >= 0 ? title.slice(divider + 3) : title;
  const featured = variant === "featured";
  const media = (
    <>
      {video && <video src={video} autoPlay loop muted playsInline className="mx-auto h-40 w-full object-cover object-top motion-reduce:hidden" />}
      {image && <Image src={image} alt={title} width={500} height={300} className="h-40 w-full object-cover object-top" />}
    </>
  );

  return (
    <article className={cn(
      "portfolio-project-card flex h-full min-w-0 flex-col overflow-hidden rounded-[20px]",
      featured ? "portfolio-project-featured" : "border border-border/80 bg-card",
      className
    )}>
      {(video || image) && (projectHref ? <Link href={projectHref} aria-label={"View " + title} className="block">{media}</Link> : <div>{media}</div>)}
      <div className={cn("flex flex-1 flex-col", featured ? "p-5" : "p-4")}>
        <header className="space-y-1.5">
          <h3 className={cn("leading-[1.3] font-semibold tracking-[-0.025em]", featured ? "text-[19px]" : "text-[17px]")}>
            {organization && <span className="mb-1 block text-[12px] font-medium leading-snug tracking-normal text-muted-foreground">{organization}<span className="sr-only">: </span></span>}
            {projectHref ? <Link href={projectHref} className="rounded-sm underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring">{projectName}</Link> : projectName}
          </h3>
          <p className="text-[12px] leading-relaxed text-muted-foreground">{dates}</p>
          {link && <p className="hidden break-all text-xs print:block">{link}</p>}
        </header>
        <Markdown className="project-description mt-3 min-w-0 text-[14px] leading-[1.6] text-muted-foreground">{description}</Markdown>
        {highlights && highlights.length > 0 && <ul className="mt-3 list-disc space-y-1 pl-4 text-sm leading-relaxed text-muted-foreground">{highlights.map(item => <li key={item}>{item}</li>)}</ul>}
        <div className="mt-auto">
          {tags.length > 0 && (
            <p aria-label="Technologies" className="mt-4 break-words border-t border-border/70 pt-3 text-[12px] leading-[1.65] text-muted-foreground">
              {tags.join(" · ")}
            </p>
          )}
          {projectLinks.length > 0 && (
            <ul aria-label="Project links" className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
              {projectLinks.map((item, i) => {
                const external = /^https?:\/\//i.test(item.href);
                return <li key={item.href + i} className="min-w-0">
                  <Link href={item.href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined} aria-label={item.type + ": " + title + (external ? " (opens in new tab)" : "")} className="portfolio-project-link inline-flex min-h-8 items-center gap-1.5 rounded-sm text-[13px] font-medium leading-snug underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
                    <span aria-hidden="true" className="shrink-0">{item.icon}</span>{item.type}
                  </Link>
                </li>;
              })}
            </ul>
          )}
        </div>
      </div>
    </article>
  );
}
