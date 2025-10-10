"use client";

import { motion } from "framer-motion";

export default function AnimatedCheck({ className }) {
  const icon = {
    hidden: {
      opacity: 0,
      pathLength: 0,
      fill: "rgba(255, 255, 255, 0)"
    },
    visible: {
      opacity: 1,
      pathLength: 1,
      fill: "rgba(255, 255, 255, 1)"
    }
  };

  return (
    <div className={className}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        className="w-full h-full"
      >
        <motion.circle
          cx="50"
          cy="50"
          r="46"
          stroke="#22d3ee"
          strokeWidth="5"
          variants={icon}
          initial="hidden"
          animate="visible"
          transition={{
            default: { duration: 0.8, ease: "easeInOut" },
            fill: { duration: 0.5, ease: [1, 0, 0.8, 1] }
          }}
        />
        <motion.path
          d="M30 50 L45 65 L70 40"
          stroke="#22d3ee"
          strokeWidth="6"
          strokeLinecap="round"
          fill="transparent"
          variants={icon}
          initial="hidden"
          animate="visible"
          transition={{
            default: { duration: 0.6, ease: "easeInOut", delay: 0.8 },
          }}
        />
      </svg>
    </div>
  );
}