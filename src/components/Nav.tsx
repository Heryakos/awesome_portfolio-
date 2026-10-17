"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { SITE } from "../../content/site";

export default function Nav() {
  const navRef     = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef    = useRef<HTMLDivElement>(null);
  const pathname   = usePathname();

  // Are we on a case study page?
  const isCaseStudy = pathname?.startsWith("/work/");

  // Scroll-linked opacity
  useEffect(() => {
    let lastY = 0;
    const handleScroll = () => {
      const y = window.scrollY;
      if (!navRef.current) return;
      if (y > 80) {
        navRef.current.style.opacity = y > lastY ? "0.4" : "1";
      } else {
        navRef.current.style.opacity = "1";
      }
      lastY = y;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Keyboard shortcut to access Studio /admin: Alt+A or Ctrl+Shift+A
    const handleKey = (e: KeyboardEvent) => {
      if (
        (e.altKey && e.key.toLowerCase() === "a") ||
        (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "a")
      ) {
        window.location.href = "/admin";
      }
    };
    window.addEventListener("keydown", handleKey);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleKey);
    };
  }, []);

  // Mobile menu animation
  useEffect(() => {
    if (!menuRef.current) return;
    if (menuOpen) {
      gsap.fromTo(menuRef.current,
        { yPercent: -100, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.7, ease: "expo.out" }
      );
      gsap.fromTo(
        menuRef.current.querySelectorAll(".menu__item"),
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.07, ease: "power3.out", delay: 0.2 }
      );
    } else {
      gsap.to(menuRef.current, { yPercent: -100, opacity: 0, duration: 0.5, ease: "expo.in" });
    }
  }, [menuOpen]);

  return (
    <>
      <nav className="nav" ref={navRef} aria-label="Main navigation">
        {/* Logo / back */}
        {isCaseStudy ? (
          /* ── Case study page: show a prominent back link ── */
          <Link
            href="/#work"
            className="nav__logo"
            aria-label="Back to work"
            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5"
                strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
            YEAB
          </Link>
        ) : (
          <Link href="/" className="nav__logo" aria-label="Yeab Addis home">
            YEAB
          </Link>
        )}

        {/* Desktop links — hidden on case study */}
        {!isCaseStudy && (
          <ul className="nav__links" role="list">
            {SITE.nav.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="nav__link">{item.label}</a>
              </li>
            ))}
            <li key="admin-nav" style={{ marginLeft: "0.4rem" }}>
              <Link
                href="/admin"
                className="nav__link"
                title="Design Studio Admin (Alt+A)"
                aria-label="Design Studio Admin"
                style={{
                  opacity: 0.45,
                  fontSize: "0.8rem",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.opacity = "1";
                  (e.currentTarget as HTMLElement).style.color = "var(--vermilion)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.opacity = "0.45";
                  (e.currentTarget as HTMLElement).style.color = "inherit";
                }}
              >
                🔒
              </Link>
            </li>
          </ul>
        )}

        {/* On case study — show "Back to Work" label on desktop */}
        {isCaseStudy && (
          <Link
            href="/#work"
            className="nav__link"
            style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}
            aria-label="Back to all projects"
          >
            All Projects
          </Link>
        )}

        {/* Mobile toggle — only on home */}
        {!isCaseStudy && (
          <button
            className="nav__menu-btn t-label text-paper"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            style={{ background: "none", border: "none", cursor: "pointer", display: "none" }}
          >
            {menuOpen ? "CLOSE" : "MENU"}
          </button>
        )}

        {/* Mobile back button on case study */}
        {isCaseStudy && (
          <Link
            href="/#work"
            className="nav__menu-btn t-label text-paper"
            aria-label="Back to work"
            style={{
              display: "none",
              background: "none",
              border: "1px solid rgba(239,235,227,0.3)",
              padding: "0.4rem 0.8rem",
              borderRadius: "2px",
              textDecoration: "none",
            }}
          >
            ← Back
          </Link>
        )}
      </nav>

      {/* Full-screen mobile menu */}
      <div
        id="mobile-menu"
        ref={menuRef}
        role="dialog"
        aria-label="Mobile navigation"
        aria-modal="true"
        style={{
          position: "fixed", inset: 0,
          background: "var(--ink)", zIndex: 900,
          display: "flex", flexDirection: "column",
          alignItems: "flex-start", justifyContent: "center",
          padding: "2rem 2.5rem",
          transform: "translateY(-100%)", opacity: 0,
          pointerEvents: menuOpen ? "all" : "none",
        }}
      >
        <ul role="list" style={{ listStyle: "none" }}>
          {SITE.nav.map((item) => (
            <li key={item.href} className="menu__item">
              <a
                href={item.href}
                className="t-hero text-paper"
                onClick={() => setMenuOpen(false)}
                style={{ textDecoration: "none", display: "block", lineHeight: 1.1 }}
              >
                {item.label}
              </a>
            </li>
          ))}
          <li className="menu__item" style={{ marginTop: "1.5rem" }}>
            <Link
              href="/admin"
              onClick={() => setMenuOpen(false)}
              style={{
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 16px",
                background: "rgba(255, 74, 28, 0.12)",
                border: "1px solid rgba(255, 74, 28, 0.35)",
                borderRadius: 999,
                color: "var(--vermilion)",
                fontFamily: "var(--font-mono)",
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              <span>🎨</span>
              <span>Design Studio / Admin →</span>
            </Link>
          </li>
        </ul>
        <div className="menu__item t-label text-paper" style={{ marginTop: "4rem", opacity: 0.4 }}>
          {SITE.email}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .nav__links { display: none !important; }
          .nav__menu-btn { display: block !important; }
        }
      `}</style>
    </>
  );
}
