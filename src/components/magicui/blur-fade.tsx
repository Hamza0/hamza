"use client";

import {
  AnimatePresence,
  motion,
  useInView,
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
  inViewMargin?: string; // keep as string
  blur?: string;
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
}: BlurFadeProps) => {
  const ref = useRef<HTMLDivElement | null>(null);

  const inViewResult = useInView(ref, {
    once: true,
    // framer-motion's types expect an internal MarginType
    // which isn't exported, so we cast here to avoid TS complaining.
    margin: inViewMargin as any,
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
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        transition={{ duration, delay }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default BlurFade;
