"use client";

import { useCms } from "./CmsContext";

/**
 * Floating action button that appears after admin login.
 * Toggles the visual CMS editor panel open/closed.
 */
export default function CmsToggle() {
  const { isAuth, editorOpen, toggleEditor } = useCms();

  if (!isAuth) return null;

  return (
    <button
      onClick={toggleEditor}
      aria-label={editorOpen ? "Close Design Studio" : "Open Design Studio"}
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        width: 52,
        height: 52,
        borderRadius: "50%",
        border: "none",
        background: editorOpen
          ? "linear-gradient(135deg, #333, #555)"
          : "linear-gradient(135deg, #FF4A1C, #FF6D3F)",
        color: "#fff",
        fontSize: "1.35rem",
        cursor: "pointer",
        zIndex: 100011,
        display: "grid",
        placeItems: "center",
        boxShadow: editorOpen
          ? "0 4px 20px rgba(0,0,0,0.3)"
          : "0 4px 24px rgba(255,74,28,0.4), 0 0 0 3px rgba(255,74,28,0.1)",
        transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        transform: editorOpen ? "rotate(45deg)" : "rotate(0deg)",
      }}
    >
      {editorOpen ? "✕" : "🎨"}
    </button>
  );
}
