"use client";

import React from "react";

export default function PrismBackground({ className = "", children }) {
  return (
    <div className={`relative ${className}`}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -inset-40 opacity-[0.35] blur-3xl">
          <div className="absolute inset-0 bg-[conic-gradient(at_20%_20%,#6366f1_0deg,#e11d48_120deg,#16a34a_240deg,#6366f1_360deg)]" />
        </div>
        <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(600px_600px_at_50%_0%,black,transparent)]" />
      </div>
      {children}
    </div>
  );
}


