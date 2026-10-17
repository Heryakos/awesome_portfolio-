"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCms } from "@/components/CmsContext";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [shake, setShake] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const cms = useCms();

  useEffect(() => {
    setMounted(true);
    // If already authenticated, redirect to home with editor open
    if (cms.isAuth) {
      cms.setEditorOpen(true);
      router.push("/");
    }
  }, [cms, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password.trim()) {
      setError("Please fill in both fields");
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    const success = cms.login(username, password);
    if (success) {
      cms.setEditorOpen(true);
      router.push("/");
    } else {
      setError("Invalid credentials. Access denied.");
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  if (!mounted) return null;

  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a0a0a",
        padding: "1.25rem 1rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background gradient orbs */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "-20%",
          right: "-10%",
          width: "50vw",
          height: "50vw",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,74,28,0.08) 0%, transparent 70%)",
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: "-15%",
          left: "-10%",
          width: "40vw",
          height: "40vw",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,74,28,0.05) 0%, transparent 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />

      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          maxWidth: 400,
          padding: "2.2rem 1.6rem",
          background: "rgba(18, 18, 18, 0.85)",
          backdropFilter: "blur(24px)",
          borderRadius: 20,
          border: "1px solid rgba(255,255,255,0.06)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,74,28,0.1)",
          animation: shake ? "shakeForm 0.5s ease" : mounted ? "slideUp 0.6s ease" : "none",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Logo / Brand */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "2rem",
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              margin: "0 auto 1rem",
              borderRadius: 16,
              background: "linear-gradient(135deg, #FF4A1C, #FF8A65)",
              display: "grid",
              placeItems: "center",
              fontSize: "1.5rem",
              boxShadow: "0 8px 32px rgba(255,74,28,0.3)",
            }}
          >
            🎨
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display), sans-serif",
              fontWeight: 800,
              fontSize: "1.4rem",
              color: "#fff",
              margin: 0,
              letterSpacing: "-0.01em",
            }}
          >
            Design Studio
          </h1>
          <p
            style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: "0.7rem",
              color: "#666",
              marginTop: 6,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Portfolio Customization Panel
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div
            style={{
              padding: "10px 14px",
              background: "rgba(220,53,69,0.1)",
              border: "1px solid rgba(220,53,69,0.25)",
              borderRadius: 10,
              color: "#ef5350",
              fontSize: "0.75rem",
              fontFamily: "var(--font-mono), monospace",
              marginBottom: "1rem",
              textAlign: "center",
            }}
          >
            🔒 {error}
          </div>
        )}

        {/* Username field */}
        <div style={{ marginBottom: "1rem" }}>
          <label
            htmlFor="admin-username"
            style={{
              display: "block",
              fontFamily: "var(--font-mono), monospace",
              fontSize: "0.65rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#777",
              marginBottom: 6,
            }}
          >
            Username
          </label>
          <input
            id="admin-username"
            type="text"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            style={{
              width: "100%",
              padding: "12px 14px",
              background: "rgba(0,0,0,0.4)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 10,
              color: "#e8e4dc",
              fontFamily: "var(--font-mono), monospace",
              fontSize: "0.85rem",
              outline: "none",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) =>
              (e.target.style.borderColor = "rgba(255,74,28,0.4)")
            }
            onBlur={(e) =>
              (e.target.style.borderColor = "rgba(255,255,255,0.08)")
            }
          />
        </div>

        {/* Password field */}
        <div style={{ marginBottom: "1.5rem" }}>
          <label
            htmlFor="admin-password"
            style={{
              display: "block",
              fontFamily: "var(--font-mono), monospace",
              fontSize: "0.65rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#777",
              marginBottom: 6,
            }}
          >
            Add your password
          </label>
          <div style={{ position: "relative" }}>
            <input
              id="admin-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Add your password"
              style={{
                width: "100%",
                padding: "12px 42px 12px 14px",
                background: "rgba(0,0,0,0.4)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 10,
                color: "#e8e4dc",
                fontFamily: "var(--font-mono), monospace",
                fontSize: "0.85rem",
                outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) =>
                (e.target.style.borderColor = "rgba(255,74,28,0.4)")
              }
              onBlur={(e) =>
                (e.target.style.borderColor = "rgba(255,255,255,0.08)")
              }
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              style={{
                position: "absolute",
                right: 10,
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                color: "#666",
                fontSize: "0.85rem",
                cursor: "pointer",
                padding: 4,
              }}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "14px",
            background: "linear-gradient(135deg, #FF4A1C, #FF6D3F)",
            border: "none",
            borderRadius: 10,
            color: "#fff",
            fontFamily: "var(--font-display), sans-serif",
            fontWeight: 700,
            fontSize: "0.9rem",
            letterSpacing: "0.04em",
            cursor: "pointer",
            boxShadow: "0 4px 24px rgba(255,74,28,0.3)",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLElement).style.transform = "translateY(-1px)";
            (e.target as HTMLElement).style.boxShadow =
              "0 8px 32px rgba(255,74,28,0.4)";
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLElement).style.transform = "translateY(0)";
            (e.target as HTMLElement).style.boxShadow =
              "0 4px 24px rgba(255,74,28,0.3)";
          }}
        >
          Enter Studio →
        </button>

        {/* Back to Portfolio Link */}
        <div style={{ textAlign: "center", marginTop: "1.2rem" }}>
          <Link
            href="/"
            style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: "0.72rem",
              color: "#888",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              transition: "all 0.2s",
              padding: "4px 8px",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = "#FF4A1C";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = "#888";
            }}
          >
            ← Back to Portfolio
          </Link>
        </div>

        {/* Footer */}
        <p
          style={{
            textAlign: "center",
            fontFamily: "var(--font-mono), monospace",
            fontSize: "0.6rem",
            color: "#444",
            marginTop: "1.2rem",
            letterSpacing: "0.08em",
          }}
        >
          🔒 Access restricted to authorized team members
        </p>
      </form>

      {/* Animations */}
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes shakeForm {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }
      `}</style>
    </div>
  );
}
