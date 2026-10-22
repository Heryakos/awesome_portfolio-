"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { SITE } from "../../content/site";
import DedicationModal from "./DedicationModal";
import { useCms } from "./CmsContext";

// Lazy-load the 3D canvas to avoid SSR issues
const ThreeY = dynamic(() => import("./ThreeY"), {
  ssr: false,
  loading: () => null,
});

export default function Hero() {
  const cms = useCms();
  const isDedicationShown = cms.overrides.custom["show_dedication"] === "true";
  const [dedicationOpen, setDedicationOpen] = useState(false);
  const nameRef = useRef<HTMLDivElement>(null);
  const addisRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLParagraphElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOpen = () => setDedicationOpen(true);
    window.addEventListener("open-dedication-note", handleOpen);
    return () => window.removeEventListener("open-dedication-note", handleOpen);
  }, []);

  useEffect(() => {
    // Give loader time to complete before animating in
    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      delay: 0.3,
    });

    tl.fromTo(
      nameRef.current,
      { y: 80, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2 }
    )
      .fromTo(
        addisRef.current,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1 },
        "-=0.8"
      )
      .fromTo(
        roleRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        "-=0.5"
      )
      .fromTo(
        scrollHintRef.current,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.6 },
        "-=0.3"
      );

    // Scroll hint pulse
    const arrow = scrollHintRef.current?.querySelector(".scroll-arrow");
    if (arrow) {
      gsap.to(arrow, {
        y: 8,
        repeat: -1,
        yoyo: true,
        duration: 1.3,
        ease: "sine.inOut",
        delay: 2,
      });
    }

    return () => { tl.kill(); };
  }, []);

  return (
    <section
      id="hero"
      className="hero"
      aria-label="Hero — Yeab Addis, Graphic Designer"
      style={{ position: "relative", minHeight: "100dvh", overflow: "hidden" }}
    >
      {/* 3D Y — fills the background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "auto",
        }}
        aria-hidden="true"
      >
        <ThreeY />
      </div>

      {/* ── Dedication Badge: Yeab My Crush ── */}
      <div
        id="cms-dedication-badge"
        role="button"
        tabIndex={0}
        onClick={() => setDedicationOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setDedicationOpen(true);
          }
        }}
        title="Click to open personal note for Yeab ❤️"
        style={{
          position: "absolute",
          top: "clamp(4.2rem, 7.5vh, 5.5rem)",
          left: "clamp(1.25rem, 4vw, 5rem)",
          maxWidth: "calc(100vw - 2.5rem)",
          zIndex: 10,
          display: isDedicationShown ? "inline-flex" : "none",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.35rem 0.85rem",
          background: "rgba(255, 74, 28, 0.1)",
          border: "1px solid rgba(255, 74, 28, 0.4)",
          borderRadius: "999px",
          backdropFilter: "blur(10px)",
          boxShadow: "0 4px 20px rgba(255, 74, 28, 0.18)",
          cursor: "pointer",
          animation: "floatSlow 4s ease-in-out infinite",
          overflow: "hidden",
          transition: "transform 0.2s, background 0.2s, border-color 0.2s, box-shadow 0.2s",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.transform = "scale(1.03)";
          el.style.background = "rgba(255, 74, 28, 0.18)";
          el.style.borderColor = "var(--vermilion)";
          el.style.boxShadow = "0 6px 26px rgba(255, 74, 28, 0.35)";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.transform = "scale(1)";
          el.style.background = "rgba(255, 74, 28, 0.1)";
          el.style.borderColor = "rgba(255, 74, 28, 0.4)";
          el.style.boxShadow = "0 4px 20px rgba(255, 74, 28, 0.18)";
        }}
      >
        <span style={{ fontSize: "0.9rem", flexShrink: 0 }} aria-hidden="true">❤️</span>
        <span
          id="cms-dedication-text"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "clamp(0.6rem, 1.1vw, 0.72rem)",
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "var(--vermilion)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          Dedicated to Yeab — My Crush &amp; The Most Talented Designer ✨
        </span>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.58rem",
            color: "var(--paper)",
            opacity: 0.6,
            marginLeft: "0.2rem",
            flexShrink: 0,
          }}
        >
          (Open Note 💌)
        </span>
      </div>

      {/* Dedication Note Modal */}
      <DedicationModal
        isOpen={dedicationOpen}
        onClose={() => setDedicationOpen(false)}
        onOpenStudio={() => {
          window.location.href = "/admin";
        }}
      />

      {/* Giant YEAB — top-left, deliberately cropped at edges */}
      <div
        ref={nameRef}
        style={{
          position: "absolute",
          top: "clamp(7rem, 13vh, 9.5rem)",
          left: "clamp(1.5rem, 4vw, 5rem)",
          zIndex: 2,
          pointerEvents: "none",
          willChange: "transform, opacity",
        }}
        aria-hidden="true"
      >
        <span
          style={{
            display: "block",
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: "clamp(3.5rem, 18vw, 22rem)",
            lineHeight: 0.85,
            letterSpacing: "-0.045em",
            color: "var(--ink)",
            fontVariationSettings: '"wdth" 130, "opsz" 72',
          }}
        >
          <span id="cms-name">YEAB</span>
        </span>
      </div>

      {/* ADDIS — bottom-right, ghosted */}
      <div
        ref={addisRef}
        style={{
          position: "absolute",
          bottom: "clamp(5rem, 12vh, 9rem)",
          right: "clamp(1.5rem, 4vw, 5rem)",
          zIndex: 2,
          pointerEvents: "none",
          willChange: "transform, opacity",
          textAlign: "right",
        }}
        aria-hidden="true"
      >
        <span
          style={{
            display: "block",
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: "clamp(2.2rem, 11vw, 14rem)",
            lineHeight: 0.85,
            letterSpacing: "-0.03em",
            color: "var(--ink)",
            opacity: 0.12,
            fontVariationSettings: '"wdth" 70, "opsz" 72',
          }}
        >
          ADDIS
        </span>
      </div>

      {/* Screen-reader heading */}
      <h1 className="sr-only">Yeab Addis — Graphic Designer</h1>

      {/* Role label — bottom left */}
      <p
        ref={roleRef}
        style={{
          position: "absolute",
          bottom: "clamp(2rem, 5vh, 4rem)",
          left: "clamp(1.25rem, 4vw, 5rem)",
          maxWidth: "calc(100vw - 6rem)",
          zIndex: 2,
          fontFamily: "var(--font-serif)",
          fontStyle: "italic",
          fontSize: "clamp(0.85rem, 1.4vw, 1.35rem)",
          color: "var(--ink)",
          opacity: 0.8,
          margin: 0,
          willChange: "transform, opacity",
          lineHeight: 1.3,
        }}
      >
        <span id="cms-role">{SITE.role}</span> — <span id="cms-role-sub">Visual identity &amp; brand experience</span>
      </p>

      {/* Scroll hint — bottom right (desktop only to prevent mobile overlap) */}
      <div
        ref={scrollHintRef}
        className="hero__scroll-hint"
        style={{
          position: "absolute",
          bottom: "clamp(2.5rem, 5vh, 4rem)",
          right: "clamp(1.5rem, 4vw, 5rem)",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.4rem",
          willChange: "transform, opacity",
        }}
        aria-hidden="true"
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.6rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase" as const,
            opacity: 0.35,
            color: "var(--ink)",
          }}
        >
          Scroll
        </span>
        <span
          className="scroll-arrow"
          style={{
            display: "block",
            width: "1px",
            height: "36px",
            background: "var(--ink)",
            opacity: 0.25,
          }}
        />
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hero__scroll-hint {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
}
