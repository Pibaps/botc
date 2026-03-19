"use client";

import { useLang } from "@/context/LangContext";
import { type GamePhase } from "../types";

interface Props {
  phase: GamePhase;
  dayNumber: number;
  nightNumber: number;
  showSecrets: boolean;
  onAdvancePhase: () => void;
  onToggleSecrets: () => void;
  onEndGame: () => void;
}

const phaseInfo: Record<GamePhase, { icon: string; labelEn: string; labelFr: string; color: string }> = {
  setup: { icon: "⚙", labelEn: "Setup", labelFr: "Préparation", color: "#607d8b" },
  night: { icon: "◐", labelEn: "Night", labelFr: "Nuit", color: "#1a237e" },
  day: { icon: "◑", labelEn: "Day", labelFr: "Jour", color: "#c9a84c" },
  end: { icon: "▮", labelEn: "Game Over", labelFr: "Fin de partie", color: "#8B0000" },
};

export default function PhaseControls({
  phase,
  dayNumber,
  nightNumber,
  showSecrets,
  onAdvancePhase,
  onToggleSecrets,
  onEndGame,
}: Props) {
  const { t } = useLang();
  const info = phaseInfo[phase];

  const phaseLabel =
    phase === "night"
      ? `${t("Nuit", "Night")} ${nightNumber}`
      : phase === "day"
        ? `${t("Jour", "Day")} ${dayNumber}`
        : t(info.labelFr, info.labelEn);

  const nextLabel =
    phase === "night"
      ? `◑ ${t("Passer au Jour", "Start Day")}`
      : phase === "day"
        ? `◐ ${t("Passer à la Nuit", "Start Night")}`
        : t("Commencer", "Begin");

  return (
    <div
      className="rounded-xl p-4"
      style={{
        background: "rgba(20,8,13,0.5)",
        border: "1px solid rgba(139,0,0,0.15)",
      }}
    >
      {/* Current phase display */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">{info.icon}</span>
          <span className="text-cinzel font-bold" style={{ color: info.color }}>
            {phaseLabel}
          </span>
        </div>
        <button
          onClick={onToggleSecrets}
          className="px-3 py-1.5 rounded-lg text-cinzel text-xs transition-all duration-200"
          style={{
            background: showSecrets ? "rgba(139,0,0,0.2)" : "rgba(20,8,13,0.4)",
            border: `1px solid ${showSecrets ? "rgba(139,0,0,0.4)" : "rgba(100,100,100,0.15)"}`,
            color: showSecrets ? "#f4ebd0" : "#666",
          }}
        >
          {showSecrets ? "◈" : "●"} {t(showSecrets ? "Secrets visibles" : "Secrets masqués", showSecrets ? "Secrets Visible" : "Secrets Hidden")}
        </button>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        {phase !== "end" && (
          <button
            onClick={onAdvancePhase}
            className="flex-1 py-2.5 rounded-lg text-cinzel text-sm font-semibold tracking-wide transition-all duration-200 hover:scale-[1.01]"
            style={{
              background: "linear-gradient(135deg, rgba(139,0,0,0.3), rgba(139,0,0,0.15))",
              border: "1px solid rgba(139,0,0,0.4)",
              color: "#f4ebd0",
            }}
          >
            {nextLabel}
          </button>
        )}
        <button
          onClick={onEndGame}
          className="px-4 py-2.5 rounded-lg text-cinzel text-sm transition-all duration-200"
          style={{
            background: "rgba(20,8,13,0.5)",
            border: "1px solid rgba(100,100,100,0.2)",
            color: "#8a7a6b",
          }}
        >
          ▮ {t("Fin", "End")}
        </button>
      </div>
    </div>
  );
}
