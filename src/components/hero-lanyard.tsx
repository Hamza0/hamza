"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

function CardPlaceholder() {
  return (
    <div className="lanyard-fallback" aria-hidden="true">
      <span className="lanyard-fallback-strap" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/hamza-id-front.svg" alt="" />
    </div>
  );
}

const Lanyard = dynamic(() => import("@/components/ui/lanyard"), {
  ssr: false,
  loading: CardPlaceholder,
});

export function HeroLanyard() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let idle: number | undefined;
    // Let the existing hero reveal finish before requesting the 3D module.
    const timer = setTimeout(() => {
      if ("requestIdleCallback" in window) {
        idle = window.requestIdleCallback(() => setReady(true), { timeout: 1000 });
      } else {
        setReady(true);
      }
    }, 1500);
    return () => {
      clearTimeout(timer);
      if (idle !== undefined) window.cancelIdleCallback(idle);
    };
  }, []);

  return (
    <div className="hero-lanyard">
      {ready ? (
        <Lanyard
          frontImage="/images/hamza-id-front.svg"
          backImage="/images/hamza-id-back.svg"
          orientation="portrait"
          finish="matte"
          cardColor="#faf9f6"
          strapColor="#18181b"
          metal="silver"
          cornerRadius={0.2}
          size={0.76}
          strapLength={0.05}
          strapWidth={0.55}
          breeze={0.2}
          damping={0.65}
          interactive
          intro
        />
      ) : <CardPlaceholder />}
    </div>
  );
}
