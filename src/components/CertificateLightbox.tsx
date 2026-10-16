"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export interface CertificateItem {
  title: string;
  issuer: string;
  date: string;
  credentialId?: string;
  image?: string;
  url: string;
  skills?: string[];
}

interface Props {
  certificates: CertificateItem[];
  selectedIndex: number | null;
  onClose: () => void;
  onSelectIndex: (index: number) => void;
}

export default function CertificateLightbox({
  certificates,
  selectedIndex,
  onClose,
  onSelectIndex,
}: Props) {
  const isOpen = selectedIndex !== null && selectedIndex >= 0 && selectedIndex < certificates.length;
  const currentCert = isOpen ? certificates[selectedIndex] : null;

  // Keyboard navigation (Arrow keys + Escape)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        onSelectIndex((selectedIndex - 1 + certificates.length) % certificates.length);
      } else if (e.key === "ArrowRight") {
        onSelectIndex((selectedIndex + 1) % certificates.length);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedIndex, certificates.length, onClose, onSelectIndex]);

  if (!isOpen || !currentCert) return null;

  const prev = () => onSelectIndex((selectedIndex - 1 + certificates.length) % certificates.length);
  const next = () => onSelectIndex((selectedIndex + 1) % certificates.length);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${currentCert.title} Certificate Viewer`}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        background: "rgba(10, 10, 10, 0.88)",
        backdropFilter: "blur(12px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(1rem, 3vw, 2.5rem)",
        cursor: "default",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Modal Dialog Card */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "1050px",
          maxHeight: "92vh",
          background: "var(--ink)",
          border: "1px solid rgba(239, 235, 227, 0.15)",
          borderRadius: "4px",
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr",
          overflow: "hidden",
          boxShadow: "0 25px 60px rgba(0,0,0,0.7)",
          cursor: "default",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left: Certificate Image or Visual Badge */}
        <div
          style={{
            background: "#050505",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            minHeight: "360px",
            borderRight: "1px solid rgba(239, 235, 227, 0.1)",
            padding: "1.5rem",
          }}
        >
          {currentCert.image ? (
            <div style={{ position: "relative", width: "100%", height: "100%", minHeight: "320px" }}>
              <Image
                src={currentCert.image}
                alt={`${currentCert.title} official certificate document`}
                fill
                style={{ objectFit: "contain" }}
                sizes="(max-width: 768px) 90vw, 600px"
                priority
              />
            </div>
          ) : (
            <div
              style={{
                width: "100%",
                aspectRatio: "4/3",
                background: "rgba(239, 235, 227, 0.03)",
                border: "1px dashed rgba(239, 235, 227, 0.2)",
                borderRadius: "4px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "2rem",
                textAlign: "center",
              }}
            >
              <span style={{ fontSize: "3rem", marginBottom: "1rem" }} aria-hidden="true">
                📜
              </span>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "1.25rem",
                  color: "var(--paper)",
                  marginBottom: "0.5rem",
                }}
              >
                {currentCert.title}
              </span>
              <span className="t-label" style={{ opacity: 0.5, color: "var(--paper)" }}>
                Verified by {currentCert.issuer}
              </span>
            </div>
          )}
        </div>

        {/* Right: Certificate Details & Actions */}
        <div
          style={{
            padding: "clamp(1.5rem, 3vw, 2.5rem)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            background: "var(--ink)",
            color: "var(--paper)",
          }}
        >
          <div>
            {/* Header: category & close */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "1.5rem",
              }}
            >
              <span className="t-label" style={{ color: "var(--vermilion)", fontWeight: 700 }}>
                CERTIFICATE {selectedIndex + 1} OF {certificates.length}
              </span>

              <button
                onClick={onClose}
                aria-label="Close certificate viewer"
                data-cursor="link"
                style={{
                  background: "transparent",
                  border: "1px solid rgba(239, 235, 227, 0.2)",
                  color: "var(--paper)",
                  width: "2rem",
                  height: "2rem",
                  borderRadius: "50%",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1rem",
                }}
              >
                ✕
              </button>
            </div>

            {/* Title */}
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "clamp(1.2rem, 2vw, 1.8rem)",
                lineHeight: 1.2,
                color: "var(--paper)",
                marginBottom: "0.75rem",
              }}
            >
              {currentCert.title}
            </h3>

            {/* Issuer & Date */}
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1rem",
                color: "rgba(239, 235, 227, 0.8)",
                marginBottom: "1.25rem",
              }}
            >
              Issued by <strong style={{ color: "var(--paper)" }}>{currentCert.issuer}</strong>
              <br />
              <span className="t-label" style={{ opacity: 0.5, marginTop: "0.3rem", display: "inline-block" }}>
                Date: {currentCert.date}
              </span>
            </p>

            {/* Credential ID Badge */}
            {currentCert.credentialId && (
              <div
                style={{
                  background: "rgba(239, 235, 227, 0.04)",
                  border: "1px solid rgba(239, 235, 227, 0.1)",
                  padding: "0.75rem 1rem",
                  borderRadius: "2px",
                  marginBottom: "1.5rem",
                }}
              >
                <div className="t-label" style={{ opacity: 0.4, marginBottom: "0.25rem" }}>
                  Credential ID
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.75rem",
                    color: "var(--paper)",
                    wordBreak: "break-all",
                  }}
                >
                  {currentCert.credentialId}
                </div>
              </div>
            )}

            {/* Skills acquired */}
            {currentCert.skills && currentCert.skills.length > 0 && (
              <div style={{ marginBottom: "1.5rem" }}>
                <div className="t-label" style={{ opacity: 0.4, marginBottom: "0.5rem" }}>
                  Competencies & Skills
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                  {currentCert.skills.map((s) => (
                    <span
                      key={s}
                      className="t-label"
                      style={{
                        padding: "0.2rem 0.55rem",
                        background: "rgba(239, 235, 227, 0.06)",
                        border: "1px solid rgba(239, 235, 227, 0.12)",
                        borderRadius: "2px",
                        fontSize: "0.6rem",
                        color: "var(--paper)",
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Actions: External link & Prev/Next */}
          <div>
            <a
              href={currentCert.url}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="link"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "0.85rem",
                color: "var(--ink)",
                background: "var(--paper)",
                padding: "0.75rem 1.25rem",
                borderRadius: "2px",
                textDecoration: "none",
                display: "block",
                textAlign: "center",
                marginBottom: "1.5rem",
                cursor: "pointer",
                transition: "background 0.2s, color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--vermilion)";
                e.currentTarget.style.color = "var(--paper)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--paper)";
                e.currentTarget.style.color = "var(--ink)";
              }}
            >
              Verify Credential on Official Platform ↗
            </a>

            {/* Prev / Next controls */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderTop: "1px solid rgba(239, 235, 227, 0.1)",
                paddingTop: "1rem",
              }}
            >
              <button
                onClick={prev}
                className="t-label"
                data-cursor="link"
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--paper)",
                  opacity: 0.7,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.3rem",
                  padding: "0.4rem 0.6rem",
                }}
              >
                ← Previous
              </button>
              <span className="t-label" style={{ opacity: 0.35 }}>
                {selectedIndex + 1} / {certificates.length}
              </span>
              <button
                onClick={next}
                className="t-label"
                data-cursor="link"
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--paper)",
                  opacity: 0.7,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.3rem",
                  padding: "0.4rem 0.6rem",
                }}
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          div[role="dialog"] > div {
            grid-template-columns: 1fr !important;
            max-height: 90vh !important;
            overflow-y: auto !important;
          }
          div[role="dialog"] > div > div:first-child {
            min-height: 240px !important;
            border-right: none !important;
            border-bottom: 1px solid rgba(239, 235, 227, 0.1) !important;
            padding: 1rem !important;
          }
        }
      `}</style>
    </div>
  );
}
