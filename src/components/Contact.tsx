"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SITE } from "../../content/site";

gsap.registerPlugin(ScrollTrigger);

function MagneticLink({
  href, children, external = false,
}: { href: string; children: React.ReactNode; external?: boolean }) {
  const ref = useRef<HTMLAnchorElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * 0.28;
      const y = (e.clientY - r.top - r.height / 2) * 0.28;
      gsap.to(el, { x, y, duration: 0.35, ease: "power2.out" });
    };
    const onLeave = () => gsap.to(el, { x: 0, y: 0, duration: 0.55, ease: "elastic.out(1,0.5)" });
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => { el.removeEventListener("mousemove", onMove); el.removeEventListener("mouseleave", onLeave); };
  }, []);
  return (
    <a ref={ref} href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      style={{ display: "inline-block", textDecoration: "none", willChange: "transform" }}>
      {children}
    </a>
  );
}

export default function Contact() {
  const sectionRef  = useRef<HTMLElement>(null);
  const headRef     = useRef<HTMLHeadingElement>(null);
  const contactsRef = useRef<HTMLDivElement>(null);
  const socialRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: sectionRef.current, start: "top 70%", toggleActions: "play none none reverse" },
      });
      tl.from(headRef.current, { yPercent: 8, opacity: 0, duration: 1.4, ease: "power3.out" })
        .from(contactsRef.current?.children ? Array.from(contactsRef.current.children) : [], {
          y: 20, opacity: 0, stagger: 0.1, duration: 0.8, ease: "power3.out",
        }, "-=0.8")
        .from(socialRef.current?.children ? Array.from(socialRef.current.children) : [], {
          y: 30, opacity: 0, stagger: 0.12, duration: 0.8, ease: "power3.out",
        }, "-=0.5");
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="contact"
      ref={sectionRef}
      aria-label="Contact Yeab Addis"
      style={{
        minHeight: "100dvh",
        padding: "clamp(5rem,10vh,8rem) clamp(1.5rem,5vw,5rem)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--ink)",
        color: "var(--paper)",
        overflow: "hidden",
      }}
    >
      <div className="t-label" style={{ opacity:0.35, marginBottom:"3rem", color:"var(--paper)" }}>
        04 — Contact
      </div>

      {/* Main CTA headline */}
      <h2
        ref={headRef}
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 800,
          fontSize: "clamp(2.2rem,7vw,9rem)",
          lineHeight: 0.92,
          letterSpacing: "-0.03em",
          textAlign: "center",
          color: "var(--paper)",
          maxWidth: "16ch",
          marginBottom: "clamp(2.5rem,6vh,5rem)",
        }}
      >
        Have an idea?{" "}
        <span style={{ fontFamily:"var(--font-serif)", fontStyle:"italic", color:"var(--vermilion)", fontWeight:400 }}>
          Let&apos;s make it visual.
        </span>
      </h2>

      {/* Contact details row */}
      <div
        ref={contactsRef}
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "clamp(1.5rem,4vw,4rem)",
          marginBottom: "clamp(3rem,8vh,6rem)",
        }}
      >
        {/* Email */}
        <MagneticLink href={`mailto:${SITE.email}`}>
          <div style={{ textAlign:"center" }}>
            <div className="t-label" style={{ opacity:0.35, marginBottom:"0.4rem", color:"var(--paper)" }}>Email</div>
            <span style={{
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: "clamp(0.9rem,1.5vw,1.4rem)",
              color: "var(--paper)",
              borderBottom: "1px solid rgba(239,235,227,0.3)",
              paddingBottom: "0.3rem",
              transition: "color 0.2s",
            }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--vermilion)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--paper)"; }}
            >
              {SITE.email}
            </span>
          </div>
        </MagneticLink>

        {/* Divider */}
        <div style={{ width:"1px", background:"rgba(239,235,227,0.12)", alignSelf:"stretch" }} aria-hidden="true" />

        {/* Phone — PLACEHOLDER */}
        <MagneticLink href={`tel:${SITE.phone.replace(/\s/g,"")}`}>
          <div style={{ textAlign:"center" }}>
            <div className="t-label" style={{ opacity:0.35, marginBottom:"0.4rem", color:"var(--paper)" }}>
              Phone {/* PLACEHOLDER: update in content/site.ts */}
            </div>
            <span style={{
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: "clamp(0.9rem,1.5vw,1.4rem)",
              color: "var(--paper)",
              borderBottom: "1px solid rgba(239,235,227,0.3)",
              paddingBottom: "0.3rem",
              transition: "color 0.2s",
            }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--vermilion)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--paper)"; }}
            >
              {SITE.phone}
            </span>
          </div>
        </MagneticLink>

        {/* Divider */}
        <div style={{ width:"1px", background:"rgba(239,235,227,0.12)", alignSelf:"stretch" }} aria-hidden="true" />

        {/* Location */}
        <div style={{ textAlign:"center" }}>
          <div className="t-label" style={{ opacity:0.35, marginBottom:"0.4rem", color:"var(--paper)" }}>Based in</div>
          <span style={{
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontSize: "clamp(0.9rem,1.5vw,1.4rem)",
            color: "var(--paper)",
            opacity: 0.7,
          }}>
            {SITE.location}
          </span>
        </div>
      </div>

      {/* Social giant links */}
      <div
        ref={socialRef}
        style={{
          display: "flex",
          gap: "clamp(1.5rem,5vw,5rem)",
          alignItems: "baseline",
          flexWrap: "wrap",
          justifyContent: "center",
          marginBottom: "auto",
        }}
      >
        <MagneticLink href={SITE.linkedin} external>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(2rem,7vw,9rem)",
              lineHeight: 0.9,
              letterSpacing: "-0.03em",
              color: "var(--paper)",
              fontVariationSettings: '"wdth" 110, "opsz" 72',
              opacity: 0.4,
              transition: "opacity 0.25s",
              display: "block",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.4"; }}
          >
            LINKEDIN ↗
          </span>
        </MagneticLink>

        <MagneticLink href={SITE.upwork} external>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(2rem,7vw,9rem)",
              lineHeight: 0.9,
              letterSpacing: "-0.03em",
              color: "var(--vermilion)",
              fontVariationSettings: '"wdth" 110, "opsz" 72',
              opacity: 0.45,
              transition: "opacity 0.25s",
              display: "block",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.45"; }}
          >
            UPWORK ↗
          </span>
        </MagneticLink>
      </div>

      {/* Availability badge */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "0.6rem",
        marginTop: "clamp(2rem,5vh,4rem)",
        marginBottom: "clamp(1.5rem,3vh,2.5rem)",
      }}>
        <span style={{
          width: "0.5rem",
          height: "0.5rem",
          borderRadius: "50%",
          background: "#4ade80",
          display: "inline-block",
          boxShadow: "0 0 0 0 rgba(74,222,128,0.6)",
          animation: "pulse-dot 2s infinite",
        }} aria-hidden="true" />
        <span className="t-label" style={{ color:"rgba(239,235,227,0.4)" }}>
          Available for freelance projects
        </span>
      </div>

      {/* Footer */}
      <div
        className="t-label"
        style={{
          opacity: 0.2,
          color: "var(--paper)",
          display: "flex",
          gap: "2rem",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <span>© {new Date().getFullYear()} {SITE.name}</span>
        <span>{SITE.role}</span>
        <span>{SITE.location}</span>
      </div>

      <style>{`
        @keyframes pulse-dot {
          0%   { box-shadow: 0 0 0 0 rgba(74,222,128,0.5); }
          70%  { box-shadow: 0 0 0 8px rgba(74,222,128,0); }
          100% { box-shadow: 0 0 0 0 rgba(74,222,128,0); }
        }
        @media (max-width: 768px) {
          #contact > div[style*="flex-wrap: wrap"]:nth-of-type(2) {
            flex-direction: column;
            align-items: center;
          }
          #contact [style*="width: 1px"] { display: none; }
        }
      `}</style>
    </section>
  );
}
