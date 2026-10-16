"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SITE } from "../../content/site";
import CertificateLightbox from "./CertificateLightbox";

gsap.registerPlugin(ScrollTrigger);

// ── Graphic Design skill icons (SVG) ──────────────────────────
const DESIGN_ICONS = [
  {
    id: "logo",
    label: "Logo Design",
    svg: (
      <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="1.5" />
        <path d="M24 12L30 22H18L24 12Z" fill="currentColor" />
        <path d="M18 22L12 32H24L18 22Z" fill="currentColor" opacity="0.5" />
        <path d="M30 22L36 32H24L30 22Z" fill="currentColor" opacity="0.7" />
      </svg>
    ),
  },
  {
    id: "brand",
    label: "Brand Identity",
    svg: (
      <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <rect x="6" y="6" width="16" height="16" fill="currentColor" />
        <rect x="26" y="6" width="16" height="16" fill="currentColor" opacity="0.4" />
        <rect x="6" y="26" width="16" height="16" fill="currentColor" opacity="0.6" />
        <rect x="26" y="26" width="16" height="16" fill="currentColor" opacity="0.2" />
      </svg>
    ),
  },
  {
    id: "type",
    label: "Typography",
    svg: (
      <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <text x="4" y="32" fontSize="28" fontWeight="900" fill="currentColor" fontFamily="sans-serif">Aa</text>
        <line x1="4" y1="38" x2="44" y2="38" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    id: "color",
    label: "Color Systems",
    svg: (
      <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <circle cx="16" cy="20" r="10" fill="currentColor" />
        <circle cx="32" cy="20" r="10" fill="currentColor" opacity="0.5" />
        <circle cx="24" cy="32" r="10" fill="currentColor" opacity="0.35" />
      </svg>
    ),
  },
  {
    id: "motion",
    label: "Motion Graphics",
    svg: (
      <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <path d="M8 24L20 12L32 24L20 36L8 24Z" fill="currentColor" opacity="0.3" />
        <path d="M16 24L28 12L40 24L28 36L16 24Z" fill="currentColor" opacity="0.7" />
        <circle cx="28" cy="24" r="4" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: "print",
    label: "Print Design",
    svg: (
      <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <rect x="8" y="8" width="32" height="22" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <rect x="12" y="30" width="24" height="12" fill="currentColor" opacity="0.8" />
        <line x1="14" y1="14" x2="34" y2="14" stroke="currentColor" strokeWidth="1.5" />
        <line x1="14" y1="19" x2="28" y2="19" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
];

// ── Placeholder portrait ───────────────────────────────────────
function PhotoPlaceholder() {
  return (
    <div
      style={{
        width: "100%",
        aspectRatio: "3/4",
        background: "rgba(239,235,227,0.04)",
        border: "1px solid rgba(239,235,227,0.1)",
        borderRadius: "2px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-end",
        position: "relative",
        overflow: "hidden",
      }}
      role="img"
      aria-label="Portrait of Yeab Addis — photo coming soon"
    >
      {/* Abstract silhouette */}
      <svg
        viewBox="0 0 300 400"
        width="100%"
        height="100%"
        style={{ position:"absolute", inset:0, opacity:0.15 }}
        aria-hidden="true"
        preserveAspectRatio="xMidYMid meet"
      >
        <ellipse cx="150" cy="105" rx="58" ry="65" fill="#EFEBE3" />
        <rect x="122" y="166" width="56" height="32" fill="#EFEBE3" />
        <ellipse cx="150" cy="320" rx="115" ry="105" fill="#EFEBE3" />
      </svg>

      {/* Location pin */}
      <div style={{
        position: "absolute",
        top: "1.25rem",
        left: "1.25rem",
        display: "flex",
        alignItems: "center",
        gap: "0.4rem",
      }}>
        <span style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.55rem",
          letterSpacing: "0.12em",
          textTransform: "uppercase" as const,
          color: "rgba(239,235,227,0.4)",
        }}>
          📍 Addis Ababa, Ethiopia
        </span>
      </div>

      <span style={{
        fontFamily: "var(--font-mono)",
        fontSize: "0.55rem",
        letterSpacing: "0.15em",
        textTransform: "uppercase" as const,
        color: "rgba(239,235,227,0.25)",
        padding: "1.25rem",
        position: "relative",
        zIndex: 1,
      }}>
        Photo · Coming Soon
      </span>
    </div>
  );
}

// ── Portrait Component (renders real photo if available, fallback otherwise) ──
function Portrait() {
  const [loadError, setLoadError] = useState(false);
  const photoSrc = SITE.photo;

  if (!photoSrc || loadError) {
    return <PhotoPlaceholder />;
  }

  return (
    <div
      style={{
        width: "100%",
        aspectRatio: "3/4",
        borderRadius: "2px",
        overflow: "hidden",
        position: "relative",
        border: "1px solid rgba(239,235,227,0.15)",
        background: "rgba(239,235,227,0.04)",
      }}
    >
      <Image
        src={photoSrc}
        alt={`Portrait of ${SITE.fullName}`}
        fill
        sizes="(max-width: 768px) 90vw, 35vw"
        style={{ objectFit: "cover", objectPosition: "center top" }}
        onError={() => setLoadError(true)}
      />
      <div
        style={{
          position: "absolute",
          bottom: "1rem",
          left: "1rem",
          background: "rgba(17,17,17,0.75)",
          backdropFilter: "blur(8px)",
          padding: "0.35rem 0.75rem",
          borderRadius: "2px",
          border: "1px solid rgba(239,235,227,0.12)",
          zIndex: 2,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.55rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase" as const,
            color: "rgba(239,235,227,0.8)",
          }}
        >
          📍 {SITE.location}
        </span>
      </div>
    </div>
  );
}

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const bioRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const iconsRef = useRef<HTMLDivElement>(null);
  const [activeCertIndex, setActiveCertIndex] = useState<number | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Headline
      gsap.from(headlineRef.current, {
        xPercent: -2, opacity: 0, duration: 1.4, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 70%", toggleActions: "play none none reverse" },
      });

      // Bio paragraphs
      gsap.from(
        bioRef.current?.querySelectorAll("p") ?? [],
        {
          y: 20, opacity: 0, stagger: 0.12, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: bioRef.current, start: "top 80%", toggleActions: "play none none reverse" },
        }
      );

      // Stats
      gsap.from(
        statsRef.current?.querySelectorAll(".stat") ?? [],
        {
          y: 16, opacity: 0, stagger: 0.09, duration: 0.7, ease: "power2.out",
          scrollTrigger: { trigger: statsRef.current, start: "top 85%", toggleActions: "play none none reverse" },
        }
      );

      // Icons
      gsap.from(
        iconsRef.current?.querySelectorAll(".icon-item") ?? [],
        {
          scale: 0.85, opacity: 0, stagger: 0.07, duration: 0.5, ease: "back.out(1.5)",
          scrollTrigger: { trigger: iconsRef.current, start: "top 85%", toggleActions: "play none none reverse" },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      aria-label="About Yeab Addis"
      style={{
        background: "var(--ink)",
        color: "var(--paper)",
        padding: "clamp(5rem, 10vh, 8rem) clamp(1.5rem, 5vw, 5rem)",
        overflow: "hidden",
      }}
    >
      <div className="t-label" style={{ opacity:0.35, marginBottom:"clamp(2rem, 5vh, 4rem)", color:"var(--paper)" }}>
        02 — About
      </div>

      {/* Main grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1.3fr 0.7fr",
        gap: "clamp(2rem, 6vw, 7rem)",
        alignItems: "start",
        marginBottom: "clamp(3rem, 6vh, 5rem)",
      }}>
        {/* Left col */}
        <div>
          {/* Giant headline */}
          <div ref={headlineRef}>
            <h2 style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(3.5rem, 10vw, 12rem)",
              lineHeight: 0.88,
              letterSpacing: "-0.04em",
              color: "var(--paper)",
              marginBottom: "clamp(2rem, 5vh, 4rem)",
              fontVariationSettings: '"wdth" 130, "opsz" 72',
            }}>
              Graphic
              <br />
              <span style={{ color:"var(--vermilion)" }}>Designer.</span>
            </h2>
          </div>

          {/* Bio paragraphs */}
          <div ref={bioRef} style={{ marginBottom:"clamp(2rem, 4vh, 3rem)" }}>
            {SITE.bio.map((para, i) => (
              <p key={i} style={{
                fontFamily: i === 0 ? "var(--font-serif)" : "var(--font-display)",
                fontStyle: i === 0 ? "italic" : "normal",
                fontWeight: i === 0 ? 400 : 300,
                fontSize: "clamp(0.95rem, 1.5vw, 1.3rem)",
                lineHeight: 1.55,
                color: "rgba(239,235,227,0.75)",
                marginBottom: "1rem",
                maxWidth: "50ch",
              }}>
                {para}
              </p>
            ))}

            {/* Education badge */}
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.6rem",
              border: "1px solid rgba(239,235,227,0.15)",
              padding: "0.5rem 1rem",
              borderRadius: "2px",
              marginTop: "0.5rem",
            }}>
              <span style={{ fontSize:"1rem" }} aria-hidden="true">🎓</span>
              <span className="t-label" style={{ color:"rgba(239,235,227,0.5)" }}>
                {SITE.education.degree} · {SITE.education.school} · {SITE.education.year}
              </span>
            </div>
          </div>

          {/* Stats */}
          <div ref={statsRef} style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:"1rem" }}>
            {SITE.stats.map((s) => (
              <div key={s.label} className="stat">
                <div style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  fontSize: "clamp(1.8rem, 3vw, 3.5rem)",
                  color: "var(--vermilion)",
                  lineHeight: 1,
                  letterSpacing: "-0.03em",
                }}>
                  {s.value}
                </div>
                <div className="t-label" style={{ color:"rgba(239,235,227,0.4)", marginTop:"0.3rem" }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right col — Photo / Portrait */}
        <div style={{ paddingTop:"0.5rem" }}>
          <Portrait />
        </div>
      </div>

      {/* Graphic Design skill icons strip */}
      <div style={{
        borderTop: "1px solid rgba(239,235,227,0.1)",
        paddingTop: "clamp(2rem, 4vh, 3rem)",
      }}>
        <div className="t-label" style={{ opacity:0.3, marginBottom:"1.5rem", color:"var(--paper)" }}>
          Areas of expertise
        </div>
        <div
          ref={iconsRef}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
            gap: "1rem",
          }}
        >
          {DESIGN_ICONS.map((icon) => (
            <div
              key={icon.id}
              className="icon-item"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.6rem",
                padding: "1.2rem 0.75rem",
                border: "1px solid rgba(239,235,227,0.08)",
                borderRadius: "4px",
                cursor: "default",
                transition: "border-color 0.2s, background 0.2s",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "var(--vermilion)";
                el.style.background = "rgba(255,74,28,0.06)";
                const icon = el.querySelector("svg") as SVGElement | null;
                if (icon) icon.style.color = "var(--vermilion)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "rgba(239,235,227,0.08)";
                el.style.background = "transparent";
                const icon = el.querySelector("svg") as SVGElement | null;
                if (icon) icon.style.color = "rgba(239,235,227,0.5)";
              }}
            >
              <div style={{ width:"2rem", height:"2rem", color:"rgba(239,235,227,0.5)", transition:"color 0.2s" }}>
                {icon.svg}
              </div>
              <span className="t-label" style={{ color:"rgba(239,235,227,0.35)", textAlign:"center", fontSize:"0.5rem" }}>
                {icon.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Verified Certifications & Credentials ── */}
      <div
        id="certifications"
        style={{
          borderTop: "1px solid rgba(239,235,227,0.1)",
          marginTop: "clamp(3rem, 6vh, 5rem)",
          paddingTop: "clamp(2.5rem, 5vh, 4rem)",
        }}
      >
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          flexWrap: "wrap",
          gap: "1rem",
          marginBottom: "clamp(1.5rem, 3vh, 2.5rem)",
        }}>
          <div>
            <div className="t-label" style={{ opacity: 0.35, marginBottom: "0.5rem", color: "var(--paper)" }}>
              03 — Verified Credentials & Certifications
            </div>
            <h3 style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "clamp(1.5rem, 3vw, 2.8rem)",
              color: "var(--paper)",
              letterSpacing: "-0.02em",
            }}>
              Certified Professional
            </h3>
          </div>

          <div style={{ display: "flex", gap: "1.2rem", flexWrap: "wrap" }}>
            <a
              href={SITE.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="t-label"
              style={{
                color: "var(--vermilion)",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.3rem",
                borderBottom: "1px solid var(--vermilion)",
                paddingBottom: "2px",
              }}
            >
              Verify on LinkedIn ↗
            </a>
            <a
              href={SITE.upwork}
              target="_blank"
              rel="noopener noreferrer"
              className="t-label"
              style={{
                color: "var(--paper)",
                opacity: 0.7,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.3rem",
                borderBottom: "1px solid rgba(239,235,227,0.3)",
                paddingBottom: "2px",
              }}
            >
              Upwork Profile ↗
            </a>
          </div>
        </div>

        {/* Certifications Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1.25rem",
          marginBottom: "clamp(2.5rem, 5vh, 4rem)",
        }}>
          {SITE.certifications.map((cert, idx) => (
            <div
              key={cert.title}
              data-cursor="link"
              onClick={() => setActiveCertIndex(idx)}
              style={{
                padding: "1.5rem",
                background: "rgba(239,235,227,0.03)",
                border: "1px solid rgba(239,235,227,0.08)",
                borderRadius: "4px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: "1rem",
                cursor: "pointer",
                transition: "border-color 0.25s, background 0.25s, transform 0.25s",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "var(--vermilion)";
                el.style.background = "rgba(255,74,28,0.05)";
                el.style.transform = "translateY(-3px)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "rgba(239,235,227,0.08)";
                el.style.background = "rgba(239,235,227,0.03)";
                el.style.transform = "translateY(0)";
              }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                  <span style={{ fontSize: "1.2rem" }} aria-hidden="true">📜</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span className="t-label" style={{ opacity: 0.4, color: "var(--paper)" }}>
                      {cert.date}
                    </span>
                    <span
                      className="t-label"
                      style={{
                        padding: "0.15rem 0.4rem",
                        background: "rgba(255,74,28,0.12)",
                        color: "var(--vermilion)",
                        borderRadius: "2px",
                        fontSize: "0.5rem",
                        fontWeight: 700,
                      }}
                    >
                      {idx + 1}/{SITE.certifications.length}
                    </span>
                  </div>
                </div>

                <h4 style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  fontSize: "1.05rem",
                  color: "var(--paper)",
                  lineHeight: 1.25,
                  marginBottom: "0.4rem",
                }}>
                  {cert.title}
                </h4>
                <p style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "0.85rem",
                  color: "rgba(239,235,227,0.6)",
                  lineHeight: 1.4,
                  marginBottom: "0.75rem",
                }}>
                  {cert.issuer}
                </p>

                {(cert as any).image && (
                  <div style={{
                    marginTop: "0.5rem",
                    marginBottom: "0.75rem",
                    borderRadius: "3px",
                    overflow: "hidden",
                    border: "1px solid rgba(239,235,227,0.15)",
                    position: "relative",
                    width: "100%",
                    aspectRatio: "16/10",
                    background: "#080808",
                  }}>
                    <Image
                      src={(cert as any).image}
                      alt={`${cert.title} Certificate`}
                      fill
                      sizes="320px"
                      style={{ objectFit: "contain", objectPosition: "center" }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "rgba(0,0,0,0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        opacity: 0,
                        transition: "opacity 0.2s",
                      }}
                      className="cert-img-overlay"
                    >
                      <span
                        className="t-label"
                        style={{
                          background: "var(--vermilion)",
                          color: "var(--paper)",
                          padding: "0.3rem 0.6rem",
                          borderRadius: "2px",
                          fontSize: "0.6rem",
                          fontWeight: 700,
                        }}
                      >
                        Click to Expand Fullscreen ⤢
                      </span>
                    </div>
                  </div>
                )}

                {(cert as any).skills && (cert as any).skills.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem", marginTop: "0.5rem", marginBottom: "0.5rem" }}>
                    {(cert as any).skills.map((skill: string) => (
                      <span
                        key={skill}
                        className="t-label"
                        style={{
                          fontSize: "0.5rem",
                          color: "rgba(239,235,227,0.6)",
                          background: "rgba(239,235,227,0.04)",
                          border: "1px solid rgba(239,235,227,0.08)",
                          padding: "0.15rem 0.4rem",
                          borderRadius: "2px",
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                {(cert as any).credentialId && (
                  <div className="t-label" style={{ opacity: 0.4, color: "var(--paper)", fontSize: "0.52rem", marginTop: "0.3rem" }}>
                    ID: {(cert as any).credentialId}
                  </div>
                )}
              </div>

              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderTop: "1px solid rgba(239,235,227,0.06)",
                paddingTop: "0.75rem",
                marginTop: "0.5rem",
              }}>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveCertIndex(idx);
                  }}
                  className="t-label"
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "var(--vermilion)",
                    fontSize: "0.62rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.3rem",
                    padding: 0,
                  }}
                >
                  Fullscreen Preview ⤢
                </button>

                <a
                  href={cert.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="t-label"
                  style={{
                    color: "rgba(239,235,227,0.6)",
                    textDecoration: "none",
                    fontSize: "0.58rem",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.25rem",
                  }}
                >
                  Verify ↗
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Upwork Verified Review Card */}
        <div style={{
          background: "rgba(255,74,28,0.06)",
          border: "1px solid rgba(255,74,28,0.25)",
          borderRadius: "4px",
          padding: "clamp(1.5rem, 3vh, 2.5rem)",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
            <span className="t-label" style={{ color: "var(--vermilion)", fontWeight: 700 }}>
              ★ 5.0 CLIENT FEEDBACK — UPWORK VERIFIED
            </span>
            <span className="t-label" style={{ opacity: 0.4, color: "var(--paper)" }}>
              Fixed Price Project
            </span>
          </div>
          <p style={{
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontSize: "clamp(1.1rem, 2vw, 1.6rem)",
            color: "var(--paper)",
            lineHeight: 1.4,
          }}>
            &ldquo;{SITE.testimonial.quote}&rdquo;
          </p>
          <div className="t-label" style={{ opacity: 0.5, color: "var(--paper)" }}>
            {SITE.testimonial.source} · {SITE.testimonial.rating}
          </div>
        </div>
      </div>

      {/* ── 04 — Career Journey & Professional Experience (LinkedIn + Upwork) ── */}
      <div
        id="experience"
        style={{
          borderTop: "1px solid rgba(239,235,227,0.1)",
          marginTop: "clamp(3.5rem, 7vh, 6rem)",
          paddingTop: "clamp(2.5rem, 5vh, 4rem)",
        }}
      >
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          flexWrap: "wrap",
          gap: "1rem",
          marginBottom: "clamp(2rem, 4vh, 3rem)",
        }}>
          <div>
            <div className="t-label" style={{ opacity: 0.35, marginBottom: "0.5rem", color: "var(--paper)" }}>
              04 — Career Journey
            </div>
            <h3 style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "clamp(1.5rem, 3vw, 2.8rem)",
              color: "var(--paper)",
              letterSpacing: "-0.02em",
            }}>
              Professional Experience
            </h3>
          </div>

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
            <span
              className="t-label"
              style={{
                color: "var(--paper)",
                opacity: 0.6,
                fontSize: "0.65rem",
              }}
            >
              Verified via LinkedIn & Upwork Profiles
            </span>
          </div>
        </div>

        {/* Experience Timeline Grid */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "1.75rem",
        }}>
          {SITE.experience.map((item, idx) => (
            <div
              key={`${item.company}-${item.role}`}
              style={{
                background: "rgba(239,235,227,0.02)",
                border: "1px solid rgba(239,235,227,0.08)",
                borderRadius: "4px",
                padding: "clamp(1.5rem, 3vw, 2.25rem)",
                display: "grid",
                gridTemplateColumns: "240px 1fr",
                gap: "2rem",
                transition: "border-color 0.25s, background 0.25s",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "rgba(255,74,28,0.4)";
                el.style.background = "rgba(255,74,28,0.02)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "rgba(239,235,227,0.08)";
                el.style.background = "rgba(239,235,227,0.02)";
              }}
            >
              {/* Left Column: Period, Platform Badge, Location */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.5rem" }}>
                  <span
                    className="t-label"
                    style={{
                      padding: "0.2rem 0.5rem",
                      background: item.platform.includes("Upwork") ? "rgba(255,74,28,0.15)" : "rgba(10,102,194,0.2)",
                      color: item.platform.includes("Upwork") ? "var(--vermilion)" : "#70b5f9",
                      borderRadius: "2px",
                      fontSize: "0.55rem",
                      fontWeight: 700,
                      display: "inline-block",
                    }}
                  >
                    {item.platform}
                  </span>
                </div>

                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.8rem",
                    color: "var(--paper)",
                    fontWeight: 600,
                    marginBottom: "0.35rem",
                  }}
                >
                  {item.period}
                </div>

                <div className="t-label" style={{ opacity: 0.45, color: "var(--paper)", fontSize: "0.6rem", marginBottom: "0.25rem" }}>
                  📍 {item.location}
                </div>

                <div className="t-label" style={{ opacity: 0.35, color: "var(--paper)", fontSize: "0.55rem" }}>
                  {item.type}
                </div>
              </div>

              {/* Right Column: Role Title, Company, Description, Deliverables, Skills */}
              <div>
                <h4
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "clamp(1.15rem, 1.8vw, 1.45rem)",
                    color: "var(--paper)",
                    marginBottom: "0.25rem",
                  }}
                >
                  {item.role}
                </h4>

                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "0.95rem",
                    color: "var(--vermilion)",
                    fontWeight: 600,
                    marginBottom: "1rem",
                  }}
                >
                  {item.company}
                </div>

                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "0.9rem",
                    color: "rgba(239,235,227,0.75)",
                    lineHeight: 1.6,
                    marginBottom: "1rem",
                  }}
                >
                  {item.description}
                </p>

                {item.highlights && item.highlights.length > 0 && (
                  <ul
                    style={{
                      listStyle: "none",
                      padding: 0,
                      margin: "0 0 1.25rem 0",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.4rem",
                    }}
                  >
                    {item.highlights.map((highlight, hIdx) => (
                      <li
                        key={hIdx}
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: "0.82rem",
                          color: "rgba(239,235,227,0.65)",
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "0.5rem",
                        }}
                      >
                        <span style={{ color: "var(--vermilion)", fontWeight: 700 }}>›</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Skills tags */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                  {item.skills.map((skill) => (
                    <span
                      key={skill}
                      className="t-label"
                      style={{
                        padding: "0.2rem 0.55rem",
                        background: "rgba(239,235,227,0.04)",
                        border: "1px solid rgba(239,235,227,0.1)",
                        borderRadius: "2px",
                        fontSize: "0.55rem",
                        color: "rgba(239,235,227,0.7)",
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Certificate Lightbox Modal */}
      <CertificateLightbox
        certificates={SITE.certifications}
        selectedIndex={activeCertIndex}
        onClose={() => setActiveCertIndex(null)}
        onSelectIndex={setActiveCertIndex}
      />

      {/* Mobile adjustments */}
      <style>{`
        @media (max-width: 768px) {
          #about [style*="grid-template-columns: 1.3fr"] {
            grid-template-columns: 1fr !important;
          }
          #about [style*="repeat(4, 1fr)"] {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          #about [style*="repeat(6, 1fr)"] {
            grid-template-columns: repeat(3, 1fr) !important;
          }
          #about [style*="grid-template-columns: 240px 1fr"] {
            grid-template-columns: 1fr !important;
            gap: 1.25rem !important;
          }
        }
      `}</style>
    </section>
  );
}
