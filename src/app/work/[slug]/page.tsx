"use client";

import { PROJECTS } from "../../../../content/projects";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { use } from "react";

interface Props { params: Promise<{ slug: string }> }

export default function CaseStudyPage({ params }: Props) {
  const { slug } = use(params);
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) notFound();

  const [bg, fg, acc] = project.palette;

  return (
    <main style={{ background: "var(--paper)", minHeight: "100dvh", color: "var(--ink)" }}>
      <section aria-label="Project overview" style={{
        minHeight: "100vh", background: fg, color: bg,
        display: "flex", flexDirection: "column", justifyContent: "flex-end",
        padding: "clamp(5rem,10vh,8rem) clamp(1.5rem,5vw,5rem)",
        position: "relative", overflow: "hidden",
      }}>
        {project.images[0] && (
          <div style={{ position:"absolute", inset:0, zIndex:0 }}>
            <Image src={project.images[0]} alt={project.title} fill
              style={{ objectFit:"cover", objectPosition:"center top", opacity:0.3 }} priority />
            <div style={{ position:"absolute", inset:0,
              background:`linear-gradient(to top, ${fg} 45%, transparent 100%)` }} />
          </div>
        )}
        <div style={{ position:"relative", zIndex:1 }}>
          <div style={{ fontFamily:"var(--font-mono)", fontSize:"0.62rem", letterSpacing:"0.18em",
            textTransform:"uppercase" as const, opacity:0.5, marginBottom:"1.5rem", color:bg }}>
            {project.index} — {project.discipline} — {project.year}
          </div>
          <h1 style={{
            fontFamily:"var(--font-display)", fontWeight:800,
            fontSize:"clamp(3rem,11vw,15rem)", lineHeight:0.88,
            letterSpacing:"-0.04em", color:bg, marginBottom:"2rem",
            fontVariationSettings:'"wdth" 130, "opsz" 72',
          }}>
            {project.title}
          </h1>
          <p style={{
            fontFamily:"var(--font-serif)", fontStyle:"italic",
            fontSize:"clamp(1rem,2vw,1.8rem)", lineHeight:1.45, color:bg,
            opacity:0.8, maxWidth:"50ch",
          }}>
            {project.idea}
          </p>
        </div>
      </section>

      {/* ── 02 Project cover image full view ── */}
      {project.images[0] && (
        <section aria-label="Project visuals" style={{ background: bg === "#EFEBE3" ? "#fff" : "#f5f0ea" }}>
          <div style={{ position:"relative", width:"100%", aspectRatio:"4/3", maxHeight:"85vh", overflow:"hidden" }}>
            <Image src={project.images[0]} alt={`${project.title} design work`} fill
              style={{ objectFit:"contain", objectPosition:"center", background:bg }} />
          </div>
        </section>
      )}

      {/* ── 03 Design Direction ── */}
      <section aria-label="Design direction" style={{
        background:"var(--paper)",
        padding:"clamp(4rem,8vh,7rem) clamp(1.5rem,5vw,5rem)",
        display:"grid", gridTemplateColumns:"1fr 2fr", gap:"5vw", alignItems:"center",
      }}>
        <div>
          <div className="t-label" style={{ opacity:0.4, marginBottom:"1rem" }}>02 — Design Direction</div>
          <div style={{ width:"1px", height:"6rem", background:acc }} aria-hidden="true" />
        </div>
        <p style={{
          fontFamily:"var(--font-display)", fontWeight:400,
          fontSize:"clamp(1rem,1.8vw,1.8rem)", lineHeight:1.5, color:"var(--ink)",
        }}>
          {project.direction}
        </p>
      </section>

      {/* ── 04 Deliverables ── */}
      <section aria-label="Deliverables" style={{
        background:fg, padding:"clamp(4rem,8vh,7rem) clamp(1.5rem,5vw,5rem)",
      }}>
        <div className="t-label" style={{ opacity:0.5, marginBottom:"2rem", color:bg }}>
          03 — What was delivered
        </div>
        <ul style={{ listStyle:"none", borderTop:`1px solid ${bg}33` }}>
          {project.deliverables.map((d, i) => (
            <li key={d} style={{
              display:"flex", justifyContent:"space-between", alignItems:"center",
              borderBottom:`1px solid ${bg}33`,
              padding:"clamp(0.75rem,1.5vh,1.2rem) 0",
              fontFamily:"var(--font-display)", fontWeight:600,
              fontSize:"clamp(0.9rem,1.8vw,1.6rem)", color:bg,
            }}>
              <span>{d}</span>
              <span style={{ fontFamily:"var(--font-mono)", fontSize:"0.6rem", opacity:0.35, color:bg }}>
                {String(i+1).padStart(2,"0")}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* ── 05 CTA ── */}
      <section aria-label="Get in touch" style={{
        minHeight:"60vh", background:"var(--ink)",
        padding:"clamp(4rem,8vh,7rem) clamp(1.5rem,5vw,5rem)",
        display:"flex", flexDirection:"column", justifyContent:"center",
      }}>
        <div className="t-label" style={{ opacity:0.35, marginBottom:"1.5rem", color:"var(--paper)" }}>
          Want something like this?
        </div>
        <p style={{
          fontFamily:"var(--font-serif)", fontStyle:"italic",
          fontSize:"clamp(1.5rem,4vw,5rem)", color:"var(--paper)",
          lineHeight:1.2, maxWidth:"20ch", marginBottom:"3rem",
        }}>
          Let&apos;s build your brand identity together.
        </p>
        <div style={{ display:"flex", gap:"1.5rem", flexWrap:"wrap", alignItems:"center" }}>
          <a href="/#contact"
            style={{
              fontFamily:"var(--font-display)", fontWeight:700, fontSize:"1rem",
              letterSpacing:"-0.01em", color:"var(--ink)", background:"var(--paper)",
              padding:"0.8rem 1.8rem", borderRadius:"2px", textDecoration:"none",
              display:"inline-block", transition:"background 0.2s, color 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "var(--vermilion)";
              (e.currentTarget as HTMLElement).style.color = "var(--paper)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "var(--paper)";
              (e.currentTarget as HTMLElement).style.color = "var(--ink)";
            }}
          >
            Get in touch →
          </a>
          <Link href="/#work" style={{
            fontFamily:"var(--font-mono)", fontSize:"0.62rem",
            letterSpacing:"0.18em", textTransform:"uppercase" as const,
            color:"var(--paper)", textDecoration:"none", opacity:0.4,
          }}>
            ← All projects
          </Link>
        </div>
      </section>

      <style>{`
        @media (max-width:768px){
          main > section[aria-label="Design direction"]{
            grid-template-columns:1fr !important;
          }
        }
      `}</style>
    </main>
  );
}
