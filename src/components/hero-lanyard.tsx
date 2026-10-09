"use client";

import BlurFade from "@/components/magicui/blur-fade";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const loadLanyard = () => import("@/components/ui/lanyard");
const Lanyard = dynamic(loadLanyard, { ssr: false, loading: () => null });
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
    const update = () => {
      setDesktop(media.matches);
      setReady(false);
      if (media.matches) void loadLanyard();
    };
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return (
    <div className="col-start-2 row-start-1 w-[88px] self-center sm:w-auto sm:shrink-0 sm:self-start">
      <link rel="preload" as="image" href="/hamza-profile.png" media="(min-width: 640px)" />
      <BlurFade
        initial="hidden" respectReducedMotion duration={0.4} delay={0.06}
        variant={AVATAR_VARIANT}
        className="sm:hidden motion-reduce:!opacity-100 motion-reduce:!transform-none motion-reduce:!filter-none"
      >
        <Image src="/hamza-profile.png" alt="Hamza Shakeel" width={88} height={88}
          priority sizes="88px" className="size-[88px] rounded-full object-cover" />
      </BlurFade>
      <div ref={anchorRef} className="hero-lanyard" data-ready={String(ready)}>
        <div className="lanyard-fallback">
          <span className="lanyard-fallback-strap" aria-hidden="true" />
          {/* Keep the original portrait and badge footprint visible until WebGL is ready. */}
          <picture>
            <source media="(min-width: 640px)" srcSet="/hamza-profile.png" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='640' height='900'/%3E" alt="Portrait of Hamza Shakeel" />
          </picture>
        </div>
      </div>
      {desktop && (
        <Lanyard
          anchorElement={anchorRef}
          onReady={() => setReady(true)}
          frontImage="/hamza-profile.png"
          orientation="portrait"
          finish="matte"
          cardColor="#faf9f6"
          strapColor="#18181b"
          metal="silver"
          cornerRadius={0.2}
          size={0.9}
          strapLength={0.05}
          strapWidth={0.55}
          breeze={0.2}
          damping={0.65}
          interactive
          intro={false}
        />
      )}
    </div>
  );
}
