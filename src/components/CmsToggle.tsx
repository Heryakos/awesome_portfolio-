"use client";

import { useCms } from "./CmsContext";

/**
 * Floating action bar that appears after admin login.
 * Offers one-click Studio toggle and an immediate Logout button.
 */
export default function CmsToggle() {
  const { isAuth, editorOpen, toggleEditor, logout } = useCms();

  if (!isAuth) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 100011,
        display: "flex",
        alignItems: "center",
        gap: 8,
        background: "rgba(18, 18, 18, 0.9)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: "999px",
        padding: "6px 8px 6px 14px",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 74, 28, 0.15)",
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
          padding: "7px 14px",
          fontSize: "0.72rem",
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
          width: 32,
          height: 32,
          display: "grid",
          placeItems: "center",
          color: "#888",
          fontSize: "0.85rem",
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
