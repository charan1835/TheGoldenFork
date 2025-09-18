"use client";

import React, { useEffect, useMemo, useRef } from "react";

export default function TrueFocus({
  sentence = "",
  manualMode = false,
  blurAmount = 5,
  borderColor = "#ff3b30",
  animationDuration = 2,
  pauseBetweenAnimations = 1,
  className = "",
}) {
  const containerRef = useRef(null);
  const animatingRef = useRef(false);

  const totalDurationSec = useMemo(
    () => Math.max(0.1, Number(animationDuration)) + Math.max(0, Number(pauseBetweenAnimations)),
    [animationDuration, pauseBetweenAnimations]
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    if (!manualMode) {
      el.classList.add("tf-animating");
      return () => {
        el.classList.remove("tf-animating");
      };
    }
  }, [manualMode, totalDurationSec]);

  const triggerOnce = () => {
    const el = containerRef.current;
    if (!el || animatingRef.current) return;
    animatingRef.current = true;
    el.classList.add("tf-animating");
    const timer = setTimeout(() => {
      el.classList.remove("tf-animating");
      animatingRef.current = false;
    }, totalDurationSec * 1000);
    return () => clearTimeout(timer);
  };

  return (
    <span
      ref={containerRef}
      className={`inline-flex items-center justify-center ${className}`}
      onMouseMove={manualMode ? triggerOnce : undefined}
      onTouchStart={manualMode ? triggerOnce : undefined}
      onTouchMove={manualMode ? triggerOnce : undefined}
    >
      <span className="tf-wrap">
        <span className="tf-text">{sentence}</span>
      </span>
      <style jsx>{`
        .tf-wrap {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.1em 0.25em;
          border-radius: 0.5rem;
          box-shadow: 0 0 0px ${borderColor};
          transition: box-shadow 300ms ease;
        }
        .tf-text {
          filter: blur(0px);
          transform: scale(1);
          transition: filter 300ms ease, transform 300ms ease;
        }
        .tf-animating .tf-text {
          animation: tfFocusText ${totalDurationSec}s ease-in-out infinite;
        }
        .tf-animating .tf-wrap {
          animation: tfFocusGlow ${totalDurationSec}s ease-in-out infinite;
        }
        @keyframes tfFocusText {
          0% { filter: blur(0px); transform: scale(1.0); opacity: 1; }
          15% { filter: blur(${blurAmount}px); transform: scale(0.985); opacity: 0.97; }
          50% { filter: blur(0px); transform: scale(1.0); opacity: 1; }
          100% { filter: blur(0px); transform: scale(1.0); opacity: 1; }
        }
        @keyframes tfFocusGlow {
          0% { box-shadow: 0 0 0px ${borderColor}; }
          15% { box-shadow: 0 0 18px ${borderColor}; }
          50% { box-shadow: 0 0 0px ${borderColor}; }
          100% { box-shadow: 0 0 0px ${borderColor}; }
        }
      `}</style>
    </span>
  );
}


