"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useCms, type ProjectItem, type CertItem } from "./CmsContext";
import { PROJECTS } from "../../content/projects";
import { SITE } from "../../content/site";

// ── Design tokens available for customization ────────────
const COLOR_TOKENS = [
  { key: "--paper", label: "Background", default: "#EFEBE3" },
  { key: "--ink", label: "Text Color", default: "#111111" },
  { key: "--vermilion", label: "Accent", default: "#FF4A1C" },
  { key: "--ink-40", label: "Muted Text", default: "rgba(17,17,17,0.4)" },
];

const THEME_PRESETS = [
  {
    name: "Classic Warm",
    colors: {
      "--paper": "#EFEBE3",
      "--ink": "#111111",
      "--vermilion": "#FF4A1C",
      "--ink-40": "rgba(17,17,17,0.4)",
    },
    dot: "#FF4A1C",
    bg: "#EFEBE3",
  },
  {
    name: "Obsidian Cyber",
    colors: {
      "--paper": "#0c0d10",
      "--ink": "#f1f3f7",
      "--vermilion": "#ff4a1c",
      "--ink-40": "rgba(241,243,247,0.4)",
    },
    dot: "#ff4a1c",
    bg: "#0c0d10",
  },
  {
    name: "Minimal Ivory",
    colors: {
      "--paper": "#FBF9F4",
      "--ink": "#151515",
      "--vermilion": "#E63900",
      "--ink-40": "rgba(21,21,21,0.4)",
    },
    dot: "#E63900",
    bg: "#FBF9F4",
  },
  {
    name: "Bronze Studio",
    colors: {
      "--paper": "#141312",
      "--ink": "#eae6df",
      "--vermilion": "#e0783a",
      "--ink-40": "rgba(234,230,223,0.4)",
    },
    dot: "#e0783a",
    bg: "#141312",
  },
  {
    name: "Velvet Navy",
    colors: {
      "--paper": "#0b111e",
      "--ink": "#eaf0f8",
      "--vermilion": "#38bdf8",
      "--ink-40": "rgba(234,240,248,0.4)",
    },
    dot: "#38bdf8",
    bg: "#0b111e",
  },
  {
    name: "Swiss Mono",
    colors: {
      "--paper": "#ffffff",
      "--ink": "#0a0a0a",
      "--vermilion": "#0a0a0a",
      "--ink-40": "rgba(10,10,10,0.4)",
    },
    dot: "#0a0a0a",
    bg: "#ffffff",
  },
];

type Tab = "colors" | "text" | "projects" | "certs" | "effects" | "export";

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

  // New Project Form state
  const [newProj, setNewProj] = useState({
    title: "",
    category: "Brand Identity",
    client: "",
    year: "2026",
    heroImage: "",
  });
  const [showAddProj, setShowAddProj] = useState(false);

  // New Cert Form state
  const [newCert, setNewCert] = useState({
    title: "",
    issuer: "",
    date: "October 2026",
    credentialUrl: "",
  });
  const [showAddCert, setShowAddCert] = useState(false);

  const [isMobile, setIsMobile] = useState(false);

  // Initialize position on mount & track mobile resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 640;
      setIsMobile(mobile);
      if (!mobile && position.x === -1) {
        setPosition({ x: Math.max(10, window.innerWidth - 410), y: 70 });
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [position.x]);

  // Dragging logic (desktop only)
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (isMobile) return;
      if ((e.target as HTMLElement).closest("input, select, textarea, button")) return;
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    },
    [position, isMobile]
  );

  useEffect(() => {
    if (!isDragging) return;
    const handleMove = (e: MouseEvent) => {
      setPosition({
        x: Math.max(0, Math.min(window.innerWidth - 380, e.clientX - dragOffset.x)),
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

  useEffect(() => {
    setTextEdits({ ...cms.overrides.text });
  }, [cms.overrides.text]);

  const handleDownload = () => {
    const json = cms.exportOverrides();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "yeab-portfolio-config.json";
    a.click();
    URL.revokeObjectURL(url);
    cms.showToast("💾 Config file downloaded!");
  };

  const handleCopy = () => {
    const json = cms.exportOverrides();
    navigator.clipboard.writeText(json);
    setCopied(true);
    cms.showToast("📋 Copied JSON to clipboard!");
    setTimeout(() => setCopied(false), 2500);
  };

  const handleAddProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProj.title.trim()) return;
    const slug = newProj.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const item: ProjectItem = {
      slug,
      title: newProj.title,
      category: newProj.category,
      client: newProj.client || "Client",
      year: newProj.year || "2026",
      subtitle: `${newProj.category} project`,
      tags: [newProj.category, "Visual Design"],
      heroImage: newProj.heroImage || "/work/my-perfect-logo-collection/cover.jpg",
      deliverables: ["Visual Identity", "Vector Files"],
    };
    cms.addCustomProject(item);
    setNewProj({ title: "", category: "Brand Identity", client: "", year: "2026", heroImage: "" });
    setShowAddProj(false);
  };

  const handleAddCertSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCert.title.trim() || !newCert.issuer.trim()) return;
    const item: CertItem = {
      title: newCert.title,
      issuer: newCert.issuer,
      date: newCert.date || "Recent",
      credentialUrl: newCert.credentialUrl || "#",
    };
    cms.addCustomCert(item);
    setNewCert({ title: "", issuer: "", date: "October 2026", credentialUrl: "" });
    setShowAddCert(false);
  };

  if (!cms.isAuth || !cms.editorOpen) return null;

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "colors", label: "Themes", icon: "🎨" },
    { id: "text", label: "Copy", icon: "✏️" },
    { id: "projects", label: "Works", icon: "💼" },
    { id: "certs", label: "Certs", icon: "🏆" },
    { id: "effects", label: "3D FX", icon: "🔮" },
    { id: "export", label: "Export", icon: "💾" },
  ];

  const hiddenProjects = cms.overrides.hiddenProjects || [];
  const customProjects = cms.overrides.customProjects || [];
  const allProjects = [...customProjects, ...PROJECTS];

  const hiddenCerts = cms.overrides.hiddenCerts || [];
  const customCerts = cms.overrides.customCerts || [];
  const allCerts = [...customCerts, ...SITE.certifications];

  const yMaterial = cms.overrides.effects?.yMaterial || "obsidian";
  const ySpeed = cms.overrides.effects?.ySpeed ?? 1.0;

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-label="Visual CMS Design Studio"
      style={{
        position: "fixed",
        ...(isMobile
          ? {
              bottom: 0,
              left: 0,
              right: 0,
              width: "100%",
              maxWidth: "100vw",
              maxHeight: "84dvh",
              borderRadius: "22px 22px 0 0",
              borderBottom: "none",
            }
          : {
              top: position.y,
              left: position.x,
              width: 380,
              maxHeight: "85vh",
              borderRadius: 18,
            }),
        zIndex: 100010,
        background: "rgba(16, 17, 20, 0.97)",
        backdropFilter: "blur(32px)",
        border: "1px solid rgba(255, 255, 255, 0.09)",
        boxShadow:
          "0 32px 90px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 74, 28, 0.2)",
        color: "#e8e4dc",
        fontFamily: "var(--font-mono), monospace",
        fontSize: "0.72rem",
        overflow: "hidden",
        cursor: !isMobile && isDragging ? "grabbing" : "default",
        userSelect: !isMobile && isDragging ? "none" : "auto",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Mobile pull tab indicator */}
      {isMobile && (
        <button
          onClick={() => cms.setEditorOpen(false)}
          title="Tap to minimize"
          aria-label="Tap to minimize Design Studio"
          style={{
            width: "100%",
            background: "none",
            border: "none",
            padding: "8px 0 4px",
            display: "flex",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <div
            style={{
              width: 42,
              height: 4,
              borderRadius: 2,
              background: "rgba(255, 255, 255, 0.35)",
            }}
          />
        </button>
      )}

      {/* ── Top Bar with Live Indicator & Direct Logout ── */}
      <div
        onMouseDown={handleMouseDown}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: isMobile ? "6px 14px 10px" : "12px 16px",
          background: "rgba(255, 74, 28, 0.07)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.07)",
          cursor: isMobile ? "default" : isDragging ? "grabbing" : "grab",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#4CAF50",
              boxShadow: "0 0 8px #4CAF50",
              display: "inline-block",
            }}
          />
          <span
            style={{
              fontWeight: 800,
              fontSize: isMobile ? "0.78rem" : "0.82rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              background: "linear-gradient(135deg, #FF4A1C, #FFA07A)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Design Studio
          </span>
        </div>

        {/* Quick action buttons in header */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {/* Prominent Header Logout Button */}
          <button
            onClick={() => {
              cms.logout();
            }}
            title="Log out from Studio"
            style={{
              padding: "5px 10px",
              background: "rgba(220, 53, 69, 0.18)",
              border: "1px solid rgba(220, 53, 69, 0.4)",
              borderRadius: 6,
              color: "#ff6b6b",
              fontSize: "0.68rem",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 4,
              touchAction: "manipulation",
            }}
          >
            <span>🔒</span>
            <span>Logout</span>
          </button>

          {/* Close / minimize panel */}
          <button
            onClick={() => cms.setEditorOpen(false)}
            aria-label="Close Studio panel"
            style={{
              width: 26,
              height: 26,
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: 6,
              background: "rgba(255, 255, 255, 0.04)",
              color: "#aaa",
              fontSize: "0.75rem",
              cursor: "pointer",
              display: "grid",
              placeItems: "center",
            }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* ── Tab Navigation ── */}
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
          padding: "0 4px",
          background: "rgba(0,0,0,0.25)",
          overflowX: "auto",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
          flexShrink: 0,
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: isMobile ? "0 0 auto" : 1,
              minWidth: isMobile ? 54 : 44,
              padding: isMobile ? "8px 6px" : "8px 2px",
              background: "none",
              border: "none",
              borderBottom:
                activeTab === tab.id ? "2px solid #FF4A1C" : "2px solid transparent",
              color: activeTab === tab.id ? "#FF4A1C" : "#777",
              fontSize: "0.62rem",
              fontFamily: "inherit",
              fontWeight: activeTab === tab.id ? 700 : 500,
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              transition: "all 0.15s",
              whiteSpace: "nowrap",
            }}
          >
            <span style={{ fontSize: "0.85rem" }}>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ── Scrollable Tab Content ── */}
      <div
        style={{
          padding: isMobile ? "12px 14px 20px" : 16,
          overflowY: "auto",
          WebkitOverflowScrolling: "touch",
          overscrollBehavior: "contain",
          maxHeight: isMobile ? "calc(84dvh - 100px)" : "calc(85vh - 110px)",
          flex: 1,
        }}
      >
        {/* ── THEMES TAB ── */}
        {activeTab === "colors" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <span
                style={{
                  fontSize: "0.64rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "#888",
                  fontWeight: 700,
                  display: "block",
                  marginBottom: 8,
                }}
              >
                1-Click Designer Themes
              </span>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                {THEME_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => {
                      Object.entries(preset.colors).forEach(([k, v]) => {
                        cms.setOverride("colors", k, v);
                      });
                      cms.showToast(`Applied ${preset.name} theme!`);
                    }}
                    style={{
                      padding: "8px",
                      background: "rgba(255, 255, 255, 0.03)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      borderRadius: 8,
                      color: "#ddd",
                      fontSize: "0.65rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      textAlign: "left",
                      transition: "border-color 0.2s",
                    }}
                  >
                    <span
                      style={{
                        width: 14,
                        height: 14,
                        borderRadius: "50%",
                        background: preset.dot,
                        boxShadow: `0 0 0 2px ${preset.bg}`,
                        border: "1px solid rgba(255,255,255,0.2)",
                        display: "inline-block",
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ fontWeight: 600 }}>{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ height: 1, background: "rgba(255,255,255,0.06)" }} />

            <div>
              <span
                style={{
                  fontSize: "0.64rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "#888",
                  fontWeight: 700,
                  display: "block",
                  marginBottom: 8,
                }}
              >
                Fine-Tune Color Tokens
              </span>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {COLOR_TOKENS.map((token) => (
                  <div
                    key={token.key}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "8px 10px",
                      background: "rgba(255, 255, 255, 0.03)",
                      borderRadius: 8,
                      border: "1px solid rgba(255, 255, 255, 0.04)",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, color: "#ccc" }}>{token.label}</div>
                      <div style={{ color: "#666", fontSize: "0.58rem" }}>{token.key}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <input
                        type="color"
                        value={cms.getOverride("colors", token.key) || token.default}
                        onChange={(e) =>
                          cms.setOverride("colors", token.key, e.target.value)
                        }
                        style={{
                          width: 30,
                          height: 30,
                          border: "2px solid rgba(255, 255, 255, 0.15)",
                          borderRadius: 6,
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
                          border: "1px solid rgba(255, 255, 255, 0.08)",
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
            </div>
          </div>
        )}

        {/* ── COPY & CONTENT TAB ── */}
        {activeTab === "text" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Dedication Banner Control */}
            <div
              style={{
                padding: "10px",
                background: "rgba(255, 74, 28, 0.08)",
                border: "1px solid rgba(255, 74, 28, 0.25)",
                borderRadius: 8,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <span style={{ fontWeight: 700, color: "#FF4A1C", fontSize: "0.68rem" }}>
                  ❤️ Dedication Banner (Crush)
                </span>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    cursor: "pointer",
                    fontSize: "0.65rem",
                    color: "#bbb",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={cms.overrides.custom["hide_dedication"] !== "true"}
                    onChange={(e) => {
                      cms.setOverride(
                        "custom",
                        "hide_dedication",
                        e.target.checked ? "false" : "true"
                      );
                      cms.showToast(
                        e.target.checked ? "Banner shown" : "Banner hidden"
                      );
                    }}
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
                  setTextEdits((prev) => ({
                    ...prev,
                    ["cms-dedication-text"]: e.target.value,
                  }));
                  if (e.target.value.trim()) {
                    cms.setOverride("text", "cms-dedication-text", e.target.value);
                  } else {
                    cms.removeOverride("text", "cms-dedication-text");
                  }
                }}
                style={{
                  width: "100%",
                  padding: "6px 8px",
                  background: "rgba(0,0,0,0.5)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: 6,
                  color: "#e8e4dc",
                  fontFamily: "inherit",
                  fontSize: "0.68rem",
                }}
              />
              <div style={{ marginTop: 8 }}>
                <label style={{ display: "block", fontSize: "0.62rem", color: "#bbb", marginBottom: 4 }}>
                  Personal Note (Shown when Yeab clicks the badge)
                </label>
                <textarea
                  rows={4}
                  value={cms.overrides.custom["dedication_letter"] ?? ""}
                  placeholder="Leave empty for default heartfelt note, or write your own special words..."
                  onChange={(e) => {
                    if (e.target.value.trim()) {
                      cms.setOverride("custom", "dedication_letter", e.target.value);
                    } else {
                      cms.removeOverride("custom", "dedication_letter");
                    }
                  }}
                  style={{
                    width: "100%",
                    padding: "6px 8px",
                    background: "rgba(0,0,0,0.5)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: 6,
                    color: "#e8e4dc",
                    fontFamily: "inherit",
                    fontSize: "0.68rem",
                    lineHeight: 1.4,
                    resize: "vertical",
                  }}
                />
              </div>
            </div>

            {/* Content Group Fields */}
            {[
              {
                section: "Hero & Headline",
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
                  { id: "cms-phone", label: "Phone Number", placeholder: "+251 98 626 7543" },
                  { id: "cms-location", label: "Based In", placeholder: "Addis Ababa, Ethiopia" },
                ],
              },
            ].map((group) => (
              <div key={group.section} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
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
                      padding: "6px 8px",
                      background: "rgba(255, 255, 255, 0.03)",
                      borderRadius: 6,
                      border: "1px solid rgba(255, 255, 255, 0.04)",
                    }}
                  >
                    <label
                      style={{
                        display: "block",
                        fontWeight: 600,
                        color: "#ccc",
                        marginBottom: 4,
                        fontSize: "0.64rem",
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
                        background: "rgba(0, 0, 0, 0.4)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: 5,
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

        {/* ── WORKS & PROJECTS TAB ── */}
        {activeTab === "projects" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span
                style={{
                  fontSize: "0.64rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "#888",
                  fontWeight: 700,
                }}
              >
                Portfolio Works ({allProjects.length})
              </span>
              <button
                onClick={() => setShowAddProj(!showAddProj)}
                style={{
                  padding: "4px 8px",
                  background: "linear-gradient(135deg, #FF4A1C, #FF6D3F)",
                  border: "none",
                  borderRadius: 6,
                  color: "#fff",
                  fontSize: "0.64rem",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {showAddProj ? "✕ Cancel" : "+ Add Project"}
              </button>
            </div>

            {/* Add Project Form */}
            {showAddProj && (
              <form
                onSubmit={handleAddProjectSubmit}
                style={{
                  padding: 12,
                  background: "rgba(255, 74, 28, 0.06)",
                  border: "1px solid rgba(255, 74, 28, 0.25)",
                  borderRadius: 10,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <span style={{ fontWeight: 700, color: "#FF4A1C", fontSize: "0.7rem" }}>
                  New Case Study
                </span>
                <input
                  type="text"
                  placeholder="Project Title (e.g. Lumina Fashion Identity)"
                  value={newProj.title}
                  onChange={(e) => setNewProj({ ...newProj, title: e.target.value })}
                  required
                  style={{
                    padding: "6px 8px",
                    background: "rgba(0,0,0,0.5)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 6,
                    color: "#fff",
                    fontSize: "0.68rem",
                  }}
                />
                <input
                  type="text"
                  placeholder="Category (e.g. Logo Design, Packaging)"
                  value={newProj.category}
                  onChange={(e) => setNewProj({ ...newProj, category: e.target.value })}
                  style={{
                    padding: "6px 8px",
                    background: "rgba(0,0,0,0.5)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 6,
                    color: "#fff",
                    fontSize: "0.68rem",
                  }}
                />
                <input
                  type="text"
                  placeholder="Client Name (e.g. Lumina Studio)"
                  value={newProj.client}
                  onChange={(e) => setNewProj({ ...newProj, client: e.target.value })}
                  style={{
                    padding: "6px 8px",
                    background: "rgba(0,0,0,0.5)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 6,
                    color: "#fff",
                    fontSize: "0.68rem",
                  }}
                />
                <input
                  type="text"
                  placeholder="Image URL (or leave blank for art pattern)"
                  value={newProj.heroImage}
                  onChange={(e) => setNewProj({ ...newProj, heroImage: e.target.value })}
                  style={{
                    padding: "6px 8px",
                    background: "rgba(0,0,0,0.5)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 6,
                    color: "#fff",
                    fontSize: "0.68rem",
                  }}
                />
                <button
                  type="submit"
                  style={{
                    padding: "8px",
                    background: "#FF4A1C",
                    border: "none",
                    borderRadius: 6,
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "0.7rem",
                    cursor: "pointer",
                  }}
                >
                  ✓ Save Project to Portfolio
                </button>
              </form>
            )}

            {/* Projects list */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {allProjects.map((p) => {
                const isHidden = hiddenProjects.includes(p.slug);
                const isCustom = customProjects.some((cp) => cp.slug === p.slug);
                return (
                  <div
                    key={p.slug}
                    style={{
                      padding: "8px 10px",
                      background: isHidden
                        ? "rgba(255, 255, 255, 0.01)"
                        : "rgba(255, 255, 255, 0.03)",
                      borderRadius: 8,
                      border: "1px solid rgba(255, 255, 255, 0.05)",
                      opacity: isHidden ? 0.45 : 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                      <div style={{ fontWeight: 600, color: "#fff", fontSize: "0.68rem" }}>
                        {p.title}
                      </div>
                      <div style={{ color: "#777", fontSize: "0.58rem" }}>
                        {'discipline' in p ? p.discipline : p.category} · {p.year}
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {isCustom && (
                        <button
                          onClick={() => cms.removeCustomProject(p.slug)}
                          title="Delete custom project"
                          style={{
                            background: "none",
                            border: "none",
                            color: "#ff6b6b",
                            cursor: "pointer",
                            fontSize: "0.75rem",
                          }}
                        >
                          🗑️
                        </button>
                      )}
                      <label style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer", fontSize: "0.62rem" }}>
                        <input
                          type="checkbox"
                          checked={!isHidden}
                          onChange={() => cms.toggleProjectVisibility(p.slug)}
                          style={{ accentColor: "#FF4A1C", cursor: "pointer" }}
                        />
                        <span>{isHidden ? "Hidden" : "Visible"}</span>
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── CERTIFICATIONS TAB ── */}
        {activeTab === "certs" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span
                style={{
                  fontSize: "0.64rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "#888",
                  fontWeight: 700,
                }}
              >
                Certifications ({allCerts.length})
              </span>
              <button
                onClick={() => setShowAddCert(!showAddCert)}
                style={{
                  padding: "4px 8px",
                  background: "linear-gradient(135deg, #FF4A1C, #FF6D3F)",
                  border: "none",
                  borderRadius: 6,
                  color: "#fff",
                  fontSize: "0.64rem",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {showAddCert ? "✕ Cancel" : "+ Add Cert"}
              </button>
            </div>

            {/* Add Cert Form */}
            {showAddCert && (
              <form
                onSubmit={handleAddCertSubmit}
                style={{
                  padding: 12,
                  background: "rgba(255, 74, 28, 0.06)",
                  border: "1px solid rgba(255, 74, 28, 0.25)",
                  borderRadius: 10,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <span style={{ fontWeight: 700, color: "#FF4A1C", fontSize: "0.7rem" }}>
                  Add LinkedIn or Professional Certificate
                </span>
                <input
                  type="text"
                  placeholder="Certificate Title"
                  value={newCert.title}
                  onChange={(e) => setNewCert({ ...newCert, title: e.target.value })}
                  required
                  style={{
                    padding: "6px 8px",
                    background: "rgba(0,0,0,0.5)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 6,
                    color: "#fff",
                    fontSize: "0.68rem",
                  }}
                />
                <input
                  type="text"
                  placeholder="Issuing Organization (e.g. LinkedIn Learning, Coursera)"
                  value={newCert.issuer}
                  onChange={(e) => setNewCert({ ...newCert, issuer: e.target.value })}
                  required
                  style={{
                    padding: "6px 8px",
                    background: "rgba(0,0,0,0.5)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 6,
                    color: "#fff",
                    fontSize: "0.68rem",
                  }}
                />
                <input
                  type="text"
                  placeholder="Issue Date (e.g. October 2026)"
                  value={newCert.date}
                  onChange={(e) => setNewCert({ ...newCert, date: e.target.value })}
                  style={{
                    padding: "6px 8px",
                    background: "rgba(0,0,0,0.5)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 6,
                    color: "#fff",
                    fontSize: "0.68rem",
                  }}
                />
                <button
                  type="submit"
                  style={{
                    padding: "8px",
                    background: "#FF4A1C",
                    border: "none",
                    borderRadius: 6,
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "0.7rem",
                    cursor: "pointer",
                  }}
                >
                  ✓ Add to Portfolio
                </button>
              </form>
            )}

            {/* Certs list */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {allCerts.map((c) => {
                const isHidden = hiddenCerts.includes(c.title);
                const isCustom = customCerts.some((cc) => cc.title === c.title);
                return (
                  <div
                    key={c.title}
                    style={{
                      padding: "8px 10px",
                      background: isHidden
                        ? "rgba(255, 255, 255, 0.01)"
                        : "rgba(255, 255, 255, 0.03)",
                      borderRadius: 8,
                      border: "1px solid rgba(255, 255, 255, 0.05)",
                      opacity: isHidden ? 0.45 : 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div style={{ overflow: "hidden", textOverflow: "ellipsis", maxWidth: "70%" }}>
                      <div style={{ fontWeight: 600, color: "#fff", fontSize: "0.66rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {c.title}
                      </div>
                      <div style={{ color: "#777", fontSize: "0.58rem" }}>
                        {c.issuer} · {c.date}
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {isCustom && (
                        <button
                          onClick={() => cms.removeCustomCert(c.title)}
                          title="Delete certificate"
                          style={{
                            background: "none",
                            border: "none",
                            color: "#ff6b6b",
                            cursor: "pointer",
                            fontSize: "0.75rem",
                          }}
                        >
                          🗑️
                        </button>
                      )}
                      <label style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer", fontSize: "0.62rem" }}>
                        <input
                          type="checkbox"
                          checked={!isHidden}
                          onChange={() => cms.toggleCertVisibility(c.title)}
                          style={{ accentColor: "#FF4A1C", cursor: "pointer" }}
                        />
                        <span>{isHidden ? "Hidden" : "Visible"}</span>
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── 3D & FX TAB ── */}
        {activeTab === "effects" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <span
                style={{
                  fontSize: "0.64rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "#888",
                  fontWeight: 700,
                  display: "block",
                  marginBottom: 8,
                }}
              >
                3D Kinetic &apos;Y&apos; Finish
              </span>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                {[
                  { id: "obsidian", label: "Obsidian Glass", icon: "🖤" },
                  { id: "vermilion", label: "Liquid Vermilion", icon: "🧡" },
                  { id: "gold", label: "Brushed Gold", icon: "👑" },
                  { id: "chrome", label: "Liquid Chrome", icon: "🪞" },
                  { id: "wireframe", label: "Cyber Wireframe", icon: "🕸️" },
                ].map((mat) => (
                  <button
                    key={mat.id}
                    onClick={() => {
                      cms.setEffect("yMaterial", mat.id as any);
                      cms.showToast(`3D 'Y' finish set to ${mat.label}`);
                    }}
                    style={{
                      padding: "8px 10px",
                      background:
                        yMaterial === mat.id
                          ? "rgba(255, 74, 28, 0.15)"
                          : "rgba(255, 255, 255, 0.03)",
                      border:
                        yMaterial === mat.id
                          ? "1px solid #FF4A1C"
                          : "1px solid rgba(255, 255, 255, 0.08)",
                      borderRadius: 8,
                      color: yMaterial === mat.id ? "#FF4A1C" : "#ddd",
                      fontSize: "0.65rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      fontWeight: yMaterial === mat.id ? 700 : 500,
                    }}
                  >
                    <span>{mat.icon}</span>
                    <span>{mat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ height: 1, background: "rgba(255,255,255,0.06)" }} />

            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 6,
                }}
              >
                <span style={{ fontWeight: 600, color: "#ccc" }}>Rotation Speed</span>
                <span style={{ color: "#FF4A1C", fontWeight: 700 }}>
                  {ySpeed.toFixed(1)}x
                </span>
              </div>
              <input
                type="range"
                min="0.2"
                max="3.0"
                step="0.1"
                value={ySpeed}
                onChange={(e) => cms.setEffect("ySpeed", parseFloat(e.target.value))}
                style={{ width: "100%", accentColor: "#FF4A1C", cursor: "pointer" }}
              />
            </div>
          </div>
        )}

        {/* ── EXPORT & SYNC TAB ── */}
        {activeTab === "export" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <p style={{ color: "#888", marginBottom: 2 }}>
              Share your customizations with your developer, or backup and restore them.
            </p>

            <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: 8 }}>
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

            {/* LinkedIn & Upwork Sync Explanation Card */}
            <div
              style={{
                padding: 10,
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 8,
              }}
            >
              <span
                style={{
                  fontWeight: 700,
                  color: "#fff",
                  fontSize: "0.68rem",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  marginBottom: 4,
                }}
              >
                <span>🔄</span>
                <span>Automatic LinkedIn &amp; Upwork Sync</span>
              </span>
              <p style={{ color: "#888", fontSize: "0.62rem", lineHeight: 1.4, margin: 0 }}>
                Whenever you add certifications on LinkedIn or new jobs on Upwork, you can either:
                <br />
                1. <strong>Direct in Studio:</strong> Use the <em>Works</em> or <em>Certs</em> tab to add them with 1 click!
                <br />
                2. <strong>Automated Sync:</strong> Connect a GitHub Action cron workflow to scrape and sync weekly into the repository.
              </p>
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
                  height: 100,
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

            <div style={{ height: 1, background: "rgba(255,255,255,0.06)" }} />

            <label style={{ fontWeight: 600, color: "#ccc", fontSize: "0.68rem" }}>
              Import JSON Configuration
            </label>
            <textarea
              value={importJson}
              onChange={(e) => setImportJson(e.target.value)}
              placeholder="Paste exported JSON here..."
              style={{
                width: "100%",
                height: 70,
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
                setImportStatus(
                  ok ? "✅ Imported successfully!" : "❌ Invalid JSON format"
                );
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
              <p
                style={{
                  color: importStatus.startsWith("✅") ? "#4CAF50" : "#FF4A1C",
                  fontSize: "0.68rem",
                }}
              >
                {importStatus}
              </p>
            )}

            <div style={{ height: 1, background: "rgba(255,255,255,0.06)" }} />

            <button
              onClick={() => {
                if (
                  confirm(
                    "Are you sure you want to reset all customizations to defaults?"
                  )
                ) {
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
          </div>
        )}
      </div>

      {/* ── Footer status bar ── */}
      <div
        style={{
          padding: isMobile
            ? "10px 16px calc(12px + env(safe-area-inset-bottom, 0px))"
            : "8px 16px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "rgba(0,0,0,0.3)",
          flexShrink: 0,
        }}
      >
        <span style={{ color: "#777", fontSize: "0.62rem" }}>
          Live persistence (localStorage)
        </span>
        <button
          onClick={() => {
            cms.logout();
          }}
          title="Log out from Studio"
          aria-label="Log out from Design Studio"
          style={{
            background: "rgba(220, 53, 69, 0.18)",
            border: "1px solid rgba(220, 53, 69, 0.4)",
            borderRadius: 6,
            color: "#ff6b6b",
            fontSize: "0.72rem",
            cursor: "pointer",
            fontWeight: 700,
            padding: "6px 14px",
            minHeight: 32,
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            touchAction: "manipulation",
            transition: "all 0.15s",
          }}
        >
          <span>🔒</span>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
