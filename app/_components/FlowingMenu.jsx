"use client";

import React, { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function FlowingMenu({ items = [] }) {
  const containerRef = useRef(null);
  const [mouseX, setMouseX] = useState(0);
  const router = useRouter();

  const handleMouseMove = (e) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMouseX(e.clientX - rect.left);
  };

  const computed = useMemo(() => {
    const rect = containerRef.current?.getBoundingClientRect();
    const center = rect ? rect.width / 2 : 0;
    const x = mouseX || center;
    return { centerX: center, x };
  }, [mouseX]);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative mx-auto max-w-6xl overflow-hidden py-4"
      style={{ height: "320px" }}
    >
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-background/60 to-transparent" />
      <ul className="flex h-full items-center justify-center gap-4 sm:gap-6">
        {items.map((item, idx) => {
          const cardCenter = (idx + 0.5) * 240; // approx width incl. gap
          const distance = Math.abs((computed.x || 0) - cardCenter);
          const clamped = Math.max(0, 1 - distance / 600);
          const scale = 0.95 + clamped * 0.12;
          const translateY = (1 - clamped) * 12;

          return (
            <li
              key={idx}
              className="group relative h-[260px] w-[220px] cursor-pointer select-none overflow-hidden rounded-2xl border border-border/60 bg-surface shadow-soft transition-transform will-change-transform"
              style={{ transform: `translateY(${translateY}px) scale(${scale})` }}
              onClick={() => item.link && router.push(item.link)}
            >
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.text || "category"}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 grid place-items-center text-muted-foreground">{item.text}</div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 transition-opacity group-hover:opacity-40" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/30 px-3 py-1 text-sm font-semibold text-white backdrop-blur">
                  {item.text}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}


