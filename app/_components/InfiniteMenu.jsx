"use client";

import React, { useEffect, useMemo, useRef } from "react";

export default function InfiniteMenu({ items = [], onItemClick }) {
  const containerRef = useRef(null);
  const isDraggingRef = useRef(false);
  const startPosRef = useRef({ x: 0, y: 0, scrollLeft: 0, scrollTop: 0 });

  // Create a large tiled grid for the illusion of infinity
  const tiled = useMemo(() => {
    const times = 5; // tile 5x
    const tiles = [];
    for (let r = 0; r < times; r++) {
      for (let c = 0; c < times; c++) {
        items.forEach((it, idx) => tiles.push({ ...it, key: `${r}-${c}-${idx}` }));
      }
    }
    return { tiles, times };
  }, [items]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    // center scroll
    requestAnimationFrame(() => {
      el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
      el.scrollTop = (el.scrollHeight - el.clientHeight) / 2;
    });
  }, [tiled.tiles.length]);

  const onMouseDown = (e) => {
    const el = containerRef.current;
    if (!el) return;
    isDraggingRef.current = true;
    el.classList.add("dragging");
    startPosRef.current = {
      x: e.pageX - el.offsetLeft,
      y: e.pageY - el.offsetTop,
      scrollLeft: el.scrollLeft,
      scrollTop: el.scrollTop,
    };
  };

  const onMouseLeave = () => {
    isDraggingRef.current = false;
    containerRef.current?.classList.remove("dragging");
  };

  const onMouseUp = () => {
    isDraggingRef.current = false;
    containerRef.current?.classList.remove("dragging");
  };

  const onMouseMove = (e) => {
    const el = containerRef.current;
    if (!el || !isDraggingRef.current) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const y = e.pageY - el.offsetTop;
    const walkX = (x - startPosRef.current.x) * 1.2;
    const walkY = (y - startPosRef.current.y) * 1.2;
    el.scrollLeft = startPosRef.current.scrollLeft - walkX;
    el.scrollTop = startPosRef.current.scrollTop - walkY;

    // reset to center if near edges to maintain illusion
    const buffer = 200;
    if (el.scrollLeft < buffer || el.scrollLeft > el.scrollWidth - el.clientWidth - buffer) {
      el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
    }
    if (el.scrollTop < buffer || el.scrollTop > el.scrollHeight - el.clientHeight - buffer) {
      el.scrollTop = (el.scrollHeight - el.clientHeight) / 2;
    }
  };

  return (
    <div className="relative" style={{ height: "600px" }}>
      <div
        id="infinite-grid-menu-canvas"
        ref={containerRef}
        className="h-full w-full overflow-scroll rounded-2xl border border-border/60 bg-surface select-none"
        onMouseDown={onMouseDown}
        onMouseLeave={onMouseLeave}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
      >
        <div className="relative grid auto-rows-[220px] grid-cols-[repeat(10,220px)] gap-4 p-6">
          {tiled.tiles.map((it) => (
            <button
              type="button"
              key={it.key}
              onClick={() => onItemClick?.(it)}
              className="group relative h-[220px] w-[220px] overflow-hidden rounded-2xl border border-border/60 bg-surface shadow-soft transition active:scale-[0.98]"
            >
              {it.image ? (
                <img src={it.image} alt={it.title || "menu"} className="absolute inset-0 h-full w-full object-cover" />
              ) : (
                <div className="absolute inset-0 grid place-items-center text-muted-foreground">{it.title}</div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 transition-opacity group-hover:opacity-40" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-semibold text-white">{it.title}</span>
                </div>
                {it.description && (
                  <p className="mt-1 line-clamp-1 text-xs text-white/80">{it.description}</p>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
      <style jsx>{`
        #infinite-grid-menu-canvas { cursor: grab; }
        #infinite-grid-menu-canvas.dragging { cursor: grabbing; }
      `}</style>
    </div>
  );
}


