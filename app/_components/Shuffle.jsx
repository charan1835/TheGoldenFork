"use client";

import React, { useMemo } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function Shuffle({
  text = "",
  shuffleDirection = "right",
  duration = 0.35,
  animationMode = "evenodd",
  shuffleTimes = 1,
  ease = "easeOut",
  stagger = 0.03,
  threshold = 0.1,
  triggerOnce = true,
  triggerOnHover = true,
  respectReducedMotion = true,
  className = "",
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: threshold, once: triggerOnce });

  const prefersReduced =
    typeof window !== "undefined" &&
    respectReducedMotion &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const chars = useMemo(() => text.split("").map((c, i) => ({ c, i })), [text]);

  const dirMultiplier = shuffleDirection === "left" ? -1 : 1;

  const getOffsetForIndex = (i) => {
    if (animationMode === "evenodd") return i % 2 === 0 ? 1 : -1;
    return 1;
  };

  const variants = {
    initial: { x: 0, y: 0, opacity: 1 },
    hover: (i) => {
      if (prefersReduced) return { x: 0, y: 0 };
      const sign = getOffsetForIndex(i);
      const magnitude = 8 * dirMultiplier * sign;
      return {
        x: [0, magnitude, 0],
        y: [0, Math.random() * 6 - 3, 0],
        transition: { duration, ease, times: [0, 0.5, 1], repeat: shuffleTimes - 1 },
      };
    },
    enter: (i) => ({
      opacity: [0, 1],
      y: [6, 0],
      transition: { duration: 0.4, delay: i * stagger, ease: "easeOut" },
    }),
  };

  return (
    <motion.span
      ref={ref}
      className={`inline-block ${className}`}
      initial="initial"
      animate={isInView ? "enter" : "initial"}
      whileHover={triggerOnHover ? "hover" : undefined}
    >
      {chars.map(({ c, i }) => (
        <motion.span
          key={i}
          custom={i}
          variants={variants}
          style={{ display: "inline-block" }}
          transition={{ staggerChildren: stagger }}
        >
          {c === " " ? "\u00A0" : c}
        </motion.span>
      ))}
    </motion.span>
  );
}


