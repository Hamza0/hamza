"use client";

import { useEffect, useId, useState, type RefObject } from "react";
import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

export interface AnimatedBeamProps {
  className?: string;
  containerRef: RefObject<HTMLElement | null>; // Container ref
  fromRef: RefObject<HTMLElement | null>;
  toRef: RefObject<HTMLElement | null>;
  curvature?: number;
  anchorToEdges?: boolean;
  reverse?: boolean;
  pathColor?: string;
  pathWidth?: number;
  pathOpacity?: number;
  beamOpacity?: number;
  showBasePath?: boolean;
  glow?: boolean;
  gradientStartColor?: string;
  gradientStopColor?: string;
  delay?: number;
  duration?: number;
  repeat?: number;
  repeatDelay?: number;
  startXOffset?: number;
  startYOffset?: number;
  endXOffset?: number;
  endYOffset?: number;
}

export const AnimatedBeam: React.FC<AnimatedBeamProps> = ({
  className,
  containerRef,
  fromRef,
  toRef,
  curvature = 0,
  anchorToEdges = false,
  reverse = false, // Include the reverse prop
  duration = 5,
  delay = 0,
  pathColor = "gray",
  pathWidth = 2,
  pathOpacity = 0.2,
  beamOpacity = 1,
  showBasePath = true,
  glow = false,
  gradientStartColor = "#ffaa40",
  gradientStopColor = "#9c40ff",
  repeat = Infinity,
  repeatDelay = 0,
  startXOffset = 0,
  startYOffset = 0,
  endXOffset = 0,
  endYOffset = 0,
}) => {
  const id = useId();
  const prefersReducedMotion = useReducedMotion();
  const [pathD, setPathD] = useState("");
  const [svgDimensions, setSvgDimensions] = useState({ width: 0, height: 0 });

  const [endpoints, setEndpoints] = useState({
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
  });
  // Move the color band along this connection rather than across the container.
  const originX = reverse ? endpoints.endX : endpoints.startX;
  const originY = reverse ? endpoints.endY : endpoints.startY;
  const targetX = reverse ? endpoints.startX : endpoints.endX;
  const targetY = reverse ? endpoints.startY : endpoints.endY;
  const distance = Math.hypot(targetX - originX, targetY - originY) || 1;
  const bandLength = Math.min(96, Math.max(48, distance * 0.65));
  const bandX = ((targetX - originX) / distance) * bandLength;
  const bandY = ((targetY - originY) / distance) * bandLength;
  const gradientCoordinates = {
    x1: [originX - bandX, targetX],
    x2: [originX, targetX + bandX],
    y1: [originY - bandY, targetY],
    y2: [originY, targetY + bandY],
  };

  useEffect(() => {
    const updatePath = () => {
      if (containerRef.current && fromRef.current && toRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const rectA = fromRef.current.getBoundingClientRect();
        const rectB = toRef.current.getBoundingClientRect();

        const svgWidth = containerRect.width;
        const svgHeight = containerRect.height;
        setSvgDimensions({ width: svgWidth, height: svgHeight });

        let startX =
          rectA.left - containerRect.left + rectA.width / 2 + startXOffset;
        let startY =
          rectA.top - containerRect.top + rectA.height / 2 + startYOffset;
        let endX =
          rectB.left - containerRect.left + rectB.width / 2 + endXOffset;
        let endY =
          rectB.top - containerRect.top + rectB.height / 2 + endYOffset;

        if (anchorToEdges) {
          const dx = endX - startX;
          const dy = endY - startY;
          // Intersect the center-to-center line with each card's border.
          const fromEdge = Math.min(
            dx ? rectA.width / 2 / Math.abs(dx) : Infinity,
            dy ? rectA.height / 2 / Math.abs(dy) : Infinity,
          );
          const toEdge = Math.min(
            dx ? rectB.width / 2 / Math.abs(dx) : Infinity,
            dy ? rectB.height / 2 / Math.abs(dy) : Infinity,
          );
          if (Number.isFinite(fromEdge) && Number.isFinite(toEdge)) {
            startX += dx * fromEdge;
            startY += dy * fromEdge;
            endX -= dx * toEdge;
            endY -= dy * toEdge;
          }
        }
        setEndpoints({ startX, startY, endX, endY });
        const controlY = (startY + endY) / 2 - curvature;
        const d = `M ${startX},${startY} Q ${
          (startX + endX) / 2
        },${controlY} ${endX},${endY}`;
        setPathD(d);
      }
    };

    // Initialize ResizeObserver
    const resizeObserver = new ResizeObserver(() => {
      updatePath();
    });

    // Observe the container element
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Call the updatePath initially to set the initial path
    updatePath();

    // Clean up the observer on component unmount
    return () => {
      resizeObserver.disconnect();
    };
  }, [
    containerRef,
    fromRef,
    toRef,
    curvature,
    anchorToEdges,
    startXOffset,
    startYOffset,
    endXOffset,
    endYOffset,
  ]);

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      fill="none"
      width={svgDimensions.width}
      height={svgDimensions.height}
      xmlns="http://www.w3.org/2000/svg"
      className={cn(
        "pointer-events-none absolute top-0 left-0 overflow-visible transform-gpu stroke-2",
        className,
      )}
      viewBox={`0 0 ${svgDimensions.width} ${svgDimensions.height}`}
    >
      {showBasePath && (
        <path
          d={pathD}
          stroke={pathColor}
          strokeWidth={pathWidth}
          strokeOpacity={pathOpacity}
          strokeLinecap="round"
        />
      )}
      {!prefersReducedMotion && (
        <>
          <path
            className="motion-reduce:hidden"
            d={pathD}
            strokeWidth={pathWidth}
            stroke={`url(#${id})`}
            strokeOpacity={beamOpacity}
            filter={glow ? `url(#${id}-glow)` : undefined}
            strokeLinecap="round"
          />
          <defs>
            {glow && (
              <filter
                id={`${id}-glow`}
                x="-50%"
                y="-50%"
                width="200%"
                height="200%"
                colorInterpolationFilters="sRGB"
              >
                <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
                <feMerge>
                  <feMergeNode />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            )}
            <motion.linearGradient
              className="transform-gpu"
              id={id}
              gradientUnits={"userSpaceOnUse"}
              initial={{
                x1: gradientCoordinates.x1[0],
                x2: gradientCoordinates.x2[0],
                y1: gradientCoordinates.y1[0],
                y2: gradientCoordinates.y2[0],
              }}
              animate={{
                x1: gradientCoordinates.x1,
                x2: gradientCoordinates.x2,
                y1: gradientCoordinates.y1,
                y2: gradientCoordinates.y2,
              }}
              transition={{
                delay,
                duration,
                ease: "linear",
                repeat,
                repeatDelay,
              }}
            >
              <stop stopColor={gradientStartColor} stopOpacity="0"></stop>
              <stop offset="35%" stopColor={gradientStartColor}></stop>
              <stop offset="65%" stopColor={gradientStopColor}></stop>
              <stop
                offset="100%"
                stopColor={gradientStopColor}
                stopOpacity="0"
              ></stop>
            </motion.linearGradient>
          </defs>
        </>
      )}
    </svg>
  );
};
