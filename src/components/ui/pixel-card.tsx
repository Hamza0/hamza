"use client";

// Compact adaptation of React Bits' PixelCard, without continuous shimmer:
// https://github.com/DavidHDev/react-bits/tree/main/src/content/Components/PixelCard
import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type AnimationMode = "appear" | "disappear";

class Pixel {
  size = 0;
  readonly maxSize = 1 + Math.random() * 1.4;

  constructor(
    readonly x: number,
    readonly y: number,
    readonly color: string,
    readonly delay: number,
  ) {}

  draw(context: CanvasRenderingContext2D) {
    const offset = (2.4 - this.size) / 2;
    context.fillStyle = this.color;
    context.fillRect(this.x + offset, this.y + offset, this.size, this.size);
  }

  update(mode: AnimationMode, elapsed: number, delta: number, speed: number) {
    if (mode === "appear") {
      if (elapsed < this.delay) return false;
      this.size = Math.min(this.maxSize, this.size + this.maxSize * delta * speed / 12000);
      return this.size === this.maxSize;
    }
    this.size = Math.max(0, this.size - this.maxSize * delta / 280);
    return this.size === 0;
  }
}

type PixelCardProps = {
  labelId: string;
  gap?: number;
  speed?: number;
  className?: string;
  children: ReactNode;
};

export function PixelCard({
  labelId,
  gap = 9,
  speed = 16,
  className,
  children,
}: PixelCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hoveredRef = useRef(false);
  const focusedRef = useRef(false);
  const animateRef = useRef<(mode: AnimationMode) => void>(() => {});

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!container || !canvas || !context) return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let width = 0;
    let height = 0;
    let pixels: Pixel[] = [];
    let palette = "";
    let visible = false;
    const spacing = Math.max(8, Math.min(10, gap));
    const animationSpeed = Math.max(1, Math.min(25, speed));

    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };
    const animate = (mode: AnimationMode) => {
      stop();
      if (!visible || document.hidden) return;
      if (media.matches) {
        context.clearRect(0, 0, width, height);
        container.dataset.pixelAnimation = "disabled";
        return;
      }
      let start = 0;
      let previous = 0;
      container.dataset.pixelAnimation = mode;
      const tick = (now: number) => {
        if (!start) start = now;
        const delta = previous ? Math.min(32, now - previous) : 16;
        previous = now;
        context.clearRect(0, 0, width, height);
        let settled = true;
        for (const pixel of pixels) {
          if (!pixel.update(mode, now - start, delta, animationSpeed)) settled = false;
          pixel.draw(context);
        }
        if (settled) {
          frame = 0;
          container.dataset.pixelAnimation = "idle";
        } else {
          frame = requestAnimationFrame(tick);
        }
      };
      frame = requestAnimationFrame(tick);
    };

    const initPixels = () => {
      stop();
      if (!visible || document.hidden) return;
      const rect = container.getBoundingClientRect();
      width = Math.floor(rect.width);
      height = Math.floor(rect.height);
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      palette = getComputedStyle(container).getPropertyValue("--pixel-card-colors").trim();
      const colors = (palette || "#93c5fd").split(",").map(color => color.trim());
      pixels = [];
      container.dataset.pixelAnimation = media.matches ? "disabled" : "idle";
      if (media.matches) return;
      for (let x = 0; x < width; x += spacing) {
        for (let y = 0; y < height; y += spacing) {
          // Leave space between the pixels to keep the text visually quiet.
          if (Math.random() > 0.55) continue;
          const color = colors[Math.floor(Math.random() * colors.length)];
          const delay = Math.hypot(x - width / 2, y - height / 2) * 2;
          pixels.push(new Pixel(x, y, color, delay));
        }
      }
      if (hoveredRef.current || focusedRef.current) animate("appear");
    };

    animateRef.current = animate;
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) initPixels();
      else stop();
    }, { rootMargin: "100px" });
    intersectionObserver.observe(container);
    const onVisibility = () => { if (document.hidden) stop(); else initPixels(); };
    document.addEventListener("visibilitychange", onVisibility);
    const resizeObserver = new ResizeObserver(initPixels);
    resizeObserver.observe(container);
    const themeObserver = new MutationObserver(() => {
      if (!visible || document.hidden) return;
      const nextPalette = getComputedStyle(container).getPropertyValue("--pixel-card-colors").trim();
      if (nextPalette !== palette) initPixels();
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    media.addEventListener("change", initPixels);
    return () => {
      stop();
      resizeObserver.disconnect();
      themeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      media.removeEventListener("change", initPixels);
      animateRef.current = () => {};
    };
  }, [gap, speed]);

  const updateActivity = () => {
    animateRef.current(hoveredRef.current || focusedRef.current ? "appear" : "disappear");
  };

  return (
    <div
      ref={containerRef}
      role="group"
      aria-labelledby={labelId}
      tabIndex={0}
      className={cn("pixel-card", className)}
      onMouseEnter={() => { hoveredRef.current = true; updateActivity(); }}
      onMouseLeave={() => { hoveredRef.current = false; updateActivity(); }}
      onFocus={() => { focusedRef.current = true; updateActivity(); }}
      onBlur={event => {
        if (event.currentTarget.contains(event.relatedTarget)) return;
        focusedRef.current = false;
        updateActivity();
      }}
    >
      <canvas ref={canvasRef} className="pixel-card__canvas" aria-hidden="true" />
      <div className="pixel-card__content">{children}</div>
    </div>
  );
}
