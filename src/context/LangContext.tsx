"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";

type Lang = "fr" | "en";

const STORAGE_KEY = "botc-lang-v1";

interface LangContextValue {
  lang: Lang;
  toggle: () => void;
  t: (fr: string, en: string) => string;
}

const LangContext = createContext<LangContextValue | null>(null);

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    if (typeof window === "undefined") return "fr";

    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      return saved === "en" ? "en" : "fr";
    } catch {
      return "fr";
    }
  });

  const toggle = useCallback(() => {
    setLang((l) => (l === "fr" ? "en" : "fr"));
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // Ignore storage failures and keep the app usable.
    }
  }, [lang]);

  const t = useCallback(
    (fr: string, en: string) => (lang === "fr" ? fr : en),
    [lang]
  );

  return (
    <LangContext.Provider value={{ lang, toggle, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within LangProvider");
  return ctx;
}
