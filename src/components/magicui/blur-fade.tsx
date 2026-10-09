"use client";

import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { useRef } from "react";

interface BlurFadeProps {
  children: React.ReactNode;
  className?: string;
  variant?: Variants;
  duration?: number;
  delay?: number;
  yOffset?: number;
  inView?: boolean;
  inViewMargin?: string;
  blur?: string;
  initial?: "hidden" | false;
  respectReducedMotion?: boolean;
}

const BlurFade = ({
  children,
  className,
  variant,
  duration = 0.4,
  delay = 0,
  yOffset = 6,
  inView = false,
  inViewMargin = "-50px",
  blur = "6px",
  initial,
  respectReducedMotion = false,
}: BlurFadeProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const reduceMotion = respectReducedMotion && prefersReducedMotion;

  const inViewResult = useInView(ref, {
    once: true,
    margin: inViewMargin as any, // <-- THIS "as any" MUST BE HERE
  });

  const isInView = !inView || inViewResult;

  const defaultVariants: Variants = {
    hidden: { y: yOffset, opacity: 0, filter: `blur(${blur})` },
    visible: { y: -yOffset, opacity: 1, filter: "blur(0px)" },
  };

  const combinedVariants = variant || defaultVariants;

  return (
    <AnimatePresence>
      <motion.div
        ref={ref}
        variants={combinedVariants}
        initial={reduceMotion ? false : initial ?? "hidden"}
        animate={reduceMotion ? { y: 0, opacity: 1, filter: "blur(0px)" } : isInView ? "visible" : "hidden"}
        transition={{ duration: reduceMotion ? 0 : duration, delay: reduceMotion ? 0 : delay }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default BlurFade;
