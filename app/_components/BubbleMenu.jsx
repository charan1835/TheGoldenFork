"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function BubbleMenu({
  logo,
  items = [],
  menuAriaLabel = "Toggle navigation",
  menuBg = "#ffffff",
  menuContentColor = "#111111",
  useFixedPosition = false,
  animationEase = [0.22, 1, 0.36, 1],
  animationDuration = 0.5,
  staggerDelay = 0.12,
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`${useFixedPosition ? "fixed right-4 bottom-6" : "relative"} md:hidden`}>
      <button
        aria-label={menuAriaLabel}
        onClick={() => setOpen((s) => !s)}
        className="relative z-20 inline-flex h-11 w-11 items-center justify-center rounded-full shadow-soft hover:shadow-elevated"
        style={{ backgroundColor: menuBg, color: menuContentColor }}
      >
        {logo || (
          <span className="font-bold">≡</span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="sheet"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-10 bg-background/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            key="menu"
            initial={{ y: 16, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 16, opacity: 0, scale: 0.98 }}
            transition={{ duration: animationDuration, ease: animationEase }}
            className="absolute right-0 top-12 z-20 w-[min(92vw,420px)] rounded-2xl border border-border/60 bg-background/95 p-3 shadow-elevated"
          >
            <nav className="grid grid-cols-2 gap-3">
              {items.map((item, idx) => {
                const baseProps = {
                  key: (item.label || 'item') + idx,
                  initial: { y: 8, opacity: 0, rotate: item.rotation || 0 },
                  animate: { y: 0, opacity: 1, rotate: 0 },
                  transition: { delay: idx * staggerDelay, duration: animationDuration, ease: animationEase },
                };

                if (item.render) {
                  return (
                    <motion.div {...baseProps}>
                      <div onClick={() => setOpen(false)}>
                        {item.render}
                      </div>
                    </motion.div>
                  );
                }

                if (item.onClick && !item.href) {
                  return (
                    <motion.button
                      {...baseProps}
                      type="button"
                      aria-label={item.ariaLabel || item.label}
                      onClick={() => { item.onClick(); setOpen(false); }}
                      className="rounded-xl border border-border/60 bg-surface px-4 py-3 text-center text-sm font-semibold capitalize shadow-soft transition active:scale-[0.98]"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = item.hoverStyles?.bgColor || menuBg;
                        e.currentTarget.style.color = item.hoverStyles?.textColor || menuContentColor;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '';
                        e.currentTarget.style.color = '';
                      }}
                    >
                      {item.label}
                    </motion.button>
                  );
                }

                return (
                  <motion.a
                    {...baseProps}
                    href={item.href}
                    aria-label={item.ariaLabel || item.label}
                    className="rounded-xl border border-border/60 bg-surface px-4 py-3 text-center text-sm font-semibold capitalize shadow-soft transition active:scale-[0.98]"
                    style={{
                      '--hover-bg': item.hoverStyles?.bgColor || menuBg,
                      '--hover-color': item.hoverStyles?.textColor || menuContentColor,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = item.hoverStyles?.bgColor || menuBg;
                      e.currentTarget.style.color = item.hoverStyles?.textColor || menuContentColor;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '';
                      e.currentTarget.style.color = '';
                    }}
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </motion.a>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


