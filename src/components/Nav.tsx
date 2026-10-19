"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE } from "../../content/site";

export default function Nav() {
  const navRef = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  // Are we on a case study page?
  const isCaseStudy = pathname?.startsWith("/work/");

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [menuOpen]);

  // Scroll-linked opacity
  useEffect(() => {
    let lastY = 0;
    const handleScroll = () => {
      const y = window.scrollY;
      if (!navRef.current) return;
      if (menuOpen) {
        navRef.current.style.opacity = "1";
        return;
      }
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
  }, [menuOpen]);

  const handleLogoClick = (e: React.MouseEvent) => {
    setMenuOpen(false);
    if (!isCaseStudy) {
      e.preventDefault();
      if ((window as any).__lenis) {
        (window as any).__lenis.scrollTo(0, { immediate: false, duration: 1.2 });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      const hero = document.getElementById("hero") || document.querySelector(".hero");
      if (hero) {
        hero.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setMenuOpen(false);
    if (href.startsWith("/#") || href.startsWith("#")) {
      const id = href.replace(/^\/?#/, "");
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <>
      <nav
        className="nav"
        ref={navRef}
        aria-label="Main navigation"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100000,
          padding: "1.2rem clamp(1.25rem, 4vw, 2.5rem)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mixBlendMode: menuOpen ? "normal" : "difference",
          transition: "opacity 0.25s ease, background 0.25s ease",
        }}
      >
        {/* Clean Logo — always navigates home */}
        <Link
          href="/"
          className="nav__logo"
          aria-label="Yeab Addis home — Scroll to top"
          onClick={handleLogoClick}
          style={{
            color: menuOpen ? "#EFEBE3" : "var(--paper)",
            fontWeight: 800,
            fontSize: "1.05rem",
            letterSpacing: "0.06em",
            textDecoration: "none",
            cursor: "pointer",
          }}
        >
          YEAB
        </Link>

        {/* Desktop links — hidden on case study */}
        {!isCaseStudy && (
          <ul className="nav__links" role="list">
            {SITE.nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="nav__link"
                  onClick={(e) => handleNavClick(e, item.href)}
                >
                  {item.label}
                </a>
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

        {/* On case study — single clean "← All Projects" return button (desktop & mobile) */}
        {isCaseStudy && (
          <Link
            href="/#work"
            className="nav__back-link"
            aria-label="Back to all projects"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.45rem",
              padding: "0.45rem 0.95rem",
              background: "rgba(239, 235, 227, 0.08)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(239, 235, 227, 0.22)",
              borderRadius: "999px",
              color: "#EFEBE3",
              textDecoration: "none",
              fontFamily: "var(--font-mono)",
              fontSize: "0.72rem",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "var(--vermilion)";
              (e.currentTarget as HTMLElement).style.borderColor = "var(--vermilion)";
              (e.currentTarget as HTMLElement).style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(239, 235, 227, 0.08)";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(239, 235, 227, 0.22)";
              (e.currentTarget as HTMLElement).style.color = "#EFEBE3";
            }}
          >
            <span>←</span>
            <span>All Projects</span>
          </Link>
        )}

        {/* Mobile toggle — only on home */}
        {!isCaseStudy && (
          <button
            className="nav__menu-btn t-label"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            style={{
              background: menuOpen ? "rgba(255, 74, 28, 0.16)" : "rgba(239, 235, 227, 0.06)",
              border: menuOpen ? "1px solid rgba(255, 74, 28, 0.5)" : "1px solid rgba(239, 235, 227, 0.15)",
              color: menuOpen ? "var(--vermilion)" : "#EFEBE3",
              padding: "0.45rem 0.85rem",
              borderRadius: "999px",
              cursor: "pointer",
              fontSize: "0.72rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              display: "none", // Overridden by media query on mobile
              alignItems: "center",
              gap: 6,
              transition: "all 0.2s",
            }}
          >
            <span>{menuOpen ? "✕" : "☰"}</span>
            <span>{menuOpen ? "CLOSE" : "MENU"}</span>
          </button>
        )}
      </nav>

      {/* Full-screen mobile menu drawer */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-label="Mobile navigation"
        aria-modal="true"
        style={{
          position: "fixed",
          inset: 0,
          background: "#0c0d0e",
          zIndex: 99999,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "5.5rem 2rem calc(2rem + env(safe-area-inset-bottom, 0px))",
          transform: menuOpen ? "translateY(0%)" : "translateY(-100%)",
          opacity: menuOpen ? 1 : 0,
          visibility: menuOpen ? "visible" : "hidden",
          pointerEvents: menuOpen ? "all" : "none",
          transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease, visibility 0.4s",
          boxShadow: menuOpen ? "0 20px 80px rgba(0,0,0,0.9)" : "none",
        }}
      >
        <ul
          role="list"
          style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
            display: "flex",
            flexDirection: "column",
            gap: "1.2rem",
          }}
        >
          {SITE.nav.map((item, idx) => (
            <li
              key={item.href}
              className="menu__item"
              style={{
                transform: menuOpen ? "translateY(0)" : "translateY(16px)",
                opacity: menuOpen ? 1 : 0,
                transition: `all 0.35s ease ${0.05 * idx}s`,
              }}
            >
              <a
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(2rem, 7vw, 3.2rem)",
                  fontWeight: 800,
                  color: "#EFEBE3",
                  textDecoration: "none",
                  display: "inline-block",
                  letterSpacing: "-0.02em",
                  transition: "color 0.2s",
                }}
                onTouchStart={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "var(--vermilion)";
                }}
                onTouchEnd={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "#EFEBE3";
                }}
              >
                {item.label}
              </a>
            </li>
          ))}

          {/* Design Studio / Admin Button */}
          <li
            className="menu__item"
            style={{
              marginTop: "0.8rem",
              transform: menuOpen ? "translateY(0)" : "translateY(16px)",
              opacity: menuOpen ? 1 : 0,
              transition: "all 0.35s ease 0.3s",
            }}
          >
            <Link
              href="/admin"
              onClick={() => setMenuOpen(false)}
              style={{
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 18px",
                background: "rgba(255, 74, 28, 0.15)",
                border: "1px solid rgba(255, 74, 28, 0.4)",
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

        {/* Footer info in menu */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.08)",
            paddingTop: "1.2rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.4rem",
            color: "rgba(239,235,227,0.5)",
            fontFamily: "var(--font-mono)",
            fontSize: "0.7rem",
          }}
        >
          <div>{SITE.email}</div>
          <div style={{ opacity: 0.7 }}>{SITE.phone} · {SITE.location}</div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .nav__links { display: none !important; }
          .nav__menu-btn { display: inline-flex !important; }
        }
      `}</style>
    </>
  );
}
