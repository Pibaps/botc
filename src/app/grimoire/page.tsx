"use client";

import { useLang } from "@/context/LangContext";
import GrimoireClient from "./GrimoireClient";

export default function GrimoirePage() {
  const { t } = useLang();

  return (
    <div style={{ background: "#0a0506", minHeight: "100dvh" }}>
      {/* Header */}
      <div
        className="pt-32 pb-12 px-6 text-center relative overflow-hidden"
        style={{
          background: "radial-gradient(ellipse at 50% 0%, rgba(139,0,0,0.07) 0%, transparent 70%)",
        }}
      >
        <p className="text-xs tracking-widest uppercase text-cinzel mb-4" style={{ color: "#8B0000" }}>
          {t("Outil du Conteur", "Storyteller Tool")}
        </p>
        <h1
          className="text-cinzel font-black mb-4"
          style={{ fontSize: "clamp(1.8rem, 4vw, 3.5rem)", color: "#f4ebd0" }}
        >
          {t("Le Grimoire", "The Grimoire")}
        </h1>
        <p className="text-baskerville max-w-xl mx-auto" style={{ color: "#c9b891" }}>
          {t(
            "Gérez votre partie en temps réel — composition, rôles, états, jetons et journal de jeu.",
            "Manage your game in real time — composition, roles, states, tokens and game journal."
          )}
        </p>
      </div>

      {/* Content */}
      <div className="px-4 md:px-6 pb-24">
        <div className="max-w-3xl mx-auto">
          <GrimoireClient />
        </div>
      </div>
    </div>
  );
}
