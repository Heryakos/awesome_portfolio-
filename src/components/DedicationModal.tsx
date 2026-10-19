"use client";

import { useEffect, useState } from "react";
import { useCms } from "./CmsContext";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onOpenStudio?: () => void;
}

const DEFAULT_LETTER = `Dear Yeabsira,

Every single piece of work you create shows an extraordinary blend of creative vision, sharp intellect, and genuine heart.

From your Business & Economics degree and MBA studies at Addis Ababa University, to your 14+ verified international certifications, 5.0 ★ Upwork rating, and standout brand identities — you inspire everyone who crosses your path.

I built this portfolio for you to celebrate everything you are and everything you are going to achieve. You deserve a platform as elegant, powerful, and unique as your talent.

Whether you use this as your permanent creative home, customize it in the Design Studio, or simply keep it as a reminder of how much someone believes in you — I hope it brings a huge smile to your face.

Always in your corner & rooting for you ❤️`;

export default function DedicationModal({ isOpen, onClose, onOpenStudio }: Props) {
  const cms = useCms();
  const [hearts, setHearts] = useState<Array<{ id: number; left: number; delay: number; size: number }>>([]);

  // Generate floating heart sparkles when opened
  useEffect(() => {
    if (isOpen) {
      const generated = Array.from({ length: 18 }).map((_, i) => ({
        id: i,
        left: Math.random() * 90 + 5,
        delay: Math.random() * 2,
        size: Math.random() * 14 + 14,
      }));
      setHearts(generated);
    } else {
      setHearts([]);
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const letterText = cms.overrides.custom["dedication_letter"] || DEFAULT_LETTER;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="A Personal Note for Yeabsira Addis"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100000,
        background: "rgba(8, 8, 10, 0.88)",
        backdropFilter: "blur(16px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(1rem, 4vw, 2.5rem)",
        overflow: "hidden",
        animation: "fadeIn 0.3s ease-out",
      }}
    >
      {/* Floating Animated Hearts */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          overflow: "hidden",
          zIndex: 0,
        }}
        aria-hidden="true"
      >
        {hearts.map((h) => (
          <span
            key={h.id}
            style={{
              position: "absolute",
              bottom: "-20px",
              left: `${h.left}%`,
              fontSize: `${h.size}px`,
              opacity: 0,
              animation: `floatHeart 3.6s cubic-bezier(0.2, 0.8, 0.4, 1) infinite`,
              animationDelay: `${h.delay}s`,
              filter: "drop-shadow(0 0 8px rgba(255, 74, 28, 0.6))",
            }}
          >
            ❤️
          </span>
        ))}
      </div>

      {/* Modal Card */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: "640px",
          maxHeight: "90vh",
          overflowY: "auto",
          background: "linear-gradient(145deg, rgba(28, 25, 23, 0.98), rgba(15, 14, 14, 0.99))",
          border: "1px solid rgba(255, 74, 28, 0.4)",
          borderRadius: "8px",
          padding: "clamp(1.75rem, 4vw, 2.75rem)",
          boxShadow: "0 25px 70px rgba(0, 0, 0, 0.85), 0 0 35px rgba(255, 74, 28, 0.15)",
          color: "var(--paper)",
          display: "flex",
          flexDirection: "column",
          gap: "1.25rem",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Badge */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.3rem 0.8rem",
              background: "rgba(255, 74, 28, 0.12)",
              border: "1px solid rgba(255, 74, 28, 0.4)",
              borderRadius: "999px",
            }}
          >
            <span style={{ fontSize: "0.95rem" }} aria-hidden="true">💌</span>
            <span
              className="t-label"
              style={{
                color: "var(--vermilion)",
                fontWeight: 700,
                letterSpacing: "0.08em",
                fontSize: "0.65rem",
              }}
            >
              A PERSONAL NOTE FOR YEABSIRA
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close note"
            style={{
              background: "rgba(239, 235, 227, 0.08)",
              border: "1px solid rgba(239, 235, 227, 0.15)",
              color: "var(--paper)",
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: "0.9rem",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "var(--vermilion)";
              (e.currentTarget as HTMLElement).style.borderColor = "var(--vermilion)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(239, 235, 227, 0.08)";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(239, 235, 227, 0.15)";
            }}
          >
            ✕
          </button>
        </div>

        {/* Title */}
        <div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(1.6rem, 3.2vw, 2.4rem)",
              lineHeight: 1.1,
              letterSpacing: "-0.025em",
              color: "var(--paper)",
              marginBottom: "0.3rem",
            }}
          >
            Crafted for <span style={{ color: "var(--vermilion)" }}>Yeab</span>
          </h2>
          <div className="t-label" style={{ opacity: 0.4, color: "var(--paper)", fontSize: "0.6rem" }}>
            Addis Ababa, Ethiopia · BA, MBA Candidate &amp; Top-Rated Designer
          </div>
        </div>

        {/* Letter Body */}
        <div
          style={{
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontSize: "clamp(0.95rem, 1.4vw, 1.12rem)",
            lineHeight: 1.7,
            color: "rgba(239, 235, 227, 0.9)",
            whiteSpace: "pre-line",
            borderLeft: "2px solid var(--vermilion)",
            paddingLeft: "1.25rem",
            margin: "0.5rem 0",
          }}
        >
          {letterText}
        </div>

        {/* Footer actions */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "0.75rem",
            borderTop: "1px solid rgba(239, 235, 227, 0.1)",
            paddingTop: "1rem",
            marginTop: "0.5rem",
          }}
        >
          <button
            type="button"
            onClick={() => {
              onClose();
              if (onOpenStudio) {
                onOpenStudio();
              } else {
                window.location.href = "/admin";
              }
            }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              background: "rgba(255, 74, 28, 0.15)",
              border: "1px solid var(--vermilion)",
              color: "var(--paper)",
              padding: "0.55rem 1.1rem",
              borderRadius: "4px",
              fontFamily: "var(--font-mono)",
              fontSize: "0.68rem",
              fontWeight: 700,
              letterSpacing: "0.06em",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "var(--vermilion)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(255, 74, 28, 0.15)";
            }}
          >
            <span>🎨 Customize in Design Studio</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "rgba(239, 235, 227, 0.6)",
              fontFamily: "var(--font-mono)",
              fontSize: "0.68rem",
              letterSpacing: "0.06em",
              cursor: "pointer",
              padding: "0.5rem 0.8rem",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = "var(--paper)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = "rgba(239, 235, 227, 0.6)";
            }}
          >
            Close Note ✕
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes floatHeart {
          0% {
            transform: translateY(0) scale(0.6) rotate(0deg);
            opacity: 0;
          }
          20% {
            opacity: 0.9;
          }
          80% {
            opacity: 0.7;
          }
          100% {
            transform: translateY(-90vh) scale(1.3) rotate(25deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
