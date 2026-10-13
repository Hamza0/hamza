"use client";

import {
  motion,
  useAnimationControls,
  useInView,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { useEffect, useRef } from "react";

interface BlurFadeProps {
  children: React.ReactNode;
  className?: string;
  variant?: Variants;
  duration?: number;
  delay?: number;
  yOffset?: number;
  inView?: boolean;
  inViewMargin?: NonNullable<Parameters<typeof useInView>[1]>["margin"];
  blur?: string;
  respectReducedMotion?: boolean;
}

const BlurFade = ({
  children,
  className,
  variant,
  duration = 0.4,
  delay = 0,
  yOffset = 6,
  inView = true,
  inViewMargin = "-50px",
  blur = "6px",
  respectReducedMotion = true,
}: BlurFadeProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const reduceMotion = respectReducedMotion && prefersReducedMotion;
  const controls = useAnimationControls();
  const played = useRef(false);

  const inViewResult = useInView(ref, {
    once: true,
    margin: inViewMargin,
  });

  const isInView = !inView || inViewResult;

  const defaultVariants: Variants = {
    hidden: { y: yOffset, opacity: 0, filter: `blur(${blur})` },
    visible: { y: -yOffset, opacity: 1, filter: "blur(0px)" },
  };

  const combinedVariants = variant || defaultVariants;

  useEffect(() => {
    if (reduceMotion) { controls.stop(); controls.set("visible"); return; }
    if (!isInView || played.current) return;
    played.current = true;
    // The HTML starts in its settled, readable state. Hydration adds a small
    // lift and blur without ever hiding essential content or queuing long delays.
    const hidden = combinedVariants.hidden;
    if (typeof hidden === "object") {
      controls.set({ ...hidden, opacity: 1, filter: "blur(1px)" });
    }
    void controls.start("visible", { duration, delay: Math.min(delay, 0.15) });
  }, [isInView, reduceMotion, controls, combinedVariants, duration, delay]);

  return (
      <motion.div
        ref={ref}
        variants={combinedVariants}
        initial="visible"
        animate={controls}
        className={className}
      >
        {children}
      </motion.div>
  );
};

export default BlurFade;
