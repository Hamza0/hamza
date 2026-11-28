"use client";

import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { flushSync } from "react-dom";
import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

// Circle reveal adapted from Magic UI's Animated Theme Toggler:
// https://magicui.design/docs/components/animated-theme-toggler
// Retain next-themes as the single owner of the persisted preference.
export const ModeToggle = forwardRef<HTMLButtonElement, ComponentPropsWithoutRef<"button">>(
  function ModeToggle({ className, onClick, ...props }, ref) {
    const { setTheme } = useTheme();

    return (
      <Button
        {...props}
        ref={ref}
        variant="ghost"
        type="button"
        size="icon"
        aria-label="Toggle color theme"
        className={cn("px-2", className)}
        onClick={event => {
          onClick?.(event);
          if (event.defaultPrevented) return;
          const root = document.documentElement;
          if (root.dataset.portfolioThemeTransition === "active") return;
          const next = root.classList.contains("dark") ? "light" : "dark";
          const apply = () => {
            root.classList.toggle("dark", next === "dark");
            root.classList.toggle("light", next === "light");
            root.style.colorScheme = next;
            setTheme(next);
          };
          if (typeof document.startViewTransition !== "function" ||
              window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            apply();
            return;
          }
          const { left, top, width, height } = event.currentTarget.getBoundingClientRect();
          const w = window.innerWidth, h = window.innerHeight;
          if (!w || !h) { apply(); return; }
          const x = left + width / 2, y = top + height / 2;
          // Percentages match the view-transition snapshot on scaled displays.
          const origin = (x / w * 100) + "% " + (y / h * 100) + "%";
          const radius = Math.hypot(Math.max(x, w - x), Math.max(y, h - y));
          const radiusPercent = radius / (Math.hypot(w, h) / Math.SQRT2) * 100 + 1;
          root.dataset.portfolioThemeTransition = "active";
          root.style.setProperty("--portfolio-theme-clip-start", "circle(0% at " + origin + ")");
          root.style.setProperty("--portfolio-theme-clip-end", "circle(" + radiusPercent + "% at " + origin + ")");
          const cleanup = () => {
            delete root.dataset.portfolioThemeTransition;
            root.style.removeProperty("--portfolio-theme-clip-start");
            root.style.removeProperty("--portfolio-theme-clip-end");
          };
          try {
            const transition = document.startViewTransition(() => { flushSync(apply); });
            void transition.ready.catch(() => {});
            void transition.updateCallbackDone.catch(apply);
            void transition.finished.then(cleanup, cleanup);
          } catch {
            cleanup();
            apply();
          }
        }}
      >
        <SunIcon aria-hidden="true" className="h-[1.2rem] w-[1.2rem] text-neutral-800 dark:hidden dark:text-neutral-200" />
        <MoonIcon aria-hidden="true" className="hidden h-[1.2rem] w-[1.2rem] text-neutral-800 dark:block dark:text-neutral-200" />
      </Button>
    );
  }
);
