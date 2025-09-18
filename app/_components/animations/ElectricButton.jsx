"use client";

import React from "react";

export default function ElectricButton({ as: As = "button", className = "", children, ...props }) {
  return (
    <As
      className={`relative inline-flex items-center justify-center rounded-lg px-5 py-2.5 font-semibold transition duration-300 ease-bounce-smooth focus:outline-none focus:ring-2 focus:ring-primary/40 active:scale-[0.98] ${className}`}
      {...props}
    >
      <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/40 via-accent/40 to-primary/40 opacity-0 transition-opacity group-hover:opacity-100" />
      <span className="absolute -inset-px rounded-lg bg-gradient-to-r from-primary to-accent opacity-60 blur-[6px]" aria-hidden />
      <span className="relative z-[1] text-background">{children}</span>
    </As>
  );
}


