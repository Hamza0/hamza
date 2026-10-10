import { buttonVariants } from "@/components/ui/button";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true, googleBot: { index: false, follow: true } },
};

export default function NotFound() {
  return (
    <main className="flex min-h-[60svh] flex-col items-center justify-center gap-6 pb-16 text-center">
      <div className="space-y-3">
        <p className="text-sm font-medium tracking-widest text-muted-foreground">
          404
        </p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          This page doesn’t exist.
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Looks like you wandered a little too far.
        </p>
      </div>
      <Link
        href="/"
        className={buttonVariants({ className: "motion-reduce:transition-none" })}
      >
        Back home
      </Link>
    </main>
  );
}
