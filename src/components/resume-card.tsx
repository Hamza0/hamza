"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

interface ResumeCardProps {
  logoUrl: string;
  altText: string;
  title: string;
  subtitle?: string;
  href?: string;
  externalLink?: boolean;
  badges?: readonly string[];
  period: string;
  description?: string;
  variant?: "default" | "experience";
}
export const ResumeCard = ({
  logoUrl,
  altText,
  title,
  subtitle,
  href,
  externalLink = false,
  badges,
  period,
  description,
  variant = "default",
}: ResumeCardProps) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const descriptionId = React.useId();
  const prefersReducedMotion = useReducedMotion();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (description && !externalLink) {
      e.preventDefault();
      setIsExpanded(!isExpanded);
    }
  };

  if (variant === "experience") {
    return (
      <Card className="grid grid-cols-[3rem_minmax(0,1fr)] items-start gap-x-3 text-left">
        <Avatar className="size-12 border bg-muted-background dark:bg-foreground">
          <AvatarImage src={logoUrl} alt={altText} className="object-contain" />
          <AvatarFallback>{altText[0]}</AvatarFallback>
        </Avatar>
        <CardHeader className="min-w-0 gap-1">
          <div className="flex items-start gap-2">
            <h3 className="min-w-0 flex-1 break-words text-sm font-semibold leading-snug">
              {href ? (
                <Link
                  href={href}
                  target={externalLink ? "_blank" : undefined}
                  rel={externalLink ? "noopener noreferrer" : undefined}
                  aria-label={externalLink ? `${title} website (opens in a new tab)` : undefined}
                  className="block rounded-sm hover:underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2"
                >
                  {title}
                </Link>
              ) : title}
            </h3>
            {description && !externalLink && (
              <button
                type="button"
                aria-label={`${isExpanded ? "Collapse" : "Expand"} ${title} description`}
                aria-expanded={isExpanded}
                aria-controls={descriptionId}
                onClick={() => setIsExpanded(value => !value)}
                className="flex size-6 shrink-0 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2 motion-reduce:transition-none"
              >
                <ChevronRightIcon
                  aria-hidden="true"
                  className={cn(
                    "size-4 transition-transform duration-300 motion-reduce:transition-none",
                    isExpanded ? "rotate-90" : "rotate-0"
                  )}
                />
              </button>
            )}
          </div>
          {subtitle && <p className="break-words text-xs leading-relaxed">{subtitle}</p>}
          <p className="text-xs tabular-nums text-muted-foreground">{period}</p>
          {badges && badges.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {badges.map((badge, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="px-1.5 py-0 text-[10px] font-medium leading-4"
                >
                  {badge}
                </Badge>
              ))}
            </div>
          )}
        </CardHeader>
        {description && (externalLink ? (
          <div className="col-span-2 mt-2 min-w-0 text-xs leading-relaxed sm:col-span-1 sm:col-start-2 sm:text-sm">
            {description}
          </div>
        ) : (
          <motion.div
            id={descriptionId}
            aria-hidden={!isExpanded}
            initial={false}
            animate={{ opacity: isExpanded ? 1 : 0, height: isExpanded ? "auto" : 0, marginTop: isExpanded ? 8 : 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="col-span-2 min-w-0 overflow-hidden text-xs leading-relaxed sm:col-span-1 sm:col-start-2 sm:text-sm"
          >
            {description}
          </motion.div>
        ))}
      </Card>
    );
  }

  return (
    <Link
      href={href || "#"}
      className="block cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-4"
      target={externalLink ? "_blank" : undefined}
      rel={externalLink ? "noopener noreferrer" : undefined}
      aria-label={externalLink ? `${title} website (opens in a new tab)` : undefined}
      onClick={handleClick}
    >
      <Card className="flex">
        <div className="flex-none">
          <Avatar className="border size-12 m-auto bg-muted-background dark:bg-foreground">
            <AvatarImage
              src={logoUrl}
              alt={altText}
              className="object-contain"
            />
            <AvatarFallback>{altText[0]}</AvatarFallback>
          </Avatar>
        </div>
        <div className="min-w-0 flex-grow ml-4 items-center flex-col group">
          <CardHeader>
            <div className="flex items-center justify-between gap-x-2 text-base">
              <h3 className="min-w-0 inline-flex flex-wrap items-center justify-center font-semibold leading-none text-xs sm:text-sm">
                {title}
                {badges && (
                  <span className="inline-flex gap-x-1">
                    {badges.map((badge, index) => (
                      <Badge
                        variant="secondary"
                        className="align-middle text-xs"
                        key={index}
                      >
                        {badge}
                      </Badge>
                    ))}
                  </span>
                )}
                <ChevronRightIcon
                  className={cn(
                    "size-4 translate-x-0 transform opacity-0 transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:opacity-100",
                    isExpanded ? "rotate-90" : "rotate-0"
                  )}
                />
              </h3>
              <div className="text-xs sm:text-sm tabular-nums text-muted-foreground text-right">
                {period}
              </div>
            </div>
            {subtitle && <div className="font-sans text-xs">{subtitle}</div>}
          </CardHeader>
          {description && (externalLink ? (
            <div className="mt-2 text-xs sm:text-sm">{description}</div>
          ) : (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{
                opacity: isExpanded ? 1 : 0,

                height: isExpanded ? "auto" : 0,
              }}
              transition={{
                duration: 0.7,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="mt-2 text-xs sm:text-sm"
            >
              {description}
            </motion.div>
          ))}
        </div>
      </Card>
    </Link>
  );
};
