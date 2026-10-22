"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { SITE } from "../../content/site";

// ── Types ──────────────────────────────────────────────────
export interface ProjectItem {
  id?: string;
  slug: string;
  title: string;
  subtitle: string;
  year: string;
  client: string;
  category: string;
  tags: string[];
  heroImage: string;
  deliverables?: string[];
  brief?: string;
}

export interface CertItem {
  id?: string;
  title: string;
  issuer: string;
  date: string;
  credentialUrl?: string;
  image?: string;
}

export interface EffectsState {
  yMaterial?: "obsidian" | "vermilion" | "gold" | "chrome" | "wireframe";
  ySpeed?: number;
  showHearts?: boolean;
}

export interface CmsOverrides {
  text: Record<string, string>;
  colors: Record<string, string>;
  fonts: Record<string, string>;
  sizes: Record<string, string>;
  custom: Record<string, string>;
  hiddenProjects?: string[];
  customProjects?: ProjectItem[];
  hiddenCerts?: string[];
  customCerts?: CertItem[];
  hiddenReviews?: string[];
  customReviews?: any[];
  effects?: EffectsState;
}

interface CmsState {
  isAuth: boolean;
  editorOpen: boolean;
  selectedId: string | null;
  overrides: CmsOverrides;
  toast: string | null;
}

interface CmsActions {
  login: (username: string, password: string) => boolean;
  logout: () => void;
  toggleEditor: () => void;
  setEditorOpen: (open: boolean) => void;
  setSelectedId: (id: string | null) => void;
  showToast: (msg: string) => void;
  setOverride: (
    category: "text" | "colors" | "fonts" | "sizes" | "custom",
    key: string,
    value: string
  ) => void;
  removeOverride: (category: "text" | "colors" | "fonts" | "sizes" | "custom", key: string) => void;
  getOverride: (category: "text" | "colors" | "fonts" | "sizes" | "custom", key: string) => string | undefined;
  toggleProjectVisibility: (slug: string) => void;
  addCustomProject: (project: ProjectItem) => void;
  removeCustomProject: (slug: string) => void;
  toggleCertVisibility: (title: string) => void;
  addCustomCert: (cert: CertItem) => void;
  removeCustomCert: (title: string) => void;
  toggleReviewVisibility: (id: string) => void;
  addCustomReview: (review: any) => void;
  removeCustomReview: (id: string) => void;
  setEffect: <K extends keyof EffectsState>(key: K, value: EffectsState[K]) => void;
  resetAll: () => void;
  exportOverrides: () => string;
  importOverrides: (json: string) => boolean;
}

type CmsContextType = CmsState & CmsActions;

const STORAGE_KEY = "yeab_cms_overrides";
const AUTH_KEY = "yeab_cms_auth";

const emptyOverrides: CmsOverrides = {
  text: {},
  colors: {},
  fonts: {},
  sizes: {},
  custom: {},
  hiddenProjects: [],
  customProjects: [],
  hiddenCerts: [],
  customCerts: [],
  hiddenReviews: [],
  customReviews: [],
  effects: {
    yMaterial: "obsidian",
    ySpeed: 1.0,
    showHearts: false,
  },
};

const CmsContext = createContext<CmsContextType | null>(null);

export function useCms(): CmsContextType {
  const ctx = useContext(CmsContext);
  if (!ctx) throw new Error("useCms must be used inside <CmsProvider>");
  return ctx;
}

/**
 * Wrap the app in <CmsProvider> to enable the visual CMS editor.
 * All overrides are persisted to localStorage so they survive reloads
 * on a static site (Vercel / GitHub Pages).
 */
export function CmsProvider({ children }: { children: ReactNode }) {
  const [isAuth, setIsAuth] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [overrides, setOverrides] = useState<CmsOverrides>(emptyOverrides);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast((prev) => (prev === msg ? null : prev));
    }, 3200);
  }, []);

  // ── Hydrate from localStorage ──────────────────────────
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setOverrides({
          ...emptyOverrides,
          ...parsed,
          effects: { ...emptyOverrides.effects, ...(parsed.effects || {}) },
        });
      }
      const auth = sessionStorage.getItem(AUTH_KEY);
      if (auth === "true") setIsAuth(true);
    } catch {
      /* first visit or private mode */
    }
  }, []);

  // ── Persist overrides to localStorage ──────────────────
  const persistOverrides = useCallback((next: CmsOverrides) => {
    setOverrides(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* quota exceeded — silently fail */
    }
  }, []);

  // ── Auth ────────────────────────────────────────────────
  const login = useCallback(
    (username: string, password: string): boolean => {
      const validUser = username.trim().toLowerCase() === "yeab";
      const cleanPass = password.replace(/[\s\-\(\)\+]/g, "").trim();
      const sitePhoneDigits = (SITE.phone || "").replace(/[\s\-\(\)\+]/g, "").trim();

      const matchesPhone =
        cleanPass.length >= 8 &&
        (cleanPass === sitePhoneDigits ||
          cleanPass === sitePhoneDigits.replace(/^251/, "0") ||
          cleanPass === sitePhoneDigits.replace(/^251/, "") ||
          sitePhoneDigits.endsWith(cleanPass) ||
          cleanPass === "251986267543" ||
          cleanPass === "0986267543" ||
          cleanPass === "986267543");

      const matchesMaster =
        password.trim().toLowerCase() === "yeab" || password.trim() === "yeab2026";

      if (validUser && (matchesPhone || matchesMaster)) {
        setIsAuth(true);
        sessionStorage.setItem(AUTH_KEY, "true");
        showToast("✨ Welcome back, Yeab! Design Studio active.");
        return true;
      }
      return false;
    },
    [showToast]
  );

  const logout = useCallback(() => {
    setIsAuth(false);
    setEditorOpen(false);
    setSelectedId(null);
    sessionStorage.removeItem(AUTH_KEY);
    showToast("🔒 Logged out from Design Studio.");
  }, [showToast]);

  // ── Editor state ───────────────────────────────────────
  const toggleEditor = useCallback(() => {
    setEditorOpen((prev) => !prev);
  }, []);

  // ── Override CRUD ──────────────────────────────────────
  const setOverride = useCallback(
    (category: "text" | "colors" | "fonts" | "sizes" | "custom", key: string, value: string) => {
      setOverrides((prev) => {
        const next = {
          ...prev,
          [category]: { ...prev[category], [key]: value },
        };
        persistOverrides(next);
        return next;
      });
    },
    [persistOverrides]
  );

  const removeOverride = useCallback(
    (category: "text" | "colors" | "fonts" | "sizes" | "custom", key: string) => {
      setOverrides((prev) => {
        const cat = { ...prev[category] };
        delete cat[key];
        const next = { ...prev, [category]: cat };
        persistOverrides(next);
        return next;
      });
    },
    [persistOverrides]
  );

  const getOverride = useCallback(
    (category: "text" | "colors" | "fonts" | "sizes" | "custom", key: string) => {
      return overrides[category]?.[key];
    },
    [overrides]
  );

  // ── Projects visibility and custom projects ─────────────
  const toggleProjectVisibility = useCallback(
    (slug: string) => {
      setOverrides((prev) => {
        const current = prev.hiddenProjects || [];
        const nextHidden = current.includes(slug)
          ? current.filter((s) => s !== slug)
          : [...current, slug];
        const next = { ...prev, hiddenProjects: nextHidden };
        persistOverrides(next);
        return next;
      });
    },
    [persistOverrides]
  );

  const addCustomProject = useCallback(
    (project: ProjectItem) => {
      setOverrides((prev) => {
        const current = prev.customProjects || [];
        const next = { ...prev, customProjects: [project, ...current] };
        persistOverrides(next);
        return next;
      });
      showToast(`✓ Project "${project.title}" added!`);
    },
    [persistOverrides, showToast]
  );

  const removeCustomProject = useCallback(
    (slug: string) => {
      setOverrides((prev) => {
        const current = prev.customProjects || [];
        const next = { ...prev, customProjects: current.filter((p) => p.slug !== slug) };
        persistOverrides(next);
        return next;
      });
      showToast("Project removed.");
    },
    [persistOverrides, showToast]
  );

  // ── Certifications visibility and custom certs ───────────
  const toggleCertVisibility = useCallback(
    (title: string) => {
      setOverrides((prev) => {
        const current = prev.hiddenCerts || [];
        const nextHidden = current.includes(title)
          ? current.filter((t) => t !== title)
          : [...current, title];
        const next = { ...prev, hiddenCerts: nextHidden };
        persistOverrides(next);
        return next;
      });
    },
    [persistOverrides]
  );

  const addCustomCert = useCallback(
    (cert: CertItem) => {
      setOverrides((prev) => {
        const current = prev.customCerts || [];
        const next = { ...prev, customCerts: [cert, ...current] };
        persistOverrides(next);
        return next;
      });
      showToast(`✓ Certificate "${cert.title}" added!`);
    },
    [persistOverrides, showToast]
  );

  const removeCustomCert = useCallback(
    (title: string) => {
      setOverrides((prev) => {
        const current = prev.customCerts || [];
        const next = { ...prev, customCerts: current.filter((c) => c.title !== title) };
        persistOverrides(next);
        return next;
      });
      showToast("Certificate removed.");
    },
    [persistOverrides, showToast]
  );

  // ── Upwork Reviews & Contracts ───────────────────────────
  const toggleReviewVisibility = useCallback(
    (id: string) => {
      setOverrides((prev) => {
        const current = prev.hiddenReviews || [];
        const nextHidden = current.includes(id)
          ? current.filter((rId) => rId !== id)
          : [...current, id];
        const next = { ...prev, hiddenReviews: nextHidden };
        persistOverrides(next);
        return next;
      });
    },
    [persistOverrides]
  );

  const addCustomReview = useCallback(
    (review: any) => {
      setOverrides((prev) => {
        const current = prev.customReviews || [];
        const next = { ...prev, customReviews: [review, ...current] };
        persistOverrides(next);
        return next;
      });
      showToast(`✓ Upwork Contract "${review.title || review.project}" added!`);
    },
    [persistOverrides, showToast]
  );

  const removeCustomReview = useCallback(
    (id: string) => {
      setOverrides((prev) => {
        const current = prev.customReviews || [];
        const next = { ...prev, customReviews: current.filter((r) => r.id !== id) };
        persistOverrides(next);
        return next;
      });
      showToast("Contract removed.");
    },
    [persistOverrides, showToast]
  );

  // ── 3D & FX ─────────────────────────────────────────────
  const setEffect = useCallback(
    <K extends keyof EffectsState>(key: K, value: EffectsState[K]) => {
      setOverrides((prev) => {
        const next = {
          ...prev,
          effects: { ...prev.effects, [key]: value },
        };
        persistOverrides(next);
        return next;
      });
    },
    [persistOverrides]
  );

  const resetAll = useCallback(() => {
    persistOverrides(emptyOverrides);
    showToast("↺ All customizations reset to default.");
  }, [persistOverrides, showToast]);

  const exportOverrides = useCallback((): string => {
    return JSON.stringify(overrides, null, 2);
  }, [overrides]);

  const importOverrides = useCallback(
    (json: string): boolean => {
      try {
        const parsed = JSON.parse(json);
        if (parsed.text && parsed.colors && parsed.fonts && parsed.sizes) {
          persistOverrides({ ...emptyOverrides, ...parsed });
          showToast("✅ Configuration imported successfully!");
          return true;
        }
        return false;
      } catch {
        return false;
      }
    },
    [persistOverrides, showToast]
  );

  // ── Apply overrides to CSS custom properties ──────────
  useEffect(() => {
    const root = document.documentElement;

    Object.entries(overrides.colors).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    Object.entries(overrides.fonts).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    Object.entries(overrides.sizes).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    Object.entries(overrides.text).forEach(([id, value]) => {
      const el = document.getElementById(id);
      if (el) el.textContent = value;
    });

    const dedicationEl = document.getElementById("cms-dedication-badge");
    if (dedicationEl) {
      if (overrides.custom["show_dedication"] === "true") {
        dedicationEl.style.display = "inline-flex";
      } else {
        dedicationEl.style.display = "none";
      }
    }
  }, [overrides]);

  return (
    <CmsContext.Provider
      value={{
        isAuth,
        editorOpen,
        selectedId,
        overrides,
        toast,
        login,
        logout,
        toggleEditor,
        setEditorOpen,
        setSelectedId,
        showToast,
        setOverride,
        removeOverride,
        getOverride,
        toggleProjectVisibility,
        addCustomProject,
        removeCustomProject,
        toggleCertVisibility,
        addCustomCert,
        removeCustomCert,
        toggleReviewVisibility,
        addCustomReview,
        removeCustomReview,
        setEffect,
        resetAll,
        exportOverrides,
        importOverrides,
      }}
    >
      {children}

      {/* Global Toast Notification */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: "fixed",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(18, 18, 18, 0.95)",
            border: "1px solid rgba(255, 74, 28, 0.35)",
            backdropFilter: "blur(16px)",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: "999px",
            fontSize: "0.8rem",
            fontFamily: "var(--font-mono), monospace",
            zIndex: 100020,
            boxShadow: "0 10px 40px rgba(0,0,0,0.6), 0 0 20px rgba(255,74,28,0.2)",
            display: "flex",
            alignItems: "center",
            gap: 8,
            animation: "toastSlide 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <span>{toast}</span>
        </div>
      )}
    </CmsContext.Provider>
  );
}
