"use client";

import React, { useRef } from "react";

export default function GlareCard({ className = "", children }) {
  const cardRef = useRef(null);

  const handleMove = (e) => {
    const target = cardRef.current;
    if (!target) return;
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    target.style.setProperty("--glare-x", `${x}px`);
    target.style.setProperty("--glare-y", `${y}px`);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMove}
      className={`relative rounded-lg bg-surface/70 shadow-soft ring-1 ring-border/60 transition hover:shadow-elevated ${className}`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-px rounded-lg opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(400px 200px at var(--glare-x,50%) var(--glare-y,50%), rgba(255,255,255,0.35), transparent 60%)",
        }}
      />
      {children}
    </div>
  );
}


