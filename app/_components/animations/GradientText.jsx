"use client";

import React from "react";

export default function GradientText({ children, className = "", animate = "hover" }) {
  const animationClass =
    animate === "loop"
      ? "animate-shimmer motion-reduce:animate-none"
      : animate === "hover"
      ? "hover:animate-shimmer motion-reduce:animate-none"
      : "motion-reduce:animate-none";

  return (
    <span
      className={`bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent [background-size:200%] ${animationClass} ${className}`}
    >
      {children}
    </span>
  );
}


