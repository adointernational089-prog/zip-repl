import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { THEMES, DEFAULT_THEME_ID, getThemeById, applyTheme, type Theme } from "@/lib/themes";

const STORAGE_KEY = "bishals_hub_theme";

interface ThemeContextType {
  activeTheme: Theme;
  setTheme: (id: string) => Promise<void>;
  themes: Theme[];
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [activeThemeId, setActiveThemeId] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY) ?? DEFAULT_THEME_ID;
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const cached = localStorage.getItem(STORAGE_KEY) ?? DEFAULT_THEME_ID;
    applyTheme(getThemeById(cached));

    fetch("/api/content/theme")
      .then((r) => r.json())
      .then((data: { active?: string }) => {
        const id = data?.active ?? DEFAULT_THEME_ID;
        setActiveThemeId(id);
        localStorage.setItem(STORAGE_KEY, id);
        applyTheme(getThemeById(id));
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const setTheme = useCallback(async (id: string) => {
    const token = localStorage.getItem("bishals_hub_token");
    setActiveThemeId(id);
    localStorage.setItem(STORAGE_KEY, id);
    applyTheme(getThemeById(id));

    await fetch("/api/content/theme", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ active: id }),
    });
  }, []);

  return (
    <ThemeContext.Provider
      value={{ activeTheme: getThemeById(activeThemeId), setTheme, themes: THEMES, isLoading }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
