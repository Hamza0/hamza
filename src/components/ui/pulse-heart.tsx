"use client";

// Heart-only adaptation of React Bits' PulseHeart:
// https://github.com/DavidHDev/react-bits/tree/main/src/content/Micro/PulseHeart
import { FavouriteIcon } from "@hugeicons/core-free-icons";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

const OUT = 0.4;
const ICONS = { heart: FavouriteIcon };

function swellOf(t: number, overshoot: number) {
  if (t <= 0) return 0;
  if (t < OUT) return 1 - (1 - t / OUT) ** 3;
  const u = (t - OUT) / (1 - OUT) - 1;
  return -((overshoot + 1) * u ** 3 + overshoot * u ** 2);
}

type PulseHeartProps = {
  noteSlug: string;
  icon?: "heart";
  showCount?: boolean;
  size?: number;
  label?: string;
  className?: string;
};

type PulseHeartStyle = CSSProperties & {
  "--ph-size": string;
  "--ph-stroke": string;
};

export function PulseHeart({
  noteSlug,
  icon = "heart",
  showCount = false,
  size = 26,
  label = "Like this note",
  className,
}: PulseHeartProps) {
  // Match the server markup first; read the visitor's preference after hydration.
  const [liked, setLiked] = useState(false);
  const [shownLiked, setShownLiked] = useState(false);
  const [ready, setReady] = useState(false);
  const rootRef = useRef<HTMLButtonElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  const glyphRef = useRef<SVGGElement>(null);
  const rafRef = useRef(0);
  const logicalLikedRef = useRef(false);
  const storageKey = `portfolio-note-liked:${noteSlug}`;
  const countKey = `portfolio-note-count:${noteSlug}`;
  const descriptionId = `note-like-preference-${noteSlug}`;

  const stopAnimation = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = 0;
    glyphRef.current?.removeAttribute("transform");
    if (pillRef.current) pillRef.current.style.transform = "";
    if (rootRef.current) delete rootRef.current.dataset.running;
  }, []);

  useEffect(() => {
    let savedLiked = false;
    try {
      savedLiked = localStorage.getItem(storageKey) === "true";
      localStorage.setItem(countKey, savedLiked ? "1" : "0");
    } catch {
      // Storage may be unavailable; the button still works for this visit.
    }
    logicalLikedRef.current = savedLiked;
    setLiked(savedLiked);
    setShownLiked(savedLiked);
    setReady(true);

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleMotionChange = () => {
      if (media.matches) {
        stopAnimation();
        setShownLiked(logicalLikedRef.current);
      }
    };
    media.addEventListener("change", handleMotionChange);
    return () => {
      stopAnimation();
      media.removeEventListener("change", handleMotionChange);
    };
  }, [storageKey, countKey, stopAnimation]);

  const handleClick = () => {
    const nextLiked = !logicalLikedRef.current;
    logicalLikedRef.current = nextLiked;
    setLiked(nextLiked);
    try {
      localStorage.setItem(storageKey, String(nextLiked));
      localStorage.setItem(countKey, nextLiked ? "1" : "0");
    } catch {
      // Keep the local interaction available even when persistence is blocked.
    }

    stopAnimation();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShownLiked(nextLiked);
      return;
    }

    if (rootRef.current) rootRef.current.dataset.running = "";
    const startedAt = performance.now();
    let swapped = false;
    const tick = (now: number) => {
      const t = Math.min(1, (now - startedAt) / 500);
      const swell = swellOf(t, 1.4);
      const scale = 1 - 0.5 * swell;
      glyphRef.current?.setAttribute(
        "transform",
        `translate(12 12) scale(${scale}) translate(-12 -12)`,
      );
      if (pillRef.current) {
        pillRef.current.style.transform = `scale(${1 - 0.02 * swell})`;
      }
      if (!swapped && t >= OUT) {
        swapped = true;
        setShownLiked(nextLiked);
      }
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
      else {
        stopAnimation();
        setShownLiked(nextLiked);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  return (
    <button
      ref={rootRef}
      type="button"
      aria-label={showCount ? `${label}: ${liked ? 1 : 0}` : label}
      aria-pressed={liked}
      aria-describedby={descriptionId}
      disabled={!ready}
      data-liked={String(shownLiked)}
      data-no-count={showCount ? undefined : ""}
      className={cn("pulse-heart", className)}
      style={{
        "--ph-size": `${size}px`,
        "--ph-stroke": `${(1.5 * size) / 24}px`,
      } as PulseHeartStyle}
      onClick={handleClick}
    >
      <span ref={pillRef} className="pulse-heart__pill">
        <span className="pulse-heart__heart" aria-hidden="true">
          <svg viewBox="0 0 24 24" focusable="false" xmlns="http://www.w3.org/2000/svg">
            <g ref={glyphRef}>
              {ICONS[icon].map(([, attrs]) => (
                <path key={String(attrs.key)} d={String(attrs.d)} vectorEffect="non-scaling-stroke" />
              ))}
            </g>
          </svg>
        </span>
        {showCount && <span className="pulse-heart__count" aria-hidden="true">{liked ? 1 : 0}</span>}
      </span>
      <span id={descriptionId} className="sr-only">Your like on this device: {liked ? 1 : 0}. This is not a count of other readers.</span>
    </button>
  );
}
