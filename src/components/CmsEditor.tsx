"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useCms, type CmsOverrides } from "./CmsContext";

// ── Design tokens available for customization ────────────
const COLOR_TOKENS = [
  { key: "--paper", label: "Background", default: "#EFEBE3" },
  { key: "--ink", label: "Text Color", default: "#111111" },
  { key: "--vermilion", label: "Accent", default: "#FF4A1C" },
  { key: "--ink-40", label: "Muted Text", default: "rgba(17,17,17,0.4)" },
];

const FONT_TOKENS = [
  { key: "--font-display", label: "Display Font", options: ["'Bricolage Grotesque', sans-serif", "'Inter', sans-serif", "'Outfit', sans-serif", "'Poppins', sans-serif", "'Montserrat', sans-serif", "'Playfair Display', serif"] },
  { key: "--font-serif", label: "Serif Font", options: ["'Instrument Serif', serif", "'Playfair Display', serif", "'Lora', serif", "'Cormorant Garamond', serif", "'DM Serif Display', serif"] },
  { key: "--font-mono", label: "Mono Font", options: ["'JetBrains Mono', monospace", "'Fira Code', monospace", "'Source Code Pro', monospace", "'IBM Plex Mono', monospace"] },
];

const SIZE_TOKENS = [
  { key: "--space-xs", label: "Space XS", default: "0.5rem" },
  { key: "--space-sm", label: "Space SM", default: "1rem" },
  { key: "--space-md", label: "Space MD", default: "2rem" },
  { key: "--space-lg", label: "Space LG", default: "4rem" },
  { key: "--space-xl", label: "Space XL", default: "8rem" },
];

type Tab = "colors" | "fonts" | "sizes" | "text" | "export";

export default function CmsEditor() {
  const cms = useCms();
  const [activeTab, setActiveTab] = useState<Tab>("colors");
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: -1, y: -1 });
  const [isDragging, setIsDragging] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const [exportJson, setExportJson] = useState("");
  const [copied, setCopied] = useState(false);
  const [importJson, setImportJson] = useState("");
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [textEdits, setTextEdits] = useState<Record<string, string>>({});

  const handleDownload = () => {
    const json = cms.exportOverrides();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "yeab-portfolio-config.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    const json = cms.exportOverrides();
    navigator.clipboard.writeText(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Initialize position on mount
  useEffect(() => {
    if (position.x === -1) {
      setPosition({ x: window.innerWidth - 380, y: 80 });
    }
  }, [position.x]);

  // ── Dragging logic ──────────────────────────────────────
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if ((e.target as HTMLElement).closest("input, select, textarea, button")) return;
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    },
    [position]
  );

  useEffect(() => {
    if (!isDragging) return;
    const handleMove = (e: MouseEvent) => {
      setPosition({
        x: Math.max(0, Math.min(window.innerWidth - 360, e.clientX - dragOffset.x)),
        y: Math.max(0, Math.min(window.innerHeight - 100, e.clientY - dragOffset.y)),
      });
    };
    const handleUp = () => setIsDragging(false);
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
  }, [isDragging, dragOffset]);

  // ── Populate text edits from current overrides ────────
  useEffect(() => {
    setTextEdits({ ...cms.overrides.text });
  }, [cms.overrides.text]);

  if (!cms.isAuth || !cms.editorOpen) return null;

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "colors", label: "Colors", icon: "🎨" },
    { id: "fonts", label: "Fonts", icon: "🔤" },
    { id: "sizes", label: "Spacing", icon: "📐" },
    { id: "text", label: "Text", icon: "✏️" },
    { id: "export", label: "Export", icon: "💾" },
  ];

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-label="Visual CMS Editor"
      style={{
        position: "fixed",
        top: position.y,
        left: position.x,
        width: 350,
        maxHeight: "80vh",
        zIndex: 100010,
        background: "rgba(18, 18, 18, 0.96)",
        backdropFilter: "blur(24px)",
        borderRadius: 16,
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,74,28,0.15)",
        color: "#e8e4dc",
        fontFamily: "var(--font-mono), monospace",
        fontSize: "0.72rem",
        overflow: "hidden",
        cursor: isDragging ? "grabbing" : "default",
        userSelect: isDragging ? "none" : "auto",
      }}
    >
      {/* ── Header / drag handle ── */}
      <div
        onMouseDown={handleMouseDown}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 16px",
          background: "rgba(255,74,28,0.06)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          cursor: isDragging ? "grabbing" : "grab",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: "1rem" }}>🎛️</span>
          <span
            style={{
              fontWeight: 700,
              fontSize: "0.8rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              background: "linear-gradient(135deg, #FF4A1C, #FF8A65)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Design Studio
          </span>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button
            onClick={() => cms.setEditorOpen(false)}
            aria-label="Minimize editor"
            style={{
              width: 24,
              height: 24,
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 6,
              background: "rgba(255,255,255,0.05)",
              color: "#999",
              fontSize: "0.7rem",
              cursor: "pointer",
              display: "grid",
              placeItems: "center",
            }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* ── Tab bar ── */}
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          padding: "0 8px",
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              padding: "10px 4px",
              background: "none",
              border: "none",
              borderBottom: activeTab === tab.id ? "2px solid #FF4A1C" : "2px solid transparent",
              color: activeTab === tab.id ? "#FF4A1C" : "#777",
              fontSize: "0.65rem",
              fontFamily: "inherit",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              transition: "all 0.2s",
            }}
          >
            <span style={{ fontSize: "0.85rem" }}>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ── Content area ── */}
      <div
        style={{
          padding: 16,
          overflowY: "auto",
          maxHeight: "calc(80vh - 120px)",
        }}
      >
        {/* ── Colors Tab ── */}
        {activeTab === "colors" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <p style={{ color: "#888", marginBottom: 2 }}>
              Pick a curated theme preset or customize individual colors below.
            </p>

            {/* Presets */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 8 }}>
              <span style={{ fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#666" }}>
                Curated Theme Presets
              </span>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                {[
                  {
                    name: "Classic Warm",
                    colors: { "--paper": "#EFEBE3", "--ink": "#111111", "--vermilion": "#FF4A1C", "--ink-40": "rgba(17,17,17,0.4)" },
                  },
                  {
                    name: "Obsidian Dark",
                    colors: { "--paper": "#0e1013", "--ink": "#f1f3f7", "--vermilion": "#ff5238", "--ink-40": "rgba(241,243,247,0.4)" },
                  },
                  {
                    name: "Minimal Ivory",
                    colors: { "--paper": "#FBF9F4", "--ink": "#151515", "--vermilion": "#E63900", "--ink-40": "rgba(21,21,21,0.4)" },
                  },
                  {
                    name: "Bronze Studio",
                    colors: { "--paper": "#141312", "--ink": "#eae6df", "--vermilion": "#e0783a", "--ink-40": "rgba(234,230,223,0.4)" },
                  },
                ].map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => {
                      Object.entries(preset.colors).forEach(([k, v]) => {
                        cms.setOverride("colors", k, v);
                      });
                    }}
                    style={{
                      padding: "8px 6px",
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 8,
                      color: "#ddd",
                      fontSize: "0.65rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <span
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        background: preset.colors["--vermilion"],
                        boxShadow: `0 0 0 2px ${preset.colors["--paper"]}`,
                        display: "inline-block",
                      }}
                    />
                    <span>{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>
            {COLOR_TOKENS.map((token) => (
              <div
                key={token.key}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px 10px",
                  background: "rgba(255,255,255,0.03)",
                  borderRadius: 8,
                  border: "1px solid rgba(255,255,255,0.04)",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <span style={{ fontWeight: 600, color: "#ccc" }}>{token.label}</span>
                  <span style={{ color: "#666", fontSize: "0.6rem" }}>{token.key}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input
                    type="color"
                    value={cms.getOverride("colors", token.key) || token.default}
                    onChange={(e) => cms.setOverride("colors", token.key, e.target.value)}
                    style={{
                      width: 32,
                      height: 32,
                      border: "2px solid rgba(255,255,255,0.1)",
                      borderRadius: 8,
                      cursor: "pointer",
                      background: "transparent",
                      padding: 0,
                    }}
                  />
                  <button
                    onClick={() => cms.removeOverride("colors", token.key)}
                    title="Reset to default"
                    style={{
                      background: "none",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 4,
                      color: "#777",
                      fontSize: "0.6rem",
                      padding: "2px 6px",
                      cursor: "pointer",
                    }}
                  >
                    ↺
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Fonts Tab ── */}
        {activeTab === "fonts" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <p style={{ color: "#888", marginBottom: 4 }}>
              Change typography across the entire site. Preview updates live.
            </p>
            {FONT_TOKENS.map((token) => (
              <div
                key={token.key}
                style={{
                  padding: "10px 10px",
                  background: "rgba(255,255,255,0.03)",
                  borderRadius: 8,
                  border: "1px solid rgba(255,255,255,0.04)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 6,
                  }}
                >
                  <span style={{ fontWeight: 600, color: "#ccc" }}>{token.label}</span>
                  <button
                    onClick={() => cms.removeOverride("fonts", token.key)}
                    title="Reset"
                    style={{
                      background: "none",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 4,
                      color: "#777",
                      fontSize: "0.6rem",
                      padding: "2px 6px",
                      cursor: "pointer",
                    }}
                  >
                    ↺
                  </button>
                </div>
                <select
                  value={cms.getOverride("fonts", token.key) || token.options[0]}
                  onChange={(e) => cms.setOverride("fonts", token.key, e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    background: "rgba(0,0,0,0.4)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 6,
                    color: "#e8e4dc",
                    fontFamily: "inherit",
                    fontSize: "0.7rem",
                    cursor: "pointer",
                  }}
                >
                  {token.options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt.split(",")[0].replace(/'/g, "")}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        )}

        {/* ── Sizes Tab ── */}
        {activeTab === "sizes" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <p style={{ color: "#888", marginBottom: 4 }}>
              Fine-tune spacing and layout proportions.
            </p>
            {SIZE_TOKENS.map((token) => {
              const current = cms.getOverride("sizes", token.key) || token.default;
              const numValue = parseFloat(current) || 0;
              return (
                <div
                  key={token.key}
                  style={{
                    padding: "10px 10px",
                    background: "rgba(255,255,255,0.03)",
                    borderRadius: 8,
                    border: "1px solid rgba(255,255,255,0.04)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 6,
                    }}
                  >
                    <span style={{ fontWeight: 600, color: "#ccc" }}>{token.label}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ color: "#FF4A1C", fontWeight: 700 }}>{current}</span>
                      <button
                        onClick={() => cms.removeOverride("sizes", token.key)}
                        title="Reset"
                        style={{
                          background: "none",
                          border: "1px solid rgba(255,255,255,0.08)",
                          borderRadius: 4,
                          color: "#777",
                          fontSize: "0.6rem",
                          padding: "2px 6px",
                          cursor: "pointer",
                        }}
                      >
                        ↺
                      </button>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    step="0.25"
                    value={numValue}
                    onChange={(e) =>
                      cms.setOverride("sizes", token.key, `${e.target.value}rem`)
                    }
                    style={{
                      width: "100%",
                      accentColor: "#FF4A1C",
                      cursor: "pointer",
                    }}
                  />
                </div>
              );
            })}
          </div>
        )}

        {/* ── Text Tab ── */}
        {activeTab === "text" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <p style={{ color: "#888", marginBottom: 2 }}>
              Edit copy across all sections. Changes update instantly on screen.
            </p>

            {/* Dedication Banner Section */}
            <div
              style={{
                padding: "10px",
                background: "rgba(255, 74, 28, 0.08)",
                border: "1px solid rgba(255, 74, 28, 0.25)",
                borderRadius: 8,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontWeight: 700, color: "#FF4A1C", fontSize: "0.68rem" }}>
                  ❤️ Dedication Banner
                </span>
                <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: "0.65rem", color: "#bbb" }}>
                  <input
                    type="checkbox"
                    checked={cms.overrides.custom["hide_dedication"] !== "true"}
                    onChange={(e) =>
                      cms.setOverride("custom", "hide_dedication", e.target.checked ? "false" : "true")
                    }
                    style={{ accentColor: "#FF4A1C", cursor: "pointer" }}
                  />
                  <span>Show Banner</span>
                </label>
              </div>
              <input
                type="text"
                value={textEdits["cms-dedication-text"] ?? ""}
                placeholder="Dedicated to Yeab — My Crush & The Most Talented Designer ✨"
                onChange={(e) => {
                  setTextEdits((prev) => ({ ...prev, ["cms-dedication-text"]: e.target.value }));
                  if (e.target.value.trim()) {
                    cms.setOverride("text", "cms-dedication-text", e.target.value);
                  } else {
                    cms.removeOverride("text", "cms-dedication-text");
                  }
                }}
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  background: "rgba(0,0,0,0.5)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 6,
                  color: "#e8e4dc",
                  fontFamily: "inherit",
                  fontSize: "0.68rem",
                }}
              />
            </div>

            {/* Predefined Sections */}
            {[
              {
                section: "Hero & Identity",
                fields: [
                  { id: "cms-name", label: "Display Name", placeholder: "YEAB" },
                  { id: "cms-role", label: "Primary Role", placeholder: "Graphic & Logo Designer" },
                  { id: "cms-role-sub", label: "Role Subtitle", placeholder: "Visual identity & brand experience" },
                ],
              },
              {
                section: "Statement (Kinetic)",
                fields: [
                  { id: "cms-statement-1", label: "Statement Line 1", placeholder: "I turn ideas" },
                  { id: "cms-statement-2", label: "Statement Line 2", placeholder: "into visual" },
                  { id: "cms-statement-3", label: "Statement Line 3", placeholder: "experiences." },
                ],
              },
              {
                section: "About & Story",
                fields: [
                  { id: "cms-bio-1", label: "Bio — Paragraph 1", placeholder: "Hi there! I'm Yeabsira Addis..." },
                  { id: "cms-bio-2", label: "Bio — Paragraph 2 (Degree)", placeholder: "I hold a BA in Business & Economics..." },
                  { id: "cms-bio-3", label: "Bio — Paragraph 3 (Scope)", placeholder: "My work spans versatile logo systems..." },
                  { id: "cms-education", label: "Education Badge", placeholder: "BA in Business & Economics · MBA Candidate" },
                ],
              },
              {
                section: "Real Metrics & Stats",
                fields: [
                  { id: "cms-stat-val-1", label: "Stat 1 Value", placeholder: "5.0 ★" },
                  { id: "cms-stat-lbl-1", label: "Stat 1 Label", placeholder: "Client Rating (Upwork)" },
                  { id: "cms-stat-val-2", label: "Stat 2 Value", placeholder: "100%" },
                  { id: "cms-stat-lbl-2", label: "Stat 2 Label", placeholder: "Job Success & On-Time" },
                  { id: "cms-stat-val-3", label: "Stat 3 Value", placeholder: "500+" },
                  { id: "cms-stat-lbl-3", label: "Stat 3 Label", placeholder: "LinkedIn Connections" },
                  { id: "cms-stat-val-4", label: "Stat 4 Value", placeholder: "14+" },
                  { id: "cms-stat-lbl-4", label: "Stat 4 Label", placeholder: "Verified Certifications" },
                ],
              },
              {
                section: "Contact & Location",
                fields: [
                  { id: "cms-email", label: "Email Address", placeholder: "yeabsira2137@gmail.com" },
                  { id: "cms-phone", label: "Phone Number", placeholder: "+251 91 234 5678" },
                  { id: "cms-location", label: "Based In", placeholder: "Addis Ababa, Ethiopia" },
                ],
              },
            ].map((group) => (
              <div key={group.section} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <span
                  style={{
                    fontSize: "0.62rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: "#777",
                    fontWeight: 700,
                  }}
                >
                  {group.section}
                </span>
                {group.fields.map((field) => (
                  <div
                    key={field.id}
                    style={{
                      padding: "8px 10px",
                      background: "rgba(255,255,255,0.03)",
                      borderRadius: 8,
                      border: "1px solid rgba(255,255,255,0.04)",
                    }}
                  >
                    <label
                      style={{
                        display: "block",
                        fontWeight: 600,
                        color: "#ccc",
                        marginBottom: 4,
                        fontSize: "0.66rem",
                      }}
                    >
                      {field.label}
                    </label>
                    <input
                      type="text"
                      value={textEdits[field.id] ?? ""}
                      placeholder={field.placeholder}
                      onChange={(e) => {
                        setTextEdits((prev) => ({ ...prev, [field.id]: e.target.value }));
                        if (e.target.value.trim()) {
                          cms.setOverride("text", field.id, e.target.value);
                        } else {
                          cms.removeOverride("text", field.id);
                        }
                      }}
                      style={{
                        width: "100%",
                        padding: "6px 8px",
                        background: "rgba(0,0,0,0.4)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: 6,
                        color: "#e8e4dc",
                        fontFamily: "inherit",
                        fontSize: "0.68rem",
                      }}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* ── Export / Import Tab ── */}
        {activeTab === "export" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <p style={{ color: "#888", marginBottom: 2 }}>
              Share your customizations with your developer, or backup and restore them.
            </p>

            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={handleDownload}
                style={{
                  flex: 1,
                  padding: "10px 12px",
                  background: "linear-gradient(135deg, #FF4A1C, #FF6D3F)",
                  border: "none",
                  borderRadius: 8,
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "0.7rem",
                  cursor: "pointer",
                  letterSpacing: "0.03em",
                }}
              >
                💾 Download Config
              </button>
              <button
                onClick={handleCopy}
                style={{
                  flex: 1,
                  padding: "10px 12px",
                  background: copied ? "rgba(76,175,80,0.2)" : "rgba(255,255,255,0.06)",
                  border: copied ? "1px solid #4CAF50" : "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 8,
                  color: copied ? "#4CAF50" : "#ddd",
                  fontWeight: 700,
                  fontSize: "0.7rem",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {copied ? "✓ Copied!" : "📋 Copy JSON"}
              </button>
            </div>

            <button
              onClick={() => setExportJson(cms.exportOverrides())}
              style={{
                padding: "8px 12px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 6,
                color: "#aaa",
                fontSize: "0.65rem",
                cursor: "pointer",
              }}
            >
              👁️ View Raw JSON
            </button>

            {exportJson && (
              <textarea
                readOnly
                value={exportJson}
                onClick={(e) => (e.target as HTMLTextAreaElement).select()}
                style={{
                  width: "100%",
                  height: 110,
                  padding: 8,
                  background: "rgba(0,0,0,0.5)",
                  border: "1px solid rgba(255,74,28,0.25)",
                  borderRadius: 6,
                  color: "#e8e4dc",
                  fontFamily: "inherit",
                  fontSize: "0.62rem",
                  resize: "vertical",
                }}
              />
            )}

            <div
              style={{
                height: 1,
                background: "rgba(255,255,255,0.06)",
                margin: "4px 0",
              }}
            />

            <label style={{ fontWeight: 600, color: "#ccc", fontSize: "0.68rem" }}>
              Import JSON Configuration
            </label>
            <textarea
              value={importJson}
              onChange={(e) => setImportJson(e.target.value)}
              placeholder='Paste exported JSON here...'
              style={{
                width: "100%",
                height: 80,
                padding: 8,
                background: "rgba(0,0,0,0.4)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 6,
                color: "#e8e4dc",
                fontFamily: "inherit",
                fontSize: "0.62rem",
                resize: "vertical",
              }}
            />
            <button
              onClick={() => {
                const ok = cms.importOverrides(importJson);
                setImportStatus(ok ? "✅ Imported successfully!" : "❌ Invalid JSON format");
                setTimeout(() => setImportStatus(null), 3000);
              }}
              style={{
                padding: "8px 14px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 6,
                color: "#ccc",
                fontWeight: 600,
                fontSize: "0.68rem",
                cursor: "pointer",
              }}
            >
              📥 Import Config
            </button>
            {importStatus && (
              <p style={{ color: importStatus.startsWith("✅") ? "#4CAF50" : "#FF4A1C", fontSize: "0.68rem" }}>
                {importStatus}
              </p>
            )}

            <div
              style={{
                height: 1,
                background: "rgba(255,255,255,0.06)",
                margin: "4px 0",
              }}
            />

            <button
              onClick={() => {
                if (confirm("Are you sure you want to reset all customizations to defaults?")) {
                  cms.resetAll();
                }
              }}
              style={{
                padding: "10px 14px",
                background: "rgba(220,53,69,0.12)",
                border: "1px solid rgba(220,53,69,0.3)",
                borderRadius: 8,
                color: "#ef5350",
                fontWeight: 700,
                fontSize: "0.68rem",
                cursor: "pointer",
              }}
            >
              🗑️ Reset All to Defaults
            </button>

            <button
              onClick={cms.logout}
              style={{
                padding: "10px 14px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 8,
                color: "#999",
                fontWeight: 600,
                fontSize: "0.68rem",
                cursor: "pointer",
                marginTop: 2,
              }}
            >
              🔒 Logout Studio
            </button>
          </div>
        )}
      </div>

      {/* ── Footer status bar ── */}
      <div
        style={{
          padding: "8px 16px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "rgba(0,0,0,0.2)",
        }}
      >
        <span style={{ color: "#555", fontSize: "0.6rem" }}>
          Changes saved to localStorage
        </span>
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "#4CAF50",
            display: "inline-block",
          }}
        />
      </div>
    </div>
  );
}
