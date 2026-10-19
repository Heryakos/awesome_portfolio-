"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
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
  const [copiedToast, setCopiedToast] = useState<string | null>(null);
  const sectionRef  = useRef<HTMLElement>(null);
  const headRef     = useRef<HTMLHeadingElement>(null);
  const contactsRef = useRef<HTMLDivElement>(null);
  const socialRef   = useRef<HTMLDivElement>(null);

  const copyToClipboard = (text: string, label: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedToast(`Copied ${label} to clipboard! 📋`);
      setTimeout(() => setCopiedToast(null), 2500);
    }
  };

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
        position: "relative",
      }}
    >
      {/* Copied Feedback Toast */}
      {copiedToast && (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: "fixed",
            bottom: "2rem",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(255, 74, 28, 0.95)",
            color: "#fff",
            padding: "0.6rem 1.4rem",
            borderRadius: "999px",
            fontFamily: "var(--font-mono)",
            fontSize: "0.75rem",
            fontWeight: 700,
            letterSpacing: "0.06em",
            boxShadow: "0 8px 30px rgba(0,0,0,0.6)",
            zIndex: 100000,
            pointerEvents: "none",
            animation: "fadeIn 0.25s ease-out",
          }}
        >
          {copiedToast}
        </div>
      )}

      <div className="t-label" style={{ opacity: 0.35, marginBottom: "3rem", color: "var(--paper)" }}>
        06 — Contact &amp; Connect
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
          gap: "clamp(1.5rem,4vw,3.5rem)",
          marginBottom: "clamp(3rem,8vh,5rem)",
          alignItems: "center",
        }}
      >
        {/* Email */}
        <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem" }}>
          <div className="t-label" style={{ opacity: 0.35, color: "var(--paper)" }}>Direct Email</div>
          <MagneticLink href={`mailto:${SITE.email}`}>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: "clamp(0.95rem,1.5vw,1.4rem)",
                color: "var(--paper)",
                borderBottom: "1px solid rgba(239,235,227,0.3)",
                paddingBottom: "0.2rem",
                transition: "color 0.2s",
                display: "inline-block",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--vermilion)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--paper)"; }}
            >
              <span id="cms-email">{SITE.email}</span>
            </span>
          </MagneticLink>
          <button
            type="button"
            onClick={() => copyToClipboard(SITE.email, "email")}
            style={{
              background: "transparent",
              border: "none",
              color: "rgba(239,235,227,0.45)",
              fontSize: "0.6rem",
              fontFamily: "var(--font-mono)",
              cursor: "pointer",
              padding: "0.2rem 0.5rem",
              borderRadius: "2px",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--vermilion)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(239,235,227,0.45)"; }}
          >
            📋 Copy email
          </button>
        </div>

        {/* Divider */}
        <div style={{ width: "1px", height: "40px", background: "rgba(239,235,227,0.12)" }} aria-hidden="true" />

        {/* Phone & WhatsApp */}
        <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem" }}>
          <div className="t-label" style={{ opacity: 0.35, color: "var(--paper)" }}>
            Phone &amp; WhatsApp
          </div>
          <MagneticLink href={`tel:${SITE.phone.replace(/\s/g,"")}`}>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: "clamp(0.95rem,1.5vw,1.4rem)",
                color: "var(--paper)",
                borderBottom: "1px solid rgba(239,235,227,0.3)",
                paddingBottom: "0.2rem",
                transition: "color 0.2s",
                display: "inline-block",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--vermilion)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--paper)"; }}
            >
              <span id="cms-phone">{SITE.phone}</span>
            </span>
          </MagneticLink>
          <div style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
            <a
              href="https://wa.me/251986267543?text=Hi%20Yeabsira,%20I%20saw%20your%20portfolio%20and%20would%20love%20to%20discuss%20a%20design%20project!"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#25D366",
                fontSize: "0.6rem",
                fontFamily: "var(--font-mono)",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.2rem",
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.8"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
            >
              💬 WhatsApp ↗
            </a>
            <span style={{ color: "rgba(239,235,227,0.2)", fontSize: "0.6rem" }}>·</span>
            <button
              type="button"
              onClick={() => copyToClipboard(SITE.phone, "phone number")}
              style={{
                background: "transparent",
                border: "none",
                color: "rgba(239,235,227,0.45)",
                fontSize: "0.6rem",
                fontFamily: "var(--font-mono)",
                cursor: "pointer",
                padding: "0.2rem",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--vermilion)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(239,235,227,0.45)"; }}
            >
              📋 Copy
            </button>
          </div>
        </div>

        {/* Divider */}
        <div style={{ width: "1px", height: "40px", background: "rgba(239,235,227,0.12)" }} aria-hidden="true" />

        {/* Location */}
        <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem" }}>
          <div className="t-label" style={{ opacity: 0.35, color: "var(--paper)" }}>Based in</div>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: "clamp(0.95rem,1.5vw,1.4rem)",
              color: "var(--paper)",
              opacity: 0.75,
              paddingBottom: "0.2rem",
            }}
          >
            <span id="cms-location">{SITE.location}</span>
          </span>
          <span className="t-label" style={{ color: "rgba(239,235,227,0.35)", fontSize: "0.6rem" }}>
            East Africa Time (GMT+3)
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
        <Link
          href="/admin"
          style={{
            color: "inherit",
            textDecoration: "none",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.color = "var(--vermilion)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.color = "inherit";
          }}
        >
          Studio 🔒
        </Link>
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
