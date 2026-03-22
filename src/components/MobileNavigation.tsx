"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Globe, Home, Menu, Skull, Users } from "lucide-react";
import { useLang } from "@/context/LangContext";

const primaryLinks = [
  { href: "/", labelFr: "Accueil", labelEn: "Home", icon: Home },
  { href: "/grimoire", labelFr: "Grimoire", labelEn: "Grimoire", icon: BookOpen },
  { href: "/characters", labelFr: "Rôles", labelEn: "Roles", icon: Users },
  { href: "/rules", labelFr: "Règles", labelEn: "Rules", icon: Skull },
];

const secondaryLinks = [
  { href: "/storyteller", labelFr: "Conteur", labelEn: "Storyteller" },
  { href: "/strategy", labelFr: "Stratégie", labelEn: "Strategy" },
  { href: "/glossary", labelFr: "Glossaire", labelEn: "Glossary" },
];

export default function MobileNavigation() {
  const { lang, toggle, t } = useLang();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const primaryItems = useMemo(
    () =>
      primaryLinks.map((item) => ({
        ...item,
        label: t(item.labelFr, item.labelEn),
      })),
    [t]
  );

  const secondaryItems = useMemo(
    () =>
      secondaryLinks.map((item) => ({
        ...item,
        label: t(item.labelFr, item.labelEn),
      })),
    [t]
  );

  return (
    <>
      <header className="botc-mobile-topbar fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-3 min-h-12">
            <span
              className="flex h-10 w-10 items-center justify-center rounded-full text-base"
              style={{
                background: "radial-gradient(circle, #8B0000 0%, #3d0000 100%)",
                boxShadow: "0 0 15px rgba(139,0,0,0.45)",
                color: "#f4ebd0",
              }}
            >
              ☽
            </span>
            <span className="text-cinzel text-xs font-bold tracking-[0.24em] uppercase" style={{ color: "#c9a84c" }}>
              BOTC
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggle}
              className="botc-mobile-action"
              aria-label={lang === "fr" ? "Switch to English" : "Passer en français"}
            >
              <Globe className="h-4 w-4" />
              <span>{lang === "fr" ? "EN" : "FR"}</span>
            </button>

            <button
              type="button"
              onClick={() => setMenuOpen((value) => !value)}
              className="botc-mobile-action"
              aria-label={t("Ouvrir le menu", "Open menu")}
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="botc-mobile-overlay fixed inset-x-0 top-[calc(env(safe-area-inset-top)+4.5rem)] z-40 px-4">
          <div className="rounded-3xl border px-4 py-4 shadow-2xl" style={{ borderColor: "rgba(201,168,76,0.18)" }}>
            <div className="grid grid-cols-1 gap-2">
              {secondaryItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex min-h-12 items-center justify-between rounded-2xl px-4 text-cinzel text-xs tracking-widest uppercase"
                  style={{ background: "rgba(20,8,13,0.75)", color: "#c9b891" }}
                >
                  <span>{item.label}</span>
                  <span style={{ color: "#8B0000" }}>→</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      <nav className="botc-mobile-bottombar fixed bottom-0 left-0 right-0 z-50 border-t">
        <div className="grid grid-cols-4 gap-1 px-2 py-2">
          {primaryItems.map(({ href, label, icon: Icon }) => {
            const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);

            return (
            <Link
              key={href}
              href={href}
              className="flex min-h-14 flex-col items-center justify-center rounded-2xl text-[10px] font-semibold uppercase tracking-[0.18em]"
              style={{
                color: isActive ? "#f4ebd0" : "#c9b891",
                background: isActive ? "rgba(139,0,0,0.14)" : "transparent",
                border: `1px solid ${isActive ? "rgba(201,168,76,0.16)" : "transparent"}`,
              }}
            >
              <Icon className="mb-1 h-4 w-4" />
              <span>{label}</span>
            </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}