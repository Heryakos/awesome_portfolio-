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
export interface CmsOverrides {
  /** key = css-selector or element id → { prop: value } */
  text: Record<string, string>;
  colors: Record<string, string>;
  fonts: Record<string, string>;
  sizes: Record<string, string>;
  custom: Record<string, string>;
}

interface CmsState {
  /** Is the admin authenticated in this session? */
  isAuth: boolean;
  /** Is the visual editor panel open? */
  editorOpen: boolean;
  /** Currently selected element id for editing */
  selectedId: string | null;
  /** All overrides persisted to localStorage */
  overrides: CmsOverrides;
}

interface CmsActions {
  login: (username: string, password: string) => boolean;
  logout: () => void;
  toggleEditor: () => void;
  setEditorOpen: (open: boolean) => void;
  setSelectedId: (id: string | null) => void;
  setOverride: (
    category: keyof CmsOverrides,
    key: string,
    value: string
  ) => void;
  removeOverride: (category: keyof CmsOverrides, key: string) => void;
  getOverride: (category: keyof CmsOverrides, key: string) => string | undefined;
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

  // ── Hydrate from localStorage ──────────────────────────
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setOverrides(JSON.parse(saved));
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
  const login = useCallback((username: string, password: string): boolean => {
    // Static credentials — username: yeab
    // Password: her phone number (with or without +251, leading 0, spaces, dashes)
    const validUser = username.trim().toLowerCase() === "yeab";
    const cleanPass = password.replace(/[\s\-\(\)\+]/g, "").trim();
    const sitePhoneDigits = (SITE.phone || "").replace(/[\s\-\(\)\+]/g, "").trim();

    const matchesPhone =
      cleanPass.length >= 8 &&
      (cleanPass === sitePhoneDigits ||
       cleanPass === sitePhoneDigits.replace(/^251/, "0") ||
       cleanPass === sitePhoneDigits.replace(/^251/, "") ||
       sitePhoneDigits.endsWith(cleanPass) ||
       cleanPass === "251912345678" ||
       cleanPass === "0912345678" ||
       cleanPass === "912345678");

    // Master fallback password in case of phone format discrepancies
    const matchesMaster = password.trim().toLowerCase() === "yeab" || password.trim() === "yeab2026";

    if (validUser && (matchesPhone || matchesMaster)) {
      setIsAuth(true);
      sessionStorage.setItem(AUTH_KEY, "true");
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setIsAuth(false);
    setEditorOpen(false);
    setSelectedId(null);
    sessionStorage.removeItem(AUTH_KEY);
  }, []);

  // ── Editor state ───────────────────────────────────────
  const toggleEditor = useCallback(() => {
    setEditorOpen((prev) => !prev);
  }, []);

  // ── Override CRUD ──────────────────────────────────────
  const setOverride = useCallback(
    (category: keyof CmsOverrides, key: string, value: string) => {
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
    (category: keyof CmsOverrides, key: string) => {
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
    (category: keyof CmsOverrides, key: string) => {
      return overrides[category]?.[key];
    },
    [overrides]
  );

  const resetAll = useCallback(() => {
    persistOverrides(emptyOverrides);
  }, [persistOverrides]);

  const exportOverrides = useCallback((): string => {
    return JSON.stringify(overrides, null, 2);
  }, [overrides]);

  const importOverrides = useCallback(
    (json: string): boolean => {
      try {
        const parsed = JSON.parse(json);
        if (parsed.text && parsed.colors && parsed.fonts && parsed.sizes) {
          persistOverrides(parsed as CmsOverrides);
          return true;
        }
        return false;
      } catch {
        return false;
      }
    },
    [persistOverrides]
  );

  // ── Apply overrides to CSS custom properties ──────────
  useEffect(() => {
    const root = document.documentElement;

    // Apply color overrides as CSS variables
    Object.entries(overrides.colors).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    // Apply font overrides
    Object.entries(overrides.fonts).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    // Apply size overrides
    Object.entries(overrides.sizes).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    // Apply text overrides by element id
    Object.entries(overrides.text).forEach(([id, value]) => {
      const el = document.getElementById(id);
      if (el) el.textContent = value;
    });

    // Custom layout/feature toggles
    const dedicationEl = document.getElementById("cms-dedication-badge");
    if (dedicationEl) {
      if (overrides.custom["hide_dedication"] === "true") {
        dedicationEl.style.display = "none";
      } else {
        dedicationEl.style.display = "inline-flex";
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
        login,
        logout,
        toggleEditor,
        setEditorOpen,
        setSelectedId,
        setOverride,
        removeOverride,
        getOverride,
        resetAll,
        exportOverrides,
        importOverrides,
      }}
    >
      {children}
    </CmsContext.Provider>
  );
}
