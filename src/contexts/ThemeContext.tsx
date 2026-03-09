"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export const THEME_STORAGE_KEY = "ulaktech-theme";

export type Theme = "light" | "dark";

function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "light";
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "dark" || stored === "light") return stored;
  } catch {
    // ignore
  }
  return "light";
}

function getThemeFromDom(): Theme {
  if (typeof document === "undefined") return "light";
  const el = document.documentElement;
  if (el.classList.contains("dark")) return "dark";
  if (el.classList.contains("light")) return "light";
  return "light";
}

function applyThemeToDom(theme: Theme, persist: boolean) {
  const doc = document.documentElement;
  doc.classList.remove("light", "dark");
  doc.classList.add(theme);
  if (persist) {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // ignore
    }
  }
}

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  mounted: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = getStoredTheme();
    const fromDom = getThemeFromDom();
    const resolved = stored === "dark" || stored === "light" ? stored : fromDom;
    setThemeState(resolved);
    applyThemeToDom(resolved, false);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const handleStorage = (e: StorageEvent) => {
      if (e.key !== THEME_STORAGE_KEY || e.newValue === null) return;
      if (e.newValue === "dark" || e.newValue === "light") {
        setThemeState(e.newValue);
        applyThemeToDom(e.newValue, false);
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [mounted]);

  const setTheme = useCallback((value: Theme) => {
    setThemeState(value);
    applyThemeToDom(value, true);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next = prev === "light" ? "dark" : "light";
      applyThemeToDom(next, true);
      return next;
    });
  }, []);

  const value: ThemeContextValue = {
    theme: mounted ? theme : "light",
    setTheme,
    toggleTheme,
    mounted,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    return {
      theme: "light" as Theme,
      setTheme: () => {},
      toggleTheme: () => {},
      mounted: false,
    };
  }
  return ctx;
}
