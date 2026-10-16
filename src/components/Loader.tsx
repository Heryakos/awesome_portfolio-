"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export default function Loader({ onComplete }: { onComplete: () => void }) {
  const loaderRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const steps = [
      { label: "01", hold: 0.4 },
      { label: "02", hold: 0.3 },
      { label: "03", hold: 0.3 },
      { label: "Y",  hold: 0.7 },
    ];

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(loaderRef.current, {
          yPercent: -100,
          duration: 1.2,
          ease: "expo.inOut",
          onComplete,
        });
      },
    });

    // Start bar right away
    tl.to(barRef.current, { width: "0%", duration: 0 });

    steps.forEach(({ label, hold }, i) => {
      const barTarget = `${((i + 1) / steps.length) * 100}%`;

      // Show the count
      tl.call(() => {
        if (countRef.current) {
          countRef.current.textContent = label;
        }
      });

      // Animate in
      tl.fromTo(
        countRef.current,
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45, ease: "power3.out" }
      );

      // Animate bar in parallel
      tl.to(barRef.current, { width: barTarget, duration: hold + 0.45, ease: "none" }, "<");

      // Hold then animate out
      tl.to(
        countRef.current,
        { y: -80, opacity: 0, duration: 0.3, ease: "power2.in" },
        `+=${hold}`
      );
    });

    return () => { tl.kill(); };
  }, [onComplete]);

  const skip = () => {
    gsap.to(loaderRef.current, {
      yPercent: -100,
      duration: 0.5,
      ease: "expo.inOut",
      onComplete,
    });
  };

  return (
    <div
      id="loader"
      ref={loaderRef}
      role="status"
      aria-label="Loading Yeab Addis portfolio"
      style={{
        position: "fixed",
        inset: 0,
        background: "#111",
        zIndex: 10000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Counter */}
      <div
        ref={countRef}
        aria-hidden="true"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "clamp(6rem, 22vw, 22rem)",
          fontWeight: 400,
          color: "#EFEBE3",
          lineHeight: 1,
          userSelect: "none",
          willChange: "transform, opacity",
          opacity: 0,
        }}
      >
        01
      </div>

      {/* Progress bar */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          height: "2px",
          width: "0%",
          background: "#FF4A1C",
        }}
        ref={barRef}
      />

      {/* YEAB wordmark — top left */}
      <div
        style={{
          position: "absolute",
          top: "1.5rem",
          left: "2.5rem",
          fontFamily: "var(--font-display)",
          fontWeight: 800,
          fontSize: "1rem",
          color: "rgba(239,235,227,0.4)",
          letterSpacing: "0.08em",
          fontVariationSettings: '"wdth" 125',
        }}
        aria-hidden="true"
      >
        YEAB
      </div>

      {/* Skip button */}
      <button
        onClick={skip}
        style={{
          position: "absolute",
          bottom: "1.8rem",
          right: "2.5rem",
          background: "none",
          border: "none",
          cursor: "pointer",
          fontFamily: "var(--font-mono)",
          fontSize: "0.62rem",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "rgba(239,235,227,0.35)",
          padding: 0,
        }}
        aria-label="Skip loading animation"
      >
        Skip →
      </button>
    </div>
  );
}
