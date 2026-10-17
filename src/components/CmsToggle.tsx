"use client";

import { useEffect, useState } from "react";
import { useCms } from "./CmsContext";

/**
 * Floating action bar that appears after admin login.
 * Offers one-click Studio toggle and an immediate Logout button.
 * Responsive: Automatically adjusts for mobile devices (Galaxy S20, iPhones, etc.)
 */
export default function CmsToggle() {
  const { isAuth, editorOpen, toggleEditor, logout } = useCms();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (!isAuth) return null;

  // On mobile, if the bottom-sheet studio drawer is open, hide this floating pill so it doesn't overlap the drawer controls
  if (isMobile && editorOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: isMobile ? "calc(16px + env(safe-area-inset-bottom, 0px))" : 24,
        right: isMobile ? 14 : 24,
        zIndex: 100011,
        display: "flex",
        alignItems: "center",
        gap: 8,
        background: "rgba(18, 18, 18, 0.92)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.12)",
        borderRadius: "999px",
        padding: isMobile ? "5px 7px 5px 12px" : "6px 8px 6px 14px",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 74, 28, 0.2)",
        fontFamily: "var(--font-mono), monospace",
        animation: "slideUp 0.3s ease",
      }}
    >
      {/* Studio toggle */}
      <button
        onClick={toggleEditor}
        aria-label={editorOpen ? "Close Design Studio" : "Open Design Studio"}
        style={{
          background: editorOpen
            ? "rgba(255, 255, 255, 0.08)"
            : "linear-gradient(135deg, #FF4A1C, #FF6D3F)",
          border: "none",
          borderRadius: "999px",
          color: "#fff",
          padding: isMobile ? "6px 12px" : "7px 14px",
          fontSize: isMobile ? "0.68rem" : "0.72rem",
          fontWeight: 700,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 6,
          letterSpacing: "0.04em",
          boxShadow: editorOpen ? "none" : "0 2px 12px rgba(255, 74, 28, 0.3)",
          transition: "all 0.2s",
        }}
      >
        <span>{editorOpen ? "✕" : "🎨"}</span>
        <span>{editorOpen ? "Close Studio" : "Design Studio"}</span>
      </button>

      {/* Quick Logout button */}
      <button
        onClick={() => {
          if (confirm("Log out from Design Studio?")) {
            logout();
          }
        }}
        title="Log out of Design Studio"
        aria-label="Log out of Design Studio"
        style={{
          background: "rgba(255, 255, 255, 0.04)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "50%",
          width: isMobile ? 28 : 32,
          height: isMobile ? 28 : 32,
          display: "grid",
          placeItems: "center",
          color: "#888",
          fontSize: isMobile ? "0.75rem" : "0.85rem",
          cursor: "pointer",
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "#ff4d4f";
          e.currentTarget.style.borderColor = "rgba(255, 77, 79, 0.4)";
          e.currentTarget.style.background = "rgba(255, 77, 79, 0.1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "#888";
          e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)";
        }}
      >
        🔒
      </button>
    </div>
  );
}
