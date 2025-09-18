"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function FlowingMenu({ items = [] }) {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const [paused, setPaused] = useState(false);
  const [offset, setOffset] = useState(0);
  const router = useRouter();

  const doubled = useMemo(() => [...items, ...items], [items]);

  // Continuous marquee movement (both mobile and desktop)
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let rafId;
    let last = performance.now();
    const speedPxPerSec = 60; // tune speed
    const loop = (now) => {
      const dt = (now - last) / 1000;
      last = now;
      if (!paused) {
        const width = track.scrollWidth / 2 || 1; // half because content is doubled
        setOffset((prev) => {
          const next = prev - speedPxPerSec * dt;
          return next <= -width ? 0 : next;
        });
      }
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [paused, items.length]);

  return (
    <div
      ref={containerRef}
      className="relative mx-auto max-w-6xl py-2 sm:py-4 overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-background/60 to-transparent" />
      {/* Marquee track: same for mobile and desktop, loops seamlessly */}
      <div style={{ height: '320px' }}>
        <ul
          ref={trackRef}
          className="flex items-center gap-4 sm:gap-6 px-4 will-change-transform"
          style={{ transform: `translateX(${offset}px)` }}
        >
          {doubled.map((item, idx) => (
            <li
              key={idx}
              className="relative h-48 sm:h-[260px] w-[72vw] max-w-[320px] sm:w-[220px] cursor-pointer select-none overflow-hidden rounded-2xl border border-border/60 bg-surface shadow-soft"
              onClick={() => item.link && router.push(item.link)}
            >
              {item.image ? (
                <img src={item.image} alt={item.text || 'category'} className="absolute inset-0 h-full w-full object-cover" />
              ) : (
                <div className="absolute inset-0 grid place-items-center text-muted-foreground">{item.text}</div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/30 px-3 py-1 text-xs sm:text-sm font-semibold text-white backdrop-blur">
                  {item.text}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}


