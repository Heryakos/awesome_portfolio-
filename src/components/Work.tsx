"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { PROJECTS } from "../../content/projects";
import PlaceholderArtwork from "./PlaceholderArtwork";

import { useCms } from "./CmsContext";

gsap.registerPlugin(ScrollTrigger);

const CARD_HEIGHT = 88;
const CARD_WIDTH  = 80;
const CARD_GAP    = 5;

export default function Work() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef  = useRef<HTMLDivElement>(null);
  const cms = useCms();

  const hiddenSlugs = cms.overrides.hiddenProjects || [];
  const customProjects = (cms.overrides.customProjects || []).map((cp, idx) => ({
    index: `0${idx + 1}`,
    slug: cp.slug,
    title: cp.title,
    discipline: cp.category || "Design",
    year: cp.year || "2026",
    client: cp.client || "Client",
    images: cp.heroImage ? [cp.heroImage] : [],
    palette: ["#1a1a1a", "#FF4A1C", "#EFEBE3"] as [string, string, string],
    deliverables: cp.deliverables || ["Brand Identity"],
    placeholder: !cp.heroImage,
  }));

  const allProjects = [...customProjects, ...PROJECTS].filter(
    (p) => !hiddenSlugs.includes(p.slug)
  );

  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    if (isMobile) return;

    const ctx = gsap.context(() => {
      const track = trackRef.current;
      if (!track) return;

      const getTotal = () => track.scrollWidth - window.innerWidth;

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: () => `+=${getTotal()}`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          gsap.set(track, { x: -getTotal() * self.progress });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="work"
      aria-label="Selected work"
      style={{
        position: "relative",
        height: "100vh",
        overflow: "hidden",
        background: "var(--paper)",
      }}
    >
      {/* Labels */}
      <div
        className="t-label work__header-label"
        style={{
          position: "absolute",
          top: "1.5rem",
          left: "clamp(1.25rem, 4vw, 2.5rem)",
          zIndex: 20,
          opacity: 0.45,
        }}
      >
        Selected Work — {allProjects.length} Projects
      </div>
      <div
        className="t-label work__scroll-label"
        style={{
          position: "absolute",
          top: "1.5rem",
          right: "clamp(1.25rem, 4vw, 2.5rem)",
          zIndex: 20,
          opacity: 0.3,
        }}
      >
        Scroll →
      </div>

      {/* Horizontal track */}
      <div
        ref={trackRef}
        data-cursor="drag"
        style={{
          display: "flex",
          alignItems: "center",
          height: "100%",
          paddingLeft: `${CARD_GAP}vw`,
          paddingRight: `${CARD_GAP}vw`,
          gap: `${CARD_GAP}vw`,
          willChange: "transform",
        }}
      >
        {allProjects.map((project, i) => (
          <article
            key={project.slug}
            style={{
              width: `${CARD_WIDTH}vw`,
              height: `${CARD_HEIGHT}vh`,
              flexShrink: 0,
              position: "relative",
              overflow: "hidden",
              borderRadius: "2px",
            }}
            aria-label={`Project: ${project.title}`}
          >
            {/* ── Image (real) or procedural placeholder ── */}
            {!project.placeholder && project.images[0] ? (
              <Image
                src={project.images[0]}
                alt={`${project.title} — ${project.discipline} by Yeab Addis`}
                fill
                sizes="80vw"
                style={{ objectFit: "cover", objectPosition: "center top" }}
                priority={i === 0}
              />
            ) : (
              <PlaceholderArtwork
                palette={project.palette}
                index={i}
                title={project.title}
                discipline={project.discipline}
              />
            )}

            {/* Gradient for text legibility */}
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(to top, rgba(10,10,10,0.88) 0%, rgba(10,10,10,0.2) 55%, transparent 100%)",
              zIndex: 1,
            }} aria-hidden="true" />

            {/* Project info */}
            <div style={{ position:"absolute", bottom:"2.5rem", left:"2.5rem", right:"2.5rem", zIndex:2 }}>
              <div className="t-label" style={{ color:"var(--paper)", opacity:0.6, marginBottom:"0.5rem" }}>
                {project.index} — {project.discipline} — {project.year}
              </div>
              <h3 style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: "clamp(2rem, 4.5vw, 6rem)",
                lineHeight: 0.9,
                letterSpacing: "-0.03em",
                color: "var(--paper)",
                fontVariationSettings: '"wdth" 115, "opsz" 40',
                marginBottom: "1rem",
              }}>
                {project.title}
              </h3>

              {/* Deliverables pills */}
              <div style={{ display:"flex", flexWrap:"wrap", gap:"0.4rem", maxWidth:"60ch" }}>
                {project.deliverables.slice(0, 4).map((d) => (
                  <span key={d} className="t-label" style={{
                    color: "var(--paper)",
                    border: "1px solid rgba(239,235,227,0.25)",
                    padding: "0.25rem 0.6rem",
                    borderRadius: "2px",
                    fontSize: "0.55rem",
                    opacity: 0.7,
                  }}>
                    {d}
                  </span>
                ))}
              </div>
            </div>

            {/* Client badge — top right */}
            {project.client !== "PLACEHOLDER" && (
              <div style={{ position:"absolute", top:"2rem", right:"2rem", zIndex:2 }}>
                <span className="t-label" style={{ color:"var(--paper)", opacity:0.5 }}>
                  {project.client}
                </span>
              </div>
            )}

            {/* Full card clickable link overlay */}
            <Link
              href={`/work/${project.slug}`}
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 4,
                textIndent: "-9999px",
              }}
              aria-label={`View ${project.title} case study`}
            >
              View {project.title}
            </Link>

            {/* Arrow — visual indicator at top right corner */}
            <div
              style={{
                position: "absolute",
                top: "2rem",
                right: "2rem",
                zIndex: 5,
                width: "2.5rem",
                height: "2.5rem",
                border: "1px solid rgba(239,235,227,0.3)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--paper)",
                fontSize: "1rem",
                pointerEvents: "none",
                transition: "background 0.2s, border-color 0.2s",
              }}
              aria-hidden="true"
            >
              ↗
            </div>
          </article>
        ))}
      </div>

      {/* Mobile stack */}
      <style>{`
        @media (max-width: 768px) {
          .work__scroll-label {
            display: none !important;
          }
          .work__header-label {
            top: 4.8rem !important;
          }
          #work {
            height: auto !important;
            overflow: visible !important;
          }
          #work > div[data-cursor] {
            flex-direction: column !important;
            transform: none !important;
            overflow: visible !important;
            padding-left: 1.25rem !important;
            padding-right: 1.25rem !important;
            padding-top: 7.2rem !important;
            padding-bottom: 3.5rem !important;
            gap: 1.5rem !important;
          }
          #work > div[data-cursor] > article {
            width: 100% !important;
            height: 75vw !important;
            min-height: 280px;
          }
        }
      `}</style>
    </section>
  );
}
