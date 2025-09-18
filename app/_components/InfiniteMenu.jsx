"use client";

import React, { useEffect, useMemo, useRef } from "react";

export default function InfiniteMenu({ items = [], onItemClick, infinite = true }) {
  const containerRef = useRef(null);
  const isDraggingRef = useRef(false);
  const startPosRef = useRef({ x: 0, y: 0, scrollLeft: 0, scrollTop: 0 });
  const gridRef = useRef(null);

  // Create a large tiled grid for the illusion of infinity (or single set if not infinite)
  const tiled = useMemo(() => {
    const times = infinite ? 5 : 1;
    const tiles = [];
    for (let r = 0; r < times; r++) {
      for (let c = 0; c < times; c++) {
        items.forEach((it, idx) => tiles.push({ ...it, key: `${r}-${c}-${idx}` }));
      }
    }
    return { tiles, times };
  }, [items, infinite]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    // center scroll only when infinite
    requestAnimationFrame(() => {
      if (infinite) {
        el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
        el.scrollTop = (el.scrollHeight - el.clientHeight) / 2;
      } else {
        el.scrollLeft = 0;
        el.scrollTop = 0;
      }
    });
  }, [tiled.tiles.length, infinite]);

  const onMouseDown = (e) => {
    if (!infinite) return;
    const el = containerRef.current;
    if (!el) return;
    isDraggingRef.current = true;
    el.classList.add("dragging");
    // Converge animation
    const grid = gridRef.current;
    if (grid) {
      grid.classList.remove("blast");
      grid.classList.add("converge");
    }
    startPosRef.current = {
      x: e.pageX - el.offsetLeft,
      y: e.pageY - el.offsetTop,
      scrollLeft: el.scrollLeft,
      scrollTop: el.scrollTop,
    };
  };

  const onMouseLeave = () => {
    if (infinite) {
      isDraggingRef.current = false;
      containerRef.current?.classList.remove("dragging");
    }
    const grid = gridRef.current;
    if (grid && infinite) {
      grid.classList.remove("converge");
    }
  };

  const onMouseUp = () => {
    if (infinite) {
      isDraggingRef.current = false;
      containerRef.current?.classList.remove("dragging");
    }
    const grid = gridRef.current;
    if (grid && infinite) {
      grid.classList.remove("converge");
      // trigger blast animation
      grid.classList.remove("blast");
      // Force reflow to restart animation
      // eslint-disable-next-line no-unused-expressions
      grid.offsetHeight;
      grid.classList.add("blast");
    }
  };

  const onMouseMove = (e) => {
    if (!infinite) return;
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
    if (infinite) {
      const buffer = 200;
      if (el.scrollLeft < buffer || el.scrollLeft > el.scrollWidth - el.clientWidth - buffer) {
        el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
      }
      if (el.scrollTop < buffer || el.scrollTop > el.scrollHeight - el.clientHeight - buffer) {
        el.scrollTop = (el.scrollHeight - el.clientHeight) / 2;
      }
    }
  };

  return (
    <div className="relative" style={{ height: "600px" }}>
      <div
        id="infinite-grid-menu-canvas"
        ref={containerRef}
        className={`h-full w-full rounded-2xl border border-border/60 bg-surface select-none ${infinite ? 'overflow-scroll infinite' : 'overflow-auto'}`}
        onMouseDown={onMouseDown}
        onMouseLeave={onMouseLeave}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
        onTouchStart={(e) => {
          if (!infinite) return;
          const grid = gridRef.current;
          if (grid) {
            grid.classList.remove("blast");
            grid.classList.add("converge");
          }
        }}
        onTouchEnd={(e) => {
          if (!infinite) return;
          const grid = gridRef.current;
          if (grid) {
            grid.classList.remove("converge");
            grid.classList.remove("blast");
            // restart blast
            // eslint-disable-next-line no-unused-expressions
            grid.offsetHeight;
            grid.classList.add("blast");
          }
        }}
      >
        <div ref={gridRef} className={`relative grid gap-4 p-6 ${infinite ? 'auto-rows-[220px] grid-cols-[repeat(10,220px)]' : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 auto-rows-[260px]'}`}>
          {tiled.tiles.map((it) => (
            <button
              type="button"
              key={it.key}
              onClick={() => onItemClick?.(it)}
              className={`group relative overflow-hidden rounded-2xl border border-border/60 bg-surface shadow-soft transition active:scale-[0.98] ${infinite ? 'h-[220px] w-[220px]' : 'h-full w-full'}`}
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
        #infinite-grid-menu-canvas.infinite { cursor: grab; scrollbar-width: none; -ms-overflow-style: none; }
        #infinite-grid-menu-canvas.infinite::-webkit-scrollbar { display: none; }
        #infinite-grid-menu-canvas.infinite.dragging { cursor: grabbing; }
        /* Converge to center while pressed */
        .infinite .converge {
          animation: convergeToCenter 250ms ease forwards;
          transform-origin: center center;
        }
        /* Blast out with a bounce after release */
        .infinite .blast {
          animation: blastOut 550ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          transform-origin: center center;
        }
        @keyframes convergeToCenter {
          0% { transform: scale(1); filter: blur(0px); }
          100% { transform: scale(0.05); filter: blur(1px); }
        }
        @keyframes blastOut {
          0% { transform: scale(0.05); filter: blur(1px); }
          60% { transform: scale(1.08); filter: blur(0px); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}


