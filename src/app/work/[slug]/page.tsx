"use client";

import { PROJECTS } from "../../../../content/projects";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { use, useState, useEffect } from "react";

interface Props {
  params: Promise<{ slug: string }>;
}

export default function CaseStudyPage({ params }: Props) {
  const { slug } = use(params);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const currentIndex = PROJECTS.findIndex((p) => p.slug === slug);
  if (currentIndex === -1) notFound();

  const project = PROJECTS[currentIndex];
  const prevProject = PROJECTS[(currentIndex - 1 + PROJECTS.length) % PROJECTS.length];
  const nextProject = PROJECTS[(currentIndex + 1) % PROJECTS.length];

  const [bg, fg, acc] = project.palette;

  // ESC to close fullscreen lightbox
  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen]);

  return (
    <main style={{ background: "var(--paper)", minHeight: "100dvh", color: "var(--ink)" }}>
      {/* ── 01 Project Overview & Hero ── */}
      <section
        aria-label="Project overview"
        style={{
          minHeight: "100vh",
          background: fg,
          color: bg,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "clamp(5rem, 10vh, 8rem) clamp(1.5rem, 5vw, 5rem)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {project.images[0] && (
          <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
            <Image
              src={project.images[0]}
              alt={project.title}
              fill
              style={{ objectFit: "cover", objectPosition: "center top", opacity: 0.25 }}
              priority
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `linear-gradient(to top, ${fg} 50%, rgba(0,0,0,0.4) 100%)`,
              }}
            />
          </div>
        )}

        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Metadata pill row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              flexWrap: "wrap",
              marginBottom: "1.5rem",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.65rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                opacity: 0.6,
                color: bg,
              }}
            >
              {project.index} / {String(PROJECTS.length).padStart(2, "0")}
            </span>
            <span style={{ opacity: 0.3, color: bg }}>·</span>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.65rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                opacity: 0.75,
                color: bg,
              }}
            >
              {project.discipline}
            </span>
            <span style={{ opacity: 0.3, color: bg }}>·</span>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.65rem",
                letterSpacing: "0.14em",
                color: acc,
                fontWeight: 700,
              }}
            >
              Client: {project.client} ({project.year})
            </span>
          </div>

          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(3rem, 10.5vw, 13rem)",
              lineHeight: 0.9,
              letterSpacing: "-0.04em",
              color: bg,
              marginBottom: "2rem",
              fontVariationSettings: '"wdth" 130, "opsz" 72',
            }}
          >
            {project.title}
          </h1>

          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontSize: "clamp(1.05rem, 2vw, 1.85rem)",
              lineHeight: 1.45,
              color: bg,
              opacity: 0.88,
              maxWidth: "52ch",
            }}
          >
            {project.idea}
          </p>
        </div>
      </section>

      {/* ── 02 Project Visual Showcase (Clickable for 4K Zoom) ── */}
      {project.images[0] && (
        <section
          aria-label="Project visuals"
          style={{
            background: bg === "#EFEBE3" ? "#0d0d0d" : "#080808",
            position: "relative",
            cursor: "zoom-in",
          }}
          onClick={() => setLightboxOpen(true)}
        >
          <div
            style={{
              position: "relative",
              width: "100%",
              aspectRatio: "16/10",
              maxHeight: "88vh",
              overflow: "hidden",
            }}
          >
            <Image
              src={project.images[0]}
              alt={`${project.title} high resolution design showcase`}
              fill
              sizes="100vw"
              style={{ objectFit: "contain", objectPosition: "center" }}
              priority
            />

            {/* Click to expand hover hint */}
            <div
              style={{
                position: "absolute",
                bottom: "1.5rem",
                right: "1.5rem",
                background: "rgba(10, 10, 10, 0.75)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "999px",
                padding: "0.45rem 0.95rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.45rem",
                color: "#fff",
                fontFamily: "var(--font-mono)",
                fontSize: "0.68rem",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                pointerEvents: "none",
                boxShadow: "0 4px 14px rgba(0,0,0,0.5)",
              }}
            >
              <span>Click for 4K Fullscreen ⤢</span>
            </div>
          </div>
        </section>
      )}

      {/* ── Fullscreen High-Res Image Lightbox Modal ── */}
      {lightboxOpen && project.images[0] && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${project.title} Fullscreen Preview`}
          onClick={() => setLightboxOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100000,
            background: "rgba(5, 5, 5, 0.96)",
            backdropFilter: "blur(14px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "clamp(1rem, 3vw, 2.5rem)",
            cursor: "zoom-out",
          }}
        >
          {/* Top Bar */}
          <div
            style={{
              position: "absolute",
              top: "1.25rem",
              left: "1.5rem",
              right: "1.5rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              zIndex: 10,
              pointerEvents: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ color: "var(--paper)", fontFamily: "var(--font-mono)", fontSize: "0.75rem" }}>
              <span style={{ color: "var(--vermilion)", fontWeight: 700 }}>{project.title}</span> — 4K Fullscreen Preview
            </div>
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "#fff",
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                fontSize: "1rem",
              }}
            >
              ✕
            </button>
          </div>

          <div
            style={{
              position: "relative",
              width: "100%",
              height: "85vh",
              maxHeight: "88vh",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={project.images[0]}
              alt={project.title}
              fill
              sizes="100vw"
              style={{ objectFit: "contain" }}
              priority
            />
          </div>
        </div>
      )}

      {/* ── 03 Design Direction ── */}
      <section
        aria-label="Design direction"
        style={{
          background: "var(--paper)",
          padding: "clamp(4.5rem, 9vh, 7.5rem) clamp(1.5rem, 5vw, 5rem)",
          display: "grid",
          gridTemplateColumns: "1fr 2fr",
          gap: "5vw",
          alignItems: "center",
        }}
      >
        <div>
          <div className="t-label" style={{ opacity: 0.4, marginBottom: "1rem" }}>
            02 — Design Direction
          </div>
          <div style={{ width: "2px", height: "5.5rem", background: acc }} aria-hidden="true" />
        </div>
        <div>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 400,
              fontSize: "clamp(1.05rem, 1.8vw, 1.85rem)",
              lineHeight: 1.55,
              color: "var(--ink)",
              marginBottom: "1.5rem",
            }}
          >
            {project.direction}
          </p>
          <div className="t-label" style={{ opacity: 0.5, color: "var(--ink)", fontSize: "0.62rem" }}>
            Visual Hierarchy · Typography System · Optical Precision · Vector Master Files
          </div>
        </div>
      </section>

      {/* ── 04 Deliverables ── */}
      <section
        aria-label="Deliverables"
        style={{
          background: fg,
          padding: "clamp(4.5rem, 9vh, 7.5rem) clamp(1.5rem, 5vw, 5rem)",
        }}
      >
        <div className="t-label" style={{ opacity: 0.5, marginBottom: "2rem", color: bg }}>
          03 — What was delivered
        </div>
        <ul style={{ listStyle: "none", borderTop: `1px solid ${bg}33` }}>
          {project.deliverables.map((d, i) => (
            <li
              key={d}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: `1px solid ${bg}33`,
                padding: "clamp(0.85rem, 1.8vh, 1.35rem) 0",
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: "clamp(0.95rem, 1.8vw, 1.65rem)",
                color: bg,
              }}
            >
              <span>{d}</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", opacity: 0.4, color: bg }}>
                {String(i + 1).padStart(2, "0")}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* ── 05 Project Navigator (Next & Previous Case Studies) ── */}
      <section
        aria-label="Explore other projects"
        style={{
          background: "var(--ink)",
          borderTop: "1px solid rgba(239, 235, 227, 0.1)",
          borderBottom: "1px solid rgba(239, 235, 227, 0.1)",
          padding: "clamp(3.5rem, 7vh, 5.5rem) clamp(1.5rem, 5vw, 5rem)",
        }}
      >
        <div
          className="t-label"
          style={{
            opacity: 0.4,
            marginBottom: "2rem",
            color: "var(--paper)",
            textAlign: "center",
            letterSpacing: "0.15em",
          }}
        >
          CONTINUE EXPLORING YEAB&apos;S WORK
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "2rem",
          }}
        >
          {/* Previous Project Card */}
          <Link
            href={`/work/${prevProject.slug}`}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "clamp(1.5rem, 3vw, 2.25rem)",
              background: "rgba(239, 235, 227, 0.03)",
              border: "1px solid rgba(239, 235, 227, 0.1)",
              borderRadius: "4px",
              textDecoration: "none",
              color: "var(--paper)",
              transition: "transform 0.25s, border-color 0.25s, background 0.25s",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.transform = "translateY(-4px)";
              el.style.borderColor = "var(--vermilion)";
              el.style.background = "rgba(255, 74, 28, 0.06)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.transform = "translateY(0)";
              el.style.borderColor = "rgba(239, 235, 227, 0.1)";
              el.style.background = "rgba(239, 235, 227, 0.03)";
            }}
          >
            <div>
              <div
                className="t-label"
                style={{
                  color: "var(--vermilion)",
                  fontWeight: 700,
                  fontSize: "0.62rem",
                  marginBottom: "0.5rem",
                  letterSpacing: "0.12em",
                }}
              >
                ← PREVIOUS PROJECT
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "clamp(1.2rem, 2vw, 1.7rem)",
                  lineHeight: 1.15,
                  letterSpacing: "-0.02em",
                  marginBottom: "0.4rem",
                }}
              >
                {prevProject.title}
              </h3>
              <div className="t-label" style={{ opacity: 0.5, color: "var(--paper)", fontSize: "0.6rem" }}>
                {prevProject.discipline} · {prevProject.year}
              </div>
            </div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.65rem",
                color: "var(--vermilion)",
                marginTop: "1.5rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.3rem",
              }}
            >
              View Case Study →
            </div>
          </Link>

          {/* Next Project Card */}
          <Link
            href={`/work/${nextProject.slug}`}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "clamp(1.5rem, 3vw, 2.25rem)",
              background: "rgba(239, 235, 227, 0.03)",
              border: "1px solid rgba(239, 235, 227, 0.1)",
              borderRadius: "4px",
              textDecoration: "none",
              color: "var(--paper)",
              transition: "transform 0.25s, border-color 0.25s, background 0.25s",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.transform = "translateY(-4px)";
              el.style.borderColor = "var(--vermilion)";
              el.style.background = "rgba(255, 74, 28, 0.06)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.transform = "translateY(0)";
              el.style.borderColor = "rgba(239, 235, 227, 0.1)";
              el.style.background = "rgba(239, 235, 227, 0.03)";
            }}
          >
            <div>
              <div
                className="t-label"
                style={{
                  color: "var(--vermilion)",
                  fontWeight: 700,
                  fontSize: "0.62rem",
                  marginBottom: "0.5rem",
                  letterSpacing: "0.12em",
                }}
              >
                NEXT PROJECT →
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "clamp(1.2rem, 2vw, 1.7rem)",
                  lineHeight: 1.15,
                  letterSpacing: "-0.02em",
                  marginBottom: "0.4rem",
                }}
              >
                {nextProject.title}
              </h3>
              <div className="t-label" style={{ opacity: 0.5, color: "var(--paper)", fontSize: "0.6rem" }}>
                {nextProject.discipline} · {nextProject.year}
              </div>
            </div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.65rem",
                color: "var(--vermilion)",
                marginTop: "1.5rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.3rem",
              }}
            >
              View Case Study →
            </div>
          </Link>
        </div>
      </section>

      {/* ── 06 CTA ── */}
      <section
        aria-label="Get in touch"
        style={{
          minHeight: "55vh",
          background: "var(--ink)",
          padding: "clamp(4.5rem, 9vh, 7.5rem) clamp(1.5rem, 5vw, 5rem)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <div className="t-label" style={{ opacity: 0.35, marginBottom: "1.5rem", color: "var(--paper)" }}>
          Want something like this?
        </div>
        <p
          style={{
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontSize: "clamp(1.6rem, 4vw, 5rem)",
            color: "var(--paper)",
            lineHeight: 1.2,
            maxWidth: "22ch",
            marginBottom: "3rem",
          }}
        >
          Let&apos;s build your brand identity together.
        </p>
        <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", alignItems: "center" }}>
          <a
            href="/#contact"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "1rem",
              letterSpacing: "-0.01em",
              color: "var(--ink)",
              background: "var(--paper)",
              padding: "0.85rem 2rem",
              borderRadius: "2px",
              textDecoration: "none",
              display: "inline-block",
              transition: "background 0.2s, color 0.2s, transform 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "var(--vermilion)";
              (e.currentTarget as HTMLElement).style.color = "var(--paper)";
              (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "var(--paper)";
              (e.currentTarget as HTMLElement).style.color = "var(--ink)";
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
            }}
          >
            Get in touch →
          </a>
          <Link
            href="/#work"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.68rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--paper)",
              textDecoration: "none",
              opacity: 0.6,
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.opacity = "1";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.opacity = "0.6";
            }}
          >
            ← All projects
          </Link>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          main > section[aria-label="Design direction"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}
