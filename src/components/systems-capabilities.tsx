"use client";

import { Fragment, useRef } from "react";
import { AnimatedBeam } from "@/components/ui/animated-beam";

export function SystemsCapabilities() {
  const containerRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const webRef = useRef<HTMLDivElement>(null);
  const dataRef = useRef<HTMLDivElement>(null);
  const crmRef = useRef<HTMLDivElement>(null);
  const cloudRef = useRef<HTMLDivElement>(null);
  const connections = [webRef, dataRef, crmRef, cloudRef];
  const nodeClass =
    "relative z-10 flex h-16 w-full max-w-40 items-center justify-center rounded-lg border border-foreground/20 bg-muted/70 px-2 text-center text-xs font-medium leading-tight tracking-tight shadow-sm sm:h-14 sm:px-3 sm:text-sm";

  return (
    <div className="mt-3">
      <div
        ref={containerRef}
        role="group"
        aria-label="Web Applications, Data & Forecasting, CRM & Integrations, and Cloud & Production connected through Digital Systems"
        className="relative grid h-60 w-full grid-cols-3 grid-rows-3 items-center gap-x-2 [--beam-start:#6366f1] [--beam-end:#0891b2] sm:h-52 sm:gap-x-5 dark:[--beam-start:#818cf8] dark:[--beam-end:#22d3ee]"
      >
        <div ref={webRef} className={`${nodeClass} col-start-1 row-start-1`}>
          Web Applications
        </div>
        <div
          ref={centerRef}
          className="relative z-10 col-start-2 row-start-2 flex h-16 w-full max-w-32 items-center justify-center justify-self-center rounded-lg border border-blue-500/30 bg-background px-2 text-center text-sm font-semibold leading-tight tracking-tight shadow-sm dark:border-cyan-400/30"
        >
          Digital Systems
        </div>
        <div
          ref={dataRef}
          className={`${nodeClass} col-start-3 row-start-1 justify-self-end`}
        >
          Data &amp; Forecasting
        </div>
        <div
          ref={crmRef}
          className={`${nodeClass} col-start-1 row-start-3`}
        >
          CRM &amp; Integrations
        </div>
        <div
          ref={cloudRef}
          className={`${nodeClass} col-start-3 row-start-3 justify-self-end`}
        >
          Cloud &amp; Production
        </div>
        {connections.map((fromRef, index) => (
          <Fragment key={index}>
            <AnimatedBeam
              anchorToEdges
              containerRef={containerRef}
              fromRef={fromRef}
              toRef={centerRef}
              pathColor="hsl(var(--foreground))"
              pathOpacity={0.16}
              pathWidth={2}
              gradientStartColor="var(--beam-start)"
              gradientStopColor="var(--beam-end)"
              glow
              duration={3.4 + index * 0.3}
              delay={index * 0.35}
              repeatDelay={0.25}
            />
            <AnimatedBeam
              anchorToEdges
              containerRef={containerRef}
              fromRef={fromRef}
              toRef={centerRef}
              reverse
              showBasePath={false}
              beamOpacity={0.5}
              pathWidth={1.5}
              gradientStartColor="var(--beam-end)"
              gradientStopColor="var(--beam-start)"
              glow
              duration={5.2 + index * 0.4}
              delay={0.65 + index * 0.45}
              repeatDelay={0.4}
            />
          </Fragment>
        ))}
      </div>
      <p className="mt-2 text-sm text-muted-foreground text-pretty">
        Building across the full path from interface and application logic to
        data, integrations, infrastructure and production support.
      </p>
    </div>
  );
}
