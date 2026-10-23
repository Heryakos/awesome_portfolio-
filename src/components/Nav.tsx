"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE } from "../../content/site";
import { useCms } from "./CmsContext";

// ── Adaptive Yeab Favicon Brand Mark ─────────────────────────
// Renders the signature geometric 'Y' monogram tailored to each theme
function YeabFaviconMark({ theme }: { theme: "light" | "dark" | "glass" }) {
  const isLight = theme === "light";
  const isGlass = theme === "glass";

  // Palette per theme
  const bgFill = isGlass
    ? "rgba(255, 255, 255, 0.08)"
    : isLight
    ? "#14151C"
    : "#0D0F18";

  const strokeColor = isGlass
    ? "rgba(255, 255, 255, 0.35)"
    : isLight
    ? "rgba(0, 0, 0, 0.12)"
    : "rgba(255, 255, 255, 0.22)";

  const vermilionColor = isGlass
    ? "#FF453A"
    : isLight
    ? "#FF4A1C"
    : "#FF5A34";

  const ivoryColor = isGlass
    ? "#FFFFFF"
    : isLight
    ? "#FAF7F2"
    : "#FFFFFF";

  const shadow = isGlass
    ? "0 4px 16px rgba(0,0,0,0.4), 0 0 14px rgba(255,69,58,0.35)"
    : isLight
    ? "0 2px 8px rgba(0,0,0,0.18)"
    : "0 3px 12px rgba(0,0,0,0.5), 0 0 10px rgba(255,90,52,0.25)";

  return (
    <span
      className="nav__favicon-mark"
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 28,
        height: 28,
        borderRadius: 8,
        flexShrink: 0,
        boxShadow: shadow,
        transition: "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease",
        backdropFilter: isGlass ? "blur(12px)" : "none",
        WebkitBackdropFilter: isGlass ? "blur(12px)" : "none",
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 64 64"
        width="28"
        height="28"
        style={{ display: "block" }}
      >
        <defs>
          <linearGradient id={`yStemGrad-${theme}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={vermilionColor} />
            <stop offset="100%" stopColor={isGlass ? "#E63900" : isLight ? "#E63900" : "#E03200"} />
          </linearGradient>
          <filter id={`yGlow-${theme}`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.4" />
          </filter>
        </defs>

        {/* Squircle Background Base */}
        <rect
          x="2"
          y="2"
          width="60"
          height="60"
          rx="15"
          ry="15"
          fill={bgFill}
          stroke={strokeColor}
          strokeWidth="1.2"
        />

        {/* Monogram Shape */}
        <g filter={`url(#yGlow-${theme})`}>
          {/* Left Arm: Vermilion Red Geometric */}
          <path d="M 17 18 L 26 18 L 32 30 L 26 36 L 17 25 Z" fill={`url(#yStemGrad-${theme})`} />
          <path d="M 22 21 L 24.5 21 L 28.5 29 L 26 31 Z" fill={bgFill} />

          {/* Right Arm: Warm Ivory / Pure White Facet */}
          <path d="M 47 18 L 38 18 L 32 30 L 36 36 L 47 21 Z" fill={ivoryColor} />
          <path d="M 42 22 L 39.5 22 L 35 30 L 37 32 Z" fill={bgFill} />

          {/* Central Stem: Vermilion Red Solid Pillar */}
          <path d="M 28 32 L 36 32 L 36 48 L 28 48 Z" fill={`url(#yStemGrad-${theme})`} />

          {/* Bevel lighting */}
          <path d="M 32 32 L 36 32 L 36 48 L 32 48 Z" fill="rgba(0,0,0,0.22)" />
          <path d="M 28 32 L 32 32 L 32 48 L 28 48 Z" fill="rgba(255,255,255,0.25)" />
        </g>
      </svg>
    </span>
  );
}

// ── Segmented Theme Pill Switcher ────────────────────────────
// Allows one-click switching between Light (Paper), Dark (Obsidian), and Apple Liquid Glass
function ThemePillSelector({
  activeTheme,
  onChange,
  isGlass,
  isDark,
}: {
  activeTheme: "light" | "dark" | "glass";
  onChange: (theme: "light" | "dark" | "glass") => void;
  isGlass: boolean;
  isDark: boolean;
}) {
  const modes: Array<{
    id: "light" | "dark" | "glass";
    label: string;
    icon: string;
    title: string;
  }> = [
    { id: "light", label: "Paper", icon: "☀️", title: "Light Mode (Warm Editorial Paper)" },
    { id: "dark", label: "Dark", icon: "🌙", title: "Dark Mode (Obsidian Cyber)" },
    { id: "glass", label: "Glass", icon: "✨", title: "Apple Liquid Glass (Frosted Luxury)" },
  ];

  return (
    <div
      className="theme-capsule"
      role="radiogroup"
      aria-label="Color theme selector"
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "3px",
        borderRadius: "999px",
        background: isGlass
          ? "rgba(255, 255, 255, 0.08)"
          : isDark
          ? "rgba(255, 255, 255, 0.06)"
          : "rgba(17, 17, 17, 0.05)",
        border: isGlass
          ? "1px solid rgba(255, 255, 255, 0.2)"
          : isDark
          ? "1px solid rgba(255, 255, 255, 0.12)"
          : "1px solid rgba(17, 17, 17, 0.1)",
        backdropFilter: isGlass ? "blur(20px)" : "none",
        WebkitBackdropFilter: isGlass ? "blur(20px)" : "none",
        boxShadow: isGlass ? "0 4px 20px rgba(0,0,0,0.3)" : "none",
        gap: 2,
        transition: "all 0.25s ease",
      }}
    >
      {modes.map((m) => {
        const isActive = activeTheme === m.id;
        let activeBg = "rgba(255, 255, 255, 0.18)";
        let activeColor = "#FFFFFF";
        let activeBorder = "none";
        let activeShadow = "0 1px 4px rgba(0,0,0,0.2)";

        if (isActive) {
          if (m.id === "light") {
            activeBg = "#FFFFFF";
            activeColor = "#111111";
            activeShadow = "0 2px 6px rgba(0,0,0,0.12)";
          } else if (m.id === "dark") {
            activeBg = "rgba(255, 255, 255, 0.18)";
            activeColor = "#FFFFFF";
            activeShadow = "0 2px 8px rgba(0,0,0,0.4)";
          } else if (m.id === "glass") {
            activeBg = "linear-gradient(135deg, rgba(255,255,255,0.25), rgba(255,69,58,0.22))";
            activeColor = "#FFFFFF";
            activeBorder = "1px solid rgba(255,255,255,0.35)";
            activeShadow = "0 2px 10px rgba(0,0,0,0.35), 0 0 12px rgba(255,69,58,0.3)";
          }
        }

        const inactiveColor = isDark || isGlass ? "rgba(245, 245, 247, 0.65)" : "rgba(17, 17, 17, 0.65)";

        return (
          <button
            key={m.id}
            type="button"
            role="radio"
            aria-checked={isActive}
            title={m.title}
            aria-label={m.title}
            onClick={() => onChange(m.id)}
            className="theme-capsule__btn"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              padding: "4px 9px",
              borderRadius: "999px",
              border: isActive ? activeBorder : "1px solid transparent",
              background: isActive ? activeBg : "transparent",
              color: isActive ? activeColor : inactiveColor,
              fontWeight: isActive ? 700 : 500,
              fontSize: "0.72rem",
              fontFamily: "var(--font-mono), monospace",
              letterSpacing: "0.04em",
              cursor: "pointer",
              boxShadow: isActive ? activeShadow : "none",
              transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
              lineHeight: 1,
            }}
          >
            <span style={{ fontSize: "0.82rem", lineHeight: 1 }}>{m.icon}</span>
            <span className="theme-capsule__label">{m.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default function Nav() {
  const navRef = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const cms = useCms();

  const activeTheme = cms.activeTheme;
  const isGlass = activeTheme === "glass";
  const isDark = activeTheme === "dark" || isGlass;
  const isLight = activeTheme === "light";

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

  // Scroll tracking for background & opacity
  useEffect(() => {
    let lastY = 0;
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 30);

      if (!navRef.current) return;
      if (menuOpen) {
        navRef.current.style.opacity = "1";
        return;
      }
      if (y > 90) {
        navRef.current.style.opacity = y > lastY ? "0.45" : "1";
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

  // Nav styling based on scroll & active theme
  let navBg = "transparent";
  let navBorder = "1px solid transparent";
  let navBlur = "none";
  let navShadow = "none";

  if (isGlass) {
    navBg = scrolled ? "rgba(10, 12, 24, 0.72)" : "rgba(10, 12, 24, 0.4)";
    navBorder = "1px solid rgba(255, 255, 255, 0.08)";
    navBlur = "blur(48px) saturate(200%) brightness(95%)";
    navShadow = "0 4px 30px rgba(0, 0, 0, 0.35)";
  } else if (isDark) {
    navBg = scrolled ? "rgba(12, 14, 24, 0.88)" : "transparent";
    navBorder = scrolled ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid transparent";
    navBlur = scrolled ? "blur(24px) saturate(180%)" : "none";
    navShadow = scrolled ? "0 4px 24px rgba(0, 0, 0, 0.35)" : "none";
  } else {
    // Light (Paper) mode
    navBg = scrolled ? "rgba(239, 235, 227, 0.92)" : "transparent";
    navBorder = scrolled ? "1px solid rgba(17, 17, 17, 0.08)" : "1px solid transparent";
    navBlur = scrolled ? "blur(20px) saturate(180%)" : "none";
    navShadow = scrolled ? "0 4px 20px rgba(0, 0, 0, 0.04)" : "none";
  }

  const textColor = menuOpen
    ? "#EFEBE3"
    : isGlass
    ? "#f5f5f7"
    : isDark
    ? "#F0F0F5"
    : "#111111";

  const linkColor = menuOpen
    ? "rgba(239, 235, 227, 0.75)"
    : isGlass
    ? "rgba(245, 245, 247, 0.85)"
    : isDark
    ? "rgba(240, 240, 245, 0.75)"
    : "rgba(17, 17, 17, 0.7)";

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
          padding: "1rem clamp(1.25rem, 4vw, 2.5rem)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mixBlendMode: "normal", // Clean rendering: ensures logo vermilion & badges are never color-inverted to cyan
          background: menuOpen ? "transparent" : navBg,
          backdropFilter: menuOpen ? "none" : navBlur,
          WebkitBackdropFilter: menuOpen ? "none" : navBlur,
          borderBottom: menuOpen ? "none" : navBorder,
          boxShadow: menuOpen ? "none" : navShadow,
          transition: "opacity 0.25s ease, background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
        }}
      >
        {/* Brand Lockup: Adaptive Favicon Mark + YEAB Typography */}
        <Link
          href="/"
          className="nav__logo"
          aria-label="Yeab Addis home — Scroll to top"
          onClick={handleLogoClick}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.6rem",
            color: textColor,
            textDecoration: "none",
            cursor: "pointer",
            transition: "opacity 0.2s ease, transform 0.2s ease",
          }}
        >
          <YeabFaviconMark theme={activeTheme} />
          <span
            className="nav__logo-text"
            style={{
              fontWeight: 800,
              fontSize: "1.08rem",
              letterSpacing: "0.07em",
              lineHeight: 1,
              fontFamily: "var(--font-display)",
              color: textColor,
            }}
          >
            YEAB
          </span>
        </Link>

        {/* Desktop links & Theme Pill Selector — hidden on case study */}
        {!isCaseStudy && (
          <ul
            className="nav__links"
            role="list"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "clamp(0.8rem, 1.8vw, 1.6rem)",
              listStyle: "none",
              margin: 0,
              padding: 0,
            }}
          >
            {SITE.nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="nav__link"
                  onClick={(e) => handleNavClick(e, item.href)}
                  style={{
                    color: linkColor,
                    textDecoration: "none",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.72rem",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    fontWeight: 500,
                    transition: "color 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.color = "var(--vermilion)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color = linkColor;
                  }}
                >
                  {item.label}
                </a>
              </li>
            ))}

            {/* 3-State Theme Capsule: Light (Paper) / Dark (Obsidian) / Apple Liquid Glass */}
            <li key="theme-switcher-pill" style={{ marginLeft: "0.4rem" }}>
              <ThemePillSelector
                activeTheme={activeTheme}
                onChange={cms.applyPublicTheme}
                isGlass={isGlass}
                isDark={isDark}
              />
            </li>

            {/* Design Studio Admin Lock (Alt+A) */}
            <li key="admin-nav" style={{ marginLeft: "0.2rem" }}>
              <Link
                href="/admin"
                className="nav__link"
                title="Design Studio Admin (Alt+A)"
                aria-label="Design Studio Admin"
                style={{
                  opacity: 0.5,
                  fontSize: "0.8rem",
                  transition: "all 0.2s",
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "4px",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.opacity = "1";
                  (e.currentTarget as HTMLElement).style.color = "var(--vermilion)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.opacity = "0.5";
                  (e.currentTarget as HTMLElement).style.color = "inherit";
                }}
              >
                🔒
              </Link>
            </li>
          </ul>
        )}

        {/* On case study — Theme Capsule + "← All Projects" return button */}
        {isCaseStudy && (
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <ThemePillSelector
              activeTheme={activeTheme}
              onChange={cms.applyPublicTheme}
              isGlass={isGlass}
              isDark={isDark}
            />
            <Link
              href="/#work"
              className="nav__back-link"
              aria-label="Back to all projects"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.45rem",
                padding: "0.45rem 0.95rem",
                background: isGlass
                  ? "rgba(255, 255, 255, 0.08)"
                  : isDark
                  ? "rgba(255, 255, 255, 0.08)"
                  : "rgba(17, 17, 17, 0.06)",
                backdropFilter: "blur(8px)",
                border: isGlass
                  ? "1px solid rgba(255, 255, 255, 0.25)"
                  : isDark
                  ? "1px solid rgba(255, 255, 255, 0.18)"
                  : "1px solid rgba(17, 17, 17, 0.12)",
                borderRadius: "999px",
                color: textColor,
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
                (e.currentTarget as HTMLElement).style.background = isGlass || isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(17, 17, 17, 0.06)";
                (e.currentTarget as HTMLElement).style.borderColor = isGlass ? "rgba(255, 255, 255, 0.25)" : isDark ? "rgba(255, 255, 255, 0.18)" : "rgba(17, 17, 17, 0.12)";
                (e.currentTarget as HTMLElement).style.color = textColor;
              }}
            >
              <span>←</span>
              <span>All Projects</span>
            </Link>
          </div>
        )}

        {/* Mobile menu hamburger toggle button */}
        {!isCaseStudy && (
          <button
            className="nav__menu-btn t-label"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            style={{
              background: menuOpen
                ? "rgba(255, 74, 28, 0.18)"
                : isDark || isGlass
                ? "rgba(255, 255, 255, 0.08)"
                : "rgba(17, 17, 17, 0.06)",
              border: menuOpen
                ? "1px solid rgba(255, 74, 28, 0.5)"
                : isDark || isGlass
                ? "1px solid rgba(255, 255, 255, 0.18)"
                : "1px solid rgba(17, 17, 17, 0.14)",
              color: menuOpen ? "var(--vermilion)" : textColor,
              padding: "0.45rem 0.85rem",
              borderRadius: "999px",
              cursor: "pointer",
              fontSize: "0.72rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              display: "none", // Displayed by media query on small screens
              alignItems: "center",
              gap: 6,
              transition: "all 0.2s ease",
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
          background: isGlass
            ? "rgba(6, 7, 12, 0.96)"
            : isDark
            ? "#0c0e18"
            : "#0c0d0e",
          backdropFilter: isGlass ? "blur(32px)" : "none",
          WebkitBackdropFilter: isGlass ? "blur(32px)" : "none",
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
            gap: "1.1rem",
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

          {/* Mobile Theme Switcher: 3 Full-Size Buttons */}
          <li
            className="menu__item"
            style={{
              marginTop: "0.8rem",
              transform: menuOpen ? "translateY(0)" : "translateY(16px)",
              opacity: menuOpen ? 1 : 0,
              transition: "all 0.35s ease 0.25s",
            }}
          >
            <div style={{ marginBottom: "0.45rem", color: "rgba(239, 235, 227, 0.5)", fontFamily: "var(--font-mono)", fontSize: "0.68rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Theme Selection
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem" }}>
              <button
                type="button"
                onClick={() => cms.applyPublicTheme("light")}
                style={{
                  padding: "9px 6px",
                  borderRadius: "12px",
                  background: activeTheme === "light" ? "#FFFFFF" : "rgba(239, 235, 227, 0.08)",
                  border: activeTheme === "light" ? "1px solid #FFFFFF" : "1px solid rgba(239, 235, 227, 0.16)",
                  color: activeTheme === "light" ? "#111111" : "#EFEBE3",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <span style={{ fontSize: "1rem" }}>☀️</span>
                <span>Paper</span>
              </button>

              <button
                type="button"
                onClick={() => cms.applyPublicTheme("dark")}
                style={{
                  padding: "9px 6px",
                  borderRadius: "12px",
                  background: activeTheme === "dark" ? "rgba(255, 255, 255, 0.22)" : "rgba(239, 235, 227, 0.08)",
                  border: activeTheme === "dark" ? "1px solid rgba(255, 255, 255, 0.4)" : "1px solid rgba(239, 235, 227, 0.16)",
                  color: "#FFFFFF",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <span style={{ fontSize: "1rem" }}>🌙</span>
                <span>Dark</span>
              </button>

              <button
                type="button"
                onClick={() => cms.applyPublicTheme("glass")}
                style={{
                  padding: "9px 6px",
                  borderRadius: "12px",
                  background: activeTheme === "glass" ? "linear-gradient(135deg, rgba(255,255,255,0.28), rgba(255,69,58,0.28))" : "rgba(239, 235, 227, 0.08)",
                  border: activeTheme === "glass" ? "1px solid rgba(255, 255, 255, 0.4)" : "1px solid rgba(239, 235, 227, 0.16)",
                  color: "#FFFFFF",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "4px",
                  boxShadow: activeTheme === "glass" ? "0 0 16px rgba(255,69,58,0.3)" : "none",
                }}
              >
                <span style={{ fontSize: "1rem" }}>✨</span>
                <span>Glass</span>
              </button>
            </div>
          </li>

          {/* Design Studio / Admin Button */}
          <li
            className="menu__item"
            style={{
              marginTop: "0.4rem",
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
        /* Hover micro-animation on logo mark */
        .nav__logo:hover .nav__favicon-mark {
          transform: scale(1.08);
        }

        /* Responsive behavior */
        @media (max-width: 1040px) {
          .theme-capsule__label {
            display: none !important;
          }
          .theme-capsule__btn {
            padding: 4px 6px !important;
          }
        }

        @media (max-width: 820px) {
          .nav__links { display: none !important; }
          .nav__menu-btn { display: inline-flex !important; }
        }
      `}</style>
    </>
  );
}
