"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { SITE } from "../../content/site";
import { useCms } from "./CmsContext";

export default function UpworkIntroCard() {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"showreel" | "overview">("showreel");
  const cms = useCms();

  const upworkData = (SITE as any).upworkIntro || {};
  const headline =
    cms.overrides.custom["upwork_intro_headline"] ||
    upworkData.headline ||
    "Logo Designer | YouTube Thumbnail Designer | Graphics Designer";
  const callout =
    cms.overrides.custom["upwork_intro_callout"] ||
    upworkData.callout ||
    "💛 Your next big idea deserves the spotlight! Message me now and let this full-time freelancer help 💛";
  const statement =
    cms.overrides.custom["upwork_intro_statement"] ||
    upworkData.statement ||
    "Logo and YouTube Thumbnail Design is my passion! If it's not your thing, I'm here to help. With 3+ years of dedicated freelancing, pixel-perfect attention to detail, and 100% on-time delivery, I promise quality work that brings your vision to life!";
  const hourlyRate =
    cms.overrides.custom["upwork_intro_rate"] ||
    upworkData.hourlyRate ||
    "$7.00/hr";
  const profileUrl = upworkData.profileUrl || SITE.upwork;

  // Lock body scroll when modal open
  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") setModalOpen(false);
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleKeyDown);
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [modalOpen]);

  return (
    <>
      {/* ── Main Upwork Intro Spotlight Container ── */}
      <div
        id="upwork-intro"
        style={{
          position: "relative",
          background: "linear-gradient(145deg, rgba(255, 74, 28, 0.05) 0%, rgba(20, 168, 0, 0.03) 50%, rgba(239, 235, 227, 0.02) 100%)",
          border: "1px solid rgba(255, 74, 28, 0.22)",
          borderRadius: "8px",
          padding: "clamp(1.5rem, 3.5vw, 2.5rem)",
          marginBottom: "clamp(2rem, 4vh, 3rem)",
          boxShadow: "0 12px 40px rgba(0, 0, 0, 0.35)",
          overflow: "hidden",
        }}
      >
        {/* Subtle decorative watermark */}
        <div
          style={{
            position: "absolute",
            top: "-15%",
            right: "-5%",
            width: "360px",
            height: "360px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255, 74, 28, 0.09) 0%, transparent 70%)",
            pointerEvents: "none",
            filter: "blur(40px)",
          }}
          aria-hidden="true"
        />

        {/* Top Badges Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "0.75rem",
            marginBottom: "1.5rem",
            paddingBottom: "1.2rem",
            borderBottom: "1px solid rgba(239, 235, 227, 0.08)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.45rem",
                padding: "0.3rem 0.75rem",
                background: "rgba(20, 168, 0, 0.16)",
                border: "1px solid rgba(20, 168, 0, 0.45)",
                borderRadius: "999px",
                color: "#5cdb5c",
                fontFamily: "var(--font-mono)",
                fontSize: "0.66rem",
                fontWeight: 700,
                letterSpacing: "0.06em",
              }}
            >
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "#5cdb5c",
                  boxShadow: "0 0 8px #5cdb5c",
                }}
              />
              <span>UPWORK VERIFIED TALENT · TOP RATED</span>
            </span>

            <span
              style={{
                padding: "0.3rem 0.75rem",
                background: "rgba(255, 74, 28, 0.1)",
                border: "1px solid rgba(255, 74, 28, 0.3)",
                borderRadius: "999px",
                color: "var(--vermilion)",
                fontFamily: "var(--font-mono)",
                fontSize: "0.66rem",
                fontWeight: 700,
                letterSpacing: "0.04em",
              }}
            >
              5 YEARS EXPERIENCE
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.78rem",
                fontWeight: 700,
                color: "#FFD700",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.3rem",
              }}
            >
              <span>★ 5.0</span>
              <span style={{ color: "rgba(239,235,227,0.5)", fontWeight: 400, fontSize: "0.7rem" }}>
                (11/11 5-Star Reviews)
              </span>
            </span>

            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.75rem",
                color: "rgba(239,235,227,0.8)",
                background: "rgba(239,235,227,0.06)",
                padding: "0.25rem 0.6rem",
                borderRadius: "4px",
                border: "1px solid rgba(239,235,227,0.1)",
              }}
            >
              {hourlyRate}
            </span>
          </div>
        </div>

        {/* 2-Column Responsive Layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "clamp(1.5rem, 4vw, 2.75rem)",
            alignItems: "start",
          }}
        >
          {/* ── Left Column: Video & Showreel Card ── */}
          <div>
            <div
              role="button"
              tabIndex={0}
              onClick={() => setModalOpen(true)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setModalOpen(true);
                }
              }}
              title="Click to view Yeabsira's Upwork video intro and portfolio showreel"
              style={{
                position: "relative",
                width: "100%",
                aspectRatio: "16 / 10",
                borderRadius: "8px",
                overflow: "hidden",
                border: "1px solid rgba(255, 74, 28, 0.35)",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5), 0 0 24px rgba(255, 74, 28, 0.15)",
                cursor: "pointer",
                background: "#08090E",
                transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px) scale(1.01)";
                e.currentTarget.style.borderColor = "var(--vermilion)";
                e.currentTarget.style.boxShadow =
                  "0 14px 40px rgba(0, 0, 0, 0.65), 0 0 32px rgba(255, 74, 28, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.borderColor = "rgba(255, 74, 28, 0.35)";
                e.currentTarget.style.boxShadow =
                  "0 10px 30px rgba(0, 0, 0, 0.5), 0 0 24px rgba(255, 74, 28, 0.15)";
              }}
            >
              <Image
                src="/upwork-video-thumbnail.jpg"
                alt="Meet Yeabsira A. — Upwork Video Intro & Design Showcase"
                fill
                sizes="(max-width: 768px) 100vw, 45vw"
                style={{ objectFit: "cover" }}
                priority
              />

              {/* Glassmorphic Gradient Overlay */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(180deg, rgba(8,9,14,0.3) 0%, rgba(8,9,14,0.1) 40%, rgba(8,9,14,0.75) 100%)",
                }}
              />

              {/* Top-Left Live Label */}
              <div
                style={{
                  position: "absolute",
                  top: "0.85rem",
                  left: "0.85rem",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  padding: "0.3rem 0.65rem",
                  background: "rgba(10, 12, 20, 0.85)",
                  backdropFilter: "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)",
                  borderRadius: "4px",
                  border: "1px solid rgba(255,255,255,0.15)",
                }}
              >
                <span style={{ fontSize: "0.62rem", color: "var(--vermilion)" }}>▶</span>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.62rem",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    color: "var(--paper)",
                  }}
                >
                  MEET YEABSIRA A.
                </span>
              </div>

              {/* Top-Right Duration / Badge */}
              <div
                style={{
                  position: "absolute",
                  top: "0.85rem",
                  right: "0.85rem",
                  padding: "0.3rem 0.6rem",
                  background: "rgba(20, 168, 0, 0.25)",
                  backdropFilter: "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)",
                  borderRadius: "4px",
                  border: "1px solid rgba(20, 168, 0, 0.5)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.62rem",
                  fontWeight: 700,
                  color: "#5cdb5c",
                }}
              >
                100% SUCCESS
              </div>

              {/* Pulsing Center Play Button */}
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  background: "rgba(255, 74, 28, 0.9)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  border: "2px solid rgba(255, 255, 255, 0.8)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 0 28px rgba(255, 74, 28, 0.6), 0 4px 16px rgba(0,0,0,0.5)",
                  transition: "transform 0.2s ease, background 0.2s ease",
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="22"
                  height="22"
                  fill="#FFFFFF"
                  style={{ marginLeft: "3px" }}
                  aria-hidden="true"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>

              {/* Bottom Caption Overlay */}
              <div
                style={{
                  position: "absolute",
                  bottom: "0.85rem",
                  left: "0.85rem",
                  right: "0.85rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.65rem",
                    color: "rgba(239,235,227,0.9)",
                    letterSpacing: "0.04em",
                  }}
                >
                  Click to open video intro &amp; showreel ⤢
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.62rem",
                    color: "var(--vermilion)",
                    fontWeight: 700,
                  }}
                >
                  WATCH INTRO
                </span>
              </div>
            </div>

            {/* Quick action buttons below video card */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0.6rem",
                marginTop: "0.85rem",
              }}
            >
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                style={{
                  padding: "0.55rem 0.85rem",
                  background: "rgba(255, 74, 28, 0.12)",
                  border: "1px solid rgba(255, 74, 28, 0.35)",
                  borderRadius: "4px",
                  color: "var(--paper)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.4rem",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "var(--vermilion)";
                  (e.currentTarget as HTMLElement).style.color = "#FFFFFF";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(255, 74, 28, 0.12)";
                  (e.currentTarget as HTMLElement).style.color = "var(--paper)";
                }}
              >
                <span>▶</span>
                <span>Watch Showreel ⤢</span>
              </button>

              <a
                href={profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: "0.55rem 0.85rem",
                  background: "rgba(20, 168, 0, 0.12)",
                  border: "1px solid rgba(20, 168, 0, 0.4)",
                  borderRadius: "4px",
                  color: "#5cdb5c",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.35rem",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "#14a800";
                  (e.currentTarget as HTMLElement).style.color = "#FFFFFF";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(20, 168, 0, 0.12)";
                  (e.currentTarget as HTMLElement).style.color = "#5cdb5c";
                }}
              >
                <span>Upwork Profile ↗</span>
              </a>
            </div>
          </div>

          {/* ── Right Column: Authentic Upwork Intro & Statement ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {/* Title / Role */}
            <div>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.62rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--vermilion)",
                  fontWeight: 700,
                  display: "block",
                  marginBottom: "0.35rem",
                }}
              >
                UPWORK PROFILE OVERVIEW &amp; INTRO
              </span>
              <h4
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "clamp(1.25rem, 2.2vw, 1.75rem)",
                  color: "var(--paper)",
                  lineHeight: 1.25,
                  letterSpacing: "-0.01em",
                }}
              >
                {headline}
              </h4>
            </div>

            {/* Heart Callout Quote */}
            <div
              style={{
                position: "relative",
                padding: "0.85rem 1.15rem",
                background: "rgba(255, 74, 28, 0.08)",
                borderLeft: "3px solid var(--vermilion)",
                borderRadius: "0 6px 6px 0",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-serif)",
                  fontStyle: "italic",
                  fontSize: "clamp(0.92rem, 1.2vw, 1.05rem)",
                  color: "var(--paper)",
                  lineHeight: 1.5,
                  margin: 0,
                }}
              >
                {callout}
              </p>
            </div>

            {/* Authentic Pitch Statement */}
            <p
              style={{
                fontSize: "0.88rem",
                lineHeight: 1.6,
                color: "rgba(239, 235, 227, 0.75)",
                margin: 0,
              }}
            >
              {statement}
            </p>

            {/* Services Checklist Pills */}
            <div>
              <span
                className="t-label"
                style={{
                  fontSize: "0.58rem",
                  color: "rgba(239, 235, 227, 0.45)",
                  display: "block",
                  marginBottom: "0.45rem",
                }}
              >
                WHAT I HELP YOU WITH:
              </span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                {(upworkData.services || [
                  "Logo Design & Brand Identity",
                  "High-CTR YouTube Thumbnails",
                  "Graphics Design & Vector Art",
                  "Product & Display Packaging",
                  "Business Cards & Stationery",
                  "Flyers, Banners & Social Kits",
                ]).map((srv: string) => (
                  <span
                    key={srv}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.3rem",
                      padding: "0.25rem 0.55rem",
                      background: "rgba(239, 235, 227, 0.04)",
                      border: "1px solid rgba(239, 235, 227, 0.1)",
                      borderRadius: "4px",
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.62rem",
                      color: "rgba(239, 235, 227, 0.85)",
                    }}
                  >
                    <span style={{ color: "#5cdb5c" }}>✓</span>
                    <span>{srv}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Why Choose Me / Guarantees Row */}
            <div>
              <span
                className="t-label"
                style={{
                  fontSize: "0.58rem",
                  color: "rgba(239, 235, 227, 0.45)",
                  display: "block",
                  marginBottom: "0.45rem",
                }}
              >
                WHY CHOOSE ME:
              </span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                {(upworkData.guarantees || [
                  { icon: "⚡", label: "On-time delivery" },
                  { icon: "🎯", label: "Attention to detail" },
                  { icon: "💡", label: "Personalized solutions" },
                  { icon: "⭐", label: "5.0 ★ Client feedback" },
                  { icon: "🔄", label: "Dedicated revisions" },
                ]).map((g: any) => (
                  <span
                    key={g.label}
                    title={g.desc}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.35rem",
                      padding: "0.25rem 0.55rem",
                      background: "rgba(255, 74, 28, 0.06)",
                      border: "1px solid rgba(255, 74, 28, 0.2)",
                      borderRadius: "999px",
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.6rem",
                      color: "var(--paper)",
                    }}
                  >
                    <span>{g.icon}</span>
                    <span>{g.label}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* CTA Actions */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "0.75rem",
                marginTop: "0.5rem",
                paddingTop: "0.75rem",
                borderTop: "1px solid rgba(239, 235, 227, 0.08)",
              }}
            >
              <a
                href={profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  padding: "0.6rem 1.25rem",
                  background: "var(--vermilion)",
                  border: "1px solid var(--vermilion)",
                  borderRadius: "4px",
                  color: "#FFFFFF",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  textDecoration: "none",
                  boxShadow: "0 4px 16px rgba(255, 74, 28, 0.35)",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    "0 6px 20px rgba(255, 74, 28, 0.5)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    "0 4px 16px rgba(255, 74, 28, 0.35)";
                }}
              >
                <span>Hire Yeab on Upwork ↗</span>
              </a>

              <a
                href="#reviews-list"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("reviews-list")?.scrollIntoView({ behavior: "smooth" });
                }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  padding: "0.6rem 1rem",
                  background: "rgba(239, 235, 227, 0.05)",
                  border: "1px solid rgba(239, 235, 227, 0.15)",
                  borderRadius: "4px",
                  color: "var(--paper)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(239, 235, 227, 0.12)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(239, 235, 227, 0.05)";
                }}
              >
                <span>Read 11 Verified Reviews ↓</span>
              </a>

              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                }}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.68rem",
                  color: "rgba(239, 235, 227, 0.55)",
                  textDecoration: "none",
                  marginLeft: "auto",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "var(--vermilion)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "rgba(239, 235, 227, 0.55)";
                }}
              >
                Direct Message →
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── Interactive Upwork Intro Showcase Lightbox / Modal ── */}
      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Meet Yeabsira Addis — Upwork Intro Showcase"
          onClick={() => setModalOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000000,
            background: "rgba(5, 6, 12, 0.88)",
            backdropFilter: "blur(20px) saturate(180%)",
            WebkitBackdropFilter: "blur(20px) saturate(180%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "clamp(1rem, 3vw, 2rem)",
            animation: "fadeIn 0.25s ease-out",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "960px",
              maxHeight: "90vh",
              background: "#0D0F18",
              border: "1px solid rgba(255, 74, 28, 0.3)",
              borderRadius: "12px",
              boxShadow: "0 24px 60px rgba(0, 0, 0, 0.85), 0 0 40px rgba(255, 74, 28, 0.2)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "1rem 1.5rem",
                borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                background: "rgba(255, 255, 255, 0.02)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div
                  style={{
                    position: "relative",
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    overflow: "hidden",
                    border: "1px solid rgba(255, 74, 28, 0.5)",
                  }}
                >
                  <Image
                    src="/yeab-photo.jpg"
                    alt="Yeabsira Addis"
                    fill
                    sizes="36px"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 700,
                        fontSize: "0.95rem",
                        color: "#FFFFFF",
                      }}
                    >
                      Yeabsira Addis
                    </span>
                    <span
                      style={{
                        color: "#5cdb5c",
                        fontSize: "0.75rem",
                      }}
                      title="Verified Upwork Freelancer"
                    >
                      ✓
                    </span>
                  </div>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.62rem",
                      color: "rgba(255, 255, 255, 0.5)",
                    }}
                  >
                    Top Rated Graphic &amp; Logo Designer · Upwork Verified
                  </span>
                </div>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                aria-label="Close modal"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "rgba(255, 255, 255, 0.08)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  color: "#FFFFFF",
                  fontSize: "1rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(255, 74, 28, 0.4)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(255, 255, 255, 0.08)";
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Tabs */}
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                padding: "0.75rem 1.5rem 0",
                borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
              }}
            >
              {[
                { id: "showreel", label: "🎨 Portfolio Showreel & Video Intro" },
                { id: "overview", label: "📄 Complete Upwork Bio & Credentials" },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveTab(t.id as any)}
                  style={{
                    padding: "0.5rem 0.9rem",
                    border: "none",
                    background: "transparent",
                    borderBottom: activeTab === t.id ? "2px solid var(--vermilion)" : "2px solid transparent",
                    color: activeTab === t.id ? "#FFFFFF" : "rgba(255, 255, 255, 0.5)",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.7rem",
                    fontWeight: activeTab === t.id ? 700 : 500,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Modal Body Scrollable */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "1.5rem",
                display: "flex",
                flexDirection: "column",
                gap: "1.25rem",
              }}
            >
              {activeTab === "showreel" ? (
                <>
                  {/* Video & Portfolio Hero Grid Banner */}
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      borderRadius: "8px",
                      overflow: "hidden",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                    }}
                  >
                    <Image
                      src="/upwork-video-thumbnail.jpg"
                      alt="Yeabsira Addis Upwork Intro Video"
                      width={900}
                      height={500}
                      style={{ width: "100%", height: "auto", display: "block" }}
                    />
                  </div>

                  {/* 42 Logo Matrix Raw Showcase */}
                  <div>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.62rem",
                        color: "var(--vermilion)",
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        display: "block",
                        marginBottom: "0.5rem",
                      }}
                    >
                      UPWORK PORTFOLIO SHOWCASE · 42 SIGNATURE VECTOR LOGOMARKS
                    </span>
                    <div
                      style={{
                        position: "relative",
                        width: "100%",
                        borderRadius: "8px",
                        overflow: "hidden",
                        border: "1px solid rgba(255, 255, 255, 0.12)",
                      }}
                    >
                      <Image
                        src="/upwork-image-raw.jpg"
                        alt="Yeabsira 42 Vector Logos"
                        width={900}
                        height={600}
                        style={{ width: "100%", height: "auto", display: "block" }}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div
                    style={{
                      padding: "1rem",
                      background: "rgba(255, 74, 28, 0.08)",
                      borderLeft: "3px solid var(--vermilion)",
                      borderRadius: "0 6px 6px 0",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "var(--font-serif)",
                        fontStyle: "italic",
                        fontSize: "1rem",
                        color: "#FFFFFF",
                        margin: 0,
                      }}
                    >
                      {callout}
                    </p>
                  </div>

                  <p style={{ fontSize: "0.9rem", lineHeight: 1.6, color: "rgba(255, 255, 255, 0.8)", margin: 0 }}>
                    {statement}
                  </p>

                  <div
                    style={{
                      background: "rgba(255, 255, 255, 0.03)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      borderRadius: "8px",
                      padding: "1rem",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.65rem",
                        color: "#5cdb5c",
                        fontWeight: 700,
                        display: "block",
                        marginBottom: "0.6rem",
                      }}
                    >
                      VERIFIED SKILLS &amp; CAPABILITIES:
                    </span>
                    <ul
                      style={{
                        margin: 0,
                        paddingLeft: "1.2rem",
                        fontSize: "0.82rem",
                        color: "rgba(255, 255, 255, 0.75)",
                        lineHeight: 1.7,
                      }}
                    >
                      <li>Logo Design &amp; Brand Systems</li>
                      <li>High-CTR YouTube Thumbnails &amp; Video Packaging</li>
                      <li>Corporate Identity, Typography &amp; Print Collateral</li>
                      <li>Product Packaging &amp; Manufacturing Dielines</li>
                      <li>Adobe Creative Suite (Illustrator, Photoshop, After Effects) &amp; AI Media</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "1rem 1.5rem",
                borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                background: "rgba(0, 0, 0, 0.4)",
                flexWrap: "wrap",
                gap: "0.75rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.75rem",
                    color: "rgba(255, 255, 255, 0.6)",
                  }}
                >
                  Rate: <strong style={{ color: "#FFFFFF" }}>{hourlyRate}</strong> · 100% Verified
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  style={{
                    padding: "0.5rem 1rem",
                    background: "rgba(255, 255, 255, 0.06)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    borderRadius: "4px",
                    color: "#FFFFFF",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.7rem",
                    cursor: "pointer",
                  }}
                >
                  Close
                </button>

                <a
                  href={profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    padding: "0.5rem 1.15rem",
                    background: "var(--vermilion)",
                    border: "1px solid var(--vermilion)",
                    borderRadius: "4px",
                    color: "#FFFFFF",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    textDecoration: "none",
                    boxShadow: "0 2px 10px rgba(255, 74, 28, 0.4)",
                  }}
                >
                  <span>Open Official Upwork Profile &amp; Video ↗</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
