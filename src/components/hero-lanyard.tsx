"use client";

import BlurFade from "@/components/magicui/blur-fade";
import dynamic from "next/dynamic";
import { Component, useEffect, useRef, useState, type ReactNode } from "react";

const loadLanyard = () => import("@/components/ui/lanyard");
const Lanyard = dynamic(loadLanyard, { ssr: false, loading: () => null });
class LanyardBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? null : this.props.children; }
}
const AVATAR_VARIANT = {
  hidden: { y: 6, opacity: 0, filter: "blur(6px)" },
  visible: { y: 0, opacity: 1, filter: "blur(0px)" },
};

export function HeroLanyard() {
  const anchorRef = useRef<HTMLDivElement>(null);
  const [desktop, setDesktop] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 640px)");
    let idle: number | undefined;
    let frame: number | undefined;
    const cancel = () => {
      if (idle !== undefined) window.cancelIdleCallback(idle);
      if (frame !== undefined) cancelAnimationFrame(frame);
    };
    const update = () => {
      cancel();
      setDesktop(false);
      setReady(false);
      if (!media.matches) return;
      // Keep the desktop-only module behind the media check, after content paint.
      const activate = () => { if (media.matches) setDesktop(true); };
      if ("requestIdleCallback" in window) idle = window.requestIdleCallback(activate, { timeout: 1000 });
      else frame = requestAnimationFrame(activate);
    };
    update();
    media.addEventListener("change", update);
    return () => { cancel(); media.removeEventListener("change", update); };
  }, []);

  return (
    <div className="col-start-2 row-start-1 w-[88px] self-center sm:w-auto sm:shrink-0 sm:self-start">
      <link rel="preload" as="image" href="/hamza-portrait.webp" crossOrigin="anonymous" media="(min-width: 640px)" />
      <BlurFade
        respectReducedMotion duration={0.4} delay={0.06}
        variant={AVATAR_VARIANT}
        className="sm:hidden motion-reduce:!opacity-100 motion-reduce:!transform-none motion-reduce:!filter-none"
      >
        <picture>
          <source media="(min-width: 640px)" srcSet="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'/%3E" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/hamza-avatar.webp" alt="Hamza Shakeel" width={88} height={88}
            fetchPriority="high" decoding="async" className="size-[88px] rounded-full object-cover" />
        </picture>
      </BlurFade>
      <div className="hero-lanyard" data-ready={String(ready)}>
        <div ref={anchorRef} className="hero-lanyard-anchor">
          <div className="lanyard-fallback">
            <span className="lanyard-fallback-strap" aria-hidden="true" />
            {/* Keep the original portrait and badge footprint visible until WebGL is ready. */}
            <picture>
              <source media="(min-width: 640px)" srcSet="/hamza-portrait.webp" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img crossOrigin="anonymous" decoding="async" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='640' height='900'/%3E" alt="Portrait of Hamza Shakeel" />
            </picture>
          </div>
        </div>
      </div>
      {desktop && (
        <LanyardBoundary><Lanyard
          anchorElement={anchorRef}
          onReady={() => setReady(true)}
          onUnavailable={() => setReady(false)}
          frontImage="/hamza-portrait.webp"
          orientation="portrait"
          finish="matte"
          cardColor="#faf9f6"
          strapColor="#18181b"
          metal="silver"
          cornerRadius={0.4}
          hangFromPageTop
          size={0.9}
          strapLength={0.05}
          strapWidth={0.55}
          breeze={0.2}
          damping={0.65}
          interactive
          intro={false}
        /></LanyardBoundary>
      )}
    </div>
  );
}
